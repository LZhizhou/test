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
const api_1 = require("../../../src/apis/avm/api");
const keychain_1 = require("../../../src/apis/avm/keychain");
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const utxos_1 = require("../../../src/apis/avm/utxos");
const inputs_1 = require("../../../src/apis/avm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const tx_1 = require("../../../src/apis/avm/tx");
const constants_1 = require("../../../src/apis/avm/constants");
const outputs_1 = require("../../../src/apis/avm/outputs");
const ops_1 = require("../../../src/apis/avm/ops");
const bech32 = __importStar(require("bech32"));
const payload_1 = require("../../../src/utils/payload");
const initialstates_1 = require("../../../src/apis/avm/initialstates");
const constants_2 = require("../../../src/utils/constants");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const output_1 = require("../../../src/common/output");
const minterset_1 = require("../../../src/apis/avm/minterset");
const constants_3 = require("../../../src/utils/constants");
const persistenceoptions_1 = require("../../../src/utils/persistenceoptions");
const constants_4 = require("../../../src/utils/constants");
const serialization_1 = require("../../../src/utils/serialization");
const utils_1 = require("src/utils");
const utils_2 = require("src/utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
const dumpSerailization = false;
const display = "display";
const serialzeit = (aThing, name) => {
    if (dumpSerailization) {
        console.log(JSON.stringify(serialization.serialize(aThing, "avm", "hex", name + " -- Hex Encoded")));
        console.log(JSON.stringify(serialization.serialize(aThing, "avm", "display", name + " -- Human-Readable")));
    }
};
describe("AVMAPI", () => {
    const networkID = 1337;
    const blockchainID = constants_2.Defaults.network[networkID].Swap.blockchainID;
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const username = "AxiaCoin";
    const password = "password";
    const axia = new src_1.Axia(ip, port, protocol, networkID, undefined, undefined, undefined, true);
    let api;
    let alias;
    const addrA = `Swap-${bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW")))}`;
    const addrB = `Swap-${bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("P5wdRuZeaDt28eHMP5S3w9ZdoBfo7wuzF")))}`;
    const addrC = `Swap-${bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")))}`;
    beforeAll(() => {
        api = new api_1.AVMAPI(axia, "/ext/bc/Swap", blockchainID);
        alias = api.getBlockchainAlias();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("fails to send with incorrect username", () => __awaiter(void 0, void 0, void 0, function* () {
        const memo = "hello world";
        const incorrectUserName = "asdfasdfsa";
        const message = `problem retrieving user: incorrect password for user "${incorrectUserName}"`;
        const result = api.send(incorrectUserName, password, "assetId", 10, addrA, [addrB], addrA, memo);
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
    test("fails to send with incorrect Password", () => __awaiter(void 0, void 0, void 0, function* () {
        const memo = "hello world";
        const incorrectPassword = "asdfasdfsa";
        const message = `problem retrieving user: incorrect password for user "${incorrectPassword}"`;
        const result = api.send(username, incorrectPassword, "assetId", 10, addrA, [addrB], addrA, memo);
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
    test("can Send 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const txId = "asdfhvl234";
        const memo = "hello world";
        const changeAddr = "Swap-local1";
        const result = api.send(username, password, "assetId", 10, addrA, [addrB], addrA, memo);
        const payload = {
            result: {
                txID: txId,
                changeAddr: changeAddr
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["txID"]).toBe(txId);
        expect(response["changeAddr"]).toBe(changeAddr);
    }));
    test("can Send 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const txId = "asdfhvl234";
        const memo = buffer_1.Buffer.from("hello world");
        const changeAddr = "Swap-local1";
        const result = api.send(username, password, bintools.b58ToBuffer("6h2s5de1VC65meajE1L2PjvZ1MXvHc3F6eqPCGKuDt4MxiweF"), new bn_js_1.default(10), addrA, [addrB], addrA, memo);
        const payload = {
            result: {
                txID: txId,
                changeAddr: changeAddr
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["txID"]).toBe(txId);
        expect(response["changeAddr"]).toBe(changeAddr);
    }));
    test("can Send Multiple", () => __awaiter(void 0, void 0, void 0, function* () {
        const txId = "asdfhvl234";
        const memo = "hello world";
        const changeAddr = "Swap-local1";
        const result = api.sendMultiple(username, password, [{ assetID: "assetId", amount: 10, to: addrA }], [addrB], addrA, memo);
        const payload = {
            result: {
                txID: txId,
                changeAddr: changeAddr
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["txID"]).toBe(txId);
        expect(response["changeAddr"]).toBe(changeAddr);
    }));
    test("refreshBlockchainID", () => __awaiter(void 0, void 0, void 0, function* () {
        const n3bcID = constants_2.Defaults.network[3].Swap["blockchainID"];
        const n1337bcID = constants_2.Defaults.network[1337].Swap["blockchainID"];
        const testAPI = new api_1.AVMAPI(axia, "/ext/bc/avm", n3bcID);
        const bc1 = testAPI.getBlockchainID();
        expect(bc1).toBe(n3bcID);
        testAPI.refreshBlockchainID();
        const bc2 = testAPI.getBlockchainID();
        expect(bc2).toBe(n1337bcID);
        testAPI.refreshBlockchainID(n3bcID);
        const bc3 = testAPI.getBlockchainID();
        expect(bc3).toBe(n3bcID);
    }));
    test("listAddresses", () => __awaiter(void 0, void 0, void 0, function* () {
        const addresses = [addrA, addrB];
        const result = api.listAddresses(username, password);
        const payload = {
            result: {
                addresses
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(addresses);
    }));
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
    test("getBalance", () => __awaiter(void 0, void 0, void 0, function* () {
        const balance = new bn_js_1.default("100", 10);
        const respobj = {
            balance,
            utxoIDs: [
                {
                    txID: "LUriB3W919F84LwPMMw4sm2fZ4Y76Wgb6msaauEY7i1tFNmtv",
                    outputIndex: 0
                }
            ]
        };
        const result = api.getBalance(addrA, "ATH");
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
    test("getBalance includePartial", () => __awaiter(void 0, void 0, void 0, function* () {
        const balance = new bn_js_1.default("100", 10);
        const respobj = {
            balance,
            utxoIDs: [
                {
                    txID: "LUriB3W919F84LwPMMw4sm2fZ4Y76Wgb6msaauEY7i1tFNmtv",
                    outputIndex: 0
                }
            ]
        };
        const result = api.getBalance(addrA, "ATH", true);
        const payload = {
            result: respobj
        };
        const responseObj = {
            data: payload
        };
        const expectedRequestPayload = {
            id: 1,
            method: "avm.getBalance",
            params: {
                address: addrA,
                assetID: "ATH",
                includePartial: true
            },
            jsonrpc: "2.0"
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        const calledWith = {
            baseURL: "https://127.0.0.1:80",
            data: '{"id":9,"method":"avm.getBalance","params":{"address":"Swap-custom1d6kkj0qh4wcmus3tk59npwt3rluc6en755a58g","assetID":"ATH","includePartial":true},"jsonrpc":"2.0"}',
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            params: {},
            responseType: "json",
            url: "/ext/bc/Swap"
        };
        expect(jest_mock_axios_1.default.request).toBeCalledWith(calledWith);
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response)).toBe(JSON.stringify(respobj));
    }));
    test("exportKey", () => __awaiter(void 0, void 0, void 0, function* () {
        const key = "sdfglvlj2h3v45";
        const result = api.exportKey(username, password, addrA);
        const payload = {
            result: {
                privateKey: key
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(key);
    }));
    test("export", () => __awaiter(void 0, void 0, void 0, function* () {
        const amount = new bn_js_1.default(100);
        const to = "abcdef";
        const assetID = "AXC";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.export(username, password, to, amount, assetID);
        const payload = {
            result: {
                txID: txID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("import", () => __awaiter(void 0, void 0, void 0, function* () {
        const to = "abcdef";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.import(username, password, to, blockchainID);
        const payload = {
            result: {
                txID: txID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(txID);
    }));
    test("createAddress", () => __awaiter(void 0, void 0, void 0, function* () {
        const alias = "randomalias";
        const result = api.createAddress(username, password);
        const payload = {
            result: {
                address: alias
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(alias);
    }));
    test("createFixedCapAsset", () => __awaiter(void 0, void 0, void 0, function* () {
        const kp = new keychain_1.KeyPair(axia.getHRP(), alias);
        kp.importKey(buffer_1.Buffer.from("ef9bf2d4436491c153967c9709dd8e82795bdb9b5ad44ee22c2903005d1cf676", "hex"));
        const denomination = 0;
        const assetID = "8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533";
        const initialHolders = [
            {
                address: "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh",
                amount: "10000"
            },
            {
                address: "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh",
                amount: "50000"
            }
        ];
        const result = api.createFixedCapAsset(username, password, "Some Coin", "SCC", denomination, initialHolders);
        const payload = {
            result: {
                assetID: assetID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(assetID);
    }));
    test("createVariableCapAsset", () => __awaiter(void 0, void 0, void 0, function* () {
        const kp = new keychain_1.KeyPair(axia.getHRP(), alias);
        kp.importKey(buffer_1.Buffer.from("ef9bf2d4436491c153967c9709dd8e82795bdb9b5ad44ee22c2903005d1cf676", "hex"));
        const denomination = 0;
        const assetID = "8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533";
        const minterSets = [
            {
                minters: ["4peJsFvhdn7XjhNF4HWAQy6YaJts27s9q"],
                threshold: 1
            },
            {
                minters: [
                    "dcJ6z9duLfyQTgbjq2wBCowkvcPZHVDF",
                    "2fE6iibqfERz5wenXE6qyvinsxDvFhHZk",
                    "7ieAJbfrGQbpNZRAQEpZCC1Gs1z5gz4HU"
                ],
                threshold: 2
            }
        ];
        const result = api.createVariableCapAsset(username, password, "Some Coin", "SCC", denomination, minterSets);
        const payload = {
            result: {
                assetID: assetID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(assetID);
    }));
    test("mint 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const username = "Collin";
        const password = "Cusce";
        const amount = 2;
        const assetID = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
        const to = "dcJ6z9duLfyQTgbjq2wBCowkvcPZHVDF";
        const minters = [
            "dcJ6z9duLfyQTgbjq2wBCowkvcPZHVDF",
            "2fE6iibqfERz5wenXE6qyvinsxDvFhHZk",
            "7ieAJbfrGQbpNZRAQEpZCC1Gs1z5gz4HU"
        ];
        const result = api.mint(username, password, amount, assetID, to, minters);
        const payload = {
            result: {
                txID: "sometx"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("sometx");
    }));
    test("mint 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const username = "Collin";
        const password = "Cusce";
        const amount = new bn_js_1.default(1);
        const assetID = buffer_1.Buffer.from("f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7", "hex");
        const to = "dcJ6z9duLfyQTgbjq2wBCowkvcPZHVDF";
        const minters = [
            "dcJ6z9duLfyQTgbjq2wBCowkvcPZHVDF",
            "2fE6iibqfERz5wenXE6qyvinsxDvFhHZk",
            "7ieAJbfrGQbpNZRAQEpZCC1Gs1z5gz4HU"
        ];
        const result = api.mint(username, password, amount, assetID, to, minters);
        const payload = {
            result: {
                txID: "sometx"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("sometx");
    }));
    test("getTx", () => __awaiter(void 0, void 0, void 0, function* () {
        const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
        const result = api.getTx(txid);
        const payload = {
            result: {
                tx: "sometx"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("sometx");
    }));
    test("getTxStatus", () => __awaiter(void 0, void 0, void 0, function* () {
        const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
        const result = api.getTxStatus(txid);
        const payload = {
            result: {
                status: "accepted"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("accepted");
    }));
    test("getAssetDescription as string", () => __awaiter(void 0, void 0, void 0, function* () {
        const assetID = buffer_1.Buffer.from("8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533", "hex");
        const assetidstr = bintools.cb58Encode(assetID);
        const result = api.getAssetDescription(assetidstr);
        const payload = {
            result: {
                name: "Collin Coin",
                symbol: "CKC",
                assetID: assetidstr,
                denomination: "10"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.name).toBe("Collin Coin");
        expect(response.symbol).toBe("CKC");
        expect(response.assetID.toString("hex")).toBe(assetID.toString("hex"));
        expect(response.denomination).toBe(10);
    }));
    test("getAssetDescription as Buffer", () => __awaiter(void 0, void 0, void 0, function* () {
        const assetID = buffer_1.Buffer.from("8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533", "hex");
        const assetidstr = bintools.cb58Encode(buffer_1.Buffer.from("8a5d2d32e68bc50036e4d086044617fe4a0a0296b274999ba568ea92da46d533", "hex"));
        const result = api.getAssetDescription(assetID);
        const payload = {
            result: {
                name: "Collin Coin",
                symbol: "CKC",
                assetID: assetidstr,
                denomination: "11"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.name).toBe("Collin Coin");
        expect(response.symbol).toBe("CKC");
        expect(response.assetID.toString("hex")).toBe(assetID.toString("hex"));
        expect(response.denomination).toBe(11);
    }));
    test("getUTXOs", () => __awaiter(void 0, void 0, void 0, function* () {
        // Payment
        const OPUTXOstr1 = bintools.cb58Encode(buffer_1.Buffer.from("000038d1b9f1138672da6fb6c35125539276a9acc2a668d63bea6ba3c795e2edb0f5000000013e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd3558000000070000000000004dd500000000000000000000000100000001a36fd0c2dbcab311731dde7ef1514bd26fcdc74d", "hex"));
        const OPUTXOstr2 = bintools.cb58Encode(buffer_1.Buffer.from("0000c3e4823571587fe2bdfc502689f5a8238b9d0ea7f3277124d16af9de0d2d9911000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex"));
        const OPUTXOstr3 = bintools.cb58Encode(buffer_1.Buffer.from("0000f29dba61fda8d57a911e7f8810f935bde810d3f8d495404685bdb8d9d8545e86000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex"));
        const set = new utxos_1.UTXOSet();
        set.add(OPUTXOstr1);
        set.addArray([OPUTXOstr2, OPUTXOstr3]);
        const persistOpts = new persistenceoptions_1.PersistanceOptions("test", true, "union");
        expect(persistOpts.getMergeRule()).toBe("union");
        let addresses = set
            .getAddresses()
            .map((a) => api.addressFromBuffer(a));
        let result = api.getUTXOs(addresses, api.getBlockchainID(), 0, undefined, persistOpts);
        const payload = {
            result: {
                numFetched: 3,
                utxos: [OPUTXOstr1, OPUTXOstr2, OPUTXOstr3],
                stopIndex: { address: "a", utxo: "b" }
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        let response = (yield result).utxos;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response.getAllUTXOStrings().sort())).toBe(JSON.stringify(set.getAllUTXOStrings().sort()));
        addresses = set.getAddresses().map((a) => api.addressFromBuffer(a));
        result = api.getUTXOs(addresses, api.getBlockchainID(), 0, undefined, persistOpts);
        jest_mock_axios_1.default.mockResponse(responseObj);
        response = (yield result).utxos;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(2);
        expect(JSON.stringify(response.getAllUTXOStrings().sort())).toBe(JSON.stringify(set.getAllUTXOStrings().sort()));
    }));
    describe("Transactions", () => {
        let set;
        let keymgr2;
        let keymgr3;
        let addrs1;
        let addrs2;
        let addrs3;
        let addressbuffs = [];
        let addresses = [];
        let utxos;
        let inputs;
        let outputs;
        let ops;
        let amnt = 10000;
        const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update("mary had a little lamb").digest());
        const NFTassetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
            .update("I can't stand it, I know you planned it, I'mma set straight this Watergate.")
            .digest());
        let secpbase1;
        let secpbase2;
        let secpbase3;
        let initialState;
        let nftpbase1;
        let nftpbase2;
        let nftpbase3;
        let nftInitialState;
        let nftutxoids = [];
        let fungutxoids = [];
        let avm;
        const fee = 10;
        const name = "Mortycoin is the dumb as a sack of hammers.";
        const symbol = "morT";
        const denomination = 8;
        let secpMintOut1;
        let secpMintOut2;
        let secpMintTXID;
        let secpMintUTXO;
        let secpMintXferOut1;
        let secpMintXferOut2;
        let secpMintOp;
        let xfersecpmintop;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            avm = new api_1.AVMAPI(axia, "/ext/bc/Swap", blockchainID);
            const result = avm.getAXCAssetID(true);
            const payload = {
                result: {
                    name,
                    symbol,
                    assetID: bintools.cb58Encode(assetID),
                    denomination: denomination
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            yield result;
            set = new utxos_1.UTXOSet();
            avm.newKeyChain();
            keymgr2 = new keychain_1.KeyChain(axia.getHRP(), alias);
            keymgr3 = new keychain_1.KeyChain(axia.getHRP(), alias);
            addrs1 = [];
            addrs2 = [];
            addrs3 = [];
            utxos = [];
            inputs = [];
            outputs = [];
            ops = [];
            nftutxoids = [];
            fungutxoids = [];
            const pload = buffer_1.Buffer.alloc(1024);
            pload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
            for (let i = 0; i < 3; i++) {
                addrs1.push(avm.addressFromBuffer(avm.keyChain().makeKey().getAddress()));
                addrs2.push(avm.addressFromBuffer(keymgr2.makeKey().getAddress()));
                addrs3.push(avm.addressFromBuffer(keymgr3.makeKey().getAddress()));
            }
            const amount = constants_4.ONEAXC.mul(new bn_js_1.default(amnt));
            addressbuffs = avm.keyChain().getAddresses();
            addresses = addressbuffs.map((a) => avm.addressFromBuffer(a));
            const locktime = new bn_js_1.default(54321);
            const threshold = 3;
            for (let i = 0; i < 5; i++) {
                let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                    .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                    .digest());
                let txidx = buffer_1.Buffer.alloc(4);
                txidx.writeUInt32BE(i, 0);
                const out = new outputs_1.SECPTransferOutput(amount, addressbuffs, locktime, threshold);
                const xferout = new outputs_1.TransferableOutput(assetID, out);
                outputs.push(xferout);
                const u = new utxos_1.UTXO();
                u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
                fungutxoids.push(u.getUTXOID());
                utxos.push(u);
                txid = u.getTxID();
                txidx = u.getOutputIdx();
                const asset = u.getAssetID();
                const input = new inputs_1.SECPTransferInput(amount);
                const xferinput = new inputs_1.TransferableInput(txid, txidx, asset, input);
                inputs.push(xferinput);
                const nout = new outputs_1.NFTTransferOutput(1000 + i, pload, addressbuffs, locktime, threshold);
                const op = new ops_1.NFTTransferOperation(nout);
                const nfttxid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                    .update(bintools.fromBNToBuffer(new bn_js_1.default(1000 + i), 32))
                    .digest());
                const nftutxo = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, nfttxid, 1000 + i, NFTassetID, nout);
                nftutxoids.push(nftutxo.getUTXOID());
                const xferop = new ops_1.TransferableOperation(NFTassetID, [nftutxo.getUTXOID()], op);
                ops.push(xferop);
                utxos.push(nftutxo);
            }
            set.addArray(utxos);
            secpbase1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(777), addrs3.map((a) => avm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(888), addrs2.map((a) => avm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(999), addrs2.map((a) => avm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            initialState = new initialstates_1.InitialStates();
            initialState.addOutput(secpbase1, constants_1.AVMConstants.SECPFXID);
            initialState.addOutput(secpbase2, constants_1.AVMConstants.SECPFXID);
            initialState.addOutput(secpbase3, constants_1.AVMConstants.SECPFXID);
            nftpbase1 = new outputs_1.NFTMintOutput(0, addrs1.map((a) => api.parseAddress(a)), locktime, 1);
            nftpbase2 = new outputs_1.NFTMintOutput(1, addrs2.map((a) => api.parseAddress(a)), locktime, 1);
            nftpbase3 = new outputs_1.NFTMintOutput(2, addrs3.map((a) => api.parseAddress(a)), locktime, 1);
            nftInitialState = new initialstates_1.InitialStates();
            nftInitialState.addOutput(nftpbase1, constants_1.AVMConstants.NFTFXID);
            nftInitialState.addOutput(nftpbase2, constants_1.AVMConstants.NFTFXID);
            nftInitialState.addOutput(nftpbase3, constants_1.AVMConstants.NFTFXID);
            secpMintOut1 = new outputs_1.SECPMintOutput(addressbuffs, new bn_js_1.default(0), 1);
            secpMintOut2 = new outputs_1.SECPMintOutput(addressbuffs, new bn_js_1.default(0), 1);
            secpMintTXID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(bintools.fromBNToBuffer(new bn_js_1.default(1337), 32))
                .digest());
            secpMintUTXO = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, secpMintTXID, 0, assetID, secpMintOut1);
            secpMintXferOut1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(123), addrs3.map((a) => avm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 2);
            secpMintXferOut2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(456), [avm.parseAddress(addrs2[0])], (0, helperfunctions_1.UnixNow)(), 1);
            secpMintOp = new ops_1.SECPMintOperation(secpMintOut1, secpMintXferOut1);
            set.add(secpMintUTXO);
            xfersecpmintop = new ops_1.TransferableOperation(assetID, [secpMintUTXO.getUTXOID()], secpMintOp);
        }));
        test("getDefaultMintTxFee", () => {
            expect(avm.getDefaultMintTxFee().toString()).toBe("1000000");
        });
        test("signTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu1 = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const txu2 = set.buildBaseTx(networkID, bintools.cb58Decode(blockchainID), new bn_js_1.default(amnt), assetID, addrs3.map((a) => avm.parseAddress(a)), addrs1.map((a) => avm.parseAddress(a)), addrs1.map((a) => avm.parseAddress(a)), avm.getTxFee(), assetID, undefined, (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            const tx1 = avm.signTx(txu1);
            const tx2 = avm.signTx(txu2);
            expect(tx2.toBuffer().toString("hex")).toBe(tx1.toBuffer().toString("hex"));
            expect(tx2.toString()).toBe(tx1.toString());
        }));
        test("buildBaseTx1", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu1 = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1, new payload_1.UTF8Payload("hello world").getContent());
            const memobuf = buffer_1.Buffer.from("hello world");
            const txu2 = set.buildBaseTx(networkID, bintools.cb58Decode(blockchainID), new bn_js_1.default(amnt), assetID, addrs3.map((a) => avm.parseAddress(a)), addrs1.map((a) => avm.parseAddress(a)), addrs1.map((a) => avm.parseAddress(a)), avm.getTxFee(), assetID, memobuf, (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
        }));
        test("xssPreventionObject", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu1 = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const tx1 = avm.signTx(txu1);
            const tx1obj = tx1.serialize("hex");
            const sanitized = tx1.sanitizeObject(tx1obj);
            expect(tx1obj).toStrictEqual(sanitized);
        }));
        test("xssPreventionHTML", () => __awaiter(void 0, void 0, void 0, function* () {
            const dirtyDom = "<img src='https://x' onerror=alert(1)//>";
            const sanitizedString = `<img src="https://x" />`;
            const txu1 = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const tx1 = avm.signTx(txu1);
            const tx1obj = tx1.serialize("hex");
            const dirtyObj = Object.assign(Object.assign({}, tx1obj), { dirtyDom: dirtyDom });
            const sanitizedObj = tx1.sanitizeObject(dirtyObj);
            expect(sanitizedObj.dirtyDom).toBe(sanitizedString);
        }));
        test("buildBaseTx2", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu1 = yield avm.buildBaseTx(set, new bn_js_1.default(amnt).sub(new bn_js_1.default(100)), bintools.cb58Encode(assetID), addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"));
            const txu2 = set.buildBaseTx(networkID, bintools.cb58Decode(blockchainID), new bn_js_1.default(amnt).sub(new bn_js_1.default(100)), assetID, addrs3.map((a) => avm.parseAddress(a)), addrs1.map((a) => avm.parseAddress(a)), addrs2.map((a) => avm.parseAddress(a)), avm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const outies = txu1
                .getTransaction()
                .getOuts()
                .sort(outputs_1.TransferableOutput.comparator());
            expect(outies.length).toBe(2);
            const outaddr0 = outies[0]
                .getOutput()
                .getAddresses()
                .map((a) => avm.addressFromBuffer(a));
            const outaddr1 = outies[1]
                .getOutput()
                .getAddresses()
                .map((a) => avm.addressFromBuffer(a));
            const testaddr2 = JSON.stringify(addrs2.sort());
            const testaddr3 = JSON.stringify(addrs3.sort());
            const testout0 = JSON.stringify(outaddr0.sort());
            const testout1 = JSON.stringify(outaddr1.sort());
            expect((testaddr2 == testout0 && testaddr3 == testout1) ||
                (testaddr3 == testout0 && testaddr2 == testout1)).toBe(true);
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "BaseTx");
        }));
        test("issueTx Serialized", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const tx = avm.signTx(txu);
            const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
            const result = avm.issueTx(tx.toString());
            const payload = {
                result: {
                    txID: txid
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const response = yield result;
            expect(response).toBe(txid);
        }));
        test("issueTx Buffer", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const tx = avm.signTx(txu);
            const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
            const result = avm.issueTx(tx.toBuffer());
            const payload = {
                result: {
                    txID: txid
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const response = yield result;
            expect(response).toBe(txid);
        }));
        test("issueTx Class Tx", () => __awaiter(void 0, void 0, void 0, function* () {
            const txu = yield avm.buildBaseTx(set, new bn_js_1.default(amnt), bintools.cb58Encode(assetID), addrs3, addrs1, addrs1);
            const tx = avm.signTx(txu);
            const txid = "f966750f438867c3c9828ddcdbe660e21ccdbb36a9276958f011ba472f75d4e7";
            const result = avm.issueTx(tx);
            const payload = {
                result: {
                    txID: txid
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const response = yield result;
            expect(response).toBe(txid);
        }));
        test("buildCreateAssetTx - Fixed Cap", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setCreationTxFee(new bn_js_1.default(fee));
            const txu1 = yield avm.buildCreateAssetTx(set, addrs1, addrs2, initialState, name, symbol, denomination);
            const txu2 = set.buildCreateAssetTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), addrs1.map((a) => avm.parseAddress(a)), addrs2.map((a) => avm.parseAddress(a)), initialState, name, symbol, denomination, undefined, utils_1.CENTIAXC, assetID);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "CreateAssetTx");
        }));
        test("buildCreateAssetTx - Variable Cap", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setCreationTxFee(new bn_js_1.default(constants_2.Defaults.network[12345].Core["creationTxFee"]));
            const mintOutputs = [secpMintOut1, secpMintOut2];
            const txu1 = yield avm.buildCreateAssetTx(set, addrs1, addrs2, initialState, name, symbol, denomination, mintOutputs);
            const txu2 = set.buildCreateAssetTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), addrs1.map((a) => avm.parseAddress(a)), addrs2.map((a) => avm.parseAddress(a)), initialState, name, symbol, denomination, mintOutputs, avm.getCreationTxFee(), assetID);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
        }));
        test("buildSECPMintTx", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setTxFee(new bn_js_1.default(fee));
            const newMinter = new outputs_1.SECPMintOutput(addrs3.map((a) => avm.parseAddress(a)), new bn_js_1.default(0), 1);
            const txu1 = yield avm.buildSECPMintTx(set, newMinter, secpMintXferOut1, addrs1, addrs2, secpMintUTXO.getUTXOID());
            const txu2 = set.buildSECPMintTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), newMinter, secpMintXferOut1, addrs1.map((a) => avm.parseAddress(a)), addrs2.map((a) => avm.parseAddress(a)), secpMintUTXO.getUTXOID(), utils_2.MILLIAXC, assetID);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "SECPMintTx");
        }));
        test("buildCreateNFTAssetTx", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setCreationTxFee(new bn_js_1.default(constants_2.Defaults.network[12345].Core["creationTxFee"]));
            const minterSets = [new minterset_1.MinterSet(1, addrs1)];
            const locktime = new bn_js_1.default(0);
            const txu1 = yield avm.buildCreateNFTAssetTx(set, addrs1, addrs2, minterSets, name, symbol, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)(), locktime);
            const txu2 = set.buildCreateNFTAssetTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), addrs1.map((a) => avm.parseAddress(a)), addrs2.map((a) => avm.parseAddress(a)), minterSets, name, symbol, avm.getCreationTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), locktime);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "CreateNFTAssetTx");
        }));
        test("buildCreateNFTMintTx", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setTxFee(new bn_js_1.default(fee));
            const groupID = 0;
            const locktime = new bn_js_1.default(0);
            const threshold = 1;
            const payload = buffer_1.Buffer.from("Axia");
            const addrbuff1 = addrs1.map((a) => avm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => avm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => avm.parseAddress(a));
            const outputOwners = [];
            const oo = new output_1.OutputOwners(addrbuff3, locktime, threshold);
            outputOwners.push();
            const txu1 = yield avm.buildCreateNFTMintTx(set, oo, addrs1, addrs2, nftutxoids, groupID, payload, undefined, (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildCreateNFTMintTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), [oo], addrbuff1, addrbuff2, nftutxoids, groupID, payload, avm.getTxFee(), assetID, undefined, (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            outputOwners.push(oo);
            outputOwners.push(new output_1.OutputOwners(addrbuff3, locktime, threshold + 1));
            const txu3 = yield avm.buildCreateNFTMintTx(set, outputOwners, addrs1, addrs2, nftutxoids, groupID, payload, undefined, (0, helperfunctions_1.UnixNow)());
            const txu4 = set.buildCreateNFTMintTx(axia.getNetworkID(), bintools.cb58Decode(avm.getBlockchainID()), outputOwners, addrbuff1, addrbuff2, nftutxoids, groupID, payload, avm.getTxFee(), assetID, undefined, (0, helperfunctions_1.UnixNow)());
            expect(txu4.toBuffer().toString("hex")).toBe(txu3.toBuffer().toString("hex"));
            expect(txu4.toString()).toBe(txu3.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "CreateNFTMintTx");
        }));
        test("buildNFTTransferTx", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setTxFee(new bn_js_1.default(fee));
            const pload = buffer_1.Buffer.alloc(1024);
            pload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
            const addrbuff1 = addrs1.map((a) => avm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => avm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => avm.parseAddress(a));
            const txu1 = yield avm.buildNFTTransferTx(set, addrs3, addrs1, addrs2, nftutxoids[1], new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            const txu2 = set.buildNFTTransferTx(networkID, bintools.cb58Decode(blockchainID), addrbuff3, addrbuff1, addrbuff2, [nftutxoids[1]], avm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "NFTTransferTx");
        }));
        test("buildImportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const locktime = new bn_js_1.default(0);
            const threshold = 1;
            avm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => avm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => avm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => avm.parseAddress(a));
            const fungutxo = set.getUTXO(fungutxoids[1]);
            const fungutxostr = fungutxo.toString();
            const result = avm.buildImportTx(set, addrs1, constants_3.PlatformChainID, addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
            const payload = {
                result: {
                    utxos: [fungutxostr]
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const txu1 = yield result;
            const txu2 = set.buildImportTx(networkID, bintools.cb58Decode(blockchainID), addrbuff3, addrbuff1, addrbuff2, [fungutxo], bintools.cb58Decode(constants_3.PlatformChainID), avm.getTxFee(), yield avm.getAXCAssetID(), new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ImportTx");
        }));
        test("buildExportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            avm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => avm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => avm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => avm.parseAddress(a));
            const amount = new bn_js_1.default(90);
            const type = "bech32";
            const txu1 = yield avm.buildExportTx(set, amount, bintools.cb58Decode(constants_3.PlatformChainID), addrbuff3.map((a) => serialization.bufferToType(a, type, axia.getHRP(), "Core")), addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, bintools.cb58Decode(constants_3.PlatformChainID), avm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const txu3 = yield avm.buildExportTx(set, amount, constants_3.PlatformChainID, addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu4 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, undefined, avm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu4.toBuffer().toString("hex")).toBe(txu3.toBuffer().toString("hex"));
            expect(txu4.toString()).toBe(txu3.toString());
            const tx1 = txu1.sign(avm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            const tx2obj = tx2.serialize("hex");
            const tx2str = JSON.stringify(tx2obj);
            expect(tx1obj).toStrictEqual(tx2obj);
            expect(tx1str).toStrictEqual(tx2str);
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(avm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            const tx4obj = tx4.serialize(display);
            const tx4str = JSON.stringify(tx4obj);
            expect(tx3obj).toStrictEqual(tx4obj);
            expect(tx3str).toStrictEqual(tx4str);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ExportTx");
        }));
        test("buildGenesis", () => __awaiter(void 0, void 0, void 0, function* () {
            const genesisData = {
                genesisData: {
                    assetAlias1: {
                        name: "human readable name",
                        symbol: "AVAL",
                        initialState: {
                            fixedCap: [
                                {
                                    amount: 1000,
                                    address: "A"
                                },
                                {
                                    amount: 5000,
                                    address: "B"
                                }
                            ]
                        }
                    },
                    assetAliasCanBeAnythingUnique: {
                        name: "human readable name",
                        symbol: "AVAL",
                        initialState: {
                            variableCap: [
                                {
                                    minters: ["A", "B"],
                                    threshold: 1
                                },
                                {
                                    minters: ["A", "B", "C"],
                                    threshold: 2
                                }
                            ]
                        }
                    }
                }
            };
            const bytes = "111TNWzUtHKoSvxohjyfEwE2X228ZDGBngZ4mdMUVMnVnjtnawW1b1zbAhzyAM1v6d7ECNj6DXsT7qDmhSEf3DWgXRj7ECwBX36ZXFc9tWVB2qHURoUfdDvFsBeSRqatCmj76eZQMGZDgBFRNijRhPNKUap7bCeKpHDtuCZc4YpPkd4mR84dLL2AL1b4K46eirWKMaFVjA5btYS4DnyUx5cLpAq3d35kEdNdU5zH3rTU18S4TxYV8voMPcLCTZ3h4zRsM5jW1cUzjWVvKg7uYS2oR9qXRFcgy1gwNTFZGstySuvSF7MZeZF4zSdNgC4rbY9H94RVhqe8rW7MXqMSZB6vBTB2BpgF6tNFehmYxEXwjaKRrimX91utvZe9YjgGbDr8XHsXCnXXg4ZDCjapCy4HmmRUtUoAduGNBdGVMiwE9WvVbpMFFcNfgDXGz9NiatgSnkxQALTHvGXXm8bn4CoLFzKnAtq3KwiWqHmV3GjFYeUm3m8Zee9VDfZAvDsha51acxfto1htstxYu66DWpT36YT18WSbxibZcKXa7gZrrsCwyzid8CCWw79DbaLCUiq9u47VqofG1kgxwuuyHb8NVnTgRTkQASSbj232fyG7YeX4mAvZY7a7K7yfSyzJaXdUdR7aLeCdLP6mbFDqUMrN6YEkU2X8d4Ck3T";
            const result = api.buildGenesis(genesisData);
            const payload = {
                result: {
                    bytes: bytes
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            const response = yield result;
            expect(response).toBe(bytes);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F2bS9hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBQ3ZDLDZCQUEwQjtBQUMxQixtREFBa0Q7QUFDbEQsNkRBQWtFO0FBQ2xFLG9DQUFnQztBQUNoQyxrREFBc0I7QUFDdEIsMkVBQWtEO0FBQ2xELHVEQUEyRDtBQUMzRCx5REFHcUM7QUFDckMsOERBQW9DO0FBQ3BDLGlEQUF5RDtBQUN6RCwrREFBOEQ7QUFDOUQsMkRBTXNDO0FBQ3RDLG1EQUlrQztBQUNsQywrQ0FBZ0M7QUFDaEMsd0RBQXdEO0FBQ3hELHVFQUFtRTtBQUNuRSw0REFBdUQ7QUFDdkQsd0VBQTREO0FBQzVELHVEQUF5RDtBQUN6RCwrREFBMkQ7QUFDM0QsNERBQThEO0FBQzlELDhFQUEwRTtBQUMxRSw0REFBcUQ7QUFDckQsb0VBS3lDO0FBT3pDLHFDQUFvQztBQUNwQyxxQ0FBb0M7QUFFcEM7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2hFLE1BQU0saUJBQWlCLEdBQVksS0FBSyxDQUFBO0FBQ3hDLE1BQU0sT0FBTyxHQUF1QixTQUFTLENBQUE7QUFFN0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFvQixFQUFFLElBQVksRUFBUSxFQUFFO0lBQzlELElBQUksaUJBQWlCLEVBQUU7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxJQUFJLENBQUMsU0FBUyxDQUNaLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxHQUFHLGlCQUFpQixDQUFDLENBQ3hFLENBQ0YsQ0FBQTtRQUNELE9B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SUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsTUFBTSxHQUFHLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN6QyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRW5DLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQs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QUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcbmltcG9ydCB7IEFWTUFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vYXBpXCJcbmltcG9ydCB7IEtleVBhaXIsIEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9rZXljaGFpblwiXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3V0eG9zXCJcbmltcG9ydCB7XG4gIFRyYW5zZmVyYWJsZUlucHV0LFxuICBTRUNQVHJhbnNmZXJJbnB1dFxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2lucHV0c1wiXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxuaW1wb3J0IHsgVW5zaWduZWRUeCwgVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3R4XCJcbmltcG9ydCB7IEFWTUNvbnN0YW50cyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vY29uc3RhbnRzXCJcbmltcG9ydCB7XG4gIFRyYW5zZmVyYWJsZU91dHB1dCxcbiAgU0VDUFRyYW5zZmVyT3V0cHV0LFxuICBORlRNaW50T3V0cHV0LFxuICBORlRUcmFuc2Zlck91dHB1dCxcbiAgU0VDUE1pbnRPdXRwdXRcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9vdXRwdXRzXCJcbmltcG9ydCB7XG4gIE5GVFRyYW5zZmVyT3BlcmF0aW9uLFxuICBUcmFuc2ZlcmFibGVPcGVyYXRpb24sXG4gIFNFQ1BNaW50T3BlcmF0aW9uXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vb3BzXCJcbmltcG9ydCAqIGFzIGJlY2gzMiBmcm9tIFwiYmVjaDMyXCJcbmltcG9ydCB7IFVURjhQYXlsb2FkIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9wYXlsb2FkXCJcbmltcG9ydCB7IEluaXRpYWxTdGF0ZXMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2luaXRpYWxzdGF0ZXNcIlxuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBVbml4Tm93IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9oZWxwZXJmdW5jdGlvbnNcIlxuaW1wb3J0IHsgT3V0cHV0T3duZXJzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9jb21tb24vb3V0cHV0XCJcbmltcG9ydCB7IE1pbnRlclNldCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vbWludGVyc2V0XCJcbmltcG9ydCB7IFBsYXRmb3JtQ2hhaW5JRCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7IFBlcnNpc3RhbmNlT3B0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvcGVyc2lzdGVuY2VvcHRpb25zXCJcbmltcG9ydCB7IE9ORUFYQyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7XG4gIFNlcmlhbGl6YWJsZSxcbiAgU2VyaWFsaXphdGlvbixcbiAgU2VyaWFsaXplZEVuY29kaW5nLFxuICBTZXJpYWxpemVkVHlwZVxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcbmltcG9ydCB7XG4gIEdldEJhbGFuY2VSZXNwb25zZSxcbiAgU2VuZE11bHRpcGxlUmVzcG9uc2UsXG4gIFNlbmRSZXNwb25zZVxufSBmcm9tIFwic3JjL2FwaXMvYXZtL2ludGVyZmFjZXNcIlxuaW1wb3J0IHsgQ0VOVElBWEMgfSBmcm9tIFwic3JjL3V0aWxzXCJcbmltcG9ydCB7IE1JTExJQVhDIH0gZnJvbSBcInNyYy91dGlsc1wiXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXG5jb25zdCBkdW1wU2VyYWlsaXphdGlvbjogYm9vbGVhbiA9IGZhbHNlXG5jb25zdCBkaXNwbGF5OiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImRpc3BsYXlcIlxuXG5jb25zdCBzZXJpYWx6ZWl0ID0gKGFUaGluZzogU2VyaWFsaXphYmxlLCBuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgaWYgKGR1bXBTZXJhaWxpemF0aW9uKSB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc2VyaWFsaXphdGlvbi5zZXJpYWxpemUoYVRoaW5nLCBcImF2bVwiLCBcImhleFwiLCBuYW1lICsgXCIgLS0gSGV4IEVuY29kZWRcIilcbiAgICAgIClcbiAgICApXG4gICAgY29uc29sZS5sb2coXG4gICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc2VyaWFsaXphdGlvbi5zZXJpYWxpemUoXG4gICAgICAgICAgYVRoaW5nLFxuICAgICAgICAgIFwiYXZtXCIsXG4gICAgICAgICAgXCJkaXNwbGF5XCIsXG4gICAgICAgICAgbmFtZSArIFwiIC0tIEh1bWFuLVJlYWRhYmxlXCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcbiAgfVxufVxuXG5kZXNjcmliZShcIkFWTUFQSVwiLCAoKTogdm9pZCA9PiB7XG4gIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gMTMzN1xuICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXS5Td2FwLmJsb2NrY2hhaW5JRFxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxuICBjb25zdCBwcm90b2NvbDogc3RyaW5nID0gXCJodHRwc1wiXG5cbiAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQXhpYUNvaW5cIlxuICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJwYXNzd29yZFwiXG5cbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxuICAgIGlwLFxuICAgIHBvcnQsXG4gICAgcHJvdG9jb2wsXG4gICAgbmV0d29ya0lELFxuICAgIHVuZGVmaW5lZCxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkLFxuICAgIHRydWVcbiAgKVxuICBsZXQgYXBpOiBBVk1BUElcbiAgbGV0IGFsaWFzOiBzdHJpbmdcblxuICBjb25zdCBhZGRyQTogc3RyaW5nID0gYFN3YXAtJHtiZWNoMzIuYmVjaDMyLmVuY29kZShcbiAgICBheGlhLmdldEhSUCgpLFxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJCNkQ0djFWdFBZTGJpVXZZWHRXNFB4OG9FOWltQzJ2R1dcIilcbiAgICApXG4gICl9YFxuICBjb25zdCBhZGRyQjogc3RyaW5nID0gYFN3YXAtJHtiZWNoMzIuYmVjaDMyLmVuY29kZShcbiAgICBheGlhLmdldEhSUCgpLFxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJQNXdkUnVaZWFEdDI4ZUhNUDVTM3c5WmRvQmZvN3d1ekZcIilcbiAgICApXG4gICl9YFxuICBjb25zdCBhZGRyQzogc3RyaW5nID0gYFN3YXAtJHtiZWNoMzIuYmVjaDMyLmVuY29kZShcbiAgICBheGlhLmdldEhSUCgpLFxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCI2WTNreXNqRjlqbkhuWWtkUzl5R0F1b0h5YWUyZU5tZVZcIilcbiAgICApXG4gICl9YFxuXG4gIGJlZm9yZUFsbCgoKTogdm9pZCA9PiB7XG4gICAgYXBpID0gbmV3IEFWTUFQSShheGlhLCBcIi9leHQvYmMvU3dhcFwiLCBibG9ja2NoYWluSUQpXG4gICAgYWxpYXMgPSBhcGkuZ2V0QmxvY2tjaGFpbkFsaWFzKClcbiAgfSlcblxuICBhZnRlckVhY2goKCk6IHZvaWQgPT4ge1xuICAgIG1vY2tBeGlvcy5yZXNldCgpXG4gIH0pXG5cbiAgdGVzdChcImZhaWxzIHRvIHNlbmQgd2l0aCBpbmNvcnJlY3QgdXNlcm5hbWVcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG1lbW86IHN0cmluZyA9IFwiaGVsbG8gd29ybGRcIlxuICAgIGNvbnN0IGluY29ycmVjdFVzZXJOYW1lOiBzdHJpbmcgPSBcImFzZGZhc2Rmc2FcIlxuICAgIGNvbnN0IG1lc3NhZ2U6IHN0cmluZyA9IGBwcm9ibGVtIHJldHJpZXZpbmcgdXNlcjogaW5jb3JyZWN0IHBhc3N3b3JkIGZvciB1c2VyIFwiJHtpbmNvcnJlY3RVc2VyTmFtZX1cImBcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8U2VuZFJlc3BvbnNlPiA9IGFwaS5zZW5kKFxuICAgICAgaW5jb3JyZWN0VXNlck5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIFwiYXNzZXRJZFwiLFxuICAgICAgMTAsXG4gICAgICBhZGRyQSxcbiAgICAgIFthZGRyQl0sXG4gICAgICBhZGRyQSxcbiAgICAgIG1lbW9cbiAgICApXG5cbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgY29kZTogLTMyMDAwLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBkYXRhOiBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZVtcImNvZGVcIl0pLnRvQmUoLTMyMDAwKVxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1lc3NhZ2VcIl0pLnRvQmUobWVzc2FnZSlcbiAgfSlcblxuICB0ZXN0KFwiZmFpbHMgdG8gc2VuZCB3aXRoIGluY29ycmVjdCBQYXNzd29yZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbWVtbzogc3RyaW5nID0gXCJoZWxsbyB3b3JsZFwiXG4gICAgY29uc3QgaW5jb3JyZWN0UGFzc3dvcmQ6IHN0cmluZyA9IFwiYXNkZmFzZGZzYVwiXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gYHByb2JsZW0gcmV0cmlldmluZyB1c2VyOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCIke2luY29ycmVjdFBhc3N3b3JkfVwiYFxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxTZW5kUmVzcG9uc2U+ID0gYXBpLnNlbmQoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIGluY29ycmVjdFBhc3N3b3JkLFxuICAgICAgXCJhc3NldElkXCIsXG4gICAgICAxMCxcbiAgICAgIGFkZHJBLFxuICAgICAgW2FkZHJCXSxcbiAgICAgIGFkZHJBLFxuICAgICAgbWVtb1xuICAgIClcblxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBjb2RlOiAtMzIwMDAsXG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGRhdGE6IG51bGxcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY29kZVwiXSkudG9CZSgtMzIwMDApXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wibWVzc2FnZVwiXSkudG9CZShtZXNzYWdlKVxuICB9KVxuXG4gIHRlc3QoXCJjYW4gU2VuZCAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eElkOiBzdHJpbmcgPSBcImFzZGZodmwyMzRcIlxuICAgIGNvbnN0IG1lbW86IHN0cmluZyA9IFwiaGVsbG8gd29ybGRcIlxuICAgIGNvbnN0IGNoYW5nZUFkZHI6IHN0cmluZyA9IFwiU3dhcC1sb2NhbDFcIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxTZW5kUmVzcG9uc2U+ID0gYXBpLnNlbmQoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgXCJhc3NldElkXCIsXG4gICAgICAxMCxcbiAgICAgIGFkZHJBLFxuICAgICAgW2FkZHJCXSxcbiAgICAgIGFkZHJBLFxuICAgICAgbWVtb1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdHhJZCxcbiAgICAgICAgY2hhbmdlQWRkcjogY2hhbmdlQWRkclxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2VbXCJ0eElEXCJdKS50b0JlKHR4SWQpXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY2hhbmdlQWRkclwiXSkudG9CZShjaGFuZ2VBZGRyKVxuICB9KVxuXG4gIHRlc3QoXCJjYW4gU2VuZCAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eElkOiBzdHJpbmcgPSBcImFzZGZodmwyMzRcIlxuICAgIGNvbnN0IG1lbW86IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFwiaGVsbG8gd29ybGRcIilcbiAgICBjb25zdCBjaGFuZ2VBZGRyOiBzdHJpbmcgPSBcIlN3YXAtbG9jYWwxXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8U2VuZFJlc3BvbnNlPiA9IGFwaS5zZW5kKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGJpbnRvb2xzLmI1OFRvQnVmZmVyKFwiNmgyczVkZTFWQzY1bWVhakUxTDJQanZaMU1YdkhjM0Y2ZXFQQ0dLdUR0NE14aXdlRlwiKSxcbiAgICAgIG5ldyBCTigxMCksXG4gICAgICBhZGRyQSxcbiAgICAgIFthZGRyQl0sXG4gICAgICBhZGRyQSxcbiAgICAgIG1lbW9cbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IHR4SWQsXG4gICAgICAgIGNoYW5nZUFkZHI6IGNoYW5nZUFkZHJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlW1widHhJRFwiXSkudG9CZSh0eElkKVxuICAgIGV4cGVjdChyZXNwb25zZVtcImNoYW5nZUFkZHJcIl0pLnRvQmUoY2hhbmdlQWRkcilcbiAgfSlcblxuICB0ZXN0KFwiY2FuIFNlbmQgTXVsdGlwbGVcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHR4SWQ6IHN0cmluZyA9IFwiYXNkZmh2bDIzNFwiXG4gICAgY29uc3QgbWVtbzogc3RyaW5nID0gXCJoZWxsbyB3b3JsZFwiXG4gICAgY29uc3QgY2hhbmdlQWRkcjogc3RyaW5nID0gXCJTd2FwLWxvY2FsMVwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFNlbmRNdWx0aXBsZVJlc3BvbnNlPiA9IGFwaS5zZW5kTXVsdGlwbGUoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgW3sgYXNzZXRJRDogXCJhc3NldElkXCIsIGFtb3VudDogMTAsIHRvOiBhZGRyQSB9XSxcbiAgICAgIFthZGRyQl0sXG4gICAgICBhZGRyQSxcbiAgICAgIG1lbW9cbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IHR4SWQsXG4gICAgICAgIGNoYW5nZUFkZHI6IGNoYW5nZUFkZHJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBTZW5kTXVsdGlwbGVSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2VbXCJ0eElEXCJdKS50b0JlKHR4SWQpXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY2hhbmdlQWRkclwiXSkudG9CZShjaGFuZ2VBZGRyKVxuICB9KVxuXG4gIHRlc3QoXCJyZWZyZXNoQmxvY2tjaGFpbklEXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBuM2JjSUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbM10uU3dhcFtcImJsb2NrY2hhaW5JRFwiXVxuICAgIGNvbnN0IG4xMzM3YmNJRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1sxMzM3XS5Td2FwW1wiYmxvY2tjaGFpbklEXCJdXG4gICAgY29uc3QgdGVzdEFQSTogQVZNQVBJID0gbmV3IEFWTUFQSShheGlhLCBcIi9leHQvYmMvYXZtXCIsIG4zYmNJRClcbiAgICBjb25zdCBiYzE6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcbiAgICBleHBlY3QoYmMxKS50b0JlKG4zYmNJRClcblxuICAgIHRlc3RBUEkucmVmcmVzaEJsb2NrY2hhaW5JRCgpXG4gICAgY29uc3QgYmMyOiBzdHJpbmcgPSB0ZXN0QVBJLmdldEJsb2NrY2hhaW5JRCgpXG4gICAgZXhwZWN0KGJjMikudG9CZShuMTMzN2JjSUQpXG5cbiAgICB0ZXN0QVBJLnJlZnJlc2hCbG9ja2NoYWluSUQobjNiY0lEKVxuICAgIGNvbnN0IGJjMzogc3RyaW5nID0gdGVzdEFQSS5nZXRCbG9ja2NoYWluSUQoKVxuICAgIGV4cGVjdChiYzMpLnRvQmUobjNiY0lEKVxuICB9KVxuXG4gIHRlc3QoXCJsaXN0QWRkcmVzc2VzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhZGRyZXNzZXMgPSBbYWRkckEsIGFkZHJCXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkubGlzdEFkZHJlc3Nlcyh1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFkZHJlc3Nlc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhZGRyZXNzZXMpXG4gIH0pXG5cbiAgdGVzdChcImltcG9ydEtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWRkcmVzcyA9IGFkZHJDXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuaW1wb3J0S2V5KHVzZXJuYW1lLCBwYXNzd29yZCwgXCJrZXlcIilcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWRkcmVzc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYWRkcmVzcylcbiAgfSlcblxuICB0ZXN0KFwiZ2V0QmFsYW5jZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYmFsYW5jZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3QgcmVzcG9iajogR2V0QmFsYW5jZVJlc3BvbnNlID0ge1xuICAgICAgYmFsYW5jZSxcbiAgICAgIHV0eG9JRHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR4SUQ6IFwiTFVyaUIzVzkxOUY4NEx3UE1NdzRzbTJmWjRZNzZXZ2I2bXNhYXVFWTdpMXRGTm10dlwiLFxuICAgICAgICAgIG91dHB1dEluZGV4OiAwXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8R2V0QmFsYW5jZVJlc3BvbnNlPiA9IGFwaS5nZXRCYWxhbmNlKGFkZHJBLCBcIkFUSFwiKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDogcmVzcG9ialxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKS50b0JlKEpTT04uc3RyaW5naWZ5KHJlc3BvYmopKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRCYWxhbmNlIGluY2x1ZGVQYXJ0aWFsXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBiYWxhbmNlOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcbiAgICBjb25zdCByZXNwb2JqID0ge1xuICAgICAgYmFsYW5jZSxcbiAgICAgIHV0eG9JRHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR4SUQ6IFwiTFVyaUIzVzkxOUY4NEx3UE1NdzRzbTJmWjRZNzZXZ2I2bXNhYXVFWTdpMXRGTm10dlwiLFxuICAgICAgICAgIG91dHB1dEluZGV4OiAwXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8R2V0QmFsYW5jZVJlc3BvbnNlPiA9IGFwaS5nZXRCYWxhbmNlKFxuICAgICAgYWRkckEsXG4gICAgICBcIkFUSFwiLFxuICAgICAgdHJ1ZVxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHJlc3BvYmpcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBjb25zdCBleHBlY3RlZFJlcXVlc3RQYXlsb2FkID0ge1xuICAgICAgaWQ6IDEsXG4gICAgICBtZXRob2Q6IFwiYXZtLmdldEJhbGFuY2VcIixcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBhZGRyZXNzOiBhZGRyQSxcbiAgICAgICAgYXNzZXRJRDogXCJBVEhcIixcbiAgICAgICAgaW5jbHVkZVBhcnRpYWw6IHRydWVcbiAgICAgIH0sXG4gICAgICBqc29ucnBjOiBcIjIuMFwiXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG4gICAgY29uc3QgY2FsbGVkV2l0aDogb2JqZWN0ID0ge1xuICAgICAgYmFzZVVSTDogXCJodHRwczovLzEyNy4wLjAuMTo4MFwiLFxuICAgICAgZGF0YTogJ3tcImlkXCI6OSxcIm1ldGhvZFwiOlwiYXZtLmdldEJhbGFuY2VcIixcInBhcmFtc1wiOntcImFkZHJlc3NcIjpcIlN3YXAtY3VzdG9tMWQ2a2tqMHFoNHdjbXVzM3RrNTlucHd0M3JsdWM2ZW43NTVhNThnXCIsXCJhc3NldElEXCI6XCJBVEhcIixcImluY2x1ZGVQYXJ0aWFsXCI6dHJ1ZX0sXCJqc29ucnBjXCI6XCIyLjBcIn0nLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOFwiXG4gICAgICB9LFxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhcmFtczoge30sXG4gICAgICByZXNwb25zZVR5cGU6IFwianNvblwiLFxuICAgICAgdXJsOiBcIi9leHQvYmMvU3dhcFwiXG4gICAgfVxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0JlQ2FsbGVkV2l0aChjYWxsZWRXaXRoKVxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSkudG9CZShKU09OLnN0cmluZ2lmeShyZXNwb2JqKSlcbiAgfSlcblxuICB0ZXN0KFwiZXhwb3J0S2V5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IFwic2RmZ2x2bGoyaDN2NDVcIlxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZXhwb3J0S2V5KHVzZXJuYW1lLCBwYXNzd29yZCwgYWRkckEpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHByaXZhdGVLZXk6IGtleVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoa2V5KVxuICB9KVxuXG4gIHRlc3QoXCJleHBvcnRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFtb3VudDogQk4gPSBuZXcgQk4oMTAwKVxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgYXNzZXRJRDogc3RyaW5nID0gXCJBWENcIlxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXG4gICAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiUGF1bHNvblwiXG4gICAgY29uc3QgdHhJRDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZXhwb3J0KFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHRvLFxuICAgICAgYW1vdW50LFxuICAgICAgYXNzZXRJRFxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdHhJRFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcbiAgfSlcblxuICB0ZXN0KFwiaW1wb3J0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0bzogc3RyaW5nID0gXCJhYmNkZWZcIlxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXG4gICAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiUGF1bHNvblwiXG4gICAgY29uc3QgdHhJRDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuaW1wb3J0KFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHRvLFxuICAgICAgYmxvY2tjaGFpbklEXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB0eElEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eElEKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVBZGRyZXNzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhbGlhczogc3RyaW5nID0gXCJyYW5kb21hbGlhc1wiXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5jcmVhdGVBZGRyZXNzKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWRkcmVzczogYWxpYXNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFsaWFzKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVGaXhlZENhcEFzc2V0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBrcDogS2V5UGFpciA9IG5ldyBLZXlQYWlyKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGtwLmltcG9ydEtleShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcImVmOWJmMmQ0NDM2NDkxYzE1Mzk2N2M5NzA5ZGQ4ZTgyNzk1YmRiOWI1YWQ0NGVlMjJjMjkwMzAwNWQxY2Y2NzZcIixcbiAgICAgICAgXCJoZXhcIlxuICAgICAgKVxuICAgIClcblxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gMFxuICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9XG4gICAgICBcIjhhNWQyZDMyZTY4YmM1MDAzNmU0ZDA4NjA0NDYxN2ZlNGEwYTAyOTZiMjc0OTk5YmE1NjhlYTkyZGE0NmQ1MzNcIlxuICAgIGNvbnN0IGluaXRpYWxIb2xkZXJzOiBvYmplY3RbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgYWRkcmVzczogXCI3c2lrM1ByNnIxRmVMcnZLMW9Xd0VDQlM4aUo1VlB1U2hcIixcbiAgICAgICAgYW1vdW50OiBcIjEwMDAwXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGFkZHJlc3M6IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCIsXG4gICAgICAgIGFtb3VudDogXCI1MDAwMFwiXG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuY3JlYXRlRml4ZWRDYXBBc3NldChcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBcIlNvbWUgQ29pblwiLFxuICAgICAgXCJTQ0NcIixcbiAgICAgIGRlbm9taW5hdGlvbixcbiAgICAgIGluaXRpYWxIb2xkZXJzXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBhc3NldElEOiBhc3NldElEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhc3NldElEKVxuICB9KVxuXG4gIHRlc3QoXCJjcmVhdGVWYXJpYWJsZUNhcEFzc2V0XCIsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBrcDogS2V5UGFpciA9IG5ldyBLZXlQYWlyKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGtwLmltcG9ydEtleShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcImVmOWJmMmQ0NDM2NDkxYzE1Mzk2N2M5NzA5ZGQ4ZTgyNzk1YmRiOWI1YWQ0NGVlMjJjMjkwMzAwNWQxY2Y2NzZcIixcbiAgICAgICAgXCJoZXhcIlxuICAgICAgKVxuICAgIClcblxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gMFxuICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9XG4gICAgICBcIjhhNWQyZDMyZTY4YmM1MDAzNmU0ZDA4NjA0NDYxN2ZlNGEwYTAyOTZiMjc0OTk5YmE1NjhlYTkyZGE0NmQ1MzNcIlxuICAgIGNvbnN0IG1pbnRlclNldHM6IG9iamVjdFtdID0gW1xuICAgICAge1xuICAgICAgICBtaW50ZXJzOiBbXCI0cGVKc0Z2aGRuN1hqaE5GNEhXQVF5NllhSnRzMjdzOXFcIl0sXG4gICAgICAgIHRocmVzaG9sZDogMVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbWludGVyczogW1xuICAgICAgICAgIFwiZGNKNno5ZHVMZnlRVGdianEyd0JDb3drdmNQWkhWREZcIixcbiAgICAgICAgICBcIjJmRTZpaWJxZkVSejV3ZW5YRTZxeXZpbnN4RHZGaEhaa1wiLFxuICAgICAgICAgIFwiN2llQUpiZnJHUWJwTlpSQVFFcFpDQzFHczF6NWd6NEhVXCJcbiAgICAgICAgXSxcbiAgICAgICAgdGhyZXNob2xkOiAyXG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuY3JlYXRlVmFyaWFibGVDYXBBc3NldChcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBcIlNvbWUgQ29pblwiLFxuICAgICAgXCJTQ0NcIixcbiAgICAgIGRlbm9taW5hdGlvbixcbiAgICAgIG1pbnRlclNldHNcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFzc2V0SUQ6IGFzc2V0SURcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFzc2V0SUQpXG4gIH0pXG5cbiAgdGVzdChcIm1pbnQgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQ29sbGluXCJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJDdXNjZVwiXG4gICAgY29uc3QgYW1vdW50OiBudW1iZXIgPSAyXG4gICAgY29uc3QgYXNzZXRJRDogc3RyaW5nID1cbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXG4gICAgY29uc3QgdG86IHN0cmluZyA9IFwiZGNKNno5ZHVMZnlRVGdianEyd0JDb3drdmNQWkhWREZcIlxuICAgIGNvbnN0IG1pbnRlcnM6IHN0cmluZ1tdID0gW1xuICAgICAgXCJkY0o2ejlkdUxmeVFUZ2JqcTJ3QkNvd2t2Y1BaSFZERlwiLFxuICAgICAgXCIyZkU2aWlicWZFUno1d2VuWEU2cXl2aW5zeER2RmhIWmtcIixcbiAgICAgIFwiN2llQUpiZnJHUWJwTlpSQVFFcFpDQzFHczF6NWd6NEhVXCJcbiAgICBdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkubWludChcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBhbW91bnQsXG4gICAgICBhc3NldElELFxuICAgICAgdG8sXG4gICAgICBtaW50ZXJzXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiBcInNvbWV0eFwiXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcInNvbWV0eFwiKVxuICB9KVxuXG4gIHRlc3QoXCJtaW50IDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIkNvbGxpblwiXG4gICAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiQ3VzY2VcIlxuICAgIGNvbnN0IGFtb3VudDogQk4gPSBuZXcgQk4oMSlcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiLFxuICAgICAgXCJoZXhcIlxuICAgIClcbiAgICBjb25zdCB0bzogc3RyaW5nID0gXCJkY0o2ejlkdUxmeVFUZ2JqcTJ3QkNvd2t2Y1BaSFZERlwiXG4gICAgY29uc3QgbWludGVyczogc3RyaW5nW10gPSBbXG4gICAgICBcImRjSjZ6OWR1TGZ5UVRnYmpxMndCQ293a3ZjUFpIVkRGXCIsXG4gICAgICBcIjJmRTZpaWJxZkVSejV3ZW5YRTZxeXZpbnN4RHZGaEhaa1wiLFxuICAgICAgXCI3aWVBSmJmckdRYnBOWlJBUUVwWkNDMUdzMXo1Z3o0SFVcIlxuICAgIF1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5taW50KFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGFtb3VudCxcbiAgICAgIGFzc2V0SUQsXG4gICAgICB0byxcbiAgICAgIG1pbnRlcnNcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IFwic29tZXR4XCJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwic29tZXR4XCIpXG4gIH0pXG5cbiAgdGVzdChcImdldFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCJcblxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBvYmplY3Q+ID0gYXBpLmdldFR4KHR4aWQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4OiBcInNvbWV0eFwiXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcInNvbWV0eFwiKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRUeFN0YXR1c1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdHhpZDogc3RyaW5nID1cbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5nZXRUeFN0YXR1cyh0eGlkKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzdGF0dXM6IFwiYWNjZXB0ZWRcIlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoXCJhY2NlcHRlZFwiKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRBc3NldERlc2NyaXB0aW9uIGFzIHN0cmluZ1wiLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBcIjhhNWQyZDMyZTY4YmM1MDAzNmU0ZDA4NjA0NDYxN2ZlNGEwYTAyOTZiMjc0OTk5YmE1NjhlYTkyZGE0NmQ1MzNcIixcbiAgICAgIFwiaGV4XCJcbiAgICApXG4gICAgY29uc3QgYXNzZXRpZHN0cjogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0QXNzZXREZXNjcmlwdGlvbihhc3NldGlkc3RyKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBuYW1lOiBcIkNvbGxpbiBDb2luXCIsXG4gICAgICAgIHN5bWJvbDogXCJDS0NcIixcbiAgICAgICAgYXNzZXRJRDogYXNzZXRpZHN0cixcbiAgICAgICAgZGVub21pbmF0aW9uOiBcIjEwXCJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlLm5hbWUpLnRvQmUoXCJDb2xsaW4gQ29pblwiKVxuICAgIGV4cGVjdChyZXNwb25zZS5zeW1ib2wpLnRvQmUoXCJDS0NcIilcbiAgICBleHBlY3QocmVzcG9uc2UuYXNzZXRJRC50b1N0cmluZyhcImhleFwiKSkudG9CZShhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdChyZXNwb25zZS5kZW5vbWluYXRpb24pLnRvQmUoMTApXG4gIH0pXG5cbiAgdGVzdChcImdldEFzc2V0RGVzY3JpcHRpb24gYXMgQnVmZmVyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIFwiOGE1ZDJkMzJlNjhiYzUwMDM2ZTRkMDg2MDQ0NjE3ZmU0YTBhMDI5NmIyNzQ5OTliYTU2OGVhOTJkYTQ2ZDUzM1wiLFxuICAgICAgXCJoZXhcIlxuICAgIClcbiAgICBjb25zdCBhc3NldGlkc3RyOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKFxuICAgICAgQnVmZmVyLmZyb20oXG4gICAgICAgIFwiOGE1ZDJkMzJlNjhiYzUwMDM2ZTRkMDg2MDQ0NjE3ZmU0YTBhMDI5NmIyNzQ5OTliYTU2OGVhOTJkYTQ2ZDUzM1wiLFxuICAgICAgICBcImhleFwiXG4gICAgICApXG4gICAgKVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0QXNzZXREZXNjcmlwdGlvbihhc3NldElEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBuYW1lOiBcIkNvbGxpbiBDb2luXCIsXG4gICAgICAgIHN5bWJvbDogXCJDS0NcIixcbiAgICAgICAgYXNzZXRJRDogYXNzZXRpZHN0cixcbiAgICAgICAgZGVub21pbmF0aW9uOiBcIjExXCJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlLm5hbWUpLnRvQmUoXCJDb2xsaW4gQ29pblwiKVxuICAgIGV4cGVjdChyZXNwb25zZS5zeW1ib2wpLnRvQmUoXCJDS0NcIilcbiAgICBleHBlY3QocmVzcG9uc2UuYXNzZXRJRC50b1N0cmluZyhcImhleFwiKSkudG9CZShhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdChyZXNwb25zZS5kZW5vbWluYXRpb24pLnRvQmUoMTEpXG4gIH0pXG5cbiAgdGVzdChcImdldFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQYXltZW50XG4gICAgY29uc3QgT1BVVFhPc3RyMTogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDAzOGQxYjlmMTEzODY3MmRhNmZiNmMzNTEyNTUzOTI3NmE5YWNjMmE2NjhkNjNiZWE2YmEzYzc5NWUyZWRiMGY1MDAwMDAwMDEzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDA0ZGQ1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFhMzZmZDBjMmRiY2FiMzExNzMxZGRlN2VmMTUxNGJkMjZmY2RjNzRkXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG4gICAgY29uc3QgT1BVVFhPc3RyMjogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDBjM2U0ODIzNTcxNTg3ZmUyYmRmYzUwMjY4OWY1YTgyMzhiOWQwZWE3ZjMyNzcxMjRkMTZhZjlkZTBkMmQ5OTExMDAwMDAwMDAzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDAwMDE5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlMWI2YjZhNGJhZDk0ZDJlM2YyMDczMDM3OWI5YmNkNmYxNzYzMThlXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG4gICAgY29uc3QgT1BVVFhPc3RyMzogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDBmMjlkYmE2MWZkYThkNTdhOTExZTdmODgxMGY5MzViZGU4MTBkM2Y4ZDQ5NTQwNDY4NWJkYjhkOWQ4NTQ1ZTg2MDAwMDAwMDAzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDAwMDE5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlMWI2YjZhNGJhZDk0ZDJlM2YyMDczMDM3OWI5YmNkNmYxNzYzMThlXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG5cbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgc2V0LmFkZChPUFVUWE9zdHIxKVxuICAgIHNldC5hZGRBcnJheShbT1BVVFhPc3RyMiwgT1BVVFhPc3RyM10pXG5cbiAgICBjb25zdCBwZXJzaXN0T3B0czogUGVyc2lzdGFuY2VPcHRpb25zID0gbmV3IFBlcnNpc3RhbmNlT3B0aW9ucyhcbiAgICAgIFwidGVzdFwiLFxuICAgICAgdHJ1ZSxcbiAgICAgIFwidW5pb25cIlxuICAgIClcbiAgICBleHBlY3QocGVyc2lzdE9wdHMuZ2V0TWVyZ2VSdWxlKCkpLnRvQmUoXCJ1bmlvblwiKVxuICAgIGxldCBhZGRyZXNzZXM6IHN0cmluZ1tdID0gc2V0XG4gICAgICAuZ2V0QWRkcmVzc2VzKClcbiAgICAgIC5tYXAoKGEpID0+IGFwaS5hZGRyZXNzRnJvbUJ1ZmZlcihhKSlcbiAgICBsZXQgcmVzdWx0OiBQcm9taXNlPHtcbiAgICAgIG51bUZldGNoZWQ6IG51bWJlclxuICAgICAgdXR4b3M6IFVUWE9TZXRcbiAgICAgIGVuZEluZGV4OiB7IGFkZHJlc3M6IHN0cmluZzsgdXR4bzogc3RyaW5nIH1cbiAgICB9PiA9IGFwaS5nZXRVVFhPcyhcbiAgICAgIGFkZHJlc3NlcyxcbiAgICAgIGFwaS5nZXRCbG9ja2NoYWluSUQoKSxcbiAgICAgIDAsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBwZXJzaXN0T3B0c1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgbnVtRmV0Y2hlZDogMyxcbiAgICAgICAgdXR4b3M6IFtPUFVUWE9zdHIxLCBPUFVUWE9zdHIyLCBPUFVUWE9zdHIzXSxcbiAgICAgICAgc3RvcEluZGV4OiB7IGFkZHJlc3M6IFwiYVwiLCB1dHhvOiBcImJcIiB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBsZXQgcmVzcG9uc2U6IFVUWE9TZXQgPSAoYXdhaXQgcmVzdWx0KS51dHhvc1xuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkpKS50b0JlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoc2V0LmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKVxuICAgIClcblxuICAgIGFkZHJlc3NlcyA9IHNldC5nZXRBZGRyZXNzZXMoKS5tYXAoKGEpID0+IGFwaS5hZGRyZXNzRnJvbUJ1ZmZlcihhKSlcbiAgICByZXN1bHQgPSBhcGkuZ2V0VVRYT3MoXG4gICAgICBhZGRyZXNzZXMsXG4gICAgICBhcGkuZ2V0QmxvY2tjaGFpbklEKCksXG4gICAgICAwLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgcGVyc2lzdE9wdHNcbiAgICApXG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIHJlc3BvbnNlID0gKGF3YWl0IHJlc3VsdCkudXR4b3NcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKSkudG9CZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNldC5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSlcbiAgICApXG4gIH0pXG5cbiAgZGVzY3JpYmUoXCJUcmFuc2FjdGlvbnNcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGxldCBzZXQ6IFVUWE9TZXRcbiAgICBsZXQga2V5bWdyMjogS2V5Q2hhaW5cbiAgICBsZXQga2V5bWdyMzogS2V5Q2hhaW5cbiAgICBsZXQgYWRkcnMxOiBzdHJpbmdbXVxuICAgIGxldCBhZGRyczI6IHN0cmluZ1tdXG4gICAgbGV0IGFkZHJzMzogc3RyaW5nW11cbiAgICBsZXQgYWRkcmVzc2J1ZmZzOiBCdWZmZXJbXSA9IFtdXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbXVxuICAgIGxldCB1dHhvczogVVRYT1tdXG4gICAgbGV0IGlucHV0czogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICAgIGxldCBvdXRwdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxuICAgIGxldCBvcHM6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbltdXG4gICAgbGV0IGFtbnQ6IG51bWJlciA9IDEwMDAwXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpLnVwZGF0ZShcIm1hcnkgaGFkIGEgbGl0dGxlIGxhbWJcIikuZGlnZXN0KClcbiAgICApXG4gICAgY29uc3QgTkZUYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgIC51cGRhdGUoXG4gICAgICAgICAgXCJJIGNhbid0IHN0YW5kIGl0LCBJIGtub3cgeW91IHBsYW5uZWQgaXQsIEknbW1hIHNldCBzdHJhaWdodCB0aGlzIFdhdGVyZ2F0ZS5cIlxuICAgICAgICApXG4gICAgICAgIC5kaWdlc3QoKVxuICAgIClcbiAgICBsZXQgc2VjcGJhc2UxOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgc2VjcGJhc2UyOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgc2VjcGJhc2UzOiBTRUNQVHJhbnNmZXJPdXRwdXRcbiAgICBsZXQgaW5pdGlhbFN0YXRlOiBJbml0aWFsU3RhdGVzXG4gICAgbGV0IG5mdHBiYXNlMTogTkZUTWludE91dHB1dFxuICAgIGxldCBuZnRwYmFzZTI6IE5GVE1pbnRPdXRwdXRcbiAgICBsZXQgbmZ0cGJhc2UzOiBORlRNaW50T3V0cHV0XG4gICAgbGV0IG5mdEluaXRpYWxTdGF0ZTogSW5pdGlhbFN0YXRlc1xuICAgIGxldCBuZnR1dHhvaWRzOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGZ1bmd1dHhvaWRzOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGF2bTogQVZNQVBJXG4gICAgY29uc3QgZmVlOiBudW1iZXIgPSAxMFxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IFwiTW9ydHljb2luIGlzIHRoZSBkdW1iIGFzIGEgc2FjayBvZiBoYW1tZXJzLlwiXG4gICAgY29uc3Qgc3ltYm9sOiBzdHJpbmcgPSBcIm1vclRcIlxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxuXG4gICAgbGV0IHNlY3BNaW50T3V0MTogU0VDUE1pbnRPdXRwdXRcbiAgICBsZXQgc2VjcE1pbnRPdXQyOiBTRUNQTWludE91dHB1dFxuICAgIGxldCBzZWNwTWludFRYSUQ6IEJ1ZmZlclxuICAgIGxldCBzZWNwTWludFVUWE86IFVUWE9cbiAgICBsZXQgc2VjcE1pbnRYZmVyT3V0MTogU0VDUFRyYW5zZmVyT3V0cHV0XG4gICAgbGV0IHNlY3BNaW50WGZlck91dDI6IFNFQ1BUcmFuc2Zlck91dHB1dFxuICAgIGxldCBzZWNwTWludE9wOiBTRUNQTWludE9wZXJhdGlvblxuXG4gICAgbGV0IHhmZXJzZWNwbWludG9wOiBUcmFuc2ZlcmFibGVPcGVyYXRpb25cblxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgYXZtID0gbmV3IEFWTUFQSShheGlhLCBcIi9leHQvYmMvU3dhcFwiLCBibG9ja2NoYWluSUQpXG5cbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCdWZmZXI+ID0gYXZtLmdldEFYQ0Fzc2V0SUQodHJ1ZSlcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBzeW1ib2wsXG4gICAgICAgICAgYXNzZXRJRDogYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcbiAgICAgICAgICBkZW5vbWluYXRpb246IGRlbm9taW5hdGlvblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiBwYXlsb2FkXG4gICAgICB9XG5cbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgICBhd2FpdCByZXN1bHRcbiAgICAgIHNldCA9IG5ldyBVVFhPU2V0KClcbiAgICAgIGF2bS5uZXdLZXlDaGFpbigpXG4gICAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcbiAgICAgIGFkZHJzMSA9IFtdXG4gICAgICBhZGRyczIgPSBbXVxuICAgICAgYWRkcnMzID0gW11cbiAgICAgIHV0eG9zID0gW11cbiAgICAgIGlucHV0cyA9IFtdXG4gICAgICBvdXRwdXRzID0gW11cbiAgICAgIG9wcyA9IFtdXG4gICAgICBuZnR1dHhvaWRzID0gW11cbiAgICAgIGZ1bmd1dHhvaWRzID0gW11cbiAgICAgIGNvbnN0IHBsb2FkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMTAyNClcbiAgICAgIHBsb2FkLndyaXRlKFxuICAgICAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcbiAgICAgICAgMCxcbiAgICAgICAgMTAyNCxcbiAgICAgICAgXCJ1dGY4XCJcbiAgICAgIClcblxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBhZGRyczEucHVzaChcbiAgICAgICAgICBhdm0uYWRkcmVzc0Zyb21CdWZmZXIoYXZtLmtleUNoYWluKCkubWFrZUtleSgpLmdldEFkZHJlc3MoKSlcbiAgICAgICAgKVxuICAgICAgICBhZGRyczIucHVzaChhdm0uYWRkcmVzc0Zyb21CdWZmZXIoa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKSlcbiAgICAgICAgYWRkcnMzLnB1c2goYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGtleW1ncjMubWFrZUtleSgpLmdldEFkZHJlc3MoKSkpXG4gICAgICB9XG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FQVhDLm11bChuZXcgQk4oYW1udCkpXG4gICAgICBhZGRyZXNzYnVmZnMgPSBhdm0ua2V5Q2hhaW4oKS5nZXRBZGRyZXNzZXMoKVxuICAgICAgYWRkcmVzc2VzID0gYWRkcmVzc2J1ZmZzLm1hcCgoYSkgPT4gYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAzXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgIGxldCB0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxuICAgICAgICAgICAgLmRpZ2VzdCgpXG4gICAgICAgIClcbiAgICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgICAgICAgdHhpZHgud3JpdGVVSW50MzJCRShpLCAwKVxuXG4gICAgICAgIGNvbnN0IG91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgICBhbW91bnQsXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxuICAgICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAgIHRocmVzaG9sZFxuICAgICAgICApXG4gICAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoYXNzZXRJRCwgb3V0KVxuICAgICAgICBvdXRwdXRzLnB1c2goeGZlcm91dClcblxuICAgICAgICBjb25zdCB1OiBVVFhPID0gbmV3IFVUWE8oKVxuICAgICAgICB1LmZyb21CdWZmZXIoXG4gICAgICAgICAgQnVmZmVyLmNvbmNhdChbdS5nZXRDb2RlY0lEQnVmZmVyKCksIHR4aWQsIHR4aWR4LCB4ZmVyb3V0LnRvQnVmZmVyKCldKVxuICAgICAgICApXG4gICAgICAgIGZ1bmd1dHhvaWRzLnB1c2godS5nZXRVVFhPSUQoKSlcbiAgICAgICAgdXR4b3MucHVzaCh1KVxuXG4gICAgICAgIHR4aWQgPSB1LmdldFR4SUQoKVxuICAgICAgICB0eGlkeCA9IHUuZ2V0T3V0cHV0SWR4KClcbiAgICAgICAgY29uc3QgYXNzZXQgPSB1LmdldEFzc2V0SUQoKVxuXG4gICAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXG4gICAgICAgIGNvbnN0IHhmZXJpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICAgICAgdHhpZCxcbiAgICAgICAgICB0eGlkeCxcbiAgICAgICAgICBhc3NldCxcbiAgICAgICAgICBpbnB1dFxuICAgICAgICApXG4gICAgICAgIGlucHV0cy5wdXNoKHhmZXJpbnB1dClcblxuICAgICAgICBjb25zdCBub3V0OiBORlRUcmFuc2Zlck91dHB1dCA9IG5ldyBORlRUcmFuc2Zlck91dHB1dChcbiAgICAgICAgICAxMDAwICsgaSxcbiAgICAgICAgICBwbG9hZCxcbiAgICAgICAgICBhZGRyZXNzYnVmZnMsXG4gICAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgICAgdGhyZXNob2xkXG4gICAgICAgIClcbiAgICAgICAgY29uc3Qgb3A6IE5GVFRyYW5zZmVyT3BlcmF0aW9uID0gbmV3IE5GVFRyYW5zZmVyT3BlcmF0aW9uKG5vdXQpXG4gICAgICAgIGNvbnN0IG5mdHR4aWQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDEwMDAgKyBpKSwgMzIpKVxuICAgICAgICAgICAgLmRpZ2VzdCgpXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgbmZ0dXR4bzogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICAgIEFWTUNvbnN0YW50cy5MQVRFU1RDT0RFQyxcbiAgICAgICAgICBuZnR0eGlkLFxuICAgICAgICAgIDEwMDAgKyBpLFxuICAgICAgICAgIE5GVGFzc2V0SUQsXG4gICAgICAgICAgbm91dFxuICAgICAgICApXG4gICAgICAgIG5mdHV0eG9pZHMucHVzaChuZnR1dHhvLmdldFVUWE9JRCgpKVxuICAgICAgICBjb25zdCB4ZmVyb3A6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oXG4gICAgICAgICAgTkZUYXNzZXRJRCxcbiAgICAgICAgICBbbmZ0dXR4by5nZXRVVFhPSUQoKV0sXG4gICAgICAgICAgb3BcbiAgICAgICAgKVxuICAgICAgICBvcHMucHVzaCh4ZmVyb3ApXG4gICAgICAgIHV0eG9zLnB1c2gobmZ0dXR4bylcbiAgICAgIH1cbiAgICAgIHNldC5hZGRBcnJheSh1dHhvcylcblxuICAgICAgc2VjcGJhc2UxID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgbmV3IEJOKDc3NyksXG4gICAgICAgIGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIDFcbiAgICAgIClcbiAgICAgIHNlY3BiYXNlMiA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIG5ldyBCTig4ODgpLFxuICAgICAgICBhZGRyczIubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgVW5peE5vdygpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBzZWNwYmFzZTMgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBuZXcgQk4oOTk5KSxcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgICAgaW5pdGlhbFN0YXRlID0gbmV3IEluaXRpYWxTdGF0ZXMoKVxuICAgICAgaW5pdGlhbFN0YXRlLmFkZE91dHB1dChzZWNwYmFzZTEsIEFWTUNvbnN0YW50cy5TRUNQRlhJRClcbiAgICAgIGluaXRpYWxTdGF0ZS5hZGRPdXRwdXQoc2VjcGJhc2UyLCBBVk1Db25zdGFudHMuU0VDUEZYSUQpXG4gICAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMywgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxuXG4gICAgICBuZnRwYmFzZTEgPSBuZXcgTkZUTWludE91dHB1dChcbiAgICAgICAgMCxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXBpLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBuZnRwYmFzZTIgPSBuZXcgTkZUTWludE91dHB1dChcbiAgICAgICAgMSxcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gYXBpLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBuZnRwYmFzZTMgPSBuZXcgTkZUTWludE91dHB1dChcbiAgICAgICAgMixcbiAgICAgICAgYWRkcnMzLm1hcCgoYSkgPT4gYXBpLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBuZnRJbml0aWFsU3RhdGUgPSBuZXcgSW5pdGlhbFN0YXRlcygpXG4gICAgICBuZnRJbml0aWFsU3RhdGUuYWRkT3V0cHV0KG5mdHBiYXNlMSwgQVZNQ29uc3RhbnRzLk5GVEZYSUQpXG4gICAgICBuZnRJbml0aWFsU3RhdGUuYWRkT3V0cHV0KG5mdHBiYXNlMiwgQVZNQ29uc3RhbnRzLk5GVEZYSUQpXG4gICAgICBuZnRJbml0aWFsU3RhdGUuYWRkT3V0cHV0KG5mdHBiYXNlMywgQVZNQ29uc3RhbnRzLk5GVEZYSUQpXG5cbiAgICAgIHNlY3BNaW50T3V0MSA9IG5ldyBTRUNQTWludE91dHB1dChhZGRyZXNzYnVmZnMsIG5ldyBCTigwKSwgMSlcbiAgICAgIHNlY3BNaW50T3V0MiA9IG5ldyBTRUNQTWludE91dHB1dChhZGRyZXNzYnVmZnMsIG5ldyBCTigwKSwgMSlcbiAgICAgIHNlY3BNaW50VFhJRCA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgLnVwZGF0ZShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMTMzNyksIDMyKSlcbiAgICAgICAgICAuZGlnZXN0KClcbiAgICAgIClcbiAgICAgIHNlY3BNaW50VVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBBVk1Db25zdGFudHMuTEFURVNUQ09ERUMsXG4gICAgICAgIHNlY3BNaW50VFhJRCxcbiAgICAgICAgMCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgc2VjcE1pbnRPdXQxXG4gICAgICApXG4gICAgICBzZWNwTWludFhmZXJPdXQxID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgbmV3IEJOKDEyMyksXG4gICAgICAgIGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIDJcbiAgICAgIClcbiAgICAgIHNlY3BNaW50WGZlck91dDIgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBuZXcgQk4oNDU2KSxcbiAgICAgICAgW2F2bS5wYXJzZUFkZHJlc3MoYWRkcnMyWzBdKV0sXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgICAgc2VjcE1pbnRPcCA9IG5ldyBTRUNQTWludE9wZXJhdGlvbihzZWNwTWludE91dDEsIHNlY3BNaW50WGZlck91dDEpXG5cbiAgICAgIHNldC5hZGQoc2VjcE1pbnRVVFhPKVxuXG4gICAgICB4ZmVyc2VjcG1pbnRvcCA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIFtzZWNwTWludFVUWE8uZ2V0VVRYT0lEKCldLFxuICAgICAgICBzZWNwTWludE9wXG4gICAgICApXG4gICAgfSlcblxuICAgIHRlc3QoXCJnZXREZWZhdWx0TWludFR4RmVlXCIsICgpOiB2b2lkID0+IHtcbiAgICAgIGV4cGVjdChhdm0uZ2V0RGVmYXVsdE1pbnRUeEZlZSgpLnRvU3RyaW5nKCkpLnRvQmUoXCIxMDAwMDAwXCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJzaWduVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBuZXcgQk4oYW1udCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczFcbiAgICAgIClcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBuZXcgQk4oYW1udCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICAxXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSBhdm0uc2lnblR4KHR4dTEpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gYXZtLnNpZ25UeCh0eHUyKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHgyLnRvU3RyaW5nKCkpLnRvQmUodHgxLnRvU3RyaW5nKCkpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEJhc2VUeDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBuZXcgQk4oYW1udCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldENvbnRlbnQoKVxuICAgICAgKVxuICAgICAgY29uc3QgbWVtb2J1ZjogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJoZWxsbyB3b3JsZFwiKVxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIG5ldyBCTihhbW50KSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcnMzLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGFkZHJzMS5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgYXZtLmdldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG1lbW9idWYsXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG4gICAgfSlcblxuICAgIHRlc3QoXCJ4c3NQcmV2ZW50aW9uT2JqZWN0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRCYXNlVHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxuICAgICAgICBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMxXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSBhdm0uc2lnblR4KHR4dTEpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHNhbml0aXplZDogb2JqZWN0ID0gdHgxLnNhbml0aXplT2JqZWN0KHR4MW9iailcbiAgICAgIGV4cGVjdCh0eDFvYmopLnRvU3RyaWN0RXF1YWwoc2FuaXRpemVkKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwieHNzUHJldmVudGlvbkhUTUxcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgZGlydHlEb206IHN0cmluZyA9IFwiPGltZyBzcmM9J2h0dHBzOi8veCcgb25lcnJvcj1hbGVydCgxKS8vPlwiXG4gICAgICBjb25zdCBzYW5pdGl6ZWRTdHJpbmc6IHN0cmluZyA9IGA8aW1nIHNyYz1cImh0dHBzOi8veFwiIC8+YFxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkQmFzZVR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIG5ldyBCTihhbW50KSxcbiAgICAgICAgYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gYXZtLnNpZ25UeCh0eHUxKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCBkaXJ0eU9iajogb2JqZWN0ID0ge1xuICAgICAgICAuLi50eDFvYmosXG4gICAgICAgIGRpcnR5RG9tOiBkaXJ0eURvbVxuICAgICAgfVxuICAgICAgY29uc3Qgc2FuaXRpemVkT2JqOiBhbnkgPSB0eDEuc2FuaXRpemVPYmplY3QoZGlydHlPYmopXG4gICAgICBleHBlY3Qoc2FuaXRpemVkT2JqLmRpcnR5RG9tKS50b0JlKHNhbml0aXplZFN0cmluZylcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQmFzZVR4MlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkQmFzZVR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIG5ldyBCTihhbW50KS5zdWIobmV3IEJOKDEwMCkpLFxuICAgICAgICBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKVxuICAgICAgKVxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIG5ldyBCTihhbW50KS5zdWIobmV3IEJOKDEwMCkpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyczMubWFwKChhKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczEubWFwKChhKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczIubWFwKChhKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgMVxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCBvdXRpZXMgPSB0eHUxXG4gICAgICAgIC5nZXRUcmFuc2FjdGlvbigpXG4gICAgICAgIC5nZXRPdXRzKClcbiAgICAgICAgLnNvcnQoVHJhbnNmZXJhYmxlT3V0cHV0LmNvbXBhcmF0b3IoKSkgYXMgVHJhbnNmZXJhYmxlT3V0cHV0W11cblxuICAgICAgZXhwZWN0KG91dGllcy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGNvbnN0IG91dGFkZHIwID0gb3V0aWVzWzBdXG4gICAgICAgIC5nZXRPdXRwdXQoKVxuICAgICAgICAuZ2V0QWRkcmVzc2VzKClcbiAgICAgICAgLm1hcCgoYSkgPT4gYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxuICAgICAgY29uc3Qgb3V0YWRkcjEgPSBvdXRpZXNbMV1cbiAgICAgICAgLmdldE91dHB1dCgpXG4gICAgICAgIC5nZXRBZGRyZXNzZXMoKVxuICAgICAgICAubWFwKChhKSA9PiBhdm0uYWRkcmVzc0Zyb21CdWZmZXIoYSkpXG5cbiAgICAgIGNvbnN0IHRlc3RhZGRyMiA9IEpTT04uc3RyaW5naWZ5KGFkZHJzMi5zb3J0KCkpXG4gICAgICBjb25zdCB0ZXN0YWRkcjMgPSBKU09OLnN0cmluZ2lmeShhZGRyczMuc29ydCgpKVxuXG4gICAgICBjb25zdCB0ZXN0b3V0MCA9IEpTT04uc3RyaW5naWZ5KG91dGFkZHIwLnNvcnQoKSlcbiAgICAgIGNvbnN0IHRlc3RvdXQxID0gSlNPTi5zdHJpbmdpZnkob3V0YWRkcjEuc29ydCgpKVxuICAgICAgZXhwZWN0KFxuICAgICAgICAodGVzdGFkZHIyID09IHRlc3RvdXQwICYmIHRlc3RhZGRyMyA9PSB0ZXN0b3V0MSkgfHxcbiAgICAgICAgICAodGVzdGFkZHIzID09IHRlc3RvdXQwICYmIHRlc3RhZGRyMiA9PSB0ZXN0b3V0MSlcbiAgICAgICkudG9CZSh0cnVlKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkJhc2VUeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiaXNzdWVUeCBTZXJpYWxpemVkXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBuZXcgQk4oYW1udCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczFcbiAgICAgIClcbiAgICAgIGNvbnN0IHR4ID0gYXZtLnNpZ25UeCh0eHUpXG4gICAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxuICAgICAgICBcImY5NjY3NTBmNDM4ODY3YzNjOTgyOGRkY2RiZTY2MGUyMWNjZGJiMzZhOTI3Njk1OGYwMTFiYTQ3MmY3NWQ0ZTdcIlxuXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGF2bS5pc3N1ZVR4KHR4LnRvU3RyaW5nKCkpXG4gICAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICAgIHJlc3VsdDoge1xuICAgICAgICAgIHR4SUQ6IHR4aWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgfVxuICAgICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4aWQpXG4gICAgfSlcblxuICAgIHRlc3QoXCJpc3N1ZVR4IEJ1ZmZlclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRCYXNlVHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxuICAgICAgICBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMxXG4gICAgICApXG4gICAgICBjb25zdCB0eCA9IGF2bS5zaWduVHgodHh1KVxuXG4gICAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxuICAgICAgICBcImY5NjY3NTBmNDM4ODY3YzNjOTgyOGRkY2RiZTY2MGUyMWNjZGJiMzZhOTI3Njk1OGYwMTFiYTQ3MmY3NWQ0ZTdcIlxuICAgICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhdm0uaXNzdWVUeCh0eC50b0J1ZmZlcigpKVxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB0eElEOiB0eGlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHBheWxvYWRcbiAgICAgIH1cblxuICAgICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4aWQpXG4gICAgfSlcbiAgICB0ZXN0KFwiaXNzdWVUeCBDbGFzcyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRCYXNlVHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxuICAgICAgICBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMxXG4gICAgICApXG4gICAgICBjb25zdCB0eCA9IGF2bS5zaWduVHgodHh1KVxuXG4gICAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxuICAgICAgICBcImY5NjY3NTBmNDM4ODY3YzNjOTgyOGRkY2RiZTY2MGUyMWNjZGJiMzZhOTI3Njk1OGYwMTFiYTQ3MmY3NWQ0ZTdcIlxuXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGF2bS5pc3N1ZVR4KHR4KVxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB0eElEOiB0eGlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHBheWxvYWRcbiAgICAgIH1cblxuICAgICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcbiAgICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eGlkKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRDcmVhdGVBc3NldFR4IC0gRml4ZWQgQ2FwXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGF2bS5zZXRDcmVhdGlvblR4RmVlKG5ldyBCTihmZWUpKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZENyZWF0ZUFzc2V0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc3ltYm9sLFxuICAgICAgICBkZW5vbWluYXRpb25cbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZENyZWF0ZUFzc2V0VHgoXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXZtLmdldEJsb2NrY2hhaW5JRCgpKSxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBpbml0aWFsU3RhdGUsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN5bWJvbCxcbiAgICAgICAgZGVub21pbmF0aW9uLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIENFTlRJQVhDLFxuICAgICAgICBhc3NldElEXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXG4gICAgICBleHBlY3QodHgxb2JqKS50b1N0cmljdEVxdWFsKHR4Mm9iailcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDRzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkNyZWF0ZUFzc2V0VHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlQXNzZXRUeCAtIFZhcmlhYmxlIENhcFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhdm0uc2V0Q3JlYXRpb25UeEZlZShcbiAgICAgICAgbmV3IEJOKERlZmF1bHRzLm5ldHdvcmtbMTIzNDVdLkNvcmVbXCJjcmVhdGlvblR4RmVlXCJdKVxuICAgICAgKVxuICAgICAgY29uc3QgbWludE91dHB1dHM6IFNFQ1BNaW50T3V0cHV0W10gPSBbc2VjcE1pbnRPdXQxLCBzZWNwTWludE91dDJdXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkQ3JlYXRlQXNzZXRUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzeW1ib2wsXG4gICAgICAgIGRlbm9taW5hdGlvbixcbiAgICAgICAgbWludE91dHB1dHNcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZENyZWF0ZUFzc2V0VHgoXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXZtLmdldEJsb2NrY2hhaW5JRCgpKSxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBpbml0aWFsU3RhdGUsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN5bWJvbCxcbiAgICAgICAgZGVub21pbmF0aW9uLFxuICAgICAgICBtaW50T3V0cHV0cyxcbiAgICAgICAgYXZtLmdldENyZWF0aW9uVHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRFxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZFNFQ1BNaW50VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgYXZtLnNldFR4RmVlKG5ldyBCTihmZWUpKVxuICAgICAgY29uc3QgbmV3TWludGVyOiBTRUNQTWludE91dHB1dCA9IG5ldyBTRUNQTWludE91dHB1dChcbiAgICAgICAgYWRkcnMzLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZFNFQ1BNaW50VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgbmV3TWludGVyLFxuICAgICAgICBzZWNwTWludFhmZXJPdXQxLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgc2VjcE1pbnRVVFhPLmdldFVUWE9JRCgpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRTRUNQTWludFR4KFxuICAgICAgICBheGlhLmdldE5ldHdvcmtJRCgpLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGF2bS5nZXRCbG9ja2NoYWluSUQoKSksXG4gICAgICAgIG5ld01pbnRlcixcbiAgICAgICAgc2VjcE1pbnRYZmVyT3V0MSxcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBzZWNwTWludFVUWE8uZ2V0VVRYT0lEKCksXG4gICAgICAgIE1JTExJQVhDLFxuICAgICAgICBhc3NldElEXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXG4gICAgICBleHBlY3QodHgxb2JqKS50b1N0cmljdEVxdWFsKHR4Mm9iailcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDRzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIlNFQ1BNaW50VHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlTkZUQXNzZXRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhdm0uc2V0Q3JlYXRpb25UeEZlZShcbiAgICAgICAgbmV3IEJOKERlZmF1bHRzLm5ldHdvcmtbMTIzNDVdLkNvcmVbXCJjcmVhdGlvblR4RmVlXCJdKVxuICAgICAgKVxuICAgICAgY29uc3QgbWludGVyU2V0czogTWludGVyU2V0W10gPSBbbmV3IE1pbnRlclNldCgxLCBhZGRyczEpXVxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApXG5cbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRDcmVhdGVORlRBc3NldFR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBtaW50ZXJTZXRzLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzeW1ib2wsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIGxvY2t0aW1lXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRDcmVhdGVORlRBc3NldFR4KFxuICAgICAgICBheGlhLmdldE5ldHdvcmtJRCgpLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGF2bS5nZXRCbG9ja2NoYWluSUQoKSksXG4gICAgICAgIGFkZHJzMS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgYWRkcnMyLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBtaW50ZXJTZXRzLFxuICAgICAgICBuYW1lLFxuICAgICAgICBzeW1ib2wsXG4gICAgICAgIGF2bS5nZXRDcmVhdGlvblR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpLFxuICAgICAgICBsb2NrdGltZVxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJDcmVhdGVORlRBc3NldFR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZENyZWF0ZU5GVE1pbnRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXG4gICAgICBjb25zdCBncm91cElEOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxuICAgICAgY29uc3QgcGF5bG9hZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJBeGlhXCIpXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjI6IEJ1ZmZlcltdID0gYWRkcnMyLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjM6IEJ1ZmZlcltdID0gYWRkcnMzLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBvdXRwdXRPd25lcnM6IE91dHB1dE93bmVyc1tdID0gW11cbiAgICAgIGNvbnN0IG9vOiBPdXRwdXRPd25lcnMgPSBuZXcgT3V0cHV0T3duZXJzKGFkZHJidWZmMywgbG9ja3RpbWUsIHRocmVzaG9sZClcbiAgICAgIG91dHB1dE93bmVycy5wdXNoKClcblxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZENyZWF0ZU5GVE1pbnRUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBvbyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5mdHV0eG9pZHMsXG4gICAgICAgIGdyb3VwSUQsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRDcmVhdGVORlRNaW50VHgoXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXZtLmdldEJsb2NrY2hhaW5JRCgpKSxcbiAgICAgICAgW29vXSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIG5mdHV0eG9pZHMsXG4gICAgICAgIGdyb3VwSUQsXG4gICAgICAgIHBheWxvYWQsXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBvdXRwdXRPd25lcnMucHVzaChvbylcbiAgICAgIG91dHB1dE93bmVycy5wdXNoKG5ldyBPdXRwdXRPd25lcnMoYWRkcmJ1ZmYzLCBsb2NrdGltZSwgdGhyZXNob2xkICsgMSkpXG5cbiAgICAgIGNvbnN0IHR4dTM6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRDcmVhdGVORlRNaW50VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgb3V0cHV0T3duZXJzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmZ0dXR4b2lkcyxcbiAgICAgICAgZ3JvdXBJRCxcbiAgICAgICAgcGF5bG9hZCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1NDogVW5zaWduZWRUeCA9IHNldC5idWlsZENyZWF0ZU5GVE1pbnRUeChcbiAgICAgICAgYXhpYS5nZXROZXR3b3JrSUQoKSxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShhdm0uZ2V0QmxvY2tjaGFpbklEKCkpLFxuICAgICAgICBvdXRwdXRPd25lcnMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBuZnR1dHhvaWRzLFxuICAgICAgICBncm91cElELFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHR4dTQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1My50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1NC50b1N0cmluZygpKS50b0JlKHR4dTMudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcblxuICAgICAgY29uc3QgdHgyb2JqOiBvYmplY3QgPSB0eDIuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcbiAgICAgIGV4cGVjdCh0eDFvYmopLnRvU3RyaWN0RXF1YWwodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MXN0cikudG9TdHJpY3RFcXVhbCh0eDJzdHIpXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4NHN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHg0b2JqKVxuICAgICAgZXhwZWN0KHR4M29iaikudG9TdHJpY3RFcXVhbCh0eDRvYmopXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQ3JlYXRlTkZUTWludFR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZE5GVFRyYW5zZmVyVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgYXZtLnNldFR4RmVlKG5ldyBCTihmZWUpKVxuICAgICAgY29uc3QgcGxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxMDI0KVxuICAgICAgcGxvYWQud3JpdGUoXG4gICAgICAgIFwiQWxsIHlvdSBUcmVra2llcyBhbmQgVFYgYWRkaWN0cywgRG9uJ3QgbWVhbiB0byBkaXNzIGRvbid0IG1lYW4gdG8gYnJpbmcgc3RhdGljLlwiLFxuICAgICAgICAwLFxuICAgICAgICAxMDI0LFxuICAgICAgICBcInV0ZjhcIlxuICAgICAgKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZE5GVFRyYW5zZmVyVHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmZ0dXR4b2lkc1sxXSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICAxXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRORlRUcmFuc2ZlclR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgW25mdHV0eG9pZHNbMV1dLFxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgMVxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJORlRUcmFuc2ZlclR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEltcG9ydFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXG4gICAgICBhdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBmdW5ndXR4bzogVVRYTyA9IHNldC5nZXRVVFhPKGZ1bmd1dHhvaWRzWzFdKVxuICAgICAgY29uc3QgZnVuZ3V0eG9zdHI6IHN0cmluZyA9IGZ1bmd1dHhvLnRvU3RyaW5nKClcblxuICAgICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFVuc2lnbmVkVHg+ID0gYXZtLmJ1aWxkSW1wb3J0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBQbGF0Zm9ybUNoYWluSUQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgdXR4b3M6IFtmdW5ndXR4b3N0cl1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgfVxuXG4gICAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkSW1wb3J0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBbZnVuZ3V0eG9dLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxuICAgICAgICBhd2FpdCBhdm0uZ2V0QVhDQXNzZXRJRCgpLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJJbXBvcnRUeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRFeHBvcnRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBhdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjI6IEJ1ZmZlcltdID0gYWRkcnMyLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjM6IEJ1ZmZlcltdID0gYWRkcnMzLm1hcChcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKDkwKVxuICAgICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICAgIGFkZHJidWZmMy5tYXAoKGE6IEJ1ZmZlcik6IGFueSA9PlxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKGEsIHR5cGUsIGF4aWEuZ2V0SFJQKCksIFwiQ29yZVwiKVxuICAgICAgICApLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgICAgYXZtLmdldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4dTM6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRFeHBvcnRUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIFBsYXRmb3JtQ2hhaW5JRCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHU0OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgYXZtLmdldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHU0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTMudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTQudG9TdHJpbmcoKSkudG9CZSh0eHUzLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXG4gICAgICBleHBlY3QodHgxb2JqKS50b1N0cmljdEVxdWFsKHR4Mm9iailcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDRzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4NG9iailcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkV4cG9ydFR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEdlbmVzaXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgZ2VuZXNpc0RhdGE6IG9iamVjdCA9IHtcbiAgICAgICAgZ2VuZXNpc0RhdGE6IHtcbiAgICAgICAgICBhc3NldEFsaWFzMToge1xuICAgICAgICAgICAgbmFtZTogXCJodW1hbiByZWFkYWJsZSBuYW1lXCIsXG4gICAgICAgICAgICBzeW1ib2w6IFwiQVZBTFwiLFxuICAgICAgICAgICAgaW5pdGlhbFN0YXRlOiB7XG4gICAgICAgICAgICAgIGZpeGVkQ2FwOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgYW1vdW50OiAxMDAwLFxuICAgICAgICAgICAgICAgICAgYWRkcmVzczogXCJBXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGFtb3VudDogNTAwMCxcbiAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IFwiQlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3NldEFsaWFzQ2FuQmVBbnl0aGluZ1VuaXF1ZToge1xuICAgICAgICAgICAgbmFtZTogXCJodW1hbiByZWFkYWJsZSBuYW1lXCIsXG4gICAgICAgICAgICBzeW1ib2w6IFwiQVZBTFwiLFxuICAgICAgICAgICAgaW5pdGlhbFN0YXRlOiB7XG4gICAgICAgICAgICAgIHZhcmlhYmxlQ2FwOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbWludGVyczogW1wiQVwiLCBcIkJcIl0sXG4gICAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG1pbnRlcnM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiXSxcbiAgICAgICAgICAgICAgICAgIHRocmVzaG9sZDogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgYnl0ZXM6IHN0cmluZyA9XG4gICAgICAgIFwiMTExVE5XelV0SEtvU3Z4b2hqeWZFd0UyWDIyOFpER0JuZ1o0bWRNVVZNblZuanRuYXdXMWIxemJBaHp5QU0xdjZkN0VDTmo2RFhzVDdxRG1oU0VmM0RXZ1hSajdFQ3dCWDM2WlhGYzl0V1ZCMnFIVVJvVWZkRHZGc0JlU1JxYXRDbWo3NmVaUU1HWkRnQkZSTmlqUmhQTktVYXA3YkNlS3BIRHR1Q1pjNFlwUGtkNG1SODRkTEwyQUwxYjRLNDZlaXJXS01hRlZqQTVidFlTNERueVV4NWNMcEFxM2QzNWtFZE5kVTV6SDNyVFUxOFM0VHhZVjh2b01QY0xDVFozaDR6UnNNNWpXMWNVempXVnZLZzd1WVMyb1I5cVhSRmNneTFnd05URlpHc3R5U3V2U0Y3TVplWkY0elNkTmdDNHJiWTlIOTRSVmhxZThyVzdNWHFNU1pCNnZCVEIyQnBnRjZ0TkZlaG1ZeEVYd2phS1JyaW1YOTF1dHZaZTlZamdHYkRyOFhIc1hDblhYZzRaRENqYXBDeTRIbW1SVXRVb0FkdUdOQmRHVk1pd0U5V3ZWYnBNRkZjTmZnRFhHejlOaWF0Z1Nua3hRQUxUSHZHWFhtOGJuNENvTEZ6S25BdHEzS3dpV3FIbVYzR2pGWWVVbTNtOFplZTlWRGZaQXZEc2hhNTFhY3hmdG8xaHRzdHhZdTY2RFdwVDM2WVQxOFdTYnhpYlpjS1hhN2dacnJzQ3d5emlkOENDV3c3OURiYUxDVWlxOXU0N1Zxb2ZHMWtneHd1dXlIYjhOVm5UZ1JUa1FBU1NiajIzMmZ5RzdZZVg0bUF2Wlk3YTdLN3lmU3l6SmFYZFVkUjdhTGVDZExQNm1iRkRxVU1yTjZZRWtVMlg4ZDRDazNUXCJcbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmJ1aWxkR2VuZXNpcyhnZW5lc2lzRGF0YSlcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgICAgcmVzdWx0OiB7XG4gICAgICAgICAgYnl0ZXM6IGJ5dGVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3BvbnNlT2JqOiB7XG4gICAgICAgIGRhdGE6IG9iamVjdFxuICAgICAgfSA9IHtcbiAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgfVxuXG4gICAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGJ5dGVzKVxuICAgIH0pXG4gIH0pXG59KVxuIl19