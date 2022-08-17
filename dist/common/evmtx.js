"use strict";
/**
 * @packageDocumentation
 * @module Common-Transactions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMStandardTx = exports.EVMStandardUnsignedTx = exports.EVMStandardBaseTx = void 0;
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const input_1 = require("./input");
const output_1 = require("./output");
const constants_1 = require("../utils/constants");
const serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
/**
 * Class representing a base for all transactions.
 */
class EVMStandardBaseTx extends serialization_1.Serializable {
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     */
    constructor(networkID = constants_1.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16)) {
        super();
        this._typeName = "EVMStandardBaseTx";
        this._typeID = undefined;
        this.networkID = buffer_1.Buffer.alloc(4);
        this.blockchainID = buffer_1.Buffer.alloc(32);
        this.networkID.writeUInt32BE(networkID, 0);
        this.blockchainID = blockchainID;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { networkID: serializer.encoder(this.networkID, encoding, "Buffer", "decimalString"), blockchainID: serializer.encoder(this.blockchainID, encoding, "Buffer", "cb58") });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.networkID = serializer.decoder(fields["networkID"], encoding, "decimalString", "Buffer", 4);
        this.blockchainID = serializer.decoder(fields["blockchainID"], encoding, "cb58", "Buffer", 32);
    }
    /**
     * Returns the NetworkID as a number
     */
    getNetworkID() {
        return this.networkID.readUInt32BE(0);
    }
    /**
     * Returns the Buffer representation of the BlockchainID
     */
    getBlockchainID() {
        return this.blockchainID;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    toBuffer() {
        let bsize = this.networkID.length + this.blockchainID.length;
        const barr = [this.networkID, this.blockchainID];
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Returns a base-58 representation of the [[StandardBaseTx]].
     */
    toString() {
        return bintools.bufferToB58(this.toBuffer());
    }
}
exports.EVMStandardBaseTx = EVMStandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
class EVMStandardUnsignedTx extends serialization_1.Serializable {
    constructor(transaction = undefined, codecID = 0) {
        super();
        this._typeName = "StandardUnsignedTx";
        this._typeID = undefined;
        this.codecID = 0;
        this.codecID = codecID;
        this.transaction = transaction;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { codecID: serializer.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.codecID = serializer.decoder(fields["codecID"], encoding, "decimalString", "number");
    }
    /**
     * Returns the CodecID as a number
     */
    getCodecID() {
        return this.codecID;
    }
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
     */
    getCodecIDBuffer() {
        let codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.codecID, 0);
        return codecBuf;
    }
    /**
     * Returns the inputTotal as a BN
     */
    getInputTotal(assetID) {
        const ins = [];
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        ins.forEach((input) => {
            // only check StandardAmountInputs
            if (input.getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === input.getAssetID().toString("hex")) {
                const i = input.getInput();
                total = total.add(i.getAmount());
            }
        });
        return total;
    }
    /**
     * Returns the outputTotal as a BN
     */
    getOutputTotal(assetID) {
        const outs = [];
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        outs.forEach((out) => {
            // only check StandardAmountOutput
            if (out.getOutput() instanceof output_1.StandardAmountOutput &&
                aIDHex === out.getAssetID().toString("hex")) {
                const output = out.getOutput();
                total = total.add(output.getAmount());
            }
        });
        return total;
    }
    /**
     * Returns the number of burned tokens as a BN
     */
    getBurn(assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    }
    toBuffer() {
        const codecID = this.getCodecIDBuffer();
        const txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        const basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecID, txtype, basebuff], codecID.length + txtype.length + basebuff.length);
    }
}
exports.EVMStandardUnsignedTx = EVMStandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
class EVMStandardTx extends serialization_1.Serializable {
    /**
     * Class representing a signed transaction.
     *
     * @param unsignedTx Optional [[StandardUnsignedTx]]
     * @param signatures Optional array of [[Credential]]s
     */
    constructor(unsignedTx = undefined, credentials = undefined) {
        super();
        this._typeName = "StandardTx";
        this._typeID = undefined;
        this.unsignedTx = undefined;
        this.credentials = [];
        if (typeof unsignedTx !== "undefined") {
            this.unsignedTx = unsignedTx;
            if (typeof credentials !== "undefined") {
                this.credentials = credentials;
            }
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { unsignedTx: this.unsignedTx.serialize(encoding), credentials: this.credentials.map((c) => c.serialize(encoding)) });
    }
    /**
     * Returns the [[StandardUnsignedTx]]
     */
    getUnsignedTx() {
        return this.unsignedTx;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTx]].
     */
    toBuffer() {
        const txbuff = this.unsignedTx.toBuffer();
        let bsize = txbuff.length;
        const credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        const barr = [txbuff, credlen];
        bsize += credlen.length;
        this.credentials.forEach((credential) => {
            const credid = buffer_1.Buffer.alloc(4);
            credid.writeUInt32BE(credential.getCredentialID(), 0);
            barr.push(credid);
            bsize += credid.length;
            const credbuff = credential.toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        });
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Takes a base-58 string containing an [[StandardTx]], parses it, populates the class, and returns the length of the Tx in bytes.
     *
     * @param serialized A base-58 string containing a raw [[StandardTx]]
     *
     * @returns The length of the raw [[StandardTx]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    fromString(serialized) {
        return this.fromBuffer(bintools.cb58Decode(serialized));
    }
    /**
     * Returns a cb58 representation of the [[StandardTx]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    toString() {
        return bintools.cb58Encode(this.toBuffer());
    }
}
exports.EVMStandardTx = EVMStandardTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtdHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL2V2bXR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7OztBQUVILG9DQUFnQztBQUNoQyxpRUFBd0M7QUFFeEMsa0RBQXNCO0FBRXRCLG1DQUF3RTtBQUN4RSxxQ0FBMkU7QUFDM0Usa0RBQXFEO0FBQ3JELDBEQUkrQjtBQUUvQjs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxVQUFVLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFN0Q7O0dBRUc7QUFDSCxNQUFzQixpQkFHcEIsU0FBUSw0QkFBWTtJQXNGcEI7Ozs7Ozs7T0FPRztJQUNILFlBQ0UsWUFBb0IsNEJBQWdCLEVBQ3BDLGVBQXVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUUzQyxLQUFLLEVBQUUsQ0FBQTtRQWpHQyxjQUFTLEdBQUcsbUJBQW1CLENBQUE7UUFDL0IsWUFBTyxHQUFHLFNBQVMsQ0FBQTtRQXVDbkIsY0FBUyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsaUJBQVksR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBeUQvQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7SUFDbEMsQ0FBQztJQWpHRCxTQUFTLENBQUMsV0FBK0IsS0FBSztRQUM1QyxJQUFJLE1BQU0sR0FBVyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzlDLHVDQUNLLE1BQU0sS0FDVCxTQUFTLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FDM0IsSUFBSSxDQUFDLFNBQVMs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QyxDQUFDLENBQUE7UUFDakQsTUFBTSxJQUFJLEdBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDeEMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUU7WUFDbEQsTUFBTSxNQUFNLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2pCLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFBO1lBQ3RCLE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUM5QyxLQUFLLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQTtZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3JCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxJQUFJLEdBQVcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDL0MsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsVUFBVSxDQUFDLFVBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsUUFBUTtRQUNOLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0NBb0JGO0FBbEdELHNDQWtHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBDb21tb24tVHJhbnNhY3Rpb25zXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IHsgQ3JlZGVudGlhbCB9IGZyb20gXCIuL2NyZWRlbnRpYWxzXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCB7IFN0YW5kYXJkS2V5Q2hhaW4sIFN0YW5kYXJkS2V5UGFpciB9IGZyb20gXCIuL2tleWNoYWluXCJcclxuaW1wb3J0IHsgU3RhbmRhcmRBbW91bnRJbnB1dCwgU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dCB9IGZyb20gXCIuL2lucHV0XCJcclxuaW1wb3J0IHsgU3RhbmRhcmRBbW91bnRPdXRwdXQsIFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0IH0gZnJvbSBcIi4vb3V0cHV0XCJcclxuaW1wb3J0IHsgRGVmYXVsdE5ldHdvcmtJRCB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQge1xyXG4gIFNlcmlhbGl6YWJsZSxcclxuICBTZXJpYWxpemF0aW9uLFxyXG4gIFNlcmlhbGl6ZWRFbmNvZGluZ1xyXG59IGZyb20gXCIuLi91dGlscy9zZXJpYWxpemF0aW9uXCJcclxuXHJcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqL1xyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IHNlcmlhbGl6ZXI6IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBiYXNlIGZvciBhbGwgdHJhbnNhY3Rpb25zLlxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVWTVN0YW5kYXJkQmFzZVR4PFxyXG4gIEtQQ2xhc3MgZXh0ZW5kcyBTdGFuZGFyZEtleVBhaXIsXHJcbiAgS0NDbGFzcyBleHRlbmRzIFN0YW5kYXJkS2V5Q2hhaW48S1BDbGFzcz5cclxuPiBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiRVZNU3RhbmRhcmRCYXNlVHhcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIG5ldHdvcmtJRDogc2VyaWFsaXplci5lbmNvZGVyKFxyXG4gICAgICAgIHRoaXMubmV0d29ya0lELFxyXG4gICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgIFwiQnVmZmVyXCIsXHJcbiAgICAgICAgXCJkZWNpbWFsU3RyaW5nXCJcclxuICAgICAgKSxcclxuICAgICAgYmxvY2tjaGFpbklEOiBzZXJpYWxpemVyLmVuY29kZXIoXHJcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluSUQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgICBcImNiNThcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICB0aGlzLm5ldHdvcmtJRCA9IHNlcmlhbGl6ZXIuZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wibmV0d29ya0lEXCJdLFxyXG4gICAgICBlbmNvZGluZyxcclxuICAgICAgXCJkZWNpbWFsU3RyaW5nXCIsXHJcbiAgICAgIFwiQnVmZmVyXCIsXHJcbiAgICAgIDRcclxuICAgIClcclxuICAgIHRoaXMuYmxvY2tjaGFpbklEID0gc2VyaWFsaXplci5kZWNvZGVyKFxyXG4gICAgICBmaWVsZHNbXCJibG9ja2NoYWluSURcIl0sXHJcbiAgICAgIGVuY29kaW5nLFxyXG4gICAgICBcImNiNThcIixcclxuICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgMzJcclxuICAgIClcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBuZXR3b3JrSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gIHByb3RlY3RlZCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXVxyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldFR4VHlwZSgpOiBudW1iZXJcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgTmV0d29ya0lEIGFzIGEgbnVtYmVyXHJcbiAgICovXHJcbiAgZ2V0TmV0d29ya0lEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5uZXR3b3JrSUQucmVhZFVJbnQzMkJFKDApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBCdWZmZXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIEJsb2NrY2hhaW5JRFxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5JRCgpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuYmxvY2tjaGFpbklEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cclxuICAgKi9cclxuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgbGV0IGJzaXplOiBudW1iZXIgPSB0aGlzLm5ldHdvcmtJRC5sZW5ndGggKyB0aGlzLmJsb2NrY2hhaW5JRC5sZW5ndGhcclxuICAgIGNvbnN0IGJhcnI6IEJ1ZmZlcltdID0gW3RoaXMubmV0d29ya0lELCB0aGlzLmJsb2NrY2hhaW5JRF1cclxuICAgIGNvbnN0IGJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoYmFyciwgYnNpemUpXHJcbiAgICByZXR1cm4gYnVmZlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGJhc2UtNTggcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cclxuICAgKi9cclxuICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmJ1ZmZlclRvQjU4KHRoaXMudG9CdWZmZXIoKSlcclxuICB9XHJcblxyXG4gIGFic3RyYWN0IGNsb25lKCk6IHRoaXNcclxuXHJcbiAgYWJzdHJhY3QgY3JlYXRlKC4uLmFyZ3M6IGFueVtdKTogdGhpc1xyXG5cclxuICBhYnN0cmFjdCBzZWxlY3QoaWQ6IG51bWJlciwgLi4uYXJnczogYW55W10pOiB0aGlzXHJcblxyXG4gIC8qKlxyXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhIFN0YW5kYXJkQmFzZVR4IHdoaWNoIGlzIHRoZSBmb3VuZGF0aW9uIGZvciBhbGwgdHJhbnNhY3Rpb25zLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBPcHRpb25hbCBuZXR3b3JrSUQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcclxuICAgKiBAcGFyYW0gb3V0cyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXNcclxuICAgKiBAcGFyYW0gaW5zIE9wdGlvbmFsIGFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZUlucHV0XV1zXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpXHJcbiAgKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLm5ldHdvcmtJRC53cml0ZVVJbnQzMkJFKG5ldHdvcmtJRCwgMClcclxuICAgIHRoaXMuYmxvY2tjaGFpbklEID0gYmxvY2tjaGFpbklEXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVWTVN0YW5kYXJkVW5zaWduZWRUeDxcclxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxyXG4gIEtDQ2xhc3MgZXh0ZW5kcyBTdGFuZGFyZEtleUNoYWluPEtQQ2xhc3M+LFxyXG4gIFNCVHggZXh0ZW5kcyBFVk1TdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPlxyXG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZFVuc2lnbmVkVHhcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIGNvZGVjSUQ6IHNlcmlhbGl6ZXIuZW5jb2RlcihcclxuICAgICAgICB0aGlzLmNvZGVjSUQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJudW1iZXJcIixcclxuICAgICAgICBcImRlY2ltYWxTdHJpbmdcIixcclxuICAgICAgICAyXHJcbiAgICAgICksXHJcbiAgICAgIHRyYW5zYWN0aW9uOiB0aGlzLnRyYW5zYWN0aW9uLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xyXG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcclxuICAgIHRoaXMuY29kZWNJRCA9IHNlcmlhbGl6ZXIuZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wiY29kZWNJRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICBcIm51bWJlclwiXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgY29kZWNJRDogbnVtYmVyID0gMFxyXG4gIHByb3RlY3RlZCB0cmFuc2FjdGlvbjogU0JUeFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBDb2RlY0lEIGFzIGEgbnVtYmVyXHJcbiAgICovXHJcbiAgZ2V0Q29kZWNJRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuY29kZWNJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIENvZGVjSURcclxuICAgKi9cclxuICBnZXRDb2RlY0lEQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBsZXQgY29kZWNCdWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygyKVxyXG4gICAgY29kZWNCdWYud3JpdGVVSW50MTZCRSh0aGlzLmNvZGVjSUQsIDApXHJcbiAgICByZXR1cm4gY29kZWNCdWZcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGlucHV0VG90YWwgYXMgYSBCTlxyXG4gICAqL1xyXG4gIGdldElucHV0VG90YWwoYXNzZXRJRDogQnVmZmVyKTogQk4ge1xyXG4gICAgY29uc3QgaW5zOiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgY29uc3QgYUlESGV4OiBzdHJpbmcgPSBhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICBsZXQgdG90YWw6IEJOID0gbmV3IEJOKDApXHJcbiAgICBpbnMuZm9yRWFjaCgoaW5wdXQ6IFN0YW5kYXJkVHJhbnNmZXJhYmxlSW5wdXQpID0+IHtcclxuICAgICAgLy8gb25seSBjaGVjayBTdGFuZGFyZEFtb3VudElucHV0c1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaW5wdXQuZ2V0SW5wdXQoKSBpbnN0YW5jZW9mIFN0YW5kYXJkQW1vdW50SW5wdXQgJiZcclxuICAgICAgICBhSURIZXggPT09IGlucHV0LmdldEFzc2V0SUQoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBpID0gaW5wdXQuZ2V0SW5wdXQoKSBhcyBTdGFuZGFyZEFtb3VudElucHV0XHJcbiAgICAgICAgdG90YWwgPSB0b3RhbC5hZGQoaS5nZXRBbW91bnQoKSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0b3RhbFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgb3V0cHV0VG90YWwgYXMgYSBCTlxyXG4gICAqL1xyXG4gIGdldE91dHB1dFRvdGFsKGFzc2V0SUQ6IEJ1ZmZlcik6IEJOIHtcclxuICAgIGNvbnN0IG91dHM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gICAgY29uc3QgYUlESGV4OiBzdHJpbmcgPSBhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICBsZXQgdG90YWw6IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgb3V0cy5mb3JFYWNoKChvdXQ6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0KSA9PiB7XHJcbiAgICAgIC8vIG9ubHkgY2hlY2sgU3RhbmRhcmRBbW91bnRPdXRwdXRcclxuICAgICAgaWYgKFxyXG4gICAgICAgIG91dC5nZXRPdXRwdXQoKSBpbnN0YW5jZW9mIFN0YW5kYXJkQW1vdW50T3V0cHV0ICYmXHJcbiAgICAgICAgYUlESGV4ID09PSBvdXQuZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dDogU3RhbmRhcmRBbW91bnRPdXRwdXQgPVxyXG4gICAgICAgICAgb3V0LmdldE91dHB1dCgpIGFzIFN0YW5kYXJkQW1vdW50T3V0cHV0XHJcbiAgICAgICAgdG90YWwgPSB0b3RhbC5hZGQob3V0cHV0LmdldEFtb3VudCgpKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRvdGFsXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgYnVybmVkIHRva2VucyBhcyBhIEJOXHJcbiAgICovXHJcbiAgZ2V0QnVybihhc3NldElEOiBCdWZmZXIpOiBCTiB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJbnB1dFRvdGFsKGFzc2V0SUQpLnN1Yih0aGlzLmdldE91dHB1dFRvdGFsKGFzc2V0SUQpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgVHJhbnNhY3Rpb25cclxuICAgKi9cclxuICBhYnN0cmFjdCBnZXRUcmFuc2FjdGlvbigpOiBTQlR4XHJcblxyXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXHJcblxyXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBjb25zdCBjb2RlY0lEOiBCdWZmZXIgPSB0aGlzLmdldENvZGVjSURCdWZmZXIoKVxyXG4gICAgY29uc3QgdHh0eXBlOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIHR4dHlwZS53cml0ZVVJbnQzMkJFKHRoaXMudHJhbnNhY3Rpb24uZ2V0VHhUeXBlKCksIDApXHJcbiAgICBjb25zdCBiYXNlYnVmZjogQnVmZmVyID0gdGhpcy50cmFuc2FjdGlvbi50b0J1ZmZlcigpXHJcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChcclxuICAgICAgW2NvZGVjSUQsIHR4dHlwZSwgYmFzZWJ1ZmZdLFxyXG4gICAgICBjb2RlY0lELmxlbmd0aCArIHR4dHlwZS5sZW5ndGggKyBiYXNlYnVmZi5sZW5ndGhcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ25zIHRoaXMgW1tVbnNpZ25lZFR4XV0gYW5kIHJldHVybnMgc2lnbmVkIFtbU3RhbmRhcmRUeF1dXHJcbiAgICpcclxuICAgKiBAcGFyYW0ga2MgQW4gW1tLZXlDaGFpbl1dIHVzZWQgaW4gc2lnbmluZ1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBzaWduZWQgW1tTdGFuZGFyZFR4XV1cclxuICAgKi9cclxuICBhYnN0cmFjdCBzaWduKFxyXG4gICAga2M6IEtDQ2xhc3NcclxuICApOiBFVk1TdGFuZGFyZFR4PFxyXG4gICAgS1BDbGFzcyxcclxuICAgIEtDQ2xhc3MsXHJcbiAgICBFVk1TdGFuZGFyZFVuc2lnbmVkVHg8S1BDbGFzcywgS0NDbGFzcywgU0JUeD5cclxuICA+XHJcblxyXG4gIGNvbnN0cnVjdG9yKHRyYW5zYWN0aW9uOiBTQlR4ID0gdW5kZWZpbmVkLCBjb2RlY0lEOiBudW1iZXIgPSAwKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLmNvZGVjSUQgPSBjb2RlY0lEXHJcbiAgICB0aGlzLnRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzaWduZWQgdHJhbnNhY3Rpb24uXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRVZNU3RhbmRhcmRUeDxcclxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxyXG4gIEtDQ2xhc3MgZXh0ZW5kcyBTdGFuZGFyZEtleUNoYWluPEtQQ2xhc3M+LFxyXG4gIFNVQlR4IGV4dGVuZHMgRVZNU3RhbmRhcmRVbnNpZ25lZFR4PFxyXG4gICAgS1BDbGFzcyxcclxuICAgIEtDQ2xhc3MsXHJcbiAgICBFVk1TdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPlxyXG4gID5cclxuPiBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiU3RhbmRhcmRUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcclxuXHJcbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcclxuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLmZpZWxkcyxcclxuICAgICAgdW5zaWduZWRUeDogdGhpcy51bnNpZ25lZFR4LnNlcmlhbGl6ZShlbmNvZGluZyksXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB0aGlzLmNyZWRlbnRpYWxzLm1hcCgoYykgPT4gYy5zZXJpYWxpemUoZW5jb2RpbmcpKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHVuc2lnbmVkVHg6IFNVQlR4ID0gdW5kZWZpbmVkXHJcbiAgcHJvdGVjdGVkIGNyZWRlbnRpYWxzOiBDcmVkZW50aWFsW10gPSBbXVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBbW1N0YW5kYXJkVW5zaWduZWRUeF1dXHJcbiAgICovXHJcbiAgZ2V0VW5zaWduZWRUeCgpOiBTVUJUeCB7XHJcbiAgICByZXR1cm4gdGhpcy51bnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICBhYnN0cmFjdCBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldD86IG51bWJlcik6IG51bWJlclxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRUeF1dLlxyXG4gICAqL1xyXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBjb25zdCB0eGJ1ZmY6IEJ1ZmZlciA9IHRoaXMudW5zaWduZWRUeC50b0J1ZmZlcigpXHJcbiAgICBsZXQgYnNpemU6IG51bWJlciA9IHR4YnVmZi5sZW5ndGhcclxuICAgIGNvbnN0IGNyZWRsZW46IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgY3JlZGxlbi53cml0ZVVJbnQzMkJFKHRoaXMuY3JlZGVudGlhbHMubGVuZ3RoLCAwKVxyXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbdHhidWZmLCBjcmVkbGVuXVxyXG4gICAgYnNpemUgKz0gY3JlZGxlbi5sZW5ndGhcclxuICAgIHRoaXMuY3JlZGVudGlhbHMuZm9yRWFjaCgoY3JlZGVudGlhbDogQ3JlZGVudGlhbCkgPT4ge1xyXG4gICAgICBjb25zdCBjcmVkaWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgICBjcmVkaWQud3JpdGVVSW50MzJCRShjcmVkZW50aWFsLmdldENyZWRlbnRpYWxJRCgpLCAwKVxyXG4gICAgICBiYXJyLnB1c2goY3JlZGlkKVxyXG4gICAgICBic2l6ZSArPSBjcmVkaWQubGVuZ3RoXHJcbiAgICAgIGNvbnN0IGNyZWRidWZmOiBCdWZmZXIgPSBjcmVkZW50aWFsLnRvQnVmZmVyKClcclxuICAgICAgYnNpemUgKz0gY3JlZGJ1ZmYubGVuZ3RoXHJcbiAgICAgIGJhcnIucHVzaChjcmVkYnVmZilcclxuICAgIH0pXHJcbiAgICBjb25zdCBidWZmOiBCdWZmZXIgPSBCdWZmZXIuY29uY2F0KGJhcnIsIGJzaXplKVxyXG4gICAgcmV0dXJuIGJ1ZmZcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgYmFzZS01OCBzdHJpbmcgY29udGFpbmluZyBhbiBbW1N0YW5kYXJkVHhdXSwgcGFyc2VzIGl0LCBwb3B1bGF0ZXMgdGhlIGNsYXNzLCBhbmQgcmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBUeCBpbiBieXRlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZXJpYWxpemVkIEEgYmFzZS01OCBzdHJpbmcgY29udGFpbmluZyBhIHJhdyBbW1N0YW5kYXJkVHhdXVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbU3RhbmRhcmRUeF1dXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIHVubGlrZSBtb3N0IGZyb21TdHJpbmdzLCBpdCBleHBlY3RzIHRoZSBzdHJpbmcgdG8gYmUgc2VyaWFsaXplZCBpbiBjYjU4IGZvcm1hdFxyXG4gICAqL1xyXG4gIGZyb21TdHJpbmcoc2VyaWFsaXplZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLmZyb21CdWZmZXIoYmludG9vbHMuY2I1OERlY29kZShzZXJpYWxpemVkKSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBjYjU4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW1N0YW5kYXJkVHhdXS5cclxuICAgKlxyXG4gICAqIEByZW1hcmtzXHJcbiAgICogdW5saWtlIG1vc3QgdG9TdHJpbmdzLCB0aGlzIHJldHVybnMgaW4gY2I1OCBzZXJpYWxpemF0aW9uIGZvcm1hdFxyXG4gICAqL1xyXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuY2I1OEVuY29kZSh0aGlzLnRvQnVmZmVyKCkpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzaWduZWQgdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdW5zaWduZWRUeCBPcHRpb25hbCBbW1N0YW5kYXJkVW5zaWduZWRUeF1dXHJcbiAgICogQHBhcmFtIHNpZ25hdHVyZXMgT3B0aW9uYWwgYXJyYXkgb2YgW1tDcmVkZW50aWFsXV1zXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB1bnNpZ25lZFR4OiBTVUJUeCA9IHVuZGVmaW5lZCxcclxuICAgIGNyZWRlbnRpYWxzOiBDcmVkZW50aWFsW10gPSB1bmRlZmluZWRcclxuICApIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmICh0eXBlb2YgdW5zaWduZWRUeCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLnVuc2lnbmVkVHggPSB1bnNpZ25lZFR4XHJcbiAgICAgIGlmICh0eXBlb2YgY3JlZGVudGlhbHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICB0aGlzLmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=