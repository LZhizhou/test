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
const bn_js_1 = __importDefault(require("bn.js"));
describe("Info", () => {
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const axia = new src_1.Axia(ip, port, protocol, 12345, "What is my purpose? You pass butter. Oh my god.", undefined, undefined, false);
    let info;
    beforeAll(() => {
        info = axia.Info();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("getBlockchainID", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getBlockchainID("Swap");
        const payload = {
            result: {
                blockchainID: axia.SwapChain().getBlockchainID()
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("What is my purpose? You pass butter. Oh my god.");
    }));
    test("getNetworkID", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getNetworkID();
        const payload = {
            result: {
                networkID: 12345
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(12345);
    }));
    test("getTxFee", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getTxFee();
        const payload = {
            result: {
                txFee: "1000000",
                creationTxFee: "10000000"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.txFee.eq(new bn_js_1.default("1000000"))).toBe(true);
        expect(response.creationTxFee.eq(new bn_js_1.default("10000000"))).toBe(true);
    }));
    test("getNetworkName", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getNetworkName();
        const payload = {
            result: {
                networkName: "denali"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("denali");
    }));
    test("getNodeID", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getNodeID();
        const payload = {
            result: {
                nodeID: "abcd"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("abcd");
    }));
    test("getNodeVersion", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.getNodeVersion();
        const payload = {
            result: {
                version: "axia/0.5.5"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("axia/0.5.5");
    }));
    test("isBootstrapped false", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.isBootstrapped("Swap");
        const payload = {
            result: {
                isBootstrapped: false
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
    test("isBootstrapped true", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.isBootstrapped("Core");
        const payload = {
            result: {
                isBootstrapped: true
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
    test("peers", () => __awaiter(void 0, void 0, void 0, function* () {
        const peers = [
            {
                ip: "127.0.0.1:60300",
                publicIP: "127.0.0.1:9659",
                nodeID: "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5",
                version: "axia/1.3.2",
                lastSent: "2021-04-14T08:15:06-07:00",
                lastReceived: "2021-04-14T08:15:06-07:00",
                benched: null
            },
            {
                ip: "127.0.0.1:60302",
                publicIP: "127.0.0.1:9655",
                nodeID: "NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN",
                version: "axia/1.3.2",
                lastSent: "2021-04-14T08:15:06-07:00",
                lastReceived: "2021-04-14T08:15:06-07:00",
                benched: null
            }
        ];
        const result = info.peers();
        const payload = {
            result: {
                peers
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(peers);
    }));
    test("uptime", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = info.uptime();
        const uptimeResponse = {
            rewardingStakePercentage: "100.0000",
            weightedAveragePercentage: "99.2000"
        };
        const payload = {
            result: uptimeResponse
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toEqual(uptimeResponse);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2luZm8vYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFDdkMsNkJBQTBCO0FBRTFCLGtEQUFzQjtBQU90QixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUMxQixNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUVoQyxNQUFNLElBQUksR0FBUyxJQUFJLFVBQUksQ0FDekIsRUFBRSxFQUNGLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLGlEQUFpRCxFQUNqRCxTQUFTLEVBQ1QsU0FBUyxFQUNULEtBQUssQ0FDTixDQUFBO0lBQ0QsSUFBSSxJQUFhLENBQUE7SUFFakIsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQVMsRUFBRTtRQUNuQix5QkFBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQXdCLEVBQUU7UUFDaEQsTUFBTSxNQUFNLEdBQW9CLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDNUQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsZUFBZSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBVyxNQUFNLE1BQU0sQ0FBQTtRQUVyQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7SUFDMUUsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBd0IsRUFBRTtRQUM3QyxNQUFNLE1BQU0sR0FBb0IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ25ELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUUsS0FBSzthQUNqQjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUF3QixFQUFFO1FBQ3pDLE1BQU0sTUFBTSxHQUE4QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDekUsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxTQUFTO2dCQUNoQixhQUFhLEVBQUUsVUFBVTthQUMxQjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQXFDLE1BQU0sTUFBTSxDQUFBO1FBRS9ELE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2xFLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBd0IsRUFBRTtRQUMvQyxNQUFNLE1BQU0sR0FBb0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3JELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsUUFBUTthQUN0QjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUF3QixFQUFFO1FBQzFDLE1BQU0sTUFBTSxHQUFvQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDaEQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUF3QixFQUFFO1FBQy9DLE1BQU0sTUFBTSxHQUFvQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDckQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBVyxNQUFNLE1BQU0sQ0FBQTtRQUVyQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQ3JDLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBd0IsRUFBRTtRQUNyRCxNQUFNLE1BQU0sR0FBcUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM1RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sY0FBYyxFQUFFLEtBQUs7YUFDdEI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFZLE1BQU0sTUFBTSxDQUFBO1FBRXRDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUF3QixFQUFFO1FBQ3BELE1BQU0sTUFBTSxHQUFxQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzVELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVksTUFBTSxNQUFNLENBQUE7UUFFdEMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUF3QixFQUFFO1FBQ3RDLE1BQU0sS0FBSyxHQUFHO1lBQ1o7Z0JBQ0UsRUFBRSxFQUFFLGlCQUFpQjtnQkFDckIsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsTUFBTSxFQUFFLDBDQUEwQztnQkFDbEQsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLFFBQVEsRUFBRSwyQkFBMkI7Z0JBQ3JDLFlBQVksRUFBRSwyQkFBMkI7Z0JBQ3pDLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7WUFDRDtnQkFDRSxFQUFFLEVBQUUsaUJBQWlCO2dCQUNyQixRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixNQUFNLEVBQUUsMENBQTBDO2dCQUNsRCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsWUFBWSxFQUFFLDJCQUEyQjtnQkFDekMsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNGLENBQUE7UUFDRCxNQUFNLE1BQU0sR0FBNkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3JELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixLQUFLO2FBQ047U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFvQixNQUFNLE1BQU0sQ0FBQTtRQUU5QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQXdCLEVBQUU7UUFDdkMsTUFBTSxNQUFNLEdBQTRCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUNyRCxNQUFNLGNBQWMsR0FBbUI7WUFDckMsd0JBQXdCLEVBQUUsVUFBVTtZQUNwQyx5QkFBeUIsRUFBRSxTQUFTO1NBQ3JDLENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUUsY0FBYztTQUN2QixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFtQixNQUFNLE1BQU0sQ0FBQTtRQUU3QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2NrQXhpb3MgZnJvbSBcImplc3QtbW9jay1heGlvc1wiXHJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcclxuaW1wb3J0IHsgSW5mb0FQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9pbmZvL2FwaVwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQge1xyXG4gIFBlZXJzUmVzcG9uc2UsXHJcbiAgVXB0aW1lUmVzcG9uc2VcclxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvaW5mby9pbnRlcmZhY2VzXCJcclxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcclxuXHJcbmRlc2NyaWJlKFwiSW5mb1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcclxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxyXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcclxuXHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxyXG4gICAgaXAsXHJcbiAgICBwb3J0LFxyXG4gICAgcHJvdG9jb2wsXHJcbiAgICAxMjM0NSxcclxuICAgIFwiV2hhdCBpcyBteSBwdXJwb3NlPyBZb3UgcGFzcyBidXR0ZXIuIE9oIG15IGdvZC5cIixcclxuICAgIHVuZGVmaW5lZCxcclxuICAgIHVuZGVmaW5lZCxcclxuICAgIGZhbHNlXHJcbiAgKVxyXG4gIGxldCBpbmZvOiBJbmZvQVBJXHJcblxyXG4gIGJlZm9yZUFsbCgoKTogdm9pZCA9PiB7XHJcbiAgICBpbmZvID0gYXhpYS5JbmZvKClcclxuICB9KVxyXG5cclxuICBhZnRlckVhY2goKCk6IHZvaWQgPT4ge1xyXG4gICAgbW9ja0F4aW9zLnJlc2V0KClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QmxvY2tjaGFpbklEXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gaW5mby5nZXRCbG9ja2NoYWluSUQoXCJTd2FwXCIpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGJsb2NrY2hhaW5JRDogYXhpYS5Td2FwQ2hhaW4oKS5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiV2hhdCBpcyBteSBwdXJwb3NlPyBZb3UgcGFzcyBidXR0ZXIuIE9oIG15IGdvZC5cIilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0TmV0d29ya0lEXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxudW1iZXI+ID0gaW5mby5nZXROZXR3b3JrSUQoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBuZXR3b3JrSUQ6IDEyMzQ1XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG51bWJlciA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoMTIzNDUpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFR4RmVlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTx7IHR4RmVlOiBCTjsgY3JlYXRpb25UeEZlZTogQk4gfT4gPSBpbmZvLmdldFR4RmVlKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhGZWU6IFwiMTAwMDAwMFwiLFxyXG4gICAgICAgIGNyZWF0aW9uVHhGZWU6IFwiMTAwMDAwMDBcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiB7IHR4RmVlOiBCTjsgY3JlYXRpb25UeEZlZTogQk4gfSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UudHhGZWUuZXEobmV3IEJOKFwiMTAwMDAwMFwiKSkpLnRvQmUodHJ1ZSlcclxuICAgIGV4cGVjdChyZXNwb25zZS5jcmVhdGlvblR4RmVlLmVxKG5ldyBCTihcIjEwMDAwMDAwXCIpKSkudG9CZSh0cnVlKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXROZXR3b3JrTmFtZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGluZm8uZ2V0TmV0d29ya05hbWUoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBuZXR3b3JrTmFtZTogXCJkZW5hbGlcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiZGVuYWxpXCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldE5vZGVJRFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGluZm8uZ2V0Tm9kZUlEKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgbm9kZUlEOiBcImFiY2RcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiYWJjZFwiKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXROb2RlVmVyc2lvblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGluZm8uZ2V0Tm9kZVZlcnNpb24oKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB2ZXJzaW9uOiBcImF4aWEvMC41LjVcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiYXhpYS8wLjUuNVwiKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJpc0Jvb3RzdHJhcHBlZCBmYWxzZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gPSBpbmZvLmlzQm9vdHN0cmFwcGVkKFwiU3dhcFwiKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBpc0Jvb3RzdHJhcHBlZDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoZmFsc2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImlzQm9vdHN0cmFwcGVkIHRydWVcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPGJvb2xlYW4+ID0gaW5mby5pc0Jvb3RzdHJhcHBlZChcIkNvcmVcIilcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgaXNCb290c3RyYXBwZWQ6IHRydWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogYm9vbGVhbiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHJ1ZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwicGVlcnNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcGVlcnMgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBpcDogXCIxMjcuMC4wLjE6NjAzMDBcIixcclxuICAgICAgICBwdWJsaWNJUDogXCIxMjcuMC4wLjE6OTY1OVwiLFxyXG4gICAgICAgIG5vZGVJRDogXCJOb2RlSUQtUDdvQjJNY2pCR2dXMk5YWFdWWWpWOEpFREZvVzl4REU1XCIsXHJcbiAgICAgICAgdmVyc2lvbjogXCJheGlhLzEuMy4yXCIsXHJcbiAgICAgICAgbGFzdFNlbnQ6IFwiMjAyMS0wNC0xNFQwODoxNTowNi0wNzowMFwiLFxyXG4gICAgICAgIGxhc3RSZWNlaXZlZDogXCIyMDIxLTA0LTE0VDA4OjE1OjA2LTA3OjAwXCIsXHJcbiAgICAgICAgYmVuY2hlZDogbnVsbFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgaXA6IFwiMTI3LjAuMC4xOjYwMzAyXCIsXHJcbiAgICAgICAgcHVibGljSVA6IFwiMTI3LjAuMC4xOjk2NTVcIixcclxuICAgICAgICBub2RlSUQ6IFwiTm9kZUlELU5GQmJiSjRxQ21OYUN6ZVc3c3hFcmh2V3F2RVFNblljTlwiLFxyXG4gICAgICAgIHZlcnNpb246IFwiYXhpYS8xLjMuMlwiLFxyXG4gICAgICAgIGxhc3RTZW50OiBcIjIwMjEtMDQtMTRUMDg6MTU6MDYtMDc6MDBcIixcclxuICAgICAgICBsYXN0UmVjZWl2ZWQ6IFwiMjAyMS0wNC0xNFQwODoxNTowNi0wNzowMFwiLFxyXG4gICAgICAgIGJlbmNoZWQ6IG51bGxcclxuICAgICAgfVxyXG4gICAgXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFBlZXJzUmVzcG9uc2VbXT4gPSBpbmZvLnBlZXJzKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgcGVlcnNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogUGVlcnNSZXNwb25zZVtdID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShwZWVycylcclxuICB9KVxyXG5cclxuICB0ZXN0KFwidXB0aW1lXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxVcHRpbWVSZXNwb25zZT4gPSBpbmZvLnVwdGltZSgpXHJcbiAgICBjb25zdCB1cHRpbWVSZXNwb25zZTogVXB0aW1lUmVzcG9uc2UgPSB7XHJcbiAgICAgIHJld2FyZGluZ1N0YWtlUGVyY2VudGFnZTogXCIxMDAuMDAwMFwiLFxyXG4gICAgICB3ZWlnaHRlZEF2ZXJhZ2VQZXJjZW50YWdlOiBcIjk5LjIwMDBcIlxyXG4gICAgfVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHVwdGltZVJlc3BvbnNlXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBVcHRpbWVSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvRXF1YWwodXB0aW1lUmVzcG9uc2UpXHJcbiAgfSlcclxufSlcclxuIl19