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
/**
 * @packageDocumentation
 * @module AxiaCore
 */
const axios_1 = __importDefault(require("axios"));
const apibase_1 = require("./common/apibase");
const errors_1 = require("./utils/errors");
const fetchadapter_1 = require("./utils/fetchadapter");
const helperfunctions_1 = require("./utils/helperfunctions");
/**
 * AxiaCore is middleware for interacting with Axia node RPC APIs.
 *
 * Example usage:
 * ```js
 * let axia = new AxiaCore("127.0.0.1", 80, "https")
 * ```
 *
 *
 */
class AxiaCore {
    /**
     * Creates a new Axia instance. Sets the address and port of the main Axia Client.
     *
     * @param host The hostname to resolve to reach the Axia Client APIs
     * @param port The port to resolve to reach the Axia Client APIs
     * @param protocol The protocol string to use before a "://" in a request, ex: "http", "https", "git", "ws", etc ...
     */
    constructor(host, port, protocol = "http") {
        this.networkID = 0;
        this.hrp = "";
        this.auth = undefined;
        this.headers = {};
        this.requestConfig = {};
        this.apis = {};
        /**
         * Sets the address and port of the main Axia Client.
         *
         * @param host The hostname to resolve to reach the Axia Client RPC APIs.
         * @param port The port to resolve to reach the Axia Client RPC APIs.
         * @param protocol The protocol string to use before a "://" in a request,
         * ex: "http", "https", etc. Defaults to http
         * @param baseEndpoint the base endpoint to reach the Axia Client RPC APIs,
         * ex: "/rpc". Defaults to "/"
         * The following special characters are removed from host and protocol
         * &#,@+()$~%'":*?{} also less than and greater than signs
         */
        this.setAddress = (host, port, protocol = "http", baseEndpoint = "") => {
            host = host.replace(/[&#,@+()$~%'":*?<>{}]/g, "");
            protocol = protocol.replace(/[&#,@+()$~%'":*?<>{}]/g, "");
            const protocols = ["http", "https"];
            if (!protocols.includes(protocol)) {
                /* istanbul ignore next */
                throw new errors_1.ProtocolError("Error - AxiaCore.setAddress: Invalid protocol");
            }
            this.host = host;
            this.port = port;
            this.protocol = protocol;
            this.baseEndpoint = baseEndpoint;
            let url = `${protocol}://${host}`;
            if (port != undefined && typeof port === "number" && port >= 0) {
                url = `${url}:${port}`;
            }
            if (baseEndpoint != undefined &&
                typeof baseEndpoint == "string" &&
                baseEndpoint.length > 0) {
                if (baseEndpoint[0] != "/") {
                    baseEndpoint = `/${baseEndpoint}`;
                }
                url = `${url}${baseEndpoint}`;
            }
            this.url = url;
        };
        /**
         * Returns the protocol such as "http", "https", "git", "ws", etc.
         */
        this.getProtocol = () => this.protocol;
        /**
         * Returns the host for the Axia node.
         */
        this.getHost = () => this.host;
        /**
         * Returns the IP for the Axia node.
         */
        this.getIP = () => this.host;
        /**
         * Returns the port for the Axia node.
         */
        this.getPort = () => this.port;
        /**
         * Returns the base endpoint for the Axia node.
         */
        this.getBaseEndpoint = () => this.baseEndpoint;
        /**
         * Returns the URL of the Axia node (ip + port)
         */
        this.getURL = () => this.url;
        /**
         * Returns the custom headers
         */
        this.getHeaders = () => this.headers;
        /**
         * Returns the custom request config
         */
        this.getRequestConfig = () => this.requestConfig;
        /**
         * Returns the networkID
         */
        this.getNetworkID = () => this.networkID;
        /**
         * Sets the networkID
         */
        this.setNetworkID = (netID) => {
            this.networkID = netID;
            this.hrp = (0, helperfunctions_1.getPreferredHRP)(this.networkID);
        };
        /**
         * Returns the Human-Readable-Part of the network associated with this key.
         *
         * @returns The [[KeyPair]]'s Human-Readable-Part of the network's Bech32 addressing scheme
         */
        this.getHRP = () => this.hrp;
        /**
         * Sets the the Human-Readable-Part of the network associated with this key.
         *
         * @param hrp String for the Human-Readable-Part of Bech32 addresses
         */
        this.setHRP = (hrp) => {
            this.hrp = hrp;
        };
        /**
         * Adds a new custom header to be included with all requests.
         *
         * @param key Header name
         * @param value Header value
         */
        this.setHeader = (key, value) => {
            this.headers[`${key}`] = value;
        };
        /**
         * Removes a previously added custom header.
         *
         * @param key Header name
         */
        this.removeHeader = (key) => {
            delete this.headers[`${key}`];
        };
        /**
         * Removes all headers.
         */
        this.removeAllHeaders = () => {
            for (const prop in this.headers) {
                if (Object.prototype.hasOwnProperty.call(this.headers, prop)) {
                    delete this.headers[`${prop}`];
                }
            }
        };
        /**
         * Adds a new custom config value to be included with all requests.
         *
         * @param key Config name
         * @param value Config value
         */
        this.setRequestConfig = (key, value) => {
            this.requestConfig[`${key}`] = value;
        };
        /**
         * Removes a previously added request config.
         *
         * @param key Header name
         */
        this.removeRequestConfig = (key) => {
            delete this.requestConfig[`${key}`];
        };
        /**
         * Removes all request configs.
         */
        this.removeAllRequestConfigs = () => {
            for (const prop in this.requestConfig) {
                if (Object.prototype.hasOwnProperty.call(this.requestConfig, prop)) {
                    delete this.requestConfig[`${prop}`];
                }
            }
        };
        /**
         * Sets the temporary auth token used for communicating with the node.
         *
         * @param auth A temporary token provided by the node enabling access to the endpoints on the node.
         */
        this.setAuthToken = (auth) => {
            this.auth = auth;
        };
        this._setHeaders = (headers) => {
            if (typeof this.headers === "object") {
                for (const [key, value] of Object.entries(this.headers)) {
                    headers[`${key}`] = value;
                }
            }
            if (typeof this.auth === "string") {
                headers.Authorization = `Bearer ${this.auth}`;
            }
            return headers;
        };
        /**
         * Adds an API to the middleware. The API resolves to a registered blockchain's RPC.
         *
         * In TypeScript:
         * ```js
         * axia.addAPI<MyVMClass>("mychain", MyVMClass, "/ext/bc/mychain")
         * ```
         *
         * In Javascript:
         * ```js
         * axia.addAPI("mychain", MyVMClass, "/ext/bc/mychain")
         * ```
         *
         * @typeparam GA Class of the API being added
         * @param apiName A label for referencing the API in the future
         * @param ConstructorFN A reference to the class which instantiates the API
         * @param baseurl Path to resolve to reach the API
         *
         */
        this.addAPI = (apiName, ConstructorFN, baseurl = undefined, ...args) => {
            if (typeof baseurl === "undefined") {
                this.apis[`${apiName}`] = new ConstructorFN(this, undefined, ...args);
            }
            else {
                this.apis[`${apiName}`] = new ConstructorFN(this, baseurl, ...args);
            }
        };
        /**
         * Retrieves a reference to an API by its apiName label.
         *
         * @param apiName Name of the API to return
         */
        this.api = (apiName) => this.apis[`${apiName}`];
        /**
         * @ignore
         */
        this._request = (xhrmethod, baseurl, getdata, postdata, headers = {}, axiosConfig = undefined) => __awaiter(this, void 0, void 0, function* () {
            let config;
            if (axiosConfig) {
                config = Object.assign(Object.assign({}, axiosConfig), this.requestConfig);
            }
            else {
                config = Object.assign({ baseURL: this.url, responseType: "text" }, this.requestConfig);
            }
            config.url = baseurl;
            config.method = xhrmethod;
            config.headers = headers;
            config.data = postdata;
            config.params = getdata;
            // use the fetch adapter if fetch is available e.g. non Node<17 env
            if (typeof fetch !== "undefined") {
                config.adapter = fetchadapter_1.fetchAdapter;
            }
            const resp = yield axios_1.default.request(config);
            // purging all that is axios
            const xhrdata = new apibase_1.RequestResponseData(resp.data, resp.headers, resp.status, resp.statusText, resp.request);
            return xhrdata;
        });
        /**
         * Makes a GET call to an API.
         *
         * @param baseurl Path to the api
         * @param getdata Object containing the key value pairs sent in GET
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.get = (baseurl, getdata, headers = {}, axiosConfig = undefined) => this._request("GET", baseurl, getdata, {}, this._setHeaders(headers), axiosConfig);
        /**
         * Makes a DELETE call to an API.
         *
         * @param baseurl Path to the API
         * @param getdata Object containing the key value pairs sent in DELETE
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.delete = (baseurl, getdata, headers = {}, axiosConfig = undefined) => this._request("DELETE", baseurl, getdata, {}, this._setHeaders(headers), axiosConfig);
        /**
         * Makes a POST call to an API.
         *
         * @param baseurl Path to the API
         * @param getdata Object containing the key value pairs sent in POST
         * @param postdata Object containing the key value pairs sent in POST
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.post = (baseurl, getdata, postdata, headers = {}, axiosConfig = undefined) => this._request("POST", baseurl, getdata, postdata, this._setHeaders(headers), axiosConfig);
        /**
         * Makes a PUT call to an API.
         *
         * @param baseurl Path to the baseurl
         * @param getdata Object containing the key value pairs sent in PUT
         * @param postdata Object containing the key value pairs sent in PUT
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.put = (baseurl, getdata, postdata, headers = {}, axiosConfig = undefined) => this._request("PUT", baseurl, getdata, postdata, this._setHeaders(headers), axiosConfig);
        /**
         * Makes a PATCH call to an API.
         *
         * @param baseurl Path to the baseurl
         * @param getdata Object containing the key value pairs sent in PATCH
         * @param postdata Object containing the key value pairs sent in PATCH
         * @param parameters Object containing the parameters of the API call
         * @param headers An array HTTP Request Headers
         * @param axiosConfig Configuration for the axios javascript library that will be the
         * foundation for the rest of the parameters
         *
         * @returns A promise for [[RequestResponseData]]
         */
        this.patch = (baseurl, getdata, postdata, headers = {}, axiosConfig = undefined) => this._request("PATCH", baseurl, getdata, postdata, this._setHeaders(headers), axiosConfig);
        if (host != undefined) {
            this.setAddress(host, port, protocol);
        }
    }
}
exports.default = AxiaCore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9heGlhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztHQUdHO0FBQ0gsa0RBQXdFO0FBQ3hFLDhDQUErRDtBQUMvRCwyQ0FBOEM7QUFDOUMsdURBQW1EO0FBQ25ELDZEQUF5RDtBQUV6RDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFxQixRQUFRO0lBa2IzQjs7Ozs7O09BTUc7SUFDSCxZQUFZLElBQWEsRUFBRSxJQUFhLEVBQUUsV0FBbUIsTUFBTTtRQXhiekQsY0FBUyxHQUFXLENBQUMsQ0FBQTtRQUNyQixRQUFHLEdBQVcsRUFBRSxDQUFBO1FBT2hCLFNBQUksR0FBVyxTQUFTLENBQUE7UUFDeEIsWUFBTyxHQUE0QixFQUFFLENBQUE7UUFDckMsa0JBQWEsR0FBdUIsRUFBRSxDQUFBO1FBQ3RDLFNBQUksR0FBNkIsRUFBRSxDQUFBO1FBRTdDOzs7Ozs7Ozs7OztXQVdHO1FBQ0gsZUFBVSxHQUFHLENBQ1gsSUFBWSxFQUNaLElBQVksRUFDWixXQUFtQixNQUFNLEVBQ3pCLGVBQXVCLEVBQUUsRUFDbkIsRUFBRTtZQUNSLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ2pELFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sU0FBUyxHQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNqQywwQkFBMEI7Z0JBQzFCLE1BQU0sSUFBSSxzQkFBYSxDQUFDLCtDQUErQyxDQUFDLENBQUE7YUFDekU7WUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNoQixJQUFJLENBQUMsSUFBSSxHQUFHLElB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QVVELElBQUksSUFBSSxJQUFJLFNBQVMsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDdEM7SUFDSCxDQUFDO0NBQ0Y7QUE5YkQsMkJBOGJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEF4aWFDb3JlXHJcbiAqL1xyXG5pbXBvcnQgYXhpb3MsIHsgQXhpb3NSZXF1ZXN0Q29uZmlnLCBBeGlvc1Jlc3BvbnNlLCBNZXRob2QgfSBmcm9tIFwiYXhpb3NcIlxyXG5pbXBvcnQgeyBBUElCYXNlLCBSZXF1ZXN0UmVzcG9uc2VEYXRhIH0gZnJvbSBcIi4vY29tbW9uL2FwaWJhc2VcIlxyXG5pbXBvcnQgeyBQcm90b2NvbEVycm9yIH0gZnJvbSBcIi4vdXRpbHMvZXJyb3JzXCJcclxuaW1wb3J0IHsgZmV0Y2hBZGFwdGVyIH0gZnJvbSBcIi4vdXRpbHMvZmV0Y2hhZGFwdGVyXCJcclxuaW1wb3J0IHsgZ2V0UHJlZmVycmVkSFJQIH0gZnJvbSBcIi4vdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuXHJcbi8qKlxyXG4gKiBBeGlhQ29yZSBpcyBtaWRkbGV3YXJlIGZvciBpbnRlcmFjdGluZyB3aXRoIEF4aWEgbm9kZSBSUEMgQVBJcy5cclxuICpcclxuICogRXhhbXBsZSB1c2FnZTpcclxuICogYGBganNcclxuICogbGV0IGF4aWEgPSBuZXcgQXhpYUNvcmUoXCIxMjcuMC4wLjFcIiwgODAsIFwiaHR0cHNcIilcclxuICogYGBgXHJcbiAqXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBeGlhQ29yZSB7XHJcbiAgcHJvdGVjdGVkIG5ldHdvcmtJRDogbnVtYmVyID0gMFxyXG4gIHByb3RlY3RlZCBocnA6IHN0cmluZyA9IFwiXCJcclxuICBwcm90ZWN0ZWQgcHJvdG9jb2w6IHN0cmluZ1xyXG4gIHByb3RlY3RlZCBpcDogc3RyaW5nXHJcbiAgcHJvdGVjdGVkIGhvc3Q6IHN0cmluZ1xyXG4gIHByb3RlY3RlZCBwb3J0OiBudW1iZXJcclxuICBwcm90ZWN0ZWQgYmFzZUVuZHBvaW50OiBzdHJpbmdcclxuICBwcm90ZWN0ZWQgdXJsOiBzdHJpbmdcclxuICBwcm90ZWN0ZWQgYXV0aDogc3RyaW5nID0gdW5kZWZpbmVkXHJcbiAgcHJvdGVjdGVkIGhlYWRlcnM6IHsgW2s6IHN0cmluZ106IHN0cmluZyB9ID0ge31cclxuICBwcm90ZWN0ZWQgcmVxdWVzdENvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnID0ge31cclxuICBwcm90ZWN0ZWQgYXBpczogeyBbazogc3RyaW5nXTogQVBJQmFzZSB9ID0ge31cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgYWRkcmVzcyBhbmQgcG9ydCBvZiB0aGUgbWFpbiBBeGlhIENsaWVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBob3N0IFRoZSBob3N0bmFtZSB0byByZXNvbHZlIHRvIHJlYWNoIHRoZSBBeGlhIENsaWVudCBSUEMgQVBJcy5cclxuICAgKiBAcGFyYW0gcG9ydCBUaGUgcG9ydCB0byByZXNvbHZlIHRvIHJlYWNoIHRoZSBBeGlhIENsaWVudCBSUEMgQVBJcy5cclxuICAgKiBAcGFyYW0gcHJvdG9jb2wgVGhlIHByb3RvY29sIHN0cmluZyB0byB1c2UgYmVmb3JlIGEgXCI6Ly9cIiBpbiBhIHJlcXVlc3QsXHJcbiAgICogZXg6IFwiaHR0cFwiLCBcImh0dHBzXCIsIGV0Yy4gRGVmYXVsdHMgdG8gaHR0cFxyXG4gICAqIEBwYXJhbSBiYXNlRW5kcG9pbnQgdGhlIGJhc2UgZW5kcG9pbnQgdG8gcmVhY2ggdGhlIEF4aWEgQ2xpZW50IFJQQyBBUElzLFxyXG4gICAqIGV4OiBcIi9ycGNcIi4gRGVmYXVsdHMgdG8gXCIvXCJcclxuICAgKiBUaGUgZm9sbG93aW5nIHNwZWNpYWwgY2hhcmFjdGVycyBhcmUgcmVtb3ZlZCBmcm9tIGhvc3QgYW5kIHByb3RvY29sXHJcbiAgICogJiMsQCsoKSR+JSdcIjoqP3t9IGFsc28gbGVzcyB0aGFuIGFuZCBncmVhdGVyIHRoYW4gc2lnbnNcclxuICAgKi9cclxuICBzZXRBZGRyZXNzID0gKFxyXG4gICAgaG9zdDogc3RyaW5nLFxyXG4gICAgcG9ydDogbnVtYmVyLFxyXG4gICAgcHJvdG9jb2w6IHN0cmluZyA9IFwiaHR0cFwiLFxyXG4gICAgYmFzZUVuZHBvaW50OiBzdHJpbmcgPSBcIlwiXHJcbiAgKTogdm9pZCA9PiB7XHJcbiAgICBob3N0ID0gaG9zdC5yZXBsYWNlKC9bJiMsQCsoKSR+JSdcIjoqPzw+e31dL2csIFwiXCIpXHJcbiAgICBwcm90b2NvbCA9IHByb3RvY29sLnJlcGxhY2UoL1smIyxAKygpJH4lJ1wiOio/PD57fV0vZywgXCJcIilcclxuICAgIGNvbnN0IHByb3RvY29sczogc3RyaW5nW10gPSBbXCJodHRwXCIsIFwiaHR0cHNcIl1cclxuICAgIGlmICghcHJvdG9jb2xzLmluY2x1ZGVzKHByb3RvY29sKSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICB0aHJvdyBuZXcgUHJvdG9jb2xFcnJvcihcIkVycm9yIC0gQXhpYUNvcmUuc2V0QWRkcmVzczogSW52YWxpZCBwcm90b2NvbFwiKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaG9zdCA9IGhvc3RcclxuICAgIHRoaXMucG9ydCA9IHBvcnRcclxuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbFxyXG4gICAgdGhpcy5iYXNlRW5kcG9pbnQgPSBiYXNlRW5kcG9pbnRcclxuICAgIGxldCB1cmw6IHN0cmluZyA9IGAke3Byb3RvY29sfTovLyR7aG9zdH1gXHJcbiAgICBpZiAocG9ydCAhPSB1bmRlZmluZWQgJiYgdHlwZW9mIHBvcnQgPT09IFwibnVtYmVyXCIgJiYgcG9ydCA+PSAwKSB7XHJcbiAgICAgIHVybCA9IGAke3VybH06JHtwb3J0fWBcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgYmFzZUVuZHBvaW50ICE9IHVuZGVmaW5lZCAmJlxyXG4gICAgICB0eXBlb2YgYmFzZUVuZHBvaW50ID09IFwic3RyaW5nXCIgJiZcclxuICAgICAgYmFzZUVuZHBvaW50Lmxlbmd0aCA+IDBcclxuICAgICkge1xyXG4gICAgICBpZiAoYmFzZUVuZHBvaW50WzBdICE9IFwiL1wiKSB7XHJcbiAgICAgICAgYmFzZUVuZHBvaW50ID0gYC8ke2Jhc2VFbmRwb2ludH1gXHJcbiAgICAgIH1cclxuICAgICAgdXJsID0gYCR7dXJsfSR7YmFzZUVuZHBvaW50fWBcclxuICAgIH1cclxuICAgIHRoaXMudXJsID0gdXJsXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwcm90b2NvbCBzdWNoIGFzIFwiaHR0cFwiLCBcImh0dHBzXCIsIFwiZ2l0XCIsIFwid3NcIiwgZXRjLlxyXG4gICAqL1xyXG4gIGdldFByb3RvY29sID0gKCk6IHN0cmluZyA9PiB0aGlzLnByb3RvY29sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGhvc3QgZm9yIHRoZSBBeGlhIG5vZGUuXHJcbiAgICovXHJcbiAgZ2V0SG9zdCA9ICgpOiBzdHJpbmcgPT4gdGhpcy5ob3N0XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIElQIGZvciB0aGUgQXhpYSBub2RlLlxyXG4gICAqL1xyXG4gIGdldElQID0gKCk6IHN0cmluZyA9PiB0aGlzLmhvc3RcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcG9ydCBmb3IgdGhlIEF4aWEgbm9kZS5cclxuICAgKi9cclxuICBnZXRQb3J0ID0gKCk6IG51bWJlciA9PiB0aGlzLnBvcnRcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgYmFzZSBlbmRwb2ludCBmb3IgdGhlIEF4aWEgbm9kZS5cclxuICAgKi9cclxuICBnZXRCYXNlRW5kcG9pbnQgPSAoKTogc3RyaW5nID0+IHRoaXMuYmFzZUVuZHBvaW50XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIFVSTCBvZiB0aGUgQXhpYSBub2RlIChpcCArIHBvcnQpXHJcbiAgICovXHJcbiAgZ2V0VVJMID0gKCk6IHN0cmluZyA9PiB0aGlzLnVybFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjdXN0b20gaGVhZGVyc1xyXG4gICAqL1xyXG4gIGdldEhlYWRlcnMgPSAoKTogb2JqZWN0ID0+IHRoaXMuaGVhZGVyc1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjdXN0b20gcmVxdWVzdCBjb25maWdcclxuICAgKi9cclxuICBnZXRSZXF1ZXN0Q29uZmlnID0gKCk6IEF4aW9zUmVxdWVzdENvbmZpZyA9PiB0aGlzLnJlcXVlc3RDb25maWdcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbmV0d29ya0lEXHJcbiAgICovXHJcbiAgZ2V0TmV0d29ya0lEID0gKCk6IG51bWJlciA9PiB0aGlzLm5ldHdvcmtJRFxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBuZXR3b3JrSURcclxuICAgKi9cclxuICBzZXROZXR3b3JrSUQgPSAobmV0SUQ6IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgdGhpcy5uZXR3b3JrSUQgPSBuZXRJRFxyXG4gICAgdGhpcy5ocnAgPSBnZXRQcmVmZXJyZWRIUlAodGhpcy5uZXR3b3JrSUQpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBIdW1hbi1SZWFkYWJsZS1QYXJ0IG9mIHRoZSBuZXR3b3JrIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIFRoZSBbW0tleVBhaXJdXSdzIEh1bWFuLVJlYWRhYmxlLVBhcnQgb2YgdGhlIG5ldHdvcmsncyBCZWNoMzIgYWRkcmVzc2luZyBzY2hlbWVcclxuICAgKi9cclxuICBnZXRIUlAgPSAoKTogc3RyaW5nID0+IHRoaXMuaHJwXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHRoZSBIdW1hbi1SZWFkYWJsZS1QYXJ0IG9mIHRoZSBuZXR3b3JrIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBocnAgU3RyaW5nIGZvciB0aGUgSHVtYW4tUmVhZGFibGUtUGFydCBvZiBCZWNoMzIgYWRkcmVzc2VzXHJcbiAgICovXHJcbiAgc2V0SFJQID0gKGhycDogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLmhycCA9IGhycFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIG5ldyBjdXN0b20gaGVhZGVyIHRvIGJlIGluY2x1ZGVkIHdpdGggYWxsIHJlcXVlc3RzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGtleSBIZWFkZXIgbmFtZVxyXG4gICAqIEBwYXJhbSB2YWx1ZSBIZWFkZXIgdmFsdWVcclxuICAgKi9cclxuICBzZXRIZWFkZXIgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgIHRoaXMuaGVhZGVyc1tgJHtrZXl9YF0gPSB2YWx1ZVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhIHByZXZpb3VzbHkgYWRkZWQgY3VzdG9tIGhlYWRlci5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBrZXkgSGVhZGVyIG5hbWVcclxuICAgKi9cclxuICByZW1vdmVIZWFkZXIgPSAoa2V5OiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgIGRlbGV0ZSB0aGlzLmhlYWRlcnNbYCR7a2V5fWBdXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCBoZWFkZXJzLlxyXG4gICAqL1xyXG4gIHJlbW92ZUFsbEhlYWRlcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gdGhpcy5oZWFkZXJzKSB7XHJcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5oZWFkZXJzLCBwcm9wKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmhlYWRlcnNbYCR7cHJvcH1gXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgbmV3IGN1c3RvbSBjb25maWcgdmFsdWUgdG8gYmUgaW5jbHVkZWQgd2l0aCBhbGwgcmVxdWVzdHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ga2V5IENvbmZpZyBuYW1lXHJcbiAgICogQHBhcmFtIHZhbHVlIENvbmZpZyB2YWx1ZVxyXG4gICAqL1xyXG4gIHNldFJlcXVlc3RDb25maWcgPSAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBib29sZWFuKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLnJlcXVlc3RDb25maWdbYCR7a2V5fWBdID0gdmFsdWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYSBwcmV2aW91c2x5IGFkZGVkIHJlcXVlc3QgY29uZmlnLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGtleSBIZWFkZXIgbmFtZVxyXG4gICAqL1xyXG4gIHJlbW92ZVJlcXVlc3RDb25maWcgPSAoa2V5OiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgIGRlbGV0ZSB0aGlzLnJlcXVlc3RDb25maWdbYCR7a2V5fWBdXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCByZXF1ZXN0IGNvbmZpZ3MuXHJcbiAgICovXHJcbiAgcmVtb3ZlQWxsUmVxdWVzdENvbmZpZ3MgPSAoKTogdm9pZCA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gdGhpcy5yZXF1ZXN0Q29uZmlnKSB7XHJcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5yZXF1ZXN0Q29uZmlnLCBwcm9wKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnJlcXVlc3RDb25maWdbYCR7cHJvcH1gXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0ZW1wb3JhcnkgYXV0aCB0b2tlbiB1c2VkIGZvciBjb21tdW5pY2F0aW5nIHdpdGggdGhlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXV0aCBBIHRlbXBvcmFyeSB0b2tlbiBwcm92aWRlZCBieSB0aGUgbm9kZSBlbmFibGluZyBhY2Nlc3MgdG8gdGhlIGVuZHBvaW50cyBvbiB0aGUgbm9kZS5cclxuICAgKi9cclxuICBzZXRBdXRoVG9rZW4gPSAoYXV0aDogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICB0aGlzLmF1dGggPSBhdXRoXHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX3NldEhlYWRlcnMgPSAoaGVhZGVyczogYW55KTogYW55ID0+IHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5oZWFkZXJzID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuaGVhZGVycykpIHtcclxuICAgICAgICBoZWFkZXJzW2Ake2tleX1gXSA9IHZhbHVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuYXV0aCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dGhpcy5hdXRofWBcclxuICAgIH1cclxuICAgIHJldHVybiBoZWFkZXJzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGFuIEFQSSB0byB0aGUgbWlkZGxld2FyZS4gVGhlIEFQSSByZXNvbHZlcyB0byBhIHJlZ2lzdGVyZWQgYmxvY2tjaGFpbidzIFJQQy5cclxuICAgKlxyXG4gICAqIEluIFR5cGVTY3JpcHQ6XHJcbiAgICogYGBganNcclxuICAgKiBheGlhLmFkZEFQSTxNeVZNQ2xhc3M+KFwibXljaGFpblwiLCBNeVZNQ2xhc3MsIFwiL2V4dC9iYy9teWNoYWluXCIpXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBJbiBKYXZhc2NyaXB0OlxyXG4gICAqIGBgYGpzXHJcbiAgICogYXhpYS5hZGRBUEkoXCJteWNoYWluXCIsIE15Vk1DbGFzcywgXCIvZXh0L2JjL215Y2hhaW5cIilcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIEB0eXBlcGFyYW0gR0EgQ2xhc3Mgb2YgdGhlIEFQSSBiZWluZyBhZGRlZFxyXG4gICAqIEBwYXJhbSBhcGlOYW1lIEEgbGFiZWwgZm9yIHJlZmVyZW5jaW5nIHRoZSBBUEkgaW4gdGhlIGZ1dHVyZVxyXG4gICAqIEBwYXJhbSBDb25zdHJ1Y3RvckZOIEEgcmVmZXJlbmNlIHRvIHRoZSBjbGFzcyB3aGljaCBpbnN0YW50aWF0ZXMgdGhlIEFQSVxyXG4gICAqIEBwYXJhbSBiYXNldXJsIFBhdGggdG8gcmVzb2x2ZSB0byByZWFjaCB0aGUgQVBJXHJcbiAgICpcclxuICAgKi9cclxuICBhZGRBUEkgPSA8R0EgZXh0ZW5kcyBBUElCYXNlPihcclxuICAgIGFwaU5hbWU6IHN0cmluZyxcclxuICAgIENvbnN0cnVjdG9yRk46IG5ldyAoYXhjOiBBeGlhQ29yZSwgYmFzZXVybD86IHN0cmluZywgLi4uYXJnczogYW55W10pID0+IEdBLFxyXG4gICAgYmFzZXVybDogc3RyaW5nID0gdW5kZWZpbmVkLFxyXG4gICAgLi4uYXJnczogYW55W11cclxuICApID0+IHtcclxuICAgIGlmICh0eXBlb2YgYmFzZXVybCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICB0aGlzLmFwaXNbYCR7YXBpTmFtZX1gXSA9IG5ldyBDb25zdHJ1Y3RvckZOKHRoaXMsIHVuZGVmaW5lZCwgLi4uYXJncylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYXBpc1tgJHthcGlOYW1lfWBdID0gbmV3IENvbnN0cnVjdG9yRk4odGhpcywgYmFzZXVybCwgLi4uYXJncylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhIHJlZmVyZW5jZSB0byBhbiBBUEkgYnkgaXRzIGFwaU5hbWUgbGFiZWwuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYXBpTmFtZSBOYW1lIG9mIHRoZSBBUEkgdG8gcmV0dXJuXHJcbiAgICovXHJcbiAgYXBpID0gPEdBIGV4dGVuZHMgQVBJQmFzZT4oYXBpTmFtZTogc3RyaW5nKTogR0EgPT5cclxuICAgIHRoaXMuYXBpc1tgJHthcGlOYW1lfWBdIGFzIEdBXHJcblxyXG4gIC8qKlxyXG4gICAqIEBpZ25vcmVcclxuICAgKi9cclxuICBwcm90ZWN0ZWQgX3JlcXVlc3QgPSBhc3luYyAoXHJcbiAgICB4aHJtZXRob2Q6IE1ldGhvZCxcclxuICAgIGJhc2V1cmw6IHN0cmluZyxcclxuICAgIGdldGRhdGE6IG9iamVjdCxcclxuICAgIHBvc3RkYXRhOiBzdHJpbmcgfCBvYmplY3QgfCBBcnJheUJ1ZmZlciB8IEFycmF5QnVmZmVyVmlldyxcclxuICAgIGhlYWRlcnM6IGFueSA9IHt9LFxyXG4gICAgYXhpb3NDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHVuZGVmaW5lZFxyXG4gICk6IFByb21pc2U8UmVxdWVzdFJlc3BvbnNlRGF0YT4gPT4ge1xyXG4gICAgbGV0IGNvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnXHJcbiAgICBpZiAoYXhpb3NDb25maWcpIHtcclxuICAgICAgY29uZmlnID0ge1xyXG4gICAgICAgIC4uLmF4aW9zQ29uZmlnLFxyXG4gICAgICAgIC4uLnRoaXMucmVxdWVzdENvbmZpZ1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25maWcgPSB7XHJcbiAgICAgICAgYmFzZVVSTDogdGhpcy51cmwsXHJcbiAgICAgICAgcmVzcG9uc2VUeXBlOiBcInRleHRcIixcclxuICAgICAgICAuLi50aGlzLnJlcXVlc3RDb25maWdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uZmlnLnVybCA9IGJhc2V1cmxcclxuICAgIGNvbmZpZy5tZXRob2QgPSB4aHJtZXRob2RcclxuICAgIGNvbmZpZy5oZWFkZXJzID0gaGVhZGVyc1xyXG4gICAgY29uZmlnLmRhdGEgPSBwb3N0ZGF0YVxyXG4gICAgY29uZmlnLnBhcmFtcyA9IGdldGRhdGFcclxuICAgIC8vIHVzZSB0aGUgZmV0Y2ggYWRhcHRlciBpZiBmZXRjaCBpcyBhdmFpbGFibGUgZS5nLiBub24gTm9kZTwxNyBlbnZcclxuICAgIGlmICh0eXBlb2YgZmV0Y2ggIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgY29uZmlnLmFkYXB0ZXIgPSBmZXRjaEFkYXB0ZXJcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3A6IEF4aW9zUmVzcG9uc2U8YW55PiA9IGF3YWl0IGF4aW9zLnJlcXVlc3QoY29uZmlnKVxyXG4gICAgLy8gcHVyZ2luZyBhbGwgdGhhdCBpcyBheGlvc1xyXG4gICAgY29uc3QgeGhyZGF0YTogUmVxdWVzdFJlc3BvbnNlRGF0YSA9IG5ldyBSZXF1ZXN0UmVzcG9uc2VEYXRhKFxyXG4gICAgICByZXNwLmRhdGEsXHJcbiAgICAgIHJlc3AuaGVhZGVycyxcclxuICAgICAgcmVzcC5zdGF0dXMsXHJcbiAgICAgIHJlc3Auc3RhdHVzVGV4dCxcclxuICAgICAgcmVzcC5yZXF1ZXN0XHJcbiAgICApXHJcbiAgICByZXR1cm4geGhyZGF0YVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZXMgYSBHRVQgY2FsbCB0byBhbiBBUEkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYmFzZXVybCBQYXRoIHRvIHRoZSBhcGlcclxuICAgKiBAcGFyYW0gZ2V0ZGF0YSBPYmplY3QgY29udGFpbmluZyB0aGUga2V5IHZhbHVlIHBhaXJzIHNlbnQgaW4gR0VUXHJcbiAgICogQHBhcmFtIGhlYWRlcnMgQW4gYXJyYXkgSFRUUCBSZXF1ZXN0IEhlYWRlcnNcclxuICAgKiBAcGFyYW0gYXhpb3NDb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIGF4aW9zIGphdmFzY3JpcHQgbGlicmFyeSB0aGF0IHdpbGwgYmUgdGhlXHJcbiAgICogZm91bmRhdGlvbiBmb3IgdGhlIHJlc3Qgb2YgdGhlIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBmb3IgW1tSZXF1ZXN0UmVzcG9uc2VEYXRhXV1cclxuICAgKi9cclxuICBnZXQgPSAoXHJcbiAgICBiYXNldXJsOiBzdHJpbmcsXHJcbiAgICBnZXRkYXRhOiBvYmplY3QsXHJcbiAgICBoZWFkZXJzOiBvYmplY3QgPSB7fSxcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcgPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPFJlcXVlc3RSZXNwb25zZURhdGE+ID0+XHJcbiAgICB0aGlzLl9yZXF1ZXN0KFxyXG4gICAgICBcIkdFVFwiLFxyXG4gICAgICBiYXNldXJsLFxyXG4gICAgICBnZXRkYXRhLFxyXG4gICAgICB7fSxcclxuICAgICAgdGhpcy5fc2V0SGVhZGVycyhoZWFkZXJzKSxcclxuICAgICAgYXhpb3NDb25maWdcclxuICAgIClcclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZXMgYSBERUxFVEUgY2FsbCB0byBhbiBBUEkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYmFzZXVybCBQYXRoIHRvIHRoZSBBUElcclxuICAgKiBAcGFyYW0gZ2V0ZGF0YSBPYmplY3QgY29udGFpbmluZyB0aGUga2V5IHZhbHVlIHBhaXJzIHNlbnQgaW4gREVMRVRFXHJcbiAgICogQHBhcmFtIGhlYWRlcnMgQW4gYXJyYXkgSFRUUCBSZXF1ZXN0IEhlYWRlcnNcclxuICAgKiBAcGFyYW0gYXhpb3NDb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIGF4aW9zIGphdmFzY3JpcHQgbGlicmFyeSB0aGF0IHdpbGwgYmUgdGhlXHJcbiAgICogZm91bmRhdGlvbiBmb3IgdGhlIHJlc3Qgb2YgdGhlIHBhcmFtZXRlcnNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBmb3IgW1tSZXF1ZXN0UmVzcG9uc2VEYXRhXV1cclxuICAgKi9cclxuICBkZWxldGUgPSAoXHJcbiAgICBiYXNldXJsOiBzdHJpbmcsXHJcbiAgICBnZXRkYXRhOiBvYmplY3QsXHJcbiAgICBoZWFkZXJzOiBvYmplY3QgPSB7fSxcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcgPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPFJlcXVlc3RSZXNwb25zZURhdGE+ID0+XHJcbiAgICB0aGlzLl9yZXF1ZXN0KFxyXG4gICAgICBcIkRFTEVURVwiLFxyXG4gICAgICBiYXNldXJsLFxyXG4gICAgICBnZXRkYXRhLFxyXG4gICAgICB7fSxcclxuICAgICAgdGhpcy5fc2V0SGVhZGVycyhoZWFkZXJzKSxcclxuICAgICAgYXhpb3NDb25maWdcclxuICAgIClcclxuXHJcbiAgLyoqXHJcbiAgICogTWFrZXMgYSBQT1NUIGNhbGwgdG8gYW4gQVBJLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJhc2V1cmwgUGF0aCB0byB0aGUgQVBJXHJcbiAgICogQHBhcmFtIGdldGRhdGEgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleSB2YWx1ZSBwYWlycyBzZW50IGluIFBPU1RcclxuICAgKiBAcGFyYW0gcG9zdGRhdGEgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleSB2YWx1ZSBwYWlycyBzZW50IGluIFBPU1RcclxuICAgKiBAcGFyYW0gaGVhZGVycyBBbiBhcnJheSBIVFRQIFJlcXVlc3QgSGVhZGVyc1xyXG4gICAqIEBwYXJhbSBheGlvc0NvbmZpZyBDb25maWd1cmF0aW9uIGZvciB0aGUgYXhpb3MgamF2YXNjcmlwdCBsaWJyYXJ5IHRoYXQgd2lsbCBiZSB0aGVcclxuICAgKiBmb3VuZGF0aW9uIGZvciB0aGUgcmVzdCBvZiB0aGUgcGFyYW1ldGVyc1xyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSBwcm9taXNlIGZvciBbW1JlcXVlc3RSZXNwb25zZURhdGFdXVxyXG4gICAqL1xyXG4gIHBvc3QgPSAoXHJcbiAgICBiYXNldXJsOiBzdHJpbmcsXHJcbiAgICBnZXRkYXRhOiBvYmplY3QsXHJcbiAgICBwb3N0ZGF0YTogc3RyaW5nIHwgb2JqZWN0IHwgQXJyYXlCdWZmZXIgfCBBcnJheUJ1ZmZlclZpZXcsXHJcbiAgICBoZWFkZXJzOiBvYmplY3QgPSB7fSxcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcgPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPFJlcXVlc3RSZXNwb25zZURhdGE+ID0+XHJcbiAgICB0aGlzLl9yZXF1ZXN0KFxyXG4gICAgICBcIlBPU1RcIixcclxuICAgICAgYmFzZXVybCxcclxuICAgICAgZ2V0ZGF0YSxcclxuICAgICAgcG9zdGRhdGEsXHJcbiAgICAgIHRoaXMuX3NldEhlYWRlcnMoaGVhZGVycyksXHJcbiAgICAgIGF4aW9zQ29uZmlnXHJcbiAgICApXHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2VzIGEgUFVUIGNhbGwgdG8gYW4gQVBJLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJhc2V1cmwgUGF0aCB0byB0aGUgYmFzZXVybFxyXG4gICAqIEBwYXJhbSBnZXRkYXRhIE9iamVjdCBjb250YWluaW5nIHRoZSBrZXkgdmFsdWUgcGFpcnMgc2VudCBpbiBQVVRcclxuICAgKiBAcGFyYW0gcG9zdGRhdGEgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleSB2YWx1ZSBwYWlycyBzZW50IGluIFBVVFxyXG4gICAqIEBwYXJhbSBoZWFkZXJzIEFuIGFycmF5IEhUVFAgUmVxdWVzdCBIZWFkZXJzXHJcbiAgICogQHBhcmFtIGF4aW9zQ29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBheGlvcyBqYXZhc2NyaXB0IGxpYnJhcnkgdGhhdCB3aWxsIGJlIHRoZVxyXG4gICAqIGZvdW5kYXRpb24gZm9yIHRoZSByZXN0IG9mIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgZm9yIFtbUmVxdWVzdFJlc3BvbnNlRGF0YV1dXHJcbiAgICovXHJcbiAgcHV0ID0gKFxyXG4gICAgYmFzZXVybDogc3RyaW5nLFxyXG4gICAgZ2V0ZGF0YTogb2JqZWN0LFxyXG4gICAgcG9zdGRhdGE6IHN0cmluZyB8IG9iamVjdCB8IEFycmF5QnVmZmVyIHwgQXJyYXlCdWZmZXJWaWV3LFxyXG4gICAgaGVhZGVyczogb2JqZWN0ID0ge30sXHJcbiAgICBheGlvc0NvbmZpZzogQXhpb3NSZXF1ZXN0Q29uZmlnID0gdW5kZWZpbmVkXHJcbiAgKTogUHJvbWlzZTxSZXF1ZXN0UmVzcG9uc2VEYXRhPiA9PlxyXG4gICAgdGhpcy5fcmVxdWVzdChcclxuICAgICAgXCJQVVRcIixcclxuICAgICAgYmFzZXVybCxcclxuICAgICAgZ2V0ZGF0YSxcclxuICAgICAgcG9zdGRhdGEsXHJcbiAgICAgIHRoaXMuX3NldEhlYWRlcnMoaGVhZGVycyksXHJcbiAgICAgIGF4aW9zQ29uZmlnXHJcbiAgICApXHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2VzIGEgUEFUQ0ggY2FsbCB0byBhbiBBUEkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYmFzZXVybCBQYXRoIHRvIHRoZSBiYXNldXJsXHJcbiAgICogQHBhcmFtIGdldGRhdGEgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleSB2YWx1ZSBwYWlycyBzZW50IGluIFBBVENIXHJcbiAgICogQHBhcmFtIHBvc3RkYXRhIE9iamVjdCBjb250YWluaW5nIHRoZSBrZXkgdmFsdWUgcGFpcnMgc2VudCBpbiBQQVRDSFxyXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJzIE9iamVjdCBjb250YWluaW5nIHRoZSBwYXJhbWV0ZXJzIG9mIHRoZSBBUEkgY2FsbFxyXG4gICAqIEBwYXJhbSBoZWFkZXJzIEFuIGFycmF5IEhUVFAgUmVxdWVzdCBIZWFkZXJzXHJcbiAgICogQHBhcmFtIGF4aW9zQ29uZmlnIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBheGlvcyBqYXZhc2NyaXB0IGxpYnJhcnkgdGhhdCB3aWxsIGJlIHRoZVxyXG4gICAqIGZvdW5kYXRpb24gZm9yIHRoZSByZXN0IG9mIHRoZSBwYXJhbWV0ZXJzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgZm9yIFtbUmVxdWVzdFJlc3BvbnNlRGF0YV1dXHJcbiAgICovXHJcbiAgcGF0Y2ggPSAoXHJcbiAgICBiYXNldXJsOiBzdHJpbmcsXHJcbiAgICBnZXRkYXRhOiBvYmplY3QsXHJcbiAgICBwb3N0ZGF0YTogc3RyaW5nIHwgb2JqZWN0IHwgQXJyYXlCdWZmZXIgfCBBcnJheUJ1ZmZlclZpZXcsXHJcbiAgICBoZWFkZXJzOiBvYmplY3QgPSB7fSxcclxuICAgIGF4aW9zQ29uZmlnOiBBeGlvc1JlcXVlc3RDb25maWcgPSB1bmRlZmluZWRcclxuICApOiBQcm9taXNlPFJlcXVlc3RSZXNwb25zZURhdGE+ID0+XHJcbiAgICB0aGlzLl9yZXF1ZXN0KFxyXG4gICAgICBcIlBBVENIXCIsXHJcbiAgICAgIGJhc2V1cmwsXHJcbiAgICAgIGdldGRhdGEsXHJcbiAgICAgIHBvc3RkYXRhLFxyXG4gICAgICB0aGlzLl9zZXRIZWFkZXJzKGhlYWRlcnMpLFxyXG4gICAgICBheGlvc0NvbmZpZ1xyXG4gICAgKVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IEF4aWEgaW5zdGFuY2UuIFNldHMgdGhlIGFkZHJlc3MgYW5kIHBvcnQgb2YgdGhlIG1haW4gQXhpYSBDbGllbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaG9zdCBUaGUgaG9zdG5hbWUgdG8gcmVzb2x2ZSB0byByZWFjaCB0aGUgQXhpYSBDbGllbnQgQVBJc1xyXG4gICAqIEBwYXJhbSBwb3J0IFRoZSBwb3J0IHRvIHJlc29sdmUgdG8gcmVhY2ggdGhlIEF4aWEgQ2xpZW50IEFQSXNcclxuICAgKiBAcGFyYW0gcHJvdG9jb2wgVGhlIHByb3RvY29sIHN0cmluZyB0byB1c2UgYmVmb3JlIGEgXCI6Ly9cIiBpbiBhIHJlcXVlc3QsIGV4OiBcImh0dHBcIiwgXCJodHRwc1wiLCBcImdpdFwiLCBcIndzXCIsIGV0YyAuLi5cclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihob3N0Pzogc3RyaW5nLCBwb3J0PzogbnVtYmVyLCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwXCIpIHtcclxuICAgIGlmIChob3N0ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLnNldEFkZHJlc3MoaG9zdCwgcG9ydCwgcHJvdG9jb2wpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==