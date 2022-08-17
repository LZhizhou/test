"use strict";
/**
 * @packageDocumentation
 * @module API-EVM
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMAPI = void 0;
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const jrpcapi_1 = require("../../common/jrpcapi");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const utxos_1 = require("./utxos");
const keychain_1 = require("./keychain");
const constants_1 = require("../../utils/constants");
const tx_1 = require("./tx");
const constants_2 = require("./constants");
const inputs_1 = require("./inputs");
const outputs_1 = require("./outputs");
const exporttx_1 = require("./exporttx");
const errors_1 = require("../../utils/errors");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node's EVMAPI
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class EVMAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly.
     * Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/bc/AX/axc" as the path to blockchain's baseURL
     * @param blockchainID The Blockchain's ID. Defaults to an empty string: ""
     */
    constructor(core, baseURL = "/ext/bc/AX/axc", blockchainID = "") {
        super(core, baseURL);
        /**
         * @ignore
         */
        this.keychain = new keychain_1.KeyChain("", "");
        this.blockchainID = "";
        this.blockchainAlias = undefined;
        this.AXCAssetID = undefined;
        this.txFee = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        this.getBlockchainAlias = () => {
            if (typeof this.blockchainAlias === "undefined") {
                const netID = this.core.getNetworkID();
                if (netID in constants_1.Defaults.network &&
                    this.blockchainID in constants_1.Defaults.network[`${netID}`]) {
                    this.blockchainAlias =
                        constants_1.Defaults.network[`${netID}`][this.blockchainID].alias;
                    return this.blockchainAlias;
                }
                else {
                    /* istanbul ignore next */
                    return undefined;
                }
            }
            return this.blockchainAlias;
        };
        /**
         * Sets the alias for the blockchainID.
         *
         * @param alias The alias for the blockchainID.
         *
         */
        this.setBlockchainAlias = (alias) => {
            this.blockchainAlias = alias;
            /* istanbul ignore next */
            return undefined;
        };
        /**
         * Gets the blockchainID and returns it.
         *
         * @returns The blockchainID
         */
        this.getBlockchainID = () => this.blockchainID;
        /**
         * Refresh blockchainID, and if a blockchainID is passed in, use that.
         *
         * @param Optional. BlockchainID to assign, if none, uses the default based on networkID.
         *
         * @returns A boolean if the blockchainID was successfully refreshed.
         */
        this.refreshBlockchainID = (blockchainID = undefined) => {
            const netID = this.core.getNetworkID();
            if (typeof blockchainID === "undefined" &&
                typeof constants_1.Defaults.network[`${netID}`] !== "undefined") {
                this.blockchainID = constants_1.Defaults.network[`${netID}`].AX.blockchainID; //default to AX-Chain
                return true;
            }
            if (typeof blockchainID === "string") {
                this.blockchainID = blockchainID;
                return true;
            }
            return false;
        };
        /**
         * Takes an address string and returns its {@link https://github.com/feross/buffer|Buffer} representation if valid.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid, undefined if not valid.
         */
        this.parseAddress = (addr) => {
            const alias = this.getBlockchainAlias();
            const blockchainID = this.getBlockchainID();
            return bintools.parseAddress(addr, blockchainID, alias, constants_2.EVMConstants.ADDRESSLENGTH);
        };
        this.addressFromBuffer = (address) => {
            const chainID = this.getBlockchainAlias()
                ? this.getBlockchainAlias()
                : this.getBlockchainID();
            const type = "bech32";
            return serialization.bufferToType(address, type, this.core.getHRP(), chainID);
        };
        /**
         * Retrieves an assets name and symbol.
         *
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an b58 serialized string for the AssetID or its alias.
         *
         * @returns Returns a Promise Asset with keys "name", "symbol", "assetID" and "denomination".
         */
        this.getAssetDescription = (assetID) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            const params = {
                assetID: asset
            };
            const tmpBaseURL = this.getBaseURL();
            // set base url to get asset description
            this.setBaseURL("/ext/bc/Swap");
            const response = yield this.callMethod("avm.getAssetDescription", params);
            // set base url back what it originally was
            this.setBaseURL(tmpBaseURL);
            return {
                name: response.data.result.name,
                symbol: response.data.result.symbol,
                assetID: bintools.cb58Decode(response.data.result.assetID),
                denomination: parseInt(response.data.result.denomination, 10)
            };
        });
        /**
         * Fetches the AXC AssetID and returns it in a Promise.
         *
         * @param refresh This function caches the response. Refresh = true will bust the cache.
         *
         * @returns The the provided string representing the AXC AssetID
         */
        this.getAXCAssetID = (refresh = false) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.AXCAssetID === "undefined" || refresh) {
                const asset = yield this.getAssetDescription(constants_1.PrimaryAssetAlias);
                this.AXCAssetID = asset.assetID;
            }
            return this.AXCAssetID;
        });
        /**
         * Overrides the defaults and sets the cache to a specific AXC AssetID
         *
         * @param axcAssetID A cb58 string or Buffer representing the AXC AssetID
         *
         * @returns The the provided string representing the AXC AssetID
         */
        this.setAXCAssetID = (axcAssetID) => {
            if (typeof axcAssetID === "string") {
                axcAssetID = bintools.cb58Decode(axcAssetID);
            }
            this.AXCAssetID = axcAssetID;
        };
        /**
         * Gets the default tx fee for this chain.
         *
         * @returns The default tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getDefaultTxFee = () => {
            return this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["AX"]["txFee"])
                : new bn_js_1.default(0);
        };
        /**
         * returns the amount of [assetID] for the given address in the state of the given block number.
         * "latest", "pending", and "accepted" meta block numbers are also allowed.
         *
         * @param hexAddress The hex representation of the address
         * @param blockHeight The block height
         * @param assetID The asset ID
         *
         * @returns Returns a Promise object containing the balance
         */
        this.getAssetBalance = (hexAddress, blockHeight, assetID) => __awaiter(this, void 0, void 0, function* () {
            const params = [hexAddress, blockHeight, assetID];
            const method = "eth_getAssetBalance";
            const path = "ext/bc/AX/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data;
        });
        /**
         * Returns the status of a provided atomic transaction ID by calling the node's `getAtomicTxStatus` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the status retrieved from the node
         */
        this.getAtomicTxStatus = (txID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID
            };
            const response = yield this.callMethod("axc.getAtomicTxStatus", params);
            return response.data.result.status
                ? response.data.result.status
                : response.data.result;
        });
        /**
         * Returns the transaction data of a provided transaction ID by calling the node's `getAtomicTx` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the bytes retrieved from the node
         */
        this.getAtomicTx = (txID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID
            };
            const response = yield this.callMethod("axc.getAtomicTx", params);
            return response.data.result.tx;
        });
        /**
         * Gets the tx fee for this chain.
         *
         * @returns The tx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getTxFee = () => {
            if (typeof this.txFee === "undefined") {
                this.txFee = this.getDefaultTxFee();
            }
            return this.txFee;
        };
        /**
         * Send ANT (Axia Native Token) assets including AXC from the AX-Chain to an account on the Swap-Chain.
         *
         * After calling this method, you must call the Swap-Chain’s import method to complete the transfer.
         *
         * @param username The Keystore user that controls the Swap-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the Swap-Chain to send the AXC to.
         * @param amount Amount of asset to export as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         *
         * @returns String representing the transaction id
         */
        this.export = (username, password, to, amount, assetID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                amount: amount.toString(10),
                username,
                password,
                assetID
            };
            const response = yield this.callMethod("axc.export", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Send AXC from the AX-Chain to an account on the Swap-Chain.
         *
         * After calling this method, you must call the Swap-Chain’s importAXC method to complete the transfer.
         *
         * @param username The Keystore user that controls the Swap-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the Swap-Chain to send the AXC to.
         * @param amount Amount of AXC to export as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns String representing the transaction id
         */
        this.exportAXC = (username, password, to, amount) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                amount: amount.toString(10),
                username,
                password
            };
            const response = yield this.callMethod("axc.exportAXC", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO's. Default is to use this chain, but if exported UTXOs exist
         * from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         */
        this.getUTXOs = (addresses, sourceChain = undefined, limit = 0, startIndex = undefined) => __awaiter(this, void 0, void 0, function* () {
            if (typeof addresses === "string") {
                addresses = [addresses];
            }
            const params = {
                addresses: addresses,
                limit
            };
            if (typeof startIndex !== "undefined" && startIndex) {
                params.startIndex = startIndex;
            }
            if (typeof sourceChain !== "undefined") {
                params.sourceChain = sourceChain;
            }
            const response = yield this.callMethod("axc.getUTXOs", params);
            const utxos = new utxos_1.UTXOSet();
            const data = response.data.result.utxos;
            utxos.addArray(data, false);
            response.data.result.utxos = utxos;
            return response.data.result;
        });
        /**
         * Send ANT (Axia Native Token) assets including AXC from an account on the Swap-Chain to an address on the AX-Chain. This transaction
         * must be signed with the key of the account that the asset is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the asset is sent to.
         * @param sourceChain The chainID where the funds are coming from. Ex: "Swap"
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        this.import = (username, password, to, sourceChain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                sourceChain,
                username,
                password
            };
            const response = yield this.callMethod("axc.import", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Send AXC from an account on the Swap-Chain to an address on the AX-Chain. This transaction
         * must be signed with the key of the account that the AXC is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the AXC is sent to. This must be the same as the to
         * argument in the corresponding call to the Swap-Chain’s exportAXC
         * @param sourceChain The chainID where the funds are coming from.
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        this.importAXC = (username, password, to, sourceChain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                to,
                sourceChain,
                username,
                password
            };
            const response = yield this.callMethod("axc.importAXC", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Give a user control over an address by providing the private key that controls the address.
         *
         * @param username The name of the user to store the private key
         * @param password The password that unlocks the user
         * @param privateKey A string representing the private key in the vm"s format
         *
         * @returns The address for the imported private key.
         */
        this.importKey = (username, password, privateKey) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                privateKey
            };
            const response = yield this.callMethod("axc.importKey", params);
            return response.data.result.address
                ? response.data.result.address
                : response.data.result;
        });
        /**
         * Calls the node's issueTx method from the API and returns the resulting transaction ID as a string.
         *
         * @param tx A string, {@link https://github.com/feross/buffer|Buffer}, or [[Tx]] representing a transaction
         *
         * @returns A Promise string representing the transaction ID of the posted transaction.
         */
        this.issueTx = (tx) => __awaiter(this, void 0, void 0, function* () {
            let Transaction = "";
            if (typeof tx === "string") {
                Transaction = tx;
            }
            else if (tx instanceof buffer_1.Buffer) {
                const txobj = new tx_1.Tx();
                txobj.fromBuffer(tx);
                Transaction = txobj.toString();
            }
            else if (tx instanceof tx_1.Tx) {
                Transaction = tx.toString();
            }
            else {
                /* istanbul ignore next */
                throw new errors_1.TransactionError("Error - axc.issueTx: provided tx is not expected type of string, Buffer, or Tx");
            }
            const params = {
                tx: Transaction.toString()
            };
            const response = yield this.callMethod("axc.issueTx", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Exports the private key for an address.
         *
         * @param username The name of the user with the private key
         * @param password The password used to decrypt the private key
         * @param address The address whose private key should be exported
         *
         * @returns Promise with the decrypted private key and private key hex as store in the database
         */
        this.exportKey = (username, password, address) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                address
            };
            const response = yield this.callMethod("axc.exportKey", params);
            return response.data.result;
        });
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddress The address to send the funds
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[ImportTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        this.buildImportTx = (utxoset, toAddress, ownerAddresses, sourceChain, fromAddresses, fee = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const from = this._cleanAddressArray(fromAddresses, "buildImportTx").map((a) => bintools.stringToAddress(a));
            let sraxChain = undefined;
            if (typeof sourceChain === "string") {
                // if there is a sourceChain passed in and it's a string then save the string value and cast the original
                // variable from a string to a Buffer
                sraxChain = sourceChain;
                sourceChain = bintools.cb58Decode(sourceChain);
            }
            else if (typeof sourceChain === "undefined" ||
                !(sourceChain instanceof buffer_1.Buffer)) {
                // if there is no sourceChain passed in or the sourceChain is any data type other than a Buffer then throw an error
                throw new errors_1.ChainIdError("Error - EVMAPI.buildImportTx: sourceChain is undefined or invalid sourceChain type.");
            }
            const utxoResponse = yield this.getUTXOs(ownerAddresses, sraxChain, 0, undefined);
            const atomicUTXOs = utxoResponse.utxos;
            const networkID = this.core.getNetworkID();
            const axcAssetID = constants_1.Defaults.network[`${networkID}`].Swap.axcAssetID;
            const axcAssetIDBuf = bintools.cb58Decode(axcAssetID);
            const atomics = atomicUTXOs.getAllUTXOs();
            if (atomics.length === 0) {
                throw new errors_1.NoAtomicUTXOsError("Error - EVMAPI.buildImportTx: no atomic utxos to import");
            }
            const builtUnsignedTx = utxoset.buildImportTx(networkID, bintools.cb58Decode(this.blockchainID), toAddress, atomics, sourceChain, fee, axcAssetIDBuf);
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned Export Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s).
         *
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         * @param destinationChain The chainid for where the assets will be sent.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        this.buildExportTx = (amount, assetID, destinationChain, fromAddressHex, fromAddressBech, toAddresses, nonce = 0, locktime = new bn_js_1.default(0), threshold = 1, fee = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const prefixes = {};
            toAddresses.map((address) => {
                prefixes[address.split("-")[0]] = true;
            });
            if (Object.keys(prefixes).length !== 1) {
                throw new errors_1.AddressError("Error - EVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
            }
            if (typeof destinationChain === "undefined") {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID is undefined.");
            }
            else if (typeof destinationChain === "string") {
                destinationChain = bintools.cb58Decode(destinationChain);
            }
            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Invalid destinationChain type");
            }
            if (destinationChain.length !== 32) {
                throw new errors_1.ChainIdError("Error - EVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
            }
            const assetDescription = yield this.getAssetDescription("AXC");
            let evmInputs = [];
            if (bintools.cb58Encode(assetDescription.assetID) === assetID) {
                const evmInput = new inputs_1.EVMInput(fromAddressHex, amount.add(fee), assetID, nonce);
                evmInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmInput);
            }
            else {
                // if asset id isn't AXC asset id then create 2 inputs
                // first input will be AXC and will be for the amount of the fee
                // second input will be the ANT
                const evmAXCInput = new inputs_1.EVMInput(fromAddressHex, fee, assetDescription.assetID, nonce);
                evmAXCInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmAXCInput);
                const evmANTInput = new inputs_1.EVMInput(fromAddressHex, amount, assetID, nonce);
                evmANTInput.addSignatureIdx(0, bintools.stringToAddress(fromAddressBech));
                evmInputs.push(evmANTInput);
            }
            const to = [];
            toAddresses.map((address) => {
                to.push(bintools.stringToAddress(address));
            });
            let exportedOuts = [];
            const secpTransferOutput = new outputs_1.SECPTransferOutput(amount, to, locktime, threshold);
            const transferableOutput = new outputs_1.TransferableOutput(bintools.cb58Decode(assetID), secpTransferOutput);
            exportedOuts.push(transferableOutput);
            // lexicographically sort ins and outs
            evmInputs = evmInputs.sort(inputs_1.EVMInput.comparator());
            exportedOuts = exportedOuts.sort(outputs_1.TransferableOutput.comparator());
            const exportTx = new exporttx_1.ExportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), destinationChain, evmInputs, exportedOuts);
            const unsignedTx = new tx_1.UnsignedTx(exportTx);
            return unsignedTx;
        });
        /**
         * Gets a reference to the keychain for this class.
         *
         * @returns The instance of [[KeyChain]] for this class
         */
        this.keyChain = () => this.keychain;
        /**
         *
         * @returns new instance of [[KeyChain]]
         */
        this.newKeyChain = () => {
            // warning, overwrites the old keychain
            const alias = this.getBlockchainAlias();
            if (alias) {
                this.keychain = new keychain_1.KeyChain(this.core.getHRP(), alias);
            }
            else {
                this.keychain = new keychain_1.KeyChain(this.core.getHRP(), this.blockchainID);
            }
            return this.keychain;
        };
        /**
         * @returns a Promise string containing the base fee for the next block.
         */
        this.getBaseFee = () => __awaiter(this, void 0, void 0, function* () {
            const params = [];
            const method = "eth_baseFee";
            const path = "ext/bc/AX/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data.result;
        });
        /**
         * returns the priority fee needed to be included in a block.
         *
         * @returns Returns a Promise string containing the priority fee needed to be included in a block.
         */
        this.getMaxPriorityFeePerGas = () => __awaiter(this, void 0, void 0, function* () {
            const params = [];
            const method = "eth_maxPriorityFeePerGas";
            const path = "ext/bc/AX/rpc";
            const response = yield this.callMethod(method, params, path);
            return response.data.result;
        });
        this.blockchainID = blockchainID;
        const netID = core.getNetworkID();
        if (netID in constants_1.Defaults.network &&
            blockchainID in constants_1.Defaults.network[`${netID}`]) {
            const { alias } = constants_1.Defaults.network[`${netID}`][`${blockchainID}`];
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), alias);
        }
        else {
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), blockchainID);
        }
    }
    /**
     * @ignore
     */
    _cleanAddressArray(addresses, caller) {
        const addrs = [];
        const chainid = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            addresses.forEach((address) => {
                if (typeof address === "string") {
                    if (typeof this.parseAddress(address) === "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - Invalid address format");
                    }
                    addrs.push(address);
                }
                else {
                    const type = "bech32";
                    addrs.push(serialization.bufferToType(address, type, this.core.getHRP(), chainid));
                }
            });
        }
        return addrs;
    }
}
exports.EVMAPI = EVMAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvZXZtL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxvQ0FBZ0M7QUFDaEMsa0RBQXNCO0FBRXRCLGtEQUE4QztBQUU5QyxvRUFBMkM7QUFDM0MsbUNBQXVDO0FBQ3ZDLHlDQUFxQztBQUNyQyxxREFBbUU7QUFDbkUsNkJBQXFDO0FBQ3JDLDJDQUEwQztBQU8xQyxxQ0FBbUM7QUFDbkMsdUNBQWtFO0FBQ2xFLHlDQUFxQztBQUNyQywrQ0FLMkI7QUFDM0IsdUNBQTJEO0FBYzNEOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGFBQWEsR0FBa0IscUJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVoRTs7Ozs7O0dBTUc7QUFDSCxNQUFhLE1BQU8sU0FBUSxpQkFBTztJQXV4QmpDOzs7Ozs7O09BT0c7SUFDSCxZQUNFLElBQWMsRUFDZCxVQUFrQixnQkFBZ0IsRUFDbEMsZUFBdUIsRUFBRTtRQUV6QixLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBbnlCdEI7O1dBRUc7UUFDTyxhQUFRLEdBQWEsSUFBSSxtQkFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUN6QyxpQkFBWSxHQUFXLEVBQUUsQ0FBQTtRQUN6QixvQkFBZSxHQUFXLFNBQVMsQ0FBQTtRQUNuQyxlQUFVLEdBQVcsU0FBUyxDQUFBO1FBQzlCLFVBQUssR0FBTyxTQUFTLENBQUE7UUFFL0I7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFHLEdBQVcsRUFBRTtZQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLGVBQWUsS0FBSyxXQUFXLEVBQUU7Z0JBQy9DLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7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QUFDO0lBNUREOztPQUVHO0lBQ08sa0JBQWtCLENBQzFCLFNBQThCLEVBQzlCLE1BQWM7UUFFZCxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUE7UUFDMUIsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUMxQixJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDL0IsSUFBSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBaUIsQ0FBQyxLQUFLLFdBQVcsRUFBRTt3QkFDL0QsMEJBQTBCO3dCQUMxQixNQUFNLElBQUkscUJBQVksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO3FCQUN6RDtvQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWlCLENBQUMsQ0FBQTtpQkFDOUI7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEdBQW1CLFFBQVEsQ0FBQTtvQkFDckMsS0FBSyxDQUFDLElBQUksQ0FDUixhQUFhLENBQUMsWUFBWSxDQUN4QixPQUFpQixFQUNqQixJQUFJLEVBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDbEIsT0FBTyxDQUNSLENBQ0YsQ0FBQTtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7Q0E2REY7QUFsMUJELHdCQWsxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLUVWTVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCBBeGlhQ29yZSBmcm9tIFwiLi4vLi4vYXhpYVwiXHJcbmltcG9ydCB7IEpSUENBUEkgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pycGNhcGlcIlxyXG5pbXBvcnQgeyBSZXF1ZXN0UmVzcG9uc2VEYXRhIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9hcGliYXNlXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi91dHhvc1wiXHJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4va2V5Y2hhaW5cIlxyXG5pbXBvcnQgeyBEZWZhdWx0cywgUHJpbWFyeUFzc2V0QWxpYXMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgVHgsIFVuc2lnbmVkVHggfSBmcm9tIFwiLi90eFwiXHJcbmltcG9ydCB7IEVWTUNvbnN0YW50cyB9IGZyb20gXCIuL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7XHJcbiAgQXNzZXQsXHJcbiAgSW5kZXgsXHJcbiAgSXNzdWVUeFBhcmFtcyxcclxuICBVVFhPUmVzcG9uc2VcclxufSBmcm9tIFwiLi8uLi8uLi9jb21tb24vaW50ZXJmYWNlc1wiXHJcbmltcG9ydCB7IEVWTUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcclxuaW1wb3J0IHsgU0VDUFRyYW5zZmVyT3V0cHV0LCBUcmFuc2ZlcmFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHsgRXhwb3J0VHggfSBmcm9tIFwiLi9leHBvcnR0eFwiXHJcbmltcG9ydCB7XHJcbiAgVHJhbnNhY3Rpb25FcnJvcixcclxuICBDaGFpbklkRXJyb3IsXHJcbiAgTm9BdG9taWNVVFhPc0Vycm9yLFxyXG4gIEFkZHJlc3NFcnJvclxyXG59IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnNcIlxyXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkVHlwZSB9IGZyb20gXCIuLi8uLi91dGlsc1wiXHJcbmltcG9ydCB7XHJcbiAgRXhwb3J0QVhDUGFyYW1zLFxyXG4gIEV4cG9ydEtleVBhcmFtcyxcclxuICBFeHBvcnRQYXJhbXMsXHJcbiAgR2V0QXRvbWljVHhQYXJhbXMsXHJcbiAgR2V0QXNzZXREZXNjcmlwdGlvblBhcmFtcyxcclxuICBHZXRBdG9taWNUeFN0YXR1c1BhcmFtcyxcclxuICBHZXRVVFhPc1BhcmFtcyxcclxuICBJbXBvcnRBWENQYXJhbXMsXHJcbiAgSW1wb3J0S2V5UGFyYW1zLFxyXG4gIEltcG9ydFBhcmFtc1xyXG59IGZyb20gXCIuL2ludGVyZmFjZXNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbm9kZSdzIEVWTUFQSVxyXG4gKlxyXG4gKiBAY2F0ZWdvcnkgUlBDQVBJc1xyXG4gKlxyXG4gKiBAcmVtYXJrcyBUaGlzIGV4dGVuZHMgdGhlIFtbSlJQQ0FQSV1dIGNsYXNzLiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgZGlyZWN0bHkgY2FsbGVkLiBJbnN0ZWFkLCB1c2UgdGhlIFtbQXhpYS5hZGRBUEldXSBmdW5jdGlvbiB0byByZWdpc3RlciB0aGlzIGludGVyZmFjZSB3aXRoIEF4aWEuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRVZNQVBJIGV4dGVuZHMgSlJQQ0FQSSB7XHJcbiAgLyoqXHJcbiAgICogQGlnbm9yZVxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBrZXljaGFpbjogS2V5Q2hhaW4gPSBuZXcgS2V5Q2hhaW4oXCJcIiwgXCJcIilcclxuICBwcm90ZWN0ZWQgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBcIlwiXHJcbiAgcHJvdGVjdGVkIGJsb2NrY2hhaW5BbGlhczogc3RyaW5nID0gdW5kZWZpbmVkXHJcbiAgcHJvdGVjdGVkIEFYQ0Fzc2V0SUQ6IEJ1ZmZlciA9IHVuZGVmaW5lZFxyXG4gIHByb3RlY3RlZCB0eEZlZTogQk4gPSB1bmRlZmluZWRcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSUQgaWYgaXQgZXhpc3RzLCBvdGhlcndpc2UgcmV0dXJucyBgdW5kZWZpbmVkYC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRFxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5BbGlhcyA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmJsb2NrY2hhaW5BbGlhcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBjb25zdCBuZXRJRDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICAgIGlmIChcclxuICAgICAgICBuZXRJRCBpbiBEZWZhdWx0cy5uZXR3b3JrICYmXHJcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluSUQgaW4gRGVmYXVsdHMubmV0d29ya1tgJHtuZXRJRH1gXVxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLmJsb2NrY2hhaW5BbGlhcyA9XHJcbiAgICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdW3RoaXMuYmxvY2tjaGFpbklEXS5hbGlhc1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrY2hhaW5BbGlhc1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5ibG9ja2NoYWluQWxpYXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGFsaWFzIGZvciB0aGUgYmxvY2tjaGFpbklELlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFsaWFzIFRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRC5cclxuICAgKlxyXG4gICAqL1xyXG4gIHNldEJsb2NrY2hhaW5BbGlhcyA9IChhbGlhczogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgIHRoaXMuYmxvY2tjaGFpbkFsaWFzID0gYWxpYXNcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICByZXR1cm4gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBibG9ja2NoYWluSUQgYW5kIHJldHVybnMgaXQuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgYmxvY2tjaGFpbklEXHJcbiAgICovXHJcbiAgZ2V0QmxvY2tjaGFpbklEID0gKCk6IHN0cmluZyA9PiB0aGlzLmJsb2NrY2hhaW5JRFxyXG5cclxuICAvKipcclxuICAgKiBSZWZyZXNoIGJsb2NrY2hhaW5JRCwgYW5kIGlmIGEgYmxvY2tjaGFpbklEIGlzIHBhc3NlZCBpbiwgdXNlIHRoYXQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gT3B0aW9uYWwuIEJsb2NrY2hhaW5JRCB0byBhc3NpZ24sIGlmIG5vbmUsIHVzZXMgdGhlIGRlZmF1bHQgYmFzZWQgb24gbmV0d29ya0lELlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBib29sZWFuIGlmIHRoZSBibG9ja2NoYWluSUQgd2FzIHN1Y2Nlc3NmdWxseSByZWZyZXNoZWQuXHJcbiAgICovXHJcbiAgcmVmcmVzaEJsb2NrY2hhaW5JRCA9IChibG9ja2NoYWluSUQ6IHN0cmluZyA9IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc3QgbmV0SUQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxyXG4gICAgaWYgKFxyXG4gICAgICB0eXBlb2YgYmxvY2tjaGFpbklEID09PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgIHR5cGVvZiBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdICE9PSBcInVuZGVmaW5lZFwiXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5ibG9ja2NoYWluSUQgPSBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdLkFYLmJsb2NrY2hhaW5JRCAvL2RlZmF1bHQgdG8gQVgtQ2hhaW5cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGJsb2NrY2hhaW5JRCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYW4gYWRkcmVzcyBzdHJpbmcgYW5kIHJldHVybnMgaXRzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIGlmIHZhbGlkLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3MgaWYgdmFsaWQsIHVuZGVmaW5lZCBpZiBub3QgdmFsaWQuXHJcbiAgICovXHJcbiAgcGFyc2VBZGRyZXNzID0gKGFkZHI6IHN0cmluZyk6IEJ1ZmZlciA9PiB7XHJcbiAgICBjb25zdCBhbGlhczogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSB0aGlzLmdldEJsb2NrY2hhaW5JRCgpXHJcbiAgICByZXR1cm4gYmludG9vbHMucGFyc2VBZGRyZXNzKFxyXG4gICAgICBhZGRyLFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIGFsaWFzLFxyXG4gICAgICBFVk1Db25zdGFudHMuQUREUkVTU0xFTkdUSFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgYWRkcmVzc0Zyb21CdWZmZXIgPSAoYWRkcmVzczogQnVmZmVyKTogc3RyaW5nID0+IHtcclxuICAgIGNvbnN0IGNoYWluSUQ6IHN0cmluZyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgICAgPyB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXHJcbiAgICAgIDogdGhpcy5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXHJcbiAgICByZXR1cm4gc2VyaWFsaXphdGlvbi5idWZmZXJUb1R5cGUoXHJcbiAgICAgIGFkZHJlc3MsXHJcbiAgICAgIHR5cGUsXHJcbiAgICAgIHRoaXMuY29yZS5nZXRIUlAoKSxcclxuICAgICAgY2hhaW5JRFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIGFuIGFzc2V0cyBuYW1lIGFuZCBzeW1ib2wuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXNzZXRJRCBFaXRoZXIgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvciBhbiBiNTggc2VyaWFsaXplZCBzdHJpbmcgZm9yIHRoZSBBc3NldElEIG9yIGl0cyBhbGlhcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIEFzc2V0IHdpdGgga2V5cyBcIm5hbWVcIiwgXCJzeW1ib2xcIiwgXCJhc3NldElEXCIgYW5kIFwiZGVub21pbmF0aW9uXCIuXHJcbiAgICovXHJcbiAgZ2V0QXNzZXREZXNjcmlwdGlvbiA9IGFzeW5jIChhc3NldElEOiBCdWZmZXIgfCBzdHJpbmcpOiBQcm9taXNlPGFueT4gPT4ge1xyXG4gICAgbGV0IGFzc2V0OiBzdHJpbmdcclxuICAgIGlmICh0eXBlb2YgYXNzZXRJRCAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBhc3NldCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFzc2V0ID0gYXNzZXRJRFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0QXNzZXREZXNjcmlwdGlvblBhcmFtcyA9IHtcclxuICAgICAgYXNzZXRJRDogYXNzZXRcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0bXBCYXNlVVJMOiBzdHJpbmcgPSB0aGlzLmdldEJhc2VVUkwoKVxyXG5cclxuICAgIC8vIHNldCBiYXNlIHVybCB0byBnZXQgYXNzZXQgZGVzY3JpcHRpb25cclxuICAgIHRoaXMuc2V0QmFzZVVSTChcIi9leHQvYmMvU3dhcFwiKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmdldEFzc2V0RGVzY3JpcHRpb25cIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcblxyXG4gICAgLy8gc2V0IGJhc2UgdXJsIGJhY2sgd2hhdCBpdCBvcmlnaW5hbGx5IHdhc1xyXG4gICAgdGhpcy5zZXRCYXNlVVJMKHRtcEJhc2VVUkwpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBuYW1lOiByZXNwb25zZS5kYXRhLnJlc3VsdC5uYW1lLFxyXG4gICAgICBzeW1ib2w6IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN5bWJvbCxcclxuICAgICAgYXNzZXRJRDogYmludG9vbHMuY2I1OERlY29kZShyZXNwb25zZS5kYXRhLnJlc3VsdC5hc3NldElEKSxcclxuICAgICAgZGVub21pbmF0aW9uOiBwYXJzZUludChyZXNwb25zZS5kYXRhLnJlc3VsdC5kZW5vbWluYXRpb24sIDEwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgQVhDIEFzc2V0SUQgYW5kIHJldHVybnMgaXQgaW4gYSBQcm9taXNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlZnJlc2ggVGhpcyBmdW5jdGlvbiBjYWNoZXMgdGhlIHJlc3BvbnNlLiBSZWZyZXNoID0gdHJ1ZSB3aWxsIGJ1c3QgdGhlIGNhY2hlLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIHRoZSBwcm92aWRlZCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBBWEMgQXNzZXRJRFxyXG4gICAqL1xyXG4gIGdldEFYQ0Fzc2V0SUQgPSBhc3luYyAocmVmcmVzaDogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTxCdWZmZXI+ID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5BWENBc3NldElEID09PSBcInVuZGVmaW5lZFwiIHx8IHJlZnJlc2gpIHtcclxuICAgICAgY29uc3QgYXNzZXQ6IEFzc2V0ID0gYXdhaXQgdGhpcy5nZXRBc3NldERlc2NyaXB0aW9uKFByaW1hcnlBc3NldEFsaWFzKVxyXG4gICAgICB0aGlzLkFYQ0Fzc2V0SUQgPSBhc3NldC5hc3NldElEXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5BWENBc3NldElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZXMgdGhlIGRlZmF1bHRzIGFuZCBzZXRzIHRoZSBjYWNoZSB0byBhIHNwZWNpZmljIEFYQyBBc3NldElEXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXhjQXNzZXRJRCBBIGNiNTggc3RyaW5nIG9yIEJ1ZmZlciByZXByZXNlbnRpbmcgdGhlIEFYQyBBc3NldElEXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgdGhlIHByb3ZpZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIEFYQyBBc3NldElEXHJcbiAgICovXHJcbiAgc2V0QVhDQXNzZXRJRCA9IChheGNBc3NldElEOiBzdHJpbmcgfCBCdWZmZXIpID0+IHtcclxuICAgIGlmICh0eXBlb2YgYXhjQXNzZXRJRCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBheGNBc3NldElEID0gYmludG9vbHMuY2I1OERlY29kZShheGNBc3NldElEKVxyXG4gICAgfVxyXG4gICAgdGhpcy5BWENBc3NldElEID0gYXhjQXNzZXRJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgZGVmYXVsdCB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgZGVmYXVsdCB0eCBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldERlZmF1bHRUeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpIGluIERlZmF1bHRzLm5ldHdvcmtcclxuICAgICAgPyBuZXcgQk4oRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiQVhcIl1bXCJ0eEZlZVwiXSlcclxuICAgICAgOiBuZXcgQk4oMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgdGhlIGFtb3VudCBvZiBbYXNzZXRJRF0gZm9yIHRoZSBnaXZlbiBhZGRyZXNzIGluIHRoZSBzdGF0ZSBvZiB0aGUgZ2l2ZW4gYmxvY2sgbnVtYmVyLlxyXG4gICAqIFwibGF0ZXN0XCIsIFwicGVuZGluZ1wiLCBhbmQgXCJhY2NlcHRlZFwiIG1ldGEgYmxvY2sgbnVtYmVycyBhcmUgYWxzbyBhbGxvd2VkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGhleEFkZHJlc3MgVGhlIGhleCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWRkcmVzc1xyXG4gICAqIEBwYXJhbSBibG9ja0hlaWdodCBUaGUgYmxvY2sgaGVpZ2h0XHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IElEXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBvYmplY3QgY29udGFpbmluZyB0aGUgYmFsYW5jZVxyXG4gICAqL1xyXG4gIGdldEFzc2V0QmFsYW5jZSA9IGFzeW5jIChcclxuICAgIGhleEFkZHJlc3M6IHN0cmluZyxcclxuICAgIGJsb2NrSGVpZ2h0OiBzdHJpbmcsXHJcbiAgICBhc3NldElEOiBzdHJpbmdcclxuICApOiBQcm9taXNlPG9iamVjdD4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBzdHJpbmdbXSA9IFtoZXhBZGRyZXNzLCBibG9ja0hlaWdodCwgYXNzZXRJRF1cclxuXHJcbiAgICBjb25zdCBtZXRob2Q6IHN0cmluZyA9IFwiZXRoX2dldEFzc2V0QmFsYW5jZVwiXHJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcImV4dC9iYy9BWC9ycGNcIlxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIG1ldGhvZCxcclxuICAgICAgcGFyYW1zLFxyXG4gICAgICBwYXRoXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdHVzIG9mIGEgcHJvdmlkZWQgYXRvbWljIHRyYW5zYWN0aW9uIElEIGJ5IGNhbGxpbmcgdGhlIG5vZGUncyBgZ2V0QXRvbWljVHhTdGF0dXNgIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB0eElEIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYW5zYWN0aW9uIElEXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgc3RhdHVzIHJldHJpZXZlZCBmcm9tIHRoZSBub2RlXHJcbiAgICovXHJcbiAgZ2V0QXRvbWljVHhTdGF0dXMgPSBhc3luYyAodHhJRDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogR2V0QXRvbWljVHhTdGF0dXNQYXJhbXMgPSB7XHJcbiAgICAgIHR4SURcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuZ2V0QXRvbWljVHhTdGF0dXNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3RhdHVzXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3RhdHVzXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHRyYW5zYWN0aW9uIGRhdGEgb2YgYSBwcm92aWRlZCB0cmFuc2FjdGlvbiBJRCBieSBjYWxsaW5nIHRoZSBub2RlJ3MgYGdldEF0b21pY1R4YCBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdHhJRCBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0cmFuc2FjdGlvbiBJRFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGJ5dGVzIHJldHJpZXZlZCBmcm9tIHRoZSBub2RlXHJcbiAgICovXHJcbiAgZ2V0QXRvbWljVHggPSBhc3luYyAodHhJRDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogR2V0QXRvbWljVHhQYXJhbXMgPSB7XHJcbiAgICAgIHR4SURcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuZ2V0QXRvbWljVHhcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHR4IGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSB0eCBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldFR4RmVlID0gKCk6IEJOID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy50eEZlZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLnR4RmVlID0gdGhpcy5nZXREZWZhdWx0VHhGZWUoKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMudHhGZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgQU5UIChBeGlhIE5hdGl2ZSBUb2tlbikgYXNzZXRzIGluY2x1ZGluZyBBWEMgZnJvbSB0aGUgQVgtQ2hhaW4gdG8gYW4gYWNjb3VudCBvbiB0aGUgU3dhcC1DaGFpbi5cclxuICAgKlxyXG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBtdXN0IGNhbGwgdGhlIFN3YXAtQ2hhaW7igJlzIGltcG9ydCBtZXRob2QgdG8gY29tcGxldGUgdGhlIHRyYW5zZmVyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIFN3YXAtQ2hhaW4gYWNjb3VudCBzcGVjaWZpZWQgaW4gYHRvYFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXJcclxuICAgKiBAcGFyYW0gdG8gVGhlIGFjY291bnQgb24gdGhlIFN3YXAtQ2hhaW4gdG8gc2VuZCB0aGUgQVhDIHRvLlxyXG4gICAqIEBwYXJhbSBhbW91bnQgQW1vdW50IG9mIGFzc2V0IHRvIGV4cG9ydCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IGlkIHdoaWNoIGlzIGJlaW5nIHNlbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRyYW5zYWN0aW9uIGlkXHJcbiAgICovXHJcbiAgZXhwb3J0ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICB0bzogc3RyaW5nLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydFBhcmFtcyA9IHtcclxuICAgICAgdG8sXHJcbiAgICAgIGFtb3VudDogYW1vdW50LnRvU3RyaW5nKDEwKSxcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBhc3NldElEXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuZXhwb3J0XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgQVhDIGZyb20gdGhlIEFYLUNoYWluIHRvIGFuIGFjY291bnQgb24gdGhlIFN3YXAtQ2hhaW4uXHJcbiAgICpcclxuICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB5b3UgbXVzdCBjYWxsIHRoZSBTd2FwLUNoYWlu4oCZcyBpbXBvcnRBWEMgbWV0aG9kIHRvIGNvbXBsZXRlIHRoZSB0cmFuc2Zlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBTd2FwLUNoYWluIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhY2NvdW50IG9uIHRoZSBTd2FwLUNoYWluIHRvIHNlbmQgdGhlIEFYQyB0by5cclxuICAgKiBAcGFyYW0gYW1vdW50IEFtb3VudCBvZiBBWEMgdG8gZXhwb3J0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRyYW5zYWN0aW9uIGlkXHJcbiAgICovXHJcbiAgZXhwb3J0QVhDID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICB0bzogc3RyaW5nLFxyXG4gICAgYW1vdW50OiBCTlxyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydEFYQ1BhcmFtcyA9IHtcclxuICAgICAgdG8sXHJcbiAgICAgIGFtb3VudDogYW1vdW50LnRvU3RyaW5nKDEwKSxcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuZXhwb3J0QVhDXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyB0aGUgVVRYT3MgcmVsYXRlZCB0byB0aGUgYWRkcmVzc2VzIHByb3ZpZGVkIGZyb20gdGhlIG5vZGUncyBgZ2V0VVRYT3NgIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhZGRyZXNzZXMgQW4gYXJyYXkgb2YgYWRkcmVzc2VzIGFzIGNiNTggc3RyaW5ncyBvciBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1zXHJcbiAgICogQHBhcmFtIHNvdXJjZUNoYWluIEEgc3RyaW5nIGZvciB0aGUgY2hhaW4gdG8gbG9vayBmb3IgdGhlIFVUWE8ncy4gRGVmYXVsdCBpcyB0byB1c2UgdGhpcyBjaGFpbiwgYnV0IGlmIGV4cG9ydGVkIFVUWE9zIGV4aXN0XHJcbiAgICogZnJvbSBvdGhlciBjaGFpbnMsIHRoaXMgY2FuIHVzZWQgdG8gcHVsbCB0aGVtIGluc3RlYWQuXHJcbiAgICogQHBhcmFtIGxpbWl0IE9wdGlvbmFsLiBSZXR1cm5zIGF0IG1vc3QgW2xpbWl0XSBhZGRyZXNzZXMuIElmIFtsaW1pdF0gPT0gMCBvciA+IFttYXhVVFhPc1RvRmV0Y2hdLCBmZXRjaGVzIHVwIHRvIFttYXhVVFhPc1RvRmV0Y2hdLlxyXG4gICAqIEBwYXJhbSBzdGFydEluZGV4IE9wdGlvbmFsLiBbU3RhcnRJbmRleF0gZGVmaW5lcyB3aGVyZSB0byBzdGFydCBmZXRjaGluZyBVVFhPcyAoZm9yIHBhZ2luYXRpb24uKVxyXG4gICAqIFVUWE9zIGZldGNoZWQgYXJlIGZyb20gYWRkcmVzc2VzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5BZGRyZXNzXVxyXG4gICAqIEZvciBhZGRyZXNzIFtTdGFydEluZGV4LkFkZHJlc3NdLCBvbmx5IFVUWE9zIHdpdGggSURzIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5VdHhvXSB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAqL1xyXG4gIGdldFVUWE9zID0gYXN5bmMgKFxyXG4gICAgYWRkcmVzc2VzOiBzdHJpbmdbXSB8IHN0cmluZyxcclxuICAgIHNvdXJjZUNoYWluOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBsaW1pdDogbnVtYmVyID0gMCxcclxuICAgIHN0YXJ0SW5kZXg6IEluZGV4ID0gdW5kZWZpbmVkXHJcbiAgKTogUHJvbWlzZTx7XHJcbiAgICBudW1GZXRjaGVkOiBudW1iZXJcclxuICAgIHV0eG9zXHJcbiAgICBlbmRJbmRleDogSW5kZXhcclxuICB9PiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGFkZHJlc3NlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBhZGRyZXNzZXMgPSBbYWRkcmVzc2VzXVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0VVRYT3NQYXJhbXMgPSB7XHJcbiAgICAgIGFkZHJlc3NlczogYWRkcmVzc2VzLFxyXG4gICAgICBsaW1pdFxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzdGFydEluZGV4ICE9PSBcInVuZGVmaW5lZFwiICYmIHN0YXJ0SW5kZXgpIHtcclxuICAgICAgcGFyYW1zLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDaGFpbiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXMuc291cmNlQ2hhaW4gPSBzb3VyY2VDaGFpblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF4Yy5nZXRVVFhPc1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIGNvbnN0IHV0eG9zOiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgY29uc3QgZGF0YTogYW55ID0gcmVzcG9uc2UuZGF0YS5yZXN1bHQudXR4b3NcclxuICAgIHV0eG9zLmFkZEFycmF5KGRhdGEsIGZhbHNlKVxyXG4gICAgcmVzcG9uc2UuZGF0YS5yZXN1bHQudXR4b3MgPSB1dHhvc1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIEFOVCAoQXhpYSBOYXRpdmUgVG9rZW4pIGFzc2V0cyBpbmNsdWRpbmcgQVhDIGZyb20gYW4gYWNjb3VudCBvbiB0aGUgU3dhcC1DaGFpbiB0byBhbiBhZGRyZXNzIG9uIHRoZSBBWC1DaGFpbi4gVGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIG11c3QgYmUgc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCB0aGF0IHRoZSBhc3NldCBpcyBzZW50IGZyb20gYW5kIHdoaWNoIHBheXNcclxuICAgKiB0aGUgdHJhbnNhY3Rpb24gZmVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIG9mIHRoZSBhY2NvdW50IHRoZSBhc3NldCBpcyBzZW50IHRvLlxyXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBUaGUgY2hhaW5JRCB3aGVyZSB0aGUgZnVuZHMgYXJlIGNvbWluZyBmcm9tLiBFeDogXCJTd2FwXCJcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgc3RyaW5nIGZvciB0aGUgdHJhbnNhY3Rpb24sIHdoaWNoIHNob3VsZCBiZSBzZW50IHRvIHRoZSBuZXR3b3JrXHJcbiAgICogYnkgY2FsbGluZyBpc3N1ZVR4LlxyXG4gICAqL1xyXG4gIGltcG9ydCA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgdG86IHN0cmluZyxcclxuICAgIHNvdXJjZUNoYWluOiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBJbXBvcnRQYXJhbXMgPSB7XHJcbiAgICAgIHRvLFxyXG4gICAgICBzb3VyY2VDaGFpbixcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuaW1wb3J0XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgQVhDIGZyb20gYW4gYWNjb3VudCBvbiB0aGUgU3dhcC1DaGFpbiB0byBhbiBhZGRyZXNzIG9uIHRoZSBBWC1DaGFpbi4gVGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIG11c3QgYmUgc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCB0aGF0IHRoZSBBWEMgaXMgc2VudCBmcm9tIGFuZCB3aGljaCBwYXlzXHJcbiAgICogdGhlIHRyYW5zYWN0aW9uIGZlZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBhY2NvdW50IHNwZWNpZmllZCBpbiBgdG9gXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSB0byBUaGUgYWRkcmVzcyBvZiB0aGUgYWNjb3VudCB0aGUgQVhDIGlzIHNlbnQgdG8uIFRoaXMgbXVzdCBiZSB0aGUgc2FtZSBhcyB0aGUgdG9cclxuICAgKiBhcmd1bWVudCBpbiB0aGUgY29ycmVzcG9uZGluZyBjYWxsIHRvIHRoZSBTd2FwLUNoYWlu4oCZcyBleHBvcnRBWENcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gVGhlIGNoYWluSUQgd2hlcmUgdGhlIGZ1bmRzIGFyZSBjb21pbmcgZnJvbS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgc3RyaW5nIGZvciB0aGUgdHJhbnNhY3Rpb24sIHdoaWNoIHNob3VsZCBiZSBzZW50IHRvIHRoZSBuZXR3b3JrXHJcbiAgICogYnkgY2FsbGluZyBpc3N1ZVR4LlxyXG4gICAqL1xyXG4gIGltcG9ydEFYQyA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgdG86IHN0cmluZyxcclxuICAgIHNvdXJjZUNoYWluOiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBJbXBvcnRBWENQYXJhbXMgPSB7XHJcbiAgICAgIHRvLFxyXG4gICAgICBzb3VyY2VDaGFpbixcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuaW1wb3J0QVhDXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdpdmUgYSB1c2VyIGNvbnRyb2wgb3ZlciBhbiBhZGRyZXNzIGJ5IHByb3ZpZGluZyB0aGUgcHJpdmF0ZSBrZXkgdGhhdCBjb250cm9scyB0aGUgYWRkcmVzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgbmFtZSBvZiB0aGUgdXNlciB0byBzdG9yZSB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHRoYXQgdW5sb2NrcyB0aGUgdXNlclxyXG4gICAqIEBwYXJhbSBwcml2YXRlS2V5IEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcHJpdmF0ZSBrZXkgaW4gdGhlIHZtXCJzIGZvcm1hdFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGFkZHJlc3MgZm9yIHRoZSBpbXBvcnRlZCBwcml2YXRlIGtleS5cclxuICAgKi9cclxuICBpbXBvcnRLZXkgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIHByaXZhdGVLZXk6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEltcG9ydEtleVBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBwcml2YXRlS2V5XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuaW1wb3J0S2V5XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3NcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC5hZGRyZXNzXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHRoZSBub2RlJ3MgaXNzdWVUeCBtZXRob2QgZnJvbSB0aGUgQVBJIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgdHJhbnNhY3Rpb24gSUQgYXMgYSBzdHJpbmcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdHggQSBzdHJpbmcsIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LCBvciBbW1R4XV0gcmVwcmVzZW50aW5nIGEgdHJhbnNhY3Rpb25cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgUHJvbWlzZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0cmFuc2FjdGlvbiBJRCBvZiB0aGUgcG9zdGVkIHRyYW5zYWN0aW9uLlxyXG4gICAqL1xyXG4gIGlzc3VlVHggPSBhc3luYyAodHg6IHN0cmluZyB8IEJ1ZmZlciB8IFR4KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGxldCBUcmFuc2FjdGlvbjogc3RyaW5nID0gXCJcIlxyXG4gICAgaWYgKHR5cGVvZiB0eCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBUcmFuc2FjdGlvbiA9IHR4XHJcbiAgICB9IGVsc2UgaWYgKHR4IGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIGNvbnN0IHR4b2JqOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4b2JqLmZyb21CdWZmZXIodHgpXHJcbiAgICAgIFRyYW5zYWN0aW9uID0gdHhvYmoudG9TdHJpbmcoKVxyXG4gICAgfSBlbHNlIGlmICh0eCBpbnN0YW5jZW9mIFR4KSB7XHJcbiAgICAgIFRyYW5zYWN0aW9uID0gdHgudG9TdHJpbmcoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IFRyYW5zYWN0aW9uRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIGF4Yy5pc3N1ZVR4OiBwcm92aWRlZCB0eCBpcyBub3QgZXhwZWN0ZWQgdHlwZSBvZiBzdHJpbmcsIEJ1ZmZlciwgb3IgVHhcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXJhbXM6IElzc3VlVHhQYXJhbXMgPSB7XHJcbiAgICAgIHR4OiBUcmFuc2FjdGlvbi50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuaXNzdWVUeFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHBvcnRzIHRoZSBwcml2YXRlIGtleSBmb3IgYW4gYWRkcmVzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgbmFtZSBvZiB0aGUgdXNlciB3aXRoIHRoZSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgdXNlZCB0byBkZWNyeXB0IHRoZSBwcml2YXRlIGtleVxyXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBhZGRyZXNzIHdob3NlIHByaXZhdGUga2V5IHNob3VsZCBiZSBleHBvcnRlZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSB3aXRoIHRoZSBkZWNyeXB0ZWQgcHJpdmF0ZSBrZXkgYW5kIHByaXZhdGUga2V5IGhleCBhcyBzdG9yZSBpbiB0aGUgZGF0YWJhc2VcclxuICAgKi9cclxuICBleHBvcnRLZXkgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIGFkZHJlc3M6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8b2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydEtleVBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBhZGRyZXNzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJheGMuZXhwb3J0S2V5XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhbiB1bnNpZ25lZCBJbXBvcnQgVHguIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXR4b3NldCBBIHNldCBvZiBVVFhPcyB0aGF0IHRoZSB0cmFuc2FjdGlvbiBpcyBidWlsdCBvblxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3MgVGhlIGFkZHJlc3MgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gb3duZXJBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIGltcG9ydFxyXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBUaGUgY2hhaW5pZCBmb3Igd2hlcmUgdGhlIGltcG9ydCBpcyBjb21pbmcgZnJvbVxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBmdW5kcyBmcm9tIHRoZSBVVFhPcyBwcm92aWRlZFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gKFtbVW5zaWduZWRUeF1dKSB3aGljaCBjb250YWlucyBhIFtbSW1wb3J0VHhdXS5cclxuICAgKlxyXG4gICAqIEByZW1hcmtzXHJcbiAgICogVGhpcyBoZWxwZXIgZXhpc3RzIGJlY2F1c2UgdGhlIGVuZHBvaW50IEFQSSBzaG91bGQgYmUgdGhlIHByaW1hcnkgcG9pbnQgb2YgZW50cnkgZm9yIG1vc3QgZnVuY3Rpb25hbGl0eS5cclxuICAgKi9cclxuICBidWlsZEltcG9ydFR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIHRvQWRkcmVzczogc3RyaW5nLFxyXG4gICAgb3duZXJBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgc291cmNlQ2hhaW46IEJ1ZmZlciB8IHN0cmluZyxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgZmVlOiBCTiA9IG5ldyBCTigwKVxyXG4gICk6IFByb21pc2U8VW5zaWduZWRUeD4gPT4ge1xyXG4gICAgY29uc3QgZnJvbTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEltcG9ydFR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgbGV0IHNyYXhDaGFpbjogc3RyaW5nID0gdW5kZWZpbmVkXHJcblxyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDaGFpbiA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAvLyBpZiB0aGVyZSBpcyBhIHNvdXJjZUNoYWluIHBhc3NlZCBpbiBhbmQgaXQncyBhIHN0cmluZyB0aGVuIHNhdmUgdGhlIHN0cmluZyB2YWx1ZSBhbmQgY2FzdCB0aGUgb3JpZ2luYWxcclxuICAgICAgLy8gdmFyaWFibGUgZnJvbSBhIHN0cmluZyB0byBhIEJ1ZmZlclxyXG4gICAgICBzcmF4Q2hhaW4gPSBzb3VyY2VDaGFpblxyXG4gICAgICBzb3VyY2VDaGFpbiA9IGJpbnRvb2xzLmNiNThEZWNvZGUoc291cmNlQ2hhaW4pXHJcbiAgICB9IGVsc2UgaWYgKFxyXG4gICAgICB0eXBlb2Ygc291cmNlQ2hhaW4gPT09IFwidW5kZWZpbmVkXCIgfHxcclxuICAgICAgIShzb3VyY2VDaGFpbiBpbnN0YW5jZW9mIEJ1ZmZlcilcclxuICAgICkge1xyXG4gICAgICAvLyBpZiB0aGVyZSBpcyBubyBzb3VyY2VDaGFpbiBwYXNzZWQgaW4gb3IgdGhlIHNvdXJjZUNoYWluIGlzIGFueSBkYXRhIHR5cGUgb3RoZXIgdGhhbiBhIEJ1ZmZlciB0aGVuIHRocm93IGFuIGVycm9yXHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEVWTUFQSS5idWlsZEltcG9ydFR4OiBzb3VyY2VDaGFpbiBpcyB1bmRlZmluZWQgb3IgaW52YWxpZCBzb3VyY2VDaGFpbiB0eXBlLlwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IHV0eG9SZXNwb25zZTogVVRYT1Jlc3BvbnNlID0gYXdhaXQgdGhpcy5nZXRVVFhPcyhcclxuICAgICAgb3duZXJBZGRyZXNzZXMsXHJcbiAgICAgIHNyYXhDaGFpbixcclxuICAgICAgMCxcclxuICAgICAgdW5kZWZpbmVkXHJcbiAgICApXHJcbiAgICBjb25zdCBhdG9taWNVVFhPczogVVRYT1NldCA9IHV0eG9SZXNwb25zZS51dHhvc1xyXG4gICAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGNvbnN0IGF4Y0Fzc2V0SUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0d29ya0lEfWBdLlN3YXAuYXhjQXNzZXRJRFxyXG4gICAgY29uc3QgYXhjQXNzZXRJREJ1ZjogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShheGNBc3NldElEKVxyXG4gICAgY29uc3QgYXRvbWljczogVVRYT1tdID0gYXRvbWljVVRYT3MuZ2V0QWxsVVRYT3MoKVxyXG5cclxuICAgIGlmIChhdG9taWNzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBuZXcgTm9BdG9taWNVVFhPc0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBFVk1BUEkuYnVpbGRJbXBvcnRUeDogbm8gYXRvbWljIHV0eG9zIHRvIGltcG9ydFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBidWlsdFVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSB1dHhvc2V0LmJ1aWxkSW1wb3J0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRCksXHJcbiAgICAgIHRvQWRkcmVzcyxcclxuICAgICAgYXRvbWljcyxcclxuICAgICAgc291cmNlQ2hhaW4sXHJcbiAgICAgIGZlZSxcclxuICAgICAgYXhjQXNzZXRJREJ1ZlxyXG4gICAgKVxyXG5cclxuICAgIHJldHVybiBidWlsdFVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFuIHVuc2lnbmVkIEV4cG9ydCBUeC4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbW91bnQgVGhlIGFtb3VudCBiZWluZyBleHBvcnRlZCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IGlkIHdoaWNoIGlzIGJlaW5nIHNlbnRcclxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25DaGFpbiBUaGUgY2hhaW5pZCBmb3Igd2hlcmUgdGhlIGFzc2V0cyB3aWxsIGJlIHNlbnQuXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3MgcHJvdmlkZWRcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3NcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHRocmVzaG9sZCBPcHRpb25hbC4gVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIHNwZW5kIHRoZSBmdW5kcyBpbiB0aGUgcmVzdWx0YW50IFVUWE9cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYW4gW1tFeHBvcnRUeF1dLlxyXG4gICAqL1xyXG4gIGJ1aWxkRXhwb3J0VHggPSBhc3luYyAoXHJcbiAgICBhbW91bnQ6IEJOLFxyXG4gICAgYXNzZXRJRDogQnVmZmVyIHwgc3RyaW5nLFxyXG4gICAgZGVzdGluYXRpb25DaGFpbjogQnVmZmVyIHwgc3RyaW5nLFxyXG4gICAgZnJvbUFkZHJlc3NIZXg6IHN0cmluZyxcclxuICAgIGZyb21BZGRyZXNzQmVjaDogc3RyaW5nLFxyXG4gICAgdG9BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgbm9uY2U6IG51bWJlciA9IDAsXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDEsXHJcbiAgICBmZWU6IEJOID0gbmV3IEJOKDApXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCBwcmVmaXhlczogb2JqZWN0ID0ge31cclxuICAgIHRvQWRkcmVzc2VzLm1hcCgoYWRkcmVzczogc3RyaW5nKSA9PiB7XHJcbiAgICAgIHByZWZpeGVzW2FkZHJlc3Muc3BsaXQoXCItXCIpWzBdXSA9IHRydWVcclxuICAgIH0pXHJcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlZml4ZXMpLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBFVk1BUEkuYnVpbGRFeHBvcnRUeDogVG8gYWRkcmVzc2VzIG11c3QgaGF2ZSB0aGUgc2FtZSBjaGFpbklEIHByZWZpeC5cIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEVWTUFQSS5idWlsZEV4cG9ydFR4OiBEZXN0aW5hdGlvbiBDaGFpbklEIGlzIHVuZGVmaW5lZC5cIlxyXG4gICAgICApXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKGRlc3RpbmF0aW9uQ2hhaW4pXHJcbiAgICB9IGVsc2UgaWYgKCEoZGVzdGluYXRpb25DaGFpbiBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcclxuICAgICAgdGhyb3cgbmV3IENoYWluSWRFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gRVZNQVBJLmJ1aWxkRXhwb3J0VHg6IEludmFsaWQgZGVzdGluYXRpb25DaGFpbiB0eXBlXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgaWYgKGRlc3RpbmF0aW9uQ2hhaW4ubGVuZ3RoICE9PSAzMikge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBFVk1BUEkuYnVpbGRFeHBvcnRUeDogRGVzdGluYXRpb24gQ2hhaW5JRCBtdXN0IGJlIDMyIGJ5dGVzIGluIGxlbmd0aC5cIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBjb25zdCBhc3NldERlc2NyaXB0aW9uOiBhbnkgPSBhd2FpdCB0aGlzLmdldEFzc2V0RGVzY3JpcHRpb24oXCJBWENcIilcclxuICAgIGxldCBldm1JbnB1dHM6IEVWTUlucHV0W10gPSBbXVxyXG4gICAgaWYgKGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXREZXNjcmlwdGlvbi5hc3NldElEKSA9PT0gYXNzZXRJRCkge1xyXG4gICAgICBjb25zdCBldm1JbnB1dDogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoXHJcbiAgICAgICAgZnJvbUFkZHJlc3NIZXgsXHJcbiAgICAgICAgYW1vdW50LmFkZChmZWUpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbm9uY2VcclxuICAgICAgKVxyXG4gICAgICBldm1JbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGZyb21BZGRyZXNzQmVjaCkpXHJcbiAgICAgIGV2bUlucHV0cy5wdXNoKGV2bUlucHV0KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaWYgYXNzZXQgaWQgaXNuJ3QgQVhDIGFzc2V0IGlkIHRoZW4gY3JlYXRlIDIgaW5wdXRzXHJcbiAgICAgIC8vIGZpcnN0IGlucHV0IHdpbGwgYmUgQVhDIGFuZCB3aWxsIGJlIGZvciB0aGUgYW1vdW50IG9mIHRoZSBmZWVcclxuICAgICAgLy8gc2Vjb25kIGlucHV0IHdpbGwgYmUgdGhlIEFOVFxyXG4gICAgICBjb25zdCBldm1BWENJbnB1dDogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoXHJcbiAgICAgICAgZnJvbUFkZHJlc3NIZXgsXHJcbiAgICAgICAgZmVlLFxyXG4gICAgICAgIGFzc2V0RGVzY3JpcHRpb24uYXNzZXRJRCxcclxuICAgICAgICBub25jZVxyXG4gICAgICApXHJcbiAgICAgIGV2bUFYQ0lucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoZnJvbUFkZHJlc3NCZWNoKSlcclxuICAgICAgZXZtSW5wdXRzLnB1c2goZXZtQVhDSW5wdXQpXHJcblxyXG4gICAgICBjb25zdCBldm1BTlRJbnB1dDogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoXHJcbiAgICAgICAgZnJvbUFkZHJlc3NIZXgsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbm9uY2VcclxuICAgICAgKVxyXG4gICAgICBldm1BTlRJbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGZyb21BZGRyZXNzQmVjaCkpXHJcbiAgICAgIGV2bUlucHV0cy5wdXNoKGV2bUFOVElucHV0KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvOiBCdWZmZXJbXSA9IFtdXHJcbiAgICB0b0FkZHJlc3Nlcy5tYXAoKGFkZHJlc3M6IHN0cmluZyk6IHZvaWQgPT4ge1xyXG4gICAgICB0by5wdXNoKGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhZGRyZXNzKSlcclxuICAgIH0pXHJcblxyXG4gICAgbGV0IGV4cG9ydGVkT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICBhbW91bnQsXHJcbiAgICAgIHRvLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXHJcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXNzZXRJRCksXHJcbiAgICAgIHNlY3BUcmFuc2Zlck91dHB1dFxyXG4gICAgKVxyXG4gICAgZXhwb3J0ZWRPdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxyXG5cclxuICAgIC8vIGxleGljb2dyYXBoaWNhbGx5IHNvcnQgaW5zIGFuZCBvdXRzXHJcbiAgICBldm1JbnB1dHMgPSBldm1JbnB1dHMuc29ydChFVk1JbnB1dC5jb21wYXJhdG9yKCkpXHJcbiAgICBleHBvcnRlZE91dHMgPSBleHBvcnRlZE91dHMuc29ydChUcmFuc2ZlcmFibGVPdXRwdXQuY29tcGFyYXRvcigpKVxyXG5cclxuICAgIGNvbnN0IGV4cG9ydFR4OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeChcclxuICAgICAgdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKHRoaXMuYmxvY2tjaGFpbklEKSxcclxuICAgICAgZGVzdGluYXRpb25DaGFpbixcclxuICAgICAgZXZtSW5wdXRzLFxyXG4gICAgICBleHBvcnRlZE91dHNcclxuICAgIClcclxuXHJcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoZXhwb3J0VHgpXHJcbiAgICByZXR1cm4gdW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyBhIHJlZmVyZW5jZSB0byB0aGUga2V5Y2hhaW4gZm9yIHRoaXMgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgaW5zdGFuY2Ugb2YgW1tLZXlDaGFpbl1dIGZvciB0aGlzIGNsYXNzXHJcbiAgICovXHJcbiAga2V5Q2hhaW4gPSAoKTogS2V5Q2hhaW4gPT4gdGhpcy5rZXljaGFpblxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIG5ldyBpbnN0YW5jZSBvZiBbW0tleUNoYWluXV1cclxuICAgKi9cclxuICBuZXdLZXlDaGFpbiA9ICgpOiBLZXlDaGFpbiA9PiB7XHJcbiAgICAvLyB3YXJuaW5nLCBvdmVyd3JpdGVzIHRoZSBvbGQga2V5Y2hhaW5cclxuICAgIGNvbnN0IGFsaWFzID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgaWYgKGFsaWFzKSB7XHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBhbGlhcylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCB0aGlzLmJsb2NrY2hhaW5JRClcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmtleWNoYWluXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAaWdub3JlXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIF9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgIGFkZHJlc3Nlczogc3RyaW5nW10gfCBCdWZmZXJbXSxcclxuICAgIGNhbGxlcjogc3RyaW5nXHJcbiAgKTogc3RyaW5nW10ge1xyXG4gICAgY29uc3QgYWRkcnM6IHN0cmluZ1tdID0gW11cclxuICAgIGNvbnN0IGNoYWluaWQ6IHN0cmluZyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgICAgPyB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXHJcbiAgICAgIDogdGhpcy5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgaWYgKGFkZHJlc3NlcyAmJiBhZGRyZXNzZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBhZGRyZXNzZXMuZm9yRWFjaCgoYWRkcmVzczogc3RyaW5nIHwgQnVmZmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhZGRyZXNzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3MgYXMgc3RyaW5nKSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiRXJyb3IgLSBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhZGRycy5wdXNoKGFkZHJlc3MgYXMgc3RyaW5nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcclxuICAgICAgICAgIGFkZHJzLnB1c2goXHJcbiAgICAgICAgICAgIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKFxyXG4gICAgICAgICAgICAgIGFkZHJlc3MgYXMgQnVmZmVyLFxyXG4gICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgdGhpcy5jb3JlLmdldEhSUCgpLFxyXG4gICAgICAgICAgICAgIGNoYWluaWRcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiBhZGRyc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cclxuICAgKiBJbnN0ZWFkIHVzZSB0aGUgW1tBeGlhLmFkZEFQSV1dIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb3JlIEEgcmVmZXJlbmNlIHRvIHRoZSBBeGlhIGNsYXNzXHJcbiAgICogQHBhcmFtIGJhc2VVUkwgRGVmYXVsdHMgdG8gdGhlIHN0cmluZyBcIi9leHQvYmMvQVgvYXhjXCIgYXMgdGhlIHBhdGggdG8gYmxvY2tjaGFpbidzIGJhc2VVUkxcclxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIFRoZSBCbG9ja2NoYWluJ3MgSUQuIERlZmF1bHRzIHRvIGFuIGVtcHR5IHN0cmluZzogXCJcIlxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29yZTogQXhpYUNvcmUsXHJcbiAgICBiYXNlVVJMOiBzdHJpbmcgPSBcIi9leHQvYmMvQVgvYXhjXCIsXHJcbiAgICBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiXCJcclxuICApIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxyXG4gICAgY29uc3QgbmV0SUQ6IG51bWJlciA9IGNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGlmIChcclxuICAgICAgbmV0SUQgaW4gRGVmYXVsdHMubmV0d29yayAmJlxyXG4gICAgICBibG9ja2NoYWluSUQgaW4gRGVmYXVsdHMubmV0d29ya1tgJHtuZXRJRH1gXVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IHsgYWxpYXMgfSA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0SUR9YF1bYCR7YmxvY2tjaGFpbklEfWBdXHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBhbGlhcylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBibG9ja2NoYWluSUQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGJhc2UgZmVlIGZvciB0aGUgbmV4dCBibG9jay5cclxuICAgKi9cclxuICBnZXRCYXNlRmVlID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IHN0cmluZ1tdID0gW11cclxuICAgIGNvbnN0IG1ldGhvZDogc3RyaW5nID0gXCJldGhfYmFzZUZlZVwiXHJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcImV4dC9iYy9BWC9ycGNcIlxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIG1ldGhvZCxcclxuICAgICAgcGFyYW1zLFxyXG4gICAgICBwYXRoXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJldHVybnMgdGhlIHByaW9yaXR5IGZlZSBuZWVkZWQgdG8gYmUgaW5jbHVkZWQgaW4gYSBibG9jay5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSBwcmlvcml0eSBmZWUgbmVlZGVkIHRvIGJlIGluY2x1ZGVkIGluIGEgYmxvY2suXHJcbiAgICovXHJcbiAgZ2V0TWF4UHJpb3JpdHlGZWVQZXJHYXMgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogc3RyaW5nW10gPSBbXVxyXG5cclxuICAgIGNvbnN0IG1ldGhvZDogc3RyaW5nID0gXCJldGhfbWF4UHJpb3JpdHlGZWVQZXJHYXNcIlxyXG4gICAgY29uc3QgcGF0aDogc3RyaW5nID0gXCJleHQvYmMvQVgvcnBjXCJcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBtZXRob2QsXHJcbiAgICAgIHBhcmFtcyxcclxuICAgICAgcGF0aFxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG59XHJcbiJdfQ==