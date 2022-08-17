"use strict";
/**
 * @packageDocumentation
 * @module API-PlatformVM-ValidationTx
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddValidatorTx = exports.AddNominatorTx = exports.WeightedValidatorTx = exports.ValidatorTx = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../utils/bintools"));
const basetx_1 = require("./basetx");
const outputs_1 = require("../platformvm/outputs");
const buffer_1 = require("buffer/");
const constants_1 = require("./constants");
const constants_2 = require("../../utils/constants");
const helperfunctions_1 = require("../../utils/helperfunctions");
const outputs_2 = require("./outputs");
const serialization_1 = require("../../utils/serialization");
const errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Abstract class representing an transactions with validation information.
 */
class ValidatorTx extends basetx_1.BaseTx {
    constructor(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "ValidatorTx";
        this._typeID = undefined;
        this.nodeID = buffer_1.Buffer.alloc(20);
        this.startTime = buffer_1.Buffer.alloc(8);
        this.endTime = buffer_1.Buffer.alloc(8);
        this.nodeID = nodeID;
        this.startTime = bintools.fromBNToBuffer(startTime, 8);
        this.endTime = bintools.fromBNToBuffer(endTime, 8);
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { nodeID: serialization.encoder(this.nodeID, encoding, "Buffer", "nodeID"), startTime: serialization.encoder(this.startTime, encoding, "Buffer", "decimalString"), endTime: serialization.encoder(this.endTime, encoding, "Buffer", "decimalString") });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.nodeID = serialization.decoder(fields["nodeID"], encoding, "nodeID", "Buffer", 20);
        this.startTime = serialization.decoder(fields["startTime"], encoding, "decimalString", "Buffer", 8);
        this.endTime = serialization.decoder(fields["endTime"], encoding, "decimalString", "Buffer", 8);
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
        return (0, helperfunctions_1.bufferToNodeIDString)(this.nodeID);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    getStartTime() {
        return bintools.fromBufferToBN(this.startTime);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    getEndTime() {
        return bintools.fromBufferToBN(this.endTime);
    }
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.nodeID = bintools.copyFrom(bytes, offset, offset + 20);
        offset += 20;
        this.startTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.endTime = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ValidatorTx]].
     */
    toBuffer() {
        const superbuff = super.toBuffer();
        const bsize = superbuff.length +
            this.nodeID.length +
            this.startTime.length +
            this.endTime.length;
        return buffer_1.Buffer.concat([superbuff, this.nodeID, this.startTime, this.endTime], bsize);
    }
}
exports.ValidatorTx = ValidatorTx;
class WeightedValidatorTx extends ValidatorTx {
    /**
     * Class representing an unsigned AddAllychainValidatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param weight Optional. The amount of nAXC the validator is staking.
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, nodeID = undefined, startTime = undefined, endTime = undefined, weight = undefined) {
        super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime);
        this._typeName = "WeightedValidatorTx";
        this._typeID = undefined;
        this.weight = buffer_1.Buffer.alloc(8);
        if (typeof weight !== undefined) {
            this.weight = bintools.fromBNToBuffer(weight, 8);
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { weight: serialization.encoder(this.weight, encoding, "Buffer", "decimalString") });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.weight = serialization.decoder(fields["weight"], encoding, "decimalString", "Buffer", 8);
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    getWeight() {
        return bintools.fromBufferToBN(this.weight);
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    getWeightBuffer() {
        return this.weight;
    }
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.weight = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddAllychainValidatorTx]].
     */
    toBuffer() {
        const superbuff = super.toBuffer();
        return buffer_1.Buffer.concat([superbuff, this.weight]);
    }
}
exports.WeightedValidatorTx = WeightedValidatorTx;
/**
 * Class representing an unsigned AddNominatorTx transaction.
 */
