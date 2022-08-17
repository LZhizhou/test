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
const api_1 = require("../../../src/apis/keystore/api");
describe("Keystore", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const username = "AxiaCoin";
    const password = "password";
    const axia = new src_1.Axia(ip, port, protocol, 12345, undefined, undefined, undefined, true);
    let keystore;
    beforeAll(() => {
        keystore = new api_1.KeystoreAPI(axia);
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("createUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = keystore.createUser(username, password);
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
    test("createUser with weak password", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = keystore.createUser(username, "aaa");
        const message = "password is too weak";
        const payload = {
            result: {
                code: -32000,
                message,
                data: null
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["code"]).toBe(-32000);
        expect(response["message"]).toBe(message);
    }));
    test("deleteUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = keystore.deleteUser(username, password);
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
    test("exportUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = "data";
        const result = keystore.exportUser(username, password);
        const payload = {
            result: {
                user: data
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(data);
    }));
    test("importUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = keystore.importUser(username, "data", password);
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
    test("listUsers", () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = ["acc1", "acc2"];
        const result = keystore.listUsers();
        const payload = {
            result: {
                users: accounts
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(accounts);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2tleXN0b3JlL2FwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBRXZDLDZCQUEwQjtBQUMxQix3REFBNEQ7QUFFNUQsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFTLEVBQUU7SUFDOUIsTUFBTSxFQUFFLEdBQVcsV0FBVyxDQUFBO0lBQzlCLE1BQU0sSUFBSSxHQUFXLEVBQUUsQ0FBQTtJQUN2QixNQUFNLFFBQVEsR0FBVyxPQUFPLENBQUE7SUFFaEMsTUFBTSxRQUFRLEdBQVcsVUFBVSxDQUFBO0lBQ25DLE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQTtJQUVuQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FDekIsRUFBRSxFQUNGLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUksQ0FDTCxDQUFBO0lBQ0QsSUFBSSxRQUFxQixDQUFBO0lBRXpCLFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDbkIsUUFBUSxHQUFHLElBQUksaUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUVGLFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDbkIseUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBd0IsRUFBRTtRQUMzQyxNQUFNLE1BQU0sR0FBcUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDeEUsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFB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Q0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9ja0F4aW9zIGZyb20gXCJqZXN0LW1vY2stYXhpb3NcIlxyXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxyXG5pbXBvcnQgeyBBeGlhIH0gZnJvbSBcInNyY1wiXHJcbmltcG9ydCB7IEtleXN0b3JlQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2tleXN0b3JlL2FwaVwiXHJcblxyXG5kZXNjcmliZShcIktleXN0b3JlXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxyXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXHJcbiAgY29uc3QgcHJvdG9jb2w6IHN0cmluZyA9IFwiaHR0cHNcIlxyXG5cclxuICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJBeGlhQ29pblwiXHJcbiAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwicGFzc3dvcmRcIlxyXG5cclxuICBjb25zdCBheGlhOiBBeGlhID0gbmV3IEF4aWEoXHJcbiAgICBpcCxcclxuICAgIHBvcnQsXHJcbiAgICBwcm90b2NvbCxcclxuICAgIDEyMzQ1LFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdHJ1ZVxyXG4gIClcclxuICBsZXQga2V5c3RvcmU6IEtleXN0b3JlQVBJXHJcblxyXG4gIGJlZm9yZUFsbCgoKTogdm9pZCA9PiB7XHJcbiAgICBrZXlzdG9yZSA9IG5ldyBLZXlzdG9yZUFQSShheGlhKVxyXG4gIH0pXHJcblxyXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XHJcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJjcmVhdGVVc2VyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNyZWF0ZVVzZXIgd2l0aCB3ZWFrIHBhc3N3b3JkXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlcm5hbWUsIFwiYWFhXCIpXHJcbiAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPSBcInBhc3N3b3JkIGlzIHRvbyB3ZWFrXCJcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgY29kZTogLTMyMDAwLFxyXG4gICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgZGF0YTogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZVtcImNvZGVcIl0pLnRvQmUoLTMyMDAwKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wibWVzc2FnZVwiXSkudG9CZShtZXNzYWdlKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJkZWxldGVVc2VyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGtleXN0b3JlLmRlbGV0ZVVzZXIodXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImV4cG9ydFVzZXJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgZGF0YTogc3RyaW5nID0gXCJkYXRhXCJcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGtleXN0b3JlLmV4cG9ydFVzZXIodXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB1c2VyOiBkYXRhXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoZGF0YSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaW1wb3J0VXNlclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBrZXlzdG9yZS5pbXBvcnRVc2VyKFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgXCJkYXRhXCIsXHJcbiAgICAgIHBhc3N3b3JkXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHJ1ZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwibGlzdFVzZXJzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFjY291bnRzOiBzdHJpbmdbXSA9IFtcImFjYzFcIiwgXCJhY2MyXCJdXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGtleXN0b3JlLmxpc3RVc2VycygpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHVzZXJzOiBhY2NvdW50c1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYWNjb3VudHMpXHJcbiAgfSlcclxufSlcclxuIl19