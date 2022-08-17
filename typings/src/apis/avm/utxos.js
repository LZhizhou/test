"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTXOSet = exports.AssetAmountDestination = exports.UTXO = void 0;
/**
 * @packageDocumentation
 * @module API-AVM-UTXOs
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const outputs_1 = require("./outputs");
const constants_1 = require("./constants");
const tx_1 = require("./tx");
const inputs_1 = require("./inputs");
const ops_1 = require("./ops");
const helperfunctions_1 = require("../../utils/helperfunctions");
const initialstates_1 = require("./initialstates");
const utxos_1 = require("../../common/utxos");
const createassettx_1 = require("./createassettx");
const operationtx_1 = require("./operationtx");
const basetx_1 = require("./basetx");
const exporttx_1 = require("./exporttx");
const importtx_1 = require("./importtx");
const constants_2 = require("../../utils/constants");
const assetamount_1 = require("../../common/assetamount");
const serialization_1 = require("../../utils/serialization");
const errors_1 = require("../../utils/errors");
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
    create(codecID = constants_1.AVMConstants.LATESTCODEC, txid = undefined, outputidx = undefined, assetID = undefined, output = undefined) {
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
                        for (let j = 0; j < spenders.length; j++) {
                            const idx = uout.getAddressIdx(spenders[`${j}`]);
                            if (idx === -1) {
                                /* istanbul ignore next */
                                throw new errors_1.AddressError("Error - UTXOSet.getMinimumSpendable: no such " +
                                    `address in output: ${spenders[`${j}`]}`);
                            }
                            xferin.getInput().addSignatureIdx(idx, spenders[`${j}`]);
                        }
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
                          + `implement AmountOutput: ${u.getOutput().getOutputID}`)*/
                        continue;
                    }
                }
            }
            if (!aad.canComplete()) {
                return new errors_1.InsufficientFundsError("Error - UTXOSet.getMinimumSpendable: insufficient " +
                    "funds to create the transaction");
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
            const success = this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                ins = aad.getInputs();
                outs = aad.getAllOutputs();
            }
            else {
                throw success;
            }
            const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins, memo);
            return new tx_1.UnsignedTx(baseTx);
        };
        /**
         * Creates an unsigned Create Asset transaction. For more granular control, you may create your own
         * [[CreateAssetTX]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs
         * @param initialState The [[InitialStates]] that represent the intial state of a created asset
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param denomination Optional number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AXC = 10^9 $nAXC
         * @param mintOutputs Optional. Array of [[SECPMintOutput]]s to be included in the transaction. These outputs can be spent to mint more tokens.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildCreateAssetTx = (networkID, blockchainID, fromAddresses, changeAddresses, initialState, name, symbol, denomination, mintOutputs = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
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
            if (typeof mintOutputs !== "undefined") {
                for (let i = 0; i < mintOutputs.length; i++) {
                    if (mintOutputs[`${i}`] instanceof outputs_1.SECPMintOutput) {
                        initialState.addOutput(mintOutputs[`${i}`]);
                    }
                    else {
                        throw new errors_1.SECPMintOutputError("Error - UTXOSet.buildCreateAssetTx: A submitted mintOutput was not of type SECPMintOutput");
                    }
                }
            }
            let CAtx = new createassettx_1.CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialState);
            return new tx_1.UnsignedTx(CAtx);
        };
        /**
         * Creates an unsigned Secp mint transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param mintOwner A [[SECPMintOutput]] which specifies the new set of minters
         * @param transferOwner A [[SECPTransferOutput]] which specifies where the minted tokens will go
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param mintUTXOID The UTXOID for the [[SCPMintOutput]] being spent to produce more tokens
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.buildSECPMintTx = (networkID, blockchainID, mintOwner, transferOwner, fromAddresses, changeAddresses, mintUTXOID, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
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
            let ops = [];
            let mintOp = new ops_1.SECPMintOperation(mintOwner, transferOwner);
            let utxo = this.getUTXO(mintUTXOID);
            if (typeof utxo === "undefined") {
                throw new errors_1.UTXOError("Error - UTXOSet.buildSECPMintTx: UTXOID not found");
            }
            if (utxo.getOutput().getOutputID() !== constants_1.AVMConstants.SECPMINTOUTPUTID) {
                throw new errors_1.SECPMintOutputError("Error - UTXOSet.buildSECPMintTx: UTXO is not a SECPMINTOUTPUTID");
            }
            let out = utxo.getOutput();
            let spenders = out.getSpenders(fromAddresses, asOf);
            for (let j = 0; j < spenders.length; j++) {
                let idx = out.getAddressIdx(spenders[`${j}`]);
                if (idx == -1) {
                    /* istanbul ignore next */
                    throw new Error("Error - UTXOSet.buildSECPMintTx: no such address in output");
                }
                mintOp.addSignatureIdx(idx, spenders[`${j}`]);
            }
            let transferableOperation = new ops_1.TransferableOperation(utxo.getAssetID(), [`${mintUTXOID}`], mintOp);
            ops.push(transferableOperation);
            let operationTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(operationTx);
        };
        /**
         * Creates an unsigned Create Asset transaction. For more granular control, you may create your own
         * [[CreateAssetTX]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param minterSets The minters and thresholds required to mint this nft asset
         * @param name String for the descriptive name of the nft asset
         * @param symbol String for the ticker symbol of the nft asset
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting mint output
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildCreateNFTAssetTx = (networkID, blockchainID, fromAddresses, changeAddresses, minterSets, name, symbol, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = undefined) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
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
            let initialState = new initialstates_1.InitialStates();
            for (let i = 0; i < minterSets.length; i++) {
                let nftMintOutput = new outputs_1.NFTMintOutput(i, minterSets[`${i}`].getMinters(), locktime, minterSets[`${i}`].getThreshold());
                initialState.addOutput(nftMintOutput, constants_1.AVMConstants.NFTFXID);
            }
            let denomination = 0; // NFTs are non-fungible
            let CAtx = new createassettx_1.CreateAssetTx(networkID, blockchainID, outs, ins, memo, name, symbol, denomination, initialState);
            return new tx_1.UnsignedTx(CAtx);
        };
        /**
         * Creates an unsigned NFT mint transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param owners An array of [[OutputOwners]] who will be given the NFTs.
         * @param fromAddresses The addresses being used to send the funds from the UTXOs
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param utxoids An array of strings for the NFTs being transferred
         * @param groupID Optional. The group this NFT is issued to.
         * @param payload Optional. Data for NFT Payload.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildCreateNFTMintTx = (networkID, blockchainID, owners, fromAddresses, changeAddresses, utxoids, groupID = 0, payload = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
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
            let ops = [];
            let nftMintOperation = new ops_1.NFTMintOperation(groupID, payload, owners);
            for (let i = 0; i < utxoids.length; i++) {
                let utxo = this.getUTXO(utxoids[`${i}`]);
                let out = utxo.getOutput();
                let spenders = out.getSpenders(fromAddresses, asOf);
                for (let j = 0; j < spenders.length; j++) {
                    let idx;
                    idx = out.getAddressIdx(spenders[`${j}`]);
                    if (idx == -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildCreateNFTMintTx: no such address in output");
                    }
                    nftMintOperation.addSignatureIdx(idx, spenders[`${j}`]);
                }
                let transferableOperation = new ops_1.TransferableOperation(utxo.getAssetID(), utxoids, nftMintOperation);
                ops.push(transferableOperation);
            }
            let operationTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(operationTx);
        };
        /**
         * Creates an unsigned NFT transfer transaction. For more granular control, you may create your own
         * [[OperationTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses An array of {@link https://github.com/feross/buffer|Buffer}s which indicate who recieves the NFT
         * @param fromAddresses An array for {@link https://github.com/feross/buffer|Buffer} who owns the NFT
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param utxoids An array of strings for the NFTs being transferred
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
        this.buildNFTTransferTx = (networkID, blockchainID, toAddresses, fromAddresses, changeAddresses, utxoids, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
            const zero = new bn_js_1.default(0);
            let ins = [];
            let outs = [];
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
            const ops = [];
            for (let i = 0; i < utxoids.length; i++) {
                const utxo = this.getUTXO(utxoids[`${i}`]);
                const out = utxo.getOutput();
                const spenders = out.getSpenders(fromAddresses, asOf);
                const outbound = new outputs_1.NFTTransferOutput(out.getGroupID(), out.getPayload(), toAddresses, locktime, threshold);
                const op = new ops_1.NFTTransferOperation(outbound);
                for (let j = 0; j < spenders.length; j++) {
                    const idx = out.getAddressIdx(spenders[`${j}`]);
                    if (idx === -1) {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - UTXOSet.buildNFTTransferTx: " +
                            `no such address in output: ${spenders[`${j}`]}`);
                    }
                    op.addSignatureIdx(idx, spenders[`${j}`]);
                }
                const xferop = new ops_1.TransferableOperation(utxo.getAssetID(), [utxoids[`${i}`]], op);
                ops.push(xferop);
            }
            const OpTx = new operationtx_1.OperationTx(networkID, blockchainID, outs, ins, memo, ops);
            return new tx_1.UnsignedTx(OpTx);
        };
        /**
         * Creates an unsigned ImportTx transaction.
         *
         * @param networkID The number representing NetworkID of the node
         * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
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
                    if (feepaid.gt(fee)) {
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
                const success = this.getMinimumSpendable(aad, asOf, locktime, threshold);
                if (typeof success === "undefined") {
                    ins = aad.getInputs();
                    outs = aad.getAllOutputs();
                }
                else {
                    throw success;
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
         * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs.
         * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
         * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
         * @param feeAssetID Optional. The assetID of the fees being burned.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @returns An unsigned transaction created from the passed in parameters.
         *
         */
        this.buildExportTx = (networkID, blockchainID, amount, assetID, toAddresses, fromAddresses, changeAddresses = undefined, destinationChain = undefined, fee = undefined, feeAssetID = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => {
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
                feeAssetID = assetID;
            }
            if (typeof destinationChain === "undefined") {
                destinationChain = bintools.cb58Decode(constants_2.PlatformChainID);
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
            const success = this.getMinimumSpendable(aad, asOf, locktime, threshold);
            if (typeof success === "undefined") {
                ins = aad.getInputs();
                outs = aad.getChangeOutputs();
                exportouts = aad.getOutputs();
            }
            else {
                throw success;
            }
            const exportTx = new exporttx_1.ExportTx(networkID, blockchainID, outs, ins, memo, destinationChain, exportouts);
            return new tx_1.UnsignedTx(exportTx);
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
        else if (utxo instanceof UTXO) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXR4b3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9hdm0vdXR4b3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsb0NBQWdDO0FBQ2hDLG9FQUEyQztBQUMzQyxrREFBc0I7QUFDdEIsdUNBUWtCO0FBQ2xCLDJDQUEwQztBQUMxQyw2QkFBaUM7QUFDakMscUNBQStEO0FBQy9ELCtCQUtjO0FBRWQsaUVBQXFEO0FBQ3JELG1EQUErQztBQUUvQyw4Q0FBa0U7QUFDbEUsbURBQStDO0FBQy9DLCtDQUEyQztBQUMzQyxxQ0FBaUM7QUFDakMseUNBQXFDO0FBQ3JDLHlDQUFxQztBQUNyQyxxREFBdUQ7QUFDdkQsMERBR2lDO0FBQ2pDLDZEQUE2RTtBQUM3RSwrQ0FNMkI7QUFFM0I7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWhFOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsb0JBQVk7SUFBdEM7O1FBQ1ksY0FBUyxHQUFHLE1BQU0sQ0FBQTtRQUNsQixZQUFPLEdBQUcsU0FBUyxDQUFBO0lBb0UvQixDQUFDO0lBbEVDLHdCQUF3QjtJQUV4QixXQUFXLENBQUMsTUFBYyxFQUFFLFdBQStCLEtBQUs7UUFDOUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLDJCQUFpQixFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBQzVELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtB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QUFDLFFBQVEsRUFBRSxDQUFDLENBQUEsQ0FBQyxnQkFBZ0I7U0FDckQ7YUFBTTtZQUNMLDBCQUEwQjtZQUMxQixNQUFNLElBQUksa0JBQVMsQ0FDakIsZ0VBQWdFLENBQ2pFLENBQUE7U0FDRjtRQUNELE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxJQUFXO1FBQ25CLE9BQU8sSUFBSSxPQUFPLEVBQVUsQ0FBQTtJQUM5QixDQUFDO0lBRUQsS0FBSztRQUNILE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNyQyxNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDM0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QixPQUFPLE1BQWMsQ0FBQTtJQUN2QixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQU8sRUFBRSxVQUFrQjtRQUNuQyxPQUFPLENBQ0wsT0FBTyxHQUFHLEtBQUssV0FBVztZQUMxQixPQUFPLFVBQVUsS0FBSyxXQUFXO1lBQ2pDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakIsVUFBVSxZQUFZLGVBQU0sQ0FDN0IsQ0FBQTtJQUNILENBQUM7Q0FpM0JGO0FBdDhCRCwwQkFzOEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1BVk0tVVRYT3NcclxuICovXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQge1xyXG4gIEFtb3VudE91dHB1dCxcclxuICBTZWxlY3RPdXRwdXRDbGFzcyxcclxuICBUcmFuc2ZlcmFibGVPdXRwdXQsXHJcbiAgTkZUVHJhbnNmZXJPdXRwdXQsXHJcbiAgTkZUTWludE91dHB1dCxcclxuICBTRUNQTWludE91dHB1dCxcclxuICBTRUNQVHJhbnNmZXJPdXRwdXRcclxufSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHsgQVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgVW5zaWduZWRUeCB9IGZyb20gXCIuL3R4XCJcclxuaW1wb3J0IHsgU0VDUFRyYW5zZmVySW5wdXQsIFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHtcclxuICBORlRUcmFuc2Zlck9wZXJhdGlvbixcclxuICBUcmFuc2ZlcmFibGVPcGVyYXRpb24sXHJcbiAgTkZUTWludE9wZXJhdGlvbixcclxuICBTRUNQTWludE9wZXJhdGlvblxyXG59IGZyb20gXCIuL29wc1wiXHJcbmltcG9ydCB7IE91dHB1dCwgT3V0cHV0T3duZXJzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9vdXRwdXRcIlxyXG5pbXBvcnQgeyBVbml4Tm93IH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IEluaXRpYWxTdGF0ZXMgfSBmcm9tIFwiLi9pbml0aWFsc3RhdGVzXCJcclxuaW1wb3J0IHsgTWludGVyU2V0IH0gZnJvbSBcIi4vbWludGVyc2V0XCJcclxuaW1wb3J0IHsgU3RhbmRhcmRVVFhPLCBTdGFuZGFyZFVUWE9TZXQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3V0eG9zXCJcclxuaW1wb3J0IHsgQ3JlYXRlQXNzZXRUeCB9IGZyb20gXCIuL2NyZWF0ZWFzc2V0dHhcIlxyXG5pbXBvcnQgeyBPcGVyYXRpb25UeCB9IGZyb20gXCIuL29wZXJhdGlvbnR4XCJcclxuaW1wb3J0IHsgQmFzZVR4IH0gZnJvbSBcIi4vYmFzZXR4XCJcclxuaW1wb3J0IHsgRXhwb3J0VHggfSBmcm9tIFwiLi9leHBvcnR0eFwiXHJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4vaW1wb3J0dHhcIlxyXG5pbXBvcnQgeyBQbGF0Zm9ybUNoYWluSUQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHtcclxuICBTdGFuZGFyZEFzc2V0QW1vdW50RGVzdGluYXRpb24sXHJcbiAgQXNzZXRBbW91bnRcclxufSBmcm9tIFwiLi4vLi4vY29tbW9uL2Fzc2V0YW1vdW50XCJcclxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZEVuY29kaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5pbXBvcnQge1xyXG4gIFVUWE9FcnJvcixcclxuICBBZGRyZXNzRXJyb3IsXHJcbiAgSW5zdWZmaWNpZW50RnVuZHNFcnJvcixcclxuICBUaHJlc2hvbGRFcnJvcixcclxuICBTRUNQTWludE91dHB1dEVycm9yXHJcbn0gZnJvbSBcIi4uLy4uL3V0aWxzL2Vycm9yc1wiXHJcblxyXG4vKipcclxuICogQGlnbm9yZVxyXG4gKi9cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIHNpbmdsZSBVVFhPLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVUWE8gZXh0ZW5kcyBTdGFuZGFyZFVUWE8ge1xyXG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIlVUWE9cIlxyXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXHJcblxyXG4gIC8vc2VyaWFsaXplIGlzIGluaGVyaXRlZFxyXG5cclxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcclxuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXHJcbiAgICB0aGlzLm91dHB1dCA9IFNlbGVjdE91dHB1dENsYXNzKGZpZWxkc1tcIm91dHB1dFwiXVtcIl90eXBlSURcIl0pXHJcbiAgICB0aGlzLm91dHB1dC5kZXNlcmlhbGl6ZShmaWVsZHNbXCJvdXRwdXRcIl0sIGVuY29kaW5nKVxyXG4gIH1cclxuXHJcbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xyXG4gICAgdGhpcy5jb2RlY0lEID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMilcclxuICAgIG9mZnNldCArPSAyXHJcbiAgICB0aGlzLnR4aWQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAzMilcclxuICAgIG9mZnNldCArPSAzMlxyXG4gICAgdGhpcy5vdXRwdXRpZHggPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxyXG4gICAgb2Zmc2V0ICs9IDRcclxuICAgIHRoaXMuYXNzZXRJRCA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDMyKVxyXG4gICAgb2Zmc2V0ICs9IDMyXHJcbiAgICBjb25zdCBvdXRwdXRpZDogbnVtYmVyID0gYmludG9vbHNcclxuICAgICAgLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDQpXHJcbiAgICAgIC5yZWFkVUludDMyQkUoMClcclxuICAgIG9mZnNldCArPSA0XHJcbiAgICB0aGlzLm91dHB1dCA9IFNlbGVjdE91dHB1dENsYXNzKG91dHB1dGlkKVxyXG4gICAgcmV0dXJuIHRoaXMub3V0cHV0LmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgYmFzZS01OCBzdHJpbmcgY29udGFpbmluZyBhIFtbVVRYT11dLCBwYXJzZXMgaXQsIHBvcHVsYXRlcyB0aGUgY2xhc3MsIGFuZCByZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIFN0YW5kYXJkVVRYTyBpbiBieXRlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzZXJpYWxpemVkIEEgYmFzZS01OCBzdHJpbmcgY29udGFpbmluZyBhIHJhdyBbW1VUWE9dXVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbVVRYT11dXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIHVubGlrZSBtb3N0IGZyb21TdHJpbmdzLCBpdCBleHBlY3RzIHRoZSBzdHJpbmcgdG8gYmUgc2VyaWFsaXplZCBpbiBjYjU4IGZvcm1hdFxyXG4gICAqL1xyXG4gIGZyb21TdHJpbmcoc2VyaWFsaXplZDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4gdGhpcy5mcm9tQnVmZmVyKGJpbnRvb2xzLmNiNThEZWNvZGUoc2VyaWFsaXplZCkpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgYmFzZS01OCByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tVVFhPXV0uXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIHVubGlrZSBtb3N0IHRvU3RyaW5ncywgdGhpcyByZXR1cm5zIGluIGNiNTggc2VyaWFsaXphdGlvbiBmb3JtYXRcclxuICAgKi9cclxuICB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJldHVybiBiaW50b29scy5jYjU4RW5jb2RlKHRoaXMudG9CdWZmZXIoKSlcclxuICB9XHJcblxyXG4gIGNsb25lKCk6IHRoaXMge1xyXG4gICAgY29uc3QgdXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgIHV0eG8uZnJvbUJ1ZmZlcih0aGlzLnRvQnVmZmVyKCkpXHJcbiAgICByZXR1cm4gdXR4byBhcyB0aGlzXHJcbiAgfVxyXG5cclxuICBjcmVhdGUoXHJcbiAgICBjb2RlY0lEOiBudW1iZXIgPSBBVk1Db25zdGFudHMuTEFURVNUQ09ERUMsXHJcbiAgICB0eGlkOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBvdXRwdXRpZHg6IEJ1ZmZlciB8IG51bWJlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG91dHB1dDogT3V0cHV0ID0gdW5kZWZpbmVkXHJcbiAgKTogdGhpcyB7XHJcbiAgICByZXR1cm4gbmV3IFVUWE8oY29kZWNJRCwgdHhpZCwgb3V0cHV0aWR4LCBhc3NldElELCBvdXRwdXQpIGFzIHRoaXNcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBc3NldEFtb3VudERlc3RpbmF0aW9uIGV4dGVuZHMgU3RhbmRhcmRBc3NldEFtb3VudERlc3RpbmF0aW9uPFxyXG4gIFRyYW5zZmVyYWJsZU91dHB1dCxcclxuICBUcmFuc2ZlcmFibGVJbnB1dFxyXG4+IHt9XHJcblxyXG4vKipcclxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgc2V0IG9mIFtbVVRYT11dcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVVFhPU2V0IGV4dGVuZHMgU3RhbmRhcmRVVFhPU2V0PFVUWE8+IHtcclxuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJVVFhPU2V0XCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxyXG5cclxuICAvL3NlcmlhbGl6ZSBpcyBpbmhlcml0ZWRcclxuXHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgbGV0IHV0eG9zID0ge31cclxuICAgIGZvciAobGV0IHV0eG9pZCBpbiBmaWVsZHNbXCJ1dHhvc1wiXSkge1xyXG4gICAgICBsZXQgdXR4b2lkQ2xlYW5lZDogc3RyaW5nID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICAgIHV0eG9pZCxcclxuICAgICAgICBlbmNvZGluZyxcclxuICAgICAgICBcImJhc2U1OFwiLFxyXG4gICAgICAgIFwiYmFzZTU4XCJcclxuICAgICAgKVxyXG4gICAgICB1dHhvc1tgJHt1dHhvaWRDbGVhbmVkfWBdID0gbmV3IFVUWE8oKVxyXG4gICAgICB1dHhvc1tgJHt1dHhvaWRDbGVhbmVkfWBdLmRlc2VyaWFsaXplKFxyXG4gICAgICAgIGZpZWxkc1tcInV0eG9zXCJdW2Ake3V0eG9pZH1gXSxcclxuICAgICAgICBlbmNvZGluZ1xyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBsZXQgYWRkcmVzc1VUWE9zID0ge31cclxuICAgIGZvciAobGV0IGFkZHJlc3MgaW4gZmllbGRzW1wiYWRkcmVzc1VUWE9zXCJdKSB7XHJcbiAgICAgIGxldCBhZGRyZXNzQ2xlYW5lZDogc3RyaW5nID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICAgIGFkZHJlc3MsXHJcbiAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgXCJjYjU4XCIsXHJcbiAgICAgICAgXCJoZXhcIlxyXG4gICAgICApXHJcbiAgICAgIGxldCB1dHhvYmFsYW5jZToge30gPSB7fVxyXG4gICAgICBmb3IgKGxldCB1dHhvaWQgaW4gZmllbGRzW1wiYWRkcmVzc1VUWE9zXCJdW2Ake2FkZHJlc3N9YF0pIHtcclxuICAgICAgICBsZXQgdXR4b2lkQ2xlYW5lZDogc3RyaW5nID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICAgICAgdXR4b2lkLFxyXG4gICAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgICBcImJhc2U1OFwiLFxyXG4gICAgICAgICAgXCJiYXNlNThcIlxyXG4gICAgICAgIClcclxuICAgICAgICB1dHhvYmFsYW5jZVtgJHt1dHhvaWRDbGVhbmVkfWBdID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxyXG4gICAgICAgICAgZmllbGRzW1wiYWRkcmVzc1VUWE9zXCJdW2Ake2FkZHJlc3N9YF1bYCR7dXR4b2lkfWBdLFxyXG4gICAgICAgICAgZW5jb2RpbmcsXHJcbiAgICAgICAgICBcImRlY2ltYWxTdHJpbmdcIixcclxuICAgICAgICAgIFwiQk5cIlxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICBhZGRyZXNzVVRYT3NbYCR7YWRkcmVzc0NsZWFuZWR9YF0gPSB1dHhvYmFsYW5jZVxyXG4gICAgfVxyXG4gICAgdGhpcy51dHhvcyA9IHV0eG9zXHJcbiAgICB0aGlzLmFkZHJlc3NVVFhPcyA9IGFkZHJlc3NVVFhPc1xyXG4gIH1cclxuXHJcbiAgcGFyc2VVVFhPKHV0eG86IFVUWE8gfCBzdHJpbmcpOiBVVFhPIHtcclxuICAgIGNvbnN0IHV0eG92YXI6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAvLyBmb3JjZSBhIGNvcHlcclxuICAgIGlmICh0eXBlb2YgdXR4byA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB1dHhvdmFyLmZyb21CdWZmZXIoYmludG9vbHMuY2I1OERlY29kZSh1dHhvKSlcclxuICAgIH0gZWxzZSBpZiAodXR4byBpbnN0YW5jZW9mIFVUWE8pIHtcclxuICAgICAgdXR4b3Zhci5mcm9tQnVmZmVyKHV0eG8udG9CdWZmZXIoKSkgLy8gZm9yY2VzIGEgY29weVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IFVUWE9FcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gVVRYTy5wYXJzZVVUWE86IHV0eG8gcGFyYW1ldGVyIGlzIG5vdCBhIFVUWE8gb3Igc3RyaW5nXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHV0eG92YXJcclxuICB9XHJcblxyXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xyXG4gICAgcmV0dXJuIG5ldyBVVFhPU2V0KCkgYXMgdGhpc1xyXG4gIH1cclxuXHJcbiAgY2xvbmUoKTogdGhpcyB7XHJcbiAgICBjb25zdCBuZXdzZXQ6IFVUWE9TZXQgPSB0aGlzLmNyZWF0ZSgpXHJcbiAgICBjb25zdCBhbGxVVFhPczogVVRYT1tdID0gdGhpcy5nZXRBbGxVVFhPcygpXHJcbiAgICBuZXdzZXQuYWRkQXJyYXkoYWxsVVRYT3MpXHJcbiAgICByZXR1cm4gbmV3c2V0IGFzIHRoaXNcclxuICB9XHJcblxyXG4gIF9mZWVDaGVjayhmZWU6IEJOLCBmZWVBc3NldElEOiBCdWZmZXIpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHR5cGVvZiBmZWUgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgdHlwZW9mIGZlZUFzc2V0SUQgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgZmVlLmd0KG5ldyBCTigwKSkgJiZcclxuICAgICAgZmVlQXNzZXRJRCBpbnN0YW5jZW9mIEJ1ZmZlclxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgZ2V0TWluaW11bVNwZW5kYWJsZSA9IChcclxuICAgIGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbixcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgKTogRXJyb3IgPT4ge1xyXG4gICAgY29uc3QgdXR4b0FycmF5OiBVVFhPW10gPSB0aGlzLmdldEFsbFVUWE9zKClcclxuICAgIGNvbnN0IG91dGlkczogb2JqZWN0ID0ge31cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvQXJyYXkubGVuZ3RoICYmICFhYWQuY2FuQ29tcGxldGUoKTsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHU6IFVUWE8gPSB1dHhvQXJyYXlbYCR7aX1gXVxyXG4gICAgICBjb25zdCBhc3NldEtleTogc3RyaW5nID0gdS5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgZnJvbUFkZHJlc3NlczogQnVmZmVyW10gPSBhYWQuZ2V0U2VuZGVycygpXHJcbiAgICAgIGlmIChcclxuICAgICAgICB1LmdldE91dHB1dCgpIGluc3RhbmNlb2YgQW1vdW50T3V0cHV0ICYmXHJcbiAgICAgICAgYWFkLmFzc2V0RXhpc3RzKGFzc2V0S2V5KSAmJlxyXG4gICAgICAgIHUuZ2V0T3V0cHV0KCkubWVldHNUaHJlc2hvbGQoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc3QgYW06IEFzc2V0QW1vdW50ID0gYWFkLmdldEFzc2V0QW1vdW50KGFzc2V0S2V5KVxyXG4gICAgICAgIGlmICghYW0uaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgICBjb25zdCB1b3V0OiBBbW91bnRPdXRwdXQgPSB1LmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgICAgb3V0aWRzW2Ake2Fzc2V0S2V5fWBdID0gdW91dC5nZXRPdXRwdXRJRCgpXHJcbiAgICAgICAgICBjb25zdCBhbW91bnQgPSB1b3V0LmdldEFtb3VudCgpXHJcbiAgICAgICAgICBhbS5zcGVuZEFtb3VudChhbW91bnQpXHJcbiAgICAgICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSB1LmdldFR4SUQoKVxyXG4gICAgICAgICAgY29uc3Qgb3V0cHV0aWR4OiBCdWZmZXIgPSB1LmdldE91dHB1dElkeCgpXHJcbiAgICAgICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxyXG4gICAgICAgICAgY29uc3QgeGZlcmluOiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcclxuICAgICAgICAgICAgdHhpZCxcclxuICAgICAgICAgICAgb3V0cHV0aWR4LFxyXG4gICAgICAgICAgICB1LmdldEFzc2V0SUQoKSxcclxuICAgICAgICAgICAgaW5wdXRcclxuICAgICAgICAgIClcclxuICAgICAgICAgIGNvbnN0IHNwZW5kZXJzOiBCdWZmZXJbXSA9IHVvdXQuZ2V0U3BlbmRlcnMoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuICAgICAgICAgIGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBzcGVuZGVycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCBpZHg6IG51bWJlciA9IHVvdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyc1tgJHtqfWBdKVxyXG4gICAgICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xyXG4gICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgICAgIFwiRXJyb3IgLSBVVFhPU2V0LmdldE1pbmltdW1TcGVuZGFibGU6IG5vIHN1Y2ggXCIgK1xyXG4gICAgICAgICAgICAgICAgICBgYWRkcmVzcyBpbiBvdXRwdXQ6ICR7c3BlbmRlcnNbYCR7an1gXX1gXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHhmZXJpbi5nZXRJbnB1dCgpLmFkZFNpZ25hdHVyZUlkeChpZHgsIHNwZW5kZXJzW2Ake2p9YF0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhYWQuYWRkSW5wdXQoeGZlcmluKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICBhYWQuYXNzZXRFeGlzdHMoYXNzZXRLZXkpICYmXHJcbiAgICAgICAgICAhKHUuZ2V0T3V0cHV0KCkgaW5zdGFuY2VvZiBBbW91bnRPdXRwdXQpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAvKipcclxuICAgICAgICAgICAqIExlYXZpbmcgdGhlIGJlbG93IGxpbmVzLCBub3Qgc2ltcGx5IGZvciBwb3N0ZXJpdHksIGJ1dCBmb3IgY2xhcmlmaWNhdGlvbi5cclxuICAgICAgICAgICAqIEFzc2V0SURzIG1heSBoYXZlIG1peGVkIE91dHB1dFR5cGVzLlxyXG4gICAgICAgICAgICogU29tZSBvZiB0aG9zZSBPdXRwdXRUeXBlcyBtYXkgaW1wbGVtZW50IEFtb3VudE91dHB1dC5cclxuICAgICAgICAgICAqIE90aGVycyBtYXkgbm90LlxyXG4gICAgICAgICAgICogU2ltcGx5IGNvbnRpbnVlIGluIHRoaXMgY29uZGl0aW9uLlxyXG4gICAgICAgICAgICovXHJcbiAgICAgICAgICAvKnJldHVybiBuZXcgRXJyb3IoJ0Vycm9yIC0gVVRYT1NldC5nZXRNaW5pbXVtU3BlbmRhYmxlOiBvdXRwdXRJRCBkb2VzIG5vdCAnXHJcbiAgICAgICAgICAgICsgYGltcGxlbWVudCBBbW91bnRPdXRwdXQ6ICR7dS5nZXRPdXRwdXQoKS5nZXRPdXRwdXRJRH1gKSovXHJcbiAgICAgICAgICBjb250aW51ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFhYWQuY2FuQ29tcGxldGUoKSkge1xyXG4gICAgICByZXR1cm4gbmV3IEluc3VmZmljaWVudEZ1bmRzRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuZ2V0TWluaW11bVNwZW5kYWJsZTogaW5zdWZmaWNpZW50IFwiICtcclxuICAgICAgICAgIFwiZnVuZHMgdG8gY3JlYXRlIHRoZSB0cmFuc2FjdGlvblwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IGFtb3VudHM6IEFzc2V0QW1vdW50W10gPSBhYWQuZ2V0QW1vdW50cygpXHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFtb3VudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgYXNzZXRLZXk6IHN0cmluZyA9IGFtb3VudHNbYCR7aX1gXS5nZXRBc3NldElEU3RyaW5nKClcclxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IGFtb3VudHNbYCR7aX1gXS5nZXRBbW91bnQoKVxyXG4gICAgICBpZiAoYW1vdW50Lmd0KHplcm8pKSB7XHJcbiAgICAgICAgY29uc3Qgc3BlbmRvdXQ6IEFtb3VudE91dHB1dCA9IFNlbGVjdE91dHB1dENsYXNzKFxyXG4gICAgICAgICAgb3V0aWRzW2Ake2Fzc2V0S2V5fWBdLFxyXG4gICAgICAgICAgYW1vdW50LFxyXG4gICAgICAgICAgYWFkLmdldERlc3RpbmF0aW9ucygpLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgICAgICBhbW91bnRzW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLFxyXG4gICAgICAgICAgc3BlbmRvdXRcclxuICAgICAgICApXHJcbiAgICAgICAgYWFkLmFkZE91dHB1dCh4ZmVyb3V0KVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGNoYW5nZTogQk4gPSBhbW91bnRzW2Ake2l9YF0uZ2V0Q2hhbmdlKClcclxuICAgICAgaWYgKGNoYW5nZS5ndCh6ZXJvKSkge1xyXG4gICAgICAgIGNvbnN0IGNoYW5nZW91dDogQW1vdW50T3V0cHV0ID0gU2VsZWN0T3V0cHV0Q2xhc3MoXHJcbiAgICAgICAgICBvdXRpZHNbYCR7YXNzZXRLZXl9YF0sXHJcbiAgICAgICAgICBjaGFuZ2UsXHJcbiAgICAgICAgICBhYWQuZ2V0Q2hhbmdlQWRkcmVzc2VzKClcclxuICAgICAgICApIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAgIGNvbnN0IGNoZ3hmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgICAgICBhbW91bnRzW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLFxyXG4gICAgICAgICAgY2hhbmdlb3V0XHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFhZC5hZGRDaGFuZ2UoY2hneGZlcm91dClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiBbW1Vuc2lnbmVkVHhdXSB3cmFwcGluZyBhIFtbQmFzZVR4XV0uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gd3JhcHBpbmcgYSBbW0Jhc2VUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcyBhbmQgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBOZXR3b3JrSUQgb2YgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIEJsb2NrY2hhaW5JRCBmb3IgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IG9mIHRoZSBhc3NldCB0byBiZSBzcGVudCBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfS5cclxuICAgKiBAcGFyYW0gYXNzZXRJRCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvZiB0aGUgYXNzZXQgSUQgZm9yIHRoZSBVVFhPXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIE9wdGlvbmFsLiBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zLiBEZWZhdWx0OiB0b0FkZHJlc3Nlc1xyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC4gRGVmYXVsdDogYXNzZXRJRFxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiBDb250YWlucyBhcmJpdHJhcnkgZGF0YSwgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gbG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiBjcmVhdGVkIGZyb20gdGhlIHBhc3NlZCBpbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYnVpbGRCYXNlVHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlcixcclxuICAgIHRvQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSA9IHVuZGVmaW5lZCxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKSxcclxuICAgIHRocmVzaG9sZDogbnVtYmVyID0gMVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgaWYgKHRocmVzaG9sZCA+IHRvQWRkcmVzc2VzLmxlbmd0aCkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgVGhyZXNob2xkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRCYXNlVHg6IHRocmVzaG9sZCBpcyBncmVhdGVyIHRoYW4gbnVtYmVyIG9mIGFkZHJlc3Nlc1wiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGNoYW5nZUFkZHJlc3NlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMgPSB0b0FkZHJlc3Nlc1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgZmVlQXNzZXRJRCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBmZWVBc3NldElEID0gYXNzZXRJRFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgaWYgKGFtb3VudC5lcSh6ZXJvKSkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgIHRvQWRkcmVzc2VzLFxyXG4gICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXNcclxuICAgIClcclxuICAgIGlmIChhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpID09PSBmZWVBc3NldElELnRvU3RyaW5nKFwiaGV4XCIpKSB7XHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChhc3NldElELCBhbW91bnQsIGZlZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChhc3NldElELCBhbW91bnQsIHplcm8pXHJcbiAgICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBjb25zdCBzdWNjZXNzOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgYWFkLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcbiAgICBpZiAodHlwZW9mIHN1Y2Nlc3MgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgIG91dHMgPSBhYWQuZ2V0QWxsT3V0cHV0cygpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBDcmVhdGUgQXNzZXQgdHJhbnNhY3Rpb24uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tDcmVhdGVBc3NldFRYXV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIFRoZSBudW1iZXIgcmVwcmVzZW50aW5nIE5ldHdvcmtJRCBvZiB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgQmxvY2tjaGFpbklEIGZvciB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIE9wdGlvbmFsLiBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIGluaXRpYWxTdGF0ZSBUaGUgW1tJbml0aWFsU3RhdGVzXV0gdGhhdCByZXByZXNlbnQgdGhlIGludGlhbCBzdGF0ZSBvZiBhIGNyZWF0ZWQgYXNzZXRcclxuICAgKiBAcGFyYW0gbmFtZSBTdHJpbmcgZm9yIHRoZSBkZXNjcmlwdGl2ZSBuYW1lIG9mIHRoZSBhc3NldFxyXG4gICAqIEBwYXJhbSBzeW1ib2wgU3RyaW5nIGZvciB0aGUgdGlja2VyIHN5bWJvbCBvZiB0aGUgYXNzZXRcclxuICAgKiBAcGFyYW0gZGVub21pbmF0aW9uIE9wdGlvbmFsIG51bWJlciBmb3IgdGhlIGRlbm9taW5hdGlvbiB3aGljaCBpcyAxMF5ELiBEIG11c3QgYmUgPj0gMCBhbmQgPD0gMzIuIEV4OiAkMSBBWEMgPSAxMF45ICRuQVhDXHJcbiAgICogQHBhcmFtIG1pbnRPdXRwdXRzIE9wdGlvbmFsLiBBcnJheSBvZiBbW1NFQ1BNaW50T3V0cHV0XV1zIHRvIGJlIGluY2x1ZGVkIGluIHRoZSB0cmFuc2FjdGlvbi4gVGhlc2Ugb3V0cHV0cyBjYW4gYmUgc3BlbnQgdG8gbWludCBtb3JlIHRva2Vucy5cclxuICAgKiBAcGFyYW0gZmVlIE9wdGlvbmFsLiBUaGUgYW1vdW50IG9mIGZlZXMgdG8gYnVybiBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBmZWVBc3NldElEIE9wdGlvbmFsLiBUaGUgYXNzZXRJRCBvZiB0aGUgZmVlcyBiZWluZyBidXJuZWQuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGJ1aWxkQ3JlYXRlQXNzZXRUeCA9IChcclxuICAgIG5ldHdvcmtJRDogbnVtYmVyLFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGNoYW5nZUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBpbml0aWFsU3RhdGU6IEluaXRpYWxTdGF0ZXMsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzeW1ib2w6IHN0cmluZyxcclxuICAgIGRlbm9taW5hdGlvbjogbnVtYmVyLFxyXG4gICAgbWludE91dHB1dHM6IFNFQ1BNaW50T3V0cHV0W10gPSB1bmRlZmluZWQsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KClcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcblxyXG4gICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgICApXHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChmZWVBc3NldElELCB6ZXJvLCBmZWUpXHJcbiAgICAgIGNvbnN0IHN1Y2Nlc3M6IEVycm9yID0gdGhpcy5nZXRNaW5pbXVtU3BlbmRhYmxlKGFhZCwgYXNPZilcclxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgICAgb3V0cyA9IGFhZC5nZXRBbGxPdXRwdXRzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbWludE91dHB1dHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG1pbnRPdXRwdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG1pbnRPdXRwdXRzW2Ake2l9YF0gaW5zdGFuY2VvZiBTRUNQTWludE91dHB1dCkge1xyXG4gICAgICAgICAgaW5pdGlhbFN0YXRlLmFkZE91dHB1dChtaW50T3V0cHV0c1tgJHtpfWBdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgU0VDUE1pbnRPdXRwdXRFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRDcmVhdGVBc3NldFR4OiBBIHN1Ym1pdHRlZCBtaW50T3V0cHV0IHdhcyBub3Qgb2YgdHlwZSBTRUNQTWludE91dHB1dFwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IENBdHg6IENyZWF0ZUFzc2V0VHggPSBuZXcgQ3JlYXRlQXNzZXRUeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIG91dHMsXHJcbiAgICAgIGlucyxcclxuICAgICAgbWVtbyxcclxuICAgICAgbmFtZSxcclxuICAgICAgc3ltYm9sLFxyXG4gICAgICBkZW5vbWluYXRpb24sXHJcbiAgICAgIGluaXRpYWxTdGF0ZVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBVbnNpZ25lZFR4KENBdHgpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIHVuc2lnbmVkIFNlY3AgbWludCB0cmFuc2FjdGlvbi4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW09wZXJhdGlvblR4XV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcywgYW5kIFtbVHJhbnNmZXJPcGVyYXRpb25dXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBOZXR3b3JrSUQgb2YgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIEJsb2NrY2hhaW5JRCBmb3IgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIG1pbnRPd25lciBBIFtbU0VDUE1pbnRPdXRwdXRdXSB3aGljaCBzcGVjaWZpZXMgdGhlIG5ldyBzZXQgb2YgbWludGVyc1xyXG4gICAqIEBwYXJhbSB0cmFuc2Zlck93bmVyIEEgW1tTRUNQVHJhbnNmZXJPdXRwdXRdXSB3aGljaCBzcGVjaWZpZXMgd2hlcmUgdGhlIG1pbnRlZCB0b2tlbnMgd2lsbCBnb1xyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBmdW5kcyBmcm9tIHRoZSBVVFhPcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPc1xyXG4gICAqIEBwYXJhbSBtaW50VVRYT0lEIFRoZSBVVFhPSUQgZm9yIHRoZSBbW1NDUE1pbnRPdXRwdXRdXSBiZWluZyBzcGVudCB0byBwcm9kdWNlIG1vcmUgdG9rZW5zXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkLlxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBidWlsZFNFQ1BNaW50VHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgbWludE93bmVyOiBTRUNQTWludE91dHB1dCxcclxuICAgIHRyYW5zZmVyT3duZXI6IFNFQ1BUcmFuc2Zlck91dHB1dCxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIG1pbnRVVFhPSUQ6IHN0cmluZyxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgY29uc3QgemVybzogQk4gPSBuZXcgQk4oMClcclxuICAgIGxldCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBpZiAodGhpcy5fZmVlQ2hlY2soZmVlLCBmZWVBc3NldElEKSkge1xyXG4gICAgICBjb25zdCBhYWQ6IEFzc2V0QW1vdW50RGVzdGluYXRpb24gPSBuZXcgQXNzZXRBbW91bnREZXN0aW5hdGlvbihcclxuICAgICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgY2hhbmdlQWRkcmVzc2VzXHJcbiAgICAgIClcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZSlcclxuICAgICAgY29uc3Qgc3VjY2VzczogRXJyb3IgPSB0aGlzLmdldE1pbmltdW1TcGVuZGFibGUoYWFkLCBhc09mKVxyXG4gICAgICBpZiAodHlwZW9mIHN1Y2Nlc3MgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpbnMgPSBhYWQuZ2V0SW5wdXRzKClcclxuICAgICAgICBvdXRzID0gYWFkLmdldEFsbE91dHB1dHMoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IHN1Y2Nlc3NcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcHM6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbltdID0gW11cclxuICAgIGxldCBtaW50T3A6IFNFQ1BNaW50T3BlcmF0aW9uID0gbmV3IFNFQ1BNaW50T3BlcmF0aW9uKFxyXG4gICAgICBtaW50T3duZXIsXHJcbiAgICAgIHRyYW5zZmVyT3duZXJcclxuICAgIClcclxuXHJcbiAgICBsZXQgdXR4bzogVVRYTyA9IHRoaXMuZ2V0VVRYTyhtaW50VVRYT0lEKVxyXG4gICAgaWYgKHR5cGVvZiB1dHhvID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBVVFhPRXJyb3IoXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRTRUNQTWludFR4OiBVVFhPSUQgbm90IGZvdW5kXCIpXHJcbiAgICB9XHJcbiAgICBpZiAodXR4by5nZXRPdXRwdXQoKS5nZXRPdXRwdXRJRCgpICE9PSBBVk1Db25zdGFudHMuU0VDUE1JTlRPVVRQVVRJRCkge1xyXG4gICAgICB0aHJvdyBuZXcgU0VDUE1pbnRPdXRwdXRFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gVVRYT1NldC5idWlsZFNFQ1BNaW50VHg6IFVUWE8gaXMgbm90IGEgU0VDUE1JTlRPVVRQVVRJRFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGxldCBvdXQ6IFNFQ1BNaW50T3V0cHV0ID0gdXR4by5nZXRPdXRwdXQoKSBhcyBTRUNQTWludE91dHB1dFxyXG4gICAgbGV0IHNwZW5kZXJzOiBCdWZmZXJbXSA9IG91dC5nZXRTcGVuZGVycyhmcm9tQWRkcmVzc2VzLCBhc09mKVxyXG5cclxuICAgIGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBzcGVuZGVycy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgaWR4OiBudW1iZXIgPSBvdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyc1tgJHtqfWBdKVxyXG4gICAgICBpZiAoaWR4ID09IC0xKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgICBcIkVycm9yIC0gVVRYT1NldC5idWlsZFNFQ1BNaW50VHg6IG5vIHN1Y2ggYWRkcmVzcyBpbiBvdXRwdXRcIlxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICBtaW50T3AuYWRkU2lnbmF0dXJlSWR4KGlkeCwgc3BlbmRlcnNbYCR7an1gXSlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdHJhbnNmZXJhYmxlT3BlcmF0aW9uOiBUcmFuc2ZlcmFibGVPcGVyYXRpb24gPVxyXG4gICAgICBuZXcgVHJhbnNmZXJhYmxlT3BlcmF0aW9uKHV0eG8uZ2V0QXNzZXRJRCgpLCBbYCR7bWludFVUWE9JRH1gXSwgbWludE9wKVxyXG4gICAgb3BzLnB1c2godHJhbnNmZXJhYmxlT3BlcmF0aW9uKVxyXG5cclxuICAgIGxldCBvcGVyYXRpb25UeDogT3BlcmF0aW9uVHggPSBuZXcgT3BlcmF0aW9uVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG9wc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBVbnNpZ25lZFR4KG9wZXJhdGlvblR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBDcmVhdGUgQXNzZXQgdHJhbnNhY3Rpb24uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tDcmVhdGVBc3NldFRYXV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIFRoZSBudW1iZXIgcmVwcmVzZW50aW5nIE5ldHdvcmtJRCBvZiB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgQmxvY2tjaGFpbklEIGZvciB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIE9wdGlvbmFsLiBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zLlxyXG4gICAqIEBwYXJhbSBtaW50ZXJTZXRzIFRoZSBtaW50ZXJzIGFuZCB0aHJlc2hvbGRzIHJlcXVpcmVkIHRvIG1pbnQgdGhpcyBuZnQgYXNzZXRcclxuICAgKiBAcGFyYW0gbmFtZSBTdHJpbmcgZm9yIHRoZSBkZXNjcmlwdGl2ZSBuYW1lIG9mIHRoZSBuZnQgYXNzZXRcclxuICAgKiBAcGFyYW0gc3ltYm9sIFN0cmluZyBmb3IgdGhlIHRpY2tlciBzeW1ib2wgb2YgdGhlIG5mdCBhc3NldFxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG1pbnQgb3V0cHV0XHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiBjcmVhdGVkIGZyb20gdGhlIHBhc3NlZCBpbiBwYXJhbWV0ZXJzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYnVpbGRDcmVhdGVORlRBc3NldFR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlcixcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIG1pbnRlclNldHM6IE1pbnRlclNldFtdLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgc3ltYm9sOiBzdHJpbmcsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSB1bmRlZmluZWRcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcblxyXG4gICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgICApXHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChmZWVBc3NldElELCB6ZXJvLCBmZWUpXHJcbiAgICAgIGNvbnN0IHN1Y2Nlc3M6IEVycm9yID0gdGhpcy5nZXRNaW5pbXVtU3BlbmRhYmxlKGFhZCwgYXNPZilcclxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgICAgb3V0cyA9IGFhZC5nZXRBbGxPdXRwdXRzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBpbml0aWFsU3RhdGU6IEluaXRpYWxTdGF0ZXMgPSBuZXcgSW5pdGlhbFN0YXRlcygpXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbWludGVyU2V0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbmZ0TWludE91dHB1dDogTkZUTWludE91dHB1dCA9IG5ldyBORlRNaW50T3V0cHV0KFxyXG4gICAgICAgIGksXHJcbiAgICAgICAgbWludGVyU2V0c1tgJHtpfWBdLmdldE1pbnRlcnMoKSxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICBtaW50ZXJTZXRzW2Ake2l9YF0uZ2V0VGhyZXNob2xkKClcclxuICAgICAgKVxyXG4gICAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KG5mdE1pbnRPdXRwdXQsIEFWTUNvbnN0YW50cy5ORlRGWElEKVxyXG4gICAgfVxyXG4gICAgbGV0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gMCAvLyBORlRzIGFyZSBub24tZnVuZ2libGVcclxuICAgIGxldCBDQXR4OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIHN5bWJvbCxcclxuICAgICAgZGVub21pbmF0aW9uLFxyXG4gICAgICBpbml0aWFsU3RhdGVcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChDQXR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBORlQgbWludCB0cmFuc2FjdGlvbi4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW09wZXJhdGlvblR4XV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcywgYW5kIFtbVHJhbnNmZXJPcGVyYXRpb25dXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBOZXR3b3JrSUQgb2YgdGhlIG5vZGVcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIEJsb2NrY2hhaW5JRCBmb3IgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICogQHBhcmFtIG93bmVycyBBbiBhcnJheSBvZiBbW091dHB1dE93bmVyc11dIHdobyB3aWxsIGJlIGdpdmVuIHRoZSBORlRzLlxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBmdW5kcyBmcm9tIHRoZSBVVFhPc1xyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgT3B0aW9uYWwuIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3MuXHJcbiAgICogQHBhcmFtIHV0eG9pZHMgQW4gYXJyYXkgb2Ygc3RyaW5ncyBmb3IgdGhlIE5GVHMgYmVpbmcgdHJhbnNmZXJyZWRcclxuICAgKiBAcGFyYW0gZ3JvdXBJRCBPcHRpb25hbC4gVGhlIGdyb3VwIHRoaXMgTkZUIGlzIGlzc3VlZCB0by5cclxuICAgKiBAcGFyYW0gcGF5bG9hZCBPcHRpb25hbC4gRGF0YSBmb3IgTkZUIFBheWxvYWQuXHJcbiAgICogQHBhcmFtIGZlZSBPcHRpb25hbC4gVGhlIGFtb3VudCBvZiBmZWVzIHRvIGJ1cm4gaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkLlxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZENyZWF0ZU5GVE1pbnRUeCA9IChcclxuICAgIG5ldHdvcmtJRDogbnVtYmVyLFxyXG4gICAgYmxvY2tjaGFpbklEOiBCdWZmZXIsXHJcbiAgICBvd25lcnM6IE91dHB1dE93bmVyc1tdLFxyXG4gICAgZnJvbUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgdXR4b2lkczogc3RyaW5nW10sXHJcbiAgICBncm91cElEOiBudW1iZXIgPSAwLFxyXG4gICAgcGF5bG9hZDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIGZlZUFzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpXHJcbiAgKTogVW5zaWduZWRUeCA9PiB7XHJcbiAgICBjb25zdCB6ZXJvOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG5cclxuICAgIGlmICh0aGlzLl9mZWVDaGVjayhmZWUsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBjaGFuZ2VBZGRyZXNzZXNcclxuICAgICAgKVxyXG4gICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICBjb25zdCBzdWNjZXNzOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShhYWQsIGFzT2YpXHJcbiAgICAgIGlmICh0eXBlb2Ygc3VjY2VzcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGlucyA9IGFhZC5nZXRJbnB1dHMoKVxyXG4gICAgICAgIG91dHMgPSBhYWQuZ2V0QWxsT3V0cHV0cygpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgc3VjY2Vzc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgb3BzOiBUcmFuc2ZlcmFibGVPcGVyYXRpb25bXSA9IFtdXHJcblxyXG4gICAgbGV0IG5mdE1pbnRPcGVyYXRpb246IE5GVE1pbnRPcGVyYXRpb24gPSBuZXcgTkZUTWludE9wZXJhdGlvbihcclxuICAgICAgZ3JvdXBJRCxcclxuICAgICAgcGF5bG9hZCxcclxuICAgICAgb3duZXJzXHJcbiAgICApXHJcblxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9pZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHV0eG86IFVUWE8gPSB0aGlzLmdldFVUWE8odXR4b2lkc1tgJHtpfWBdKVxyXG4gICAgICBsZXQgb3V0OiBORlRUcmFuc2Zlck91dHB1dCA9IHV0eG8uZ2V0T3V0cHV0KCkgYXMgTkZUVHJhbnNmZXJPdXRwdXRcclxuICAgICAgbGV0IHNwZW5kZXJzOiBCdWZmZXJbXSA9IG91dC5nZXRTcGVuZGVycyhmcm9tQWRkcmVzc2VzLCBhc09mKVxyXG5cclxuICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHNwZW5kZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IGlkeDogbnVtYmVyXHJcbiAgICAgICAgaWR4ID0gb3V0LmdldEFkZHJlc3NJZHgoc3BlbmRlcnNbYCR7an1gXSlcclxuICAgICAgICBpZiAoaWR4ID09IC0xKSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRDcmVhdGVORlRNaW50VHg6IG5vIHN1Y2ggYWRkcmVzcyBpbiBvdXRwdXRcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZnRNaW50T3BlcmF0aW9uLmFkZFNpZ25hdHVyZUlkeChpZHgsIHNwZW5kZXJzW2Ake2p9YF0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCB0cmFuc2ZlcmFibGVPcGVyYXRpb246IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9XHJcbiAgICAgICAgbmV3IFRyYW5zZmVyYWJsZU9wZXJhdGlvbih1dHhvLmdldEFzc2V0SUQoKSwgdXR4b2lkcywgbmZ0TWludE9wZXJhdGlvbilcclxuICAgICAgb3BzLnB1c2godHJhbnNmZXJhYmxlT3BlcmF0aW9uKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcGVyYXRpb25UeDogT3BlcmF0aW9uVHggPSBuZXcgT3BlcmF0aW9uVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIG9wc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBVbnNpZ25lZFR4KG9wZXJhdGlvblR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBORlQgdHJhbnNmZXIgdHJhbnNhY3Rpb24uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tPcGVyYXRpb25UeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcywgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMsIGFuZCBbW1RyYW5zZmVyT3BlcmF0aW9uXV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgVGhlIG51bWJlciByZXByZXNlbnRpbmcgTmV0d29ya0lEIG9mIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50aW5nIHRoZSBCbG9ja2NoYWluSUQgZm9yIHRoZSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3NlcyBBbiBhcnJheSBvZiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfXMgd2hpY2ggaW5kaWNhdGUgd2hvIHJlY2lldmVzIHRoZSBORlRcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBBbiBhcnJheSBmb3Ige0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIG93bnMgdGhlIE5GVFxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgT3B0aW9uYWwuIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3MuXHJcbiAgICogQHBhcmFtIHV0eG9pZHMgQW4gYXJyYXkgb2Ygc3RyaW5ncyBmb3IgdGhlIE5GVHMgYmVpbmcgdHJhbnNmZXJyZWRcclxuICAgKiBAcGFyYW0gZmVlIE9wdGlvbmFsLiBUaGUgYW1vdW50IG9mIGZlZXMgdG8gYnVybiBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBmZWVBc3NldElEIE9wdGlvbmFsLiBUaGUgYXNzZXRJRCBvZiB0aGUgZmVlcyBiZWluZyBidXJuZWQuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHRocmVzaG9sZCBPcHRpb25hbC4gVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIHNwZW5kIHRoZSBmdW5kcyBpbiB0aGUgcmVzdWx0YW50IFVUWE9cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZE5GVFRyYW5zZmVyVHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgdG9BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgZnJvbUFkZHJlc3NlczogQnVmZmVyW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgdXR4b2lkczogc3RyaW5nW10sXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcblxyXG4gICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgY29uc3QgYWFkOiBBc3NldEFtb3VudERlc3RpbmF0aW9uID0gbmV3IEFzc2V0QW1vdW50RGVzdGluYXRpb24oXHJcbiAgICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgICApXHJcbiAgICAgIGFhZC5hZGRBc3NldEFtb3VudChmZWVBc3NldElELCB6ZXJvLCBmZWUpXHJcbiAgICAgIGNvbnN0IHN1Y2Nlc3M6IEVycm9yID0gdGhpcy5nZXRNaW5pbXVtU3BlbmRhYmxlKGFhZCwgYXNPZilcclxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgICAgb3V0cyA9IGFhZC5nZXRBbGxPdXRwdXRzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IG9wczogVHJhbnNmZXJhYmxlT3BlcmF0aW9uW10gPSBbXVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9pZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdXR4bzogVVRYTyA9IHRoaXMuZ2V0VVRYTyh1dHhvaWRzW2Ake2l9YF0pXHJcblxyXG4gICAgICBjb25zdCBvdXQ6IE5GVFRyYW5zZmVyT3V0cHV0ID0gdXR4by5nZXRPdXRwdXQoKSBhcyBORlRUcmFuc2Zlck91dHB1dFxyXG4gICAgICBjb25zdCBzcGVuZGVyczogQnVmZmVyW10gPSBvdXQuZ2V0U3BlbmRlcnMoZnJvbUFkZHJlc3NlcywgYXNPZilcclxuXHJcbiAgICAgIGNvbnN0IG91dGJvdW5kOiBORlRUcmFuc2Zlck91dHB1dCA9IG5ldyBORlRUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBvdXQuZ2V0R3JvdXBJRCgpLFxyXG4gICAgICAgIG91dC5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgb3A6IE5GVFRyYW5zZmVyT3BlcmF0aW9uID0gbmV3IE5GVFRyYW5zZmVyT3BlcmF0aW9uKG91dGJvdW5kKVxyXG5cclxuICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHNwZW5kZXJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgY29uc3QgaWR4OiBudW1iZXIgPSBvdXQuZ2V0QWRkcmVzc0lkeChzcGVuZGVyc1tgJHtqfWBdKVxyXG4gICAgICAgIGlmIChpZHggPT09IC0xKSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgXCJFcnJvciAtIFVUWE9TZXQuYnVpbGRORlRUcmFuc2ZlclR4OiBcIiArXHJcbiAgICAgICAgICAgICAgYG5vIHN1Y2ggYWRkcmVzcyBpbiBvdXRwdXQ6ICR7c3BlbmRlcnNbYCR7an1gXX1gXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9wLmFkZFNpZ25hdHVyZUlkeChpZHgsIHNwZW5kZXJzW2Ake2p9YF0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHhmZXJvcDogVHJhbnNmZXJhYmxlT3BlcmF0aW9uID0gbmV3IFRyYW5zZmVyYWJsZU9wZXJhdGlvbihcclxuICAgICAgICB1dHhvLmdldEFzc2V0SUQoKSxcclxuICAgICAgICBbdXR4b2lkc1tgJHtpfWBdXSxcclxuICAgICAgICBvcFxyXG4gICAgICApXHJcbiAgICAgIG9wcy5wdXNoKHhmZXJvcClcclxuICAgIH1cclxuICAgIGNvbnN0IE9wVHg6IE9wZXJhdGlvblR4ID0gbmV3IE9wZXJhdGlvblR4KFxyXG4gICAgICBuZXR3b3JrSUQsXHJcbiAgICAgIGJsb2NrY2hhaW5JRCxcclxuICAgICAgb3V0cyxcclxuICAgICAgaW5zLFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBvcHNcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChPcFR4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCBJbXBvcnRUeCB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgVGhlIG51bWJlciByZXByZXNlbnRpbmcgTmV0d29ya0lEIG9mIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50aW5nIHRoZSBCbG9ja2NoYWluSUQgZm9yIHRoZSB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRvIHNlbmQgdGhlIGZ1bmRzXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBPcHRpb25hbC4gVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPcy5cclxuICAgKiBAcGFyYW0gaW1wb3J0SW5zIEFuIGFycmF5IG9mIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMgYmVpbmcgaW1wb3J0ZWRcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGNoYWluaWQgd2hlcmUgdGhlIGltcG9ydHMgYXJlIGNvbWluZyBmcm9tLlxyXG4gICAqIEBwYXJhbSBmZWUgT3B0aW9uYWwuIFRoZSBhbW91bnQgb2YgZmVlcyB0byBidXJuIGluIGl0cyBzbWFsbGVzdCBkZW5vbWluYXRpb24sIHJlcHJlc2VudGVkIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59LiBGZWUgd2lsbCBjb21lIGZyb20gdGhlIGlucHV0cyBmaXJzdCwgaWYgdGhleSBjYW4uXHJcbiAgICogQHBhcmFtIGZlZUFzc2V0SUQgT3B0aW9uYWwuIFRoZSBhc3NldElEIG9mIHRoZSBmZWVzIGJlaW5nIGJ1cm5lZC5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZEltcG9ydFR4ID0gKFxyXG4gICAgbmV0d29ya0lEOiBudW1iZXIsXHJcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlcixcclxuICAgIHRvQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGF0b21pY3M6IFVUWE9bXSxcclxuICAgIHNvdXJjZUNoYWluOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBmZWU6IEJOID0gdW5kZWZpbmVkLFxyXG4gICAgZmVlQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBVbnNpZ25lZFR4ID0+IHtcclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGxldCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXHJcbiAgICBpZiAodHlwZW9mIGZlZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBmZWUgPSB6ZXJvLmNsb25lKClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbXBvcnRJbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxyXG4gICAgbGV0IGZlZXBhaWQ6IEJOID0gbmV3IEJOKDApXHJcbiAgICBsZXQgZmVlQXNzZXRTdHI6IHN0cmluZyA9IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhdG9taWNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHV0eG86IFVUWE8gPSBhdG9taWNzW2Ake2l9YF1cclxuICAgICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gdXR4by5nZXRBc3NldElEKClcclxuICAgICAgY29uc3Qgb3V0cHV0OiBBbW91bnRPdXRwdXQgPSB1dHhvLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICBsZXQgYW10OiBCTiA9IG91dHB1dC5nZXRBbW91bnQoKS5jbG9uZSgpXHJcblxyXG4gICAgICBsZXQgaW5mZWVhbW91bnQgPSBhbXQuY2xvbmUoKVxyXG4gICAgICBsZXQgYXNzZXRTdHI6IHN0cmluZyA9IGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHR5cGVvZiBmZWVBc3NldElEICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgZmVlLmd0KHplcm8pICYmXHJcbiAgICAgICAgZmVlcGFpZC5sdChmZWUpICYmXHJcbiAgICAgICAgYXNzZXRTdHIgPT09IGZlZUFzc2V0U3RyXHJcbiAgICAgICkge1xyXG4gICAgICAgIGZlZXBhaWQgPSBmZWVwYWlkLmFkZChpbmZlZWFtb3VudClcclxuICAgICAgICBpZiAoZmVlcGFpZC5ndChmZWUpKSB7XHJcbiAgICAgICAgICBpbmZlZWFtb3VudCA9IGZlZXBhaWQuc3ViKGZlZSlcclxuICAgICAgICAgIGZlZXBhaWQgPSBmZWUuY2xvbmUoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpbmZlZWFtb3VudCA9IHplcm8uY2xvbmUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gdXR4by5nZXRUeElEKClcclxuICAgICAgY29uc3Qgb3V0cHV0aWR4OiBCdWZmZXIgPSB1dHhvLmdldE91dHB1dElkeCgpXHJcbiAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbXQpXHJcbiAgICAgIGNvbnN0IHhmZXJpbjogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXHJcbiAgICAgICAgdHhpZCxcclxuICAgICAgICBvdXRwdXRpZHgsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBpbnB1dFxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gb3V0cHV0LmdldEFkZHJlc3NlcygpXHJcbiAgICAgIGNvbnN0IHNwZW5kZXJzOiBCdWZmZXJbXSA9IG91dHB1dC5nZXRTcGVuZGVycyhmcm9tLCBhc09mKVxyXG4gICAgICBmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgc3BlbmRlcnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBjb25zdCBpZHg6IG51bWJlciA9IG91dHB1dC5nZXRBZGRyZXNzSWR4KHNwZW5kZXJzW2Ake2p9YF0pXHJcbiAgICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFxyXG4gICAgICAgICAgICBcIkVycm9yIC0gVVRYT1NldC5idWlsZEltcG9ydFR4OiBubyBzdWNoIFwiICtcclxuICAgICAgICAgICAgICBgYWRkcmVzcyBpbiBvdXRwdXQ6ICR7c3BlbmRlcnNbYCR7an1gXX1gXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhmZXJpbi5nZXRJbnB1dCgpLmFkZFNpZ25hdHVyZUlkeChpZHgsIHNwZW5kZXJzW2Ake2p9YF0pXHJcbiAgICAgIH1cclxuICAgICAgaW1wb3J0SW5zLnB1c2goeGZlcmluKVxyXG5cclxuICAgICAgLy9hZGQgZXh0cmEgb3V0cHV0cyBmb3IgZWFjaCBhbW91bnQgKGNhbGN1bGF0ZWQgZnJvbSB0aGUgaW1wb3J0ZWQgaW5wdXRzKSwgbWludXMgZmVlc1xyXG4gICAgICBpZiAoaW5mZWVhbW91bnQuZ3QoemVybykpIHtcclxuICAgICAgICBjb25zdCBzcGVuZG91dDogQW1vdW50T3V0cHV0ID0gU2VsZWN0T3V0cHV0Q2xhc3MoXHJcbiAgICAgICAgICBvdXRwdXQuZ2V0T3V0cHV0SUQoKSxcclxuICAgICAgICAgIGluZmVlYW1vdW50LFxyXG4gICAgICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAgIHRocmVzaG9sZFxyXG4gICAgICAgICkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcclxuICAgICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgICBzcGVuZG91dFxyXG4gICAgICAgIClcclxuICAgICAgICBvdXRzLnB1c2goeGZlcm91dClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldCByZW1haW5pbmcgZmVlcyBmcm9tIHRoZSBwcm92aWRlZCBhZGRyZXNzZXNcclxuICAgIGxldCBmZWVSZW1haW5pbmc6IEJOID0gZmVlLnN1YihmZWVwYWlkKVxyXG4gICAgaWYgKGZlZVJlbWFpbmluZy5ndCh6ZXJvKSAmJiB0aGlzLl9mZWVDaGVjayhmZWVSZW1haW5pbmcsIGZlZUFzc2V0SUQpKSB7XHJcbiAgICAgIGNvbnN0IGFhZDogQXNzZXRBbW91bnREZXN0aW5hdGlvbiA9IG5ldyBBc3NldEFtb3VudERlc3RpbmF0aW9uKFxyXG4gICAgICAgIHRvQWRkcmVzc2VzLFxyXG4gICAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgICAgY2hhbmdlQWRkcmVzc2VzXHJcbiAgICAgIClcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGZlZUFzc2V0SUQsIHplcm8sIGZlZVJlbWFpbmluZylcclxuICAgICAgY29uc3Qgc3VjY2VzczogRXJyb3IgPSB0aGlzLmdldE1pbmltdW1TcGVuZGFibGUoXHJcbiAgICAgICAgYWFkLFxyXG4gICAgICAgIGFzT2YsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgICAgb3V0cyA9IGFhZC5nZXRBbGxPdXRwdXRzKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBvdXRzLFxyXG4gICAgICBpbnMsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIHNvdXJjZUNoYWluLFxyXG4gICAgICBpbXBvcnRJbnNcclxuICAgIClcclxuICAgIHJldHVybiBuZXcgVW5zaWduZWRUeChpbXBvcnRUeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gdW5zaWduZWQgRXhwb3J0VHggdHJhbnNhY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbmV0d29ya0lEIFRoZSBudW1iZXIgcmVwcmVzZW50aW5nIE5ldHdvcmtJRCBvZiB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgQmxvY2tjaGFpbklEIGZvciB0aGUgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gYW1vdW50IFRoZSBhbW91bnQgYmVpbmcgZXhwb3J0ZWQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBheGNBc3NldElEIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9mIHRoZSBhc3NldCBJRCBmb3IgQVhDXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcmVjaWV2ZXMgdGhlIEFYQ1xyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gb3ducyB0aGUgQVhDXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBPcHRpb25hbC4gVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPcy5cclxuICAgKiBAcGFyYW0gZmVlIE9wdGlvbmFsLiBUaGUgYW1vdW50IG9mIGZlZXMgdG8gYnVybiBpbiBpdHMgc21hbGxlc3QgZGVub21pbmF0aW9uLCByZXByZXNlbnRlZCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBkZXN0aW5hdGlvbkNoYWluIE9wdGlvbmFsLiBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgY2hhaW5pZCB3aGVyZSB0byBzZW5kIHRoZSBhc3NldC5cclxuICAgKiBAcGFyYW0gZmVlQXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGZlZXMgYmVpbmcgYnVybmVkLlxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gbG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGJ1aWxkRXhwb3J0VHggPSAoXHJcbiAgICBuZXR3b3JrSUQ6IG51bWJlcixcclxuICAgIGJsb2NrY2hhaW5JRDogQnVmZmVyLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlcixcclxuICAgIHRvQWRkcmVzc2VzOiBCdWZmZXJbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IEJ1ZmZlcltdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBCdWZmZXJbXSA9IHVuZGVmaW5lZCxcclxuICAgIGRlc3RpbmF0aW9uQ2hhaW46IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGZlZTogQk4gPSB1bmRlZmluZWQsXHJcbiAgICBmZWVBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKSxcclxuICAgIHRocmVzaG9sZDogbnVtYmVyID0gMVxyXG4gICk6IFVuc2lnbmVkVHggPT4ge1xyXG4gICAgbGV0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXHJcbiAgICBsZXQgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gICAgbGV0IGV4cG9ydG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cclxuXHJcbiAgICBpZiAodHlwZW9mIGNoYW5nZUFkZHJlc3NlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMgPSB0b0FkZHJlc3Nlc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHplcm86IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgaWYgKGFtb3VudC5lcSh6ZXJvKSkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBmZWVBc3NldElEID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGZlZUFzc2V0SUQgPSBhc3NldElEXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhYWQ6IEFzc2V0QW1vdW50RGVzdGluYXRpb24gPSBuZXcgQXNzZXRBbW91bnREZXN0aW5hdGlvbihcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIGNoYW5nZUFkZHJlc3Nlc1xyXG4gICAgKVxyXG4gICAgaWYgKGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikgPT09IGZlZUFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGFzc2V0SUQsIGFtb3VudCwgZmVlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWFkLmFkZEFzc2V0QW1vdW50KGFzc2V0SUQsIGFtb3VudCwgemVybylcclxuICAgICAgaWYgKHRoaXMuX2ZlZUNoZWNrKGZlZSwgZmVlQXNzZXRJRCkpIHtcclxuICAgICAgICBhYWQuYWRkQXNzZXRBbW91bnQoZmVlQXNzZXRJRCwgemVybywgZmVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBzdWNjZXNzOiBFcnJvciA9IHRoaXMuZ2V0TWluaW11bVNwZW5kYWJsZShcclxuICAgICAgYWFkLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcbiAgICBpZiAodHlwZW9mIHN1Y2Nlc3MgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgaW5zID0gYWFkLmdldElucHV0cygpXHJcbiAgICAgIG91dHMgPSBhYWQuZ2V0Q2hhbmdlT3V0cHV0cygpXHJcbiAgICAgIGV4cG9ydG91dHMgPSBhYWQuZ2V0T3V0cHV0cygpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBzdWNjZXNzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KFxyXG4gICAgICBuZXR3b3JrSUQsXHJcbiAgICAgIGJsb2NrY2hhaW5JRCxcclxuICAgICAgb3V0cyxcclxuICAgICAgaW5zLFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBkZXN0aW5hdGlvbkNoYWluLFxyXG4gICAgICBleHBvcnRvdXRzXHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IFVuc2lnbmVkVHgoZXhwb3J0VHgpXHJcbiAgfVxyXG59XHJcbiJdfQ==