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
exports.AuthAPI = void 0;
const jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node's AuthAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class AuthAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]]
     * method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/auth" as the path to rpc's baseURL
     */
    constructor(core, baseURL = "/ext/auth") {
        super(core, baseURL);
        /**
         * Creates a new authorization token that grants access to one or more API endpoints.
         *
         * @param password This node's authorization token password, set through the CLI when the node was launched.
         * @param endpoints A list of endpoints that will be accessible using the generated token. If there"s an element that is "*", this token can reach any endpoint.
         *
         * @returns Returns a Promise string containing the authorization token.
         */
        this.newToken = (password, endpoints) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                password,
                endpoints
            };
            const response = yield this.callMethod("auth.newToken", params);
            return response.data.result.token
                ? response.data.result.token
                : response.data.result;
        });
        /**
         * Revokes an authorization token, removing all of its rights to access endpoints.
         *
         * @param password This node's authorization token password, set through the CLI when the node was launched.
         * @param token An authorization token whose access should be revoked.
         *
         * @returns Returns a Promise boolean indicating if a token was successfully revoked.
         */
        this.revokeToken = (password, token) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                password,
                token
            };
            const response = yield this.callMethod("auth.revokeToken", params);
            return response.data.result.success;
        });
        /**
         * Change this node's authorization token password. **Any authorization tokens created under an old password will become invalid.**
         *
         * @param oldPassword This node's authorization token password, set through the CLI when the node was launched.
         * @param newPassword A new password for this node's authorization token issuance.
         *
         * @returns Returns a Promise boolean indicating if the password was successfully changed.
         */
        this.changePassword = (oldPassword, newPassword) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                oldPassword,
                newPassword
            };
            const response = yield this.callMethod("auth.changePassword", params);
            return response.data.result.success;
        });
    }
}
exports.AuthAPI = AuthAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvYXV0aC9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBS0Esa0RBQThDO0FBUzlDOzs7Ozs7R0FNRztBQUNILE1BQWEsT0FBUSxTQUFRLGlCQUFPO0lBcUVsQzs7Ozs7O09BTUc7SUFDSCxZQUFZLElBQWMsRUFBRSxVQUFrQixXQUFXO1FBQ3ZELEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUE1RXRCOzs7Ozs7O1dBT0c7UUFDSCxhQUFRLEdBQUcsQ0FDVCxRQUFnQixFQUNoQixTQUFtQixFQUNvQixFQUFFO1lBQ3pDLE1BQU0sTUFBTSxHQUFzQjtnQkFDaEMsUUFBUTtnQkFDUixTQUFTO2FBQ1YsQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELGVBQWUsRUFDZixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDL0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQzVCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7Ozs7O1dBT0c7UUFDSCxnQkFBVyxHQUFHLENBQU8sUUFBZ0IsRUFBRSxLQUFhLEVBQW9CLEVBQUU7WUFDeEUsTUFBTSxNQUFNLEdBQXlCO2dCQUNuQyxRQUFRO2dCQUNSLEtBQUs7YUFDTixDQUFBO1lBQ0QsTUFBTSxRQUFRLEdBQXdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FDekQsa0JBQWtCLEVBQ2xCLE1BQU0sQ0FDUCxDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUE7UUFDckMsQ0FBQyxDQUFBLENBQUE7UUFFRDs7Ozs7OztXQU9HO1FBQ0gsbUJBQWMsR0FBRyxDQUNmLFdBQW1CLEVBQ25CLFdBQW1CLEVBQ0QsRUFBRTtZQUNwQixNQUFNLE1BQU0sR0FBNEI7Z0JBQ3RDLFdBQVc7Z0JBQ1gsV0FBVzthQUNaLENBQUE7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxxQkFBcUIsRUFDckIsTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUNyQyxDQUFDLENBQUEsQ0FBQTtJQVdELENBQUM7Q0FDRjtBQS9FRCwwQkErRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQVBJLUF1dGhcclxuICovXHJcbmltcG9ydCBBeGlhQ29yZSBmcm9tIFwiLi4vLi4vYXhpYVwiXHJcbmltcG9ydCB7IEpSUENBUEkgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pycGNhcGlcIlxyXG5pbXBvcnQgeyBSZXF1ZXN0UmVzcG9uc2VEYXRhIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9hcGliYXNlXCJcclxuaW1wb3J0IHsgRXJyb3JSZXNwb25zZU9iamVjdCB9IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnNcIlxyXG5pbXBvcnQge1xyXG4gIENoYW5nZVBhc3N3b3JkSW50ZXJmYWNlLFxyXG4gIE5ld1Rva2VuSW50ZXJmYWNlLFxyXG4gIFJldm9rZVRva2VuSW50ZXJmYWNlXHJcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBub2RlJ3MgQXV0aEFQSS5cclxuICpcclxuICogQGNhdGVnb3J5IFJQQ0FQSXNcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBleHRlbmRzIHRoZSBbW0pSUENBUEldXSBjbGFzcy4gVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGRpcmVjdGx5IGNhbGxlZC4gSW5zdGVhZCwgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gZnVuY3Rpb24gdG8gcmVnaXN0ZXIgdGhpcyBpbnRlcmZhY2Ugd2l0aCBBeGlhLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEF1dGhBUEkgZXh0ZW5kcyBKUlBDQVBJIHtcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IGF1dGhvcml6YXRpb24gdG9rZW4gdGhhdCBncmFudHMgYWNjZXNzIHRvIG9uZSBvciBtb3JlIEFQSSBlbmRwb2ludHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhpcyBub2RlJ3MgYXV0aG9yaXphdGlvbiB0b2tlbiBwYXNzd29yZCwgc2V0IHRocm91Z2ggdGhlIENMSSB3aGVuIHRoZSBub2RlIHdhcyBsYXVuY2hlZC5cclxuICAgKiBAcGFyYW0gZW5kcG9pbnRzIEEgbGlzdCBvZiBlbmRwb2ludHMgdGhhdCB3aWxsIGJlIGFjY2Vzc2libGUgdXNpbmcgdGhlIGdlbmVyYXRlZCB0b2tlbi4gSWYgdGhlcmVcInMgYW4gZWxlbWVudCB0aGF0IGlzIFwiKlwiLCB0aGlzIHRva2VuIGNhbiByZWFjaCBhbnkgZW5kcG9pbnQuXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBzdHJpbmcgY29udGFpbmluZyB0aGUgYXV0aG9yaXphdGlvbiB0b2tlbi5cclxuICAgKi9cclxuICBuZXdUb2tlbiA9IGFzeW5jIChcclxuICAgIHBhc3N3b3JkOiBzdHJpbmcsXHJcbiAgICBlbmRwb2ludHM6IHN0cmluZ1tdXHJcbiAgKTogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9PiB7XHJcbiAgICBjb25zdCBwYXJhbXM6IE5ld1Rva2VuSW50ZXJmYWNlID0ge1xyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgZW5kcG9pbnRzXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdXRoLm5ld1Rva2VuXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnRva2VuXHJcbiAgICAgID8gcmVzcG9uc2UuZGF0YS5yZXN1bHQudG9rZW5cclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV2b2tlcyBhbiBhdXRob3JpemF0aW9uIHRva2VuLCByZW1vdmluZyBhbGwgb2YgaXRzIHJpZ2h0cyB0byBhY2Nlc3MgZW5kcG9pbnRzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoaXMgbm9kZSdzIGF1dGhvcml6YXRpb24gdG9rZW4gcGFzc3dvcmQsIHNldCB0aHJvdWdoIHRoZSBDTEkgd2hlbiB0aGUgbm9kZSB3YXMgbGF1bmNoZWQuXHJcbiAgICogQHBhcmFtIHRva2VuIEFuIGF1dGhvcml6YXRpb24gdG9rZW4gd2hvc2UgYWNjZXNzIHNob3VsZCBiZSByZXZva2VkLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIGEgdG9rZW4gd2FzIHN1Y2Nlc3NmdWxseSByZXZva2VkLlxyXG4gICAqL1xyXG4gIHJldm9rZVRva2VuID0gYXN5bmMgKHBhc3N3b3JkOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIGNvbnN0IHBhcmFtczogUmV2b2tlVG9rZW5JbnRlcmZhY2UgPSB7XHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0b2tlblxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwiYXV0aC5yZXZva2VUb2tlblwiLFxyXG4gICAgICBwYXJhbXNcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5zdWNjZXNzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGFuZ2UgdGhpcyBub2RlJ3MgYXV0aG9yaXphdGlvbiB0b2tlbiBwYXNzd29yZC4gKipBbnkgYXV0aG9yaXphdGlvbiB0b2tlbnMgY3JlYXRlZCB1bmRlciBhbiBvbGQgcGFzc3dvcmQgd2lsbCBiZWNvbWUgaW52YWxpZC4qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9sZFBhc3N3b3JkIFRoaXMgbm9kZSdzIGF1dGhvcml6YXRpb24gdG9rZW4gcGFzc3dvcmQsIHNldCB0aHJvdWdoIHRoZSBDTEkgd2hlbiB0aGUgbm9kZSB3YXMgbGF1bmNoZWQuXHJcbiAgICogQHBhcmFtIG5ld1Bhc3N3b3JkIEEgbmV3IHBhc3N3b3JkIGZvciB0aGlzIG5vZGUncyBhdXRob3JpemF0aW9uIHRva2VuIGlzc3VhbmNlLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoZSBwYXNzd29yZCB3YXMgc3VjY2Vzc2Z1bGx5IGNoYW5nZWQuXHJcbiAgICovXHJcbiAgY2hhbmdlUGFzc3dvcmQgPSBhc3luYyAoXHJcbiAgICBvbGRQYXNzd29yZDogc3RyaW5nLFxyXG4gICAgbmV3UGFzc3dvcmQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDaGFuZ2VQYXNzd29yZEludGVyZmFjZSA9IHtcclxuICAgICAgb2xkUGFzc3dvcmQsXHJcbiAgICAgIG5ld1Bhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJhdXRoLmNoYW5nZVBhc3N3b3JkXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuIEluc3RlYWQgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV1cclxuICAgKiBtZXRob2QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29yZSBBIHJlZmVyZW5jZSB0byB0aGUgQXhpYSBjbGFzc1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMIERlZmF1bHRzIHRvIHRoZSBzdHJpbmcgXCIvZXh0L2F1dGhcIiBhcyB0aGUgcGF0aCB0byBycGMncyBiYXNlVVJMXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY29yZTogQXhpYUNvcmUsIGJhc2VVUkw6IHN0cmluZyA9IFwiL2V4dC9hdXRoXCIpIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgfVxyXG59XHJcbiJdfQ==