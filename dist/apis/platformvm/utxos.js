"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOSet = exports.AssetAmountDestination = exports.UTXO = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-UTXOs
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const outputs_1 = require("./outputs");
const inputs_1 = require("./inputs");
const helperfunctions_1 = require("../../utils/helperfunctions");
const utxos_1 = require("../../common/utxos");
const constants_1 = require("./constants");
const tx_1 = require("./tx");
const exporttx_1 = require("../platformvm/exporttx");
const constants_2 = require("../../utils/constants");
const importtx_1 = require("../platformvm/importtx");
const basetx_1 = require("../platformvm/basetx");
const assetamount_1 = require("../../common/assetamount");
const validationtx_1 = require("./validationtx");
const createallychaintx_1 = require("./createallychaintx");
const serialization_1 = require("../../utils/serialization");
const errors_1 = require("../../utils/errors");
const _1 = require(".");
const addallychainvalidatortx_1 = require("../platformvm/addallychainvalidatortx");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Class for representing a single UTXO.
 */
class UTXO extends utxos_1.StandardUTXO {
    constructor() {
        super(...arguments);
        this._typeName = "UTXO";
        this._typeID = undefined;
    }
    //serialize is inherited
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.output = (0, outputs_1.SelectOutputClass)(fields["output"]["_typeID"]);
        this.output.deserialize(fields["output"], encoding);
    }
    fromBuffer(bytes, offset = 0) {
        this.codecID = bintools.copyFrom(bytes, offset, offset + 2);
        offset += 2;
        this.txid = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.outputidx = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        this.assetID = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        const outputid = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.output = (0, outputs_1.SelectOutputClass)(outputid);
        return this.output.fromBuffer(bytes, offset);
    }
    /**
     * Takes a base-58 string containing a [[UTXO]], parses it, populates the class, and returns the length of the StandardUTXO in bytes.
     *
     * @param serialized A base-58 string containing a raw [[UTXO]]
     *
     * @returns The length of the raw [[UTXO]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    fromString(serialized) {
        /* istanbul ignore next */
        return this.fromBuffer(bintools.cb58Decode(serialized));
    }
    /**
     * Returns a base-58 representation of the [[UTXO]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    toString() {
        /* istanbul ignore next */
        return bintools.cb58Encode(this.toBuffer());
    }
    clone() {
        const utxo = new UTXO();
        utxo.fromBuffer(this.toBuffer());
        return utxo;
    }
    create(codecID = constants_1.PlatformVMConstants.LATESTCODEC, txid = undefined, outputidx = undefined, assetID = undefined, output = undefined) {
        return new UTXO(codecID, txid, outputidx, assetID, output);
    }
}
exports.UTXO = UTXO;
class AssetAmountDestination extends assetamount_1.StandardAssetAmountDestination {
}
exports.AssetAmountDestination = AssetAmountDestination;
/**
 * Class representing a set of [[UTXO]]s.
 */
