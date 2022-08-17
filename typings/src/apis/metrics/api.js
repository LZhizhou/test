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
exports.MetricsAPI = void 0;
const restapi_1 = require("../../common/restapi");
/**
 * Class for interacting with a node API that is using the node's MetricsApi.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[RESTAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class MetricsAPI extends restapi_1.RESTAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/metrics" as the path to rpc's baseurl
     */
    constructor(core, baseURL = "/ext/metrics") {
        super(core, baseURL);
        this.axConf = () => {
            return {
                baseURL: `${this.core.getProtocol()}://${this.core.getHost()}:${this.core.getPort()}`,
                responseType: "text"
            };
        };
        /**
         *
         * @returns Promise for an object containing the metrics response
         */
        this.getMetrics = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.post("");
            return response.data;
        });
    }
}
exports.MetricsAPI = MetricsAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvbWV0cmljcy9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBS0Esa0RBQThDO0FBSTlDOzs7Ozs7R0FNRztBQUNILE1BQWEsVUFBVyxTQUFRLGlCQUFPO0lBaUJyQzs7Ozs7T0FLRztJQUNILFlBQVksSUFBYyxFQUFFLFVBQWtCLGNBQWM7UUFDMUQsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQXZCWixXQUFNLEdBQUcsR0FBdUIsRUFBRTtZQUMxQyxPQUFPO2dCQUNMLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNyRixZQUFZLEVBQUUsTUFBTTthQUNyQixDQUFBO1FBQ0gsQ0FBQyxDQUFBO1FBRUQ7OztXQUdHO1FBQ0gsZUFBVSxHQUFHLEdBQTBCLEVBQUU7WUFDdkMsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN6RCxPQUFPLFFBQVEsQ0FBQyxJQUFjLENBQUE7UUFDaEMsQ0FBQyxDQUFBLENBQUE7SUFVRCxDQUFDO0NBQ0Y7QUExQkQsZ0NBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1NZXRyaWNzXHJcbiAqL1xyXG5pbXBvcnQgQXhpYUNvcmUgZnJvbSBcIi4uLy4uL2F4aWFcIlxyXG5pbXBvcnQgeyBSRVNUQVBJIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9yZXN0YXBpXCJcclxuaW1wb3J0IHsgUmVxdWVzdFJlc3BvbnNlRGF0YSB9IGZyb20gXCIuLi8uLi9jb21tb24vYXBpYmFzZVwiXHJcbmltcG9ydCB7IEF4aW9zUmVxdWVzdENvbmZpZyB9IGZyb20gXCJheGlvc1wiXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBub2RlIEFQSSB0aGF0IGlzIHVzaW5nIHRoZSBub2RlJ3MgTWV0cmljc0FwaS5cclxuICpcclxuICogQGNhdGVnb3J5IFJQQ0FQSXNcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBleHRlbmRzIHRoZSBbW1JFU1RBUEldXSBjbGFzcy4gVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGRpcmVjdGx5IGNhbGxlZC4gSW5zdGVhZCwgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gZnVuY3Rpb24gdG8gcmVnaXN0ZXIgdGhpcyBpbnRlcmZhY2Ugd2l0aCBBeGlhLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1ldHJpY3NBUEkgZXh0ZW5kcyBSRVNUQVBJIHtcclxuICBwcm90ZWN0ZWQgYXhDb25mID0gKCk6IEF4aW9zUmVxdWVzdENvbmZpZyA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVVJMOiBgJHt0aGlzLmNvcmUuZ2V0UHJvdG9jb2woKX06Ly8ke3RoaXMuY29yZS5nZXRIb3N0KCl9OiR7dGhpcy5jb3JlLmdldFBvcnQoKX1gLFxyXG4gICAgICByZXNwb25zZVR5cGU6IFwidGV4dFwiXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtZXRyaWNzIHJlc3BvbnNlXHJcbiAgICovXHJcbiAgZ2V0TWV0cmljcyA9IGFzeW5jICgpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLnBvc3QoXCJcIilcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhIGFzIHN0cmluZ1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGluc3RhbnRpYXRlZCBkaXJlY3RseS4gSW5zdGVhZCB1c2UgdGhlIFtbQXhpYS5hZGRBUEldXSBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29yZSBBIHJlZmVyZW5jZSB0byB0aGUgQXhpYSBjbGFzc1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMIERlZmF1bHRzIHRvIHRoZSBzdHJpbmcgXCIvZXh0L21ldHJpY3NcIiBhcyB0aGUgcGF0aCB0byBycGMncyBiYXNldXJsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY29yZTogQXhpYUNvcmUsIGJhc2VVUkw6IHN0cmluZyA9IFwiL2V4dC9tZXRyaWNzXCIpIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgfVxyXG59XHJcbiJdfQ==