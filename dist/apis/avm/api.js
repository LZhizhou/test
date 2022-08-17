"use strict";
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
exports.AVMAPI = void 0;
/**
 * @packageDocumentation
 * @module API-AVM
 */
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const utxos_1 = require("./utxos");
const constants_1 = require("./constants");
const keychain_1 = require("./keychain");
const tx_1 = require("./tx");
const payload_1 = require("../../utils/payload");
const helperfunctions_1 = require("../../utils/helperfunctions");
const jrpcapi_1 = require("../../common/jrpcapi");
const constants_2 = require("../../utils/constants");
const output_1 = require("../../common/output");
const errors_1 = require("../../utils/errors");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node endpoint that is using the AVM.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class AVMAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAP`${I}`]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/bc/Swap" as the path to blockchain's baseURL
     * @param blockchainID The Blockchain"s ID. Defaults to an empty string: ""
     */
    constructor(core, baseURL = "/ext/bc/Swap", blockchainID = "") {
        super(core, baseURL);
        /**
         * @ignore
         */
        this.keychain = new keychain_1.KeyChain("", "");
        this.blockchainID = "";
        this.blockchainAlias = undefined;
        this.AXCAssetID = undefined;
        this.txFee = undefined;
        this.creationTxFee = undefined;
        this.mintTxFee = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        this.getBlockchainAlias = () => {
            if (typeof this.blockchainAlias === "undefined") {
                const netid = this.core.getNetworkID();
                if (netid in constants_2.Defaults.network &&
                    this.blockchainID in constants_2.Defaults.network[`${netid}`]) {
                    this.blockchainAlias =
                        constants_2.Defaults.network[`${netid}`][this.blockchainID].alias;
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
         * @returns The blockchainID
         */
        this.refreshBlockchainID = (blockchainID = undefined) => {
            const netid = this.core.getNetworkID();
            if (typeof blockchainID === "undefined" &&
                typeof constants_2.Defaults.network[`${netid}`] !== "undefined") {
                this.blockchainID = constants_2.Defaults.network[`${netid}`].Swap.blockchainID; //default to Swap-Chain
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
            return bintools.parseAddress(addr, blockchainID, alias, constants_1.AVMConstants.ADDRESSLENGTH);
        };
        this.addressFromBuffer = (address) => {
            const chainID = this.getBlockchainAlias()
                ? this.getBlockchainAlias()
                : this.getBlockchainID();
            const type = "bech32";
            const hrp = this.core.getHRP();
            return serialization.bufferToType(address, type, hrp, chainID);
        };
        /**
         * Fetches the AXC AssetID and returns it in a Promise.
         *
         * @param refresh This function caches the response. Refresh = true will bust the cache.
         *
         * @returns The the provided string representing the AXC AssetID
         */
        this.getAXCAssetID = (refresh = false) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.AXCAssetID === "undefined" || refresh) {
                const asset = yield this.getAssetDescription(constants_2.PrimaryAssetAlias);
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
            return this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[this.core.getNetworkID()]["Swap"]["txFee"])
                : new bn_js_1.default(0);
        };
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
         * Sets the tx fee for this chain.
         *
         * @param fee The tx fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        this.setTxFee = (fee) => {
            this.txFee = fee;
        };
        /**
         * Gets the default creation fee for this chain.
         *
         * @returns The default creation fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getDefaultCreationTxFee = () => {
            return this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[this.core.getNetworkID()]["Swap"]["creationTxFee"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the default mint fee for this chain.
         *
         * @returns The default mint fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getDefaultMintTxFee = () => {
            return this.core.getNetworkID() in constants_2.Defaults.network
                ? new bn_js_1.default(constants_2.Defaults.network[this.core.getNetworkID()]["Swap"]["mintTxFee"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the mint fee for this chain.
         *
         * @returns The mint fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getMintTxFee = () => {
            if (typeof this.mintTxFee === "undefined") {
                this.mintTxFee = this.getDefaultMintTxFee();
            }
            return this.mintTxFee;
        };
        /**
         * Gets the creation fee for this chain.
         *
         * @returns The creation fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getCreationTxFee = () => {
            if (typeof this.creationTxFee === "undefined") {
                this.creationTxFee = this.getDefaultCreationTxFee();
            }
            return this.creationTxFee;
        };
        /**
         * Sets the mint fee for this chain.
         *
         * @param fee The mint fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        this.setMintTxFee = (fee) => {
            this.mintTxFee = fee;
        };
        /**
         * Sets the creation fee for this chain.
         *
         * @param fee The creation fee amount to set as {@link https://github.com/indutny/bn.js/|BN}
         */
        this.setCreationTxFee = (fee) => {
            this.creationTxFee = fee;
        };
        /**
         * Gets a reference to the keychain for this class.
         *
         * @returns The instance of [[KeyChain]] for this class
         */
        this.keyChain = () => this.keychain;
        /**
         * @ignore
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
         * Helper function which determines if a tx is a goose egg transaction.
         *
         * @param utx An UnsignedTx
         *
         * @returns boolean true if passes goose egg test and false if fails.
         *
         * @remarks
         * A "Goose Egg Transaction" is when the fee far exceeds a reasonable amount
         */
        this.checkGooseEgg = (utx, outTotal = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const axcAssetID = yield this.getAXCAssetID();
            const outputTotal = outTotal.gt(new bn_js_1.default(0))
                ? outTotal
                : utx.getOutputTotal(axcAssetID);
            const fee = utx.getBurn(axcAssetID);
            if (fee.lte(constants_2.ONEAXC.mul(new bn_js_1.default(10))) || fee.lte(outputTotal)) {
                return true;
            }
            else {
                return false;
            }
        });
        /**
         * Gets the balance of a particular asset on a blockchain.
         *
         * @param address The address to pull the asset balance from
         * @param assetID The assetID to pull the balance from
         * @param includePartial If includePartial=false, returns only the balance held solely
         *
         * @returns Promise with the balance of the assetID as a {@link https://github.com/indutny/bn.js/|BN} on the provided address for the blockchain.
         */
        this.getBalance = (address, assetID, includePartial = false) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.parseAddress(address) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.getBalance: Invalid address format");
            }
            const params = {
                address,
                assetID,
                includePartial
            };
            const response = yield this.callMethod("avm.getBalance", params);
            return response.data.result;
        });
        /**
         * Creates an address (and associated private keys) on a user on a blockchain.
         *
         * @param username Name of the user to create the address under
         * @param password Password to unlock the user and encrypt the private key
         *
         * @returns Promise for a string representing the address created by the vm.
         */
        this.createAddress = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("avm.createAddress", params);
            return response.data.result.address;
        });
        /**
         * Create a new fixed-cap, fungible asset. A quantity of it is created at initialization and there no more is ever created.
         *
         * @param username The user paying the transaction fee (in $AXC) for asset creation
         * @param password The password for the user paying the transaction fee (in $AXC) for asset creation
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset. Between 0 and 4 characters
         * @param denomination Optional. Determines how balances of this asset are displayed by user interfaces. Default is 0
         * @param initialHolders An array of objects containing the field "address" and "amount" to establish the genesis values for the new asset
         *
         * ```js
         * Example initialHolders:
         * [
         *   {
         *     "address": "Swap-axc1kj06lhgx84h39snsljcey3tpc046ze68mek3g5",
         *     "amount": 10000
         *   },
         *   {
         *     "address": "Swap-axc1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr",
         *     "amount": 50000
         *   }
         * ]
         * ```
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        this.createFixedCapAsset = (username, password, name, symbol, denomination, initialHolders) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                name,
                symbol,
                denomination,
                username,
                password,
                initialHolders
            };
            const response = yield this.callMethod("avm.createFixedCapAsset", params);
            return response.data.result.assetID;
        });
        /**
         * Create a new variable-cap, fungible asset. No units of the asset exist at initialization. Minters can mint units of this asset using createMintTx, signMintTx and sendMintTx.
         *
         * @param username The user paying the transaction fee (in $AXC) for asset creation
         * @param password The password for the user paying the transaction fee (in $AXC) for asset creation
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset -- between 0 and 4 characters
         * @param denomination Optional. Determines how balances of this asset are displayed by user interfaces. Default is 0
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         *
         * ```js
         * Example minterSets:
         * [
         *    {
         *      "minters":[
         *        "Swap-axc1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr"
         *      ],
         *      "threshold": 1
         *     },
         *     {
         *      "minters": [
         *        "Swap-axc1am4w6hfrvmh3akduzkjthrtgtqafalce6an8cr",
         *        "Swap-axc1kj06lhgx84h39snsljcey3tpc046ze68mek3g5",
         *        "Swap-axc1yell3e4nln0m39cfpdhgqprsd87jkh4qnakklx"
         *      ],
         *      "threshold": 2
         *     }
         * ]
         * ```
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        this.createVariableCapAsset = (username, password, name, symbol, denomination, minterSets) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                name,
                symbol,
                denomination,
                username,
                password,
                minterSets
            };
            const response = yield this.callMethod("avm.createVariableCapAsset", params);
            return response.data.result.assetID;
        });
        /**
         * Creates a family of NFT Asset. No units of the asset exist at initialization. Minters can mint units of this asset using createMintTx, signMintTx and sendMintTx.
         *
         * @param username The user paying the transaction fee (in $AXC) for asset creation
         * @param password The password for the user paying the transaction fee (in $AXC) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param name The human-readable name for the asset
         * @param symbol Optional. The shorthand symbol for the asset -- between 0 and 4 characters
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         *
         * @returns Returns a Promise string containing the base 58 string representation of the ID of the newly created asset.
         */
        this.createNFTAsset = (username, password, from = undefined, changeAddr, name, symbol, minterSet) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                name,
                symbol,
                minterSet
            };
            const caller = "createNFTAsset";
            from = this._cleanAddressArray(from, caller);
            if (typeof from !== "undefined") {
                params["from"] = from;
            }
            if (typeof changeAddr !== "undefined") {
                if (typeof this.parseAddress(changeAddr) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.createNFTAsset: Invalid address format");
                }
                params["changeAddr"] = changeAddr;
            }
            const response = yield this.callMethod("avm.createNFTAsset", params);
            return response.data.result.assetID;
        });
        /**
         * Create an unsigned transaction to mint more of an asset.
         *
         * @param amount The units of the asset to mint
         * @param assetID The ID of the asset to mint
         * @param to The address to assign the units of the minted asset
         * @param minters Addresses of the minters responsible for signing the transaction
         *
         * @returns Returns a Promise string containing the base 58 string representation of the unsigned transaction.
         */
        this.mint = (username, password, amount, assetID, to, minters) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            let amnt;
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            if (typeof amount === "number") {
                amnt = new bn_js_1.default(amount);
            }
            else {
                amnt = amount;
            }
            const params = {
                username: username,
                password: password,
                amount: amnt,
                assetID: asset,
                to,
                minters
            };
            const response = yield this.callMethod("avm.mint", params);
            return response.data.result.txID;
        });
        /**
         * Mint non-fungible tokens which were created with AVMAPI.createNFTAsset
         *
         * @param username The user paying the transaction fee (in $AXC) for asset creation
         * @param password The password for the user paying the transaction fee (in $AXC) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param assetID The asset id which is being sent
         * @param to Address on Swap-Chain of the account to which this NFT is being sent
         * @param encoding Optional.  is the encoding format to use for the payload argument. Can be either "cb58" or "hex". Defaults to "hex".
         *
         * @returns ID of the transaction
         */
        this.mintNFT = (username, password, from = undefined, changeAddr = undefined, payload, assetID, to, encoding = "hex") => __awaiter(this, void 0, void 0, function* () {
            let asset;
            if (typeof this.parseAddress(to) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.mintNFT: Invalid address format");
            }
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            const params = {
                username,
                password,
                assetID: asset,
                payload,
                to,
                encoding
            };
            const caller = "mintNFT";
            from = this._cleanAddressArray(from, caller);
            if (typeof from !== "undefined") {
                params["from"] = from;
            }
            if (typeof changeAddr !== "undefined") {
                if (typeof this.parseAddress(changeAddr) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.mintNFT: Invalid address format");
                }
                params["changeAddr"] = changeAddr;
            }
            const response = yield this.callMethod("avm.mintNFT", params);
            return response.data.result.txID;
        });
        /**
         * Send NFT from one account to another on Swap-Chain
         *
         * @param username The user paying the transaction fee (in $AXC) for asset creation
         * @param password The password for the user paying the transaction fee (in $AXC) for asset creation
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param assetID The asset id which is being sent
         * @param groupID The group this NFT is issued to.
         * @param to Address on Swap-Chain of the account to which this NFT is being sent
         *
         * @returns ID of the transaction
         */
        this.sendNFT = (username, password, from = undefined, changeAddr = undefined, assetID, groupID, to) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            if (typeof this.parseAddress(to) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.sendNFT: Invalid address format");
            }
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            const params = {
                username,
                password,
                assetID: asset,
                groupID,
                to
            };
            const caller = "sendNFT";
            from = this._cleanAddressArray(from, caller);
            if (typeof from !== "undefined") {
                params["from"] = from;
            }
            if (typeof changeAddr !== "undefined") {
                if (typeof this.parseAddress(changeAddr) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.sendNFT: Invalid address format");
                }
                params["changeAddr"] = changeAddr;
            }
            const response = yield this.callMethod("avm.sendNFT", params);
            return response.data.result.txID;
        });
        /**
         * Exports the private key for an address.
         *
         * @param username The name of the user with the private key
         * @param password The password used to decrypt the private key
         * @param address The address whose private key should be exported
         *
         * @returns Promise with the decrypted private key as store in the database
         */
        this.exportKey = (username, password, address) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.parseAddress(address) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.exportKey: Invalid address format");
            }
            const params = {
                username,
                password,
                address
            };
            const response = yield this.callMethod("avm.exportKey", params);
            return response.data.result.privateKey;
        });
        /**
         * Imports a private key into the node's keystore under an user and for a blockchain.
         *
         * @param username The name of the user to store the private key
         * @param password The password that unlocks the user
         * @param privateKey A string representing the private key in the vm's format
         *
         * @returns The address for the imported private key.
         */
        this.importKey = (username, password, privateKey) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                privateKey
            };
            const response = yield this.callMethod("avm.importKey", params);
            return response.data.result.address;
        });
        /**
         * Send ANT (Axia Native Token) assets including AXC from the Swap-Chain to an account on the Core-Chain or AX-Chain.
         *
         * After calling this method, you must call the Core-Chain's `import` or the AX-Chain’s `import` method to complete the transfer.
         *
         * @param username The Keystore user that controls the Core-Chain or AX-Chain account specified in `to`
         * @param password The password of the Keystore user
         * @param to The account on the Core-Chain or AX-Chain to send the asset to.
         * @param amount Amount of asset to export as a {@link https://github.com/indutny/bn.js/|BN}
         * @param assetID The asset id which is being sent
         *
         * @returns String representing the transaction id
         */
        this.export = (username, password, to, amount, assetID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                to,
                amount: amount,
                assetID
            };
            const response = yield this.callMethod("avm.export", params);
            return response.data.result.txID;
        });
        /**
         * Send ANT (Axia Native Token) assets including AXC from an account on the Core-Chain or AX-Chain to an address on the Swap-Chain. This transaction
         * must be signed with the key of the account that the asset is sent from and which pays
         * the transaction fee.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address of the account the asset is sent to.
         * @param sourceChain The chainID where the funds are coming from. Ex: "AX"
         *
         * @returns Promise for a string for the transaction, which should be sent to the network
         * by calling issueTx.
         */
        this.import = (username, password, to, sourceChain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                to,
                sourceChain
            };
            const response = yield this.callMethod("avm.import", params);
            return response.data.result.txID;
        });
        /**
         * Lists all the addresses under a user.
         *
         * @param username The user to list addresses
         * @param password The password of the user to list the addresses
         *
         * @returns Promise of an array of address strings in the format specified by the blockchain.
         */
        this.listAddresses = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("avm.listAddresses", params);
            return response.data.result.addresses;
        });
        /**
         * Retrieves all assets for an address on a server and their associated balances.
         *
         * @param address The address to get a list of assets
         *
         * @returns Promise of an object mapping assetID strings with {@link https://github.com/indutny/bn.js/|BN} balance for the address on the blockchain.
         */
        this.getAllBalances = (address) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.parseAddress(address) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.getAllBalances: Invalid address format");
            }
            const params = {
                address
            };
            const response = yield this.callMethod("avm.getAllBalances", params);
            return response.data.result.balances;
        });
        /**
         * Retrieves an assets name and symbol.
         *
         * @param assetID Either a {@link https://github.com/feross/buffer|Buffer} or an b58 serialized string for the AssetID or its alias.
         *
         * @returns Returns a Promise object with keys "name" and "symbol".
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
            const response = yield this.callMethod("avm.getAssetDescription", params);
            return {
                name: response.data.result.name,
                symbol: response.data.result.symbol,
                assetID: bintools.cb58Decode(response.data.result.assetID),
                denomination: parseInt(response.data.result.denomination, 10)
            };
        });
        /**
         * Returns the transaction data of a provided transaction ID by calling the node's `getTx` method.
         *
         * @param txID The string representation of the transaction ID
         * @param encoding sets the format of the returned transaction. Can be, "cb58", "hex" or "json". Defaults to "cb58".
         *
         * @returns Returns a Promise string or object containing the bytes retrieved from the node
         */
        this.getTx = (txID, encoding = "cb58") => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID,
                encoding
            };
            const response = yield this.callMethod("avm.getTx", params);
            return response.data.result.tx;
        });
        /**
         * Returns the status of a provided transaction ID by calling the node's `getTxStatus` method.
         *
         * @param txID The string representation of the transaction ID
         *
         * @returns Returns a Promise string containing the status retrieved from the node
         */
        this.getTxStatus = (txID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID
            };
            const response = yield this.callMethod("avm.getTxStatus", params);
            return response.data.result.status;
        });
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO's. Default is to use this chain, but if exported UTXOs exist from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         * @param persistOpts Options available to persist these UTXOs in local storage
         *
         * @remarks
         * persistOpts is optional and must be of type [[PersistanceOptions]]
         *
         */
        this.getUTXOs = (addresses, sourceChain = undefined, limit = 0, startIndex = undefined, persistOpts = undefined) => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield this.callMethod("avm.getUTXOs", params);
            const utxos = new utxos_1.UTXOSet();
            let data = response.data.result.utxos;
            if (persistOpts && typeof persistOpts === "object") {
                if (this.db.has(persistOpts.getName())) {
                    const selfArray = this.db.get(persistOpts.getName());
                    if (Array.isArray(selfArray)) {
                        utxos.addArray(data);
                        const utxoSet = new utxos_1.UTXOSet();
                        utxoSet.addArray(selfArray);
                        utxoSet.mergeByRule(utxos, persistOpts.getMergeRule());
                        data = utxoSet.getAllUTXOStrings();
                    }
                }
                this.db.set(persistOpts.getName(), data, persistOpts.getOverwrite());
            }
            utxos.addArray(data, false);
            response.data.result.utxos = utxos;
            return response.data.result;
        });
        /**
         * Helper function which creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param amount The amount of AssetID to be spent in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}.
         * @param assetID The assetID of the value being sent
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[BaseTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        this.buildBaseTx = (utxoset, amount, assetID = undefined, toAddresses, fromAddresses, changeAddresses, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildBaseTx";
            const to = this._cleanAddressArray(toAddresses, caller).map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (typeof assetID === "string") {
                assetID = bintools.cb58Decode(assetID);
            }
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const networkID = this.core.getNetworkID();
            const blockchainIDBuf = bintools.cb58Decode(this.blockchainID);
            const fee = this.getTxFee();
            const feeAssetID = yield this.getAXCAssetID();
            const builtUnsignedTx = utxoset.buildBaseTx(networkID, blockchainIDBuf, amount, assetID, to, from, change, fee, feeAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildBaseTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned NFT Transfer. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param toAddresses The addresses to send the NFT
         * @param fromAddresses The addresses being used to send the NFT from the utxoID provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param utxoid A base58 utxoID or an array of base58 utxoIDs for the nfts this transaction is sending
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[NFTTransferTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        this.buildNFTTransferTx = (utxoset, toAddresses, fromAddresses, changeAddresses, utxoid, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildNFTTransferTx";
            const to = this._cleanAddressArray(toAddresses, caller).map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            let utxoidArray = [];
            if (typeof utxoid === "string") {
                utxoidArray = [utxoid];
            }
            else if (Array.isArray(utxoid)) {
                utxoidArray = utxoid;
            }
            const builtUnsignedTx = utxoset.buildNFTTransferTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, utxoidArray, this.getTxFee(), axcAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildNFTTransferTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[ImportTx]].
         *
         * @remarks
         * This helper exists because the endpoint API should be the primary point of entry for most functionality.
         */
        this.buildImportTx = (utxoset, ownerAddresses, sourceChain, toAddresses, fromAddresses, changeAddresses = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildImportTx";
            const to = this._cleanAddressArray(toAddresses, caller).map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            let sraxChain = undefined;
            if (typeof sourceChain === "undefined") {
                throw new errors_1.ChainIdError("Error - AVMAPI.buildImportTx: Source ChainID is undefined.");
            }
            else if (typeof sourceChain === "string") {
                sraxChain = sourceChain;
                sourceChain = bintools.cb58Decode(sourceChain);
            }
            else if (!(sourceChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - AVMAPI.buildImportTx: Invalid destinationChain type: " +
                    typeof sourceChain);
            }
            const atomicUTXOs = (yield this.getUTXOs(ownerAddresses, sraxChain, 0, undefined)).utxos;
            const axcAssetID = yield this.getAXCAssetID();
            const atomics = atomicUTXOs.getAllUTXOs();
            if (atomics.length === 0) {
                throw new errors_1.NoAtomicUTXOsError("Error - AVMAPI.buildImportTx: No atomic UTXOs to import from " +
                    sraxChain +
                    " using addresses: " +
                    ownerAddresses.join(", "));
            }
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const builtUnsignedTx = utxoset.buildImportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, atomics, sourceChain, this.getTxFee(), axcAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildImportTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned Export Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
         * @param destinationChain The chainid for where the assets will be sent.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         * @param assetID Optional. The assetID of the asset to send. Defaults to AXC assetID.
         * Regardless of the asset which you"re exporting, all fees are paid in AXC.
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        this.buildExportTx = (utxoset, amount, destinationChain, toAddresses, fromAddresses, changeAddresses = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1, assetID = undefined) => __awaiter(this, void 0, void 0, function* () {
            const prefixes = {};
            toAddresses.map((a) => {
                prefixes[a.split("-")[0]] = true;
            });
            if (Object.keys(prefixes).length !== 1) {
                throw new errors_1.AddressError("Error - AVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
            }
            if (typeof destinationChain === "undefined") {
                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Destination ChainID is undefined.");
            }
            else if (typeof destinationChain === "string") {
                destinationChain = bintools.cb58Decode(destinationChain); //
            }
            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Invalid destinationChain type: " +
                    typeof destinationChain);
            }
            if (destinationChain.length !== 32) {
                throw new errors_1.ChainIdError("Error - AVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
            }
            const to = [];
            toAddresses.map((a) => {
                to.push(bintools.stringToAddress(a));
            });
            const caller = "buildExportTx";
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            if (typeof assetID === "undefined") {
                assetID = bintools.cb58Encode(axcAssetID);
            }
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const assetIDBuf = bintools.cb58Decode(assetID);
            const fee = this.getTxFee();
            const builtUnsignedTx = utxoset.buildExportTx(networkID, blockchainID, amount, assetIDBuf, to, from, change, destinationChain, fee, axcAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildExportTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param initialState The [[InitialStates]] that represent the intial state of a created asset
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param denomination Number for the denomination which is 10^D. D must be >= 0 and <= 32. Ex: $1 AXC = 10^9 $nAXC
         * @param mintOutputs Optional. Array of [[SECPMintOutput]]s to be included in the transaction. These outputs can be spent to mint more tokens.
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[CreateAssetTx]].
         *
         */
        this.buildCreateAssetTx = (utxoset, fromAddresses, changeAddresses, initialStates, name, symbol, denomination, mintOutputs = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildCreateAssetTx";
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            if (symbol.length > constants_1.AVMConstants.SYMBOLMAXLEN) {
                throw new errors_1.SymbolError("Error - AVMAPI.buildCreateAssetTx: Symbols may not exceed length of " +
                    constants_1.AVMConstants.SYMBOLMAXLEN);
            }
            if (name.length > constants_1.AVMConstants.ASSETNAMELEN) {
                throw new errors_1.NameError("Error - AVMAPI.buildCreateAssetTx: Names may not exceed length of " +
                    constants_1.AVMConstants.ASSETNAMELEN);
            }
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const axcAssetID = yield this.getAXCAssetID();
            const fee = this.getDefaultCreationTxFee();
            const builtUnsignedTx = utxoset.buildCreateAssetTx(networkID, blockchainID, from, change, initialStates, name, symbol, denomination, mintOutputs, fee, axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx, fee))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateAssetTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        this.buildSECPMintTx = (utxoset, mintOwner, transferOwner, fromAddresses, changeAddresses, mintUTXOID, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildSECPMintTx";
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const axcAssetID = yield this.getAXCAssetID();
            const fee = this.getMintTxFee();
            const builtUnsignedTx = utxoset.buildSECPMintTx(networkID, blockchainID, mintOwner, transferOwner, from, change, mintUTXOID, fee, axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildSECPMintTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param minterSets is a list where each element specifies that threshold of the addresses in minters may together mint more of the asset by signing a minting transaction
         * @param name String for the descriptive name of the asset
         * @param symbol String for the ticker symbol of the asset
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting mint output
         *
         * ```js
         * Example minterSets:
         * [
         *      {
         *          "minters":[
         *              "Swap-axc1ghstjukrtw8935lryqtnh643xe9a94u3tc75c7"
         *          ],
         *          "threshold": 1
         *      },
         *      {
         *          "minters": [
         *              "Swap-axc1yell3e4nln0m39cfpdhgqprsd87jkh4qnakklx",
         *              "Swap-axc1k4nr26c80jaquzm9369j5a4shmwcjn0vmemcjz",
         *              "Swap-axc1ztkzsrjnkn0cek5ryvhqswdtcg23nhge3nnr5e"
         *          ],
         *          "threshold": 2
         *      }
         * ]
         * ```
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains a [[CreateAssetTx]].
         *
         */
        this.buildCreateNFTAssetTx = (utxoset, fromAddresses, changeAddresses, minterSets, name, symbol, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0)) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildCreateNFTAssetTx";
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            if (name.length > constants_1.AVMConstants.ASSETNAMELEN) {
                /* istanbul ignore next */
                throw new errors_1.NameError("Error - AVMAPI.buildCreateNFTAssetTx: Names may not exceed length of " +
                    constants_1.AVMConstants.ASSETNAMELEN);
            }
            if (symbol.length > constants_1.AVMConstants.SYMBOLMAXLEN) {
                /* istanbul ignore next */
                throw new errors_1.SymbolError("Error - AVMAPI.buildCreateNFTAssetTx: Symbols may not exceed length of " +
                    constants_1.AVMConstants.SYMBOLMAXLEN);
            }
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const creationTxFee = this.getCreationTxFee();
            const axcAssetID = yield this.getAXCAssetID();
            const builtUnsignedTx = utxoset.buildCreateNFTAssetTx(networkID, blockchainID, from, change, minterSets, name, symbol, creationTxFee, axcAssetID, memo, asOf, locktime);
            if (!(yield this.checkGooseEgg(builtUnsignedTx, creationTxFee))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateNFTAssetTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Creates an unsigned transaction. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset  A set of UTXOs that the transaction is built on
         * @param owners Either a single or an array of [[OutputOwners]] to send the nft output
         * @param fromAddresses The addresses being used to send the NFT from the utxoID provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param utxoid A base58 utxoID or an array of base58 utxoIDs for the nft mint output this transaction is sending
         * @param groupID Optional. The group this NFT is issued to.
         * @param payload Optional. Data for NFT Payload as either a [[PayloadBase]] or a {@link https://github.com/feross/buffer|Buffer}
         * @param memo Optional CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[OperationTx]].
         *
         */
        this.buildCreateNFTMintTx = (utxoset, owners, fromAddresses, changeAddresses, utxoid, groupID = 0, payload = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const caller = "buildCreateNFTMintTx";
            const from = this._cleanAddressArray(fromAddresses, caller).map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, caller).map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            if (payload instanceof payload_1.PayloadBase) {
                payload = payload.getPayload();
            }
            if (typeof utxoid === "string") {
                utxoid = [utxoid];
            }
            const axcAssetID = yield this.getAXCAssetID();
            if (owners instanceof output_1.OutputOwners) {
                owners = [owners];
            }
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const txFee = this.getTxFee();
            const builtUnsignedTx = utxoset.buildCreateNFTMintTx(networkID, blockchainID, owners, from, change, utxoid, groupID, payload, txFee, axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Error - AVMAPI.buildCreateNFTMintTx:Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which takes an unsigned transaction and signs it, returning the resulting [[Tx]].
         *
         * @param utx The unsigned transaction of type [[UnsignedTx]]
         *
         * @returns A signed transaction of type [[Tx]]
         */
        this.signTx = (utx) => utx.sign(this.keychain);
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
                throw new errors_1.TransactionError("Error - AVMAPI.issueTx: provided tx is not expected type of string, Buffer, or Tx");
            }
            const params = {
                tx: Transaction.toString()
            };
            const response = yield this.callMethod("avm.issueTx", params);
            return response.data.result.txID;
        });
        /**
         * Calls the node's getAddressTxs method from the API and returns transactions corresponding to the provided address and assetID
         *
         * @param address The address for which we're fetching related transactions.
         * @param cursor Page number or offset.
         * @param pageSize  Number of items to return per page. Optional. Defaults to 1024. If [pageSize] == 0 or [pageSize] > [maxPageSize], then it fetches at max [maxPageSize] transactions
         * @param assetID Only return transactions that changed the balance of this asset. Must be an ID or an alias for an asset.
         *
         * @returns A promise object representing the array of transaction IDs and page offset
         */
        this.getAddressTxs = (address, cursor, pageSize, assetID) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            let pageSizeNum;
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            if (typeof pageSize !== "number") {
                pageSizeNum = 0;
            }
            else {
                pageSizeNum = pageSize;
            }
            const params = {
                address,
                cursor,
                pageSize: pageSizeNum,
                assetID: asset
            };
            const response = yield this.callMethod("avm.getAddressTxs", params);
            return response.data.result;
        });
        /**
         * Sends an amount of assetID to the specified address from a list of owned of addresses.
         *
         * @param username The user that owns the private keys associated with the `from` addresses
         * @param password The password unlocking the user
         * @param assetID The assetID of the asset to send
         * @param amount The amount of the asset to be sent
         * @param to The address of the recipient
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param memo Optional. CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         *
         * @returns Promise for the string representing the transaction's ID.
         */
        this.send = (username, password, assetID, amount, to, from = undefined, changeAddr = undefined, memo = undefined) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            let amnt;
            if (typeof this.parseAddress(to) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
            }
            if (typeof assetID !== "string") {
                asset = bintools.cb58Encode(assetID);
            }
            else {
                asset = assetID;
            }
            if (typeof amount === "number") {
                amnt = new bn_js_1.default(amount);
            }
            else {
                amnt = amount;
            }
            const params = {
                username: username,
                password: password,
                assetID: asset,
                amount: amnt.toString(10),
                to: to
            };
            const caller = "send";
            from = this._cleanAddressArray(from, caller);
            if (typeof from !== "undefined") {
                params["from"] = from;
            }
            if (typeof changeAddr !== "undefined") {
                if (typeof this.parseAddress(changeAddr) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
                }
                params["changeAddr"] = changeAddr;
            }
            if (typeof memo !== "undefined") {
                if (typeof memo !== "string") {
                    params["memo"] = bintools.cb58Encode(memo);
                }
                else {
                    params["memo"] = memo;
                }
            }
            const response = yield this.callMethod("avm.send", params);
            return response.data.result;
        });
        /**
         * Sends an amount of assetID to an array of specified addresses from a list of owned of addresses.
         *
         * @param username The user that owns the private keys associated with the `from` addresses
         * @param password The password unlocking the user
         * @param sendOutputs The array of SendOutputs. A SendOutput is an object literal which contains an assetID, amount, and to.
         * @param from Optional. An array of addresses managed by the node's keystore for this blockchain which will fund this transaction
         * @param changeAddr Optional. An address to send the change
         * @param memo Optional. CB58 Buffer or String which contains arbitrary bytes, up to 256 bytes
         *
         * @returns Promise for the string representing the transaction"s ID.
         */
        this.sendMultiple = (username, password, sendOutputs, from = undefined, changeAddr = undefined, memo = undefined) => __awaiter(this, void 0, void 0, function* () {
            let asset;
            let amnt;
            const sOutputs = [];
            sendOutputs.forEach((output) => {
                if (typeof this.parseAddress(output.to) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.sendMultiple: Invalid address format");
                }
                if (typeof output.assetID !== "string") {
                    asset = bintools.cb58Encode(output.assetID);
                }
                else {
                    asset = output.assetID;
                }
                if (typeof output.amount === "number") {
                    amnt = new bn_js_1.default(output.amount);
                }
                else {
                    amnt = output.amount;
                }
                sOutputs.push({
                    to: output.to,
                    assetID: asset,
                    amount: amnt.toString(10)
                });
            });
            const params = {
                username: username,
                password: password,
                outputs: sOutputs
            };
            const caller = "send";
            from = this._cleanAddressArray(from, caller);
            if (typeof from !== "undefined") {
                params.from = from;
            }
            if (typeof changeAddr !== "undefined") {
                if (typeof this.parseAddress(changeAddr) === "undefined") {
                    /* istanbul ignore next */
                    throw new errors_1.AddressError("Error - AVMAPI.send: Invalid address format");
                }
                params.changeAddr = changeAddr;
            }
            if (typeof memo !== "undefined") {
                if (typeof memo !== "string") {
                    params.memo = bintools.cb58Encode(memo);
                }
                else {
                    params.memo = memo;
                }
            }
            const response = yield this.callMethod("avm.sendMultiple", params);
            return response.data.result;
        });
        /**
         * Given a JSON representation of this Virtual Machine’s genesis state, create the byte representation of that state.
         *
         * @param genesisData The blockchain's genesis data object
         *
         * @returns Promise of a string of bytes
         */
        this.buildGenesis = (genesisData) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                genesisData
            };
            const response = yield this.callMethod("avm.buildGenesis", params);
            return response.data.result.bytes;
        });
        this.blockchainID = blockchainID;
        const netID = core.getNetworkID();
        if (netID in constants_2.Defaults.network &&
            blockchainID in constants_2.Defaults.network[`${netID}`]) {
            const { alias } = constants_2.Defaults.network[`${netID}`][`${blockchainID}`];
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
        const chainID = this.getBlockchainAlias()
            ? this.getBlockchainAlias()
            : this.getBlockchainID();
        if (addresses && addresses.length > 0) {
            for (let i = 0; i < addresses.length; i++) {
                if (typeof addresses[`${i}`] === "string") {
                    if (typeof this.parseAddress(addresses[`${i}`]) ===
                        "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - AVMAPI.${caller}: Invalid address format");
                    }
                    addrs.push(addresses[`${i}`]);
                }
                else {
                    const type = "bech32";
                    addrs.push(serialization.bufferToType(addresses[`${i}`], type, this.core.getHRP(), chainID));
                }
            }
        }
        return addrs;
    }
}
exports.AVMAPI = AVMAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxrREFBc0I7QUFDdEIsb0NBQWdDO0FBRWhDLG9FQUEyQztBQUMzQyxtQ0FBdUM7QUFDdkMsMkNBQTBDO0FBQzFDLHlDQUFxQztBQUNyQyw2QkFBcUM7QUFDckMsaURBQWlEO0FBR2pELGlFQUFxRDtBQUNyRCxrREFBOEM7QUFFOUMscURBQTJFO0FBRzNFLGdEQUFrRDtBQUVsRCwrQ0FRMkI7QUFDM0IsdUNBQTJEO0FBb0MzRDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLHFCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFaEU7Ozs7OztHQU1HO0FBQ0gsTUFBYSxNQUFPLFNBQVEsaUJBQU87SUErN0RqQzs7Ozs7O09BTUc7SUFDSCxZQUNFLElBQWMsRUFDZCxVQUFrQixjQUFjLEVBQ2hDLGVBQXVCLEVBQUU7UUFFekIsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQTE4RHRCOztXQUVHO1FBQ08sYUFBUSxHQUFhLElBQUksbUJBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDekMsaUJBQVksR0FBVyxFQUFFLENBQUE7UUFDekIsb0JBQWUsR0FBVyxTQUFTLENBQUE7UUFDbkMsZUFBVSxHQUFXLFNBQVMsQ0FBQTtRQUM5QixVQUFLLEdBQU8sU0FBUyxDQUFBO1FBQ3JCLGtCQUFhLEdBQU8sU0FBUyxDQUFBO1FBQzdCLGNBQVMsR0FBTyxTQUFTLENBQUE7UUFFbkM7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFHLEdBQVcsRUFBRTtZQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLGVBQWUsS0FBSyxXQUFXLEVBQUU7Z0JBQy9D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UUFBUSxFQUFFO29CQUN6QyxJQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBVyxDQUFDO3dCQUNyRCxXQUFXLEVBQ1g7d0JBQ0EsMEJBQTBCO3dCQUMxQixNQUFNLElBQUkscUJBQVksQ0FDcEIsa0RBQWtELENBQ25ELENBQUE7cUJBQ0Y7b0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBVyxDQUFDLENBQUE7aUJBQ3hDO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxHQUFtQixRQUFRLENBQUE7b0JBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQ1IsYUFBYSxDQUFDLFlBQVksQ0FDeEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQVcsRUFDM0IsSUFBSSxFQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQ2xCLE9BQU8sQ0FDUixDQUNGLENBQUE7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0NBMkJGO0FBeDlERCx3QkF3OURDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1BVk1cclxuICovXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCBBeGlhQ29yZSBmcm9tIFwiLi4vLi4vYXhpYVwiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgeyBVVFhPLCBVVFhPU2V0IH0gZnJvbSBcIi4vdXR4b3NcIlxyXG5pbXBvcnQgeyBBVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBLZXlDaGFpbiB9IGZyb20gXCIuL2tleWNoYWluXCJcclxuaW1wb3J0IHsgVHgsIFVuc2lnbmVkVHggfSBmcm9tIFwiLi90eFwiXHJcbmltcG9ydCB7IFBheWxvYWRCYXNlIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3BheWxvYWRcIlxyXG5pbXBvcnQgeyBTRUNQTWludE91dHB1dCB9IGZyb20gXCIuL291dHB1dHNcIlxyXG5pbXBvcnQgeyBJbml0aWFsU3RhdGVzIH0gZnJvbSBcIi4vaW5pdGlhbHN0YXRlc1wiXHJcbmltcG9ydCB7IFVuaXhOb3cgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IHsgSlJQQ0FQSSB9IGZyb20gXCIuLi8uLi9jb21tb24vanJwY2FwaVwiXHJcbmltcG9ydCB7IFJlcXVlc3RSZXNwb25zZURhdGEgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2FwaWJhc2VcIlxyXG5pbXBvcnQgeyBEZWZhdWx0cywgUHJpbWFyeUFzc2V0QWxpYXMsIE9ORUFYQyB9IGZyb20gXCIuLi8uLi91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBNaW50ZXJTZXQgfSBmcm9tIFwiLi9taW50ZXJzZXRcIlxyXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcGVyc2lzdGVuY2VvcHRpb25zXCJcclxuaW1wb3J0IHsgT3V0cHV0T3duZXJzIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9vdXRwdXRcIlxyXG5pbXBvcnQgeyBTRUNQVHJhbnNmZXJPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHtcclxuICBBZGRyZXNzRXJyb3IsXHJcbiAgR29vc2VFZ2dDaGVja0Vycm9yLFxyXG4gIENoYWluSWRFcnJvcixcclxuICBOb0F0b21pY1VUWE9zRXJyb3IsXHJcbiAgU3ltYm9sRXJyb3IsXHJcbiAgTmFtZUVycm9yLFxyXG4gIFRyYW5zYWN0aW9uRXJyb3JcclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcclxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZFR5cGUgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIlxyXG5pbXBvcnQge1xyXG4gIEJ1aWxkR2VuZXNpc1BhcmFtcyxcclxuICBDcmVhdGVBZGRyZXNzUGFyYW1zLFxyXG4gIENyZWF0ZUZpeGVkQ2FwQXNzZXRQYXJhbXMsXHJcbiAgQ3JlYXRlVmFyaWFibGVDYXBBc3NldFBhcmFtcyxcclxuICBFeHBvcnRQYXJhbXMsXHJcbiAgRXhwb3J0S2V5UGFyYW1zLFxyXG4gIEdldEFsbEJhbGFuY2VzUGFyYW1zLFxyXG4gIEdldEFzc2V0RGVzY3JpcHRpb25QYXJhbXMsXHJcbiAgR2V0QVhDQXNzZXRJRFBhcmFtcyxcclxuICBHZXRCYWxhbmNlUGFyYW1zLFxyXG4gIEdldFR4UGFyYW1zLFxyXG4gIEdldFR4U3RhdHVzUGFyYW1zLFxyXG4gIEdldFVUWE9zUGFyYW1zLFxyXG4gIEltcG9ydFBhcmFtcyxcclxuICBJbXBvcnRLZXlQYXJhbXMsXHJcbiAgTGlzdEFkZHJlc3Nlc1BhcmFtcyxcclxuICBNaW50UGFyYW1zLFxyXG4gIFNlbmRNdWx0aXBsZVBhcmFtcyxcclxuICBTT3V0cHV0c1BhcmFtcyxcclxuICBHZXRVVFhPc1Jlc3BvbnNlLFxyXG4gIEdldEFzc2V0RGVzY3JpcHRpb25SZXNwb25zZSxcclxuICBHZXRCYWxhbmNlUmVzcG9uc2UsXHJcbiAgU2VuZFBhcmFtcyxcclxuICBTZW5kUmVzcG9uc2UsXHJcbiAgU2VuZE11bHRpcGxlUmVzcG9uc2UsXHJcbiAgR2V0QWRkcmVzc1R4c1BhcmFtcyxcclxuICBHZXRBZGRyZXNzVHhzUmVzcG9uc2UsXHJcbiAgQ3JlYXRlTkZUQXNzZXRQYXJhbXMsXHJcbiAgU2VuZE5GVFBhcmFtcyxcclxuICBNaW50TkZUUGFyYW1zLFxyXG4gIElNaW50ZXJTZXRcclxufSBmcm9tIFwiLi9pbnRlcmZhY2VzXCJcclxuaW1wb3J0IHsgSXNzdWVUeFBhcmFtcyB9IGZyb20gXCIuLi8uLi9jb21tb25cIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbm9kZSBlbmRwb2ludCB0aGF0IGlzIHVzaW5nIHRoZSBBVk0uXHJcbiAqXHJcbiAqIEBjYXRlZ29yeSBSUENBUElzXHJcbiAqXHJcbiAqIEByZW1hcmtzIFRoaXMgZXh0ZW5kcyB0aGUgW1tKUlBDQVBJXV0gY2xhc3MuIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBkaXJlY3RseSBjYWxsZWQuIEluc3RlYWQsIHVzZSB0aGUgW1tBeGlhLmFkZEFQSV1dIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIHRoaXMgaW50ZXJmYWNlIHdpdGggQXhpYS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBVk1BUEkgZXh0ZW5kcyBKUlBDQVBJIHtcclxuICAvKipcclxuICAgKiBAaWdub3JlXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIGtleWNoYWluOiBLZXlDaGFpbiA9IG5ldyBLZXlDaGFpbihcIlwiLCBcIlwiKVxyXG4gIHByb3RlY3RlZCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiXCJcclxuICBwcm90ZWN0ZWQgYmxvY2tjaGFpbkFsaWFzOiBzdHJpbmcgPSB1bmRlZmluZWRcclxuICBwcm90ZWN0ZWQgQVhDQXNzZXRJRDogQnVmZmVyID0gdW5kZWZpbmVkXHJcbiAgcHJvdGVjdGVkIHR4RmVlOiBCTiA9IHVuZGVmaW5lZFxyXG4gIHByb3RlY3RlZCBjcmVhdGlvblR4RmVlOiBCTiA9IHVuZGVmaW5lZFxyXG4gIHByb3RlY3RlZCBtaW50VHhGZWU6IEJOID0gdW5kZWZpbmVkXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGFsaWFzIGZvciB0aGUgYmxvY2tjaGFpbklEIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIHJldHVybnMgYHVuZGVmaW5lZGAuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSURcclxuICAgKi9cclxuICBnZXRCbG9ja2NoYWluQWxpYXMgPSAoKTogc3RyaW5nID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5ibG9ja2NoYWluQWxpYXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgY29uc3QgbmV0aWQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbmV0aWQgaW4gRGVmYXVsdHMubmV0d29yayAmJlxyXG4gICAgICAgIHRoaXMuYmxvY2tjaGFpbklEIGluIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0aWR9YF1cclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluQWxpYXMgPVxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1tgJHtuZXRpZH1gXVt0aGlzLmJsb2NrY2hhaW5JRF0uYWxpYXNcclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja2NoYWluQWxpYXNcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuYmxvY2tjaGFpbkFsaWFzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbGlhcyBUaGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSUQuXHJcbiAgICpcclxuICAgKi9cclxuICBzZXRCbG9ja2NoYWluQWxpYXMgPSAoYWxpYXM6IHN0cmluZyk6IHVuZGVmaW5lZCA9PiB7XHJcbiAgICB0aGlzLmJsb2NrY2hhaW5BbGlhcyA9IGFsaWFzXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgYmxvY2tjaGFpbklEIGFuZCByZXR1cm5zIGl0LlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGJsb2NrY2hhaW5JRFxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5JRCA9ICgpOiBzdHJpbmcgPT4gdGhpcy5ibG9ja2NoYWluSURcclxuXHJcbiAgLyoqXHJcbiAgICogUmVmcmVzaCBibG9ja2NoYWluSUQsIGFuZCBpZiBhIGJsb2NrY2hhaW5JRCBpcyBwYXNzZWQgaW4sIHVzZSB0aGF0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIE9wdGlvbmFsLiBCbG9ja2NoYWluSUQgdG8gYXNzaWduLCBpZiBub25lLCB1c2VzIHRoZSBkZWZhdWx0IGJhc2VkIG9uIG5ldHdvcmtJRC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBibG9ja2NoYWluSURcclxuICAgKi9cclxuICByZWZyZXNoQmxvY2tjaGFpbklEID0gKGJsb2NrY2hhaW5JRDogc3RyaW5nID0gdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XHJcbiAgICBjb25zdCBuZXRpZDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGVvZiBibG9ja2NoYWluSUQgPT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgdHlwZW9mIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0aWR9YF0gIT09IFwidW5kZWZpbmVkXCJcclxuICAgICkge1xyXG4gICAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0aWR9YF0uU3dhcC5ibG9ja2NoYWluSUQgLy9kZWZhdWx0IHRvIFN3YXAtQ2hhaW5cclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYmxvY2tjaGFpbklEID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHRoaXMuYmxvY2tjaGFpbklEID0gYmxvY2tjaGFpbklEXHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGFuIGFkZHJlc3Mgc3RyaW5nIGFuZCByZXR1cm5zIGl0cyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBpZiB2YWxpZC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBhZGRyZXNzIGlmIHZhbGlkLCB1bmRlZmluZWQgaWYgbm90IHZhbGlkLlxyXG4gICAqL1xyXG4gIHBhcnNlQWRkcmVzcyA9IChhZGRyOiBzdHJpbmcpOiBCdWZmZXIgPT4ge1xyXG4gICAgY29uc3QgYWxpYXM6IHN0cmluZyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgcmV0dXJuIGJpbnRvb2xzLnBhcnNlQWRkcmVzcyhcclxuICAgICAgYWRkcixcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBhbGlhcyxcclxuICAgICAgQVZNQ29uc3RhbnRzLkFERFJFU1NMRU5HVEhcclxuICAgIClcclxuICB9XHJcblxyXG4gIGFkZHJlc3NGcm9tQnVmZmVyID0gKGFkZHJlc3M6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XHJcbiAgICBjb25zdCBjaGFpbklEOiBzdHJpbmcgPSB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXHJcbiAgICAgID8gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgICA6IHRoaXMuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGNvbnN0IHR5cGU6IFNlcmlhbGl6ZWRUeXBlID0gXCJiZWNoMzJcIlxyXG4gICAgY29uc3QgaHJwOiBzdHJpbmcgPSB0aGlzLmNvcmUuZ2V0SFJQKClcclxuICAgIHJldHVybiBzZXJpYWxpemF0aW9uLmJ1ZmZlclRvVHlwZShhZGRyZXNzLCB0eXBlLCBocnAsIGNoYWluSUQpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBBWEMgQXNzZXRJRCBhbmQgcmV0dXJucyBpdCBpbiBhIFByb21pc2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVmcmVzaCBUaGlzIGZ1bmN0aW9uIGNhY2hlcyB0aGUgcmVzcG9uc2UuIFJlZnJlc2ggPSB0cnVlIHdpbGwgYnVzdCB0aGUgY2FjaGUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgdGhlIHByb3ZpZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIEFYQyBBc3NldElEXHJcbiAgICovXHJcbiAgZ2V0QVhDQXNzZXRJRCA9IGFzeW5jIChyZWZyZXNoOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPEJ1ZmZlcj4gPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLkFYQ0Fzc2V0SUQgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVmcmVzaCkge1xyXG4gICAgICBjb25zdCBhc3NldDogR2V0QVhDQXNzZXRJRFBhcmFtcyA9IGF3YWl0IHRoaXMuZ2V0QXNzZXREZXNjcmlwdGlvbihcclxuICAgICAgICBQcmltYXJ5QXNzZXRBbGlhc1xyXG4gICAgICApXHJcbiAgICAgIHRoaXMuQVhDQXNzZXRJRCA9IGFzc2V0LmFzc2V0SURcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLkFYQ0Fzc2V0SURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE92ZXJyaWRlcyB0aGUgZGVmYXVsdHMgYW5kIHNldHMgdGhlIGNhY2hlIHRvIGEgc3BlY2lmaWMgQVhDIEFzc2V0SURcclxuICAgKlxyXG4gICAqIEBwYXJhbSBheGNBc3NldElEIEEgY2I1OCBzdHJpbmcgb3IgQnVmZmVyIHJlcHJlc2VudGluZyB0aGUgQVhDIEFzc2V0SURcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSB0aGUgcHJvdmlkZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgQVhDIEFzc2V0SURcclxuICAgKi9cclxuICBzZXRBWENBc3NldElEID0gKGF4Y0Fzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBheGNBc3NldElEID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGF4Y0Fzc2V0SUQgPSBiaW50b29scy5jYjU4RGVjb2RlKGF4Y0Fzc2V0SUQpXHJcbiAgICB9XHJcbiAgICB0aGlzLkFYQ0Fzc2V0SUQgPSBheGNBc3NldElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBkZWZhdWx0IHR4IGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBkZWZhdWx0IHR4IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICovXHJcbiAgZ2V0RGVmYXVsdFR4RmVlID0gKCk6IEJOID0+IHtcclxuICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCkgaW4gRGVmYXVsdHMubmV0d29ya1xyXG4gICAgICA/IG5ldyBCTihEZWZhdWx0cy5uZXR3b3JrW3RoaXMuY29yZS5nZXROZXR3b3JrSUQoKV1bXCJTd2FwXCJdW1widHhGZWVcIl0pXHJcbiAgICAgIDogbmV3IEJOKDApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgdHggZmVlIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBnZXRUeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMudHhGZWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy50eEZlZSA9IHRoaXMuZ2V0RGVmYXVsdFR4RmVlKClcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnR4RmVlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZmVlIFRoZSB0eCBmZWUgYW1vdW50IHRvIHNldCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIHNldFR4RmVlID0gKGZlZTogQk4pOiB2b2lkID0+IHtcclxuICAgIHRoaXMudHhGZWUgPSBmZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGRlZmF1bHQgY3JlYXRpb24gZmVlIGZvciB0aGlzIGNoYWluLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGRlZmF1bHQgY3JlYXRpb24gZmVlIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBnZXREZWZhdWx0Q3JlYXRpb25UeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpIGluIERlZmF1bHRzLm5ldHdvcmtcclxuICAgICAgPyBuZXcgQk4oXHJcbiAgICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW3RoaXMuY29yZS5nZXROZXR3b3JrSUQoKV1bXCJTd2FwXCJdW1wiY3JlYXRpb25UeEZlZVwiXVxyXG4gICAgICAgIClcclxuICAgICAgOiBuZXcgQk4oMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGRlZmF1bHQgbWludCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgZGVmYXVsdCBtaW50IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICovXHJcbiAgZ2V0RGVmYXVsdE1pbnRUeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpIGluIERlZmF1bHRzLm5ldHdvcmtcclxuICAgICAgPyBuZXcgQk4oRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiU3dhcFwiXVtcIm1pbnRUeEZlZVwiXSlcclxuICAgICAgOiBuZXcgQk4oMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIG1pbnQgZmVlIGZvciB0aGlzIGNoYWluLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIG1pbnQgZmVlIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBnZXRNaW50VHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm1pbnRUeEZlZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLm1pbnRUeEZlZSA9IHRoaXMuZ2V0RGVmYXVsdE1pbnRUeEZlZSgpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5taW50VHhGZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGNyZWF0aW9uIGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBjcmVhdGlvbiBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldENyZWF0aW9uVHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmNyZWF0aW9uVHhGZWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy5jcmVhdGlvblR4RmVlID0gdGhpcy5nZXREZWZhdWx0Q3JlYXRpb25UeEZlZSgpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jcmVhdGlvblR4RmVlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBtaW50IGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmZWUgVGhlIG1pbnQgZmVlIGFtb3VudCB0byBzZXQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBzZXRNaW50VHhGZWUgPSAoZmVlOiBCTik6IHZvaWQgPT4ge1xyXG4gICAgdGhpcy5taW50VHhGZWUgPSBmZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGNyZWF0aW9uIGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBmZWUgVGhlIGNyZWF0aW9uIGZlZSBhbW91bnQgdG8gc2V0IGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICovXHJcbiAgc2V0Q3JlYXRpb25UeEZlZSA9IChmZWU6IEJOKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLmNyZWF0aW9uVHhGZWUgPSBmZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgYSByZWZlcmVuY2UgdG8gdGhlIGtleWNoYWluIGZvciB0aGlzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGluc3RhbmNlIG9mIFtbS2V5Q2hhaW5dXSBmb3IgdGhpcyBjbGFzc1xyXG4gICAqL1xyXG4gIGtleUNoYWluID0gKCk6IEtleUNoYWluID0+IHRoaXMua2V5Y2hhaW5cclxuXHJcbiAgLyoqXHJcbiAgICogQGlnbm9yZVxyXG4gICAqL1xyXG4gIG5ld0tleUNoYWluID0gKCk6IEtleUNoYWluID0+IHtcclxuICAgIC8vIHdhcm5pbmcsIG92ZXJ3cml0ZXMgdGhlIG9sZCBrZXljaGFpblxyXG4gICAgY29uc3QgYWxpYXM6IHN0cmluZyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgIGlmIChhbGlhcykge1xyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgYWxpYXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgdGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5rZXljaGFpblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGRldGVybWluZXMgaWYgYSB0eCBpcyBhIGdvb3NlIGVnZyB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHggQW4gVW5zaWduZWRUeFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgYm9vbGVhbiB0cnVlIGlmIHBhc3NlcyBnb29zZSBlZ2cgdGVzdCBhbmQgZmFsc2UgaWYgZmFpbHMuXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIEEgXCJHb29zZSBFZ2cgVHJhbnNhY3Rpb25cIiBpcyB3aGVuIHRoZSBmZWUgZmFyIGV4Y2VlZHMgYSByZWFzb25hYmxlIGFtb3VudFxyXG4gICAqL1xyXG4gIGNoZWNrR29vc2VFZ2cgPSBhc3luYyAoXHJcbiAgICB1dHg6IFVuc2lnbmVkVHgsXHJcbiAgICBvdXRUb3RhbDogQk4gPSBuZXcgQk4oMClcclxuICApOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IGF4Y0Fzc2V0SUQ6IEJ1ZmZlciA9IGF3YWl0IHRoaXMuZ2V0QVhDQXNzZXRJRCgpXHJcbiAgICBjb25zdCBvdXRwdXRUb3RhbDogQk4gPSBvdXRUb3RhbC5ndChuZXcgQk4oMCkpXHJcbiAgICAgID8gb3V0VG90YWxcclxuICAgICAgOiB1dHguZ2V0T3V0cHV0VG90YWwoYXhjQXNzZXRJRClcclxuICAgIGNvbnN0IGZlZTogQk4gPSB1dHguZ2V0QnVybihheGNBc3NldElEKVxyXG4gICAgaWYgKGZlZS5sdGUoT05FQVhDLm11bChuZXcgQk4oMTApKSkgfHwgZmVlLmx0ZShvdXRwdXRUb3RhbCkpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgYmFsYW5jZSBvZiBhIHBhcnRpY3VsYXIgYXNzZXQgb24gYSBibG9ja2NoYWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgVGhlIGFkZHJlc3MgdG8gcHVsbCB0aGUgYXNzZXQgYmFsYW5jZSBmcm9tXHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0SUQgdG8gcHVsbCB0aGUgYmFsYW5jZSBmcm9tXHJcbiAgICogQHBhcmFtIGluY2x1ZGVQYXJ0aWFsIElmIGluY2x1ZGVQYXJ0aWFsPWZhbHNlLCByZXR1cm5zIG9ubHkgdGhlIGJhbGFuY2UgaGVsZCBzb2xlbHlcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCB0aGUgYmFsYW5jZSBvZiB0aGUgYXNzZXRJRCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IG9uIHRoZSBwcm92aWRlZCBhZGRyZXNzIGZvciB0aGUgYmxvY2tjaGFpbi5cclxuICAgKi9cclxuICBnZXRCYWxhbmNlID0gYXN5bmMgKFxyXG4gICAgYWRkcmVzczogc3RyaW5nLFxyXG4gICAgYXNzZXRJRDogc3RyaW5nLFxyXG4gICAgaW5jbHVkZVBhcnRpYWw6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICk6IFByb21pc2U8R2V0QmFsYW5jZVJlc3BvbnNlPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3MpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5nZXRCYWxhbmNlOiBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRCYWxhbmNlUGFyYW1zID0ge1xyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBhc3NldElELFxyXG4gICAgICBpbmNsdWRlUGFydGlhbFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmdldEJhbGFuY2VcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gYWRkcmVzcyAoYW5kIGFzc29jaWF0ZWQgcHJpdmF0ZSBrZXlzKSBvbiBhIHVzZXIgb24gYSBibG9ja2NoYWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIE5hbWUgb2YgdGhlIHVzZXIgdG8gY3JlYXRlIHRoZSBhZGRyZXNzIHVuZGVyXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkIHRvIHVubG9jayB0aGUgdXNlciBhbmQgZW5jcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgYWRkcmVzcyBjcmVhdGVkIGJ5IHRoZSB2bS5cclxuICAgKi9cclxuICBjcmVhdGVBZGRyZXNzID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVhdGVBZGRyZXNzUGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmRcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5jcmVhdGVBZGRyZXNzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBmaXhlZC1jYXAsIGZ1bmdpYmxlIGFzc2V0LiBBIHF1YW50aXR5IG9mIGl0IGlzIGNyZWF0ZWQgYXQgaW5pdGlhbGl6YXRpb24gYW5kIHRoZXJlIG5vIG1vcmUgaXMgZXZlciBjcmVhdGVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VyIHBheWluZyB0aGUgdHJhbnNhY3Rpb24gZmVlIChpbiAkQVhDKSBmb3IgYXNzZXQgY3JlYXRpb25cclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIGZvciB0aGUgdXNlciBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZSAoaW4gJEFYQykgZm9yIGFzc2V0IGNyZWF0aW9uXHJcbiAgICogQHBhcmFtIG5hbWUgVGhlIGh1bWFuLXJlYWRhYmxlIG5hbWUgZm9yIHRoZSBhc3NldFxyXG4gICAqIEBwYXJhbSBzeW1ib2wgT3B0aW9uYWwuIFRoZSBzaG9ydGhhbmQgc3ltYm9sIGZvciB0aGUgYXNzZXQuIEJldHdlZW4gMCBhbmQgNCBjaGFyYWN0ZXJzXHJcbiAgICogQHBhcmFtIGRlbm9taW5hdGlvbiBPcHRpb25hbC4gRGV0ZXJtaW5lcyBob3cgYmFsYW5jZXMgb2YgdGhpcyBhc3NldCBhcmUgZGlzcGxheWVkIGJ5IHVzZXIgaW50ZXJmYWNlcy4gRGVmYXVsdCBpcyAwXHJcbiAgICogQHBhcmFtIGluaXRpYWxIb2xkZXJzIEFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyB0aGUgZmllbGQgXCJhZGRyZXNzXCIgYW5kIFwiYW1vdW50XCIgdG8gZXN0YWJsaXNoIHRoZSBnZW5lc2lzIHZhbHVlcyBmb3IgdGhlIG5ldyBhc3NldFxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBFeGFtcGxlIGluaXRpYWxIb2xkZXJzOlxyXG4gICAqIFtcclxuICAgKiAgIHtcclxuICAgKiAgICAgXCJhZGRyZXNzXCI6IFwiU3dhcC1heGMxa2owNmxoZ3g4NGgzOXNuc2xqY2V5M3RwYzA0NnplNjhtZWszZzVcIixcclxuICAgKiAgICAgXCJhbW91bnRcIjogMTAwMDBcclxuICAgKiAgIH0sXHJcbiAgICogICB7XHJcbiAgICogICAgIFwiYWRkcmVzc1wiOiBcIlN3YXAtYXhjMWFtNHc2aGZydm1oM2FrZHV6a2p0aHJ0Z3RxYWZhbGNlNmFuOGNyXCIsXHJcbiAgICogICAgIFwiYW1vdW50XCI6IDUwMDAwXHJcbiAgICogICB9XHJcbiAgICogXVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGJhc2UgNTggc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBJRCBvZiB0aGUgbmV3bHkgY3JlYXRlZCBhc3NldC5cclxuICAgKi9cclxuICBjcmVhdGVGaXhlZENhcEFzc2V0ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzeW1ib2w6IHN0cmluZyxcclxuICAgIGRlbm9taW5hdGlvbjogbnVtYmVyLFxyXG4gICAgaW5pdGlhbEhvbGRlcnM6IG9iamVjdFtdXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogQ3JlYXRlRml4ZWRDYXBBc3NldFBhcmFtcyA9IHtcclxuICAgICAgbmFtZSxcclxuICAgICAgc3ltYm9sLFxyXG4gICAgICBkZW5vbWluYXRpb24sXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgaW5pdGlhbEhvbGRlcnNcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5jcmVhdGVGaXhlZENhcEFzc2V0XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFzc2V0SURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyB2YXJpYWJsZS1jYXAsIGZ1bmdpYmxlIGFzc2V0LiBObyB1bml0cyBvZiB0aGUgYXNzZXQgZXhpc3QgYXQgaW5pdGlhbGl6YXRpb24uIE1pbnRlcnMgY2FuIG1pbnQgdW5pdHMgb2YgdGhpcyBhc3NldCB1c2luZyBjcmVhdGVNaW50VHgsIHNpZ25NaW50VHggYW5kIHNlbmRNaW50VHguXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXIgcGF5aW5nIHRoZSB0cmFuc2FjdGlvbiBmZWUgKGluICRBWEMpIGZvciBhc3NldCBjcmVhdGlvblxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgZm9yIHRoZSB1c2VyIHBheWluZyB0aGUgdHJhbnNhY3Rpb24gZmVlIChpbiAkQVhDKSBmb3IgYXNzZXQgY3JlYXRpb25cclxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaHVtYW4tcmVhZGFibGUgbmFtZSBmb3IgdGhlIGFzc2V0XHJcbiAgICogQHBhcmFtIHN5bWJvbCBPcHRpb25hbC4gVGhlIHNob3J0aGFuZCBzeW1ib2wgZm9yIHRoZSBhc3NldCAtLSBiZXR3ZWVuIDAgYW5kIDQgY2hhcmFjdGVyc1xyXG4gICAqIEBwYXJhbSBkZW5vbWluYXRpb24gT3B0aW9uYWwuIERldGVybWluZXMgaG93IGJhbGFuY2VzIG9mIHRoaXMgYXNzZXQgYXJlIGRpc3BsYXllZCBieSB1c2VyIGludGVyZmFjZXMuIERlZmF1bHQgaXMgMFxyXG4gICAqIEBwYXJhbSBtaW50ZXJTZXRzIGlzIGEgbGlzdCB3aGVyZSBlYWNoIGVsZW1lbnQgc3BlY2lmaWVzIHRoYXQgdGhyZXNob2xkIG9mIHRoZSBhZGRyZXNzZXMgaW4gbWludGVycyBtYXkgdG9nZXRoZXIgbWludCBtb3JlIG9mIHRoZSBhc3NldCBieSBzaWduaW5nIGEgbWludGluZyB0cmFuc2FjdGlvblxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBFeGFtcGxlIG1pbnRlclNldHM6XHJcbiAgICogW1xyXG4gICAqICAgIHtcclxuICAgKiAgICAgIFwibWludGVyc1wiOltcclxuICAgKiAgICAgICAgXCJTd2FwLWF4YzFhbTR3NmhmcnZtaDNha2R1emtqdGhydGd0cWFmYWxjZTZhbjhjclwiXHJcbiAgICogICAgICBdLFxyXG4gICAqICAgICAgXCJ0aHJlc2hvbGRcIjogMVxyXG4gICAqICAgICB9LFxyXG4gICAqICAgICB7XHJcbiAgICogICAgICBcIm1pbnRlcnNcIjogW1xyXG4gICAqICAgICAgICBcIlN3YXAtYXhjMWFtNHc2aGZydm1oM2FrZHV6a2p0aHJ0Z3RxYWZhbGNlNmFuOGNyXCIsXHJcbiAgICogICAgICAgIFwiU3dhcC1heGMxa2owNmxoZ3g4NGgzOXNuc2xqY2V5M3RwYzA0NnplNjhtZWszZzVcIixcclxuICAgKiAgICAgICAgXCJTd2FwLWF4YzF5ZWxsM2U0bmxuMG0zOWNmcGRoZ3FwcnNkODdqa2g0cW5ha2tseFwiXHJcbiAgICogICAgICBdLFxyXG4gICAqICAgICAgXCJ0aHJlc2hvbGRcIjogMlxyXG4gICAqICAgICB9XHJcbiAgICogXVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIGNvbnRhaW5pbmcgdGhlIGJhc2UgNTggc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBJRCBvZiB0aGUgbmV3bHkgY3JlYXRlZCBhc3NldC5cclxuICAgKi9cclxuICBjcmVhdGVWYXJpYWJsZUNhcEFzc2V0ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzeW1ib2w6IHN0cmluZyxcclxuICAgIGRlbm9taW5hdGlvbjogbnVtYmVyLFxyXG4gICAgbWludGVyU2V0czogb2JqZWN0W11cclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVhdGVWYXJpYWJsZUNhcEFzc2V0UGFyYW1zID0ge1xyXG4gICAgICBuYW1lLFxyXG4gICAgICBzeW1ib2wsXHJcbiAgICAgIGRlbm9taW5hdGlvbixcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBtaW50ZXJTZXRzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0uY3JlYXRlVmFyaWFibGVDYXBBc3NldFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5hc3NldElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgZmFtaWx5IG9mIE5GVCBBc3NldC4gTm8gdW5pdHMgb2YgdGhlIGFzc2V0IGV4aXN0IGF0IGluaXRpYWxpemF0aW9uLiBNaW50ZXJzIGNhbiBtaW50IHVuaXRzIG9mIHRoaXMgYXNzZXQgdXNpbmcgY3JlYXRlTWludFR4LCBzaWduTWludFR4IGFuZCBzZW5kTWludFR4LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VyIHBheWluZyB0aGUgdHJhbnNhY3Rpb24gZmVlIChpbiAkQVhDKSBmb3IgYXNzZXQgY3JlYXRpb25cclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIGZvciB0aGUgdXNlciBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZSAoaW4gJEFYQykgZm9yIGFzc2V0IGNyZWF0aW9uXHJcbiAgICogQHBhcmFtIGZyb20gT3B0aW9uYWwuIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBtYW5hZ2VkIGJ5IHRoZSBub2RlJ3Mga2V5c3RvcmUgZm9yIHRoaXMgYmxvY2tjaGFpbiB3aGljaCB3aWxsIGZ1bmQgdGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyIE9wdGlvbmFsLiBBbiBhZGRyZXNzIHRvIHNlbmQgdGhlIGNoYW5nZVxyXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBodW1hbi1yZWFkYWJsZSBuYW1lIGZvciB0aGUgYXNzZXRcclxuICAgKiBAcGFyYW0gc3ltYm9sIE9wdGlvbmFsLiBUaGUgc2hvcnRoYW5kIHN5bWJvbCBmb3IgdGhlIGFzc2V0IC0tIGJldHdlZW4gMCBhbmQgNCBjaGFyYWN0ZXJzXHJcbiAgICogQHBhcmFtIG1pbnRlclNldHMgaXMgYSBsaXN0IHdoZXJlIGVhY2ggZWxlbWVudCBzcGVjaWZpZXMgdGhhdCB0aHJlc2hvbGQgb2YgdGhlIGFkZHJlc3NlcyBpbiBtaW50ZXJzIG1heSB0b2dldGhlciBtaW50IG1vcmUgb2YgdGhlIGFzc2V0IGJ5IHNpZ25pbmcgYSBtaW50aW5nIHRyYW5zYWN0aW9uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgYmFzZSA1OCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIElEIG9mIHRoZSBuZXdseSBjcmVhdGVkIGFzc2V0LlxyXG4gICAqL1xyXG4gIGNyZWF0ZU5GVEFzc2V0ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBmcm9tOiBzdHJpbmdbXSB8IEJ1ZmZlcltdID0gdW5kZWZpbmVkLFxyXG4gICAgY2hhbmdlQWRkcjogc3RyaW5nLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgc3ltYm9sOiBzdHJpbmcsXHJcbiAgICBtaW50ZXJTZXQ6IElNaW50ZXJTZXRcclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVhdGVORlRBc3NldFBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBuYW1lLFxyXG4gICAgICBzeW1ib2wsXHJcbiAgICAgIG1pbnRlclNldFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJjcmVhdGVORlRBc3NldFwiXHJcbiAgICBmcm9tID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbSwgY2FsbGVyKVxyXG4gICAgaWYgKHR5cGVvZiBmcm9tICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtc1tcImZyb21cIl0gPSBmcm9tXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjaGFuZ2VBZGRyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJzZUFkZHJlc3MoY2hhbmdlQWRkcikgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXHJcbiAgICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmNyZWF0ZU5GVEFzc2V0OiBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCJcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgICAgcGFyYW1zW1wiY2hhbmdlQWRkclwiXSA9IGNoYW5nZUFkZHJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0uY3JlYXRlTkZUQXNzZXRcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYXNzZXRJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIHRvIG1pbnQgbW9yZSBvZiBhbiBhc3NldC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbW91bnQgVGhlIHVuaXRzIG9mIHRoZSBhc3NldCB0byBtaW50XHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIElEIG9mIHRoZSBhc3NldCB0byBtaW50XHJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIHRvIGFzc2lnbiB0aGUgdW5pdHMgb2YgdGhlIG1pbnRlZCBhc3NldFxyXG4gICAqIEBwYXJhbSBtaW50ZXJzIEFkZHJlc3NlcyBvZiB0aGUgbWludGVycyByZXNwb25zaWJsZSBmb3Igc2lnbmluZyB0aGUgdHJhbnNhY3Rpb25cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSBiYXNlIDU4IHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdW5zaWduZWQgdHJhbnNhY3Rpb24uXHJcbiAgICovXHJcbiAgbWludCA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgYW1vdW50OiBudW1iZXIgfCBCTixcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlciB8IHN0cmluZyxcclxuICAgIHRvOiBzdHJpbmcsXHJcbiAgICBtaW50ZXJzOiBzdHJpbmdbXVxyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG4gICAgbGV0IGFtbnQ6IEJOXHJcbiAgICBpZiAodHlwZW9mIGFzc2V0SUQgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgYXNzZXQgPSBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhc3NldCA9IGFzc2V0SURcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYW1vdW50ID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGFtbnQgPSBuZXcgQk4oYW1vdW50KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW1udCA9IGFtb3VudFxyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1zOiBNaW50UGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgICAgYW1vdW50OiBhbW50LFxyXG4gICAgICBhc3NldElEOiBhc3NldCxcclxuICAgICAgdG8sXHJcbiAgICAgIG1pbnRlcnNcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5taW50XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1pbnQgbm9uLWZ1bmdpYmxlIHRva2VucyB3aGljaCB3ZXJlIGNyZWF0ZWQgd2l0aCBBVk1BUEkuY3JlYXRlTkZUQXNzZXRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgdXNlciBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZSAoaW4gJEFYQykgZm9yIGFzc2V0IGNyZWF0aW9uXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBmb3IgdGhlIHVzZXIgcGF5aW5nIHRoZSB0cmFuc2FjdGlvbiBmZWUgKGluICRBWEMpIGZvciBhc3NldCBjcmVhdGlvblxyXG4gICAqIEBwYXJhbSBmcm9tIE9wdGlvbmFsLiBBbiBhcnJheSBvZiBhZGRyZXNzZXMgbWFuYWdlZCBieSB0aGUgbm9kZSdzIGtleXN0b3JlIGZvciB0aGlzIGJsb2NrY2hhaW4gd2hpY2ggd2lsbCBmdW5kIHRoaXMgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkciBPcHRpb25hbC4gQW4gYWRkcmVzcyB0byBzZW5kIHRoZSBjaGFuZ2VcclxuICAgKiBAcGFyYW0gYXNzZXRJRCBUaGUgYXNzZXQgaWQgd2hpY2ggaXMgYmVpbmcgc2VudFxyXG4gICAqIEBwYXJhbSB0byBBZGRyZXNzIG9uIFN3YXAtQ2hhaW4gb2YgdGhlIGFjY291bnQgdG8gd2hpY2ggdGhpcyBORlQgaXMgYmVpbmcgc2VudFxyXG4gICAqIEBwYXJhbSBlbmNvZGluZyBPcHRpb25hbC4gIGlzIHRoZSBlbmNvZGluZyBmb3JtYXQgdG8gdXNlIGZvciB0aGUgcGF5bG9hZCBhcmd1bWVudC4gQ2FuIGJlIGVpdGhlciBcImNiNThcIiBvciBcImhleFwiLiBEZWZhdWx0cyB0byBcImhleFwiLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgSUQgb2YgdGhlIHRyYW5zYWN0aW9uXHJcbiAgICovXHJcbiAgbWludE5GVCA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgZnJvbTogc3RyaW5nW10gfCBCdWZmZXJbXSA9IHVuZGVmaW5lZCxcclxuICAgIGNoYW5nZUFkZHI6IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIHBheWxvYWQ6IHN0cmluZyxcclxuICAgIGFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlcixcclxuICAgIHRvOiBzdHJpbmcsXHJcbiAgICBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIlxyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5wYXJzZUFkZHJlc3ModG8pID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXCJFcnJvciAtIEFWTUFQSS5taW50TkZUOiBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCIpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBhc3NldElEICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGFzc2V0ID0gYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXNzZXQgPSBhc3NldElEXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyYW1zOiBNaW50TkZUUGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIGFzc2V0SUQ6IGFzc2V0LFxyXG4gICAgICBwYXlsb2FkLFxyXG4gICAgICB0byxcclxuICAgICAgZW5jb2RpbmdcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsZXI6IHN0cmluZyA9IFwibWludE5GVFwiXHJcbiAgICBmcm9tID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbSwgY2FsbGVyKVxyXG4gICAgaWYgKHR5cGVvZiBmcm9tICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtc1tcImZyb21cIl0gPSBmcm9tXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjaGFuZ2VBZGRyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJzZUFkZHJlc3MoY2hhbmdlQWRkcikgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXCJFcnJvciAtIEFWTUFQSS5taW50TkZUOiBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCIpXHJcbiAgICAgIH1cclxuICAgICAgcGFyYW1zW1wiY2hhbmdlQWRkclwiXSA9IGNoYW5nZUFkZHJcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0ubWludE5GVFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIE5GVCBmcm9tIG9uZSBhY2NvdW50IHRvIGFub3RoZXIgb24gU3dhcC1DaGFpblxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VyIHBheWluZyB0aGUgdHJhbnNhY3Rpb24gZmVlIChpbiAkQVhDKSBmb3IgYXNzZXQgY3JlYXRpb25cclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIGZvciB0aGUgdXNlciBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZSAoaW4gJEFYQykgZm9yIGFzc2V0IGNyZWF0aW9uXHJcbiAgICogQHBhcmFtIGZyb20gT3B0aW9uYWwuIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBtYW5hZ2VkIGJ5IHRoZSBub2RlJ3Mga2V5c3RvcmUgZm9yIHRoaXMgYmxvY2tjaGFpbiB3aGljaCB3aWxsIGZ1bmQgdGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyIE9wdGlvbmFsLiBBbiBhZGRyZXNzIHRvIHNlbmQgdGhlIGNoYW5nZVxyXG4gICAqIEBwYXJhbSBhc3NldElEIFRoZSBhc3NldCBpZCB3aGljaCBpcyBiZWluZyBzZW50XHJcbiAgICogQHBhcmFtIGdyb3VwSUQgVGhlIGdyb3VwIHRoaXMgTkZUIGlzIGlzc3VlZCB0by5cclxuICAgKiBAcGFyYW0gdG8gQWRkcmVzcyBvbiBTd2FwLUNoYWluIG9mIHRoZSBhY2NvdW50IHRvIHdoaWNoIHRoaXMgTkZUIGlzIGJlaW5nIHNlbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIElEIG9mIHRoZSB0cmFuc2FjdGlvblxyXG4gICAqL1xyXG4gIHNlbmRORlQgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIGZyb206IHN0cmluZ1tdIHwgQnVmZmVyW10gPSB1bmRlZmluZWQsXHJcbiAgICBjaGFuZ2VBZGRyOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBhc3NldElEOiBzdHJpbmcgfCBCdWZmZXIsXHJcbiAgICBncm91cElEOiBudW1iZXIsXHJcbiAgICB0bzogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGxldCBhc3NldDogc3RyaW5nXHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhcnNlQWRkcmVzcyh0bykgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcIkVycm9yIC0gQVZNQVBJLnNlbmRORlQ6IEludmFsaWQgYWRkcmVzcyBmb3JtYXRcIilcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGFzc2V0SUQgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgYXNzZXQgPSBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhc3NldCA9IGFzc2V0SURcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJhbXM6IFNlbmRORlRQYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYXNzZXRJRDogYXNzZXQsXHJcbiAgICAgIGdyb3VwSUQsXHJcbiAgICAgIHRvXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FsbGVyOiBzdHJpbmcgPSBcInNlbmRORlRcIlxyXG4gICAgZnJvbSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KGZyb20sIGNhbGxlcilcclxuICAgIGlmICh0eXBlb2YgZnJvbSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXNbXCJmcm9tXCJdID0gZnJvbVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2hhbmdlQWRkciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGNoYW5nZUFkZHIpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiRXJyb3IgLSBBVk1BUEkuc2VuZE5GVDogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiKVxyXG4gICAgICB9XHJcbiAgICAgIHBhcmFtc1tcImNoYW5nZUFkZHJcIl0gPSBjaGFuZ2VBZGRyXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLnNlbmRORlRcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0cyB0aGUgcHJpdmF0ZSBrZXkgZm9yIGFuIGFkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIG5hbWUgb2YgdGhlIHVzZXIgd2l0aCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHVzZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyB3aG9zZSBwcml2YXRlIGtleSBzaG91bGQgYmUgZXhwb3J0ZWRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCB0aGUgZGVjcnlwdGVkIHByaXZhdGUga2V5IGFzIHN0b3JlIGluIHRoZSBkYXRhYmFzZVxyXG4gICAqL1xyXG4gIGV4cG9ydEtleSA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgYWRkcmVzczogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5wYXJzZUFkZHJlc3MoYWRkcmVzcykgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcIkVycm9yIC0gQVZNQVBJLmV4cG9ydEtleTogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1zOiBFeHBvcnRLZXlQYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYWRkcmVzc1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmV4cG9ydEtleVwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5wcml2YXRlS2V5XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbXBvcnRzIGEgcHJpdmF0ZSBrZXkgaW50byB0aGUgbm9kZSdzIGtleXN0b3JlIHVuZGVyIGFuIHVzZXIgYW5kIGZvciBhIGJsb2NrY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIG5hbWUgb2YgdGhlIHVzZXIgdG8gc3RvcmUgdGhlIHByaXZhdGUga2V5XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0aGF0IHVubG9ja3MgdGhlIHVzZXJcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5IGluIHRoZSB2bSdzIGZvcm1hdFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGFkZHJlc3MgZm9yIHRoZSBpbXBvcnRlZCBwcml2YXRlIGtleS5cclxuICAgKi9cclxuICBpbXBvcnRLZXkgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIHByaXZhdGVLZXk6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEltcG9ydEtleVBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBwcml2YXRlS2V5XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0uaW1wb3J0S2V5XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgQU5UIChBeGlhIE5hdGl2ZSBUb2tlbikgYXNzZXRzIGluY2x1ZGluZyBBWEMgZnJvbSB0aGUgU3dhcC1DaGFpbiB0byBhbiBhY2NvdW50IG9uIHRoZSBDb3JlLUNoYWluIG9yIEFYLUNoYWluLlxyXG4gICAqXHJcbiAgICogQWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCwgeW91IG11c3QgY2FsbCB0aGUgQ29yZS1DaGFpbidzIGBpbXBvcnRgIG9yIHRoZSBBWC1DaGFpbuKAmXMgYGltcG9ydGAgbWV0aG9kIHRvIGNvbXBsZXRlIHRoZSB0cmFuc2Zlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBDb3JlLUNoYWluIG9yIEFYLUNoYWluIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhY2NvdW50IG9uIHRoZSBDb3JlLUNoYWluIG9yIEFYLUNoYWluIHRvIHNlbmQgdGhlIGFzc2V0IHRvLlxyXG4gICAqIEBwYXJhbSBhbW91bnQgQW1vdW50IG9mIGFzc2V0IHRvIGV4cG9ydCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0IGlkIHdoaWNoIGlzIGJlaW5nIHNlbnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRyYW5zYWN0aW9uIGlkXHJcbiAgICovXHJcbiAgZXhwb3J0ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICB0bzogc3RyaW5nLFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydFBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0byxcclxuICAgICAgYW1vdW50OiBhbW91bnQsXHJcbiAgICAgIGFzc2V0SURcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5leHBvcnRcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBBTlQgKEF4aWEgTmF0aXZlIFRva2VuKSBhc3NldHMgaW5jbHVkaW5nIEFYQyBmcm9tIGFuIGFjY291bnQgb24gdGhlIENvcmUtQ2hhaW4gb3IgQVgtQ2hhaW4gdG8gYW4gYWRkcmVzcyBvbiB0aGUgU3dhcC1DaGFpbi4gVGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIG11c3QgYmUgc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCB0aGF0IHRoZSBhc3NldCBpcyBzZW50IGZyb20gYW5kIHdoaWNoIHBheXNcclxuICAgKiB0aGUgdHJhbnNhY3Rpb24gZmVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHRvIFRoZSBhZGRyZXNzIG9mIHRoZSBhY2NvdW50IHRoZSBhc3NldCBpcyBzZW50IHRvLlxyXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBUaGUgY2hhaW5JRCB3aGVyZSB0aGUgZnVuZHMgYXJlIGNvbWluZyBmcm9tLiBFeDogXCJBWFwiXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciBhIHN0cmluZyBmb3IgdGhlIHRyYW5zYWN0aW9uLCB3aGljaCBzaG91bGQgYmUgc2VudCB0byB0aGUgbmV0d29ya1xyXG4gICAqIGJ5IGNhbGxpbmcgaXNzdWVUeC5cclxuICAgKi9cclxuICBpbXBvcnQgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIHRvOiBzdHJpbmcsXHJcbiAgICBzb3VyY2VDaGFpbjogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogSW1wb3J0UGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIHRvLFxyXG4gICAgICBzb3VyY2VDaGFpblxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmltcG9ydFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMaXN0cyBhbGwgdGhlIGFkZHJlc3NlcyB1bmRlciBhIHVzZXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXIgdG8gbGlzdCBhZGRyZXNzZXNcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSB1c2VyIHRvIGxpc3QgdGhlIGFkZHJlc3Nlc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBvZiBhbiBhcnJheSBvZiBhZGRyZXNzIHN0cmluZ3MgaW4gdGhlIGZvcm1hdCBzcGVjaWZpZWQgYnkgdGhlIGJsb2NrY2hhaW4uXHJcbiAgICovXHJcbiAgbGlzdEFkZHJlc3NlcyA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmdbXT4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBMaXN0QWRkcmVzc2VzUGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmRcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5saXN0QWRkcmVzc2VzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3Nlc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIGFsbCBhc3NldHMgZm9yIGFuIGFkZHJlc3Mgb24gYSBzZXJ2ZXIgYW5kIHRoZWlyIGFzc29jaWF0ZWQgYmFsYW5jZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyB0byBnZXQgYSBsaXN0IG9mIGFzc2V0c1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBvZiBhbiBvYmplY3QgbWFwcGluZyBhc3NldElEIHN0cmluZ3Mgd2l0aCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSBiYWxhbmNlIGZvciB0aGUgYWRkcmVzcyBvbiB0aGUgYmxvY2tjaGFpbi5cclxuICAgKi9cclxuICBnZXRBbGxCYWxhbmNlcyA9IGFzeW5jIChhZGRyZXNzOiBzdHJpbmcpOiBQcm9taXNlPG9iamVjdFtdPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3MpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5nZXRBbGxCYWxhbmNlczogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhcmFtczogR2V0QWxsQmFsYW5jZXNQYXJhbXMgPSB7XHJcbiAgICAgIGFkZHJlc3NcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5nZXRBbGxCYWxhbmNlc1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5iYWxhbmNlc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIGFuIGFzc2V0cyBuYW1lIGFuZCBzeW1ib2wuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXNzZXRJRCBFaXRoZXIgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvciBhbiBiNTggc2VyaWFsaXplZCBzdHJpbmcgZm9yIHRoZSBBc3NldElEIG9yIGl0cyBhbGlhcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIG9iamVjdCB3aXRoIGtleXMgXCJuYW1lXCIgYW5kIFwic3ltYm9sXCIuXHJcbiAgICovXHJcbiAgZ2V0QXNzZXREZXNjcmlwdGlvbiA9IGFzeW5jIChcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlciB8IHN0cmluZ1xyXG4gICk6IFByb21pc2U8R2V0QXNzZXREZXNjcmlwdGlvblJlc3BvbnNlPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG4gICAgaWYgKHR5cGVvZiBhc3NldElEICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGFzc2V0ID0gYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXNzZXQgPSBhc3NldElEXHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldEFzc2V0RGVzY3JpcHRpb25QYXJhbXMgPSB7XHJcbiAgICAgIGFzc2V0SUQ6IGFzc2V0XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0uZ2V0QXNzZXREZXNjcmlwdGlvblwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IHJlc3BvbnNlLmRhdGEucmVzdWx0Lm5hbWUsXHJcbiAgICAgIHN5bWJvbDogcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3ltYm9sLFxyXG4gICAgICBhc3NldElEOiBiaW50b29scy5jYjU4RGVjb2RlKHJlc3BvbnNlLmRhdGEucmVzdWx0LmFzc2V0SUQpLFxyXG4gICAgICBkZW5vbWluYXRpb246IHBhcnNlSW50KHJlc3BvbnNlLmRhdGEucmVzdWx0LmRlbm9taW5hdGlvbiwgMTApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB0cmFuc2FjdGlvbiBkYXRhIG9mIGEgcHJvdmlkZWQgdHJhbnNhY3Rpb24gSUQgYnkgY2FsbGluZyB0aGUgbm9kZSdzIGBnZXRUeGAgbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHR4SUQgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNhY3Rpb24gSURcclxuICAgKiBAcGFyYW0gZW5jb2Rpbmcgc2V0cyB0aGUgZm9ybWF0IG9mIHRoZSByZXR1cm5lZCB0cmFuc2FjdGlvbi4gQ2FuIGJlLCBcImNiNThcIiwgXCJoZXhcIiBvciBcImpzb25cIi4gRGVmYXVsdHMgdG8gXCJjYjU4XCIuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgb3Igb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGJ5dGVzIHJldHJpZXZlZCBmcm9tIHRoZSBub2RlXHJcbiAgICovXHJcbiAgZ2V0VHggPSBhc3luYyAoXHJcbiAgICB0eElEOiBzdHJpbmcsXHJcbiAgICBlbmNvZGluZzogc3RyaW5nID0gXCJjYjU4XCJcclxuICApOiBQcm9taXNlPHN0cmluZyB8IG9iamVjdD4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRUeFBhcmFtcyA9IHtcclxuICAgICAgdHhJRCxcclxuICAgICAgZW5jb2RpbmdcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5nZXRUeFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdHVzIG9mIGEgcHJvdmlkZWQgdHJhbnNhY3Rpb24gSUQgYnkgY2FsbGluZyB0aGUgbm9kZSdzIGBnZXRUeFN0YXR1c2AgbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHR4SUQgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhbnNhY3Rpb24gSURcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSBzdGF0dXMgcmV0cmlldmVkIGZyb20gdGhlIG5vZGVcclxuICAgKi9cclxuICBnZXRUeFN0YXR1cyA9IGFzeW5jICh0eElEOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRUeFN0YXR1c1BhcmFtcyA9IHtcclxuICAgICAgdHhJRFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmdldFR4U3RhdHVzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN0YXR1c1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSBVVFhPcyByZWxhdGVkIHRvIHRoZSBhZGRyZXNzZXMgcHJvdmlkZWQgZnJvbSB0aGUgbm9kZSdzIGBnZXRVVFhPc2AgbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMgY2I1OCBzdHJpbmdzIG9yIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfXNcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gQSBzdHJpbmcgZm9yIHRoZSBjaGFpbiB0byBsb29rIGZvciB0aGUgVVRYTydzLiBEZWZhdWx0IGlzIHRvIHVzZSB0aGlzIGNoYWluLCBidXQgaWYgZXhwb3J0ZWQgVVRYT3MgZXhpc3QgZnJvbSBvdGhlciBjaGFpbnMsIHRoaXMgY2FuIHVzZWQgdG8gcHVsbCB0aGVtIGluc3RlYWQuXHJcbiAgICogQHBhcmFtIGxpbWl0IE9wdGlvbmFsLiBSZXR1cm5zIGF0IG1vc3QgW2xpbWl0XSBhZGRyZXNzZXMuIElmIFtsaW1pdF0gPT0gMCBvciA+IFttYXhVVFhPc1RvRmV0Y2hdLCBmZXRjaGVzIHVwIHRvIFttYXhVVFhPc1RvRmV0Y2hdLlxyXG4gICAqIEBwYXJhbSBzdGFydEluZGV4IE9wdGlvbmFsLiBbU3RhcnRJbmRleF0gZGVmaW5lcyB3aGVyZSB0byBzdGFydCBmZXRjaGluZyBVVFhPcyAoZm9yIHBhZ2luYXRpb24uKVxyXG4gICAqIFVUWE9zIGZldGNoZWQgYXJlIGZyb20gYWRkcmVzc2VzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5BZGRyZXNzXVxyXG4gICAqIEZvciBhZGRyZXNzIFtTdGFydEluZGV4LkFkZHJlc3NdLCBvbmx5IFVUWE9zIHdpdGggSURzIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5VdHhvXSB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAqIEBwYXJhbSBwZXJzaXN0T3B0cyBPcHRpb25zIGF2YWlsYWJsZSB0byBwZXJzaXN0IHRoZXNlIFVUWE9zIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgKlxyXG4gICAqIEByZW1hcmtzXHJcbiAgICogcGVyc2lzdE9wdHMgaXMgb3B0aW9uYWwgYW5kIG11c3QgYmUgb2YgdHlwZSBbW1BlcnNpc3RhbmNlT3B0aW9uc11dXHJcbiAgICpcclxuICAgKi9cclxuICBnZXRVVFhPcyA9IGFzeW5jIChcclxuICAgIGFkZHJlc3Nlczogc3RyaW5nW10gfCBzdHJpbmcsXHJcbiAgICBzb3VyY2VDaGFpbjogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgbGltaXQ6IG51bWJlciA9IDAsXHJcbiAgICBzdGFydEluZGV4OiB7IGFkZHJlc3M6IHN0cmluZzsgdXR4bzogc3RyaW5nIH0gPSB1bmRlZmluZWQsXHJcbiAgICBwZXJzaXN0T3B0czogUGVyc2lzdGFuY2VPcHRpb25zID0gdW5kZWZpbmVkXHJcbiAgKTogUHJvbWlzZTxHZXRVVFhPc1Jlc3BvbnNlPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGFkZHJlc3NlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBhZGRyZXNzZXMgPSBbYWRkcmVzc2VzXVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0VVRYT3NQYXJhbXMgPSB7XHJcbiAgICAgIGFkZHJlc3NlczogYWRkcmVzc2VzLFxyXG4gICAgICBsaW1pdFxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBzdGFydEluZGV4ICE9PSBcInVuZGVmaW5lZFwiICYmIHN0YXJ0SW5kZXgpIHtcclxuICAgICAgcGFyYW1zLnN0YXJ0SW5kZXggPSBzdGFydEluZGV4XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDaGFpbiAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXMuc291cmNlQ2hhaW4gPSBzb3VyY2VDaGFpblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5nZXRVVFhPc1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIGNvbnN0IHV0eG9zOiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLnJlc3VsdC51dHhvc1xyXG4gICAgaWYgKHBlcnNpc3RPcHRzICYmIHR5cGVvZiBwZXJzaXN0T3B0cyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICBpZiAodGhpcy5kYi5oYXMocGVyc2lzdE9wdHMuZ2V0TmFtZSgpKSkge1xyXG4gICAgICAgIGNvbnN0IHNlbGZBcnJheTogc3RyaW5nW10gPSB0aGlzLmRiLmdldChwZXJzaXN0T3B0cy5nZXROYW1lKCkpXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZkFycmF5KSkge1xyXG4gICAgICAgICAgdXR4b3MuYWRkQXJyYXkoZGF0YSlcclxuICAgICAgICAgIGNvbnN0IHV0eG9TZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgICB1dHhvU2V0LmFkZEFycmF5KHNlbGZBcnJheSlcclxuICAgICAgICAgIHV0eG9TZXQubWVyZ2VCeVJ1bGUodXR4b3MsIHBlcnNpc3RPcHRzLmdldE1lcmdlUnVsZSgpKVxyXG4gICAgICAgICAgZGF0YSA9IHV0eG9TZXQuZ2V0QWxsVVRYT1N0cmluZ3MoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRiLnNldChwZXJzaXN0T3B0cy5nZXROYW1lKCksIGRhdGEsIHBlcnNpc3RPcHRzLmdldE92ZXJ3cml0ZSgpKVxyXG4gICAgfVxyXG4gICAgdXR4b3MuYWRkQXJyYXkoZGF0YSwgZmFsc2UpXHJcbiAgICByZXNwb25zZS5kYXRhLnJlc3VsdC51dHhvcyA9IHV0eG9zXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcywgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMsIGFuZCBbW1RyYW5zZmVyT3BlcmF0aW9uXV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IG9mIEFzc2V0SUQgdG8gYmUgc3BlbnQgaW4gaXRzIHNtYWxsZXN0IGRlbm9taW5hdGlvbiwgcmVwcmVzZW50ZWQgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0uXHJcbiAgICogQHBhcmFtIGFzc2V0SUQgVGhlIGFzc2V0SUQgb2YgdGhlIHZhbHVlIGJlaW5nIHNlbnRcclxuICAgKiBAcGFyYW0gdG9BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB0byBzZW5kIHRoZSBmdW5kc1xyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBmdW5kcyBmcm9tIHRoZSBVVFhPcyBwcm92aWRlZFxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPc1xyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIENCNTggQnVmZmVyIG9yIFN0cmluZyB3aGljaCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gKFtbVW5zaWduZWRUeF1dKSB3aGljaCBjb250YWlucyBhIFtbQmFzZVR4XV0uXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIFRoaXMgaGVscGVyIGV4aXN0cyBiZWNhdXNlIHRoZSBlbmRwb2ludCBBUEkgc2hvdWxkIGJlIHRoZSBwcmltYXJ5IHBvaW50IG9mIGVudHJ5IGZvciBtb3N0IGZ1bmN0aW9uYWxpdHkuXHJcbiAgICovXHJcbiAgYnVpbGRCYXNlVHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGFzc2V0SUQ6IEJ1ZmZlciB8IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIHRvQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJidWlsZEJhc2VUeFwiXHJcbiAgICBjb25zdCB0bzogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheSh0b0FkZHJlc3NlcywgY2FsbGVyKS5tYXAoXHJcbiAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpXHJcbiAgICApXHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KGZyb21BZGRyZXNzZXMsIGNhbGxlcikubWFwKFxyXG4gICAgICAoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKVxyXG4gICAgKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIGNhbGxlclxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBhc3NldElEID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGFzc2V0SUQgPSBiaW50b29scy5jYjU4RGVjb2RlKGFzc2V0SUQpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1lbW8gaW5zdGFuY2VvZiBQYXlsb2FkQmFzZSkge1xyXG4gICAgICBtZW1vID0gbWVtby5nZXRQYXlsb2FkKClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXR3b3JrSUQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxyXG4gICAgY29uc3QgYmxvY2tjaGFpbklEQnVmOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKHRoaXMuYmxvY2tjaGFpbklEKVxyXG4gICAgY29uc3QgZmVlOiBCTiA9IHRoaXMuZ2V0VHhGZWUoKVxyXG4gICAgY29uc3QgZmVlQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRCYXNlVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklEQnVmLFxyXG4gICAgICBhbW91bnQsXHJcbiAgICAgIGFzc2V0SUQsXHJcbiAgICAgIHRvLFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIGZlZSxcclxuICAgICAgZmVlQXNzZXRJRCxcclxuICAgICAgbWVtbyxcclxuICAgICAgYXNPZixcclxuICAgICAgbG9ja3RpbWUsXHJcbiAgICAgIHRocmVzaG9sZFxyXG4gICAgKVxyXG5cclxuICAgIGlmICghKGF3YWl0IHRoaXMuY2hlY2tHb29zZUVnZyhidWlsdFVuc2lnbmVkVHgpKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgR29vc2VFZ2dDaGVja0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRCYXNlVHg6RmFpbGVkIEdvb3NlIEVnZyBDaGVja1wiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhbiB1bnNpZ25lZCBORlQgVHJhbnNmZXIuIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcywgYW5kIFtbVHJhbnNmZXJPcGVyYXRpb25dXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHV0eG9zZXQgIEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgTkZUXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIE5GVCBmcm9tIHRoZSB1dHhvSUQgcHJvdmlkZWRcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3NcclxuICAgKiBAcGFyYW0gdXR4b2lkIEEgYmFzZTU4IHV0eG9JRCBvciBhbiBhcnJheSBvZiBiYXNlNTggdXR4b0lEcyBmb3IgdGhlIG5mdHMgdGhpcyB0cmFuc2FjdGlvbiBpcyBzZW5kaW5nXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgQ0I1OCBCdWZmZXIgb3IgU3RyaW5nIHdoaWNoIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gbG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiAoW1tVbnNpZ25lZFR4XV0pIHdoaWNoIGNvbnRhaW5zIGEgW1tORlRUcmFuc2ZlclR4XV0uXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIFRoaXMgaGVscGVyIGV4aXN0cyBiZWNhdXNlIHRoZSBlbmRwb2ludCBBUEkgc2hvdWxkIGJlIHRoZSBwcmltYXJ5IHBvaW50IG9mIGVudHJ5IGZvciBtb3N0IGZ1bmN0aW9uYWxpdHkuXHJcbiAgICovXHJcbiAgYnVpbGRORlRUcmFuc2ZlclR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIHRvQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIHV0eG9pZDogc3RyaW5nIHwgc3RyaW5nW10sXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCBjYWxsZXI6IHN0cmluZyA9IFwiYnVpbGRORlRUcmFuc2ZlclR4XCJcclxuICAgIGNvbnN0IHRvOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KHRvQWRkcmVzc2VzLCBjYWxsZXIpLm1hcChcclxuICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSlcclxuICAgIClcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbUFkZHJlc3NlcywgY2FsbGVyKS5tYXAoXHJcbiAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpXHJcbiAgICApXHJcbiAgICBjb25zdCBjaGFuZ2U6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyxcclxuICAgICAgY2FsbGVyXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuXHJcbiAgICBpZiAobWVtbyBpbnN0YW5jZW9mIFBheWxvYWRCYXNlKSB7XHJcbiAgICAgIG1lbW8gPSBtZW1vLmdldFBheWxvYWQoKVxyXG4gICAgfVxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuXHJcbiAgICBsZXQgdXR4b2lkQXJyYXk6IHN0cmluZ1tdID0gW11cclxuICAgIGlmICh0eXBlb2YgdXR4b2lkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHV0eG9pZEFycmF5ID0gW3V0eG9pZF1cclxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh1dHhvaWQpKSB7XHJcbiAgICAgIHV0eG9pZEFycmF5ID0gdXR4b2lkXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZE5GVFRyYW5zZmVyVHgoXHJcbiAgICAgIHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKSxcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRCksXHJcbiAgICAgIHRvLFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIHV0eG9pZEFycmF5LFxyXG4gICAgICB0aGlzLmdldFR4RmVlKCksXHJcbiAgICAgIGF4Y0Fzc2V0SUQsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIGFzT2YsXHJcbiAgICAgIGxvY2t0aW1lLFxyXG4gICAgICB0aHJlc2hvbGRcclxuICAgIClcclxuXHJcbiAgICBpZiAoIShhd2FpdCB0aGlzLmNoZWNrR29vc2VFZ2coYnVpbHRVbnNpZ25lZFR4KSkpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEdvb3NlRWdnQ2hlY2tFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkTkZUVHJhbnNmZXJUeDpGYWlsZWQgR29vc2UgRWdnIENoZWNrXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBidWlsdFVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFuIHVuc2lnbmVkIEltcG9ydCBUeC4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zLCBhbmQgW1tUcmFuc2Zlck9wZXJhdGlvbl1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXR4b3NldCAgQSBzZXQgb2YgVVRYT3MgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgYnVpbHQgb25cclxuICAgKiBAcGFyYW0gb3duZXJBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIGltcG9ydFxyXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBUaGUgY2hhaW5pZCBmb3Igd2hlcmUgdGhlIGltcG9ydCBpcyBjb21pbmcgZnJvbVxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRvIHNlbmQgdGhlIGZ1bmRzXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHByb3ZpZGVkXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgQ0I1OCBCdWZmZXIgb3IgU3RyaW5nIHdoaWNoIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gbG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgT3B0aW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCBVVFhPXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiAoW1tVbnNpZ25lZFR4XV0pIHdoaWNoIGNvbnRhaW5zIGEgW1tJbXBvcnRUeF1dLlxyXG4gICAqXHJcbiAgICogQHJlbWFya3NcclxuICAgKiBUaGlzIGhlbHBlciBleGlzdHMgYmVjYXVzZSB0aGUgZW5kcG9pbnQgQVBJIHNob3VsZCBiZSB0aGUgcHJpbWFyeSBwb2ludCBvZiBlbnRyeSBmb3IgbW9zdCBmdW5jdGlvbmFsaXR5LlxyXG4gICAqL1xyXG4gIGJ1aWxkSW1wb3J0VHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgb3duZXJBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgc291cmNlQ2hhaW46IEJ1ZmZlciB8IHN0cmluZyxcclxuICAgIHRvQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJidWlsZEltcG9ydFR4XCJcclxuICAgIGNvbnN0IHRvOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KHRvQWRkcmVzc2VzLCBjYWxsZXIpLm1hcChcclxuICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSlcclxuICAgIClcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbUFkZHJlc3NlcywgY2FsbGVyKS5tYXAoXHJcbiAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpXHJcbiAgICApXHJcbiAgICBjb25zdCBjaGFuZ2U6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyxcclxuICAgICAgY2FsbGVyXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuXHJcbiAgICBsZXQgc3JheENoYWluOiBzdHJpbmcgPSB1bmRlZmluZWRcclxuXHJcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZEltcG9ydFR4OiBTb3VyY2UgQ2hhaW5JRCBpcyB1bmRlZmluZWQuXCJcclxuICAgICAgKVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlQ2hhaW4gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgc3JheENoYWluID0gc291cmNlQ2hhaW5cclxuICAgICAgc291cmNlQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKHNvdXJjZUNoYWluKVxyXG4gICAgfSBlbHNlIGlmICghKHNvdXJjZUNoYWluIGluc3RhbmNlb2YgQnVmZmVyKSkge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRJbXBvcnRUeDogSW52YWxpZCBkZXN0aW5hdGlvbkNoYWluIHR5cGU6IFwiICtcclxuICAgICAgICAgIHR5cGVvZiBzb3VyY2VDaGFpblxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXRvbWljVVRYT3M6IFVUWE9TZXQgPSAoXHJcbiAgICAgIGF3YWl0IHRoaXMuZ2V0VVRYT3Mob3duZXJBZGRyZXNzZXMsIHNyYXhDaGFpbiwgMCwgdW5kZWZpbmVkKVxyXG4gICAgKS51dHhvc1xyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuICAgIGNvbnN0IGF0b21pY3M6IFVUWE9bXSA9IGF0b21pY1VUWE9zLmdldEFsbFVUWE9zKClcclxuXHJcbiAgICBpZiAoYXRvbWljcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhyb3cgbmV3IE5vQXRvbWljVVRYT3NFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkSW1wb3J0VHg6IE5vIGF0b21pYyBVVFhPcyB0byBpbXBvcnQgZnJvbSBcIiArXHJcbiAgICAgICAgICBzcmF4Q2hhaW4gK1xyXG4gICAgICAgICAgXCIgdXNpbmcgYWRkcmVzc2VzOiBcIiArXHJcbiAgICAgICAgICBvd25lckFkZHJlc3Nlcy5qb2luKFwiLCBcIilcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZEltcG9ydFR4KFxyXG4gICAgICB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpLFxyXG4gICAgICB0byxcclxuICAgICAgZnJvbSxcclxuICAgICAgY2hhbmdlLFxyXG4gICAgICBhdG9taWNzLFxyXG4gICAgICBzb3VyY2VDaGFpbixcclxuICAgICAgdGhpcy5nZXRUeEZlZSgpLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcblxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZEltcG9ydFR4OkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgRXhwb3J0IFR4LiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcywgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMsIGFuZCBbW1RyYW5zZmVyT3BlcmF0aW9uXV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIGFtb3VudCBUaGUgYW1vdW50IGJlaW5nIGV4cG9ydGVkIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gZGVzdGluYXRpb25DaGFpbiBUaGUgY2hhaW5pZCBmb3Igd2hlcmUgdGhlIGFzc2V0cyB3aWxsIGJlIHNlbnQuXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3MgcHJvdmlkZWRcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3NcclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBDQjU4IEJ1ZmZlciBvciBTdHJpbmcgd2hpY2ggY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHRocmVzaG9sZCBPcHRpb25hbC4gVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIHNwZW5kIHRoZSBmdW5kcyBpbiB0aGUgcmVzdWx0YW50IFVUWE9cclxuICAgKiBAcGFyYW0gYXNzZXRJRCBPcHRpb25hbC4gVGhlIGFzc2V0SUQgb2YgdGhlIGFzc2V0IHRvIHNlbmQuIERlZmF1bHRzIHRvIEFYQyBhc3NldElELlxyXG4gICAqIFJlZ2FyZGxlc3Mgb2YgdGhlIGFzc2V0IHdoaWNoIHlvdVwicmUgZXhwb3J0aW5nLCBhbGwgZmVlcyBhcmUgcGFpZCBpbiBBWEMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiAoW1tVbnNpZ25lZFR4XV0pIHdoaWNoIGNvbnRhaW5zIGFuIFtbRXhwb3J0VHhdXS5cclxuICAgKi9cclxuICBidWlsZEV4cG9ydFR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIGFtb3VudDogQk4sXHJcbiAgICBkZXN0aW5hdGlvbkNoYWluOiBCdWZmZXIgfCBzdHJpbmcsXHJcbiAgICB0b0FkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGNoYW5nZUFkZHJlc3Nlczogc3RyaW5nW10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxLFxyXG4gICAgYXNzZXRJRDogc3RyaW5nID0gdW5kZWZpbmVkXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCBwcmVmaXhlczogb2JqZWN0ID0ge31cclxuICAgIHRvQWRkcmVzc2VzLm1hcCgoYTogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICAgIHByZWZpeGVzW2Euc3BsaXQoXCItXCIpWzBdXSA9IHRydWVcclxuICAgIH0pXHJcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlZml4ZXMpLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRFeHBvcnRUeDogVG8gYWRkcmVzc2VzIG11c3QgaGF2ZSB0aGUgc2FtZSBjaGFpbklEIHByZWZpeC5cIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZEV4cG9ydFR4OiBEZXN0aW5hdGlvbiBDaGFpbklEIGlzIHVuZGVmaW5lZC5cIlxyXG4gICAgICApXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0aW5hdGlvbkNoYWluID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGRlc3RpbmF0aW9uQ2hhaW4gPSBiaW50b29scy5jYjU4RGVjb2RlKGRlc3RpbmF0aW9uQ2hhaW4pIC8vXHJcbiAgICB9IGVsc2UgaWYgKCEoZGVzdGluYXRpb25DaGFpbiBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcclxuICAgICAgdGhyb3cgbmV3IENoYWluSWRFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkRXhwb3J0VHg6IEludmFsaWQgZGVzdGluYXRpb25DaGFpbiB0eXBlOiBcIiArXHJcbiAgICAgICAgICB0eXBlb2YgZGVzdGluYXRpb25DaGFpblxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZiAoZGVzdGluYXRpb25DaGFpbi5sZW5ndGggIT09IDMyKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZEV4cG9ydFR4OiBEZXN0aW5hdGlvbiBDaGFpbklEIG11c3QgYmUgMzIgYnl0ZXMgaW4gbGVuZ3RoLlwiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0bzogQnVmZmVyW10gPSBbXVxyXG4gICAgdG9BZGRyZXNzZXMubWFwKChhOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgdG8ucHVzaChiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJidWlsZEV4cG9ydFR4XCJcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbUFkZHJlc3NlcywgY2FsbGVyKS5tYXAoXHJcbiAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpXHJcbiAgICApXHJcblxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIGNhbGxlclxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcblxyXG4gICAgaWYgKG1lbW8gaW5zdGFuY2VvZiBQYXlsb2FkQmFzZSkge1xyXG4gICAgICBtZW1vID0gbWVtby5nZXRQYXlsb2FkKClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgaWYgKHR5cGVvZiBhc3NldElEID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGFzc2V0SUQgPSBiaW50b29scy5jYjU4RW5jb2RlKGF4Y0Fzc2V0SUQpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRClcclxuICAgIGNvbnN0IGFzc2V0SURCdWY6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoYXNzZXRJRClcclxuICAgIGNvbnN0IGZlZTogQk4gPSB0aGlzLmdldFR4RmVlKClcclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRFeHBvcnRUeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIGFtb3VudCxcclxuICAgICAgYXNzZXRJREJ1ZixcclxuICAgICAgdG8sXHJcbiAgICAgIGZyb20sXHJcbiAgICAgIGNoYW5nZSxcclxuICAgICAgZGVzdGluYXRpb25DaGFpbixcclxuICAgICAgZmVlLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcblxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZEV4cG9ydFR4OkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhbiB1bnNpZ25lZCB0cmFuc2FjdGlvbi4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zLCBhbmQgW1tUcmFuc2Zlck9wZXJhdGlvbl1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXR4b3NldCBBIHNldCBvZiBVVFhPcyB0aGF0IHRoZSB0cmFuc2FjdGlvbiBpcyBidWlsdCBvblxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBmdW5kcyBmcm9tIHRoZSBVVFhPcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB0aGF0IGNhbiBzcGVuZCB0aGUgY2hhbmdlIHJlbWFpbmluZyBmcm9tIHRoZSBzcGVudCBVVFhPc1xyXG4gICAqIEBwYXJhbSBpbml0aWFsU3RhdGUgVGhlIFtbSW5pdGlhbFN0YXRlc11dIHRoYXQgcmVwcmVzZW50IHRoZSBpbnRpYWwgc3RhdGUgb2YgYSBjcmVhdGVkIGFzc2V0XHJcbiAgICogQHBhcmFtIG5hbWUgU3RyaW5nIGZvciB0aGUgZGVzY3JpcHRpdmUgbmFtZSBvZiB0aGUgYXNzZXRcclxuICAgKiBAcGFyYW0gc3ltYm9sIFN0cmluZyBmb3IgdGhlIHRpY2tlciBzeW1ib2wgb2YgdGhlIGFzc2V0XHJcbiAgICogQHBhcmFtIGRlbm9taW5hdGlvbiBOdW1iZXIgZm9yIHRoZSBkZW5vbWluYXRpb24gd2hpY2ggaXMgMTBeRC4gRCBtdXN0IGJlID49IDAgYW5kIDw9IDMyLiBFeDogJDEgQVhDID0gMTBeOSAkbkFYQ1xyXG4gICAqIEBwYXJhbSBtaW50T3V0cHV0cyBPcHRpb25hbC4gQXJyYXkgb2YgW1tTRUNQTWludE91dHB1dF1dcyB0byBiZSBpbmNsdWRlZCBpbiB0aGUgdHJhbnNhY3Rpb24uIFRoZXNlIG91dHB1dHMgY2FuIGJlIHNwZW50IHRvIG1pbnQgbW9yZSB0b2tlbnMuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgQ0I1OCBCdWZmZXIgb3IgU3RyaW5nIHdoaWNoIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYSBbW0NyZWF0ZUFzc2V0VHhdXS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGJ1aWxkQ3JlYXRlQXNzZXRUeCA9IGFzeW5jIChcclxuICAgIHV0eG9zZXQ6IFVUWE9TZXQsXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGNoYW5nZUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBpbml0aWFsU3RhdGVzOiBJbml0aWFsU3RhdGVzLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgc3ltYm9sOiBzdHJpbmcsXHJcbiAgICBkZW5vbWluYXRpb246IG51bWJlcixcclxuICAgIG1pbnRPdXRwdXRzOiBTRUNQTWludE91dHB1dFtdID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogUGF5bG9hZEJhc2UgfCBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKVxyXG4gICk6IFByb21pc2U8VW5zaWduZWRUeD4gPT4ge1xyXG4gICAgY29uc3QgY2FsbGVyOiBzdHJpbmcgPSBcImJ1aWxkQ3JlYXRlQXNzZXRUeFwiXHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KGZyb21BZGRyZXNzZXMsIGNhbGxlcikubWFwKFxyXG4gICAgICAoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKVxyXG4gICAgKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIGNhbGxlclxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcblxyXG4gICAgaWYgKG1lbW8gaW5zdGFuY2VvZiBQYXlsb2FkQmFzZSkge1xyXG4gICAgICBtZW1vID0gbWVtby5nZXRQYXlsb2FkKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3ltYm9sLmxlbmd0aCA+IEFWTUNvbnN0YW50cy5TWU1CT0xNQVhMRU4pIHtcclxuICAgICAgdGhyb3cgbmV3IFN5bWJvbEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRDcmVhdGVBc3NldFR4OiBTeW1ib2xzIG1heSBub3QgZXhjZWVkIGxlbmd0aCBvZiBcIiArXHJcbiAgICAgICAgICBBVk1Db25zdGFudHMuU1lNQk9MTUFYTEVOXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGlmIChuYW1lLmxlbmd0aCA+IEFWTUNvbnN0YW50cy5BU1NFVE5BTUVMRU4pIHtcclxuICAgICAgdGhyb3cgbmV3IE5hbWVFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkQ3JlYXRlQXNzZXRUeDogTmFtZXMgbWF5IG5vdCBleGNlZWQgbGVuZ3RoIG9mIFwiICtcclxuICAgICAgICAgIEFWTUNvbnN0YW50cy5BU1NFVE5BTUVMRU5cclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgY29uc3QgZmVlOiBCTiA9IHRoaXMuZ2V0RGVmYXVsdENyZWF0aW9uVHhGZWUoKVxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZENyZWF0ZUFzc2V0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIGluaXRpYWxTdGF0ZXMsXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIHN5bWJvbCxcclxuICAgICAgZGVub21pbmF0aW9uLFxyXG4gICAgICBtaW50T3V0cHV0cyxcclxuICAgICAgZmVlLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mXHJcbiAgICApXHJcblxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCwgZmVlKSkpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEdvb3NlRWdnQ2hlY2tFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkQ3JlYXRlQXNzZXRUeDpGYWlsZWQgR29vc2UgRWdnIENoZWNrXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBidWlsdFVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIGJ1aWxkU0VDUE1pbnRUeCA9IGFzeW5jIChcclxuICAgIHV0eG9zZXQ6IFVUWE9TZXQsXHJcbiAgICBtaW50T3duZXI6IFNFQ1BNaW50T3V0cHV0LFxyXG4gICAgdHJhbnNmZXJPd25lcjogU0VDUFRyYW5zZmVyT3V0cHV0LFxyXG4gICAgZnJvbUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgbWludFVUWE9JRDogc3RyaW5nLFxyXG4gICAgbWVtbzogUGF5bG9hZEJhc2UgfCBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKVxyXG4gICk6IFByb21pc2U8YW55PiA9PiB7XHJcbiAgICBjb25zdCBjYWxsZXI6IHN0cmluZyA9IFwiYnVpbGRTRUNQTWludFR4XCJcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbUFkZHJlc3NlcywgY2FsbGVyKS5tYXAoXHJcbiAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpXHJcbiAgICApXHJcbiAgICBjb25zdCBjaGFuZ2U6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyxcclxuICAgICAgY2FsbGVyXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuXHJcbiAgICBpZiAobWVtbyBpbnN0YW5jZW9mIFBheWxvYWRCYXNlKSB7XHJcbiAgICAgIG1lbW8gPSBtZW1vLmdldFBheWxvYWQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgY29uc3QgZmVlOiBCTiA9IHRoaXMuZ2V0TWludFR4RmVlKClcclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRTRUNQTWludFR4KFxyXG4gICAgICBuZXR3b3JrSUQsXHJcbiAgICAgIGJsb2NrY2hhaW5JRCxcclxuICAgICAgbWludE93bmVyLFxyXG4gICAgICB0cmFuc2Zlck93bmVyLFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIG1pbnRVVFhPSUQsXHJcbiAgICAgIGZlZSxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgbWVtbyxcclxuICAgICAgYXNPZlxyXG4gICAgKVxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIEFWTUFQSS5idWlsZFNFQ1BNaW50VHg6RmFpbGVkIEdvb3NlIEVnZyBDaGVja1wiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIHJldHVybiBidWlsdFVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gdW5zaWduZWQgdHJhbnNhY3Rpb24uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gbWFudWFsbHkgKHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBbW1RyYW5zZmVyYWJsZUlucHV0XV1zLCBbW1RyYW5zZmVyYWJsZU91dHB1dF1dcywgYW5kIFtbVHJhbnNmZXJPcGVyYXRpb25dXXMpLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHV0eG9zZXQgQSBzZXQgb2YgVVRYT3MgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgYnVpbHQgb25cclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3Mge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3NcclxuICAgKiBAcGFyYW0gbWludGVyU2V0cyBpcyBhIGxpc3Qgd2hlcmUgZWFjaCBlbGVtZW50IHNwZWNpZmllcyB0aGF0IHRocmVzaG9sZCBvZiB0aGUgYWRkcmVzc2VzIGluIG1pbnRlcnMgbWF5IHRvZ2V0aGVyIG1pbnQgbW9yZSBvZiB0aGUgYXNzZXQgYnkgc2lnbmluZyBhIG1pbnRpbmcgdHJhbnNhY3Rpb25cclxuICAgKiBAcGFyYW0gbmFtZSBTdHJpbmcgZm9yIHRoZSBkZXNjcmlwdGl2ZSBuYW1lIG9mIHRoZSBhc3NldFxyXG4gICAqIEBwYXJhbSBzeW1ib2wgU3RyaW5nIGZvciB0aGUgdGlja2VyIHN5bWJvbCBvZiB0aGUgYXNzZXRcclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBDQjU4IEJ1ZmZlciBvciBTdHJpbmcgd2hpY2ggY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBtaW50IG91dHB1dFxyXG4gICAqXHJcbiAgICogYGBganNcclxuICAgKiBFeGFtcGxlIG1pbnRlclNldHM6XHJcbiAgICogW1xyXG4gICAqICAgICAge1xyXG4gICAqICAgICAgICAgIFwibWludGVyc1wiOltcclxuICAgKiAgICAgICAgICAgICAgXCJTd2FwLWF4YzFnaHN0anVrcnR3ODkzNWxyeXF0bmg2NDN4ZTlhOTR1M3RjNzVjN1wiXHJcbiAgICogICAgICAgICAgXSxcclxuICAgKiAgICAgICAgICBcInRocmVzaG9sZFwiOiAxXHJcbiAgICogICAgICB9LFxyXG4gICAqICAgICAge1xyXG4gICAqICAgICAgICAgIFwibWludGVyc1wiOiBbXHJcbiAgICogICAgICAgICAgICAgIFwiU3dhcC1heGMxeWVsbDNlNG5sbjBtMzljZnBkaGdxcHJzZDg3amtoNHFuYWtrbHhcIixcclxuICAgKiAgICAgICAgICAgICAgXCJTd2FwLWF4YzFrNG5yMjZjODBqYXF1em05MzY5ajVhNHNobXdjam4wdm1lbWNqelwiLFxyXG4gICAqICAgICAgICAgICAgICBcIlN3YXAtYXhjMXp0a3pzcmpua24wY2VrNXJ5dmhxc3dkdGNnMjNuaGdlM25ucjVlXCJcclxuICAgKiAgICAgICAgICBdLFxyXG4gICAqICAgICAgICAgIFwidGhyZXNob2xkXCI6IDJcclxuICAgKiAgICAgIH1cclxuICAgKiBdXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiAoW1tVbnNpZ25lZFR4XV0pIHdoaWNoIGNvbnRhaW5zIGEgW1tDcmVhdGVBc3NldFR4XV0uXHJcbiAgICpcclxuICAgKi9cclxuICBidWlsZENyZWF0ZU5GVEFzc2V0VHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgZnJvbUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgbWludGVyU2V0czogTWludGVyU2V0W10sXHJcbiAgICBuYW1lOiBzdHJpbmcsXHJcbiAgICBzeW1ib2w6IHN0cmluZyxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJidWlsZENyZWF0ZU5GVEFzc2V0VHhcIlxyXG4gICAgY29uc3QgZnJvbTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShmcm9tQWRkcmVzc2VzLCBjYWxsZXIpLm1hcChcclxuICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSlcclxuICAgIClcclxuICAgIGNvbnN0IGNoYW5nZTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgY2hhbmdlQWRkcmVzc2VzLFxyXG4gICAgICBjYWxsZXJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5hbWUubGVuZ3RoID4gQVZNQ29uc3RhbnRzLkFTU0VUTkFNRUxFTikge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgTmFtZUVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRDcmVhdGVORlRBc3NldFR4OiBOYW1lcyBtYXkgbm90IGV4Y2VlZCBsZW5ndGggb2YgXCIgK1xyXG4gICAgICAgICAgQVZNQ29uc3RhbnRzLkFTU0VUTkFNRUxFTlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZiAoc3ltYm9sLmxlbmd0aCA+IEFWTUNvbnN0YW50cy5TWU1CT0xNQVhMRU4pIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IFN5bWJvbEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRDcmVhdGVORlRBc3NldFR4OiBTeW1ib2xzIG1heSBub3QgZXhjZWVkIGxlbmd0aCBvZiBcIiArXHJcbiAgICAgICAgICBBVk1Db25zdGFudHMuU1lNQk9MTUFYTEVOXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICBjb25zdCBjcmVhdGlvblR4RmVlOiBCTiA9IHRoaXMuZ2V0Q3JlYXRpb25UeEZlZSgpXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZENyZWF0ZU5GVEFzc2V0VHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIG1pbnRlclNldHMsXHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIHN5bWJvbCxcclxuICAgICAgY3JlYXRpb25UeEZlZSxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgbWVtbyxcclxuICAgICAgYXNPZixcclxuICAgICAgbG9ja3RpbWVcclxuICAgIClcclxuICAgIGlmICghKGF3YWl0IHRoaXMuY2hlY2tHb29zZUVnZyhidWlsdFVuc2lnbmVkVHgsIGNyZWF0aW9uVHhGZWUpKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgR29vc2VFZ2dDaGVja0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBBVk1BUEkuYnVpbGRDcmVhdGVORlRBc3NldFR4OkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcywgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMsIGFuZCBbW1RyYW5zZmVyT3BlcmF0aW9uXV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0ICBBIHNldCBvZiBVVFhPcyB0aGF0IHRoZSB0cmFuc2FjdGlvbiBpcyBidWlsdCBvblxyXG4gICAqIEBwYXJhbSBvd25lcnMgRWl0aGVyIGEgc2luZ2xlIG9yIGFuIGFycmF5IG9mIFtbT3V0cHV0T3duZXJzXV0gdG8gc2VuZCB0aGUgbmZ0IG91dHB1dFxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBzZW5kIHRoZSBORlQgZnJvbSB0aGUgdXR4b0lEIHByb3ZpZGVkXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIHV0eG9pZCBBIGJhc2U1OCB1dHhvSUQgb3IgYW4gYXJyYXkgb2YgYmFzZTU4IHV0eG9JRHMgZm9yIHRoZSBuZnQgbWludCBvdXRwdXQgdGhpcyB0cmFuc2FjdGlvbiBpcyBzZW5kaW5nXHJcbiAgICogQHBhcmFtIGdyb3VwSUQgT3B0aW9uYWwuIFRoZSBncm91cCB0aGlzIE5GVCBpcyBpc3N1ZWQgdG8uXHJcbiAgICogQHBhcmFtIHBheWxvYWQgT3B0aW9uYWwuIERhdGEgZm9yIE5GVCBQYXlsb2FkIGFzIGVpdGhlciBhIFtbUGF5bG9hZEJhc2VdXSBvciBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgQ0I1OCBCdWZmZXIgb3IgU3RyaW5nIHdoaWNoIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYW4gW1tPcGVyYXRpb25UeF1dLlxyXG4gICAqXHJcbiAgICovXHJcbiAgYnVpbGRDcmVhdGVORlRNaW50VHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgb3duZXJzOiBPdXRwdXRPd25lcnNbXSB8IE91dHB1dE93bmVycyxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIHV0eG9pZDogc3RyaW5nIHwgc3RyaW5nW10sXHJcbiAgICBncm91cElEOiBudW1iZXIgPSAwLFxyXG4gICAgcGF5bG9hZDogUGF5bG9hZEJhc2UgfCBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpXHJcbiAgKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICAgIGNvbnN0IGNhbGxlcjogc3RyaW5nID0gXCJidWlsZENyZWF0ZU5GVE1pbnRUeFwiXHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KGZyb21BZGRyZXNzZXMsIGNhbGxlcikubWFwKFxyXG4gICAgICAoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKVxyXG4gICAgKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIGNhbGxlclxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcblxyXG4gICAgaWYgKG1lbW8gaW5zdGFuY2VvZiBQYXlsb2FkQmFzZSkge1xyXG4gICAgICBtZW1vID0gbWVtby5nZXRQYXlsb2FkKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGF5bG9hZCBpbnN0YW5jZW9mIFBheWxvYWRCYXNlKSB7XHJcbiAgICAgIHBheWxvYWQgPSBwYXlsb2FkLmdldFBheWxvYWQoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdXR4b2lkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHV0eG9pZCA9IFt1dHhvaWRdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuXHJcbiAgICBpZiAob3duZXJzIGluc3RhbmNlb2YgT3V0cHV0T3duZXJzKSB7XHJcbiAgICAgIG93bmVycyA9IFtvd25lcnNdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRClcclxuICAgIGNvbnN0IHR4RmVlOiBCTiA9IHRoaXMuZ2V0VHhGZWUoKVxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZENyZWF0ZU5GVE1pbnRUeChcclxuICAgICAgbmV0d29ya0lELFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIG93bmVycyxcclxuICAgICAgZnJvbSxcclxuICAgICAgY2hhbmdlLFxyXG4gICAgICB1dHhvaWQsXHJcbiAgICAgIGdyb3VwSUQsXHJcbiAgICAgIHBheWxvYWQsXHJcbiAgICAgIHR4RmVlLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mXHJcbiAgICApXHJcbiAgICBpZiAoIShhd2FpdCB0aGlzLmNoZWNrR29vc2VFZ2coYnVpbHRVbnNpZ25lZFR4KSkpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEdvb3NlRWdnQ2hlY2tFcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmJ1aWxkQ3JlYXRlTkZUTWludFR4OkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZnVuY3Rpb24gd2hpY2ggdGFrZXMgYW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gYW5kIHNpZ25zIGl0LCByZXR1cm5pbmcgdGhlIHJlc3VsdGluZyBbW1R4XV0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXR4IFRoZSB1bnNpZ25lZCB0cmFuc2FjdGlvbiBvZiB0eXBlIFtbVW5zaWduZWRUeF1dXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHNpZ25lZCB0cmFuc2FjdGlvbiBvZiB0eXBlIFtbVHhdXVxyXG4gICAqL1xyXG4gIHNpZ25UeCA9ICh1dHg6IFVuc2lnbmVkVHgpOiBUeCA9PiB1dHguc2lnbih0aGlzLmtleWNoYWluKVxyXG5cclxuICAvKipcclxuICAgKiBDYWxscyB0aGUgbm9kZSdzIGlzc3VlVHggbWV0aG9kIGZyb20gdGhlIEFQSSBhbmQgcmV0dXJucyB0aGUgcmVzdWx0aW5nIHRyYW5zYWN0aW9uIElEIGFzIGEgc3RyaW5nLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHR4IEEgc3RyaW5nLCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSwgb3IgW1tUeF1dIHJlcHJlc2VudGluZyBhIHRyYW5zYWN0aW9uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIFByb21pc2Ugc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdHJhbnNhY3Rpb24gSUQgb2YgdGhlIHBvc3RlZCB0cmFuc2FjdGlvbi5cclxuICAgKi9cclxuICBpc3N1ZVR4ID0gYXN5bmMgKHR4OiBzdHJpbmcgfCBCdWZmZXIgfCBUeCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBsZXQgVHJhbnNhY3Rpb24gPSBcIlwiXHJcbiAgICBpZiAodHlwZW9mIHR4ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIFRyYW5zYWN0aW9uID0gdHhcclxuICAgIH0gZWxzZSBpZiAodHggaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgY29uc3QgdHhvYmo6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHhvYmouZnJvbUJ1ZmZlcih0eClcclxuICAgICAgVHJhbnNhY3Rpb24gPSB0eG9iai50b1N0cmluZygpXHJcbiAgICB9IGVsc2UgaWYgKHR4IGluc3RhbmNlb2YgVHgpIHtcclxuICAgICAgVHJhbnNhY3Rpb24gPSB0eC50b1N0cmluZygpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgVHJhbnNhY3Rpb25FcnJvcihcclxuICAgICAgICBcIkVycm9yIC0gQVZNQVBJLmlzc3VlVHg6IHByb3ZpZGVkIHR4IGlzIG5vdCBleHBlY3RlZCB0eXBlIG9mIHN0cmluZywgQnVmZmVyLCBvciBUeFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhcmFtczogSXNzdWVUeFBhcmFtcyA9IHtcclxuICAgICAgdHg6IFRyYW5zYWN0aW9uLnRvU3RyaW5nKClcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5pc3N1ZVR4XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHRoZSBub2RlJ3MgZ2V0QWRkcmVzc1R4cyBtZXRob2QgZnJvbSB0aGUgQVBJIGFuZCByZXR1cm5zIHRyYW5zYWN0aW9ucyBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm92aWRlZCBhZGRyZXNzIGFuZCBhc3NldElEXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBmb3Igd2hpY2ggd2UncmUgZmV0Y2hpbmcgcmVsYXRlZCB0cmFuc2FjdGlvbnMuXHJcbiAgICogQHBhcmFtIGN1cnNvciBQYWdlIG51bWJlciBvciBvZmZzZXQuXHJcbiAgICogQHBhcmFtIHBhZ2VTaXplICBOdW1iZXIgb2YgaXRlbXMgdG8gcmV0dXJuIHBlciBwYWdlLiBPcHRpb25hbC4gRGVmYXVsdHMgdG8gMTAyNC4gSWYgW3BhZ2VTaXplXSA9PSAwIG9yIFtwYWdlU2l6ZV0gPiBbbWF4UGFnZVNpemVdLCB0aGVuIGl0IGZldGNoZXMgYXQgbWF4IFttYXhQYWdlU2l6ZV0gdHJhbnNhY3Rpb25zXHJcbiAgICogQHBhcmFtIGFzc2V0SUQgT25seSByZXR1cm4gdHJhbnNhY3Rpb25zIHRoYXQgY2hhbmdlZCB0aGUgYmFsYW5jZSBvZiB0aGlzIGFzc2V0LiBNdXN0IGJlIGFuIElEIG9yIGFuIGFsaWFzIGZvciBhbiBhc3NldC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBvZiB0cmFuc2FjdGlvbiBJRHMgYW5kIHBhZ2Ugb2Zmc2V0XHJcbiAgICovXHJcbiAgZ2V0QWRkcmVzc1R4cyA9IGFzeW5jIChcclxuICAgIGFkZHJlc3M6IHN0cmluZyxcclxuICAgIGN1cnNvcjogbnVtYmVyLFxyXG4gICAgcGFnZVNpemU6IG51bWJlciB8IHVuZGVmaW5lZCxcclxuICAgIGFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlclxyXG4gICk6IFByb21pc2U8R2V0QWRkcmVzc1R4c1Jlc3BvbnNlPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG4gICAgbGV0IHBhZ2VTaXplTnVtOiBudW1iZXJcclxuXHJcbiAgICBpZiAodHlwZW9mIGFzc2V0SUQgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgYXNzZXQgPSBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhc3NldCA9IGFzc2V0SURcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhZ2VTaXplICE9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIHBhZ2VTaXplTnVtID0gMFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFnZVNpemVOdW0gPSBwYWdlU2l6ZVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0QWRkcmVzc1R4c1BhcmFtcyA9IHtcclxuICAgICAgYWRkcmVzcyxcclxuICAgICAgY3Vyc29yLFxyXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemVOdW0sXHJcbiAgICAgIGFzc2V0SUQ6IGFzc2V0XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLmdldEFkZHJlc3NUeHNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmRzIGFuIGFtb3VudCBvZiBhc3NldElEIHRvIHRoZSBzcGVjaWZpZWQgYWRkcmVzcyBmcm9tIGEgbGlzdCBvZiBvd25lZCBvZiBhZGRyZXNzZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXIgdGhhdCBvd25zIHRoZSBwcml2YXRlIGtleXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBgZnJvbWAgYWRkcmVzc2VzXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB1bmxvY2tpbmcgdGhlIHVzZXJcclxuICAgKiBAcGFyYW0gYXNzZXRJRCBUaGUgYXNzZXRJRCBvZiB0aGUgYXNzZXQgdG8gc2VuZFxyXG4gICAqIEBwYXJhbSBhbW91bnQgVGhlIGFtb3VudCBvZiB0aGUgYXNzZXQgdG8gYmUgc2VudFxyXG4gICAqIEBwYXJhbSB0byBUaGUgYWRkcmVzcyBvZiB0aGUgcmVjaXBpZW50XHJcbiAgICogQHBhcmFtIGZyb20gT3B0aW9uYWwuIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBtYW5hZ2VkIGJ5IHRoZSBub2RlJ3Mga2V5c3RvcmUgZm9yIHRoaXMgYmxvY2tjaGFpbiB3aGljaCB3aWxsIGZ1bmQgdGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyIE9wdGlvbmFsLiBBbiBhZGRyZXNzIHRvIHNlbmQgdGhlIGNoYW5nZVxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiBDQjU4IEJ1ZmZlciBvciBTdHJpbmcgd2hpY2ggY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIHRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0cmFuc2FjdGlvbidzIElELlxyXG4gICAqL1xyXG4gIHNlbmQgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIGFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlcixcclxuICAgIGFtb3VudDogbnVtYmVyIHwgQk4sXHJcbiAgICB0bzogc3RyaW5nLFxyXG4gICAgZnJvbTogc3RyaW5nW10gfCBCdWZmZXJbXSA9IHVuZGVmaW5lZCxcclxuICAgIGNoYW5nZUFkZHI6IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IHN0cmluZyB8IEJ1ZmZlciA9IHVuZGVmaW5lZFxyXG4gICk6IFByb21pc2U8U2VuZFJlc3BvbnNlPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG4gICAgbGV0IGFtbnQ6IEJOXHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnBhcnNlQWRkcmVzcyh0bykgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcIkVycm9yIC0gQVZNQVBJLnNlbmQ6IEludmFsaWQgYWRkcmVzcyBmb3JtYXRcIilcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGFzc2V0SUQgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgYXNzZXQgPSBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhc3NldCA9IGFzc2V0SURcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYW1vdW50ID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIGFtbnQgPSBuZXcgQk4oYW1vdW50KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYW1udCA9IGFtb3VudFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogU2VuZFBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgIGFzc2V0SUQ6IGFzc2V0LFxyXG4gICAgICBhbW91bnQ6IGFtbnQudG9TdHJpbmcoMTApLFxyXG4gICAgICB0bzogdG9cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsZXI6IHN0cmluZyA9IFwic2VuZFwiXHJcbiAgICBmcm9tID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbSwgY2FsbGVyKVxyXG4gICAgaWYgKHR5cGVvZiBmcm9tICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtc1tcImZyb21cIl0gPSBmcm9tXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBjaGFuZ2VBZGRyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJzZUFkZHJlc3MoY2hhbmdlQWRkcikgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXCJFcnJvciAtIEFWTUFQSS5zZW5kOiBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCIpXHJcbiAgICAgIH1cclxuICAgICAgcGFyYW1zW1wiY2hhbmdlQWRkclwiXSA9IGNoYW5nZUFkZHJcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG1lbW8gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgaWYgKHR5cGVvZiBtZW1vICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgcGFyYW1zW1wibWVtb1wiXSA9IGJpbnRvb2xzLmNiNThFbmNvZGUobWVtbylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYXJhbXNbXCJtZW1vXCJdID0gbWVtb1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdm0uc2VuZFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZHMgYW4gYW1vdW50IG9mIGFzc2V0SUQgdG8gYW4gYXJyYXkgb2Ygc3BlY2lmaWVkIGFkZHJlc3NlcyBmcm9tIGEgbGlzdCBvZiBvd25lZCBvZiBhZGRyZXNzZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXIgdGhhdCBvd25zIHRoZSBwcml2YXRlIGtleXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBgZnJvbWAgYWRkcmVzc2VzXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB1bmxvY2tpbmcgdGhlIHVzZXJcclxuICAgKiBAcGFyYW0gc2VuZE91dHB1dHMgVGhlIGFycmF5IG9mIFNlbmRPdXRwdXRzLiBBIFNlbmRPdXRwdXQgaXMgYW4gb2JqZWN0IGxpdGVyYWwgd2hpY2ggY29udGFpbnMgYW4gYXNzZXRJRCwgYW1vdW50LCBhbmQgdG8uXHJcbiAgICogQHBhcmFtIGZyb20gT3B0aW9uYWwuIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBtYW5hZ2VkIGJ5IHRoZSBub2RlJ3Mga2V5c3RvcmUgZm9yIHRoaXMgYmxvY2tjaGFpbiB3aGljaCB3aWxsIGZ1bmQgdGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyIE9wdGlvbmFsLiBBbiBhZGRyZXNzIHRvIHNlbmQgdGhlIGNoYW5nZVxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsLiBDQjU4IEJ1ZmZlciBvciBTdHJpbmcgd2hpY2ggY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIHRoZSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0cmFuc2FjdGlvblwicyBJRC5cclxuICAgKi9cclxuICBzZW5kTXVsdGlwbGUgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIHNlbmRPdXRwdXRzOiB7XHJcbiAgICAgIGFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlclxyXG4gICAgICBhbW91bnQ6IG51bWJlciB8IEJOXHJcbiAgICAgIHRvOiBzdHJpbmdcclxuICAgIH1bXSxcclxuICAgIGZyb206IHN0cmluZ1tdIHwgQnVmZmVyW10gPSB1bmRlZmluZWQsXHJcbiAgICBjaGFuZ2VBZGRyOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBzdHJpbmcgfCBCdWZmZXIgPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPFNlbmRNdWx0aXBsZVJlc3BvbnNlPiA9PiB7XHJcbiAgICBsZXQgYXNzZXQ6IHN0cmluZ1xyXG4gICAgbGV0IGFtbnQ6IEJOXHJcbiAgICBjb25zdCBzT3V0cHV0czogU091dHB1dHNQYXJhbXNbXSA9IFtdXHJcblxyXG4gICAgc2VuZE91dHB1dHMuZm9yRWFjaChcclxuICAgICAgKG91dHB1dDoge1xyXG4gICAgICAgIGFzc2V0SUQ6IHN0cmluZyB8IEJ1ZmZlclxyXG4gICAgICAgIGFtb3VudDogbnVtYmVyIHwgQk5cclxuICAgICAgICB0bzogc3RyaW5nXHJcbiAgICAgIH0pID0+IHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKG91dHB1dC50bykgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFxyXG4gICAgICAgICAgICBcIkVycm9yIC0gQVZNQVBJLnNlbmRNdWx0aXBsZTogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3V0cHV0LmFzc2V0SUQgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgIGFzc2V0ID0gYmludG9vbHMuY2I1OEVuY29kZShvdXRwdXQuYXNzZXRJRClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYXNzZXQgPSBvdXRwdXQuYXNzZXRJRFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIG91dHB1dC5hbW91bnQgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgIGFtbnQgPSBuZXcgQk4ob3V0cHV0LmFtb3VudClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYW1udCA9IG91dHB1dC5hbW91bnRcclxuICAgICAgICB9XHJcbiAgICAgICAgc091dHB1dHMucHVzaCh7XHJcbiAgICAgICAgICB0bzogb3V0cHV0LnRvLFxyXG4gICAgICAgICAgYXNzZXRJRDogYXNzZXQsXHJcbiAgICAgICAgICBhbW91bnQ6IGFtbnQudG9TdHJpbmcoMTApXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogU2VuZE11bHRpcGxlUGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcclxuICAgICAgb3V0cHV0czogc091dHB1dHNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjYWxsZXI6IHN0cmluZyA9IFwic2VuZFwiXHJcbiAgICBmcm9tID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoZnJvbSwgY2FsbGVyKVxyXG4gICAgaWYgKHR5cGVvZiBmcm9tICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5mcm9tID0gZnJvbVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgY2hhbmdlQWRkciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGNoYW5nZUFkZHIpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiRXJyb3IgLSBBVk1BUEkuc2VuZDogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiKVxyXG4gICAgICB9XHJcbiAgICAgIHBhcmFtcy5jaGFuZ2VBZGRyID0gY2hhbmdlQWRkclxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbWVtbyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBpZiAodHlwZW9mIG1lbW8gIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBwYXJhbXMubWVtbyA9IGJpbnRvb2xzLmNiNThFbmNvZGUobWVtbylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYXJhbXMubWVtbyA9IG1lbW9cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXZtLnNlbmRNdWx0aXBsZVwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgVmlydHVhbCBNYWNoaW5l4oCZcyBnZW5lc2lzIHN0YXRlLCBjcmVhdGUgdGhlIGJ5dGUgcmVwcmVzZW50YXRpb24gb2YgdGhhdCBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBnZW5lc2lzRGF0YSBUaGUgYmxvY2tjaGFpbidzIGdlbmVzaXMgZGF0YSBvYmplY3RcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2YgYSBzdHJpbmcgb2YgYnl0ZXNcclxuICAgKi9cclxuICBidWlsZEdlbmVzaXMgPSBhc3luYyAoZ2VuZXNpc0RhdGE6IG9iamVjdCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEJ1aWxkR2VuZXNpc1BhcmFtcyA9IHtcclxuICAgICAgZ2VuZXNpc0RhdGFcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImF2bS5idWlsZEdlbmVzaXNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYnl0ZXNcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEBpZ25vcmVcclxuICAgKi9cclxuICBwcm90ZWN0ZWQgX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgYWRkcmVzc2VzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdLFxyXG4gICAgY2FsbGVyOiBzdHJpbmdcclxuICApOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBhZGRyczogc3RyaW5nW10gPSBbXVxyXG4gICAgY29uc3QgY2hhaW5JRDogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgICA/IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgICAgOiB0aGlzLmdldEJsb2NrY2hhaW5JRCgpXHJcbiAgICBpZiAoYWRkcmVzc2VzICYmIGFkZHJlc3Nlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhZGRyZXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFkZHJlc3Nlc1tgJHtpfWBdID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnBhcnNlQWRkcmVzcyhhZGRyZXNzZXNbYCR7aX1gXSBhcyBzdHJpbmcpID09PVxyXG4gICAgICAgICAgICBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEFkZHJlc3NFcnJvcihcclxuICAgICAgICAgICAgICBcIkVycm9yIC0gQVZNQVBJLiR7Y2FsbGVyfTogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGFkZHJzLnB1c2goYWRkcmVzc2VzW2Ake2l9YF0gYXMgc3RyaW5nKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcclxuICAgICAgICAgIGFkZHJzLnB1c2goXHJcbiAgICAgICAgICAgIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKFxyXG4gICAgICAgICAgICAgIGFkZHJlc3Nlc1tgJHtpfWBdIGFzIEJ1ZmZlcixcclxuICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgIHRoaXMuY29yZS5nZXRIUlAoKSxcclxuICAgICAgICAgICAgICBjaGFpbklEXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhZGRyc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseS4gSW5zdGVhZCB1c2UgdGhlIFtbQXhpYS5hZGRBUGAke0l9YF1dIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb3JlIEEgcmVmZXJlbmNlIHRvIHRoZSBBeGlhIGNsYXNzXHJcbiAgICogQHBhcmFtIGJhc2VVUkwgRGVmYXVsdHMgdG8gdGhlIHN0cmluZyBcIi9leHQvYmMvU3dhcFwiIGFzIHRoZSBwYXRoIHRvIGJsb2NrY2hhaW4ncyBiYXNlVVJMXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBUaGUgQmxvY2tjaGFpblwicyBJRC4gRGVmYXVsdHMgdG8gYW4gZW1wdHkgc3RyaW5nOiBcIlwiXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBjb3JlOiBBeGlhQ29yZSxcclxuICAgIGJhc2VVUkw6IHN0cmluZyA9IFwiL2V4dC9iYy9Td2FwXCIsXHJcbiAgICBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiXCJcclxuICApIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxyXG4gICAgY29uc3QgbmV0SUQ6IG51bWJlciA9IGNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGlmIChcclxuICAgICAgbmV0SUQgaW4gRGVmYXVsdHMubmV0d29yayAmJlxyXG4gICAgICBibG9ja2NoYWluSUQgaW4gRGVmYXVsdHMubmV0d29ya1tgJHtuZXRJRH1gXVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IHsgYWxpYXMgfSA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0SUR9YF1bYCR7YmxvY2tjaGFpbklEfWBdXHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBhbGlhcylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMua2V5Y2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5jb3JlLmdldEhSUCgpLCBibG9ja2NoYWluSUQpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==