class AddNominatorTx extends WeightedValidatorTx {
    /**
     * Class representing an unsigned AddNominatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param stakeAmount Optional. The amount of nAXC the validator is staking.
     * @param stakeOuts Optional. The outputs used in paying the stake.
     * @param rewardOwners Optional. The [[ParseableOutput]] containing a [[SECPOwnerOutput]] for the rewards.
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, nodeID = undefined, startTime = undefined, endTime = undefined, stakeAmount = undefined, stakeOuts = undefined, rewardOwners = undefined) {
        super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount);
        this._typeName = "AddNominatorTx";
        this._typeID = constants_1.PlatformVMConstants.ADDNOMINATORTX;
        this.stakeOuts = [];
        this.rewardOwners = undefined;
        if (typeof stakeOuts !== undefined) {
            this.stakeOuts = stakeOuts;
        }
        this.rewardOwners = rewardOwners;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { stakeOuts: this.stakeOuts.map((s) => s.serialize(encoding)), rewardOwners: this.rewardOwners.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.stakeOuts = fields["stakeOuts"].map((s) => {
            let xferout = new outputs_1.TransferableOutput();
            xferout.deserialize(s, encoding);
            return xferout;
        });
        this.rewardOwners = new outputs_2.ParseableOutput();
        this.rewardOwners.deserialize(fields["rewardOwners"], encoding);
    }
    /**
     * Returns the id of the [[AddNominatorTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the stake amount.
     */
    getStakeAmount() {
        return this.getWeight();
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    getStakeAmountBuffer() {
        return this.weight;
    }
    /**
     * Returns the array of outputs being staked.
     */
    getStakeOuts() {
        return this.stakeOuts;
    }
    /**
     * Should match stakeAmount. Used in sanity checking.
     */
    getStakeOutsTotal() {
        let val = new bn_js_1.default(0);
        for (let i = 0; i < this.stakeOuts.length; i++) {
            val = val.add(this.stakeOuts[`${i}`].getOutput().getAmount());
        }
        return val;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the reward address.
     */
    getRewardOwners() {
        return this.rewardOwners;
    }
    getTotalOuts() {
        return [...this.getOuts(), ...this.getStakeOuts()];
    }
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        const numstakeouts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const outcount = numstakeouts.readUInt32BE(0);
        this.stakeOuts = [];
        for (let i = 0; i < outcount; i++) {
            const xferout = new outputs_1.TransferableOutput();
            offset = xferout.fromBuffer(bytes, offset);
            this.stakeOuts.push(xferout);
        }
        this.rewardOwners = new outputs_2.ParseableOutput();
        offset = this.rewardOwners.fromBuffer(bytes, offset);
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AddNominatorTx]].
     */
    toBuffer() {
        const superbuff = super.toBuffer();
        let bsize = superbuff.length;
        const numouts = buffer_1.Buffer.alloc(4);
        numouts.writeUInt32BE(this.stakeOuts.length, 0);
        let barr = [super.toBuffer(), numouts];
        bsize += numouts.length;
        this.stakeOuts = this.stakeOuts.sort(outputs_1.TransferableOutput.comparator());
        for (let i = 0; i < this.stakeOuts.length; i++) {
            let out = this.stakeOuts[`${i}`].toBuffer();
            barr.push(out);
            bsize += out.length;
        }
        let ro = this.rewardOwners.toBuffer();
        barr.push(ro);
        bsize += ro.length;
        return buffer_1.Buffer.concat(barr, bsize);
    }
    clone() {
        let newbase = new AddNominatorTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    }
    create(...args) {
        return new AddNominatorTx(...args);
    }
}
exports.AddNominatorTx = AddNominatorTx;
class AddValidatorTx extends AddNominatorTx {
    /**
     * Class representing an unsigned AddValidatorTx transaction.
     *
     * @param networkID Optional. Networkid, [[DefaultNetworkID]]
     * @param blockchainID Optional. Blockchainid, default Buffer.alloc(32, 16)
     * @param outs Optional. Array of the [[TransferableOutput]]s
     * @param ins Optional. Array of the [[TransferableInput]]s
     * @param memo Optional. {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param stakeAmount Optional. The amount of nAXC the validator is staking.
     * @param stakeOuts Optional. The outputs used in paying the stake.
     * @param rewardOwners Optional. The [[ParseableOutput]] containing the [[SECPOwnerOutput]] for the rewards.
     * @param nominationFee Optional. The percent fee this validator charges when others nominate stake to them.
     * Up to 4 decimal places allowed; additional decimal places are ignored. Must be between 0 and 100, inclusive.
     * For example, if nominationFeeRate is 1.2345 and someone nominates to this validator, then when the nomination
     * period is over, 1.2345% of the reward goes to the validator and the rest goes to the nominator.
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, nodeID = undefined, startTime = undefined, endTime = undefined, stakeAmount = undefined, stakeOuts = undefined, rewardOwners = undefined, nominationFee = undefined) {
        super(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, rewardOwners);
        this._typeName = "AddValidatorTx";
        this._typeID = constants_1.PlatformVMConstants.ADDVALIDATORTX;
        this.nominationFee = 0;
        if (typeof nominationFee === "number") {
            if (nominationFee >= 0 && nominationFee <= 100) {
                this.nominationFee = parseFloat(nominationFee.toFixed(4));
            }
            else {
                throw new errors_1.NominationFeeError("AddValidatorTx.constructor -- nominationFee must be in the range of 0 and 100, inclusively.");
            }
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { nominationFee: serialization.encoder(this.getNominationFeeBuffer(), encoding, "Buffer", "decimalString", 4) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        let dbuff = serialization.decoder(fields["nominationFee"], encoding, "decimalString", "Buffer", 4);
        this.nominationFee =
            dbuff.readUInt32BE(0) / AddValidatorTx.nominatorMultiplier;
    }
    /**
     * Returns the id of the [[AddValidatorTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns the nomination fee (represents a percentage from 0 to 100);
     */
    getNominationFee() {
        return this.nominationFee;
    }
    /**
     * Returns the binary representation of the nomination fee as a {@link https://github.com/feross/buffer|Buffer}.
     */
    getNominationFeeBuffer() {
        let dBuff = buffer_1.Buffer.alloc(4);
        let buffnum = parseFloat(this.nominationFee.toFixed(4)) *
            AddValidatorTx.nominatorMultiplier;
        dBuff.writeUInt32BE(buffnum, 0);
        return dBuff;
    }
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        let dbuff = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.nominationFee =
            dbuff.readUInt32BE(0) / AddValidatorTx.nominatorMultiplier;
        return offset;
    }
    toBuffer() {
        let superBuff = super.toBuffer();
        let feeBuff = this.getNominationFeeBuffer();
        return buffer_1.Buffer.concat([superBuff, feeBuff]);
    }
}
exports.AddValidatorTx = AddValidatorTx;
AddValidatorTx.nominatorMultiplier = 10000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbnR4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS92YWxpZGF0aW9udHgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7Ozs7O0FBRUgsa0RBQXNCO0FBQ3RCLG9FQUEyQztBQUMzQyxxQ0FBaUM7QUFDakMsbURBQTBEO0FBRTFELG9DQUFnQztBQUNoQywyQ0FBaUQ7QUFDakQscURBQXdEO0FBQ3hELGlFQUFrRTtBQUNsRSx1Q0FBeUQ7QUFDekQsNkRBQTZFO0FBQzdFLCtDQUF1RDtBQUV2RDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFaEU7O0dBRUc7QUFDSCxNQUFzQixXQUFZLFNBQVEsZUFBTTtJQTBHOUMsWUFDRSxTQUFpQixFQUNqQixZQUFvQixFQUNwQixJQUEwQixFQUMxQixHQUF3QixFQUN4QixJQUFhLEVBQ2IsTUFBZSxFQUNmLFNBQWMsRUFDZCxPQUFZO1FBRVosS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQW5IdkMsY0FBUyxHQUFHLGFBQWEsQ0FBQTtRQUN6QixZQUFPLEdBQUcsU0FBUyxDQUFBO1FBOENuQixXQUFNLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNqQyxjQUFTLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxZQUFPLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQW1FekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNB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Q0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuQyxJQUFJLE9BQU8sR0FDVCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsY0FBYyxDQUFDLG1CQUFtQixDQUFBO1FBQ3BDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQy9CLE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhLEVBQUUsU0FBaUIsQ0FBQztRQUMxQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDeEMsSUFBSSxLQUFLLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUNoRSxNQUFNLElBQUksQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLGFBQWE7WUFDaEIsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxjQUFjLENBQUMsbUJBQW1CLENBQUE7UUFDNUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksU0FBUyxHQUFXLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN4QyxJQUFJLE9BQU8sR0FBVyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtRQUNuRCxPQUFPLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUM1QyxDQUFDOztBQXhFSCx3Q0FrSUM7QUFuR2dCLGtDQUFtQixHQUFXLEtBQUssQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBBUEktUGxhdGZvcm1WTS1WYWxpZGF0aW9uVHhcclxuICovXHJcblxyXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuL2Jhc2V0eFwiXHJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuLi9wbGF0Zm9ybXZtL291dHB1dHNcIlxyXG5pbXBvcnQgeyBUcmFuc2ZlcmFibGVJbnB1dCB9IGZyb20gXCIuLi9wbGF0Zm9ybXZtL2lucHV0c1wiXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IHsgUGxhdGZvcm1WTUNvbnN0YW50cyB9IGZyb20gXCIuL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgYnVmZmVyVG9Ob2RlSURTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IHsgQW1vdW50T3V0cHV0LCBQYXJzZWFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZEVuY29kaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5pbXBvcnQgeyBOb21pbmF0aW9uRmVlRXJyb3IgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcclxuXHJcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqL1xyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcclxuXHJcbi8qKlxyXG4gKiBBYnN0cmFjdCBjbGFzcyByZXByZXNlbnRpbmcgYW4gdHJhbnNhY3Rpb25zIHdpdGggdmFsaWRhdGlvbiBpbmZvcm1hdGlvbi5cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWYWxpZGF0b3JUeCBleHRlbmRzIEJhc2VUeCB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiVmFsaWRhdG9yVHhcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIG5vZGVJRDogc2VyaWFsaXphdGlvbi5lbmNvZGVyKHRoaXMubm9kZUlELCBlbmNvZGluZywgXCJCdWZmZXJcIiwgXCJub2RlSURcIiksXHJcbiAgICAgIHN0YXJ0VGltZTogc2VyaWFsaXphdGlvbi5lbmNvZGVyKFxyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgIFwiQnVmZmVyXCIsXHJcbiAgICAgICAgXCJkZWNpbWFsU3RyaW5nXCJcclxuICAgICAgKSxcclxuICAgICAgZW5kVGltZTogc2VyaWFsaXphdGlvbi5lbmNvZGVyKFxyXG4gICAgICAgIHRoaXMuZW5kVGltZSxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICAgIFwiZGVjaW1hbFN0cmluZ1wiXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5ub2RlSUQgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgIGZpZWxkc1tcIm5vZGVJRFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwibm9kZUlEXCIsXHJcbiAgICAgIFwiQnVmZmVyXCIsXHJcbiAgICAgIDIwXHJcbiAgICApXHJcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wic3RhcnRUaW1lXCJdLFxyXG4gICAgICBlbmNvZGluZyxcclxuICAgICAgXCJkZWNpbWFsU3RyaW5nXCIsXHJcbiAgICAgIFwiQnVmZmVyXCIsXHJcbiAgICAgIDhcclxuICAgIClcclxuICAgIHRoaXMuZW5kVGltZSA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wiZW5kVGltZVwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICA4XHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgbm9kZUlEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMjApXHJcbiAgcHJvdGVjdGVkIHN0YXJ0VGltZTogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDgpXHJcbiAgcHJvdGVjdGVkIGVuZFRpbWU6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg4KVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBzdGFrZSBhbW91bnQuXHJcbiAgICovXHJcbiAgZ2V0Tm9kZUlEKCk6IEJ1ZmZlciB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzdHJpbmcgZm9yIHRoZSBub2RlSUQgYW1vdW50LlxyXG4gICAqL1xyXG4gIGdldE5vZGVJRFN0cmluZygpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGJ1ZmZlclRvTm9kZUlEU3RyaW5nKHRoaXMubm9kZUlEKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0gZm9yIHRoZSBzdGFrZSBhbW91bnQuXHJcbiAgICovXHJcbiAgZ2V0U3RhcnRUaW1lKCkge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKHRoaXMuc3RhcnRUaW1lKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgc3Rha2UgYW1vdW50LlxyXG4gICAqL1xyXG4gIGdldEVuZFRpbWUoKSB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuZnJvbUJ1ZmZlclRvQk4odGhpcy5lbmRUaW1lKVxyXG4gIH1cclxuXHJcbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gICAgb2Zmc2V0ID0gc3VwZXIuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gICAgdGhpcy5ub2RlSUQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAyMClcclxuICAgIG9mZnNldCArPSAyMFxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA4KVxyXG4gICAgb2Zmc2V0ICs9IDhcclxuICAgIHRoaXMuZW5kVGltZSA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDgpXHJcbiAgICBvZmZzZXQgKz0gOFxyXG4gICAgcmV0dXJuIG9mZnNldFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW1ZhbGlkYXRvclR4XV0uXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHN1cGVyYnVmZjogQnVmZmVyID0gc3VwZXIudG9CdWZmZXIoKVxyXG4gICAgY29uc3QgYnNpemU6IG51bWJlciA9XHJcbiAgICAgIHN1cGVyYnVmZi5sZW5ndGggK1xyXG4gICAgICB0aGlzLm5vZGVJRC5sZW5ndGggK1xyXG4gICAgICB0aGlzLnN0YXJ0VGltZS5sZW5ndGggK1xyXG4gICAgICB0aGlzLmVuZFRpbWUubGVuZ3RoXHJcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChcclxuICAgICAgW3N1cGVyYnVmZiwgdGhpcy5ub2RlSUQsIHRoaXMuc3RhcnRUaW1lLCB0aGlzLmVuZFRpbWVdLFxyXG4gICAgICBic2l6ZVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10sXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10sXHJcbiAgICBtZW1vPzogQnVmZmVyLFxyXG4gICAgbm9kZUlEPzogQnVmZmVyLFxyXG4gICAgc3RhcnRUaW1lPzogQk4sXHJcbiAgICBlbmRUaW1lPzogQk5cclxuICApIHtcclxuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXHJcbiAgICB0aGlzLm5vZGVJRCA9IG5vZGVJRFxyXG4gICAgdGhpcy5zdGFydFRpbWUgPSBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihzdGFydFRpbWUsIDgpXHJcbiAgICB0aGlzLmVuZFRpbWUgPSBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihlbmRUaW1lLCA4KVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFdlaWdodGVkVmFsaWRhdG9yVHggZXh0ZW5kcyBWYWxpZGF0b3JUeCB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiV2VpZ2h0ZWRWYWxpZGF0b3JUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcclxuXHJcbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcclxuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLmZpZWxkcyxcclxuICAgICAgd2VpZ2h0OiBzZXJpYWxpemF0aW9uLmVuY29kZXIoXHJcbiAgICAgICAgdGhpcy53ZWlnaHQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgICBcImRlY2ltYWxTdHJpbmdcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfVxyXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xyXG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcclxuICAgIHRoaXMud2VpZ2h0ID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICBmaWVsZHNbXCJ3ZWlnaHRcIl0sXHJcbiAgICAgIGVuY29kaW5nLFxyXG4gICAgICBcImRlY2ltYWxTdHJpbmdcIixcclxuICAgICAgXCJCdWZmZXJcIixcclxuICAgICAgOFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHdlaWdodDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDgpXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSBmb3IgdGhlIHN0YWtlIGFtb3VudC5cclxuICAgKi9cclxuICBnZXRXZWlnaHQoKTogQk4ge1xyXG4gICAgcmV0dXJuIGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKHRoaXMud2VpZ2h0KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgc3Rha2UgYW1vdW50LlxyXG4gICAqL1xyXG4gIGdldFdlaWdodEJ1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMud2VpZ2h0XHJcbiAgfVxyXG5cclxuICBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyID0gMCk6IG51bWJlciB7XHJcbiAgICBvZmZzZXQgPSBzdXBlci5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXHJcbiAgICB0aGlzLndlaWdodCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDgpXHJcbiAgICBvZmZzZXQgKz0gOFxyXG4gICAgcmV0dXJuIG9mZnNldFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0FkZEFsbHljaGFpblZhbGlkYXRvclR4XV0uXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHN1cGVyYnVmZjogQnVmZmVyID0gc3VwZXIudG9CdWZmZXIoKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3N1cGVyYnVmZiwgdGhpcy53ZWlnaHRdKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIEFkZEFsbHljaGFpblZhbGlkYXRvclR4IHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBPcHRpb25hbC4gTmV0d29ya2lkLCBbW0RlZmF1bHROZXR3b3JrSURdXVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwuIEJsb2NrY2hhaW5pZCwgZGVmYXVsdCBCdWZmZXIuYWxsb2MoMzIsIDE2KVxyXG4gICAqIEBwYXJhbSBvdXRzIE9wdGlvbmFsLiBBcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXNcclxuICAgKiBAcGFyYW0gaW5zIE9wdGlvbmFsLiBBcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIG1lbW8gZmllbGRcclxuICAgKiBAcGFyYW0gbm9kZUlEIE9wdGlvbmFsLiBUaGUgbm9kZSBJRCBvZiB0aGUgdmFsaWRhdG9yIGJlaW5nIGFkZGVkLlxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgT3B0aW9uYWwuIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0YXJ0cyB2YWxpZGF0aW5nIHRoZSBQcmltYXJ5IE5ldHdvcmsuXHJcbiAgICogQHBhcmFtIGVuZFRpbWUgT3B0aW9uYWwuIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0b3BzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yayAoYW5kIHN0YWtlZCBBWEMgaXMgcmV0dXJuZWQpLlxyXG4gICAqIEBwYXJhbSB3ZWlnaHQgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgbkFYQyB0aGUgdmFsaWRhdG9yIGlzIHN0YWtpbmcuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIHN0YXJ0VGltZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBlbmRUaW1lOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHdlaWdodDogQk4gPSB1bmRlZmluZWRcclxuICApIHtcclxuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8sIG5vZGVJRCwgc3RhcnRUaW1lLCBlbmRUaW1lKVxyXG4gICAgaWYgKHR5cGVvZiB3ZWlnaHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLndlaWdodCA9IGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKHdlaWdodCwgOClcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgQWRkTm9taW5hdG9yVHggdHJhbnNhY3Rpb24uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQWRkTm9taW5hdG9yVHggZXh0ZW5kcyBXZWlnaHRlZFZhbGlkYXRvclR4IHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJBZGROb21pbmF0b3JUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSBQbGF0Zm9ybVZNQ29uc3RhbnRzLkFERE5PTUlOQVRPUlRYXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIHN0YWtlT3V0czogdGhpcy5zdGFrZU91dHMubWFwKChzKSA9PiBzLnNlcmlhbGl6ZShlbmNvZGluZykpLFxyXG4gICAgICByZXdhcmRPd25lcnM6IHRoaXMucmV3YXJkT3duZXJzLnNlcmlhbGl6ZShlbmNvZGluZylcclxuICAgIH1cclxuICB9XHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5zdGFrZU91dHMgPSBmaWVsZHNbXCJzdGFrZU91dHNcIl0ubWFwKChzOiBvYmplY3QpID0+IHtcclxuICAgICAgbGV0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG4gICAgICB4ZmVyb3V0LmRlc2VyaWFsaXplKHMsIGVuY29kaW5nKVxyXG4gICAgICByZXR1cm4geGZlcm91dFxyXG4gICAgfSlcclxuICAgIHRoaXMucmV3YXJkT3duZXJzID0gbmV3IFBhcnNlYWJsZU91dHB1dCgpXHJcbiAgICB0aGlzLnJld2FyZE93bmVycy5kZXNlcmlhbGl6ZShmaWVsZHNbXCJyZXdhcmRPd25lcnNcIl0sIGVuY29kaW5nKVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gIHByb3RlY3RlZCByZXdhcmRPd25lcnM6IFBhcnNlYWJsZU91dHB1dCA9IHVuZGVmaW5lZFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgW1tBZGROb21pbmF0b3JUeF1dXHJcbiAgICovXHJcbiAgZ2V0VHhUeXBlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdHlwZUlEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0gZm9yIHRoZSBzdGFrZSBhbW91bnQuXHJcbiAgICovXHJcbiAgZ2V0U3Rha2VBbW91bnQoKTogQk4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0V2VpZ2h0KClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIHN0YWtlIGFtb3VudC5cclxuICAgKi9cclxuICBnZXRTdGFrZUFtb3VudEJ1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMud2VpZ2h0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBvdXRwdXRzIGJlaW5nIHN0YWtlZC5cclxuICAgKi9cclxuICBnZXRTdGFrZU91dHMoKTogVHJhbnNmZXJhYmxlT3V0cHV0W10ge1xyXG4gICAgcmV0dXJuIHRoaXMuc3Rha2VPdXRzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaG91bGQgbWF0Y2ggc3Rha2VBbW91bnQuIFVzZWQgaW4gc2FuaXR5IGNoZWNraW5nLlxyXG4gICAqL1xyXG4gIGdldFN0YWtlT3V0c1RvdGFsKCk6IEJOIHtcclxuICAgIGxldCB2YWw6IEJOID0gbmV3IEJOKDApXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5zdGFrZU91dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFsID0gdmFsLmFkZChcclxuICAgICAgICAodGhpcy5zdGFrZU91dHNbYCR7aX1gXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIHJldHVybiB2YWxcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIHJld2FyZCBhZGRyZXNzLlxyXG4gICAqL1xyXG4gIGdldFJld2FyZE93bmVycygpOiBQYXJzZWFibGVPdXRwdXQge1xyXG4gICAgcmV0dXJuIHRoaXMucmV3YXJkT3duZXJzXHJcbiAgfVxyXG5cclxuICBnZXRUb3RhbE91dHMoKTogVHJhbnNmZXJhYmxlT3V0cHV0W10ge1xyXG4gICAgcmV0dXJuIFsuLi4odGhpcy5nZXRPdXRzKCkgYXMgVHJhbnNmZXJhYmxlT3V0cHV0W10pLCAuLi50aGlzLmdldFN0YWtlT3V0cygpXVxyXG4gIH1cclxuXHJcbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gICAgb2Zmc2V0ID0gc3VwZXIuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gICAgY29uc3QgbnVtc3Rha2VvdXRzID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgNClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICBjb25zdCBvdXRjb3VudDogbnVtYmVyID0gbnVtc3Rha2VvdXRzLnJlYWRVSW50MzJCRSgwKVxyXG4gICAgdGhpcy5zdGFrZU91dHMgPSBbXVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG91dGNvdW50OyBpKyspIHtcclxuICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dCgpXHJcbiAgICAgIG9mZnNldCA9IHhmZXJvdXQuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gICAgICB0aGlzLnN0YWtlT3V0cy5wdXNoKHhmZXJvdXQpXHJcbiAgICB9XHJcbiAgICB0aGlzLnJld2FyZE93bmVycyA9IG5ldyBQYXJzZWFibGVPdXRwdXQoKVxyXG4gICAgb2Zmc2V0ID0gdGhpcy5yZXdhcmRPd25lcnMuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gICAgcmV0dXJuIG9mZnNldFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0FkZE5vbWluYXRvclR4XV0uXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHN1cGVyYnVmZjogQnVmZmVyID0gc3VwZXIudG9CdWZmZXIoKVxyXG4gICAgbGV0IGJzaXplOiBudW1iZXIgPSBzdXBlcmJ1ZmYubGVuZ3RoXHJcbiAgICBjb25zdCBudW1vdXRzOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIG51bW91dHMud3JpdGVVSW50MzJCRSh0aGlzLnN0YWtlT3V0cy5sZW5ndGgsIDApXHJcbiAgICBsZXQgYmFycjogQnVmZmVyW10gPSBbc3VwZXIudG9CdWZmZXIoKSwgbnVtb3V0c11cclxuICAgIGJzaXplICs9IG51bW91dHMubGVuZ3RoXHJcbiAgICB0aGlzLnN0YWtlT3V0cyA9IHRoaXMuc3Rha2VPdXRzLnNvcnQoVHJhbnNmZXJhYmxlT3V0cHV0LmNvbXBhcmF0b3IoKSlcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnN0YWtlT3V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgb3V0OiBCdWZmZXIgPSB0aGlzLnN0YWtlT3V0c1tgJHtpfWBdLnRvQnVmZmVyKClcclxuICAgICAgYmFyci5wdXNoKG91dClcclxuICAgICAgYnNpemUgKz0gb3V0Lmxlbmd0aFxyXG4gICAgfVxyXG4gICAgbGV0IHJvOiBCdWZmZXIgPSB0aGlzLnJld2FyZE93bmVycy50b0J1ZmZlcigpXHJcbiAgICBiYXJyLnB1c2gocm8pXHJcbiAgICBic2l6ZSArPSByby5sZW5ndGhcclxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KGJhcnIsIGJzaXplKVxyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBsZXQgbmV3YmFzZTogQWRkTm9taW5hdG9yVHggPSBuZXcgQWRkTm9taW5hdG9yVHgoKVxyXG4gICAgbmV3YmFzZS5mcm9tQnVmZmVyKHRoaXMudG9CdWZmZXIoKSlcclxuICAgIHJldHVybiBuZXdiYXNlIGFzIHRoaXNcclxuICB9XHJcblxyXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBBZGROb21pbmF0b3JUeCguLi5hcmdzKSBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgQWRkTm9taW5hdG9yVHggdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE9wdGlvbmFsLiBOZXR3b3JraWQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbC4gQmxvY2tjaGFpbmlkLCBkZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXHJcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwuIEFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZU91dHB1dF1dc1xyXG4gICAqIEBwYXJhbSBpbnMgT3B0aW9uYWwuIEFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZUlucHV0XV1zXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwuIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgbWVtbyBmaWVsZFxyXG4gICAqIEBwYXJhbSBub2RlSUQgT3B0aW9uYWwuIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3IgYmVpbmcgYWRkZWQuXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBPcHRpb25hbC4gVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RhcnRzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yay5cclxuICAgKiBAcGFyYW0gZW5kVGltZSBPcHRpb25hbC4gVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RvcHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrIChhbmQgc3Rha2VkIEFYQyBpcyByZXR1cm5lZCkuXHJcbiAgICogQHBhcmFtIHN0YWtlQW1vdW50IE9wdGlvbmFsLiBUaGUgYW1vdW50IG9mIG5BWEMgdGhlIHZhbGlkYXRvciBpcyBzdGFraW5nLlxyXG4gICAqIEBwYXJhbSBzdGFrZU91dHMgT3B0aW9uYWwuIFRoZSBvdXRwdXRzIHVzZWQgaW4gcGF5aW5nIHRoZSBzdGFrZS5cclxuICAgKiBAcGFyYW0gcmV3YXJkT3duZXJzIE9wdGlvbmFsLiBUaGUgW1tQYXJzZWFibGVPdXRwdXRdXSBjb250YWluaW5nIGEgW1tTRUNQT3duZXJPdXRwdXRdXSBmb3IgdGhlIHJld2FyZHMuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIHN0YXJ0VGltZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBlbmRUaW1lOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHN0YWtlQW1vdW50OiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICByZXdhcmRPd25lcnM6IFBhcnNlYWJsZU91dHB1dCA9IHVuZGVmaW5lZFxyXG4gICkge1xyXG4gICAgc3VwZXIoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG5vZGVJRCxcclxuICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICBlbmRUaW1lLFxyXG4gICAgICBzdGFrZUFtb3VudFxyXG4gICAgKVxyXG4gICAgaWYgKHR5cGVvZiBzdGFrZU91dHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnN0YWtlT3V0cyA9IHN0YWtlT3V0c1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZXdhcmRPd25lcnMgPSByZXdhcmRPd25lcnNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBZGRWYWxpZGF0b3JUeCBleHRlbmRzIEFkZE5vbWluYXRvclR4IHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJBZGRWYWxpZGF0b3JUeFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSBQbGF0Zm9ybVZNQ29uc3RhbnRzLkFERFZBTElEQVRPUlRYXHJcblxyXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XHJcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIG5vbWluYXRpb25GZWU6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcclxuICAgICAgICB0aGlzLmdldE5vbWluYXRpb25GZWVCdWZmZXIoKSxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICAgIDRcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICBsZXQgZGJ1ZmY6IEJ1ZmZlciA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgZmllbGRzW1wibm9taW5hdGlvbkZlZVwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICBcIkJ1ZmZlclwiLFxyXG4gICAgICA0XHJcbiAgICApXHJcbiAgICB0aGlzLm5vbWluYXRpb25GZWUgPVxyXG4gICAgICBkYnVmZi5yZWFkVUludDMyQkUoMCkgLyBBZGRWYWxpZGF0b3JUeC5ub21pbmF0b3JNdWx0aXBsaWVyXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgbm9taW5hdGlvbkZlZTogbnVtYmVyID0gMFxyXG4gIHByaXZhdGUgc3RhdGljIG5vbWluYXRvck11bHRpcGxpZXI6IG51bWJlciA9IDEwMDAwXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBbW0FkZFZhbGlkYXRvclR4XV1cclxuICAgKi9cclxuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl90eXBlSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIG5vbWluYXRpb24gZmVlIChyZXByZXNlbnRzIGEgcGVyY2VudGFnZSBmcm9tIDAgdG8gMTAwKTtcclxuICAgKi9cclxuICBnZXROb21pbmF0aW9uRmVlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5ub21pbmF0aW9uRmVlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5vbWluYXRpb24gZmVlIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0uXHJcbiAgICovXHJcbiAgZ2V0Tm9taW5hdGlvbkZlZUJ1ZmZlcigpOiBCdWZmZXIge1xyXG4gICAgbGV0IGRCdWZmOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIGxldCBidWZmbnVtOiBudW1iZXIgPVxyXG4gICAgICBwYXJzZUZsb2F0KHRoaXMubm9taW5hdGlvbkZlZS50b0ZpeGVkKDQpKSAqXHJcbiAgICAgIEFkZFZhbGlkYXRvclR4Lm5vbWluYXRvck11bHRpcGxpZXJcclxuICAgIGRCdWZmLndyaXRlVUludDMyQkUoYnVmZm51bSwgMClcclxuICAgIHJldHVybiBkQnVmZlxyXG4gIH1cclxuXHJcbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gICAgb2Zmc2V0ID0gc3VwZXIuZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxyXG4gICAgbGV0IGRidWZmOiBCdWZmZXIgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxyXG4gICAgb2Zmc2V0ICs9IDRcclxuICAgIHRoaXMubm9taW5hdGlvbkZlZSA9XHJcbiAgICAgIGRidWZmLnJlYWRVSW50MzJCRSgwKSAvIEFkZFZhbGlkYXRvclR4Lm5vbWluYXRvck11bHRpcGxpZXJcclxuICAgIHJldHVybiBvZmZzZXRcclxuICB9XHJcblxyXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XHJcbiAgICBsZXQgc3VwZXJCdWZmOiBCdWZmZXIgPSBzdXBlci50b0J1ZmZlcigpXHJcbiAgICBsZXQgZmVlQnVmZjogQnVmZmVyID0gdGhpcy5nZXROb21pbmF0aW9uRmVlQnVmZmVyKClcclxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KFtzdXBlckJ1ZmYsIGZlZUJ1ZmZdKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIEFkZFZhbGlkYXRvclR4IHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBPcHRpb25hbC4gTmV0d29ya2lkLCBbW0RlZmF1bHROZXR3b3JrSURdXVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwuIEJsb2NrY2hhaW5pZCwgZGVmYXVsdCBCdWZmZXIuYWxsb2MoMzIsIDE2KVxyXG4gICAqIEBwYXJhbSBvdXRzIE9wdGlvbmFsLiBBcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXNcclxuICAgKiBAcGFyYW0gaW5zIE9wdGlvbmFsLiBBcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIG1lbW8gZmllbGRcclxuICAgKiBAcGFyYW0gbm9kZUlEIE9wdGlvbmFsLiBUaGUgbm9kZSBJRCBvZiB0aGUgdmFsaWRhdG9yIGJlaW5nIGFkZGVkLlxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgT3B0aW9uYWwuIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0YXJ0cyB2YWxpZGF0aW5nIHRoZSBQcmltYXJ5IE5ldHdvcmsuXHJcbiAgICogQHBhcmFtIGVuZFRpbWUgT3B0aW9uYWwuIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0b3BzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yayAoYW5kIHN0YWtlZCBBWEMgaXMgcmV0dXJuZWQpLlxyXG4gICAqIEBwYXJhbSBzdGFrZUFtb3VudCBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBuQVhDIHRoZSB2YWxpZGF0b3IgaXMgc3Rha2luZy5cclxuICAgKiBAcGFyYW0gc3Rha2VPdXRzIE9wdGlvbmFsLiBUaGUgb3V0cHV0cyB1c2VkIGluIHBheWluZyB0aGUgc3Rha2UuXHJcbiAgICogQHBhcmFtIHJld2FyZE93bmVycyBPcHRpb25hbC4gVGhlIFtbUGFyc2VhYmxlT3V0cHV0XV0gY29udGFpbmluZyB0aGUgW1tTRUNQT3duZXJPdXRwdXRdXSBmb3IgdGhlIHJld2FyZHMuXHJcbiAgICogQHBhcmFtIG5vbWluYXRpb25GZWUgT3B0aW9uYWwuIFRoZSBwZXJjZW50IGZlZSB0aGlzIHZhbGlkYXRvciBjaGFyZ2VzIHdoZW4gb3RoZXJzIG5vbWluYXRlIHN0YWtlIHRvIHRoZW0uXHJcbiAgICogVXAgdG8gNCBkZWNpbWFsIHBsYWNlcyBhbGxvd2VkOyBhZGRpdGlvbmFsIGRlY2ltYWwgcGxhY2VzIGFyZSBpZ25vcmVkLiBNdXN0IGJlIGJldHdlZW4gMCBhbmQgMTAwLCBpbmNsdXNpdmUuXHJcbiAgICogRm9yIGV4YW1wbGUsIGlmIG5vbWluYXRpb25GZWVSYXRlIGlzIDEuMjM0NSBhbmQgc29tZW9uZSBub21pbmF0ZXMgdG8gdGhpcyB2YWxpZGF0b3IsIHRoZW4gd2hlbiB0aGUgbm9taW5hdGlvblxyXG4gICAqIHBlcmlvZCBpcyBvdmVyLCAxLjIzNDUlIG9mIHRoZSByZXdhcmQgZ29lcyB0byB0aGUgdmFsaWRhdG9yIGFuZCB0aGUgcmVzdCBnb2VzIHRvIHRoZSBub21pbmF0b3IuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxyXG4gICAgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIHN0YXJ0VGltZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBlbmRUaW1lOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHN0YWtlQW1vdW50OiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICByZXdhcmRPd25lcnM6IFBhcnNlYWJsZU91dHB1dCA9IHVuZGVmaW5lZCxcclxuICAgIG5vbWluYXRpb25GZWU6IG51bWJlciA9IHVuZGVmaW5lZFxyXG4gICkge1xyXG4gICAgc3VwZXIoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG5vZGVJRCxcclxuICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICBlbmRUaW1lLFxyXG4gICAgICBzdGFrZUFtb3VudCxcclxuICAgICAgc3Rha2VPdXRzLFxyXG4gICAgICByZXdhcmRPd25lcnNcclxuICAgIClcclxuICAgIGlmICh0eXBlb2Ygbm9taW5hdGlvbkZlZSA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICBpZiAobm9taW5hdGlvbkZlZSA+PSAwICYmIG5vbWluYXRpb25GZWUgPD0gMTAwKSB7XHJcbiAgICAgICAgdGhpcy5ub21pbmF0aW9uRmVlID0gcGFyc2VGbG9hdChub21pbmF0aW9uRmVlLnRvRml4ZWQoNCkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE5vbWluYXRpb25GZWVFcnJvcihcclxuICAgICAgICAgIFwiQWRkVmFsaWRhdG9yVHguY29uc3RydWN0b3IgLS0gbm9taW5hdGlvbkZlZSBtdXN0IGJlIGluIHRoZSByYW5nZSBvZiAwIGFuZCAxMDAsIGluY2x1c2l2ZWx5LlwiXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==