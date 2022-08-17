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
exports.IndexAPI = void 0;
const jrpcapi_1 = require("../../common/jrpcapi");
/**
 * Class for interacting with a node's IndexAPI.
 *
 * @category RPCAPIs
 *
 * @remarks This extends the [[JRPCAPI]] class. This class should not be directly called. Instead, use the [[Axia.addAPI]] function to register this interface with Axia.
 */
class IndexAPI extends jrpcapi_1.JRPCAPI {
    /**
     * This class should not be instantiated directly. Instead use the [[Axia.addAPI]] method.
     *
     * @param core A reference to the Axia class
     * @param baseURL Defaults to the string "/ext/index/Swap/tx" as the path to rpc's baseURL
     */
    constructor(core, baseURL = "/ext/index/Swap/tx") {
        super(core, baseURL);
        /**
         * Get last accepted tx, vtx or block
         *
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetLastAcceptedResponse.
         */
        this.getLastAccepted = (encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                encoding
            };
            try {
                const response = yield this.callMethod("index.getLastAccepted", params);
                return response.data.result;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Get container by index
         *
         * @param index
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerByIndexResponse.
         */
        this.getContainerByIndex = (index = "0", encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                index,
                encoding
            };
            try {
                const response = yield this.callMethod("index.getContainerByIndex", params);
                return response.data.result;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Get contrainer by ID
         *
         * @param containerID
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerByIDResponse.
         */
        this.getContainerByID = (containerID = "0", encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                containerID,
                encoding
            };
            try {
                const response = yield this.callMethod("index.getContainerByID", params);
                return response.data.result;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Get container range
         *
         * @param startIndex
         * @param numToFetch
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetContainerRangeResponse.
         */
        this.getContainerRange = (startIndex = 0, numToFetch = 100, encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                startIndex,
                numToFetch,
                encoding
            };
            try {
                const response = yield this.callMethod("index.getContainerRange", params);
                return response.data.result;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Get index by containerID
         *
         * @param containerID
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetIndexResponse.
         */
        this.getIndex = (containerID = "", encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                containerID,
                encoding
            };
            try {
                const response = yield this.callMethod("index.getIndex", params);
                return response.data.result.index;
            }
            catch (error) {
                console.log(error);
            }
        });
        /**
         * Check if container is accepted
         *
         * @param containerID
         * @param encoding
         * @param baseURL
         *
         * @returns Returns a Promise GetIsAcceptedResponse.
         */
        this.isAccepted = (containerID = "", encoding = "hex", baseURL = this.getBaseURL()) => __awaiter(this, void 0, void 0, function* () {
            this.setBaseURL(baseURL);
            const params = {
                containerID,
                encoding
            };
            try {
                const response = yield this.callMethod("index.isAccepted", params);
                return response.data.result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.IndexAPI = IndexAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvaW5kZXgvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUtBLGtEQUE4QztBQWdCOUM7Ozs7OztHQU1HO0FBQ0gsTUFBYSxRQUFTLFNBQVEsaUJBQU87SUEyTG5DOzs7OztPQUtHO0lBQ0gsWUFBWSxJQUFjLEVBQUUsVUFBa0Isb0JBQW9CO1FBQ2hFLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFqTXRCOzs7Ozs7O1dBT0c7UUFDSCxvQkFBZSxHQUFHLENBQ2hCLFdBQW1CLEtBQUssRUFDeEIsVUFBa0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUNELEVBQUU7WUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUN4QixNQUFNLE1BQU0sR0FBMEI7Z0JBQ3BDLFFBQVE7YUFDVCxDQUFBO1lBRUQsSUFBSTtnQkFDRixNQUFNLFFBQVEsR0FBd0IsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUN6RCx1QkFBdUIsRUFDdkIsTUFBTSxDQUNQLENBQUE7Z0JBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQTthQUM1QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDbkI7UUFDSCxDQUFDLENBQUEsQ0FBQTtRQUVEOzs7Ozs7OztXQVFHO1FBQ0gsd0JBQW1CLEdBQUcsQ0FDcEIsUUFBZ0IsR0FBRyxFQUNuQixXQUFtQixLQUFLLEVBQ3hCLFVBQWtCLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFDRyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDeEIsTUFBTSxNQUFNLEdBQThCO2dCQUN4QyxLQUFLO2dCQUNMLFFBQVE7YUFDVCxDQUFBO1lBRUQsSUFBSTtnQkFDRixNQUFNLFFB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O2dCQUNELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7YUFDNUI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ25CO1FBQ0gsQ0FBQyxDQUFBLENBQUE7SUFVRCxDQUFDO0NBQ0Y7QUFwTUQsNEJBb01DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1JbmRleFxyXG4gKi9cclxuaW1wb3J0IEF4aWFDb3JlIGZyb20gXCIuLi8uLi9heGlhXCJcclxuaW1wb3J0IHsgSlJQQ0FQSSB9IGZyb20gXCIuLi8uLi9jb21tb24vanJwY2FwaVwiXHJcbmltcG9ydCB7IFJlcXVlc3RSZXNwb25zZURhdGEgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2FwaWJhc2VcIlxyXG5pbXBvcnQge1xyXG4gIEdldExhc3RBY2NlcHRlZFBhcmFtcyxcclxuICBHZXRMYXN0QWNjZXB0ZWRSZXNwb25zZSxcclxuICBHZXRDb250YWluZXJCeUluZGV4UGFyYW1zLFxyXG4gIEdldENvbnRhaW5lckJ5SW5kZXhSZXNwb25zZSxcclxuICBHZXRDb250YWluZXJCeUlEUGFyYW1zLFxyXG4gIEdldENvbnRhaW5lckJ5SURSZXNwb25zZSxcclxuICBHZXRDb250YWluZXJSYW5nZVBhcmFtcyxcclxuICBHZXRDb250YWluZXJSYW5nZVJlc3BvbnNlLFxyXG4gIEdldEluZGV4UGFyYW1zLFxyXG4gIEdldElzQWNjZXB0ZWRQYXJhbXMsXHJcbiAgSXNBY2NlcHRlZFJlc3BvbnNlXHJcbn0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiXHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBub2RlJ3MgSW5kZXhBUEkuXHJcbiAqXHJcbiAqIEBjYXRlZ29yeSBSUENBUElzXHJcbiAqXHJcbiAqIEByZW1hcmtzIFRoaXMgZXh0ZW5kcyB0aGUgW1tKUlBDQVBJXV0gY2xhc3MuIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBkaXJlY3RseSBjYWxsZWQuIEluc3RlYWQsIHVzZSB0aGUgW1tBeGlhLmFkZEFQSV1dIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIHRoaXMgaW50ZXJmYWNlIHdpdGggQXhpYS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBJbmRleEFQSSBleHRlbmRzIEpSUENBUEkge1xyXG4gIC8qKlxyXG4gICAqIEdldCBsYXN0IGFjY2VwdGVkIHR4LCB2dHggb3IgYmxvY2tcclxuICAgKlxyXG4gICAqIEBwYXJhbSBlbmNvZGluZ1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBHZXRMYXN0QWNjZXB0ZWRSZXNwb25zZS5cclxuICAgKi9cclxuICBnZXRMYXN0QWNjZXB0ZWQgPSBhc3luYyAoXHJcbiAgICBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIixcclxuICAgIGJhc2VVUkw6IHN0cmluZyA9IHRoaXMuZ2V0QmFzZVVSTCgpXHJcbiAgKTogUHJvbWlzZTxHZXRMYXN0QWNjZXB0ZWRSZXNwb25zZT4gPT4ge1xyXG4gICAgdGhpcy5zZXRCYXNlVVJMKGJhc2VVUkwpXHJcbiAgICBjb25zdCBwYXJhbXM6IEdldExhc3RBY2NlcHRlZFBhcmFtcyA9IHtcclxuICAgICAgZW5jb2RpbmdcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgICBcImluZGV4LmdldExhc3RBY2NlcHRlZFwiLFxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICApXHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY29udGFpbmVyIGJ5IGluZGV4XHJcbiAgICpcclxuICAgKiBAcGFyYW0gaW5kZXhcclxuICAgKiBAcGFyYW0gZW5jb2RpbmdcclxuICAgKiBAcGFyYW0gYmFzZVVSTFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgUmV0dXJucyBhIFByb21pc2UgR2V0Q29udGFpbmVyQnlJbmRleFJlc3BvbnNlLlxyXG4gICAqL1xyXG4gIGdldENvbnRhaW5lckJ5SW5kZXggPSBhc3luYyAoXHJcbiAgICBpbmRleDogc3RyaW5nID0gXCIwXCIsXHJcbiAgICBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIixcclxuICAgIGJhc2VVUkw6IHN0cmluZyA9IHRoaXMuZ2V0QmFzZVVSTCgpXHJcbiAgKTogUHJvbWlzZTxHZXRDb250YWluZXJCeUluZGV4UmVzcG9uc2U+ID0+IHtcclxuICAgIHRoaXMuc2V0QmFzZVVSTChiYXNlVVJMKVxyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRDb250YWluZXJCeUluZGV4UGFyYW1zID0ge1xyXG4gICAgICBpbmRleCxcclxuICAgICAgZW5jb2RpbmdcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IGF3YWl0IHRoaXMuY2FsbE1ldGhvZChcclxuICAgICAgICBcImluZGV4LmdldENvbnRhaW5lckJ5SW5kZXhcIixcclxuICAgICAgICBwYXJhbXNcclxuICAgICAgKVxyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YS5yZXN1bHRcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGNvbnRyYWluZXIgYnkgSURcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250YWluZXJJRFxyXG4gICAqIEBwYXJhbSBlbmNvZGluZ1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBHZXRDb250YWluZXJCeUlEUmVzcG9uc2UuXHJcbiAgICovXHJcbiAgZ2V0Q29udGFpbmVyQnlJRCA9IGFzeW5jIChcclxuICAgIGNvbnRhaW5lcklEOiBzdHJpbmcgPSBcIjBcIixcclxuICAgIGVuY29kaW5nOiBzdHJpbmcgPSBcImhleFwiLFxyXG4gICAgYmFzZVVSTDogc3RyaW5nID0gdGhpcy5nZXRCYXNlVVJMKClcclxuICApOiBQcm9taXNlPEdldENvbnRhaW5lckJ5SURSZXNwb25zZT4gPT4ge1xyXG4gICAgdGhpcy5zZXRCYXNlVVJMKGJhc2VVUkwpXHJcbiAgICBjb25zdCBwYXJhbXM6IEdldENvbnRhaW5lckJ5SURQYXJhbXMgPSB7XHJcbiAgICAgIGNvbnRhaW5lcklELFxyXG4gICAgICBlbmNvZGluZ1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jYWxsTWV0aG9kKFxyXG4gICAgICAgIFwiaW5kZXguZ2V0Q29udGFpbmVyQnlJRFwiLFxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICApXHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgY29udGFpbmVyIHJhbmdlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhcnRJbmRleFxyXG4gICAqIEBwYXJhbSBudW1Ub0ZldGNoXHJcbiAgICogQHBhcmFtIGVuY29kaW5nXHJcbiAgICogQHBhcmFtIGJhc2VVUkxcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFJldHVybnMgYSBQcm9taXNlIEdldENvbnRhaW5lclJhbmdlUmVzcG9uc2UuXHJcbiAgICovXHJcbiAgZ2V0Q29udGFpbmVyUmFuZ2UgPSBhc3luYyAoXHJcbiAgICBzdGFydEluZGV4OiBudW1iZXIgPSAwLFxyXG4gICAgbnVtVG9GZXRjaDogbnVtYmVyID0gMTAwLFxyXG4gICAgZW5jb2Rpbmc6IHN0cmluZyA9IFwiaGV4XCIsXHJcbiAgICBiYXNlVVJMOiBzdHJpbmcgPSB0aGlzLmdldEJhc2VVUkwoKVxyXG4gICk6IFByb21pc2U8R2V0Q29udGFpbmVyUmFuZ2VSZXNwb25zZVtdPiA9PiB7XHJcbiAgICB0aGlzLnNldEJhc2VVUkwoYmFzZVVSTClcclxuICAgIGNvbnN0IHBhcmFtczogR2V0Q29udGFpbmVyUmFuZ2VQYXJhbXMgPSB7XHJcbiAgICAgIHN0YXJ0SW5kZXgsXHJcbiAgICAgIG51bVRvRmV0Y2gsXHJcbiAgICAgIGVuY29kaW5nXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgICAgXCJpbmRleC5nZXRDb250YWluZXJSYW5nZVwiLFxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICApXHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXQgaW5kZXggYnkgY29udGFpbmVySURcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250YWluZXJJRFxyXG4gICAqIEBwYXJhbSBlbmNvZGluZ1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBHZXRJbmRleFJlc3BvbnNlLlxyXG4gICAqL1xyXG4gIGdldEluZGV4ID0gYXN5bmMgKFxyXG4gICAgY29udGFpbmVySUQ6IHN0cmluZyA9IFwiXCIsXHJcbiAgICBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIixcclxuICAgIGJhc2VVUkw6IHN0cmluZyA9IHRoaXMuZ2V0QmFzZVVSTCgpXHJcbiAgKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICAgIHRoaXMuc2V0QmFzZVVSTChiYXNlVVJMKVxyXG4gICAgY29uc3QgcGFyYW1zOiBHZXRJbmRleFBhcmFtcyA9IHtcclxuICAgICAgY29udGFpbmVySUQsXHJcbiAgICAgIGVuY29kaW5nXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgICAgXCJpbmRleC5nZXRJbmRleFwiLFxyXG4gICAgICAgIHBhcmFtc1xyXG4gICAgICApXHJcbiAgICAgIHJldHVybiByZXNwb25zZS5kYXRhLnJlc3VsdC5pbmRleFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDaGVjayBpZiBjb250YWluZXIgaXMgYWNjZXB0ZWRcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250YWluZXJJRFxyXG4gICAqIEBwYXJhbSBlbmNvZGluZ1xyXG4gICAqIEBwYXJhbSBiYXNlVVJMXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBSZXR1cm5zIGEgUHJvbWlzZSBHZXRJc0FjY2VwdGVkUmVzcG9uc2UuXHJcbiAgICovXHJcbiAgaXNBY2NlcHRlZCA9IGFzeW5jIChcclxuICAgIGNvbnRhaW5lcklEOiBzdHJpbmcgPSBcIlwiLFxyXG4gICAgZW5jb2Rpbmc6IHN0cmluZyA9IFwiaGV4XCIsXHJcbiAgICBiYXNlVVJMOiBzdHJpbmcgPSB0aGlzLmdldEJhc2VVUkwoKVxyXG4gICk6IFByb21pc2U8SXNBY2NlcHRlZFJlc3BvbnNlPiA9PiB7XHJcbiAgICB0aGlzLnNldEJhc2VVUkwoYmFzZVVSTClcclxuICAgIGNvbnN0IHBhcmFtczogR2V0SXNBY2NlcHRlZFBhcmFtcyA9IHtcclxuICAgICAgY29udGFpbmVySUQsXHJcbiAgICAgIGVuY29kaW5nXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcmVzcG9uc2U6IFJlcXVlc3RSZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLmNhbGxNZXRob2QoXHJcbiAgICAgICAgXCJpbmRleC5pc0FjY2VwdGVkXCIsXHJcbiAgICAgICAgcGFyYW1zXHJcbiAgICAgIClcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGEucmVzdWx0XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgY2xhc3Mgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuIEluc3RlYWQgdXNlIHRoZSBbW0F4aWEuYWRkQVBJXV0gbWV0aG9kLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvcmUgQSByZWZlcmVuY2UgdG8gdGhlIEF4aWEgY2xhc3NcclxuICAgKiBAcGFyYW0gYmFzZVVSTCBEZWZhdWx0cyB0byB0aGUgc3RyaW5nIFwiL2V4dC9pbmRleC9Td2FwL3R4XCIgYXMgdGhlIHBhdGggdG8gcnBjJ3MgYmFzZVVSTFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGNvcmU6IEF4aWFDb3JlLCBiYXNlVVJMOiBzdHJpbmcgPSBcIi9leHQvaW5kZXgvU3dhcC90eFwiKSB7XHJcbiAgICBzdXBlcihjb3JlLCBiYXNlVVJMKVxyXG4gIH1cclxufVxyXG4iXX0=