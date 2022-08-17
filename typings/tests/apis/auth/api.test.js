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
describe("Auth", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345, "What is my purpose? You pass butter. Oh my god.", undefined, undefined, false);
    let auth;
    // We think we're a Rick, but we're totally a Jerry.
    let password = "Weddings are basically funerals with a cake. -- Rich Sanchez";
    let newPassword = "Sometimes science is more art than science, Morty. -- Rich Sanchez";
    let testToken = "To live is to risk it all otherwise you're just an inert chunk of randomly assembled molecules drifting wherever the universe blows you. -- Rick Sanchez";
    let testEndpoints = ["/ext/opt/bin/bash/foo", "/dev/null", "/tmp"];
    beforeAll(() => {
        auth = axia.Auth();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("newToken", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = auth.newToken(password, testEndpoints);
        const payload = {
            result: {
                token: testToken
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(testToken);
    }));
    test("revokeToken", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = auth.revokeToken(password, testToken);
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
    test("changePassword", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = auth.changePassword(password, newPassword);
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
        expect(response).toBe(false);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F1dGgvYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFFdkMsNkJBQTBCO0FBSTFCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxHQUFXLFdBQVcsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxFQUFFLENBQUE7SUFDdkIsTUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFBO0lBQ2hDLE1BQU0sSUFBSSxHQUFTLElBQUksVUFBSSxDQUN6QixFQUFFLEVBQ0YsSUFBSSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsaURBQWlELEVBQ2pELFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxDQUNOLENBQUE7SUFDRCxJQUFJLElBQWEsQ0FBQTtJQUVqQixvREFBb0Q7SUFDcEQsSUFBSSxRQUFRLEdBQ1YsOERBQThELENBQUE7SUFDaEUsSUFBSSxXQUFXLEdBQ2Isb0VBQW9FLENBQUE7SUFDdEUsSUFBSSxTQUFTLEdBQ1gsMEpBQTBKLENBQUE7SUFDNUosSUFBSSxhQUFhLEdBQWEsQ0FBQyx1QkFBdUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFNUUsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQix5QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUF3QixFQUFFO1FBQ3pDLE1BQU0sTUFBTSxHQUEwQyxJQUFJLENBQUMsUUFBUSxDQUNqRSxRQUFRLEVBQ1IsYUFBYSxDQUNkLENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLFNBQVM7YUFDakI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFpQyxNQUFNLE1BQU0sQ0FBQTtRQUUzRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2xDLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQXdCLEVBQUU7UUFDNUMsTUFBTSxNQUFNLEdBQXFCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsSUFBSTthQUNkO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBWSxNQUFNLE1BQU0sQ0FBQTtRQUV0QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBd0IsRUFBRTtRQUMvQyxNQUFNLE1BQU0sR0FBcUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDM0UsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxLQUFLO2FBQ2Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcclxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcclxuaW1wb3J0IHsgQXhpYSB9IGZyb20gXCJzcmNcIlxyXG5pbXBvcnQgeyBBdXRoQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F1dGgvYXBpXCJcclxuaW1wb3J0IHsgRXJyb3JSZXNwb25zZU9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvZXJyb3JzXCJcclxuXHJcbmRlc2NyaWJlKFwiQXV0aFwiLCAoKTogdm9pZCA9PiB7XHJcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcclxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxyXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcclxuICBjb25zdCBheGlhOiBBeGlhID0gbmV3IEF4aWEoXHJcbiAgICBpcCxcclxuICAgIHBvcnQsXHJcbiAgICBwcm90b2NvbCxcclxuICAgIDEyMzQ1LFxyXG4gICAgXCJXaGF0IGlzIG15IHB1cnBvc2U/IFlvdSBwYXNzIGJ1dHRlci4gT2ggbXkgZ29kLlwiLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgdW5kZWZpbmVkLFxyXG4gICAgZmFsc2VcclxuICApXHJcbiAgbGV0IGF1dGg6IEF1dGhBUElcclxuXHJcbiAgLy8gV2UgdGhpbmsgd2UncmUgYSBSaWNrLCBidXQgd2UncmUgdG90YWxseSBhIEplcnJ5LlxyXG4gIGxldCBwYXNzd29yZDogc3RyaW5nID1cclxuICAgIFwiV2VkZGluZ3MgYXJlIGJhc2ljYWxseSBmdW5lcmFscyB3aXRoIGEgY2FrZS4gLS0gUmljaCBTYW5jaGV6XCJcclxuICBsZXQgbmV3UGFzc3dvcmQ6IHN0cmluZyA9XHJcbiAgICBcIlNvbWV0aW1lcyBzY2llbmNlIGlzIG1vcmUgYXJ0IHRoYW4gc2NpZW5jZSwgTW9ydHkuIC0tIFJpY2ggU2FuY2hlelwiXHJcbiAgbGV0IHRlc3RUb2tlbjogc3RyaW5nID1cclxuICAgIFwiVG8gbGl2ZSBpcyB0byByaXNrIGl0IGFsbCBvdGhlcndpc2UgeW91J3JlIGp1c3QgYW4gaW5lcnQgY2h1bmsgb2YgcmFuZG9tbHkgYXNzZW1ibGVkIG1vbGVjdWxlcyBkcmlmdGluZyB3aGVyZXZlciB0aGUgdW5pdmVyc2UgYmxvd3MgeW91LiAtLSBSaWNrIFNhbmNoZXpcIlxyXG4gIGxldCB0ZXN0RW5kcG9pbnRzOiBzdHJpbmdbXSA9IFtcIi9leHQvb3B0L2Jpbi9iYXNoL2Zvb1wiLCBcIi9kZXYvbnVsbFwiLCBcIi90bXBcIl1cclxuXHJcbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcclxuICAgIGF1dGggPSBheGlhLkF1dGgoKVxyXG4gIH0pXHJcblxyXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XHJcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJuZXdUb2tlblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhdXRoLm5ld1Rva2VuKFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgdGVzdEVuZHBvaW50c1xyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0b2tlbjogdGVzdFRva2VuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRlc3RUb2tlbilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwicmV2b2tlVG9rZW5cIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gYXV0aC5yZXZva2VUb2tlbihwYXNzd29yZCwgdGVzdFRva2VuKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBzdWNjZXNzOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNoYW5nZVBhc3N3b3JkXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGF1dGguY2hhbmdlUGFzc3dvcmQocGFzc3dvcmQsIG5ld1Bhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBzdWNjZXNzOiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShmYWxzZSlcclxuICB9KVxyXG59KVxyXG4iXX0=