class UTXOSet extends utxos_1.StandardUTXOSet {
    constructor() {
        super(...arguments);
        this._typeName = "UTXOSet";
        this._typeID = undefined;
        this.getConsumableUXTO = (asOf = (0, helperfunctions_1.UnixNow)(), stakeable = false) => {
            return this.getAllUTXOs().filter((utxo) => {
                if (stakeable) {
                    // stakeable transactions can consume any UTXO.
                    return true;
                }
                const output = utxo.getOutput();
                if (!(output instanceof outputs_1.StakeableLockOut)) {
                    // non-stakeable transactions can consume any UTXO that isn't locked.
                    return true;
                }
                const stakeableOutput = output;
                if (stakeableOutput.getStakeableLocktime().lt(asOf)) {
                    // If the stakeable outputs locktime has ended, then this UTXO can still
                    // be consumed by a non-stakeable transaction.
                    return true;
                }
                // This output is locked and can't be consumed by a non-stakeable
                // transaction.
                return false;
            });
        };
        this.getMinimumSpendable = (aad, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1, stakeable = false) => {
            let utxoArray = this.getConsumableUXTO(asOf, stakeable);
            let tmpUTXOArray = [];
            if (stakeable) {
                // If this is a stakeable transaction then have StakeableLockOut come before SECPTransferOutput
                // so that users first stake locked tokens before staking unlocked tokens
                utxoArray.forEach((utxo) => {
                    // StakeableLockOuts
                    if (utxo.getOutput().getTypeID() === 22) {
                        tmpUTXOArray.push(utxo);
                    }
                });
                // Sort the StakeableLockOuts by StakeableLocktime so that the greatest StakeableLocktime are spent first
                tmpUTXOArray.sort((a, b) => {
                    let stakeableLockOut1 = a.getOutput();
                    let stakeableLockOut2 = b.getOutput();
                    return (stakeableLockOut2.getStakeableLocktime().toNumber() -
                        stakeableLockOut1.getStakeableLocktime().toNumber());
                });
                utxoArray.forEach((utxo) => {
                    // SECPTransferOutputs
                    if (utxo.getOutput().getTypeID() === 7) {
                        tmpUTXOArray.push(utxo);
                    }
                });
                utxoArray = tmpUTXOArray;
            }
            // outs is a map from assetID to a tuple of (lockedStakeable, unlocked)
            // which are arrays of outputs.
            const outs = {};
            // We only need to iterate over UTXOs until we have spent sufficient funds
            // to met the requested amounts.
            utxoArray.forEach((utxo, index) => {
                const assetID = utxo.getAssetID();
                const assetKey = assetID.toString("hex");
                const fromAddresses = aad.getSenders();
                const output = utxo.getOutput();
                if (!(output instanceof outputs_1.AmountOutput) ||
                    !aad.assetExists(assetKey) ||
                    !output.meetsThreshold(fromAddresses, asOf)) {
                    // We should only try to spend fungible assets.
                    // We should only spend {{ assetKey }}.
                    // We need to be able to spend the output.
                    return;
                }
                const assetAmount = aad.getAssetAmount(assetKey);
                if (assetAmount.isFinished()) {
                    // We've already spent the needed UTXOs for this assetID.
                    return;
                }
                if (!(assetKey in outs)) {
                    // If this is the first time spending this assetID, we need to
                    // initialize the outs object correctly.
                    outs[`${assetKey}`] = {
                        lockedStakeable: [],
                        unlocked: []
                    };
                }
                const amountOutput = output;
                // amount is the amount of funds available from this UTXO.
                const amount = amountOutput.getAmount();
                // Set up the SECP input with the same amount as the output.
                let input = new inputs_1.SECPTransferInput(amount);
                let locked = false;
                if (amountOutput instanceof outputs_1.StakeableLockOut) {
                    const stakeableOutput = amountOutput;
                    const stakeableLocktime = stakeableOutput.getStakeableLocktime();
                    if (stakeableLocktime.gt(asOf)) {
                        // Add a new input and mark it as being locked.
                        input = new inputs_1.StakeableLockIn(amount, stakeableLocktime, new inputs_1.ParseableInput(input));
                        // Mark this UTXO as having been re-locked.
                        locked = true;
                    }
                }
                assetAmount.spendAmount(amount, locked);
                if (locked) {
                    // Track the UTXO as locked.
                    outs[`${assetKey}`].lockedStakeable.push(amountOutput);
                }
                else {
                    // Track the UTXO as unlocked.
                    outs[`${assetKey}`].unlocked.push(amountOutput);
                }
                // Get the indices of the outputs that should be used to authorize the
                // spending of this input.
                // TODO: getSpenders should return an array of indices rather than an
                // array of addresses.
                const spenders = amountOutput.getSpenders(fromAddresses, asOf);
                spenders.forEach((spender) => {
                    const idx = amountOutput.getAddressIdx(spender);
                    if (idx === -1) {
                        // This should never happen, which is why the error is thrown rather
                        // than being returned. If this were to ever happen this would be an
                        // error in the internal logic rather having called this function with
                        // invalid arguments.
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such " +
                            `address in output: ${spender}`);
                    }
                    input.addSignatureIdx(idx, spender);
                });
                const txID = utxo.getTxID();
                const outputIdx = utxo.getOutputIdx();
                const transferInput = new inputs_1.TransferableInput(txID, outputIdx, assetID, input);
                aad.addInput(transferInput);
            });
            if (!aad.canComplete()) {
                // After running through all the UTXOs, we still weren't able to get all
                // the necessary funds, so this transaction can't be made.
                return new errors_1.InsufficientFundsError("Error - UTXOSet.getMinimumSpendable: insufficient " +
                    "funds to create the transaction");
            }
            // TODO: We should separate the above functionality into a single function
            // that just selects the UTXOs to consume.
            const zero = new bn_js_1.default(0);
            // assetAmounts is an array of asset descriptions and how much is left to
            // spend for them.
            const assetAmounts = aad.getAmounts();
            assetAmounts.forEach((assetAmount) => {
                // change is the amount that should be returned back to the source of the
                // funds.
                const change = assetAmount.getChange();
                // isStakeableLockChange is if the change is locked or not.
                const isStakeableLockChange = assetAmount.getStakeableLockChange();
                // lockedChange is the amount of locked change that should be returned to
                // the sender
                const lockedChange = isStakeableLockChange ? change : zero.clone();
                const assetID = assetAmount.getAssetID();
                const assetKey = assetAmount.getAssetIDString();
                const lockedOutputs = outs[`${assetKey}`].lockedStakeable;
                lockedOutputs.forEach((lockedOutput, i) => {
                    const stakeableLocktime = lockedOutput.getStakeableLocktime();
                    const parseableOutput = lockedOutput.getTransferableOutput();
                    // We know that parseableOutput contains an AmountOutput because the
                    // first loop filters for fungible assets.
                    const output = parseableOutput.getOutput();
                    let outputAmountRemaining = output.getAmount();
                    // The only output that could generate change is the last output.
                    // Otherwise, any further UTXOs wouldn't have needed to be spent.
                    if (i == lockedOutputs.length - 1 && lockedChange.gt(zero)) {
                        // update outputAmountRemaining to no longer hold the change that we
                        // are returning.
                        outputAmountRemaining = outputAmountRemaining.sub(lockedChange);
                        // Create the inner output.
                        const newChangeOutput = (0, outputs_1.SelectOutputClass)(output.getOutputID(), lockedChange, output.getAddresses(), output.getLocktime(), output.getThreshold());
                        // Wrap the inner output in the StakeableLockOut wrapper.
                        let newLockedChangeOutput = (0, outputs_1.SelectOutputClass)(lockedOutput.getOutputID(), lockedChange, output.getAddresses(), output.getLocktime(), output.getThreshold(), stakeableLocktime, new outputs_1.ParseableOutput(newChangeOutput));
                        const transferOutput = new outputs_1.TransferableOutput(assetID, newLockedChangeOutput);
                        aad.addChange(transferOutput);
                    }
                    // We know that outputAmountRemaining > 0. Otherwise, we would never
                    // have consumed this UTXO, as it would be only change.
                    // Create the inner output.
                    const newOutput = (0, outputs_1.SelectOutputClass)(output.getOutputID(), outputAmountRemaining, output.getAddresses(), output.getLocktime(), output.getThreshold());
                    // Wrap the inner output in the StakeableLockOut wrapper.
                    const newLockedOutput = (0, outputs_1.SelectOutputClass)(lockedOutput.getOutputID(), outputAmountRemaining, output.getAddresses(), output.getLocktime(), output.getThreshold(), stakeableLocktime, new outputs_1.ParseableOutput(newOutput));
                    const transferOutput = new outputs_1.TransferableOutput(assetID, newLockedOutput);
                    aad.addOutput(transferOutput);
                });
                // unlockedChange is the amount of unlocked change that should be returned
                // to the sender
                const unlockedChange = isStakeableLockChange ? zero.clone() : change;
                if (unlockedChange.gt(zero)) {
                    const newChangeOutput = new outputs_1.SECPTransferOutput(unlockedChange, aad.getChangeAddresses(), zero.clone(), // make sure that we don't lock the change output.
                    1 // only require one of the changes addresses to spend this output.
                    );
                    const transferOutput = new outputs_1.TransferableOutput(assetID, newChangeOutput);
                    aad.addChange(transferOutput);
                }
                // totalAmountSpent is the total amount of tokens consumed.
                const totalAmountSpent = assetAmount.getSpent();
                // stakeableLockedAmount is the total amount of locked tokens consumed.
                const stakeableLockedAmount = assetAmount.getStakeableLockSpent();
                // totalUnlockedSpent is the total amount of unlocked tokens consumed.
                const totalUnlockedSpent = totalAmountSpent.sub(stakeableLockedAmount);
                // amountBurnt is the amount of unlocked tokens that must be burn.
                const amountBurnt = assetAmount.getBurn();
                // totalUnlockedAvailable is the total amount of unlocked tokens available
                // to be produced.
                const totalUnlockedAvailable = totalUnlockedSpent.sub(amountBurnt);
                // unlockedAmount is the amount of unlocked tokens that should be sent.
                const unlockedAmount = totalUnlockedAvailable.sub(unlockedChange);
                if (unlockedAmount.gt(zero)) {
                    const newOutput = new outputs_1.SECPTransferOutput(unlockedAmount, aad.getDestinations(), locktime, threshold);
                    const transferOutput = new outputs_1.TransferableOutput(assetID, newOutput);
                    aad.addOutput(transferOutput);
                }
            });
            return undefined;
        };
        /**
         * Creates an [[UnsignedTx]] wrapping a [[BaseTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] wrapping a [[BaseTx]] manually (with their corresponding [[TransferableInput]]s and [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount of the asset to be spent in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}.
         * @param assetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for the UTXO
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned. Default: assetID
         * @param memo Optional. Contains arbitrary data, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildBaseTx = (networkID, blockchainID, amount, assetID, toAddresses, fromAddresses, changeAddresses = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            if (threshold > toAddresses.length) {
                /* istanbul ignore next */
                throw new errors_1.ThresholdError("Error - UTXOSet.buildBaseTx: threshold is greater than number of addresses");
            }
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            if (typeof feeAssetID === "undefined") {
                feeAssetID = assetID;
            }
            const zero = new bn_js_1.default(0);
            if (amount.eq(zero)) {
                return undefined;
            }
            const aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (assetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(assetID, amount, fee);
            }
            else {
                aad.addAssetAmount(assetID, amount, zero);
                if (this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            let ins = [];
            let outs = [];
            const minSpendableErr = this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getAllOutputs();
            }
            else {
                throw minSpendableErr;
            }
            const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins, memo);
            return new tx_1.UnsignedTx(baseTx);
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
         * @param importIns An array of [[TransferableInput]]s being imported
         * @param sourceChain A {@link https://github.com/feross/buffer|Buffer} for the chainid where the imports are coming from.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}. Fee will come from the inputs first, if they can.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildImportTx = (networkID, blockchainID, toAddresses, fromAddresses, changeAddresses, atomics, sourceChain = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
            if (typeof fee === "undefined") {
                fee = zero.clone();
            }
            const importIns = [];
            let feepaid = new bn_js_1.default(0);
            let feeAssetStr = feeAssetID.toString("hex");
            for (let i = 0; i < atomics.length; i++) {
                const utxo = atomics[`${i}`];
                const assetID = utxo.getAssetID();
                const output = utxo.getOutput();
                let amt = output.getAmount().clone();
                let infeeamount = amt.clone();
                let assetStr = assetID.toString("hex");
                if (typeof feeAssetID !== "undefined" &&
                    fee.gt(zero) &&
                    feepaid.lt(fee) &&
                    assetStr === feeAssetStr) {
                    feepaid = feepaid.add(infeeamount);
                    if (feepaid.gte(fee)) {
                        infeeamount = feepaid.sub(fee);
                        feepaid = fee.clone();
                    }
                    else {
                        infeeamount = zero.clone();
                    }
                }
                const txid = utxo.getTxID();
                const outputidx = utxo.getOutputIdx();
                const input = new inputs_1.SECPTransferInput(amt);
                const xferin = new inputs_1.TransferableInput(txid, outputidx, assetID, input);
                const from = output.getAddresses();
                const spenders = output.getSpenders(from, asOf);
                for (let j = 0; j < spenders.length; j++) {
                    const idx = output.getAddressIdx(spenders[`${j}`]);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildImportTx: no such " +
                            `address in output: ${spenders[`${j}`]}`);
                    }
                    xferin.getInput().addSignatureIdx(idx, spenders[`${j}`]);
                }
                importIns.push(xferin);
                //add extra outputs for each amount (calculated from the imported inputs), minus fees
                if (infeeamount.gt(zero)) {
                    const spendout = (0, outputs_1.SelectOutputClass)(output.getOutputID(), infeeamount, toAddresses, locktime, threshold);
                    const xferout = new outputs_1.TransferableOutput(assetID, spendout);
                    outs.push(xferout);
                }
            }
            // get remaining fees from the provided addresses
            let feeRemaining = fee.sub(feepaid);
            if (feeRemaining.gt(zero) && this._feeCheck(feeRemaining, feeAssetID)) {
                const aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, feeRemaining);
                const minSpendableErr = this.getMinimumSpendable(aad, asOf, locktime, threshold);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
                }
            }
            const importTx = new importtx_1.ImportTx(networkID, blockchainID, outs, ins, memo, sourceChain, importIns);
            return new tx_1.UnsignedTx(importTx);
        };
        /**
         * Creates an unsigned ExportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who recieves the AXC
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who owns the AXC
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover of the AXC
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildExportTx = (networkID, blockchainID, amount, axcAssetID, // TODO: rename this to amountAssetID
        toAddresses, fromAddresses, changeAddresses = undefined, destinationChain = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            let ins = [];
            let outs = [];
            let exportouts = [];
            if (typeof changeAddresses === "undefined") {
                changeAddresses = toAddresses;
            }
            const zero = new bn_js_1.default(0);
            if (amount.eq(zero)) {
                return undefined;
            }
            if (typeof feeAssetID === "undefined") {
                feeAssetID = axcAssetID;
            }
            else if (feeAssetID.toString("hex") !== axcAssetID.toString("hex")) {
                /* istanbul ignore next */
                throw new errors_1.FeeAssetError("Error - UTXOSet.buildExportTx: " + `feeAssetID must match axcAssetID`);
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.Defaults.network[`${networkID}`].Swap["blockchainID"]);
            }
            const aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (axcAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(axcAssetID, amount, fee);
            }
            else {
                aad.addAssetAmount(axcAssetID, amount, zero);
                if (this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            const minSpendableErr = this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                exportouts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            const exportTx = new exporttx_1.ExportTx(networkID, blockchainID, outs, ins, memo, destinationChain, exportouts);
            return new tx_1.UnsignedTx(exportTx);
        };
        /**
         * Class representing an unsigned [[AddAllychainValidatorTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees in AXC
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param weight The amount of weight for this allychain validator.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddAllychainValidatorTx = (networkID = constants_2.DefaultNetworkID, blockchainID, fromAddresses, changeAddresses, nodeID, startTime, endTime, weight, allychainID, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), allychainAuthCredentials = []) => {
            let ins = [];
            let outs = [];
            const zero = new bn_js_1.default(0);
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new Error("UTXOSet.buildAddAllychainValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            if (this._feeCheck(fee, feeAssetID)) {
                const aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                const success = this.getMinimumSpendable(aad, asOf);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
                }
            }
            const addAllychainValidatorTx = new addallychainvalidatortx_1.AddAllychainValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, weight, allychainID);
            allychainAuthCredentials.forEach((allychainAuthCredential) => {
                addAllychainValidatorTx.addSignatureIdx(allychainAuthCredential[0], allychainAuthCredential[1]);
            });
            return new tx_1.UnsignedTx(addAllychainValidatorTx);
        };
        /**
         * Class representing an unsigned [[AddNominatorTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be nominated in nAXC.
         * @param rewardLocktime The locktime field created in the resulting reward outputs
         * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
         * @param rewardAddresses The addresses the validator reward goes.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddNominatorTx = (networkID = constants_2.DefaultNetworkID, blockchainID, axcAssetID, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewardAddresses, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            let ins = [];
            let outs = [];
            let stakeOuts = [];
            const zero = new bn_js_1.default(0);
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("UTXOSet.buildAddNominatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            const aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (axcAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(axcAssetID, stakeAmount, fee);
            }
            else {
                aad.addAssetAmount(axcAssetID, stakeAmount, zero);
                if (this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            const minSpendableErr = this.getMinimumSpendable(aad, asOf, undefined, undefined, true);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                stakeOuts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            const rewardOutputOwners = new outputs_1.SECPOwnerOutput(rewardAddresses, rewardLocktime, rewardThreshold);
            const UTx = new validationtx_1.AddNominatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, new outputs_1.ParseableOutput(rewardOutputOwners));
            return new tx_1.UnsignedTx(UTx);
        };
        /**
         * Class representing an unsigned [[AddValidatorTx]] transaction.
         *
         * @param networkID NetworkID, [[DefaultNetworkID]]
         * @param blockchainID BlockchainID, default undefined
         * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be nominated in nAXC.
         * @param rewardLocktime The locktime field created in the resulting reward outputs
         * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
         * @param rewardAddresses The addresses the validator reward goes.
         * @param nominationFee A number for the percentage of reward to be given to the validator when someone nominates to them. Must be between 0 and 100.
         * @param minStake A {@link https://github.com/indutny/bn.js/|BN} representing the minimum stake required to validate on this network.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddValidatorTx = (networkID = constants_2.DefaultNetworkID, blockchainID, axcAssetID, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewardAddresses, nominationFee, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            let ins = [];
            let outs = [];
            let stakeOuts = [];
            const zero = new bn_js_1.default(0);
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("UTXOSet.buildAddValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            if (nominationFee > 100 || nominationFee < 0) {
                throw new errors_1.TimeError("UTXOSet.buildAddValidatorTx -- startTime must be in the range of 0 to 100, inclusively");
            }
            const aad = new AssetAmountDestination(toAddresses, fromAddresses, changeAddresses);
            if (axcAssetID.toString("hex") === feeAssetID.toString("hex")) {
                aad.addAssetAmount(axcAssetID, stakeAmount, fee);
            }
            else {
                aad.addAssetAmount(axcAssetID, stakeAmount, zero);
                if (this._feeCheck(fee, feeAssetID)) {
                    aad.addAssetAmount(feeAssetID, zero, fee);
                }
            }
            const minSpendableErr = this.getMinimumSpendable(aad, asOf, undefined, undefined, true);
            if (typeof minSpendableErr === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                stakeOuts = aad.getOutputs();
            }
            else {
                throw minSpendableErr;
            }
            const rewardOutputOwners = new outputs_1.SECPOwnerOutput(rewardAddresses, rewardLocktime, rewardThreshold);
            const UTx = new validationtx_1.AddValidatorTx(networkID, blockchainID, outs, ins, memo, nodeID, startTime, endTime, stakeAmount, stakeOuts, new outputs_1.ParseableOutput(rewardOutputOwners), nominationFee);
            return new tx_1.UnsignedTx(UTx);
        };
        /**
         * Class representing an unsigned [[CreateAllychainTx]] transaction.
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
         * @param allychainOwnerAddresses An array of {@link https://github.com/feross/buffer|Buffer} for the addresses to add to a allychain
         * @param allychainOwnerThreshold The number of owners's signatures required to add a validator to the network
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildCreateAllychainTx = (networkID = constants_2.DefaultNetworkID, blockchainID, fromAddresses, changeAddresses, allychainOwnerAddresses, allychainOwnerThreshold, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
            if (this._feeCheck(fee, feeAssetID)) {
                const aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                const minSpendableErr = this.getMinimumSpendable(aad, asOf, undefined, undefined);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
                }
            }
            const locktime = new bn_js_1.default(0);
            const UTx = new createallychaintx_1.CreateAllychainTx(networkID, blockchainID, outs, ins, memo, new outputs_1.SECPOwnerOutput(allychainOwnerAddresses, locktime, allychainOwnerThreshold));
            return new tx_1.UnsignedTx(UTx);
        };
        /**
         * Build an unsigned [[CreateChainTx]].
         *
         * @param networkID Networkid, [[DefaultNetworkID]]
         * @param blockchainID Blockchainid, default undefined
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
         * @param allychainID Optional ID of the Allychain that validates this blockchain
         * @param chainName Optional A human readable name for the chain; need not be unique
         * @param vmID Optional ID of the VM running on the new chain
         * @param fxIDs Optional IDs of the feature extensions running on the new chain
         * @param genesisData Optional Byte representation of genesis state of the new chain
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
         *
         * @returns An unsigned CreateChainTx created from the passed in parameters.
         */
        this.buildCreateChainTx = (networkID = constants_2.DefaultNetworkID, blockchainID, fromAddresses, changeAddresses, allychainID = undefined, chainName = undefined, vmID = undefined, fxIDs = undefined, genesisData = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), allychainAuthCredentials = []) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
            if (this._feeCheck(fee, feeAssetID)) {
                const aad = new AssetAmountDestination(fromAddresses, fromAddresses, changeAddresses);
                aad.addAssetAmount(feeAssetID, zero, fee);
                const minSpendableErr = this.getMinimumSpendable(aad, asOf, undefined, undefined);
                if (typeof minSpendableErr === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw minSpendableErr;
                }
            }
            const createChainTx = new _1.CreateChainTx(networkID, blockchainID, outs, ins, memo, allychainID, chainName, vmID, fxIDs, genesisData);
            allychainAuthCredentials.forEach((allychainAuthCredential) => {
                createChainTx.addSignatureIdx(allychainAuthCredential[0], allychainAuthCredential[1]);
            });
            return new tx_1.UnsignedTx(createChainTx);
        };
    }
    //serialize is inherited
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        let utxos = {};
        for (let utxoid in fields["utxos"]) {
            let utxoidCleaned = serialization.decoder(utxoid, encoding, "base58", "base58");
            utxos[`${utxoidCleaned}`] = new UTXO();
            utxos[`${utxoidCleaned}`].deserialize(fields["utxos"][`${utxoid}`], encoding);
        }
        let addressUTXOs = {};
        for (let address in fields["addressUTXOs"]) {
            let addressCleaned = serialization.decoder(address, encoding, "cb58", "hex");
            let utxobalance = {};
            for (let utxoid in fields["addressUTXOs"][`${address}`]) {
                let utxoidCleaned = serialization.decoder(utxoid, encoding, "base58", "base58");
                utxobalance[`${utxoidCleaned}`] = serialization.decoder(fields["addressUTXOs"][`${address}`][`${utxoid}`], encoding, "decimalString", "BN");
            }
            addressUTXOs[`${addressCleaned}`] = utxobalance;
        }
        this.utxos = utxos;
        this.addressUTXOs = addressUTXOs;
    }
    parseUTXO(utxo) {
        const utxovar = new UTXO();
        // force a copy
        if (typeof utxo === "string") {
            utxovar.fromBuffer(bintools.cb58Decode(utxo));
        }
        else if (utxo instanceof utxos_1.StandardUTXO) {
            utxovar.fromBuffer(utxo.toBuffer()); // forces a copy
        }
        else {
            /* istanbul ignore next */
            throw new errors_1.UTXOError("Error - UTXO.parseUTXO: utxo parameter is not a UTXO or string");
        }
        return utxovar;
    }
    create(...args) {
        return new UTXOSet();
    }
    clone() {
        const newset = this.create();
        const allUTXOs = this.getAllUTXOs();
        newset.addArray(allUTXOs);
        return newset;
    }
    _feeCheck(fee, feeAssetID) {
        return (typeof fee !== "undefined" &&
            typeof feeAssetID !== "undefined" &&
            fee.gt(new bn_js_1.default(0)) &&
            feeAssetID instanceof buffer_1.Buffer);
    }
}
exports.UTXOSet = UTXOSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXR4b3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3V0eG9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxvRUFBMkM7QUFDM0Msa0RBQXNCO0FBQ3RCLHVDQVFrQjtBQUNsQixxQ0FNaUI7QUFDakIsaUVBQXFEO0FBQ3JELDhDQUFrRTtBQUNsRSwyQ0FBaUQ7QUFDakQsNkJBQWlDO0FBQ2pDLHFEQUFpRDtBQUNqRCxxREFBa0U7QUFDbEUscURBQWlEO0FBQ2pELGlEQUE2QztBQUM3QywwREFHaUM7QUFFakMsaURBQStEO0FBQy9ELDJEQUF1RDtBQUN2RCw2REFBNkU7QUFDN0UsK0NBTzJCO0FBQzNCLHdCQUFpQztBQUVqQyxtRkFBK0U7QUFFL0U7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWhFOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsb0JBQVk7SUFBdEM7O1FBQ1ksY0FBUyxHQUFHLE1BQU0sQ0FBQTtRQUNsQixZQUFPLEdBQUcsU0FBUyxDQUFBO0lBb0UvQixDQUFDO0lBbEVDLHdCQUF3QjtJQUV4QixXQUFXLENBQUMsTUFBYyxFQUFFLFdBQStCLEtBQUs7UUFDOUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDJCQUFpQixFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQsVUFB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QUFLLFdBQVc7WUFDMUIsT0FBTyxVQUFVLEtBQUssV0FBVztZQUNqQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFVBQVUsWUFBWSxlQUFNLENBQzdCLENBQUE7SUFDSCxDQUFDO0NBOGxDRjtBQW5yQ0QsMEJBbXJDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBBUEktUGxhdGZvcm1WTS1VVFhPc1xyXG4gKi9cclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCB7XHJcbiAgQW1vdW50T3V0cHV0LFxyXG4gIFNlbGVjdE91dHB1dENsYXNzLFxyXG4gIFRyYW5zZmVyYWJsZU91dHB1dCxcclxuICBTRUNQT3duZXJPdXRwdXQsXHJcbiAgUGFyc2VhYmxlT3V0cHV0LFxyXG4gIFN0YWtlYWJsZUxvY2tPdXQsXHJcbiAgU0VDUFRyYW5zZmVyT3V0cHV0XHJcbn0gZnJvbSBcIi4vb3V0cHV0c1wiXHJcbmltcG9ydCB7XHJcbiAgQW1vdW50SW5wdXQsXHJcbiAgU0VDUFRyYW5zZmVySW5wdXQsXHJcbiAgU3Rha2VhYmxlTG9ja0luLFxyXG4gIFRyYW5zZmVyYWJsZUlucHV0LFxyXG4gIFBhcnNlYWJsZUlucHV0XHJcbn0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHsgVW5peE5vdyB9IGZyb20gXCIuLi8uLi91dGlscy9oZWxwZXJmdW5jdGlvbnNcIlxyXG5pbXBvcnQgeyBTdGFuZGFyZFVUWE8sIFN0YW5kYXJkVVRYT1NldCB9IGZyb20gXCIuLi8uLi9jb21tb24vdXR4b3NcIlxyXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgVW5zaWduZWRUeCB9IGZyb20gXCIuL3R4XCJcclxuaW1wb3J0IHsgRXhwb3J0VHggfSBmcm9tIFwiLi4vcGxhdGZvcm12bS9leHBvcnR0eFwiXHJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQsIERlZmF1bHRzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4uL3BsYXRmb3Jtdm0vaW1wb3J0dHhcIlxyXG5pbXBvcnQgeyBCYXNlVHggfSBmcm9tIFwiLi4vcGxhdGZvcm12bS9iYXNldHhcIlxyXG5pbXBvcnQge1xyXG4gIFN0YW5kYXJkQXNzZXRBbW91bnREZXN0aW5hdGlvbixcclxuICBBc3NldEFtb3VudFxyXG59IGZyb20gXCIuLi8uLi9jb21tb24vYXNzZXRhbW91bnRcIlxyXG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL291dHB1dFwiXHJcbmltcG9ydCB7IEFkZE5vbWluYXRvclR4LCBBZGRWYWxpZGF0b3JUeCB9IGZyb20gXCIuL3ZhbGlkYXRpb250eFwiXHJcbmltcG9ydCB7IENyZWF0ZUFsbHljaGFpblR4IH0gZnJvbSBcIi4vY3JlYXRlYWxseWNoYWludHhcIlxyXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXHJcbmltcG9ydCB7XHJcbiAgVVRYT0Vycm9yLFxyXG4gIEFkZHJlc3NFcnJvcixcclxuICBJbnN1ZmZpY2llbnRGdW5kc0Vycm9yLFxyXG4gIFRocmVzaG9sZEVycm9yLFxyXG4gIEZlZUFzc2V0RXJyb3IsXHJcbiAgVGltZUVycm9yXHJcbn0gZnJvbSBcIi4uLy4uL3V0aWxzL2Vycm9yc1wiXHJcbmltcG9ydCB7IENyZWF0ZUNoYWluVHggfSBmcm9tIFwiLlwiXHJcbmltcG9ydCB7IEdlbmVzaXNEYXRhIH0gZnJvbSBcIi4uL2F2bVwiXHJcbmltcG9ydCB7IEFkZEFsbHljaGFpblZhbGlkYXRvclR4IH0gZnJvbSBcIi4uL3BsYXRmb3Jtdm0vYWRkYWxseWNoYWludmFsaWRhdG9ydHhcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgYSBzaW5nbGUgVVRYTy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVVFhPIGV4dGVuZHMgU3RhbmRhcmRVVFhPIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJVVFhPXCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxyXG5cclxuICAvL3NlcmlhbGl6ZSBpcyBpbmhlcml0ZWRcclxuXHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5vdXRwdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhmaWVsZHNbXCJvdXRwdXRcIl1bXCJfdHlwZUlEXCJdKVxyXG4gICAgdGhpcy5vdXRwdXQuZGVzZXJpYWxpemUoZmllbGRzW1wib3V0cHV0XCJdLCBlbmNvZGluZylcclxuICB9XHJcblxyXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICAgIHRoaXMuY29kZWNJRCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDIpXHJcbiAgICBvZmZzZXQgKz0gMlxyXG4gICAgdGhpcy50eGlkID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXHJcbiAgICBvZmZzZXQgKz0gMzJcclxuICAgIHRoaXMub3V0cHV0aWR4ID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgNClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICB0aGlzLmFzc2V0SUQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAzMilcclxuICAgIG9mZnNldCArPSAzMlxyXG4gICAgY29uc3Qgb3V0cHV0aWQ6IG51bWJlciA9IGJpbnRvb2xzXHJcbiAgICAgIC5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxyXG4gICAgICAucmVhZFVJbnQzMkJFKDApXHJcbiAgICBvZmZzZXQgKz0gNFxyXG4gICAgdGhpcy5vdXRwdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhvdXRwdXRpZClcclxuICAgIHJldHVybiB0aGlzLm91dHB1dC5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSBbW1VUWE9dXSwgcGFyc2VzIGl0LCBwb3B1bGF0ZXMgdGhlIGNsYXNzLCBhbmQgcmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBTdGFuZGFyZFVUWE8gaW4gYnl0ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VyaWFsaXplZCBBIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSByYXcgW1tVVFhPXV1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW1VUWE9dXVxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiB1bmxpa2UgbW9zdCBmcm9tU3RyaW5ncywgaXQgZXhwZWN0cyB0aGUgc3RyaW5nIHRvIGJlIHNlcmlhbGl6ZWQgaW4gY2I1OCBmb3JtYXRcclxuICAgKi9cclxuICBmcm9tU3RyaW5nKHNlcmlhbGl6ZWQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHRoaXMuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKHNlcmlhbGl6ZWQpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGJhc2UtNTggcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbVVRYT11dLlxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiB1bmxpa2UgbW9zdCB0b1N0cmluZ3MsIHRoaXMgcmV0dXJucyBpbiBjYjU4IHNlcmlhbGl6YXRpb24gZm9ybWF0XHJcbiAgICovXHJcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4gYmludG9vbHMuY2I1OEVuY29kZSh0aGlzLnRvQnVmZmVyKCkpXHJcbiAgfVxyXG5cclxuICBjbG9uZSgpOiB0aGlzIHtcclxuICAgIGNvbnN0IHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB1dHhvLmZyb21CdWZmZXIodGhpcy50b0J1ZmZlcigpKVxyXG4gICAgcmV0dXJuIHV0eG8gYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKFxyXG4gICAgY29kZWNJRDogbnVtYmVyID0gUGxhdGZvcm1WTUNvbnN0YW50cy5MQVRFU1RDT0RFQyxcclxuICAgIHR4aWQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG91dHB1dGlkeDogQnVmZmVyIHwgbnVtYmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgb3V0cHV0OiBPdXRwdXQgPSB1bmRlZmluZWRcclxuICApOiB0aGlzIHtcclxuICAgIHJldHVybiBuZXcgVVRYTyhjb2RlY0lELCB0eGlkLCBvdXRwdXRpZHgsIGFzc2V0SUQsIG91dHB1dCkgYXMgdGhpc1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFzc2V0QW1vdW50RGVzdGluYXRpb24gZXh0ZW5kcyBTdGFuZGFyZEFzc2V0QW1vdW50RGVzdGluYXRpb248XHJcbiAgVHJhbnNmZXJhYmxlT3V0cHV0LFxyXG4gIFRyYW5zZmVyYWJsZUlucHV0XHJcbj4ge31cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzZXQgb2YgW1tVVFhPXV1zLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVUWE9TZXQgZXh0ZW5kcyBTdGFuZGFyZFVUWE9TZXQ8VVRYTz4ge1xyXG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIlVUWE9TZXRcIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIC8vc2VyaWFsaXplIGlzIGluaGVyaXRlZFxyXG5cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICBsZXQgdXR4b3MgPSB7fVxyXG4gICAgZm9yIChsZXQgdXR4b2lkIGluIGZpZWxkc1tcInV0eG9zXCJdKSB7XHJcbiAgICAgIGxldCB1dHhvaWRDbGVhbmVkOiBzdHJpbmcgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgICAgdXR4b2lkLFxyXG4gICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgIFwiYmFzZTU4XCIsXHJcbiAgICAgICAgXCJiYXNlNThcIlxyXG4gICAgICApXHJcbiAgICAgIHV0eG9zW2Ake3V0eG9pZENsZWFuZWR9YF0gPSBuZXcgVVRYTygpXHJcbiAgICAgIHV0eG9zW2Ake3V0eG9pZENsZWFuZWR9YF0uZGVzZXJpYWxpemUoXHJcbiAgICAgICAgZmllbGRzW1widXR4b3NcIl1bYCR7dXR4b2lkfWBdLFxyXG4gICAgICAgIGVuY29kaW5nXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGxldCBhZGRyZXNzVVRYT3MgPSB7fVxyXG4gICAgZm9yIChsZXQgYWRkcmVzcyBpbiBmaWVsZHNbXCJhZGRyZXNzVVRYT3NcIl0pIHtcclxuICAgICAgbGV0IGFkZHJlc3NDbGVhbmVkOiBzdHJpbmcgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgICAgYWRkcmVzcyxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcImNiNThcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgICAgbGV0IHV0eG9iYWxhbmNlID0ge31cclxuICAgICAgZm9yIChsZXQgdXR4b2lkIGluIGZpZWxkc1tcImFkZHJlc3NVVFhPc1wiXVtgJHthZGRyZXNzfWBdKSB7XHJcbiAgICAgICAgbGV0IHV0eG9pZENsZWFuZWQ6IHN0cmluZyA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgICAgIHV0eG9pZCxcclxuICAgICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgICAgXCJiYXNlNThcIixcclxuICAgICAgICAgIFwiYmFzZTU4XCJcclxuICAgICAgICApXHJcbiAgICAgICAgdXR4b2JhbGFuY2VbYCR7dXR4b2lkQ2xlYW5lZH1gXSA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcclxuICAgICAgICAgIGZpZWxkc1tcImFkZHJlc3NVVFhPc1wiXVtgJHthZGRyZXNzfWBdW2Ake3V0eG9pZH1gXSxcclxuICAgICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgICAgXCJkZWNpbWFsU3RyaW5nXCIsXHJcbiAgICAgICAgICBcIkJOXCJcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgICAgYWRkcmVzc1VUWE9zW2Ake2FkZHJlc3NDbGVhbmVkfWBdID0gdXR4b2JhbGFuY2VcclxuICAgIH1cclxuICAgIHRoaXMudXR4b3MgPSB1dHhvc1xyXG4gICAgdGhpcy5hZGRyZXNzVVRYT3MgPSBhZGRyZXNzVVRYT3NcclxuICB9XHJcblxyXG4gIHBhcnNlVVRYTyh1dHhvOiBVVFhPIHwgc3RyaW5nKTogVVRYTyB7XHJcbiAgICBjb25zdCB1dHhvdmFyOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgLy8gZm9yY2UgYSBjb3B5XHJcbiAgICBpZiAodHlwZW9mIHV0eG8gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgdXR4b3Zhci5mcm9tQnVmZmVyKGJpbnRvb2xzLmNiNThEZWNvZGUodXR4bykpXHJcbiAgICB9IGVsc2UgaWYgKHV0eG8gaW5zdGFuY2VvZiBTdGFuZGFyZFVUWE8pIHtcclxuICAgICAgdXR4b3Zhci5mcm9tQnVmZmVyKHV0eG8udG9CdWZmZXIoKSkgLy8gZm9yY2VzIGEgY29weVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IFVUWE9FcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gVVRYTy5wYXJzZVVUWE86IHV0eG8gcGFyYW1ldGVyIGlzIG5vdCBhIFVUWE8gb3Igc3RyaW5nXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHV0eG92YXJcclxuICB9XHJcblxyXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBVVFhPU2V0KCkgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBjb25zdCBuZXdzZXQ6IFVUWE9TZXQgPSB0aGlzLmNyZWF0ZSgpXHJcbiAgICBjb25zdCBhbGxVVFhPczogVVRYT1tdID0gdGhpcy5nZXRBbGxVVFhPcygpXHJcbiAgICBuZXdzZXQuYWRkQXJyYXkoYWxsVVRYT3MpXHJcbiAgICByZXR1cm4gbmV3c2V0IGFzIHRoaXNcclxuICB9XHJcblxyXG4gIF9mZWVDaGVjayhmZWU6IEJOLCBmZWVBc3NldElEOiBCdWZmZXIpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHR5cGVvZiBmZWUgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgdHlwZW9mIGZlZUFzc2V0SUQgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgZmVlLmd0KG5ldyBCTigwKSkgJiZcclxuICAgICAgZmVlQXNzZXRJRCBpbnN0YW5jZW9mIEJ1ZmZlclxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29uc3VtYWJsZVVYVE8gPSAoXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIHN0YWtlYWJsZTogYm9vbGVhbiA9IGZhbHNlXHJcbiAgKTogVVRYT1tdID0+IHtcclxuICAgIHJldHVybiB0aGlzLmdldEFsbFVUWE9zKCkuZmlsdGVyKCh1dHhvOiBVVFhPKSA9PiB7XHJcbiAgICAgIGlmIChzdGFrZWFibGUpIHtcclxuICAgICAgICAvLyBzdGFrZWFibGUgdHJhbnNhY3Rpb25zIGNhbiBjb25zdW1lIGFueSBVVFhPLlxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgb3V0cHV0OiBPdXRwdXQgPSB1dHhvLmdldE91dHB1dCgpXHJcbiAgICAgIGlmICghKG91dHB1dCBpbnN0YW5jZW9mIFN0YWtlYWJsZUxvY2tPdXQpKSB7XHJcbiAgICAgICAgLy8gbm9uLXN0YWtlYWJsZSB0cmFuc2FjdGlvbnMgY2FuIGNvbnN1bWUgYW55IFVUWE8gdGhhdCBpc24ndCBsb2NrZWQuXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzdGFrZWFibGVPdXRwdXQ6IFN0YWtlYWJsZUxvY2tPdXQgPSBvdXRwdXQgYXMgU3Rha2VhYmxlTG9ja091dFxyXG4gICAgICBpZiAoc3Rha2VhYmxlT3V0cHV0LmdldFN0YWtlYWJsZUxvY2t0aW1lKCkubHQoYXNPZikpIHtcclxuICAgICAgICAvLyBJZiB0aGUgc3Rha2VhYmxlIG91dHB1dHMgbG9ja3RpbWUgaGFzIGVuZGVkLCB0aGVuIHRoaXMgVVRYTyBjYW4gc3RpbGxcclxuICAgICAgICAvLyBiZSBjb25zdW1lZCBieSBhIG5vbi1zdGFrZWFibGUgdHJhbnNhY3Rpb24uXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgfVxyXG4gICAgICAvLyBUaGlzIG91dHB1dCBpcyBsb2NrZWQgYW5kIGNhbid0IGJlIGNvbnN1bWVkIGJ5IGEgbm9uLXN0YWtlYWJsZVxyXG4gICAgICAvLyB0cmFuc2FjdGlvbi5cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZ2V0TWluaW11bVNwZW5kYWJsZSA9IChcclxuICAgIGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbixcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxLFxyXG4gICAgc3Rha2VhYmxlOiBib29sZWFuID0gZmFsc2VcclxuICApOiBFcnJvciA9PiB7XHJcbiAgICBsZXQgdXR4b0FycmF5OiBVVFhPW10gPSB0aGlzLmdldENvbnN1bWFibGVVWFRPKGFzT2YsIHN0YWtlYWJsZSlcclxuICAgIGxldCB0bXBVVFhPQXJyYXk6IFVUWE9bXSA9IFtdXHJcbiAgICBpZiAoc3Rha2VhYmxlKSB7XHJcbiAgICAgIC8vIElmIHRoaXMgaXMgYSBzdGFrZWFibGUgdHJhbnNhY3Rpb24gdGhlbiBoYXZlIFN0YWtlYWJsZUxvY2tPdXQgY29tZSBiZWZvcmUgU0VDUFRyYW5zZmVyT3V0cHV0XHJcbiAgICAgIC8vIHNvIHRoYXQgdXNlcnMgZmlyc3Qgc3Rha2UgbG9ja2VkIHRva2VucyBiZWZvcmUgc3Rha2luZyB1bmxvY2tlZCB0b2tlbnNcclxuICAgICAgdXR4b0FycmF5LmZvckVhY2goKHV0eG86IFVUWE8pID0+IHtcclxuICAgICAgICAvLyBTdGFrZWFibGVMb2NrT3V0c1xyXG4gICAgICAgIGlmICh1dHhvLmdldE91dHB1dCgpLmdldFR5cGVJRCgpID09PSAyMikge1xyXG4gICAgICAgICAgdG1wVVRYT0FycmF5LnB1c2godXR4bylcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyBTb3J0IHRoZSBTdGFrZWFibGVMb2NrT3V0cyBieSBTdGFrZWFibGVMb2NrdGltZSBzbyB0aGF0IHRoZSBncmVhdGVzdCBTdGFrZWFibGVMb2NrdGltZSBhcmUgc3BlbnQgZmlyc3RcclxuICAgICAgdG1wVVRYT0FycmF5LnNvcnQoKGE6IFVUWE8sIGI6IFVUWE8pID0+IHtcclxuICAgICAgICBsZXQgc3Rha2VhYmxlTG9ja091dDEgPSBhLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcclxuICAgICAgICBsZXQgc3Rha2VhYmxlTG9ja091dDIgPSBiLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b051bWJlcigpIC1cclxuICAgICAgICAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9OdW1iZXIoKVxyXG4gICAgICAgIClcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHV0eG9BcnJheS5mb3JFYWNoKCh1dHhvOiBVVFhPKSA9PiB7XHJcbiAgICAgICAgLy8gU0VDUFRyYW5zZmVyT3V0cHV0c1xyXG4gICAgICAgIGlmICh1dHhvLmdldE91dHB1dCgpLmdldFR5cGVJRCgpID09PSA3KSB7XHJcbiAgICAgICAgICB0bXBVVFhPQXJyYXkucHVzaCh1dHhvKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgdXR4b0FycmF5ID0gdG1wVVRYT0FycmF5XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3V0cyBpcyBhIG1hcCBmcm9tIGFzc2V0SUQgdG8gYSB0dXBsZSBvZiAobG9ja2VkU3Rha2VhYmxlLCB1bmxvY2tlZClcclxuICAgIC8vIHdoaWNoIGFyZSBhcnJheXMgb2Ygb3V0cHV0cy5cclxuICAgIGNvbnN0IG91dHM6IG9iamVjdCA9IHt9XHJcblxyXG4gICAgLy8gV2Ugb25seSBuZWVkIHRvIGl0ZXJhdGUgb3ZlciBVVFhPcyB1bnRpbCB3ZSBoYXZlIHNwZW50IHN1ZmZpY2llbnQgZnVuZHNcclxuICAgIC8vIHRvIG1ldCB0aGUgcmVxdWVzdGVkIGFtb3VudHMuXHJcbiAgICB1dHhvQXJyYXkuZm9yRWFjaCgodXR4bzogVVRYTywgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSB1dHhvLmdldEFzc2V0SUQoKVxyXG4gICAgICBjb25zdCBhc3NldEtleTogc3RyaW5nID0gYXNzZXRJRC50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICBjb25zdCBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSA9IGFhZC5nZXRTZW5kZXJzKClcclxuICAgICAgY29uc3Qgb3V0cHV0OiBPdXRwdXQgPSB1dHhvLmdldE91dHB1dCgpXHJcbiAgICAgIGlmIChcclxuICAgICAgICAhKG91dHB1dCBpbnN0YW5jZW9mIEFtb3VudE91dHB1dCkgfHxcclxuICAgICAgICAhYWFkLmFzc2V0RXhpc3RzKGFzc2V0S2V5KSB8fFxyXG4gICAgICAgICFvdXRwdXQubWVldHNUaHJlc2hvbGQoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gV2Ugc2hvdWxkIG9ubHkgdHJ5IHRvIHNwZW5kIGZ1bmdpYmxlIGFzc2V0cy5cclxuICAgICAgICAvLyBXZSBzaG91bGQgb25seSBzcGVuZCB7eyBhc3NldEtleSB9fS5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGJlIGFibGUgdG8gc3BlbmQgdGhlIG91dHB1dC5cclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYXNzZXRBbW91bnQ6IEFzc2V0QW1vdW50ID0gYWFkLmdldEFzc2V0QW1vdW50KGFzc2V0S2V5KVxyXG4gICAgICBpZiAoYXNzZXRBbW91bnQuaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgLy8gV2UndmUgYWxyZWFkeSBzcGVudCB0aGUgbmVlZGVkIFVUWE9zIGZvciB0aGlzIGFzc2V0SUQuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghKGFzc2V0S2V5IGluIG91dHMpKSB7XHJcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBzcGVuZGluZyB0aGlzIGFzc2V0SUQsIHdlIG5lZWQgdG9cclxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBvdXRzIG9iamVjdCBjb3JyZWN0bHkuXHJcbiAgICAgICAgb3V0c1tgJHthc3NldEtleX1gXSA9IHtcclxuICAgICAgICAgIGxvY2tlZFN0YWtlYWJsZTogW10sXHJcbiAgICAgICAgICB1bmxvY2tlZDogW11cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFtb3VudE91dHB1dDogQW1vdW50T3V0cHV0ID0gb3V0cHV0IGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAvLyBhbW91bnQgaXMgdGhlIGFtb3VudCBvZiBmdW5kcyBhdmFpbGFibGUgZnJvbSB0aGlzIFVUWE8uXHJcbiAgICAgIGNvbnN0IGFtb3VudCA9IGFtb3VudE91dHB1dC5nZXRBbW91bnQoKVxyXG5cclxuICAgICAgLy8gU2V0IHVwIHRoZSBTRUNQIGlucHV0IHdpdGggdGhlIHNhbWUgYW1vdW50IGFzIHRoZSBvdXRwdXQuXHJcbiAgICAgIGxldCBpbnB1dDogQW1vdW50SW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxyXG5cclxuICAgICAgbGV0IGxvY2tlZDogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICAgIGlmIChhbW91bnRPdXRwdXQgaW5zdGFuY2VvZiBTdGFrZWFibGVMb2NrT3V0KSB7XHJcbiAgICAgICAgY29uc3Qgc3Rha2VhYmxlT3V0cHV0OiBTdGFrZWFibGVMb2NrT3V0ID1cclxuICAgICAgICAgIGFtb3VudE91dHB1dCBhcyBTdGFrZWFibGVMb2NrT3V0XHJcbiAgICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja3RpbWU6IEJOID0gc3Rha2VhYmxlT3V0cHV0LmdldFN0YWtlYWJsZUxvY2t0aW1lKClcclxuXHJcbiAgICAgICAgaWYgKHN0YWtlYWJsZUxvY2t0aW1lLmd0KGFzT2YpKSB7XHJcbiAgICAgICAgICAvLyBBZGQgYSBuZXcgaW5wdXQgYW5kIG1hcmsgaXQgYXMgYmVpbmcgbG9ja2VkLlxyXG4gICAgICAgICAgaW5wdXQgPSBuZXcgU3Rha2VhYmxlTG9ja0luKFxyXG4gICAgICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgICAgIHN0YWtlYWJsZUxvY2t0aW1lLFxyXG4gICAgICAgICAgICBuZXcgUGFyc2VhYmxlSW5wdXQoaW5wdXQpXHJcbiAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgLy8gTWFyayB0aGlzIFVUWE8gYXMgaGF2aW5nIGJlZW4gcmUtbG9ja2VkLlxyXG4gICAgICAgICAgbG9ja2VkID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgYXNzZXRBbW91bnQuc3BlbmRBbW91bnQoYW1vdW50LCBsb2NrZWQpXHJcbiAgICAgIGlmIChsb2NrZWQpIHtcclxuICAgICAgICAvLyBUcmFjayB0aGUgVVRYTyBhcyBsb2NrZWQuXHJcbiAgICAgICAgb3V0c1tgJHthc3NldEtleX1gXS5sb2NrZWRTdGFrZWFibGUucHVzaChhbW91bnRPdXRwdXQpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gVHJhY2sgdGhlIFVUWE8gYXMgdW5sb2NrZWQuXHJcbiAgICAgICAgb3V0c1tgJHthc3NldEtleX1gXS51bmxvY2tlZC5wdXNoKGFtb3VudE91dHB1dClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gR2V0IHRoZSBpbmRpY2VzIG9mIHRoZSBvdXRwdXRzIHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gYXV0aG9yaXplIHRoZVxyXG4gICAgICAvLyBzcGVuZGluZyBvZiB0aGlzIGlucHV0LlxyXG5cclxuICAgICAgLy8gVE9ETzogZ2V0U3BlbmRlcnMgc2hvdWxkIHJldHVybiBhbiBhcnJheSBvZiBpbmRpY2VzIHJhdGhlciB0aGFuIGFuXHJcbiAgICAgIC8vIGFycmF5IG9mIGFkZHJlc3Nlcy5cclxuICAgICAgY29uc3Qgc3BlbmRlcnM6IEJ1ZmZlcltdID0gYW1vdW50T3V0cHV0LmdldFNwZW5kZXJzKGZyb21BZGRyZXNzZXMsIGFzT2YpXHJcbiAgICAgIHNwZW5kZXJzLmZvckVhY2goKHNwZW5kZXI6IEJ1ZmZlcikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlkeDogbnVtYmVyID0gYW1vdW50T3V0cHV0LmdldEFkZHJlc3NJZHgoc3BlbmRlcilcclxuICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xyXG4gICAgICAgICAgLy8gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuLCB3aGljaCBpcyB3aHkgdGhlIGVycm9yIGlzIHRocm93biByYXRoZXJcclxuICAgICAgICAgIC8vIHRoYW4gYmVpbmcgcmV0dXJuZWQuIElmIHRoaXMgd2VyZSB0byBldmVyIGhhcHBlbiB0aGlzIHdvdWxkIGJlIGFuXHJcbiAgICAgICAgICAvLyBlcnJvciBpbiB0aGUgaW50ZXJuYWwgbG9naWMgcmF0aGVyIGhhdmluZyBjYWxsZWQgdGhpcyBmdW5jdGlvbiB3aXRoXHJcbiAgICAgICAgICAvLyBpbnZhbGlkIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuZ2V0TWluaW11bVNwZW5kYWJsZTogbm8gc3VjaCBcIiArXHJcbiAgICAgICAgICAgICAgYGFkZHJlc3MgaW4gb3V0cHV0OiAke3NwZW5kZXJ9YFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoaWR4LCBzcGVuZGVyKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgY29uc3QgdHhJRDogQnVmZmVyID0gdXR4by5nZXRUeElEKClcclxuICAgICAgY29uc3Qgb3V0cHV0SWR4OiBCdWZmZXIgPSB1dHhvLmdldE91dHB1dElkeCgpXHJcbiAgICAgIGNvbnN0IHRyYW5zZmVySW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxyXG4gICAgICAgIHR4SUQsXHJcbiAgICAgICAgb3V0cHV0SWR4LFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgaW5wdXRcclxuICAgICAgKVxyXG4gICAgICBhYWQuYWRkSW5wdXQodHJhbnNmZXJJbnB1dClcclxuICAgIH0pXHJcblxyXG4gICAgaWYgKCFhYWQuY2FuQ29tcGxldGUoKSkge1xyXG4gICAgICAvLyBBZnRlciBydW5uaW5nIHRocm91Z2ggYWxsIHRoZSBVVFhPcywgd2Ugc3RpbGwgd2VyZW4ndCBhYmxlIHRvIGdldCBhbGxcclxuICAgICAgLy8gdGhlIG5lY2Vzc2FyeSBmdW5kcywgc28gdGhpcyB0cmFuc2FjdGlvbiBjYW4ndCBiZSBtYWRlLlxyXG4gICAgICByZXR1cm4gbmV3IEluc3VmZmljaWVudEZ1bmRzRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuZ2V0TWluaW11bVNwZW5kYWJsZTogaW5zdWZmaWNpZW50IFwiICtcclxuICAgICAgICAgIFwiZnVuZHMgdG8gY3JlYXRlIHRoZSB0cmFuc2FjdGlvblwiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBXZSBzaG91bGQgc2VwYXJhdGUgdGhlIGFib3ZlIGZ1bmN0aW9uYWxpdHkgaW50byBhIHNpbmdsZSBmdW5jdGlvblxyXG4gICAgLy8gdGhhdCBqdXN0IHNlbGVjdHMgdGhlIFVUWE9zIHRvIGNvbnN1bWUuXHJcblxyXG4gICAgY29uc3QgemVybzogQk4gPSBuZXcgQk4oMClcclxuXHJcbiAgICAvLyBhc3NldEFtb3VudHMgaXMgYW4gYXJyYXkgb2YgYXNzZXQgZGVzY3JpcHRpb25zIGFuZCBob3cgbXVjaCBpcyBsZWZ0IHRvXHJcbiAgICAvLyBzcGVuZCBmb3IgdGhlbS5cclxuICAgIGNvbnN0IGFzc2V0QW1vdW50czogQXNzZXRBbW91bnRbXSA9IGFhZC5nZXRBbW91bnRzKClcclxuICAgIGFzc2V0QW1vdW50cy5mb3JFYWNoKChhc3NldEFtb3VudDogQXNzZXRBbW91bnQpID0+IHtcclxuICAgICAgLy8gY2hhbmdlIGlzIHRoZSBhbW91bnQgdGhhdCBzaG91bGQgYmUgcmV0dXJuZWQgYmFjayB0byB0aGUgc291cmNlIG9mIHRoZVxyXG4gICAgICAvLyBmdW5kcy5cclxuICAgICAgY29uc3QgY2hhbmdlOiBCTiA9IGFzc2V0QW1vdW50LmdldENoYW5nZSgpXHJcbiAgICAgIC8vIGlzU3Rha2VhYmxlTG9ja0NoYW5nZSBpcyBpZiB0aGUgY2hhbmdlIGlzIGxvY2tlZCBvciBub3QuXHJcbiAgICAgIGNvbnN0IGlzU3Rha2VhYmxlTG9ja0NoYW5nZTogYm9vbGVhbiA9XHJcbiAgICAgICAgYXNzZXRBbW91bnQuZ2V0U3Rha2VhYmxlTG9ja0NoYW5nZSgpXHJcbiAgICAgIC8vIGxvY2tlZENoYW5nZSBpcyB0aGUgYW1vdW50IG9mIGxvY2tlZCBjaGFuZ2UgdGhhdCBzaG91bGQgYmUgcmV0dXJuZWQgdG9cclxuICAgICAgLy8gdGhlIHNlbmRlclxyXG4gICAgICBjb25zdCBsb2NrZWRDaGFuZ2U6IEJOID0gaXNTdGFrZWFibGVMb2NrQ2hhbmdlID8gY2hhbmdlIDogemVyby5jbG9uZSgpXHJcblxyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhc3NldEFtb3VudC5nZXRBc3NldElEKClcclxuICAgICAgY29uc3QgYXNzZXRLZXk6IHN0cmluZyA9IGFzc2V0QW1vdW50LmdldEFzc2V0SURTdHJpbmcoKVxyXG4gICAgICBjb25zdCBsb2NrZWRPdXRwdXRzOiBTdGFrZWFibGVMb2NrT3V0W10gPVxyXG4gICAgICAgIG91dHNbYCR7YXNzZXRLZXl9YF0ubG9ja2VkU3Rha2VhYmxlXHJcbiAgICAgIGxvY2tlZE91dHB1dHMuZm9yRWFjaCgobG9ja2VkT3V0cHV0OiBTdGFrZWFibGVMb2NrT3V0LCBpOiBudW1iZXIpID0+IHtcclxuICAgICAgICBjb25zdCBzdGFrZWFibGVMb2NrdGltZTogQk4gPSBsb2NrZWRPdXRwdXQuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKVxyXG4gICAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDogUGFyc2VhYmxlT3V0cHV0ID1cclxuICAgICAgICAgIGxvY2tlZE91dHB1dC5nZXRUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG5cclxuICAgICAgICAvLyBXZSBrbm93IHRoYXQgcGFyc2VhYmxlT3V0cHV0IGNvbnRhaW5zIGFuIEFtb3VudE91dHB1dCBiZWNhdXNlIHRoZVxyXG4gICAgICAgIC8vIGZpcnN0IGxvb3AgZmlsdGVycyBmb3IgZnVuZ2libGUgYXNzZXRzLlxyXG4gICAgICAgIGNvbnN0IG91dHB1dDogQW1vdW50T3V0cHV0ID0gcGFyc2VhYmxlT3V0cHV0LmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG5cclxuICAgICAgICBsZXQgb3V0cHV0QW1vdW50UmVtYWluaW5nOiBCTiA9IG91dHB1dC5nZXRBbW91bnQoKVxyXG4gICAgICAgIC8vIFRoZSBvbmx5IG91dHB1dCB0aGF0IGNvdWxkIGdlbmVyYXRlIGNoYW5nZSBpcyB0aGUgbGFzdCBvdXRwdXQuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhbnkgZnVydGhlciBVVFhPcyB3b3VsZG4ndCBoYXZlIG5lZWRlZCB0byBiZSBzcGVudC5cclxuICAgICAgICBpZiAoaSA9PSBsb2NrZWRPdXRwdXRzLmxlbmd0aCAtIDEgJiYgbG9ja2VkQ2hhbmdlLmd0KHplcm8pKSB7XHJcbiAgICAgICAgICAvLyB1cGRhdGUgb3V0cHV0QW1vdW50UmVtYWluaW5nIHRvIG5vIGxvbmdlciBob2xkIHRoZSBjaGFuZ2UgdGhhdCB3ZVxyXG4gICAgICAgICAgLy8gYXJlIHJldHVybmluZy5cclxuICAgICAgICAgIG91dHB1dEFtb3VudFJlbWFpbmluZyA9IG91dHB1dEFtb3VudFJlbWFpbmluZy5zdWIobG9ja2VkQ2hhbmdlKVxyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBvdXRwdXQuXHJcbiAgICAgICAgICBjb25zdCBuZXdDaGFuZ2VPdXRwdXQ6IEFtb3VudE91dHB1dCA9IFNlbGVjdE91dHB1dENsYXNzKFxyXG4gICAgICAgICAgICBvdXRwdXQuZ2V0T3V0cHV0SUQoKSxcclxuICAgICAgICAgICAgbG9ja2VkQ2hhbmdlLFxyXG4gICAgICAgICAgICBvdXRwdXQuZ2V0QWRkcmVzc2VzKCksXHJcbiAgICAgICAgICAgIG91dHB1dC5nZXRMb2NrdGltZSgpLFxyXG4gICAgICAgICAgICBvdXRwdXQuZ2V0VGhyZXNob2xkKClcclxuICAgICAgICAgICkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgICAgICAvLyBXcmFwIHRoZSBpbm5lciBvdXRwdXQgaW4gdGhlIFN0YWtlYWJsZUxvY2tPdXQgd3JhcHBlci5cclxuICAgICAgICAgIGxldCBuZXdMb2NrZWRDaGFuZ2VPdXRwdXQ6IFN0YWtlYWJsZUxvY2tPdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhcclxuICAgICAgICAgICAgbG9ja2VkT3V0cHV0LmdldE91dHB1dElEKCksXHJcbiAgICAgICAgICAgIGxvY2tlZENoYW5nZSxcclxuICAgICAgICAgICAgb3V0cHV0LmdldEFkZHJlc3NlcygpLFxyXG4gICAgICAgICAgICBvdXRwdXQuZ2V0TG9ja3RpbWUoKSxcclxuICAgICAgICAgICAgb3V0cHV0LmdldFRocmVzaG9sZCgpLFxyXG4gICAgICAgICAgICBzdGFrZWFibGVMb2NrdGltZSxcclxuICAgICAgICAgICAgbmV3IFBhcnNlYWJsZU91dHB1dChuZXdDaGFuZ2VPdXRwdXQpXHJcbiAgICAgICAgICApIGFzIFN0YWtlYWJsZUxvY2tPdXRcclxuICAgICAgICAgIGNvbnN0IHRyYW5zZmVyT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxyXG4gICAgICAgICAgICBhc3NldElELFxyXG4gICAgICAgICAgICBuZXdMb2NrZWRDaGFuZ2VPdXRwdXRcclxuICAgICAgICAgIClcclxuICAgICAgICAgIGFhZC5hZGRDaGFuZ2UodHJhbnNmZXJPdXRwdXQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXZSBrbm93IHRoYXQgb3V0cHV0QW1vdW50UmVtYWluaW5nID4gMC4gT3RoZXJ3aXNlLCB3ZSB3b3VsZCBuZXZlclxyXG4gICAgICAgIC8vIGhhdmUgY29uc3VtZWQgdGhpcyBVVFhPLCBhcyBpdCB3b3VsZCBiZSBvbmx5IGNoYW5nZS5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBvdXRwdXQuXHJcbiAgICAgICAgY29uc3QgbmV3T3V0cHV0OiBBbW91bnRPdXRwdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhcclxuICAgICAgICAgIG91dHB1dC5nZXRPdXRwdXRJRCgpLFxyXG4gICAgICAgICAgb3V0cHV0QW1vdW50UmVtYWluaW5nLFxyXG4gICAgICAgICAgb3V0cHV0LmdldEFkZHJlc3NlcygpLFxyXG4gICAgICAgICAgb3V0cHV0LmdldExvY2t0aW1lKCksXHJcbiAgICAgICAgICBvdXRwdXQuZ2V0VGhyZXNob2xkKClcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIC8vIFdyYXAgdGhlIGlubmVyIG91dHB1dCBpbiB0aGUgU3Rha2VhYmxlTG9ja091dCB3cmFwcGVyLlxyXG4gICAgICAgIGNvbnN0IG5ld0xvY2tlZE91dHB1dDogU3Rha2VhYmxlTG9ja091dCA9IFNlbGVjdE91dHB1dENsYXNzKFxyXG4gICAgICAgICAgbG9ja2VkT3V0cHV0LmdldE91dHB1dElEKCksXHJcbiAgICAgICAgICBvdXRwdXRBbW91bnRSZW1haW5pbmcsXHJcbiAgICAgICAgICBvdXRwdXQuZ2V0QWRkcmVzc2VzKCksXHJcbiAgICAgICAgICBvdXRwdXQuZ2V0TG9ja3RpbWUoKSxcclxuICAgICAgICAgIG91dHB1dC5nZXRUaHJlc2hvbGQoKSxcclxuICAgICAgICAgIHN0YWtlYWJsZUxvY2t0aW1lLFxyXG4gICAgICAgICAgbmV3IFBhcnNlYWJsZU91dHB1dChuZXdPdXRwdXQpXHJcbiAgICAgICAgKSBhcyBTdGFrZWFibGVMb2NrT3V0XHJcbiAgICAgICAgY29uc3QgdHJhbnNmZXJPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgICAgICBhc3NldElELFxyXG4gICAgICAgICAgbmV3TG9ja2VkT3V0cHV0XHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFhZC5hZGRPdXRwdXQodHJhbnNmZXJPdXRwdXQpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICAvLyB1bmxvY2tlZENoYW5nZSBpcyB0aGUgYW1vdW50IG9mIHVubG9ja2VkIGNoYW5nZSB0aGF0IHNob3VsZCBiZSByZXR1cm5lZFxyXG4gICAgICAvLyB0byB0aGUgc2VuZGVyXHJcbiAgICAgIGNvbnN0IHVubG9ja2VkQ2hhbmdlOiBCTiA9IGlzU3Rha2VhYmxlTG9ja0NoYW5nZSA/IHplcm8uY2xvbmUoKSA6IGNoYW5nZVxyXG4gICAgICBpZiAodW5sb2NrZWRDaGFuZ2UuZ3QoemVybykpIHtcclxuICAgICAgICBjb25zdCBuZXdDaGFuZ2VPdXRwdXQ6IEFtb3VudE91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgICB1bmxvY2tlZENoYW5nZSxcclxuICAgICAgICAgIGFhZC5nZXRDaGFuZ2VBZGRyZXNzZXMoKSxcclxuICAgICAgICAgIHplcm8uY2xvbmUoKSwgLy8gbWFrZSBzdXJlIHRoYXQgd2UgZG9uJ3QgbG9jayB0aGUgY2hhbmdlIG91dHB1dC5cclxuICAgICAgICAgIDEgLy8gb25seSByZXF1aXJlIG9uZSBvZiB0aGUgY2hhbmdlcyBhZGRyZXNzZXMgdG8gc3BlbmQgdGhpcyBvdXRwdXQuXHJcbiAgICAgICAgKSBhcyBBbW91bnRPdXRwdXRcclxuICAgICAgICBjb25zdCB0cmFuc2Zlck91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcclxuICAgICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgICBuZXdDaGFuZ2VPdXRwdXRcclxuICAgICAgICApXHJcbiAgICAgICAgYWFkLmFkZENoYW5nZSh0cmFuc2Zlck91dHB1dClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gdG90YWxBbW91bnRTcGVudCBpcyB0aGUgdG90YWwgYW1vdW50IG9mIHRva2VucyBjb25zdW1lZC5cclxuICAgICAgY29uc3QgdG90YWxBbW91bnRTcGVudDogQk4gPSBhc3NldEFtb3VudC5nZXRTcGVudCgpXHJcbiAgICAgIC8vIHN0YWtlYWJsZUxvY2tlZEFtb3VudCBpcyB0aGUgdG90YWwgYW1vdW50IG9mIGxvY2tlZCB0b2tlbnMgY29uc3VtZWQuXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tlZEFtb3VudDogQk4gPSBhc3NldEFtb3VudC5nZXRTdGFrZWFibGVMb2NrU3BlbnQoKVxyXG4gICAgICAvLyB0b3RhbFVubG9ja2VkU3BlbnQgaXMgdGhlIHRvdGFsIGFtb3VudCBvZiB1bmxvY2tlZCB0b2tlbnMgY29uc3VtZWQuXHJcbiAgICAgIGNvbnN0IHRvdGFsVW5sb2NrZWRTcGVudDogQk4gPSB0b3RhbEFtb3VudFNwZW50LnN1YihzdGFrZWFibGVMb2NrZWRBbW91bnQpXHJcbiAgICAgIC8vIGFtb3VudEJ1cm50IGlzIHRoZSBhbW91bnQgb2YgdW5sb2NrZWQgdG9rZW5zIHRoYXQgbXVzdCBiZSBidXJuLlxyXG4gICAgICBjb25zdCBhbW91bnRCdXJudDogQk4gPSBhc3NldEFtb3VudC5nZXRCdXJuKClcclxuICAgICAgLy8gdG90YWxVbmxvY2tlZEF2YWlsYWJsZSBpcyB0aGUgdG90YWwgYW1vdW50IG9mIHVubG9ja2VkIHRva2VucyBhdmFpbGFibGVcclxuICAgICAgLy8gdG8gYmUgcHJvZHVjZWQuXHJcbiAgICAgIGNvbnN0IHRvdGFsVW5sb2NrZWRBdmFpbGFibGU6IEJOID0gdG90YWxVbmxvY2tlZFNwZW50LnN1YihhbW91bnRCdXJudClcclxuICAgICAgLy8gdW5sb2NrZWRBbW91bnQgaXMgdGhlIGFtb3VudCBvZiB1bmxvY2tlZCB0b2tlbnMgdGhhdCBzaG91bGQgYmUgc2VudC5cclxuICAgICAgY29uc3QgdW5sb2NrZWRBbW91bnQ6IEJOID0gdG90YWxVbmxvY2tlZEF2YWlsYWJsZS5zdWIodW5sb2NrZWRDaGFuZ2UpXHJcbiAgICAgIGlmICh1bmxvY2tlZEFtb3VudC5ndCh6ZXJvKSkge1xyXG4gICAgICAgIGNvbnN0IG5ld091dHB1dDogQW1vdW50T3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICAgIHVubG9ja2VkQW1vdW50LFxyXG4gICAgICAgICAgYWFkLmdldERlc3RpbmF0aW9ucygpLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIGNvbnN0IHRyYW5zZmVyT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxyXG4gICAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICAgIG5ld091dHB1dFxyXG4gICAgICAgIClcclxuICAgICAgICBhYWQuYWRkT3V0cHV0KHRyYW5zZmVyT3V0cHV0KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBbW1Vuc2lnbmVkVHhdXSB3cmFwcGluZyBhIFtbQmFzZVR4XV0uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gd3JhcHBpbmcgYSBbW0Jhc2VUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcyBhbmQgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBOZXR3b3JrSUQgb2YgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIEJsb2NrY2hhaW5JRCBmb3IgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IG9mIHRoZSBhc3NldCB0byBiZSBzcGVudCBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfS5cclxuICAgKiBAcGFyYW0gYXNzZXRJRCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvZiB0aGUgYXNzZXQgSUQgZm9yIHRoZSBVVFhPXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIE9wdGlvbmFsLiBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zLiBEZWZhdWx0OiB0b0FkZHJlc3Nlc1xyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC4gRGVmYXVsdDogYXNzZXRJRFxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiBDb250YWlucyBhcmJpdHJhcnkgZGF0YSwgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gbG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiBjcmVhdGVkIGZyb20gdGhlIHBhc3NlZCBpbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYnVpbGRCYXNlVHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlcixcclxuICAgIHRvQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSA9IHVuZGVmaW5lZCxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKSxcclxuICAgIHRocmVzaG9sZDogbnVtYmVyID0gMVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgaWYgKHRocmVzaG9sZCA+IHRvQWRkcmVzc2VzLmxlbmd0aCkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgVGhyZXNob2xkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRCYXNlVHg6IHRocmVzaG9sZCBpcyBncmVhdGVyIHRoYW4gbnVtYmVyIG9mIGFkZHJlc3Nlc1wiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGNoYW5nZUFkZHJlc3NlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMgPSB0b0FkZHJlc3Nlc1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgZmVlQXNzZXRJRCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBmZWVBc3NldElEID0gYXNzZXRJRFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgaWYgKGFtb3VudC5lcSh6ZXJvKSkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgIHRvQWRkcmVzc2VzLFxyXG4gICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXNcclxuICAgIClcclxuICAgIGlmIChhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpID09PSBmZWVBc3NldElELnRvU3RyaW5nKFwiaGV4XCIpKSB7XHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChhc3NldElELCBhbW91bnQsIGZlZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChhc3NldElELCBhbW91bnQsIHplcm8pXHJcbiAgICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBjb25zdCBtaW5TcGVuZGFibGVFcnI6IEVycm9yID0gdGhpcy5nZXRNaW5pbXVtU3BlbmRhYmxlKFxyXG4gICAgICBhYWQsXHJcbiAgICAgIGFzT2YsXHJcbiAgICAgIGxvY2t0aW1lLFxyXG4gICAgICB0aHJlc2hvbGRcclxuICAgIClcclxuICAgIGlmICh0eXBlb2YgbWluU3BlbmRhYmxlRXJyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICBvdXRzID0gYWFkLmdldEFsbE91dHB1dHMoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbWluU3BlbmRhYmxlRXJyXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBJbXBvcnRUeCB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgVGhlIG51bWJlciByZXByZXNlbnRpbmcgTmV0d29ya0lEIG9mIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50aW5nIHRoZSBCbG9ja2NoYWluSUQgZm9yIHRoZSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRvIHNlbmQgdGhlIGZ1bmRzXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBPcHRpb25hbC4gVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPcy4gRGVmYXVsdDogdG9BZGRyZXNzZXNcclxuICAgKiBAcGFyYW0gaW1wb3J0SW5zIEFuIGFycmF5IG9mIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMgYmVpbmcgaW1wb3J0ZWRcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGNoYWluaWQgd2hlcmUgdGhlIGltcG9ydHMgYXJlIGNvbWluZyBmcm9tLlxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59LiBGZWUgd2lsbCBjb21lIGZyb20gdGhlIGlucHV0cyBmaXJzdCwgaWYgdGhleSBjYW4uXHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZEltcG9ydFR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlcixcclxuICAgIHRvQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGF0b21pY3M6IFVUWE9bXSxcclxuICAgIHNvdXJjZUNoYWluOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcbiAgICBpZiAodHlwZW9mIGZlZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBmZWUgPSB6ZXJvLmNsb25lKClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbXBvcnRJbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IGZlZXBhaWQ6IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgZmVlQXNzZXRTdHI6IHN0cmluZyA9IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhdG9taWNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHV0eG86IFVUWE8gPSBhdG9taWNzW2Ake2l9YF1cclxuICAgICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gdXR4by5nZXRBc3NldElEKClcclxuICAgICAgY29uc3Qgb3V0cHV0OiBBbW91bnRPdXRwdXQgPSB1dHhvLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICBsZXQgYW10OiBCTiA9IG91dHB1dC5nZXRBbW91bnQoKS5jbG9uZSgpXHJcblxyXG4gICAgICBsZXQgaW5mZWVhbW91bnQgPSBhbXQuY2xvbmUoKVxyXG4gICAgICBsZXQgYXNzZXRTdHI6IHN0cmluZyA9IGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHR5cGVvZiBmZWVBc3NldElEICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgZmVlLmd0KHplcm8pICYmXHJcbiAgICAgICAgZmVlcGFpZC5sdChmZWUpICYmXHJcbiAgICAgICAgYXNzZXRTdHIgPT09IGZlZUFzc2V0U3RyXHJcbiAgICAgICkge1xyXG4gICAgICAgIGZlZXBhaWQgPSBmZWVwYWlkLmFkZChpbmZlZWFtb3VudClcclxuICAgICAgICBpZiAoZmVlcGFpZC5ndGUoZmVlKSkge1xyXG4gICAgICAgICAgaW5mZWVhbW91bnQgPSBmZWVwYWlkLnN1YihmZWUpXHJcbiAgICAgICAgICBmZWVwYWlkID0gZmVlLmNsb25lKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW5mZWVhbW91bnQgPSB6ZXJvLmNsb25lKClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IHV0eG8uZ2V0VHhJRCgpXHJcbiAgICAgIGNvbnN0IG91dHB1dGlkeDogQnVmZmVyID0gdXR4by5nZXRPdXRwdXRJZHgoKVxyXG4gICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW10KVxyXG4gICAgICBjb25zdCB4ZmVyaW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxyXG4gICAgICAgIHR4aWQsXHJcbiAgICAgICAgb3V0cHV0aWR4LFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgaW5wdXRcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IG91dHB1dC5nZXRBZGRyZXNzZXMoKVxyXG4gICAgICBjb25zdCBzcGVuZGVyczogQnVmZmVyW10gPSBvdXRwdXQuZ2V0U3BlbmRlcnMoZnJvbSwgYXNPZilcclxuICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHNwZW5kZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgY29uc3QgaWR4OiBudW1iZXIgPSBvdXRwdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyc1tgJHtqfWBdKVxyXG4gICAgICAgIGlmIChpZHggPT09IC0xKSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRJbXBvcnRUeDogbm8gc3VjaCBcIiArXHJcbiAgICAgICAgICAgICAgYGFkZHJlc3MgaW4gb3V0cHV0OiAke3NwZW5kZXJzW2Ake2p9YF19YFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICB4ZmVyaW4uZ2V0SW5wdXQoKS5hZGRTaWduYXR1cmVJZHgoaWR4LCBzcGVuZGVyc1tgJHtqfWBdKVxyXG4gICAgICB9XHJcbiAgICAgIGltcG9ydElucy5wdXNoKHhmZXJpbilcclxuICAgICAgLy9hZGQgZXh0cmEgb3V0cHV0cyBmb3IgZWFjaCBhbW91bnQgKGNhbGN1bGF0ZWQgZnJvbSB0aGUgaW1wb3J0ZWQgaW5wdXRzKSwgbWludXMgZmVlc1xyXG4gICAgICBpZiAoaW5mZWVhbW91bnQuZ3QoemVybykpIHtcclxuICAgICAgICBjb25zdCBzcGVuZG91dDogQW1vdW50T3V0cHV0ID0gU2VsZWN0T3V0cHV0Q2xhc3MoXHJcbiAgICAgICAgICBvdXRwdXQuZ2V0T3V0cHV0SUQoKSxcclxuICAgICAgICAgIGluZmVlYW1vdW50LFxyXG4gICAgICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAgIHRocmVzaG9sZFxyXG4gICAgICAgICkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcclxuICAgICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgICBzcGVuZG91dFxyXG4gICAgICAgIClcclxuICAgICAgICBvdXRzLnB1c2goeGZlcm91dClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldCByZW1haW5pbmcgZmVlcyBmcm9tIHRoZSBwcm92aWRlZCBhZGRyZXNzZXNcclxuICAgIGxldCBmZWVSZW1haW5pbmc6IEJOID0gZmVlLnN1YihmZWVwYWlkKVxyXG4gICAgaWYgKGZlZVJlbWFpbmluZy5ndCh6ZXJvKSAmJiB0aGlzLl9mZWVDaGVjayhmZWVSZW1haW5pbmcsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICAgIHRvQWRkcmVzc2VzLFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgY2hhbmdlQWRkcmVzc2VzXHJcbiAgICAgIClcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZVJlbWFpbmluZylcclxuICAgICAgY29uc3QgbWluU3BlbmRhYmxlRXJyOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgICBhYWQsXHJcbiAgICAgICAgYXNPZixcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgKVxyXG4gICAgICBpZiAodHlwZW9mIG1pblNwZW5kYWJsZUVyciA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICAgIG91dHMgPSBhYWQuZ2V0QWxsT3V0cHV0cygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbWluU3BlbmRhYmxlRXJyXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIHNvdXJjZUNoYWluLFxyXG4gICAgICBpbXBvcnRJbnNcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChpbXBvcnRUeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gdW5zaWduZWQgRXhwb3J0VHggdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIFRoZSBudW1iZXIgcmVwcmVzZW50aW5nIE5ldHdvcmtJRCBvZiB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgQmxvY2tjaGFpbklEIGZvciB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gYW1vdW50IFRoZSBhbW91bnQgYmVpbmcgZXhwb3J0ZWQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBheGNBc3NldElEIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9mIHRoZSBhc3NldCBJRCBmb3IgQVhDXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcmVjaWV2ZXMgdGhlIEFYQ1xyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gb3ducyB0aGUgQVhDXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIGdldHMgdGhlIGNoYW5nZSBsZWZ0b3ZlciBvZiB0aGUgQVhDXHJcbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uQ2hhaW4gT3B0aW9uYWwuIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBjaGFpbmlkIHdoZXJlIHRvIHNlbmQgdGhlIGFzc2V0LlxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGJ1aWxkRXhwb3J0VHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGF4Y0Fzc2V0SUQ6IEJ1ZmZlciwgLy8gVE9ETzogcmVuYW1lIHRoaXMgdG8gYW1vdW50QXNzZXRJRFxyXG4gICAgdG9BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgZnJvbUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IEJ1ZmZlcltdID0gdW5kZWZpbmVkLFxyXG4gICAgZGVzdGluYXRpb25DaGFpbjogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIGZlZUFzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgKTogVW5zaWduZWRUeCA9PiB7XHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcbiAgICBsZXQgZXhwb3J0b3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2hhbmdlQWRkcmVzc2VzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyA9IHRvQWRkcmVzc2VzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgemVybzogQk4gPSBuZXcgQk4oMClcclxuXHJcbiAgICBpZiAoYW1vdW50LmVxKHplcm8pKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGZlZUFzc2V0SUQgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgZmVlQXNzZXRJRCA9IGF4Y0Fzc2V0SURcclxuICAgIH0gZWxzZSBpZiAoZmVlQXNzZXRJRC50b1N0cmluZyhcImhleFwiKSAhPT0gYXhjQXNzZXRJRC50b1N0cmluZyhcImhleFwiKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgRmVlQXNzZXRFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gVVRYT1NldC5idWlsZEV4cG9ydFR4OiBcIiArIGBmZWVBc3NldElEIG11c3QgbWF0Y2ggYXhjQXNzZXRJRGBcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25DaGFpbiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBkZXN0aW5hdGlvbkNoYWluID0gYmludG9vbHMuY2I1OERlY29kZShcclxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldHdvcmtJRH1gXS5Td2FwW1wiYmxvY2tjaGFpbklEXCJdXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhYWQ6IEFzc2V0QW1vdW50RGVzdGluYXRpb24gPSBuZXcgQXNzZXRBbW91bnREZXN0aW5hdGlvbihcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgKVxyXG4gICAgaWYgKGF4Y0Fzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikgPT09IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGF4Y0Fzc2V0SUQsIGFtb3VudCwgZmVlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGF4Y0Fzc2V0SUQsIGFtb3VudCwgemVybylcclxuICAgICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWluU3BlbmRhYmxlRXJyOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgYWFkLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcbiAgICBpZiAodHlwZW9mIG1pblNwZW5kYWJsZUVyciA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBpbnMgPSBhYWQuZ2V0SW5wdXRzKClcclxuICAgICAgb3V0cyA9IGFhZC5nZXRDaGFuZ2VPdXRwdXRzKClcclxuICAgICAgZXhwb3J0b3V0cyA9IGFhZC5nZXRPdXRwdXRzKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG1pblNwZW5kYWJsZUVyclxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4cG9ydFR4OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIG91dHMsXHJcbiAgICAgIGlucyxcclxuICAgICAgbWVtbyxcclxuICAgICAgZGVzdGluYXRpb25DaGFpbixcclxuICAgICAgZXhwb3J0b3V0c1xyXG4gICAgKVxyXG5cclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChleHBvcnRUeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhbiB1bnNpZ25lZCBbW0FkZEFsbHljaGFpblZhbGlkYXRvclR4XV0gdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE5ldHdvcmtpZCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIEJsb2NrY2hhaW5pZCwgZGVmYXVsdCB1bmRlZmluZWRcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIHBheXMgdGhlIGZlZXMgaW4gQVhDXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIGdldHMgdGhlIGNoYW5nZSBsZWZ0b3ZlciBmcm9tIHRoZSBmZWUgcGF5bWVudFxyXG4gICAqIEBwYXJhbSBub2RlSUQgVGhlIG5vZGUgSUQgb2YgdGhlIHZhbGlkYXRvciBiZWluZyBhZGRlZC5cclxuICAgKiBAcGFyYW0gc3RhcnRUaW1lIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0YXJ0cyB2YWxpZGF0aW5nIHRoZSBQcmltYXJ5IE5ldHdvcmsuXHJcbiAgICogQHBhcmFtIGVuZFRpbWUgVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RvcHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrIChhbmQgc3Rha2VkIEFYQyBpcyByZXR1cm5lZCkuXHJcbiAgICogQHBhcmFtIHdlaWdodCBUaGUgYW1vdW50IG9mIHdlaWdodCBmb3IgdGhpcyBhbGx5Y2hhaW4gdmFsaWRhdG9yLlxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGFsbHljaGFpbkF1dGhDcmVkZW50aWFscyBPcHRpb25hbC4gQW4gYXJyYXkgb2YgaW5kZXggYW5kIGFkZHJlc3MgdG8gc2lnbiBmb3IgZWFjaCBBbGx5Y2hhaW5BdXRoLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZEFkZEFsbHljaGFpblZhbGlkYXRvclR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGNoYW5nZUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBub2RlSUQ6IEJ1ZmZlcixcclxuICAgIHN0YXJ0VGltZTogQk4sXHJcbiAgICBlbmRUaW1lOiBCTixcclxuICAgIHdlaWdodDogQk4sXHJcbiAgICBhbGx5Y2hhaW5JRDogc3RyaW5nLFxyXG4gICAgZmVlOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIGZlZUFzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgYWxseWNoYWluQXV0aENyZWRlbnRpYWxzOiBbbnVtYmVyLCBCdWZmZXJdW10gPSBbXVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBjb25zdCBub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICBpZiAoc3RhcnRUaW1lLmx0KG5vdykgfHwgZW5kVGltZS5sdGUoc3RhcnRUaW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgXCJVVFhPU2V0LmJ1aWxkQWRkQWxseWNoYWluVmFsaWRhdG9yVHggLS0gc3RhcnRUaW1lIG11c3QgYmUgaW4gdGhlIGZ1dHVyZSBhbmQgZW5kVGltZSBtdXN0IGNvbWUgYWZ0ZXIgc3RhcnRUaW1lXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBjaGFuZ2VBZGRyZXNzZXNcclxuICAgICAgKVxyXG4gICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICBjb25zdCBzdWNjZXNzOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShhYWQsIGFzT2YpXHJcbiAgICAgIGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICAgIG91dHMgPSBhYWQuZ2V0QWxsT3V0cHV0cygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgc3VjY2Vzc1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWRkQWxseWNoYWluVmFsaWRhdG9yVHg6IEFkZEFsbHljaGFpblZhbGlkYXRvclR4ID1cclxuICAgICAgbmV3IEFkZEFsbHljaGFpblZhbGlkYXRvclR4KFxyXG4gICAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgICAgb3V0cyxcclxuICAgICAgICBpbnMsXHJcbiAgICAgICAgbWVtbyxcclxuICAgICAgICBub2RlSUQsXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgd2VpZ2h0LFxyXG4gICAgICAgIGFsbHljaGFpbklEXHJcbiAgICAgIClcclxuICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFscy5mb3JFYWNoKFxyXG4gICAgICAoYWxseWNoYWluQXV0aENyZWRlbnRpYWw6IFtudW1iZXIsIEJ1ZmZlcl0pID0+IHtcclxuICAgICAgICBhZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeC5hZGRTaWduYXR1cmVJZHgoXHJcbiAgICAgICAgICBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbFswXSxcclxuICAgICAgICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFsWzFdXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoYWRkQWxseWNoYWluVmFsaWRhdG9yVHgpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgW1tBZGROb21pbmF0b3JUeF1dIHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBOZXR3b3JraWQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBCbG9ja2NoYWluaWQsIGRlZmF1bHQgdW5kZWZpbmVkXHJcbiAgICogQHBhcmFtIGF4Y0Fzc2V0SUQge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb2YgdGhlIGFzc2V0IElEIGZvciBBWENcclxuICAgKiBAcGFyYW0gdG9BZGRyZXNzZXMgQW4gYXJyYXkgb2YgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlY2lldmVzIHRoZSBzdGFrZSBhdCB0aGUgZW5kIG9mIHRoZSBzdGFraW5nIHBlcmlvZFxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcGF5cyB0aGUgZmVlcyBhbmQgdGhlIHN0YWtlXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIGdldHMgdGhlIGNoYW5nZSBsZWZ0b3ZlciBmcm9tIHRoZSBzdGFraW5nIHBheW1lbnRcclxuICAgKiBAcGFyYW0gbm9kZUlEIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3IgYmVpbmcgYWRkZWQuXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBUaGUgVW5peCB0aW1lIHdoZW4gdGhlIHZhbGlkYXRvciBzdGFydHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrLlxyXG4gICAqIEBwYXJhbSBlbmRUaW1lIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0b3BzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yayAoYW5kIHN0YWtlZCBBWEMgaXMgcmV0dXJuZWQpLlxyXG4gICAqIEBwYXJhbSBzdGFrZUFtb3VudCBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgYW1vdW50IG9mIHN0YWtlIHRvIGJlIG5vbWluYXRlZCBpbiBuQVhDLlxyXG4gICAqIEBwYXJhbSByZXdhcmRMb2NrdGltZSBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIHJld2FyZCBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHJld2FyZFRocmVzaG9sZCBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgcmV3YXJkIFVUWE9cclxuICAgKiBAcGFyYW0gcmV3YXJkQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhlIHZhbGlkYXRvciByZXdhcmQgZ29lcy5cclxuICAgKiBAcGFyYW0gZmVlIE9wdGlvbmFsLiBUaGUgYW1vdW50IG9mIGZlZXMgdG8gYnVybiBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBmZWVBc3NldElEIE9wdGlvbmFsLiBUaGUgYXNzZXRJRCBvZiB0aGUgZmVlcyBiZWluZyBidXJuZWQuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZEFkZE5vbWluYXRvclR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICBheGNBc3NldElEOiBCdWZmZXIsXHJcbiAgICB0b0FkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGNoYW5nZUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBub2RlSUQ6IEJ1ZmZlcixcclxuICAgIHN0YXJ0VGltZTogQk4sXHJcbiAgICBlbmRUaW1lOiBCTixcclxuICAgIHN0YWtlQW1vdW50OiBCTixcclxuICAgIHJld2FyZExvY2t0aW1lOiBCTixcclxuICAgIHJld2FyZFRocmVzaG9sZDogbnVtYmVyLFxyXG4gICAgcmV3YXJkQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gICAgbGV0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBjb25zdCBub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICBpZiAoc3RhcnRUaW1lLmx0KG5vdykgfHwgZW5kVGltZS5sdGUoc3RhcnRUaW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgVGltZUVycm9yKFxyXG4gICAgICAgIFwiVVRYT1NldC5idWlsZEFkZE5vbWluYXRvclR4IC0tIHN0YXJ0VGltZSBtdXN0IGJlIGluIHRoZSBmdXR1cmUgYW5kIGVuZFRpbWUgbXVzdCBjb21lIGFmdGVyIHN0YXJ0VGltZVwiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhYWQ6IEFzc2V0QW1vdW50RGVzdGluYXRpb24gPSBuZXcgQXNzZXRBbW91bnREZXN0aW5hdGlvbihcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgKVxyXG4gICAgaWYgKGF4Y0Fzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikgPT09IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGF4Y0Fzc2V0SUQsIHN0YWtlQW1vdW50LCBmZWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhYWQuYWRkQXNzZXRBbW91bnQoYXhjQXNzZXRJRCwgc3Rha2VBbW91bnQsIHplcm8pXHJcbiAgICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1pblNwZW5kYWJsZUVycjogRXJyb3IgPSB0aGlzLmdldE1pbmltdW1TcGVuZGFibGUoXHJcbiAgICAgIGFhZCxcclxuICAgICAgYXNPZixcclxuICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICB1bmRlZmluZWQsXHJcbiAgICAgIHRydWVcclxuICAgIClcclxuICAgIGlmICh0eXBlb2YgbWluU3BlbmRhYmxlRXJyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICBvdXRzID0gYWFkLmdldENoYW5nZU91dHB1dHMoKVxyXG4gICAgICBzdGFrZU91dHMgPSBhYWQuZ2V0T3V0cHV0cygpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBtaW5TcGVuZGFibGVFcnJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXdhcmRPdXRwdXRPd25lcnM6IFNFQ1BPd25lck91dHB1dCA9IG5ldyBTRUNQT3duZXJPdXRwdXQoXHJcbiAgICAgIHJld2FyZEFkZHJlc3NlcyxcclxuICAgICAgcmV3YXJkTG9ja3RpbWUsXHJcbiAgICAgIHJld2FyZFRocmVzaG9sZFxyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IFVUeDogQWRkTm9taW5hdG9yVHggPSBuZXcgQWRkTm9taW5hdG9yVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG5vZGVJRCxcclxuICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICBlbmRUaW1lLFxyXG4gICAgICBzdGFrZUFtb3VudCxcclxuICAgICAgc3Rha2VPdXRzLFxyXG4gICAgICBuZXcgUGFyc2VhYmxlT3V0cHV0KHJld2FyZE91dHB1dE93bmVycylcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChVVHgpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgW1tBZGRWYWxpZGF0b3JUeF1dIHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBOZXR3b3JrSUQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBCbG9ja2NoYWluSUQsIGRlZmF1bHQgdW5kZWZpbmVkXHJcbiAgICogQHBhcmFtIGF4Y0Fzc2V0SUQge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb2YgdGhlIGFzc2V0IElEIGZvciBBWENcclxuICAgKiBAcGFyYW0gdG9BZGRyZXNzZXMgQW4gYXJyYXkgb2YgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlY2lldmVzIHRoZSBzdGFrZSBhdCB0aGUgZW5kIG9mIHRoZSBzdGFraW5nIHBlcmlvZFxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcGF5cyB0aGUgZmVlcyBhbmQgdGhlIHN0YWtlXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIGdldHMgdGhlIGNoYW5nZSBsZWZ0b3ZlciBmcm9tIHRoZSBzdGFraW5nIHBheW1lbnRcclxuICAgKiBAcGFyYW0gbm9kZUlEIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3IgYmVpbmcgYWRkZWQuXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBUaGUgVW5peCB0aW1lIHdoZW4gdGhlIHZhbGlkYXRvciBzdGFydHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrLlxyXG4gICAqIEBwYXJhbSBlbmRUaW1lIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0b3BzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yayAoYW5kIHN0YWtlZCBBWEMgaXMgcmV0dXJuZWQpLlxyXG4gICAqIEBwYXJhbSBzdGFrZUFtb3VudCBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgYW1vdW50IG9mIHN0YWtlIHRvIGJlIG5vbWluYXRlZCBpbiBuQVhDLlxyXG4gICAqIEBwYXJhbSByZXdhcmRMb2NrdGltZSBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIHJld2FyZCBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHJld2FyZFRocmVzaG9sZCBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgcmV3YXJkIFVUWE9cclxuICAgKiBAcGFyYW0gcmV3YXJkQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhlIHZhbGlkYXRvciByZXdhcmQgZ29lcy5cclxuICAgKiBAcGFyYW0gbm9taW5hdGlvbkZlZSBBIG51bWJlciBmb3IgdGhlIHBlcmNlbnRhZ2Ugb2YgcmV3YXJkIHRvIGJlIGdpdmVuIHRvIHRoZSB2YWxpZGF0b3Igd2hlbiBzb21lb25lIG5vbWluYXRlcyB0byB0aGVtLiBNdXN0IGJlIGJldHdlZW4gMCBhbmQgMTAwLlxyXG4gICAqIEBwYXJhbSBtaW5TdGFrZSBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IHJlcHJlc2VudGluZyB0aGUgbWluaW11bSBzdGFrZSByZXF1aXJlZCB0byB2YWxpZGF0ZSBvbiB0aGlzIG5ldHdvcmsuXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkLlxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICovXHJcbiAgYnVpbGRBZGRWYWxpZGF0b3JUeCA9IChcclxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgYXhjQXNzZXRJRDogQnVmZmVyLFxyXG4gICAgdG9BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgZnJvbUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgbm9kZUlEOiBCdWZmZXIsXHJcbiAgICBzdGFydFRpbWU6IEJOLFxyXG4gICAgZW5kVGltZTogQk4sXHJcbiAgICBzdGFrZUFtb3VudDogQk4sXHJcbiAgICByZXdhcmRMb2NrdGltZTogQk4sXHJcbiAgICByZXdhcmRUaHJlc2hvbGQ6IG51bWJlcixcclxuICAgIHJld2FyZEFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBub21pbmF0aW9uRmVlOiBudW1iZXIsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KClcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGxldCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuICAgIGxldCBzdGFrZU91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgY29uc3Qgbm93OiBCTiA9IFVuaXhOb3coKVxyXG4gICAgaWYgKHN0YXJ0VGltZS5sdChub3cpIHx8IGVuZFRpbWUubHRlKHN0YXJ0VGltZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IFRpbWVFcnJvcihcclxuICAgICAgICBcIlVUWE9TZXQuYnVpbGRBZGRWYWxpZGF0b3JUeCAtLSBzdGFydFRpbWUgbXVzdCBiZSBpbiB0aGUgZnV0dXJlIGFuZCBlbmRUaW1lIG11c3QgY29tZSBhZnRlciBzdGFydFRpbWVcIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5vbWluYXRpb25GZWUgPiAxMDAgfHwgbm9taW5hdGlvbkZlZSA8IDApIHtcclxuICAgICAgdGhyb3cgbmV3IFRpbWVFcnJvcihcclxuICAgICAgICBcIlVUWE9TZXQuYnVpbGRBZGRWYWxpZGF0b3JUeCAtLSBzdGFydFRpbWUgbXVzdCBiZSBpbiB0aGUgcmFuZ2Ugb2YgMCB0byAxMDAsIGluY2x1c2l2ZWx5XCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICB0b0FkZHJlc3NlcyxcclxuICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgY2hhbmdlQWRkcmVzc2VzXHJcbiAgICApXHJcbiAgICBpZiAoYXhjQXNzZXRJRC50b1N0cmluZyhcImhleFwiKSA9PT0gZmVlQXNzZXRJRC50b1N0cmluZyhcImhleFwiKSkge1xyXG4gICAgICBhYWQuYWRkQXNzZXRBbW91bnQoYXhjQXNzZXRJRCwgc3Rha2VBbW91bnQsIGZlZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChheGNBc3NldElELCBzdGFrZUFtb3VudCwgemVybylcclxuICAgICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWluU3BlbmRhYmxlRXJyOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgYWFkLFxyXG4gICAgICBhc09mLFxyXG4gICAgICB1bmRlZmluZWQsXHJcbiAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgdHJ1ZVxyXG4gICAgKVxyXG4gICAgaWYgKHR5cGVvZiBtaW5TcGVuZGFibGVFcnIgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgIG91dHMgPSBhYWQuZ2V0Q2hhbmdlT3V0cHV0cygpXHJcbiAgICAgIHN0YWtlT3V0cyA9IGFhZC5nZXRPdXRwdXRzKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG1pblNwZW5kYWJsZUVyclxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJld2FyZE91dHB1dE93bmVyczogU0VDUE93bmVyT3V0cHV0ID0gbmV3IFNFQ1BPd25lck91dHB1dChcclxuICAgICAgcmV3YXJkQWRkcmVzc2VzLFxyXG4gICAgICByZXdhcmRMb2NrdGltZSxcclxuICAgICAgcmV3YXJkVGhyZXNob2xkXHJcbiAgICApXHJcblxyXG4gICAgY29uc3QgVVR4OiBBZGRWYWxpZGF0b3JUeCA9IG5ldyBBZGRWYWxpZGF0b3JUeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIG91dHMsXHJcbiAgICAgIGlucyxcclxuICAgICAgbWVtbyxcclxuICAgICAgbm9kZUlELFxyXG4gICAgICBzdGFydFRpbWUsXHJcbiAgICAgIGVuZFRpbWUsXHJcbiAgICAgIHN0YWtlQW1vdW50LFxyXG4gICAgICBzdGFrZU91dHMsXHJcbiAgICAgIG5ldyBQYXJzZWFibGVPdXRwdXQocmV3YXJkT3V0cHV0T3duZXJzKSxcclxuICAgICAgbm9taW5hdGlvbkZlZVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBVbnNpZ25lZFR4KFVUeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhbiB1bnNpZ25lZCBbW0NyZWF0ZUFsbHljaGFpblR4XV0gdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE5ldHdvcmtpZCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIEJsb2NrY2hhaW5pZCwgZGVmYXVsdCB1bmRlZmluZWRcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3MuXHJcbiAgICogQHBhcmFtIGFsbHljaGFpbk93bmVyQWRkcmVzc2VzIEFuIGFycmF5IG9mIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgYWRkcmVzc2VzIHRvIGFkZCB0byBhIGFsbHljaGFpblxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5Pd25lclRocmVzaG9sZCBUaGUgbnVtYmVyIG9mIG93bmVycydzIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gYWRkIGEgdmFsaWRhdG9yIHRvIHRoZSBuZXR3b3JrXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZENyZWF0ZUFsbHljaGFpblR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIgPSBEZWZhdWx0TmV0d29ya0lELFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGNoYW5nZUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBhbGx5Y2hhaW5Pd25lckFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBhbGx5Y2hhaW5Pd25lclRocmVzaG9sZDogbnVtYmVyLFxyXG4gICAgZmVlOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIGZlZUFzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpXHJcbiAgKTogVW5zaWduZWRUeCA9PiB7XHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG5cclxuICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBjaGFuZ2VBZGRyZXNzZXNcclxuICAgICAgKVxyXG4gICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICBjb25zdCBtaW5TcGVuZGFibGVFcnI6IEVycm9yID0gdGhpcy5nZXRNaW5pbXVtU3BlbmRhYmxlKFxyXG4gICAgICAgIGFhZCxcclxuICAgICAgICBhc09mLFxyXG4gICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICB1bmRlZmluZWRcclxuICAgICAgKVxyXG4gICAgICBpZiAodHlwZW9mIG1pblNwZW5kYWJsZUVyciA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICAgIG91dHMgPSBhYWQuZ2V0QWxsT3V0cHV0cygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbWluU3BlbmRhYmxlRXJyXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcclxuICAgIGNvbnN0IFVUeDogQ3JlYXRlQWxseWNoYWluVHggPSBuZXcgQ3JlYXRlQWxseWNoYWluVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG5ldyBTRUNQT3duZXJPdXRwdXQoXHJcbiAgICAgICAgYWxseWNoYWluT3duZXJBZGRyZXNzZXMsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgYWxseWNoYWluT3duZXJUaHJlc2hvbGRcclxuICAgICAgKVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBVbnNpZ25lZFR4KFVUeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ1aWxkIGFuIHVuc2lnbmVkIFtbQ3JlYXRlQ2hhaW5UeF1dLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBOZXR3b3JraWQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBCbG9ja2NoYWluaWQsIGRlZmF1bHQgdW5kZWZpbmVkXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zLlxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5JRCBPcHRpb25hbCBJRCBvZiB0aGUgQWxseWNoYWluIHRoYXQgdmFsaWRhdGVzIHRoaXMgYmxvY2tjaGFpblxyXG4gICAqIEBwYXJhbSBjaGFpbk5hbWUgT3B0aW9uYWwgQSBodW1hbiByZWFkYWJsZSBuYW1lIGZvciB0aGUgY2hhaW47IG5lZWQgbm90IGJlIHVuaXF1ZVxyXG4gICAqIEBwYXJhbSB2bUlEIE9wdGlvbmFsIElEIG9mIHRoZSBWTSBydW5uaW5nIG9uIHRoZSBuZXcgY2hhaW5cclxuICAgKiBAcGFyYW0gZnhJRHMgT3B0aW9uYWwgSURzIG9mIHRoZSBmZWF0dXJlIGV4dGVuc2lvbnMgcnVubmluZyBvbiB0aGUgbmV3IGNoYWluXHJcbiAgICogQHBhcmFtIGdlbmVzaXNEYXRhIE9wdGlvbmFsIEJ5dGUgcmVwcmVzZW50YXRpb24gb2YgZ2VuZXNpcyBzdGF0ZSBvZiB0aGUgbmV3IGNoYWluXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbHMgT3B0aW9uYWwuIEFuIGFycmF5IG9mIGluZGV4IGFuZCBhZGRyZXNzIHRvIHNpZ24gZm9yIGVhY2ggQWxseWNoYWluQXV0aC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIENyZWF0ZUNoYWluVHggY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZENyZWF0ZUNoYWluVHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlciA9IERlZmF1bHROZXR3b3JrSUQsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlcixcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGFsbHljaGFpbklEOiBzdHJpbmcgfCBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBjaGFpbk5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIHZtSUQ6IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIGZ4SURzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZCxcclxuICAgIGdlbmVzaXNEYXRhOiBzdHJpbmcgfCBHZW5lc2lzRGF0YSA9IHVuZGVmaW5lZCxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFsczogW251bWJlciwgQnVmZmVyXVtdID0gW11cclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcblxyXG4gICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgICApXHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChmZWVBc3NldElELCB6ZXJvLCBmZWUpXHJcbiAgICAgIGNvbnN0IG1pblNwZW5kYWJsZUVycjogRXJyb3IgPSB0aGlzLmdldE1pbmltdW1TcGVuZGFibGUoXHJcbiAgICAgICAgYWFkLFxyXG4gICAgICAgIGFzT2YsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIHVuZGVmaW5lZFxyXG4gICAgICApXHJcbiAgICAgIGlmICh0eXBlb2YgbWluU3BlbmRhYmxlRXJyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgICAgb3V0cyA9IGFhZC5nZXRBbGxPdXRwdXRzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBtaW5TcGVuZGFibGVFcnJcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNyZWF0ZUNoYWluVHg6IENyZWF0ZUNoYWluVHggPSBuZXcgQ3JlYXRlQ2hhaW5UeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIG91dHMsXHJcbiAgICAgIGlucyxcclxuICAgICAgbWVtbyxcclxuICAgICAgYWxseWNoYWluSUQsXHJcbiAgICAgIGNoYWluTmFtZSxcclxuICAgICAgdm1JRCxcclxuICAgICAgZnhJRHMsXHJcbiAgICAgIGdlbmVzaXNEYXRhXHJcbiAgICApXHJcbiAgICBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbHMuZm9yRWFjaChcclxuICAgICAgKGFsbHljaGFpbkF1dGhDcmVkZW50aWFsOiBbbnVtYmVyLCBCdWZmZXJdKSA9PiB7XHJcbiAgICAgICAgY3JlYXRlQ2hhaW5UeC5hZGRTaWduYXR1cmVJZHgoXHJcbiAgICAgICAgICBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbFswXSxcclxuICAgICAgICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFsWzFdXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoY3JlYXRlQ2hhaW5UeClcclxuICB9XHJcbn1cclxuIl19