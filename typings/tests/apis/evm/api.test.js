"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const api_1 = require("../../../src/apis/evm/api");
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bech32 = __importStar(require("bech32"));
const constants_1 = require("../../../src/utils/constants");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("EVMAPI", () => {
    const networkID = 1337;
    const blockchainID = constants_1.Defaults.network[networkID].AX.blockchainID;
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const username = "AxiaCoin";
    const password = "password";
    const axia = new src_1.Axia(ip, port, protocol, networkID, undefined, undefined, undefined, true);
    let api;
    const addrA = "AX-" +
        bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW")));
    const addrC = "AX-" +
        bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")));
    beforeAll(() => {
        api = new api_1.EVMAPI(axia, "/ext/bc/AX/axc", blockchainID);
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("importKey", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = addrC;
        const result = api.importKey(username, password, "key");
        const payload = {
            result: {
                address
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(address);
    }));
    test("fail to import because no user created", () => __awaiter(void 0, void 0, void 0, function* () {
        const badUserName = "zzzzzzzzzzzzzz";
        const message = `problem retrieving data: rpc error: code = Unknown desc = incorrect password for user "${badUserName}`;
        const result = api.importKey(badUserName, password, "key");
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
    test("exportKey", () => __awaiter(void 0, void 0, void 0, function* () {
        const key = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN";
        const privateKeyHex = "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
        const object = { privateKey: key, privateKeyHex };
        const result = api.exportKey(username, password, addrA);
        const payload = {
            result: {
                privateKey: key,
                privateKeyHex
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toEqual(object);
    }));
    test("exportAXC", () => __awaiter(void 0, void 0, void 0, function* () {
        let amount = new src_1.BN(100);
        let to = "abcdef";
        let username = "Robert";
        let password = "Paulson";
        let txID = "valid";
        let result = api.exportAXC(username, password, to, amount);
        let payload = {
            result: {
                txID: txID
            }
        };
        let responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("export", () => __awaiter(void 0, void 0, void 0, function* () {
        let amount = new src_1.BN(100);
        let to = "abcdef";
        let assetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe";
        let username = "Robert";
        let password = "Paulson";
        let txID = "valid";
        let result = api.export(username, password, to, amount, assetID);
        let payload = {
            result: {
                txID: txID
            }
        };
        let responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("importAXC", () => __awaiter(void 0, void 0, void 0, function* () {
        let to = "abcdef";
        let username = "Robert";
        let password = "Paulson";
        let txID = "valid";
        let result = api.importAXC(username, password, to, blockchainID);
        let payload = {
            result: {
                txID: txID
            }
        };
        let responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("import", () => __awaiter(void 0, void 0, void 0, function* () {
        let to = "abcdef";
        let username = "Robert";
        let password = "Paulson";
        let txID = "valid";
        let result = api.import(username, password, to, blockchainID);
        let payload = {
            result: {
                txID: txID
            }
        };
        let responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("refreshBlockchainID", () => __awaiter(void 0, void 0, void 0, function* () {
        const n5bcID = constants_1.Defaults.network[5].AX["blockchainID"];
        const n1337bcID = constants_1.Defaults.network[1337].AX["blockchainID"];
        const testAPI = new api_1.EVMAPI(axia, "/ext/bc/AX/axc", n5bcID);
        const bc1 = testAPI.getBlockchainID();
        expect(bc1).toBe(n5bcID);
        let res = testAPI.refreshBlockchainID();
        expect(res).toBeTruthy();
        const bc2 = testAPI.getBlockchainID();
        expect(bc2).toBe(n1337bcID);
        res = testAPI.refreshBlockchainID(n5bcID);
        expect(res).toBeTruthy();
        const bc3 = testAPI.getBlockchainID();
        expect(bc3).toBe(n5bcID);
    }));
    test("getAssetBalance", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
        const hexStr = "0x0";
        const blockHeight = hexStr;
        const assetID = "FCry2Z1Su9KZqK1XRMhxQS6XuPorxDm3C3RBT7hw32ojiqyvP";
        const result = api.getAssetBalance(address, blockHeight, assetID);
        const payload = {
            result: hexStr
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["result"]).toBe(hexStr);
    }));
    test("getAssetBalance with bad assetID", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
        const hexStr = "0x0";
        const blockHeight = hexStr;
        const assetID = "aaa";
        const message = "invalid argument 2: couldn't decode ID to bytes: input string is smaller than the checksum size";
        const result = api.getAssetBalance(address, blockHeight, assetID);
        const payload = {
            result: {
                code: -32602,
                message
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["result"]["code"]).toBe(-32602);
        expect(response["result"]["message"]).toBe(message);
    }));
    test("getAtomicTxStatus", () => __awaiter(void 0, void 0, void 0, function* () {
        const txID = "FCry2Z1Su9KZqK1XRMhxQS6XuPorxDm3C3RBT7hw32ojiqyvP";
        const result = api.getAtomicTxStatus(txID);
        const payload = {
            result: {
                status: "Accepted"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("Accepted");
    }));
    test("getBaseFee", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = api.getBaseFee();
        const payload = {
            result: "0x34630b8a00"
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("0x34630b8a00");
    }));
    test("getMaxPriorityFeePerGas", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = api.getMaxPriorityFeePerGas();
        const payload = {
            result: "0x2540be400"
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("0x2540be400");
    }));
    test("getAtomicTx", () => __awaiter(void 0, void 0, void 0, function* () {
        const txID = "FCry2Z1Su9KZqK1XRMhxQS6XuPorxDm3C3RBT7hw32ojiqyvP";
        const tx = "111119TRhWSj932BnTyhskYtn4j7dY9Nqq8wi3mmmFvHvDEoAfifMnRcUuTFqRxhsqWyXMTHmFBcSrMS6u9F6LRA1G3DmKWoA3Yb27JbhUV7ismLkiEsWJ187q2AwgE2RCVG7eZ9zL89ZBmaVA1bkzsx324LjU9NiYgkceJxm5d3L9ATiLgWt4mWMDR4YKpSv4qKqjfD2fRzYm7gX2C2F1auCvVN6Hd15J3jRUB7vKEEcBZJexdYdqnCX7vFdwoGpJM7tUiFRDgAAPpMoxz6QF7gwKbkkXK5Vg4LG2szScX9qL5BegNwUeNQYB42kF3M3w5tnVekhmHQdZSEYU8NjSnSZnqAFPcHc4StM3yZem3MTFRYJqNc7RAvoMGi8am3Hx4GVpwYqjiqev3XiqfyuTssn4bR1XaJbjQTyC";
        const result = api.getAtomicTx(txID);
        const payload = {
            result: {
                tx,
                encoding: "hex",
                blockHeight: 8
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(tx);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2V2bS9hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBQ3ZDLDZCQUE4QjtBQUM5QixtREFBa0Q7QUFDbEQsMkVBQWtEO0FBQ2xELCtDQUFnQztBQUNoQyw0REFBdUQ7QUFHdkQ7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO0lBQzVCLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQTtJQUM5QixNQUFNLFlBQVksR0FBVyxvQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFBO0lBQ3hFLE1BQU0sRUFBRSxHQUFXLFdBQVcsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxFQUFFLENBQUE7SUFDdkIsTUFBTSxRQUFRLEdBQVcsT0FBTyxDQUFBO0lBQ2hDLE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQTtJQUNuQyxNQUFNLFFBQVEsR0FBVyxVQUFVLENBQUE7SUFFbkMsTUFBTSxJQUFJLEdBQVMsSUFBSSxVQUFJLENBQ3pCLEVBQUUsRUFDRixJQUFJLEVBQ0osUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLENBQ0wsQ0FBQTtJQUNELElBQUksR0FBVyxDQUFBO0lBRWYsTUFBTSxLQUFLLEdBQ1QsS0FBSztRQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFLEVBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQ25CLFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUMsQ0FDekQsQ0FDRixD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QUFhLENBQUMsQ0FBQTtJQUN0QyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUF3QixFQUFFO1FBQzVDLE1BQU0sSUFBSSxHQUFXLG1EQUFtRCxDQUFBO1FBQ3hFLE1BQU0sRUFBRSxHQUNOLHdhQUF3YSxDQUFBO1FBRTFhLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixFQUFFO2dCQUNGLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFdBQVcsRUFBRSxDQUFDO2FBQ2Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDM0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcclxuaW1wb3J0IHsgQXhpYSwgQk4gfSBmcm9tIFwic3JjXCJcclxuaW1wb3J0IHsgRVZNQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2V2bS9hcGlcIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCAqIGFzIGJlY2gzMiBmcm9tIFwiYmVjaDMyXCJcclxuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IEh0dHBSZXNwb25zZSB9IGZyb20gXCJqZXN0LW1vY2stYXhpb3MvZGlzdC9saWIvbW9jay1heGlvcy10eXBlc1wiXHJcblxyXG4vKipcclxuICogQGlnbm9yZVxyXG4gKi9cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5cclxuZGVzY3JpYmUoXCJFVk1BUElcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gMTMzN1xyXG4gIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdLkFYLmJsb2NrY2hhaW5JRFxyXG4gIGNvbnN0IGlwOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiXHJcbiAgY29uc3QgcG9ydDogbnVtYmVyID0gODBcclxuICBjb25zdCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwc1wiXHJcbiAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQXhpYUNvaW5cIlxyXG4gIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcInBhc3N3b3JkXCJcclxuXHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxyXG4gICAgaXAsXHJcbiAgICBwb3J0LFxyXG4gICAgcHJvdG9jb2wsXHJcbiAgICBuZXR3b3JrSUQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB0cnVlXHJcbiAgKVxyXG4gIGxldCBhcGk6IEVWTUFQSVxyXG5cclxuICBjb25zdCBhZGRyQTogc3RyaW5nID1cclxuICAgIFwiQVgtXCIgK1xyXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXHJcbiAgICAgIGF4aWEuZ2V0SFJQKCksXHJcbiAgICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiQjZENHYxVnRQWUxiaVV2WVh0VzRQeDhvRTlpbUMydkdXXCIpXHJcbiAgICAgIClcclxuICAgIClcclxuICBjb25zdCBhZGRyQzogc3RyaW5nID1cclxuICAgIFwiQVgtXCIgK1xyXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXHJcbiAgICAgIGF4aWEuZ2V0SFJQKCksXHJcbiAgICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiNlkza3lzakY5am5IbllrZFM5eUdBdW9IeWFlMmVObWVWXCIpXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcclxuICAgIGFwaSA9IG5ldyBFVk1BUEkoYXhpYSwgXCIvZXh0L2JjL0FYL2F4Y1wiLCBibG9ja2NoYWluSUQpXHJcbiAgfSlcclxuXHJcbiAgYWZ0ZXJFYWNoKCgpOiB2b2lkID0+IHtcclxuICAgIG1vY2tBeGlvcy5yZXNldCgpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImltcG9ydEtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBhZGRyQ1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmltcG9ydEtleSh1c2VybmFtZSwgcGFzc3dvcmQsIFwia2V5XCIpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGFkZHJlc3NcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhZGRyZXNzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJmYWlsIHRvIGltcG9ydCBiZWNhdXNlIG5vIHVzZXIgY3JlYXRlZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBiYWRVc2VyTmFtZSA9IFwienp6enp6enp6enp6enpcIlxyXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gYHByb2JsZW0gcmV0cmlldmluZyBkYXRhOiBycGMgZXJyb3I6IGNvZGUgPSBVbmtub3duIGRlc2MgPSBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCIke2JhZFVzZXJOYW1lfWBcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5pbXBvcnRLZXkoYmFkVXNlck5hbWUsIHBhc3N3b3JkLCBcImtleVwiKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBjb2RlOiAtMzIwMDAsXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICBkYXRhOiBudWxsXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJjb2RlXCJdKS50b0JlKC0zMjAwMClcclxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1lc3NhZ2VcIl0pLnRvQmUobWVzc2FnZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZXhwb3J0S2V5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGtleTogc3RyaW5nID1cclxuICAgICAgXCJQcml2YXRlS2V5LWV3b3FqUDdQeFk0eXIzaUxUcExpc3JpcXQ5NGhkeURGTmdjaFN4R0d6dFVyVFh0Tk5cIlxyXG4gICAgY29uc3QgcHJpdmF0ZUtleUhleDogc3RyaW5nID1cclxuICAgICAgXCIweDU2Mjg5ZTk5Yzk0YjY5MTJiZmMxMmFkYzA5M2M5YjUxMTI0ZjBkYzU0YWM3YTc2NmIyYmM1Y2NmNTU4ZDgwMjdcIlxyXG4gICAgY29uc3Qgb2JqZWN0OiBvYmplY3QgPSB7IHByaXZhdGVLZXk6IGtleSwgcHJpdmF0ZUtleUhleCB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZXhwb3J0S2V5KHVzZXJuYW1lLCBwYXNzd29yZCwgYWRkckEpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHByaXZhdGVLZXk6IGtleSxcclxuICAgICAgICBwcml2YXRlS2V5SGV4XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvRXF1YWwob2JqZWN0KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJleHBvcnRBWENcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgbGV0IGFtb3VudDogQk4gPSBuZXcgQk4oMTAwKVxyXG4gICAgbGV0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBsZXQgdXNlcm5hbWU6IHN0cmluZyA9IFwiUm9iZXJ0XCJcclxuICAgIGxldCBwYXNzd29yZDogc3RyaW5nID0gXCJQYXVsc29uXCJcclxuICAgIGxldCB0eElEOiBzdHJpbmcgPSBcInZhbGlkXCJcclxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5leHBvcnRBWEModXNlcm5hbWUsIHBhc3N3b3JkLCB0bywgYW1vdW50KVxyXG4gICAgbGV0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdHhJRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzcG9uc2VPYmogPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgbGV0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4SUQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImV4cG9ydFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBsZXQgYW1vdW50OiBCTiA9IG5ldyBCTigxMDApXHJcbiAgICBsZXQgdG86IHN0cmluZyA9IFwiYWJjZGVmXCJcclxuICAgIGxldCBhc3NldElEOiBzdHJpbmcgPSBcIjJmb21iaEw3YUdQd2ozS0g0YmZybUp3VzZQVm5Nb2JmOVkyZm45R3d4aUFBSnlGRGJlXCJcclxuICAgIGxldCB1c2VybmFtZTogc3RyaW5nID0gXCJSb2JlcnRcIlxyXG4gICAgbGV0IHBhc3N3b3JkOiBzdHJpbmcgPSBcIlBhdWxzb25cIlxyXG4gICAgbGV0IHR4SUQ6IHN0cmluZyA9IFwidmFsaWRcIlxyXG4gICAgbGV0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmV4cG9ydChcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0byxcclxuICAgICAgYW1vdW50LFxyXG4gICAgICBhc3NldElEXHJcbiAgICApXHJcbiAgICBsZXQgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eElEOiB0eElEXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCByZXNwb25zZU9iaiA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBsZXQgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaW1wb3J0QVhDXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGxldCB0bzogc3RyaW5nID0gXCJhYmNkZWZcIlxyXG4gICAgbGV0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXHJcbiAgICBsZXQgcGFzc3dvcmQ6IHN0cmluZyA9IFwiUGF1bHNvblwiXHJcbiAgICBsZXQgdHhJRDogc3RyaW5nID0gXCJ2YWxpZFwiXHJcbiAgICBsZXQgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuaW1wb3J0QVhDKFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIHRvLFxyXG4gICAgICBibG9ja2NoYWluSURcclxuICAgIClcclxuICAgIGxldCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHR4SURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHJlc3BvbnNlT2JqID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGxldCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eElEKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJpbXBvcnRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgbGV0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBsZXQgdXNlcm5hbWU6IHN0cmluZyA9IFwiUm9iZXJ0XCJcclxuICAgIGxldCBwYXNzd29yZDogc3RyaW5nID0gXCJQYXVsc29uXCJcclxuICAgIGxldCB0eElEOiBzdHJpbmcgPSBcInZhbGlkXCJcclxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5pbXBvcnQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgdG8sXHJcbiAgICAgIGJsb2NrY2hhaW5JRFxyXG4gICAgKVxyXG4gICAgbGV0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdHhJRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzcG9uc2VPYmogPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgbGV0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4SUQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcInJlZnJlc2hCbG9ja2NoYWluSURcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgbjViY0lEOiBzdHJpbmcgPSBEZWZhdWx0cy5uZXR3b3JrWzVdLkFYW1wiYmxvY2tjaGFpbklEXCJdXHJcbiAgICBjb25zdCBuMTMzN2JjSUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbMTMzN10uQVhbXCJibG9ja2NoYWluSURcIl1cclxuICAgIGNvbnN0IHRlc3RBUEk6IEVWTUFQSSA9IG5ldyBFVk1BUEkoYXhpYSwgXCIvZXh0L2JjL0FYL2F4Y1wiLCBuNWJjSUQpXHJcbiAgICBjb25zdCBiYzE6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzEpLnRvQmUobjViY0lEKVxyXG5cclxuICAgIGxldCByZXM6IGJvb2xlYW4gPSB0ZXN0QVBJLnJlZnJlc2hCbG9ja2NoYWluSUQoKVxyXG4gICAgZXhwZWN0KHJlcykudG9CZVRydXRoeSgpXHJcbiAgICBjb25zdCBiYzI6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzIpLnRvQmUobjEzMzdiY0lEKVxyXG5cclxuICAgIHJlcyA9IHRlc3RBUEkucmVmcmVzaEJsb2NrY2hhaW5JRChuNWJjSUQpXHJcbiAgICBleHBlY3QocmVzKS50b0JlVHJ1dGh5KClcclxuICAgIGNvbnN0IGJjMzogc3RyaW5nID0gdGVzdEFQSS5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgZXhwZWN0KGJjMykudG9CZShuNWJjSUQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEFzc2V0QmFsYW5jZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBcIjB4OGRiOTdDN2NFY0UyNDljMmI5OGJEQzAyMjZDYzRDMkE1N0JGNTJGQ1wiXHJcbiAgICBjb25zdCBoZXhTdHI6IHN0cmluZyA9IFwiMHgwXCJcclxuICAgIGNvbnN0IGJsb2NrSGVpZ2h0OiBzdHJpbmcgPSBoZXhTdHJcclxuICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9IFwiRkNyeTJaMVN1OUtacUsxWFJNaHhRUzZYdVBvcnhEbTNDM1JCVDdodzMyb2ppcXl2UFwiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0QXNzZXRCYWxhbmNlKFxyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBibG9ja0hlaWdodCxcclxuICAgICAgYXNzZXRJRFxyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IGhleFN0clxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wicmVzdWx0XCJdKS50b0JlKGhleFN0cilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QXNzZXRCYWxhbmNlIHdpdGggYmFkIGFzc2V0SURcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYWRkcmVzczogc3RyaW5nID0gXCIweDhkYjk3QzdjRWNFMjQ5YzJiOThiREMwMjI2Q2M0QzJBNTdCRjUyRkNcIlxyXG4gICAgY29uc3QgaGV4U3RyOiBzdHJpbmcgPSBcIjB4MFwiXHJcbiAgICBjb25zdCBibG9ja0hlaWdodDogc3RyaW5nID0gaGV4U3RyXHJcbiAgICBjb25zdCBhc3NldElEOiBzdHJpbmcgPSBcImFhYVwiXHJcblxyXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID1cclxuICAgICAgXCJpbnZhbGlkIGFyZ3VtZW50IDI6IGNvdWxkbid0IGRlY29kZSBJRCB0byBieXRlczogaW5wdXQgc3RyaW5nIGlzIHNtYWxsZXIgdGhhbiB0aGUgY2hlY2tzdW0gc2l6ZVwiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0QXNzZXRCYWxhbmNlKFxyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBibG9ja0hlaWdodCxcclxuICAgICAgYXNzZXRJRFxyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBjb2RlOiAtMzI2MDIsXHJcbiAgICAgICAgbWVzc2FnZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wicmVzdWx0XCJdW1wiY29kZVwiXSkudG9CZSgtMzI2MDIpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJyZXN1bHRcIl1bXCJtZXNzYWdlXCJdKS50b0JlKG1lc3NhZ2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEF0b21pY1R4U3RhdHVzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHR4SUQ6IHN0cmluZyA9IFwiRkNyeTJaMVN1OUtacUsxWFJNaHhRUzZYdVBvcnhEbTNDM1JCVDdodzMyb2ppcXl2UFwiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZ2V0QXRvbWljVHhTdGF0dXModHhJRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3RhdHVzOiBcIkFjY2VwdGVkXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcIkFjY2VwdGVkXCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEJhc2VGZWVcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZ2V0QmFzZUZlZSgpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogXCIweDM0NjMwYjhhMDBcIlxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcIjB4MzQ2MzBiOGEwMFwiKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRNYXhQcmlvcml0eUZlZVBlckdhc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5nZXRNYXhQcmlvcml0eUZlZVBlckdhcygpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogXCIweDI1NDBiZTQwMFwiXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiMHgyNTQwYmU0MDBcIilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QXRvbWljVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdHhJRDogc3RyaW5nID0gXCJGQ3J5MloxU3U5S1pxSzFYUk1oeFFTNlh1UG9yeERtM0MzUkJUN2h3MzJvamlxeXZQXCJcclxuICAgIGNvbnN0IHR4ID1cclxuICAgICAgXCIxMTExMTlUUmhXU2o5MzJCblR5aHNrWXRuNGo3ZFk5TnFxOHdpM21tbUZ2SHZERW9BZmlmTW5SY1V1VEZxUnhoc3FXeVhNVEhtRkJjU3JNUzZ1OUY2TFJBMUczRG1LV29BM1liMjdKYmhVVjdpc21Ma2lFc1dKMTg3cTJBd2dFMlJDVkc3ZVo5ekw4OVpCbWFWQTFia3pzeDMyNExqVTlOaVlna2NlSnhtNWQzTDlBVGlMZ1d0NG1XTURSNFlLcFN2NHFLcWpmRDJmUnpZbTdnWDJDMkYxYXVDdlZONkhkMTVKM2pSVUI3dktFRWNCWkpleGRZZHFuQ1g3dkZkd29HcEpNN3RVaUZSRGdBQVBwTW94ejZRRjdnd0tia2tYSzVWZzRMRzJzelNjWDlxTDVCZWdOd1VlTlFZQjQya0YzTTN3NXRuVmVraG1IUWRaU0VZVThOalNuU1pucUFGUGNIYzRTdE0zeVplbTNNVEZSWUpxTmM3UkF2b01HaThhbTNIeDRHVnB3WXFqaXFldjNYaXFmeXVUc3NuNGJSMVhhSmJqUVR5Q1wiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZ2V0QXRvbWljVHgodHhJRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHgsXHJcbiAgICAgICAgZW5jb2Rpbmc6IFwiaGV4XCIsXHJcbiAgICAgICAgYmxvY2tIZWlnaHQ6IDhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eClcclxuICB9KVxyXG59KVxyXG4iXX0=