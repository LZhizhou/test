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
const api_1 = require("../../../src/apis/health/api");
describe("Health", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345, undefined, undefined, undefined, true);
    let health;
    beforeAll(() => {
        health = new api_1.HealthAPI(axia);
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("health", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = health.health();
        const payload = {
            result: {
                checks: {
                    AX: {
                        message: [Object],
                        timestamp: "2021-09-29T15:31:20.274427-07:00",
                        duration: 275539,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    },
                    Core: {
                        message: [Object],
                        timestamp: "2021-09-29T15:31:20.274508-07:00",
                        duration: 14576,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    },
                    Swap: {
                        message: [Object],
                        timestamp: "2021-09-29T15:31:20.274529-07:00",
                        duration: 4563,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    },
                    isBootstrapped: {
                        timestamp: "2021-09-29T15:31:19.448314-07:00",
                        duration: 392,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    },
                    network: {
                        message: [Object],
                        timestamp: "2021-09-29T15:31:19.448311-07:00",
                        duration: 4866,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    },
                    router: {
                        message: [Object],
                        timestamp: "2021-09-29T15:31:19.448452-07:00",
                        duration: 3932,
                        contiguousFailures: 0,
                        timeOfFirstFailure: null
                    }
                },
                healthy: true
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(payload.result);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2hlYWx0aC9hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUF1QztBQUV2Qyw2QkFBMEI7QUFDMUIsc0RBQXdEO0FBSXhELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO0lBQzVCLE1BQU0sRUFBRSxHQUFXLFdBQVcsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxFQUFFLENBQUE7SUFDdkIsTUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFBO0lBQ2hDLE1BQU0sSUFBSSxHQUFTLElBQUksVUFBSSxDQUN6QixFQUFFLEVBQ0YsSUFBSSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxDQUNMLENBQUE7SUFDRCxJQUFJLE1BQWlCLENBQUE7SUFFckIsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixNQUFNLEdBQUcsSUFBSSxlQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQUE7SUFFRixTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ25CLHlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkIsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQXdCLEVBQUU7UUFDdkMsTUFBTSxNQUFNLEdBQTRCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUN2RCxNQUFNLE9BQU8sR0FBUTtZQUNuQixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFO29CQUNOLEVBQUUsRUFBRTt3QkFDRixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQ2pCLFNBQVMsRUFBRSxrQ0FBa0M7d0JBQzdDLFFBQVEsRUFBRSxNQUFNO3dCQUNoQixrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQixTQUFTLEVBQUUsa0NBQWtDO3dCQUM3QyxRQUFRLEVBQUUsS0FBSzt3QkFDZixrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQixTQUFTLEVBQUUsa0NBQWtDO3dCQUM3QyxRQUFRLEVBQUUsSUFBSTt3QkFDZCxrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLEdBQUc7d0JBQ2Isa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakIsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLElBQUk7d0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakIsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLElBQUk7d0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVEsTUFBTSxNQUFNLENBQUE7UUFFbEMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcblxuaW1wb3J0IHsgQXhpYSB9IGZyb20gXCJzcmNcIlxuaW1wb3J0IHsgSGVhbHRoQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2hlYWx0aC9hcGlcIlxuaW1wb3J0IHsgSGVhbHRoUmVzcG9uc2UgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvaGVhbHRoL2ludGVyZmFjZXNcIlxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcblxuZGVzY3JpYmUoXCJIZWFsdGhcIiwgKCk6IHZvaWQgPT4ge1xuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxuICBjb25zdCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwc1wiXG4gIGNvbnN0IGF4aWE6IEF4aWEgPSBuZXcgQXhpYShcbiAgICBpcCxcbiAgICBwb3J0LFxuICAgIHByb3RvY29sLFxuICAgIDEyMzQ1LFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkLFxuICAgIHRydWVcbiAgKVxuICBsZXQgaGVhbHRoOiBIZWFsdGhBUElcblxuICBiZWZvcmVBbGwoKCk6IHZvaWQgPT4ge1xuICAgIGhlYWx0aCA9IG5ldyBIZWFsdGhBUEkoYXhpYSlcbiAgfSlcblxuICBhZnRlckVhY2goKCk6IHZvaWQgPT4ge1xuICAgIG1vY2tBeGlvcy5yZXNldCgpXG4gIH0pXG5cbiAgdGVzdChcImhlYWx0aFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEhlYWx0aFJlc3BvbnNlPiA9IGhlYWx0aC5oZWFsdGgoKVxuICAgIGNvbnN0IHBheWxvYWQ6IGFueSA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBjaGVja3M6IHtcbiAgICAgICAgICBBWDoge1xuICAgICAgICAgICAgbWVzc2FnZTogW09iamVjdF0sXG4gICAgICAgICAgICB0aW1lc3RhbXA6IFwiMjAyMS0wOS0yOVQxNTozMToyMC4yNzQ0MjctMDc6MDBcIixcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyNzU1MzksXG4gICAgICAgICAgICBjb250aWd1b3VzRmFpbHVyZXM6IDAsXG4gICAgICAgICAgICB0aW1lT2ZGaXJzdEZhaWx1cmU6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIENvcmU6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFtPYmplY3RdLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MjAuMjc0NTA4LTA3OjAwXCIsXG4gICAgICAgICAgICBkdXJhdGlvbjogMTQ1NzYsXG4gICAgICAgICAgICBjb250aWd1b3VzRmFpbHVyZXM6IDAsXG4gICAgICAgICAgICB0aW1lT2ZGaXJzdEZhaWx1cmU6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN3YXA6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFtPYmplY3RdLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MjAuMjc0NTI5LTA3OjAwXCIsXG4gICAgICAgICAgICBkdXJhdGlvbjogNDU2MyxcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcbiAgICAgICAgICAgIHRpbWVPZkZpcnN0RmFpbHVyZTogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNCb290c3RyYXBwZWQ6IHtcbiAgICAgICAgICAgIHRpbWVzdGFtcDogXCIyMDIxLTA5LTI5VDE1OjMxOjE5LjQ0ODMxNC0wNzowMFwiLFxuICAgICAgICAgICAgZHVyYXRpb246IDM5MixcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcbiAgICAgICAgICAgIHRpbWVPZkZpcnN0RmFpbHVyZTogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgICAgbWVzc2FnZTogW09iamVjdF0sXG4gICAgICAgICAgICB0aW1lc3RhbXA6IFwiMjAyMS0wOS0yOVQxNTozMToxOS40NDgzMTEtMDc6MDBcIixcbiAgICAgICAgICAgIGR1cmF0aW9uOiA0ODY2LFxuICAgICAgICAgICAgY29udGlndW91c0ZhaWx1cmVzOiAwLFxuICAgICAgICAgICAgdGltZU9mRmlyc3RGYWlsdXJlOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByb3V0ZXI6IHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFtPYmplY3RdLFxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MTkuNDQ4NDUyLTA3OjAwXCIsXG4gICAgICAgICAgICBkdXJhdGlvbjogMzkzMixcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcbiAgICAgICAgICAgIHRpbWVPZkZpcnN0RmFpbHVyZTogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaGVhbHRoeTogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZC5yZXN1bHQpXG4gIH0pXG59KVxuIl19