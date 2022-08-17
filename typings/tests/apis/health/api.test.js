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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2hlYWx0aC9hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUF1QztBQUV2Qyw2QkFBMEI7QUFDMUIsc0RBQXdEO0FBSXhELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO0lBQzVCLE1BQU0sRUFBRSxHQUFXLFdBQVcsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxFQUFFLENBQUE7SUFDdkIsTUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFBO0lBQ2hDLE1BQU0sSUFBSSxHQUFTLElBQUksVUFBSSxDQUN6QixFQUFFLEVBQ0YsSUFBSSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxDQUNMLENBQUE7SUFDRCxJQUFJLE1BQWlCLENBQUE7SUFFckIsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixNQUFNLEdBQUcsSUFBSSxlQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFDLENBQUE7SUFFRixTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ25CLHlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkIsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQXdCLEVBQUU7UUFDdkMsTUFBTSxNQUFNLEdBQTRCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUN2RCxNQUFNLE9BQU8sR0FBUTtZQUNuQixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFO29CQUNOLEVBQUUsRUFBRTt3QkFDRixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQ2pCLFNBQVMsRUFBRSxrQ0FBa0M7d0JBQzdDLFFBQVEsRUFBRSxNQUFNO3dCQUNoQixrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQixTQUFTLEVBQUUsa0NBQWtDO3dCQUM3QyxRQUFRLEVBQUUsS0FBSzt3QkFDZixrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO3dCQUNqQixTQUFTLEVBQUUsa0NBQWtDO3dCQUM3QyxRQUFRLEVBQUUsSUFBSTt3QkFDZCxrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixrQkFBa0IsRUFBRSxJQUFJO3FCQUN6QjtvQkFDRCxjQUFjLEVBQUU7d0JBQ2QsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLEdBQUc7d0JBQ2Isa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakIsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLElBQUk7d0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQzt3QkFDakIsU0FBUyxFQUFFLGtDQUFrQzt3QkFDN0MsUUFBUSxFQUFFLElBQUk7d0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDckIsa0JBQWtCLEVBQUUsSUFBSTtxQkFDekI7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVEsTUFBTSxNQUFNLENBQUE7UUFFbEMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcclxuXHJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcclxuaW1wb3J0IHsgSGVhbHRoQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2hlYWx0aC9hcGlcIlxyXG5pbXBvcnQgeyBIZWFsdGhSZXNwb25zZSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9oZWFsdGgvaW50ZXJmYWNlc1wiXHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXHJcblxyXG5kZXNjcmliZShcIkhlYWx0aFwiLCAoKTogdm9pZCA9PiB7XHJcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcclxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxyXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcclxuICBjb25zdCBheGlhOiBBeGlhID0gbmV3IEF4aWEoXHJcbiAgICBpcCxcclxuICAgIHBvcnQsXHJcbiAgICBwcm90b2NvbCxcclxuICAgIDEyMzQ1LFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdHJ1ZVxyXG4gIClcclxuICBsZXQgaGVhbHRoOiBIZWFsdGhBUElcclxuXHJcbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcclxuICAgIGhlYWx0aCA9IG5ldyBIZWFsdGhBUEkoYXhpYSlcclxuICB9KVxyXG5cclxuICBhZnRlckVhY2goKCk6IHZvaWQgPT4ge1xyXG4gICAgbW9ja0F4aW9zLnJlc2V0KClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaGVhbHRoXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxIZWFsdGhSZXNwb25zZT4gPSBoZWFsdGguaGVhbHRoKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IGFueSA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgY2hlY2tzOiB7XHJcbiAgICAgICAgICBBWDoge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBbT2JqZWN0XSxcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MjAuMjc0NDI3LTA3OjAwXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAyNzU1MzksXHJcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcclxuICAgICAgICAgICAgdGltZU9mRmlyc3RGYWlsdXJlOiBudWxsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgQ29yZToge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBbT2JqZWN0XSxcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MjAuMjc0NTA4LTA3OjAwXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAxNDU3NixcclxuICAgICAgICAgICAgY29udGlndW91c0ZhaWx1cmVzOiAwLFxyXG4gICAgICAgICAgICB0aW1lT2ZGaXJzdEZhaWx1cmU6IG51bGxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBTd2FwOiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFtPYmplY3RdLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IFwiMjAyMS0wOS0yOVQxNTozMToyMC4yNzQ1MjktMDc6MDBcIixcclxuICAgICAgICAgICAgZHVyYXRpb246IDQ1NjMsXHJcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcclxuICAgICAgICAgICAgdGltZU9mRmlyc3RGYWlsdXJlOiBudWxsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaXNCb290c3RyYXBwZWQ6IHtcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MTkuNDQ4MzE0LTA3OjAwXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzOTIsXHJcbiAgICAgICAgICAgIGNvbnRpZ3VvdXNGYWlsdXJlczogMCxcclxuICAgICAgICAgICAgdGltZU9mRmlyc3RGYWlsdXJlOiBudWxsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbmV0d29yazoge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBbT2JqZWN0XSxcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MTkuNDQ4MzExLTA3OjAwXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiA0ODY2LFxyXG4gICAgICAgICAgICBjb250aWd1b3VzRmFpbHVyZXM6IDAsXHJcbiAgICAgICAgICAgIHRpbWVPZkZpcnN0RmFpbHVyZTogbnVsbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJvdXRlcjoge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBbT2JqZWN0XSxcclxuICAgICAgICAgICAgdGltZXN0YW1wOiBcIjIwMjEtMDktMjlUMTU6MzE6MTkuNDQ4NDUyLTA3OjAwXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzOTMyLFxyXG4gICAgICAgICAgICBjb250aWd1b3VzRmFpbHVyZXM6IDAsXHJcbiAgICAgICAgICAgIHRpbWVPZkZpcnN0RmFpbHVyZTogbnVsbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGVhbHRoeTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHBheWxvYWQucmVzdWx0KVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==