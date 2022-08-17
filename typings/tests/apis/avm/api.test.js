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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F2bS9hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBQ3ZDLDZCQUEwQjtBQUMxQixtREFBa0Q7QUFDbEQsNkRBQWtFO0FBQ2xFLG9DQUFnQztBQUNoQyxrREFBc0I7QUFDdEIsMkVBQWtEO0FBQ2xELHVEQUEyRDtBQUMzRCx5REFHcUM7QUFDckMsOERBQW9DO0FBQ3BDLGlEQUF5RDtBQUN6RCwrREFBOEQ7QUFDOUQsMkRBTXNDO0FBQ3RDLG1EQUlrQztBQUNsQywrQ0FBZ0M7QUFDaEMsd0RBQXdEO0FBQ3hELHVFQUFtRTtBQUNuRSw0REFBdUQ7QUFDdkQsd0VBQTREO0FBQzVELHVEQUF5RDtBQUN6RCwrREFBMkQ7QUFDM0QsNERBQThEO0FBQzlELDhFQUEwRTtBQUMxRSw0REFBcUQ7QUFDckQsb0VBS3lDO0FBT3pDLHFDQUFvQztBQUNwQyxxQ0FBb0M7QUFFcEM7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2hFLE1BQU0saUJBQWlCLEdBQVksS0FBSyxDQUFBO0FBQ3hDLE1BQU0sT0FBTyxHQUF1QixTQUFTLENBQUE7QUFFN0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFvQixFQUFFLElBQVksRUFBUSxFQUFFO0lBQzlELElBQUksaUJBQWlCLEVBQUU7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FDVCxJQUFJLENBQUMsU0FBUyxDQUNaLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxHQUFHLGlCQUFpQixDQUFDLENBQ3hFLENBQ0YsQ0FBQTtRQUNELE9B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SUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsTUFBTSxHQUFHLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN6QyxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRW5DLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQs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QUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcclxuaW1wb3J0IHsgQXhpYSB9IGZyb20gXCJzcmNcIlxyXG5pbXBvcnQgeyBBVk1BUEkgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2FwaVwiXHJcbmltcG9ydCB7IEtleVBhaXIsIEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9rZXljaGFpblwiXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IHsgVVRYT1NldCwgVVRYTyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vdXR4b3NcIlxyXG5pbXBvcnQge1xyXG4gIFRyYW5zZmVyYWJsZUlucHV0LFxyXG4gIFNFQ1BUcmFuc2ZlcklucHV0XHJcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbnB1dHNcIlxyXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxyXG5pbXBvcnQgeyBVbnNpZ25lZFR4LCBUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vdHhcIlxyXG5pbXBvcnQgeyBBVk1Db25zdGFudHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7XHJcbiAgVHJhbnNmZXJhYmxlT3V0cHV0LFxyXG4gIFNFQ1BUcmFuc2Zlck91dHB1dCxcclxuICBORlRNaW50T3V0cHV0LFxyXG4gIE5GVFRyYW5zZmVyT3V0cHV0LFxyXG4gIFNFQ1BNaW50T3V0cHV0XHJcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9vdXRwdXRzXCJcclxuaW1wb3J0IHtcclxuICBORlRUcmFuc2Zlck9wZXJhdGlvbixcclxuICBUcmFuc2ZlcmFibGVPcGVyYXRpb24sXHJcbiAgU0VDUE1pbnRPcGVyYXRpb25cclxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL29wc1wiXHJcbmltcG9ydCAqIGFzIGJlY2gzMiBmcm9tIFwiYmVjaDMyXCJcclxuaW1wb3J0IHsgVVRGOFBheWxvYWQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BheWxvYWRcIlxyXG5pbXBvcnQgeyBJbml0aWFsU3RhdGVzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbml0aWFsc3RhdGVzXCJcclxuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXHJcbmltcG9ydCB7IFVuaXhOb3cgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IE91dHB1dE93bmVycyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvY29tbW9uL291dHB1dFwiXHJcbmltcG9ydCB7IE1pbnRlclNldCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vbWludGVyc2V0XCJcclxuaW1wb3J0IHsgUGxhdGZvcm1DaGFpbklEIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BlcnNpc3RlbmNlb3B0aW9uc1wiXHJcbmltcG9ydCB7IE9ORUFYQyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHtcclxuICBTZXJpYWxpemFibGUsXHJcbiAgU2VyaWFsaXphdGlvbixcclxuICBTZXJpYWxpemVkRW5jb2RpbmcsXHJcbiAgU2VyaWFsaXplZFR5cGVcclxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxyXG5pbXBvcnQge1xyXG4gIEdldEJhbGFuY2VSZXNwb25zZSxcclxuICBTZW5kTXVsdGlwbGVSZXNwb25zZSxcclxuICBTZW5kUmVzcG9uc2VcclxufSBmcm9tIFwic3JjL2FwaXMvYXZtL2ludGVyZmFjZXNcIlxyXG5pbXBvcnQgeyBDRU5USUFYQyB9IGZyb20gXCJzcmMvdXRpbHNcIlxyXG5pbXBvcnQgeyBNSUxMSUFYQyB9IGZyb20gXCJzcmMvdXRpbHNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBkdW1wU2VyYWlsaXphdGlvbjogYm9vbGVhbiA9IGZhbHNlXHJcbmNvbnN0IGRpc3BsYXk6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiZGlzcGxheVwiXHJcblxyXG5jb25zdCBzZXJpYWx6ZWl0ID0gKGFUaGluZzogU2VyaWFsaXphYmxlLCBuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICBpZiAoZHVtcFNlcmFpbGl6YXRpb24pIHtcclxuICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICBzZXJpYWxpemF0aW9uLnNlcmlhbGl6ZShhVGhpbmcsIFwiYXZtXCIsIFwiaGV4XCIsIG5hbWUgKyBcIiAtLSBIZXggRW5jb2RlZFwiKVxyXG4gICAgICApXHJcbiAgICApXHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgc2VyaWFsaXphdGlvbi5zZXJpYWxpemUoXHJcbiAgICAgICAgICBhVGhpbmcsXHJcbiAgICAgICAgICBcImF2bVwiLFxyXG4gICAgICAgICAgXCJkaXNwbGF5XCIsXHJcbiAgICAgICAgICBuYW1lICsgXCIgLS0gSHVtYW4tUmVhZGFibGVcIlxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxuZGVzY3JpYmUoXCJBVk1BUElcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IG5ldHdvcmtJRDogbnVtYmVyID0gMTMzN1xyXG4gIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdLlN3YXAuYmxvY2tjaGFpbklEXHJcbiAgY29uc3QgaXA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCJcclxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MFxyXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcclxuXHJcbiAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQXhpYUNvaW5cIlxyXG4gIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcInBhc3N3b3JkXCJcclxuXHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxyXG4gICAgaXAsXHJcbiAgICBwb3J0LFxyXG4gICAgcHJvdG9jb2wsXHJcbiAgICBuZXR3b3JrSUQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB0cnVlXHJcbiAgKVxyXG4gIGxldCBhcGk6IEFWTUFQSVxyXG4gIGxldCBhbGlhczogc3RyaW5nXHJcblxyXG4gIGNvbnN0IGFkZHJBOiBzdHJpbmcgPSBgU3dhcC0ke2JlY2gzMi5iZWNoMzIuZW5jb2RlKFxyXG4gICAgYXhpYS5nZXRIUlAoKSxcclxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIkI2RDR2MVZ0UFlMYmlVdllYdFc0UHg4b0U5aW1DMnZHV1wiKVxyXG4gICAgKVxyXG4gICl9YFxyXG4gIGNvbnN0IGFkZHJCOiBzdHJpbmcgPSBgU3dhcC0ke2JlY2gzMi5iZWNoMzIuZW5jb2RlKFxyXG4gICAgYXhpYS5nZXRIUlAoKSxcclxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIlA1d2RSdVplYUR0MjhlSE1QNVMzdzlaZG9CZm83d3V6RlwiKVxyXG4gICAgKVxyXG4gICl9YFxyXG4gIGNvbnN0IGFkZHJDOiBzdHJpbmcgPSBgU3dhcC0ke2JlY2gzMi5iZWNoMzIuZW5jb2RlKFxyXG4gICAgYXhpYS5nZXRIUlAoKSxcclxuICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIjZZM2t5c2pGOWpuSG5Za2RTOXlHQXVvSHlhZTJlTm1lVlwiKVxyXG4gICAgKVxyXG4gICl9YFxyXG5cclxuICBiZWZvcmVBbGwoKCk6IHZvaWQgPT4ge1xyXG4gICAgYXBpID0gbmV3IEFWTUFQSShheGlhLCBcIi9leHQvYmMvU3dhcFwiLCBibG9ja2NoYWluSUQpXHJcbiAgICBhbGlhcyA9IGFwaS5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gIH0pXHJcblxyXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XHJcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJmYWlscyB0byBzZW5kIHdpdGggaW5jb3JyZWN0IHVzZXJuYW1lXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IG1lbW86IHN0cmluZyA9IFwiaGVsbG8gd29ybGRcIlxyXG4gICAgY29uc3QgaW5jb3JyZWN0VXNlck5hbWU6IHN0cmluZyA9IFwiYXNkZmFzZGZzYVwiXHJcbiAgICBjb25zdCBtZXNzYWdlOiBzdHJpbmcgPSBgcHJvYmxlbSByZXRyaWV2aW5nIHVzZXI6IGluY29ycmVjdCBwYXNzd29yZCBmb3IgdXNlciBcIiR7aW5jb3JyZWN0VXNlck5hbWV9XCJgXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8U2VuZFJlc3BvbnNlPiA9IGFwaS5zZW5kKFxyXG4gICAgICBpbmNvcnJlY3RVc2VyTmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIFwiYXNzZXRJZFwiLFxyXG4gICAgICAxMCxcclxuICAgICAgYWRkckEsXHJcbiAgICAgIFthZGRyQl0sXHJcbiAgICAgIGFkZHJBLFxyXG4gICAgICBtZW1vXHJcbiAgICApXHJcblxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBjb2RlOiAtMzIwMDAsXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICBkYXRhOiBudWxsXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJjb2RlXCJdKS50b0JlKC0zMjAwMClcclxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1lc3NhZ2VcIl0pLnRvQmUobWVzc2FnZSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZmFpbHMgdG8gc2VuZCB3aXRoIGluY29ycmVjdCBQYXNzd29yZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBtZW1vOiBzdHJpbmcgPSBcImhlbGxvIHdvcmxkXCJcclxuICAgIGNvbnN0IGluY29ycmVjdFBhc3N3b3JkOiBzdHJpbmcgPSBcImFzZGZhc2Rmc2FcIlxyXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID0gYHByb2JsZW0gcmV0cmlldmluZyB1c2VyOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCIke2luY29ycmVjdFBhc3N3b3JkfVwiYFxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFNlbmRSZXNwb25zZT4gPSBhcGkuc2VuZChcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIGluY29ycmVjdFBhc3N3b3JkLFxyXG4gICAgICBcImFzc2V0SWRcIixcclxuICAgICAgMTAsXHJcbiAgICAgIGFkZHJBLFxyXG4gICAgICBbYWRkckJdLFxyXG4gICAgICBhZGRyQSxcclxuICAgICAgbWVtb1xyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgY29kZTogLTMyMDAwLFxyXG4gICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgZGF0YTogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY29kZVwiXSkudG9CZSgtMzIwMDApXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJtZXNzYWdlXCJdKS50b0JlKG1lc3NhZ2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNhbiBTZW5kIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdHhJZDogc3RyaW5nID0gXCJhc2RmaHZsMjM0XCJcclxuICAgIGNvbnN0IG1lbW86IHN0cmluZyA9IFwiaGVsbG8gd29ybGRcIlxyXG4gICAgY29uc3QgY2hhbmdlQWRkcjogc3RyaW5nID0gXCJTd2FwLWxvY2FsMVwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8U2VuZFJlc3BvbnNlPiA9IGFwaS5zZW5kKFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIFwiYXNzZXRJZFwiLFxyXG4gICAgICAxMCxcclxuICAgICAgYWRkckEsXHJcbiAgICAgIFthZGRyQl0sXHJcbiAgICAgIGFkZHJBLFxyXG4gICAgICBtZW1vXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHR4SWQsXHJcbiAgICAgICAgY2hhbmdlQWRkcjogY2hhbmdlQWRkclxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1widHhJRFwiXSkudG9CZSh0eElkKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY2hhbmdlQWRkclwiXSkudG9CZShjaGFuZ2VBZGRyKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJjYW4gU2VuZCAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHR4SWQ6IHN0cmluZyA9IFwiYXNkZmh2bDIzNFwiXHJcbiAgICBjb25zdCBtZW1vOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcImhlbGxvIHdvcmxkXCIpXHJcbiAgICBjb25zdCBjaGFuZ2VBZGRyOiBzdHJpbmcgPSBcIlN3YXAtbG9jYWwxXCJcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxTZW5kUmVzcG9uc2U+ID0gYXBpLnNlbmQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYmludG9vbHMuYjU4VG9CdWZmZXIoXCI2aDJzNWRlMVZDNjVtZWFqRTFMMlBqdloxTVh2SGMzRjZlcVBDR0t1RHQ0TXhpd2VGXCIpLFxyXG4gICAgICBuZXcgQk4oMTApLFxyXG4gICAgICBhZGRyQSxcclxuICAgICAgW2FkZHJCXSxcclxuICAgICAgYWRkckEsXHJcbiAgICAgIG1lbW9cclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdHhJZCxcclxuICAgICAgICBjaGFuZ2VBZGRyOiBjaGFuZ2VBZGRyXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJ0eElEXCJdKS50b0JlKHR4SWQpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJjaGFuZ2VBZGRyXCJdKS50b0JlKGNoYW5nZUFkZHIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNhbiBTZW5kIE11bHRpcGxlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHR4SWQ6IHN0cmluZyA9IFwiYXNkZmh2bDIzNFwiXHJcbiAgICBjb25zdCBtZW1vOiBzdHJpbmcgPSBcImhlbGxvIHdvcmxkXCJcclxuICAgIGNvbnN0IGNoYW5nZUFkZHI6IHN0cmluZyA9IFwiU3dhcC1sb2NhbDFcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPFNlbmRNdWx0aXBsZVJlc3BvbnNlPiA9IGFwaS5zZW5kTXVsdGlwbGUoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgW3sgYXNzZXRJRDogXCJhc3NldElkXCIsIGFtb3VudDogMTAsIHRvOiBhZGRyQSB9XSxcclxuICAgICAgW2FkZHJCXSxcclxuICAgICAgYWRkckEsXHJcbiAgICAgIG1lbW9cclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdHhJZCxcclxuICAgICAgICBjaGFuZ2VBZGRyOiBjaGFuZ2VBZGRyXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IFNlbmRNdWx0aXBsZVJlc3BvbnNlID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZVtcInR4SURcIl0pLnRvQmUodHhJZClcclxuICAgIGV4cGVjdChyZXNwb25zZVtcImNoYW5nZUFkZHJcIl0pLnRvQmUoY2hhbmdlQWRkcilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwicmVmcmVzaEJsb2NrY2hhaW5JRFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBuM2JjSUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbM10uU3dhcFtcImJsb2NrY2hhaW5JRFwiXVxyXG4gICAgY29uc3QgbjEzMzdiY0lEOiBzdHJpbmcgPSBEZWZhdWx0cy5uZXR3b3JrWzEzMzddLlN3YXBbXCJibG9ja2NoYWluSURcIl1cclxuICAgIGNvbnN0IHRlc3RBUEk6IEFWTUFQSSA9IG5ldyBBVk1BUEkoYXhpYSwgXCIvZXh0L2JjL2F2bVwiLCBuM2JjSUQpXHJcbiAgICBjb25zdCBiYzE6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzEpLnRvQmUobjNiY0lEKVxyXG5cclxuICAgIHRlc3RBUEkucmVmcmVzaEJsb2NrY2hhaW5JRCgpXHJcbiAgICBjb25zdCBiYzI6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzIpLnRvQmUobjEzMzdiY0lEKVxyXG5cclxuICAgIHRlc3RBUEkucmVmcmVzaEJsb2NrY2hhaW5JRChuM2JjSUQpXHJcbiAgICBjb25zdCBiYzM6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzMpLnRvQmUobjNiY0lEKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJsaXN0QWRkcmVzc2VzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFkZHJlc3NlcyA9IFthZGRyQSwgYWRkckJdXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLmxpc3RBZGRyZXNzZXModXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhZGRyZXNzZXNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFkZHJlc3NlcylcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaW1wb3J0S2V5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFkZHJlc3MgPSBhZGRyQ1xyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuaW1wb3J0S2V5KHVzZXJuYW1lLCBwYXNzd29yZCwgXCJrZXlcIilcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgYWRkcmVzc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFkZHJlc3MpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEJhbGFuY2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYmFsYW5jZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXHJcbiAgICBjb25zdCByZXNwb2JqOiBHZXRCYWxhbmNlUmVzcG9uc2UgPSB7XHJcbiAgICAgIGJhbGFuY2UsXHJcbiAgICAgIHV0eG9JRHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eElEOiBcIkxVcmlCM1c5MTlGODRMd1BNTXc0c20yZlo0WTc2V2diNm1zYWF1RVk3aTF0Rk5tdHZcIixcclxuICAgICAgICAgIG91dHB1dEluZGV4OiAwXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldEJhbGFuY2VSZXNwb25zZT4gPSBhcGkuZ2V0QmFsYW5jZShhZGRyQSwgXCJBVEhcIilcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSkudG9CZShKU09OLnN0cmluZ2lmeShyZXNwb2JqKSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QmFsYW5jZSBpbmNsdWRlUGFydGlhbFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBiYWxhbmNlOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcclxuICAgIGNvbnN0IHJlc3BvYmogPSB7XHJcbiAgICAgIGJhbGFuY2UsXHJcbiAgICAgIHV0eG9JRHM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eElEOiBcIkxVcmlCM1c5MTlGODRMd1BNTXc0c20yZlo0WTc2V2diNm1zYWF1RVk3aTF0Rk5tdHZcIixcclxuICAgICAgICAgIG91dHB1dEluZGV4OiAwXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldEJhbGFuY2VSZXNwb25zZT4gPSBhcGkuZ2V0QmFsYW5jZShcclxuICAgICAgYWRkckEsXHJcbiAgICAgIFwiQVRIXCIsXHJcbiAgICAgIHRydWVcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhwZWN0ZWRSZXF1ZXN0UGF5bG9hZCA9IHtcclxuICAgICAgaWQ6IDEsXHJcbiAgICAgIG1ldGhvZDogXCJhdm0uZ2V0QmFsYW5jZVwiLFxyXG4gICAgICBwYXJhbXM6IHtcclxuICAgICAgICBhZGRyZXNzOiBhZGRyQSxcclxuICAgICAgICBhc3NldElEOiBcIkFUSFwiLFxyXG4gICAgICAgIGluY2x1ZGVQYXJ0aWFsOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIGpzb25ycGM6IFwiMi4wXCJcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG4gICAgY29uc3QgY2FsbGVkV2l0aDogb2JqZWN0ID0ge1xyXG4gICAgICBiYXNlVVJMOiBcImh0dHBzOi8vMTI3LjAuMC4xOjgwXCIsXHJcbiAgICAgIGRhdGE6ICd7XCJpZFwiOjksXCJtZXRob2RcIjpcImF2bS5nZXRCYWxhbmNlXCIsXCJwYXJhbXNcIjp7XCJhZGRyZXNzXCI6XCJTd2FwLWN1c3RvbTFkNmtrajBxaDR3Y211czN0azU5bnB3dDNybHVjNmVuNzU1YTU4Z1wiLFwiYXNzZXRJRFwiOlwiQVRIXCIsXCJpbmNsdWRlUGFydGlhbFwiOnRydWV9LFwianNvbnJwY1wiOlwiMi4wXCJ9JyxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCJcclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgcGFyYW1zOiB7fSxcclxuICAgICAgcmVzcG9uc2VUeXBlOiBcImpzb25cIixcclxuICAgICAgdXJsOiBcIi9leHQvYmMvU3dhcFwiXHJcbiAgICB9XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0JlQ2FsbGVkV2l0aChjYWxsZWRXaXRoKVxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkocmVzcG9iaikpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImV4cG9ydEtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IFwic2RmZ2x2bGoyaDN2NDVcIlxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmV4cG9ydEtleSh1c2VybmFtZSwgcGFzc3dvcmQsIGFkZHJBKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBwcml2YXRlS2V5OiBrZXlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShrZXkpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImV4cG9ydFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKDEwMClcclxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBjb25zdCBhc3NldElEOiBzdHJpbmcgPSBcIkFYQ1wiXHJcbiAgICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJSb2JlcnRcIlxyXG4gICAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwiUGF1bHNvblwiXHJcbiAgICBjb25zdCB0eElEOiBzdHJpbmcgPSBcInZhbGlkXCJcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmV4cG9ydChcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0byxcclxuICAgICAgYW1vdW50LFxyXG4gICAgICBhc3NldElEXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHR4SURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eElEKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJpbXBvcnRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdG86IHN0cmluZyA9IFwiYWJjZGVmXCJcclxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXHJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJQYXVsc29uXCJcclxuICAgIGNvbnN0IHR4SUQ6IHN0cmluZyA9IFwidmFsaWRcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuaW1wb3J0KFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIHRvLFxyXG4gICAgICBibG9ja2NoYWluSURcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdHhJRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4SUQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNyZWF0ZUFkZHJlc3NcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYWxpYXM6IHN0cmluZyA9IFwicmFuZG9tYWxpYXNcIlxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmNyZWF0ZUFkZHJlc3ModXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhZGRyZXNzOiBhbGlhc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFsaWFzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJjcmVhdGVGaXhlZENhcEFzc2V0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGtwOiBLZXlQYWlyID0gbmV3IEtleVBhaXIoYXhpYS5nZXRIUlAoKSwgYWxpYXMpXHJcbiAgICBrcC5pbXBvcnRLZXkoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiZWY5YmYyZDQ0MzY0OTFjMTUzOTY3Yzk3MDlkZDhlODI3OTViZGI5YjVhZDQ0ZWUyMmMyOTAzMDA1ZDFjZjY3NlwiLFxyXG4gICAgICAgIFwiaGV4XCJcclxuICAgICAgKVxyXG4gICAgKVxyXG5cclxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gMFxyXG4gICAgY29uc3QgYXNzZXRJRDogc3RyaW5nID1cclxuICAgICAgXCI4YTVkMmQzMmU2OGJjNTAwMzZlNGQwODYwNDQ2MTdmZTRhMGEwMjk2YjI3NDk5OWJhNTY4ZWE5MmRhNDZkNTMzXCJcclxuICAgIGNvbnN0IGluaXRpYWxIb2xkZXJzOiBvYmplY3RbXSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGFkZHJlc3M6IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCIsXHJcbiAgICAgICAgYW1vdW50OiBcIjEwMDAwXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGFkZHJlc3M6IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCIsXHJcbiAgICAgICAgYW1vdW50OiBcIjUwMDAwXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmNyZWF0ZUZpeGVkQ2FwQXNzZXQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgXCJTb21lIENvaW5cIixcclxuICAgICAgXCJTQ0NcIixcclxuICAgICAgZGVub21pbmF0aW9uLFxyXG4gICAgICBpbml0aWFsSG9sZGVyc1xyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhc3NldElEOiBhc3NldElEXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYXNzZXRJRClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiY3JlYXRlVmFyaWFibGVDYXBBc3NldFwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBrcDogS2V5UGFpciA9IG5ldyBLZXlQYWlyKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxyXG4gICAga3AuaW1wb3J0S2V5KFxyXG4gICAgICBCdWZmZXIuZnJvbShcclxuICAgICAgICBcImVmOWJmMmQ0NDM2NDkxYzE1Mzk2N2M5NzA5ZGQ4ZTgyNzk1YmRiOWI1YWQ0NGVlMjJjMjkwMzAwNWQxY2Y2NzZcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgICBjb25zdCBkZW5vbWluYXRpb246IG51bWJlciA9IDBcclxuICAgIGNvbnN0IGFzc2V0SUQ6IHN0cmluZyA9XHJcbiAgICAgIFwiOGE1ZDJkMzJlNjhiYzUwMDM2ZTRkMDg2MDQ0NjE3ZmU0YTBhMDI5NmIyNzQ5OTliYTU2OGVhOTJkYTQ2ZDUzM1wiXHJcbiAgICBjb25zdCBtaW50ZXJTZXRzOiBvYmplY3RbXSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIG1pbnRlcnM6IFtcIjRwZUpzRnZoZG43WGpoTkY0SFdBUXk2WWFKdHMyN3M5cVwiXSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDFcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG1pbnRlcnM6IFtcclxuICAgICAgICAgIFwiZGNKNno5ZHVMZnlRVGdianEyd0JDb3drdmNQWkhWREZcIixcclxuICAgICAgICAgIFwiMmZFNmlpYnFmRVJ6NXdlblhFNnF5dmluc3hEdkZoSFprXCIsXHJcbiAgICAgICAgICBcIjdpZUFKYmZyR1FicE5aUkFRRXBaQ0MxR3MxejVnejRIVVwiXHJcbiAgICAgICAgXSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDJcclxuICAgICAgfVxyXG4gICAgXVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmNyZWF0ZVZhcmlhYmxlQ2FwQXNzZXQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgXCJTb21lIENvaW5cIixcclxuICAgICAgXCJTQ0NcIixcclxuICAgICAgZGVub21pbmF0aW9uLFxyXG4gICAgICBtaW50ZXJTZXRzXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGFzc2V0SUQ6IGFzc2V0SURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhc3NldElEKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJtaW50IDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQ29sbGluXCJcclxuICAgIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcIkN1c2NlXCJcclxuICAgIGNvbnN0IGFtb3VudDogbnVtYmVyID0gMlxyXG4gICAgY29uc3QgYXNzZXRJRDogc3RyaW5nID1cclxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCJcclxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImRjSjZ6OWR1TGZ5UVRnYmpxMndCQ293a3ZjUFpIVkRGXCJcclxuICAgIGNvbnN0IG1pbnRlcnM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcImRjSjZ6OWR1TGZ5UVRnYmpxMndCQ293a3ZjUFpIVkRGXCIsXHJcbiAgICAgIFwiMmZFNmlpYnFmRVJ6NXdlblhFNnF5dmluc3hEdkZoSFprXCIsXHJcbiAgICAgIFwiN2llQUpiZnJHUWJwTlpSQVFFcFpDQzFHczF6NWd6NEhVXCJcclxuICAgIF1cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLm1pbnQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYW1vdW50LFxyXG4gICAgICBhc3NldElELFxyXG4gICAgICB0byxcclxuICAgICAgbWludGVyc1xyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eElEOiBcInNvbWV0eFwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoXCJzb21ldHhcIilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwibWludCAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIkNvbGxpblwiXHJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJDdXNjZVwiXHJcbiAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKDEpXHJcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcclxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCIsXHJcbiAgICAgIFwiaGV4XCJcclxuICAgIClcclxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImRjSjZ6OWR1TGZ5UVRnYmpxMndCQ293a3ZjUFpIVkRGXCJcclxuICAgIGNvbnN0IG1pbnRlcnM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcImRjSjZ6OWR1TGZ5UVRnYmpxMndCQ293a3ZjUFpIVkRGXCIsXHJcbiAgICAgIFwiMmZFNmlpYnFmRVJ6NXdlblhFNnF5dmluc3hEdkZoSFprXCIsXHJcbiAgICAgIFwiN2llQUpiZnJHUWJwTlpSQVFFcFpDQzFHczF6NWd6NEhVXCJcclxuICAgIF1cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLm1pbnQoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYW1vdW50LFxyXG4gICAgICBhc3NldElELFxyXG4gICAgICB0byxcclxuICAgICAgbWludGVyc1xyXG4gICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eElEOiBcInNvbWV0eFwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoXCJzb21ldHhcIilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdHhpZDogc3RyaW5nID1cclxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCJcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgb2JqZWN0PiA9IGFwaS5nZXRUeCh0eGlkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eDogXCJzb21ldHhcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwic29tZXR4XCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFR4U3RhdHVzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHR4aWQ6IHN0cmluZyA9XHJcbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuZ2V0VHhTdGF0dXModHhpZClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3RhdHVzOiBcImFjY2VwdGVkXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcImFjY2VwdGVkXCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEFzc2V0RGVzY3JpcHRpb24gYXMgc3RyaW5nXCIsIGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGFzc2V0SUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxyXG4gICAgICBcIjhhNWQyZDMyZTY4YmM1MDAzNmU0ZDA4NjA0NDYxN2ZlNGEwYTAyOTZiMjc0OTk5YmE1NjhlYTkyZGE0NmQ1MzNcIixcclxuICAgICAgXCJoZXhcIlxyXG4gICAgKVxyXG4gICAgY29uc3QgYXNzZXRpZHN0cjogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldEFzc2V0RGVzY3JpcHRpb24oYXNzZXRpZHN0cilcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgbmFtZTogXCJDb2xsaW4gQ29pblwiLFxyXG4gICAgICAgIHN5bWJvbDogXCJDS0NcIixcclxuICAgICAgICBhc3NldElEOiBhc3NldGlkc3RyLFxyXG4gICAgICAgIGRlbm9taW5hdGlvbjogXCIxMFwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UubmFtZSkudG9CZShcIkNvbGxpbiBDb2luXCIpXHJcbiAgICBleHBlY3QocmVzcG9uc2Uuc3ltYm9sKS50b0JlKFwiQ0tDXCIpXHJcbiAgICBleHBlY3QocmVzcG9uc2UuYXNzZXRJRC50b1N0cmluZyhcImhleFwiKSkudG9CZShhc3NldElELnRvU3RyaW5nKFwiaGV4XCIpKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlLmRlbm9taW5hdGlvbikudG9CZSgxMClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QXNzZXREZXNjcmlwdGlvbiBhcyBCdWZmZXJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgIFwiOGE1ZDJkMzJlNjhiYzUwMDM2ZTRkMDg2MDQ0NjE3ZmU0YTBhMDI5NmIyNzQ5OTliYTU2OGVhOTJkYTQ2ZDUzM1wiLFxyXG4gICAgICBcImhleFwiXHJcbiAgICApXHJcbiAgICBjb25zdCBhc3NldGlkc3RyOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKFxyXG4gICAgICBCdWZmZXIuZnJvbShcclxuICAgICAgICBcIjhhNWQyZDMyZTY4YmM1MDAzNmU0ZDA4NjA0NDYxN2ZlNGEwYTAyOTZiMjc0OTk5YmE1NjhlYTkyZGE0NmQ1MzNcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGFwaS5nZXRBc3NldERlc2NyaXB0aW9uKGFzc2V0SUQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIG5hbWU6IFwiQ29sbGluIENvaW5cIixcclxuICAgICAgICBzeW1ib2w6IFwiQ0tDXCIsXHJcbiAgICAgICAgYXNzZXRJRDogYXNzZXRpZHN0cixcclxuICAgICAgICBkZW5vbWluYXRpb246IFwiMTFcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlLm5hbWUpLnRvQmUoXCJDb2xsaW4gQ29pblwiKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlLnN5bWJvbCkudG9CZShcIkNLQ1wiKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlLmFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoYXNzZXRJRC50b1N0cmluZyhcImhleFwiKSlcclxuICAgIGV4cGVjdChyZXNwb25zZS5kZW5vbWluYXRpb24pLnRvQmUoMTEpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIC8vIFBheW1lbnRcclxuICAgIGNvbnN0IE9QVVRYT3N0cjE6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMDM4ZDFiOWYxMTM4NjcyZGE2ZmI2YzM1MTI1NTM5Mjc2YTlhY2MyYTY2OGQ2M2JlYTZiYTNjNzk1ZTJlZGIwZjUwMDAwMDAwMTNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDRkZDUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWEzNmZkMGMyZGJjYWIzMTE3MzFkZGU3ZWYxNTE0YmQyNmZjZGM3NGRcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuICAgIGNvbnN0IE9QVVRYT3N0cjI6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMGMzZTQ4MjM1NzE1ODdmZTJiZGZjNTAyNjg5ZjVhODIzOGI5ZDBlYTdmMzI3NzEyNGQxNmFmOWRlMGQyZDk5MTEwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuICAgIGNvbnN0IE9QVVRYT3N0cjM6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMGYyOWRiYTYxZmRhOGQ1N2E5MTFlN2Y4ODEwZjkzNWJkZTgxMGQzZjhkNDk1NDA0Njg1YmRiOGQ5ZDg1NDVlODYwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBzZXQuYWRkKE9QVVRYT3N0cjEpXHJcbiAgICBzZXQuYWRkQXJyYXkoW09QVVRYT3N0cjIsIE9QVVRYT3N0cjNdKVxyXG5cclxuICAgIGNvbnN0IHBlcnNpc3RPcHRzOiBQZXJzaXN0YW5jZU9wdGlvbnMgPSBuZXcgUGVyc2lzdGFuY2VPcHRpb25zKFxyXG4gICAgICBcInRlc3RcIixcclxuICAgICAgdHJ1ZSxcclxuICAgICAgXCJ1bmlvblwiXHJcbiAgICApXHJcbiAgICBleHBlY3QocGVyc2lzdE9wdHMuZ2V0TWVyZ2VSdWxlKCkpLnRvQmUoXCJ1bmlvblwiKVxyXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBzZXRcclxuICAgICAgLmdldEFkZHJlc3NlcygpXHJcbiAgICAgIC5tYXAoKGEpID0+IGFwaS5hZGRyZXNzRnJvbUJ1ZmZlcihhKSlcclxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8e1xyXG4gICAgICBudW1GZXRjaGVkOiBudW1iZXJcclxuICAgICAgdXR4b3M6IFVUWE9TZXRcclxuICAgICAgZW5kSW5kZXg6IHsgYWRkcmVzczogc3RyaW5nOyB1dHhvOiBzdHJpbmcgfVxyXG4gICAgfT4gPSBhcGkuZ2V0VVRYT3MoXHJcbiAgICAgIGFkZHJlc3NlcyxcclxuICAgICAgYXBpLmdldEJsb2NrY2hhaW5JRCgpLFxyXG4gICAgICAwLFxyXG4gICAgICB1bmRlZmluZWQsXHJcbiAgICAgIHBlcnNpc3RPcHRzXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIG51bUZldGNoZWQ6IDMsXHJcbiAgICAgICAgdXR4b3M6IFtPUFVUWE9zdHIxLCBPUFVUWE9zdHIyLCBPUFVUWE9zdHIzXSxcclxuICAgICAgICBzdG9wSW5kZXg6IHsgYWRkcmVzczogXCJhXCIsIHV0eG86IFwiYlwiIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBsZXQgcmVzcG9uc2U6IFVUWE9TZXQgPSAoYXdhaXQgcmVzdWx0KS51dHhvc1xyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkpKS50b0JlKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeShzZXQuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkpXHJcbiAgICApXHJcblxyXG4gICAgYWRkcmVzc2VzID0gc2V0LmdldEFkZHJlc3NlcygpLm1hcCgoYSkgPT4gYXBpLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxyXG4gICAgcmVzdWx0ID0gYXBpLmdldFVUWE9zKFxyXG4gICAgICBhZGRyZXNzZXMsXHJcbiAgICAgIGFwaS5nZXRCbG9ja2NoYWluSUQoKSxcclxuICAgICAgMCxcclxuICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICBwZXJzaXN0T3B0c1xyXG4gICAgKVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICByZXNwb25zZSA9IChhd2FpdCByZXN1bHQpLnV0eG9zXHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcclxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZS5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSkpLnRvQmUoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNldC5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSlcclxuICAgIClcclxuICB9KVxyXG5cclxuICBkZXNjcmliZShcIlRyYW5zYWN0aW9uc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBsZXQgc2V0OiBVVFhPU2V0XHJcbiAgICBsZXQga2V5bWdyMjogS2V5Q2hhaW5cclxuICAgIGxldCBrZXltZ3IzOiBLZXlDaGFpblxyXG4gICAgbGV0IGFkZHJzMTogc3RyaW5nW11cclxuICAgIGxldCBhZGRyczI6IHN0cmluZ1tdXHJcbiAgICBsZXQgYWRkcnMzOiBzdHJpbmdbXVxyXG4gICAgbGV0IGFkZHJlc3NidWZmczogQnVmZmVyW10gPSBbXVxyXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbXVxyXG4gICAgbGV0IHV0eG9zOiBVVFhPW11cclxuICAgIGxldCBpbnB1dHM6IFRyYW5zZmVyYWJsZUlucHV0W11cclxuICAgIGxldCBvdXRwdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxyXG4gICAgbGV0IG9wczogVHJhbnNmZXJhYmxlT3BlcmF0aW9uW11cclxuICAgIGxldCBhbW50OiBudW1iZXIgPSAxMDAwMFxyXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKFwibWFyeSBoYWQgYSBsaXR0bGUgbGFtYlwiKS5kaWdlc3QoKVxyXG4gICAgKVxyXG4gICAgY29uc3QgTkZUYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcclxuICAgICAgICAudXBkYXRlKFxyXG4gICAgICAgICAgXCJJIGNhbid0IHN0YW5kIGl0LCBJIGtub3cgeW91IHBsYW5uZWQgaXQsIEknbW1hIHNldCBzdHJhaWdodCB0aGlzIFdhdGVyZ2F0ZS5cIlxyXG4gICAgICAgIClcclxuICAgICAgICAuZGlnZXN0KClcclxuICAgIClcclxuICAgIGxldCBzZWNwYmFzZTE6IFNFQ1BUcmFuc2Zlck91dHB1dFxyXG4gICAgbGV0IHNlY3BiYXNlMjogU0VDUFRyYW5zZmVyT3V0cHV0XHJcbiAgICBsZXQgc2VjcGJhc2UzOiBTRUNQVHJhbnNmZXJPdXRwdXRcclxuICAgIGxldCBpbml0aWFsU3RhdGU6IEluaXRpYWxTdGF0ZXNcclxuICAgIGxldCBuZnRwYmFzZTE6IE5GVE1pbnRPdXRwdXRcclxuICAgIGxldCBuZnRwYmFzZTI6IE5GVE1pbnRPdXRwdXRcclxuICAgIGxldCBuZnRwYmFzZTM6IE5GVE1pbnRPdXRwdXRcclxuICAgIGxldCBuZnRJbml0aWFsU3RhdGU6IEluaXRpYWxTdGF0ZXNcclxuICAgIGxldCBuZnR1dHhvaWRzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBsZXQgZnVuZ3V0eG9pZHM6IHN0cmluZ1tdID0gW11cclxuICAgIGxldCBhdm06IEFWTUFQSVxyXG4gICAgY29uc3QgZmVlOiBudW1iZXIgPSAxMFxyXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gXCJNb3J0eWNvaW4gaXMgdGhlIGR1bWIgYXMgYSBzYWNrIG9mIGhhbW1lcnMuXCJcclxuICAgIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJtb3JUXCJcclxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxyXG5cclxuICAgIGxldCBzZWNwTWludE91dDE6IFNFQ1BNaW50T3V0cHV0XHJcbiAgICBsZXQgc2VjcE1pbnRPdXQyOiBTRUNQTWludE91dHB1dFxyXG4gICAgbGV0IHNlY3BNaW50VFhJRDogQnVmZmVyXHJcbiAgICBsZXQgc2VjcE1pbnRVVFhPOiBVVFhPXHJcbiAgICBsZXQgc2VjcE1pbnRYZmVyT3V0MTogU0VDUFRyYW5zZmVyT3V0cHV0XHJcbiAgICBsZXQgc2VjcE1pbnRYZmVyT3V0MjogU0VDUFRyYW5zZmVyT3V0cHV0XHJcbiAgICBsZXQgc2VjcE1pbnRPcDogU0VDUE1pbnRPcGVyYXRpb25cclxuXHJcbiAgICBsZXQgeGZlcnNlY3BtaW50b3A6IFRyYW5zZmVyYWJsZU9wZXJhdGlvblxyXG5cclxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBhdm0gPSBuZXcgQVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Td2FwXCIsIGJsb2NrY2hhaW5JRClcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCdWZmZXI+ID0gYXZtLmdldEFYQ0Fzc2V0SUQodHJ1ZSlcclxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgbmFtZSxcclxuICAgICAgICAgIHN5bWJvbCxcclxuICAgICAgICAgIGFzc2V0SUQ6IGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgICBkZW5vbWluYXRpb246IGRlbm9taW5hdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgICAgfVxyXG5cclxuICAgICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgICAgYXdhaXQgcmVzdWx0XHJcbiAgICAgIHNldCA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgYXZtLm5ld0tleUNoYWluKClcclxuICAgICAga2V5bWdyMiA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcclxuICAgICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcclxuICAgICAgYWRkcnMxID0gW11cclxuICAgICAgYWRkcnMyID0gW11cclxuICAgICAgYWRkcnMzID0gW11cclxuICAgICAgdXR4b3MgPSBbXVxyXG4gICAgICBpbnB1dHMgPSBbXVxyXG4gICAgICBvdXRwdXRzID0gW11cclxuICAgICAgb3BzID0gW11cclxuICAgICAgbmZ0dXR4b2lkcyA9IFtdXHJcbiAgICAgIGZ1bmd1dHhvaWRzID0gW11cclxuICAgICAgY29uc3QgcGxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxMDI0KVxyXG4gICAgICBwbG9hZC53cml0ZShcclxuICAgICAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcclxuICAgICAgICAwLFxyXG4gICAgICAgIDEwMjQsXHJcbiAgICAgICAgXCJ1dGY4XCJcclxuICAgICAgKVxyXG5cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgIGFkZHJzMS5wdXNoKFxyXG4gICAgICAgICAgYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGF2bS5rZXlDaGFpbigpLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFkZHJzMi5wdXNoKGF2bS5hZGRyZXNzRnJvbUJ1ZmZlcihrZXltZ3IyLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpKVxyXG4gICAgICAgIGFkZHJzMy5wdXNoKGF2bS5hZGRyZXNzRnJvbUJ1ZmZlcihrZXltZ3IzLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBPTkVBWEMubXVsKG5ldyBCTihhbW50KSlcclxuICAgICAgYWRkcmVzc2J1ZmZzID0gYXZtLmtleUNoYWluKCkuZ2V0QWRkcmVzc2VzKClcclxuICAgICAgYWRkcmVzc2VzID0gYWRkcmVzc2J1ZmZzLm1hcCgoYSkgPT4gYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gM1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHR4aWQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxyXG4gICAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxyXG4gICAgICAgICAgICAuZGlnZXN0KClcclxuICAgICAgICApXHJcbiAgICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgICAgICB0eGlkeC53cml0ZVVJbnQzMkJFKGksIDApXHJcblxyXG4gICAgICAgIGNvbnN0IG91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICAgIGFtb3VudCxcclxuICAgICAgICAgIGFkZHJlc3NidWZmcyxcclxuICAgICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoYXNzZXRJRCwgb3V0KVxyXG4gICAgICAgIG91dHB1dHMucHVzaCh4ZmVyb3V0KVxyXG5cclxuICAgICAgICBjb25zdCB1OiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgICAgIHUuZnJvbUJ1ZmZlcihcclxuICAgICAgICAgIEJ1ZmZlci5jb25jYXQoW3UuZ2V0Q29kZWNJREJ1ZmZlcigpLCB0eGlkLCB0eGlkeCwgeGZlcm91dC50b0J1ZmZlcigpXSlcclxuICAgICAgICApXHJcbiAgICAgICAgZnVuZ3V0eG9pZHMucHVzaCh1LmdldFVUWE9JRCgpKVxyXG4gICAgICAgIHV0eG9zLnB1c2godSlcclxuXHJcbiAgICAgICAgdHhpZCA9IHUuZ2V0VHhJRCgpXHJcbiAgICAgICAgdHhpZHggPSB1LmdldE91dHB1dElkeCgpXHJcbiAgICAgICAgY29uc3QgYXNzZXQgPSB1LmdldEFzc2V0SUQoKVxyXG5cclxuICAgICAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoYW1vdW50KVxyXG4gICAgICAgIGNvbnN0IHhmZXJpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXHJcbiAgICAgICAgICB0eGlkLFxyXG4gICAgICAgICAgdHhpZHgsXHJcbiAgICAgICAgICBhc3NldCxcclxuICAgICAgICAgIGlucHV0XHJcbiAgICAgICAgKVxyXG4gICAgICAgIGlucHV0cy5wdXNoKHhmZXJpbnB1dClcclxuXHJcbiAgICAgICAgY29uc3Qgbm91dDogTkZUVHJhbnNmZXJPdXRwdXQgPSBuZXcgTkZUVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgICAxMDAwICsgaSxcclxuICAgICAgICAgIHBsb2FkLFxyXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgICApXHJcbiAgICAgICAgY29uc3Qgb3A6IE5GVFRyYW5zZmVyT3BlcmF0aW9uID0gbmV3IE5GVFRyYW5zZmVyT3BlcmF0aW9uKG5vdXQpXHJcbiAgICAgICAgY29uc3QgbmZ0dHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXHJcbiAgICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDEwMDAgKyBpKSwgMzIpKVxyXG4gICAgICAgICAgICAuZGlnZXN0KClcclxuICAgICAgICApXHJcbiAgICAgICAgY29uc3QgbmZ0dXR4bzogVVRYTyA9IG5ldyBVVFhPKFxyXG4gICAgICAgICAgQVZNQ29uc3RhbnRzLkxBVEVTVENPREVDLFxyXG4gICAgICAgICAgbmZ0dHhpZCxcclxuICAgICAgICAgIDEwMDAgKyBpLFxyXG4gICAgICAgICAgTkZUYXNzZXRJRCxcclxuICAgICAgICAgIG5vdXRcclxuICAgICAgICApXHJcbiAgICAgICAgbmZ0dXR4b2lkcy5wdXNoKG5mdHV0eG8uZ2V0VVRYT0lEKCkpXHJcbiAgICAgICAgY29uc3QgeGZlcm9wOiBUcmFuc2ZlcmFibGVPcGVyYXRpb24gPSBuZXcgVHJhbnNmZXJhYmxlT3BlcmF0aW9uKFxyXG4gICAgICAgICAgTkZUYXNzZXRJRCxcclxuICAgICAgICAgIFtuZnR1dHhvLmdldFVUWE9JRCgpXSxcclxuICAgICAgICAgIG9wXHJcbiAgICAgICAgKVxyXG4gICAgICAgIG9wcy5wdXNoKHhmZXJvcClcclxuICAgICAgICB1dHhvcy5wdXNoKG5mdHV0eG8pXHJcbiAgICAgIH1cclxuICAgICAgc2V0LmFkZEFycmF5KHV0eG9zKVxyXG5cclxuICAgICAgc2VjcGJhc2UxID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBuZXcgQk4oNzc3KSxcclxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgMVxyXG4gICAgICApXHJcbiAgICAgIHNlY3BiYXNlMiA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgbmV3IEJOKDg4OCksXHJcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgVW5peE5vdygpLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG4gICAgICBzZWNwYmFzZTMgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTig5OTkpLFxyXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgaW5pdGlhbFN0YXRlID0gbmV3IEluaXRpYWxTdGF0ZXMoKVxyXG4gICAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMSwgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxyXG4gICAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMiwgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxyXG4gICAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMywgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxyXG5cclxuICAgICAgbmZ0cGJhc2UxID0gbmV3IE5GVE1pbnRPdXRwdXQoXHJcbiAgICAgICAgMCxcclxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhcGkucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgbmZ0cGJhc2UyID0gbmV3IE5GVE1pbnRPdXRwdXQoXHJcbiAgICAgICAgMSxcclxuICAgICAgICBhZGRyczIubWFwKChhKSA9PiBhcGkucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgbmZ0cGJhc2UzID0gbmV3IE5GVE1pbnRPdXRwdXQoXHJcbiAgICAgICAgMixcclxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBhcGkucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgbmZ0SW5pdGlhbFN0YXRlID0gbmV3IEluaXRpYWxTdGF0ZXMoKVxyXG4gICAgICBuZnRJbml0aWFsU3RhdGUuYWRkT3V0cHV0KG5mdHBiYXNlMSwgQVZNQ29uc3RhbnRzLk5GVEZYSUQpXHJcbiAgICAgIG5mdEluaXRpYWxTdGF0ZS5hZGRPdXRwdXQobmZ0cGJhc2UyLCBBVk1Db25zdGFudHMuTkZURlhJRClcclxuICAgICAgbmZ0SW5pdGlhbFN0YXRlLmFkZE91dHB1dChuZnRwYmFzZTMsIEFWTUNvbnN0YW50cy5ORlRGWElEKVxyXG5cclxuICAgICAgc2VjcE1pbnRPdXQxID0gbmV3IFNFQ1BNaW50T3V0cHV0KGFkZHJlc3NidWZmcywgbmV3IEJOKDApLCAxKVxyXG4gICAgICBzZWNwTWludE91dDIgPSBuZXcgU0VDUE1pbnRPdXRwdXQoYWRkcmVzc2J1ZmZzLCBuZXcgQk4oMCksIDEpXHJcbiAgICAgIHNlY3BNaW50VFhJRCA9IEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcclxuICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDEzMzcpLCAzMikpXHJcbiAgICAgICAgICAuZGlnZXN0KClcclxuICAgICAgKVxyXG4gICAgICBzZWNwTWludFVUWE8gPSBuZXcgVVRYTyhcclxuICAgICAgICBBVk1Db25zdGFudHMuTEFURVNUQ09ERUMsXHJcbiAgICAgICAgc2VjcE1pbnRUWElELFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBzZWNwTWludE91dDFcclxuICAgICAgKVxyXG4gICAgICBzZWNwTWludFhmZXJPdXQxID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBuZXcgQk4oMTIzKSxcclxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgMlxyXG4gICAgICApXHJcbiAgICAgIHNlY3BNaW50WGZlck91dDIgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTig0NTYpLFxyXG4gICAgICAgIFthdm0ucGFyc2VBZGRyZXNzKGFkZHJzMlswXSldLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgc2VjcE1pbnRPcCA9IG5ldyBTRUNQTWludE9wZXJhdGlvbihzZWNwTWludE91dDEsIHNlY3BNaW50WGZlck91dDEpXHJcblxyXG4gICAgICBzZXQuYWRkKHNlY3BNaW50VVRYTylcclxuXHJcbiAgICAgIHhmZXJzZWNwbWludG9wID0gbmV3IFRyYW5zZmVyYWJsZU9wZXJhdGlvbihcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIFtzZWNwTWludFVUWE8uZ2V0VVRYT0lEKCldLFxyXG4gICAgICAgIHNlY3BNaW50T3BcclxuICAgICAgKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0RGVmYXVsdE1pbnRUeEZlZVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGV4cGVjdChhdm0uZ2V0RGVmYXVsdE1pbnRUeEZlZSgpLnRvU3RyaW5nKCkpLnRvQmUoXCIxMDAwMDAwXCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJzaWduVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkQmFzZVR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBuZXcgQk4oYW1udCksXHJcbiAgICAgICAgYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBuZXcgQk4oYW1udCksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IGF2bS5zaWduVHgodHh1MSlcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IGF2bS5zaWduVHgodHh1MilcclxuXHJcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eDIudG9TdHJpbmcoKSkudG9CZSh0eDEudG9TdHJpbmcoKSlcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQmFzZVR4MVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRCYXNlVHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIG5ldyBCTihhbW50KSxcclxuICAgICAgICBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldENvbnRlbnQoKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG1lbW9idWY6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFwiaGVsbG8gd29ybGRcIilcclxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIG5ldyBCTihhbW50KSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIGFkZHJzMS5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIGFkZHJzMS5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbWVtb2J1ZixcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJ4c3NQcmV2ZW50aW9uT2JqZWN0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczFcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IGF2bS5zaWduVHgodHh1MSlcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHNhbml0aXplZDogb2JqZWN0ID0gdHgxLnNhbml0aXplT2JqZWN0KHR4MW9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbChzYW5pdGl6ZWQpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJ4c3NQcmV2ZW50aW9uSFRNTFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGRpcnR5RG9tOiBzdHJpbmcgPSBcIjxpbWcgc3JjPSdodHRwczovL3gnIG9uZXJyb3I9YWxlcnQoMSkvLz5cIlxyXG4gICAgICBjb25zdCBzYW5pdGl6ZWRTdHJpbmc6IHN0cmluZyA9IGA8aW1nIHNyYz1cImh0dHBzOi8veFwiIC8+YFxyXG5cclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczFcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IGF2bS5zaWduVHgodHh1MSlcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IGRpcnR5T2JqOiBvYmplY3QgPSB7XHJcbiAgICAgICAgLi4udHgxb2JqLFxyXG4gICAgICAgIGRpcnR5RG9tOiBkaXJ0eURvbVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHNhbml0aXplZE9iajogYW55ID0gdHgxLnNhbml0aXplT2JqZWN0KGRpcnR5T2JqKVxyXG4gICAgICBleHBlY3Qoc2FuaXRpemVkT2JqLmRpcnR5RG9tKS50b0JlKHNhbml0aXplZFN0cmluZylcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQmFzZVR4MlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRCYXNlVHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIG5ldyBCTihhbW50KS5zdWIobmV3IEJOKDEwMCkpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIilcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQmFzZVR4KFxyXG4gICAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLnN1YihuZXcgQk4oMTAwKSksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBhZGRyczMubWFwKChhKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIGFkZHJzMS5tYXAoKGEpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgYWRkcnMyLm1hcCgoYSk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG5cclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IG91dGllcyA9IHR4dTFcclxuICAgICAgICAuZ2V0VHJhbnNhY3Rpb24oKVxyXG4gICAgICAgIC5nZXRPdXRzKClcclxuICAgICAgICAuc29ydChUcmFuc2ZlcmFibGVPdXRwdXQuY29tcGFyYXRvcigpKSBhcyBUcmFuc2ZlcmFibGVPdXRwdXRbXVxyXG5cclxuICAgICAgZXhwZWN0KG91dGllcy5sZW5ndGgpLnRvQmUoMilcclxuICAgICAgY29uc3Qgb3V0YWRkcjAgPSBvdXRpZXNbMF1cclxuICAgICAgICAuZ2V0T3V0cHV0KClcclxuICAgICAgICAuZ2V0QWRkcmVzc2VzKClcclxuICAgICAgICAubWFwKChhKSA9PiBhdm0uYWRkcmVzc0Zyb21CdWZmZXIoYSkpXHJcbiAgICAgIGNvbnN0IG91dGFkZHIxID0gb3V0aWVzWzFdXHJcbiAgICAgICAgLmdldE91dHB1dCgpXHJcbiAgICAgICAgLmdldEFkZHJlc3NlcygpXHJcbiAgICAgICAgLm1hcCgoYSkgPT4gYXZtLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxyXG5cclxuICAgICAgY29uc3QgdGVzdGFkZHIyID0gSlNPTi5zdHJpbmdpZnkoYWRkcnMyLnNvcnQoKSlcclxuICAgICAgY29uc3QgdGVzdGFkZHIzID0gSlNPTi5zdHJpbmdpZnkoYWRkcnMzLnNvcnQoKSlcclxuXHJcbiAgICAgIGNvbnN0IHRlc3RvdXQwID0gSlNPTi5zdHJpbmdpZnkob3V0YWRkcjAuc29ydCgpKVxyXG4gICAgICBjb25zdCB0ZXN0b3V0MSA9IEpTT04uc3RyaW5naWZ5KG91dGFkZHIxLnNvcnQoKSlcclxuICAgICAgZXhwZWN0KFxyXG4gICAgICAgICh0ZXN0YWRkcjIgPT0gdGVzdG91dDAgJiYgdGVzdGFkZHIzID09IHRlc3RvdXQxKSB8fFxyXG4gICAgICAgICAgKHRlc3RhZGRyMyA9PSB0ZXN0b3V0MCAmJiB0ZXN0YWRkcjIgPT0gdGVzdG91dDEpXHJcbiAgICAgICkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJCYXNlVHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImlzc3VlVHggU2VyaWFsaXplZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczFcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0eCA9IGF2bS5zaWduVHgodHh1KVxyXG4gICAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxyXG4gICAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXHJcblxyXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGF2bS5pc3N1ZVR4KHR4LnRvU3RyaW5nKCkpXHJcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgIHR4SUQ6IHR4aWRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuICAgICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHR4aWQpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJpc3N1ZVR4IEJ1ZmZlclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEJhc2VUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoYXNzZXRJRCksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczFcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0eCA9IGF2bS5zaWduVHgodHh1KVxyXG5cclxuICAgICAgY29uc3QgdHhpZDogc3RyaW5nID1cclxuICAgICAgICBcImY5NjY3NTBmNDM4ODY3YzNjOTgyOGRkY2RiZTY2MGUyMWNjZGJiMzZhOTI3Njk1OGYwMTFiYTQ3MmY3NWQ0ZTdcIlxyXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGF2bS5pc3N1ZVR4KHR4LnRvQnVmZmVyKCkpXHJcbiAgICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgICByZXN1bHQ6IHtcclxuICAgICAgICAgIHR4SUQ6IHR4aWRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eGlkKVxyXG4gICAgfSlcclxuICAgIHRlc3QoXCJpc3N1ZVR4IENsYXNzIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkQmFzZVR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBuZXcgQk4oYW1udCksXHJcbiAgICAgICAgYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4ID0gYXZtLnNpZ25UeCh0eHUpXHJcblxyXG4gICAgICBjb25zdCB0eGlkOiBzdHJpbmcgPVxyXG4gICAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXHJcblxyXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGF2bS5pc3N1ZVR4KHR4KVxyXG4gICAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICB0eElEOiB0eGlkXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcbiAgICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh0eGlkKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiYnVpbGRDcmVhdGVBc3NldFR4IC0gRml4ZWQgQ2FwXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgYXZtLnNldENyZWF0aW9uVHhGZWUobmV3IEJOKGZlZSkpXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRDcmVhdGVBc3NldFR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIGluaXRpYWxTdGF0ZSxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHN5bWJvbCxcclxuICAgICAgICBkZW5vbWluYXRpb25cclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZENyZWF0ZUFzc2V0VHgoXHJcbiAgICAgICAgYXhpYS5nZXROZXR3b3JrSUQoKSxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGF2bS5nZXRCbG9ja2NoYWluSUQoKSksXHJcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgaW5pdGlhbFN0YXRlLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgc3ltYm9sLFxyXG4gICAgICAgIGRlbm9taW5hdGlvbixcclxuICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgQ0VOVElBWEMsXHJcbiAgICAgICAgYXNzZXRJRFxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkNyZWF0ZUFzc2V0VHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlQXNzZXRUeCAtIFZhcmlhYmxlIENhcFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGF2bS5zZXRDcmVhdGlvblR4RmVlKFxyXG4gICAgICAgIG5ldyBCTihEZWZhdWx0cy5uZXR3b3JrWzEyMzQ1XS5Db3JlW1wiY3JlYXRpb25UeEZlZVwiXSlcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBtaW50T3V0cHV0czogU0VDUE1pbnRPdXRwdXRbXSA9IFtzZWNwTWludE91dDEsIHNlY3BNaW50T3V0Ml1cclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZENyZWF0ZUFzc2V0VHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgaW5pdGlhbFN0YXRlLFxyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgc3ltYm9sLFxyXG4gICAgICAgIGRlbm9taW5hdGlvbixcclxuICAgICAgICBtaW50T3V0cHV0c1xyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlQXNzZXRUeChcclxuICAgICAgICBheGlhLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYXZtLmdldEJsb2NrY2hhaW5JRCgpKSxcclxuICAgICAgICBhZGRyczEubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhZGRyczIubWFwKChhKSA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBpbml0aWFsU3RhdGUsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBzeW1ib2wsXHJcbiAgICAgICAgZGVub21pbmF0aW9uLFxyXG4gICAgICAgIG1pbnRPdXRwdXRzLFxyXG4gICAgICAgIGF2bS5nZXRDcmVhdGlvblR4RmVlKCksXHJcbiAgICAgICAgYXNzZXRJRFxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZFNFQ1BNaW50VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBhdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXHJcbiAgICAgIGNvbnN0IG5ld01pbnRlcjogU0VDUE1pbnRPdXRwdXQgPSBuZXcgU0VDUE1pbnRPdXRwdXQoXHJcbiAgICAgICAgYWRkcnMzLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgYXZtLmJ1aWxkU0VDUE1pbnRUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgbmV3TWludGVyLFxyXG4gICAgICAgIHNlY3BNaW50WGZlck91dDEsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBzZWNwTWludFVUWE8uZ2V0VVRYT0lEKClcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZFNFQ1BNaW50VHgoXHJcbiAgICAgICAgYXhpYS5nZXROZXR3b3JrSUQoKSxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGF2bS5nZXRCbG9ja2NoYWluSUQoKSksXHJcbiAgICAgICAgbmV3TWludGVyLFxyXG4gICAgICAgIHNlY3BNaW50WGZlck91dDEsXHJcbiAgICAgICAgYWRkcnMxLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgc2VjcE1pbnRVVFhPLmdldFVUWE9JRCgpLFxyXG4gICAgICAgIE1JTExJQVhDLFxyXG4gICAgICAgIGFzc2V0SURcclxuICAgICAgKVxyXG5cclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFvYmopLnRvU3RyaWN0RXF1YWwodHgyb2JqKVxyXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXHJcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxyXG5cclxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4NHN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcclxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJTRUNQTWludFR4XCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZENyZWF0ZU5GVEFzc2V0VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBhdm0uc2V0Q3JlYXRpb25UeEZlZShcclxuICAgICAgICBuZXcgQk4oRGVmYXVsdHMubmV0d29ya1sxMjM0NV0uQ29yZVtcImNyZWF0aW9uVHhGZWVcIl0pXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgbWludGVyU2V0czogTWludGVyU2V0W10gPSBbbmV3IE1pbnRlclNldCgxLCBhZGRyczEpXVxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRDcmVhdGVORlRBc3NldFR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG1pbnRlclNldHMsXHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBzeW1ib2wsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpLFxyXG4gICAgICAgIGxvY2t0aW1lXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRDcmVhdGVORlRBc3NldFR4KFxyXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShhdm0uZ2V0QmxvY2tjaGFpbklEKCkpLFxyXG4gICAgICAgIGFkZHJzMS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBhZGRyczIubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgbWludGVyU2V0cyxcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIHN5bWJvbCxcclxuICAgICAgICBhdm0uZ2V0Q3JlYXRpb25UeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICBsb2NrdGltZVxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkNyZWF0ZU5GVEFzc2V0VHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlTkZUTWludFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgYXZtLnNldFR4RmVlKG5ldyBCTihmZWUpKVxyXG4gICAgICBjb25zdCBncm91cElEOiBudW1iZXIgPSAwXHJcbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICAgICAgY29uc3QgcGF5bG9hZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJBeGlhXCIpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKFxyXG4gICAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMjogQnVmZmVyW10gPSBhZGRyczIubWFwKFxyXG4gICAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMzogQnVmZmVyW10gPSBhZGRyczMubWFwKFxyXG4gICAgICAgIChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG91dHB1dE93bmVyczogT3V0cHV0T3duZXJzW10gPSBbXVxyXG4gICAgICBjb25zdCBvbzogT3V0cHV0T3duZXJzID0gbmV3IE91dHB1dE93bmVycyhhZGRyYnVmZjMsIGxvY2t0aW1lLCB0aHJlc2hvbGQpXHJcbiAgICAgIG91dHB1dE93bmVycy5wdXNoKClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRDcmVhdGVORlRNaW50VHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIG9vLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgbmZ0dXR4b2lkcyxcclxuICAgICAgICBncm91cElELFxyXG4gICAgICAgIHBheWxvYWQsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlTkZUTWludFR4KFxyXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShhdm0uZ2V0QmxvY2tjaGFpbklEKCkpLFxyXG4gICAgICAgIFtvb10sXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGFkZHJidWZmMixcclxuICAgICAgICBuZnR1dHhvaWRzLFxyXG4gICAgICAgIGdyb3VwSUQsXHJcbiAgICAgICAgcGF5bG9hZCxcclxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICBVbml4Tm93KClcclxuICAgICAgKVxyXG5cclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIG91dHB1dE93bmVycy5wdXNoKG9vKVxyXG4gICAgICBvdXRwdXRPd25lcnMucHVzaChuZXcgT3V0cHV0T3duZXJzKGFkZHJidWZmMywgbG9ja3RpbWUsIHRocmVzaG9sZCArIDEpKVxyXG5cclxuICAgICAgY29uc3QgdHh1MzogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZENyZWF0ZU5GVE1pbnRUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgb3V0cHV0T3duZXJzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgbmZ0dXR4b2lkcyxcclxuICAgICAgICBncm91cElELFxyXG4gICAgICAgIHBheWxvYWQsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHU0OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlTkZUTWludFR4KFxyXG4gICAgICAgIGF4aWEuZ2V0TmV0d29ya0lEKCksXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShhdm0uZ2V0QmxvY2tjaGFpbklEKCkpLFxyXG4gICAgICAgIG91dHB1dE93bmVycyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIG5mdHV0eG9pZHMsXHJcbiAgICAgICAgZ3JvdXBJRCxcclxuICAgICAgICBwYXlsb2FkLFxyXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTMudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHU0LnRvU3RyaW5nKCkpLnRvQmUodHh1My50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm9iajogb2JqZWN0ID0gdHgyLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDJzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MW9iaikudG9TdHJpY3RFcXVhbCh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFzdHIpLnRvU3RyaWN0RXF1YWwodHgyc3RyKVxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBjb25zdCB0eDRvYmo6IG9iamVjdCA9IHR4NC5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHg0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNvYmopLnRvU3RyaWN0RXF1YWwodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzc3RyKS50b1N0cmljdEVxdWFsKHR4NHN0cilcclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkNyZWF0ZU5GVE1pbnRUeFwiKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiYnVpbGRORlRUcmFuc2ZlclR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgYXZtLnNldFR4RmVlKG5ldyBCTihmZWUpKVxyXG4gICAgICBjb25zdCBwbG9hZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDEwMjQpXHJcbiAgICAgIHBsb2FkLndyaXRlKFxyXG4gICAgICAgIFwiQWxsIHlvdSBUcmVra2llcyBhbmQgVFYgYWRkaWN0cywgRG9uJ3QgbWVhbiB0byBkaXNzIGRvbid0IG1lYW4gdG8gYnJpbmcgc3RhdGljLlwiLFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgMTAyNCxcclxuICAgICAgICBcInV0ZjhcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhOiBzdHJpbmcpOiBCdWZmZXIgPT4gYXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYTogc3RyaW5nKTogQnVmZmVyID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRORlRUcmFuc2ZlclR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBuZnR1dHhvaWRzWzFdLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICBuZXcgQk4oMCksXHJcbiAgICAgICAgMVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkTkZUVHJhbnNmZXJUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIFtuZnR1dHhvaWRzWzFdXSxcclxuICAgICAgICBhdm0uZ2V0VHhGZWUoKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG5cclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFvYmopLnRvU3RyaWN0RXF1YWwodHgyb2JqKVxyXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXHJcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxyXG5cclxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4NHN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcclxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJORlRUcmFuc2ZlclR4XCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZEltcG9ydFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDApXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxyXG4gICAgICBhdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IGF2bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGZ1bmd1dHhvOiBVVFhPID0gc2V0LmdldFVUWE8oZnVuZ3V0eG9pZHNbMV0pXHJcbiAgICAgIGNvbnN0IGZ1bmd1dHhvc3RyOiBzdHJpbmcgPSBmdW5ndXR4by50b1N0cmluZygpXHJcblxyXG4gICAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8VW5zaWduZWRUeD4gPSBhdm0uYnVpbGRJbXBvcnRUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIFBsYXRmb3JtQ2hhaW5JRCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgdXR4b3M6IFtmdW5ndXR4b3N0cl1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRJbXBvcnRUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIFtmdW5ndXR4b10sXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxyXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxyXG4gICAgICAgIGF3YWl0IGF2bS5nZXRBWENBc3NldElEKCksXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgKVxyXG5cclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24oYXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBjb25zdCB0eDJvYmo6IG9iamVjdCA9IHR4Mi5zZXJpYWxpemUoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgyc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDJvYmopXHJcbiAgICAgIGV4cGVjdCh0eDFvYmopLnRvU3RyaWN0RXF1YWwodHgyb2JqKVxyXG4gICAgICBleHBlY3QodHgxc3RyKS50b1N0cmljdEVxdWFsKHR4MnN0cilcclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXHJcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxyXG5cclxuICAgICAgY29uc3QgdHg0b2JqOiBvYmplY3QgPSB0eDQuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4NHN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHg0b2JqKVxyXG4gICAgICBleHBlY3QodHgzb2JqKS50b1N0cmljdEVxdWFsKHR4NG9iailcclxuICAgICAgZXhwZWN0KHR4M3N0cikudG9TdHJpY3RFcXVhbCh0eDRzdHIpXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJJbXBvcnRUeFwiKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiYnVpbGRFeHBvcnRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGF2bS5zZXRUeEZlZShuZXcgQk4oZmVlKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYxOiBCdWZmZXJbXSA9IGFkZHJzMS5tYXAoXHJcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYyOiBCdWZmZXJbXSA9IGFkZHJzMi5tYXAoXHJcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzOiBCdWZmZXJbXSA9IGFkZHJzMy5tYXAoXHJcbiAgICAgICAgKGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBhdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IG5ldyBCTig5MClcclxuICAgICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBhdm0uYnVpbGRFeHBvcnRUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcclxuICAgICAgICBhZGRyYnVmZjMubWFwKChhOiBCdWZmZXIpOiBhbnkgPT5cclxuICAgICAgICAgIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKGEsIHR5cGUsIGF4aWEuZ2V0SFJQKCksIFwiQ29yZVwiKVxyXG4gICAgICAgICksXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcclxuICAgICAgICBVbml4Tm93KClcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxyXG4gICAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgYWRkcmJ1ZmYzLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBhZGRyYnVmZjIsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxyXG4gICAgICAgIGF2bS5nZXRUeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHh1MzogVW5zaWduZWRUeCA9IGF3YWl0IGF2bS5idWlsZEV4cG9ydFR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgUGxhdGZvcm1DaGFpbklELFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHU0OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkRXhwb3J0VHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBhZGRyYnVmZjMsXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGFkZHJidWZmMixcclxuICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgYXZtLmdldFR4RmVlKCksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGV4cGVjdCh0eHU0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1My50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTQudG9TdHJpbmcoKSkudG9CZSh0eHUzLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKGF2bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXHJcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXHJcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxyXG5cclxuICAgICAgY29uc3QgdHgyb2JqOiBvYmplY3QgPSB0eDIuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgyb2JqKVxyXG4gICAgICBleHBlY3QodHgxb2JqKS50b1N0cmljdEVxdWFsKHR4Mm9iailcclxuICAgICAgZXhwZWN0KHR4MXN0cikudG9TdHJpY3RFcXVhbCh0eDJzdHIpXHJcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG5cclxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihhdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxyXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxyXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcclxuXHJcbiAgICAgIGNvbnN0IHR4NG9iajogb2JqZWN0ID0gdHg0LnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDRzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4NG9iailcclxuICAgICAgZXhwZWN0KHR4M29iaikudG9TdHJpY3RFcXVhbCh0eDRvYmopXHJcbiAgICAgIGV4cGVjdCh0eDNzdHIpLnRvU3RyaWN0RXF1YWwodHg0c3RyKVxyXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiRXhwb3J0VHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkR2VuZXNpc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGdlbmVzaXNEYXRhOiBvYmplY3QgPSB7XHJcbiAgICAgICAgZ2VuZXNpc0RhdGE6IHtcclxuICAgICAgICAgIGFzc2V0QWxpYXMxOiB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiaHVtYW4gcmVhZGFibGUgbmFtZVwiLFxyXG4gICAgICAgICAgICBzeW1ib2w6IFwiQVZBTFwiLFxyXG4gICAgICAgICAgICBpbml0aWFsU3RhdGU6IHtcclxuICAgICAgICAgICAgICBmaXhlZENhcDogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBhbW91bnQ6IDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IFwiQVwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBhbW91bnQ6IDUwMDAsXHJcbiAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IFwiQlwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXNzZXRBbGlhc0NhbkJlQW55dGhpbmdVbmlxdWU6IHtcclxuICAgICAgICAgICAgbmFtZTogXCJodW1hbiByZWFkYWJsZSBuYW1lXCIsXHJcbiAgICAgICAgICAgIHN5bWJvbDogXCJBVkFMXCIsXHJcbiAgICAgICAgICAgIGluaXRpYWxTdGF0ZToge1xyXG4gICAgICAgICAgICAgIHZhcmlhYmxlQ2FwOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG1pbnRlcnM6IFtcIkFcIiwgXCJCXCJdLFxyXG4gICAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG1pbnRlcnM6IFtcIkFcIiwgXCJCXCIsIFwiQ1wiXSxcclxuICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiAyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGJ5dGVzOiBzdHJpbmcgPVxyXG4gICAgICAgIFwiMTExVE5XelV0SEtvU3Z4b2hqeWZFd0UyWDIyOFpER0JuZ1o0bWRNVVZNblZuanRuYXdXMWIxemJBaHp5QU0xdjZkN0VDTmo2RFhzVDdxRG1oU0VmM0RXZ1hSajdFQ3dCWDM2WlhGYzl0V1ZCMnFIVVJvVWZkRHZGc0JlU1JxYXRDbWo3NmVaUU1HWkRnQkZSTmlqUmhQTktVYXA3YkNlS3BIRHR1Q1pjNFlwUGtkNG1SODRkTEwyQUwxYjRLNDZlaXJXS01hRlZqQTVidFlTNERueVV4NWNMcEFxM2QzNWtFZE5kVTV6SDNyVFUxOFM0VHhZVjh2b01QY0xDVFozaDR6UnNNNWpXMWNVempXVnZLZzd1WVMyb1I5cVhSRmNneTFnd05URlpHc3R5U3V2U0Y3TVplWkY0elNkTmdDNHJiWTlIOTRSVmhxZThyVzdNWHFNU1pCNnZCVEIyQnBnRjZ0TkZlaG1ZeEVYd2phS1JyaW1YOTF1dHZaZTlZamdHYkRyOFhIc1hDblhYZzRaRENqYXBDeTRIbW1SVXRVb0FkdUdOQmRHVk1pd0U5V3ZWYnBNRkZjTmZnRFhHejlOaWF0Z1Nua3hRQUxUSHZHWFhtOGJuNENvTEZ6S25BdHEzS3dpV3FIbVYzR2pGWWVVbTNtOFplZTlWRGZaQXZEc2hhNTFhY3hmdG8xaHRzdHhZdTY2RFdwVDM2WVQxOFdTYnhpYlpjS1hhN2dacnJzQ3d5emlkOENDV3c3OURiYUxDVWlxOXU0N1Zxb2ZHMWtneHd1dXlIYjhOVm5UZ1JUa1FBU1NiajIzMmZ5RzdZZVg0bUF2Wlk3YTdLN3lmU3l6SmFYZFVkUjdhTGVDZExQNm1iRkRxVU1yTjZZRWtVMlg4ZDRDazNUXCJcclxuICAgICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuYnVpbGRHZW5lc2lzKGdlbmVzaXNEYXRhKVxyXG4gICAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICBieXRlczogYnl0ZXNcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IHtcclxuICAgICAgICBkYXRhOiBvYmplY3RcclxuICAgICAgfSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuICAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGJ5dGVzKVxyXG4gICAgfSlcclxuICB9KVxyXG59KVxyXG4iXX0=