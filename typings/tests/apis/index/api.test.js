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
describe("Index", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345);
    let index;
    const id = "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY";
    const bytes = "111115HRzXVDSeonLBcv6QdJkQFjPzPEobMWy7PyGuoheggsMCx73MVXZo2hJMEXXvR5gFFasTRJH36aVkLiWHtTTFcghyFTqjaHnBhdXTRiLaYcro3jpseqLAFVn3ngnAB47nebQiBBKmg3nFWKzQUDxMuE6uDGXgnGouDSaEKZxfKreoLHYNUxH56rgi5c8gKFYSDi8AWBgy26siwAWj6V8EgFnPVgm9pmKCfXio6BP7Bua4vrupoX8jRGqdrdkN12dqGAibJ78Rf44SSUXhEvJtPxAzjEGfiTyAm5BWFqPdheKN72HyrBBtwC6y7wG6suHngZ1PMBh93Ubkbt8jjjGoEgs5NjpasJpE8YA9ZMLTPeNZ6ELFxV99zA46wvkjAwYHGzegBXvzGU5pGPbg28iW3iKhLoYAnReysY4x3fBhjPBsags37Z9P3SqioVifVX4wwzxYqbV72u1AWZ4JNmsnhVDP196Gu99QTzmySGTVGP5ABNdZrngTRfmGTFCRbt9CHsgNbhgetkxbsEG7tySi3gFxMzGuJ2Npk2gnSr68LgtYdSHf48Ns";
    const timestamp = "2021-04-02T15:34:00.262979-07:00";
    const idx = "0";
    beforeAll(() => {
        index = axia.Index();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("getLastAccepted", () => __awaiter(void 0, void 0, void 0, function* () {
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const respobj = {
            id,
            bytes,
            timestamp,
            encoding,
            idx
        };
        const result = index.getLastAccepted(encoding, baseurl);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("getContainerByIndex", () => __awaiter(void 0, void 0, void 0, function* () {
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const respobj = {
            id,
            bytes,
            timestamp,
            encoding,
            idx
        };
        const result = index.getContainerByIndex(idx, encoding, baseurl);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("getContainerByID", () => __awaiter(void 0, void 0, void 0, function* () {
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const respobj = {
            id,
            bytes,
            timestamp,
            encoding,
            idx
        };
        const result = index.getContainerByIndex(id, encoding, baseurl);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("getContainerRange", () => __awaiter(void 0, void 0, void 0, function* () {
        const startIndex = 0;
        const numToFetch = 100;
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const respobj = {
            id,
            bytes,
            timestamp,
            encoding,
            idx
        };
        const result = index.getContainerRange(startIndex, numToFetch, encoding, baseurl);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("getIndex", () => __awaiter(void 0, void 0, void 0, function* () {
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const result = index.getIndex(id, encoding, baseurl);
        const payload = {
            result: {
                index: "0"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("0");
    }));
    test("isAccepted", () => __awaiter(void 0, void 0, void 0, function* () {
        const encoding = "hex";
        const baseurl = "/ext/index/Swap/tx";
        const result = index.isAccepted(id, encoding, baseurl);
        const payload = {
            result: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2luZGV4L2FwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBRXZDLDZCQUEwQjtBQUkxQixRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUVoQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUN0RCxJQUFJLEtBQWUsQ0FBQTtJQUVuQixNQUFNLEVBQUUsR0FBVyxtREFBbUQsQ0FBQTtJQUN0RSxNQUFNLEtBQUssR0FDVCw0akJBQTRqQixDQUFBO0lBQzlqQixNQUFNLFNBQVMsR0FBVyxrQ0FBa0MsQ0FBQTtJQUM1RCxNQUFNLEdBQUcsR0FBVyxHQUFHLENBQUE7SUFFdkIsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDdEIsQ0FBQyxDQUFDLENBQUE7SUFFRixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IseUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFTLEVBQUU7UUFDakMsTUFBTSxRQUFRLEdBQVcsS0FBSyxDQUFBO1FBQzlCLE1BQU0sT0FBTyxHQUFXLG9CQUFvQixDQUFBO1FBQzVDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsRUFBRTtZQUNGLEtBQUs7WUFDTCxTQUFTO1lBQ1QsUUFBUTtZQUNSLEdBQUc7U0FDSixDQUFBO1FBQ0QsTUFBTSxNQUFNLEdBQW9CLEtB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aEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFTLEVBQUU7UUFDNUIsTUFBTSxRQUFRLEdBQVcsS0FBSyxDQUFBO1FBQzlCLE1BQU0sT0FBTyxHQUFXLG9CQUFvQixDQUFBO1FBQzVDLE1BQU0sTUFBTSxHQUFnQyxLQUFLLENBQUMsVUFBVSxDQUMxRCxFQUFFLEVBQ0YsUUFBUSxFQUNSLE9BQU8sQ0FDUixDQUFBO1FBRUQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUF1QixNQUFNLE1BQU0sQ0FBQTtRQUVqRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2NrQXhpb3MgZnJvbSBcImplc3QtbW9jay1heGlvc1wiXHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXHJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcclxuaW1wb3J0IHsgSXNBY2NlcHRlZFJlc3BvbnNlIH0gZnJvbSBcInNyYy9hcGlzL2luZGV4L2ludGVyZmFjZXNcIlxyXG5pbXBvcnQgeyBJbmRleEFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9pbmRleC9hcGlcIlxyXG5cclxuZGVzY3JpYmUoXCJJbmRleFwiLCAoKSA9PiB7XHJcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcclxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxyXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcclxuXHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKGlwLCBwb3J0LCBwcm90b2NvbCwgMTIzNDUpXHJcbiAgbGV0IGluZGV4OiBJbmRleEFQSVxyXG5cclxuICBjb25zdCBpZDogc3RyaW5nID0gXCI2ZlhmNWhuY1I4TFh2d3RNOGllekZRQnBLNWN1YlY2eTFkV2dwSkNjTnl6R0IxRXpZXCJcclxuICBjb25zdCBieXRlczogc3RyaW5nID1cclxuICAgIFwiMTExMTE1SFJ6WFZEU2VvbkxCY3Y2UWRKa1FGalB6UEVvYk1XeTdQeUd1b2hlZ2dzTUN4NzNNVlhabzJoSk1FWFh2UjVnRkZhc1RSSkgzNmFWa0xpV0h0VFRGY2doeUZUcWphSG5CaGRYVFJpTGFZY3JvM2pwc2VxTEFGVm4zbmduQUI0N25lYlFpQkJLbWczbkZXS3pRVUR4TXVFNnVER1hnbkdvdURTYUVLWnhmS3Jlb0xIWU5VeEg1NnJnaTVjOGdLRllTRGk4QVdCZ3kyNnNpd0FXajZWOEVnRm5QVmdtOXBtS0NmWGlvNkJQN0J1YTR2cnVwb1g4alJHcWRyZGtOMTJkcUdBaWJKNzhSZjQ0U1NVWGhFdkp0UHhBempFR2ZpVHlBbTVCV0ZxUGRoZUtONzJIeXJCQnR3QzZ5N3dHNnN1SG5nWjFQTUJoOTNVYmtidDhqampHb0VnczVOanBhc0pwRThZQTlaTUxUUGVOWjZFTEZ4Vjk5ekE0Nnd2a2pBd1lIR3plZ0JYdnpHVTVwR1BiZzI4aVczaUtoTG9ZQW5SZXlzWTR4M2ZCaGpQQnNhZ3MzN1o5UDNTcWlvVmlmVlg0d3d6eFlxYlY3MnUxQVdaNEpObXNuaFZEUDE5Nkd1OTlRVHpteVNHVFZHUDVBQk5kWnJuZ1RSZm1HVEZDUmJ0OUNIc2dOYmhnZXRreGJzRUc3dHlTaTNnRnhNekd1SjJOcGsyZ25TcjY4TGd0WWRTSGY0OE5zXCJcclxuICBjb25zdCB0aW1lc3RhbXA6IHN0cmluZyA9IFwiMjAyMS0wNC0wMlQxNTozNDowMC4yNjI5NzktMDc6MDBcIlxyXG4gIGNvbnN0IGlkeDogc3RyaW5nID0gXCIwXCJcclxuXHJcbiAgYmVmb3JlQWxsKCgpID0+IHtcclxuICAgIGluZGV4ID0gYXhpYS5JbmRleCgpXHJcbiAgfSlcclxuXHJcbiAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgIG1vY2tBeGlvcy5yZXNldCgpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldExhc3RBY2NlcHRlZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIlxyXG4gICAgY29uc3QgYmFzZXVybDogc3RyaW5nID0gXCIvZXh0L2luZGV4L1N3YXAvdHhcIlxyXG4gICAgY29uc3QgcmVzcG9iaiA9IHtcclxuICAgICAgaWQsXHJcbiAgICAgIGJ5dGVzLFxyXG4gICAgICB0aW1lc3RhbXAsXHJcbiAgICAgIGVuY29kaW5nLFxyXG4gICAgICBpZHhcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gaW5kZXguZ2V0TGFzdEFjY2VwdGVkKGVuY29kaW5nLCBiYXNldXJsKVxyXG5cclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKS50b0JlKEpTT04uc3RyaW5naWZ5KHJlc3BvYmopKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRDb250YWluZXJCeUluZGV4XCIsIGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGVuY29kaW5nOiBzdHJpbmcgPSBcImhleFwiXHJcbiAgICBjb25zdCBiYXNldXJsOiBzdHJpbmcgPSBcIi9leHQvaW5kZXgvU3dhcC90eFwiXHJcbiAgICBjb25zdCByZXNwb2JqID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgYnl0ZXMsXHJcbiAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGlkeFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBpbmRleC5nZXRDb250YWluZXJCeUluZGV4KFxyXG4gICAgICBpZHgsXHJcbiAgICAgIGVuY29kaW5nLFxyXG4gICAgICBiYXNldXJsXHJcbiAgICApXHJcblxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHJlc3BvYmpcclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkocmVzcG9iaikpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldENvbnRhaW5lckJ5SURcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgZW5jb2Rpbmc6IHN0cmluZyA9IFwiaGV4XCJcclxuICAgIGNvbnN0IGJhc2V1cmw6IHN0cmluZyA9IFwiL2V4dC9pbmRleC9Td2FwL3R4XCJcclxuICAgIGNvbnN0IHJlc3BvYmogPSB7XHJcbiAgICAgIGlkLFxyXG4gICAgICBieXRlcyxcclxuICAgICAgdGltZXN0YW1wLFxyXG4gICAgICBlbmNvZGluZyxcclxuICAgICAgaWR4XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGluZGV4LmdldENvbnRhaW5lckJ5SW5kZXgoXHJcbiAgICAgIGlkLFxyXG4gICAgICBlbmNvZGluZyxcclxuICAgICAgYmFzZXVybFxyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKS50b0JlKEpTT04uc3RyaW5naWZ5KHJlc3BvYmopKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRDb250YWluZXJSYW5nZVwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBzdGFydEluZGV4OiBudW1iZXIgPSAwXHJcbiAgICBjb25zdCBudW1Ub0ZldGNoOiBudW1iZXIgPSAxMDBcclxuICAgIGNvbnN0IGVuY29kaW5nOiBzdHJpbmcgPSBcImhleFwiXHJcbiAgICBjb25zdCBiYXNldXJsOiBzdHJpbmcgPSBcIi9leHQvaW5kZXgvU3dhcC90eFwiXHJcbiAgICBjb25zdCByZXNwb2JqID0ge1xyXG4gICAgICBpZCxcclxuICAgICAgYnl0ZXMsXHJcbiAgICAgIHRpbWVzdGFtcCxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGlkeFxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdFtdPiA9IGluZGV4LmdldENvbnRhaW5lclJhbmdlKFxyXG4gICAgICBzdGFydEluZGV4LFxyXG4gICAgICBudW1Ub0ZldGNoLFxyXG4gICAgICBlbmNvZGluZyxcclxuICAgICAgYmFzZXVybFxyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKS50b0JlKEpTT04uc3RyaW5naWZ5KHJlc3BvYmopKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRJbmRleFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIlxyXG4gICAgY29uc3QgYmFzZXVybDogc3RyaW5nID0gXCIvZXh0L2luZGV4L1N3YXAvdHhcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBpbmRleC5nZXRJbmRleChpZCwgZW5jb2RpbmcsIGJhc2V1cmwpXHJcblxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBpbmRleDogXCIwXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcIjBcIilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaXNBY2NlcHRlZFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBlbmNvZGluZzogc3RyaW5nID0gXCJoZXhcIlxyXG4gICAgY29uc3QgYmFzZXVybDogc3RyaW5nID0gXCIvZXh0L2luZGV4L1N3YXAvdHhcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPElzQWNjZXB0ZWRSZXNwb25zZT4gPSBpbmRleC5pc0FjY2VwdGVkKFxyXG4gICAgICBpZCxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGJhc2V1cmxcclxuICAgIClcclxuXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogdHJ1ZVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogSXNBY2NlcHRlZFJlc3BvbnNlID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0cnVlKVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==