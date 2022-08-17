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
exports.KeystoreAPI = void 0;
const jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node API that is using the node's KeystoreAPI.
 *
 * **WARNING**: The KeystoreAPI is to be used by the node-owner as the data is stored locally on the node. Do not trust the root user. If you are not the node-owner, do not use this as your wallet.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class KeystoreAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/keystore" as the path to rpc's baseURL
     */
    constructor(core, baseURL = "/ext/keystore") {
        super(core, baseURL);
        /**
         * Creates a user in the node's database.
         *
         * @param username Name of the user to create
         * @param password Password for the user
         *
         * @returns Promise for a boolean with true on success
         */
        this.createUser = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("keystore.createUser", params);
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Exports a user. The user can be imported to another node with keystore.importUser .
         *
         * @param username The name of the user to export
         * @param password The password of the user to export
         *
         * @returns Promise with a string importable using importUser
         */
        this.exportUser = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("keystore.exportUser", params);
            return response.data.result.user
                ? response.data.result.user
                : response.data.result;
        });
        /**
         * Imports a user file into the node's user database and assigns it to a username.
         *
         * @param username The name the user file should be imported into
         * @param user cb58 serialized string represetning a user"s data
         * @param password The user"s password
         *
         * @returns A promise with a true-value on success.
         */
        this.importUser = (username, user, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                user,
                password
            };
            const response = yield this.callMethod("keystore.importUser", params);
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
        /**
         * Lists the names of all users on the node.
         *
         * @returns Promise of an array with all user names.
         */
        this.listUsers = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callMethod("keystore.listUsers");
            return response.data.result.users;
        });
        /**
         * Deletes a user in the node's database.
         *
         * @param username Name of the user to delete
         * @param password Password for the user
         *
         * @returns Promise for a boolean with true on success
         */
        this.deleteUser = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                username,
                password
            };
            const response = yield this.callMethod("keystore.deleteUser", params);
            return response.data.result.success
                ? response.data.result.success
                : response.data.result;
        });
    }
}
exports.KeystoreAPI = KeystoreAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMva2V5c3RvcmUvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBLGtEQUE4QztBQUs5Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsV0FBWSxTQUFRLGlCQUFPO0lBMkd0Qzs7Ozs7T0FLRztJQUNILFlBQVksSUFBYyxFQUFFLFVBQWtCLGVBQWU7UUFDM0QsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtRQWpIdEI7Ozs7Ozs7V0FPRztRQUNILGVBQVUsR0FBRyxDQUFPLFFBQWdCLEVBQUUsUUFBZ0IsRUFBb0IsRUFBRTtZQUMxRSxNQUFNLE1BQU0sR0FBbUI7Z0JBQzdCLFFBQVE7Z0JBQ1IsUUFBUTthQUNULENBQUE7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxxQkFBcUIsRUFDckIsTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQ2pDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUM5QixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDMUIsQ0FBQyxDQUFBLENBQUE7UUFFRDs7Ozs7OztXQU9HO1FBQ0gsZUFBVSxHQUFHLENBQU8sUUFBZ0IsRUFBRSxRQUFnQixFQUFtQixFQUFFO1lBQ3pFLE1BQU0sTUFBTSxHQUFtQjtnQkFDN0IsUUFBUTtnQkFDUixRQUFRO2FBQ1QsQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHFCQUFxQixFQUNyQixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtnQkFDOUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7Z0JBQzNCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7Ozs7OztXQVFHO1FBQ0gsZUFBVSxHQUFHLENBQ1gsUUFBZ0IsRUFDaEIsSUFBWSxFQUNaLFFBQWdCLEVBQ0UsRUFBRTtZQUNwQixNQUFNLE1BQU0sR0FBcUI7Z0JBQy9CLFFBQVE7Z0JBQ1IsSUFBSTtnQkFDSixRQUFRO2FBQ1QsQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUF3QixNQUFNLElBQUksQ0FBQyxVQUFVLENBQ3pELHFCQUFxQixFQUNyQixNQUFNLENBQ1AsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDakMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQzlCLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUMxQixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSCxjQUFTLEdBQUcsR0FBNEIsRUFBRTtZQUN4QyxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxvQkFBb0IsQ0FDckIsQ0FBQTtZQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQ25DLENBQUMsQ0FBQSxDQUFBO1FBRUQ7Ozs7Ozs7V0FPRztRQUNILGVBQVUsR0FBRyxDQUFPLFFBQWdCLEVBQUUsUUFBZ0IsRUFBb0IsRUFBRTtZQUMxRSxNQUFNLE1BQU0sR0FBbUI7Z0JBQzdCLFFBQVE7Z0JBQ1IsUUFBUTthQUNULENBQUE7WUFDRCxNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCxxQkFBcUIsRUFDckIsTUFBTSxDQUNQLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87Z0JBQ2pDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO2dCQUM5QixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDMUIsQ0FBQyxDQUFBLENBQUE7SUFVRCxDQUFDO0NBQ0Y7QUFwSEQsa0NBb0hDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1LZXlzdG9yZVxyXG4gKi9cclxuaW1wb3J0IEF4aWFDb3JlIGZyb20gXCIuLi8uLi9heGlhXCJcclxuaW1wb3J0IHsgSlJQQ0FQSSB9IGZyb20gXCIuLi8uLi9jb21tb24vanJwY2FwaVwiXHJcbmltcG9ydCB7IFJlcXVlc3RSZXNwb25zZURhdGEgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2FwaWJhc2VcIlxyXG5pbXBvcnQgeyBJbXBvcnRVc2VyUGFyYW1zIH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiXHJcbmltcG9ydCB7IENyZWRzSW50ZXJmYWNlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9pbnRlcmZhY2VzXCJcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIG5vZGUgQVBJIHRoYXQgaXMgdXNpbmcgdGhlIG5vZGUncyBLZXlzdG9yZUFQSS5cclxuICpcclxuICogKipXQVJOSU5HKio6IFRoZSBLZXlzdG9yZUFQSSBpcyB0byBiZSB1c2VkIGJ5IHRoZSBub2RlLW93bmVyIGFzIHRoZSBkYXRhIGlzIHN0b3JlZCBsb2NhbGx5IG9uIHRoZSBub2RlLiBEbyBub3QgdHJ1c3QgdGhlIHJvb3QgdXNlci4gSWYgeW91IGFyZSBub3QgdGhlIG5vZGUtb3duZXIsIGRvIG5vdCB1c2UgdGhpcyBhcyB5b3VyIHdhbGxldC5cclxuICpcclxuICogQGNhdGVnb3J5IFJQQ0FQSXNcclxuICpcclxuICogQHJlbWFya3MgVGhpcyBleHRlbmRzIHRoZSBbW0pSUENBUEldXSBjbGFzcy4gVGhpcyBjbGFzcyBzaG91bGQgbm90IGJlIGRpcmVjdGx5IGNhbGxlZC4gSW5zdGVhZCwgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gZnVuY3Rpb24gdG8gcmVnaXN0ZXIgdGhpcyBpbnRlcmZhY2Ugd2l0aCBBeGlhLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEtleXN0b3JlQVBJIGV4dGVuZHMgSlJQQ0FQSSB7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIHVzZXIgaW4gdGhlIG5vZGUncyBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBOYW1lIG9mIHRoZSB1c2VyIHRvIGNyZWF0ZVxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZCBmb3IgdGhlIHVzZXJcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgYm9vbGVhbiB3aXRoIHRydWUgb24gc3VjY2Vzc1xyXG4gICAqL1xyXG4gIGNyZWF0ZVVzZXIgPSBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVkc0ludGVyZmFjZSA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJrZXlzdG9yZS5jcmVhdGVVc2VyXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC5zdWNjZXNzXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydHMgYSB1c2VyLiBUaGUgdXNlciBjYW4gYmUgaW1wb3J0ZWQgdG8gYW5vdGhlciBub2RlIHdpdGgga2V5c3RvcmUuaW1wb3J0VXNlciAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcm5hbWUgVGhlIG5hbWUgb2YgdGhlIHVzZXIgdG8gZXhwb3J0XHJcbiAgICogQHBhcmFtIHBhc3N3b3JkIFRoZSBwYXNzd29yZCBvZiB0aGUgdXNlciB0byBleHBvcnRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugd2l0aCBhIHN0cmluZyBpbXBvcnRhYmxlIHVzaW5nIGltcG9ydFVzZXJcclxuICAgKi9cclxuICBleHBvcnRVc2VyID0gYXN5bmMgKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVkc0ludGVyZmFjZSA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJrZXlzdG9yZS5leHBvcnRVc2VyXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnVzZXJcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC51c2VyXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEltcG9ydHMgYSB1c2VyIGZpbGUgaW50byB0aGUgbm9kZSdzIHVzZXIgZGF0YWJhc2UgYW5kIGFzc2lnbnMgaXQgdG8gYSB1c2VybmFtZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBUaGUgbmFtZSB0aGUgdXNlciBmaWxlIHNob3VsZCBiZSBpbXBvcnRlZCBpbnRvXHJcbiAgICogQHBhcmFtIHVzZXIgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNldG5pbmcgYSB1c2VyXCJzIGRhdGFcclxuICAgKiBAcGFyYW0gcGFzc3dvcmQgVGhlIHVzZXJcInMgcGFzc3dvcmRcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB3aXRoIGEgdHJ1ZS12YWx1ZSBvbiBzdWNjZXNzLlxyXG4gICAqL1xyXG4gIGltcG9ydFVzZXIgPSBhc3luYyAoXHJcbiAgICB1c2VybmFtZTogc3RyaW5nLFxyXG4gICAgdXNlcjogc3RyaW5nLFxyXG4gICAgcGFzc3dvcmQ6IHN0cmluZ1xyXG4gICk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBJbXBvcnRVc2VyUGFyYW1zID0ge1xyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgdXNlcixcclxuICAgICAgcGFzc3dvcmRcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICBcImtleXN0b3JlLmltcG9ydFVzZXJcIixcclxuICAgICAgcGFyYW1zXHJcbiAgICApXHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHQuc3VjY2Vzc1xyXG4gICAgICA/IHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgOiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdHMgdGhlIG5hbWVzIG9mIGFsbCB1c2VycyBvbiB0aGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2YgYW4gYXJyYXkgd2l0aCBhbGwgdXNlciBuYW1lcy5cclxuICAgKi9cclxuICBsaXN0VXNlcnMgPSBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmdbXT4gPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgIFwia2V5c3RvcmUubGlzdFVzZXJzXCJcclxuICAgIClcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC51c2Vyc1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGVsZXRlcyBhIHVzZXIgaW4gdGhlIG5vZGUncyBkYXRhYmFzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB1c2VybmFtZSBOYW1lIG9mIHRoZSB1c2VyIHRvIGRlbGV0ZVxyXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZCBmb3IgdGhlIHVzZXJcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFByb21pc2UgZm9yIGEgYm9vbGVhbiB3aXRoIHRydWUgb24gc3VjY2Vzc1xyXG4gICAqL1xyXG4gIGRlbGV0ZVVzZXIgPSBhc3luYyAodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4gPT4ge1xyXG4gICAgY29uc3QgcGFyYW1zOiBDcmVkc0ludGVyZmFjZSA9IHtcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgXCJrZXlzdG9yZS5kZWxldGVVc2VyXCIsXHJcbiAgICAgIHBhcmFtc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0LnN1Y2Nlc3NcclxuICAgICAgPyByZXNwb25zZS5kYXRhLnJlc3VsdC5zdWNjZXNzXHJcbiAgICAgIDogcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuIEluc3RlYWQgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvcmUgQSByZWZlcmVuY2UgdG8gdGhlIEF4aWEgY2xhc3NcclxuICAgKiBAcGFyYW0gYmFzZVVSTCBEZWZhdWx0cyB0byB0aGUgc3RyaW5nIFwiL2V4dC9rZXlzdG9yZVwiIGFzIHRoZSBwYXRoIHRvIHJwYydzIGJhc2VVUkxcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihjb3JlOiBBeGlhQ29yZSwgYmFzZVVSTDogc3RyaW5nID0gXCIvZXh0L2tleXN0b3JlXCIpIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgfVxyXG59XHJcbiJdfQ==