"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.platformvm = exports.metrics = exports.keystore = exports.info = exports.index = exports.health = exports.evm = exports.common = exports.avm = exports.auth = exports.admin = exports.Socket = exports.PubSub = exports.Mnemonic = exports.GenesisData = exports.GenesisAsset = exports.HDNode = exports.DB = exports.Buffer = exports.BN = exports.BinTools = exports.AxiaCore = exports.Axia = void 0;
/**
 * @packageDocumentation
 * @module Axia
 */
const axia_1 = __importDefault(require("./axia"));
exports.AxiaCore = axia_1.default;
const api_1 = require("./apis/admin/api");
const api_2 = require("./apis/auth/api");
const api_3 = require("./apis/avm/api");
const api_4 = require("./apis/evm/api");
const genesisasset_1 = require("./apis/avm/genesisasset");
Object.defineProperty(exports, "GenesisAsset", { enumerable: true, get: function () { return genesisasset_1.GenesisAsset; } });
const genesisdata_1 = require("./apis/avm/genesisdata");
Object.defineProperty(exports, "GenesisData", { enumerable: true, get: function () { return genesisdata_1.GenesisData; } });
const api_5 = require("./apis/health/api");
const api_6 = require("./apis/index/api");
const api_7 = require("./apis/info/api");
const api_8 = require("./apis/keystore/api");
const api_9 = require("./apis/metrics/api");
const api_10 = require("./apis/platformvm/api");
const socket_1 = require("./apis/socket/socket");
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_1.Socket; } });
const constants_1 = require("./utils/constants");
const helperfunctions_1 = require("./utils/helperfunctions");
const bintools_1 = __importDefault(require("./utils/bintools"));
exports.BinTools = bintools_1.default;
const db_1 = __importDefault(require("./utils/db"));
exports.DB = db_1.default;
const mnemonic_1 = __importDefault(require("./utils/mnemonic"));
exports.Mnemonic = mnemonic_1.default;
const pubsub_1 = __importDefault(require("./utils/pubsub"));
exports.PubSub = pubsub_1.default;
const hdnode_1 = __importDefault(require("./utils/hdnode"));
exports.HDNode = hdnode_1.default;
const bn_js_1 = __importDefault(require("bn.js"));
exports.BN = bn_js_1.default;
const buffer_1 = require("buffer/");
Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return buffer_1.Buffer; } });
/**
 * AxiaJS is middleware for interacting with Axia node RPC APIs.
 *
 * Example usage:
 * ```js
 * const axia: Axia = new Axia("127.0.0.1", 80, "https")
 * ```
 *
 */
