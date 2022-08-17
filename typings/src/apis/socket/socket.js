"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
const utils_1 = require("../../utils");
class Socket extends isomorphic_ws_1.default {
    /**
     * Provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.
     *
     * @param url Defaults to [[MainnetAPI]]
     * @param options Optional
     */
    constructor(url = `wss://${utils_1.MainnetAPI}:443/ext/bc/Swap/events`, options) {
        super(url, options);
    }
    /**
     * Send a message to the server
     *
     * @param data
     * @param cb Optional
     */
    send(data, cb) {
        super.send(data, cb);
    }
    /**
     * Terminates the connection completely
     *
     * @param mcode Optional
     * @param data Optional
     */
    close(mcode, data) {
        super.close(mcode, data);
    }
}
exports.Socket = Socket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvc29ja2V0L3NvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxrRUFBcUM7QUFDckMsdUNBQXdDO0FBQ3hDLE1BQWEsTUFBTyxTQUFRLHVCQUFTO0lBOEJuQzs7Ozs7T0FLRztJQUNILFlBQ0UsTUFFd0IsU0FBUyxrQkFBVSx5QkFBeUIsRUFDcEUsT0FBcUQ7UUFFckQsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBakNEOzs7OztPQUtHO0lBQ0gsSUFBSSxDQUFDLElBQVMsRUFBRSxFQUFRO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFjLEVBQUUsSUFBYTtRQUNqQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0NBZ0JGO0FBNUNELHdCQTRDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBBUEktU29ja2V0XHJcbiAqL1xyXG5pbXBvcnQgeyBDbGllbnRSZXF1ZXN0QXJncyB9IGZyb20gXCJodHRwXCJcclxuaW1wb3J0IFdlYlNvY2tldCBmcm9tIFwiaXNvbW9ycGhpYy13c1wiXHJcbmltcG9ydCB7IE1haW5uZXRBUEkgfSBmcm9tIFwiLi4vLi4vdXRpbHNcIlxyXG5leHBvcnQgY2xhc3MgU29ja2V0IGV4dGVuZHMgV2ViU29ja2V0IHtcclxuICAvLyBGaXJlcyBvbmNlIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIGVzdGFibGlzaGVkIGJldHdlZW4gdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlclxyXG4gIG9ub3BlbjogYW55XHJcbiAgLy8gRmlyZXMgd2hlbiB0aGUgc2VydmVyIHNlbmRzIHNvbWUgZGF0YVxyXG4gIG9ubWVzc2FnZTogYW55XHJcbiAgLy8gRmlyZXMgYWZ0ZXIgZW5kIG9mIHRoZSBjb21tdW5pY2F0aW9uIGJldHdlZW4gc2VydmVyIGFuZCB0aGUgY2xpZW50XHJcbiAgb25jbG9zZTogYW55XHJcbiAgLy8gRmlyZXMgZm9yIHNvbWUgbWlzdGFrZSwgd2hpY2ggaGFwcGVucyBkdXJpbmcgdGhlIGNvbW11bmljYXRpb25cclxuICBvbmVycm9yOiBhbnlcclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlclxyXG4gICAqXHJcbiAgICogQHBhcmFtIGRhdGFcclxuICAgKiBAcGFyYW0gY2IgT3B0aW9uYWxcclxuICAgKi9cclxuICBzZW5kKGRhdGE6IGFueSwgY2I/OiBhbnkpOiB2b2lkIHtcclxuICAgIHN1cGVyLnNlbmQoZGF0YSwgY2IpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUZXJtaW5hdGVzIHRoZSBjb25uZWN0aW9uIGNvbXBsZXRlbHlcclxuICAgKlxyXG4gICAqIEBwYXJhbSBtY29kZSBPcHRpb25hbFxyXG4gICAqIEBwYXJhbSBkYXRhIE9wdGlvbmFsXHJcbiAgICovXHJcbiAgY2xvc2UobWNvZGU/OiBudW1iZXIsIGRhdGE/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHN1cGVyLmNsb3NlKG1jb2RlLCBkYXRhKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUHJvdmlkZXMgdGhlIEFQSSBmb3IgY3JlYXRpbmcgYW5kIG1hbmFnaW5nIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gdG8gYSBzZXJ2ZXIsIGFzIHdlbGwgYXMgZm9yIHNlbmRpbmcgYW5kIHJlY2VpdmluZyBkYXRhIG9uIHRoZSBjb25uZWN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCBEZWZhdWx0cyB0byBbW01haW5uZXRBUEldXVxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICB1cmw6XHJcbiAgICAgIHwgc3RyaW5nXHJcbiAgICAgIHwgaW1wb3J0KFwidXJsXCIpLlVSTCA9IGB3c3M6Ly8ke01haW5uZXRBUEl9OjQ0My9leHQvYmMvU3dhcC9ldmVudHNgLFxyXG4gICAgb3B0aW9ucz86IFdlYlNvY2tldC5DbGllbnRPcHRpb25zIHwgQ2xpZW50UmVxdWVzdEFyZ3NcclxuICApIHtcclxuICAgIHN1cGVyKHVybCwgb3B0aW9ucylcclxuICB9XHJcbn1cclxuIl19