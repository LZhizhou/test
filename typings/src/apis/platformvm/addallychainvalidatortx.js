"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAllychainValidatorTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-AddAllychainValidatorTx
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const credentials_1 = require("../../common/credentials");
const basetx_1 = require("./basetx");
const constants_2 = require("../../utils/constants");
const serialization_1 = require("../../utils/serialization");
const _1 = require(".");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned AddAllychainValidatorTx transaction.
 */
class AddAllychainValidatorTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned CreateChain transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param weight Optional. Weight of this validator used when sampling
     * @param allychainID Optional. ID of the allychain this validator is validating
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, nodeID = undefined, startTime = undefined, endTime = undefined, weight = undefined, allychainID = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "AddAllychainValidatorTx";
        this._typeID = constants_1.PlatformVMConstants.ADDALLYCHAINVALIDATORTX;
        this.nodeID = buffer_1.Buffer.alloc(20);
        this.startTime = buffer_1.Buffer.alloc(8);
        this.endTime = buffer_1.Buffer.alloc(8);
        this.weight = buffer_1.Buffer.alloc(8);
        this.allychainID = buffer_1.Buffer.alloc(32);
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
        if (typeof nodeID != "undefined") {
            this.nodeID = nodeID;
        }
        if (typeof startTime != "undefined") {
            this.startTime = bintools.fromBNToBuffer(startTime, 8);
        }
        if (typeof endTime != "undefined") {
            this.endTime = bintools.fromBNToBuffer(endTime, 8);
        }
        if (typeof weight != "undefined") {
            this.weight = bintools.fromBNToBuffer(weight, 8);
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
     * Returns the id of the [[AddAllychainValidatorTx]]
     */
    getTxType() {
        return constants_1.PlatformVMConstants.ADDALLYCHAINVALIDATORTX;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    getNodeID() {
        return this.nodeID;
    }
    /**
     * Returns a string for the nodeID amount.
     */
    getNodeIDString() {
        return (0, utils_1.bufferToNodeIDString)(this.nodeID);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the startTime.
     */
    getStartTime() {
        return bintools.fromBufferToBN(this.startTime);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the endTime.
     */
    getEndTime() {
        return bintools.fromBufferToBN(this.endTime);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the weight
     */
    getWeight() {
        return bintools.fromBufferToBN(this.weight);
    }
    /**
     * Returns the allychainID as a string
     */
    getAllychainID() {
        return bintools.cb58Encode(this.allychainID);
    }
    /**
     * Returns the allychainAuth
     */
    getAllychainAuth() {
        return this.allychainAuth;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[AddAllychainValidatorTx]], parses it, populates the class, and returns the length of the [[CreateChainTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[AddAllychainValidatorTx]]
     *
     * @returns The length of the raw [[AddAllychainValidatorTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.nodeID = bintools.copyFrom(bytes, offset, offset + 20);
        offset += 20;
        this.startTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.endTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.weight = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.allychainID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
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
        const bsize = superbuff.length +
            this.nodeID.length +
            this.startTime.length +
            this.endTime.length +
            this.weight.length +
            this.allychainID.length +
            this.allychainAuth.toBuffer().length;
        const barr = [
            superbuff,
            this.nodeID,
            this.startTime,
            this.endTime,
            this.weight,
            this.allychainID,
            this.allychainAuth.toBuffer()
        ];
        return buffer_1.Buffer.concat(barr, bsize);
    }
    clone() {
        const newAddAllychainValidatorTx = new AddAllychainValidatorTx();
        newAddAllychainValidatorTx.fromBuffer(this.toBuffer());
        return newAddAllychainValidatorTx;
    }
    create(...args) {
        return new AddAllychainValidatorTx(...args);
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
exports.AddAllychainValidatorTx = AddAllychainValidatorTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkYWxseWNoYWludmFsaWRhdG9ydHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2FkZGFsbHljaGFpbnZhbGlkYXRvcnR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxvRUFBMkM7QUFDM0MsMkNBQWlEO0FBR2pELDBEQUF3RTtBQUN4RSxxQ0FBaUM7QUFDakMscURBQXdEO0FBQ3hELDZEQUE2RTtBQUM3RSx3QkFBd0Q7QUFHeEQsdUNBQWtEO0FBRWxEOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGFBQWEsR0FBa0IsNkJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVoRTs7R0FFRztBQUNILE1BQWEsdUJBQXdCLFNBQVEsZUFBTTtJQStOakQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILFlBQ0UsWUFBb0IsNEJBQWdCLEVBQ3BDLGVBQXVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQyxPQUE2QixTQUFTLEVBQ3RDLE1BQTJCLFNBQVMsRUFDcEMsT0FBZSxTQUFTLEVBQ3hCLFNBQWlCLFNBQVMsRUFDMUIsWUFBZ0IsU0FBUyxFQUN6QixVQUFjLFNBQVMsRUFDdkIsU0FBYSxTQUFTLEVBQ3RCLGNBQStCLFNBQVM7UUFFeEMsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQXhQdkMsY0FBUyxHQUFHLHlCQUF5QixDQUFBO1FBQ3JDLFlBQU8sR0FBRywrQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQTtRQStCckQsV0FBTSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakMsY0FBUyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMs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QUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQy9DLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLElBQUksR0FBZSxJQUFBLHdCQUFxQixFQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFBO1FBQ3RFLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLE1BQU0sT0FBTyxHQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDekMsTUFBTSxHQUFHLEdBQWMsSUFBSSx1QkFBUyxFQUFFLENBQUE7WUFDdEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1NBQ3ZCO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoQixPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7Q0FvREY7QUFqUkQsMERBaVJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1QbGF0Zm9ybVZNLUFkZEFsbHljaGFpblZhbGlkYXRvclR4XHJcbiAqL1xyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgVHJhbnNmZXJhYmxlT3V0cHV0IH0gZnJvbSBcIi4vb3V0cHV0c1wiXHJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHsgQ3JlZGVudGlhbCwgU2lnSWR4LCBTaWduYXR1cmUgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2NyZWRlbnRpYWxzXCJcclxuaW1wb3J0IHsgQmFzZVR4IH0gZnJvbSBcIi4vYmFzZXR4XCJcclxuaW1wb3J0IHsgRGVmYXVsdE5ldHdvcmtJRCB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXHJcbmltcG9ydCB7IFNlbGVjdENyZWRlbnRpYWxDbGFzcywgQWxseWNoYWluQXV0aCB9IGZyb20gXCIuXCJcclxuaW1wb3J0IHsgS2V5Q2hhaW4sIEtleVBhaXIgfSBmcm9tIFwiLi9rZXljaGFpblwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBidWZmZXJUb05vZGVJRFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlsc1wiXHJcblxyXG4vKipcclxuICogQGlnbm9yZVxyXG4gKi9cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXHJcblxyXG4vKipcclxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIEFkZEFsbHljaGFpblZhbGlkYXRvclR4IHRyYW5zYWN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFkZEFsbHljaGFpblZhbGlkYXRvclR4IGV4dGVuZHMgQmFzZVR4IHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSBQbGF0Zm9ybVZNQ29uc3RhbnRzLkFEREFMTFlDSEFJTlZBTElEQVRPUlRYXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIGFsbHljaGFpbklEOiBzZXJpYWxpemF0aW9uLmVuY29kZXIoXHJcbiAgICAgICAgdGhpcy5hbGx5Y2hhaW5JRCxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICAgIFwiY2I1OFwiXHJcbiAgICAgIClcclxuICAgICAgLy8gZXhwb3J0T3V0czogdGhpcy5leHBvcnRPdXRzLm1hcCgoZSkgPT4gZS5zZXJpYWxpemUoZW5jb2RpbmcpKVxyXG4gICAgfVxyXG4gIH1cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICB0aGlzLmFsbHljaGFpbklEID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICBmaWVsZHNbXCJhbGx5Y2hhaW5JRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwiY2I1OFwiLFxyXG4gICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICAzMlxyXG4gICAgKVxyXG4gICAgLy8gdGhpcy5leHBvcnRPdXRzID0gZmllbGRzW1wiZXhwb3J0T3V0c1wiXS5tYXAoKGU6IG9iamVjdCkgPT4ge1xyXG4gICAgLy8gICBsZXQgZW86IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG4gICAgLy8gICBlby5kZXNlcmlhbGl6ZShlLCBlbmNvZGluZylcclxuICAgIC8vICAgcmV0dXJuIGVvXHJcbiAgICAvLyB9KVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIG5vZGVJRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDIwKVxyXG4gIHByb3RlY3RlZCBzdGFydFRpbWU6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg4KVxyXG4gIHByb3RlY3RlZCBlbmRUaW1lOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoOClcclxuICBwcm90ZWN0ZWQgd2VpZ2h0OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoOClcclxuICBwcm90ZWN0ZWQgYWxseWNoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcclxuICBwcm90ZWN0ZWQgYWxseWNoYWluQXV0aDogQWxseWNoYWluQXV0aFxyXG4gIHByb3RlY3RlZCBzaWdDb3VudDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgcHJvdGVjdGVkIHNpZ0lkeHM6IFNpZ0lkeFtdID0gW10gLy8gaWR4cyBvZiBhbGx5Y2hhaW4gYXV0aCBzaWduZXJzXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBbW0FkZEFsbHljaGFpblZhbGlkYXRvclR4XV1cclxuICAgKi9cclxuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBQbGF0Zm9ybVZNQ29uc3RhbnRzLkFEREFMTFlDSEFJTlZBTElEQVRPUlRYXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBzdGFrZSBhbW91bnQuXHJcbiAgICovXHJcbiAgZ2V0Tm9kZUlEKCk6IEJ1ZmZlciB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzdHJpbmcgZm9yIHRoZSBub2RlSUQgYW1vdW50LlxyXG4gICAqL1xyXG4gIGdldE5vZGVJRFN0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJ1ZmZlclRvTm9kZUlEU3RyaW5nKHRoaXMubm9kZUlEKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgc3RhcnRUaW1lLlxyXG4gICAqL1xyXG4gIGdldFN0YXJ0VGltZSgpOiBCTiB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuZnJvbUJ1ZmZlclRvQk4odGhpcy5zdGFydFRpbWUpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0gZm9yIHRoZSBlbmRUaW1lLlxyXG4gICAqL1xyXG4gIGdldEVuZFRpbWUoKTogQk4ge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKHRoaXMuZW5kVGltZSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSBmb3IgdGhlIHdlaWdodFxyXG4gICAqL1xyXG4gIGdldFdlaWdodCgpOiBCTiB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuZnJvbUJ1ZmZlclRvQk4odGhpcy53ZWlnaHQpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhbGx5Y2hhaW5JRCBhcyBhIHN0cmluZ1xyXG4gICAqL1xyXG4gIGdldEFsbHljaGFpbklEKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuY2I1OEVuY29kZSh0aGlzLmFsbHljaGFpbklEKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhbGx5Y2hhaW5BdXRoXHJcbiAgICovXHJcbiAgZ2V0QWxseWNoYWluQXV0aCgpOiBBbGx5Y2hhaW5BdXRoIHtcclxuICAgIHJldHVybiB0aGlzLmFsbHljaGFpbkF1dGhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyBhbiBbW0FkZEFsbHljaGFpblZhbGlkYXRvclR4XV0sIHBhcnNlcyBpdCwgcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgW1tDcmVhdGVDaGFpblR4XV0gaW4gYnl0ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYnl0ZXMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGEgcmF3IFtbQWRkQWxseWNoYWluVmFsaWRhdG9yVHhdXVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbQWRkQWxseWNoYWluVmFsaWRhdG9yVHhdXVxyXG4gICAqXHJcbiAgICogQHJlbWFya3MgYXNzdW1lIG5vdC1jaGVja3N1bW1lZFxyXG4gICAqL1xyXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICAgIG9mZnNldCA9IHN1cGVyLmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcclxuXHJcbiAgICB0aGlzLm5vZGVJRCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDIwKVxyXG4gICAgb2Zmc2V0ICs9IDIwXHJcblxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA4KVxyXG4gICAgb2Zmc2V0ICs9IDhcclxuXHJcbiAgICB0aGlzLmVuZFRpbWUgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA4KVxyXG4gICAgb2Zmc2V0ICs9IDhcclxuXHJcbiAgICB0aGlzLndlaWdodCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDgpXHJcbiAgICBvZmZzZXQgKz0gOFxyXG5cclxuICAgIHRoaXMuYWxseWNoYWluSUQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAzMilcclxuICAgIG9mZnNldCArPSAzMlxyXG5cclxuICAgIGNvbnN0IHNhOiBBbGx5Y2hhaW5BdXRoID0gbmV3IEFsbHljaGFpbkF1dGgoKVxyXG4gICAgb2Zmc2V0ICs9IHNhLmZyb21CdWZmZXIoYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCkpXHJcbiAgICB0aGlzLmFsbHljaGFpbkF1dGggPSBzYVxyXG5cclxuICAgIHJldHVybiBvZmZzZXRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tDcmVhdGVDaGFpblR4XV0uXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHN1cGVyYnVmZjogQnVmZmVyID0gc3VwZXIudG9CdWZmZXIoKVxyXG5cclxuICAgIGNvbnN0IGJzaXplOiBudW1iZXIgPVxyXG4gICAgICBzdXBlcmJ1ZmYubGVuZ3RoICtcclxuICAgICAgdGhpcy5ub2RlSUQubGVuZ3RoICtcclxuICAgICAgdGhpcy5zdGFydFRpbWUubGVuZ3RoICtcclxuICAgICAgdGhpcy5lbmRUaW1lLmxlbmd0aCArXHJcbiAgICAgIHRoaXMud2VpZ2h0Lmxlbmd0aCArXHJcbiAgICAgIHRoaXMuYWxseWNoYWluSUQubGVuZ3RoICtcclxuICAgICAgdGhpcy5hbGx5Y2hhaW5BdXRoLnRvQnVmZmVyKCkubGVuZ3RoXHJcblxyXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbXHJcbiAgICAgIHN1cGVyYnVmZixcclxuICAgICAgdGhpcy5ub2RlSUQsXHJcbiAgICAgIHRoaXMuc3RhcnRUaW1lLFxyXG4gICAgICB0aGlzLmVuZFRpbWUsXHJcbiAgICAgIHRoaXMud2VpZ2h0LFxyXG4gICAgICB0aGlzLmFsbHljaGFpbklELFxyXG4gICAgICB0aGlzLmFsbHljaGFpbkF1dGgudG9CdWZmZXIoKVxyXG4gICAgXVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoYmFyciwgYnNpemUpXHJcbiAgfVxyXG5cclxuICBjbG9uZSgpOiB0aGlzIHtcclxuICAgIGNvbnN0IG5ld0FkZEFsbHljaGFpblZhbGlkYXRvclR4OiBBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeCA9XHJcbiAgICAgIG5ldyBBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeCgpXHJcbiAgICBuZXdBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeC5mcm9tQnVmZmVyKHRoaXMudG9CdWZmZXIoKSlcclxuICAgIHJldHVybiBuZXdBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeCBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcclxuICAgIHJldHVybiBuZXcgQWRkQWxseWNoYWluVmFsaWRhdG9yVHgoLi4uYXJncykgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbmQgYWRkcyBhIFtbU2lnSWR4XV0gdG8gdGhlIFtbQWRkQWxseWNoYWluVmFsaWRhdG9yVHhdXS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhZGRyZXNzSWR4IFRoZSBpbmRleCBvZiB0aGUgYWRkcmVzcyB0byByZWZlcmVuY2UgaW4gdGhlIHNpZ25hdHVyZXNcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUgc291cmNlIG9mIHRoZSBzaWduYXR1cmVcclxuICAgKi9cclxuICBhZGRTaWduYXR1cmVJZHgoYWRkcmVzc0lkeDogbnVtYmVyLCBhZGRyZXNzOiBCdWZmZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGFkZHJlc3NJbmRleDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICBhZGRyZXNzSW5kZXgud3JpdGVVSW50QkUoYWRkcmVzc0lkeCwgMCwgNClcclxuICAgIHRoaXMuYWxseWNoYWluQXV0aC5hZGRBZGRyZXNzSW5kZXgoYWRkcmVzc0luZGV4KVxyXG5cclxuICAgIGNvbnN0IHNpZ2lkeDogU2lnSWR4ID0gbmV3IFNpZ0lkeCgpXHJcbiAgICBjb25zdCBiOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIGIud3JpdGVVSW50MzJCRShhZGRyZXNzSWR4LCAwKVxyXG4gICAgc2lnaWR4LmZyb21CdWZmZXIoYilcclxuICAgIHNpZ2lkeC5zZXRTb3VyY2UoYWRkcmVzcylcclxuICAgIHRoaXMuc2lnSWR4cy5wdXNoKHNpZ2lkeClcclxuICAgIHRoaXMuc2lnQ291bnQud3JpdGVVSW50MzJCRSh0aGlzLnNpZ0lkeHMubGVuZ3RoLCAwKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgW1tTaWdJZHhdXSBmb3IgdGhpcyBbW0lucHV0XV1cclxuICAgKi9cclxuICBnZXRTaWdJZHhzKCk6IFNpZ0lkeFtdIHtcclxuICAgIHJldHVybiB0aGlzLnNpZ0lkeHNcclxuICB9XHJcblxyXG4gIGdldENyZWRlbnRpYWxJRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIFBsYXRmb3JtVk1Db25zdGFudHMuU0VDUENSRURFTlRJQUxcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSBieXRlcyBvZiBhbiBbW1Vuc2lnbmVkVHhdXSBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcclxuICAgKlxyXG4gICAqIEBwYXJhbSBtc2cgQSBCdWZmZXIgZm9yIHRoZSBbW1Vuc2lnbmVkVHhdXVxyXG4gICAqIEBwYXJhbSBrYyBBbiBbW0tleUNoYWluXV0gdXNlZCBpbiBzaWduaW5nXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcclxuICAgKi9cclxuICBzaWduKG1zZzogQnVmZmVyLCBrYzogS2V5Q2hhaW4pOiBDcmVkZW50aWFsW10ge1xyXG4gICAgY29uc3QgY3JlZHM6IENyZWRlbnRpYWxbXSA9IHN1cGVyLnNpZ24obXNnLCBrYylcclxuICAgIGNvbnN0IHNpZ2lkeHM6IFNpZ0lkeFtdID0gdGhpcy5nZXRTaWdJZHhzKClcclxuICAgIGNvbnN0IGNyZWQ6IENyZWRlbnRpYWwgPSBTZWxlY3RDcmVkZW50aWFsQ2xhc3ModGhpcy5nZXRDcmVkZW50aWFsSUQoKSlcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaWdpZHhzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGtleXBhaXI6IEtleVBhaXIgPSBrYy5nZXRLZXkoc2lnaWR4c1tgJHtpfWBdLmdldFNvdXJjZSgpKVxyXG4gICAgICBjb25zdCBzaWdudmFsOiBCdWZmZXIgPSBrZXlwYWlyLnNpZ24obXNnKVxyXG4gICAgICBjb25zdCBzaWc6IFNpZ25hdHVyZSA9IG5ldyBTaWduYXR1cmUoKVxyXG4gICAgICBzaWcuZnJvbUJ1ZmZlcihzaWdudmFsKVxyXG4gICAgICBjcmVkLmFkZFNpZ25hdHVyZShzaWcpXHJcbiAgICB9XHJcbiAgICBjcmVkcy5wdXNoKGNyZWQpXHJcbiAgICByZXR1cm4gY3JlZHNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhbiB1bnNpZ25lZCBDcmVhdGVDaGFpbiB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgT3B0aW9uYWwgbmV0d29ya0lELCBbW0RlZmF1bHROZXR3b3JrSURdXVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwgYmxvY2tjaGFpbklELCBkZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXHJcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXHJcbiAgICogQHBhcmFtIGlucyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgbWVtbyBmaWVsZFxyXG4gICAqIEBwYXJhbSBub2RlSUQgT3B0aW9uYWwuIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3IgYmVpbmcgYWRkZWQuXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBPcHRpb25hbC4gVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RhcnRzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yay5cclxuICAgKiBAcGFyYW0gZW5kVGltZSBPcHRpb25hbC4gVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RvcHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrIChhbmQgc3Rha2VkIEFYQyBpcyByZXR1cm5lZCkuXHJcbiAgICogQHBhcmFtIHdlaWdodCBPcHRpb25hbC4gV2VpZ2h0IG9mIHRoaXMgdmFsaWRhdG9yIHVzZWQgd2hlbiBzYW1wbGluZ1xyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5JRCBPcHRpb25hbC4gSUQgb2YgdGhlIGFsbHljaGFpbiB0aGlzIHZhbGlkYXRvciBpcyB2YWxpZGF0aW5nXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIHN0YXJ0VGltZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBlbmRUaW1lOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHdlaWdodDogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBhbGx5Y2hhaW5JRDogc3RyaW5nIHwgQnVmZmVyID0gdW5kZWZpbmVkXHJcbiAgKSB7XHJcbiAgICBzdXBlcihuZXR3b3JrSUQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zLCBtZW1vKVxyXG4gICAgaWYgKHR5cGVvZiBhbGx5Y2hhaW5JRCAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICB0aGlzLmFsbHljaGFpbklEID0gYmludG9vbHMuY2I1OERlY29kZShhbGx5Y2hhaW5JRClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBub2RlSUQgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLm5vZGVJRCA9IG5vZGVJRFxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzdGFydFRpbWUgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKHN0YXJ0VGltZSwgOClcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZW5kVGltZSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMuZW5kVGltZSA9IGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKGVuZFRpbWUsIDgpXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHdlaWdodCAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMud2VpZ2h0ID0gYmludG9vbHMuZnJvbUJOVG9CdWZmZXIod2VpZ2h0LCA4KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFsbHljaGFpbkF1dGg6IEFsbHljaGFpbkF1dGggPSBuZXcgQWxseWNoYWluQXV0aCgpXHJcbiAgICB0aGlzLmFsbHljaGFpbkF1dGggPSBhbGx5Y2hhaW5BdXRoXHJcbiAgfVxyXG59XHJcbiJdfQ==