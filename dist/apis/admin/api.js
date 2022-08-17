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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAPI = void 0;
const jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node's AdminAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called.
 * Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class AdminAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]]
     * method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/admin" as the path to rpc's baseURL
     */
    constructor(core, baseURL = "/ext/admin") {
        super(core, baseURL);
        /**
         * Assign an API an alias, a different endpoint for the API. The original endpoint will still
         * work. This change only affects this node other nodes will not know about this alias.
         *
         * @param endpoint The original endpoint of the API. endpoint should only include the part of
         * the endpoint after /ext/
         * @param alias The API being aliased can now be called at ext/alias
         *
         * @returns Returns a Promise boolean containing success, true for success, false for failure.
         */
        this.alias = (endpoint, alias) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                endpoint,
                alias
            };
            const response = yield this.callMethod("admin.alias", params);
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Give a blockchain an alias, a different name that can be used any place the blockchain’s
         * ID is used.
         *
         * @param chain The blockchain’s ID
         * @param alias Can now be used in place of the blockchain’s ID (in API endpoints, for example)
         *
         * @returns Returns a Promise boolean containing success, true for success, false for failure.
         */
        this.aliasChain = (chain, alias) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                chain,
                alias
            };
            const response = yield this.callMethod("admin.aliasChain", params);
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Get all aliases for given blockchain
         *
         * @param chain The blockchain’s ID
         *
         * @returns Returns a Promise string[] containing aliases of the blockchain.
         */
        this.getChainAliases = (chain) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                chain
            };
            const response = yield this.callMethod("admin.getChainAliases", params);
            return response.data.result.aliases
                ? response.data.result.aliases
                : response.data.result;
        });
        /**
         * Returns log and display levels of loggers
         *
         * @param loggerName the name of the logger to be returned. This is an optional argument. If not specified, it returns all possible loggers.
         *
         * @returns Returns a Promise containing logger levels
         */
        this.getLoggerLevel = (loggerName) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof loggerName !== "undefined") {
                params.loggerName = loggerName;
            }
            const response = yield this.callMethod("admin.getLoggerLevel", params);
            return response.data.result;
        });
        /**
         * Dynamically loads any virtual machines installed on the node as plugins
         *
         * @returns Returns a Promise containing new VMs and failed VMs
         */
        this.loadVMs = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("admin.loadVMs");
            return response.data.result.aliases
                ? response.data.result.aliases
                : response.data.result;
        });
        /**
         * Dump the mutex statistics of the node to the specified file.
         *
         * @returns Promise for a boolean that is true on success.
         */
        this.lockProfile = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("admin.lockProfile");
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Dump the current memory footprint of the node to the specified file.
         *
         * @returns Promise for a boolean that is true on success.
         */
        this.memoryProfile = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("admin.memoryProfile");
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Sets log and display levels of loggers.
         *
         * @param loggerName the name of the logger to be changed. This is an optional parameter.
         * @param logLevel the log level of written logs, can be omitted.
         * @param displayLevel the log level of displayed logs, can be omitted.
         *
         * @returns Returns a Promise containing logger levels
         */
        this.setLoggerLevel = (loggerName, logLevel, displayLevel) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof loggerName !== "undefined") {
                params.loggerName = loggerName;
            }
            if (typeof logLevel !== "undefined") {
                params.logLevel = logLevel;
            }
            if (typeof displayLevel !== "undefined") {
                params.displayLevel = displayLevel;
            }
            const response = yield this.callMethod("admin.setLoggerLevel", params);
            return response.data.result;
        });
        /**
         * Start profiling the cpu utilization of the node. Will dump the profile information into
         * the specified file on stop.
         *
         * @returns Promise for a boolean that is true on success.
         */
        this.startCPUProfiler = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("admin.startCPUProfiler");
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Stop the CPU profile that was previously started.
         *
         * @returns Promise for a boolean that is true on success.
         */
        this.stopCPUProfiler = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("admin.stopCPUProfiler");
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
    }
}
exports.AdminAPI = AdminAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvYWRtaW4vYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBLGtEQUE4QztBQWE5Qzs7Ozs7OztHQU9HO0FBRUgsTUFBYSxRQUFTLFNBQVEsaUJBQU87SUE2TG5DOzs7Ozs7T0FNRztJQUNILFlBQVksSUFBYyxFQUFFLFVBQWtCLFlBQVk7UUFDeEQsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQXBNdEI7Ozs7Ozs7OztXQVNHO1FBQ0gsVUFBSyxHQUFHLENBQU8sUUFBZ0IsRUFBRSxLQUFhLEVBQW9CLEVBQUU7WUFDbEUsTUFBTSxNQUFNLEdBQWdCO2dCQUMxQixRQUFRO2dCQUNSLEtBQUs7YUFDTixDQUFBO1lBQ0QsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQsYUFBYSxFQUNiLE1BQU0sQ0FDUCxDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUNqQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQzFCLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7Ozs7O1dBUUc7UUFDSCxlQUFVLEdBQUcsQ0FBTyxLQUFhLEVBQUUsS0FBYSxFQUFvQixFQUFFO1lBQ3BFLE1BQU0sTUFBTSxHQUFxQjtnQkFDL0IsS0FBSztnQkFDTCxLQUFLO2FBQ04sQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELGtCQUFrQixFQUNsQixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQzlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7Ozs7V0FNRztRQUNILG9CQUFlLEdBQUcsQ0FBTyxLQUFhLEVBQXFCLEVBQUU7WUFDM0QsTUFBTSxNQUFNLEdBQTBCO2dCQUNwQyxLQUFLO2FBQ04sQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHVCQUF1QixFQUN2QixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQzlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7Ozs7V0FNRztRQUNILG1CQUFjLEdBQUcsQ0FDZixVQUFtQixFQUNjLEVBQUU7WUFDbkMsTUFBTSxNQUFNLEdBQXlCLEVBQUUsQ0FBQTtZQUN2QyxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtnQkFDckMsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7YUFDL0I7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxzQkFBc0IsRUFDdEIsTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQzdCLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxHQUFtQyxFQUFFO1lBQzdDLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDNUUsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUNqQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQzFCLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7V0FJRztRQUNILGdCQUFXLEdBQUcsR0FBMkIsRUFBRTtZQUN6QyxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxtQkFBbUIsQ0FDcEIsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQzlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSCxrQkFBYSxHQUFHLEdBQTJCLEVBQUU7WUFDM0MsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQscUJBQXFCLENBQ3RCLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQ2pDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUM5QixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDMUIsQ0FBQyxDQUFBLENBQUE7UUFFRDs7Ozs7Ozs7V0FRRztRQUNILG1CQUFjLEdBQUcsQ0FDZixVQUFtQixFQUNuQixRQUFpQixFQUNqQixZQUFxQixFQUNZLEVBQUU7WUFDbkMsTUFBTSxNQUFNLEdBQXlCLEVBQUUsQ0FBQTtZQUN2QyxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtnQkFDckMsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7YUFDL0I7WUFDRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRTtnQkFDbkMsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7YUFDM0I7WUFDRCxJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtnQkFDdkMsTUFBTSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7YUFDbkM7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxzQkFBc0IsRUFDdEIsTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQzdCLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7O1dBS0c7UUFDSCxxQkFBZ0IsR0FBRyxHQUEyQixFQUFFO1lBQzlDLE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHdCQUF3QixDQUN6QixDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUNqQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQzFCLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7V0FJRztRQUNILG9CQUFlLEdBQUcsR0FBMkIsRUFBRTtZQUM3QyxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCx1QkFBdUIsQ0FDeEIsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQzlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtJQVdELENBQUM7Q0FDRjtBQXZNRCw0QkF1TUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLUFkbWluXHJcbiAqL1xyXG5pbXBvcnQgQXhpYUNvcmUgZnJvbSBcIi4uLy4uL2F4aWFcIlxyXG5pbXBvcnQgeyBKUlBDQVBJIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcnBjYXBpXCJcclxuaW1wb3J0IHsgUmVxdWVzdFJlc3BvbnNlRGF0YSB9IGZyb20gXCIuLi8uLi9jb21tb24vYXBpYmFzZVwiXHJcbmltcG9ydCB7XHJcbiAgQWxpYXNDaGFpblBhcmFtcyxcclxuICBBbGlhc1BhcmFtcyxcclxuICBHZXRDaGFpbkFsaWFzZXNQYXJhbXMsXHJcbiAgR2V0TG9nZ2VyTGV2ZWxQYXJhbXMsXHJcbiAgR2V0TG9nZ2VyTGV2ZWxSZXNwb25zZSxcclxuICBMb2FkVk1zUmVzcG9uc2UsXHJcbiAgU2V0TG9nZ2VyTGV2ZWxQYXJhbXMsXHJcbiAgU2V0TG9nZ2VyTGV2ZWxSZXNwb25zZVxyXG59IGZyb20gXCIuL2ludGVyZmFjZXNcIlxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgbm9kZSdzIEFkbWluQVBJLlxyXG4gKlxyXG4gKiBAY2F0ZWdvcnkgUlBDQVBJc1xyXG4gKlxyXG4gKiBAcmVtYXJrcyBUaGlzIGV4dGVuZHMgdGhlIFtbSlJQQ0FQSV1dIGNsYXNzLiBUaGlzIGNsYXNzIHNob3VsZCBub3QgYmUgZGlyZWN0bHkgY2FsbGVkLlxyXG4gKiBJbnN0ZWFkLCB1c2UgdGhlIFtbQXhpYS5hZGRBUEldXSBmdW5jdGlvbiB0byByZWdpc3RlciB0aGlzIGludGVyZmFjZSB3aXRoIEF4aWEuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIEFkbWluQVBJIGV4dGVuZHMgSlJQQ0FQSSB7XHJcbiAgLyoqXHJcbiAgICogQXNzaWduIGFuIEFQSSBhbiBhbGlhcywgYSBkaWZmZXJlbnQgZW5kcG9pbnQgZm9yIHRoZSBBUEkuIFRoZSBvcmlnaW5hbCBlbmRwb2ludCB3aWxsIHN0aWxsXHJcbiAgICogd29yay4gVGhpcyBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgbm9kZSBvdGhlciBub2RlcyB3aWxsIG5vdCBrbm93IGFib3V0IHRoaXMgYWxpYXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZW5kcG9pbnQgVGhlIG9yaWdpbmFsIGVuZHBvaW50IG9mIHRoZSBBUEkuIGVuZHBvaW50IHNob3VsZCBvbmx5IGluY2x1ZGUgdGhlIHBhcnQgb2ZcclxuICAgKiB0aGUgZW5kcG9pbnQgYWZ0ZXIgL2V4dC9cclxuICAgKiBAcGFyYW0gYWxpYXMgVGhlIEFQSSBiZWluZyBhbGlhc2VkIGNhbiBub3cgYmUgY2FsbGVkIGF0IGV4dC9hbGlhc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgYm9vbGVhbiBjb250YWluaW5nIHN1Y2Nlc3MsIHRydWUgZm9yIHN1Y2Nlc3MsIGZhbHNlIGZvciBmYWlsdXJlLlxyXG4gICAqL1xyXG4gIGFsaWFzID0gYXN5bmMgKGVuZHBvaW50OiBzdHJpbmcsIGFsaWFzOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogQWxpYXNQYXJhbXMgPSB7XHJcbiAgICAgIGVuZHBvaW50LFxyXG4gICAgICBhbGlhc1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYWRtaW4uYWxpYXNcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZSBhIGJsb2NrY2hhaW4gYW4gYWxpYXMsIGEgZGlmZmVyZW50IG5hbWUgdGhhdCBjYW4gYmUgdXNlZCBhbnkgcGxhY2UgdGhlIGJsb2NrY2hhaW7igJlzXHJcbiAgICogSUQgaXMgdXNlZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjaGFpbiBUaGUgYmxvY2tjaGFpbuKAmXMgSURcclxuICAgKiBAcGFyYW0gYWxpYXMgQ2FuIG5vdyBiZSB1c2VkIGluIHBsYWNlIG9mIHRoZSBibG9ja2NoYWlu4oCZcyBJRCAoaW4gQVBJIGVuZHBvaW50cywgZm9yIGV4YW1wbGUpXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBib29sZWFuIGNvbnRhaW5pbmcgc3VjY2VzcywgdHJ1ZSBmb3Igc3VjY2VzcywgZmFsc2UgZm9yIGZhaWx1cmUuXHJcbiAgICovXHJcbiAgYWxpYXNDaGFpbiA9IGFzeW5jIChjaGFpbjogc3RyaW5nLCBhbGlhczogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEFsaWFzQ2hhaW5QYXJhbXMgPSB7XHJcbiAgICAgIGNoYWluLFxyXG4gICAgICBhbGlhc1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYWRtaW4uYWxpYXNDaGFpblwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5zdWNjZXNzXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA6IHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgYWxsIGFsaWFzZXMgZm9yIGdpdmVuIGJsb2NrY2hhaW5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjaGFpbiBUaGUgYmxvY2tjaGFpbuKAmXMgSURcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIHN0cmluZ1tdIGNvbnRhaW5pbmcgYWxpYXNlcyBvZiB0aGUgYmxvY2tjaGFpbi5cclxuICAgKi9cclxuICBnZXRDaGFpbkFsaWFzZXMgPSBhc3luYyAoY2hhaW46IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogR2V0Q2hhaW5BbGlhc2VzUGFyYW1zID0ge1xyXG4gICAgICBjaGFpblxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYWRtaW4uZ2V0Q2hhaW5BbGlhc2VzXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LmFsaWFzZXNcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC5hbGlhc2VzXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgbG9nIGFuZCBkaXNwbGF5IGxldmVscyBvZiBsb2dnZXJzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbG9nZ2VyTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nZ2VyIHRvIGJlIHJldHVybmVkLiBUaGlzIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50LiBJZiBub3Qgc3BlY2lmaWVkLCBpdCByZXR1cm5zIGFsbCBwb3NzaWJsZSBsb2dnZXJzLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgY29udGFpbmluZyBsb2dnZXIgbGV2ZWxzXHJcbiAgICovXHJcbiAgZ2V0TG9nZ2VyTGV2ZWwgPSBhc3luYyAoXHJcbiAgICBsb2dnZXJOYW1lPzogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxHZXRMb2dnZXJMZXZlbFJlc3BvbnNlPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IEdldExvZ2dlckxldmVsUGFyYW1zID0ge31cclxuICAgIGlmICh0eXBlb2YgbG9nZ2VyTmFtZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXMubG9nZ2VyTmFtZSA9IGxvZ2dlck5hbWVcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImFkbWluLmdldExvZ2dlckxldmVsXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEeW5hbWljYWxseSBsb2FkcyBhbnkgdmlydHVhbCBtYWNoaW5lcyBpbnN0YWxsZWQgb24gdGhlIG5vZGUgYXMgcGx1Z2luc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgY29udGFpbmluZyBuZXcgVk1zIGFuZCBmYWlsZWQgVk1zXHJcbiAgICovXHJcbiAgbG9hZFZNcyA9IGFzeW5jICgpOiBQcm9taXNlPExvYWRWTXNSZXNwb25zZT4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXCJhZG1pbi5sb2FkVk1zXCIpXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuYWxpYXNlc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LmFsaWFzZXNcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHVtcCB0aGUgbXV0ZXggc3RhdGlzdGljcyBvZiB0aGUgbm9kZSB0byB0aGUgc3BlY2lmaWVkIGZpbGUuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBQcm9taXNlIGZvciBhIGJvb2xlYW4gdGhhdCBpcyB0cnVlIG9uIHN1Y2Nlc3MuXHJcbiAgICovXHJcbiAgbG9ja1Byb2ZpbGUgPSBhc3luYyAoKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhZG1pbi5sb2NrUHJvZmlsZVwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRHVtcCB0aGUgY3VycmVudCBtZW1vcnkgZm9vdHByaW50IG9mIHRoZSBub2RlIHRvIHRoZSBzcGVjaWZpZWQgZmlsZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgYm9vbGVhbiB0aGF0IGlzIHRydWUgb24gc3VjY2Vzcy5cclxuICAgKi9cclxuICBtZW1vcnlQcm9maWxlID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYWRtaW4ubWVtb3J5UHJvZmlsZVwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyBsb2cgYW5kIGRpc3BsYXkgbGV2ZWxzIG9mIGxvZ2dlcnMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbG9nZ2VyTmFtZSB0aGUgbmFtZSBvZiB0aGUgbG9nZ2VyIHRvIGJlIGNoYW5nZWQuIFRoaXMgaXMgYW4gb3B0aW9uYWwgcGFyYW1ldGVyLlxyXG4gICAqIEBwYXJhbSBsb2dMZXZlbCB0aGUgbG9nIGxldmVsIG9mIHdyaXR0ZW4gbG9ncywgY2FuIGJlIG9taXR0ZWQuXHJcbiAgICogQHBhcmFtIGRpc3BsYXlMZXZlbCB0aGUgbG9nIGxldmVsIG9mIGRpc3BsYXllZCBsb2dzLCBjYW4gYmUgb21pdHRlZC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIGNvbnRhaW5pbmcgbG9nZ2VyIGxldmVsc1xyXG4gICAqL1xyXG4gIHNldExvZ2dlckxldmVsID0gYXN5bmMgKFxyXG4gICAgbG9nZ2VyTmFtZT86IHN0cmluZyxcclxuICAgIGxvZ0xldmVsPzogc3RyaW5nLFxyXG4gICAgZGlzcGxheUxldmVsPzogc3RyaW5nXHJcbiAgKTogUHJvbWlzZTxTZXRMb2dnZXJMZXZlbFJlc3BvbnNlPiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IFNldExvZ2dlckxldmVsUGFyYW1zID0ge31cclxuICAgIGlmICh0eXBlb2YgbG9nZ2VyTmFtZSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICBwYXJhbXMubG9nZ2VyTmFtZSA9IGxvZ2dlck5hbWVcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgbG9nTGV2ZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcGFyYW1zLmxvZ0xldmVsID0gbG9nTGV2ZWxcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZGlzcGxheUxldmVsICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHBhcmFtcy5kaXNwbGF5TGV2ZWwgPSBkaXNwbGF5TGV2ZWxcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImFkbWluLnNldExvZ2dlckxldmVsXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGFydCBwcm9maWxpbmcgdGhlIGNwdSB1dGlsaXphdGlvbiBvZiB0aGUgbm9kZS4gV2lsbCBkdW1wIHRoZSBwcm9maWxlIGluZm9ybWF0aW9uIGludG9cclxuICAgKiB0aGUgc3BlY2lmaWVkIGZpbGUgb24gc3RvcC5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgYm9vbGVhbiB0aGF0IGlzIHRydWUgb24gc3VjY2Vzcy5cclxuICAgKi9cclxuICBzdGFydENQVVByb2ZpbGVyID0gYXN5bmMgKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYWRtaW4uc3RhcnRDUFVQcm9maWxlclwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RvcCB0aGUgQ1BVIHByb2ZpbGUgdGhhdCB3YXMgcHJldmlvdXNseSBzdGFydGVkLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUHJvbWlzZSBmb3IgYSBib29sZWFuIHRoYXQgaXMgdHJ1ZSBvbiBzdWNjZXNzLlxyXG4gICAqL1xyXG4gIHN0b3BDUFVQcm9maWxlciA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImFkbWluLnN0b3BDUFVQcm9maWxlclwiXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseS4gSW5zdGVhZCB1c2UgdGhlIFtbQXhpYS5hZGRBUEldXVxyXG4gICAqIG1ldGhvZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb3JlIEEgcmVmZXJlbmNlIHRvIHRoZSBBeGlhIGNsYXNzXHJcbiAgICogQHBhcmFtIGJhc2VVUkwgRGVmYXVsdHMgdG8gdGhlIHN0cmluZyBcIi9leHQvYWRtaW5cIiBhcyB0aGUgcGF0aCB0byBycGMncyBiYXNlVVJMXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY29yZTogQXhpYUNvcmUsIGJhc2VVUkw6IHN0cmluZyA9IFwiL2V4dC9hZG1pblwiKSB7XHJcbiAgICBzdXBlcihjb3JlLCBiYXNlVVJMKVxyXG4gIH1cclxufVxyXG4iXX0=