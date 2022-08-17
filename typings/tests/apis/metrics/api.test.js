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
const api_1 = require("../../../src/apis/metrics/api");
describe("Metrics", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345, undefined, undefined, undefined, true);
    let metrics;
    beforeAll(() => {
        metrics = new api_1.MetricsAPI(axia);
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("getMetrics", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = metrics.getMetrics();
        const payload = `
              gecko_timestamp_handler_get_failed_bucket{le="100"} 0
              gecko_timestamp_handler_get_failed_bucket{le="1000"} 0
              gecko_timestamp_handler_get_failed_bucket{le="10000"} 0
              gecko_timestamp_handler_get_failed_bucket{le="100000"} 0
              gecko_timestamp_handler_get_failed_bucket{le="1e+06"} 0
              gecko_timestamp_handler_get_failed_bucket{le="1e+07"} 0
              gecko_timestamp_handler_get_failed_bucket{le="1e+08"} 0
              gecko_timestamp_handler_get_failed_bucket{le="1e+09"} 0
              gecko_timestamp_handler_get_failed_bucket{le="+Inf"} 0
        `;
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(payload);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL21ldHJpY3MvYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFFdkMsNkJBQTBCO0FBQzFCLHVEQUEwRDtBQUUxRCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQVMsRUFBRTtJQUM3QixNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUVoQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FDekIsRUFBRSxFQUNGLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUksQ0FDTCxDQUFBO0lBQ0QsSUFBSSxPQUFtQixDQUFBO0lBRXZCLFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDbkIsT0FBTyxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUVGLFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDbkIseUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBd0IsRUFBRTtRQUMzQyxNQUFNLE1BQU0sR0FBb0IsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ3BELE1BQU0sT0FBTyxHQUFXOzs7Ozs7Ozs7O1NBVW5CLENBQUE7UUFDTCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9ja0F4aW9zIGZyb20gXCJqZXN0LW1vY2stYXhpb3NcIlxyXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxyXG5pbXBvcnQgeyBBeGlhIH0gZnJvbSBcInNyY1wiXHJcbmltcG9ydCB7IE1ldHJpY3NBUEkgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvbWV0cmljcy9hcGlcIlxyXG5cclxuZGVzY3JpYmUoXCJNZXRyaWNzXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxyXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXHJcbiAgY29uc3QgcHJvdG9jb2w6IHN0cmluZyA9IFwiaHR0cHNcIlxyXG5cclxuICBjb25zdCBheGlhOiBBeGlhID0gbmV3IEF4aWEoXHJcbiAgICBpcCxcclxuICAgIHBvcnQsXHJcbiAgICBwcm90b2NvbCxcclxuICAgIDEyMzQ1LFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdHJ1ZVxyXG4gIClcclxuICBsZXQgbWV0cmljczogTWV0cmljc0FQSVxyXG5cclxuICBiZWZvcmVBbGwoKCk6IHZvaWQgPT4ge1xyXG4gICAgbWV0cmljcyA9IG5ldyBNZXRyaWNzQVBJKGF4aWEpXHJcbiAgfSlcclxuXHJcbiAgYWZ0ZXJFYWNoKCgpOiB2b2lkID0+IHtcclxuICAgIG1vY2tBeGlvcy5yZXNldCgpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldE1ldHJpY3NcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBtZXRyaWNzLmdldE1ldHJpY3MoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogc3RyaW5nID0gYFxyXG4gICAgICAgICAgICAgIGdlY2tvX3RpbWVzdGFtcF9oYW5kbGVyX2dldF9mYWlsZWRfYnVja2V0e2xlPVwiMTAwXCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIjEwMDBcIn0gMFxyXG4gICAgICAgICAgICAgIGdlY2tvX3RpbWVzdGFtcF9oYW5kbGVyX2dldF9mYWlsZWRfYnVja2V0e2xlPVwiMTAwMDBcIn0gMFxyXG4gICAgICAgICAgICAgIGdlY2tvX3RpbWVzdGFtcF9oYW5kbGVyX2dldF9mYWlsZWRfYnVja2V0e2xlPVwiMTAwMDAwXCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIjFlKzA2XCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIjFlKzA3XCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIjFlKzA4XCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIjFlKzA5XCJ9IDBcclxuICAgICAgICAgICAgICBnZWNrb190aW1lc3RhbXBfaGFuZGxlcl9nZXRfZmFpbGVkX2J1Y2tldHtsZT1cIitJbmZcIn0gMFxyXG4gICAgICAgIGBcclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZClcclxuICB9KVxyXG59KVxyXG4iXX0=