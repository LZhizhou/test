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
const jest_mock_axios_1 = __importDefault(require("jest-mock-axios"));
const src_1 = require("src");
describe("Admin", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345, "What is my purpose? You pass butter. Oh my god.", undefined, undefined, false);
    let admin;
    beforeAll(() => {
        admin = axia.Admin();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("alias", () => __awaiter(void 0, void 0, void 0, function* () {
        const ep = "/ext/something";
        const al = "/ext/anotherthing";
        const result = admin.alias(ep, al);
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
    test("aliasChain", () => __awaiter(void 0, void 0, void 0, function* () {
        const ch = "abcd";
        const al = "myChain";
        const result = admin.aliasChain(ch, al);
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
    test("badAliasChain", () => __awaiter(void 0, void 0, void 0, function* () {
        const ch = 2;
        const al = "myChasdfasdfasain";
        const result = admin.aliasChain(ch, al);
        const payload = {
            result: {
                success: false
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["success"]).toBe(false);
    }));
    test("getChainAliases", () => __awaiter(void 0, void 0, void 0, function* () {
        const ch = "chain";
        const result = admin.getChainAliases(ch);
        const payload = {
            result: {
                aliases: ["alias1", "alias2"]
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(response).toBe(payload.result.aliases);
    }));
    test("getLoggerLevel", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.getLoggerLevel();
        const payload = {
            result: {
                loggerLevels: { AX: { logLevel: "DEBUG", displayLevel: "ERROR" } }
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(response).toBe(payload.result);
    }));
    test("loadVMs", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.loadVMs();
        const payload = {
            result: { newVMs: {} }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(response).toBe(payload.result);
    }));
    test("lockProfile", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.lockProfile();
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
    test("memoryProfile", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.memoryProfile();
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
    test("setLoggerLevel", () => __awaiter(void 0, void 0, void 0, function* () {
        const loggerName = "AX";
        const logLevel = "DEBUG";
        const displayLevel = "INFO";
        const result = admin.setLoggerLevel(loggerName, logLevel, displayLevel);
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(response).toBe(payload.result);
    }));
    test("startCPUProfiler", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.startCPUProfiler();
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
    test("stopCPUProfiler", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = admin.stopCPUProfiler();
        const payload = {
            result: {
                success: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(true);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2FkbWluL2FwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBRXZDLDZCQUEwQjtBQVExQixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtJQUMzQixNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUNoQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FDekIsRUFBRSxFQUNGLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLGlEQUFpRCxFQUNqRCxTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssQ0FDTixDQUFBO0lBQ0QsSUFBSSxLQUFlLENBQUE7SUFFbkIsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQix5QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUF3QixFQUFFO1FBQ3RDLE1BQU0sRUFBRSxHQUFXLGdCQUFnQixDQUFBO1FBQ25DLE1BQU0sRUFBRSxHQUFXLG1CQUFtQixDQUFBO1FBQ3RDLE1BQU0sTUFBTSxHQUFxQixLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNwRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFB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LE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUF3QixFQUFFO1FBQ2hELE1BQU0sTUFBTSxHQUFxQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDeEQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcclxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcclxuaW1wb3J0IHsgQXhpYSB9IGZyb20gXCJzcmNcIlxyXG5pbXBvcnQge1xyXG4gIEdldExvZ2dlckxldmVsUmVzcG9uc2UsXHJcbiAgTG9hZFZNc1Jlc3BvbnNlLFxyXG4gIFNldExvZ2dlckxldmVsUmVzcG9uc2VcclxufSBmcm9tIFwic3JjL2FwaXMvYWRtaW4vaW50ZXJmYWNlc1wiXHJcbmltcG9ydCB7IEFkbWluQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2FkbWluL2FwaVwiXHJcblxyXG5kZXNjcmliZShcIkFkbWluXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxyXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXHJcbiAgY29uc3QgcHJvdG9jb2w6IHN0cmluZyA9IFwiaHR0cHNcIlxyXG4gIGNvbnN0IGF4aWE6IEF4aWEgPSBuZXcgQXhpYShcclxuICAgIGlwLFxyXG4gICAgcG9ydCxcclxuICAgIHByb3RvY29sLFxyXG4gICAgMTIzNDUsXHJcbiAgICBcIldoYXQgaXMgbXkgcHVycG9zZT8gWW91IHBhc3MgYnV0dGVyLiBPaCBteSBnb2QuXCIsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICBmYWxzZVxyXG4gIClcclxuICBsZXQgYWRtaW46IEFkbWluQVBJXHJcblxyXG4gIGJlZm9yZUFsbCgoKTogdm9pZCA9PiB7XHJcbiAgICBhZG1pbiA9IGF4aWEuQWRtaW4oKVxyXG4gIH0pXHJcblxyXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XHJcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJhbGlhc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBlcDogc3RyaW5nID0gXCIvZXh0L3NvbWV0aGluZ1wiXHJcbiAgICBjb25zdCBhbDogc3RyaW5nID0gXCIvZXh0L2Fub3RoZXJ0aGluZ1wiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5hbGlhcyhlcCwgYWwpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHJ1ZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiYWxpYXNDaGFpblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBjaDogc3RyaW5nID0gXCJhYmNkXCJcclxuICAgIGNvbnN0IGFsOiBzdHJpbmcgPSBcIm15Q2hhaW5cIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uYWxpYXNDaGFpbihjaCwgYWwpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHJ1ZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiYmFkQWxpYXNDaGFpblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBjaDogYW55ID0gMlxyXG4gICAgY29uc3QgYWw6IHN0cmluZyA9IFwibXlDaGFzZGZhc2RmYXNhaW5cIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uYWxpYXNDaGFpbihjaCwgYWwpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wic3VjY2Vzc1wiXSkudG9CZShmYWxzZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0Q2hhaW5BbGlhc2VzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGNoOiBzdHJpbmcgPSBcImNoYWluXCJcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhZG1pbi5nZXRDaGFpbkFsaWFzZXMoY2gpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGFsaWFzZXM6IFtcImFsaWFzMVwiLCBcImFsaWFzMlwiXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZC5yZXN1bHQuYWxpYXNlcylcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0TG9nZ2VyTGV2ZWxcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldExvZ2dlckxldmVsUmVzcG9uc2U+ID0gYWRtaW4uZ2V0TG9nZ2VyTGV2ZWwoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBsb2dnZXJMZXZlbHM6IHsgQVg6IHsgbG9nTGV2ZWw6IFwiREVCVUdcIiwgZGlzcGxheUxldmVsOiBcIkVSUk9SXCIgfSB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IEdldExvZ2dlckxldmVsUmVzcG9uc2UgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHBheWxvYWQucmVzdWx0KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJsb2FkVk1zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxMb2FkVk1zUmVzcG9uc2U+ID0gYWRtaW4ubG9hZFZNcygpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogeyBuZXdWTXM6IHt9IH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IExvYWRWTXNSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZC5yZXN1bHQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImxvY2tQcm9maWxlXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGFkbWluLmxvY2tQcm9maWxlKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJtZW1vcnlQcm9maWxlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGFkbWluLm1lbW9yeVByb2ZpbGUoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcInNldExvZ2dlckxldmVsXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGxvZ2dlck5hbWU6IHN0cmluZyA9IFwiQVhcIlxyXG4gICAgY29uc3QgbG9nTGV2ZWw6IHN0cmluZyA9IFwiREVCVUdcIlxyXG4gICAgY29uc3QgZGlzcGxheUxldmVsOiBzdHJpbmcgPSBcIklORk9cIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFNldExvZ2dlckxldmVsUmVzcG9uc2U+ID0gYWRtaW4uc2V0TG9nZ2VyTGV2ZWwoXHJcbiAgICAgIGxvZ2dlck5hbWUsXHJcbiAgICAgIGxvZ0xldmVsLFxyXG4gICAgICBkaXNwbGF5TGV2ZWxcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBTZXRMb2dnZXJMZXZlbFJlc3BvbnNlID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShwYXlsb2FkLnJlc3VsdClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwic3RhcnRDUFVQcm9maWxlclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5zdGFydENQVVByb2ZpbGVyKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJzdG9wQ1BVUHJvZmlsZXJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uc3RvcENQVVByb2ZpbGVyKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==