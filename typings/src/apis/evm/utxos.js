"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-UTXOs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOSet = exports.AssetAmountDestination = exports.UTXO = void 0;
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const outputs_1 = require("./outputs");
const constants_1 = require("./constants");
const inputs_1 = require("./inputs");
const helperfunctions_1 = require("../../utils/helperfunctions");
const utxos_1 = require("../../common/utxos");
const constants_2 = require("../../utils/constants");
const assetamount_1 = require("../../common/assetamount");
const serialization_1 = require("../../utils/serialization");
const tx_1 = require("./tx");
const importtx_1 = require("./importtx");
const exporttx_1 = require("./exporttx");
const errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
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
    create(codecID = constants_1.EVMConstants.LATESTCODEC, txID = undefined, outputidx = undefined, assetID = undefined, output = undefined) {
        return new UTXO(codecID, txID, outputidx, assetID, output);
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
        this.getMinimumSpendable = (aad, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            const utxoArray = this.getAllUTXOs();
            const outids = {};
            for (let i = 0; i < utxoArray.length && !aad.canComplete(); i++) {
                const u = utxoArray[`${i}`];
                const assetKey = u.getAssetID().toString("hex");
                const fromAddresses = aad.getSenders();
                if (u.getOutput() instanceof outputs_1.AmountOutput &&
                    aad.assetExists(assetKey) &&
                    u.getOutput().meetsThreshold(fromAddresses, asOf)) {
                    const am = aad.getAssetAmount(assetKey);
                    if (!am.isFinished()) {
                        const uout = u.getOutput();
                        outids[`${assetKey}`] = uout.getOutputID();
                        const amount = uout.getAmount();
                        am.spendAmount(amount);
                        const txid = u.getTxID();
                        const outputidx = u.getOutputIdx();
                        const input = new inputs_1.SECPTransferInput(amount);
                        const xferin = new inputs_1.TransferableInput(txid, outputidx, u.getAssetID(), input);
                        const spenders = uout.getSpenders(fromAddresses, asOf);
                        spenders.forEach((spender) => {
                            const idx = uout.getAddressIdx(spender);
                            if (idx === -1) {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such address in output");
                            }
                            xferin.getInput().addSignatureIdx(idx, spender);
                        });
                        aad.addInput(xferin);
                    }
                    else if (aad.assetExists(assetKey) &&
                        !(u.getOutput() instanceof outputs_1.AmountOutput)) {
                        /**
                         * Leaving the below lines, not simply for posterity, but for clarification.
                         * AssetIDs may have mixed OutputTypes.
                         * Some of those OutputTypes may implement AmountOutput.
                         * Others may not.
                         * Simply continue in this condition.
                         */
                        /*return new Error('Error - UTXOSet.getMinimumSpendable: outputID does not '
                           + `implement AmountOutput: ${u.getOutput().getOutputID}`);*/
                        continue;
                    }
                }
            }
            if (!aad.canComplete()) {
                return new errors_1.InsufficientFundsError(`Error - UTXOSet.getMinimumSpendable: insufficient funds to create the transaction`);
            }
            const amounts = aad.getAmounts();
            const zero = new bn_js_1.default(0);
            for (let i = 0; i < amounts.length; i++) {
                const assetKey = amounts[`${i}`].getAssetIDString();
                const amount = amounts[`${i}`].getAmount();
                if (amount.gt(zero)) {
                    const spendout = (0, outputs_1.SelectOutputClass)(outids[`${assetKey}`], amount, aad.getDestinations(), locktime, threshold);
                    const xferout = new outputs_1.TransferableOutput(amounts[`${i}`].getAssetID(), spendout);
                    aad.addOutput(xferout);
                }
                const change = amounts[`${i}`].getChange();
                if (change.gt(zero)) {
                    const changeout = (0, outputs_1.SelectOutputClass)(outids[`${assetKey}`], change, aad.getChangeAddresses());
                    const chgxferout = new outputs_1.TransferableOutput(amounts[`${i}`].getAssetID(), changeout);
                    aad.addChange(chgxferout);
                }
            }
            return undefined;
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddress The address to send the funds
         * @param importIns An array of [[TransferableInput]]s being imported
         * @param sourceChain A {@link https://github.com/feross/buffer|Buffer} for the chainid where the imports are coming from.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}. Fee will come from the inputs first, if they can.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildImportTx = (networkID, blockchainID, toAddress, atomics, sourceChain = undefined, fee = undefined, feeAssetID = undefined) => {
            const zero = new bn_js_1.default(0);
            const map = new Map();
            let ins = [];
            let outs = [];
            let feepaid = new bn_js_1.default(0);
            if (typeof fee === "undefined") {
                fee = zero.clone();
            }
            // build a set of inputs which covers the fee
            atomics.forEach((atomic) => {
                const assetIDBuf = atomic.getAssetID();
                const assetID = bintools.cb58Encode(atomic.getAssetID());
                const output = atomic.getOutput();
                const amount = output.getAmount().clone();
                let infeeamount = amount.clone();
                if (typeof feeAssetID !== "undefined" &&
                    fee.gt(zero) &&
                    feepaid.lt(fee) &&
                    buffer_1.Buffer.compare(feeAssetID, assetIDBuf) === 0) {
                    feepaid = feepaid.add(infeeamount);
                    if (feepaid.gt(fee)) {
                        infeeamount = feepaid.sub(fee);
                        feepaid = fee.clone();
                    }
                    else {
                        infeeamount = zero.clone();
                    }
                }
                const txid = atomic.getTxID();
                const outputidx = atomic.getOutputIdx();
                const input = new inputs_1.SECPTransferInput(amount);
                const xferin = new inputs_1.TransferableInput(txid, outputidx, assetIDBuf, input);
                const from = output.getAddresses();
                const spenders = output.getSpenders(from);
                spenders.forEach((spender) => {
                    const idx = output.getAddressIdx(spender);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildImportTx: no such address in output");
                    }
                    xferin.getInput().addSignatureIdx(idx, spender);
                });
                ins.push(xferin);
                if (map.has(assetID)) {
                    infeeamount = infeeamount.add(new bn_js_1.default(map.get(assetID)));
                }
                map.set(assetID, infeeamount.toString());
            });
            for (let [assetID, amount] of map) {
                // Create single EVMOutput for each assetID
                const evmOutput = new outputs_1.EVMOutput(toAddress, new bn_js_1.default(amount), bintools.cb58Decode(assetID));
                outs.push(evmOutput);
            }
            // lexicographically sort array
            ins = ins.sort(inputs_1.TransferableInput.comparator());
            outs = outs.sort(outputs_1.EVMOutput.comparator());
            const importTx = new importtx_1.ImportTx(networkID, blockchainID, sourceChain, ins, outs, fee);
            return new tx_1.UnsignedTx(importTx);
        };
        /**
         * Creates an unsigned ExportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the AssetID for AXC
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who recieves the AXC
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who owns the AXC
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildExportTx = (networkID, blockchainID, amount, axcAssetID, toAddresses, fromAddresses, changeAddresses = undefined, destinationChain = undefined, fee = undefined, feeAssetID = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            let ins = [];
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
                throw new errors_1.FeeAssetError("Error - UTXOSet.buildExportTx: feeAssetID must match axcAssetID");
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.PlatformChainID);
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
            const success = this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                exportouts = aad.getOutputs();
            }
            else {
                throw success;
            }
            const exportTx = new exporttx_1.ExportTx(networkID, blockchainID, destinationChain, ins, exportouts);
            return new tx_1.UnsignedTx(exportTx);
        };
    }
    //serialize is inherited
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        const utxos = {};
        for (let utxoid in fields["utxos"]) {
            let utxoidCleaned = serializer.decoder(utxoid, encoding, "base58", "base58");
            utxos[`${utxoidCleaned}`] = new UTXO();
            utxos[`${utxoidCleaned}`].deserialize(fields["utxos"][`${utxoid}`], encoding);
        }
        let addressUTXOs = {};
        for (let address in fields["addressUTXOs"]) {
            let addressCleaned = serializer.decoder(address, encoding, "cb58", "hex");
            let utxobalance = {};
            for (let utxoid in fields["addressUTXOs"][`${address}`]) {
                let utxoidCleaned = serializer.decoder(utxoid, encoding, "base58", "base58");
                utxobalance[`${utxoidCleaned}`] = serializer.decoder(fields["addressUTXOs"][`${address}`][`${utxoid}`], encoding, "decimalString", "BN");
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
        else if (utxo instanceof UTXO) {
            utxovar.fromBuffer(utxo.toBuffer()); // forces a copy
        }
        else {
            /* istanbul ignore next */
            throw new errors_1.UTXOError("Error - UTXO.parseUTXO: utxo parameter is not a UTXO or string");
        }
        return utxovar;
    }
    create() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXR4b3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9ldm0vdXR4b3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7Ozs7O0FBRUgsb0NBQWdDO0FBQ2hDLG9FQUEyQztBQUMzQyxrREFBc0I7QUFDdEIsdUNBS2tCO0FBQ2xCLDJDQUEwQztBQUMxQyxxQ0FBeUU7QUFFekUsaUVBQXFEO0FBQ3JELDhDQUFrRTtBQUNsRSxxREFBdUQ7QUFDdkQsMERBR2lDO0FBQ2pDLDZEQUE2RTtBQUM3RSw2QkFBaUM7QUFDakMseUNBQXFDO0FBQ3JDLHlDQUFxQztBQUNyQywrQ0FLMkI7QUFFM0I7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sVUFBVSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRTdEOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsb0JBQVk7SUFBdEM7O1FBQ1ksY0FBUyxHQUFHLE1BQU0sQ0FBQTtRQUNsQixZQUFPLEdBQUcsU0FBUyxDQUFBO0lBb0UvQixDQUFDO0lBbEVDLHdCQUF3QjtJQUV4QixXQUFXLENBQUMsTUFBYyxFQUFFLFdBQStCLEtBQUs7UUFDOUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDJCQUFpQixFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWEsRUFBRSxTQUFpQixDQUFDO1FBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMzRCxNQUFNLElBQUksQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sSUFBSSxFQUFFLENBQUE7UUFDWixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0QsTUFBTSxJQUFJLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUM1RCxNQUFNLElBQUksRUFBRSxDQUFBO1FBQ1osTUFBTSxRQUFRLEdBQVcsUUFBUTthQUM5QixRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ25DLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsQixNQUFNLElBQUksQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDJCQUFpQixFQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxVQUFVLENBQUMsVUFBa0I7UUFDM0IsMEJBQTBCO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsUUFBUTtRQUNOLDBCQUEwQjtRQUMxQixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDN0MsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLElBQUksR0FBUyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDaEMsT0FBTyxJQUFZLENBQUE7SUFDckIsQ0FBQztJQUVELE1BQU0sQ0FDSixVQUFrQix3QkFBWSxDQUFDLFdBQVcsRUFDMUMsT0FBZSxTQUFTLEVBQ3hCLFlBQTZCLFNBQVMsRUFDdEMsVUFBa0IsU0FBUyxFQUMzQixTQUFpQixTQUFTO1FBRTFCLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBUyxDQUFBO0lBQ3BFLENBQUM7Q0FDRjtBQXRFRCxvQkFzRUM7QUFFRCxNQUFhLHNCQUF1QixTQUFRLDRDQUczQztDQUFHO0FBSEosd0RBR0k7QUFFSjs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHVCQUFxQjtJQUFsRDs7UUFDWSxjQUFTLEdBQUcsU0FBUyxDQUFBO1FBQ3JCLFlBQU8sR0FBRyxTQUFTLENBQUE7UUFxRjdCLHdCQUFtQixHQUFHLENBQ3BCLEdBQTJCLEVBQzNCLE9BQVcsSUFBQSx5QkFBTyxHQUFFLEVBQ3BCLFdBQWUsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3hCLFlBQW9CLENBQUMsRUFDZCxFQUFFO1lBQ1QsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQzVDLE1BQU0sTUFBTSxHQUFXLEVBQUUsQ0FBQTtZQUN6QixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkUsTUFBTSxDQUFDLEdBQVMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDakMsTUFBTSxRQUFRLEdBQVcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdkQsTUFBTSxhQUFhLEdBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUNoRCxJQUNFLENBQUMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxzQkFBWTtvQkFDckMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7b0JBQ3pCLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUNqRDtvQkFDQSxNQUFNLEVBQUUsR0FBZ0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFDcEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsRUFBRTt3QkFDcEIsTUFBTSxJQUFJLEdBQWlCLENBQUMsQ0FBQyxTQUFTLEVBQWtCLENBQUE7d0JBQ3hELE1BQU0sQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO3dCQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7d0JBQy9CLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBQ3RCLE1BQU0sSUFBSSxHQUFXLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTt3QkFDaEMsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFBO3dCQUMxQyxNQUFNLEtBQUssR0FBc0IsSUFBSSwwQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTt3QkFDOUQsTUFBTSxNQUFNLEdBQXNCLElBQUksMEJBQWlCLENBQ3JELElBQUksRUFDSixTQUFTLEVBQ1QsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUNkLEtBQUssQ0FDTixDQUFBO3dCQUNELE1BQU0sUUFBUSxHQUFhLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO3dCQUNoRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBZSxFQUFFLEVBQUU7NEJBQ25DLE1BQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7NEJBQy9DLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dDQUNkLDBCQUEwQjtnQ0FDMUIsTUFBTSxJQUFJLHFCQUFZLENBQ3BCLGdFQUFnRSxDQUNqRSxDQUFBOzZCQUNGOzRCQUNELE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO3dCQUNqRCxDQUFDLENBQUMsQ0FBQTt3QkFDRixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO3FCQUNyQjt5QkFBTSxJQUNMLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO3dCQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxZQUFZLHNCQUFZLENBQUMsRUFDeEM7d0JBQ0E7Ozs7OzsyQkFNRzt3QkFDSDt1RkFDK0Q7d0JBQy9ELFNBQVE7cUJBQ1Q7aUJBQ0Y7YUFDRjtZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSwrQkFBc0IsQ0FDL0IsbUZBQW1GLENBQ3BGLENBQUE7YUFDRjtZQUNELE1BQU0sT0FBTyxHQUFrQixHQUFHLENBQUMsVUFBVSxFQUFFLENBQUE7WUFDL0MsTUFBTSxJQUFJLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtnQkFDM0QsTUFBTSxNQUFNLEdBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDOUMsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuQixNQUFNLFFBQVEsR0FBaUIsSUFBQSwyQkFBaUIsRUFDOUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFDckIsTUFBTSxFQUNOLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFDckIsUUFBUSxFQUNSLFNBQVMsQ0FDTSxDQUFBO29CQUNqQixNQUFNLE9BQU8sR0FBdUIsSUFBSSw0QkFBa0IsQ0FDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDNUIsUUFBUSxDQUNULENBQUE7b0JBQ0QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtpQkFDdkI7Z0JBQ0QsTUFBTSxNQUFNLEdBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDOUMsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuQixNQUFNLFNBQVMsR0FBaUIsSUFBQSwyQkFBaUIsRUFDL0MsTUFBTSxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFDckIsTUFBTSxFQUNOLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUNULENBQUE7b0JBQ2pCLE1BQU0sVUFBVSxHQUF1QixJQUFJLDRCQUFrQixDQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUM1QixTQUFTLENBQ1YsQ0FBQTtvQkFDRCxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO2lCQUMxQjthQUNGO1lBQ0QsT0FBTyxTQUFTLENBQUE7UUFDbEIsQ0FBQyxDQUFBO1FBRUQ7Ozs7Ozs7Ozs7OztXQVlHO1FBQ0gsa0JBQWEsR0FBRyxDQUNkLFNBQWlCLEVBQ2pCLFlBQW9CLEVBQ3BCLFNBQWlCLEVBQ2pCLE9BQWUsRUFDZixjQUFzQixTQUFTLEVBQy9CLE1BQVUsU0FBUyxFQUNuQixhQUFxQixTQUFTLEVBQ2xCLEVBQUU7WUFDZCxNQUFNLElBQUksR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxQixNQUFNLEdBQUcsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtZQUUxQyxJQUFJLEdBQUcsR0FBd0IsRUFBRSxDQUFBO1lBQ2pDLElBQUksSUFBSSxHQUFnQixFQUFFLENBQUE7WUFDMUIsSUFBSSxPQUFPLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFM0IsSUFBSSxPQUFPLEdBQUcsS0FBSyxXQUFXLEVBQUU7Z0JBQzlCLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7YUFDbkI7WUFFRCw2Q0FBNkM7WUFDN0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQVksRUFBUSxFQUFFO2dCQUNyQyxNQUFNLFVBQVUsR0FBVyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQzlDLE1BQU0sT0FBTyxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7Z0JBQ2hFLE1BQU0sTUFBTSxHQUFpQixNQUFNLENBQUMsU0FBUyxFQUFrQixDQUFBO2dCQUMvRCxNQUFNLE1BQU0sR0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQzdDLElBQUksV0FBVyxHQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtnQkFFcEMsSUFDRSxPQUFPLFVBQVUsS0FBSyxXQUFXO29CQUNqQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDWixPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDZixlQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQzVDO29CQUNBLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUNsQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQ25CLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUM5QixPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBO3FCQUN0Qjt5QkFBTTt3QkFDTCxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO3FCQUMzQjtpQkFDRjtnQkFFRCxNQUFNLElBQUksR0FBVyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7Z0JBQ3JDLE1BQU0sU0FBUyxHQUFXLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtnQkFDL0MsTUFBTSxLQUFLLEdBQXNCLElBQUksMEJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzlELE1BQU0sTUFBTSxHQUFzQixJQUFJLDBCQUFpQixDQUNyRCxJQUFJLEVBQ0osU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLENBQ04sQ0FBQTtnQkFDRCxNQUFNLElBQUksR0FBYSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUE7Z0JBQzVDLE1BQU0sUUFBUSxHQUFhLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ25ELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFlLEVBQVEsRUFBRTtvQkFDekMsTUFBTSxHQUFHLEdBQVcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDakQsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQ2QsMEJBQTBCO3dCQUMxQixNQUFNLElBQUkscUJBQVksQ0FDcEIsMERBQTBELENBQzNELENBQUE7cUJBQ0Y7b0JBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ2pELENBQUMsQ0FBQyxDQUFBO2dCQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBRWhCLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDcEIsV0FBVyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ3hEO2dCQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzFDLENBQUMsQ0FBQyxDQUFBO1lBRUYsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtnQkFDakMsMkNBQTJDO2dCQUMzQyxNQUFNLFNBQVMsR0FBYyxJQUFJLG1CQUFTLENBQ3hDLFNBQVMsRUFDVCxJQUFJLGVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDZCxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixDQUFBO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7YUFDckI7WUFFRCwrQkFBK0I7WUFDL0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsMEJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUM5QyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7WUFFeEMsTUFBTSxRQUFRLEdBQWEsSUFBSSxtQkFBUSxDQUNyQyxTQUFTLEVBQ1QsWUFBWSxFQUNaLFdBQVcsRUFDWCxHQUFHLEVBQ0gsSUFBSSxFQUNKLEdBQUcsQ0FDSixDQUFBO1lBQ0QsT0FBTyxJQUFJLGVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUE7UUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBa0JHO1FBQ0gsa0JBQWEsR0FBRyxDQUNkLFNBQWlCLEVBQ2pCLFlBQW9CLEVBQ3BCLE1BQVUsRUFDVixVQUFrQixFQUNsQixXQUFxQixFQUNyQixhQUF1QixFQUN2QixrQkFBNEIsU0FBUyxFQUNyQyxtQkFBMkIsU0FBUyxFQUNwQyxNQUFVLFNBQVMsRUFDbkIsYUFBcUIsU0FBUyxFQUM5QixPQUFXLElBQUEseUJBQU8sR0FBRSxFQUNwQixXQUFlLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUN4QixZQUFvQixDQUFDLEVBQ1QsRUFBRTtZQUNkLElBQUksR0FBRyxHQUFlLEVBQUUsQ0FBQTtZQUN4QixJQUFJLFVBQVUsR0FBeUIsRUFBRSxDQUFBO1lBRXpDLElBQUksT0FBTyxlQUFlLEtBQUssV0FBVyxFQUFFO2dCQUMxQyxlQUFlLEdBQUcsV0FBVyxDQUFBO2FBQzlCO1lBRUQsTUFBTSxJQUFJLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFMUIsSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNuQixPQUFPLFNBQVMsQ0FBQTthQUNqQjtZQUVELElBQUksT0FBTyxVQUFVLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxVQUFVLEdBQUcsVUFBVSxDQUFBO2FBQ3hCO2lCQUFNLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNwRSwwQkFBMEI7Z0JBQzFCLE1BQU0sSUFBSSxzQkFBYSxDQUNyQixpRUFBaUUsQ0FDbEUsQ0FBQTthQUNGO1lBRUQsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFdBQVcsRUFBRTtnQkFDM0MsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBZSxDQUFDLENBQUE7YUFDeEQ7WUFFRCxNQUFNLEdBQUcsR0FBMkIsSUFBSSxzQkFBc0IsQ0FDNUQsV0FBVyxFQUNYLGFBQWEsRUFDYixlQUFlLENBQ2hCLENBQUE7WUFDRCxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDN0QsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO2FBQzVDO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDNUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDbkMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO2lCQUMxQzthQUNGO1lBQ0QsTUFBTSxPQUFPLEdBQVUsSUFBSSxDQUFDLG1CQUFtQixDQUM3QyxHQUFHLEVBQ0gsSUFBSSxFQUNKLFFBQVEsRUFDUixTQUFTLENBQ1YsQ0FBQTtZQUNELElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO2dCQUNsQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFBO2FBQzlCO2lCQUFNO2dCQUNMLE1BQU0sT0FBTyxDQUFBO2FBQ2Q7WUFFRCxNQUFNLFFBQVEsR0FBYSxJQUFJLG1CQUFRLENBQ3JDLFNBQVMsRUFDVCxZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLEdBQUcsRUFDSCxVQUFVLENBQ1gsQ0FBQTtZQUNELE9BQU8sSUFBSSxlQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQXJZQyx3QkFBd0I7SUFFeEIsV0FBVyxDQUFDLE1BQWMsRUFBRSxXQUErQixLQUFLO1FBQzlELEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sS0FBSyxHQUFPLEVBQUUsQ0FBQTtRQUNwQixLQUFLLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsQyxJQUFJLGFBQWEsR0FBVyxVQUFVLENBQUMsT0FBTyxDQUM1QyxNQUFNLEVBQ04sUUFBUSxFQUNSLFFBQVEsRUFDUixRQUFRLENBQ1QsQ0FBQTtZQUNELEtBQUssQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUN0QyxLQUFLLENBQUMsR0FBRyxhQUFhLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFDNUIsUUFBUSxDQUNULENBQUE7U0FDRjtRQUNELElBQUksWUFBWSxHQUFPLEVBQUUsQ0FBQTtRQUN6QixLQUFLLElBQUksT0FBTyxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUMxQyxJQUFJLGNBQWMsR0FBVyxVQUFVLENBQUMsT0FBTyxDQUM3QyxPQUFPLEVBQ1AsUUFBUSxFQUNSLE1BQU0sRUFDTixLQUFLLENBQ04sQ0FBQTtZQUNELElBQUksV0FBVyxHQUFPLEVBQUUsQ0FBQTtZQUN4QixLQUFLLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZELElBQUksYUFBYSxHQUFXLFVBQVUsQ0FBQyxPQUFPLENBQzVDLE1BQU0sRUFDTixRQUFRLEVBQ1IsUUFBUSxFQUNSLFFBQVEsQ0FDVCxDQUFBO2dCQUNELFdBQVcsQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FDbEQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQ2pELFFBQVEsRUFDUixlQUFlLEVBQ2YsSUFBSSxDQUNMLENBQUE7YUFDRjtZQUNELFlBQVksQ0FBQyxHQUFHLGNBQWMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFBO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7SUFDbEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFtQjtRQUMzQixNQUFNLE9BQU8sR0FBUyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQ2hDLGVBQWU7UUFDZixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUM5QzthQUFNLElBQUksSUFBSSxZQUFZLElBQUksRUFBRTtZQUMvQixPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBLENBQUMsZ0JBQWdCO1NBQ3JEO2FBQU07WUFDTCwwQkFBMEI7WUFDMUIsTUFBTSxJQUFJLGtCQUFTLENBQ2pCLGdFQUFnRSxDQUNqRSxDQUFBO1NBQ0Y7UUFDRCxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxPQUFPLEVBQVUsQ0FBQTtJQUM5QixDQUFDO0lBRUQsS0FBSztRQUNILE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNyQyxNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QixPQUFPLE1BQWMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQU8sRUFBRSxVQUFrQjtRQUNuQyxPQUFPLENBQ0wsT0FBTyxHQUFHLEtBQUssV0FBVztZQUMxQixPQUFPLFVBQVUsS0FBSyxXQUFXO1lBQ2pDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsVUFBVSxZQUFZLGVBQU0sQ0FDN0IsQ0FBQTtJQUNILENBQUM7Q0FvVEY7QUF6WUQsMEJBeVlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1FVk0tVVRYT3NcclxuICovXHJcblxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IHtcclxuICBBbW91bnRPdXRwdXQsXHJcbiAgU2VsZWN0T3V0cHV0Q2xhc3MsXHJcbiAgVHJhbnNmZXJhYmxlT3V0cHV0LFxyXG4gIEVWTU91dHB1dFxyXG59IGZyb20gXCIuL291dHB1dHNcIlxyXG5pbXBvcnQgeyBFVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBFVk1JbnB1dCwgU0VDUFRyYW5zZmVySW5wdXQsIFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHsgT3V0cHV0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9vdXRwdXRcIlxyXG5pbXBvcnQgeyBVbml4Tm93IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IFN0YW5kYXJkVVRYTywgU3RhbmRhcmRVVFhPU2V0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi91dHhvc1wiXHJcbmltcG9ydCB7IFBsYXRmb3JtQ2hhaW5JRCB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQge1xyXG4gIFN0YW5kYXJkQXNzZXRBbW91bnREZXN0aW5hdGlvbixcclxuICBBc3NldEFtb3VudFxyXG59IGZyb20gXCIuLi8uLi9jb21tb24vYXNzZXRhbW91bnRcIlxyXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXHJcbmltcG9ydCB7IFVuc2lnbmVkVHggfSBmcm9tIFwiLi90eFwiXHJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4vaW1wb3J0dHhcIlxyXG5pbXBvcnQgeyBFeHBvcnRUeCB9IGZyb20gXCIuL2V4cG9ydHR4XCJcclxuaW1wb3J0IHtcclxuICBVVFhPRXJyb3IsXHJcbiAgQWRkcmVzc0Vycm9yLFxyXG4gIEluc3VmZmljaWVudEZ1bmRzRXJyb3IsXHJcbiAgRmVlQXNzZXRFcnJvclxyXG59IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXplcjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgYSBzaW5nbGUgVVRYTy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVVFhPIGV4dGVuZHMgU3RhbmRhcmRVVFhPIHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJVVFhPXCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxyXG5cclxuICAvL3NlcmlhbGl6ZSBpcyBpbmhlcml0ZWRcclxuXHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy5vdXRwdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhmaWVsZHNbXCJvdXRwdXRcIl1bXCJfdHlwZUlEXCJdKVxyXG4gICAgdGhpcy5vdXRwdXQuZGVzZXJpYWxpemUoZmllbGRzW1wib3V0cHV0XCJdLCBlbmNvZGluZylcclxuICB9XHJcblxyXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICAgIHRoaXMuY29kZWNJRCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDIpXHJcbiAgICBvZmZzZXQgKz0gMlxyXG4gICAgdGhpcy50eGlkID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXHJcbiAgICBvZmZzZXQgKz0gMzJcclxuICAgIHRoaXMub3V0cHV0aWR4ID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgNClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICB0aGlzLmFzc2V0SUQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAzMilcclxuICAgIG9mZnNldCArPSAzMlxyXG4gICAgY29uc3Qgb3V0cHV0aWQ6IG51bWJlciA9IGJpbnRvb2xzXHJcbiAgICAgIC5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxyXG4gICAgICAucmVhZFVJbnQzMkJFKDApXHJcbiAgICBvZmZzZXQgKz0gNFxyXG4gICAgdGhpcy5vdXRwdXQgPSBTZWxlY3RPdXRwdXRDbGFzcyhvdXRwdXRpZClcclxuICAgIHJldHVybiB0aGlzLm91dHB1dC5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSBbW1VUWE9dXSwgcGFyc2VzIGl0LCBwb3B1bGF0ZXMgdGhlIGNsYXNzLCBhbmQgcmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBTdGFuZGFyZFVUWE8gaW4gYnl0ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2VyaWFsaXplZCBBIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSByYXcgW1tVVFhPXV1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW1VUWE9dXVxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiB1bmxpa2UgbW9zdCBmcm9tU3RyaW5ncywgaXQgZXhwZWN0cyB0aGUgc3RyaW5nIHRvIGJlIHNlcmlhbGl6ZWQgaW4gY2I1OCBmb3JtYXRcclxuICAgKi9cclxuICBmcm9tU3RyaW5nKHNlcmlhbGl6ZWQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHRoaXMuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKHNlcmlhbGl6ZWQpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGJhc2UtNTggcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbVVRYT11dLlxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiB1bmxpa2UgbW9zdCB0b1N0cmluZ3MsIHRoaXMgcmV0dXJucyBpbiBjYjU4IHNlcmlhbGl6YXRpb24gZm9ybWF0XHJcbiAgICovXHJcbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4gYmludG9vbHMuY2I1OEVuY29kZSh0aGlzLnRvQnVmZmVyKCkpXHJcbiAgfVxyXG5cclxuICBjbG9uZSgpOiB0aGlzIHtcclxuICAgIGNvbnN0IHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB1dHhvLmZyb21CdWZmZXIodGhpcy50b0J1ZmZlcigpKVxyXG4gICAgcmV0dXJuIHV0eG8gYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKFxyXG4gICAgY29kZWNJRDogbnVtYmVyID0gRVZNQ29uc3RhbnRzLkxBVEVTVENPREVDLFxyXG4gICAgdHhJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgb3V0cHV0aWR4OiBCdWZmZXIgfCBudW1iZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBvdXRwdXQ6IE91dHB1dCA9IHVuZGVmaW5lZFxyXG4gICk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBVVFhPKGNvZGVjSUQsIHR4SUQsIG91dHB1dGlkeCwgYXNzZXRJRCwgb3V0cHV0KSBhcyB0aGlzXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXNzZXRBbW91bnREZXN0aW5hdGlvbiBleHRlbmRzIFN0YW5kYXJkQXNzZXRBbW91bnREZXN0aW5hdGlvbjxcclxuICBUcmFuc2ZlcmFibGVPdXRwdXQsXHJcbiAgVHJhbnNmZXJhYmxlSW5wdXRcclxuPiB7fVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNldCBvZiBbW1VUWE9dXXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVVRYT1NldCBleHRlbmRzIFN0YW5kYXJkVVRYT1NldDxVVFhPPiB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiVVRYT1NldFwiXHJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcclxuXHJcbiAgLy9zZXJpYWxpemUgaXMgaW5oZXJpdGVkXHJcblxyXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IHZvaWQge1xyXG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcclxuICAgIGNvbnN0IHV0eG9zOiB7fSA9IHt9XHJcbiAgICBmb3IgKGxldCB1dHhvaWQgaW4gZmllbGRzW1widXR4b3NcIl0pIHtcclxuICAgICAgbGV0IHV0eG9pZENsZWFuZWQ6IHN0cmluZyA9IHNlcmlhbGl6ZXIuZGVjb2RlcihcclxuICAgICAgICB1dHhvaWQsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJiYXNlNThcIixcclxuICAgICAgICBcImJhc2U1OFwiXHJcbiAgICAgIClcclxuICAgICAgdXR4b3NbYCR7dXR4b2lkQ2xlYW5lZH1gXSA9IG5ldyBVVFhPKClcclxuICAgICAgdXR4b3NbYCR7dXR4b2lkQ2xlYW5lZH1gXS5kZXNlcmlhbGl6ZShcclxuICAgICAgICBmaWVsZHNbXCJ1dHhvc1wiXVtgJHt1dHhvaWR9YF0sXHJcbiAgICAgICAgZW5jb2RpbmdcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgbGV0IGFkZHJlc3NVVFhPczoge30gPSB7fVxyXG4gICAgZm9yIChsZXQgYWRkcmVzcyBpbiBmaWVsZHNbXCJhZGRyZXNzVVRYT3NcIl0pIHtcclxuICAgICAgbGV0IGFkZHJlc3NDbGVhbmVkOiBzdHJpbmcgPSBzZXJpYWxpemVyLmRlY29kZXIoXHJcbiAgICAgICAgYWRkcmVzcyxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcImNiNThcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgICAgbGV0IHV0eG9iYWxhbmNlOiB7fSA9IHt9XHJcbiAgICAgIGZvciAobGV0IHV0eG9pZCBpbiBmaWVsZHNbXCJhZGRyZXNzVVRYT3NcIl1bYCR7YWRkcmVzc31gXSkge1xyXG4gICAgICAgIGxldCB1dHhvaWRDbGVhbmVkOiBzdHJpbmcgPSBzZXJpYWxpemVyLmRlY29kZXIoXHJcbiAgICAgICAgICB1dHhvaWQsXHJcbiAgICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICAgIFwiYmFzZTU4XCIsXHJcbiAgICAgICAgICBcImJhc2U1OFwiXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHV0eG9iYWxhbmNlW2Ake3V0eG9pZENsZWFuZWR9YF0gPSBzZXJpYWxpemVyLmRlY29kZXIoXHJcbiAgICAgICAgICBmaWVsZHNbXCJhZGRyZXNzVVRYT3NcIl1bYCR7YWRkcmVzc31gXVtgJHt1dHhvaWR9YF0sXHJcbiAgICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxyXG4gICAgICAgICAgXCJCTlwiXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICAgIGFkZHJlc3NVVFhPc1tgJHthZGRyZXNzQ2xlYW5lZH1gXSA9IHV0eG9iYWxhbmNlXHJcbiAgICB9XHJcbiAgICB0aGlzLnV0eG9zID0gdXR4b3NcclxuICAgIHRoaXMuYWRkcmVzc1VUWE9zID0gYWRkcmVzc1VUWE9zXHJcbiAgfVxyXG5cclxuICBwYXJzZVVUWE8odXR4bzogVVRYTyB8IHN0cmluZyk6IFVUWE8ge1xyXG4gICAgY29uc3QgdXR4b3ZhcjogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgIC8vIGZvcmNlIGEgY29weVxyXG4gICAgaWYgKHR5cGVvZiB1dHhvID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHV0eG92YXIuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKHV0eG8pKVxyXG4gICAgfSBlbHNlIGlmICh1dHhvIGluc3RhbmNlb2YgVVRYTykge1xyXG4gICAgICB1dHhvdmFyLmZyb21CdWZmZXIodXR4by50b0J1ZmZlcigpKSAvLyBmb3JjZXMgYSBjb3B5XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgVVRYT0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBVVFhPLnBhcnNlVVRYTzogdXR4byBwYXJhbWV0ZXIgaXMgbm90IGEgVVRYTyBvciBzdHJpbmdcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXR4b3ZhclxyXG4gIH1cclxuXHJcbiAgY3JlYXRlKCk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBVVFhPU2V0KCkgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBjb25zdCBuZXdzZXQ6IFVUWE9TZXQgPSB0aGlzLmNyZWF0ZSgpXHJcbiAgICBjb25zdCBhbGxVVFhPczogVVRYT1tdID0gdGhpcy5nZXRBbGxVVFhPcygpXHJcbiAgICBuZXdzZXQuYWRkQXJyYXkoYWxsVVRYT3MpXHJcbiAgICByZXR1cm4gbmV3c2V0IGFzIHRoaXNcclxuICB9XHJcblxyXG4gIF9mZWVDaGVjayhmZWU6IEJOLCBmZWVBc3NldElEOiBCdWZmZXIpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHR5cGVvZiBmZWUgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgdHlwZW9mIGZlZUFzc2V0SUQgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgZmVlLmd0KG5ldyBCTigwKSkgJiZcclxuICAgICAgZmVlQXNzZXRJRCBpbnN0YW5jZW9mIEJ1ZmZlclxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgZ2V0TWluaW11bVNwZW5kYWJsZSA9IChcclxuICAgIGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbixcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgKTogRXJyb3IgPT4ge1xyXG4gICAgY29uc3QgdXR4b0FycmF5OiBVVFhPW10gPSB0aGlzLmdldEFsbFVUWE9zKClcclxuICAgIGNvbnN0IG91dGlkczogb2JqZWN0ID0ge31cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvQXJyYXkubGVuZ3RoICYmICFhYWQuY2FuQ29tcGxldGUoKTsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHU6IFVUWE8gPSB1dHhvQXJyYXlbYCR7aX1gXVxyXG4gICAgICBjb25zdCBhc3NldEtleTogc3RyaW5nID0gdS5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgZnJvbUFkZHJlc3NlczogQnVmZmVyW10gPSBhYWQuZ2V0U2VuZGVycygpXHJcbiAgICAgIGlmIChcclxuICAgICAgICB1LmdldE91dHB1dCgpIGluc3RhbmNlb2YgQW1vdW50T3V0cHV0ICYmXHJcbiAgICAgICAgYWFkLmFzc2V0RXhpc3RzKGFzc2V0S2V5KSAmJlxyXG4gICAgICAgIHUuZ2V0T3V0cHV0KCkubWVldHNUaHJlc2hvbGQoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc3QgYW06IEFzc2V0QW1vdW50ID0gYWFkLmdldEFzc2V0QW1vdW50KGFzc2V0S2V5KVxyXG4gICAgICAgIGlmICghYW0uaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgICBjb25zdCB1b3V0OiBBbW91bnRPdXRwdXQgPSB1LmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgICAgb3V0aWRzW2Ake2Fzc2V0S2V5fWBdID0gdW91dC5nZXRPdXRwdXRJRCgpXHJcbiAgICAgICAgICBjb25zdCBhbW91bnQgPSB1b3V0LmdldEFtb3VudCgpXHJcbiAgICAgICAgICBhbS5zcGVuZEFtb3VudChhbW91bnQpXHJcbiAgICAgICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSB1LmdldFR4SUQoKVxyXG4gICAgICAgICAgY29uc3Qgb3V0cHV0aWR4OiBCdWZmZXIgPSB1LmdldE91dHB1dElkeCgpXHJcbiAgICAgICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxyXG4gICAgICAgICAgY29uc3QgeGZlcmluOiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcclxuICAgICAgICAgICAgdHhpZCxcclxuICAgICAgICAgICAgb3V0cHV0aWR4LFxyXG4gICAgICAgICAgICB1LmdldEFzc2V0SUQoKSxcclxuICAgICAgICAgICAgaW5wdXRcclxuICAgICAgICAgIClcclxuICAgICAgICAgIGNvbnN0IHNwZW5kZXJzOiBCdWZmZXJbXSA9IHVvdXQuZ2V0U3BlbmRlcnMoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuICAgICAgICAgIHNwZW5kZXJzLmZvckVhY2goKHNwZW5kZXI6IEJ1ZmZlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpZHg6IG51bWJlciA9IHVvdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyKVxyXG4gICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgICAgIFwiRXJyb3IgLSBVVFhPU2V0LmdldE1pbmltdW1TcGVuZGFibGU6IG5vIHN1Y2ggYWRkcmVzcyBpbiBvdXRwdXRcIlxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4ZmVyaW4uZ2V0SW5wdXQoKS5hZGRTaWduYXR1cmVJZHgoaWR4LCBzcGVuZGVyKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGFhZC5hZGRJbnB1dCh4ZmVyaW4pXHJcbiAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgIGFhZC5hc3NldEV4aXN0cyhhc3NldEtleSkgJiZcclxuICAgICAgICAgICEodS5nZXRPdXRwdXQoKSBpbnN0YW5jZW9mIEFtb3VudE91dHB1dClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICogTGVhdmluZyB0aGUgYmVsb3cgbGluZXMsIG5vdCBzaW1wbHkgZm9yIHBvc3Rlcml0eSwgYnV0IGZvciBjbGFyaWZpY2F0aW9uLlxyXG4gICAgICAgICAgICogQXNzZXRJRHMgbWF5IGhhdmUgbWl4ZWQgT3V0cHV0VHlwZXMuXHJcbiAgICAgICAgICAgKiBTb21lIG9mIHRob3NlIE91dHB1dFR5cGVzIG1heSBpbXBsZW1lbnQgQW1vdW50T3V0cHV0LlxyXG4gICAgICAgICAgICogT3RoZXJzIG1heSBub3QuXHJcbiAgICAgICAgICAgKiBTaW1wbHkgY29udGludWUgaW4gdGhpcyBjb25kaXRpb24uXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIC8qcmV0dXJuIG5ldyBFcnJvcignRXJyb3IgLSBVVFhPU2V0LmdldE1pbmltdW1TcGVuZGFibGU6IG91dHB1dElEIGRvZXMgbm90ICdcclxuICAgICAgICAgICAgICsgYGltcGxlbWVudCBBbW91bnRPdXRwdXQ6ICR7dS5nZXRPdXRwdXQoKS5nZXRPdXRwdXRJRH1gKTsqL1xyXG4gICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghYWFkLmNhbkNvbXBsZXRlKCkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBJbnN1ZmZpY2llbnRGdW5kc0Vycm9yKFxyXG4gICAgICAgIGBFcnJvciAtIFVUWE9TZXQuZ2V0TWluaW11bVNwZW5kYWJsZTogaW5zdWZmaWNpZW50IGZ1bmRzIHRvIGNyZWF0ZSB0aGUgdHJhbnNhY3Rpb25gXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IGFtb3VudHM6IEFzc2V0QW1vdW50W10gPSBhYWQuZ2V0QW1vdW50cygpXHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFtb3VudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgYXNzZXRLZXk6IHN0cmluZyA9IGFtb3VudHNbYCR7aX1gXS5nZXRBc3NldElEU3RyaW5nKClcclxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IGFtb3VudHNbYCR7aX1gXS5nZXRBbW91bnQoKVxyXG4gICAgICBpZiAoYW1vdW50Lmd0KHplcm8pKSB7XHJcbiAgICAgICAgY29uc3Qgc3BlbmRvdXQ6IEFtb3VudE91dHB1dCA9IFNlbGVjdE91dHB1dENsYXNzKFxyXG4gICAgICAgICAgb3V0aWRzW2Ake2Fzc2V0S2V5fWBdLFxyXG4gICAgICAgICAgYW1vdW50LFxyXG4gICAgICAgICAgYWFkLmdldERlc3RpbmF0aW9ucygpLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgICAgICBhbW91bnRzW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLFxyXG4gICAgICAgICAgc3BlbmRvdXRcclxuICAgICAgICApXHJcbiAgICAgICAgYWFkLmFkZE91dHB1dCh4ZmVyb3V0KVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGNoYW5nZTogQk4gPSBhbW91bnRzW2Ake2l9YF0uZ2V0Q2hhbmdlKClcclxuICAgICAgaWYgKGNoYW5nZS5ndCh6ZXJvKSkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5nZW91dDogQW1vdW50T3V0cHV0ID0gU2VsZWN0T3V0cHV0Q2xhc3MoXHJcbiAgICAgICAgICBvdXRpZHNbYCR7YXNzZXRLZXl9YF0sXHJcbiAgICAgICAgICBjaGFuZ2UsXHJcbiAgICAgICAgICBhYWQuZ2V0Q2hhbmdlQWRkcmVzc2VzKClcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIGNvbnN0IGNoZ3hmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgICAgICBhbW91bnRzW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLFxyXG4gICAgICAgICAgY2hhbmdlb3V0XHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFhZC5hZGRDaGFuZ2UoY2hneGZlcm91dClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBJbXBvcnRUeCB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgVGhlIG51bWJlciByZXByZXNlbnRpbmcgTmV0d29ya0lEIG9mIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50aW5nIHRoZSBCbG9ja2NoYWluSUQgZm9yIHRoZSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3MgVGhlIGFkZHJlc3MgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gaW1wb3J0SW5zIEFuIGFycmF5IG9mIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMgYmVpbmcgaW1wb3J0ZWRcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGNoYWluaWQgd2hlcmUgdGhlIGltcG9ydHMgYXJlIGNvbWluZyBmcm9tLlxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59LiBGZWUgd2lsbCBjb21lIGZyb20gdGhlIGlucHV0cyBmaXJzdCwgaWYgdGhleSBjYW4uXHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiBjcmVhdGVkIGZyb20gdGhlIHBhc3NlZCBpbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYnVpbGRJbXBvcnRUeCA9IChcclxuICAgIG5ldHdvcmtJRDogbnVtYmVyLFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICB0b0FkZHJlc3M6IHN0cmluZyxcclxuICAgIGF0b21pY3M6IFVUWE9bXSxcclxuICAgIHNvdXJjZUNoYWluOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkXHJcbiAgKTogVW5zaWduZWRUeCA9PiB7XHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgY29uc3QgbWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpXHJcblxyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogRVZNT3V0cHV0W10gPSBbXVxyXG4gICAgbGV0IGZlZXBhaWQ6IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgaWYgKHR5cGVvZiBmZWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgZmVlID0gemVyby5jbG9uZSgpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYnVpbGQgYSBzZXQgb2YgaW5wdXRzIHdoaWNoIGNvdmVycyB0aGUgZmVlXHJcbiAgICBhdG9taWNzLmZvckVhY2goKGF0b21pYzogVVRYTyk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBhc3NldElEQnVmOiBCdWZmZXIgPSBhdG9taWMuZ2V0QXNzZXRJRCgpXHJcbiAgICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYXRvbWljLmdldEFzc2V0SUQoKSlcclxuICAgICAgY29uc3Qgb3V0cHV0OiBBbW91bnRPdXRwdXQgPSBhdG9taWMuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBvdXRwdXQuZ2V0QW1vdW50KCkuY2xvbmUoKVxyXG4gICAgICBsZXQgaW5mZWVhbW91bnQ6IEJOID0gYW1vdW50LmNsb25lKClcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICB0eXBlb2YgZmVlQXNzZXRJRCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgICAgIGZlZS5ndCh6ZXJvKSAmJlxyXG4gICAgICAgIGZlZXBhaWQubHQoZmVlKSAmJlxyXG4gICAgICAgIEJ1ZmZlci5jb21wYXJlKGZlZUFzc2V0SUQsIGFzc2V0SURCdWYpID09PSAwXHJcbiAgICAgICkge1xyXG4gICAgICAgIGZlZXBhaWQgPSBmZWVwYWlkLmFkZChpbmZlZWFtb3VudClcclxuICAgICAgICBpZiAoZmVlcGFpZC5ndChmZWUpKSB7XHJcbiAgICAgICAgICBpbmZlZWFtb3VudCA9IGZlZXBhaWQuc3ViKGZlZSlcclxuICAgICAgICAgIGZlZXBhaWQgPSBmZWUuY2xvbmUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbmZlZWFtb3VudCA9IHplcm8uY2xvbmUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gYXRvbWljLmdldFR4SUQoKVxyXG4gICAgICBjb25zdCBvdXRwdXRpZHg6IEJ1ZmZlciA9IGF0b21pYy5nZXRPdXRwdXRJZHgoKVxyXG4gICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxyXG4gICAgICBjb25zdCB4ZmVyaW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxyXG4gICAgICAgIHR4aWQsXHJcbiAgICAgICAgb3V0cHV0aWR4LFxyXG4gICAgICAgIGFzc2V0SURCdWYsXHJcbiAgICAgICAgaW5wdXRcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IG91dHB1dC5nZXRBZGRyZXNzZXMoKVxyXG4gICAgICBjb25zdCBzcGVuZGVyczogQnVmZmVyW10gPSBvdXRwdXQuZ2V0U3BlbmRlcnMoZnJvbSlcclxuICAgICAgc3BlbmRlcnMuZm9yRWFjaCgoc3BlbmRlcjogQnVmZmVyKTogdm9pZCA9PiB7XHJcbiAgICAgICAgY29uc3QgaWR4OiBudW1iZXIgPSBvdXRwdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyKVxyXG4gICAgICAgIGlmIChpZHggPT09IC0xKSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRJbXBvcnRUeDogbm8gc3VjaCBhZGRyZXNzIGluIG91dHB1dFwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhmZXJpbi5nZXRJbnB1dCgpLmFkZFNpZ25hdHVyZUlkeChpZHgsIHNwZW5kZXIpXHJcbiAgICAgIH0pXHJcbiAgICAgIGlucy5wdXNoKHhmZXJpbilcclxuXHJcbiAgICAgIGlmIChtYXAuaGFzKGFzc2V0SUQpKSB7XHJcbiAgICAgICAgaW5mZWVhbW91bnQgPSBpbmZlZWFtb3VudC5hZGQobmV3IEJOKG1hcC5nZXQoYXNzZXRJRCkpKVxyXG4gICAgICB9XHJcbiAgICAgIG1hcC5zZXQoYXNzZXRJRCwgaW5mZWVhbW91bnQudG9TdHJpbmcoKSlcclxuICAgIH0pXHJcblxyXG4gICAgZm9yIChsZXQgW2Fzc2V0SUQsIGFtb3VudF0gb2YgbWFwKSB7XHJcbiAgICAgIC8vIENyZWF0ZSBzaW5nbGUgRVZNT3V0cHV0IGZvciBlYWNoIGFzc2V0SURcclxuICAgICAgY29uc3QgZXZtT3V0cHV0OiBFVk1PdXRwdXQgPSBuZXcgRVZNT3V0cHV0KFxyXG4gICAgICAgIHRvQWRkcmVzcyxcclxuICAgICAgICBuZXcgQk4oYW1vdW50KSxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGFzc2V0SUQpXHJcbiAgICAgIClcclxuICAgICAgb3V0cy5wdXNoKGV2bU91dHB1dClcclxuICAgIH1cclxuXHJcbiAgICAvLyBsZXhpY29ncmFwaGljYWxseSBzb3J0IGFycmF5XHJcbiAgICBpbnMgPSBpbnMuc29ydChUcmFuc2ZlcmFibGVJbnB1dC5jb21wYXJhdG9yKCkpXHJcbiAgICBvdXRzID0gb3V0cy5zb3J0KEVWTU91dHB1dC5jb21wYXJhdG9yKCkpXHJcblxyXG4gICAgY29uc3QgaW1wb3J0VHg6IEltcG9ydFR4ID0gbmV3IEltcG9ydFR4KFxyXG4gICAgICBuZXR3b3JrSUQsXHJcbiAgICAgIGJsb2NrY2hhaW5JRCxcclxuICAgICAgc291cmNlQ2hhaW4sXHJcbiAgICAgIGlucyxcclxuICAgICAgb3V0cyxcclxuICAgICAgZmVlXHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoaW1wb3J0VHgpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIHVuc2lnbmVkIEV4cG9ydFR4IHRyYW5zYWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBOZXR3b3JrSUQgb2YgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIEJsb2NrY2hhaW5JRCBmb3IgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IGJlaW5nIGV4cG9ydGVkIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gYXhjQXNzZXRJRCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvZiB0aGUgQXNzZXRJRCBmb3IgQVhDXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcmVjaWV2ZXMgdGhlIEFYQ1xyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gb3ducyB0aGUgQVhDXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBPcHRpb25hbC4gVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPcy5cclxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25DaGFpbiBPcHRpb25hbC4gQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGNoYWluaWQgd2hlcmUgdG8gc2VuZCB0aGUgYXNzZXQuXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkLlxyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZEV4cG9ydFR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlcixcclxuICAgIGFtb3VudDogQk4sXHJcbiAgICBheGNBc3NldElEOiBCdWZmZXIsXHJcbiAgICB0b0FkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGNoYW5nZUFkZHJlc3NlczogQnVmZmVyW10gPSB1bmRlZmluZWQsXHJcbiAgICBkZXN0aW5hdGlvbkNoYWluOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGxldCBpbnM6IEVWTUlucHV0W10gPSBbXVxyXG4gICAgbGV0IGV4cG9ydG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBpZiAodHlwZW9mIGNoYW5nZUFkZHJlc3NlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMgPSB0b0FkZHJlc3Nlc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgaWYgKGFtb3VudC5lcSh6ZXJvKSkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBmZWVBc3NldElEID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGZlZUFzc2V0SUQgPSBheGNBc3NldElEXHJcbiAgICB9IGVsc2UgaWYgKGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikgIT09IGF4Y0Fzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEZlZUFzc2V0RXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRFeHBvcnRUeDogZmVlQXNzZXRJRCBtdXN0IG1hdGNoIGF4Y0Fzc2V0SURcIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhYWQ6IEFzc2V0QW1vdW50RGVzdGluYXRpb24gPSBuZXcgQXNzZXRBbW91bnREZXN0aW5hdGlvbihcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgKVxyXG4gICAgaWYgKGF4Y0Fzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikgPT09IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGF4Y0Fzc2V0SUQsIGFtb3VudCwgZmVlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGF4Y0Fzc2V0SUQsIGFtb3VudCwgemVybylcclxuICAgICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdWNjZXNzOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgYWFkLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcbiAgICBpZiAodHlwZW9mIHN1Y2Nlc3MgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgZXhwb3J0b3V0cyA9IGFhZC5nZXRPdXRwdXRzKClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IHN1Y2Nlc3NcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleHBvcnRUeDogRXhwb3J0VHggPSBuZXcgRXhwb3J0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBkZXN0aW5hdGlvbkNoYWluLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIGV4cG9ydG91dHNcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChleHBvcnRUeClcclxuICB9XHJcbn1cclxuIl19