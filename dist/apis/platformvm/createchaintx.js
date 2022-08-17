"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChainTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-CreateChainTx
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const credentials_1 = require("../../common/credentials");
const basetx_1 = require("./basetx");
const constants_2 = require("../../utils/constants");
const serialization_1 = require("../../utils/serialization");
const _1 = require(".");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned CreateChainTx transaction.
 */
class CreateChainTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned CreateChain transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param allychainID Optional ID of the Allychain that validates this blockchain.
     * @param chainName Optional A human readable name for the chain; need not be unique
     * @param vmID Optional ID of the VM running on the new chain
     * @param fxIDs Optional IDs of the feature extensions running on the new chain
     * @param genesisData Optional Byte representation of genesis state of the new chain
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, allychainID = undefined, chainName = undefined, vmID = undefined, fxIDs = undefined, genesisData = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "CreateChainTx";
        this._typeID = constants_1.PlatformVMConstants.CREATECHAINTX;
        this.allychainID = buffer_1.Buffer.alloc(32);
        this.chainName = "";
        this.vmID = buffer_1.Buffer.alloc(32);
        this.numFXIDs = buffer_1.Buffer.alloc(4);
        this.fxIDs = [];
        this.genesisData = buffer_1.Buffer.alloc(32);
        this.sigCount = buffer_1.Buffer.alloc(4);
        this.sigIdxs = []; // idxs of allychain auth signers
        if (typeof allychainID != "undefined") {
            if (typeof allychainID === "string") {
                this.allychainID = bintools.cb58Decode(allychainID);
            }
            else {
                this.allychainID = allychainID;
            }
        }
        if (typeof chainName != "undefined") {
            this.chainName = chainName;
        }
        if (typeof vmID != "undefined") {
            const buf = buffer_1.Buffer.alloc(32);
            buf.write(vmID, 0, vmID.length);
            this.vmID = buf;
        }
        if (typeof fxIDs != "undefined") {
            this.numFXIDs.writeUInt32BE(fxIDs.length, 0);
            const fxIDBufs = [];
            fxIDs.forEach((fxID) => {
                const buf = buffer_1.Buffer.alloc(32);
                buf.write(fxID, 0, fxID.length, "utf8");
                fxIDBufs.push(buf);
            });
            this.fxIDs = fxIDBufs;
        }
        if (typeof genesisData != "undefined" && typeof genesisData != "string") {
            this.genesisData = genesisData.toBuffer();
        }
        else if (typeof genesisData == "string") {
            this.genesisData = buffer_1.Buffer.from(genesisData);
        }
        const allychainAuth = new _1.AllychainAuth();
        this.allychainAuth = allychainAuth;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { allychainID: serialization.encoder(this.allychainID, encoding, "Buffer", "cb58") });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.allychainID = serialization.decoder(fields["allychainID"], encoding, "cb58", "Buffer", 32);
        // this.exportOuts = fields["exportOuts"].map((e: object) => {
        //   let eo: TransferableOutput = new TransferableOutput()
        //   eo.deserialize(e, encoding)
        //   return eo
        // })
    }
    /**
     * Returns the id of the [[CreateChainTx]]
     */
    getTxType() {
        return constants_1.PlatformVMConstants.CREATECHAINTX;
    }
    /**
     * Returns the allychainAuth
     */
    getAllychainAuth() {
        return this.allychainAuth;
    }
    /**
     * Returns the allychainID as a string
     */
    getAllychainID() {
        return bintools.cb58Encode(this.allychainID);
    }
    /**
     * Returns a string of the chainName
     */
    getChainName() {
        return this.chainName;
    }
    /**
     * Returns a Buffer of the vmID
     */
    getVMID() {
        return this.vmID;
    }
    /**
     * Returns an array of fxIDs as Buffers
     */
    getFXIDs() {
        return this.fxIDs;
    }
    /**
     * Returns a string of the genesisData
     */
    getGenesisData() {
        return bintools.cb58Encode(this.genesisData);
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[CreateChainTx]], parses it, populates the class, and returns the length of the [[CreateChainTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[CreateChainTx]]
     *
     * @returns The length of the raw [[CreateChainTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.allychainID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        const chainNameSize = bintools
            .copyFrom(bytes, offset, offset + 2)
            .readUInt16BE(0);
        offset += 2;
        this.chainName = bintools
            .copyFrom(bytes, offset, offset + chainNameSize)
            .toString("utf8");
        offset += chainNameSize;
        this.vmID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numFXIDs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const nfxids = parseInt(this.numFXIDs.toString("hex"), 10);
        for (let i = 0; i < nfxids; i++) {
            this.fxIDs.push(bintools.copyFrom(bytes, offset, offset + 32));
            offset += 32;
        }
        const genesisDataSize = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.genesisData = bintools.copyFrom(bytes, offset, offset + genesisDataSize);
        offset += genesisDataSize;
        const sa = new _1.AllychainAuth();
        offset += sa.fromBuffer(bintools.copyFrom(bytes, offset));
        this.allychainAuth = sa;
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateChainTx]].
     */
    toBuffer() {
        const superbuff = super.toBuffer();
        const chainNameBuff = buffer_1.Buffer.alloc(this.chainName.length);
        chainNameBuff.write(this.chainName, 0, this.chainName.length, "utf8");
        const chainNameSize = buffer_1.Buffer.alloc(2);
        chainNameSize.writeUIntBE(this.chainName.length, 0, 2);
        let bsize = superbuff.length +
            this.allychainID.length +
            chainNameSize.length +
            chainNameBuff.length +
            this.vmID.length +
            this.numFXIDs.length;
        const barr = [
            superbuff,
            this.allychainID,
            chainNameSize,
            chainNameBuff,
            this.vmID,
            this.numFXIDs
        ];
        this.fxIDs.forEach((fxID) => {
            bsize += fxID.length;
            barr.push(fxID);
        });
        bsize += 4;
        bsize += this.genesisData.length;
        const gdLength = buffer_1.Buffer.alloc(4);
        gdLength.writeUIntBE(this.genesisData.length, 0, 4);
        barr.push(gdLength);
        barr.push(this.genesisData);
        bsize += this.allychainAuth.toBuffer().length;
        barr.push(this.allychainAuth.toBuffer());
        return buffer_1.Buffer.concat(barr, bsize);
    }
    clone() {
        const newCreateChainTx = new CreateChainTx();
        newCreateChainTx.fromBuffer(this.toBuffer());
        return newCreateChainTx;
    }
    create(...args) {
        return new CreateChainTx(...args);
    }
    /**
     * Creates and adds a [[SigIdx]] to the [[AddAllychainValidatorTx]].
     *
     * @param addressIdx The index of the address to reference in the signatures
     * @param address The address of the source of the signature
     */
    addSignatureIdx(addressIdx, address) {
        const addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(addressIdx, 0, 4);
        this.allychainAuth.addAddressIndex(addressIndex);
        const sigidx = new credentials_1.SigIdx();
        const b = buffer_1.Buffer.alloc(4);
        b.writeUInt32BE(addressIdx, 0);
        sigidx.fromBuffer(b);
        sigidx.setSource(address);
        this.sigIdxs.push(sigidx);
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    }
    /**
     * Returns the array of [[SigIdx]] for this [[Input]]
     */
    getSigIdxs() {
        return this.sigIdxs;
    }
    getCredentialID() {
        return constants_1.PlatformVMConstants.SECPCREDENTIAL;
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
        const sigidxs = this.getSigIdxs();
        const cred = (0, _1.SelectCredentialClass)(this.getCredentialID());
        for (let i = 0; i < sigidxs.length; i++) {
            const keypair = kc.getKey(sigidxs[`${i}`].getSource());
            const signval = keypair.sign(msg);
            const sig = new credentials_1.Signature();
            sig.fromBuffer(signval);
            cred.addSignature(sig);
        }
        creds.push(cred);
        return creds;
    }
}
exports.CreateChainTx = CreateChainTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlY2hhaW50eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vY3JlYXRlY2hhaW50eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxvQ0FBZ0M7QUFDaEMsb0VBQTJDO0FBQzNDLDJDQUFpRDtBQUdqRCwwREFBd0U7QUFDeEUscUNBQWlDO0FBQ2pDLHFEQUF3RDtBQUN4RCw2REFBNkU7QUFFN0Usd0JBQXdEO0FBR3hEOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGFBQWEsR0FBa0IsNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVoRTs7R0FFRztBQUNILE1BQWEsYUFBYyxTQUFRLGVBQU07SUFtUXZDOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxZQUNFLFlBQW9CLDRCQUFnQixFQUNwQyxlQUF1QixlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDM0MsT0FBNkIsU0FBUyxFQUN0QyxNQUEyQixTQUFTLEVBQ3BDLE9BQWUsU0FBUyxFQUN4QixjQUErQixTQUFTLEVBQ3hDLFlBQW9CLFNBQVMsRUFDN0IsT0FBZSxTQUFTLEVBQ3hCLFFBQWtCLFNBQVMsRUFDM0IsY0FBb0MsU0FBUztRQUU3QyxLQUFLLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBNVJ2QyxjQUFTLEdBQUcsZUFBZSxDQUFBO1FBQzNCLFlBQU8sR0FBRywrQkFBbUIsQ0FBQyxhQUFhLENBQUE7UUErQjNDLGdCQUFXLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN0QyxjQUFTLEdBQVcsRUFBRSxDQUFBO1FBQ3RCLFNBQUksR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxD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QTtRQUMzQyxNQUFNLElBQUksR0FBZSxJQUFBLHdCQUFxQixFQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBO1FBQ3RFLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDekMsTUFBTSxHQUFHLEdBQWMsSUFBSSx1QkFBUyxFQUFFLENBQUE7WUFDdEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ3ZCO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoQixPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7Q0ErREY7QUFoVUQsc0NBZ1VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1QbGF0Zm9ybVZNLUNyZWF0ZUNoYWluVHhcclxuICovXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IFBsYXRmb3JtVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBUcmFuc2ZlcmFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHsgVHJhbnNmZXJhYmxlSW5wdXQgfSBmcm9tIFwiLi9pbnB1dHNcIlxyXG5pbXBvcnQgeyBDcmVkZW50aWFsLCBTaWdJZHgsIFNpZ25hdHVyZSB9IGZyb20gXCIuLi8uLi9jb21tb24vY3JlZGVudGlhbHNcIlxyXG5pbXBvcnQgeyBCYXNlVHggfSBmcm9tIFwiLi9iYXNldHhcIlxyXG5pbXBvcnQgeyBEZWZhdWx0TmV0d29ya0lEIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IFNlcmlhbGl6YXRpb24sIFNlcmlhbGl6ZWRFbmNvZGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9zZXJpYWxpemF0aW9uXCJcclxuaW1wb3J0IHsgR2VuZXNpc0RhdGEgfSBmcm9tIFwiLi4vYXZtXCJcclxuaW1wb3J0IHsgU2VsZWN0Q3JlZGVudGlhbENsYXNzLCBBbGx5Y2hhaW5BdXRoIH0gZnJvbSBcIi5cIlxyXG5pbXBvcnQgeyBLZXlDaGFpbiwgS2V5UGFpciB9IGZyb20gXCIuL2tleWNoYWluXCJcclxuXHJcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqL1xyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgQ3JlYXRlQ2hhaW5UeCB0cmFuc2FjdGlvbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDcmVhdGVDaGFpblR4IGV4dGVuZHMgQmFzZVR4IHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJDcmVhdGVDaGFpblR4XCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IFBsYXRmb3JtVk1Db25zdGFudHMuQ1JFQVRFQ0hBSU5UWFxyXG5cclxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xyXG4gICAgbGV0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLi4uZmllbGRzLFxyXG4gICAgICBhbGx5Y2hhaW5JRDogc2VyaWFsaXphdGlvbi5lbmNvZGVyKFxyXG4gICAgICAgIHRoaXMuYWxseWNoYWluSUQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgICBcImNiNThcIlxyXG4gICAgICApXHJcbiAgICAgIC8vIGV4cG9ydE91dHM6IHRoaXMuZXhwb3J0T3V0cy5tYXAoKGUpID0+IGUuc2VyaWFsaXplKGVuY29kaW5nKSlcclxuICAgIH1cclxuICB9XHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5hbGx5Y2hhaW5JRCA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wiYWxseWNoYWluSURcIl0sXHJcbiAgICAgIGVuY29kaW5nLFxyXG4gICAgICBcImNiNThcIixcclxuICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgMzJcclxuICAgIClcclxuICAgIC8vIHRoaXMuZXhwb3J0T3V0cyA9IGZpZWxkc1tcImV4cG9ydE91dHNcIl0ubWFwKChlOiBvYmplY3QpID0+IHtcclxuICAgIC8vICAgbGV0IGVvOiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KClcclxuICAgIC8vICAgZW8uZGVzZXJpYWxpemUoZSwgZW5jb2RpbmcpXHJcbiAgICAvLyAgIHJldHVybiBlb1xyXG4gICAgLy8gfSlcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBhbGx5Y2hhaW5JRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxyXG4gIHByb3RlY3RlZCBjaGFpbk5hbWU6IHN0cmluZyA9IFwiXCJcclxuICBwcm90ZWN0ZWQgdm1JRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxyXG4gIHByb3RlY3RlZCBudW1GWElEczogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgcHJvdGVjdGVkIGZ4SURzOiBCdWZmZXJbXSA9IFtdXHJcbiAgcHJvdGVjdGVkIGdlbmVzaXNEYXRhOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMzIpXHJcbiAgcHJvdGVjdGVkIGFsbHljaGFpbkF1dGg6IEFsbHljaGFpbkF1dGhcclxuICBwcm90ZWN0ZWQgc2lnQ291bnQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gIHByb3RlY3RlZCBzaWdJZHhzOiBTaWdJZHhbXSA9IFtdIC8vIGlkeHMgb2YgYWxseWNoYWluIGF1dGggc2lnbmVyc1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgW1tDcmVhdGVDaGFpblR4XV1cclxuICAgKi9cclxuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBQbGF0Zm9ybVZNQ29uc3RhbnRzLkNSRUFURUNIQUlOVFhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGFsbHljaGFpbkF1dGhcclxuICAgKi9cclxuICBnZXRBbGx5Y2hhaW5BdXRoKCk6IEFsbHljaGFpbkF1dGgge1xyXG4gICAgcmV0dXJuIHRoaXMuYWxseWNoYWluQXV0aFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYWxseWNoYWluSUQgYXMgYSBzdHJpbmdcclxuICAgKi9cclxuICBnZXRBbGx5Y2hhaW5JRCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmNiNThFbmNvZGUodGhpcy5hbGx5Y2hhaW5JRClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGNoYWluTmFtZVxyXG4gICAqL1xyXG4gIGdldENoYWluTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhaW5OYW1lXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgQnVmZmVyIG9mIHRoZSB2bUlEXHJcbiAgICovXHJcbiAgZ2V0Vk1JRCgpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMudm1JRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBmeElEcyBhcyBCdWZmZXJzXHJcbiAgICovXHJcbiAgZ2V0RlhJRHMoKTogQnVmZmVyW10ge1xyXG4gICAgcmV0dXJuIHRoaXMuZnhJRHNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzdHJpbmcgb2YgdGhlIGdlbmVzaXNEYXRhXHJcbiAgICovXHJcbiAgZ2V0R2VuZXNpc0RhdGEoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBiaW50b29scy5jYjU4RW5jb2RlKHRoaXMuZ2VuZXNpc0RhdGEpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYW4gW1tDcmVhdGVDaGFpblR4XV0sIHBhcnNlcyBpdCwgcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgW1tDcmVhdGVDaGFpblR4XV0gaW4gYnl0ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYnl0ZXMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGEgcmF3IFtbQ3JlYXRlQ2hhaW5UeF1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgbGVuZ3RoIG9mIHRoZSByYXcgW1tDcmVhdGVDaGFpblR4XV1cclxuICAgKlxyXG4gICAqIEByZW1hcmtzIGFzc3VtZSBub3QtY2hlY2tzdW1tZWRcclxuICAgKi9cclxuICBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyID0gMCk6IG51bWJlciB7XHJcbiAgICBvZmZzZXQgPSBzdXBlci5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXHJcbiAgICB0aGlzLmFsbHljaGFpbklEID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXHJcbiAgICBvZmZzZXQgKz0gMzJcclxuXHJcbiAgICBjb25zdCBjaGFpbk5hbWVTaXplOiBudW1iZXIgPSBiaW50b29sc1xyXG4gICAgICAuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMilcclxuICAgICAgLnJlYWRVSW50MTZCRSgwKVxyXG4gICAgb2Zmc2V0ICs9IDJcclxuXHJcbiAgICB0aGlzLmNoYWluTmFtZSA9IGJpbnRvb2xzXHJcbiAgICAgIC5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyBjaGFpbk5hbWVTaXplKVxyXG4gICAgICAudG9TdHJpbmcoXCJ1dGY4XCIpXHJcbiAgICBvZmZzZXQgKz0gY2hhaW5OYW1lU2l6ZVxyXG5cclxuICAgIHRoaXMudm1JRCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDMyKVxyXG4gICAgb2Zmc2V0ICs9IDMyXHJcblxyXG4gICAgdGhpcy5udW1GWElEcyA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDQpXHJcbiAgICBvZmZzZXQgKz0gNFxyXG5cclxuICAgIGNvbnN0IG5meGlkczogbnVtYmVyID0gcGFyc2VJbnQodGhpcy5udW1GWElEcy50b1N0cmluZyhcImhleFwiKSwgMTApXHJcblxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG5meGlkczsgaSsrKSB7XHJcbiAgICAgIHRoaXMuZnhJRHMucHVzaChiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAzMikpXHJcbiAgICAgIG9mZnNldCArPSAzMlxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdlbmVzaXNEYXRhU2l6ZTogbnVtYmVyID0gYmludG9vbHNcclxuICAgICAgLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDQpXHJcbiAgICAgIC5yZWFkVUludDMyQkUoMClcclxuICAgIG9mZnNldCArPSA0XHJcblxyXG4gICAgdGhpcy5nZW5lc2lzRGF0YSA9IGJpbnRvb2xzLmNvcHlGcm9tKFxyXG4gICAgICBieXRlcyxcclxuICAgICAgb2Zmc2V0LFxyXG4gICAgICBvZmZzZXQgKyBnZW5lc2lzRGF0YVNpemVcclxuICAgIClcclxuICAgIG9mZnNldCArPSBnZW5lc2lzRGF0YVNpemVcclxuXHJcbiAgICBjb25zdCBzYTogQWxseWNoYWluQXV0aCA9IG5ldyBBbGx5Y2hhaW5BdXRoKClcclxuICAgIG9mZnNldCArPSBzYS5mcm9tQnVmZmVyKGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQpKVxyXG5cclxuICAgIHRoaXMuYWxseWNoYWluQXV0aCA9IHNhXHJcblxyXG4gICAgcmV0dXJuIG9mZnNldFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0NyZWF0ZUNoYWluVHhdXS5cclxuICAgKi9cclxuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgY29uc3Qgc3VwZXJidWZmOiBCdWZmZXIgPSBzdXBlci50b0J1ZmZlcigpXHJcblxyXG4gICAgY29uc3QgY2hhaW5OYW1lQnVmZjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKHRoaXMuY2hhaW5OYW1lLmxlbmd0aClcclxuICAgIGNoYWluTmFtZUJ1ZmYud3JpdGUodGhpcy5jaGFpbk5hbWUsIDAsIHRoaXMuY2hhaW5OYW1lLmxlbmd0aCwgXCJ1dGY4XCIpXHJcbiAgICBjb25zdCBjaGFpbk5hbWVTaXplOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMilcclxuICAgIGNoYWluTmFtZVNpemUud3JpdGVVSW50QkUodGhpcy5jaGFpbk5hbWUubGVuZ3RoLCAwLCAyKVxyXG5cclxuICAgIGxldCBic2l6ZTogbnVtYmVyID1cclxuICAgICAgc3VwZXJidWZmLmxlbmd0aCArXHJcbiAgICAgIHRoaXMuYWxseWNoYWluSUQubGVuZ3RoICtcclxuICAgICAgY2hhaW5OYW1lU2l6ZS5sZW5ndGggK1xyXG4gICAgICBjaGFpbk5hbWVCdWZmLmxlbmd0aCArXHJcbiAgICAgIHRoaXMudm1JRC5sZW5ndGggK1xyXG4gICAgICB0aGlzLm51bUZYSURzLmxlbmd0aFxyXG5cclxuICAgIGNvbnN0IGJhcnI6IEJ1ZmZlcltdID0gW1xyXG4gICAgICBzdXBlcmJ1ZmYsXHJcbiAgICAgIHRoaXMuYWxseWNoYWluSUQsXHJcbiAgICAgIGNoYWluTmFtZVNpemUsXHJcbiAgICAgIGNoYWluTmFtZUJ1ZmYsXHJcbiAgICAgIHRoaXMudm1JRCxcclxuICAgICAgdGhpcy5udW1GWElEc1xyXG4gICAgXVxyXG5cclxuICAgIHRoaXMuZnhJRHMuZm9yRWFjaCgoZnhJRDogQnVmZmVyKTogdm9pZCA9PiB7XHJcbiAgICAgIGJzaXplICs9IGZ4SUQubGVuZ3RoXHJcbiAgICAgIGJhcnIucHVzaChmeElEKVxyXG4gICAgfSlcclxuXHJcbiAgICBic2l6ZSArPSA0XHJcbiAgICBic2l6ZSArPSB0aGlzLmdlbmVzaXNEYXRhLmxlbmd0aFxyXG4gICAgY29uc3QgZ2RMZW5ndGg6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgZ2RMZW5ndGgud3JpdGVVSW50QkUodGhpcy5nZW5lc2lzRGF0YS5sZW5ndGgsIDAsIDQpXHJcbiAgICBiYXJyLnB1c2goZ2RMZW5ndGgpXHJcbiAgICBiYXJyLnB1c2godGhpcy5nZW5lc2lzRGF0YSlcclxuXHJcbiAgICBic2l6ZSArPSB0aGlzLmFsbHljaGFpbkF1dGgudG9CdWZmZXIoKS5sZW5ndGhcclxuICAgIGJhcnIucHVzaCh0aGlzLmFsbHljaGFpbkF1dGgudG9CdWZmZXIoKSlcclxuXHJcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChiYXJyLCBic2l6ZSlcclxuICB9XHJcblxyXG4gIGNsb25lKCk6IHRoaXMge1xyXG4gICAgY29uc3QgbmV3Q3JlYXRlQ2hhaW5UeDogQ3JlYXRlQ2hhaW5UeCA9IG5ldyBDcmVhdGVDaGFpblR4KClcclxuICAgIG5ld0NyZWF0ZUNoYWluVHguZnJvbUJ1ZmZlcih0aGlzLnRvQnVmZmVyKCkpXHJcbiAgICByZXR1cm4gbmV3Q3JlYXRlQ2hhaW5UeCBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcclxuICAgIHJldHVybiBuZXcgQ3JlYXRlQ2hhaW5UeCguLi5hcmdzKSBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuZCBhZGRzIGEgW1tTaWdJZHhdXSB0byB0aGUgW1tBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeF1dLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFkZHJlc3NJZHggVGhlIGluZGV4IG9mIHRoZSBhZGRyZXNzIHRvIHJlZmVyZW5jZSBpbiB0aGUgc2lnbmF0dXJlc1xyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBzb3VyY2Ugb2YgdGhlIHNpZ25hdHVyZVxyXG4gICAqL1xyXG4gIGFkZFNpZ25hdHVyZUlkeChhZGRyZXNzSWR4OiBudW1iZXIsIGFkZHJlc3M6IEJ1ZmZlcik6IHZvaWQge1xyXG4gICAgY29uc3QgYWRkcmVzc0luZGV4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIGFkZHJlc3NJbmRleC53cml0ZVVJbnRCRShhZGRyZXNzSWR4LCAwLCA0KVxyXG4gICAgdGhpcy5hbGx5Y2hhaW5BdXRoLmFkZEFkZHJlc3NJbmRleChhZGRyZXNzSW5kZXgpXHJcblxyXG4gICAgY29uc3Qgc2lnaWR4OiBTaWdJZHggPSBuZXcgU2lnSWR4KClcclxuICAgIGNvbnN0IGI6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgYi53cml0ZVVJbnQzMkJFKGFkZHJlc3NJZHgsIDApXHJcbiAgICBzaWdpZHguZnJvbUJ1ZmZlcihiKVxyXG4gICAgc2lnaWR4LnNldFNvdXJjZShhZGRyZXNzKVxyXG4gICAgdGhpcy5zaWdJZHhzLnB1c2goc2lnaWR4KVxyXG4gICAgdGhpcy5zaWdDb3VudC53cml0ZVVJbnQzMkJFKHRoaXMuc2lnSWR4cy5sZW5ndGgsIDApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBbW1NpZ0lkeF1dIGZvciB0aGlzIFtbSW5wdXRdXVxyXG4gICAqL1xyXG4gIGdldFNpZ0lkeHMoKTogU2lnSWR4W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc2lnSWR4c1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3JlZGVudGlhbElEKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gUGxhdGZvcm1WTUNvbnN0YW50cy5TRUNQQ1JFREVOVElBTFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIGJ5dGVzIG9mIGFuIFtbVW5zaWduZWRUeF1dIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIG1zZyBBIEJ1ZmZlciBmb3IgdGhlIFtbVW5zaWduZWRUeF1dXHJcbiAgICogQHBhcmFtIGtjIEFuIFtbS2V5Q2hhaW5dXSB1c2VkIGluIHNpZ25pbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xyXG4gICAqL1xyXG4gIHNpZ24obXNnOiBCdWZmZXIsIGtjOiBLZXlDaGFpbik6IENyZWRlbnRpYWxbXSB7XHJcbiAgICBjb25zdCBjcmVkczogQ3JlZGVudGlhbFtdID0gc3VwZXIuc2lnbihtc2csIGtjKVxyXG4gICAgY29uc3Qgc2lnaWR4czogU2lnSWR4W10gPSB0aGlzLmdldFNpZ0lkeHMoKVxyXG4gICAgY29uc3QgY3JlZDogQ3JlZGVudGlhbCA9IFNlbGVjdENyZWRlbnRpYWxDbGFzcyh0aGlzLmdldENyZWRlbnRpYWxJRCgpKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHNpZ2lkeHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3Qga2V5cGFpcjogS2V5UGFpciA9IGtjLmdldEtleShzaWdpZHhzW2Ake2l9YF0uZ2V0U291cmNlKCkpXHJcbiAgICAgIGNvbnN0IHNpZ252YWw6IEJ1ZmZlciA9IGtleXBhaXIuc2lnbihtc2cpXHJcbiAgICAgIGNvbnN0IHNpZzogU2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZSgpXHJcbiAgICAgIHNpZy5mcm9tQnVmZmVyKHNpZ252YWwpXHJcbiAgICAgIGNyZWQuYWRkU2lnbmF0dXJlKHNpZylcclxuICAgIH1cclxuICAgIGNyZWRzLnB1c2goY3JlZClcclxuICAgIHJldHVybiBjcmVkc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIENyZWF0ZUNoYWluIHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBPcHRpb25hbCBuZXR3b3JrSUQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcclxuICAgKiBAcGFyYW0gb3V0cyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXNcclxuICAgKiBAcGFyYW0gaW5zIE9wdGlvbmFsIGFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZUlucHV0XV1zXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBtZW1vIGZpZWxkXHJcbiAgICogQHBhcmFtIGFsbHljaGFpbklEIE9wdGlvbmFsIElEIG9mIHRoZSBBbGx5Y2hhaW4gdGhhdCB2YWxpZGF0ZXMgdGhpcyBibG9ja2NoYWluLlxyXG4gICAqIEBwYXJhbSBjaGFpbk5hbWUgT3B0aW9uYWwgQSBodW1hbiByZWFkYWJsZSBuYW1lIGZvciB0aGUgY2hhaW47IG5lZWQgbm90IGJlIHVuaXF1ZVxyXG4gICAqIEBwYXJhbSB2bUlEIE9wdGlvbmFsIElEIG9mIHRoZSBWTSBydW5uaW5nIG9uIHRoZSBuZXcgY2hhaW5cclxuICAgKiBAcGFyYW0gZnhJRHMgT3B0aW9uYWwgSURzIG9mIHRoZSBmZWF0dXJlIGV4dGVuc2lvbnMgcnVubmluZyBvbiB0aGUgbmV3IGNoYWluXHJcbiAgICogQHBhcmFtIGdlbmVzaXNEYXRhIE9wdGlvbmFsIEJ5dGUgcmVwcmVzZW50YXRpb24gb2YgZ2VuZXNpcyBzdGF0ZSBvZiB0aGUgbmV3IGNoYWluXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhbGx5Y2hhaW5JRDogc3RyaW5nIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgY2hhaW5OYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICB2bUlEOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBmeElEczogc3RyaW5nW10gPSB1bmRlZmluZWQsXHJcbiAgICBnZW5lc2lzRGF0YTogc3RyaW5nIHwgR2VuZXNpc0RhdGEgPSB1bmRlZmluZWRcclxuICApIHtcclxuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXHJcbiAgICBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgaWYgKHR5cGVvZiBhbGx5Y2hhaW5JRCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHRoaXMuYWxseWNoYWluSUQgPSBiaW50b29scy5jYjU4RGVjb2RlKGFsbHljaGFpbklEKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYWxseWNoYWluSUQgPSBhbGx5Y2hhaW5JRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNoYWluTmFtZSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMuY2hhaW5OYW1lID0gY2hhaW5OYW1lXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHZtSUQgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjb25zdCBidWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcclxuICAgICAgYnVmLndyaXRlKHZtSUQsIDAsIHZtSUQubGVuZ3RoKVxyXG4gICAgICB0aGlzLnZtSUQgPSBidWZcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZnhJRHMgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLm51bUZYSURzLndyaXRlVUludDMyQkUoZnhJRHMubGVuZ3RoLCAwKVxyXG4gICAgICBjb25zdCBmeElEQnVmczogQnVmZmVyW10gPSBbXVxyXG4gICAgICBmeElEcy5mb3JFYWNoKChmeElEOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgICBjb25zdCBidWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcclxuICAgICAgICBidWYud3JpdGUoZnhJRCwgMCwgZnhJRC5sZW5ndGgsIFwidXRmOFwiKVxyXG4gICAgICAgIGZ4SURCdWZzLnB1c2goYnVmKVxyXG4gICAgICB9KVxyXG4gICAgICB0aGlzLmZ4SURzID0gZnhJREJ1ZnNcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZ2VuZXNpc0RhdGEgIT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZ2VuZXNpc0RhdGEgIT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLmdlbmVzaXNEYXRhID0gZ2VuZXNpc0RhdGEudG9CdWZmZXIoKVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZ2VuZXNpc0RhdGEgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLmdlbmVzaXNEYXRhID0gQnVmZmVyLmZyb20oZ2VuZXNpc0RhdGEpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWxseWNoYWluQXV0aDogQWxseWNoYWluQXV0aCA9IG5ldyBBbGx5Y2hhaW5BdXRoKClcclxuICAgIHRoaXMuYWxseWNoYWluQXV0aCA9IGFsbHljaGFpbkF1dGhcclxuICB9XHJcbn1cclxuIl19