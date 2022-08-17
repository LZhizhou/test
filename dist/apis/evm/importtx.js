"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-ImportTx
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTx = void 0;
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const outputs_1 = require("./outputs");
const inputs_1 = require("./inputs");
const basetx_1 = require("./basetx");
const credentials_1 = require("./credentials");
const credentials_2 = require("../../common/credentials");
const input_1 = require("../../common/input");
const constants_2 = require("../../utils/constants");
const serialization_1 = require("../../utils/serialization");
const errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned Import transaction.
 */
class ImportTx extends basetx_1.EVMBaseTx {
    /**
     * Class representing an unsigned Import transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param sourceChainID Optional chainID for the source inputs to import. Default Buffer.alloc(32, 16)
     * @param importIns Optional array of [[TransferableInput]]s used in the transaction
     * @param outs Optional array of the [[EVMOutput]]s
     * @param fee Optional the fee as a BN
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), sourceChainID = buffer_1.Buffer.alloc(32, 16), importIns = undefined, outs = undefined, fee = new bn_js_1.default(0)) {
        super(networkID, blockchainID);
        this._typeName = "ImportTx";
        this._typeID = constants_1.EVMConstants.IMPORTTX;
        this.sourceChain = buffer_1.Buffer.alloc(32);
        this.numIns = buffer_1.Buffer.alloc(4);
        this.importIns = [];
        this.numOuts = buffer_1.Buffer.alloc(4);
        this.outs = [];
        this.sourceChain = sourceChainID;
        let inputsPassed = false;
        let outputsPassed = false;
        if (typeof importIns !== "undefined" &&
            Array.isArray(importIns) &&
            importIns.length > 0) {
            importIns.forEach((importIn) => {
                if (!(importIn instanceof inputs_1.TransferableInput)) {
                    throw new errors_1.TransferableInputError("Error - ImportTx.constructor: invalid TransferableInput in array parameter 'importIns'");
                }
            });
            inputsPassed = true;
            this.importIns = importIns;
        }
        if (typeof outs !== "undefined" && Array.isArray(outs) && outs.length > 0) {
            outs.forEach((out) => {
                if (!(out instanceof outputs_1.EVMOutput)) {
                    throw new errors_1.EVMOutputError("Error - ImportTx.constructor: invalid EVMOutput in array parameter 'outs'");
                }
            });
            if (outs.length > 1) {
                outs = outs.sort(outputs_1.EVMOutput.comparator());
            }
            outputsPassed = true;
            this.outs = outs;
        }
        if (inputsPassed && outputsPassed) {
            this.validateOuts(fee);
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { sourceChain: serializer.encoder(this.sourceChain, encoding, "Buffer", "cb58"), importIns: this.importIns.map((i) => i.serialize(encoding)) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.sourceChain = serializer.decoder(fields["sourceChain"], encoding, "cb58", "Buffer", 32);
        this.importIns = fields["importIns"].map((i) => {
            let ii = new inputs_1.TransferableInput();
            ii.deserialize(i, encoding);
            return ii;
        });
        this.numIns = buffer_1.Buffer.alloc(4);
        this.numIns.writeUInt32BE(this.importIns.length, 0);
    }
    /**
     * Returns the id of the [[ImportTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the source chainid.
     */
    getSourceChain() {
        return this.sourceChain;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ImportTx]], parses it,
     * populates the class, and returns the length of the [[ImportTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ImportTx]]
     * @param offset A number representing the byte offset. Defaults to 0.
     *
     * @returns The length of the raw [[ImportTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.sourceChain = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numIns = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const numIns = this.numIns.readUInt32BE(0);
        for (let i = 0; i < numIns; i++) {
            const anIn = new inputs_1.TransferableInput();
            offset = anIn.fromBuffer(bytes, offset);
            this.importIns.push(anIn);
        }
        this.numOuts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const numOuts = this.numOuts.readUInt32BE(0);
        for (let i = 0; i < numOuts; i++) {
            const anOut = new outputs_1.EVMOutput();
            offset = anOut.fromBuffer(bytes, offset);
            this.outs.push(anOut);
        }
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ImportTx]].
     */
    toBuffer() {
        if (typeof this.sourceChain === "undefined") {
            throw new errors_1.ChainIdError("ImportTx.toBuffer -- this.sourceChain is undefined");
        }
        this.numIns.writeUInt32BE(this.importIns.length, 0);
        this.numOuts.writeUInt32BE(this.outs.length, 0);
        let barr = [super.toBuffer(), this.sourceChain, this.numIns];
        let bsize = super.toBuffer().length + this.sourceChain.length + this.numIns.length;
        this.importIns = this.importIns.sort(inputs_1.TransferableInput.comparator());
        this.importIns.forEach((importIn) => {
            bsize += importIn.toBuffer().length;
            barr.push(importIn.toBuffer());
        });
        bsize += this.numOuts.length;
        barr.push(this.numOuts);
        this.outs.forEach((out) => {
            bsize += out.toBuffer().length;
            barr.push(out.toBuffer());
        });
        return buffer_1.Buffer.concat(barr, bsize);
    }
    /**
     * Returns an array of [[TransferableInput]]s in this transaction.
     */
    getImportInputs() {
        return this.importIns;
    }
    /**
     * Returns an array of [[EVMOutput]]s in this transaction.
     */
    getOuts() {
        return this.outs;
    }
    clone() {
        let newImportTx = new ImportTx();
        newImportTx.fromBuffer(this.toBuffer());
        return newImportTx;
    }
    create(...args) {
        return new ImportTx(...args);
    }
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    sign(msg, kc) {
        const creds = super.sign(msg, kc);
        this.importIns.forEach((importIn) => {
            const cred = (0, credentials_1.SelectCredentialClass)(importIn.getInput().getCredentialID());
            const sigidxs = importIn.getInput().getSigIdxs();
            sigidxs.forEach((sigidx) => {
                const keypair = kc.getKey(sigidx.getSource());
                const signval = keypair.sign(msg);
                const sig = new credentials_2.Signature();
                sig.fromBuffer(signval);
                cred.addSignature(sig);
            });
            creds.push(cred);
        });
        return creds;
    }
    validateOuts(fee) {
        // This Map enforces uniqueness of pair(address, assetId) for each EVMOutput.
        // For each imported assetID, each ETH-style AX-Chain address can
        // have exactly 1 EVMOutput.
        // Map(2) {
        //   '0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC' => [
        //     'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
        //     'F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38'
        //   ],
        //   '0xecC3B2968B277b837a81A7181e0b94EB1Ca54EdE' => [
        //     'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
        //     '2Df96yHyhNc3vooieNNhyKwrjEfTsV2ReMo5FKjMpr8vwN4Jqy',
        //     'SfSXBzDb9GZ9R2uH61qZKe8nxQHW9KERW9Kq9WRe4vHJZRN3e'
        //   ]
        // }
        const seenAssetSends = new Map();
        this.outs.forEach((evmOutput) => {
            const address = evmOutput.getAddressString();
            const assetId = bintools.cb58Encode(evmOutput.getAssetID());
            if (seenAssetSends.has(address)) {
                const assetsSentToAddress = seenAssetSends.get(address);
                if (assetsSentToAddress.includes(assetId)) {
                    const errorMessage = `Error - ImportTx: duplicate (address, assetId) pair found in outputs: (0x${address}, ${assetId})`;
                    throw new errors_1.EVMOutputError(errorMessage);
                }
                assetsSentToAddress.push(assetId);
            }
            else {
                seenAssetSends.set(address, [assetId]);
            }
        });
        // make sure this transaction pays the required axc fee
        const selectedNetwork = this.getNetworkID();
        const feeDiff = new bn_js_1.default(0);
        const axcAssetID = constants_2.Defaults.network[`${selectedNetwork}`].Swap.axcAssetID;
        // sum incoming AXC
        this.importIns.forEach((input) => {
            // only check StandardAmountInputs
            if (input.getInput() instanceof input_1.StandardAmountInput &&
                axcAssetID === bintools.cb58Encode(input.getAssetID())) {
                const ui = input.getInput();
                const i = ui;
                feeDiff.iadd(i.getAmount());
            }
        });
        // subtract all outgoing AXC
        this.outs.forEach((evmOutput) => {
            if (axcAssetID === bintools.cb58Encode(evmOutput.getAssetID())) {
                feeDiff.isub(evmOutput.getAmount());
            }
        });
        if (feeDiff.lt(fee)) {
            const errorMessage = `Error - ${fee} nAXC required for fee and only ${feeDiff} nAXC provided`;
            throw new errors_1.EVMFeeError(errorMessage);
        }
    }
}
exports.ImportTx = ImportTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0dHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9ldm0vaW1wb3J0dHgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7Ozs7O0FBRUgsb0NBQWdDO0FBQ2hDLGtEQUFzQjtBQUN0QixvRUFBMkM7QUFDM0MsMkNBQTBDO0FBQzFDLHVDQUFxQztBQUNyQyxxQ0FBNEM7QUFDNUMscUNBQW9DO0FBQ3BDLCtDQUFxRDtBQUNyRCwwREFBd0U7QUFDeEUsOENBQXdEO0FBRXhELHFEQUFrRTtBQUNsRSw2REFBNkU7QUFDN0UsK0NBSzJCO0FBRTNCOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLFVBQVUsR0FBa0IsNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUU3RDs7R0FFRztBQUNILE1BQWEsUUFBUyxTQUFRLGtCQUFTO0lBd0tyQzs7Ozs7Ozs7O09BU0c7SUFDSCxZQUNFLFlBQW9CLDRCQUFnQixFQUNwQyxlQUF1QixlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0MsZ0JBQXdCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUM1QyxZQUFpQyxTQUFTLEVBQzFDLE9BQW9CLFNBQVMsRUFDN0IsTUFBVSxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkIsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQTtRQXpMdEIsY0FBUyxHQUFHLFVBQVUsQ0FBQTtRQUN0QixZQUFPLEdBQUcsd0JBQVksQ0FBQyxRQUFRLENBQUE7UUFpQy9CLGdCQUFXLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN0QyxXQUFNLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxjQUFTLEdBQXdCLEVB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RyxlQUFlLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUE7UUFDeEQsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBd0IsRUFBUSxFQUFFO1lBQ3hELGtDQUFrQztZQUNsQyxJQUNFLEtBQUssQ0FBQyxRQUFRLEVBQUUsWUFBWSwyQkFBbUI7Z0JBQy9DLFVBQVUsS0FBSyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUN0RDtnQkFDQSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFhLENBQUE7Z0JBQ3RDLE1BQU0sQ0FBQyxHQUFHLEVBQXlCLENBQUE7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7YUFDNUI7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQW9CLEVBQVEsRUFBRTtZQUMvQyxJQUFJLFVBQVUsS0FBSyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO2dCQUM5RCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO2FBQ3BDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxZQUFZLEdBQVcsV0FBVyxHQUFHLG1DQUFtQyxPQUFPLGdCQUFnQixDQUFBO1lBQ3JHLE1BQU0sSUFBSSxvQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO1NBQ3BDO0lBQ0gsQ0FBQztDQUNGO0FBMVJELDRCQTBSQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKiBAbW9kdWxlIEFQSS1FVk0tSW1wb3J0VHhcbiAqL1xuXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IHsgRVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcbmltcG9ydCB7IEVWTU91dHB1dCB9IGZyb20gXCIuL291dHB1dHNcIlxuaW1wb3J0IHsgVHJhbnNmZXJhYmxlSW5wdXQgfSBmcm9tIFwiLi9pbnB1dHNcIlxuaW1wb3J0IHsgRVZNQmFzZVR4IH0gZnJvbSBcIi4vYmFzZXR4XCJcbmltcG9ydCB7IFNlbGVjdENyZWRlbnRpYWxDbGFzcyB9IGZyb20gXCIuL2NyZWRlbnRpYWxzXCJcbmltcG9ydCB7IFNpZ25hdHVyZSwgU2lnSWR4LCBDcmVkZW50aWFsIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9jcmVkZW50aWFsc1wiXG5pbXBvcnQgeyBTdGFuZGFyZEFtb3VudElucHV0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9pbnB1dFwiXG5pbXBvcnQgeyBLZXlDaGFpbiwgS2V5UGFpciB9IGZyb20gXCIuL2tleWNoYWluXCJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQsIERlZmF1bHRzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXG5pbXBvcnQge1xuICBDaGFpbklkRXJyb3IsXG4gIFRyYW5zZmVyYWJsZUlucHV0RXJyb3IsXG4gIEVWTU91dHB1dEVycm9yLFxuICBFVk1GZWVFcnJvclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmNvbnN0IHNlcmlhbGl6ZXI6IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgSW1wb3J0IHRyYW5zYWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0VHggZXh0ZW5kcyBFVk1CYXNlVHgge1xuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJJbXBvcnRUeFwiXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gRVZNQ29uc3RhbnRzLklNUE9SVFRYXG5cbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIHNvdXJjZUNoYWluOiBzZXJpYWxpemVyLmVuY29kZXIoXG4gICAgICAgIHRoaXMuc291cmNlQ2hhaW4sXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBcIkJ1ZmZlclwiLFxuICAgICAgICBcImNiNThcIlxuICAgICAgKSxcbiAgICAgIGltcG9ydEluczogdGhpcy5pbXBvcnRJbnMubWFwKChpKSA9PiBpLnNlcmlhbGl6ZShlbmNvZGluZykpXG4gICAgfVxuICB9XG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXG4gICAgdGhpcy5zb3VyY2VDaGFpbiA9IHNlcmlhbGl6ZXIuZGVjb2RlcihcbiAgICAgIGZpZWxkc1tcInNvdXJjZUNoYWluXCJdLFxuICAgICAgZW5jb2RpbmcsXG4gICAgICBcImNiNThcIixcbiAgICAgIFwiQnVmZmVyXCIsXG4gICAgICAzMlxuICAgIClcbiAgICB0aGlzLmltcG9ydElucyA9IGZpZWxkc1tcImltcG9ydEluc1wiXS5tYXAoKGk6IG9iamVjdCkgPT4ge1xuICAgICAgbGV0IGlpOiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dCgpXG4gICAgICBpaS5kZXNlcmlhbGl6ZShpLCBlbmNvZGluZylcbiAgICAgIHJldHVybiBpaVxuICAgIH0pXG4gICAgdGhpcy5udW1JbnMgPSBCdWZmZXIuYWxsb2MoNClcbiAgICB0aGlzLm51bUlucy53cml0ZVVJbnQzMkJFKHRoaXMuaW1wb3J0SW5zLmxlbmd0aCwgMClcbiAgfVxuXG4gIHByb3RlY3RlZCBzb3VyY2VDaGFpbjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxuICBwcm90ZWN0ZWQgbnVtSW5zOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgcHJvdGVjdGVkIGltcG9ydEluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gIHByb3RlY3RlZCBudW1PdXRzOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgcHJvdGVjdGVkIG91dHM6IEVWTU91dHB1dFtdID0gW11cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIFtbSW1wb3J0VHhdXVxuICAgKi9cbiAgZ2V0VHhUeXBlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVJRFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIHNvdXJjZSBjaGFpbmlkLlxuICAgKi9cbiAgZ2V0U291cmNlQ2hhaW4oKTogQnVmZmVyIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2VDaGFpblxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyBhbiBbW0ltcG9ydFR4XV0sIHBhcnNlcyBpdCxcbiAgICogcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgW1tJbXBvcnRUeF1dIGluIGJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gYnl0ZXMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGEgcmF3IFtbSW1wb3J0VHhdXVxuICAgKiBAcGFyYW0gb2Zmc2V0IEEgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgYnl0ZSBvZmZzZXQuIERlZmF1bHRzIHRvIDAuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW0ltcG9ydFR4XV1cbiAgICpcbiAgICogQHJlbWFya3MgYXNzdW1lIG5vdC1jaGVja3N1bW1lZFxuICAgKi9cbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xuICAgIG9mZnNldCA9IHN1cGVyLmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcbiAgICB0aGlzLnNvdXJjZUNoYWluID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXG4gICAgb2Zmc2V0ICs9IDMyXG4gICAgdGhpcy5udW1JbnMgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxuICAgIG9mZnNldCArPSA0XG4gICAgY29uc3QgbnVtSW5zOiBudW1iZXIgPSB0aGlzLm51bUlucy5yZWFkVUludDMyQkUoMClcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbnVtSW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuSW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KClcbiAgICAgIG9mZnNldCA9IGFuSW4uZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxuICAgICAgdGhpcy5pbXBvcnRJbnMucHVzaChhbkluKVxuICAgIH1cbiAgICB0aGlzLm51bU91dHMgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxuICAgIG9mZnNldCArPSA0XG4gICAgY29uc3QgbnVtT3V0czogbnVtYmVyID0gdGhpcy5udW1PdXRzLnJlYWRVSW50MzJCRSgwKVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBudW1PdXRzOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuT3V0OiBFVk1PdXRwdXQgPSBuZXcgRVZNT3V0cHV0KClcbiAgICAgIG9mZnNldCA9IGFuT3V0LmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcbiAgICAgIHRoaXMub3V0cy5wdXNoKGFuT3V0KVxuICAgIH1cbiAgICByZXR1cm4gb2Zmc2V0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0ltcG9ydFR4XV0uXG4gICAqL1xuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zb3VyY2VDaGFpbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IENoYWluSWRFcnJvcihcbiAgICAgICAgXCJJbXBvcnRUeC50b0J1ZmZlciAtLSB0aGlzLnNvdXJjZUNoYWluIGlzIHVuZGVmaW5lZFwiXG4gICAgICApXG4gICAgfVxuICAgIHRoaXMubnVtSW5zLndyaXRlVUludDMyQkUodGhpcy5pbXBvcnRJbnMubGVuZ3RoLCAwKVxuICAgIHRoaXMubnVtT3V0cy53cml0ZVVJbnQzMkJFKHRoaXMub3V0cy5sZW5ndGgsIDApXG4gICAgbGV0IGJhcnI6IEJ1ZmZlcltdID0gW3N1cGVyLnRvQnVmZmVyKCksIHRoaXMuc291cmNlQ2hhaW4sIHRoaXMubnVtSW5zXVxuICAgIGxldCBic2l6ZTogbnVtYmVyID1cbiAgICAgIHN1cGVyLnRvQnVmZmVyKCkubGVuZ3RoICsgdGhpcy5zb3VyY2VDaGFpbi5sZW5ndGggKyB0aGlzLm51bUlucy5sZW5ndGhcbiAgICB0aGlzLmltcG9ydElucyA9IHRoaXMuaW1wb3J0SW5zLnNvcnQoVHJhbnNmZXJhYmxlSW5wdXQuY29tcGFyYXRvcigpKVxuICAgIHRoaXMuaW1wb3J0SW5zLmZvckVhY2goKGltcG9ydEluOiBUcmFuc2ZlcmFibGVJbnB1dCkgPT4ge1xuICAgICAgYnNpemUgKz0gaW1wb3J0SW4udG9CdWZmZXIoKS5sZW5ndGhcbiAgICAgIGJhcnIucHVzaChpbXBvcnRJbi50b0J1ZmZlcigpKVxuICAgIH0pXG4gICAgYnNpemUgKz0gdGhpcy5udW1PdXRzLmxlbmd0aFxuICAgIGJhcnIucHVzaCh0aGlzLm51bU91dHMpXG4gICAgdGhpcy5vdXRzLmZvckVhY2goKG91dDogRVZNT3V0cHV0KSA9PiB7XG4gICAgICBic2l6ZSArPSBvdXQudG9CdWZmZXIoKS5sZW5ndGhcbiAgICAgIGJhcnIucHVzaChvdXQudG9CdWZmZXIoKSlcbiAgICB9KVxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KGJhcnIsIGJzaXplKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcyBpbiB0aGlzIHRyYW5zYWN0aW9uLlxuICAgKi9cbiAgZ2V0SW1wb3J0SW5wdXRzKCk6IFRyYW5zZmVyYWJsZUlucHV0W10ge1xuICAgIHJldHVybiB0aGlzLmltcG9ydEluc1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgW1tFVk1PdXRwdXRdXXMgaW4gdGhpcyB0cmFuc2FjdGlvbi5cbiAgICovXG4gIGdldE91dHMoKTogRVZNT3V0cHV0W10ge1xuICAgIHJldHVybiB0aGlzLm91dHNcbiAgfVxuXG4gIGNsb25lKCk6IHRoaXMge1xuICAgIGxldCBuZXdJbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIG5ld0ltcG9ydFR4LmZyb21CdWZmZXIodGhpcy50b0J1ZmZlcigpKVxuICAgIHJldHVybiBuZXdJbXBvcnRUeCBhcyB0aGlzXG4gIH1cblxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydFR4KC4uLmFyZ3MpIGFzIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgYnl0ZXMgb2YgYW4gW1tVbnNpZ25lZFR4XV0gYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgW1tDcmVkZW50aWFsXV1zXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgQSBCdWZmZXIgZm9yIHRoZSBbW1Vuc2lnbmVkVHhdXVxuICAgKiBAcGFyYW0ga2MgQW4gW1tLZXlDaGFpbl1dIHVzZWQgaW4gc2lnbmluZ1xuICAgKlxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcbiAgICovXG4gIHNpZ24obXNnOiBCdWZmZXIsIGtjOiBLZXlDaGFpbik6IENyZWRlbnRpYWxbXSB7XG4gICAgY29uc3QgY3JlZHM6IENyZWRlbnRpYWxbXSA9IHN1cGVyLnNpZ24obXNnLCBrYylcbiAgICB0aGlzLmltcG9ydElucy5mb3JFYWNoKChpbXBvcnRJbjogVHJhbnNmZXJhYmxlSW5wdXQpID0+IHtcbiAgICAgIGNvbnN0IGNyZWQ6IENyZWRlbnRpYWwgPSBTZWxlY3RDcmVkZW50aWFsQ2xhc3MoXG4gICAgICAgIGltcG9ydEluLmdldElucHV0KCkuZ2V0Q3JlZGVudGlhbElEKClcbiAgICAgIClcbiAgICAgIGNvbnN0IHNpZ2lkeHM6IFNpZ0lkeFtdID0gaW1wb3J0SW4uZ2V0SW5wdXQoKS5nZXRTaWdJZHhzKClcbiAgICAgIHNpZ2lkeHMuZm9yRWFjaCgoc2lnaWR4OiBTaWdJZHgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5cGFpcjogS2V5UGFpciA9IGtjLmdldEtleShzaWdpZHguZ2V0U291cmNlKCkpXG4gICAgICAgIGNvbnN0IHNpZ252YWw6IEJ1ZmZlciA9IGtleXBhaXIuc2lnbihtc2cpXG4gICAgICAgIGNvbnN0IHNpZzogU2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZSgpXG4gICAgICAgIHNpZy5mcm9tQnVmZmVyKHNpZ252YWwpXG4gICAgICAgIGNyZWQuYWRkU2lnbmF0dXJlKHNpZylcbiAgICAgIH0pXG4gICAgICBjcmVkcy5wdXNoKGNyZWQpXG4gICAgfSlcbiAgICByZXR1cm4gY3JlZHNcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgSW1wb3J0IHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE9wdGlvbmFsIG5ldHdvcmtJRCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcbiAgICogQHBhcmFtIHNvdXJjZUNoYWluSUQgT3B0aW9uYWwgY2hhaW5JRCBmb3IgdGhlIHNvdXJjZSBpbnB1dHMgdG8gaW1wb3J0LiBEZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXG4gICAqIEBwYXJhbSBpbXBvcnRJbnMgT3B0aW9uYWwgYXJyYXkgb2YgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcyB1c2VkIGluIHRoZSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0gb3V0cyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tFVk1PdXRwdXRdXXNcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbCB0aGUgZmVlIGFzIGEgQk5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxuICAgIHNvdXJjZUNoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxuICAgIGltcG9ydEluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHVuZGVmaW5lZCxcbiAgICBvdXRzOiBFVk1PdXRwdXRbXSA9IHVuZGVmaW5lZCxcbiAgICBmZWU6IEJOID0gbmV3IEJOKDApXG4gICkge1xuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklEKVxuICAgIHRoaXMuc291cmNlQ2hhaW4gPSBzb3VyY2VDaGFpbklEXG4gICAgbGV0IGlucHV0c1Bhc3NlZDogYm9vbGVhbiA9IGZhbHNlXG4gICAgbGV0IG91dHB1dHNQYXNzZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBpbXBvcnRJbnMgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoaW1wb3J0SW5zKSAmJlxuICAgICAgaW1wb3J0SW5zLmxlbmd0aCA+IDBcbiAgICApIHtcbiAgICAgIGltcG9ydElucy5mb3JFYWNoKChpbXBvcnRJbjogVHJhbnNmZXJhYmxlSW5wdXQpID0+IHtcbiAgICAgICAgaWYgKCEoaW1wb3J0SW4gaW5zdGFuY2VvZiBUcmFuc2ZlcmFibGVJbnB1dCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHJhbnNmZXJhYmxlSW5wdXRFcnJvcihcbiAgICAgICAgICAgIFwiRXJyb3IgLSBJbXBvcnRUeC5jb25zdHJ1Y3RvcjogaW52YWxpZCBUcmFuc2ZlcmFibGVJbnB1dCBpbiBhcnJheSBwYXJhbWV0ZXIgJ2ltcG9ydElucydcIlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGlucHV0c1Bhc3NlZCA9IHRydWVcbiAgICAgIHRoaXMuaW1wb3J0SW5zID0gaW1wb3J0SW5zXG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3V0cyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBcnJheS5pc0FycmF5KG91dHMpICYmIG91dHMubGVuZ3RoID4gMCkge1xuICAgICAgb3V0cy5mb3JFYWNoKChvdXQ6IEVWTU91dHB1dCkgPT4ge1xuICAgICAgICBpZiAoIShvdXQgaW5zdGFuY2VvZiBFVk1PdXRwdXQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVWTU91dHB1dEVycm9yKFxuICAgICAgICAgICAgXCJFcnJvciAtIEltcG9ydFR4LmNvbnN0cnVjdG9yOiBpbnZhbGlkIEVWTU91dHB1dCBpbiBhcnJheSBwYXJhbWV0ZXIgJ291dHMnXCJcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBpZiAob3V0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIG91dHMgPSBvdXRzLnNvcnQoRVZNT3V0cHV0LmNvbXBhcmF0b3IoKSlcbiAgICAgIH1cbiAgICAgIG91dHB1dHNQYXNzZWQgPSB0cnVlXG4gICAgICB0aGlzLm91dHMgPSBvdXRzXG4gICAgfVxuICAgIGlmIChpbnB1dHNQYXNzZWQgJiYgb3V0cHV0c1Bhc3NlZCkge1xuICAgICAgdGhpcy52YWxpZGF0ZU91dHMoZmVlKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVPdXRzKGZlZTogQk4pOiB2b2lkIHtcbiAgICAvLyBUaGlzIE1hcCBlbmZvcmNlcyB1bmlxdWVuZXNzIG9mIHBhaXIoYWRkcmVzcywgYXNzZXRJZCkgZm9yIGVhY2ggRVZNT3V0cHV0LlxuICAgIC8vIEZvciBlYWNoIGltcG9ydGVkIGFzc2V0SUQsIGVhY2ggRVRILXN0eWxlIEFYLUNoYWluIGFkZHJlc3MgY2FuXG4gICAgLy8gaGF2ZSBleGFjdGx5IDEgRVZNT3V0cHV0LlxuICAgIC8vIE1hcCgyKSB7XG4gICAgLy8gICAnMHg4ZGI5N0M3Y0VjRTI0OWMyYjk4YkRDMDIyNkNjNEMyQTU3QkY1MkZDJyA9PiBbXG4gICAgLy8gICAgICdGdndFQWhteEtmZWlHOFNuRXZxNDJoYzZ3aFJ5WTNFRllBdmViTXFETkRHQ2d4TjVaJyxcbiAgICAvLyAgICAgJ0Y0TXlKY1V2cTNSeGJxZ2Q0WnM4c1VwdndMSEFweXJwNHl4SlhlMmJBVjg2VnZwMzgnXG4gICAgLy8gICBdLFxuICAgIC8vICAgJzB4ZWNDM0IyOTY4QjI3N2I4MzdhODFBNzE4MWUwYjk0RUIxQ2E1NEVkRScgPT4gW1xuICAgIC8vICAgICAnRnZ3RUFobXhLZmVpRzhTbkV2cTQyaGM2d2hSeVkzRUZZQXZlYk1xRE5ER0NneE41WicsXG4gICAgLy8gICAgICcyRGY5NnlIeWhOYzN2b29pZU5OaHlLd3JqRWZUc1YyUmVNbzVGS2pNcHI4dndONEpxeScsXG4gICAgLy8gICAgICdTZlNYQnpEYjlHWjlSMnVINjFxWktlOG54UUhXOUtFUlc5S3E5V1JlNHZISlpSTjNlJ1xuICAgIC8vICAgXVxuICAgIC8vIH1cbiAgICBjb25zdCBzZWVuQXNzZXRTZW5kczogTWFwPHN0cmluZywgc3RyaW5nW10+ID0gbmV3IE1hcCgpXG4gICAgdGhpcy5vdXRzLmZvckVhY2goKGV2bU91dHB1dDogRVZNT3V0cHV0KTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBldm1PdXRwdXQuZ2V0QWRkcmVzc1N0cmluZygpXG4gICAgICBjb25zdCBhc3NldElkOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKGV2bU91dHB1dC5nZXRBc3NldElEKCkpXG4gICAgICBpZiAoc2VlbkFzc2V0U2VuZHMuaGFzKGFkZHJlc3MpKSB7XG4gICAgICAgIGNvbnN0IGFzc2V0c1NlbnRUb0FkZHJlc3M6IHN0cmluZ1tdID0gc2VlbkFzc2V0U2VuZHMuZ2V0KGFkZHJlc3MpXG4gICAgICAgIGlmIChhc3NldHNTZW50VG9BZGRyZXNzLmluY2x1ZGVzKGFzc2V0SWQpKSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlOiBzdHJpbmcgPSBgRXJyb3IgLSBJbXBvcnRUeDogZHVwbGljYXRlIChhZGRyZXNzLCBhc3NldElkKSBwYWlyIGZvdW5kIGluIG91dHB1dHM6ICgweCR7YWRkcmVzc30sICR7YXNzZXRJZH0pYFxuICAgICAgICAgIHRocm93IG5ldyBFVk1PdXRwdXRFcnJvcihlcnJvck1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgICAgYXNzZXRzU2VudFRvQWRkcmVzcy5wdXNoKGFzc2V0SWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWVuQXNzZXRTZW5kcy5zZXQoYWRkcmVzcywgW2Fzc2V0SWRdKVxuICAgICAgfVxuICAgIH0pXG4gICAgLy8gbWFrZSBzdXJlIHRoaXMgdHJhbnNhY3Rpb24gcGF5cyB0aGUgcmVxdWlyZWQgYXhjIGZlZVxuICAgIGNvbnN0IHNlbGVjdGVkTmV0d29yazogbnVtYmVyID0gdGhpcy5nZXROZXR3b3JrSUQoKVxuICAgIGNvbnN0IGZlZURpZmY6IEJOID0gbmV3IEJOKDApXG4gICAgY29uc3QgYXhjQXNzZXRJRDogc3RyaW5nID1cbiAgICAgIERlZmF1bHRzLm5ldHdvcmtbYCR7c2VsZWN0ZWROZXR3b3JrfWBdLlN3YXAuYXhjQXNzZXRJRFxuICAgIC8vIHN1bSBpbmNvbWluZyBBWENcbiAgICB0aGlzLmltcG9ydElucy5mb3JFYWNoKChpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQpOiB2b2lkID0+IHtcbiAgICAgIC8vIG9ubHkgY2hlY2sgU3RhbmRhcmRBbW91bnRJbnB1dHNcbiAgICAgIGlmIChcbiAgICAgICAgaW5wdXQuZ2V0SW5wdXQoKSBpbnN0YW5jZW9mIFN0YW5kYXJkQW1vdW50SW5wdXQgJiZcbiAgICAgICAgYXhjQXNzZXRJRCA9PT0gYmludG9vbHMuY2I1OEVuY29kZShpbnB1dC5nZXRBc3NldElEKCkpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdWkgPSBpbnB1dC5nZXRJbnB1dCgpIGFzIHVua25vd25cbiAgICAgICAgY29uc3QgaSA9IHVpIGFzIFN0YW5kYXJkQW1vdW50SW5wdXRcbiAgICAgICAgZmVlRGlmZi5pYWRkKGkuZ2V0QW1vdW50KCkpXG4gICAgICB9XG4gICAgfSlcbiAgICAvLyBzdWJ0cmFjdCBhbGwgb3V0Z29pbmcgQVhDXG4gICAgdGhpcy5vdXRzLmZvckVhY2goKGV2bU91dHB1dDogRVZNT3V0cHV0KTogdm9pZCA9PiB7XG4gICAgICBpZiAoYXhjQXNzZXRJRCA9PT0gYmludG9vbHMuY2I1OEVuY29kZShldm1PdXRwdXQuZ2V0QXNzZXRJRCgpKSkge1xuICAgICAgICBmZWVEaWZmLmlzdWIoZXZtT3V0cHV0LmdldEFtb3VudCgpKVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGZlZURpZmYubHQoZmVlKSkge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlOiBzdHJpbmcgPSBgRXJyb3IgLSAke2ZlZX0gbkFYQyByZXF1aXJlZCBmb3IgZmVlIGFuZCBvbmx5ICR7ZmVlRGlmZn0gbkFYQyBwcm92aWRlZGBcbiAgICAgIHRocm93IG5ldyBFVk1GZWVFcnJvcihlcnJvck1lc3NhZ2UpXG4gICAgfVxuICB9XG59XG4iXX0=