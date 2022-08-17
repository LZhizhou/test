"use strict";
/**
 * @packageDocumentation
 * @module Common-APIBase
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIBase = exports.RequestResponseData = void 0;
const db_1 = __importDefault(require("../utils/db"));
/**
 * Response data for HTTP requests.
 */
class RequestResponseData {
    constructor(data, headers, status, statusText, request) {
        this.data = data;
        this.headers = headers;
        this.status = status;
        this.statusText = statusText;
        this.request = request;
    }
}
exports.RequestResponseData = RequestResponseData;
/**
 * Abstract class defining a generic endpoint that all endpoints must implement (extend).
 */
class APIBase {
    /**
     *
     * @param core Reference to the Axia instance using this baseURL
     * @param baseURL Path to the baseURL
     */
    constructor(core, baseURL) {
        /**
         * Sets the path of the APIs baseURL.
         *
         * @param baseURL Path of the APIs baseURL - ex: "/ext/bc/Swap"
         */
        this.setBaseURL = (baseURL) => {
            if (this.db && this.baseURL !== baseURL) {
                const backup = this.db.getAll();
                this.db.clearAll();
                this.baseURL = baseURL;
                this.db = db_1.default.getNamespace(baseURL);
                this.db.setAll(backup, true);
            }
            else {
                this.baseURL = baseURL;
                this.db = db_1.default.getNamespace(baseURL);
            }
        };
        /**
         * Returns the baseURL's path.
         */
        this.getBaseURL = () => this.baseURL;
        /**
         * Returns the baseURL's database.
         */
        this.getDB = () => this.db;
        this.core = core;
        this.setBaseURL(baseURL);
    }
}
exports.APIBase = APIBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tb24vYXBpYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7QUFJSCxxREFBNEI7QUFHNUI7O0dBRUc7QUFDSCxNQUFhLG1CQUFtQjtJQUM5QixZQUNTLElBQVMsRUFDVCxPQUFZLEVBQ1osTUFBYyxFQUNkLFVBQWtCLEVBQ2xCLE9BQXVDO1FBSnZDLFNBQUksR0FBSixJQUFJLENBQUs7UUFDVCxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQ1osV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0M7SUFDN0MsQ0FBQztDQUNMO0FBUkQsa0RBUUM7QUFFRDs7R0FFRztBQUNILE1BQXNCLE9BQU87SUFpQzNCOzs7O09BSUc7SUFDSCxZQUFZLElBQWMsRUFBRSxPQUFlO1FBakMzQzs7OztXQUlHO1FBQ0gsZUFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7WUFDL0IsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO2dCQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBO2dCQUMvQixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFBO2dCQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtnQkFDdEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxZQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7YUFDN0I7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7Z0JBQ3RCLElBQUksQ0FBQyxFQUFFLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUNuQztRQUNILENBQUMsQ0FBQTtRQUVEOztXQUVHO1FBQ0gsZUFBVSxHQUFHLEdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUE7UUFFdkM7O1dBRUc7UUFDSCxVQUFLLEdBQUcsR0FBYSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtRQVE3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzFCLENBQUM7Q0FDRjtBQTFDRCwwQkEwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqIEBtb2R1bGUgQ29tbW9uLUFQSUJhc2VcclxuICovXHJcblxyXG5pbXBvcnQgeyBTdG9yZUFQSSB9IGZyb20gXCJzdG9yZTJcIlxyXG5pbXBvcnQgeyBDbGllbnRSZXF1ZXN0IH0gZnJvbSBcImh0dHBcIlxyXG5pbXBvcnQgREIgZnJvbSBcIi4uL3V0aWxzL2RiXCJcclxuaW1wb3J0IEF4aWFDb3JlIGZyb20gXCIuLi9heGlhXCJcclxuXHJcbi8qKlxyXG4gKiBSZXNwb25zZSBkYXRhIGZvciBIVFRQIHJlcXVlc3RzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJlcXVlc3RSZXNwb25zZURhdGEge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGRhdGE6IGFueSxcclxuICAgIHB1YmxpYyBoZWFkZXJzOiBhbnksXHJcbiAgICBwdWJsaWMgc3RhdHVzOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgc3RhdHVzVGV4dDogc3RyaW5nLFxyXG4gICAgcHVibGljIHJlcXVlc3Q6IENsaWVudFJlcXVlc3QgfCBYTUxIdHRwUmVxdWVzdFxyXG4gICkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIEFic3RyYWN0IGNsYXNzIGRlZmluaW5nIGEgZ2VuZXJpYyBlbmRwb2ludCB0aGF0IGFsbCBlbmRwb2ludHMgbXVzdCBpbXBsZW1lbnQgKGV4dGVuZCkuXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQVBJQmFzZSB7XHJcbiAgcHJvdGVjdGVkIGNvcmU6IEF4aWFDb3JlXHJcbiAgcHJvdGVjdGVkIGJhc2VVUkw6IHN0cmluZ1xyXG4gIHByb3RlY3RlZCBkYjogU3RvcmVBUElcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgcGF0aCBvZiB0aGUgQVBJcyBiYXNlVVJMLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJhc2VVUkwgUGF0aCBvZiB0aGUgQVBJcyBiYXNlVVJMIC0gZXg6IFwiL2V4dC9iYy9Td2FwXCJcclxuICAgKi9cclxuICBzZXRCYXNlVVJMID0gKGJhc2VVUkw6IHN0cmluZykgPT4ge1xyXG4gICAgaWYgKHRoaXMuZGIgJiYgdGhpcy5iYXNlVVJMICE9PSBiYXNlVVJMKSB7XHJcbiAgICAgIGNvbnN0IGJhY2t1cCA9IHRoaXMuZGIuZ2V0QWxsKClcclxuICAgICAgdGhpcy5kYi5jbGVhckFsbCgpXHJcbiAgICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkxcclxuICAgICAgdGhpcy5kYiA9IERCLmdldE5hbWVzcGFjZShiYXNlVVJMKVxyXG4gICAgICB0aGlzLmRiLnNldEFsbChiYWNrdXAsIHRydWUpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMXHJcbiAgICAgIHRoaXMuZGIgPSBEQi5nZXROYW1lc3BhY2UoYmFzZVVSTClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGJhc2VVUkwncyBwYXRoLlxyXG4gICAqL1xyXG4gIGdldEJhc2VVUkwgPSAoKTogc3RyaW5nID0+IHRoaXMuYmFzZVVSTFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBiYXNlVVJMJ3MgZGF0YWJhc2UuXHJcbiAgICovXHJcbiAgZ2V0REIgPSAoKTogU3RvcmVBUEkgPT4gdGhpcy5kYlxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb3JlIFJlZmVyZW5jZSB0byB0aGUgQXhpYSBpbnN0YW5jZSB1c2luZyB0aGlzIGJhc2VVUkxcclxuICAgKiBAcGFyYW0gYmFzZVVSTCBQYXRoIHRvIHRoZSBiYXNlVVJMXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoY29yZTogQXhpYUNvcmUsIGJhc2VVUkw6IHN0cmluZykge1xyXG4gICAgdGhpcy5jb3JlID0gY29yZVxyXG4gICAgdGhpcy5zZXRCYXNlVVJMKGJhc2VVUkwpXHJcbiAgfVxyXG59XHJcbiJdfQ==