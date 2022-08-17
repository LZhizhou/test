"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMInput = exports.SECPTransferInput = exports.AmountInput = exports.TransferableInput = exports.SelectInputClass = void 0;
/**
 * @packageDocumentation
 * @module API-EVM-Inputs
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const input_1 = require("../../common/input");
const outputs_1 = require("./outputs");
const bn_js_1 = __importDefault(require("bn.js"));
const credentials_1 = require("../../common/credentials");
const errors_1 = require("../../utils/errors");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
/**
 * Takes a buffer representing the output and returns the proper [[Input]] instance.
 *
 * @param inputID A number representing the inputID parsed prior to the bytes passed in
 *
 * @returns An instance of an [[Input]]-extended class.
 */
const SelectInputClass = (inputID, ...args) => {
    if (inputID === constants_1.EVMConstants.SECPINPUTID) {
        return new SECPTransferInput(...args);
    }
    /* istanbul ignore next */
    throw new errors_1.InputIdError("Error - SelectInputClass: unknown inputID");
};
exports.SelectInputClass = SelectInputClass;
class TransferableInput extends input_1.StandardTransferableInput {
    constructor() {
        super(...arguments);
        this._typeName = "TransferableInput";
        this._typeID = undefined;
        /**
         *
         * Assesses the amount to be paid based on the number of signatures required
         * @returns the amount to be paid
         */
        this.getCost = () => {
            const numSigs = this.getInput().getSigIdxs().length;
            return numSigs * utils_1.Defaults.network[1].AX.costPerSignature;
        };
    }
    //serialize is inherited
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.input = (0, exports.SelectInputClass)(fields["input"]["_typeID"]);
        this.input.deserialize(fields["input"], encoding);
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing a [[TransferableInput]], parses it, populates the class, and returns the length of the [[TransferableInput]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[TransferableInput]]
     *
     * @returns The length of the raw [[TransferableInput]]
     */
    fromBuffer(bytes, offset = 0) {
        this.txid = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.outputidx = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.assetID = bintools.copyFrom(bytes, offset, offset + constants_1.EVMConstants.ASSETIDLEN);
        offset += 32;
        const inputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.input = (0, exports.SelectInputClass)(inputid);
        return this.input.fromBuffer(bytes, offset);
    }
}
exports.TransferableInput = TransferableInput;
class AmountInput extends input_1.StandardAmountInput {
    constructor() {
        super(...arguments);
        this._typeName = "AmountInput";
        this._typeID = undefined;
    }
    //serialize and deserialize both are inherited
    select(id, ...args) {
        return (0, exports.SelectInputClass)(id, ...args);
    }
}
exports.AmountInput = AmountInput;
class SECPTransferInput extends AmountInput {
    constructor() {
        super(...arguments);
        this._typeName = "SECPTransferInput";
        this._typeID = constants_1.EVMConstants.SECPINPUTID;
        this.getCredentialID = () => constants_1.EVMConstants.SECPCREDENTIAL;
    }
    //serialize and deserialize both are inherited
    /**
     * Returns the inputID for this input
     */
    getInputID() {
        return constants_1.EVMConstants.SECPINPUTID;
    }
    create(...args) {
        return new SECPTransferInput(...args);
    }
    clone() {
        const newout = this.create();
        newout.fromBuffer(this.toBuffer());
        return newout;
    }
}
exports.SECPTransferInput = SECPTransferInput;
class EVMInput extends outputs_1.EVMOutput {
    /**
     * An [[EVMInput]] class which contains address, amount, assetID, nonce.
     *
     * @param address is the EVM address from which to transfer funds.
     * @param amount is the amount of the asset to be transferred (specified in nAXC for AXC and the smallest denomination for all other assets).
     * @param assetID The assetID which is being sent as a {@link https://github.com/feross/buffer|Buffer} or as a string.
     * @param nonce A {@link https://github.com/indutny/bn.js/|BN} or a number representing the nonce.
     */
    constructor(address = undefined, amount = undefined, assetID = undefined, nonce = undefined) {
        super(address, amount, assetID);
        this.nonce = buffer_1.Buffer.alloc(8);
        this.nonceValue = new bn_js_1.default(0);
        this.sigCount = buffer_1.Buffer.alloc(4);
        this.sigIdxs = []; // idxs of signers from utxo
        /**
         * Returns the array of [[SigIdx]] for this [[Input]]
         */
        this.getSigIdxs = () => this.sigIdxs;
        /**
         * Creates and adds a [[SigIdx]] to the [[Input]].
         *
         * @param addressIdx The index of the address to reference in the signatures
         * @param address The address of the source of the signature
         */
        this.addSignatureIdx = (addressIdx, address) => {
            const sigidx = new credentials_1.SigIdx();
            const b = buffer_1.Buffer.alloc(4);
            b.writeUInt32BE(addressIdx, 0);
            sigidx.fromBuffer(b);
            sigidx.setSource(address);
            this.sigIdxs.push(sigidx);
            this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
        };
        /**
         * Returns the nonce as a {@link https://github.com/indutny/bn.js/|BN}.
         */
        this.getNonce = () => this.nonceValue.clone();
        this.getCredentialID = () => constants_1.EVMConstants.SECPCREDENTIAL;
        if (typeof nonce !== "undefined") {
            // convert number nonce to BN
            let n;
            if (typeof nonce === "number") {
                n = new bn_js_1.default(nonce);
            }
            else {
                n = nonce;
            }
            this.nonceValue = n.clone();
            this.nonce = bintools.fromBNToBuffer(n, 8);
        }
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[EVMOutput]].
     */
    toBuffer() {
        let superbuff = super.toBuffer();
        let bsize = superbuff.length + this.nonce.length;
        let barr = [superbuff, this.nonce];
        return buffer_1.Buffer.concat(barr, bsize);
    }
    /**
     * Decodes the [[EVMInput]] as a {@link https://github.com/feross/buffer|Buffer} and returns the size.
     *
     * @param bytes The bytes as a {@link https://github.com/feross/buffer|Buffer}.
     * @param offset An offset as a number.
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.nonce = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        return offset;
    }
    /**
     * Returns a base-58 representation of the [[EVMInput]].
     */
    toString() {
        return bintools.bufferToB58(this.toBuffer());
    }
    create(...args) {
        return new EVMInput(...args);
    }
    clone() {
        const newEVMInput = this.create();
        newEVMInput.fromBuffer(this.toBuffer());
        return newEVMInput;
    }
}
exports.EVMInput = EVMInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvZXZtL2lucHV0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxvQ0FBZ0M7QUFDaEMsb0VBQTJDO0FBQzNDLDJDQUEwQztBQUMxQyw4Q0FJMkI7QUFFM0IsdUNBQXFDO0FBQ3JDLGtEQUFzQjtBQUN0QiwwREFBaUQ7QUFDakQsK0NBQWlEO0FBQ2pELHVDQUFzQztBQUV0Qzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQ7Ozs7OztHQU1HO0FBQ0ksTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE9BQWUsRUFBRSxHQUFHLElBQVcsRUFBUyxFQUFFO0lBQ3pFLElBQUksT0FBTyxLQUFLLHdCQUFZLENBQUMsV0FBVyxFQUFFO1FBQ3hDLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO0tBQ3RDO0lBQ0QsMEJBQTBCO0lBQzFCLE1BQU0sSUFBSSxxQkFBWSxDQUFDLDJDQUEyQyxDQUFDLENBQUE7QUFDckUsQ0FBQyxDQUFBO0FBTlksUUFBQSxnQkFBZ0Isb0JBTTVCO0FBRUQsTUFBYSxpQkFBa0IsU0FBUSxpQ0FBeUI7SUFBaEU7O1FBQ1ksY0FBUyxHQUFHLG1CQUFtQixDQUFBO1FBQy9CLFlBQU8sR0FBRyxTQUFTLENBQUE7UUFVN0I7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxHQUFXLEVBQUU7WUFDckIsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQTtZQUMzRCxPQUFPLE9BQU8sR0FBRyxnQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUE7UUFDMUQsQ0FBQyxDQUFBO0lBMkJILENBQUM7SUEzQ0Msd0JBQXdCO0lBRXhC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QUM5QyxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQUcsSUFBVztRQUNuQixPQUFPLElBQUksUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFTLENBQUE7SUFDdEMsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLFdBQVcsR0FBYSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDM0MsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUN2QyxPQUFPLFdBQW1CLENBQUE7SUFDNUIsQ0FBQztDQStCRjtBQXZHRCw0QkF1R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLUVWTS1JbnB1dHNcclxuICovXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IEVWTUNvbnN0YW50cyB9IGZyb20gXCIuL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7XHJcbiAgSW5wdXQsXHJcbiAgU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dCxcclxuICBTdGFuZGFyZEFtb3VudElucHV0XHJcbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9pbnB1dFwiXHJcbmltcG9ydCB7IFNlcmlhbGl6ZWRFbmNvZGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9zZXJpYWxpemF0aW9uXCJcclxuaW1wb3J0IHsgRVZNT3V0cHV0IH0gZnJvbSBcIi4vb3V0cHV0c1wiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBTaWdJZHggfSBmcm9tIFwiLi4vLi4vY29tbW9uL2NyZWRlbnRpYWxzXCJcclxuaW1wb3J0IHsgSW5wdXRJZEVycm9yIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2Vycm9yc1wiXHJcbmltcG9ydCB7IERlZmF1bHRzIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCJcclxuXHJcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqL1xyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcblxyXG4vKipcclxuICogVGFrZXMgYSBidWZmZXIgcmVwcmVzZW50aW5nIHRoZSBvdXRwdXQgYW5kIHJldHVybnMgdGhlIHByb3BlciBbW0lucHV0XV0gaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnB1dElEIEEgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgaW5wdXRJRCBwYXJzZWQgcHJpb3IgdG8gdGhlIGJ5dGVzIHBhc3NlZCBpblxyXG4gKlxyXG4gKiBAcmV0dXJucyBBbiBpbnN0YW5jZSBvZiBhbiBbW0lucHV0XV0tZXh0ZW5kZWQgY2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgU2VsZWN0SW5wdXRDbGFzcyA9IChpbnB1dElEOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKTogSW5wdXQgPT4ge1xyXG4gIGlmIChpbnB1dElEID09PSBFVk1Db25zdGFudHMuU0VDUElOUFVUSUQpIHtcclxuICAgIHJldHVybiBuZXcgU0VDUFRyYW5zZmVySW5wdXQoLi4uYXJncylcclxuICB9XHJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICB0aHJvdyBuZXcgSW5wdXRJZEVycm9yKFwiRXJyb3IgLSBTZWxlY3RJbnB1dENsYXNzOiB1bmtub3duIGlucHV0SURcIilcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zZmVyYWJsZUlucHV0IGV4dGVuZHMgU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dCB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiVHJhbnNmZXJhYmxlSW5wdXRcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIC8vc2VyaWFsaXplIGlzIGluaGVyaXRlZFxyXG5cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICB0aGlzLmlucHV0ID0gU2VsZWN0SW5wdXRDbGFzcyhmaWVsZHNbXCJpbnB1dFwiXVtcIl90eXBlSURcIl0pXHJcbiAgICB0aGlzLmlucHV0LmRlc2VyaWFsaXplKGZpZWxkc1tcImlucHV0XCJdLCBlbmNvZGluZylcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQXNzZXNzZXMgdGhlIGFtb3VudCB0byBiZSBwYWlkIGJhc2VkIG9uIHRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZFxyXG4gICAqIEByZXR1cm5zIHRoZSBhbW91bnQgdG8gYmUgcGFpZFxyXG4gICAqL1xyXG4gIGdldENvc3QgPSAoKTogbnVtYmVyID0+IHtcclxuICAgIGNvbnN0IG51bVNpZ3M6IG51bWJlciA9IHRoaXMuZ2V0SW5wdXQoKS5nZXRTaWdJZHhzKCkubGVuZ3RoXHJcbiAgICByZXR1cm4gbnVtU2lncyAqIERlZmF1bHRzLm5ldHdvcmtbMV0uQVguY29zdFBlclNpZ25hdHVyZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGEgW1tUcmFuc2ZlcmFibGVJbnB1dF1dLCBwYXJzZXMgaXQsIHBvcHVsYXRlcyB0aGUgY2xhc3MsIGFuZCByZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIFtbVHJhbnNmZXJhYmxlSW5wdXRdXSBpbiBieXRlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYSByYXcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgbGVuZ3RoIG9mIHRoZSByYXcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dXHJcbiAgICovXHJcbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gICAgdGhpcy50eGlkID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXHJcbiAgICBvZmZzZXQgKz0gMzJcclxuICAgIHRoaXMub3V0cHV0aWR4ID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgNClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICB0aGlzLmFzc2V0SUQgPSBiaW50b29scy5jb3B5RnJvbShcclxuICAgICAgYnl0ZXMsXHJcbiAgICAgIG9mZnNldCxcclxuICAgICAgb2Zmc2V0ICsgRVZNQ29uc3RhbnRzLkFTU0VUSURMRU5cclxuICAgIClcclxuICAgIG9mZnNldCArPSAzMlxyXG4gICAgY29uc3QgaW5wdXRpZDogbnVtYmVyID0gYmludG9vbHNcclxuICAgICAgLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDQpXHJcbiAgICAgIC5yZWFkVUludDMyQkUoMClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICB0aGlzLmlucHV0ID0gU2VsZWN0SW5wdXRDbGFzcyhpbnB1dGlkKVxyXG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFtb3VudElucHV0IGV4dGVuZHMgU3RhbmRhcmRBbW91bnRJbnB1dCB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiQW1vdW50SW5wdXRcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIC8vc2VyaWFsaXplIGFuZCBkZXNlcmlhbGl6ZSBib3RoIGFyZSBpbmhlcml0ZWRcclxuXHJcbiAgc2VsZWN0KGlkOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKTogSW5wdXQge1xyXG4gICAgcmV0dXJuIFNlbGVjdElucHV0Q2xhc3MoaWQsIC4uLmFyZ3MpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU0VDUFRyYW5zZmVySW5wdXQgZXh0ZW5kcyBBbW91bnRJbnB1dCB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiU0VDUFRyYW5zZmVySW5wdXRcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gRVZNQ29uc3RhbnRzLlNFQ1BJTlBVVElEXHJcblxyXG4gIC8vc2VyaWFsaXplIGFuZCBkZXNlcmlhbGl6ZSBib3RoIGFyZSBpbmhlcml0ZWRcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgaW5wdXRJRCBmb3IgdGhpcyBpbnB1dFxyXG4gICAqL1xyXG4gIGdldElucHV0SUQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBFVk1Db25zdGFudHMuU0VDUElOUFVUSURcclxuICB9XHJcblxyXG4gIGdldENyZWRlbnRpYWxJRCA9ICgpOiBudW1iZXIgPT4gRVZNQ29uc3RhbnRzLlNFQ1BDUkVERU5USUFMXHJcblxyXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBTRUNQVHJhbnNmZXJJbnB1dCguLi5hcmdzKSBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICBjbG9uZSgpOiB0aGlzIHtcclxuICAgIGNvbnN0IG5ld291dDogU0VDUFRyYW5zZmVySW5wdXQgPSB0aGlzLmNyZWF0ZSgpXHJcbiAgICBuZXdvdXQuZnJvbUJ1ZmZlcih0aGlzLnRvQnVmZmVyKCkpXHJcbiAgICByZXR1cm4gbmV3b3V0IGFzIHRoaXNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFVk1JbnB1dCBleHRlbmRzIEVWTU91dHB1dCB7XHJcbiAgcHJvdGVjdGVkIG5vbmNlOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoOClcclxuICBwcm90ZWN0ZWQgbm9uY2VWYWx1ZTogQk4gPSBuZXcgQk4oMClcclxuICBwcm90ZWN0ZWQgc2lnQ291bnQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gIHByb3RlY3RlZCBzaWdJZHhzOiBTaWdJZHhbXSA9IFtdIC8vIGlkeHMgb2Ygc2lnbmVycyBmcm9tIHV0eG9cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgW1tTaWdJZHhdXSBmb3IgdGhpcyBbW0lucHV0XV1cclxuICAgKi9cclxuICBnZXRTaWdJZHhzID0gKCk6IFNpZ0lkeFtdID0+IHRoaXMuc2lnSWR4c1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuZCBhZGRzIGEgW1tTaWdJZHhdXSB0byB0aGUgW1tJbnB1dF1dLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFkZHJlc3NJZHggVGhlIGluZGV4IG9mIHRoZSBhZGRyZXNzIHRvIHJlZmVyZW5jZSBpbiB0aGUgc2lnbmF0dXJlc1xyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBzb3VyY2Ugb2YgdGhlIHNpZ25hdHVyZVxyXG4gICAqL1xyXG4gIGFkZFNpZ25hdHVyZUlkeCA9IChhZGRyZXNzSWR4OiBudW1iZXIsIGFkZHJlc3M6IEJ1ZmZlcikgPT4ge1xyXG4gICAgY29uc3Qgc2lnaWR4OiBTaWdJZHggPSBuZXcgU2lnSWR4KClcclxuICAgIGNvbnN0IGI6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgYi53cml0ZVVJbnQzMkJFKGFkZHJlc3NJZHgsIDApXHJcbiAgICBzaWdpZHguZnJvbUJ1ZmZlcihiKVxyXG4gICAgc2lnaWR4LnNldFNvdXJjZShhZGRyZXNzKVxyXG4gICAgdGhpcy5zaWdJZHhzLnB1c2goc2lnaWR4KVxyXG4gICAgdGhpcy5zaWdDb3VudC53cml0ZVVJbnQzMkJFKHRoaXMuc2lnSWR4cy5sZW5ndGgsIDApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBub25jZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59LlxyXG4gICAqL1xyXG4gIGdldE5vbmNlID0gKCk6IEJOID0+IHRoaXMubm9uY2VWYWx1ZS5jbG9uZSgpXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tFVk1PdXRwdXRdXS5cclxuICAgKi9cclxuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgbGV0IHN1cGVyYnVmZjogQnVmZmVyID0gc3VwZXIudG9CdWZmZXIoKVxyXG4gICAgbGV0IGJzaXplOiBudW1iZXIgPSBzdXBlcmJ1ZmYubGVuZ3RoICsgdGhpcy5ub25jZS5sZW5ndGhcclxuICAgIGxldCBiYXJyOiBCdWZmZXJbXSA9IFtzdXBlcmJ1ZmYsIHRoaXMubm9uY2VdXHJcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChiYXJyLCBic2l6ZSlcclxuICB9XHJcblxyXG4gIGdldENyZWRlbnRpYWxJRCA9ICgpOiBudW1iZXIgPT4gRVZNQ29uc3RhbnRzLlNFQ1BDUkVERU5USUFMXHJcblxyXG4gIC8qKlxyXG4gICAqIERlY29kZXMgdGhlIFtbRVZNSW5wdXRdXSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCByZXR1cm5zIHRoZSBzaXplLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJ5dGVzIFRoZSBieXRlcyBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxyXG4gICAqIEBwYXJhbSBvZmZzZXQgQW4gb2Zmc2V0IGFzIGEgbnVtYmVyLlxyXG4gICAqL1xyXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICAgIG9mZnNldCA9IHN1cGVyLmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcclxuICAgIHRoaXMubm9uY2UgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA4KVxyXG4gICAgb2Zmc2V0ICs9IDhcclxuICAgIHJldHVybiBvZmZzZXRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBiYXNlLTU4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0VWTUlucHV0XV0uXHJcbiAgICovXHJcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBiaW50b29scy5idWZmZXJUb0I1OCh0aGlzLnRvQnVmZmVyKCkpXHJcbiAgfVxyXG5cclxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcclxuICAgIHJldHVybiBuZXcgRVZNSW5wdXQoLi4uYXJncykgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBjb25zdCBuZXdFVk1JbnB1dDogRVZNSW5wdXQgPSB0aGlzLmNyZWF0ZSgpXHJcbiAgICBuZXdFVk1JbnB1dC5mcm9tQnVmZmVyKHRoaXMudG9CdWZmZXIoKSlcclxuICAgIHJldHVybiBuZXdFVk1JbnB1dCBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBbiBbW0VWTUlucHV0XV0gY2xhc3Mgd2hpY2ggY29udGFpbnMgYWRkcmVzcywgYW1vdW50LCBhc3NldElELCBub25jZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIGlzIHRoZSBFVk0gYWRkcmVzcyBmcm9tIHdoaWNoIHRvIHRyYW5zZmVyIGZ1bmRzLlxyXG4gICAqIEBwYXJhbSBhbW91bnQgaXMgdGhlIGFtb3VudCBvZiB0aGUgYXNzZXQgdG8gYmUgdHJhbnNmZXJyZWQgKHNwZWNpZmllZCBpbiBuQVhDIGZvciBBWEMgYW5kIHRoZSBzbWFsbGVzdCBkZW5vbWluYXRpb24gZm9yIGFsbCBvdGhlciBhc3NldHMpLlxyXG4gICAqIEBwYXJhbSBhc3NldElEIFRoZSBhc3NldElEIHdoaWNoIGlzIGJlaW5nIHNlbnQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvciBhcyBhIHN0cmluZy5cclxuICAgKiBAcGFyYW0gbm9uY2UgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSBvciBhIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG5vbmNlLlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgYWRkcmVzczogQnVmZmVyIHwgc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgYW1vdW50OiBCTiB8IG51bWJlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlciB8IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIG5vbmNlOiBCTiB8IG51bWJlciA9IHVuZGVmaW5lZFxyXG4gICkge1xyXG4gICAgc3VwZXIoYWRkcmVzcywgYW1vdW50LCBhc3NldElEKVxyXG5cclxuICAgIGlmICh0eXBlb2Ygbm9uY2UgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgLy8gY29udmVydCBudW1iZXIgbm9uY2UgdG8gQk5cclxuICAgICAgbGV0IG46IEJOXHJcbiAgICAgIGlmICh0eXBlb2Ygbm9uY2UgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBuID0gbmV3IEJOKG5vbmNlKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG4gPSBub25jZVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm5vbmNlVmFsdWUgPSBuLmNsb25lKClcclxuICAgICAgdGhpcy5ub25jZSA9IGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG4sIDgpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==