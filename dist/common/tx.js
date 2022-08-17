"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardTx = exports.StandardUnsignedTx = exports.StandardBaseTx = void 0;
/**
 * @packageDocumentation
 * @module Common-Transactions
 */
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
const serialization = serialization_1.Serialization.getInstance();
const cb58 = "cb58";
const hex = "hex";
const decimalString = "decimalString";
const buffer = "Buffer";
/**
 * Class representing a base for all transactions.
 */
class StandardBaseTx extends serialization_1.Serializable {
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     */
    constructor(networkID = constants_1.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined) {
        super();
        this._typeName = "StandardBaseTx";
        this._typeID = undefined;
        this.networkID = buffer_1.Buffer.alloc(4);
        this.blockchainID = buffer_1.Buffer.alloc(32);
        this.numouts = buffer_1.Buffer.alloc(4);
        this.numins = buffer_1.Buffer.alloc(4);
        this.memo = buffer_1.Buffer.alloc(0);
        this.networkID.writeUInt32BE(networkID, 0);
        this.blockchainID = blockchainID;
        if (typeof memo != "undefined") {
            this.memo = memo;
        }
        if (typeof ins !== "undefined" && typeof outs !== "undefined") {
            this.numouts.writeUInt32BE(outs.length, 0);
            this.outs = outs.sort(output_1.StandardTransferableOutput.comparator());
            this.numins.writeUInt32BE(ins.length, 0);
            this.ins = ins.sort(input_1.StandardTransferableInput.comparator());
        }
    }
    serialize(encoding = "hex") {
        const fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { networkID: serialization.encoder(this.networkID, encoding, buffer, decimalString), blockchainID: serialization.encoder(this.blockchainID, encoding, buffer, cb58), outs: this.outs.map((o) => o.serialize(encoding)), ins: this.ins.map((i) => i.serialize(encoding)), memo: serialization.encoder(this.memo, encoding, buffer, hex) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.networkID = serialization.decoder(fields["networkID"], encoding, decimalString, buffer, 4);
        this.blockchainID = serialization.decoder(fields["blockchainID"], encoding, cb58, buffer, 32);
        this.memo = serialization.decoder(fields["memo"], encoding, hex, buffer);
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
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the memo
     */
    getMemo() {
        return this.memo;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    toBuffer() {
        this.outs.sort(output_1.StandardTransferableOutput.comparator());
        this.ins.sort(input_1.StandardTransferableInput.comparator());
        this.numouts.writeUInt32BE(this.outs.length, 0);
        this.numins.writeUInt32BE(this.ins.length, 0);
        let bsize = this.networkID.length + this.blockchainID.length + this.numouts.length;
        const barr = [this.networkID, this.blockchainID, this.numouts];
        for (let i = 0; i < this.outs.length; i++) {
            const b = this.outs[`${i}`].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        barr.push(this.numins);
        bsize += this.numins.length;
        for (let i = 0; i < this.ins.length; i++) {
            const b = this.ins[`${i}`].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        let memolen = buffer_1.Buffer.alloc(4);
        memolen.writeUInt32BE(this.memo.length, 0);
        barr.push(memolen);
        bsize += 4;
        barr.push(this.memo);
        bsize += this.memo.length;
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
exports.StandardBaseTx = StandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
class StandardUnsignedTx extends serialization_1.Serializable {
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
        return Object.assign(Object.assign({}, fields), { codecID: serialization.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.codecID = serialization.decoder(fields["codecID"], encoding, "decimalString", "number");
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
        const ins = this.getTransaction().getIns();
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        for (let i = 0; i < ins.length; i++) {
            // only check StandardAmountInputs
            if (ins[`${i}`].getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === ins[`${i}`].getAssetID().toString("hex")) {
                const input = ins[`${i}`].getInput();
                total = total.add(input.getAmount());
            }
        }
        return total;
    }
    /**
     * Returns the outputTotal as a BN
     */
    getOutputTotal(assetID) {
        const outs = this.getTransaction().getTotalOuts();
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        for (let i = 0; i < outs.length; i++) {
            // only check StandardAmountOutput
            if (outs[`${i}`].getOutput() instanceof output_1.StandardAmountOutput &&
                aIDHex === outs[`${i}`].getAssetID().toString("hex")) {
                const output = outs[`${i}`].getOutput();
                total = total.add(output.getAmount());
            }
        }
        return total;
    }
    /**
     * Returns the number of burned tokens as a BN
     */
    getBurn(assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    }
    toBuffer() {
        const codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.transaction.getCodecID(), 0);
        const txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        const basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecBuf, txtype, basebuff], codecBuf.length + txtype.length + basebuff.length);
    }
}
exports.StandardUnsignedTx = StandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
class StandardTx extends serialization_1.Serializable {
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
     * Returns the [[Credential[]]]
     */
    getCredentials() {
        return this.credentials;
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
        const tx = this.unsignedTx.getTransaction();
        const codecID = tx.getCodecID();
        const txbuff = this.unsignedTx.toBuffer();
        let bsize = txbuff.length;
        const credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        const barr = [txbuff, credlen];
        bsize += credlen.length;
        for (let i = 0; i < this.credentials.length; i++) {
            this.credentials[`${i}`].setCodecID(codecID);
            const credID = buffer_1.Buffer.alloc(4);
            credID.writeUInt32BE(this.credentials[`${i}`].getCredentialID(), 0);
            barr.push(credID);
            bsize += credID.length;
            const credbuff = this.credentials[`${i}`].toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        }
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
exports.StandardTx = StandardTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL3R4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxpRUFBd0M7QUFFeEMsa0RBQXNCO0FBRXRCLG1DQUF3RTtBQUN4RSxxQ0FBMkU7QUFDM0Usa0RBQXFEO0FBQ3JELDBEQUsrQjtBQUUvQjs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEUsTUFBTSxJQUFJLEdBQW1CLE1BQU0sQ0FBQTtBQUNuQyxNQUFNLEdBQUcsR0FBbUIsS0FBSyxDQUFBO0FBQ2pDLE1BQU0sYUFBYSxHQUFtQixlQUFlLENBQUE7QUFDckQsTUFBTSxNQUFNLEdBQW1CLFFBQVEsQ0FBQTtBQUV2Qzs7R0FFRztBQUNILE1BQXNCLGNBR3BCLFNBQVEsNEJBQVk7SUFzSnBCOzs7Ozs7OztPQVFHO0lBQ0gsWUFDRSxZQUFvQiw0QkFBZ0IsRUFDcEMsZUFBdUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNDLE9BQXFDLFNBQVMsRUFDOUMsTUFBbUMsU0FBUyxFQUM1QyxPQUFlLFNBQVM7UUFFeEIsS0FBSyxFQUFFLENBQUE7UUFyS0MsY0FBUyxHQUFHLGdCQUFnQixDQUFBO1FBQzVCLFlBQU8sR0FBRyxTQUFTLENBQUE7UUEyQ25CLGNBQVMsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25DLGlCQUFZLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN2QyxZQUFPLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVqQyxXQUFNLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxD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Q0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDcEI7UUFDRCxNQUFNLElBQUksR0FBVyxlQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMvQyxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxVQUFVLENBQUMsVUFBa0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxRQUFRO1FBQ04sT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQzdDLENBQUM7Q0FvQkY7QUE3R0QsZ0NBNkdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIENvbW1vbi1UcmFuc2FjdGlvbnNcclxuICovXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IENyZWRlbnRpYWwgfSBmcm9tIFwiLi9jcmVkZW50aWFsc1wiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBTdGFuZGFyZEtleUNoYWluLCBTdGFuZGFyZEtleVBhaXIgfSBmcm9tIFwiLi9rZXljaGFpblwiXHJcbmltcG9ydCB7IFN0YW5kYXJkQW1vdW50SW5wdXQsIFN0YW5kYXJkVHJhbnNmZXJhYmxlSW5wdXQgfSBmcm9tIFwiLi9pbnB1dFwiXHJcbmltcG9ydCB7IFN0YW5kYXJkQW1vdW50T3V0cHV0LCBTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuL291dHB1dFwiXHJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQgfSBmcm9tIFwiLi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHtcclxuICBTZXJpYWxpemFibGUsXHJcbiAgU2VyaWFsaXphdGlvbixcclxuICBTZXJpYWxpemVkRW5jb2RpbmcsXHJcbiAgU2VyaWFsaXplZFR5cGVcclxufSBmcm9tIFwiLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXHJcblxyXG4vKipcclxuICogQGlnbm9yZVxyXG4gKi9cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IGNiNTg6IFNlcmlhbGl6ZWRUeXBlID0gXCJjYjU4XCJcclxuY29uc3QgaGV4OiBTZXJpYWxpemVkVHlwZSA9IFwiaGV4XCJcclxuY29uc3QgZGVjaW1hbFN0cmluZzogU2VyaWFsaXplZFR5cGUgPSBcImRlY2ltYWxTdHJpbmdcIlxyXG5jb25zdCBidWZmZXI6IFNlcmlhbGl6ZWRUeXBlID0gXCJCdWZmZXJcIlxyXG5cclxuLyoqXHJcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIGJhc2UgZm9yIGFsbCB0cmFuc2FjdGlvbnMuXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhbmRhcmRCYXNlVHg8XHJcbiAgS1BDbGFzcyBleHRlbmRzIFN0YW5kYXJkS2V5UGFpcixcclxuICBLQ0NsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzPlxyXG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZEJhc2VUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcclxuXHJcbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcclxuICAgIGNvbnN0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4uZmllbGRzLFxyXG4gICAgICBuZXR3b3JrSUQ6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcclxuICAgICAgICB0aGlzLm5ldHdvcmtJRCxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBidWZmZXIsXHJcbiAgICAgICAgZGVjaW1hbFN0cmluZ1xyXG4gICAgICApLFxyXG4gICAgICBibG9ja2NoYWluSUQ6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcclxuICAgICAgICB0aGlzLmJsb2NrY2hhaW5JRCxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBidWZmZXIsXHJcbiAgICAgICAgY2I1OFxyXG4gICAgICApLFxyXG4gICAgICBvdXRzOiB0aGlzLm91dHMubWFwKChvKSA9PiBvLnNlcmlhbGl6ZShlbmNvZGluZykpLFxyXG4gICAgICBpbnM6IHRoaXMuaW5zLm1hcCgoaSkgPT4gaS5zZXJpYWxpemUoZW5jb2RpbmcpKSxcclxuICAgICAgbWVtbzogc2VyaWFsaXphdGlvbi5lbmNvZGVyKHRoaXMubWVtbywgZW5jb2RpbmcsIGJ1ZmZlciwgaGV4KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5uZXR3b3JrSUQgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgIGZpZWxkc1tcIm5ldHdvcmtJRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGRlY2ltYWxTdHJpbmcsXHJcbiAgICAgIGJ1ZmZlcixcclxuICAgICAgNFxyXG4gICAgKVxyXG4gICAgdGhpcy5ibG9ja2NoYWluSUQgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgIGZpZWxkc1tcImJsb2NrY2hhaW5JRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGNiNTgsXHJcbiAgICAgIGJ1ZmZlcixcclxuICAgICAgMzJcclxuICAgIClcclxuICAgIHRoaXMubWVtbyA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihmaWVsZHNbXCJtZW1vXCJdLCBlbmNvZGluZywgaGV4LCBidWZmZXIpXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgbmV0d29ya0lEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICBwcm90ZWN0ZWQgYmxvY2tjaGFpbklEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIpXHJcbiAgcHJvdGVjdGVkIG51bW91dHM6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gIHByb3RlY3RlZCBvdXRzOiBTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dFtdXHJcbiAgcHJvdGVjdGVkIG51bWluczogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgcHJvdGVjdGVkIGluczogU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dFtdXHJcbiAgcHJvdGVjdGVkIG1lbW86IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgW1tTdGFuZGFyZEJhc2VUeF1dXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0VHhUeXBlKCk6IG51bWJlclxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBOZXR3b3JrSUQgYXMgYSBudW1iZXJcclxuICAgKi9cclxuICBnZXROZXR3b3JrSUQoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLm5ldHdvcmtJRC5yZWFkVUludDMyQkUoMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIEJ1ZmZlciByZXByZXNlbnRhdGlvbiBvZiB0aGUgQmxvY2tjaGFpbklEXHJcbiAgICovXHJcbiAgZ2V0QmxvY2tjaGFpbklEKCk6IEJ1ZmZlciB7XHJcbiAgICByZXR1cm4gdGhpcy5ibG9ja2NoYWluSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIFtbU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldElucygpOiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0W11cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgW1tTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dF1dc1xyXG4gICAqL1xyXG4gIGFic3RyYWN0IGdldE91dHMoKTogU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRbXVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBjb21iaW5lZCB0b3RhbCBbW1N0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0XV1zXHJcbiAgICovXHJcbiAgYWJzdHJhY3QgZ2V0VG90YWxPdXRzKCk6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W11cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIG1lbW9cclxuICAgKi9cclxuICBnZXRNZW1vKCk6IEJ1ZmZlciB7XHJcbiAgICByZXR1cm4gdGhpcy5tZW1vXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cclxuICAgKi9cclxuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgdGhpcy5vdXRzLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXQuY29tcGFyYXRvcigpKVxyXG4gICAgdGhpcy5pbnMuc29ydChTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0LmNvbXBhcmF0b3IoKSlcclxuICAgIHRoaXMubnVtb3V0cy53cml0ZVVJbnQzMkJFKHRoaXMub3V0cy5sZW5ndGgsIDApXHJcbiAgICB0aGlzLm51bWlucy53cml0ZVVJbnQzMkJFKHRoaXMuaW5zLmxlbmd0aCwgMClcclxuICAgIGxldCBic2l6ZTogbnVtYmVyID1cclxuICAgICAgdGhpcy5uZXR3b3JrSUQubGVuZ3RoICsgdGhpcy5ibG9ja2NoYWluSUQubGVuZ3RoICsgdGhpcy5udW1vdXRzLmxlbmd0aFxyXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbdGhpcy5uZXR3b3JrSUQsIHRoaXMuYmxvY2tjaGFpbklELCB0aGlzLm51bW91dHNdXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5vdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGI6IEJ1ZmZlciA9IHRoaXMub3V0c1tgJHtpfWBdLnRvQnVmZmVyKClcclxuICAgICAgYmFyci5wdXNoKGIpXHJcbiAgICAgIGJzaXplICs9IGIubGVuZ3RoXHJcbiAgICB9XHJcbiAgICBiYXJyLnB1c2godGhpcy5udW1pbnMpXHJcbiAgICBic2l6ZSArPSB0aGlzLm51bWlucy5sZW5ndGhcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmlucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBiOiBCdWZmZXIgPSB0aGlzLmluc1tgJHtpfWBdLnRvQnVmZmVyKClcclxuICAgICAgYmFyci5wdXNoKGIpXHJcbiAgICAgIGJzaXplICs9IGIubGVuZ3RoXHJcbiAgICB9XHJcbiAgICBsZXQgbWVtb2xlbjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICBtZW1vbGVuLndyaXRlVUludDMyQkUodGhpcy5tZW1vLmxlbmd0aCwgMClcclxuICAgIGJhcnIucHVzaChtZW1vbGVuKVxyXG4gICAgYnNpemUgKz0gNFxyXG4gICAgYmFyci5wdXNoKHRoaXMubWVtbylcclxuICAgIGJzaXplICs9IHRoaXMubWVtby5sZW5ndGhcclxuICAgIGNvbnN0IGJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoYmFyciwgYnNpemUpXHJcbiAgICByZXR1cm4gYnVmZlxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGJhc2UtNTggcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cclxuICAgKi9cclxuICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmJ1ZmZlclRvQjU4KHRoaXMudG9CdWZmZXIoKSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSBieXRlcyBvZiBhbiBbW1Vuc2lnbmVkVHhdXSBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSBtc2cgQSBCdWZmZXIgZm9yIHRoZSBbW1Vuc2lnbmVkVHhdXVxyXG4gICAqIEBwYXJhbSBrYyBBbiBbW0tleUNoYWluXV0gdXNlZCBpbiBzaWduaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcclxuICAgKi9cclxuICBhYnN0cmFjdCBzaWduKG1zZzogQnVmZmVyLCBrYzogU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzPik6IENyZWRlbnRpYWxbXVxyXG5cclxuICBhYnN0cmFjdCBjbG9uZSgpOiB0aGlzXHJcblxyXG4gIGFic3RyYWN0IGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXNcclxuXHJcbiAgYWJzdHJhY3Qgc2VsZWN0KGlkOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKTogdGhpc1xyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYSBTdGFuZGFyZEJhc2VUeCB3aGljaCBpcyB0aGUgZm91bmRhdGlvbiBmb3IgYWxsIHRyYW5zYWN0aW9ucy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgT3B0aW9uYWwgbmV0d29ya0lELCBbW0RlZmF1bHROZXR3b3JrSURdXVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwgYmxvY2tjaGFpbklELCBkZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXHJcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXHJcbiAgICogQHBhcmFtIGlucyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgbWVtbyBmaWVsZFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIsIDE2KSxcclxuICAgIG91dHM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZFxyXG4gICkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy5uZXR3b3JrSUQud3JpdGVVSW50MzJCRShuZXR3b3JrSUQsIDApXHJcbiAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxyXG4gICAgaWYgKHR5cGVvZiBtZW1vICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy5tZW1vID0gbWVtb1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgaW5zICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBvdXRzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMubnVtb3V0cy53cml0ZVVJbnQzMkJFKG91dHMubGVuZ3RoLCAwKVxyXG4gICAgICB0aGlzLm91dHMgPSBvdXRzLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXQuY29tcGFyYXRvcigpKVxyXG4gICAgICB0aGlzLm51bWlucy53cml0ZVVJbnQzMkJFKGlucy5sZW5ndGgsIDApXHJcbiAgICAgIHRoaXMuaW5zID0gaW5zLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dC5jb21wYXJhdG9yKCkpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YW5kYXJkVW5zaWduZWRUeDxcclxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxyXG4gIEtDQ2xhc3MgZXh0ZW5kcyBTdGFuZGFyZEtleUNoYWluPEtQQ2xhc3M+LFxyXG4gIFNCVHggZXh0ZW5kcyBTdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPlxyXG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZFVuc2lnbmVkVHhcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIGNvZGVjSUQ6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcclxuICAgICAgICB0aGlzLmNvZGVjSUQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJudW1iZXJcIixcclxuICAgICAgICBcImRlY2ltYWxTdHJpbmdcIixcclxuICAgICAgICAyXHJcbiAgICAgICksXHJcbiAgICAgIHRyYW5zYWN0aW9uOiB0aGlzLnRyYW5zYWN0aW9uLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xyXG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcclxuICAgIHRoaXMuY29kZWNJRCA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wiY29kZWNJRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICBcIm51bWJlclwiXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgY29kZWNJRDogbnVtYmVyID0gMFxyXG4gIHByb3RlY3RlZCB0cmFuc2FjdGlvbjogU0JUeFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBDb2RlY0lEIGFzIGEgbnVtYmVyXHJcbiAgICovXHJcbiAgZ2V0Q29kZWNJRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuY29kZWNJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIENvZGVjSURcclxuICAgKi9cclxuICBnZXRDb2RlY0lEQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBsZXQgY29kZWNCdWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygyKVxyXG4gICAgY29kZWNCdWYud3JpdGVVSW50MTZCRSh0aGlzLmNvZGVjSUQsIDApXHJcbiAgICByZXR1cm4gY29kZWNCdWZcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGlucHV0VG90YWwgYXMgYSBCTlxyXG4gICAqL1xyXG4gIGdldElucHV0VG90YWwoYXNzZXRJRDogQnVmZmVyKTogQk4ge1xyXG4gICAgY29uc3QgaW5zOiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0W10gPSB0aGlzLmdldFRyYW5zYWN0aW9uKCkuZ2V0SW5zKClcclxuICAgIGNvbnN0IGFJREhleDogc3RyaW5nID0gYXNzZXRJRC50b1N0cmluZyhcImhleFwiKVxyXG4gICAgbGV0IHRvdGFsOiBCTiA9IG5ldyBCTigwKVxyXG5cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gb25seSBjaGVjayBTdGFuZGFyZEFtb3VudElucHV0c1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaW5zW2Ake2l9YF0uZ2V0SW5wdXQoKSBpbnN0YW5jZW9mIFN0YW5kYXJkQW1vdW50SW5wdXQgJiZcclxuICAgICAgICBhSURIZXggPT09IGluc1tgJHtpfWBdLmdldEFzc2V0SUQoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBpbnB1dDogU3RhbmRhcmRBbW91bnRJbnB1dCA9IGluc1tcclxuICAgICAgICAgIGAke2l9YFxyXG4gICAgICAgIF0uZ2V0SW5wdXQoKSBhcyBTdGFuZGFyZEFtb3VudElucHV0XHJcbiAgICAgICAgdG90YWwgPSB0b3RhbC5hZGQoaW5wdXQuZ2V0QW1vdW50KCkpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0b3RhbFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgb3V0cHV0VG90YWwgYXMgYSBCTlxyXG4gICAqL1xyXG4gIGdldE91dHB1dFRvdGFsKGFzc2V0SUQ6IEJ1ZmZlcik6IEJOIHtcclxuICAgIGNvbnN0IG91dHM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W10gPVxyXG4gICAgICB0aGlzLmdldFRyYW5zYWN0aW9uKCkuZ2V0VG90YWxPdXRzKClcclxuICAgIGNvbnN0IGFJREhleDogc3RyaW5nID0gYXNzZXRJRC50b1N0cmluZyhcImhleFwiKVxyXG4gICAgbGV0IHRvdGFsOiBCTiA9IG5ldyBCTigwKVxyXG5cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBvdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vIG9ubHkgY2hlY2sgU3RhbmRhcmRBbW91bnRPdXRwdXRcclxuICAgICAgaWYgKFxyXG4gICAgICAgIG91dHNbYCR7aX1gXS5nZXRPdXRwdXQoKSBpbnN0YW5jZW9mIFN0YW5kYXJkQW1vdW50T3V0cHV0ICYmXHJcbiAgICAgICAgYUlESGV4ID09PSBvdXRzW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dDogU3RhbmRhcmRBbW91bnRPdXRwdXQgPSBvdXRzW1xyXG4gICAgICAgICAgYCR7aX1gXHJcbiAgICAgICAgXS5nZXRPdXRwdXQoKSBhcyBTdGFuZGFyZEFtb3VudE91dHB1dFxyXG4gICAgICAgIHRvdGFsID0gdG90YWwuYWRkKG91dHB1dC5nZXRBbW91bnQoKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvdGFsXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgYnVybmVkIHRva2VucyBhcyBhIEJOXHJcbiAgICovXHJcbiAgZ2V0QnVybihhc3NldElEOiBCdWZmZXIpOiBCTiB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJbnB1dFRvdGFsKGFzc2V0SUQpLnN1Yih0aGlzLmdldE91dHB1dFRvdGFsKGFzc2V0SUQpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgVHJhbnNhY3Rpb25cclxuICAgKi9cclxuICBhYnN0cmFjdCBnZXRUcmFuc2FjdGlvbigpOiBTQlR4XHJcblxyXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXHJcblxyXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBjb25zdCBjb2RlY0J1ZjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDIpXHJcbiAgICBjb2RlY0J1Zi53cml0ZVVJbnQxNkJFKHRoaXMudHJhbnNhY3Rpb24uZ2V0Q29kZWNJRCgpLCAwKVxyXG4gICAgY29uc3QgdHh0eXBlOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIHR4dHlwZS53cml0ZVVJbnQzMkJFKHRoaXMudHJhbnNhY3Rpb24uZ2V0VHhUeXBlKCksIDApXHJcbiAgICBjb25zdCBiYXNlYnVmZiA9IHRoaXMudHJhbnNhY3Rpb24udG9CdWZmZXIoKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoXHJcbiAgICAgIFtjb2RlY0J1ZiwgdHh0eXBlLCBiYXNlYnVmZl0sXHJcbiAgICAgIGNvZGVjQnVmLmxlbmd0aCArIHR4dHlwZS5sZW5ndGggKyBiYXNlYnVmZi5sZW5ndGhcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpZ25zIHRoaXMgW1tVbnNpZ25lZFR4XV0gYW5kIHJldHVybnMgc2lnbmVkIFtbU3RhbmRhcmRUeF1dXHJcbiAgICpcclxuICAgKiBAcGFyYW0ga2MgQW4gW1tLZXlDaGFpbl1dIHVzZWQgaW4gc2lnbmluZ1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBzaWduZWQgW1tTdGFuZGFyZFR4XV1cclxuICAgKi9cclxuICBhYnN0cmFjdCBzaWduKFxyXG4gICAga2M6IEtDQ2xhc3NcclxuICApOiBTdGFuZGFyZFR4PEtQQ2xhc3MsIEtDQ2xhc3MsIFN0YW5kYXJkVW5zaWduZWRUeDxLUENsYXNzLCBLQ0NsYXNzLCBTQlR4Pj5cclxuXHJcbiAgY29uc3RydWN0b3IodHJhbnNhY3Rpb246IFNCVHggPSB1bmRlZmluZWQsIGNvZGVjSUQ6IG51bWJlciA9IDApIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuY29kZWNJRCA9IGNvZGVjSURcclxuICAgIHRoaXMudHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvblxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNpZ25lZCB0cmFuc2FjdGlvbi5cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGFuZGFyZFR4PFxyXG4gIEtQQ2xhc3MgZXh0ZW5kcyBTdGFuZGFyZEtleVBhaXIsXHJcbiAgS0NDbGFzcyBleHRlbmRzIFN0YW5kYXJkS2V5Q2hhaW48S1BDbGFzcz4sXHJcbiAgU1VCVHggZXh0ZW5kcyBTdGFuZGFyZFVuc2lnbmVkVHg8XHJcbiAgICBLUENsYXNzLFxyXG4gICAgS0NDbGFzcyxcclxuICAgIFN0YW5kYXJkQmFzZVR4PEtQQ2xhc3MsIEtDQ2xhc3M+XHJcbiAgPlxyXG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZFR4XCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxyXG5cclxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xyXG4gICAgbGV0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4uZmllbGRzLFxyXG4gICAgICB1bnNpZ25lZFR4OiB0aGlzLnVuc2lnbmVkVHguc2VyaWFsaXplKGVuY29kaW5nKSxcclxuICAgICAgY3JlZGVudGlhbHM6IHRoaXMuY3JlZGVudGlhbHMubWFwKChjKSA9PiBjLnNlcmlhbGl6ZShlbmNvZGluZykpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgdW5zaWduZWRUeDogU1VCVHggPSB1bmRlZmluZWRcclxuICBwcm90ZWN0ZWQgY3JlZGVudGlhbHM6IENyZWRlbnRpYWxbXSA9IFtdXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIFtbQ3JlZGVudGlhbFtdXV1cclxuICAgKi9cclxuICBnZXRDcmVkZW50aWFscygpOiBDcmVkZW50aWFsW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuY3JlZGVudGlhbHNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIFtbU3RhbmRhcmRVbnNpZ25lZFR4XV1cclxuICAgKi9cclxuICBnZXRVbnNpZ25lZFR4KCk6IFNVQlR4IHtcclxuICAgIHJldHVybiB0aGlzLnVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tTdGFuZGFyZFR4XV0uXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHR4OiBTdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPiA9XHJcbiAgICAgIHRoaXMudW5zaWduZWRUeC5nZXRUcmFuc2FjdGlvbigpXHJcbiAgICBjb25zdCBjb2RlY0lEOiBudW1iZXIgPSB0eC5nZXRDb2RlY0lEKClcclxuICAgIGNvbnN0IHR4YnVmZjogQnVmZmVyID0gdGhpcy51bnNpZ25lZFR4LnRvQnVmZmVyKClcclxuICAgIGxldCBic2l6ZTogbnVtYmVyID0gdHhidWZmLmxlbmd0aFxyXG4gICAgY29uc3QgY3JlZGxlbjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICBjcmVkbGVuLndyaXRlVUludDMyQkUodGhpcy5jcmVkZW50aWFscy5sZW5ndGgsIDApXHJcbiAgICBjb25zdCBiYXJyOiBCdWZmZXJbXSA9IFt0eGJ1ZmYsIGNyZWRsZW5dXHJcbiAgICBic2l6ZSArPSBjcmVkbGVuLmxlbmd0aFxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuY3JlZGVudGlhbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5jcmVkZW50aWFsc1tgJHtpfWBdLnNldENvZGVjSUQoY29kZWNJRClcclxuICAgICAgY29uc3QgY3JlZElEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgICAgY3JlZElELndyaXRlVUludDMyQkUodGhpcy5jcmVkZW50aWFsc1tgJHtpfWBdLmdldENyZWRlbnRpYWxJRCgpLCAwKVxyXG4gICAgICBiYXJyLnB1c2goY3JlZElEKVxyXG4gICAgICBic2l6ZSArPSBjcmVkSUQubGVuZ3RoXHJcbiAgICAgIGNvbnN0IGNyZWRidWZmOiBCdWZmZXIgPSB0aGlzLmNyZWRlbnRpYWxzW2Ake2l9YF0udG9CdWZmZXIoKVxyXG4gICAgICBic2l6ZSArPSBjcmVkYnVmZi5sZW5ndGhcclxuICAgICAgYmFyci5wdXNoKGNyZWRidWZmKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYnVmZjogQnVmZmVyID0gQnVmZmVyLmNvbmNhdChiYXJyLCBic2l6ZSlcclxuICAgIHJldHVybiBidWZmXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYW4gW1tTdGFuZGFyZFR4XV0sIHBhcnNlcyBpdCwgcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgVHggaW4gYnl0ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VyaWFsaXplZCBBIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSByYXcgW1tTdGFuZGFyZFR4XV1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW1N0YW5kYXJkVHhdXVxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiB1bmxpa2UgbW9zdCBmcm9tU3RyaW5ncywgaXQgZXhwZWN0cyB0aGUgc3RyaW5nIHRvIGJlIHNlcmlhbGl6ZWQgaW4gY2I1OCBmb3JtYXRcclxuICAgKi9cclxuICBmcm9tU3RyaW5nKHNlcmlhbGl6ZWQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5mcm9tQnVmZmVyKGJpbnRvb2xzLmNiNThEZWNvZGUoc2VyaWFsaXplZCkpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgY2I1OCByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tTdGFuZGFyZFR4XV0uXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIHVubGlrZSBtb3N0IHRvU3RyaW5ncywgdGhpcyByZXR1cm5zIGluIGNiNTggc2VyaWFsaXphdGlvbiBmb3JtYXRcclxuICAgKi9cclxuICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmNiNThFbmNvZGUodGhpcy50b0J1ZmZlcigpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc2lnbmVkIHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVuc2lnbmVkVHggT3B0aW9uYWwgW1tTdGFuZGFyZFVuc2lnbmVkVHhdXVxyXG4gICAqIEBwYXJhbSBzaWduYXR1cmVzIE9wdGlvbmFsIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdW5zaWduZWRUeDogU1VCVHggPSB1bmRlZmluZWQsXHJcbiAgICBjcmVkZW50aWFsczogQ3JlZGVudGlhbFtdID0gdW5kZWZpbmVkXHJcbiAgKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZiAodHlwZW9mIHVuc2lnbmVkVHggIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy51bnNpZ25lZFR4ID0gdW5zaWduZWRUeFxyXG4gICAgICBpZiAodHlwZW9mIGNyZWRlbnRpYWxzICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19