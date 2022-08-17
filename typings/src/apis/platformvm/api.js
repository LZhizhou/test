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
exports.PlatformVMAPI = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM
 */
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const jrpcapi_1 = require("../../common/jrpcapi");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const keychain_1 = require("./keychain");
const constants_1 = require("../../utils/constants");
const constants_2 = require("./constants");
const tx_1 = require("./tx");
const payload_1 = require("../../utils/payload");
const helperfunctions_1 = require("../../utils/helperfunctions");
const utxos_1 = require("../platformvm/utxos");
const errors_1 = require("../../utils/errors");
const outputs_1 = require("./outputs");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for interacting with a node's PlatformVMAPI
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class PlatformVMAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly.
     * Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/Core" as the path to blockchain's baseURL
     */
    constructor(core, baseURL = "/ext/bc/Core") {
        super(core, baseURL);
        /**
         * @ignore
         */
        this.keychain = new keychain_1.KeyChain("", "");
        this.blockchainID = constants_1.PlatformChainID;
        this.blockchainAlias = undefined;
        this.AXCAssetID = undefined;
        this.txFee = undefined;
        this.creationTxFee = undefined;
        this.minValidatorStake = undefined;
        this.minNominatorStake = undefined;
        /**
         * Gets the alias for the blockchainID if it exists, otherwise returns `undefined`.
         *
         * @returns The alias for the blockchainID
         */
        this.getBlockchainAlias = () => {
            if (typeof this.blockchainAlias === "undefined") {
                const netid = this.core.getNetworkID();
                if (netid in constants_1.Defaults.network &&
                    this.blockchainID in constants_1.Defaults.network[`${netid}`]) {
                    this.blockchainAlias =
                        constants_1.Defaults.network[`${netid}`][this.blockchainID].alias;
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
                typeof constants_1.Defaults.network[`${netid}`] !== "undefined") {
                this.blockchainID = constants_1.PlatformChainID; //default to Core-Chain
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
            return bintools.parseAddress(addr, blockchainID, alias, constants_2.PlatformVMConstants.ADDRESSLENGTH);
        };
        this.addressFromBuffer = (address) => {
            const chainid = this.getBlockchainAlias()
                ? this.getBlockchainAlias()
                : this.getBlockchainID();
            const type = "bech32";
            return serialization.bufferToType(address, type, this.core.getHRP(), chainid);
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
                const assetID = yield this.getStakingAssetID();
                this.AXCAssetID = bintools.cb58Decode(assetID);
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
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["Core"]["txFee"])
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
         * Gets the CreateAllychainTx fee.
         *
         * @returns The CreateAllychainTx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getCreateAllychainTxFee = () => {
            return this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["Core"]["createAllychainTx"])
                : new bn_js_1.default(0);
        };
        /**
         * Gets the CreateChainTx fee.
         *
         * @returns The CreateChainTx fee as a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.getCreateChainTxFee = () => {
            return this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["Core"]["createChainTx"])
                : new bn_js_1.default(0);
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
            return this.core.getNetworkID() in constants_1.Defaults.network
                ? new bn_js_1.default(constants_1.Defaults.network[this.core.getNetworkID()]["Core"]["creationTxFee"])
                : new bn_js_1.default(0);
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
         * @returns The instance of [[]] for this class
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
            let outputTotal = outTotal.gt(new bn_js_1.default(0))
                ? outTotal
                : utx.getOutputTotal(axcAssetID);
            const fee = utx.getBurn(axcAssetID);
            if (fee.lte(constants_1.ONEAXC.mul(new bn_js_1.default(10))) || fee.lte(outputTotal)) {
                return true;
            }
            else {
                return false;
            }
        });
        /**
         * Retrieves an assetID for a allychain"s staking assset.
         *
         * @returns Returns a Promise string with cb58 encoded value of the assetID.
         */
        this.getStakingAssetID = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getStakingAssetID");
            return response.data.result.assetID;
        });
        /**
         * Creates a new blockchain.
         *
         * @param username The username of the Keystore user that controls the new account
         * @param password The password of the Keystore user that controls the new account
         * @param allychainID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an cb58 serialized string for the AllychainID or its alias.
         * @param vmID The ID of the Virtual Machine the blockchain runs. Can also be an alias of the Virtual Machine.
         * @param fxIDs The ids of the FXs the VM is running.
         * @param name A human-readable name for the new blockchain
         * @param genesis The base 58 (with checksum) representation of the genesis state of the new blockchain. Virtual Machines should have a static API method named buildGenesis that can be used to generate genesisData.
         *
         * @returns Promise for the unsigned transaction to create this blockchain. Must be signed by a sufficient number of the Allychain’s control keys and by the account paying the transaction fee.
         */
        this.createBlockchain = (username, password, allychainID = undefined, vmID, fxIDs, name, genesis) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                fxIDs,
                vmID,
                name,
                genesisData: genesis
            };
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            const response = yield this.callMethod("core.createBlockchain", params);
            return response.data.result.txID;
        });
        /**
         * Gets the status of a blockchain.
         *
         * @param blockchainID The blockchainID requesting a status update
         *
         * @returns Promise for a string of one of: "Validating", "Created", "Preferred", "Unknown".
         */
        this.getBlockchainStatus = (blockchainID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                blockchainID
            };
            const response = yield this.callMethod("core.getBlockchainStatus", params);
            return response.data.result.status;
        });
        /**
         * Get the validators and their weights of a allychain or the Primary Network at a given Core-Chain height.
         *
         * @param height The Core-Chain height to get the validator set at.
         * @param allychainID Optional. A cb58 serialized string for the AllychainID or its alias.
         *
         * @returns Promise GetValidatorsAtResponse
         */
        this.getValidatorsAt = (height, allychainID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                height
            };
            if (typeof allychainID !== "undefined") {
                params.allychainID = allychainID;
            }
            const response = yield this.callMethod("core.getValidatorsAt", params);
            return response.data.result;
        });
        /**
         * Create an address in the node's keystore.
         *
         * @param username The username of the Keystore user that controls the new account
         * @param password The password of the Keystore user that controls the new account
         *
         * @returns Promise for a string of the newly created account address.
         */
        this.createAddress = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("core.createAddress", params);
            return response.data.result.address;
        });
        /**
         * Gets the balance of a particular asset.
         *
         * @param address The address to pull the asset balance from
         *
         * @returns Promise with the balance as a {@link https://github.com/indutny/bn.js/|BN} on the provided address.
         */
        this.getBalance = (address) => __awaiter(this, void 0, void 0, function* () {
            if (typeof this.parseAddress(address) === "undefined") {
                /* istanbul ignore next */
                throw new errors_1.AddressError("Error - PlatformVMAPI.getBalance: Invalid address format");
            }
            const params = {
                address
            };
            const response = yield this.callMethod("core.getBalance", params);
            return response.data.result;
        });
        /**
         * List the addresses controlled by the user.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         *
         * @returns Promise for an array of addresses.
         */
        this.listAddresses = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("core.listAddresses", params);
            return response.data.result.addresses;
        });
        /**
         * Lists the set of current validators.
         *
         * @param allychainID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an
         * cb58 serialized string for the AllychainID or its alias.
         * @param nodeIDs Optional. An array of strings
         *
         * @returns Promise for an array of validators that are currently staking, see: {@link https://docs.axc.network/v1.0/en/api/core/#platformgetcurrentvalidators|platform.getCurrentValidators documentation}.
         *
         */
        this.getCurrentValidators = (allychainID = undefined, nodeIDs = undefined) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            if (typeof nodeIDs != "undefined" && nodeIDs.length > 0) {
                params.nodeIDs = nodeIDs;
            }
            const response = yield this.callMethod("core.getCurrentValidators", params);
            return response.data.result;
        });
        /**
         * Lists the set of pending validators.
         *
         * @param allychainID Optional. Either a {@link https://github.com/feross/buffer|Buffer}
         * or a cb58 serialized string for the AllychainID or its alias.
         * @param nodeIDs Optional. An array of strings
         *
         * @returns Promise for an array of validators that are pending staking, see: {@link https://docs.axc.network/v1.0/en/api/platform/#platformgetpendingvalidators|platform.getPendingValidators documentation}.
         *
         */
        this.getPendingValidators = (allychainID = undefined, nodeIDs = undefined) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            if (typeof nodeIDs != "undefined" && nodeIDs.length > 0) {
                params.nodeIDs = nodeIDs;
            }
            const response = yield this.callMethod("core.getPendingValidators", params);
            return response.data.result;
        });
        /**
         * Samples `Size` validators from the current validator set.
         *
         * @param sampleSize Of the total universe of validators, select this many at random
         * @param allychainID Optional. Either a {@link https://github.com/feross/buffer|Buffer} or an
         * cb58 serialized string for the AllychainID or its alias.
         *
         * @returns Promise for an array of validator"s stakingIDs.
         */
        this.sampleValidators = (sampleSize, allychainID = undefined) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                size: sampleSize.toString()
            };
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            const response = yield this.callMethod("core.sampleValidators", params);
            return response.data.result.validators;
        });
        /**
         * Add a validator to the Primary Network.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the validator
         * @param startTime Javascript Date object for the start time to validate
         * @param endTime Javascript Date object for the end time to validate
         * @param stakeAmount The amount of nAXC the validator is staking as
         * a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddress The address the validator reward will go to, if there is one.
         * @param nominationFeeRate Optional. A {@link https://github.com/indutny/bn.js/|BN} for the percent fee this validator
         * charges when others nominate stake to them. Up to 4 decimal places allowed additional decimal places are ignored.
         * Must be between 0 and 100, inclusive. For example, if nominationFeeRate is 1.2345 and someone nominates to this
         * validator, then when the nomination period is over, 1.2345% of the reward goes to the validator and the rest goes
         * to the nominator.
         *
         * @returns Promise for a base58 string of the unsigned transaction.
         */
        this.addValidator = (username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress, nominationFeeRate = undefined) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                nodeID,
                startTime: startTime.getTime() / 1000,
                endTime: endTime.getTime() / 1000,
                stakeAmount: stakeAmount.toString(10),
                rewardAddress
            };
            if (typeof nominationFeeRate !== "undefined") {
                params.nominationFeeRate = nominationFeeRate.toString(10);
            }
            const response = yield this.callMethod("core.addValidator", params);
            return response.data.result.txID;
        });
        /**
         * Add a validator to a Allychain other than the Primary Network. The validator must validate the Primary Network for the entire duration they validate this Allychain.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the validator
         * @param allychainID Either a {@link https://github.com/feross/buffer|Buffer} or a cb58 serialized string for the AllychainID or its alias.
         * @param startTime Javascript Date object for the start time to validate
         * @param endTime Javascript Date object for the end time to validate
         * @param weight The validator’s weight used for sampling
         *
         * @returns Promise for the unsigned transaction. It must be signed (using sign) by the proper number of the Allychain’s control keys and by the key of the account paying the transaction fee before it can be issued.
         */
        this.addAllychainValidator = (username, password, nodeID, allychainID, startTime, endTime, weight) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                nodeID,
                startTime: startTime.getTime() / 1000,
                endTime: endTime.getTime() / 1000,
                weight
            };
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            const response = yield this.callMethod("core.addAllychainValidator", params);
            return response.data.result.txID;
        });
        /**
         * Add a nominator to the Primary Network.
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param nodeID The node ID of the nominate
         * @param startTime Javascript Date object for when the nominator starts nominating
         * @param endTime Javascript Date object for when the nominator starts nominating
         * @param stakeAmount The amount of nAXC the nominator is staking as
         * a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddress The address of the account the staked AXC and validation reward
         * (if applicable) are sent to at endTime
         *
         * @returns Promise for an array of validator"s stakingIDs.
         */
        this.addNominator = (username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                nodeID,
                startTime: startTime.getTime() / 1000,
                endTime: endTime.getTime() / 1000,
                stakeAmount: stakeAmount.toString(10),
                rewardAddress
            };
            const response = yield this.callMethod("core.addNominator", params);
            return response.data.result.txID;
        });
        /**
         * Create an unsigned transaction to create a new Allychain. The unsigned transaction must be
         * signed with the key of the account paying the transaction fee. The Allychain’s ID is the ID of the transaction that creates it (ie the response from issueTx when issuing the signed transaction).
         *
         * @param username The username of the Keystore user
         * @param password The password of the Keystore user
         * @param controlKeys Array of platform addresses as strings
         * @param threshold To add a validator to this Allychain, a transaction must have threshold
         * signatures, where each signature is from a key whose address is an element of `controlKeys`
         *
         * @returns Promise for a string with the unsigned transaction encoded as base58.
         */
        this.createAllychain = (username, password, controlKeys, threshold) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                controlKeys,
                threshold
            };
            const response = yield this.callMethod("core.createAllychain", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Get the Allychain that validates a given blockchain.
         *
         * @param blockchainID Either a {@link https://github.com/feross/buffer|Buffer} or a cb58
         * encoded string for the blockchainID or its alias.
         *
         * @returns Promise for a string of the allychainID that validates the blockchain.
         */
        this.validatedBy = (blockchainID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                blockchainID
            };
            const response = yield this.callMethod("core.validatedBy", params);
            return response.data.result.allychainID;
        });
        /**
         * Get the IDs of the blockchains a Allychain validates.
         *
         * @param allychainID Either a {@link https://github.com/feross/buffer|Buffer} or an AXC
         * serialized string for the AllychainID or its alias.
         *
         * @returns Promise for an array of blockchainIDs the allychain validates.
         */
        this.validates = (allychainID) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                allychainID
            };
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            const response = yield this.callMethod("core.validates", params);
            return response.data.result.blockchainIDs;
        });
        /**
         * Get all the blockchains that exist (excluding the Core-Chain).
         *
         * @returns Promise for an array of objects containing fields "id", "allychainID", and "vmID".
         */
        this.getBlockchains = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getBlockchains");
            return response.data.result.blockchains;
        });
        /**
         * Send AXC from an account on the Core-Chain to an address on the Swap-Chain. This transaction
         * must be signed with the key of the account that the AXC is sent from and which pays the
         * transaction fee. After issuing this transaction, you must call the Swap-Chain’s importAXC
         * method to complete the transfer.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The address on the Swap-Chain to send the AXC to. Do not include Swap- in the address
         * @param amount Amount of AXC to export as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns Promise for an unsigned transaction to be signed by the account the the AXC is
         * sent from and pays the transaction fee.
         */
        this.exportAXC = (username, password, amount, to) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password,
                to,
                amount: amount.toString(10)
            };
            const response = yield this.callMethod("core.exportAXC", params);
            return response.data.result.txID
                ? response.data.result.txID
                : response.data.result;
        });
        /**
         * Send AXC from an account on the Core-Chain to an address on the Swap-Chain. This transaction
         * must be signed with the key of the account that the AXC is sent from and which pays
         * the transaction fee. After issuing this transaction, you must call the Swap-Chain’s
         * importAXC method to complete the transfer.
         *
         * @param username The Keystore user that controls the account specified in `to`
         * @param password The password of the Keystore user
         * @param to The ID of the account the AXC is sent to. This must be the same as the to
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
            const response = yield this.callMethod("core.importAXC", params);
            return response.data.result.txID
                ? response.data.result.txID
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
                throw new errors_1.TransactionError("Error - core.issueTx: provided tx is not expected type of string, Buffer, or Tx");
            }
            const params = {
                tx: Transaction.toString()
            };
            const response = yield this.callMethod("core.issueTx", params);
            return response.data.result.txID;
        });
        /**
         * Returns an upper bound on the amount of tokens that exist. Not monotonically increasing because this number can go down if a staker"s reward is denied.
         */
        this.getCurrentSupply = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getCurrentSupply");
            return new bn_js_1.default(response.data.result.supply, 10);
        });
        /**
         * Returns the height of the platform chain.
         */
        this.getHeight = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getHeight");
            return new bn_js_1.default(response.data.result.height, 10);
        });
        /**
         * Gets the minimum staking amount.
         *
         * @param refresh A boolean to bypass the local cached value of Minimum Stake Amount, polling the node instead.
         */
        this.getMinStake = (refresh = false) => __awaiter(this, void 0, void 0, function* () {
            if (refresh !== true &&
                typeof this.minValidatorStake !== "undefined" &&
                typeof this.minNominatorStake !== "undefined") {
                return {
                    minValidatorStake: this.minValidatorStake,
                    minNominatorStake: this.minNominatorStake
                };
            }
            const response = yield this.callMethod("core.getMinStake");
            this.minValidatorStake = new bn_js_1.default(response.data.result.minValidatorStake, 10);
            this.minNominatorStake = new bn_js_1.default(response.data.result.minNominatorStake, 10);
            return {
                minValidatorStake: this.minValidatorStake,
                minNominatorStake: this.minNominatorStake
            };
        });
        /**
         * getTotalStake() returns the total amount staked on the Primary Network
         *
         * @returns A big number representing total staked by validators on the primary network
         */
        this.getTotalStake = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getTotalStake");
            return new bn_js_1.default(response.data.result.stake, 10);
        });
        /**
         * getMaxStakeAmount() returns the maximum amount of nAXC staking to the named node during the time period.
         *
         * @param allychainID A Buffer or cb58 string representing allychain
         * @param nodeID A string representing ID of the node whose stake amount is required during the given duration
         * @param startTime A big number denoting start time of the duration during which stake amount of the node is required.
         * @param endTime A big number denoting end time of the duration during which stake amount of the node is required.
         * @returns A big number representing total staked by validators on the primary network
         */
        this.getMaxStakeAmount = (allychainID, nodeID, startTime, endTime) => __awaiter(this, void 0, void 0, function* () {
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.gt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("PlatformVMAPI.getMaxStakeAmount -- startTime must be in the past and endTime must come after startTime");
            }
            const params = {
                nodeID,
                startTime,
                endTime
            };
            if (typeof allychainID === "string") {
                params.allychainID = allychainID;
            }
            else if (typeof allychainID !== "undefined") {
                params.allychainID = bintools.cb58Encode(allychainID);
            }
            const response = yield this.callMethod("core.getMaxStakeAmount", params);
            return new bn_js_1.default(response.data.result.amount, 10);
        });
        /**
         * Sets the minimum stake cached in this class.
         * @param minValidatorStake A {@link https://github.com/indutny/bn.js/|BN} to set the minimum stake amount cached in this class.
         * @param minNominatorStake A {@link https://github.com/indutny/bn.js/|BN} to set the minimum nomination amount cached in this class.
         */
        this.setMinStake = (minValidatorStake = undefined, minNominatorStake = undefined) => {
            if (typeof minValidatorStake !== "undefined") {
                this.minValidatorStake = minValidatorStake;
            }
            if (typeof minNominatorStake !== "undefined") {
                this.minNominatorStake = minNominatorStake;
            }
        };
        /**
         * Gets the total amount staked for an array of addresses.
         */
        this.getStake = (addresses, encoding = "cb58") => __awaiter(this, void 0, void 0, function* () {
            const params = {
                addresses,
                encoding
            };
            const response = yield this.callMethod("core.getStake", params);
            return {
                staked: new bn_js_1.default(response.data.result.staked, 10),
                stakedOutputs: response.data.result.stakedOutputs.map((stakedOutput) => {
                    const transferableOutput = new outputs_1.TransferableOutput();
                    let buf;
                    if (encoding === "cb58") {
                        buf = bintools.cb58Decode(stakedOutput);
                    }
                    else {
                        buf = buffer_1.Buffer.from(stakedOutput.replace(/0x/g, ""), "hex");
                    }
                    transferableOutput.fromBuffer(buf, 2);
                    return transferableOutput;
                })
            };
        });
        /**
         * Get all the allychains that exist.
         *
         * @param ids IDs of the allychains to retrieve information about. If omitted, gets all allychains
         *
         * @returns Promise for an array of objects containing fields "id",
         * "controlKeys", and "threshold".
         */
        this.getAllychains = (ids = undefined) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof ids !== undefined) {
                params.ids = ids;
            }
            const response = yield this.callMethod("core.getAllychains", params);
            return response.data.result.allychains;
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
            const params = {
                username,
                password,
                address
            };
            const response = yield this.callMethod("core.exportKey", params);
            return response.data.result.privateKey
                ? response.data.result.privateKey
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
            const response = yield this.callMethod("core.importKey", params);
            return response.data.result.address
                ? response.data.result.address
                : response.data.result;
        });
        /**
         * Returns the treansaction data of a provided transaction ID by calling the node's `getTx` method.
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
            const response = yield this.callMethod("core.getTx", params);
            return response.data.result.tx
                ? response.data.result.tx
                : response.data.result;
        });
        /**
         * Returns the status of a provided transaction ID by calling the node's `getTxStatus` method.
         *
         * @param txid The string representation of the transaction ID
         * @param includeReason Return the reason tx was dropped, if applicable. Defaults to true
         *
         * @returns Returns a Promise string containing the status retrieved from the node and the reason a tx was dropped, if applicable.
         */
        this.getTxStatus = (txid, includeReason = true) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID: txid,
                includeReason: includeReason
            };
            const response = yield this.callMethod("core.getTxStatus", params);
            return response.data.result;
        });
        /**
         * Retrieves the UTXOs related to the addresses provided from the node's `getUTXOs` method.
         *
         * @param addresses An array of addresses as cb58 strings or addresses as {@link https://github.com/feross/buffer|Buffer}s
         * @param sourceChain A string for the chain to look for the UTXO"s. Default is to use this chain, but if exported UTXOs exist from other chains, this can used to pull them instead.
         * @param limit Optional. Returns at most [limit] addresses. If [limit] == 0 or > [maxUTXOsToFetch], fetches up to [maxUTXOsToFetch].
         * @param startIndex Optional. [StartIndex] defines where to start fetching UTXOs (for pagination.)
         * UTXOs fetched are from addresses equal to or greater than [StartIndex.Address]
         * For address [StartIndex.Address], only UTXOs with IDs greater than [StartIndex.Utxo] will be returned.
         * @param persistOpts Options available to persist these UTXOs in local storage
         * @param encoding Optional.  is the encoding format to use for the payload argument. Can be either "cb58" or "hex". Defaults to "hex".
         *
         * @remarks
         * persistOpts is optional and must be of type [[PersistanceOptions]]
         *
         */
        this.getUTXOs = (addresses, sourceChain = undefined, limit = 0, startIndex = undefined, persistOpts = undefined, encoding = "cb58") => __awaiter(this, void 0, void 0, function* () {
            if (typeof addresses === "string") {
                addresses = [addresses];
            }
            const params = {
                addresses: addresses,
                limit,
                encoding
            };
            if (typeof startIndex !== "undefined" && startIndex) {
                params.startIndex = startIndex;
            }
            if (typeof sourceChain !== "undefined") {
                params.sourceChain = sourceChain;
            }
            const response = yield this.callMethod("core.getUTXOs", params);
            const utxos = new utxos_1.UTXOSet();
            let data = response.data.result.utxos;
            if (persistOpts && typeof persistOpts === "object") {
                if (this.db.has(persistOpts.getName())) {
                    const selfArray = this.db.get(persistOpts.getName());
                    if (Array.isArray(selfArray)) {
                        utxos.addArray(data);
                        const self = new utxos_1.UTXOSet();
                        self.addArray(selfArray);
                        self.mergeByRule(utxos, persistOpts.getMergeRule());
                        data = self.getAllUTXOStrings();
                    }
                }
                this.db.set(persistOpts.getName(), data, persistOpts.getOverwrite());
            }
            utxos.addArray(data, false);
            response.data.result.utxos = utxos;
            response.data.result.numFetched = parseInt(response.data.result.numFetched);
            return response.data.result;
        });
        /**
         * Helper function which creates an unsigned Import Tx. For more granular control, you may create your own
         * [[UnsignedTx]] manually (with their corresponding [[TransferableInput]]s, [[TransferableOutput]]s, and [[TransferOperation]]s).
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param ownerAddresses The addresses being used to import
         * @param sourceChain The chainid for where the import is coming from.
         * @param toAddresses The addresses to send the funds
         * @param fromAddresses The addresses being used to send the funds from the UTXOs provided
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
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
            const to = this._cleanAddressArray(toAddresses, "buildBaseTx").map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, "buildBaseTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildBaseTx").map((a) => bintools.stringToAddress(a));
            let sraxChain = undefined;
            if (typeof sourceChain === "undefined") {
                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildImportTx: Source ChainID is undefined.");
            }
            else if (typeof sourceChain === "string") {
                sraxChain = sourceChain;
                sourceChain = bintools.cb58Decode(sourceChain);
            }
            else if (!(sourceChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildImportTx: Invalid destinationChain type: " +
                    typeof sourceChain);
            }
            const atomicUTXOs = yield (yield this.getUTXOs(ownerAddresses, sraxChain, 0, undefined)).utxos;
            const axcAssetID = yield this.getAXCAssetID();
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const atomics = atomicUTXOs.getAllUTXOs();
            const builtUnsignedTx = utxoset.buildImportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), to, from, change, atomics, sourceChain, this.getTxFee(), axcAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
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
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param locktime Optional. The locktime field created in the resulting outputs
         * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
         *
         * @returns An unsigned transaction ([[UnsignedTx]]) which contains an [[ExportTx]].
         */
        this.buildExportTx = (utxoset, amount, destinationChain, toAddresses, fromAddresses, changeAddresses = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), locktime = new bn_js_1.default(0), threshold = 1) => __awaiter(this, void 0, void 0, function* () {
            let prefixes = {};
            toAddresses.map((a) => {
                prefixes[a.split("-")[0]] = true;
            });
            if (Object.keys(prefixes).length !== 1) {
                throw new errors_1.AddressError("Error - PlatformVMAPI.buildExportTx: To addresses must have the same chainID prefix.");
            }
            if (typeof destinationChain === "undefined") {
                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Destination ChainID is undefined.");
            }
            else if (typeof destinationChain === "string") {
                destinationChain = bintools.cb58Decode(destinationChain); //
            }
            else if (!(destinationChain instanceof buffer_1.Buffer)) {
                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Invalid destinationChain type: " +
                    typeof destinationChain);
            }
            if (destinationChain.length !== 32) {
                throw new errors_1.ChainIdError("Error - PlatformVMAPI.buildExportTx: Destination ChainID must be 32 bytes in length.");
            }
            /*
            if(bintools.cb58Encode(destinationChain) !== Defaults.network[this.core.getNetworkID()].Swap["blockchainID"]) {
              throw new Error("Error - PlatformVMAPI.buildExportTx: Destination ChainID must The Swap-Chain ID in the current version of AxiaJS.")
            }*/
            let to = [];
            toAddresses.map((a) => {
                to.push(bintools.stringToAddress(a));
            });
            const from = this._cleanAddressArray(fromAddresses, "buildExportTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildExportTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            const builtUnsignedTx = utxoset.buildExportTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), amount, axcAssetID, to, from, change, destinationChain, this.getTxFee(), axcAssetID, memo, asOf, locktime, threshold);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned [[AddAllychainValidatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddAllychainValidatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on.
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees in AXC
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param weight The amount of weight for this allychain validator.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddAllychainValidatorTx = (utxoset, fromAddresses, changeAddresses, nodeID, startTime, endTime, weight, allychainID, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), allychainAuthCredentials = []) => __awaiter(this, void 0, void 0, function* () {
            const from = this._cleanAddressArray(fromAddresses, "buildAddAllychainValidatorTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildAddAllychainValidatorTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new Error("PlatformVMAPI.buildAddAllychainValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            const builtUnsignedTx = utxoset.buildAddAllychainValidatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, weight, allychainID, this.getDefaultTxFee(), axcAssetID, memo, asOf, allychainAuthCredentials);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new Error("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned [[AddNominatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddNominatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who received the staked tokens at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who own the staking UTXOs the fees in AXC
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param stakeAmount The amount being nominated as a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddresses The addresses which will recieve the rewards from the nominated stake.
         * @param rewardLocktime Optional. The locktime field created in the resulting reward outputs
         * @param rewardThreshold Opional. The number of signatures required to spend the funds in the resultant reward UTXO. Default 1.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddNominatorTx = (utxoset, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardAddresses, rewardLocktime = new bn_js_1.default(0), rewardThreshold = 1, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const to = this._cleanAddressArray(toAddresses, "buildAddNominatorTx").map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, "buildAddNominatorTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildAddNominatorTx").map((a) => bintools.stringToAddress(a));
            const rewards = this._cleanAddressArray(rewardAddresses, "buildAddValidatorTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const minStake = (yield this.getMinStake())["minNominatorStake"];
            if (stakeAmount.lt(minStake)) {
                throw new errors_1.StakeError("PlatformVMAPI.buildAddNominatorTx -- stake amount must be at least " +
                    minStake.toString(10));
            }
            const axcAssetID = yield this.getAXCAssetID();
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("PlatformVMAPI.buildAddNominatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            const builtUnsignedTx = utxoset.buildAddNominatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), axcAssetID, to, from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewards, new bn_js_1.default(0), axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Helper function which creates an unsigned [[AddValidatorTx]]. For more granular control, you may create your own
         * [[UnsignedTx]] manually and import the [[AddValidatorTx]] class directly.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who received the staked tokens at the end of the staking period
         * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who own the staking UTXOs the fees in AXC
         * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
         * @param nodeID The node ID of the validator being added.
         * @param startTime The Unix time when the validator starts validating the Primary Network.
         * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
         * @param stakeAmount The amount being nominated as a {@link https://github.com/indutny/bn.js/|BN}
         * @param rewardAddresses The addresses which will recieve the rewards from the nominated stake.
         * @param nominationFee A number for the percentage of reward to be given to the validator when someone nominates to them. Must be between 0 and 100.
         * @param rewardLocktime Optional. The locktime field created in the resulting reward outputs
         * @param rewardThreshold Opional. The number of signatures required to spend the funds in the resultant reward UTXO. Default 1.
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildAddValidatorTx = (utxoset, toAddresses, fromAddresses, changeAddresses, nodeID, startTime, endTime, stakeAmount, rewardAddresses, nominationFee, rewardLocktime = new bn_js_1.default(0), rewardThreshold = 1, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const to = this._cleanAddressArray(toAddresses, "buildAddValidatorTx").map((a) => bintools.stringToAddress(a));
            const from = this._cleanAddressArray(fromAddresses, "buildAddValidatorTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildAddValidatorTx").map((a) => bintools.stringToAddress(a));
            const rewards = this._cleanAddressArray(rewardAddresses, "buildAddValidatorTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const minStake = (yield this.getMinStake())["minValidatorStake"];
            if (stakeAmount.lt(minStake)) {
                throw new errors_1.StakeError("PlatformVMAPI.buildAddValidatorTx -- stake amount must be at least " +
                    minStake.toString(10));
            }
            if (typeof nominationFee !== "number" ||
                nominationFee > 100 ||
                nominationFee < 0) {
                throw new errors_1.NominationFeeError("PlatformVMAPI.buildAddValidatorTx -- nominationFee must be a number between 0 and 100");
            }
            const axcAssetID = yield this.getAXCAssetID();
            const now = (0, helperfunctions_1.UnixNow)();
            if (startTime.lt(now) || endTime.lte(startTime)) {
                throw new errors_1.TimeError("PlatformVMAPI.buildAddValidatorTx -- startTime must be in the future and endTime must come after startTime");
            }
            const builtUnsignedTx = utxoset.buildAddValidatorTx(this.core.getNetworkID(), bintools.cb58Decode(this.blockchainID), axcAssetID, to, from, change, (0, helperfunctions_1.NodeIDStringToBuffer)(nodeID), startTime, endTime, stakeAmount, rewardLocktime, rewardThreshold, rewards, nominationFee, new bn_js_1.default(0), axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Class representing an unsigned [[CreateAllychainTx]] transaction.
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param allychainOwnerAddresses An array of addresses for owners of the new allychain
         * @param allychainOwnerThreshold A number indicating the amount of signatures required to add validators to a allychain
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildCreateAllychainTx = (utxoset, fromAddresses, changeAddresses, allychainOwnerAddresses, allychainOwnerThreshold, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)()) => __awaiter(this, void 0, void 0, function* () {
            const from = this._cleanAddressArray(fromAddresses, "buildCreateAllychainTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildCreateAllychainTx").map((a) => bintools.stringToAddress(a));
            const owners = this._cleanAddressArray(allychainOwnerAddresses, "buildCreateAllychainTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const fee = this.getCreateAllychainTxFee();
            const builtUnsignedTx = utxoset.buildCreateAllychainTx(networkID, blockchainID, from, change, owners, allychainOwnerThreshold, fee, axcAssetID, memo, asOf);
            if (!(yield this.checkGooseEgg(builtUnsignedTx, this.getCreationTxFee()))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * Build an unsigned [[CreateChainTx]].
         *
         * @param utxoset A set of UTXOs that the transaction is built on
         * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
         * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs
         * @param allychainID Optional ID of the Allychain that validates this blockchain
         * @param chainName Optional A human readable name for the chain; need not be unique
         * @param vmID Optional ID of the VM running on the new chain
         * @param fxIDs Optional IDs of the feature extensions running on the new chain
         * @param genesisData Optional Byte representation of genesis state of the new chain
         * @param memo Optional contains arbitrary bytes, up to 256 bytes
         * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
         * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
         *
         * @returns An unsigned transaction created from the passed in parameters.
         */
        this.buildCreateChainTx = (utxoset, fromAddresses, changeAddresses, allychainID = undefined, chainName = undefined, vmID = undefined, fxIDs = undefined, genesisData = undefined, memo = undefined, asOf = (0, helperfunctions_1.UnixNow)(), allychainAuthCredentials = []) => __awaiter(this, void 0, void 0, function* () {
            const from = this._cleanAddressArray(fromAddresses, "buildCreateChainTx").map((a) => bintools.stringToAddress(a));
            const change = this._cleanAddressArray(changeAddresses, "buildCreateChainTx").map((a) => bintools.stringToAddress(a));
            if (memo instanceof payload_1.PayloadBase) {
                memo = memo.getPayload();
            }
            const axcAssetID = yield this.getAXCAssetID();
            fxIDs = fxIDs.sort();
            const networkID = this.core.getNetworkID();
            const blockchainID = bintools.cb58Decode(this.blockchainID);
            const fee = this.getCreateChainTxFee();
            const builtUnsignedTx = utxoset.buildCreateChainTx(networkID, blockchainID, from, change, allychainID, chainName, vmID, fxIDs, genesisData, fee, axcAssetID, memo, asOf, allychainAuthCredentials);
            if (!(yield this.checkGooseEgg(builtUnsignedTx, this.getCreationTxFee()))) {
                /* istanbul ignore next */
                throw new errors_1.GooseEggCheckError("Failed Goose Egg Check");
            }
            return builtUnsignedTx;
        });
        /**
         * @returns the current timestamp on chain.
         */
        this.getTimestamp = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("core.getTimestamp");
            return response.data.result.timestamp;
        });
        /**
         * @returns the UTXOs that were rewarded after the provided transaction"s staking or nomination period ended.
         */
        this.getRewardUTXOs = (txID, encoding) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                txID,
                encoding
            };
            const response = yield this.callMethod("core.getRewardUTXOs", params);
            return response.data.result;
        });
        this.blockchainID = constants_1.PlatformChainID;
        const netID = core.getNetworkID();
        if (netID in constants_1.Defaults.network &&
            this.blockchainID in constants_1.Defaults.network[`${netID}`]) {
            const { alias } = constants_1.Defaults.network[`${netID}`][this.blockchainID];
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), alias);
        }
        else {
            this.keychain = new keychain_1.KeyChain(this.core.getHRP(), this.blockchainID);
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
            for (let i = 0; i < addresses.length; i++) {
                if (typeof addresses[`${i}`] === "string") {
                    if (typeof this.parseAddress(addresses[`${i}`]) ===
                        "undefined") {
                        /* istanbul ignore next */
                        throw new errors_1.AddressError("Error - Invalid address format");
                    }
                    addrs.push(addresses[`${i}`]);
                }
                else {
                    const bech32 = "bech32";
                    addrs.push(serialization.bufferToType(addresses[`${i}`], bech32, this.core.getHRP(), chainid));
                }
            }
        }
        return addrs;
    }
}
exports.PlatformVMAPI = PlatformVMAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsb0NBQWdDO0FBQ2hDLGtEQUFzQjtBQUV0QixrREFBOEM7QUFPOUMsb0VBQTJDO0FBQzNDLHlDQUFxQztBQUNyQyxxREFBeUU7QUFDekUsMkNBQWlEO0FBQ2pELDZCQUFxQztBQUNyQyxpREFBaUQ7QUFDakQsaUVBQTJFO0FBQzNFLCtDQUFtRDtBQUVuRCwrQ0FRMkI7QUErQjNCLHVDQUE4QztBQUM5Qyx1Q0FBMkQ7QUFJM0Q7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQixxQkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWhFOzs7Ozs7R0FNRztBQUNILE1BQWEsYUFBYyxTQUFRLGlCQUFPO0lBbzFEeEM7Ozs7OztPQU1HO0lBQ0gsWUFBWSxJQUFjLEVBQUUsVUFBa0IsY0FBYztRQUMxRCxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBMzFEdEI7O1dBRUc7UUFDTyxhQUFRLEdBQWEsSUFBSSxtQkFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUV6QyxpQkFBWSxHQUFXLDJCQUFlLENBQUE7UUFFdEMsb0JBQWUsR0FBVyxTQUFTLENBQUE7UUFFbkMsZUFBVSxHQUFXLFNBQVMsQ0FBQTtRQUU5QixVQUFLLEdBQU8sU0FBUyxDQUFBO1FBRXJCLGtCQUFhLEdBQU8sU0FBUyxDQUFBO1FBRTdCLHNCQUFpQixHQUFPLFNBQVMsQ0FBQTtRQUVqQyxzQkFBaUIsR0FBTyxTQUFTLENBQUE7UUFFM0M7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFHLEdBQVcsRUFBRTtZQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLGVBQWUs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LEtBQUssQ0FBQTtJQUNkLENBQUM7Q0FtREY7QUFyNERELHNDQXE0REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLVBsYXRmb3JtVk1cclxuICovXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCBBeGlhQ29yZSBmcm9tIFwiLi4vLi4vYXhpYVwiXHJcbmltcG9ydCB7IEpSUENBUEkgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pycGNhcGlcIlxyXG5pbXBvcnQgeyBSZXF1ZXN0UmVzcG9uc2VEYXRhIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9hcGliYXNlXCJcclxuaW1wb3J0IHtcclxuICBFcnJvclJlc3BvbnNlT2JqZWN0LFxyXG4gIEFsbHljaGFpbk93bmVyRXJyb3IsXHJcbiAgQWxseWNoYWluVGhyZXNob2xkRXJyb3JcclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4va2V5Y2hhaW5cIlxyXG5pbXBvcnQgeyBEZWZhdWx0cywgUGxhdGZvcm1DaGFpbklELCBPTkVBWEMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgUGxhdGZvcm1WTUNvbnN0YW50cyB9IGZyb20gXCIuL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IFVuc2lnbmVkVHgsIFR4IH0gZnJvbSBcIi4vdHhcIlxyXG5pbXBvcnQgeyBQYXlsb2FkQmFzZSB9IGZyb20gXCIuLi8uLi91dGlscy9wYXlsb2FkXCJcclxuaW1wb3J0IHsgVW5peE5vdywgTm9kZUlEU3RyaW5nVG9CdWZmZXIgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IHsgVVRYTywgVVRYT1NldCB9IGZyb20gXCIuLi9wbGF0Zm9ybXZtL3V0eG9zXCJcclxuaW1wb3J0IHsgUGVyc2lzdGFuY2VPcHRpb25zIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3BlcnNpc3RlbmNlb3B0aW9uc1wiXHJcbmltcG9ydCB7XHJcbiAgQWRkcmVzc0Vycm9yLFxyXG4gIFRyYW5zYWN0aW9uRXJyb3IsXHJcbiAgQ2hhaW5JZEVycm9yLFxyXG4gIEdvb3NlRWdnQ2hlY2tFcnJvcixcclxuICBUaW1lRXJyb3IsXHJcbiAgU3Rha2VFcnJvcixcclxuICBOb21pbmF0aW9uRmVlRXJyb3JcclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvZXJyb3JzXCJcclxuaW1wb3J0IHtcclxuICBHZXRDdXJyZW50VmFsaWRhdG9yc1BhcmFtcyxcclxuICBHZXRQZW5kaW5nVmFsaWRhdG9yc1BhcmFtcyxcclxuICBHZXRSZXdhcmRVVFhPc1BhcmFtcyxcclxuICBHZXRSZXdhcmRVVFhPc1Jlc3BvbnNlLFxyXG4gIEdldFN0YWtlUGFyYW1zLFxyXG4gIEdldFN0YWtlUmVzcG9uc2UsXHJcbiAgQWxseWNoYWluLFxyXG4gIEdldFZhbGlkYXRvcnNBdFBhcmFtcyxcclxuICBHZXRWYWxpZGF0b3JzQXRSZXNwb25zZSxcclxuICBDcmVhdGVBZGRyZXNzUGFyYW1zLFxyXG4gIEdldFVUWE9zUGFyYW1zLFxyXG4gIEdldEJhbGFuY2VSZXNwb25zZSxcclxuICBHZXRVVFhPc1Jlc3BvbnNlLFxyXG4gIExpc3RBZGRyZXNzZXNQYXJhbXMsXHJcbiAgU2FtcGxlVmFsaWRhdG9yc1BhcmFtcyxcclxuICBBZGRWYWxpZGF0b3JQYXJhbXMsXHJcbiAgQWRkTm9taW5hdG9yUGFyYW1zLFxyXG4gIENyZWF0ZUFsbHljaGFpblBhcmFtcyxcclxuICBFeHBvcnRBWENQYXJhbXMsXHJcbiAgRXhwb3J0S2V5UGFyYW1zLFxyXG4gIEltcG9ydEtleVBhcmFtcyxcclxuICBJbXBvcnRBWENQYXJhbXMsXHJcbiAgQ3JlYXRlQmxvY2tjaGFpblBhcmFtcyxcclxuICBCbG9ja2NoYWluLFxyXG4gIEdldFR4U3RhdHVzUGFyYW1zLFxyXG4gIEdldFR4U3RhdHVzUmVzcG9uc2UsXHJcbiAgR2V0TWluU3Rha2VSZXNwb25zZSxcclxuICBHZXRNYXhTdGFrZUFtb3VudFBhcmFtc1xyXG59IGZyb20gXCIuL2ludGVyZmFjZXNcIlxyXG5pbXBvcnQgeyBUcmFuc2ZlcmFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcclxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZFR5cGUgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIlxyXG5pbXBvcnQgeyBBbGx5Y2hhaW5BdXRoIH0gZnJvbSBcIi5cIlxyXG5pbXBvcnQgeyBHZW5lc2lzRGF0YSB9IGZyb20gXCIuLi9hdm1cIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbm9kZSdzIFBsYXRmb3JtVk1BUElcclxuICpcclxuICogQGNhdGVnb3J5IFJQQ0FQSXNcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBleHRlbmRzIHRoZSBbW0pSUENBUEldXSBjbGFzcy4gVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGRpcmVjdGx5IGNhbGxlZC4gSW5zdGVhZCwgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gZnVuY3Rpb24gdG8gcmVnaXN0ZXIgdGhpcyBpbnRlcmZhY2Ugd2l0aCBBeGlhLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtVk1BUEkgZXh0ZW5kcyBKUlBDQVBJIHtcclxuICAvKipcclxuICAgKiBAaWdub3JlXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIGtleWNoYWluOiBLZXlDaGFpbiA9IG5ldyBLZXlDaGFpbihcIlwiLCBcIlwiKVxyXG5cclxuICBwcm90ZWN0ZWQgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBQbGF0Zm9ybUNoYWluSURcclxuXHJcbiAgcHJvdGVjdGVkIGJsb2NrY2hhaW5BbGlhczogc3RyaW5nID0gdW5kZWZpbmVkXHJcblxyXG4gIHByb3RlY3RlZCBBWENBc3NldElEOiBCdWZmZXIgPSB1bmRlZmluZWRcclxuXHJcbiAgcHJvdGVjdGVkIHR4RmVlOiBCTiA9IHVuZGVmaW5lZFxyXG5cclxuICBwcm90ZWN0ZWQgY3JlYXRpb25UeEZlZTogQk4gPSB1bmRlZmluZWRcclxuXHJcbiAgcHJvdGVjdGVkIG1pblZhbGlkYXRvclN0YWtlOiBCTiA9IHVuZGVmaW5lZFxyXG5cclxuICBwcm90ZWN0ZWQgbWluTm9taW5hdG9yU3Rha2U6IEJOID0gdW5kZWZpbmVkXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGFsaWFzIGZvciB0aGUgYmxvY2tjaGFpbklEIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIHJldHVybnMgYHVuZGVmaW5lZGAuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSURcclxuICAgKi9cclxuICBnZXRCbG9ja2NoYWluQWxpYXMgPSAoKTogc3RyaW5nID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5ibG9ja2NoYWluQWxpYXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgY29uc3QgbmV0aWQ6IG51bWJlciA9IHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbmV0aWQgaW4gRGVmYXVsdHMubmV0d29yayAmJlxyXG4gICAgICAgIHRoaXMuYmxvY2tjaGFpbklEIGluIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0aWR9YF1cclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluQWxpYXMgPVxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1tgJHtuZXRpZH1gXVt0aGlzLmJsb2NrY2hhaW5JRF0uYWxpYXNcclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja2NoYWluQWxpYXNcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuYmxvY2tjaGFpbkFsaWFzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBhbGlhcyBmb3IgdGhlIGJsb2NrY2hhaW5JRC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbGlhcyBUaGUgYWxpYXMgZm9yIHRoZSBibG9ja2NoYWluSUQuXHJcbiAgICpcclxuICAgKi9cclxuICBzZXRCbG9ja2NoYWluQWxpYXMgPSAoYWxpYXM6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICB0aGlzLmJsb2NrY2hhaW5BbGlhcyA9IGFsaWFzXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgYmxvY2tjaGFpbklEIGFuZCByZXR1cm5zIGl0LlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGJsb2NrY2hhaW5JRFxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5JRCA9ICgpOiBzdHJpbmcgPT4gdGhpcy5ibG9ja2NoYWluSURcclxuXHJcbiAgLyoqXHJcbiAgICogUmVmcmVzaCBibG9ja2NoYWluSUQsIGFuZCBpZiBhIGJsb2NrY2hhaW5JRCBpcyBwYXNzZWQgaW4sIHVzZSB0aGF0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIE9wdGlvbmFsLiBCbG9ja2NoYWluSUQgdG8gYXNzaWduLCBpZiBub25lLCB1c2VzIHRoZSBkZWZhdWx0IGJhc2VkIG9uIG5ldHdvcmtJRC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBibG9ja2NoYWluSURcclxuICAgKi9cclxuICByZWZyZXNoQmxvY2tjaGFpbklEID0gKGJsb2NrY2hhaW5JRDogc3RyaW5nID0gdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XHJcbiAgICBjb25zdCBuZXRpZDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGVvZiBibG9ja2NoYWluSUQgPT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgICAgdHlwZW9mIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0aWR9YF0gIT09IFwidW5kZWZpbmVkXCJcclxuICAgICkge1xyXG4gICAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IFBsYXRmb3JtQ2hhaW5JRCAvL2RlZmF1bHQgdG8gQ29yZS1DaGFpblxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBibG9ja2NoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgdGhpcy5ibG9ja2NoYWluSUQgPSBibG9ja2NoYWluSURcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYW4gYWRkcmVzcyBzdHJpbmcgYW5kIHJldHVybnMgaXRzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIGlmIHZhbGlkLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3MgaWYgdmFsaWQsIHVuZGVmaW5lZCBpZiBub3QgdmFsaWQuXHJcbiAgICovXHJcbiAgcGFyc2VBZGRyZXNzID0gKGFkZHI6IHN0cmluZyk6IEJ1ZmZlciA9PiB7XHJcbiAgICBjb25zdCBhbGlhczogc3RyaW5nID0gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSB0aGlzLmdldEJsb2NrY2hhaW5JRCgpXHJcbiAgICByZXR1cm4gYmludG9vbHMucGFyc2VBZGRyZXNzKFxyXG4gICAgICBhZGRyLFxyXG4gICAgICBibG9ja2NoYWluSUQsXHJcbiAgICAgIGFsaWFzLFxyXG4gICAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLkFERFJFU1NMRU5HVEhcclxuICAgIClcclxuICB9XHJcblxyXG4gIGFkZHJlc3NGcm9tQnVmZmVyID0gKGFkZHJlc3M6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XHJcbiAgICBjb25zdCBjaGFpbmlkOiBzdHJpbmcgPSB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXHJcbiAgICAgID8gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgICA6IHRoaXMuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGNvbnN0IHR5cGU6IFNlcmlhbGl6ZWRUeXBlID0gXCJiZWNoMzJcIlxyXG4gICAgcmV0dXJuIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKFxyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICB0eXBlLFxyXG4gICAgICB0aGlzLmNvcmUuZ2V0SFJQKCksXHJcbiAgICAgIGNoYWluaWRcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIEFYQyBBc3NldElEIGFuZCByZXR1cm5zIGl0IGluIGEgUHJvbWlzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWZyZXNoIFRoaXMgZnVuY3Rpb24gY2FjaGVzIHRoZSByZXNwb25zZS4gUmVmcmVzaCA9IHRydWUgd2lsbCBidXN0IHRoZSBjYWNoZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSB0aGUgcHJvdmlkZWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgQVhDIEFzc2V0SURcclxuICAgKi9cclxuICBnZXRBWENBc3NldElEID0gYXN5bmMgKHJlZnJlc2g6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8QnVmZmVyPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuQVhDQXNzZXRJRCA9PT0gXCJ1bmRlZmluZWRcIiB8fCByZWZyZXNoKSB7XHJcbiAgICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9IGF3YWl0IHRoaXMuZ2V0U3Rha2luZ0Fzc2V0SUQoKVxyXG4gICAgICB0aGlzLkFYQ0Fzc2V0SUQgPSBiaW50b29scy5jYjU4RGVjb2RlKGFzc2V0SUQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5BWENBc3NldElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZXMgdGhlIGRlZmF1bHRzIGFuZCBzZXRzIHRoZSBjYWNoZSB0byBhIHNwZWNpZmljIEFYQyBBc3NldElEXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXhjQXNzZXRJRCBBIGNiNTggc3RyaW5nIG9yIEJ1ZmZlciByZXByZXNlbnRpbmcgdGhlIEFYQyBBc3NldElEXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgdGhlIHByb3ZpZGVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIEFYQyBBc3NldElEXHJcbiAgICovXHJcbiAgc2V0QVhDQXNzZXRJRCA9IChheGNBc3NldElEOiBzdHJpbmcgfCBCdWZmZXIpID0+IHtcclxuICAgIGlmICh0eXBlb2YgYXhjQXNzZXRJRCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBheGNBc3NldElEID0gYmludG9vbHMuY2I1OERlY29kZShheGNBc3NldElEKVxyXG4gICAgfVxyXG4gICAgdGhpcy5BWENBc3NldElEID0gYXhjQXNzZXRJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgZGVmYXVsdCB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgZGVmYXVsdCB0eCBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldERlZmF1bHRUeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpIGluIERlZmF1bHRzLm5ldHdvcmtcclxuICAgICAgPyBuZXcgQk4oRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiQ29yZVwiXVtcInR4RmVlXCJdKVxyXG4gICAgICA6IG5ldyBCTigwKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgdHggZmVlIGZvciB0aGlzIGNoYWluLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIHR4IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICovXHJcbiAgZ2V0VHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnR4RmVlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMudHhGZWUgPSB0aGlzLmdldERlZmF1bHRUeEZlZSgpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy50eEZlZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgQ3JlYXRlQWxseWNoYWluVHggZmVlLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIENyZWF0ZUFsbHljaGFpblR4IGZlZSBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICovXHJcbiAgZ2V0Q3JlYXRlQWxseWNoYWluVHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKSBpbiBEZWZhdWx0cy5uZXR3b3JrXHJcbiAgICAgID8gbmV3IEJOKFxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiQ29yZVwiXVtcclxuICAgICAgICAgICAgXCJjcmVhdGVBbGx5Y2hhaW5UeFwiXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgKVxyXG4gICAgICA6IG5ldyBCTigwKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgQ3JlYXRlQ2hhaW5UeCBmZWUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBUaGUgQ3JlYXRlQ2hhaW5UeCBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldENyZWF0ZUNoYWluVHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKSBpbiBEZWZhdWx0cy5uZXR3b3JrXHJcbiAgICAgID8gbmV3IEJOKFxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldW1wiQ29yZVwiXVtcImNyZWF0ZUNoYWluVHhcIl1cclxuICAgICAgICApXHJcbiAgICAgIDogbmV3IEJOKDApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0eCBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZmVlIFRoZSB0eCBmZWUgYW1vdW50IHRvIHNldCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIHNldFR4RmVlID0gKGZlZTogQk4pID0+IHtcclxuICAgIHRoaXMudHhGZWUgPSBmZWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGRlZmF1bHQgY3JlYXRpb24gZmVlIGZvciB0aGlzIGNoYWluLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgVGhlIGRlZmF1bHQgY3JlYXRpb24gZmVlIGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBnZXREZWZhdWx0Q3JlYXRpb25UeEZlZSA9ICgpOiBCTiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpIGluIERlZmF1bHRzLm5ldHdvcmtcclxuICAgICAgPyBuZXcgQk4oXHJcbiAgICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW3RoaXMuY29yZS5nZXROZXR3b3JrSUQoKV1bXCJDb3JlXCJdW1wiY3JlYXRpb25UeEZlZVwiXVxyXG4gICAgICAgIClcclxuICAgICAgOiBuZXcgQk4oMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGNyZWF0aW9uIGZlZSBmb3IgdGhpcyBjaGFpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBjcmVhdGlvbiBmZWUgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIGdldENyZWF0aW9uVHhGZWUgPSAoKTogQk4gPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLmNyZWF0aW9uVHhGZWUgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy5jcmVhdGlvblR4RmVlID0gdGhpcy5nZXREZWZhdWx0Q3JlYXRpb25UeEZlZSgpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5jcmVhdGlvblR4RmVlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjcmVhdGlvbiBmZWUgZm9yIHRoaXMgY2hhaW4uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZmVlIFRoZSBjcmVhdGlvbiBmZWUgYW1vdW50IHRvIHNldCBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqL1xyXG4gIHNldENyZWF0aW9uVHhGZWUgPSAoZmVlOiBCTikgPT4ge1xyXG4gICAgdGhpcy5jcmVhdGlvblR4RmVlID0gZmVlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIGEgcmVmZXJlbmNlIHRvIHRoZSBrZXljaGFpbiBmb3IgdGhpcyBjbGFzcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBpbnN0YW5jZSBvZiBbW11dIGZvciB0aGlzIGNsYXNzXHJcbiAgICovXHJcbiAga2V5Q2hhaW4gPSAoKTogS2V5Q2hhaW4gPT4gdGhpcy5rZXljaGFpblxyXG5cclxuICAvKipcclxuICAgKiBAaWdub3JlXHJcbiAgICovXHJcbiAgbmV3S2V5Q2hhaW4gPSAoKTogS2V5Q2hhaW4gPT4ge1xyXG4gICAgLy8gd2FybmluZywgb3ZlcndyaXRlcyB0aGUgb2xkIGtleWNoYWluXHJcbiAgICBjb25zdCBhbGlhcyA9IHRoaXMuZ2V0QmxvY2tjaGFpbkFsaWFzKClcclxuICAgIGlmIChhbGlhcykge1xyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgYWxpYXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgdGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5rZXljaGFpblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGRldGVybWluZXMgaWYgYSB0eCBpcyBhIGdvb3NlIGVnZyB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHggQW4gVW5zaWduZWRUeFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgYm9vbGVhbiB0cnVlIGlmIHBhc3NlcyBnb29zZSBlZ2cgdGVzdCBhbmQgZmFsc2UgaWYgZmFpbHMuXHJcbiAgICpcclxuICAgKiBAcmVtYXJrc1xyXG4gICAqIEEgXCJHb29zZSBFZ2cgVHJhbnNhY3Rpb25cIiBpcyB3aGVuIHRoZSBmZWUgZmFyIGV4Y2VlZHMgYSByZWFzb25hYmxlIGFtb3VudFxyXG4gICAqL1xyXG4gIGNoZWNrR29vc2VFZ2cgPSBhc3luYyAoXHJcbiAgICB1dHg6IFVuc2lnbmVkVHgsXHJcbiAgICBvdXRUb3RhbDogQk4gPSBuZXcgQk4oMClcclxuICApOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IGF4Y0Fzc2V0SUQ6IEJ1ZmZlciA9IGF3YWl0IHRoaXMuZ2V0QVhDQXNzZXRJRCgpXHJcbiAgICBsZXQgb3V0cHV0VG90YWw6IEJOID0gb3V0VG90YWwuZ3QobmV3IEJOKDApKVxyXG4gICAgICA/IG91dFRvdGFsXHJcbiAgICAgIDogdXR4LmdldE91dHB1dFRvdGFsKGF4Y0Fzc2V0SUQpXHJcbiAgICBjb25zdCBmZWU6IEJOID0gdXR4LmdldEJ1cm4oYXhjQXNzZXRJRClcclxuICAgIGlmIChmZWUubHRlKE9ORUFYQy5tdWwobmV3IEJOKDEwKSkpIHx8IGZlZS5sdGUob3V0cHV0VG90YWwpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhbiBhc3NldElEIGZvciBhIGFsbHljaGFpblwicyBzdGFraW5nIGFzc3NldC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyB3aXRoIGNiNTggZW5jb2RlZCB2YWx1ZSBvZiB0aGUgYXNzZXRJRC5cclxuICAgKi9cclxuICBnZXRTdGFraW5nQXNzZXRJRCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRTdGFraW5nQXNzZXRJRFwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYXNzZXRJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBibG9ja2NoYWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBuZXcgYWNjb3VudFxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXIgdGhhdCBjb250cm9scyB0aGUgbmV3IGFjY291bnRcclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgT3B0aW9uYWwuIEVpdGhlciBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGFuIGNiNTggc2VyaWFsaXplZCBzdHJpbmcgZm9yIHRoZSBBbGx5Y2hhaW5JRCBvciBpdHMgYWxpYXMuXHJcbiAgICogQHBhcmFtIHZtSUQgVGhlIElEIG9mIHRoZSBWaXJ0dWFsIE1hY2hpbmUgdGhlIGJsb2NrY2hhaW4gcnVucy4gQ2FuIGFsc28gYmUgYW4gYWxpYXMgb2YgdGhlIFZpcnR1YWwgTWFjaGluZS5cclxuICAgKiBAcGFyYW0gZnhJRHMgVGhlIGlkcyBvZiB0aGUgRlhzIHRoZSBWTSBpcyBydW5uaW5nLlxyXG4gICAqIEBwYXJhbSBuYW1lIEEgaHVtYW4tcmVhZGFibGUgbmFtZSBmb3IgdGhlIG5ldyBibG9ja2NoYWluXHJcbiAgICogQHBhcmFtIGdlbmVzaXMgVGhlIGJhc2UgNTggKHdpdGggY2hlY2tzdW0pIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnZW5lc2lzIHN0YXRlIG9mIHRoZSBuZXcgYmxvY2tjaGFpbi4gVmlydHVhbCBNYWNoaW5lcyBzaG91bGQgaGF2ZSBhIHN0YXRpYyBBUEkgbWV0aG9kIG5hbWVkIGJ1aWxkR2VuZXNpcyB0aGF0IGNhbiBiZSB1c2VkIHRvIGdlbmVyYXRlIGdlbmVzaXNEYXRhLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgdGhlIHVuc2lnbmVkIHRyYW5zYWN0aW9uIHRvIGNyZWF0ZSB0aGlzIGJsb2NrY2hhaW4uIE11c3QgYmUgc2lnbmVkIGJ5IGEgc3VmZmljaWVudCBudW1iZXIgb2YgdGhlIEFsbHljaGFpbuKAmXMgY29udHJvbCBrZXlzIGFuZCBieSB0aGUgYWNjb3VudCBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZS5cclxuICAgKi9cclxuICBjcmVhdGVCbG9ja2NoYWluID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBhbGx5Y2hhaW5JRDogQnVmZmVyIHwgc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgdm1JRDogc3RyaW5nLFxyXG4gICAgZnhJRHM6IG51bWJlcltdLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgZ2VuZXNpczogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogQ3JlYXRlQmxvY2tjaGFpblBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBmeElEcyxcclxuICAgICAgdm1JRCxcclxuICAgICAgbmFtZSxcclxuICAgICAgZ2VuZXNpc0RhdGE6IGdlbmVzaXNcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmNyZWF0ZUJsb2NrY2hhaW5cIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgc3RhdHVzIG9mIGEgYmxvY2tjaGFpbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgVGhlIGJsb2NrY2hhaW5JRCByZXF1ZXN0aW5nIGEgc3RhdHVzIHVwZGF0ZVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBzdHJpbmcgb2Ygb25lIG9mOiBcIlZhbGlkYXRpbmdcIiwgXCJDcmVhdGVkXCIsIFwiUHJlZmVycmVkXCIsIFwiVW5rbm93blwiLlxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5TdGF0dXMgPSBhc3luYyAoYmxvY2tjaGFpbklEOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgIGJsb2NrY2hhaW5JRFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRCbG9ja2NoYWluU3RhdHVzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN0YXR1c1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSB2YWxpZGF0b3JzIGFuZCB0aGVpciB3ZWlnaHRzIG9mIGEgYWxseWNoYWluIG9yIHRoZSBQcmltYXJ5IE5ldHdvcmsgYXQgYSBnaXZlbiBDb3JlLUNoYWluIGhlaWdodC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBoZWlnaHQgVGhlIENvcmUtQ2hhaW4gaGVpZ2h0IHRvIGdldCB0aGUgdmFsaWRhdG9yIHNldCBhdC5cclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgT3B0aW9uYWwuIEEgY2I1OCBzZXJpYWxpemVkIHN0cmluZyBmb3IgdGhlIEFsbHljaGFpbklEIG9yIGl0cyBhbGlhcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgR2V0VmFsaWRhdG9yc0F0UmVzcG9uc2VcclxuICAgKi9cclxuICBnZXRWYWxpZGF0b3JzQXQgPSBhc3luYyAoXHJcbiAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgIGFsbHljaGFpbklEPzogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxHZXRWYWxpZGF0b3JzQXRSZXNwb25zZT4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRWYWxpZGF0b3JzQXRQYXJhbXMgPSB7XHJcbiAgICAgIGhlaWdodFxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBhbGx5Y2hhaW5JRCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXMuYWxseWNoYWluSUQgPSBhbGx5Y2hhaW5JRFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRWYWxpZGF0b3JzQXRcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhbiBhZGRyZXNzIGluIHRoZSBub2RlJ3Mga2V5c3RvcmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIG9mIHRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIG5ldyBhY2NvdW50XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBuZXcgYWNjb3VudFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBzdHJpbmcgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgYWNjb3VudCBhZGRyZXNzLlxyXG4gICAqL1xyXG4gIGNyZWF0ZUFkZHJlc3MgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IENyZWF0ZUFkZHJlc3NQYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5jcmVhdGVBZGRyZXNzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIGJhbGFuY2Ugb2YgYSBwYXJ0aWN1bGFyIGFzc2V0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgVGhlIGFkZHJlc3MgdG8gcHVsbCB0aGUgYXNzZXQgYmFsYW5jZSBmcm9tXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIHdpdGggdGhlIGJhbGFuY2UgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSBvbiB0aGUgcHJvdmlkZWQgYWRkcmVzcy5cclxuICAgKi9cclxuICBnZXRCYWxhbmNlID0gYXN5bmMgKGFkZHJlc3M6IHN0cmluZyk6IFByb21pc2U8R2V0QmFsYW5jZVJlc3BvbnNlPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3MpID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBBZGRyZXNzRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFBsYXRmb3JtVk1BUEkuZ2V0QmFsYW5jZTogSW52YWxpZCBhZGRyZXNzIGZvcm1hdFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICBhZGRyZXNzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldEJhbGFuY2VcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3QgdGhlIGFkZHJlc3NlcyBjb250cm9sbGVkIGJ5IHRoZSB1c2VyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXJcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIGFkZHJlc3Nlcy5cclxuICAgKi9cclxuICBsaXN0QWRkcmVzc2VzID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZ1tdPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IExpc3RBZGRyZXNzZXNQYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5saXN0QWRkcmVzc2VzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFkZHJlc3Nlc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdHMgdGhlIHNldCBvZiBjdXJyZW50IHZhbGlkYXRvcnMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgT3B0aW9uYWwuIEVpdGhlciBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGFuXHJcbiAgICogY2I1OCBzZXJpYWxpemVkIHN0cmluZyBmb3IgdGhlIEFsbHljaGFpbklEIG9yIGl0cyBhbGlhcy5cclxuICAgKiBAcGFyYW0gbm9kZUlEcyBPcHRpb25hbC4gQW4gYXJyYXkgb2Ygc3RyaW5nc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9ycyB0aGF0IGFyZSBjdXJyZW50bHkgc3Rha2luZywgc2VlOiB7QGxpbmsgaHR0cHM6Ly9kb2NzLmF4Yy5uZXR3b3JrL3YxLjAvZW4vYXBpL2NvcmUvI3BsYXRmb3JtZ2V0Y3VycmVudHZhbGlkYXRvcnN8cGxhdGZvcm0uZ2V0Q3VycmVudFZhbGlkYXRvcnMgZG9jdW1lbnRhdGlvbn0uXHJcbiAgICpcclxuICAgKi9cclxuICBnZXRDdXJyZW50VmFsaWRhdG9ycyA9IGFzeW5jIChcclxuICAgIGFsbHljaGFpbklEOiBCdWZmZXIgfCBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSURzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZFxyXG4gICk6IFByb21pc2U8b2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldEN1cnJlbnRWYWxpZGF0b3JzUGFyYW1zID0ge31cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5vZGVJRHMgIT0gXCJ1bmRlZmluZWRcIiAmJiBub2RlSURzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcGFyYW1zLm5vZGVJRHMgPSBub2RlSURzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldEN1cnJlbnRWYWxpZGF0b3JzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMaXN0cyB0aGUgc2V0IG9mIHBlbmRpbmcgdmFsaWRhdG9ycy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5JRCBPcHRpb25hbC4gRWl0aGVyIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKiBvciBhIGNiNTggc2VyaWFsaXplZCBzdHJpbmcgZm9yIHRoZSBBbGx5Y2hhaW5JRCBvciBpdHMgYWxpYXMuXHJcbiAgICogQHBhcmFtIG5vZGVJRHMgT3B0aW9uYWwuIEFuIGFycmF5IG9mIHN0cmluZ3NcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIHZhbGlkYXRvcnMgdGhhdCBhcmUgcGVuZGluZyBzdGFraW5nLCBzZWU6IHtAbGluayBodHRwczovL2RvY3MuYXhjLm5ldHdvcmsvdjEuMC9lbi9hcGkvcGxhdGZvcm0vI3BsYXRmb3JtZ2V0cGVuZGluZ3ZhbGlkYXRvcnN8cGxhdGZvcm0uZ2V0UGVuZGluZ1ZhbGlkYXRvcnMgZG9jdW1lbnRhdGlvbn0uXHJcbiAgICpcclxuICAgKi9cclxuICBnZXRQZW5kaW5nVmFsaWRhdG9ycyA9IGFzeW5jIChcclxuICAgIGFsbHljaGFpbklEOiBCdWZmZXIgfCBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBub2RlSURzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZFxyXG4gICk6IFByb21pc2U8b2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldFBlbmRpbmdWYWxpZGF0b3JzUGFyYW1zID0ge31cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5vZGVJRHMgIT0gXCJ1bmRlZmluZWRcIiAmJiBub2RlSURzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcGFyYW1zLm5vZGVJRHMgPSBub2RlSURzXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRQZW5kaW5nVmFsaWRhdG9yc1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2FtcGxlcyBgU2l6ZWAgdmFsaWRhdG9ycyBmcm9tIHRoZSBjdXJyZW50IHZhbGlkYXRvciBzZXQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc2FtcGxlU2l6ZSBPZiB0aGUgdG90YWwgdW5pdmVyc2Ugb2YgdmFsaWRhdG9ycywgc2VsZWN0IHRoaXMgbWFueSBhdCByYW5kb21cclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgT3B0aW9uYWwuIEVpdGhlciBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGFuXHJcbiAgICogY2I1OCBzZXJpYWxpemVkIHN0cmluZyBmb3IgdGhlIEFsbHljaGFpbklEIG9yIGl0cyBhbGlhcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIHZhbGlkYXRvclwicyBzdGFraW5nSURzLlxyXG4gICAqL1xyXG4gIHNhbXBsZVZhbGlkYXRvcnMgPSBhc3luYyAoXHJcbiAgICBzYW1wbGVTaXplOiBudW1iZXIsXHJcbiAgICBhbGx5Y2hhaW5JRDogQnVmZmVyIHwgc3RyaW5nID0gdW5kZWZpbmVkXHJcbiAgKTogUHJvbWlzZTxzdHJpbmdbXT4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBTYW1wbGVWYWxpZGF0b3JzUGFyYW1zID0ge1xyXG4gICAgICBzaXplOiBzYW1wbGVTaXplLnRvU3RyaW5nKClcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLnNhbXBsZVZhbGlkYXRvcnNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudmFsaWRhdG9yc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIGEgdmFsaWRhdG9yIHRvIHRoZSBQcmltYXJ5IE5ldHdvcmsuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIHVzZXJuYW1lIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSBub2RlSUQgVGhlIG5vZGUgSUQgb2YgdGhlIHZhbGlkYXRvclxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgSmF2YXNjcmlwdCBEYXRlIG9iamVjdCBmb3IgdGhlIHN0YXJ0IHRpbWUgdG8gdmFsaWRhdGVcclxuICAgKiBAcGFyYW0gZW5kVGltZSBKYXZhc2NyaXB0IERhdGUgb2JqZWN0IGZvciB0aGUgZW5kIHRpbWUgdG8gdmFsaWRhdGVcclxuICAgKiBAcGFyYW0gc3Rha2VBbW91bnQgVGhlIGFtb3VudCBvZiBuQVhDIHRoZSB2YWxpZGF0b3IgaXMgc3Rha2luZyBhc1xyXG4gICAqIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKiBAcGFyYW0gcmV3YXJkQWRkcmVzcyBUaGUgYWRkcmVzcyB0aGUgdmFsaWRhdG9yIHJld2FyZCB3aWxsIGdvIHRvLCBpZiB0aGVyZSBpcyBvbmUuXHJcbiAgICogQHBhcmFtIG5vbWluYXRpb25GZWVSYXRlIE9wdGlvbmFsLiBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgcGVyY2VudCBmZWUgdGhpcyB2YWxpZGF0b3JcclxuICAgKiBjaGFyZ2VzIHdoZW4gb3RoZXJzIG5vbWluYXRlIHN0YWtlIHRvIHRoZW0uIFVwIHRvIDQgZGVjaW1hbCBwbGFjZXMgYWxsb3dlZCBhZGRpdGlvbmFsIGRlY2ltYWwgcGxhY2VzIGFyZSBpZ25vcmVkLlxyXG4gICAqIE11c3QgYmUgYmV0d2VlbiAwIGFuZCAxMDAsIGluY2x1c2l2ZS4gRm9yIGV4YW1wbGUsIGlmIG5vbWluYXRpb25GZWVSYXRlIGlzIDEuMjM0NSBhbmQgc29tZW9uZSBub21pbmF0ZXMgdG8gdGhpc1xyXG4gICAqIHZhbGlkYXRvciwgdGhlbiB3aGVuIHRoZSBub21pbmF0aW9uIHBlcmlvZCBpcyBvdmVyLCAxLjIzNDUlIG9mIHRoZSByZXdhcmQgZ29lcyB0byB0aGUgdmFsaWRhdG9yIGFuZCB0aGUgcmVzdCBnb2VzXHJcbiAgICogdG8gdGhlIG5vbWluYXRvci5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgYmFzZTU4IHN0cmluZyBvZiB0aGUgdW5zaWduZWQgdHJhbnNhY3Rpb24uXHJcbiAgICovXHJcbiAgYWRkVmFsaWRhdG9yID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBub2RlSUQ6IHN0cmluZyxcclxuICAgIHN0YXJ0VGltZTogRGF0ZSxcclxuICAgIGVuZFRpbWU6IERhdGUsXHJcbiAgICBzdGFrZUFtb3VudDogQk4sXHJcbiAgICByZXdhcmRBZGRyZXNzOiBzdHJpbmcsXHJcbiAgICBub21pbmF0aW9uRmVlUmF0ZTogQk4gPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBBZGRWYWxpZGF0b3JQYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgbm9kZUlELFxyXG4gICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZS5nZXRUaW1lKCkgLyAxMDAwLFxyXG4gICAgICBlbmRUaW1lOiBlbmRUaW1lLmdldFRpbWUoKSAvIDEwMDAsXHJcbiAgICAgIHN0YWtlQW1vdW50OiBzdGFrZUFtb3VudC50b1N0cmluZygxMCksXHJcbiAgICAgIHJld2FyZEFkZHJlc3NcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygbm9taW5hdGlvbkZlZVJhdGUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcGFyYW1zLm5vbWluYXRpb25GZWVSYXRlID0gbm9taW5hdGlvbkZlZVJhdGUudG9TdHJpbmcoMTApXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmFkZFZhbGlkYXRvclwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYSB2YWxpZGF0b3IgdG8gYSBBbGx5Y2hhaW4gb3RoZXIgdGhhbiB0aGUgUHJpbWFyeSBOZXR3b3JrLiBUaGUgdmFsaWRhdG9yIG11c3QgdmFsaWRhdGUgdGhlIFByaW1hcnkgTmV0d29yayBmb3IgdGhlIGVudGlyZSBkdXJhdGlvbiB0aGV5IHZhbGlkYXRlIHRoaXMgQWxseWNoYWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXJcclxuICAgKiBAcGFyYW0gbm9kZUlEIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3JcclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgRWl0aGVyIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb3IgYSBjYjU4IHNlcmlhbGl6ZWQgc3RyaW5nIGZvciB0aGUgQWxseWNoYWluSUQgb3IgaXRzIGFsaWFzLlxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgSmF2YXNjcmlwdCBEYXRlIG9iamVjdCBmb3IgdGhlIHN0YXJ0IHRpbWUgdG8gdmFsaWRhdGVcclxuICAgKiBAcGFyYW0gZW5kVGltZSBKYXZhc2NyaXB0IERhdGUgb2JqZWN0IGZvciB0aGUgZW5kIHRpbWUgdG8gdmFsaWRhdGVcclxuICAgKiBAcGFyYW0gd2VpZ2h0IFRoZSB2YWxpZGF0b3LigJlzIHdlaWdodCB1c2VkIGZvciBzYW1wbGluZ1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgdGhlIHVuc2lnbmVkIHRyYW5zYWN0aW9uLiBJdCBtdXN0IGJlIHNpZ25lZCAodXNpbmcgc2lnbikgYnkgdGhlIHByb3BlciBudW1iZXIgb2YgdGhlIEFsbHljaGFpbuKAmXMgY29udHJvbCBrZXlzIGFuZCBieSB0aGUga2V5IG9mIHRoZSBhY2NvdW50IHBheWluZyB0aGUgdHJhbnNhY3Rpb24gZmVlIGJlZm9yZSBpdCBjYW4gYmUgaXNzdWVkLlxyXG4gICAqL1xyXG4gIGFkZEFsbHljaGFpblZhbGlkYXRvciA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgbm9kZUlEOiBzdHJpbmcsXHJcbiAgICBhbGx5Y2hhaW5JRDogQnVmZmVyIHwgc3RyaW5nLFxyXG4gICAgc3RhcnRUaW1lOiBEYXRlLFxyXG4gICAgZW5kVGltZTogRGF0ZSxcclxuICAgIHdlaWdodDogbnVtYmVyXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIG5vZGVJRCxcclxuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWUuZ2V0VGltZSgpIC8gMTAwMCxcclxuICAgICAgZW5kVGltZTogZW5kVGltZS5nZXRUaW1lKCkgLyAxMDAwLFxyXG4gICAgICB3ZWlnaHRcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmFkZEFsbHljaGFpblZhbGlkYXRvclwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGQgYSBub21pbmF0b3IgdG8gdGhlIFByaW1hcnkgTmV0d29yay5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgdXNlcm5hbWUgb2YgdGhlIEtleXN0b3JlIHVzZXJcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIG5vZGVJRCBUaGUgbm9kZSBJRCBvZiB0aGUgbm9taW5hdGVcclxuICAgKiBAcGFyYW0gc3RhcnRUaW1lIEphdmFzY3JpcHQgRGF0ZSBvYmplY3QgZm9yIHdoZW4gdGhlIG5vbWluYXRvciBzdGFydHMgbm9taW5hdGluZ1xyXG4gICAqIEBwYXJhbSBlbmRUaW1lIEphdmFzY3JpcHQgRGF0ZSBvYmplY3QgZm9yIHdoZW4gdGhlIG5vbWluYXRvciBzdGFydHMgbm9taW5hdGluZ1xyXG4gICAqIEBwYXJhbSBzdGFrZUFtb3VudCBUaGUgYW1vdW50IG9mIG5BWEMgdGhlIG5vbWluYXRvciBpcyBzdGFraW5nIGFzXHJcbiAgICogYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSByZXdhcmRBZGRyZXNzIFRoZSBhZGRyZXNzIG9mIHRoZSBhY2NvdW50IHRoZSBzdGFrZWQgQVhDIGFuZCB2YWxpZGF0aW9uIHJld2FyZFxyXG4gICAqIChpZiBhcHBsaWNhYmxlKSBhcmUgc2VudCB0byBhdCBlbmRUaW1lXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciBhbiBhcnJheSBvZiB2YWxpZGF0b3JcInMgc3Rha2luZ0lEcy5cclxuICAgKi9cclxuICBhZGROb21pbmF0b3IgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIG5vZGVJRDogc3RyaW5nLFxyXG4gICAgc3RhcnRUaW1lOiBEYXRlLFxyXG4gICAgZW5kVGltZTogRGF0ZSxcclxuICAgIHN0YWtlQW1vdW50OiBCTixcclxuICAgIHJld2FyZEFkZHJlc3M6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEFkZE5vbWluYXRvclBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBub2RlSUQsXHJcbiAgICAgIHN0YXJ0VGltZTogc3RhcnRUaW1lLmdldFRpbWUoKSAvIDEwMDAsXHJcbiAgICAgIGVuZFRpbWU6IGVuZFRpbWUuZ2V0VGltZSgpIC8gMTAwMCxcclxuICAgICAgc3Rha2VBbW91bnQ6IHN0YWtlQW1vdW50LnRvU3RyaW5nKDEwKSxcclxuICAgICAgcmV3YXJkQWRkcmVzc1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5hZGROb21pbmF0b3JcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBBbGx5Y2hhaW4uIFRoZSB1bnNpZ25lZCB0cmFuc2FjdGlvbiBtdXN0IGJlXHJcbiAgICogc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCBwYXlpbmcgdGhlIHRyYW5zYWN0aW9uIGZlZS4gVGhlIEFsbHljaGFpbuKAmXMgSUQgaXMgdGhlIElEIG9mIHRoZSB0cmFuc2FjdGlvbiB0aGF0IGNyZWF0ZXMgaXQgKGllIHRoZSByZXNwb25zZSBmcm9tIGlzc3VlVHggd2hlbiBpc3N1aW5nIHRoZSBzaWduZWQgdHJhbnNhY3Rpb24pLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSB1c2VybmFtZSBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBUaGUgcGFzc3dvcmQgb2YgdGhlIEtleXN0b3JlIHVzZXJcclxuICAgKiBAcGFyYW0gY29udHJvbEtleXMgQXJyYXkgb2YgcGxhdGZvcm0gYWRkcmVzc2VzIGFzIHN0cmluZ3NcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIFRvIGFkZCBhIHZhbGlkYXRvciB0byB0aGlzIEFsbHljaGFpbiwgYSB0cmFuc2FjdGlvbiBtdXN0IGhhdmUgdGhyZXNob2xkXHJcbiAgICogc2lnbmF0dXJlcywgd2hlcmUgZWFjaCBzaWduYXR1cmUgaXMgZnJvbSBhIGtleSB3aG9zZSBhZGRyZXNzIGlzIGFuIGVsZW1lbnQgb2YgYGNvbnRyb2xLZXlzYFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBzdHJpbmcgd2l0aCB0aGUgdW5zaWduZWQgdHJhbnNhY3Rpb24gZW5jb2RlZCBhcyBiYXNlNTguXHJcbiAgICovXHJcbiAgY3JlYXRlQWxseWNoYWluID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBjb250cm9sS2V5czogc3RyaW5nW10sXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlclxyXG4gICk6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVhdGVBbGx5Y2hhaW5QYXJhbXMgPSB7XHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgY29udHJvbEtleXMsXHJcbiAgICAgIHRocmVzaG9sZFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5jcmVhdGVBbGx5Y2hhaW5cIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBBbGx5Y2hhaW4gdGhhdCB2YWxpZGF0ZXMgYSBnaXZlbiBibG9ja2NoYWluLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBFaXRoZXIgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvciBhIGNiNThcclxuICAgKiBlbmNvZGVkIHN0cmluZyBmb3IgdGhlIGJsb2NrY2hhaW5JRCBvciBpdHMgYWxpYXMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciBhIHN0cmluZyBvZiB0aGUgYWxseWNoYWluSUQgdGhhdCB2YWxpZGF0ZXMgdGhlIGJsb2NrY2hhaW4uXHJcbiAgICovXHJcbiAgdmFsaWRhdGVkQnkgPSBhc3luYyAoYmxvY2tjaGFpbklEOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgIGJsb2NrY2hhaW5JRFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS52YWxpZGF0ZWRCeVwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5hbGx5Y2hhaW5JRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBJRHMgb2YgdGhlIGJsb2NrY2hhaW5zIGEgQWxseWNoYWluIHZhbGlkYXRlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5JRCBFaXRoZXIgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvciBhbiBBWENcclxuICAgKiBzZXJpYWxpemVkIHN0cmluZyBmb3IgdGhlIEFsbHljaGFpbklEIG9yIGl0cyBhbGlhcy5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIGJsb2NrY2hhaW5JRHMgdGhlIGFsbHljaGFpbiB2YWxpZGF0ZXMuXHJcbiAgICovXHJcbiAgdmFsaWRhdGVzID0gYXN5bmMgKGFsbHljaGFpbklEOiBCdWZmZXIgfCBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IGFueSA9IHtcclxuICAgICAgYWxseWNoYWluSURcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgYWxseWNoYWluSUQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYWxseWNoYWluSURcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFsbHljaGFpbklEICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5hbGx5Y2hhaW5JRCA9IGJpbnRvb2xzLmNiNThFbmNvZGUoYWxseWNoYWluSUQpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLnZhbGlkYXRlc1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5ibG9ja2NoYWluSURzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYWxsIHRoZSBibG9ja2NoYWlucyB0aGF0IGV4aXN0IChleGNsdWRpbmcgdGhlIENvcmUtQ2hhaW4pLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYW4gYXJyYXkgb2Ygb2JqZWN0cyBjb250YWluaW5nIGZpZWxkcyBcImlkXCIsIFwiYWxseWNoYWluSURcIiwgYW5kIFwidm1JRFwiLlxyXG4gICAqL1xyXG4gIGdldEJsb2NrY2hhaW5zID0gYXN5bmMgKCk6IFByb21pc2U8QmxvY2tjaGFpbltdPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldEJsb2NrY2hhaW5zXCJcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5ibG9ja2NoYWluc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBBWEMgZnJvbSBhbiBhY2NvdW50IG9uIHRoZSBDb3JlLUNoYWluIHRvIGFuIGFkZHJlc3Mgb24gdGhlIFN3YXAtQ2hhaW4uIFRoaXMgdHJhbnNhY3Rpb25cclxuICAgKiBtdXN0IGJlIHNpZ25lZCB3aXRoIHRoZSBrZXkgb2YgdGhlIGFjY291bnQgdGhhdCB0aGUgQVhDIGlzIHNlbnQgZnJvbSBhbmQgd2hpY2ggcGF5cyB0aGVcclxuICAgKiB0cmFuc2FjdGlvbiBmZWUuIEFmdGVyIGlzc3VpbmcgdGhpcyB0cmFuc2FjdGlvbiwgeW91IG11c3QgY2FsbCB0aGUgU3dhcC1DaGFpbuKAmXMgaW1wb3J0QVhDXHJcbiAgICogbWV0aG9kIHRvIGNvbXBsZXRlIHRoZSB0cmFuc2Zlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgS2V5c3RvcmUgdXNlciB0aGF0IGNvbnRyb2xzIHRoZSBhY2NvdW50IHNwZWNpZmllZCBpbiBgdG9gXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgS2V5c3RvcmUgdXNlclxyXG4gICAqIEBwYXJhbSB0byBUaGUgYWRkcmVzcyBvbiB0aGUgU3dhcC1DaGFpbiB0byBzZW5kIHRoZSBBWEMgdG8uIERvIG5vdCBpbmNsdWRlIFN3YXAtIGluIHRoZSBhZGRyZXNzXHJcbiAgICogQHBhcmFtIGFtb3VudCBBbW91bnQgb2YgQVhDIHRvIGV4cG9ydCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciBhbiB1bnNpZ25lZCB0cmFuc2FjdGlvbiB0byBiZSBzaWduZWQgYnkgdGhlIGFjY291bnQgdGhlIHRoZSBBWEMgaXNcclxuICAgKiBzZW50IGZyb20gYW5kIHBheXMgdGhlIHRyYW5zYWN0aW9uIGZlZS5cclxuICAgKi9cclxuICBleHBvcnRBWEMgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZyxcclxuICAgIGFtb3VudDogQk4sXHJcbiAgICB0bzogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydEFYQ1BhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0byxcclxuICAgICAgYW1vdW50OiBhbW91bnQudG9TdHJpbmcoMTApXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmV4cG9ydEFYQ1wiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eElEXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZW5kIEFYQyBmcm9tIGFuIGFjY291bnQgb24gdGhlIENvcmUtQ2hhaW4gdG8gYW4gYWRkcmVzcyBvbiB0aGUgU3dhcC1DaGFpbi4gVGhpcyB0cmFuc2FjdGlvblxyXG4gICAqIG11c3QgYmUgc2lnbmVkIHdpdGggdGhlIGtleSBvZiB0aGUgYWNjb3VudCB0aGF0IHRoZSBBWEMgaXMgc2VudCBmcm9tIGFuZCB3aGljaCBwYXlzXHJcbiAgICogdGhlIHRyYW5zYWN0aW9uIGZlZS4gQWZ0ZXIgaXNzdWluZyB0aGlzIHRyYW5zYWN0aW9uLCB5b3UgbXVzdCBjYWxsIHRoZSBTd2FwLUNoYWlu4oCZc1xyXG4gICAqIGltcG9ydEFYQyBtZXRob2QgdG8gY29tcGxldGUgdGhlIHRyYW5zZmVyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVzZXJuYW1lIFRoZSBLZXlzdG9yZSB1c2VyIHRoYXQgY29udHJvbHMgdGhlIGFjY291bnQgc3BlY2lmaWVkIGluIGB0b2BcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIG9mIHRoZSBLZXlzdG9yZSB1c2VyXHJcbiAgICogQHBhcmFtIHRvIFRoZSBJRCBvZiB0aGUgYWNjb3VudCB0aGUgQVhDIGlzIHNlbnQgdG8uIFRoaXMgbXVzdCBiZSB0aGUgc2FtZSBhcyB0aGUgdG9cclxuICAgKiBhcmd1bWVudCBpbiB0aGUgY29ycmVzcG9uZGluZyBjYWxsIHRvIHRoZSBTd2FwLUNoYWlu4oCZcyBleHBvcnRBWENcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gVGhlIGNoYWluSUQgd2hlcmUgdGhlIGZ1bmRzIGFyZSBjb21pbmcgZnJvbS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgc3RyaW5nIGZvciB0aGUgdHJhbnNhY3Rpb24sIHdoaWNoIHNob3VsZCBiZSBzZW50IHRvIHRoZSBuZXR3b3JrXHJcbiAgICogYnkgY2FsbGluZyBpc3N1ZVR4LlxyXG4gICAqL1xyXG4gIGltcG9ydEFYQyA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgdG86IHN0cmluZyxcclxuICAgIHNvdXJjZUNoYWluOiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogSW1wb3J0QVhDUGFyYW1zID0ge1xyXG4gICAgICB0byxcclxuICAgICAgc291cmNlQ2hhaW4sXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5pbXBvcnRBWENcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4SURcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbHMgdGhlIG5vZGUncyBpc3N1ZVR4IG1ldGhvZCBmcm9tIHRoZSBBUEkgYW5kIHJldHVybnMgdGhlIHJlc3VsdGluZyB0cmFuc2FjdGlvbiBJRCBhcyBhIHN0cmluZy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB0eCBBIHN0cmluZywge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0sIG9yIFtbVHhdXSByZXByZXNlbnRpbmcgYSB0cmFuc2FjdGlvblxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBQcm9taXNlIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRyYW5zYWN0aW9uIElEIG9mIHRoZSBwb3N0ZWQgdHJhbnNhY3Rpb24uXHJcbiAgICovXHJcbiAgaXNzdWVUeCA9IGFzeW5jICh0eDogc3RyaW5nIHwgQnVmZmVyIHwgVHgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgbGV0IFRyYW5zYWN0aW9uID0gXCJcIlxyXG4gICAgaWYgKHR5cGVvZiB0eCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBUcmFuc2FjdGlvbiA9IHR4XHJcbiAgICB9IGVsc2UgaWYgKHR4IGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIGNvbnN0IHR4b2JqOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4b2JqLmZyb21CdWZmZXIodHgpXHJcbiAgICAgIFRyYW5zYWN0aW9uID0gdHhvYmoudG9TdHJpbmcoKVxyXG4gICAgfSBlbHNlIGlmICh0eCBpbnN0YW5jZW9mIFR4KSB7XHJcbiAgICAgIFRyYW5zYWN0aW9uID0gdHgudG9TdHJpbmcoKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IFRyYW5zYWN0aW9uRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIGNvcmUuaXNzdWVUeDogcHJvdmlkZWQgdHggaXMgbm90IGV4cGVjdGVkIHR5cGUgb2Ygc3RyaW5nLCBCdWZmZXIsIG9yIFR4XCJcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgIHR4OiBUcmFuc2FjdGlvbi50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmlzc3VlVHhcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudHhJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiB1cHBlciBib3VuZCBvbiB0aGUgYW1vdW50IG9mIHRva2VucyB0aGF0IGV4aXN0LiBOb3QgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIGJlY2F1c2UgdGhpcyBudW1iZXIgY2FuIGdvIGRvd24gaWYgYSBzdGFrZXJcInMgcmV3YXJkIGlzIGRlbmllZC5cclxuICAgKi9cclxuICBnZXRDdXJyZW50U3VwcGx5ID0gYXN5bmMgKCk6IFByb21pc2U8Qk4+ID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImNvcmUuZ2V0Q3VycmVudFN1cHBseVwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IEJOKHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1cHBseSwgMTApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBoZWlnaHQgb2YgdGhlIHBsYXRmb3JtIGNoYWluLlxyXG4gICAqL1xyXG4gIGdldEhlaWdodCA9IGFzeW5jICgpOiBQcm9taXNlPEJOPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldEhlaWdodFwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IEJOKHJlc3BvbnNlLmRhdGEucmVzdWx0LmhlaWdodCwgMTApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBtaW5pbXVtIHN0YWtpbmcgYW1vdW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlZnJlc2ggQSBib29sZWFuIHRvIGJ5cGFzcyB0aGUgbG9jYWwgY2FjaGVkIHZhbHVlIG9mIE1pbmltdW0gU3Rha2UgQW1vdW50LCBwb2xsaW5nIHRoZSBub2RlIGluc3RlYWQuXHJcbiAgICovXHJcbiAgZ2V0TWluU3Rha2UgPSBhc3luYyAoXHJcbiAgICByZWZyZXNoOiBib29sZWFuID0gZmFsc2VcclxuICApOiBQcm9taXNlPEdldE1pblN0YWtlUmVzcG9uc2U+ID0+IHtcclxuICAgIGlmIChcclxuICAgICAgcmVmcmVzaCAhPT0gdHJ1ZSAmJlxyXG4gICAgICB0eXBlb2YgdGhpcy5taW5WYWxpZGF0b3JTdGFrZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgICB0eXBlb2YgdGhpcy5taW5Ob21pbmF0b3JTdGFrZSAhPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbWluVmFsaWRhdG9yU3Rha2U6IHRoaXMubWluVmFsaWRhdG9yU3Rha2UsXHJcbiAgICAgICAgbWluTm9taW5hdG9yU3Rha2U6IHRoaXMubWluTm9taW5hdG9yU3Rha2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRNaW5TdGFrZVwiXHJcbiAgICApXHJcbiAgICB0aGlzLm1pblZhbGlkYXRvclN0YWtlID0gbmV3IEJOKHJlc3BvbnNlLmRhdGEucmVzdWx0Lm1pblZhbGlkYXRvclN0YWtlLCAxMClcclxuICAgIHRoaXMubWluTm9taW5hdG9yU3Rha2UgPSBuZXcgQk4ocmVzcG9uc2UuZGF0YS5yZXN1bHQubWluTm9taW5hdG9yU3Rha2UsIDEwKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbWluVmFsaWRhdG9yU3Rha2U6IHRoaXMubWluVmFsaWRhdG9yU3Rha2UsXHJcbiAgICAgIG1pbk5vbWluYXRvclN0YWtlOiB0aGlzLm1pbk5vbWluYXRvclN0YWtlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBnZXRUb3RhbFN0YWtlKCkgcmV0dXJucyB0aGUgdG90YWwgYW1vdW50IHN0YWtlZCBvbiB0aGUgUHJpbWFyeSBOZXR3b3JrXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIGJpZyBudW1iZXIgcmVwcmVzZW50aW5nIHRvdGFsIHN0YWtlZCBieSB2YWxpZGF0b3JzIG9uIHRoZSBwcmltYXJ5IG5ldHdvcmtcclxuICAgKi9cclxuICBnZXRUb3RhbFN0YWtlID0gYXN5bmMgKCk6IFByb21pc2U8Qk4+ID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImNvcmUuZ2V0VG90YWxTdGFrZVwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gbmV3IEJOKHJlc3BvbnNlLmRhdGEucmVzdWx0LnN0YWtlLCAxMClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGdldE1heFN0YWtlQW1vdW50KCkgcmV0dXJucyB0aGUgbWF4aW11bSBhbW91bnQgb2YgbkFYQyBzdGFraW5nIHRvIHRoZSBuYW1lZCBub2RlIGR1cmluZyB0aGUgdGltZSBwZXJpb2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWxseWNoYWluSUQgQSBCdWZmZXIgb3IgY2I1OCBzdHJpbmcgcmVwcmVzZW50aW5nIGFsbHljaGFpblxyXG4gICAqIEBwYXJhbSBub2RlSUQgQSBzdHJpbmcgcmVwcmVzZW50aW5nIElEIG9mIHRoZSBub2RlIHdob3NlIHN0YWtlIGFtb3VudCBpcyByZXF1aXJlZCBkdXJpbmcgdGhlIGdpdmVuIGR1cmF0aW9uXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBBIGJpZyBudW1iZXIgZGVub3Rpbmcgc3RhcnQgdGltZSBvZiB0aGUgZHVyYXRpb24gZHVyaW5nIHdoaWNoIHN0YWtlIGFtb3VudCBvZiB0aGUgbm9kZSBpcyByZXF1aXJlZC5cclxuICAgKiBAcGFyYW0gZW5kVGltZSBBIGJpZyBudW1iZXIgZGVub3RpbmcgZW5kIHRpbWUgb2YgdGhlIGR1cmF0aW9uIGR1cmluZyB3aGljaCBzdGFrZSBhbW91bnQgb2YgdGhlIG5vZGUgaXMgcmVxdWlyZWQuXHJcbiAgICogQHJldHVybnMgQSBiaWcgbnVtYmVyIHJlcHJlc2VudGluZyB0b3RhbCBzdGFrZWQgYnkgdmFsaWRhdG9ycyBvbiB0aGUgcHJpbWFyeSBuZXR3b3JrXHJcbiAgICovXHJcbiAgZ2V0TWF4U3Rha2VBbW91bnQgPSBhc3luYyAoXHJcbiAgICBhbGx5Y2hhaW5JRDogc3RyaW5nIHwgQnVmZmVyLFxyXG4gICAgbm9kZUlEOiBzdHJpbmcsXHJcbiAgICBzdGFydFRpbWU6IEJOLFxyXG4gICAgZW5kVGltZTogQk5cclxuICApOiBQcm9taXNlPEJOPiA9PiB7XHJcbiAgICBjb25zdCBub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICBpZiAoc3RhcnRUaW1lLmd0KG5vdykgfHwgZW5kVGltZS5sdGUoc3RhcnRUaW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgVGltZUVycm9yKFxyXG4gICAgICAgIFwiUGxhdGZvcm1WTUFQSS5nZXRNYXhTdGFrZUFtb3VudCAtLSBzdGFydFRpbWUgbXVzdCBiZSBpbiB0aGUgcGFzdCBhbmQgZW5kVGltZSBtdXN0IGNvbWUgYWZ0ZXIgc3RhcnRUaW1lXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0TWF4U3Rha2VBbW91bnRQYXJhbXMgPSB7XHJcbiAgICAgIG5vZGVJRCxcclxuICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICBlbmRUaW1lXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBhbGx5Y2hhaW5JRCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBwYXJhbXMuYWxseWNoYWluSUQgPSBhbGx5Y2hhaW5JRFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYWxseWNoYWluSUQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcGFyYW1zLmFsbHljaGFpbklEID0gYmludG9vbHMuY2I1OEVuY29kZShhbGx5Y2hhaW5JRClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldE1heFN0YWtlQW1vdW50XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIG5ldyBCTihyZXNwb25zZS5kYXRhLnJlc3VsdC5hbW91bnQsIDEwKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgbWluaW11bSBzdGFrZSBjYWNoZWQgaW4gdGhpcyBjbGFzcy5cclxuICAgKiBAcGFyYW0gbWluVmFsaWRhdG9yU3Rha2UgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfSB0byBzZXQgdGhlIG1pbmltdW0gc3Rha2UgYW1vdW50IGNhY2hlZCBpbiB0aGlzIGNsYXNzLlxyXG4gICAqIEBwYXJhbSBtaW5Ob21pbmF0b3JTdGFrZSBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IHRvIHNldCB0aGUgbWluaW11bSBub21pbmF0aW9uIGFtb3VudCBjYWNoZWQgaW4gdGhpcyBjbGFzcy5cclxuICAgKi9cclxuICBzZXRNaW5TdGFrZSA9IChcclxuICAgIG1pblZhbGlkYXRvclN0YWtlOiBCTiA9IHVuZGVmaW5lZCxcclxuICAgIG1pbk5vbWluYXRvclN0YWtlOiBCTiA9IHVuZGVmaW5lZFxyXG4gICk6IHZvaWQgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBtaW5WYWxpZGF0b3JTdGFrZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLm1pblZhbGlkYXRvclN0YWtlID0gbWluVmFsaWRhdG9yU3Rha2VcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbWluTm9taW5hdG9yU3Rha2UgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhpcy5taW5Ob21pbmF0b3JTdGFrZSA9IG1pbk5vbWluYXRvclN0YWtlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSB0b3RhbCBhbW91bnQgc3Rha2VkIGZvciBhbiBhcnJheSBvZiBhZGRyZXNzZXMuXHJcbiAgICovXHJcbiAgZ2V0U3Rha2UgPSBhc3luYyAoXHJcbiAgICBhZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgZW5jb2Rpbmc6IHN0cmluZyA9IFwiY2I1OFwiXHJcbiAgKTogUHJvbWlzZTxHZXRTdGFrZVJlc3BvbnNlPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldFN0YWtlUGFyYW1zID0ge1xyXG4gICAgICBhZGRyZXNzZXMsXHJcbiAgICAgIGVuY29kaW5nXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldFN0YWtlXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3Rha2VkOiBuZXcgQk4ocmVzcG9uc2UuZGF0YS5yZXN1bHQuc3Rha2VkLCAxMCksXHJcbiAgICAgIHN0YWtlZE91dHB1dHM6IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN0YWtlZE91dHB1dHMubWFwKFxyXG4gICAgICAgIChzdGFrZWRPdXRwdXQ6IHN0cmluZyk6IFRyYW5zZmVyYWJsZU91dHB1dCA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9XHJcbiAgICAgICAgICAgIG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG4gICAgICAgICAgbGV0IGJ1ZjogQnVmZmVyXHJcbiAgICAgICAgICBpZiAoZW5jb2RpbmcgPT09IFwiY2I1OFwiKSB7XHJcbiAgICAgICAgICAgIGJ1ZiA9IGJpbnRvb2xzLmNiNThEZWNvZGUoc3Rha2VkT3V0cHV0KVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnVmID0gQnVmZmVyLmZyb20oc3Rha2VkT3V0cHV0LnJlcGxhY2UoLzB4L2csIFwiXCIpLCBcImhleFwiKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdHJhbnNmZXJhYmxlT3V0cHV0LmZyb21CdWZmZXIoYnVmLCAyKVxyXG4gICAgICAgICAgcmV0dXJuIHRyYW5zZmVyYWJsZU91dHB1dFxyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGFsbCB0aGUgYWxseWNoYWlucyB0aGF0IGV4aXN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGlkcyBJRHMgb2YgdGhlIGFsbHljaGFpbnMgdG8gcmV0cmlldmUgaW5mb3JtYXRpb24gYWJvdXQuIElmIG9taXR0ZWQsIGdldHMgYWxsIGFsbHljaGFpbnNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIGFycmF5IG9mIG9iamVjdHMgY29udGFpbmluZyBmaWVsZHMgXCJpZFwiLFxyXG4gICAqIFwiY29udHJvbEtleXNcIiwgYW5kIFwidGhyZXNob2xkXCIuXHJcbiAgICovXHJcbiAgZ2V0QWxseWNoYWlucyA9IGFzeW5jIChpZHM6IHN0cmluZ1tdID0gdW5kZWZpbmVkKTogUHJvbWlzZTxBbGx5Y2hhaW5bXT4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7fVxyXG4gICAgaWYgKHR5cGVvZiBpZHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBwYXJhbXMuaWRzID0gaWRzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldEFsbHljaGFpbnNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYWxseWNoYWluc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0cyB0aGUgcHJpdmF0ZSBrZXkgZm9yIGFuIGFkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIG5hbWUgb2YgdGhlIHVzZXIgd2l0aCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHBhc3N3b3JkIHVzZWQgdG8gZGVjcnlwdCB0aGUgcHJpdmF0ZSBrZXlcclxuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyB3aG9zZSBwcml2YXRlIGtleSBzaG91bGQgYmUgZXhwb3J0ZWRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCB0aGUgZGVjcnlwdGVkIHByaXZhdGUga2V5IGFzIHN0b3JlIGluIHRoZSBkYXRhYmFzZVxyXG4gICAqL1xyXG4gIGV4cG9ydEtleSA9IGFzeW5jIChcclxuICAgIHVzZXJuYW1lOiBzdHJpbmcsXHJcbiAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgYWRkcmVzczogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEV4cG9ydEtleVBhcmFtcyA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBhZGRyZXNzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmV4cG9ydEtleVwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5wcml2YXRlS2V5XHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQucHJpdmF0ZUtleVxyXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHaXZlIGEgdXNlciBjb250cm9sIG92ZXIgYW4gYWRkcmVzcyBieSBwcm92aWRpbmcgdGhlIHByaXZhdGUga2V5IHRoYXQgY29udHJvbHMgdGhlIGFkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIG5hbWUgb2YgdGhlIHVzZXIgdG8gc3RvcmUgdGhlIHByaXZhdGUga2V5XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCB0aGF0IHVubG9ja3MgdGhlIHVzZXJcclxuICAgKiBAcGFyYW0gcHJpdmF0ZUtleSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5IGluIHRoZSB2bVwicyBmb3JtYXRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBhZGRyZXNzIGZvciB0aGUgaW1wb3J0ZWQgcHJpdmF0ZSBrZXkuXHJcbiAgICovXHJcbiAgaW1wb3J0S2V5ID0gYXN5bmMgKFxyXG4gICAgdXNlcm5hbWU6IHN0cmluZyxcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBwcml2YXRlS2V5OiBzdHJpbmdcclxuICApOiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogSW1wb3J0S2V5UGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIHByaXZhdGVLZXlcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImNvcmUuaW1wb3J0S2V5XCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG5cclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5hZGRyZXNzXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYWRkcmVzc1xyXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB0cmVhbnNhY3Rpb24gZGF0YSBvZiBhIHByb3ZpZGVkIHRyYW5zYWN0aW9uIElEIGJ5IGNhbGxpbmcgdGhlIG5vZGUncyBgZ2V0VHhgIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB0eElEIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYW5zYWN0aW9uIElEXHJcbiAgICogQHBhcmFtIGVuY29kaW5nIHNldHMgdGhlIGZvcm1hdCBvZiB0aGUgcmV0dXJuZWQgdHJhbnNhY3Rpb24uIENhbiBiZSwgXCJjYjU4XCIsIFwiaGV4XCIgb3IgXCJqc29uXCIuIERlZmF1bHRzIHRvIFwiY2I1OFwiLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2Ugc3RyaW5nIG9yIG9iamVjdCBjb250YWluaW5nIHRoZSBieXRlcyByZXRyaWV2ZWQgZnJvbSB0aGUgbm9kZVxyXG4gICAqL1xyXG4gIGdldFR4ID0gYXN5bmMgKFxyXG4gICAgdHhJRDogc3RyaW5nLFxyXG4gICAgZW5jb2Rpbmc6IHN0cmluZyA9IFwiY2I1OFwiXHJcbiAgKTogUHJvbWlzZTxzdHJpbmcgfCBvYmplY3Q+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogYW55ID0ge1xyXG4gICAgICB0eElELFxyXG4gICAgICBlbmNvZGluZ1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiY29yZS5nZXRUeFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC50eFxyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnR4XHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0YXR1cyBvZiBhIHByb3ZpZGVkIHRyYW5zYWN0aW9uIElEIGJ5IGNhbGxpbmcgdGhlIG5vZGUncyBgZ2V0VHhTdGF0dXNgIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB0eGlkIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYW5zYWN0aW9uIElEXHJcbiAgICogQHBhcmFtIGluY2x1ZGVSZWFzb24gUmV0dXJuIHRoZSByZWFzb24gdHggd2FzIGRyb3BwZWQsIGlmIGFwcGxpY2FibGUuIERlZmF1bHRzIHRvIHRydWVcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSBzdGF0dXMgcmV0cmlldmVkIGZyb20gdGhlIG5vZGUgYW5kIHRoZSByZWFzb24gYSB0eCB3YXMgZHJvcHBlZCwgaWYgYXBwbGljYWJsZS5cclxuICAgKi9cclxuICBnZXRUeFN0YXR1cyA9IGFzeW5jIChcclxuICAgIHR4aWQ6IHN0cmluZyxcclxuICAgIGluY2x1ZGVSZWFzb246IGJvb2xlYW4gPSB0cnVlXHJcbiAgKTogUHJvbWlzZTxzdHJpbmcgfCBHZXRUeFN0YXR1c1Jlc3BvbnNlPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldFR4U3RhdHVzUGFyYW1zID0ge1xyXG4gICAgICB0eElEOiB0eGlkLFxyXG4gICAgICBpbmNsdWRlUmVhc29uOiBpbmNsdWRlUmVhc29uXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldFR4U3RhdHVzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgdGhlIFVUWE9zIHJlbGF0ZWQgdG8gdGhlIGFkZHJlc3NlcyBwcm92aWRlZCBmcm9tIHRoZSBub2RlJ3MgYGdldFVUWE9zYCBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyBjYjU4IHN0cmluZ3Mgb3IgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9c1xyXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBBIHN0cmluZyBmb3IgdGhlIGNoYWluIHRvIGxvb2sgZm9yIHRoZSBVVFhPXCJzLiBEZWZhdWx0IGlzIHRvIHVzZSB0aGlzIGNoYWluLCBidXQgaWYgZXhwb3J0ZWQgVVRYT3MgZXhpc3QgZnJvbSBvdGhlciBjaGFpbnMsIHRoaXMgY2FuIHVzZWQgdG8gcHVsbCB0aGVtIGluc3RlYWQuXHJcbiAgICogQHBhcmFtIGxpbWl0IE9wdGlvbmFsLiBSZXR1cm5zIGF0IG1vc3QgW2xpbWl0XSBhZGRyZXNzZXMuIElmIFtsaW1pdF0gPT0gMCBvciA+IFttYXhVVFhPc1RvRmV0Y2hdLCBmZXRjaGVzIHVwIHRvIFttYXhVVFhPc1RvRmV0Y2hdLlxyXG4gICAqIEBwYXJhbSBzdGFydEluZGV4IE9wdGlvbmFsLiBbU3RhcnRJbmRleF0gZGVmaW5lcyB3aGVyZSB0byBzdGFydCBmZXRjaGluZyBVVFhPcyAoZm9yIHBhZ2luYXRpb24uKVxyXG4gICAqIFVUWE9zIGZldGNoZWQgYXJlIGZyb20gYWRkcmVzc2VzIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5BZGRyZXNzXVxyXG4gICAqIEZvciBhZGRyZXNzIFtTdGFydEluZGV4LkFkZHJlc3NdLCBvbmx5IFVUWE9zIHdpdGggSURzIGdyZWF0ZXIgdGhhbiBbU3RhcnRJbmRleC5VdHhvXSB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAqIEBwYXJhbSBwZXJzaXN0T3B0cyBPcHRpb25zIGF2YWlsYWJsZSB0byBwZXJzaXN0IHRoZXNlIFVUWE9zIGluIGxvY2FsIHN0b3JhZ2VcclxuICAgKiBAcGFyYW0gZW5jb2RpbmcgT3B0aW9uYWwuICBpcyB0aGUgZW5jb2RpbmcgZm9ybWF0IHRvIHVzZSBmb3IgdGhlIHBheWxvYWQgYXJndW1lbnQuIENhbiBiZSBlaXRoZXIgXCJjYjU4XCIgb3IgXCJoZXhcIi4gRGVmYXVsdHMgdG8gXCJoZXhcIi5cclxuICAgKlxyXG4gICAqIEByZW1hcmtzXHJcbiAgICogcGVyc2lzdE9wdHMgaXMgb3B0aW9uYWwgYW5kIG11c3QgYmUgb2YgdHlwZSBbW1BlcnNpc3RhbmNlT3B0aW9uc11dXHJcbiAgICpcclxuICAgKi9cclxuICBnZXRVVFhPcyA9IGFzeW5jIChcclxuICAgIGFkZHJlc3Nlczogc3RyaW5nW10gfCBzdHJpbmcsXHJcbiAgICBzb3VyY2VDaGFpbjogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgbGltaXQ6IG51bWJlciA9IDAsXHJcbiAgICBzdGFydEluZGV4OiB7IGFkZHJlc3M6IHN0cmluZzsgdXR4bzogc3RyaW5nIH0gPSB1bmRlZmluZWQsXHJcbiAgICBwZXJzaXN0T3B0czogUGVyc2lzdGFuY2VPcHRpb25zID0gdW5kZWZpbmVkLFxyXG4gICAgZW5jb2Rpbmc6IHN0cmluZyA9IFwiY2I1OFwiXHJcbiAgKTogUHJvbWlzZTxHZXRVVFhPc1Jlc3BvbnNlPiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGFkZHJlc3NlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBhZGRyZXNzZXMgPSBbYWRkcmVzc2VzXVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmFtczogR2V0VVRYT3NQYXJhbXMgPSB7XHJcbiAgICAgIGFkZHJlc3NlczogYWRkcmVzc2VzLFxyXG4gICAgICBsaW1pdCxcclxuICAgICAgZW5jb2RpbmdcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2Ygc3RhcnRJbmRleCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzdGFydEluZGV4KSB7XHJcbiAgICAgIHBhcmFtcy5zdGFydEluZGV4ID0gc3RhcnRJbmRleFxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygc291cmNlQ2hhaW4gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcGFyYW1zLnNvdXJjZUNoYWluID0gc291cmNlQ2hhaW5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldFVUWE9zXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IHV0eG9zOiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLnJlc3VsdC51dHhvc1xyXG4gICAgaWYgKHBlcnNpc3RPcHRzICYmIHR5cGVvZiBwZXJzaXN0T3B0cyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICBpZiAodGhpcy5kYi5oYXMocGVyc2lzdE9wdHMuZ2V0TmFtZSgpKSkge1xyXG4gICAgICAgIGNvbnN0IHNlbGZBcnJheTogc3RyaW5nW10gPSB0aGlzLmRiLmdldChwZXJzaXN0T3B0cy5nZXROYW1lKCkpXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZkFycmF5KSkge1xyXG4gICAgICAgICAgdXR4b3MuYWRkQXJyYXkoZGF0YSlcclxuICAgICAgICAgIGNvbnN0IHNlbGY6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgICBzZWxmLmFkZEFycmF5KHNlbGZBcnJheSlcclxuICAgICAgICAgIHNlbGYubWVyZ2VCeVJ1bGUodXR4b3MsIHBlcnNpc3RPcHRzLmdldE1lcmdlUnVsZSgpKVxyXG4gICAgICAgICAgZGF0YSA9IHNlbGYuZ2V0QWxsVVRYT1N0cmluZ3MoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRiLnNldChwZXJzaXN0T3B0cy5nZXROYW1lKCksIGRhdGEsIHBlcnNpc3RPcHRzLmdldE92ZXJ3cml0ZSgpKVxyXG4gICAgfVxyXG4gICAgdXR4b3MuYWRkQXJyYXkoZGF0YSwgZmFsc2UpXHJcbiAgICByZXNwb25zZS5kYXRhLnJlc3VsdC51dHhvcyA9IHV0eG9zXHJcbiAgICByZXNwb25zZS5kYXRhLnJlc3VsdC5udW1GZXRjaGVkID0gcGFyc2VJbnQocmVzcG9uc2UuZGF0YS5yZXN1bHQubnVtRmV0Y2hlZClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgSW1wb3J0IFR4LiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5ICh3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgW1tUcmFuc2ZlcmFibGVJbnB1dF1dcywgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXMsIGFuZCBbW1RyYW5zZmVyT3BlcmF0aW9uXV1zKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIG93bmVyQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgYmVpbmcgdXNlZCB0byBpbXBvcnRcclxuICAgKiBAcGFyYW0gc291cmNlQ2hhaW4gVGhlIGNoYWluaWQgZm9yIHdoZXJlIHRoZSBpbXBvcnQgaXMgY29taW5nIGZyb20uXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdG8gc2VuZCB0aGUgZnVuZHNcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIGJlaW5nIHVzZWQgdG8gc2VuZCB0aGUgZnVuZHMgZnJvbSB0aGUgVVRYT3MgcHJvdmlkZWRcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIFRoZSBhZGRyZXNzZXMgdGhhdCBjYW4gc3BlbmQgdGhlIGNoYW5nZSByZW1haW5pbmcgZnJvbSB0aGUgc3BlbnQgVVRYT3NcclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGxvY2t0aW1lIE9wdGlvbmFsLiBUaGUgbG9ja3RpbWUgZmllbGQgY3JlYXRlZCBpbiB0aGUgcmVzdWx0aW5nIG91dHB1dHNcclxuICAgKiBAcGFyYW0gdGhyZXNob2xkIE9wdGlvbmFsLiBUaGUgbnVtYmVyIG9mIHNpZ25hdHVyZXMgcmVxdWlyZWQgdG8gc3BlbmQgdGhlIGZ1bmRzIGluIHRoZSByZXN1bHRhbnQgVVRYT1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gKFtbVW5zaWduZWRUeF1dKSB3aGljaCBjb250YWlucyBhIFtbSW1wb3J0VHhdXS5cclxuICAgKlxyXG4gICAqIEByZW1hcmtzXHJcbiAgICogVGhpcyBoZWxwZXIgZXhpc3RzIGJlY2F1c2UgdGhlIGVuZHBvaW50IEFQSSBzaG91bGQgYmUgdGhlIHByaW1hcnkgcG9pbnQgb2YgZW50cnkgZm9yIG1vc3QgZnVuY3Rpb25hbGl0eS5cclxuICAgKi9cclxuICBidWlsZEltcG9ydFR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIG93bmVyQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIHNvdXJjZUNoYWluOiBCdWZmZXIgfCBzdHJpbmcsXHJcbiAgICB0b0FkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGNoYW5nZUFkZHJlc3Nlczogc3RyaW5nW10gPSB1bmRlZmluZWQsXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpLFxyXG4gICAgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApLFxyXG4gICAgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCB0bzogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRCYXNlVHhcIlxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICBcImJ1aWxkQmFzZVR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRCYXNlVHhcIlxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcblxyXG4gICAgbGV0IHNyYXhDaGFpbjogc3RyaW5nID0gdW5kZWZpbmVkXHJcblxyXG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDaGFpbiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBQbGF0Zm9ybVZNQVBJLmJ1aWxkSW1wb3J0VHg6IFNvdXJjZSBDaGFpbklEIGlzIHVuZGVmaW5lZC5cIlxyXG4gICAgICApXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2VDaGFpbiA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBzcmF4Q2hhaW4gPSBzb3VyY2VDaGFpblxyXG4gICAgICBzb3VyY2VDaGFpbiA9IGJpbnRvb2xzLmNiNThEZWNvZGUoc291cmNlQ2hhaW4pXHJcbiAgICB9IGVsc2UgaWYgKCEoc291cmNlQ2hhaW4gaW5zdGFuY2VvZiBCdWZmZXIpKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFBsYXRmb3JtVk1BUEkuYnVpbGRJbXBvcnRUeDogSW52YWxpZCBkZXN0aW5hdGlvbkNoYWluIHR5cGU6IFwiICtcclxuICAgICAgICAgIHR5cGVvZiBzb3VyY2VDaGFpblxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBjb25zdCBhdG9taWNVVFhPczogVVRYT1NldCA9IGF3YWl0IChcclxuICAgICAgYXdhaXQgdGhpcy5nZXRVVFhPcyhvd25lckFkZHJlc3Nlcywgc3JheENoYWluLCAwLCB1bmRlZmluZWQpXHJcbiAgICApLnV0eG9zXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXRvbWljczogVVRYT1tdID0gYXRvbWljVVRYT3MuZ2V0QWxsVVRYT3MoKVxyXG5cclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRJbXBvcnRUeChcclxuICAgICAgdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKHRoaXMuYmxvY2tjaGFpbklEKSxcclxuICAgICAgdG8sXHJcbiAgICAgIGZyb20sXHJcbiAgICAgIGNoYW5nZSxcclxuICAgICAgYXRvbWljcyxcclxuICAgICAgc291cmNlQ2hhaW4sXHJcbiAgICAgIHRoaXMuZ2V0VHhGZWUoKSxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgbWVtbyxcclxuICAgICAgYXNPZixcclxuICAgICAgbG9ja3RpbWUsXHJcbiAgICAgIHRocmVzaG9sZFxyXG4gICAgKVxyXG5cclxuICAgIGlmICghKGF3YWl0IHRoaXMuY2hlY2tHb29zZUVnZyhidWlsdFVuc2lnbmVkVHgpKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgR29vc2VFZ2dDaGVja0Vycm9yKFwiRmFpbGVkIEdvb3NlIEVnZyBDaGVja1wiKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBidWlsdFVuc2lnbmVkVHhcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIGFuIHVuc2lnbmVkIEV4cG9ydCBUeC4gRm9yIG1vcmUgZ3JhbnVsYXIgY29udHJvbCwgeW91IG1heSBjcmVhdGUgeW91ciBvd25cclxuICAgKiBbW1Vuc2lnbmVkVHhdXSBtYW51YWxseSAod2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMsIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zLCBhbmQgW1tUcmFuc2Zlck9wZXJhdGlvbl1dcykuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXR4b3NldCBBIHNldCBvZiBVVFhPcyB0aGF0IHRoZSB0cmFuc2FjdGlvbiBpcyBidWlsdCBvblxyXG4gICAqIEBwYXJhbSBhbW91bnQgVGhlIGFtb3VudCBiZWluZyBleHBvcnRlZCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGRlc3RpbmF0aW9uQ2hhaW4gVGhlIGNoYWluaWQgZm9yIHdoZXJlIHRoZSBhc3NldHMgd2lsbCBiZSBzZW50LlxyXG4gICAqIEBwYXJhbSB0b0FkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRvIHNlbmQgdGhlIGZ1bmRzXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHByb3ZpZGVkXHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBsb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyBvdXRwdXRzXHJcbiAgICogQHBhcmFtIHRocmVzaG9sZCBPcHRpb25hbC4gVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIHNwZW5kIHRoZSBmdW5kcyBpbiB0aGUgcmVzdWx0YW50IFVUWE9cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIChbW1Vuc2lnbmVkVHhdXSkgd2hpY2ggY29udGFpbnMgYW4gW1tFeHBvcnRUeF1dLlxyXG4gICAqL1xyXG4gIGJ1aWxkRXhwb3J0VHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgYW1vdW50OiBCTixcclxuICAgIGRlc3RpbmF0aW9uQ2hhaW46IEJ1ZmZlciB8IHN0cmluZyxcclxuICAgIHRvQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZCxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBsb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGxldCBwcmVmaXhlczogb2JqZWN0ID0ge31cclxuICAgIHRvQWRkcmVzc2VzLm1hcCgoYTogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICAgIHByZWZpeGVzW2Euc3BsaXQoXCItXCIpWzBdXSA9IHRydWVcclxuICAgIH0pXHJcbiAgICBpZiAoT2JqZWN0LmtleXMocHJlZml4ZXMpLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBQbGF0Zm9ybVZNQVBJLmJ1aWxkRXhwb3J0VHg6IFRvIGFkZHJlc3NlcyBtdXN0IGhhdmUgdGhlIHNhbWUgY2hhaW5JRCBwcmVmaXguXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgZGVzdGluYXRpb25DaGFpbiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBQbGF0Zm9ybVZNQVBJLmJ1aWxkRXhwb3J0VHg6IERlc3RpbmF0aW9uIENoYWluSUQgaXMgdW5kZWZpbmVkLlwiXHJcbiAgICAgIClcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc3RpbmF0aW9uQ2hhaW4gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgZGVzdGluYXRpb25DaGFpbiA9IGJpbnRvb2xzLmNiNThEZWNvZGUoZGVzdGluYXRpb25DaGFpbikgLy9cclxuICAgIH0gZWxzZSBpZiAoIShkZXN0aW5hdGlvbkNoYWluIGluc3RhbmNlb2YgQnVmZmVyKSkge1xyXG4gICAgICB0aHJvdyBuZXcgQ2hhaW5JZEVycm9yKFxyXG4gICAgICAgIFwiRXJyb3IgLSBQbGF0Zm9ybVZNQVBJLmJ1aWxkRXhwb3J0VHg6IEludmFsaWQgZGVzdGluYXRpb25DaGFpbiB0eXBlOiBcIiArXHJcbiAgICAgICAgICB0eXBlb2YgZGVzdGluYXRpb25DaGFpblxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICBpZiAoZGVzdGluYXRpb25DaGFpbi5sZW5ndGggIT09IDMyKSB7XHJcbiAgICAgIHRocm93IG5ldyBDaGFpbklkRXJyb3IoXHJcbiAgICAgICAgXCJFcnJvciAtIFBsYXRmb3JtVk1BUEkuYnVpbGRFeHBvcnRUeDogRGVzdGluYXRpb24gQ2hhaW5JRCBtdXN0IGJlIDMyIGJ5dGVzIGluIGxlbmd0aC5cIlxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgICAvKlxyXG4gICAgaWYoYmludG9vbHMuY2I1OEVuY29kZShkZXN0aW5hdGlvbkNoYWluKSAhPT0gRGVmYXVsdHMubmV0d29ya1t0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCldLlN3YXBbXCJibG9ja2NoYWluSURcIl0pIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgLSBQbGF0Zm9ybVZNQVBJLmJ1aWxkRXhwb3J0VHg6IERlc3RpbmF0aW9uIENoYWluSUQgbXVzdCBUaGUgU3dhcC1DaGFpbiBJRCBpbiB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIEF4aWFKUy5cIilcclxuICAgIH0qL1xyXG5cclxuICAgIGxldCB0bzogQnVmZmVyW10gPSBbXVxyXG4gICAgdG9BZGRyZXNzZXMubWFwKChhOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgdG8ucHVzaChiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICB9KVxyXG4gICAgY29uc3QgZnJvbTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEV4cG9ydFR4XCJcclxuICAgICkubWFwKChhKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuICAgIGNvbnN0IGNoYW5nZTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgY2hhbmdlQWRkcmVzc2VzLFxyXG4gICAgICBcImJ1aWxkRXhwb3J0VHhcIlxyXG4gICAgKS5tYXAoKGEpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuXHJcbiAgICBjb25zdCBidWlsdFVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSB1dHhvc2V0LmJ1aWxkRXhwb3J0VHgoXHJcbiAgICAgIHRoaXMuY29yZS5nZXROZXR3b3JrSUQoKSxcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRCksXHJcbiAgICAgIGFtb3VudCxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgdG8sXHJcbiAgICAgIGZyb20sXHJcbiAgICAgIGNoYW5nZSxcclxuICAgICAgZGVzdGluYXRpb25DaGFpbixcclxuICAgICAgdGhpcy5nZXRUeEZlZSgpLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBsb2NrdGltZSxcclxuICAgICAgdGhyZXNob2xkXHJcbiAgICApXHJcblxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXCJGYWlsZWQgR29vc2UgRWdnIENoZWNrXCIpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgW1tBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeF1dLiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5IGFuZCBpbXBvcnQgdGhlIFtbQWRkQWxseWNoYWluVmFsaWRhdG9yVHhdXSBjbGFzcyBkaXJlY3RseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uLlxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcGF5cyB0aGUgZmVlcyBpbiBBWENcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gZ2V0cyB0aGUgY2hhbmdlIGxlZnRvdmVyIGZyb20gdGhlIGZlZSBwYXltZW50XHJcbiAgICogQHBhcmFtIG5vZGVJRCBUaGUgbm9kZSBJRCBvZiB0aGUgdmFsaWRhdG9yIGJlaW5nIGFkZGVkLlxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RhcnRzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yay5cclxuICAgKiBAcGFyYW0gZW5kVGltZSBUaGUgVW5peCB0aW1lIHdoZW4gdGhlIHZhbGlkYXRvciBzdG9wcyB2YWxpZGF0aW5nIHRoZSBQcmltYXJ5IE5ldHdvcmsgKGFuZCBzdGFrZWQgQVhDIGlzIHJldHVybmVkKS5cclxuICAgKiBAcGFyYW0gd2VpZ2h0IFRoZSBhbW91bnQgb2Ygd2VpZ2h0IGZvciB0aGlzIGFsbHljaGFpbiB2YWxpZGF0b3IuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbHMgT3B0aW9uYWwuIEFuIGFycmF5IG9mIGluZGV4IGFuZCBhZGRyZXNzIHRvIHNpZ24gZm9yIGVhY2ggQWxseWNoYWluQXV0aC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICovXHJcblxyXG4gIGJ1aWxkQWRkQWxseWNoYWluVmFsaWRhdG9yVHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgZnJvbUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgbm9kZUlEOiBzdHJpbmcsXHJcbiAgICBzdGFydFRpbWU6IEJOLFxyXG4gICAgZW5kVGltZTogQk4sXHJcbiAgICB3ZWlnaHQ6IEJOLFxyXG4gICAgYWxseWNoYWluSUQ6IHN0cmluZyxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KCksXHJcbiAgICBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbHM6IFtudW1iZXIsIEJ1ZmZlcl1bXSA9IFtdXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICBcImJ1aWxkQWRkQWxseWNoYWluVmFsaWRhdG9yVHhcIlxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICBjb25zdCBjaGFuZ2U6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEFkZEFsbHljaGFpblZhbGlkYXRvclR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuXHJcbiAgICBjb25zdCBub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICBpZiAoc3RhcnRUaW1lLmx0KG5vdykgfHwgZW5kVGltZS5sdGUoc3RhcnRUaW1lKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgXCJQbGF0Zm9ybVZNQVBJLmJ1aWxkQWRkQWxseWNoYWluVmFsaWRhdG9yVHggLS0gc3RhcnRUaW1lIG11c3QgYmUgaW4gdGhlIGZ1dHVyZSBhbmQgZW5kVGltZSBtdXN0IGNvbWUgYWZ0ZXIgc3RhcnRUaW1lXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeChcclxuICAgICAgdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKHRoaXMuYmxvY2tjaGFpbklEKSxcclxuICAgICAgZnJvbSxcclxuICAgICAgY2hhbmdlLFxyXG4gICAgICBOb2RlSURTdHJpbmdUb0J1ZmZlcihub2RlSUQpLFxyXG4gICAgICBzdGFydFRpbWUsXHJcbiAgICAgIGVuZFRpbWUsXHJcbiAgICAgIHdlaWdodCxcclxuICAgICAgYWxseWNoYWluSUQsXHJcbiAgICAgIHRoaXMuZ2V0RGVmYXVsdFR4RmVlKCksXHJcbiAgICAgIGF4Y0Fzc2V0SUQsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIGFzT2YsXHJcbiAgICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFsc1xyXG4gICAgKVxyXG5cclxuICAgIGlmICghKGF3YWl0IHRoaXMuY2hlY2tHb29zZUVnZyhidWlsdFVuc2lnbmVkVHgpKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgR29vc2UgRWdnIENoZWNrXCIpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW4gdW5zaWduZWQgW1tBZGROb21pbmF0b3JUeF1dLiBGb3IgbW9yZSBncmFudWxhciBjb250cm9sLCB5b3UgbWF5IGNyZWF0ZSB5b3VyIG93blxyXG4gICAqIFtbVW5zaWduZWRUeF1dIG1hbnVhbGx5IGFuZCBpbXBvcnQgdGhlIFtbQWRkTm9taW5hdG9yVHhdXSBjbGFzcyBkaXJlY3RseS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIHRvQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gcmVjZWl2ZWQgdGhlIHN0YWtlZCB0b2tlbnMgYXQgdGhlIGVuZCBvZiB0aGUgc3Rha2luZyBwZXJpb2RcclxuICAgKiBAcGFyYW0gZnJvbUFkZHJlc3NlcyBBbiBhcnJheSBvZiBhZGRyZXNzZXMgYXMge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2hvIG93biB0aGUgc3Rha2luZyBVVFhPcyB0aGUgZmVlcyBpbiBBWENcclxuICAgKiBAcGFyYW0gY2hhbmdlQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gZ2V0cyB0aGUgY2hhbmdlIGxlZnRvdmVyIGZyb20gdGhlIGZlZSBwYXltZW50XHJcbiAgICogQHBhcmFtIG5vZGVJRCBUaGUgbm9kZSBJRCBvZiB0aGUgdmFsaWRhdG9yIGJlaW5nIGFkZGVkLlxyXG4gICAqIEBwYXJhbSBzdGFydFRpbWUgVGhlIFVuaXggdGltZSB3aGVuIHRoZSB2YWxpZGF0b3Igc3RhcnRzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yay5cclxuICAgKiBAcGFyYW0gZW5kVGltZSBUaGUgVW5peCB0aW1lIHdoZW4gdGhlIHZhbGlkYXRvciBzdG9wcyB2YWxpZGF0aW5nIHRoZSBQcmltYXJ5IE5ldHdvcmsgKGFuZCBzdGFrZWQgQVhDIGlzIHJldHVybmVkKS5cclxuICAgKiBAcGFyYW0gc3Rha2VBbW91bnQgVGhlIGFtb3VudCBiZWluZyBub21pbmF0ZWQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqIEBwYXJhbSByZXdhcmRBZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyB3aGljaCB3aWxsIHJlY2lldmUgdGhlIHJld2FyZHMgZnJvbSB0aGUgbm9taW5hdGVkIHN0YWtlLlxyXG4gICAqIEBwYXJhbSByZXdhcmRMb2NrdGltZSBPcHRpb25hbC4gVGhlIGxvY2t0aW1lIGZpZWxkIGNyZWF0ZWQgaW4gdGhlIHJlc3VsdGluZyByZXdhcmQgb3V0cHV0c1xyXG4gICAqIEBwYXJhbSByZXdhcmRUaHJlc2hvbGQgT3Bpb25hbC4gVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIHNwZW5kIHRoZSBmdW5kcyBpbiB0aGUgcmVzdWx0YW50IHJld2FyZCBVVFhPLiBEZWZhdWx0IDEuXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZEFkZE5vbWluYXRvclR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIHRvQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIG5vZGVJRDogc3RyaW5nLFxyXG4gICAgc3RhcnRUaW1lOiBCTixcclxuICAgIGVuZFRpbWU6IEJOLFxyXG4gICAgc3Rha2VBbW91bnQ6IEJOLFxyXG4gICAgcmV3YXJkQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIHJld2FyZExvY2t0aW1lOiBCTiA9IG5ldyBCTigwKSxcclxuICAgIHJld2FyZFRocmVzaG9sZDogbnVtYmVyID0gMSxcclxuICAgIG1lbW86IFBheWxvYWRCYXNlIHwgQnVmZmVyID0gdW5kZWZpbmVkLFxyXG4gICAgYXNPZjogQk4gPSBVbml4Tm93KClcclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGNvbnN0IHRvOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICB0b0FkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEFkZE5vbWluYXRvclR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgY29uc3QgZnJvbTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgZnJvbUFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEFkZE5vbWluYXRvclR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRBZGROb21pbmF0b3JUeFwiXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuICAgIGNvbnN0IHJld2FyZHM6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIHJld2FyZEFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZEFkZFZhbGlkYXRvclR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbWluU3Rha2U6IEJOID0gKGF3YWl0IHRoaXMuZ2V0TWluU3Rha2UoKSlbXCJtaW5Ob21pbmF0b3JTdGFrZVwiXVxyXG4gICAgaWYgKHN0YWtlQW1vdW50Lmx0KG1pblN0YWtlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgU3Rha2VFcnJvcihcclxuICAgICAgICBcIlBsYXRmb3JtVk1BUEkuYnVpbGRBZGROb21pbmF0b3JUeCAtLSBzdGFrZSBhbW91bnQgbXVzdCBiZSBhdCBsZWFzdCBcIiArXHJcbiAgICAgICAgICBtaW5TdGFrZS50b1N0cmluZygxMClcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGF4Y0Fzc2V0SUQ6IEJ1ZmZlciA9IGF3YWl0IHRoaXMuZ2V0QVhDQXNzZXRJRCgpXHJcblxyXG4gICAgY29uc3Qgbm93OiBCTiA9IFVuaXhOb3coKVxyXG4gICAgaWYgKHN0YXJ0VGltZS5sdChub3cpIHx8IGVuZFRpbWUubHRlKHN0YXJ0VGltZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IFRpbWVFcnJvcihcclxuICAgICAgICBcIlBsYXRmb3JtVk1BUEkuYnVpbGRBZGROb21pbmF0b3JUeCAtLSBzdGFydFRpbWUgbXVzdCBiZSBpbiB0aGUgZnV0dXJlIGFuZCBlbmRUaW1lIG11c3QgY29tZSBhZnRlciBzdGFydFRpbWVcIlxyXG4gICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZEFkZE5vbWluYXRvclR4KFxyXG4gICAgICB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICB0byxcclxuICAgICAgZnJvbSxcclxuICAgICAgY2hhbmdlLFxyXG4gICAgICBOb2RlSURTdHJpbmdUb0J1ZmZlcihub2RlSUQpLFxyXG4gICAgICBzdGFydFRpbWUsXHJcbiAgICAgIGVuZFRpbWUsXHJcbiAgICAgIHN0YWtlQW1vdW50LFxyXG4gICAgICByZXdhcmRMb2NrdGltZSxcclxuICAgICAgcmV3YXJkVGhyZXNob2xkLFxyXG4gICAgICByZXdhcmRzLFxyXG4gICAgICBuZXcgQk4oMCksXHJcbiAgICAgIGF4Y0Fzc2V0SUQsXHJcbiAgICAgIG1lbW8sXHJcbiAgICAgIGFzT2ZcclxuICAgIClcclxuXHJcbiAgICBpZiAoIShhd2FpdCB0aGlzLmNoZWNrR29vc2VFZ2coYnVpbHRVbnNpZ25lZFR4KSkpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEdvb3NlRWdnQ2hlY2tFcnJvcihcIkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIZWxwZXIgZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhbiB1bnNpZ25lZCBbW0FkZFZhbGlkYXRvclR4XV0uIEZvciBtb3JlIGdyYW51bGFyIGNvbnRyb2wsIHlvdSBtYXkgY3JlYXRlIHlvdXIgb3duXHJcbiAgICogW1tVbnNpZ25lZFR4XV0gbWFudWFsbHkgYW5kIGltcG9ydCB0aGUgW1tBZGRWYWxpZGF0b3JUeF1dIGNsYXNzIGRpcmVjdGx5LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHV0eG9zZXQgQSBzZXQgb2YgVVRYT3MgdGhhdCB0aGUgdHJhbnNhY3Rpb24gaXMgYnVpbHQgb25cclxuICAgKiBAcGFyYW0gdG9BZGRyZXNzZXMgQW4gYXJyYXkgb2YgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHdobyByZWNlaXZlZCB0aGUgc3Rha2VkIHRva2VucyBhdCB0aGUgZW5kIG9mIHRoZSBzdGFraW5nIHBlcmlvZFxyXG4gICAqIEBwYXJhbSBmcm9tQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBhcyB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB3aG8gb3duIHRoZSBzdGFraW5nIFVUWE9zIHRoZSBmZWVzIGluIEFYQ1xyXG4gICAqIEBwYXJhbSBjaGFuZ2VBZGRyZXNzZXMgQW4gYXJyYXkgb2YgYWRkcmVzc2VzIGFzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHdobyBnZXRzIHRoZSBjaGFuZ2UgbGVmdG92ZXIgZnJvbSB0aGUgZmVlIHBheW1lbnRcclxuICAgKiBAcGFyYW0gbm9kZUlEIFRoZSBub2RlIElEIG9mIHRoZSB2YWxpZGF0b3IgYmVpbmcgYWRkZWQuXHJcbiAgICogQHBhcmFtIHN0YXJ0VGltZSBUaGUgVW5peCB0aW1lIHdoZW4gdGhlIHZhbGlkYXRvciBzdGFydHMgdmFsaWRhdGluZyB0aGUgUHJpbWFyeSBOZXR3b3JrLlxyXG4gICAqIEBwYXJhbSBlbmRUaW1lIFRoZSBVbml4IHRpbWUgd2hlbiB0aGUgdmFsaWRhdG9yIHN0b3BzIHZhbGlkYXRpbmcgdGhlIFByaW1hcnkgTmV0d29yayAoYW5kIHN0YWtlZCBBWEMgaXMgcmV0dXJuZWQpLlxyXG4gICAqIEBwYXJhbSBzdGFrZUFtb3VudCBUaGUgYW1vdW50IGJlaW5nIG5vbWluYXRlZCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIHJld2FyZEFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHdoaWNoIHdpbGwgcmVjaWV2ZSB0aGUgcmV3YXJkcyBmcm9tIHRoZSBub21pbmF0ZWQgc3Rha2UuXHJcbiAgICogQHBhcmFtIG5vbWluYXRpb25GZWUgQSBudW1iZXIgZm9yIHRoZSBwZXJjZW50YWdlIG9mIHJld2FyZCB0byBiZSBnaXZlbiB0byB0aGUgdmFsaWRhdG9yIHdoZW4gc29tZW9uZSBub21pbmF0ZXMgdG8gdGhlbS4gTXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEwMC5cclxuICAgKiBAcGFyYW0gcmV3YXJkTG9ja3RpbWUgT3B0aW9uYWwuIFRoZSBsb2NrdGltZSBmaWVsZCBjcmVhdGVkIGluIHRoZSByZXN1bHRpbmcgcmV3YXJkIG91dHB1dHNcclxuICAgKiBAcGFyYW0gcmV3YXJkVGhyZXNob2xkIE9waW9uYWwuIFRoZSBudW1iZXIgb2Ygc2lnbmF0dXJlcyByZXF1aXJlZCB0byBzcGVuZCB0aGUgZnVuZHMgaW4gdGhlIHJlc3VsdGFudCByZXdhcmQgVVRYTy4gRGVmYXVsdCAxLlxyXG4gICAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIGNvbnRhaW5zIGFyYml0cmFyeSBieXRlcywgdXAgdG8gMjU2IGJ5dGVzXHJcbiAgICogQHBhcmFtIGFzT2YgT3B0aW9uYWwuIFRoZSB0aW1lc3RhbXAgdG8gdmVyaWZ5IHRoZSB0cmFuc2FjdGlvbiBhZ2FpbnN0IGFzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgcGFzc2VkIGluIHBhcmFtZXRlcnMuXHJcbiAgICovXHJcbiAgYnVpbGRBZGRWYWxpZGF0b3JUeCA9IGFzeW5jIChcclxuICAgIHV0eG9zZXQ6IFVUWE9TZXQsXHJcbiAgICB0b0FkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBmcm9tQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGNoYW5nZUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBub2RlSUQ6IHN0cmluZyxcclxuICAgIHN0YXJ0VGltZTogQk4sXHJcbiAgICBlbmRUaW1lOiBCTixcclxuICAgIHN0YWtlQW1vdW50OiBCTixcclxuICAgIHJld2FyZEFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBub21pbmF0aW9uRmVlOiBudW1iZXIsXHJcbiAgICByZXdhcmRMb2NrdGltZTogQk4gPSBuZXcgQk4oMCksXHJcbiAgICByZXdhcmRUaHJlc2hvbGQ6IG51bWJlciA9IDEsXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCB0bzogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgdG9BZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRBZGRWYWxpZGF0b3JUeFwiXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRBZGRWYWxpZGF0b3JUeFwiXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuICAgIGNvbnN0IGNoYW5nZTogQnVmZmVyW10gPSB0aGlzLl9jbGVhbkFkZHJlc3NBcnJheShcclxuICAgICAgY2hhbmdlQWRkcmVzc2VzLFxyXG4gICAgICBcImJ1aWxkQWRkVmFsaWRhdG9yVHhcIlxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICBjb25zdCByZXdhcmRzOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICByZXdhcmRBZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRBZGRWYWxpZGF0b3JUeFwiXHJcbiAgICApLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhhKSlcclxuXHJcbiAgICBpZiAobWVtbyBpbnN0YW5jZW9mIFBheWxvYWRCYXNlKSB7XHJcbiAgICAgIG1lbW8gPSBtZW1vLmdldFBheWxvYWQoKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1pblN0YWtlOiBCTiA9IChhd2FpdCB0aGlzLmdldE1pblN0YWtlKCkpW1wibWluVmFsaWRhdG9yU3Rha2VcIl1cclxuICAgIGlmIChzdGFrZUFtb3VudC5sdChtaW5TdGFrZSkpIHtcclxuICAgICAgdGhyb3cgbmV3IFN0YWtlRXJyb3IoXHJcbiAgICAgICAgXCJQbGF0Zm9ybVZNQVBJLmJ1aWxkQWRkVmFsaWRhdG9yVHggLS0gc3Rha2UgYW1vdW50IG11c3QgYmUgYXQgbGVhc3QgXCIgK1xyXG4gICAgICAgICAgbWluU3Rha2UudG9TdHJpbmcoMTApXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGVvZiBub21pbmF0aW9uRmVlICE9PSBcIm51bWJlclwiIHx8XHJcbiAgICAgIG5vbWluYXRpb25GZWUgPiAxMDAgfHxcclxuICAgICAgbm9taW5hdGlvbkZlZSA8IDBcclxuICAgICkge1xyXG4gICAgICB0aHJvdyBuZXcgTm9taW5hdGlvbkZlZUVycm9yKFxyXG4gICAgICAgIFwiUGxhdGZvcm1WTUFQSS5idWlsZEFkZFZhbGlkYXRvclR4IC0tIG5vbWluYXRpb25GZWUgbXVzdCBiZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDEwMFwiXHJcbiAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBheGNBc3NldElEOiBCdWZmZXIgPSBhd2FpdCB0aGlzLmdldEFYQ0Fzc2V0SUQoKVxyXG5cclxuICAgIGNvbnN0IG5vdzogQk4gPSBVbml4Tm93KClcclxuICAgIGlmIChzdGFydFRpbWUubHQobm93KSB8fCBlbmRUaW1lLmx0ZShzdGFydFRpbWUpKSB7XHJcbiAgICAgIHRocm93IG5ldyBUaW1lRXJyb3IoXHJcbiAgICAgICAgXCJQbGF0Zm9ybVZNQVBJLmJ1aWxkQWRkVmFsaWRhdG9yVHggLS0gc3RhcnRUaW1lIG11c3QgYmUgaW4gdGhlIGZ1dHVyZSBhbmQgZW5kVGltZSBtdXN0IGNvbWUgYWZ0ZXIgc3RhcnRUaW1lXCJcclxuICAgICAgKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJ1aWx0VW5zaWduZWRUeDogVW5zaWduZWRUeCA9IHV0eG9zZXQuYnVpbGRBZGRWYWxpZGF0b3JUeChcclxuICAgICAgdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKHRoaXMuYmxvY2tjaGFpbklEKSxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgdG8sXHJcbiAgICAgIGZyb20sXHJcbiAgICAgIGNoYW5nZSxcclxuICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcclxuICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICBlbmRUaW1lLFxyXG4gICAgICBzdGFrZUFtb3VudCxcclxuICAgICAgcmV3YXJkTG9ja3RpbWUsXHJcbiAgICAgIHJld2FyZFRocmVzaG9sZCxcclxuICAgICAgcmV3YXJkcyxcclxuICAgICAgbm9taW5hdGlvbkZlZSxcclxuICAgICAgbmV3IEJOKDApLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mXHJcbiAgICApXHJcblxyXG4gICAgaWYgKCEoYXdhaXQgdGhpcy5jaGVja0dvb3NlRWdnKGJ1aWx0VW5zaWduZWRUeCkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXCJGYWlsZWQgR29vc2UgRWdnIENoZWNrXCIpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIFtbQ3JlYXRlQWxseWNoYWluVHhdXSB0cmFuc2FjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIGFsbHljaGFpbk93bmVyQWRkcmVzc2VzIEFuIGFycmF5IG9mIGFkZHJlc3NlcyBmb3Igb3duZXJzIG9mIHRoZSBuZXcgYWxseWNoYWluXHJcbiAgICogQHBhcmFtIGFsbHljaGFpbk93bmVyVGhyZXNob2xkIEEgbnVtYmVyIGluZGljYXRpbmcgdGhlIGFtb3VudCBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIGFkZCB2YWxpZGF0b3JzIHRvIGEgYWxseWNoYWluXHJcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwgY29udGFpbnMgYXJiaXRyYXJ5IGJ5dGVzLCB1cCB0byAyNTYgYnl0ZXNcclxuICAgKiBAcGFyYW0gYXNPZiBPcHRpb25hbC4gVGhlIHRpbWVzdGFtcCB0byB2ZXJpZnkgdGhlIHRyYW5zYWN0aW9uIGFnYWluc3QgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfVxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZENyZWF0ZUFsbHljaGFpblR4ID0gYXN5bmMgKFxyXG4gICAgdXR4b3NldDogVVRYT1NldCxcclxuICAgIGZyb21BZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgY2hhbmdlQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGFsbHljaGFpbk93bmVyQWRkcmVzc2VzOiBzdHJpbmdbXSxcclxuICAgIGFsbHljaGFpbk93bmVyVGhyZXNob2xkOiBudW1iZXIsXHJcbiAgICBtZW1vOiBQYXlsb2FkQmFzZSB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGFzT2Y6IEJOID0gVW5peE5vdygpXHJcbiAgKTogUHJvbWlzZTxVbnNpZ25lZFR4PiA9PiB7XHJcbiAgICBjb25zdCBmcm9tOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBmcm9tQWRkcmVzc2VzLFxyXG4gICAgICBcImJ1aWxkQ3JlYXRlQWxseWNoYWluVHhcIlxyXG4gICAgKS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBiaW50b29scy5zdHJpbmdUb0FkZHJlc3MoYSkpXHJcbiAgICBjb25zdCBjaGFuZ2U6IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGNoYW5nZUFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZENyZWF0ZUFsbHljaGFpblR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgY29uc3Qgb3duZXJzOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBhbGx5Y2hhaW5Pd25lckFkZHJlc3NlcyxcclxuICAgICAgXCJidWlsZENyZWF0ZUFsbHljaGFpblR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuICAgIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gdGhpcy5jb3JlLmdldE5ldHdvcmtJRCgpXHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUodGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICBjb25zdCBmZWU6IEJOID0gdGhpcy5nZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZSgpXHJcbiAgICBjb25zdCBidWlsdFVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSB1dHhvc2V0LmJ1aWxkQ3JlYXRlQWxseWNoYWluVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIG93bmVycyxcclxuICAgICAgYWxseWNoYWluT3duZXJUaHJlc2hvbGQsXHJcbiAgICAgIGZlZSxcclxuICAgICAgYXhjQXNzZXRJRCxcclxuICAgICAgbWVtbyxcclxuICAgICAgYXNPZlxyXG4gICAgKVxyXG5cclxuICAgIGlmICghKGF3YWl0IHRoaXMuY2hlY2tHb29zZUVnZyhidWlsdFVuc2lnbmVkVHgsIHRoaXMuZ2V0Q3JlYXRpb25UeEZlZSgpKSkpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgdGhyb3cgbmV3IEdvb3NlRWdnQ2hlY2tFcnJvcihcIkZhaWxlZCBHb29zZSBFZ2cgQ2hlY2tcIilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnVpbHRVbnNpZ25lZFR4XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBCdWlsZCBhbiB1bnNpZ25lZCBbW0NyZWF0ZUNoYWluVHhdXS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1dHhvc2V0IEEgc2V0IG9mIFVUWE9zIHRoYXQgdGhlIHRyYW5zYWN0aW9uIGlzIGJ1aWx0IG9uXHJcbiAgICogQHBhcmFtIGZyb21BZGRyZXNzZXMgVGhlIGFkZHJlc3NlcyBiZWluZyB1c2VkIHRvIHNlbmQgdGhlIGZ1bmRzIGZyb20gdGhlIFVUWE9zIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGNoYW5nZUFkZHJlc3NlcyBUaGUgYWRkcmVzc2VzIHRoYXQgY2FuIHNwZW5kIHRoZSBjaGFuZ2UgcmVtYWluaW5nIGZyb20gdGhlIHNwZW50IFVUWE9zXHJcbiAgICogQHBhcmFtIGFsbHljaGFpbklEIE9wdGlvbmFsIElEIG9mIHRoZSBBbGx5Y2hhaW4gdGhhdCB2YWxpZGF0ZXMgdGhpcyBibG9ja2NoYWluXHJcbiAgICogQHBhcmFtIGNoYWluTmFtZSBPcHRpb25hbCBBIGh1bWFuIHJlYWRhYmxlIG5hbWUgZm9yIHRoZSBjaGFpbjsgbmVlZCBub3QgYmUgdW5pcXVlXHJcbiAgICogQHBhcmFtIHZtSUQgT3B0aW9uYWwgSUQgb2YgdGhlIFZNIHJ1bm5pbmcgb24gdGhlIG5ldyBjaGFpblxyXG4gICAqIEBwYXJhbSBmeElEcyBPcHRpb25hbCBJRHMgb2YgdGhlIGZlYXR1cmUgZXh0ZW5zaW9ucyBydW5uaW5nIG9uIHRoZSBuZXcgY2hhaW5cclxuICAgKiBAcGFyYW0gZ2VuZXNpc0RhdGEgT3B0aW9uYWwgQnl0ZSByZXByZXNlbnRhdGlvbiBvZiBnZW5lc2lzIHN0YXRlIG9mIHRoZSBuZXcgY2hhaW5cclxuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCBjb250YWlucyBhcmJpdHJhcnkgYnl0ZXMsIHVwIHRvIDI1NiBieXRlc1xyXG4gICAqIEBwYXJhbSBhc09mIE9wdGlvbmFsLiBUaGUgdGltZXN0YW1wIHRvIHZlcmlmeSB0aGUgdHJhbnNhY3Rpb24gYWdhaW5zdCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59XHJcbiAgICogQHBhcmFtIGFsbHljaGFpbkF1dGhDcmVkZW50aWFscyBPcHRpb25hbC4gQW4gYXJyYXkgb2YgaW5kZXggYW5kIGFkZHJlc3MgdG8gc2lnbiBmb3IgZWFjaCBBbGx5Y2hhaW5BdXRoLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQW4gdW5zaWduZWQgdHJhbnNhY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBwYXNzZWQgaW4gcGFyYW1ldGVycy5cclxuICAgKi9cclxuICBidWlsZENyZWF0ZUNoYWluVHggPSBhc3luYyAoXHJcbiAgICB1dHhvc2V0OiBVVFhPU2V0LFxyXG4gICAgZnJvbUFkZHJlc3Nlczogc3RyaW5nW10sXHJcbiAgICBjaGFuZ2VBZGRyZXNzZXM6IHN0cmluZ1tdLFxyXG4gICAgYWxseWNoYWluSUQ6IHN0cmluZyB8IEJ1ZmZlciA9IHVuZGVmaW5lZCxcclxuICAgIGNoYWluTmFtZTogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgdm1JRDogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgZnhJRHM6IHN0cmluZ1tdID0gdW5kZWZpbmVkLFxyXG4gICAgZ2VuZXNpc0RhdGE6IHN0cmluZyB8IEdlbmVzaXNEYXRhID0gdW5kZWZpbmVkLFxyXG4gICAgbWVtbzogUGF5bG9hZEJhc2UgfCBCdWZmZXIgPSB1bmRlZmluZWQsXHJcbiAgICBhc09mOiBCTiA9IFVuaXhOb3coKSxcclxuICAgIGFsbHljaGFpbkF1dGhDcmVkZW50aWFsczogW251bWJlciwgQnVmZmVyXVtdID0gW11cclxuICApOiBQcm9taXNlPFVuc2lnbmVkVHg+ID0+IHtcclxuICAgIGNvbnN0IGZyb206IEJ1ZmZlcltdID0gdGhpcy5fY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICAgIGZyb21BZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRDcmVhdGVDaGFpblR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG4gICAgY29uc3QgY2hhbmdlOiBCdWZmZXJbXSA9IHRoaXMuX2NsZWFuQWRkcmVzc0FycmF5KFxyXG4gICAgICBjaGFuZ2VBZGRyZXNzZXMsXHJcbiAgICAgIFwiYnVpbGRDcmVhdGVDaGFpblR4XCJcclxuICAgICkubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGEpKVxyXG5cclxuICAgIGlmIChtZW1vIGluc3RhbmNlb2YgUGF5bG9hZEJhc2UpIHtcclxuICAgICAgbWVtbyA9IG1lbW8uZ2V0UGF5bG9hZCgpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYXhjQXNzZXRJRDogQnVmZmVyID0gYXdhaXQgdGhpcy5nZXRBWENBc3NldElEKClcclxuICAgIGZ4SURzID0gZnhJRHMuc29ydCgpXHJcblxyXG4gICAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSB0aGlzLmNvcmUuZ2V0TmV0d29ya0lEKClcclxuICAgIGNvbnN0IGJsb2NrY2hhaW5JRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZSh0aGlzLmJsb2NrY2hhaW5JRClcclxuICAgIGNvbnN0IGZlZTogQk4gPSB0aGlzLmdldENyZWF0ZUNoYWluVHhGZWUoKVxyXG4gICAgY29uc3QgYnVpbHRVbnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gdXR4b3NldC5idWlsZENyZWF0ZUNoYWluVHgoXHJcbiAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgYmxvY2tjaGFpbklELFxyXG4gICAgICBmcm9tLFxyXG4gICAgICBjaGFuZ2UsXHJcbiAgICAgIGFsbHljaGFpbklELFxyXG4gICAgICBjaGFpbk5hbWUsXHJcbiAgICAgIHZtSUQsXHJcbiAgICAgIGZ4SURzLFxyXG4gICAgICBnZW5lc2lzRGF0YSxcclxuICAgICAgZmVlLFxyXG4gICAgICBheGNBc3NldElELFxyXG4gICAgICBtZW1vLFxyXG4gICAgICBhc09mLFxyXG4gICAgICBhbGx5Y2hhaW5BdXRoQ3JlZGVudGlhbHNcclxuICAgIClcclxuXHJcbiAgICBpZiAoIShhd2FpdCB0aGlzLmNoZWNrR29vc2VFZ2coYnVpbHRVbnNpZ25lZFR4LCB0aGlzLmdldENyZWF0aW9uVHhGZWUoKSkpKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgIHRocm93IG5ldyBHb29zZUVnZ0NoZWNrRXJyb3IoXCJGYWlsZWQgR29vc2UgRWdnIENoZWNrXCIpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ1aWx0VW5zaWduZWRUeFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGlnbm9yZVxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBfY2xlYW5BZGRyZXNzQXJyYXkoXHJcbiAgICBhZGRyZXNzZXM6IHN0cmluZ1tdIHwgQnVmZmVyW10sXHJcbiAgICBjYWxsZXI6IHN0cmluZ1xyXG4gICk6IHN0cmluZ1tdIHtcclxuICAgIGNvbnN0IGFkZHJzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBjb25zdCBjaGFpbmlkOiBzdHJpbmcgPSB0aGlzLmdldEJsb2NrY2hhaW5BbGlhcygpXHJcbiAgICAgID8gdGhpcy5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gICAgICA6IHRoaXMuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGlmIChhZGRyZXNzZXMgJiYgYWRkcmVzc2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYWRkcmVzc2VzW2Ake2l9YF0gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgdHlwZW9mIHRoaXMucGFyc2VBZGRyZXNzKGFkZHJlc3Nlc1tgJHtpfWBdIGFzIHN0cmluZykgPT09XHJcbiAgICAgICAgICAgIFwidW5kZWZpbmVkXCJcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgQWRkcmVzc0Vycm9yKFwiRXJyb3IgLSBJbnZhbGlkIGFkZHJlc3MgZm9ybWF0XCIpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhZGRycy5wdXNoKGFkZHJlc3Nlc1tgJHtpfWBdIGFzIHN0cmluZylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgYmVjaDMyOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcclxuICAgICAgICAgIGFkZHJzLnB1c2goXHJcbiAgICAgICAgICAgIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKFxyXG4gICAgICAgICAgICAgIGFkZHJlc3Nlc1tgJHtpfWBdIGFzIEJ1ZmZlcixcclxuICAgICAgICAgICAgICBiZWNoMzIsXHJcbiAgICAgICAgICAgICAgdGhpcy5jb3JlLmdldEhSUCgpLFxyXG4gICAgICAgICAgICAgIGNoYWluaWRcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFkZHJzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgaW5zdGFudGlhdGVkIGRpcmVjdGx5LlxyXG4gICAqIEluc3RlYWQgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvcmUgQSByZWZlcmVuY2UgdG8gdGhlIEF4aWEgY2xhc3NcclxuICAgKiBAcGFyYW0gYmFzZVVSTCBEZWZhdWx0cyB0byB0aGUgc3RyaW5nIFwiL2V4dC9Db3JlXCIgYXMgdGhlIHBhdGggdG8gYmxvY2tjaGFpbidzIGJhc2VVUkxcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihjb3JlOiBBeGlhQ29yZSwgYmFzZVVSTDogc3RyaW5nID0gXCIvZXh0L2JjL0NvcmVcIikge1xyXG4gICAgc3VwZXIoY29yZSwgYmFzZVVSTClcclxuICAgIHRoaXMuYmxvY2tjaGFpbklEID0gUGxhdGZvcm1DaGFpbklEXHJcbiAgICBjb25zdCBuZXRJRDogbnVtYmVyID0gY29yZS5nZXROZXR3b3JrSUQoKVxyXG4gICAgaWYgKFxyXG4gICAgICBuZXRJRCBpbiBEZWZhdWx0cy5uZXR3b3JrICYmXHJcbiAgICAgIHRoaXMuYmxvY2tjaGFpbklEIGluIERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0SUR9YF1cclxuICAgICkge1xyXG4gICAgICBjb25zdCB7IGFsaWFzIH0gPSBEZWZhdWx0cy5uZXR3b3JrW2Ake25ldElEfWBdW3RoaXMuYmxvY2tjaGFpbklEXVxyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgYWxpYXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmtleWNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuY29yZS5nZXRIUlAoKSwgdGhpcy5ibG9ja2NoYWluSUQpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB0aGUgY3VycmVudCB0aW1lc3RhbXAgb24gY2hhaW4uXHJcbiAgICovXHJcbiAgZ2V0VGltZXN0YW1wID0gYXN5bmMgKCk6IFByb21pc2U8bnVtYmVyPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldFRpbWVzdGFtcFwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQudGltZXN0YW1wXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB0aGUgVVRYT3MgdGhhdCB3ZXJlIHJld2FyZGVkIGFmdGVyIHRoZSBwcm92aWRlZCB0cmFuc2FjdGlvblwicyBzdGFraW5nIG9yIG5vbWluYXRpb24gcGVyaW9kIGVuZGVkLlxyXG4gICAqL1xyXG4gIGdldFJld2FyZFVUWE9zID0gYXN5bmMgKFxyXG4gICAgdHhJRDogc3RyaW5nLFxyXG4gICAgZW5jb2Rpbmc/OiBzdHJpbmdcclxuICApOiBQcm9taXNlPEdldFJld2FyZFVUWE9zUmVzcG9uc2U+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogR2V0UmV3YXJkVVRYT3NQYXJhbXMgPSB7XHJcbiAgICAgIHR4SUQsXHJcbiAgICAgIGVuY29kaW5nXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJjb3JlLmdldFJld2FyZFVUWE9zXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG59XHJcbiJdfQ==