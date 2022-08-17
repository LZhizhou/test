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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2FkbWluL2FwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBRXZDLDZCQUEwQjtBQVExQixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtJQUMzQixNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUNoQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FDekIsRUFBRSxFQUNGLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLGlEQUFpRCxFQUNqRCxTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssQ0FDTixDQUFBO0lBQ0QsSUFBSSxLQUFlLENBQUE7SUFFbkIsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQix5QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUF3QixFQUFFO1FBQ3RDLE1BQU0sRUFBRSxHQUFXLGdCQUFnQixDQUFBO1FBQ25DLE1BQU0sRUFBRSxHQUFXLG1CQUFtQixDQUFBO1FBQ3RDLE1BQU0sTUFBTSxHQUFxQixLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNwRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFB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LE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUF3QixFQUFFO1FBQ2hELE1BQU0sTUFBTSxHQUFxQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDeEQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXG5pbXBvcnQgeyBBeGlhIH0gZnJvbSBcInNyY1wiXG5pbXBvcnQge1xuICBHZXRMb2dnZXJMZXZlbFJlc3BvbnNlLFxuICBMb2FkVk1zUmVzcG9uc2UsXG4gIFNldExvZ2dlckxldmVsUmVzcG9uc2Vcbn0gZnJvbSBcInNyYy9hcGlzL2FkbWluL2ludGVyZmFjZXNcIlxuaW1wb3J0IHsgQWRtaW5BUEkgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYWRtaW4vYXBpXCJcblxuZGVzY3JpYmUoXCJBZG1pblwiLCAoKTogdm9pZCA9PiB7XG4gIGNvbnN0IGlwOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxuICAgIGlwLFxuICAgIHBvcnQsXG4gICAgcHJvdG9jb2wsXG4gICAgMTIzNDUsXG4gICAgXCJXaGF0IGlzIG15IHB1cnBvc2U/IFlvdSBwYXNzIGJ1dHRlci4gT2ggbXkgZ29kLlwiLFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWQsXG4gICAgZmFsc2VcbiAgKVxuICBsZXQgYWRtaW46IEFkbWluQVBJXG5cbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcbiAgICBhZG1pbiA9IGF4aWEuQWRtaW4oKVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XG4gICAgbW9ja0F4aW9zLnJlc2V0KClcbiAgfSlcblxuICB0ZXN0KFwiYWxpYXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGVwOiBzdHJpbmcgPSBcIi9leHQvc29tZXRoaW5nXCJcbiAgICBjb25zdCBhbDogc3RyaW5nID0gXCIvZXh0L2Fub3RoZXJ0aGluZ1wiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uYWxpYXMoZXAsIGFsKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICB0ZXN0KFwiYWxpYXNDaGFpblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2g6IHN0cmluZyA9IFwiYWJjZFwiXG4gICAgY29uc3QgYWw6IHN0cmluZyA9IFwibXlDaGFpblwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uYWxpYXNDaGFpbihjaCwgYWwpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJiYWRBbGlhc0NoYWluXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBjaDogYW55ID0gMlxuICAgIGNvbnN0IGFsOiBzdHJpbmcgPSBcIm15Q2hhc2RmYXNkZmFzYWluXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5hbGlhc0NoYWluKGNoLCBhbClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZVtcInN1Y2Nlc3NcIl0pLnRvQmUoZmFsc2UpXG4gIH0pXG5cbiAgdGVzdChcImdldENoYWluQWxpYXNlc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgY2g6IHN0cmluZyA9IFwiY2hhaW5cIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhZG1pbi5nZXRDaGFpbkFsaWFzZXMoY2gpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFsaWFzZXM6IFtcImFsaWFzMVwiLCBcImFsaWFzMlwiXVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZC5yZXN1bHQuYWxpYXNlcylcbiAgfSlcblxuICB0ZXN0KFwiZ2V0TG9nZ2VyTGV2ZWxcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxHZXRMb2dnZXJMZXZlbFJlc3BvbnNlPiA9IGFkbWluLmdldExvZ2dlckxldmVsKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgbG9nZ2VyTGV2ZWxzOiB7IEFYOiB7IGxvZ0xldmVsOiBcIkRFQlVHXCIsIGRpc3BsYXlMZXZlbDogXCJFUlJPUlwiIH0gfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IEdldExvZ2dlckxldmVsUmVzcG9uc2UgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShwYXlsb2FkLnJlc3VsdClcbiAgfSlcblxuICB0ZXN0KFwibG9hZFZNc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPExvYWRWTXNSZXNwb25zZT4gPSBhZG1pbi5sb2FkVk1zKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHsgbmV3Vk1zOiB7fSB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogTG9hZFZNc1Jlc3BvbnNlID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZC5yZXN1bHQpXG4gIH0pXG5cbiAgdGVzdChcImxvY2tQcm9maWxlXCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5sb2NrUHJvZmlsZSgpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJtZW1vcnlQcm9maWxlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5tZW1vcnlQcm9maWxlKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcInNldExvZ2dlckxldmVsXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBsb2dnZXJOYW1lOiBzdHJpbmcgPSBcIkFYXCJcbiAgICBjb25zdCBsb2dMZXZlbDogc3RyaW5nID0gXCJERUJVR1wiXG4gICAgY29uc3QgZGlzcGxheUxldmVsOiBzdHJpbmcgPSBcIklORk9cIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxTZXRMb2dnZXJMZXZlbFJlc3BvbnNlPiA9IGFkbWluLnNldExvZ2dlckxldmVsKFxuICAgICAgbG9nZ2VyTmFtZSxcbiAgICAgIGxvZ0xldmVsLFxuICAgICAgZGlzcGxheUxldmVsXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogU2V0TG9nZ2VyTGV2ZWxSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHBheWxvYWQucmVzdWx0KVxuICB9KVxuXG4gIHRlc3QoXCJzdGFydENQVVByb2ZpbGVyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhZG1pbi5zdGFydENQVVByb2ZpbGVyKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcInN0b3BDUFVQcm9maWxlclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYWRtaW4uc3RvcENQVVByb2ZpbGVyKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXG4gIH0pXG59KVxuIl19