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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F1dGgvYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFFdkMsNkJBQTBCO0FBSTFCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO0lBQzFCLE1BQU0sRUFBRSxHQUFXLFdBQVcsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxFQUFFLENBQUE7SUFDdkIsTUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFBO0lBQ2hDLE1BQU0sSUFBSSxHQUFTLElBQUksVUFBSSxDQUN6QixFQUFFLEVBQ0YsSUFBSSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsaURBQWlELEVBQ2pELFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxDQUNOLENBQUE7SUFDRCxJQUFJLElBQWEsQ0FBQTtJQUVqQixvREFBb0Q7SUFDcEQsSUFBSSxRQUFRLEdBQ1YsOERBQThELENBQUE7SUFDaEUsSUFBSSxXQUFXLEdBQ2Isb0VBQW9FLENBQUE7SUFDdEUsSUFBSSxTQUFTLEdBQ1gsMEpBQTBKLENBQUE7SUFDNUosSUFBSSxhQUFhLEdBQWEsQ0FBQyx1QkFBdUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFNUUsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQix5QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUF3QixFQUFFO1FBQ3pDLE1BQU0sTUFBTSxHQUEwQyxJQUFJLENBQUMsUUFBUSxDQUNqRSxRQUFRLEVBQ1IsYUFBYSxDQUNkLENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLFNBQVM7YUFDakI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFpQyxNQUFNLE1BQU0sQ0FBQTtRQUUzRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2xDLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQXdCLEVBQUU7UUFDNUMsTUFBTSxNQUFNLEdBQXFCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsSUFBSTthQUNkO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBWSxNQUFNLE1BQU0sQ0FBQTtRQUV0QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBd0IsRUFBRTtRQUMvQyxNQUFNLE1BQU0sR0FBcUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDM0UsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxLQUFLO2FBQ2Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXG5pbXBvcnQgeyBBeGlhIH0gZnJvbSBcInNyY1wiXG5pbXBvcnQgeyBBdXRoQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F1dGgvYXBpXCJcbmltcG9ydCB7IEVycm9yUmVzcG9uc2VPYmplY3QgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2Vycm9yc1wiXG5cbmRlc2NyaWJlKFwiQXV0aFwiLCAoKTogdm9pZCA9PiB7XG4gIGNvbnN0IGlwOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxuICAgIGlwLFxuICAgIHBvcnQsXG4gICAgcHJvdG9jb2wsXG4gICAgMTIzNDUsXG4gICAgXCJXaGF0IGlzIG15IHB1cnBvc2U/IFlvdSBwYXNzIGJ1dHRlci4gT2ggbXkgZ29kLlwiLFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWQsXG4gICAgZmFsc2VcbiAgKVxuICBsZXQgYXV0aDogQXV0aEFQSVxuXG4gIC8vIFdlIHRoaW5rIHdlJ3JlIGEgUmljaywgYnV0IHdlJ3JlIHRvdGFsbHkgYSBKZXJyeS5cbiAgbGV0IHBhc3N3b3JkOiBzdHJpbmcgPVxuICAgIFwiV2VkZGluZ3MgYXJlIGJhc2ljYWxseSBmdW5lcmFscyB3aXRoIGEgY2FrZS4gLS0gUmljaCBTYW5jaGV6XCJcbiAgbGV0IG5ld1Bhc3N3b3JkOiBzdHJpbmcgPVxuICAgIFwiU29tZXRpbWVzIHNjaWVuY2UgaXMgbW9yZSBhcnQgdGhhbiBzY2llbmNlLCBNb3J0eS4gLS0gUmljaCBTYW5jaGV6XCJcbiAgbGV0IHRlc3RUb2tlbjogc3RyaW5nID1cbiAgICBcIlRvIGxpdmUgaXMgdG8gcmlzayBpdCBhbGwgb3RoZXJ3aXNlIHlvdSdyZSBqdXN0IGFuIGluZXJ0IGNodW5rIG9mIHJhbmRvbWx5IGFzc2VtYmxlZCBtb2xlY3VsZXMgZHJpZnRpbmcgd2hlcmV2ZXIgdGhlIHVuaXZlcnNlIGJsb3dzIHlvdS4gLS0gUmljayBTYW5jaGV6XCJcbiAgbGV0IHRlc3RFbmRwb2ludHM6IHN0cmluZ1tdID0gW1wiL2V4dC9vcHQvYmluL2Jhc2gvZm9vXCIsIFwiL2Rldi9udWxsXCIsIFwiL3RtcFwiXVxuXG4gIGJlZm9yZUFsbCgoKTogdm9pZCA9PiB7XG4gICAgYXV0aCA9IGF4aWEuQXV0aCgpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpOiB2b2lkID0+IHtcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxuICB9KVxuXG4gIHRlc3QoXCJuZXdUb2tlblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXV0aC5uZXdUb2tlbihcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgdGVzdEVuZHBvaW50c1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdG9rZW46IHRlc3RUb2tlblxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRlc3RUb2tlbilcbiAgfSlcblxuICB0ZXN0KFwicmV2b2tlVG9rZW5cIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxib29sZWFuPiA9IGF1dGgucmV2b2tlVG9rZW4ocGFzc3dvcmQsIHRlc3RUb2tlbilcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IGJvb2xlYW4gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcImNoYW5nZVBhc3N3b3JkXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBhdXRoLmNoYW5nZVBhc3N3b3JkKHBhc3N3b3JkLCBuZXdQYXNzd29yZClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBib29sZWFuID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShmYWxzZSlcbiAgfSlcbn0pXG4iXX0=