class Axia extends axia_1.default {
    /**
     * Creates a new Axia instance. Sets the address and port of the main Axia Client.
     *
     * @param host The hostname to resolve to reach the Axia Client RPC APIs
     * @param port The port to resolve to reach the Axia Client RPC APIs
     * @param protocol The protocol string to use before a "://" in a request,
     * ex: "http", "https", "git", "ws", etc. Defaults to http
     * @param networkID Sets the NetworkID of the class. Default [[DefaultNetworkID]]
     * @param SwapChainID Sets the blockchainID for the AVM. Will try to auto-detect,
     * otherwise default "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
     * @param AXChainID Sets the blockchainID for the EVM. Will try to auto-detect,
     * otherwise default "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU"
     * @param hrp The human-readable part of the bech32 addresses
     * @param skipinit Skips creating the APIs. Defaults to false
     */
    constructor(host, port, protocol = "http", networkID = constants_1.DefaultNetworkID, SwapChainID = undefined, AXChainID = undefined, hrp = undefined, skipinit = false) {
        super(host, port, protocol);
        /**
         * Returns a reference to the Admin RPC.
         */
        this.Admin = () => this.apis.admin;
        /**
         * Returns a reference to the Auth RPC.
         */
        this.Auth = () => this.apis.auth;
        /**
         * Returns a reference to the EVMAPI RPC pointed at the AX-Chain.
         */
        this.AXChain = () => this.apis.axchain;
        /**
         * Returns a reference to the AVM RPC pointed at the Swap-Chain.
         */
        this.SwapChain = () => this.apis.swapchain;
        /**
         * Returns a reference to the Health RPC for a node.
         */
        this.Health = () => this.apis.health;
        /**
         * Returns a reference to the Index RPC for a node.
         */
        this.Index = () => this.apis.index;
        /**
         * Returns a reference to the Info RPC for a node.
         */
        this.Info = () => this.apis.info;
        /**
         * Returns a reference to the Metrics RPC.
         */
        this.Metrics = () => this.apis.metrics;
        /**
         * Returns a reference to the Keystore RPC for a node. We label it "NodeKeys" to reduce
         * confusion about what it's accessing.
         */
        this.NodeKeys = () => this.apis.keystore;
        /**
         * Returns a reference to the PlatformVM RPC pointed at the Core-Chain.
         */
        this.CoreChain = () => this.apis.corechain;
        let swapchainid = SwapChainID;
        let axchainid = AXChainID;
        if (typeof SwapChainID === "undefined" ||
            !SwapChainID ||
            SwapChainID.toLowerCase() === "swap") {
            if (networkID.toString() in constants_1.Defaults.network) {
                swapchainid = constants_1.Defaults.network[`${networkID}`].Swap.blockchainID;
            }
            else {
                swapchainid = constants_1.Defaults.network[12345].Swap.blockchainID;
            }
        }
        if (typeof AXChainID === "undefined" ||
            !AXChainID ||
            AXChainID.toLowerCase() === "ax") {
            if (networkID.toString() in constants_1.Defaults.network) {
                axchainid = constants_1.Defaults.network[`${networkID}`].AX.blockchainID;
            }
            else {
                axchainid = constants_1.Defaults.network[12345].AX.blockchainID;
            }
        }
        if (typeof networkID === "number" && networkID >= 0) {
            this.networkID = networkID;
        }
        else if (typeof networkID === "undefined") {
            networkID = constants_1.DefaultNetworkID;
        }
        if (typeof hrp !== "undefined") {
            this.hrp = hrp;
        }
        else {
            this.hrp = (0, helperfunctions_1.getPreferredHRP)(this.networkID);
        }
        if (!skipinit) {
            this.addAPI("admin", api_1.AdminAPI);
            this.addAPI("auth", api_2.AuthAPI);
            this.addAPI("swapchain", api_3.AVMAPI, "/ext/bc/Swap", swapchainid);
            this.addAPI("axchain", api_4.EVMAPI, "/ext/bc/AX/axc", axchainid);
            this.addAPI("health", api_5.HealthAPI);
            this.addAPI("info", api_7.InfoAPI);
            this.addAPI("index", api_6.IndexAPI);
            this.addAPI("keystore", api_8.KeystoreAPI);
            this.addAPI("metrics", api_9.MetricsAPI);
            this.addAPI("corechain", api_10.PlatformVMAPI);
        }
    }
}
exports.default = Axia;
exports.Axia = Axia;
exports.admin = __importStar(require("./apis/admin"));
exports.auth = __importStar(require("./apis/auth"));
exports.avm = __importStar(require("./apis/avm"));
exports.common = __importStar(require("./common"));
exports.evm = __importStar(require("./apis/evm"));
exports.health = __importStar(require("./apis/health"));
exports.index = __importStar(require("./apis/index"));
exports.info = __importStar(require("./apis/info"));
exports.keystore = __importStar(require("./apis/keystore"));
exports.metrics = __importStar(require("./apis/metrics"));
exports.platformvm = __importStar(require("./apis/platformvm"));
exports.utils = __importStar(require("./utils"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxrREFBNkI7QUFtS3BCLG1CQW5LRixjQUFRLENBbUtFO0FBbEtqQiwwQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLHdDQUF1QztBQUN2Qyx3Q0FBdUM7QUFDdkMsMERBQXNEO0FBb0s3Qyw2RkFwS0EsMkJBQVksT0FvS0E7QUFuS3JCLHdEQUFvRDtBQW9LM0MsNEZBcEtBLHlCQUFXLE9Bb0tBO0FBbktwQiwyQ0FBNkM7QUFDN0MsMENBQTJDO0FBQzNDLHlDQUF5QztBQUN6Qyw2Q0FBaUQ7QUFDakQsNENBQStDO0FBQy9DLGdEQUFxRDtBQUNyRCxpREFBNkM7QUFnS3BDLHVGQWhLQSxlQUFNLE9BZ0tBO0FBL0pmLGlEQUE4RDtBQUM5RCw2REFBeUQ7QUFDekQsZ0VBQXVDO0FBb0o5QixtQkFwSkYsa0JBQVEsQ0FvSkU7QUFuSmpCLG9EQUEyQjtBQXNKbEIsYUF0SkYsWUFBRSxDQXNKRTtBQXJKWCxnRUFBdUM7QUF5SjlCLG1CQXpKRixrQkFBUSxDQXlKRTtBQXhKakIsNERBQW1DO0FBeUoxQixpQkF6SkYsZ0JBQU0sQ0F5SkU7QUF4SmYsNERBQW1DO0FBb0oxQixpQkFwSkYsZ0JBQU0sQ0FvSkU7QUFuSmYsa0RBQXNCO0FBZ0piLGFBaEpGLGVBQUUsQ0FnSkU7QUEvSVgsb0NBQWdDO0FBZ0p2Qix1RkFoSkEsZUFBTSxPQWdKQTtBQTlJZjs7Ozs7Ozs7R0FRRztBQUNILE1BQXFCLElBQUssU0FBUSxjQUFRO0lBb0R4Qzs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILFlBQ0UsSUFBYSxFQUNiLElBQWEsRUFDYixXQUFtQixNQUFNLEVBQ3pCLFlBQW9CLDRCQUFnQixFQUNwQyxjQUFzQixTQUFTLEVBQy9CLFlBQW9CLFNBQVMsRUFDN0IsTUFBYyxT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LENBQUMsU0FBUyxDQUFDLENBQUE7U0FDM0M7UUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBUSxDQUFDLENBQUE7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBTyxDQUFDLENBQUE7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsWUFBTSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFNLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUE7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsZUFBUyxDQUFDLENBQUE7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsYUFBTyxDQUFDLENBQUE7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsY0FBUSxDQUFDLENBQUE7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsaUJBQVcsQ0FBQyxDQUFBO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLGdCQUFVLENBQUMsQ0FBQTtZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxvQkFBYSxDQUFDLENBQUE7U0FDeEM7SUFDSCxDQUFDO0NBQ0Y7QUEvSEQsdUJBK0hDO0FBRVEsb0JBQUk7QUFhYixzREFBcUM7QUFDckMsb0RBQW1DO0FBQ25DLGtEQUFpQztBQUNqQyxtREFBa0M7QUFDbEMsa0RBQWlDO0FBQ2pDLHdEQUF1QztBQUN2QyxzREFBcUM7QUFDckMsb0RBQW1DO0FBQ25DLDREQUEyQztBQUMzQywwREFBeUM7QUFDekMsZ0VBQStDO0FBQy9DLGlEQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBBeGlhXHJcbiAqL1xyXG5pbXBvcnQgQXhpYUNvcmUgZnJvbSBcIi4vYXhpYVwiXHJcbmltcG9ydCB7IEFkbWluQVBJIH0gZnJvbSBcIi4vYXBpcy9hZG1pbi9hcGlcIlxyXG5pbXBvcnQgeyBBdXRoQVBJIH0gZnJvbSBcIi4vYXBpcy9hdXRoL2FwaVwiXHJcbmltcG9ydCB7IEFWTUFQSSB9IGZyb20gXCIuL2FwaXMvYXZtL2FwaVwiXHJcbmltcG9ydCB7IEVWTUFQSSB9IGZyb20gXCIuL2FwaXMvZXZtL2FwaVwiXHJcbmltcG9ydCB7IEdlbmVzaXNBc3NldCB9IGZyb20gXCIuL2FwaXMvYXZtL2dlbmVzaXNhc3NldFwiXHJcbmltcG9ydCB7IEdlbmVzaXNEYXRhIH0gZnJvbSBcIi4vYXBpcy9hdm0vZ2VuZXNpc2RhdGFcIlxyXG5pbXBvcnQgeyBIZWFsdGhBUEkgfSBmcm9tIFwiLi9hcGlzL2hlYWx0aC9hcGlcIlxyXG5pbXBvcnQgeyBJbmRleEFQSSB9IGZyb20gXCIuL2FwaXMvaW5kZXgvYXBpXCJcclxuaW1wb3J0IHsgSW5mb0FQSSB9IGZyb20gXCIuL2FwaXMvaW5mby9hcGlcIlxyXG5pbXBvcnQgeyBLZXlzdG9yZUFQSSB9IGZyb20gXCIuL2FwaXMva2V5c3RvcmUvYXBpXCJcclxuaW1wb3J0IHsgTWV0cmljc0FQSSB9IGZyb20gXCIuL2FwaXMvbWV0cmljcy9hcGlcIlxyXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQVBJIH0gZnJvbSBcIi4vYXBpcy9wbGF0Zm9ybXZtL2FwaVwiXHJcbmltcG9ydCB7IFNvY2tldCB9IGZyb20gXCIuL2FwaXMvc29ja2V0L3NvY2tldFwiXHJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQsIERlZmF1bHRzIH0gZnJvbSBcIi4vdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHsgZ2V0UHJlZmVycmVkSFJQIH0gZnJvbSBcIi4vdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IERCIGZyb20gXCIuL3V0aWxzL2RiXCJcclxuaW1wb3J0IE1uZW1vbmljIGZyb20gXCIuL3V0aWxzL21uZW1vbmljXCJcclxuaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi91dGlscy9wdWJzdWJcIlxyXG5pbXBvcnQgSEROb2RlIGZyb20gXCIuL3V0aWxzL2hkbm9kZVwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcblxyXG4vKipcclxuICogQXhpYUpTIGlzIG1pZGRsZXdhcmUgZm9yIGludGVyYWN0aW5nIHdpdGggQXhpYSBub2RlIFJQQyBBUElzLlxyXG4gKlxyXG4gKiBFeGFtcGxlIHVzYWdlOlxyXG4gKiBgYGBqc1xyXG4gKiBjb25zdCBheGlhOiBBeGlhID0gbmV3IEF4aWEoXCIxMjcuMC4wLjFcIiwgODAsIFwiaHR0cHNcIilcclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlhIGV4dGVuZHMgQXhpYUNvcmUge1xyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIEFkbWluIFJQQy5cclxuICAgKi9cclxuICBBZG1pbiA9ICgpID0+IHRoaXMuYXBpcy5hZG1pbiBhcyBBZG1pbkFQSVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBBdXRoIFJQQy5cclxuICAgKi9cclxuICBBdXRoID0gKCkgPT4gdGhpcy5hcGlzLmF1dGggYXMgQXV0aEFQSVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBFVk1BUEkgUlBDIHBvaW50ZWQgYXQgdGhlIEFYLUNoYWluLlxyXG4gICAqL1xyXG4gIEFYQ2hhaW4gPSAoKSA9PiB0aGlzLmFwaXMuYXhjaGFpbiBhcyBFVk1BUElcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgQVZNIFJQQyBwb2ludGVkIGF0IHRoZSBTd2FwLUNoYWluLlxyXG4gICAqL1xyXG4gIFN3YXBDaGFpbiA9ICgpID0+IHRoaXMuYXBpcy5zd2FwY2hhaW4gYXMgQVZNQVBJXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIEhlYWx0aCBSUEMgZm9yIGEgbm9kZS5cclxuICAgKi9cclxuICBIZWFsdGggPSAoKSA9PiB0aGlzLmFwaXMuaGVhbHRoIGFzIEhlYWx0aEFQSVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBJbmRleCBSUEMgZm9yIGEgbm9kZS5cclxuICAgKi9cclxuICBJbmRleCA9ICgpID0+IHRoaXMuYXBpcy5pbmRleCBhcyBJbmRleEFQSVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBJbmZvIFJQQyBmb3IgYSBub2RlLlxyXG4gICAqL1xyXG4gIEluZm8gPSAoKSA9PiB0aGlzLmFwaXMuaW5mbyBhcyBJbmZvQVBJXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIE1ldHJpY3MgUlBDLlxyXG4gICAqL1xyXG4gIE1ldHJpY3MgPSAoKSA9PiB0aGlzLmFwaXMubWV0cmljcyBhcyBNZXRyaWNzQVBJXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIEtleXN0b3JlIFJQQyBmb3IgYSBub2RlLiBXZSBsYWJlbCBpdCBcIk5vZGVLZXlzXCIgdG8gcmVkdWNlXHJcbiAgICogY29uZnVzaW9uIGFib3V0IHdoYXQgaXQncyBhY2Nlc3NpbmcuXHJcbiAgICovXHJcbiAgTm9kZUtleXMgPSAoKSA9PiB0aGlzLmFwaXMua2V5c3RvcmUgYXMgS2V5c3RvcmVBUElcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgUGxhdGZvcm1WTSBSUEMgcG9pbnRlZCBhdCB0aGUgQ29yZS1DaGFpbi5cclxuICAgKi9cclxuICBDb3JlQ2hhaW4gPSAoKSA9PiB0aGlzLmFwaXMuY29yZWNoYWluIGFzIFBsYXRmb3JtVk1BUElcclxuXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBBeGlhIGluc3RhbmNlLiBTZXRzIHRoZSBhZGRyZXNzIGFuZCBwb3J0IG9mIHRoZSBtYWluIEF4aWEgQ2xpZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGhvc3QgVGhlIGhvc3RuYW1lIHRvIHJlc29sdmUgdG8gcmVhY2ggdGhlIEF4aWEgQ2xpZW50IFJQQyBBUElzXHJcbiAgICogQHBhcmFtIHBvcnQgVGhlIHBvcnQgdG8gcmVzb2x2ZSB0byByZWFjaCB0aGUgQXhpYSBDbGllbnQgUlBDIEFQSXNcclxuICAgKiBAcGFyYW0gcHJvdG9jb2wgVGhlIHByb3RvY29sIHN0cmluZyB0byB1c2UgYmVmb3JlIGEgXCI6Ly9cIiBpbiBhIHJlcXVlc3QsXHJcbiAgICogZXg6IFwiaHR0cFwiLCBcImh0dHBzXCIsIFwiZ2l0XCIsIFwid3NcIiwgZXRjLiBEZWZhdWx0cyB0byBodHRwXHJcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBTZXRzIHRoZSBOZXR3b3JrSUQgb2YgdGhlIGNsYXNzLiBEZWZhdWx0IFtbRGVmYXVsdE5ldHdvcmtJRF1dXHJcbiAgICogQHBhcmFtIFN3YXBDaGFpbklEIFNldHMgdGhlIGJsb2NrY2hhaW5JRCBmb3IgdGhlIEFWTS4gV2lsbCB0cnkgdG8gYXV0by1kZXRlY3QsXHJcbiAgICogb3RoZXJ3aXNlIGRlZmF1bHQgXCIyZU55MW1VRmRtYXhYTmoxZVFIVWU3TnA0Z2p1OXNKc0V0V1E0TVgzVG9pTkt1QURlZFwiXHJcbiAgICogQHBhcmFtIEFYQ2hhaW5JRCBTZXRzIHRoZSBibG9ja2NoYWluSUQgZm9yIHRoZSBFVk0uIFdpbGwgdHJ5IHRvIGF1dG8tZGV0ZWN0LFxyXG4gICAqIG90aGVyd2lzZSBkZWZhdWx0IFwiMkNBNmo1ell6YXN5blBzRmVOb3FXa21UQ3QzVlNjTXZYVVpIYmZESjhrM29HekFQdFVcIlxyXG4gICAqIEBwYXJhbSBocnAgVGhlIGh1bWFuLXJlYWRhYmxlIHBhcnQgb2YgdGhlIGJlY2gzMiBhZGRyZXNzZXNcclxuICAgKiBAcGFyYW0gc2tpcGluaXQgU2tpcHMgY3JlYXRpbmcgdGhlIEFQSXMuIERlZmF1bHRzIHRvIGZhbHNlXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBob3N0Pzogc3RyaW5nLFxyXG4gICAgcG9ydD86IG51bWJlcixcclxuICAgIHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBcIixcclxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcclxuICAgIFN3YXBDaGFpbklEOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBBWENoYWluSUQ6IHN0cmluZyA9IHVuZGVmaW5lZCxcclxuICAgIGhycDogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgc2tpcGluaXQ6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICkge1xyXG4gICAgc3VwZXIoaG9zdCwgcG9ydCwgcHJvdG9jb2wpXHJcbiAgICBsZXQgc3dhcGNoYWluaWQ6IHN0cmluZyA9IFN3YXBDaGFpbklEXHJcbiAgICBsZXQgYXhjaGFpbmlkOiBzdHJpbmcgPSBBWENoYWluSURcclxuXHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGVvZiBTd2FwQ2hhaW5JRCA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAhU3dhcENoYWluSUQgfHxcclxuICAgICAgU3dhcENoYWluSUQudG9Mb3dlckNhc2UoKSA9PT0gXCJzd2FwXCJcclxuICAgICkge1xyXG4gICAgICBpZiAobmV0d29ya0lELnRvU3RyaW5nKCkgaW4gRGVmYXVsdHMubmV0d29yaykge1xyXG4gICAgICAgIHN3YXBjaGFpbmlkID0gRGVmYXVsdHMubmV0d29ya1tgJHtuZXR3b3JrSUR9YF0uU3dhcC5ibG9ja2NoYWluSURcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2FwY2hhaW5pZCA9IERlZmF1bHRzLm5ldHdvcmtbMTIzNDVdLlN3YXAuYmxvY2tjaGFpbklEXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgdHlwZW9mIEFYQ2hhaW5JRCA9PT0gXCJ1bmRlZmluZWRcIiB8fFxyXG4gICAgICAhQVhDaGFpbklEIHx8XHJcbiAgICAgIEFYQ2hhaW5JRC50b0xvd2VyQ2FzZSgpID09PSBcImF4XCJcclxuICAgICkge1xyXG4gICAgICBpZiAobmV0d29ya0lELnRvU3RyaW5nKCkgaW4gRGVmYXVsdHMubmV0d29yaykge1xyXG4gICAgICAgIGF4Y2hhaW5pZCA9IERlZmF1bHRzLm5ldHdvcmtbYCR7bmV0d29ya0lEfWBdLkFYLmJsb2NrY2hhaW5JRFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF4Y2hhaW5pZCA9IERlZmF1bHRzLm5ldHdvcmtbMTIzNDVdLkFYLmJsb2NrY2hhaW5JRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5ldHdvcmtJRCA9PT0gXCJudW1iZXJcIiAmJiBuZXR3b3JrSUQgPj0gMCkge1xyXG4gICAgICB0aGlzLm5ldHdvcmtJRCA9IG5ldHdvcmtJRFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmV0d29ya0lEID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIG5ldHdvcmtJRCA9IERlZmF1bHROZXR3b3JrSURcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgaHJwICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRoaXMuaHJwID0gaHJwXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhycCA9IGdldFByZWZlcnJlZEhSUCh0aGlzLm5ldHdvcmtJRClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXNraXBpbml0KSB7XHJcbiAgICAgIHRoaXMuYWRkQVBJKFwiYWRtaW5cIiwgQWRtaW5BUEkpXHJcbiAgICAgIHRoaXMuYWRkQVBJKFwiYXV0aFwiLCBBdXRoQVBJKVxyXG4gICAgICB0aGlzLmFkZEFQSShcInN3YXBjaGFpblwiLCBBVk1BUEksIFwiL2V4dC9iYy9Td2FwXCIsIHN3YXBjaGFpbmlkKVxyXG4gICAgICB0aGlzLmFkZEFQSShcImF4Y2hhaW5cIiwgRVZNQVBJLCBcIi9leHQvYmMvQVgvYXhjXCIsIGF4Y2hhaW5pZClcclxuICAgICAgdGhpcy5hZGRBUEkoXCJoZWFsdGhcIiwgSGVhbHRoQVBJKVxyXG4gICAgICB0aGlzLmFkZEFQSShcImluZm9cIiwgSW5mb0FQSSlcclxuICAgICAgdGhpcy5hZGRBUEkoXCJpbmRleFwiLCBJbmRleEFQSSlcclxuICAgICAgdGhpcy5hZGRBUEkoXCJrZXlzdG9yZVwiLCBLZXlzdG9yZUFQSSlcclxuICAgICAgdGhpcy5hZGRBUEkoXCJtZXRyaWNzXCIsIE1ldHJpY3NBUEkpXHJcbiAgICAgIHRoaXMuYWRkQVBJKFwiY29yZWNoYWluXCIsIFBsYXRmb3JtVk1BUEkpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgeyBBeGlhIH1cclxuZXhwb3J0IHsgQXhpYUNvcmUgfVxyXG5leHBvcnQgeyBCaW5Ub29scyB9XHJcbmV4cG9ydCB7IEJOIH1cclxuZXhwb3J0IHsgQnVmZmVyIH1cclxuZXhwb3J0IHsgREIgfVxyXG5leHBvcnQgeyBIRE5vZGUgfVxyXG5leHBvcnQgeyBHZW5lc2lzQXNzZXQgfVxyXG5leHBvcnQgeyBHZW5lc2lzRGF0YSB9XHJcbmV4cG9ydCB7IE1uZW1vbmljIH1cclxuZXhwb3J0IHsgUHViU3ViIH1cclxuZXhwb3J0IHsgU29ja2V0IH1cclxuXHJcbmV4cG9ydCAqIGFzIGFkbWluIGZyb20gXCIuL2FwaXMvYWRtaW5cIlxyXG5leHBvcnQgKiBhcyBhdXRoIGZyb20gXCIuL2FwaXMvYXV0aFwiXHJcbmV4cG9ydCAqIGFzIGF2bSBmcm9tIFwiLi9hcGlzL2F2bVwiXHJcbmV4cG9ydCAqIGFzIGNvbW1vbiBmcm9tIFwiLi9jb21tb25cIlxyXG5leHBvcnQgKiBhcyBldm0gZnJvbSBcIi4vYXBpcy9ldm1cIlxyXG5leHBvcnQgKiBhcyBoZWFsdGggZnJvbSBcIi4vYXBpcy9oZWFsdGhcIlxyXG5leHBvcnQgKiBhcyBpbmRleCBmcm9tIFwiLi9hcGlzL2luZGV4XCJcclxuZXhwb3J0ICogYXMgaW5mbyBmcm9tIFwiLi9hcGlzL2luZm9cIlxyXG5leHBvcnQgKiBhcyBrZXlzdG9yZSBmcm9tIFwiLi9hcGlzL2tleXN0b3JlXCJcclxuZXhwb3J0ICogYXMgbWV0cmljcyBmcm9tIFwiLi9hcGlzL21ldHJpY3NcIlxyXG5leHBvcnQgKiBhcyBwbGF0Zm9ybXZtIGZyb20gXCIuL2FwaXMvcGxhdGZvcm12bVwiXHJcbmV4cG9ydCAqIGFzIHV0aWxzIGZyb20gXCIuL3V0aWxzXCJcclxuIl19