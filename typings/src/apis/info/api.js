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
exports.InfoAPI = void 0;
const jrpcapi_1 = require("../../common/jrpcapi");
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * Class for interacting with a node's InfoAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class InfoAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/info" as the path to rpc's baseURL
     */
    constructor(core, baseURL = "/ext/info") {
        super(core, baseURL);
        /**
         * Fetches the blockchainID from the node for a given alias.
         *
         * @param alias The blockchain alias to get the blockchainID
         *
         * @returns Returns a Promise string containing the base 58 string representation of the blockchainID.
         */
        this.getBlockchainID = (alias) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                alias
            };
            const response = yield this.callMethod("info.getBlockchainID", params);
            return response.data.result.blockchainID;
        });
        /**
         * Fetches the IP address from the node.
         *
         * @returns Returns a Promise string of the node IP address.
         */
        this.getNodeIP = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getBlockchainID");
            return response.data.result.ip;
        });
        /**
         * Fetches the networkID from the node.
         *
         * @returns Returns a Promise number of the networkID.
         */
        this.getNetworkID = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getNetworkID");
            return response.data.result.networkID;
        });
        /**
         * Fetches the network name this node is running on
         *
         * @returns Returns a Promise string containing the network name.
         */
        this.getNetworkName = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getNetworkName");
            return response.data.result.networkName;
        });
        /**
         * Fetches the nodeID from the node.
         *
         * @returns Returns a Promise string of the nodeID.
         */
        this.getNodeID = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getNodeID");
            return response.data.result.nodeID;
        });
        /**
         * Fetches the version of Gecko this node is running
         *
         * @returns Returns a Promise string containing the version of Gecko.
         */
        this.getNodeVersion = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getNodeVersion");
            return response.data.result.version;
        });
        /**
         * Fetches the transaction fee from the node.
         *
         * @returns Returns a Promise object of the transaction fee in nAXC.
         */
        this.getTxFee = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.getTxFee");
            return {
                txFee: new bn_js_1.default(response.data.result.txFee, 10),
                creationTxFee: new bn_js_1.default(response.data.result.creationTxFee, 10)
            };
        });
        /**
         * Check whether a given chain is done bootstrapping
         * @param chain The ID or alias of a chain.
         *
         * @returns Returns a Promise boolean of whether the chain has completed bootstrapping.
         */
        this.isBootstrapped = (chain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                chain
            };
            const response = yield this.callMethod("info.isBootstrapped", params);
            return response.data.result.isBootstrapped;
        });
        /**
         * Returns the peers connected to the node.
         * @param nodeIDs an optional parameter to specify what nodeID's descriptions should be returned.
         * If this parameter is left empty, descriptions for all active connections will be returned.
         * If the node is not connected to a specified nodeID, it will be omitted from the response.
         *
         * @returns Promise for the list of connected peers in PeersResponse format.
         */
        this.peers = (nodeIDs = []) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                nodeIDs
            };
            const response = yield this.callMethod("info.peers", params);
            return response.data.result.peers;
        });
        /**
         * Returns the network's observed uptime of this node.
         *
         * @returns Returns a Promise UptimeResponse which contains rewardingStakePercentage and weightedAveragePercentage.
         */
        this.uptime = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("info.uptime");
            return response.data.result;
        });
    }
}
exports.InfoAPI = InfoAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvaW5mby9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBS0Esa0RBQThDO0FBRTlDLGtEQUFzQjtBQVV0Qjs7Ozs7O0dBTUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxpQkFBTztJQTJJbEM7Ozs7O09BS0c7SUFDSCxZQUFZLElBQWMsRUFBRSxVQUFrQixXQUFXO1FBQ3ZELEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFqSnRCOzs7Ozs7V0FNRztRQUNILG9CQUFlLEdBQUcsQ0FBTyxLQUFhLEVBQW1CLEVBQUU7WUFDekQsTUFBTSxNQUFNLEdBQTBCO2dCQUNwQyxLQUFLO2FBQ04sQ0FBQTtZQUVELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHNCQUFzQixFQUN0QixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFBO1FBQzFDLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7V0FJRztRQUNILGNBQVMsR0FBRyxHQUEwQixFQUFFO1lBQ3RDLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHNCQUFzQixDQUN2QixDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7UUFDaEMsQ0FBQyxDQUFBLENBQUE7UUFFRDs7OztXQUlHO1FBQ0gsaUJBQVksR0FBRyxHQUEwQixFQUFFO1lBQ3pDLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUE7UUFDdkMsQ0FBQyxDQUFBLENBQUE7UUFFRDs7OztXQUlHO1FBQ0gsbUJBQWMsR0FBRyxHQUEwQixFQUFFO1lBQzNDLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHFCQUFxQixDQUN0QixDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDekMsQ0FBQyxDQUFBLENBQUE7UUFFRDs7OztXQUlHO1FBQ0gsY0FBUyxHQUFHLEdBQTBCLEVBQUU7WUFDdEMsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQsZ0JBQWdCLENBQ2pCLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtRQUNwQyxDQUFDLENBQUEsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSCxtQkFBYyxHQUFHLEdBQTBCLEVBQUU7WUFDM0MsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQscUJBQXFCLENBQ3RCLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUNyQyxDQUFDLENBQUEsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSCxhQUFRLEdBQUcsR0FBb0MsRUFBRTtZQUMvQyxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQzVFLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLElBQUksZUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQzdDLGFBQWEsRUFBRSxJQUFJLGVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDO2FBQzlELENBQUE7UUFDSCxDQUFDLENBQUEsQ0FBQTtRQUVEOzs7OztXQUtHO1FBQ0gsbUJBQWMsR0FBRyxDQUFPLEtBQWEsRUFBb0IsRUFBRTtZQUN6RCxNQUFNLE1BQU0sR0FBeUI7Z0JBQ25DLEtBQUs7YUFDTixDQUFBO1lBQ0QsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQscUJBQXFCLEVBQ3JCLE1BQU0sQ0FDUCxDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUE7UUFDNUMsQ0FBQyxDQUFBLENBQUE7UUFFRDs7Ozs7OztXQU9HO1FBQ0gsVUFBSyxHQUFHLENBQU8sVUFBb0IsRUFBRSxFQUE0QixFQUFFO1lBQ2pFLE1BQU0sTUFBTSxHQUFnQjtnQkFDMUIsT0FBTzthQUNSLENBQUE7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxZQUFZLEVBQ1osTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUNuQyxDQUFDLENBQUEsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSCxXQUFNLEdBQUcsR0FBa0MsRUFBRTtZQUMzQyxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQzFFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDN0IsQ0FBQyxDQUFBLENBQUE7SUFVRCxDQUFDO0NBQ0Y7QUFwSkQsMEJBb0pDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1JbmZvXHJcbiAqL1xyXG5pbXBvcnQgQXhpYUNvcmUgZnJvbSBcIi4uLy4uL2F4aWFcIlxyXG5pbXBvcnQgeyBKUlBDQVBJIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcnBjYXBpXCJcclxuaW1wb3J0IHsgUmVxdWVzdFJlc3BvbnNlRGF0YSB9IGZyb20gXCIuLi8uLi9jb21tb24vYXBpYmFzZVwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQge1xyXG4gIEdldEJsb2NrY2hhaW5JRFBhcmFtcyxcclxuICBHZXRUeEZlZVJlc3BvbnNlLFxyXG4gIElzQm9vdHN0cmFwcGVkUGFyYW1zLFxyXG4gIFBlZXJzUGFyYW1zLFxyXG4gIFBlZXJzUmVzcG9uc2UsXHJcbiAgVXB0aW1lUmVzcG9uc2VcclxufSBmcm9tIFwiLi9pbnRlcmZhY2VzXCJcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIG5vZGUncyBJbmZvQVBJLlxyXG4gKlxyXG4gKiBAY2F0ZWdvcnkgUlBDQVBJc1xyXG4gKlxyXG4gKiBAcmVtYXJrcyBUaGlzIGV4dGVuZHMgdGhlIFtbSlJQQ0FQSV1dIGNsYXNzLiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgZGlyZWN0bHkgY2FsbGVkLiBJbnN0ZWFkLCB1c2UgdGhlIFtbQXhpYS5hZGRBUEldXSBmdW5jdGlvbiB0byByZWdpc3RlciB0aGlzIGludGVyZmFjZSB3aXRoIEF4aWEuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSW5mb0FQSSBleHRlbmRzIEpSUENBUEkge1xyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIGJsb2NrY2hhaW5JRCBmcm9tIHRoZSBub2RlIGZvciBhIGdpdmVuIGFsaWFzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGFsaWFzIFRoZSBibG9ja2NoYWluIGFsaWFzIHRvIGdldCB0aGUgYmxvY2tjaGFpbklEXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgYmFzZSA1OCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGJsb2NrY2hhaW5JRC5cclxuICAgKi9cclxuICBnZXRCbG9ja2NoYWluSUQgPSBhc3luYyAoYWxpYXM6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldEJsb2NrY2hhaW5JRFBhcmFtcyA9IHtcclxuICAgICAgYWxpYXNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJpbmZvLmdldEJsb2NrY2hhaW5JRFwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5ibG9ja2NoYWluSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIElQIGFkZHJlc3MgZnJvbSB0aGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBvZiB0aGUgbm9kZSBJUCBhZGRyZXNzLlxyXG4gICAqL1xyXG4gIGdldE5vZGVJUCA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiaW5mby5nZXRCbG9ja2NoYWluSURcIlxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmlwXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSBuZXR3b3JrSUQgZnJvbSB0aGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIG51bWJlciBvZiB0aGUgbmV0d29ya0lELlxyXG4gICAqL1xyXG4gIGdldE5ldHdvcmtJRCA9IGFzeW5jICgpOiBQcm9taXNlPG51bWJlcj4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiaW5mby5nZXROZXR3b3JrSURcIlxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0Lm5ldHdvcmtJRFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgbmV0d29yayBuYW1lIHRoaXMgbm9kZSBpcyBydW5uaW5nIG9uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgbmV0d29yayBuYW1lLlxyXG4gICAqL1xyXG4gIGdldE5ldHdvcmtOYW1lID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJpbmZvLmdldE5ldHdvcmtOYW1lXCJcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5uZXR3b3JrTmFtZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2hlcyB0aGUgbm9kZUlEIGZyb20gdGhlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgb2YgdGhlIG5vZGVJRC5cclxuICAgKi9cclxuICBnZXROb2RlSUQgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImluZm8uZ2V0Tm9kZUlEXCJcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5ub2RlSURcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoZXMgdGhlIHZlcnNpb24gb2YgR2Vja28gdGhpcyBub2RlIGlzIHJ1bm5pbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZyBjb250YWluaW5nIHRoZSB2ZXJzaW9uIG9mIEdlY2tvLlxyXG4gICAqL1xyXG4gIGdldE5vZGVWZXJzaW9uID0gYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJpbmZvLmdldE5vZGVWZXJzaW9uXCJcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC52ZXJzaW9uXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaGVzIHRoZSB0cmFuc2FjdGlvbiBmZWUgZnJvbSB0aGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIG9iamVjdCBvZiB0aGUgdHJhbnNhY3Rpb24gZmVlIGluIG5BWEMuXHJcbiAgICovXHJcbiAgZ2V0VHhGZWUgPSBhc3luYyAoKTogUHJvbWlzZTxHZXRUeEZlZVJlc3BvbnNlPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcImluZm8uZ2V0VHhGZWVcIilcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR4RmVlOiBuZXcgQk4ocmVzcG9uc2UuZGF0YS5yZXN1bHQudHhGZWUsIDEwKSxcclxuICAgICAgY3JlYXRpb25UeEZlZTogbmV3IEJOKHJlc3BvbnNlLmRhdGEucmVzdWx0LmNyZWF0aW9uVHhGZWUsIDEwKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgd2hldGhlciBhIGdpdmVuIGNoYWluIGlzIGRvbmUgYm9vdHN0cmFwcGluZ1xyXG4gICAqIEBwYXJhbSBjaGFpbiBUaGUgSUQgb3IgYWxpYXMgb2YgYSBjaGFpbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIGJvb2xlYW4gb2Ygd2hldGhlciB0aGUgY2hhaW4gaGFzIGNvbXBsZXRlZCBib290c3RyYXBwaW5nLlxyXG4gICAqL1xyXG4gIGlzQm9vdHN0cmFwcGVkID0gYXN5bmMgKGNoYWluOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogSXNCb290c3RyYXBwZWRQYXJhbXMgPSB7XHJcbiAgICAgIGNoYWluXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJpbmZvLmlzQm9vdHN0cmFwcGVkXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmlzQm9vdHN0cmFwcGVkXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwZWVycyBjb25uZWN0ZWQgdG8gdGhlIG5vZGUuXHJcbiAgICogQHBhcmFtIG5vZGVJRHMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRvIHNwZWNpZnkgd2hhdCBub2RlSUQncyBkZXNjcmlwdGlvbnMgc2hvdWxkIGJlIHJldHVybmVkLlxyXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIGxlZnQgZW1wdHksIGRlc2NyaXB0aW9ucyBmb3IgYWxsIGFjdGl2ZSBjb25uZWN0aW9ucyB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAqIElmIHRoZSBub2RlIGlzIG5vdCBjb25uZWN0ZWQgdG8gYSBzcGVjaWZpZWQgbm9kZUlELCBpdCB3aWxsIGJlIG9taXR0ZWQgZnJvbSB0aGUgcmVzcG9uc2UuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciB0aGUgbGlzdCBvZiBjb25uZWN0ZWQgcGVlcnMgaW4gUGVlcnNSZXNwb25zZSBmb3JtYXQuXHJcbiAgICovXHJcbiAgcGVlcnMgPSBhc3luYyAobm9kZUlEczogc3RyaW5nW10gPSBbXSk6IFByb21pc2U8UGVlcnNSZXNwb25zZVtdPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IFBlZXJzUGFyYW1zID0ge1xyXG4gICAgICBub2RlSURzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJpbmZvLnBlZXJzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnBlZXJzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBuZXR3b3JrJ3Mgb2JzZXJ2ZWQgdXB0aW1lIG9mIHRoaXMgbm9kZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIFVwdGltZVJlc3BvbnNlIHdoaWNoIGNvbnRhaW5zIHJld2FyZGluZ1N0YWtlUGVyY2VudGFnZSBhbmQgd2VpZ2h0ZWRBdmVyYWdlUGVyY2VudGFnZS5cclxuICAgKi9cclxuICB1cHRpbWUgPSBhc3luYyAoKTogUHJvbWlzZTxVcHRpbWVSZXNwb25zZT4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXCJpbmZvLnVwdGltZVwiKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgaW5zdGFudGlhdGVkIGRpcmVjdGx5LiBJbnN0ZWFkIHVzZSB0aGUgW1tBeGlhLmFkZEFQSV1dIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb3JlIEEgcmVmZXJlbmNlIHRvIHRoZSBBeGlhIGNsYXNzXHJcbiAgICogQHBhcmFtIGJhc2VVUkwgRGVmYXVsdHMgdG8gdGhlIHN0cmluZyBcIi9leHQvaW5mb1wiIGFzIHRoZSBwYXRoIHRvIHJwYydzIGJhc2VVUkxcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihjb3JlOiBBeGlhQ29yZSwgYmFzZVVSTDogc3RyaW5nID0gXCIvZXh0L2luZm9cIikge1xyXG4gICAgc3VwZXIoY29yZSwgYmFzZVVSTClcclxuICB9XHJcbn1cclxuIl19