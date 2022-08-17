"use strict";
/**
 * @packageDocumentation
 * @module Common-JRPCAPI
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JRPCAPI = void 0;
const utils_1 = require("../utils");
const apibase_1 = require("./apibase");
class JRPCAPI extends apibase_1.APIBase {
    /**
     *
     * @param core Reference to the Axia instance using this endpoint
     * @param baseURL Path of the APIs baseURL - ex: "/ext/bc/avm"
     * @param jrpcVersion The jrpc version to use, default "2.0".
     */
    constructor(core, baseURL, jrpcVersion = "2.0") {
        super(core, baseURL);
        this.jrpcVersion = "2.0";
        this.rpcID = 1;
        this.callMethod = (method, params, baseURL, headers) => __awaiter(this, void 0, void 0, function* () {
            const ep = baseURL || this.baseURL;
            const rpc = {};
            rpc.id = this.rpcID;
            rpc.method = method;
            // Set parameters if exists
            if (params) {
                rpc.params = params;
            }
            else if (this.jrpcVersion === "1.0") {
                rpc.params = [];
            }
            if (this.jrpcVersion !== "1.0") {
                rpc.jsonrpc = this.jrpcVersion;
            }
            let headrs = { "Content-Type": "application/json;charset=UTF-8" };
            if (headers) {
                headrs = Object.assign(Object.assign({}, headrs), headers);
            }
            baseURL = this.core.getURL();
            const axConf = {
                baseURL: baseURL,
                responseType: "json",
                // use the fetch adapter if fetch is available e.g. non Node<17 env
                adapter: typeof fetch !== "undefined" ? utils_1.fetchAdapter : undefined
            };
            const resp = yield this.core.post(ep, {}, JSON.stringify(rpc), headrs, axConf);
            if (resp.status >= 200 && resp.status < 300) {
                this.rpcID += 1;
                if (typeof resp.data === "string") {
                    resp.data = JSON.parse(resp.data);
                }
                if (typeof resp.data === "object" &&
                    (resp.data === null || "error" in resp.data)) {
                    throw new Error(resp.data.error.message);
                }
            }
            return resp;
        });
        /**
         * Returns the rpcid, a strictly-increasing number, starting from 1, indicating the next
         * request ID that will be sent.
         */
        this.getRPCID = () => this.rpcID;
        this.jrpcVersion = jrpcVersion;
        this.rpcID = 1;
    }
}
exports.JRPCAPI = JRPCAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianJwY2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vanJwY2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7Ozs7Ozs7QUFHSCxvQ0FBdUM7QUFFdkMsdUNBQXdEO0FBRXhELE1BQWEsT0FBUSxTQUFRLGlCQUFPO0lBb0VsQzs7Ozs7T0FLRztJQUNILFlBQVksSUFBYyxFQUFFLE9BQWUsRUFBRSxjQUFzQixLQUFLO1FBQ3RFLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7UUExRVosZ0JBQVcsR0FBVyxLQUFLLENBQUE7UUFDM0IsVUFBSyxHQUFHLENBQUMsQ0FBQTtRQUVuQixlQUFVLEdBQUcsQ0FDWCxNQUFjLEVBQ2QsTUFBMEIsRUFDMUIsT0FBZ0IsRUFDaEIsT0FBZ0IsRUFDYyxFQUFFO1lBQ2hDLE1BQU0sRUFBRSxHQUFXLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQzFDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQTtZQUNuQixHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7WUFDbkIsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7WUFFbkIsMkJBQTJCO1lBQzNCLElBQUksTUFBTSxFQUFFO2dCQUNWLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO2FBQ3BCO2lCQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7Z0JBQ3JDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBO2FBQ2hCO1lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssRUFBRTtnQkFDOUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO2FBQy9CO1lBRUQsSUFBSSxNQUFNLEdBQVcsRUFBRSxjQUFjLEVBQUUsZ0NBQWdDLEVBQUUsQ0FBQTtZQUN6RSxJQUFJLE9BQU8sRUFBRTtnQkFDWCxNQUFNLG1DQUFRLE1BQU0sR0FBSyxPQUFPLENBQUUsQ0FBQTthQUNuQztZQUVELE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBRTVCLE1BQU0sTUFBTSxHQUF1QjtnQkFDakMsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixtRUFBbUU7Z0JBQ25FLE9BQU8sRUFBRSxPQUFPLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVM7YUFDakUsQ0FBQTtZQUVELE1BQU0sSUFBSSxHQUF3QixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUNwRCxFQUFFLEVBQ0YsRUFBRSxFQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQ25CLE1BQU0sRUFDTixNQUFNLENBQ1AsQ0FBQTtZQUNELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFBO2dCQUNmLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDbEM7Z0JBQ0QsSUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtvQkFDN0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUM1QztvQkFDQSxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUN6QzthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDLENBQUEsQ0FBQTtRQUVEOzs7V0FHRztRQUNILGFBQVEsR0FBRyxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBVWpDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBO0lBQ2hCLENBQUM7Q0FDRjtBQS9FRCwwQkErRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQ29tbW9uLUpSUENBUElcclxuICovXHJcblxyXG5pbXBvcnQgeyBBeGlvc1JlcXVlc3RDb25maWcgfSBmcm9tIFwiYXhpb3NcIlxyXG5pbXBvcnQgeyBmZXRjaEFkYXB0ZXIgfSBmcm9tIFwiLi4vdXRpbHNcIlxyXG5pbXBvcnQgQXhpYUNvcmUgZnJvbSBcIi4uL2F4aWFcIlxyXG5pbXBvcnQgeyBBUElCYXNlLCBSZXF1ZXN0UmVzcG9uc2VEYXRhIH0gZnJvbSBcIi4vYXBpYmFzZVwiXHJcblxyXG5leHBvcnQgY2xhc3MgSlJQQ0FQSSBleHRlbmRzIEFQSUJhc2Uge1xyXG4gIHByb3RlY3RlZCBqcnBjVmVyc2lvbjogc3RyaW5nID0gXCIyLjBcIlxyXG4gIHByb3RlY3RlZCBycGNJRCA9IDFcclxuXHJcbiAgY2FsbE1ldGhvZCA9IGFzeW5jIChcclxuICAgIG1ldGhvZDogc3RyaW5nLFxyXG4gICAgcGFyYW1zPzogb2JqZWN0W10gfCBvYmplY3QsXHJcbiAgICBiYXNlVVJMPzogc3RyaW5nLFxyXG4gICAgaGVhZGVycz86IG9iamVjdFxyXG4gICk6IFByb21pc2U8UmVxdWVzdFJlc3BvbnNlRGF0YT4gPT4ge1xyXG4gICAgY29uc3QgZXA6IHN0cmluZyA9IGJhc2VVUkwgfHwgdGhpcy5iYXNlVVJMXHJcbiAgICBjb25zdCBycGM6IGFueSA9IHt9XHJcbiAgICBycGMuaWQgPSB0aGlzLnJwY0lEXHJcbiAgICBycGMubWV0aG9kID0gbWV0aG9kXHJcblxyXG4gICAgLy8gU2V0IHBhcmFtZXRlcnMgaWYgZXhpc3RzXHJcbiAgICBpZiAocGFyYW1zKSB7XHJcbiAgICAgIHJwYy5wYXJhbXMgPSBwYXJhbXNcclxuICAgIH0gZWxzZSBpZiAodGhpcy5qcnBjVmVyc2lvbiA9PT0gXCIxLjBcIikge1xyXG4gICAgICBycGMucGFyYW1zID0gW11cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5qcnBjVmVyc2lvbiAhPT0gXCIxLjBcIikge1xyXG4gICAgICBycGMuanNvbnJwYyA9IHRoaXMuanJwY1ZlcnNpb25cclxuICAgIH1cclxuXHJcbiAgICBsZXQgaGVhZHJzOiBvYmplY3QgPSB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIgfVxyXG4gICAgaWYgKGhlYWRlcnMpIHtcclxuICAgICAgaGVhZHJzID0geyAuLi5oZWFkcnMsIC4uLmhlYWRlcnMgfVxyXG4gICAgfVxyXG5cclxuICAgIGJhc2VVUkwgPSB0aGlzLmNvcmUuZ2V0VVJMKClcclxuXHJcbiAgICBjb25zdCBheENvbmY6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHtcclxuICAgICAgYmFzZVVSTDogYmFzZVVSTCxcclxuICAgICAgcmVzcG9uc2VUeXBlOiBcImpzb25cIixcclxuICAgICAgLy8gdXNlIHRoZSBmZXRjaCBhZGFwdGVyIGlmIGZldGNoIGlzIGF2YWlsYWJsZSBlLmcuIG5vbiBOb2RlPDE3IGVudlxyXG4gICAgICBhZGFwdGVyOiB0eXBlb2YgZmV0Y2ggIT09IFwidW5kZWZpbmVkXCIgPyBmZXRjaEFkYXB0ZXIgOiB1bmRlZmluZWRcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXNwOiBSZXF1ZXN0UmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5jb3JlLnBvc3QoXHJcbiAgICAgIGVwLFxyXG4gICAgICB7fSxcclxuICAgICAgSlNPTi5zdHJpbmdpZnkocnBjKSxcclxuICAgICAgaGVhZHJzLFxyXG4gICAgICBheENvbmZcclxuICAgIClcclxuICAgIGlmIChyZXNwLnN0YXR1cyA+PSAyMDAgJiYgcmVzcC5zdGF0dXMgPCAzMDApIHtcclxuICAgICAgdGhpcy5ycGNJRCArPSAxXHJcbiAgICAgIGlmICh0eXBlb2YgcmVzcC5kYXRhID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgcmVzcC5kYXRhID0gSlNPTi5wYXJzZShyZXNwLmRhdGEpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKFxyXG4gICAgICAgIHR5cGVvZiByZXNwLmRhdGEgPT09IFwib2JqZWN0XCIgJiZcclxuICAgICAgICAocmVzcC5kYXRhID09PSBudWxsIHx8IFwiZXJyb3JcIiBpbiByZXNwLmRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwLmRhdGEuZXJyb3IubWVzc2FnZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJwY2lkLCBhIHN0cmljdGx5LWluY3JlYXNpbmcgbnVtYmVyLCBzdGFydGluZyBmcm9tIDEsIGluZGljYXRpbmcgdGhlIG5leHRcclxuICAgKiByZXF1ZXN0IElEIHRoYXQgd2lsbCBiZSBzZW50LlxyXG4gICAqL1xyXG4gIGdldFJQQ0lEID0gKCk6IG51bWJlciA9PiB0aGlzLnJwY0lEXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvcmUgUmVmZXJlbmNlIHRvIHRoZSBBeGlhIGluc3RhbmNlIHVzaW5nIHRoaXMgZW5kcG9pbnRcclxuICAgKiBAcGFyYW0gYmFzZVVSTCBQYXRoIG9mIHRoZSBBUElzIGJhc2VVUkwgLSBleDogXCIvZXh0L2JjL2F2bVwiXHJcbiAgICogQHBhcmFtIGpycGNWZXJzaW9uIFRoZSBqcnBjIHZlcnNpb24gdG8gdXNlLCBkZWZhdWx0IFwiMi4wXCIuXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY29yZTogQXhpYUNvcmUsIGJhc2VVUkw6IHN0cmluZywganJwY1ZlcnNpb246IHN0cmluZyA9IFwiMi4wXCIpIHtcclxuICAgIHN1cGVyKGNvcmUsIGJhc2VVUkwpXHJcbiAgICB0aGlzLmpycGNWZXJzaW9uID0ganJwY1ZlcnNpb25cclxuICAgIHRoaXMucnBjSUQgPSAxXHJcbiAgfVxyXG59XHJcbiJdfQ==