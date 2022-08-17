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
const api_1 = require("../../../src/apis/platformvm/api");
const buffer_1 = require("buffer/");
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bech32 = __importStar(require("bech32"));
const constants_1 = require("../../../src/utils/constants");
const utxos_1 = require("../../../src/apis/platformvm/utxos");
const persistenceoptions_1 = require("../../../src/utils/persistenceoptions");
const keychain_1 = require("../../../src/apis/platformvm/keychain");
const outputs_1 = require("../../../src/apis/platformvm/outputs");
const inputs_1 = require("../../../src/apis/platformvm/inputs");
const utxos_2 = require("../../../src/apis/platformvm/utxos");
const create_hash_1 = __importDefault(require("create-hash"));
const tx_1 = require("../../../src/apis/platformvm/tx");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const payload_1 = require("../../../src/utils/payload");
const helperfunctions_2 = require("../../../src/utils/helperfunctions");
const constants_2 = require("../../../src/utils/constants");
const serialization_1 = require("../../../src/utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
const display = "display";
const dumpSerialization = false;
const serialzeit = (aThing, name) => {
    if (dumpSerialization) {
        console.log(JSON.stringify(serializer.serialize(aThing, "platformvm", "hex", name + " -- Hex Encoded")));
        console.log(JSON.stringify(serializer.serialize(aThing, "platformvm", "display", name + " -- Human-Readable")));
    }
};
describe("PlatformVMAPI", () => {
    const networkID = 1337;
    const blockchainID = constants_1.PlatformChainID;
    const ip = "127.0.0.1";
    const port = 80;
    const protocol = "https";
    const nodeID = "NodeID-B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW";
    const startTime = (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(60 * 5));
    const endTime = startTime.add(new bn_js_1.default(1209600));
    const username = "AxiaCoin";
    const password = "password";
    const axia = new src_1.Axia(ip, port, protocol, networkID, undefined, undefined, undefined, true);
    let api;
    let alias;
    const addrA = "Core-" +
        bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW")));
    const addrB = "Core-" +
        bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("P5wdRuZeaDt28eHMP5S3w9ZdoBfo7wuzF")));
    const addrC = "Core-" +
        bech32.bech32.encode(axia.getHRP(), bech32.bech32.toWords(bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")));
    beforeAll(() => {
        api = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
        alias = api.getBlockchainAlias();
    });
    afterEach(() => {
        jest_mock_axios_1.default.reset();
    });
    test("getCreateAllychainTxFee", () => __awaiter(void 0, void 0, void 0, function* () {
        let corechain = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
        const feeResponse = "1000000000";
        const fee = corechain.getCreateAllychainTxFee();
        expect(fee.toString()).toBe(feeResponse);
    }));
    test("getCreateChainTxFee", () => __awaiter(void 0, void 0, void 0, function* () {
        let corechain = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
        const feeResponse = "1000000000";
        const fee = corechain.getCreateChainTxFee();
        expect(fee.toString()).toBe(feeResponse);
    }));
    test("refreshBlockchainID", () => __awaiter(void 0, void 0, void 0, function* () {
        let n3bcID = constants_1.Defaults.network[3].Core["blockchainID"];
        let testAPI = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
        let bc1 = testAPI.getBlockchainID();
        expect(bc1).toBe(constants_1.PlatformChainID);
        testAPI.refreshBlockchainID();
        let bc2 = testAPI.getBlockchainID();
        expect(bc2).toBe(constants_1.PlatformChainID);
        testAPI.refreshBlockchainID(n3bcID);
        let bc3 = testAPI.getBlockchainID();
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
    test("import bad key", () => __awaiter(void 0, void 0, void 0, function* () {
        const address = addrC;
        const message = 'problem retrieving data: incorrect password for user "test"';
        const result = api.importKey(username, "badpassword", "key");
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
    test("getBalance", () => __awaiter(void 0, void 0, void 0, function* () {
        const balance = new bn_js_1.default("100", 10);
        const unlocked = new bn_js_1.default("100", 10);
        const lockedStakeable = new bn_js_1.default("100", 10);
        const lockedNotStakeable = new bn_js_1.default("100", 10);
        const respobj = {
            balance,
            unlocked,
            lockedStakeable,
            lockedNotStakeable,
            utxoIDs: [
                {
                    txID: "LUriB3W919F84LwPMMw4sm2fZ4Y76Wgb6msaauEY7i1tFNmtv",
                    outputIndex: 0
                }
            ]
        };
        const result = api.getBalance(addrA);
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
    test("getCurrentSupply", () => __awaiter(void 0, void 0, void 0, function* () {
        const supply = new bn_js_1.default("1000000000000", 10);
        const result = api.getCurrentSupply();
        const payload = {
            result: {
                supply
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.toString(10)).toBe(supply.toString(10));
    }));
    test("getValidatorsAt", () => __awaiter(void 0, void 0, void 0, function* () {
        const height = 0;
        const allychainID = "11111111111111111111111111111111LpoYY";
        const result = api.getValidatorsAt(height, allychainID);
        const payload = {
            result: {
                validators: {
                    "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg": 2000000000000000,
                    "NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu": 2000000000000000,
                    "NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ": 2000000000000000,
                    "NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN": 2000000000000000,
                    "NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5": 2000000000000000
                }
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
    }));
    test("getHeight", () => __awaiter(void 0, void 0, void 0, function* () {
        const height = new bn_js_1.default("100", 10);
        const result = api.getHeight();
        const payload = {
            result: {
                height
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response.toString(10)).toBe(height.toString(10));
    }));
    test("getMinStake", () => __awaiter(void 0, void 0, void 0, function* () {
        const minStake = new bn_js_1.default("2000000000000", 10);
        const minNominate = new bn_js_1.default("25000000000", 10);
        const result = api.getMinStake();
        const payload = {
            result: {
                minValidatorStake: "2000000000000",
                minNominatorStake: "25000000000"
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response["minValidatorStake"].toString(10)).toBe(minStake.toString(10));
        expect(response["minNominatorStake"].toString(10)).toBe(minNominate.toString(10));
    }));
    test("getStake", () => __awaiter(void 0, void 0, void 0, function* () {
        const staked = new bn_js_1.default("100", 10);
        const stakedOutputs = [
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000060bd6180000000070000000fb750430000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc316895eb3",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000060bd618000000007000000d18c2e280000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc3714de759",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000160000000061340880000000070000000fb750430000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc379b89461",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000016000000006134088000000007000000d18c2e280000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc3c7aa35d1",
            "0x000021e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff00000016000000006134088000000007000001d1a94a200000000000000000000000000100000001e70060b7051a4838ebe8e29bcbe1403db9b88cc38fd232d8"
        ];
        const objs = stakedOutputs.map((stakedOutput) => {
            const transferableOutput = new outputs_1.TransferableOutput();
            let buf = buffer_1.Buffer.from(stakedOutput.replace(/0x/g, ""), "hex");
            transferableOutput.fromBuffer(buf, 2);
            return transferableOutput;
        });
        const result = api.getStake([addrA], "hex");
        const payload = {
            result: {
                staked,
                stakedOutputs
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(response["staked"])).toBe(JSON.stringify(staked));
        expect(JSON.stringify(response["stakedOutputs"])).toBe(JSON.stringify(objs));
    }));
    test("addAllychainValidator 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const allychainID = "4R5p2RXDGLqaifZE4hHWH9owe34pfoBULn1DrQTWivjg8o4aH";
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const weight = 13;
        const utx = "valid";
        const result = api.addAllychainValidator(username, password, nodeID, allychainID, startTime, endTime, weight);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("addAllychainValidator", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const allychainID = buffer_1.Buffer.from("abcdef", "hex");
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const weight = 13;
        const utx = "valid";
        const result = api.addAllychainValidator(username, password, nodeID, allychainID, startTime, endTime, weight);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("addNominator 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const nodeID = "abcdef";
        const startTime = new Date(1985, 5, 9, 12, 59, 43, 9);
        const endTime = new Date(1982, 3, 1, 12, 58, 33, 7);
        const stakeAmount = new bn_js_1.default(13);
        const rewardAddress = "fedcba";
        const utx = "valid";
        const result = api.addNominator(username, password, nodeID, startTime, endTime, stakeAmount, rewardAddress);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("getBlockchains 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = [
            {
                id: "nodeID",
                allychainID: "allychainID",
                vmID: "vmID"
            }
        ];
        const result = api.getBlockchains();
        const payload = {
            result: {
                blockchains: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("getAllychains 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = [
            {
                id: "id",
                controlKeys: ["controlKeys"],
                threshold: "threshold"
            }
        ];
        const result = api.getAllychains();
        const payload = {
            result: {
                allychains: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toEqual(resp);
    }));
    test("getCurrentValidators 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators();
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
    }));
    test("getCurrentValidators 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = "abcdef";
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators(allychainID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
    }));
    test("getCurrentValidators 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = buffer_1.Buffer.from("abcdef", "hex");
        const validators = ["val1", "val2"];
        const result = api.getCurrentValidators(allychainID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual({ validators });
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
    test("exportAXC", () => __awaiter(void 0, void 0, void 0, function* () {
        const amount = new bn_js_1.default(100);
        const to = "abcdef";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.exportAXC(username, password, amount, to);
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
    test("importAXC", () => __awaiter(void 0, void 0, void 0, function* () {
        const to = "abcdef";
        const username = "Robert";
        const password = "Paulson";
        const txID = "valid";
        const result = api.importAXC(username, password, to, blockchainID);
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
    test("createBlockchain", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const vmID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const name = "Some Blockchain";
        const genesis = '{ruh:"roh"}';
        const allychainID = buffer_1.Buffer.from("abcdef", "hex");
        const result = api.createBlockchain(username, password, allychainID, vmID, [1, 2, 3], name, genesis);
        const payload = {
            result: {
                txID: blockchainID
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(blockchainID);
    }));
    test("getBlockchainStatus", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const result = api.getBlockchainStatus(blockchainID);
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
    test("createAllychain 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const controlKeys = ["abcdef"];
        const threshold = 13;
        const utx = "valid";
        const result = api.createAllychain(username, password, controlKeys, threshold);
        const payload = {
            result: {
                txID: utx
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(utx);
    }));
    test("sampleValidators 1", () => __awaiter(void 0, void 0, void 0, function* () {
        let allychainID;
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, allychainID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("sampleValidators 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = "abcdef";
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, allychainID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("sampleValidators 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = buffer_1.Buffer.from("abcdef", "hex");
        const validators = ["val1", "val2"];
        const result = api.sampleValidators(10, allychainID);
        const payload = {
            result: {
                validators
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(validators);
    }));
    test("validatedBy 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const blockchainID = "abcdef";
        const resp = "valid";
        const result = api.validatedBy(blockchainID);
        const payload = {
            result: {
                allychainID: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 1", () => __awaiter(void 0, void 0, void 0, function* () {
        let allychainID;
        const resp = ["valid"];
        const result = api.validates(allychainID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = "deadbeef";
        const resp = ["valid"];
        const result = api.validates(allychainID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
    }));
    test("validates 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const allychainID = buffer_1.Buffer.from("abcdef", "hex");
        const resp = ["valid"];
        const result = api.validates(allychainID);
        const payload = {
            result: {
                blockchainIDs: resp
            }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(resp);
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
            result: "accepted"
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe("accepted");
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
        let lset;
        let keymgr2;
        let keymgr3;
        let addrs1;
        let addrs2;
        let addrs3;
        let addressbuffs = [];
        let addresses = [];
        let utxos;
        let lutxos;
        let inputs;
        let outputs;
        const amnt = 10000;
        const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update("mary had a little lamb").digest());
        let secpbase1;
        let secpbase2;
        let secpbase3;
        let fungutxoids = [];
        let platformvm;
        const fee = 10;
        const name = "Mortycoin is the dumb as a sack of hammers.";
        const symbol = "morT";
        const denomination = 8;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            platformvm = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
            const result = platformvm.getAXCAssetID();
            const payload = {
                result: {
                    name,
                    symbol,
                    assetID: bintools.cb58Encode(assetID),
                    denomination: `${denomination}`
                }
            };
            const responseObj = {
                data: payload
            };
            jest_mock_axios_1.default.mockResponse(responseObj);
            yield result;
            set = new utxos_1.UTXOSet();
            lset = new utxos_1.UTXOSet();
            platformvm.newKeyChain();
            keymgr2 = new keychain_1.KeyChain(axia.getHRP(), alias);
            keymgr3 = new keychain_1.KeyChain(axia.getHRP(), alias);
            addrs1 = [];
            addrs2 = [];
            addrs3 = [];
            utxos = [];
            lutxos = [];
            inputs = [];
            outputs = [];
            fungutxoids = [];
            const pload = buffer_1.Buffer.alloc(1024);
            pload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
            for (let i = 0; i < 3; i++) {
                addrs1.push(platformvm.addressFromBuffer(platformvm.keyChain().makeKey().getAddress()));
                addrs2.push(platformvm.addressFromBuffer(keymgr2.makeKey().getAddress()));
                addrs3.push(platformvm.addressFromBuffer(keymgr3.makeKey().getAddress()));
            }
            const amount = constants_2.ONEAXC.mul(new bn_js_1.default(amnt));
            addressbuffs = platformvm.keyChain().getAddresses();
            addresses = addressbuffs.map((a) => platformvm.addressFromBuffer(a));
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
                const u = new utxos_2.UTXO();
                u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
                fungutxoids.push(u.getUTXOID());
                utxos.push(u);
                txid = u.getTxID();
                txidx = u.getOutputIdx();
                const asset = u.getAssetID();
                const input = new inputs_1.SECPTransferInput(amount);
                const xferinput = new inputs_1.TransferableInput(txid, txidx, asset, input);
                inputs.push(xferinput);
            }
            set.addArray(utxos);
            for (let i = 0; i < 4; i++) {
                let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                    .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                    .digest());
                let txidx = buffer_1.Buffer.alloc(4);
                txidx.writeUInt32BE(i, 0);
                const out = new outputs_1.SECPTransferOutput(constants_2.ONEAXC.mul(new bn_js_1.default(5)), addressbuffs, locktime, 1);
                const pout = new outputs_1.ParseableOutput(out);
                const lockout = new outputs_1.StakeableLockOut(constants_2.ONEAXC.mul(new bn_js_1.default(5)), addressbuffs, locktime, 1, locktime.add(new bn_js_1.default(86400)), pout);
                const xferout = new outputs_1.TransferableOutput(assetID, lockout);
                const u = new utxos_2.UTXO();
                u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
                lutxos.push(u);
            }
            lset.addArray(lutxos);
            lset.addArray(set.getAllUTXOs());
            secpbase1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(777), addrs3.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(888), addrs2.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
            secpbase3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(999), addrs2.map((a) => platformvm.parseAddress(a)), (0, helperfunctions_1.UnixNow)(), 1);
        }));
        test("signTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const assetID = yield platformvm.getAXCAssetID();
            const txu2 = set.buildBaseTx(networkID, bintools.cb58Decode(blockchainID), new bn_js_1.default(amnt), assetID, addrs3.map((a) => platformvm.parseAddress(a)), addrs1.map((a) => platformvm.parseAddress(a)), addrs1.map((a) => platformvm.parseAddress(a)), platformvm.getTxFee(), assetID, undefined, (0, helperfunctions_1.UnixNow)(), new bn_js_1.default(0), 1);
            txu2.sign(platformvm.keyChain());
        }));
        test("buildImportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            const locktime = new bn_js_1.default(0);
            const threshold = 1;
            platformvm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const fungutxo = set.getUTXO(fungutxoids[1]);
            const fungutxostr = fungutxo.toString();
            const result = platformvm.buildImportTx(set, addrs1, constants_1.PlatformChainID, addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
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
            const txu2 = set.buildImportTx(networkID, bintools.cb58Decode(blockchainID), addrbuff3, addrbuff1, addrbuff2, [fungutxo], bintools.cb58Decode(constants_1.PlatformChainID), platformvm.getTxFee(), yield platformvm.getAXCAssetID(), new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)(), locktime, threshold);
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ImportTx");
        }));
        test("buildExportTx", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setTxFee(new bn_js_1.default(fee));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = new bn_js_1.default(90);
            const type = "bech32";
            const txu1 = yield platformvm.buildExportTx(set, amount, bintools.cb58Decode(constants_1.Defaults.network[axia.getNetworkID()].Swap["blockchainID"]), addrbuff3.map((a) => serializer.bufferToType(a, type, axia.getHRP(), "Core")), addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, bintools.cb58Decode(constants_1.Defaults.network[axia.getNetworkID()].Swap["blockchainID"]), platformvm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const txu3 = yield platformvm.buildExportTx(set, amount, bintools.cb58Decode(constants_1.Defaults.network[axia.getNetworkID()].Swap["blockchainID"]), addrs3, addrs1, addrs2, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu4 = set.buildExportTx(networkID, bintools.cb58Decode(blockchainID), amount, assetID, addrbuff3, addrbuff1, addrbuff2, undefined, platformvm.getTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu4.toBuffer().toString("hex")).toBe(txu3.toBuffer().toString("hex"));
            expect(txu4.toString()).toBe(txu3.toString());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "ExportTx");
        }));
        /*
            test('buildAddAllychainValidatorTx', async (): Promise<void> => {
              platformvm.setFee(new BN(fee));
              const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
              const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
              const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
              const amount:BN = new BN(90);
    
              const txu1:UnsignedTx = await platformvm.buildAddAllychainValidatorTx(
                set,
                addrs1,
                addrs2,
                nodeID,
                startTime,
                endTime,
                PlatformVMConstants.MINSTAKE,
                new UTF8Payload("hello world"), UnixNow()
              );
    
              const txu2:UnsignedTx = set.buildAddAllychainValidatorTx(
                networkID, bintools.cb58Decode(blockchainID),
                addrbuff1,
                addrbuff2,
                NodeIDStringToBuffer(nodeID),
                startTime,
                endTime,
                PlatformVMConstants.MINSTAKE,
                platformvm.getFee(),
                assetID,
                new UTF8Payload("hello world").getPayload(), UnixNow()
              );
              expect(txu2.toBuffer().toString('hex')).toBe(txu1.toBuffer().toString('hex'));
              expect(txu2.toString()).toBe(txu1.toString());
    
            });
        */
        test("buildAddNominatorTx 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["Core"].minNominationStake;
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["Core"].minStake, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const txu1 = yield platformvm.buildAddNominatorTx(set, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildAddNominatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddNominatorTx");
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 1", () => __awaiter(void 0, void 0, void 0, function* () {
            // two UTXO. The 1st has a lesser stakeablelocktime and a greater amount of AXC. The 2nd has a greater stakeablelocktime and a lesser amount of AXC.
            // We expect this test to only consume the 2nd UTXO since it has the greater locktime.
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = constants_1.Defaults.network[networkID]["Core"].minStake;
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const nominationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getAXCAssetID();
            const assetID2 = yield platformvm.getAXCAssetID();
            const utxo1 = new utxos_2.UTXO(codecID, txid, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, nominationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(1);
            const input = ins[0];
            const ai = input.getInput();
            const ao = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm input amount matches the output w/ the greater staekablelock time but lesser amount
            expect(ai.getAmount().toString()).toEqual(ao.getAmount().toString());
            // confirm input amount doesn't match the output w/ the lesser staekablelock time but greater amount
            expect(ai.getAmount().toString()).not.toEqual(ao2.getAmount().toString());
            const sli = input.getInput();
            // confirm input stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(sli.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm input stakeablelock time doesn't match the output w/ the lesser stakeablelock time but greater amount
            expect(sli.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output w/ the greater stakeablelock time but lesser amount sans the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao.getAmount().sub(stakeAmount).toString());
            // confirm output amount doesn't match the output w/ the lesser stakeablelock time but greater amount
            expect(ao3.getAmount().toString()).not.toEqual(ao2.getAmount().toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(slo.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time but lesser amount
            expect(slo.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            const stakeOuts = tx.getStakeOuts();
            // confirm only 1 stakeOut
            expect(stakeOuts.length).toBe(1);
            const stakeOut = stakeOuts[0];
            const slo2 = stakeOut.getOutput();
            // confirm stakeOut stakeablelock time matches the output w/ the greater stakeablelock time but lesser amount
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // confirm stakeOut stakeablelock time doesn't match the output w/ the greater stakeablelock time but lesser amount
            expect(slo2.getStakeableLocktime().toString()).not.toEqual(stakeableLockOut1.getStakeableLocktime().toString());
            slo2.getAmount();
            // confirm stakeOut stake amount matches stakeAmount
            expect(slo2.getAmount().toString()).toEqual(stakeAmount.toString());
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 2", () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO - debug test
            // two UTXO. The 1st has a lesser stakeablelocktime and a greater amount of AXC. The 2nd has a greater stakeablelocktime and a lesser amount of AXC.
            // this time we're staking a greater amount than is available in the 2nd UTXO.
            // We expect this test to consume the full 2nd UTXO and a fraction of the 1st UTXO..
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = new bn_js_1.default("10000003000000000");
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const nominationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getAXCAssetID();
            const assetID2 = yield platformvm.getAXCAssetID();
            const utxo1 = new utxos_2.UTXO(codecID, txid, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, nominationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(2);
            const input1 = ins[0];
            const input2 = ins[1];
            const ai1 = input1.getInput();
            const ai2 = input2.getInput();
            const ao1 = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm each input amount matches the corresponding output
            expect(ai2.getAmount().toString()).toEqual(ao1.getAmount().toString());
            expect(ai1.getAmount().toString()).toEqual(ao2.getAmount().toString());
            const sli1 = input1.getInput();
            const sli2 = input2.getInput();
            // confirm input strakeablelock time matches the output w/ the greater staekablelock time but lesser amount
            // expect(sli1.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(sli2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output amount sans the 2nd utxo amount and the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao2.getAmount().sub(stakeAmount.sub(ao1.getAmount())).toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the lesser stakeablelock since the other was consumed
            // expect(slo.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time
            // expect(slo.getStakeableLocktime().toString()).not.toEqual(
            //   stakeableLockOut2.getStakeableLocktime().toString()
            // )
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            let stakeOuts = tx.getStakeOuts();
            // confirm 2 stakeOuts
            expect(stakeOuts.length).toBe(2);
            let stakeOut1 = stakeOuts[0];
            let stakeOut2 = stakeOuts[1];
            let slo2 = stakeOut1.getOutput();
            let slo3 = stakeOut2.getOutput();
            // confirm both stakeOut strakeablelock times matche the corresponding output
            // expect(slo3.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
        }));
        test("buildAddValidatorTx sort StakeableLockOuts 3", () => __awaiter(void 0, void 0, void 0, function* () {
            // TODO - debug test
            // three UTXO.
            // The 1st is a SecpTransferableOutput.
            // The 2nd has a lesser stakeablelocktime and a greater amount of AXC.
            // The 3rd has a greater stakeablelocktime and a lesser amount of AXC.
            //
            // this time we're staking a greater amount than is available in the 3rd UTXO.
            // We expect this test to consume the full 3rd UTXO and a fraction of the 2nd UTXO and not to consume the SecpTransferableOutput
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const amount1 = new bn_js_1.default("20000000000000000");
            const amount2 = new bn_js_1.default("10000000000000000");
            const locktime1 = new bn_js_1.default(0);
            const threshold = 1;
            const stakeableLockTime1 = new bn_js_1.default(1633824000);
            const secpTransferOutput0 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const secpTransferOutput1 = new outputs_1.SECPTransferOutput(amount1, addrbuff1, locktime1, threshold);
            const parseableOutput1 = new outputs_1.ParseableOutput(secpTransferOutput1);
            const stakeableLockOut1 = new outputs_1.StakeableLockOut(amount1, addrbuff1, locktime1, threshold, stakeableLockTime1, parseableOutput1);
            const stakeableLockTime2 = new bn_js_1.default(1733824000);
            const secpTransferOutput2 = new outputs_1.SECPTransferOutput(amount2, addrbuff1, locktime1, threshold);
            const parseableOutput2 = new outputs_1.ParseableOutput(secpTransferOutput2);
            const stakeableLockOut2 = new outputs_1.StakeableLockOut(amount2, addrbuff1, locktime1, threshold, stakeableLockTime2, parseableOutput2);
            const nodeID = "NodeID-36giFye5epwBTpGqPk7b4CCYe3hfyoFr1";
            const stakeAmount = new bn_js_1.default("10000003000000000");
            platformvm.setMinStake(stakeAmount, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const nominationFeeRate = new bn_js_1.default(2).toNumber();
            const codecID = 0;
            const txid0 = bintools.cb58Decode("auhMFs24ffc2BRWKw6i7Qngcs8jSQUS9Ei2XwJsUpEq4sTVib");
            const txid1 = bintools.cb58Decode("2jhyJit8kWA6SwkRwKxXepFnfhs971CEqaGkjJmiADM8H4g2LR");
            const txid2 = bintools.cb58Decode("2JwDfm3C7p88rJQ1Y1xWLkWNMA1nqPzqnaC2Hi4PDNKiPnXgGv");
            const outputidx0 = 0;
            const outputidx1 = 0;
            const assetID = yield platformvm.getAXCAssetID();
            const assetID2 = yield platformvm.getAXCAssetID();
            const utxo0 = new utxos_2.UTXO(codecID, txid0, outputidx0, assetID, secpTransferOutput0);
            const utxo1 = new utxos_2.UTXO(codecID, txid1, outputidx0, assetID, stakeableLockOut1);
            const utxo2 = new utxos_2.UTXO(codecID, txid2, outputidx1, assetID2, stakeableLockOut2);
            const utxoSet = new utxos_1.UTXOSet();
            utxoSet.add(utxo0);
            utxoSet.add(utxo1);
            utxoSet.add(utxo2);
            const txu1 = yield platformvm.buildAddValidatorTx(utxoSet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, stakeAmount, addrs3, nominationFeeRate);
            const tx = txu1.getTransaction();
            const ins = tx.getIns();
            // start test inputs
            // confirm only 1 input
            expect(ins.length).toBe(2);
            const input1 = ins[0];
            const input2 = ins[1];
            const ai1 = input1.getInput();
            const ai2 = input2.getInput();
            const ao1 = stakeableLockOut2
                .getTransferableOutput()
                .getOutput();
            const ao2 = stakeableLockOut1
                .getTransferableOutput()
                .getOutput();
            // confirm each input amount matches the corresponding output
            expect(ai2.getAmount().toString()).toEqual(ao2.getAmount().toString());
            expect(ai1.getAmount().toString()).toEqual(ao1.getAmount().toString());
            const sli1 = input1.getInput();
            const sli2 = input2.getInput();
            // confirm input strakeablelock time matches the output w/ the greater staekablelock time but lesser amount
            expect(sli1.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
            // expect(sli2.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // stop test inputs
            // start test outputs
            const outs = tx.getOuts();
            // confirm only 1 output
            expect(outs.length).toBe(1);
            const output = outs[0];
            const ao3 = output.getOutput();
            // confirm output amount matches the output amount sans the 2nd utxo amount and the stake amount
            expect(ao3.getAmount().toString()).toEqual(ao2.getAmount().sub(stakeAmount.sub(ao1.getAmount())).toString());
            const slo = output.getOutput();
            // confirm output stakeablelock time matches the output w/ the lesser stakeablelock since the other was consumed
            // expect(slo.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            // confirm output stakeablelock time doesn't match the output w/ the greater stakeablelock time
            // expect(slo.getStakeableLocktime().toString()).not.toEqual(
            //   stakeableLockOut2.getStakeableLocktime().toString()
            // )
            // confirm tx nodeID matches nodeID
            expect(tx.getNodeIDString()).toEqual(nodeID);
            // confirm tx starttime matches starttime
            expect(tx.getStartTime().toString()).toEqual(startTime.toString());
            // confirm tx endtime matches endtime
            expect(tx.getEndTime().toString()).toEqual(endTime.toString());
            // confirm tx stake amount matches stakeAmount
            expect(tx.getStakeAmount().toString()).toEqual(stakeAmount.toString());
            const stakeOuts = tx.getStakeOuts();
            // confirm 2 stakeOuts
            expect(stakeOuts.length).toBe(2);
            const stakeOut1 = stakeOuts[0];
            const stakeOut2 = stakeOuts[1];
            const slo2 = stakeOut1.getOutput();
            const slo3 = stakeOut2.getOutput();
            // confirm both stakeOut strakeablelock times matche the corresponding output
            // expect(slo3.getStakeableLocktime().toString()).toEqual(
            //   stakeableLockOut1.getStakeableLocktime().toString()
            // )
            expect(slo2.getStakeableLocktime().toString()).toEqual(stakeableLockOut2.getStakeableLocktime().toString());
        }));
        test("buildAddValidatorTx 1", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["Core"].minStake.add(new bn_js_1.default(fee));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["Core"].minStake, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const txu1 = yield platformvm.buildAddValidatorTx(set, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildAddValidatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, 0.1335, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddValidatorTx");
        }));
        test("buildAddNominatorTx 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_1.Defaults.network[networkID]["Core"].minNominationStake;
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_1.Defaults.network[networkID]["Core"].minStake, constants_1.Defaults.network[networkID]["Core"].minNominationStake);
            const txu1 = yield platformvm.buildAddNominatorTx(lset, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildAddNominatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddNominatorTx");
        }));
        test("buildAddValidatorTx 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_2.ONEAXC.mul(new bn_js_1.default(25));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_2.ONEAXC.mul(new bn_js_1.default(25)), constants_2.ONEAXC.mul(new bn_js_1.default(25)));
            const txu1 = yield platformvm.buildAddValidatorTx(lset, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildAddValidatorTx(networkID, bintools.cb58Decode(blockchainID), assetID, addrbuff3, addrbuff1, addrbuff2, (0, helperfunctions_2.NodeIDStringToBuffer)(nodeID), startTime, endTime, amount, locktime, threshold, addrbuff3, 0.1335, new bn_js_1.default(0), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "AddValidatorTx");
        }));
        test("buildAddValidatorTx 3", () => __awaiter(void 0, void 0, void 0, function* () {
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const amount = constants_2.ONEAXC.mul(new bn_js_1.default(3));
            const locktime = new bn_js_1.default(54321);
            const threshold = 2;
            platformvm.setMinStake(constants_2.ONEAXC.mul(new bn_js_1.default(3)), constants_2.ONEAXC.mul(new bn_js_1.default(3)));
            //2 utxos; one lockedstakeable; other unlocked; both utxos have 2 axc; stake 3 AXC
            const dummySet = new utxos_1.UTXOSet();
            const lockedBaseOut = new outputs_1.SECPTransferOutput(constants_2.ONEAXC.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1);
            const lockedBaseXOut = new outputs_1.ParseableOutput(lockedBaseOut);
            const lockedOut = new outputs_1.StakeableLockOut(constants_2.ONEAXC.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1, locktime, lockedBaseXOut);
            const txidLocked = buffer_1.Buffer.alloc(32);
            txidLocked.fill(1);
            const txidxLocked = buffer_1.Buffer.alloc(4);
            txidxLocked.writeUInt32BE(1, 0);
            const lu = new utxos_2.UTXO(0, txidLocked, txidxLocked, assetID, lockedOut);
            const txidUnlocked = buffer_1.Buffer.alloc(32);
            txidUnlocked.fill(2);
            const txidxUnlocked = buffer_1.Buffer.alloc(4);
            txidxUnlocked.writeUInt32BE(2, 0);
            const unlockedOut = new outputs_1.SECPTransferOutput(constants_2.ONEAXC.mul(new bn_js_1.default(2)), addrbuff1, locktime, 1);
            const ulu = new utxos_2.UTXO(0, txidUnlocked, txidxUnlocked, assetID, unlockedOut);
            dummySet.add(ulu);
            dummySet.add(lu);
            const txu1 = yield platformvm.buildAddValidatorTx(dummySet, addrs3, addrs1, addrs2, nodeID, startTime, endTime, amount, addrs3, 0.1334556, locktime, threshold, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu1Ins = txu1.getTransaction().getIns();
            const txu1Outs = txu1.getTransaction().getOuts();
            const txu1Stake = txu1.getTransaction().getStakeOuts();
            const txu1Total = txu1.getTransaction().getTotalOuts();
            let intotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Ins.length; i++) {
                intotal = intotal.add(txu1Ins[i].getInput().getAmount());
            }
            let outtotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Outs.length; i++) {
                outtotal = outtotal.add(txu1Outs[i].getOutput().getAmount());
            }
            let staketotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Stake.length; i++) {
                staketotal = staketotal.add(txu1Stake[i].getOutput().getAmount());
            }
            let totaltotal = new bn_js_1.default(0);
            for (let i = 0; i < txu1Total.length; i++) {
                totaltotal = totaltotal.add(txu1Total[i].getOutput().getAmount());
            }
            expect(intotal.toString(10)).toBe("4000000000");
            expect(outtotal.toString(10)).toBe("1000000000");
            expect(staketotal.toString(10)).toBe("3000000000");
            expect(totaltotal.toString(10)).toBe("4000000000");
        }));
        test("buildCreateAllychainTx1", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setCreationTxFee(new bn_js_1.default(10));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const txu1 = yield platformvm.buildCreateAllychainTx(set, addrs1, addrs2, [addrs1[0]], 1, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = set.buildCreateAllychainTx(networkID, bintools.cb58Decode(blockchainID), addrbuff1, addrbuff2, [addrbuff1[0]], 1, platformvm.getCreateAllychainTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
            const tx1 = txu1.sign(platformvm.keyChain());
            const checkTx = tx1.toBuffer().toString("hex");
            const tx1obj = tx1.serialize("hex");
            const tx1str = JSON.stringify(tx1obj);
            const tx2newobj = JSON.parse(tx1str);
            const tx2 = new tx_1.Tx();
            tx2.deserialize(tx2newobj, "hex");
            expect(tx2.toBuffer().toString("hex")).toBe(checkTx);
            const tx3 = txu1.sign(platformvm.keyChain());
            const tx3obj = tx3.serialize(display);
            const tx3str = JSON.stringify(tx3obj);
            const tx4newobj = JSON.parse(tx3str);
            const tx4 = new tx_1.Tx();
            tx4.deserialize(tx4newobj, display);
            expect(tx4.toBuffer().toString("hex")).toBe(checkTx);
            serialzeit(tx1, "CreateAllychainTx");
        }));
        test("buildCreateAllychainTx2", () => __awaiter(void 0, void 0, void 0, function* () {
            platformvm.setCreationTxFee(new bn_js_1.default(10));
            const addrbuff1 = addrs1.map((a) => platformvm.parseAddress(a));
            const addrbuff2 = addrs2.map((a) => platformvm.parseAddress(a));
            const addrbuff3 = addrs3.map((a) => platformvm.parseAddress(a));
            const txu1 = yield platformvm.buildCreateAllychainTx(lset, addrs1, addrs2, [addrs1[0]], 1, new payload_1.UTF8Payload("hello world"), (0, helperfunctions_1.UnixNow)());
            const txu2 = lset.buildCreateAllychainTx(networkID, bintools.cb58Decode(blockchainID), addrbuff1, addrbuff2, [addrbuff1[0]], 1, platformvm.getCreateAllychainTxFee(), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
            expect(txu2.toBuffer().toString("hex")).toBe(txu1.toBuffer().toString("hex"));
            expect(txu2.toString()).toBe(txu1.toString());
        }));
    });
    test("getRewardUTXOs", () => __awaiter(void 0, void 0, void 0, function* () {
        const txID = "7sik3Pr6r1FeLrvK1oWwECBS8iJ5VPuSh";
        const result = api.getRewardUTXOs(txID);
        const payload = {
            result: { numFetched: "0", utxos: [], encoding: "cb58" }
        };
        const responseObj = {
            data: payload
        };
        jest_mock_axios_1.default.mockResponse(responseObj);
        const response = yield result;
        expect(jest_mock_axios_1.default.request).toHaveBeenCalledTimes(1);
        expect(response).toBe(payload["result"]);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL3BsYXRmb3Jtdm0vYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUF1QztBQUN2Qyw2QkFBMEI7QUFDMUIsMERBQWdFO0FBQ2hFLG9DQUFnQztBQUNoQyxrREFBc0I7QUFDdEIsMkVBQWtEO0FBQ2xELCtDQUFnQztBQUNoQyw0REFBd0U7QUFDeEUsOERBQTREO0FBQzVELDhFQUEwRTtBQUMxRSxvRUFBZ0U7QUFDaEUsa0VBTTZDO0FBQzdDLGdFQUs0QztBQUM1Qyw4REFBeUQ7QUFDekQsOERBQW9DO0FBQ3BDLHdEQUFnRTtBQUNoRSx3RUFBNEQ7QUFDNUQsd0RBQXdEO0FBQ3hELHdFQUF5RTtBQUN6RSw0REFBcUQ7QUFDckQsb0VBS3lDO0FBaUJ6Qzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxVQUFVLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDN0QsTUFBTSxPQUFPLEdBQXVCLFNBQVMsQ0FBQTtBQUM3QyxNQUFNLGlCQUFpQixHQUFZLEtBQUssQ0FBQTtBQUV4QyxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQW9CLEVBQUUsSUFBWSxFQUFRLEVBQUU7SUFDOUQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUNULElBQUksQ0FBQyxTQUFTLENBQ1osVUFBVSxDQUFDLFNBQVMsQ0FDbEIsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsSUFBSSxHQUFHLGlCQUFpQixDQUN6QixDQUNGLENBQ0YsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FDWixVQUFVLENBQUMsU0FBUyxDQUNsQixNQUFNLEVBQ04s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QUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2NrQXhpb3MgZnJvbSBcImplc3QtbW9jay1heGlvc1wiXG5pbXBvcnQgeyBBeGlhIH0gZnJvbSBcInNyY1wiXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vYXBpXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0ICogYXMgYmVjaDMyIGZyb20gXCJiZWNoMzJcIlxuaW1wb3J0IHsgRGVmYXVsdHMsIFBsYXRmb3JtQ2hhaW5JRCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7IFVUWE9TZXQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS91dHhvc1wiXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BlcnNpc3RlbmNlb3B0aW9uc1wiXG5pbXBvcnQgeyBLZXlDaGFpbiB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2tleWNoYWluXCJcbmltcG9ydCB7XG4gIFNFQ1BUcmFuc2Zlck91dHB1dCxcbiAgVHJhbnNmZXJhYmxlT3V0cHV0LFxuICBBbW91bnRPdXRwdXQsXG4gIFBhcnNlYWJsZU91dHB1dCxcbiAgU3Rha2VhYmxlTG9ja091dFxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9vdXRwdXRzXCJcbmltcG9ydCB7XG4gIFRyYW5zZmVyYWJsZUlucHV0LFxuICBTRUNQVHJhbnNmZXJJbnB1dCxcbiAgQW1vdW50SW5wdXQsXG4gIFN0YWtlYWJsZUxvY2tJblxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9pbnB1dHNcIlxuaW1wb3J0IHsgVVRYTyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3V0eG9zXCJcbmltcG9ydCBjcmVhdGVIYXNoIGZyb20gXCJjcmVhdGUtaGFzaFwiXG5pbXBvcnQgeyBVbnNpZ25lZFR4LCBUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3R4XCJcbmltcG9ydCB7IFVuaXhOb3cgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXG5pbXBvcnQgeyBVVEY4UGF5bG9hZCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvcGF5bG9hZFwiXG5pbXBvcnQgeyBOb2RlSURTdHJpbmdUb0J1ZmZlciB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcbmltcG9ydCB7IE9ORUFYQyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7XG4gIFNlcmlhbGl6YWJsZSxcbiAgU2VyaWFsaXphdGlvbixcbiAgU2VyaWFsaXplZEVuY29kaW5nLFxuICBTZXJpYWxpemVkVHlwZVxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxuaW1wb3J0IHsgQWRkVmFsaWRhdG9yVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS92YWxpZGF0aW9udHhcIlxuaW1wb3J0IHtcbiAgQmxvY2tjaGFpbixcbiAgR2V0TWluU3Rha2VSZXNwb25zZSxcbiAgR2V0UmV3YXJkVVRYT3NSZXNwb25zZSxcbiAgQWxseWNoYWluLFxuICBHZXRUeFN0YXR1c1Jlc3BvbnNlLFxuICBHZXRWYWxpZGF0b3JzQXRSZXNwb25zZVxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9pbnRlcmZhY2VzXCJcbmltcG9ydCB7IEVycm9yUmVzcG9uc2VPYmplY3QgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2Vycm9yc1wiXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxuaW1wb3J0IHtcbiAgR2V0QmFsYW5jZVJlc3BvbnNlLFxuICBHZXRVVFhPc1Jlc3BvbnNlXG59IGZyb20gXCJzcmMvYXBpcy9wbGF0Zm9ybXZtL2ludGVyZmFjZXNcIlxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxuY29uc3Qgc2VyaWFsaXplcjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxuY29uc3QgZGlzcGxheTogU2VyaWFsaXplZEVuY29kaW5nID0gXCJkaXNwbGF5XCJcbmNvbnN0IGR1bXBTZXJpYWxpemF0aW9uOiBib29sZWFuID0gZmFsc2VcblxuY29uc3Qgc2VyaWFsemVpdCA9IChhVGhpbmc6IFNlcmlhbGl6YWJsZSwgbmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIGlmIChkdW1wU2VyaWFsaXphdGlvbikge1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIHNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgIGFUaGluZyxcbiAgICAgICAgICBcInBsYXRmb3Jtdm1cIixcbiAgICAgICAgICBcImhleFwiLFxuICAgICAgICAgIG5hbWUgKyBcIiAtLSBIZXggRW5jb2RlZFwiXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG4gICAgY29uc29sZS5sb2coXG4gICAgICBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgYVRoaW5nLFxuICAgICAgICAgIFwicGxhdGZvcm12bVwiLFxuICAgICAgICAgIFwiZGlzcGxheVwiLFxuICAgICAgICAgIG5hbWUgKyBcIiAtLSBIdW1hbi1SZWFkYWJsZVwiXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG4gIH1cbn1cblxuZGVzY3JpYmUoXCJQbGF0Zm9ybVZNQVBJXCIsICgpOiB2b2lkID0+IHtcbiAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSAxMzM3XG4gIGNvbnN0IGJsb2NrY2hhaW5JRDogc3RyaW5nID0gUGxhdGZvcm1DaGFpbklEXG4gIGNvbnN0IGlwOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBzXCJcblxuICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiTm9kZUlELUI2RDR2MVZ0UFlMYmlVdllYdFc0UHg4b0U5aW1DMnZHV1wiXG4gIGNvbnN0IHN0YXJ0VGltZTogQk4gPSBVbml4Tm93KCkuYWRkKG5ldyBCTig2MCAqIDUpKVxuICBjb25zdCBlbmRUaW1lOiBCTiA9IHN0YXJ0VGltZS5hZGQobmV3IEJOKDEyMDk2MDApKVxuXG4gIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIkF4aWFDb2luXCJcbiAgY29uc3QgcGFzc3dvcmQ6IHN0cmluZyA9IFwicGFzc3dvcmRcIlxuXG4gIGNvbnN0IGF4aWE6IEF4aWEgPSBuZXcgQXhpYShcbiAgICBpcCxcbiAgICBwb3J0LFxuICAgIHByb3RvY29sLFxuICAgIG5ldHdvcmtJRCxcbiAgICB1bmRlZmluZWQsXG4gICAgdW5kZWZpbmVkLFxuICAgIHVuZGVmaW5lZCxcbiAgICB0cnVlXG4gIClcbiAgbGV0IGFwaTogUGxhdGZvcm1WTUFQSVxuICBsZXQgYWxpYXM6IHN0cmluZ1xuXG4gIGNvbnN0IGFkZHJBOiBzdHJpbmcgPVxuICAgIFwiQ29yZS1cIiArXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXG4gICAgICBheGlhLmdldEhSUCgpLFxuICAgICAgYmVjaDMyLmJlY2gzMi50b1dvcmRzKFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiQjZENHYxVnRQWUxiaVV2WVh0VzRQeDhvRTlpbUMydkdXXCIpXG4gICAgICApXG4gICAgKVxuICBjb25zdCBhZGRyQjogc3RyaW5nID1cbiAgICBcIkNvcmUtXCIgK1xuICAgIGJlY2gzMi5iZWNoMzIuZW5jb2RlKFxuICAgICAgYXhpYS5nZXRIUlAoKSxcbiAgICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIlA1d2RSdVplYUR0MjhlSE1QNVMzdzlaZG9CZm83d3V6RlwiKVxuICAgICAgKVxuICAgIClcbiAgY29uc3QgYWRkckM6IHN0cmluZyA9XG4gICAgXCJDb3JlLVwiICtcbiAgICBiZWNoMzIuYmVjaDMyLmVuY29kZShcbiAgICAgIGF4aWEuZ2V0SFJQKCksXG4gICAgICBiZWNoMzIuYmVjaDMyLnRvV29yZHMoXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCI2WTNreXNqRjlqbkhuWWtkUzl5R0F1b0h5YWUyZU5tZVZcIilcbiAgICAgIClcbiAgICApXG5cbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcbiAgICBhcGkgPSBuZXcgUGxhdGZvcm1WTUFQSShheGlhLCBcIi9leHQvYmMvQ29yZVwiKVxuICAgIGFsaWFzID0gYXBpLmdldEJsb2NrY2hhaW5BbGlhcygpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpOiB2b2lkID0+IHtcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IGNvcmVjaGFpbjogUGxhdGZvcm1WTUFQSSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Db3JlXCIpXG4gICAgY29uc3QgZmVlUmVzcG9uc2U6IHN0cmluZyA9IFwiMTAwMDAwMDAwMFwiXG4gICAgY29uc3QgZmVlOiBCTiA9IGNvcmVjaGFpbi5nZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZSgpXG4gICAgZXhwZWN0KGZlZS50b1N0cmluZygpKS50b0JlKGZlZVJlc3BvbnNlKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRDcmVhdGVDaGFpblR4RmVlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgY29yZWNoYWluOiBQbGF0Zm9ybVZNQVBJID0gbmV3IFBsYXRmb3JtVk1BUEkoYXhpYSwgXCIvZXh0L2JjL0NvcmVcIilcbiAgICBjb25zdCBmZWVSZXNwb25zZTogc3RyaW5nID0gXCIxMDAwMDAwMDAwXCJcbiAgICBjb25zdCBmZWU6IEJOID0gY29yZWNoYWluLmdldENyZWF0ZUNoYWluVHhGZWUoKVxuICAgIGV4cGVjdChmZWUudG9TdHJpbmcoKSkudG9CZShmZWVSZXNwb25zZSlcbiAgfSlcblxuICB0ZXN0KFwicmVmcmVzaEJsb2NrY2hhaW5JRFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IG4zYmNJRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1szXS5Db3JlW1wiYmxvY2tjaGFpbklEXCJdXG4gICAgbGV0IHRlc3RBUEk6IFBsYXRmb3JtVk1BUEkgPSBuZXcgUGxhdGZvcm1WTUFQSShheGlhLCBcIi9leHQvYmMvQ29yZVwiKVxuICAgIGxldCBiYzE6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcbiAgICBleHBlY3QoYmMxKS50b0JlKFBsYXRmb3JtQ2hhaW5JRClcblxuICAgIHRlc3RBUEkucmVmcmVzaEJsb2NrY2hhaW5JRCgpXG4gICAgbGV0IGJjMjogc3RyaW5nID0gdGVzdEFQSS5nZXRCbG9ja2NoYWluSUQoKVxuICAgIGV4cGVjdChiYzIpLnRvQmUoUGxhdGZvcm1DaGFpbklEKVxuXG4gICAgdGVzdEFQSS5yZWZyZXNoQmxvY2tjaGFpbklEKG4zYmNJRClcbiAgICBsZXQgYmMzOiBzdHJpbmcgPSB0ZXN0QVBJLmdldEJsb2NrY2hhaW5JRCgpXG4gICAgZXhwZWN0KGJjMykudG9CZShuM2JjSUQpXG4gIH0pXG5cbiAgdGVzdChcImxpc3RBZGRyZXNzZXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbYWRkckEsIGFkZHJCXVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5saXN0QWRkcmVzc2VzKHVzZXJuYW1lLCBwYXNzd29yZClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWRkcmVzc2VzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFkZHJlc3NlcylcbiAgfSlcblxuICB0ZXN0KFwiaW1wb3J0S2V5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBhZGRyQ1xuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmltcG9ydEtleShcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBcImtleVwiXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBhZGRyZXNzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYWRkcmVzcylcbiAgfSlcblxuICB0ZXN0KFwiaW1wb3J0IGJhZCBrZXlcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFkZHJlc3M6IHN0cmluZyA9IGFkZHJDXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID1cbiAgICAgICdwcm9ibGVtIHJldHJpZXZpbmcgZGF0YTogaW5jb3JyZWN0IHBhc3N3b3JkIGZvciB1c2VyIFwidGVzdFwiJ1xuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5pbXBvcnRLZXkoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIFwiYmFkcGFzc3dvcmRcIixcbiAgICAgIFwia2V5XCJcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGNvZGU6IC0zMjAwMCxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZGF0YTogbnVsbFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICBleHBlY3QocmVzcG9uc2VbXCJjb2RlXCJdKS50b0JlKC0zMjAwMClcbiAgICBleHBlY3QocmVzcG9uc2VbXCJtZXNzYWdlXCJdKS50b0JlKG1lc3NhZ2UpXG4gIH0pXG5cbiAgdGVzdChcImdldEJhbGFuY2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGJhbGFuY2U6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxuICAgIGNvbnN0IHVubG9ja2VkOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcbiAgICBjb25zdCBsb2NrZWRTdGFrZWFibGU6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxuICAgIGNvbnN0IGxvY2tlZE5vdFN0YWtlYWJsZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXG4gICAgY29uc3QgcmVzcG9iajogR2V0QmFsYW5jZVJlc3BvbnNlID0ge1xuICAgICAgYmFsYW5jZSxcbiAgICAgIHVubG9ja2VkLFxuICAgICAgbG9ja2VkU3Rha2VhYmxlLFxuICAgICAgbG9ja2VkTm90U3Rha2VhYmxlLFxuICAgICAgdXR4b0lEczogW1xuICAgICAgICB7XG4gICAgICAgICAgdHhJRDogXCJMVXJpQjNXOTE5Rjg0THdQTU13NHNtMmZaNFk3NldnYjZtc2FhdUVZN2kxdEZObXR2XCIsXG4gICAgICAgICAgb3V0cHV0SW5kZXg6IDBcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8R2V0QmFsYW5jZVJlc3BvbnNlPiA9IGFwaS5nZXRCYWxhbmNlKGFkZHJBKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDogcmVzcG9ialxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UpKS50b0JlKEpTT04uc3RyaW5naWZ5KHJlc3BvYmopKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRDdXJyZW50U3VwcGx5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzdXBwbHk6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMFwiLCAxMClcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8Qk4+ID0gYXBpLmdldEN1cnJlbnRTdXBwbHkoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBzdXBwbHlcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBCTiA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UudG9TdHJpbmcoMTApKS50b0JlKHN1cHBseS50b1N0cmluZygxMCkpXG4gIH0pXG5cbiAgdGVzdChcImdldFZhbGlkYXRvcnNBdFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgaGVpZ2h0OiBudW1iZXIgPSAwXG4gICAgY29uc3QgYWxseWNoYWluSUQ6IHN0cmluZyA9IFwiMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTFMcG9ZWVwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldFZhbGlkYXRvcnNBdFJlc3BvbnNlPiA9IGFwaS5nZXRWYWxpZGF0b3JzQXQoXG4gICAgICBoZWlnaHQsXG4gICAgICBhbGx5Y2hhaW5JRFxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yczoge1xuICAgICAgICAgIFwiTm9kZUlELTdYaHcybUR4dURTNDRqNDJUQ0I2VTU1Nzllc2JTdDNMZ1wiOiAyMDAwMDAwMDAwMDAwMDAwLFxuICAgICAgICAgIFwiTm9kZUlELUdXUGNiRkpaRmZacmVFVFNvV2pQaW1yODQ2bVhFS0N0dVwiOiAyMDAwMDAwMDAwMDAwMDAwLFxuICAgICAgICAgIFwiTm9kZUlELU1GclpGVkNYUHY1aUNuNk05SzZYZHV4R1RZcDg5MXhYWlwiOiAyMDAwMDAwMDAwMDAwMDAwLFxuICAgICAgICAgIFwiTm9kZUlELU5GQmJiSjRxQ21OYUN6ZVc3c3hFcmh2V3F2RVFNblljTlwiOiAyMDAwMDAwMDAwMDAwMDAwLFxuICAgICAgICAgIFwiTm9kZUlELVA3b0IyTWNqQkdnVzJOWFhXVllqVjhKRURGb1c5eERFNVwiOiAyMDAwMDAwMDAwMDAwMDAwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBHZXRWYWxpZGF0b3JzQXRSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgfSlcblxuICB0ZXN0KFwiZ2V0SGVpZ2h0XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBoZWlnaHQ6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCTj4gPSBhcGkuZ2V0SGVpZ2h0KClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgaGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogQk4gPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlLnRvU3RyaW5nKDEwKSkudG9CZShoZWlnaHQudG9TdHJpbmcoMTApKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRNaW5TdGFrZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgbWluU3Rha2U6IEJOID0gbmV3IEJOKFwiMjAwMDAwMDAwMDAwMFwiLCAxMClcbiAgICBjb25zdCBtaW5Ob21pbmF0ZTogQk4gPSBuZXcgQk4oXCIyNTAwMDAwMDAwMFwiLCAxMClcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8R2V0TWluU3Rha2VSZXNwb25zZT4gPSBhcGkuZ2V0TWluU3Rha2UoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBtaW5WYWxpZGF0b3JTdGFrZTogXCIyMDAwMDAwMDAwMDAwXCIsXG4gICAgICAgIG1pbk5vbWluYXRvclN0YWtlOiBcIjI1MDAwMDAwMDAwXCJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBHZXRNaW5TdGFrZVJlc3BvbnNlID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZVtcIm1pblZhbGlkYXRvclN0YWtlXCJdLnRvU3RyaW5nKDEwKSkudG9CZShcbiAgICAgIG1pblN0YWtlLnRvU3RyaW5nKDEwKVxuICAgIClcbiAgICBleHBlY3QocmVzcG9uc2VbXCJtaW5Ob21pbmF0b3JTdGFrZVwiXS50b1N0cmluZygxMCkpLnRvQmUoXG4gICAgICBtaW5Ob21pbmF0ZS50b1N0cmluZygxMClcbiAgICApXG4gIH0pXG5cbiAgdGVzdChcImdldFN0YWtlXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBzdGFrZWQ6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxuICAgIGNvbnN0IHN0YWtlZE91dHB1dHM6IHN0cmluZ1tdID0gW1xuICAgICAgXCIweDAwMDAyMWU2NzMxN2NiYzRiZTJhZWIwMDY3N2FkNjQ2Mjc3OGE4ZjUyMjc0YjlkNjA1ZGYyNTkxYjIzMDI3YTg3ZGZmMDAwMDAwMTYwMDAwMDAwMDYwYmQ2MTgwMDAwMDAwMDcwMDAwMDAwZmI3NTA0MzAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlNzAwNjBiNzA1MWE0ODM4ZWJlOGUyOWJjYmUxNDAzZGI5Yjg4Y2MzMTY4OTVlYjNcIixcbiAgICAgIFwiMHgwMDAwMjFlNjczMTdjYmM0YmUyYWViMDA2NzdhZDY0NjI3NzhhOGY1MjI3NGI5ZDYwNWRmMjU5MWIyMzAyN2E4N2RmZjAwMDAwMDE2MDAwMDAwMDA2MGJkNjE4MDAwMDAwMDA3MDAwMDAwZDE4YzJlMjgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxZTcwMDYwYjcwNTFhNDgzOGViZThlMjliY2JlMTQwM2RiOWI4OGNjMzcxNGRlNzU5XCIsXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjEzNDA4ODAwMDAwMDAwNzAwMDAwMDBmYjc1MDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzM3OWI4OTQ2MVwiLFxuICAgICAgXCIweDAwMDAyMWU2NzMxN2NiYzRiZTJhZWIwMDY3N2FkNjQ2Mjc3OGE4ZjUyMjc0YjlkNjA1ZGYyNTkxYjIzMDI3YTg3ZGZmMDAwMDAwMTYwMDAwMDAwMDYxMzQwODgwMDAwMDAwMDcwMDAwMDBkMThjMmUyODAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlNzAwNjBiNzA1MWE0ODM4ZWJlOGUyOWJjYmUxNDAzZGI5Yjg4Y2MzYzdhYTM1ZDFcIixcbiAgICAgIFwiMHgwMDAwMjFlNjczMTdjYmM0YmUyYWViMDA2NzdhZDY0NjI3NzhhOGY1MjI3NGI5ZDYwNWRmMjU5MWIyMzAyN2E4N2RmZjAwMDAwMDE2MDAwMDAwMDA2MTM0MDg4MDAwMDAwMDA3MDAwMDAxZDFhOTRhMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxZTcwMDYwYjcwNTFhNDgzOGViZThlMjliY2JlMTQwM2RiOWI4OGNjMzhmZDIzMmQ4XCJcbiAgICBdXG4gICAgY29uc3Qgb2JqczogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBzdGFrZWRPdXRwdXRzLm1hcChcbiAgICAgIChzdGFrZWRPdXRwdXQ6IHN0cmluZyk6IFRyYW5zZmVyYWJsZU91dHB1dCA9PiB7XG4gICAgICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dCgpXG4gICAgICAgIGxldCBidWY6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHN0YWtlZE91dHB1dC5yZXBsYWNlKC8weC9nLCBcIlwiKSwgXCJoZXhcIilcbiAgICAgICAgdHJhbnNmZXJhYmxlT3V0cHV0LmZyb21CdWZmZXIoYnVmLCAyKVxuICAgICAgICByZXR1cm4gdHJhbnNmZXJhYmxlT3V0cHV0XG4gICAgICB9XG4gICAgKVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldFN0YWtlKFthZGRyQV0sIFwiaGV4XCIpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHN0YWtlZCxcbiAgICAgICAgc3Rha2VkT3V0cHV0c1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VbXCJzdGFrZWRcIl0pKS50b0JlKEpTT04uc3RyaW5naWZ5KHN0YWtlZCkpXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlW1wic3Rha2VkT3V0cHV0c1wiXSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkob2JqcykpXG4gIH0pXG5cbiAgdGVzdChcImFkZEFsbHljaGFpblZhbGlkYXRvciAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogc3RyaW5nID1cbiAgICAgIFwiNFI1cDJSWERHTHFhaWZaRTRoSFdIOW93ZTM0cGZvQlVMbjFEclFUV2l2amc4bzRhSFwiXG4gICAgY29uc3Qgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4NSwgNSwgOSwgMTIsIDU5LCA0MywgOSlcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcbiAgICBjb25zdCB3ZWlnaHQ6IG51bWJlciA9IDEzXG4gICAgY29uc3QgdXR4OiBzdHJpbmcgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPVxuICAgICAgYXBpLmFkZEFsbHljaGFpblZhbGlkYXRvcihcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIGFsbHljaGFpbklELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIHdlaWdodFxuICAgICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB1dHhcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh1dHgpXG4gIH0pXG5cbiAgdGVzdChcImFkZEFsbHljaGFpblZhbGlkYXRvclwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgYWxseWNoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXG4gICAgY29uc3Qgc3RhcnRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4NSwgNSwgOSwgMTIsIDU5LCA0MywgOSlcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcbiAgICBjb25zdCB3ZWlnaHQ6IG51bWJlciA9IDEzXG4gICAgY29uc3QgdXR4OiBzdHJpbmcgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPVxuICAgICAgYXBpLmFkZEFsbHljaGFpblZhbGlkYXRvcihcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIGFsbHljaGFpbklELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIHdlaWdodFxuICAgICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB1dHhcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh1dHgpXG4gIH0pXG5cbiAgdGVzdChcImFkZE5vbWluYXRvciAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcbiAgICBjb25zdCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgxOTg1LCA1LCA5LCAxMiwgNTksIDQzLCA5KVxuICAgIGNvbnN0IGVuZFRpbWU6IERhdGUgPSBuZXcgRGF0ZSgxOTgyLCAzLCAxLCAxMiwgNTgsIDMzLCA3KVxuICAgIGNvbnN0IHN0YWtlQW1vdW50OiBCTiA9IG5ldyBCTigxMylcbiAgICBjb25zdCByZXdhcmRBZGRyZXNzOiBzdHJpbmcgPSBcImZlZGNiYVwiXG4gICAgY29uc3QgdXR4OiBzdHJpbmcgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5hZGROb21pbmF0b3IoXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgbm9kZUlELFxuICAgICAgc3RhcnRUaW1lLFxuICAgICAgZW5kVGltZSxcbiAgICAgIHN0YWtlQW1vdW50LFxuICAgICAgcmV3YXJkQWRkcmVzc1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogdXR4XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh1dHgpXG4gIH0pXG5cbiAgdGVzdChcImdldEJsb2NrY2hhaW5zIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHJlc3A6IG9iamVjdFtdID0gW1xuICAgICAge1xuICAgICAgICBpZDogXCJub2RlSURcIixcbiAgICAgICAgYWxseWNoYWluSUQ6IFwiYWxseWNoYWluSURcIixcbiAgICAgICAgdm1JRDogXCJ2bUlEXCJcbiAgICAgIH1cbiAgICBdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJsb2NrY2hhaW5bXT4gPSBhcGkuZ2V0QmxvY2tjaGFpbnMoKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBibG9ja2NoYWluczogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IEJsb2NrY2hhaW5bXSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocmVzcClcbiAgfSlcblxuICB0ZXN0KFwiZ2V0QWxseWNoYWlucyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCByZXNwOiBvYmplY3RbXSA9IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiaWRcIixcbiAgICAgICAgY29udHJvbEtleXM6IFtcImNvbnRyb2xLZXlzXCJdLFxuICAgICAgICB0aHJlc2hvbGQ6IFwidGhyZXNob2xkXCJcbiAgICAgIH1cbiAgICBdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEFsbHljaGFpbltdPiA9IGFwaS5nZXRBbGx5Y2hhaW5zKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYWxseWNoYWluczogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvRXF1YWwocmVzcClcbiAgfSlcblxuICB0ZXN0KFwiZ2V0Q3VycmVudFZhbGlkYXRvcnMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldEN1cnJlbnRWYWxpZGF0b3JzKClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoeyB2YWxpZGF0b3JzIH0pXG4gIH0pXG5cbiAgdGVzdChcImdldEN1cnJlbnRWYWxpZGF0b3JzIDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFsbHljaGFpbklEOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldEN1cnJlbnRWYWxpZGF0b3JzKGFsbHljaGFpbklEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB2YWxpZGF0b3JzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7IHZhbGlkYXRvcnMgfSlcbiAgfSlcblxuICB0ZXN0KFwiZ2V0Q3VycmVudFZhbGlkYXRvcnMgM1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWxseWNoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldEN1cnJlbnRWYWxpZGF0b3JzKGFsbHljaGFpbklEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB2YWxpZGF0b3JzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7IHZhbGlkYXRvcnMgfSlcbiAgfSlcblxuICB0ZXN0KFwiZXhwb3J0S2V5XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IFwic2RmZ2x2bGoyaDN2NDVcIlxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmV4cG9ydEtleShcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBhZGRyQVxuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgcHJpdmF0ZUtleToga2V5XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoa2V5KVxuICB9KVxuXG4gIHRlc3QoXCJleHBvcnRBWENcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFtb3VudDogQk4gPSBuZXcgQk4oMTAwKVxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiUm9iZXJ0XCJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJQYXVsc29uXCJcbiAgICBjb25zdCB0eElEOiBzdHJpbmcgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuZXhwb3J0QVhDKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGFtb3VudCxcbiAgICAgIHRvXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB0eElEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcbiAgfSlcblxuICB0ZXN0KFwiaW1wb3J0QVhDXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0bzogc3RyaW5nID0gXCJhYmNkZWZcIlxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXG4gICAgY29uc3QgcGFzc3dvcmQgPSBcIlBhdWxzb25cIlxuICAgIGNvbnN0IHR4SUQgPSBcInZhbGlkXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuaW1wb3J0QVhDKFxuICAgICAgdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHRvLFxuICAgICAgYmxvY2tjaGFpbklEXG4gICAgKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eElEOiB0eElEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcbiAgfSlcblxuICB0ZXN0KFwiY3JlYXRlQmxvY2tjaGFpblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBcIjdzaWszUHI2cjFGZUxydksxb1d3RUNCUzhpSjVWUHVTaFwiXG4gICAgY29uc3Qgdm1JRDogc3RyaW5nID0gXCI3c2lrM1ByNnIxRmVMcnZLMW9Xd0VDQlM4aUo1VlB1U2hcIlxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IFwiU29tZSBCbG9ja2NoYWluXCJcbiAgICBjb25zdCBnZW5lc2lzOiBzdHJpbmcgPSAne3J1aDpcInJvaFwifSdcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJhYmNkZWZcIiwgXCJoZXhcIilcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuY3JlYXRlQmxvY2tjaGFpbihcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBhbGx5Y2hhaW5JRCxcbiAgICAgIHZtSUQsXG4gICAgICBbMSwgMiwgM10sXG4gICAgICBuYW1lLFxuICAgICAgZ2VuZXNpc1xuICAgIClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdHhJRDogYmxvY2tjaGFpbklEXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYmxvY2tjaGFpbklEKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRCbG9ja2NoYWluU3RhdHVzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5nZXRCbG9ja2NoYWluU3RhdHVzKGJsb2NrY2hhaW5JRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgc3RhdHVzOiBcIkFjY2VwdGVkXCJcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwiQWNjZXB0ZWRcIilcbiAgfSlcblxuICB0ZXN0KFwiY3JlYXRlQWRkcmVzc1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWxpYXM6IHN0cmluZyA9IFwicmFuZG9tYWxpYXNcIlxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkuY3JlYXRlQWRkcmVzcyh1c2VybmFtZSwgcGFzc3dvcmQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGFkZHJlc3M6IGFsaWFzXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhbGlhcylcbiAgfSlcblxuICB0ZXN0KFwiY3JlYXRlQWxseWNoYWluIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGNvbnRyb2xLZXlzOiBzdHJpbmdbXSA9IFtcImFiY2RlZlwiXVxuICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMTNcbiAgICBjb25zdCB1dHg6IHN0cmluZyA9IFwidmFsaWRcIlxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5jcmVhdGVBbGx5Y2hhaW4oXG4gICAgICB1c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgY29udHJvbEtleXMsXG4gICAgICB0aHJlc2hvbGRcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHR4SUQ6IHV0eFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHV0eClcbiAgfSlcblxuICB0ZXN0KFwic2FtcGxlVmFsaWRhdG9ycyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBsZXQgYWxseWNoYWluSURcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBzdHJpbmdbXSA9IFtcInZhbDFcIiwgXCJ2YWwyXCJdXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5zYW1wbGVWYWxpZGF0b3JzKDEwLCBhbGx5Y2hhaW5JRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgdmFsaWRhdG9yc1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh2YWxpZGF0b3JzKVxuICB9KVxuXG4gIHRlc3QoXCJzYW1wbGVWYWxpZGF0b3JzIDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGFsbHljaGFpbklEOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkuc2FtcGxlVmFsaWRhdG9ycygxMCwgYWxseWNoYWluSUQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHZhbGlkYXRvcnNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodmFsaWRhdG9ycylcbiAgfSlcblxuICB0ZXN0KFwic2FtcGxlVmFsaWRhdG9ycyAzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBhbGx5Y2hhaW5JRCA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkuc2FtcGxlVmFsaWRhdG9ycygxMCwgYWxseWNoYWluSUQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIHZhbGlkYXRvcnNcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodmFsaWRhdG9ycylcbiAgfSlcblxuICB0ZXN0KFwidmFsaWRhdGVkQnkgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBcImFiY2RlZlwiXG4gICAgY29uc3QgcmVzcDogc3RyaW5nID0gXCJ2YWxpZFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkudmFsaWRhdGVkQnkoYmxvY2tjaGFpbklEKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICBhbGx5Y2hhaW5JRDogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocmVzcClcbiAgfSlcblxuICB0ZXN0KFwidmFsaWRhdGVzIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGxldCBhbGx5Y2hhaW5JRFxuICAgIGNvbnN0IHJlc3A6IHN0cmluZ1tdID0gW1widmFsaWRcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnZhbGlkYXRlcyhhbGx5Y2hhaW5JRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYmxvY2tjaGFpbklEczogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShyZXNwKVxuICB9KVxuXG4gIHRlc3QoXCJ2YWxpZGF0ZXMgMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWxseWNoYWluSUQ6IHN0cmluZyA9IFwiZGVhZGJlZWZcIlxuICAgIGNvbnN0IHJlc3A6IHN0cmluZ1tdID0gW1widmFsaWRcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnZhbGlkYXRlcyhhbGx5Y2hhaW5JRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYmxvY2tjaGFpbklEczogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShyZXNwKVxuICB9KVxuXG4gIHRlc3QoXCJ2YWxpZGF0ZXMgM1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgYWxseWNoYWluSUQgPSBCdWZmZXIuZnJvbShcImFiY2RlZlwiLCBcImhleFwiKVxuICAgIGNvbnN0IHJlc3A6IHN0cmluZ1tdID0gW1widmFsaWRcIl1cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnZhbGlkYXRlcyhhbGx5Y2hhaW5JRClcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XG4gICAgICByZXN1bHQ6IHtcbiAgICAgICAgYmxvY2tjaGFpbklEczogcmVzcFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShyZXNwKVxuICB9KVxuXG4gIHRlc3QoXCJnZXRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgdHhpZDogc3RyaW5nID1cbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXG5cbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgb2JqZWN0PiA9IGFwaS5nZXRUeCh0eGlkKVxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcbiAgICAgIHJlc3VsdDoge1xuICAgICAgICB0eDogXCJzb21ldHhcIlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoXCJzb21ldHhcIilcbiAgfSlcblxuICB0ZXN0KFwiZ2V0VHhTdGF0dXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IHR4aWQ6IHN0cmluZyA9XG4gICAgICBcImY5NjY3NTBmNDM4ODY3YzNjOTgyOGRkY2RiZTY2MGUyMWNjZGJiMzZhOTI3Njk1OGYwMTFiYTQ3MmY3NWQ0ZTdcIlxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEdldFR4U3RhdHVzUmVzcG9uc2U+ID0gYXBpLmdldFR4U3RhdHVzKHR4aWQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiBcImFjY2VwdGVkXCJcbiAgICB9XG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIGRhdGE6IHBheWxvYWRcbiAgICB9XG5cbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBHZXRUeFN0YXR1c1Jlc3BvbnNlID0gYXdhaXQgcmVzdWx0XG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcImFjY2VwdGVkXCIpXG4gIH0pXG5cbiAgdGVzdChcImdldFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBQYXltZW50XG4gICAgY29uc3QgT1BVVFhPc3RyMTogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDAzOGQxYjlmMTEzODY3MmRhNmZiNmMzNTEyNTUzOTI3NmE5YWNjMmE2NjhkNjNiZWE2YmEzYzc5NWUyZWRiMGY1MDAwMDAwMDEzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDA0ZGQ1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFhMzZmZDBjMmRiY2FiMzExNzMxZGRlN2VmMTUxNGJkMjZmY2RjNzRkXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG4gICAgY29uc3QgT1BVVFhPc3RyMjogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDBjM2U0ODIzNTcxNTg3ZmUyYmRmYzUwMjY4OWY1YTgyMzhiOWQwZWE3ZjMyNzcxMjRkMTZhZjlkZTBkMmQ5OTExMDAwMDAwMDAzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDAwMDE5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlMWI2YjZhNGJhZDk0ZDJlM2YyMDczMDM3OWI5YmNkNmYxNzYzMThlXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG4gICAgY29uc3QgT1BVVFhPc3RyMzogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcbiAgICAgIEJ1ZmZlci5mcm9tKFxuICAgICAgICBcIjAwMDBmMjlkYmE2MWZkYThkNTdhOTExZTdmODgxMGY5MzViZGU4MTBkM2Y4ZDQ5NTQwNDY4NWJkYjhkOWQ4NTQ1ZTg2MDAwMDAwMDAzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDAwMDE5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlMWI2YjZhNGJhZDk0ZDJlM2YyMDczMDM3OWI5YmNkNmYxNzYzMThlXCIsXG4gICAgICAgIFwiaGV4XCJcbiAgICAgIClcbiAgICApXG5cbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgc2V0LmFkZChPUFVUWE9zdHIxKVxuICAgIHNldC5hZGRBcnJheShbT1BVVFhPc3RyMiwgT1BVVFhPc3RyM10pXG5cbiAgICBjb25zdCBwZXJzaXN0T3B0czogUGVyc2lzdGFuY2VPcHRpb25zID0gbmV3IFBlcnNpc3RhbmNlT3B0aW9ucyhcbiAgICAgIFwidGVzdFwiLFxuICAgICAgdHJ1ZSxcbiAgICAgIFwidW5pb25cIlxuICAgIClcbiAgICBleHBlY3QocGVyc2lzdE9wdHMuZ2V0TWVyZ2VSdWxlKCkpLnRvQmUoXCJ1bmlvblwiKVxuICAgIGxldCBhZGRyZXNzZXM6IHN0cmluZ1tdID0gc2V0XG4gICAgICAuZ2V0QWRkcmVzc2VzKClcbiAgICAgIC5tYXAoKGEpOiBzdHJpbmcgPT4gYXBpLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxuICAgIGxldCByZXN1bHQ6IFByb21pc2U8R2V0VVRYT3NSZXNwb25zZT4gPSBhcGkuZ2V0VVRYT3MoXG4gICAgICBhZGRyZXNzZXMsXG4gICAgICBhcGkuZ2V0QmxvY2tjaGFpbklEKCksXG4gICAgICAwLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgcGVyc2lzdE9wdHNcbiAgICApXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIG51bUZldGNoZWQ6IDMsXG4gICAgICAgIHV0eG9zOiBbT1BVVFhPc3RyMSwgT1BVVFhPc3RyMiwgT1BVVFhPc3RyM10sXG4gICAgICAgIHN0b3BJbmRleDogeyBhZGRyZXNzOiBcImFcIiwgdXR4bzogXCJiXCIgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgbGV0IHJlc3BvbnNlOiBVVFhPU2V0ID0gKGF3YWl0IHJlc3VsdCkudXR4b3NcblxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKSkudG9CZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNldC5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSlcbiAgICApXG5cbiAgICBhZGRyZXNzZXMgPSBzZXQuZ2V0QWRkcmVzc2VzKCkubWFwKChhKSA9PiBhcGkuYWRkcmVzc0Zyb21CdWZmZXIoYSkpXG4gICAgcmVzdWx0ID0gYXBpLmdldFVUWE9zKFxuICAgICAgYWRkcmVzc2VzLFxuICAgICAgYXBpLmdldEJsb2NrY2hhaW5JRCgpLFxuICAgICAgMCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHBlcnNpc3RPcHRzXG4gICAgKVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICByZXNwb25zZSA9IChhd2FpdCByZXN1bHQpLnV0eG9zXG5cbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZS5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSkpLnRvQmUoXG4gICAgICBKU09OLnN0cmluZ2lmeShzZXQuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkpXG4gICAgKVxuICB9KVxuXG4gIGRlc2NyaWJlKFwiVHJhbnNhY3Rpb25zXCIsICgpOiB2b2lkID0+IHtcbiAgICBsZXQgc2V0OiBVVFhPU2V0XG4gICAgbGV0IGxzZXQ6IFVUWE9TZXRcbiAgICBsZXQga2V5bWdyMjogS2V5Q2hhaW5cbiAgICBsZXQga2V5bWdyMzogS2V5Q2hhaW5cbiAgICBsZXQgYWRkcnMxOiBzdHJpbmdbXVxuICAgIGxldCBhZGRyczI6IHN0cmluZ1tdXG4gICAgbGV0IGFkZHJzMzogc3RyaW5nW11cbiAgICBsZXQgYWRkcmVzc2J1ZmZzOiBCdWZmZXJbXSA9IFtdXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbXVxuICAgIGxldCB1dHhvczogVVRYT1tdXG4gICAgbGV0IGx1dHhvczogVVRYT1tdXG4gICAgbGV0IGlucHV0czogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICAgIGxldCBvdXRwdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXVxuICAgIGNvbnN0IGFtbnQ6IG51bWJlciA9IDEwMDAwXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpLnVwZGF0ZShcIm1hcnkgaGFkIGEgbGl0dGxlIGxhbWJcIikuZGlnZXN0KClcbiAgICApXG4gICAgbGV0IHNlY3BiYXNlMTogU0VDUFRyYW5zZmVyT3V0cHV0XG4gICAgbGV0IHNlY3BiYXNlMjogU0VDUFRyYW5zZmVyT3V0cHV0XG4gICAgbGV0IHNlY3BiYXNlMzogU0VDUFRyYW5zZmVyT3V0cHV0XG4gICAgbGV0IGZ1bmd1dHhvaWRzOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IHBsYXRmb3Jtdm06IFBsYXRmb3JtVk1BUElcbiAgICBjb25zdCBmZWU6IG51bWJlciA9IDEwXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gXCJNb3J0eWNvaW4gaXMgdGhlIGR1bWIgYXMgYSBzYWNrIG9mIGhhbW1lcnMuXCJcbiAgICBjb25zdCBzeW1ib2w6IHN0cmluZyA9IFwibW9yVFwiXG4gICAgY29uc3QgZGVub21pbmF0aW9uOiBudW1iZXIgPSA4XG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHBsYXRmb3Jtdm0gPSBuZXcgUGxhdGZvcm1WTUFQSShheGlhLCBcIi9leHQvYmMvQ29yZVwiKVxuICAgICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICBhc3NldElEOiBiaW50b29scy5jYjU4RW5jb2RlKGFzc2V0SUQpLFxuICAgICAgICAgIGRlbm9taW5hdGlvbjogYCR7ZGVub21pbmF0aW9ufWBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgfVxuXG4gICAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxuICAgICAgYXdhaXQgcmVzdWx0XG4gICAgICBzZXQgPSBuZXcgVVRYT1NldCgpXG4gICAgICBsc2V0ID0gbmV3IFVUWE9TZXQoKVxuICAgICAgcGxhdGZvcm12bS5uZXdLZXlDaGFpbigpXG4gICAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcbiAgICAgIGFkZHJzMSA9IFtdXG4gICAgICBhZGRyczIgPSBbXVxuICAgICAgYWRkcnMzID0gW11cbiAgICAgIHV0eG9zID0gW11cbiAgICAgIGx1dHhvcyA9IFtdXG4gICAgICBpbnB1dHMgPSBbXVxuICAgICAgb3V0cHV0cyA9IFtdXG4gICAgICBmdW5ndXR4b2lkcyA9IFtdXG4gICAgICBjb25zdCBwbG9hZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDEwMjQpXG4gICAgICBwbG9hZC53cml0ZShcbiAgICAgICAgXCJBbGwgeW91IFRyZWtraWVzIGFuZCBUViBhZGRpY3RzLCBEb24ndCBtZWFuIHRvIGRpc3MgZG9uJ3QgbWVhbiB0byBicmluZyBzdGF0aWMuXCIsXG4gICAgICAgIDAsXG4gICAgICAgIDEwMjQsXG4gICAgICAgIFwidXRmOFwiXG4gICAgICApXG5cbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgYWRkcnMxLnB1c2goXG4gICAgICAgICAgcGxhdGZvcm12bS5hZGRyZXNzRnJvbUJ1ZmZlcihcbiAgICAgICAgICAgIHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIGFkZHJzMi5wdXNoKFxuICAgICAgICAgIHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgICApXG4gICAgICAgIGFkZHJzMy5wdXNoKFxuICAgICAgICAgIHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoa2V5bWdyMy5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgICApXG4gICAgICB9XG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FQVhDLm11bChuZXcgQk4oYW1udCkpXG4gICAgICBhZGRyZXNzYnVmZnMgPSBwbGF0Zm9ybXZtLmtleUNoYWluKCkuZ2V0QWRkcmVzc2VzKClcbiAgICAgIGFkZHJlc3NlcyA9IGFkZHJlc3NidWZmcy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoYSkpXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDNcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgbGV0IHR4aWQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCAzMikpXG4gICAgICAgICAgICAuZGlnZXN0KClcbiAgICAgICAgKVxuICAgICAgICBsZXQgdHhpZHg6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgICAgICB0eGlkeC53cml0ZVVJbnQzMkJFKGksIDApXG5cbiAgICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICAgIGFtb3VudCxcbiAgICAgICAgICBhZGRyZXNzYnVmZnMsXG4gICAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgICAgdGhyZXNob2xkXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXG4gICAgICAgIG91dHB1dHMucHVzaCh4ZmVyb3V0KVxuXG4gICAgICAgIGNvbnN0IHU6IFVUWE8gPSBuZXcgVVRYTygpXG4gICAgICAgIHUuZnJvbUJ1ZmZlcihcbiAgICAgICAgICBCdWZmZXIuY29uY2F0KFt1LmdldENvZGVjSURCdWZmZXIoKSwgdHhpZCwgdHhpZHgsIHhmZXJvdXQudG9CdWZmZXIoKV0pXG4gICAgICAgIClcbiAgICAgICAgZnVuZ3V0eG9pZHMucHVzaCh1LmdldFVUWE9JRCgpKVxuICAgICAgICB1dHhvcy5wdXNoKHUpXG5cbiAgICAgICAgdHhpZCA9IHUuZ2V0VHhJRCgpXG4gICAgICAgIHR4aWR4ID0gdS5nZXRPdXRwdXRJZHgoKVxuICAgICAgICBjb25zdCBhc3NldCA9IHUuZ2V0QXNzZXRJRCgpXG5cbiAgICAgICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGFtb3VudClcbiAgICAgICAgY29uc3QgeGZlcmlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgICAgICB0eGlkLFxuICAgICAgICAgIHR4aWR4LFxuICAgICAgICAgIGFzc2V0LFxuICAgICAgICAgIGlucHV0XG4gICAgICAgIClcbiAgICAgICAgaW5wdXRzLnB1c2goeGZlcmlucHV0KVxuICAgICAgfVxuICAgICAgc2V0LmFkZEFycmF5KHV0eG9zKVxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICBsZXQgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgICAgLnVwZGF0ZShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDMyKSlcbiAgICAgICAgICAgIC5kaWdlc3QoKVxuICAgICAgICApXG4gICAgICAgIGxldCB0eGlkeDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgICAgIHR4aWR4LndyaXRlVUludDMyQkUoaSwgMClcblxuICAgICAgICBjb25zdCBvdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgICAgT05FQVhDLm11bChuZXcgQk4oNSkpLFxuICAgICAgICAgIGFkZHJlc3NidWZmcyxcbiAgICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgICAxXG4gICAgICAgIClcbiAgICAgICAgY29uc3QgcG91dDogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChvdXQpXG4gICAgICAgIGNvbnN0IGxvY2tvdXQ6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcbiAgICAgICAgICBPTkVBWEMubXVsKG5ldyBCTig1KSksXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxuICAgICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgbG9ja3RpbWUuYWRkKG5ldyBCTig4NjQwMCkpLFxuICAgICAgICAgIHBvdXRcbiAgICAgICAgKVxuICAgICAgICBjb25zdCB4ZmVyb3V0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgICAgIGFzc2V0SUQsXG4gICAgICAgICAgbG9ja291dFxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgdTogVVRYTyA9IG5ldyBVVFhPKClcbiAgICAgICAgdS5mcm9tQnVmZmVyKFxuICAgICAgICAgIEJ1ZmZlci5jb25jYXQoW3UuZ2V0Q29kZWNJREJ1ZmZlcigpLCB0eGlkLCB0eGlkeCwgeGZlcm91dC50b0J1ZmZlcigpXSlcbiAgICAgICAgKVxuICAgICAgICBsdXR4b3MucHVzaCh1KVxuICAgICAgfVxuXG4gICAgICBsc2V0LmFkZEFycmF5KGx1dHhvcylcbiAgICAgIGxzZXQuYWRkQXJyYXkoc2V0LmdldEFsbFVUWE9zKCkpXG5cbiAgICAgIHNlY3BiYXNlMSA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIG5ldyBCTig3NzcpLFxuICAgICAgICBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgICAgc2VjcGJhc2UyID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgbmV3IEJOKDg4OCksXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgVW5peE5vdygpLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBzZWNwYmFzZTMgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBuZXcgQk4oOTk5KSxcbiAgICAgICAgYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIDFcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcInNpZ25UeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIG5ldyBCTihhbW50KSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcnMzLm1hcCgoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXG4gICAgICAgIGFkZHJzMS5tYXAoKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpLFxuICAgICAgICBhZGRyczEubWFwKChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKSxcbiAgICAgICAgcGxhdGZvcm12bS5nZXRUeEZlZSgpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICAxXG4gICAgICApXG5cbiAgICAgIHR4dTIuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEltcG9ydFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXG4gICAgICBwbGF0Zm9ybXZtLnNldFR4RmVlKG5ldyBCTihmZWUpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgZnVuZ3V0eG86IFVUWE8gPSBzZXQuZ2V0VVRYTyhmdW5ndXR4b2lkc1sxXSlcbiAgICAgIGNvbnN0IGZ1bmd1dHhvc3RyOiBzdHJpbmcgPSBmdW5ndXR4by50b1N0cmluZygpXG5cbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxVbnNpZ25lZFR4PiA9IHBsYXRmb3Jtdm0uYnVpbGRJbXBvcnRUeChcbiAgICAgICAgc2V0LFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIFBsYXRmb3JtQ2hhaW5JRCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKSxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICB1dHhvczogW2Z1bmd1dHhvc3RyXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiBwYXlsb2FkXG4gICAgICB9XG5cbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcmVzdWx0XG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRJbXBvcnRUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIFtmdW5ndXR4b10sXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgICAgcGxhdGZvcm12bS5nZXRUeEZlZSgpLFxuICAgICAgICBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KCksXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcblxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcblxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcblxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkltcG9ydFR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEV4cG9ydFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHBsYXRmb3Jtdm0uc2V0VHhGZWUobmV3IEJOKGZlZSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKDkwKVxuICAgICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEV4cG9ydFR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW2F4aWEuZ2V0TmV0d29ya0lEKCldLlN3YXBbXCJibG9ja2NoYWluSURcIl1cbiAgICAgICAgKSxcbiAgICAgICAgYWRkcmJ1ZmYzLm1hcCgoYSkgPT5cbiAgICAgICAgICBzZXJpYWxpemVyLmJ1ZmZlclRvVHlwZShhLCB0eXBlLCBheGlhLmdldEhSUCgpLCBcIkNvcmVcIilcbiAgICAgICAgKSxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MjogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYXhpYS5nZXROZXR3b3JrSUQoKV0uU3dhcFtcImJsb2NrY2hhaW5JRFwiXVxuICAgICAgICApLFxuICAgICAgICBwbGF0Zm9ybXZtLmdldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4dTM6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkRXhwb3J0VHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYXhpYS5nZXROZXR3b3JrSUQoKV0uU3dhcFtcImJsb2NrY2hhaW5JRFwiXVxuICAgICAgICApLFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTQ6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRFeHBvcnRUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBwbGF0Zm9ybXZtLmdldFR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGV4cGVjdCh0eHU0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTMudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTQudG9TdHJpbmcoKSkudG9CZSh0eHUzLnRvU3RyaW5nKCkpXG5cbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG5cbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG5cbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJFeHBvcnRUeFwiKVxuICAgIH0pXG4gICAgLypcbiAgICAgICAgdGVzdCgnYnVpbGRBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeCcsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgICAgICBwbGF0Zm9ybXZtLnNldEZlZShuZXcgQk4oZmVlKSk7XG4gICAgICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpO1xuICAgICAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKTtcbiAgICAgICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSk7XG4gICAgICAgICAgY29uc3QgYW1vdW50OkJOID0gbmV3IEJOKDkwKTtcblxuICAgICAgICAgIGNvbnN0IHR4dTE6VW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeChcbiAgICAgICAgICAgIHNldCxcbiAgICAgICAgICAgIGFkZHJzMSxcbiAgICAgICAgICAgIGFkZHJzMixcbiAgICAgICAgICAgIG5vZGVJRCxcbiAgICAgICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgICAgIGVuZFRpbWUsXG4gICAgICAgICAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLk1JTlNUQUtFLFxuICAgICAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksIFVuaXhOb3coKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCB0eHUyOlVuc2lnbmVkVHggPSBzZXQuYnVpbGRBZGRBbGx5Y2hhaW5WYWxpZGF0b3JUeChcbiAgICAgICAgICAgIG5ldHdvcmtJRCwgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcbiAgICAgICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgICAgIGVuZFRpbWUsXG4gICAgICAgICAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLk1JTlNUQUtFLFxuICAgICAgICAgICAgcGxhdGZvcm12bS5nZXRGZWUoKSxcbiAgICAgICAgICAgIGFzc2V0SUQsXG4gICAgICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksIFVuaXhOb3coKVxuICAgICAgICAgICk7XG4gICAgICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZygnaGV4JykpLnRvQmUodHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKCdoZXgnKSk7XG4gICAgICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIH0pO1xuICAgICovXG4gICAgdGVzdChcImJ1aWxkQWRkTm9taW5hdG9yVHggMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5Ob21pbmF0aW9uU3Rha2VcblxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAyXG5cbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluU3Rha2UsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkTm9taW5hdG9yVHgoXG4gICAgICAgIHNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRBZGROb21pbmF0b3JUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIG5ldyBCTigwKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG5cbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG5cbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJBZGROb21pbmF0b3JUeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRBZGRWYWxpZGF0b3JUeCBzb3J0IFN0YWtlYWJsZUxvY2tPdXRzIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgLy8gdHdvIFVUWE8uIFRoZSAxc3QgaGFzIGEgbGVzc2VyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGdyZWF0ZXIgYW1vdW50IG9mIEFYQy4gVGhlIDJuZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgQVhDLlxuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdGVzdCB0byBvbmx5IGNvbnN1bWUgdGhlIDJuZCBVVFhPIHNpbmNlIGl0IGhhcyB0aGUgZ3JlYXRlciBsb2NrdGltZS5cbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFtb3VudDE6IEJOID0gbmV3IEJOKFwiMjAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGFtb3VudDI6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMDAwMDBcIilcbiAgICAgIGNvbnN0IGxvY2t0aW1lMTogQk4gPSBuZXcgQk4oMClcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMVxuXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTE6IEJOID0gbmV3IEJOKDE2MzM4MjQwMDApXG4gICAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQxOiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkXG4gICAgICApXG4gICAgICBjb25zdCBwYXJzZWFibGVPdXRwdXQxOiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KFxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQxXG4gICAgICApXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrT3V0MTogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxuICAgICAgICBhbW91bnQxLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lMSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTEsXG4gICAgICAgIHBhcnNlYWJsZU91dHB1dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMjogQk4gPSBuZXcgQk4oMTczMzgyNDAwMClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDI6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDI6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDJcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQyOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIGFtb3VudDIsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMixcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MlxuICAgICAgKVxuICAgICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC0zNmdpRnllNWVwd0JUcEdxUGs3YjRDQ1llM2hmeW9GcjFcIlxuICAgICAgY29uc3Qgc3Rha2VBbW91bnQ6IEJOID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5TdGFrZVxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXG4gICAgICApXG4gICAgICBjb25zdCBub21pbmF0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcbiAgICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IDBcbiAgICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiYXVoTUZzMjRmZmMyQlJXS3c2aTdRbmdjczhqU1FVUzlFaTJYd0pzVXBFcTRzVFZpYlwiXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkMjogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCIySndEZm0zQzdwODhySlExWTF4V0xrV05NQTFucVB6cW5hQzJIaTRQRE5LaVBuWGdHdlwiXG4gICAgICApXG4gICAgICBjb25zdCBvdXRwdXRpZHgwOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBvdXRwdXRpZHgxOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBhc3NldElEID0gYXdhaXQgcGxhdGZvcm12bS5nZXRBWENBc3NldElEKClcbiAgICAgIGNvbnN0IGFzc2V0SUQyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRBWENBc3NldElEKClcbiAgICAgIGNvbnN0IHV0eG8xOiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIGNvZGVjSUQsXG4gICAgICAgIHR4aWQsXG4gICAgICAgIG91dHB1dGlkeDAsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQxXG4gICAgICApXG4gICAgICBjb25zdCB1dHhvMjogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBjb2RlY0lELFxuICAgICAgICB0eGlkMixcbiAgICAgICAgb3V0cHV0aWR4MSxcbiAgICAgICAgYXNzZXRJRDIsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyXG4gICAgICApXG4gICAgICBjb25zdCB1dHhvU2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxuICAgICAgdXR4b1NldC5hZGQodXR4bzEpXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMilcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkVmFsaWRhdG9yVHgoXG4gICAgICAgIHV0eG9TZXQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5vZGVJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBzdGFrZUFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBub21pbmF0aW9uRmVlUmF0ZVxuICAgICAgKVxuICAgICAgY29uc3QgdHggPSB0eHUxLmdldFRyYW5zYWN0aW9uKCkgYXMgQWRkVmFsaWRhdG9yVHhcbiAgICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHR4LmdldElucygpXG4gICAgICAvLyBzdGFydCB0ZXN0IGlucHV0c1xuICAgICAgLy8gY29uZmlybSBvbmx5IDEgaW5wdXRcbiAgICAgIGV4cGVjdChpbnMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBjb25zdCBpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBpbnNbMF1cbiAgICAgIGNvbnN0IGFpID0gaW5wdXQuZ2V0SW5wdXQoKSBhcyBBbW91bnRJbnB1dFxuICAgICAgY29uc3QgYW8gPSBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgY29uc3QgYW8yID0gc3Rha2VhYmxlTG9ja091dDFcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgYW1vdW50IG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChhaS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKGFvLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpXG4gICAgICAvLyBjb25maXJtIGlucHV0IGFtb3VudCBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGxlc3NlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGdyZWF0ZXIgYW1vdW50XG4gICAgICBleHBlY3QoYWkuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoYW8yLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHNsaTogU3Rha2VhYmxlTG9ja0luID0gaW5wdXQuZ2V0SW5wdXQoKSBhcyBTdGFrZWFibGVMb2NrSW5cbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbGkuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWtlYWJsZWxvY2sgdGltZSBidXQgZ3JlYXRlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbGkuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG4gICAgICAvLyBzdG9wIHRlc3QgaW5wdXRzXG5cbiAgICAgIC8vIHN0YXJ0IHRlc3Qgb3V0cHV0c1xuICAgICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRPdXRzKClcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIG91dHB1dFxuICAgICAgZXhwZWN0KG91dHMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBjb25zdCBvdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG91dHNbMF1cbiAgICAgIGNvbnN0IGFvMyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IGFtb3VudCBtYXRjaGVzIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50IHNhbnMgdGhlIHN0YWtlIGFtb3VudFxuICAgICAgZXhwZWN0KGFvMy5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBhby5nZXRBbW91bnQoKS5zdWIoc3Rha2VBbW91bnQpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IGFtb3VudCBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGxlc3NlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGdyZWF0ZXIgYW1vdW50XG4gICAgICBleHBlY3QoYW8zLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKGFvMi5nZXRBbW91bnQoKS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCBzbG86IFN0YWtlYWJsZUxvY2tPdXQgPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IHN0YWtlYWJsZWxvY2sgdGltZSBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XG4gICAgICBleHBlY3Qoc2xvLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuXG4gICAgICAvLyBjb25maXJtIHR4IG5vZGVJRCBtYXRjaGVzIG5vZGVJRFxuICAgICAgZXhwZWN0KHR4LmdldE5vZGVJRFN0cmluZygpKS50b0VxdWFsKG5vZGVJRClcbiAgICAgIC8vIGNvbmZpcm0gdHggc3RhcnR0aW1lIG1hdGNoZXMgc3RhcnR0aW1lXG4gICAgICBleHBlY3QodHguZ2V0U3RhcnRUaW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChzdGFydFRpbWUudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gdHggZW5kdGltZSBtYXRjaGVzIGVuZHRpbWVcbiAgICAgIGV4cGVjdCh0eC5nZXRFbmRUaW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChlbmRUaW1lLnRvU3RyaW5nKCkpXG4gICAgICAvLyBjb25maXJtIHR4IHN0YWtlIGFtb3VudCBtYXRjaGVzIHN0YWtlQW1vdW50XG4gICAgICBleHBlY3QodHguZ2V0U3Rha2VBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YWtlQW1vdW50LnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRTdGFrZU91dHMoKVxuICAgICAgLy8gY29uZmlybSBvbmx5IDEgc3Rha2VPdXRcbiAgICAgIGV4cGVjdChzdGFrZU91dHMubGVuZ3RoKS50b0JlKDEpXG5cbiAgICAgIGNvbnN0IHN0YWtlT3V0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBzdGFrZU91dHNbMF1cbiAgICAgIGNvbnN0IHNsbzIgPSBzdGFrZU91dC5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlYWJsZWxvY2sgdGltZSBtYXRjaGVzIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XG4gICAgICBleHBlY3Qoc2xvMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gY29uZmlybSBzdGFrZU91dCBzdGFrZWFibGVsb2NrIHRpbWUgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWtlYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxuICAgICAgZXhwZWN0KHNsbzIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICApXG4gICAgICBzbG8yLmdldEFtb3VudCgpXG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlIGFtb3VudCBtYXRjaGVzIHN0YWtlQW1vdW50XG4gICAgICBleHBlY3Qoc2xvMi5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YWtlQW1vdW50LnRvU3RyaW5nKCkpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEFkZFZhbGlkYXRvclR4IHNvcnQgU3Rha2VhYmxlTG9ja091dHMgMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAvLyBUT0RPIC0gZGVidWcgdGVzdFxuICAgICAgLy8gdHdvIFVUWE8uIFRoZSAxc3QgaGFzIGEgbGVzc2VyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGdyZWF0ZXIgYW1vdW50IG9mIEFYQy4gVGhlIDJuZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgQVhDLlxuICAgICAgLy8gdGhpcyB0aW1lIHdlJ3JlIHN0YWtpbmcgYSBncmVhdGVyIGFtb3VudCB0aGFuIGlzIGF2YWlsYWJsZSBpbiB0aGUgMm5kIFVUWE8uXG4gICAgICAvLyBXZSBleHBlY3QgdGhpcyB0ZXN0IHRvIGNvbnN1bWUgdGhlIGZ1bGwgMm5kIFVUWE8gYW5kIGEgZnJhY3Rpb24gb2YgdGhlIDFzdCBVVFhPLi5cbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKFxuICAgICAgICAoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxuICAgICAgKVxuICAgICAgY29uc3QgYW1vdW50MTogQk4gPSBuZXcgQk4oXCIyMDAwMDAwMDAwMDAwMDAwMFwiKVxuICAgICAgY29uc3QgYW1vdW50MjogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMDAwMDAwMDAwMFwiKVxuICAgICAgY29uc3QgbG9ja3RpbWUxOiBCTiA9IG5ldyBCTigwKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXG5cbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMTogQk4gPSBuZXcgQk4oMTYzMzgyNDAwMClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDE6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDEsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDE6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQxOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIGFtb3VudDEsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMSxcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MVxuICAgICAgKVxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja1RpbWUyOiBCTiA9IG5ldyBCTigxNzMzODI0MDAwKVxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MjogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgYW1vdW50MixcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MjogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcbiAgICAgICAgc2VjcFRyYW5zZmVyT3V0cHV0MlxuICAgICAgKVxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDI6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcbiAgICAgICAgYW1vdW50MixcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgc3Rha2VhYmxlTG9ja1RpbWUyLFxuICAgICAgICBwYXJzZWFibGVPdXRwdXQyXG4gICAgICApXG4gICAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiTm9kZUlELTM2Z2lGeWU1ZXB3QlRwR3FQazdiNENDWWUzaGZ5b0ZyMVwiXG4gICAgICBjb25zdCBzdGFrZUFtb3VudDogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMzAwMDAwMDAwMFwiKVxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXG4gICAgICApXG4gICAgICBjb25zdCBub21pbmF0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcbiAgICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IDBcbiAgICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiYXVoTUZzMjRmZmMyQlJXS3c2aTdRbmdjczhqU1FVUzlFaTJYd0pzVXBFcTRzVFZpYlwiXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkMjogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgICAgXCIySndEZm0zQzdwODhySlExWTF4V0xrV05NQTFucVB6cW5hQzJIaTRQRE5LaVBuWGdHdlwiXG4gICAgICApXG4gICAgICBjb25zdCBvdXRwdXRpZHgwOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBvdXRwdXRpZHgxOiBudW1iZXIgPSAwXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxuICAgICAgY29uc3QgYXNzZXRJRDI6IEJ1ZmZlciA9IGF3YWl0IHBsYXRmb3Jtdm0uZ2V0QVhDQXNzZXRJRCgpXG4gICAgICBjb25zdCB1dHhvMTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBjb2RlY0lELFxuICAgICAgICB0eGlkLFxuICAgICAgICBvdXRwdXRpZHgwLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MVxuICAgICAgKVxuICAgICAgY29uc3QgdXR4bzI6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgY29kZWNJRCxcbiAgICAgICAgdHhpZDIsXG4gICAgICAgIG91dHB1dGlkeDEsXG4gICAgICAgIGFzc2V0SUQyLFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgKVxuICAgICAgY29uc3QgdXR4b1NldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8xKVxuICAgICAgdXR4b1NldC5hZGQodXR4bzIpXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICB1dHhvU2V0LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgbm9taW5hdGlvbkZlZVJhdGVcbiAgICAgIClcbiAgICAgIGNvbnN0IHR4ID0gdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eC5nZXRJbnMoKVxuICAgICAgLy8gc3RhcnQgdGVzdCBpbnB1dHNcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIGlucHV0XG4gICAgICBleHBlY3QoaW5zLmxlbmd0aCkudG9CZSgyKVxuICAgICAgY29uc3QgaW5wdXQxOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxuICAgICAgY29uc3QgaW5wdXQyOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1sxXVxuICAgICAgY29uc3QgYWkxID0gaW5wdXQxLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcbiAgICAgIGNvbnN0IGFpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XG4gICAgICBjb25zdCBhbzEgPSBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgY29uc3QgYW8yID0gc3Rha2VhYmxlTG9ja091dDFcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gZWFjaCBpbnB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgY29ycmVzcG9uZGluZyBvdXRwdXRcbiAgICAgIGV4cGVjdChhaTIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcbiAgICAgIGV4cGVjdChhaTEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3Qgc2xpMSA9IGlucHV0MS5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgY29uc3Qgc2xpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdHJha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcbiAgICAgIC8vIGV4cGVjdChzbGkxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG4gICAgICBleHBlY3Qoc2xpMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgKVxuICAgICAgLy8gc3RvcCB0ZXN0IGlucHV0c1xuXG4gICAgICAvLyBzdGFydCB0ZXN0IG91dHB1dHNcbiAgICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0T3V0cygpXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBvdXRwdXRcbiAgICAgIGV4cGVjdChvdXRzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgY29uc3Qgb3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBvdXRzWzBdXG4gICAgICBjb25zdCBhbzMgPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XG4gICAgICAvLyBjb25maXJtIG91dHB1dCBhbW91bnQgbWF0Y2hlcyB0aGUgb3V0cHV0IGFtb3VudCBzYW5zIHRoZSAybmQgdXR4byBhbW91bnQgYW5kIHRoZSBzdGFrZSBhbW91bnRcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgICAgYW8yLmdldEFtb3VudCgpLnN1YihzdGFrZUFtb3VudC5zdWIoYW8xLmdldEFtb3VudCgpKSkudG9TdHJpbmcoKVxuICAgICAgKVxuXG4gICAgICBjb25zdCBzbG8gPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgbGVzc2VyIHN0YWtlYWJsZWxvY2sgc2luY2UgdGhlIG90aGVyIHdhcyBjb25zdW1lZFxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWVcbiAgICAgIC8vIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG5cbiAgICAgIC8vIGNvbmZpcm0gdHggbm9kZUlEIG1hdGNoZXMgbm9kZUlEXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxuICAgICAgLy8gY29uZmlybSB0eCBzdGFydHRpbWUgbWF0Y2hlcyBzdGFydHRpbWVcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFydFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YXJ0VGltZS50b1N0cmluZygpKVxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxuICAgICAgZXhwZWN0KHR4LmdldEVuZFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKGVuZFRpbWUudG9TdHJpbmcoKSlcbiAgICAgIC8vIGNvbmZpcm0gdHggc3Rha2UgYW1vdW50IG1hdGNoZXMgc3Rha2VBbW91bnRcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcblxuICAgICAgbGV0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRTdGFrZU91dHMoKVxuICAgICAgLy8gY29uZmlybSAyIHN0YWtlT3V0c1xuICAgICAgZXhwZWN0KHN0YWtlT3V0cy5sZW5ndGgpLnRvQmUoMilcblxuICAgICAgbGV0IHN0YWtlT3V0MTogVHJhbnNmZXJhYmxlT3V0cHV0ID0gc3Rha2VPdXRzWzBdXG4gICAgICBsZXQgc3Rha2VPdXQyOiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBzdGFrZU91dHNbMV1cbiAgICAgIGxldCBzbG8yID0gc3Rha2VPdXQxLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIGxldCBzbG8zID0gc3Rha2VPdXQyLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIC8vIGNvbmZpcm0gYm90aCBzdGFrZU91dCBzdHJha2VhYmxlbG9jayB0aW1lcyBtYXRjaGUgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XG4gICAgICAvLyBleHBlY3Qoc2xvMy5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgZXhwZWN0KHNsbzIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIC8vIFRPRE8gLSBkZWJ1ZyB0ZXN0XG4gICAgICAvLyB0aHJlZSBVVFhPLlxuICAgICAgLy8gVGhlIDFzdCBpcyBhIFNlY3BUcmFuc2ZlcmFibGVPdXRwdXQuXG4gICAgICAvLyBUaGUgMm5kIGhhcyBhIGxlc3NlciBzdGFrZWFibGVsb2NrdGltZSBhbmQgYSBncmVhdGVyIGFtb3VudCBvZiBBWEMuXG4gICAgICAvLyBUaGUgM3JkIGhhcyBhIGdyZWF0ZXIgc3Rha2VhYmxlbG9ja3RpbWUgYW5kIGEgbGVzc2VyIGFtb3VudCBvZiBBWEMuXG4gICAgICAvL1xuICAgICAgLy8gdGhpcyB0aW1lIHdlJ3JlIHN0YWtpbmcgYSBncmVhdGVyIGFtb3VudCB0aGFuIGlzIGF2YWlsYWJsZSBpbiB0aGUgM3JkIFVUWE8uXG4gICAgICAvLyBXZSBleHBlY3QgdGhpcyB0ZXN0IHRvIGNvbnN1bWUgdGhlIGZ1bGwgM3JkIFVUWE8gYW5kIGEgZnJhY3Rpb24gb2YgdGhlIDJuZCBVVFhPIGFuZCBub3QgdG8gY29uc3VtZSB0aGUgU2VjcFRyYW5zZmVyYWJsZU91dHB1dFxuICAgICAgY29uc3QgYWRkcmJ1ZmYxOiBCdWZmZXJbXSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50MTogQk4gPSBuZXcgQk4oXCIyMDAwMDAwMDAwMDAwMDAwMFwiKVxuICAgICAgY29uc3QgYW1vdW50MjogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMDAwMDAwMDAwMFwiKVxuICAgICAgY29uc3QgbG9ja3RpbWUxOiBCTiA9IG5ldyBCTigwKVxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXG5cbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMTogQk4gPSBuZXcgQk4oMTYzMzgyNDAwMClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDA6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDEsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDE6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIGFtb3VudDEsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDE6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDFcbiAgICAgIClcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQxOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXG4gICAgICAgIGFtb3VudDEsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUxLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMSxcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MVxuICAgICAgKVxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja1RpbWUyOiBCTiA9IG5ldyBCTigxNzMzODI0MDAwKVxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MjogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgYW1vdW50MixcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MjogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcbiAgICAgICAgc2VjcFRyYW5zZmVyT3V0cHV0MlxuICAgICAgKVxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDI6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcbiAgICAgICAgYW1vdW50MixcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBsb2NrdGltZTEsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgc3Rha2VhYmxlTG9ja1RpbWUyLFxuICAgICAgICBwYXJzZWFibGVPdXRwdXQyXG4gICAgICApXG4gICAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiTm9kZUlELTM2Z2lGeWU1ZXB3QlRwR3FQazdiNENDWWUzaGZ5b0ZyMVwiXG4gICAgICBjb25zdCBzdGFrZUFtb3VudDogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMzAwMDAwMDAwMFwiKVxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgc3Rha2VBbW91bnQsXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXG4gICAgICApXG4gICAgICBjb25zdCBub21pbmF0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcbiAgICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IDBcbiAgICAgIGNvbnN0IHR4aWQwOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICBcImF1aE1GczI0ZmZjMkJSV0t3Nmk3UW5nY3M4alNRVVM5RWkyWHdKc1VwRXE0c1RWaWJcIlxuICAgICAgKVxuICAgICAgY29uc3QgdHhpZDE6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiMmpoeUppdDhrV0E2U3drUndLeFhlcEZuZmhzOTcxQ0VxYUdrakptaUFETThINGcyTFJcIlxuICAgICAgKVxuICAgICAgY29uc3QgdHhpZDI6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICAgIFwiMkp3RGZtM0M3cDg4ckpRMVkxeFdMa1dOTUExbnFQenFuYUMySGk0UEROS2lQblhnR3ZcIlxuICAgICAgKVxuICAgICAgY29uc3Qgb3V0cHV0aWR4MDogbnVtYmVyID0gMFxuICAgICAgY29uc3Qgb3V0cHV0aWR4MTogbnVtYmVyID0gMFxuICAgICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRBWENBc3NldElEKClcbiAgICAgIGNvbnN0IGFzc2V0SUQyOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxuICAgICAgY29uc3QgdXR4bzA6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgY29kZWNJRCxcbiAgICAgICAgdHhpZDAsXG4gICAgICAgIG91dHB1dGlkeDAsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDBcbiAgICAgIClcbiAgICAgIGNvbnN0IHV0eG8xOiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIGNvZGVjSUQsXG4gICAgICAgIHR4aWQxLFxuICAgICAgICBvdXRwdXRpZHgwLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MVxuICAgICAgKVxuICAgICAgY29uc3QgdXR4bzI6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgY29kZWNJRCxcbiAgICAgICAgdHhpZDIsXG4gICAgICAgIG91dHB1dGlkeDEsXG4gICAgICAgIGFzc2V0SUQyLFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MlxuICAgICAgKVxuICAgICAgY29uc3QgdXR4b1NldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8wKVxuICAgICAgdXR4b1NldC5hZGQodXR4bzEpXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMilcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkVmFsaWRhdG9yVHgoXG4gICAgICAgIHV0eG9TZXQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5vZGVJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBzdGFrZUFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBub21pbmF0aW9uRmVlUmF0ZVxuICAgICAgKVxuICAgICAgY29uc3QgdHggPSB0eHUxLmdldFRyYW5zYWN0aW9uKCkgYXMgQWRkVmFsaWRhdG9yVHhcbiAgICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHR4LmdldElucygpXG4gICAgICAvLyBzdGFydCB0ZXN0IGlucHV0c1xuICAgICAgLy8gY29uZmlybSBvbmx5IDEgaW5wdXRcbiAgICAgIGV4cGVjdChpbnMubGVuZ3RoKS50b0JlKDIpXG4gICAgICBjb25zdCBpbnB1dDE6IFRyYW5zZmVyYWJsZUlucHV0ID0gaW5zWzBdXG4gICAgICBjb25zdCBpbnB1dDI6IFRyYW5zZmVyYWJsZUlucHV0ID0gaW5zWzFdXG4gICAgICBjb25zdCBhaTEgPSBpbnB1dDEuZ2V0SW5wdXQoKSBhcyBBbW91bnRJbnB1dFxuICAgICAgY29uc3QgYWkyID0gaW5wdXQyLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcbiAgICAgIGNvbnN0IGFvMSA9IHN0YWtlYWJsZUxvY2tPdXQyXG4gICAgICAgIC5nZXRUcmFuc2ZlcmFibGVPdXRwdXQoKVxuICAgICAgICAuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XG4gICAgICBjb25zdCBhbzIgPSBzdGFrZWFibGVMb2NrT3V0MVxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxuICAgICAgLy8gY29uZmlybSBlYWNoIGlucHV0IGFtb3VudCBtYXRjaGVzIHRoZSBjb3JyZXNwb25kaW5nIG91dHB1dFxuICAgICAgZXhwZWN0KGFpMi5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKGFvMi5nZXRBbW91bnQoKS50b1N0cmluZygpKVxuICAgICAgZXhwZWN0KGFpMS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKGFvMS5nZXRBbW91bnQoKS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCBzbGkxID0gaW5wdXQxLmdldElucHV0KCkgYXMgU3Rha2VhYmxlTG9ja0luXG4gICAgICBjb25zdCBzbGkyID0gaW5wdXQyLmdldElucHV0KCkgYXMgU3Rha2VhYmxlTG9ja0luXG4gICAgICAvLyBjb25maXJtIGlucHV0IHN0cmFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWVrYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxuICAgICAgZXhwZWN0KHNsaTEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICAgIC8vIGV4cGVjdChzbGkyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG4gICAgICAvLyBzdG9wIHRlc3QgaW5wdXRzXG5cbiAgICAgIC8vIHN0YXJ0IHRlc3Qgb3V0cHV0c1xuICAgICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRPdXRzKClcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIG91dHB1dFxuICAgICAgZXhwZWN0KG91dHMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBjb25zdCBvdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG91dHNbMF1cbiAgICAgIGNvbnN0IGFvMyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IGFtb3VudCBtYXRjaGVzIHRoZSBvdXRwdXQgYW1vdW50IHNhbnMgdGhlIDJuZCB1dHhvIGFtb3VudCBhbmQgdGhlIHN0YWtlIGFtb3VudFxuICAgICAgZXhwZWN0KGFvMy5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBhbzIuZ2V0QW1vdW50KCkuc3ViKHN0YWtlQW1vdW50LnN1YihhbzEuZ2V0QW1vdW50KCkpKS50b1N0cmluZygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNsbyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XG4gICAgICAvLyBjb25maXJtIG91dHB1dCBzdGFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3Rha2VhYmxlbG9jayBzaW5jZSB0aGUgb3RoZXIgd2FzIGNvbnN1bWVkXG4gICAgICAvLyBleHBlY3Qoc2xvLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXG4gICAgICAvLyApXG4gICAgICAvLyBjb25maXJtIG91dHB1dCBzdGFrZWFibGVsb2NrIHRpbWUgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWtlYWJsZWxvY2sgdGltZVxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKFxuICAgICAgLy8gICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIC8vIClcblxuICAgICAgLy8gY29uZmlybSB0eCBub2RlSUQgbWF0Y2hlcyBub2RlSURcbiAgICAgIGV4cGVjdCh0eC5nZXROb2RlSURTdHJpbmcoKSkudG9FcXVhbChub2RlSUQpXG4gICAgICAvLyBjb25maXJtIHR4IHN0YXJ0dGltZSBtYXRjaGVzIHN0YXJ0dGltZVxuICAgICAgZXhwZWN0KHR4LmdldFN0YXJ0VGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3RhcnRUaW1lLnRvU3RyaW5nKCkpXG4gICAgICAvLyBjb25maXJtIHR4IGVuZHRpbWUgbWF0Y2hlcyBlbmR0aW1lXG4gICAgICBleHBlY3QodHguZ2V0RW5kVGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoZW5kVGltZS50b1N0cmluZygpKVxuICAgICAgLy8gY29uZmlybSB0eCBzdGFrZSBhbW91bnQgbWF0Y2hlcyBzdGFrZUFtb3VudFxuICAgICAgZXhwZWN0KHR4LmdldFN0YWtlQW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChzdGFrZUFtb3VudC50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCBzdGFrZU91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0U3Rha2VPdXRzKClcbiAgICAgIC8vIGNvbmZpcm0gMiBzdGFrZU91dHNcbiAgICAgIGV4cGVjdChzdGFrZU91dHMubGVuZ3RoKS50b0JlKDIpXG5cbiAgICAgIGNvbnN0IHN0YWtlT3V0MTogVHJhbnNmZXJhYmxlT3V0cHV0ID0gc3Rha2VPdXRzWzBdXG4gICAgICBjb25zdCBzdGFrZU91dDI6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1sxXVxuICAgICAgY29uc3Qgc2xvMiA9IHN0YWtlT3V0MS5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XG4gICAgICBjb25zdCBzbG8zID0gc3Rha2VPdXQyLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcbiAgICAgIC8vIGNvbmZpcm0gYm90aCBzdGFrZU91dCBzdHJha2VhYmxlbG9jayB0aW1lcyBtYXRjaGUgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XG4gICAgICAvLyBleHBlY3Qoc2xvMy5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxuICAgICAgLy8gKVxuICAgICAgZXhwZWN0KHNsbzIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcbiAgICAgIClcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5TdGFrZS5hZGQoXG4gICAgICAgIG5ldyBCTihmZWUpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxuXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKFxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pblN0YWtlLFxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pbk5vbWluYXRpb25TdGFrZVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgYWRkcnMxLFxuICAgICAgICBhZGRyczIsXG4gICAgICAgIG5vZGVJRCxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJzMyxcbiAgICAgICAgMC4xMzM0NTU2LFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRBZGRWYWxpZGF0b3JUeChcbiAgICAgICAgbmV0d29ya0lELFxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIDAuMTMzNSxcbiAgICAgICAgbmV3IEJOKDApLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcblxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcblxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcblxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcblxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcblxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXG5cbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkFkZFZhbGlkYXRvclR4XCIpXG4gICAgfSlcblxuICAgIHRlc3QoXCJidWlsZEFkZE5vbWluYXRvclR4IDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDJcblxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5TdGFrZSxcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5Ob21pbmF0aW9uU3Rha2VcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGROb21pbmF0b3JUeChcbiAgICAgICAgbHNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgdGhyZXNob2xkLFxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBsc2V0LmJ1aWxkQWRkTm9taW5hdG9yVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhc3NldElELFxuICAgICAgICBhZGRyYnVmZjMsXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgYWRkcmJ1ZmYyLFxuICAgICAgICBOb2RlSURTdHJpbmdUb0J1ZmZlcihub2RlSUQpLFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBuZXcgQk4oMCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQWRkTm9taW5hdG9yVHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FQVhDLm11bChuZXcgQk4oMjUpKVxuXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDJcblxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShPTkVBWEMubXVsKG5ldyBCTigyNSkpLCBPTkVBWEMubXVsKG5ldyBCTigyNSkpKVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICBsc2V0LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBub2RlSUQsXG4gICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgZW5kVGltZSxcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhZGRyczMsXG4gICAgICAgIDAuMTMzNDU1NixcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gbHNldC5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcmJ1ZmYzLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcbiAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICBlbmRUaW1lLFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIGFkZHJidWZmMyxcbiAgICAgICAgMC4xMzM1LFxuICAgICAgICBuZXcgQk4oMCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxuXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxuXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxuXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxuXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcblxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQWRkVmFsaWRhdG9yVHhcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggM1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FQVhDLm11bChuZXcgQk4oMykpXG5cbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxuXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKE9ORUFYQy5tdWwobmV3IEJOKDMpKSwgT05FQVhDLm11bChuZXcgQk4oMykpKVxuXG4gICAgICAvLzIgdXR4b3M7IG9uZSBsb2NrZWRzdGFrZWFibGU7IG90aGVyIHVubG9ja2VkOyBib3RoIHV0eG9zIGhhdmUgMiBheGM7IHN0YWtlIDMgQVhDXG5cbiAgICAgIGNvbnN0IGR1bW15U2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxuXG4gICAgICBjb25zdCBsb2NrZWRCYXNlT3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBPTkVBWEMubXVsKG5ldyBCTigyKSksXG4gICAgICAgIGFkZHJidWZmMSxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIDFcbiAgICAgIClcbiAgICAgIGNvbnN0IGxvY2tlZEJhc2VYT3V0OiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KGxvY2tlZEJhc2VPdXQpXG4gICAgICBjb25zdCBsb2NrZWRPdXQ6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcbiAgICAgICAgT05FQVhDLm11bChuZXcgQk4oMikpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxLFxuICAgICAgICBsb2NrdGltZSxcbiAgICAgICAgbG9ja2VkQmFzZVhPdXRcbiAgICAgIClcblxuICAgICAgY29uc3QgdHhpZExvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxuICAgICAgdHhpZExvY2tlZC5maWxsKDEpXG4gICAgICBjb25zdCB0eGlkeExvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgICB0eGlkeExvY2tlZC53cml0ZVVJbnQzMkJFKDEsIDApXG4gICAgICBjb25zdCBsdTogVVRYTyA9IG5ldyBVVFhPKDAsIHR4aWRMb2NrZWQsIHR4aWR4TG9ja2VkLCBhc3NldElELCBsb2NrZWRPdXQpXG5cbiAgICAgIGNvbnN0IHR4aWRVbmxvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxuICAgICAgdHhpZFVubG9ja2VkLmZpbGwoMilcbiAgICAgIGNvbnN0IHR4aWR4VW5sb2NrZWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgICAgdHhpZHhVbmxvY2tlZC53cml0ZVVJbnQzMkJFKDIsIDApXG4gICAgICBjb25zdCB1bmxvY2tlZE91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgT05FQVhDLm11bChuZXcgQk4oMikpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICAxXG4gICAgICApXG4gICAgICBjb25zdCB1bHU6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgMCxcbiAgICAgICAgdHhpZFVubG9ja2VkLFxuICAgICAgICB0eGlkeFVubG9ja2VkLFxuICAgICAgICBhc3NldElELFxuICAgICAgICB1bmxvY2tlZE91dFxuICAgICAgKVxuXG4gICAgICBkdW1teVNldC5hZGQodWx1KVxuICAgICAgZHVtbXlTZXQuYWRkKGx1KVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxuICAgICAgICBkdW1teVNldCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMixcbiAgICAgICAgbm9kZUlELFxuICAgICAgICBzdGFydFRpbWUsXG4gICAgICAgIGVuZFRpbWUsXG4gICAgICAgIGFtb3VudCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICAwLjEzMzQ1NTYsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcblxuICAgICAgY29uc3QgdHh1MUluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IChcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICApLmdldElucygpXG4gICAgICBjb25zdCB0eHUxT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSAoXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxuICAgICAgKS5nZXRPdXRzKClcbiAgICAgIGNvbnN0IHR4dTFTdGFrZTogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSAoXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxuICAgICAgKS5nZXRTdGFrZU91dHMoKVxuICAgICAgY29uc3QgdHh1MVRvdGFsOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IChcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XG4gICAgICApLmdldFRvdGFsT3V0cygpXG5cbiAgICAgIGxldCBpbnRvdGFsOiBCTiA9IG5ldyBCTigwKVxuXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHh1MUlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpbnRvdGFsID0gaW50b3RhbC5hZGQoXG4gICAgICAgICAgKHR4dTFJbnNbaV0uZ2V0SW5wdXQoKSBhcyBBbW91bnRJbnB1dCkuZ2V0QW1vdW50KClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBsZXQgb3V0dG90YWw6IEJOID0gbmV3IEJOKDApXG5cbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eHUxT3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBvdXR0b3RhbCA9IG91dHRvdGFsLmFkZChcbiAgICAgICAgICAodHh1MU91dHNbaV0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIGxldCBzdGFrZXRvdGFsOiBCTiA9IG5ldyBCTigwKVxuXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHh1MVN0YWtlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0YWtldG90YWwgPSBzdGFrZXRvdGFsLmFkZChcbiAgICAgICAgICAodHh1MVN0YWtlW2ldLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dCkuZ2V0QW1vdW50KClcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBsZXQgdG90YWx0b3RhbDogQk4gPSBuZXcgQk4oMClcblxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4dTFUb3RhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0b3RhbHRvdGFsID0gdG90YWx0b3RhbC5hZGQoXG4gICAgICAgICAgKHR4dTFUb3RhbFtpXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgZXhwZWN0KGludG90YWwudG9TdHJpbmcoMTApKS50b0JlKFwiNDAwMDAwMDAwMFwiKVxuICAgICAgZXhwZWN0KG91dHRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjEwMDAwMDAwMDBcIilcbiAgICAgIGV4cGVjdChzdGFrZXRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjMwMDAwMDAwMDBcIilcbiAgICAgIGV4cGVjdCh0b3RhbHRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjQwMDAwMDAwMDBcIilcbiAgICB9KVxuXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlQWxseWNoYWluVHgxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAgIHBsYXRmb3Jtdm0uc2V0Q3JlYXRpb25UeEZlZShuZXcgQk4oMTApKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYxOiBCdWZmZXJbXSA9IGFkZHJzMS5tYXAoXG4gICAgICAgIChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG4gICAgICBjb25zdCBhZGRyYnVmZjI6IEJ1ZmZlcltdID0gYWRkcnMyLm1hcChcbiAgICAgICAgKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGFkZHJidWZmMzogQnVmZmVyW10gPSBhZGRyczMubWFwKFxuICAgICAgICAoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZENyZWF0ZUFsbHljaGFpblR4KFxuICAgICAgICBzZXQsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBbYWRkcnMxWzBdXSxcbiAgICAgICAgMSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlQWxseWNoYWluVHgoXG4gICAgICAgIG5ldHdvcmtJRCxcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxuICAgICAgICBhZGRyYnVmZjEsXG4gICAgICAgIGFkZHJidWZmMixcbiAgICAgICAgW2FkZHJidWZmMVswXV0sXG4gICAgICAgIDEsXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0Q3JlYXRlQWxseWNoYWluVHhGZWUoKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgICBVbml4Tm93KClcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgICAgKVxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXG5cbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXG5cbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXG5cbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXG5cbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXG5cbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxuXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJDcmVhdGVBbGx5Y2hhaW5UeFwiKVxuICAgIH0pXG5cbiAgICB0ZXN0KFwiYnVpbGRDcmVhdGVBbGx5Y2hhaW5UeDJcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgICAgcGxhdGZvcm12bS5zZXRDcmVhdGlvblR4RmVlKG5ldyBCTigxMCkpXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcCgoYTogc3RyaW5nKSA9PlxuICAgICAgICBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxuICAgICAgKVxuICAgICAgY29uc3QgYWRkcmJ1ZmYyOiBCdWZmZXJbXSA9IGFkZHJzMi5tYXAoKGE6IHN0cmluZykgPT5cbiAgICAgICAgcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcbiAgICAgIClcbiAgICAgIGNvbnN0IGFkZHJidWZmMzogQnVmZmVyW10gPSBhZGRyczMubWFwKChhOiBzdHJpbmcpID0+XG4gICAgICAgIHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQ3JlYXRlQWxseWNoYWluVHgoXG4gICAgICAgIGxzZXQsXG4gICAgICAgIGFkZHJzMSxcbiAgICAgICAgYWRkcnMyLFxuICAgICAgICBbYWRkcnMxWzBdXSxcbiAgICAgICAgMSxcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXG4gICAgICAgIFVuaXhOb3coKVxuICAgICAgKVxuXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gbHNldC5idWlsZENyZWF0ZUFsbHljaGFpblR4KFxuICAgICAgICBuZXR3b3JrSUQsXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcbiAgICAgICAgYWRkcmJ1ZmYxLFxuICAgICAgICBhZGRyYnVmZjIsXG4gICAgICAgIFthZGRyYnVmZjFbMF1dLFxuICAgICAgICAxLFxuICAgICAgICBwbGF0Zm9ybXZtLmdldENyZWF0ZUFsbHljaGFpblR4RmVlKCksXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgICAgVW5peE5vdygpXG4gICAgICApXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgIClcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxuICAgIH0pXG4gIH0pXG5cbiAgdGVzdChcImdldFJld2FyZFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCB0eElEOiBzdHJpbmcgPSBcIjdzaWszUHI2cjFGZUxydksxb1d3RUNCUzhpSjVWUHVTaFwiXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldFJld2FyZFVUWE9zUmVzcG9uc2U+ID0gYXBpLmdldFJld2FyZFVUWE9zKHR4SUQpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7IG51bUZldGNoZWQ6IFwiMFwiLCB1dHhvczogW10sIGVuY29kaW5nOiBcImNiNThcIiB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XG4gICAgICBkYXRhOiBwYXlsb2FkXG4gICAgfVxuXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcbiAgICBjb25zdCByZXNwb25zZTogR2V0UmV3YXJkVVRYT3NSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxuXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZFtcInJlc3VsdFwiXSlcbiAgfSlcbn0pXG4iXX0=