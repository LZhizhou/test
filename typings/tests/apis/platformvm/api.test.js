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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL3BsYXRmb3Jtdm0vYXBpLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNFQUF1QztBQUN2Qyw2QkFBMEI7QUFDMUIsMERBQWdFO0FBQ2hFLG9DQUFnQztBQUNoQyxrREFBc0I7QUFDdEIsMkVBQWtEO0FBQ2xELCtDQUFnQztBQUNoQyw0REFBd0U7QUFDeEUsOERBQTREO0FBQzVELDhFQUEwRTtBQUMxRSxvRUFBZ0U7QUFDaEUsa0VBTTZDO0FBQzdDLGdFQUs0QztBQUM1Qyw4REFBeUQ7QUFDekQsOERBQW9DO0FBQ3BDLHdEQUFnRTtBQUNoRSx3RUFBNEQ7QUFDNUQsd0RBQXdEO0FBQ3hELHdFQUF5RTtBQUN6RSw0REFBcUQ7QUFDckQsb0VBS3lDO0FBaUJ6Qzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxVQUFVLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDN0QsTUFBTSxPQUFPLEdBQXVCLFNBQVMsQ0FBQTtBQUM3QyxNQUFNLGlCQUFpQixHQUFZLEtBQUssQ0FBQTtBQUV4QyxNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQW9CLEVBQUUsSUFBWSxFQUFRLEVBQUU7SUFDOUQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUNULElBQUksQ0FBQyxTQUFTLENBQ1osVUFBVSxDQUFDLFNBQVMsQ0FDbEIsTUFBTSxFQUNOLFlBQVksRUFDWixLQUFLLEVBQ0wsSUFBSSxHQUFHLGlCQUFpQixDQUN6QixDQUNGLENBQ0YsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FDWixVQUFVLENBQUMsU0FBUyxDQUNsQixNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDVCxJQUFJLEdBQUcsb0JBQW9CLENBQzVCLENBQ0YsQ0FDRixDQUFBO0tBQ0Y7QUFDSCxDQUFDLENBQUE7QUFFRCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQVMsRUFBRTtJQUNuQyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUE7SUFDOUIsTUFBTSxZQUFZLEdBQVcsMkJBQWUsQ0FBQTtJQUM1QyxNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0lBQ3ZCLE1BQU0sUUFBUSxHQUFXLE9BQU8sQ0FBQTtJQUVoQyxNQUFNLE1BQU0sR0FBVywwQ0FBMEMsQ0FBQTtJQUNqRSxNQUFNLFNBQVMsR0FBTyxJQUFBLHlCQUFPLEdBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbkQsTUFBTSxPQUFPLEdBQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRWxELE1BQU0sUUFBUSxHQUFXLFVBQVUsQ0FBQTtJQUNuQyxNQUFNLFFBQVEsR0FBVyxVQUFVLENBQUE7SUFFbkMsTUFBTSxJQUFJLEdBQVMsSUFBSSxVQUFJLENBQ3pCLEVBQUUsRUFDRixJQUFJLEVBQ0osUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLENBQ0wsQ0FBQTtJQUNELElBQUksR0FBa0IsQ0FBQTtJQUN0QixJQUFJLEtBQWEsQ0FBQTtJQUVqQixNQUFNLEtBQUssR0FDVCxPQUFPO1FBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDbkIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUN6RCxDQUNGLENBQUE7SUFDSCxNQUFNLEtBQUssR0FDVCxPQUFPO1FBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDbkIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUN6RCxDQUNGLENBQUE7SUFDSCxNQUFNLEtBQUssR0FDVCxPQUFPO1FBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQ2xCLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDYixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDbkIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUN6RCxDQUNGLENBQUE7SUFFSCxTQUFTLENBQUMsR0FBUyxFQUFFO1FBQ25CLEdBQUcsR0FBRyxJQUFJLG1CQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQzdDLEtBQUssR0FBRyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTtJQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUVGLFNBQVMsQ0FBQyxHQUFTLEVBQUU7UUFDbkIseUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNuQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUF3QixFQUFFO1FBQ3hELElBQUksU0FBUyxHQUFrQixJQUFJLG1CQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ3RFLE1BQU0sV0FBVyxHQUFXLFlBQVksQ0FBQTtRQUN4QyxNQUFNLEdBQUcsR0FBTyxTQUFTLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtRQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBd0IsRUFBRTtRQUNwRCxJQUFJLFNBQVMsR0FBa0IsSUFBSSxtQkFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUN0RSxNQUFNLFdBQVcsR0FBVyxZQUFZLENBQUE7UUFDeEMsTUFBTSxHQUFHLEdBQU8sU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7UUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUMxQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQXdCLEVBQUU7UUFDcEQsSUFBSSxNQUFNLEdBQVcsb0JBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQzdELElBQUksT0FBTyxHQUFrQixJQUFJLG1CQUFhLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ3BFLElBQUksR0FBRyxHQUFXLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDJCQUFlLENBQUMsQ0FBQTtRQUVqQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtRQUM3QixJQUFJLEdBQUcsR0FBVyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUE7UUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQywyQkFBZSxDQUFDLENBQUE7UUFFakMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25DLElBQUksR0FBRyxHQUFXLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzFCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQXdCLEVBQUU7UUFDOUMsTUFBTSxTQUFTLEdBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFMUMsTUFBTSxNQUFNLEdBQXNCLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ3ZFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixTQUFTO2FBQ1Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFhLE1BQU0sTUFBTSxDQUFBO1FBRXZDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDbEMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBd0IsRUFBRTtRQUMxQyxNQUFNLE9BQU8sR0FBVyxLQUFLLENBQUE7UUFFN0IsTUFBTSxNQUFNLEdBQTBDLEdBQUcsQ0FBQyxTQUFTLENBQ2pFLFFBQVEsRUFDUixRQUFRLEVBQ1IsS0FBSyxDQUNOLENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sT0FBTzthQUNSO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBaUMsTUFBTSxNQUFNLENBQUE7UUFFM0QsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQXdCLEVBQUU7UUFDL0MsTUFBTSxPQUFPLEdBQVcsS0FBSyxDQUFBO1FBQzdCLE1BQU0sT0FBTyxHQUNYLDZEQUE2RCxDQUFBO1FBQy9ELE1BQU0sTUFBTSxHQUEwQyxHQUFHLENBQUMsU0FBUyxDQUNqRSxRQUFRLEVBQ1IsYUFBYSxFQUNiLEtBQUssQ0FDTixDQUFBO1FBQ0QsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxDQUFDLEtBQUs7Z0JBQ1osT0FBTztnQkFDUCxJQUFJLEVBQUUsSUFBSTthQUNYO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBaUMsTUFBTSxNQUFNLENBQUE7UUFFM0QsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBd0IsRUFBRTtRQUMzQyxNQUFNLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDckMsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sZUFBZSxHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUM3QyxNQUFNLGtCQUFrQixHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNoRCxNQUFNLE9BQU8sR0FBdUI7WUFDbEMsT0FBTztZQUNQLFFBQVE7WUFDUixlQUFlO1lBQ2Ysa0JBQWtCO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsbURBQW1EO29CQUN6RCxXQUFXLEVBQUUsQ0FBQztpQkFDZjthQUNGO1NBQ0YsQ0FBQTtRQUNELE1BQU0sTUFBTSxHQUFnQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2pFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRSxPQUFPO1NBQ2hCLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ2hFLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBd0IsRUFBRTtRQUNqRCxNQUFNLE1BQU0sR0FBTyxJQUFJLGVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDOUMsTUFBTSxNQUFNLEdBQWdCLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ2xELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixNQUFNO2FBQ1A7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFPLE1BQU0sTUFBTSxDQUFBO1FBRWpDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQXdCLEVBQUU7UUFDaEQsTUFBTSxNQUFNLEdBQVcsQ0FBQyxDQUFBO1FBQ3hCLE1BQU0sV0FBVyxHQUFXLHVDQUF1QyxDQUFBO1FBQ25FLE1BQU0sTUFBTSxHQUFxQyxHQUFHLENBQUMsZUFBZSxDQUNsRSxNQUFNLEVBQ04sV0FBVyxDQUNaLENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFO29CQUNWLDBDQUEwQyxFQUFFLGdCQUFnQjtvQkFDNUQsMENBQTBDLEVBQUUsZ0JBQWdCO29CQUM1RCwwQ0FBMEMsRUFBRSxnQkFBZ0I7b0JBQzVELDBDQUEwQyxFQUFFLGdCQUFnQjtvQkFDNUQsMENBQTBDLEVBQUUsZ0JBQWdCO2lCQUM3RDthQUNGO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBNEIsTUFBTSxNQUFNLENBQUE7UUFFdEQsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDcEQsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBd0IsRUFBRTtRQUMxQyxNQUFNLE1BQU0sR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDcEMsTUFBTSxNQUFNLEdBQWdCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sTUFBTTthQUNQO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBTyxNQUFNLE1BQU0sQ0FBQTtRQUVqQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBd0IsRUFBRTtRQUM1QyxNQUFNLFFBQVEsR0FBTyxJQUFJLGVBQUUsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEQsTUFBTSxXQUFXLEdBQU8sSUFBSSxlQUFFLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sTUFBTSxHQUFpQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDOUQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLGlCQUFpQixFQUFFLGVBQWU7Z0JBQ2xDLGlCQUFpQixFQUFFLGFBQWE7YUFDakM7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUF3QixNQUFNLE1BQU0sQ0FBQTtRQUVsRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNyRCxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUN0QixDQUFBO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDckQsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FDekIsQ0FBQTtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQXdCLEVBQUU7UUFDekMsTUFBTSxNQUFNLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sYUFBYSxHQUFhO1lBQzlCLHdNQUF3TTtZQUN4TSx3TUFBd007WUFDeE0sd01BQXdNO1lBQ3hNLHdNQUF3TTtZQUN4TSx3TUFBd007U0FDek0sQ0FBQTtRQUNELE1BQU0sSUFBSSxHQUF5QixhQUFhLENBQUMsR0FBRyxDQUNsRCxDQUFDLFlBQW9CLEVBQXNCLEVBQUU7WUFDM0MsTUFBTSxrQkFBa0IsR0FBdUIsSUFBSSw0QkFBa0IsRUFBRSxDQUFBO1lBQ3ZFLElBQUksR0FBRyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDckUsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNyQyxPQUFPLGtCQUFrQixDQUFBO1FBQzNCLENBQUMsQ0FDRixDQUFBO1FBQ0QsTUFBTSxNQUFNLEdBQW9CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sTUFBTTtnQkFDTixhQUFhO2FBQ2Q7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDOUUsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUF3QixFQUFFO1FBQ3hELE1BQU0sTUFBTSxHQUFXLFFBQVEsQ0FBQTtRQUMvQixNQUFNLFdBQVcsR0FDZixtREFBbUQsQ0FBQTtRQUNyRCxNQUFNLFNBQVMsR0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzRCxNQUFNLE9BQU8sR0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUE7UUFDekIsTUFBTSxHQUFHLEdBQVcsT0FBTyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxHQUNWLEdBQUcsQ0FBQyxxQkFBcUIsQ0FDdkIsUUFBUSxFQUNSLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxDQUNQLENBQUE7UUFDSCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEdBQUc7YUFDVjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQWlDLE1BQU0sTUFBTSxDQUFBO1FBRTNELE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUF3QixFQUFFO1FBQ3RELE1BQU0sTUFBTSxHQUFXLFFBQVEsQ0FBQTtRQUMvQixNQUFNLFdBQVcsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN4RCxNQUFNLFNBQVMsR0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMzRCxNQUFNLE9BQU8sR0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLE1BQU0sR0FBVyxFQUFFLENBQUE7UUFDekIsTUFBTSxHQUFHLEdBQVcsT0FBTyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxHQUNWLEdBQUcsQ0FBQyxxQkFBcUIsQ0FDdkIsUUFBUSxFQUNSLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxDQUNQLENBQUE7UUFDSCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEdBQUc7YUFDVjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQWlDLE1BQU0sTUFBTSxDQUFBO1FBRTNELE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUF3QixFQUFFO1FBQy9DLE1BQU0sTUFBTSxHQUFXLFFBQVEsQ0FBQTtRQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNyRCxNQUFNLE9BQU8sR0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLFdBQVcsR0FBTyxJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNsQyxNQUFNLGFBQWEsR0FBVyxRQUFRLENBQUE7UUFDdEMsTUFBTSxHQUFHLEdBQVcsT0FBTyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsWUFBWSxDQUM5QyxRQUFRLEVBQ1IsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFdBQVcsRUFDWCxhQUFhLENBQ2QsQ0FBQTtRQUNELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsR0FBRzthQUNWO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBVyxNQUFNLE1BQU0sQ0FBQTtRQUVyQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzVCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBd0IsRUFBRTtRQUNqRCxNQUFNLElBQUksR0FBYTtZQUNyQjtnQkFDRSxFQUFFLEVBQUUsUUFBUTtnQkFDWixXQUFXLEVBQUUsYUFBYTtnQkFDMUIsSUFBSSxFQUFFLE1BQU07YUFDYjtTQUNGLENBQUE7UUFDRCxNQUFNLE1BQU0sR0FBMEIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQzFELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsSUFBSTthQUNsQjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQWlCLE1BQU0sTUFBTSxDQUFBO1FBRTNDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUF3QixFQUFFO1FBQ2hELE1BQU0sSUFBSSxHQUFhO1lBQ3JCO2dCQUNFLEVBQUUsRUFBRSxJQUFJO2dCQUNSLFdBQVcsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDNUIsU0FBUyxFQUFFLFdBQVc7YUFDdkI7U0FDRixDQUFBO1FBQ0QsTUFBTSxNQUFNLEdBQXlCLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN4RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFLElBQUk7YUFDakI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUF3QixFQUFFO1FBQ3ZELE1BQU0sVUFBVSxHQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUMxRCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sVUFBVTthQUNYO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBVyxNQUFNLE1BQU0sQ0FBQTtRQUVyQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUNoRCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQXdCLEVBQUU7UUFDdkQsTUFBTSxXQUFXLEdBQVcsUUFBUSxDQUFBO1FBQ3BDLE1BQU0sVUFBVSxHQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDckUsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLFVBQVU7YUFDWDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUF3QixFQUFFO1FBQ3ZELE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3hELE1BQU0sVUFBVSxHQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLE1BQU0sTUFBTSxHQUFvQixHQUFHLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDckUsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLFVBQVU7YUFDWDtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQVcsTUFBTSxNQUFNLENBQUE7UUFFckMsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBd0IsRUFBRTtRQUMxQyxNQUFNLEdBQUcsR0FBVyxnQkFBZ0IsQ0FBQTtRQUVwQyxNQUFNLE1BQU0sR0FBMEMsR0FBRyxDQUFDLFNBQVMsQ0FDakUsUUFBUSxFQUNSLFFBQVEsRUFDUixLQUFLLENBQ04sQ0FBQTtRQUNELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixVQUFVLEVBQUUsR0FBRzthQUNoQjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQWlDLE1BQU0sTUFBTSxDQUFBO1FBRTNELE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBd0IsRUFBRTtRQUMxQyxNQUFNLE1BQU0sR0FBTyxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM5QixNQUFNLEVBQUUsR0FBVyxRQUFRLENBQUE7UUFDM0IsTUFBTSxRQUFRLEdBQVcsUUFBUSxDQUFBO1FBQ2pDLE1BQU0sUUFBUSxHQUFXLFNBQVMsQ0FBQTtRQUNsQyxNQUFNLElBQUksR0FBVyxPQUFPLENBQUE7UUFDNUIsTUFBTSxNQUFNLEdBQTBDLEdBQUcsQ0FBQyxTQUFTLENBQ2pFLFFBQVEsRUFDUixRQUFRLEVBQ1IsTUFBTSxFQUNOLEVBQUUsQ0FDSCxDQUFBO1FBQ0QsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxJQUFJO2FBQ1g7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFpQyxNQUFNLE1BQU0sQ0FBQTtRQUUzRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsV0FBVyxFQUFFLEdBQXdCLEVBQUU7UUFDMUMsTUFBTSxFQUFFLEdBQVcsUUFBUSxDQUFBO1FBQzNCLE1BQU0sUUFBUSxHQUFXLFFBQVEsQ0FBQTtRQUNqQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUE7UUFDMUIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFBO1FBQ3BCLE1BQU0sTUFBTSxHQUEwQyxHQUFHLENBQUMsU0FBUyxDQUNqRSxRQUFRLEVBQ1IsUUFBUSxFQUNSLEVBQUUsRUFDRixZQUFZLENBQ2IsQ0FBQTtRQUNELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsSUFBSTthQUNYO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBaUMsTUFBTSxNQUFNLENBQUE7UUFFM0QsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQXdCLEVBQUU7UUFDakQsTUFBTSxZQUFZLEdBQVcsbUNBQW1DLENBQUE7UUFDaEUsTUFBTSxJQUFJLEdBQVcsbUNBQW1DLENBQUE7UUFDeEQsTUFBTSxJQUFJLEdBQVcsaUJBQWlCLENBQUE7UUFDdEMsTUFBTSxPQUFPLEdBQVcsYUFBYSxDQUFBO1FBQ3JDLE1BQU0sV0FBVyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3hELE1BQU0sTUFBTSxHQUEwQyxHQUFHLENBQUMsZ0JBQWdCLENBQ3hFLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxFQUNYLElBQUksRUFDSixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ1QsSUFBSSxFQUNKLE9BQU8sQ0FDUixDQUFBO1FBQ0QsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxZQUFZO2FBQ25CO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBaUMsTUFBTSxNQUFNLENBQUE7UUFFM0QsTUFBTSxDQUFDLHlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUNyQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQXdCLEVBQUU7UUFDcEQsTUFBTSxZQUFZLEdBQVcsbUNBQW1DLENBQUE7UUFDaEUsTUFBTSxNQUFNLEdBQW9CLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNyRSxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBd0IsRUFBRTtRQUM5QyxNQUFNLEtBQUssR0FBVyxhQUFhLENBQUE7UUFFbkMsTUFBTSxNQUFNLEdBQW9CLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ3JFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixPQUFPLEVBQUUsS0FBSzthQUNmO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBVyxNQUFNLE1BQU0sQ0FBQTtRQUVyQyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBd0IsRUFBRTtRQUNsRCxNQUFNLFdBQVcsR0FBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sU0FBUyxHQUFXLEVBQUUsQ0FBQTtRQUM1QixNQUFNLEdBQUcsR0FBVyxPQUFPLENBQUE7UUFDM0IsTUFBTSxNQUFNLEdBQTBDLEdBQUcsQ0FBQyxlQUFlLENBQ3ZFLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxFQUNYLFNBQVMsQ0FDVixDQUFBO1FBQ0QsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLElBQUksRUFBRSxHQUFHO2FBQ1Y7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFpQyxNQUFNLE1BQU0sQ0FBQTtRQUUzRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzVCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBd0IsRUFBRTtRQUNuRCxJQUFJLFdBQVcsQ0FBQTtRQUNmLE1BQU0sVUFBVSxHQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQzdDLE1BQU0sTUFBTSxHQUFzQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQ3ZFLE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixVQUFVO2FBQ1g7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFhLE1BQU0sTUFBTSxDQUFBO1FBRXZDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUF3QixFQUFFO1FBQ25ELE1BQU0sV0FBVyxHQUFXLFFBQVEsQ0FBQTtRQUNwQyxNQUFNLFVBQVUsR0FBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM3QyxNQUFNLE1BQU0sR0FBc0IsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUN2RSxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sVUFBVTthQUNYO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBYSxNQUFNLE1BQU0sQ0FBQTtRQUV2QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBd0IsRUFBRTtRQUNuRCxNQUFNLFdBQVcsR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNoRCxNQUFNLFVBQVUsR0FBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUM3QyxNQUFNLE1BQU0sR0FBc0IsR0FBRyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUN2RSxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sVUFBVTthQUNYO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBYSxNQUFNLE1BQU0sQ0FBQTtRQUV2QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQXdCLEVBQUU7UUFDOUMsTUFBTSxZQUFZLEdBQVcsUUFBUSxDQUFBO1FBQ3JDLE1BQU0sSUFBSSxHQUFXLE9BQU8sQ0FBQTtRQUM1QixNQUFNLE1BQU0sR0FBb0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUM3RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLElBQUk7YUFDbEI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFXLE1BQU0sTUFBTSxDQUFBO1FBRXJDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBd0IsRUFBRTtRQUM1QyxJQUFJLFdBQVcsQ0FBQTtRQUNmLE1BQU0sSUFBSSxHQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsTUFBTSxNQUFNLEdBQXNCLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDNUQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBYSxNQUFNLE1BQU0sQ0FBQTtRQUV2QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQXdCLEVBQUU7UUFDNUMsTUFBTSxXQUFXLEdBQVcsVUFBVSxDQUFBO1FBQ3RDLE1BQU0sSUFBSSxHQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsTUFBTSxNQUFNLEdBQXNCLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDNUQsTUFBTSxPQUFPLEdBQVc7WUFDdEIsTUFBTSxFQUFFO2dCQUNOLGFBQWEsRUFBRSxJQUFJO2FBQ3BCO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxNQUFNLFFBQVEsR0FBYSxNQUFNLE1BQU0sQ0FBQTtRQUV2QyxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQXdCLEVBQUU7UUFDNUMsTUFBTSxXQUFXLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDaEQsTUFBTSxJQUFJLEdBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNoQyxNQUFNLE1BQU0sR0FBc0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUM1RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sYUFBYSxFQUFFLElBQUk7YUFDcEI7U0FDRixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFhLE1BQU0sTUFBTSxDQUFBO1FBRXZDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBd0IsRUFBRTtRQUN0QyxNQUFNLElBQUksR0FDUixrRUFBa0UsQ0FBQTtRQUVwRSxNQUFNLE1BQU0sR0FBNkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RCxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sRUFBRSxFQUFFLFFBQVE7YUFDYjtTQUNGLENBQUE7UUFDRCxNQUFNLFdBQVcsR0FBaUI7WUFDaEMsSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFBO1FBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDbkMsTUFBTSxRQUFRLEdBQW9CLE1BQU0sTUFBTSxDQUFBO1FBRTlDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBd0IsRUFBRTtRQUM1QyxNQUFNLElBQUksR0FDUixrRUFBa0UsQ0FBQTtRQUVwRSxNQUFNLE1BQU0sR0FBMEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzRSxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUUsVUFBVTtTQUNuQixDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUFpQyxNQUFNLE1BQU0sQ0FBQTtRQUUzRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ25DLENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQXdCLEVBQUU7UUFDekMsVUFBVTtRQUNWLE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQzVDLGVBQU0sQ0FBQyxJQUFJLENBQ1QsOE9BQThPLEVBQzlPLEtBQUssQ0FDTixDQUNGLENBQUE7UUFDRCxNQUFNLFVBQVUsR0FBVyxRQUFRLENBQUMsVUFBVSxDQUM1QyxlQUFNLENBQUMsSUFBSSxDQUNULDhPQUE4TyxFQUM5TyxLQUFLLENBQ04sQ0FDRixDQUFBO1FBQ0QsTUFBTSxVQUFVLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FDNUMsZUFBTSxDQUFDLElBQUksQ0FDVCw4T0FBOE8sRUFDOU8sS0FBSyxDQUNOLENBQ0YsQ0FBQTtRQUVELE1BQU0sR0FBRyxHQUFZLElBQUksZUFBTyxFQUFFLENBQUE7UUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNuQixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFFdEMsTUFBTSxXQUFXLEdBQXVCLElBQUksdUNBQWtCLENBQzVELE1BQU0sRUFDTixJQUFJLEVBQ0osT0FBTyxDQUNSLENBQUE7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2hELElBQUksU0FBUyxHQUFhLEdBQUc7YUFDMUIsWUFBWSxFQUFFO2FBQ2QsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQyxJQUFJLE1BQU0sR0FBOEIsR0FBRyxDQUFDLFFBQVEsQ0FDbEQsU0FBUyxFQUNULEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFDckIsQ0FBQyxFQUNELFNBQVMsRUFDVCxXQUFXLENBQ1osQ0FBQTtRQUNELE1BQU0sT0FBTyxHQUFXO1lBQ3RCLE1BQU0sRUFBRTtnQkFDTixVQUFVLEVBQUUsQ0FBQztnQkFDYixLQUFLLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQztnQkFDM0MsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO2FBQ3ZDO1NBQ0YsQ0FBQTtRQUNELE1BQU0sV0FBVyxHQUFpQjtZQUNoQyxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUE7UUFFRCx5QkFBUyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNuQyxJQUFJLFFBQVEsR0FBWSxDQUFDLE1BQU0sTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFBO1FBRTVDLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FDL0MsQ0FBQTtRQUVELFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuRSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FDbkIsU0FBUyxFQUNULEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFDckIsQ0FBQyxFQUNELFNBQVMsRUFDVCxXQUFXLENBQ1osQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLFFBQVEsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFBO1FBRS9CLE1BQU0sQ0FBQyx5QkFBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FDL0MsQ0FBQTtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQVMsRUFBRTtRQUNsQyxJQUFJLEdBQVksQ0FBQTtRQUNoQixJQUFJLElBQWEsQ0FBQTtRQUNqQixJQUFJLE9BQWlCLENBQUE7UUFDckIsSUFBSSxPQUFpQixDQUFBO1FBQ3JCLElBQUksTUFBZ0IsQ0FBQTtRQUNwQixJQUFJLE1BQWdCLENBQUE7UUFDcEIsSUFBSSxNQUFnQixDQUFBO1FBQ3BCLElBQUksWUFBWSxHQUFhLEVBQUUsQ0FBQTtRQUMvQixJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUE7UUFDNUIsSUFBSSxLQUFhLENBQUE7UUFDakIsSUFBSSxNQUFjLENBQUE7UUFDbEIsSUFBSSxNQUEyQixDQUFBO1FBQy9CLElBQUksT0FBNkIsQ0FBQTtRQUNqQyxNQUFNLElBQUksR0FBVyxLQUFLLENBQUE7UUFDMUIsTUFBTSxPQUFPLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FDakMsSUFBQSxxQkFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUMvRCxDQUFBO1FBQ0QsSUFBSSxTQUE2QixDQUFBO1FBQ2pDLElBQUksU0FBNkIsQ0FBQTtRQUNqQyxJQUFJLFNBQTZCLENBQUE7UUFDakMsSUFBSSxXQUFXLEdBQWEsRUFBRSxDQUFBO1FBQzlCLElBQUksVUFBeUIsQ0FBQTtRQUM3QixNQUFNLEdBQUcsR0FBVyxFQUFFLENBQUE7UUFDdEIsTUFBTSxJQUFJLEdBQVcsNkNBQTZDLENBQUE7UUFDbEUsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFBO1FBQzdCLE1BQU0sWUFBWSxHQUFXLENBQUMsQ0FBQTtRQUU5QixVQUFVLENBQUMsR0FBd0IsRUFBRTtZQUNuQyxVQUFVLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtZQUNwRCxNQUFNLE1BQU0sR0FBb0IsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQzFELE1BQU0sT0FBTyxHQUFXO2dCQUN0QixNQUFNLEVBQUU7b0JBQ04sSUFBSTtvQkFDSixNQUFNO29CQUNOLE9BQU8sRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztvQkFDckMsWUFBWSxFQUFFLEdBQUcsWUFBWSxFQUFFO2lCQUNoQzthQUNGLENBQUE7WUFDRCxNQUFNLFdBQVcsR0FBaUI7Z0JBQ2hDLElBQUksRUFBRSxPQUFPO2FBQ2QsQ0FBQTtZQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ25DLE1BQU0sTUFBTSxDQUFBO1lBQ1osR0FBRyxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7WUFDbkIsSUFBSSxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7WUFDcEIsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQ3hCLE9BQU8sR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzVDLE9BQU8sR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzVDLE1BQU0sR0FBRyxFQUFFLENBQUE7WUFDWCxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ1gsTUFBTSxHQUFHLEVBQUUsQ0FBQTtZQUNYLEtBQUssR0FBRyxFQUFFLENBQUE7WUFDVixNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ1gsTUFBTSxHQUFHLEVBQUUsQ0FBQTtZQUNYLE9BQU8sR0FBRyxFQUFFLENBQUE7WUFDWixXQUFXLEdBQUcsRUFBRSxDQUFBO1lBQ2hCLE1BQU0sS0FBSyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDeEMsS0FBSyxDQUFDLEtBQUssQ0FDVCxpRkFBaUYsRUFDakYsQ0FBQyxFQUNELElBQUksRUFDSixNQUFNLENBQ1AsQ0FBQTtZQUVELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQ1QsVUFBVSxDQUFDLGlCQUFpQixDQUMxQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQzdDLENBQ0YsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUNULFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FDN0QsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUNULFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FDN0QsQ0FBQTthQUNGO1lBQ0QsTUFBTSxNQUFNLEdBQU8sa0JBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtZQUMzQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ25ELFNBQVMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwRSxNQUFNLFFBQVEsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQyxNQUFNLFNBQVMsR0FBVyxDQUFDLENBQUE7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsSUFBSSxJQUFJLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FDNUIsSUFBQSxxQkFBVSxFQUFDLFFBQVEsQ0FBQztxQkFDakIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQzlDLE1BQU0sRUFBRSxDQUNaLENBQUE7Z0JBQ0QsSUFBSSxLQUFLLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbkMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBRXpCLE1BQU0sR0FBRyxHQUF1QixJQUFJLDRCQUFrQixDQUNwRCxNQUFNLEVBQ04sWUFBWSxFQUNaLFFBQVEsRUFDUixTQUFTLENBQ1YsQ0FBQTtnQkFDRCxNQUFNLE9BQU8sR0FBdUIsSUFBSSw0QkFBa0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7Z0JBQ3hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBRXJCLE1BQU0sQ0FBQyxHQUFTLElBQUksWUFBSSxFQUFFLENBQUE7Z0JBQzFCLENBQUMsQ0FBQyxVQUFVLENBQ1YsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FDdkUsQ0FBQTtnQkFDRCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO2dCQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUViLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7Z0JBQ2xCLEtBQUssR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7Z0JBQ3hCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtnQkFFNUIsTUFBTSxLQUFLLEdBQXNCLElBQUksMEJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQzlELE1BQU0sU0FBUyxHQUFzQixJQUFJLDBCQUFpQixDQUN4RCxJQUFJLEVBQ0osS0FBSyxFQUNMLEtBQUssRUFDTCxLQUFLLENBQ04sQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ3ZCO1lBQ0QsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNuQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsQyxJQUFJLElBQUksR0FBVyxlQUFNLENBQUMsSUFBSSxDQUM1QixJQUFBLHFCQUFVLEVBQUMsUUFBUSxDQUFDO3FCQUNqQixNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDOUMsTUFBTSxFQUFFLENBQ1osQ0FBQTtnQkFDRCxJQUFJLEtBQUssR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNuQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFFekIsTUFBTSxHQUFHLEdBQXVCLElBQUksNEJBQWtCLENBQ3BELGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLFlBQVksRUFDWixRQUFRLEVBQ1IsQ0FBQyxDQUNGLENBQUE7Z0JBQ0QsTUFBTSxJQUFJLEdBQW9CLElBQUkseUJBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDdEQsTUFBTSxPQUFPLEdBQXFCLElBQUksMEJBQWdCLENBQ3BELGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLFlBQVksRUFDWixRQUFRLEVBQ1IsQ0FBQyxFQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDM0IsSUFBSSxDQUNMLENBQUE7Z0JBQ0QsTUFBTSxPQUFPLEdBQXVCLElBQUksNEJBQWtCLENBQ3hELE9BQU8sRUFDUCxPQUFPLENBQ1IsQ0FBQTtnQkFFRCxNQUFNLENBQUMsR0FBUyxJQUFJLFlBQUksRUFBRSxDQUFBO2dCQUMxQixDQUFDLENBQUMsVUFBVSxDQUNWLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQ3ZFLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNmO1lBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1lBRWhDLFNBQVMsR0FBRyxJQUFJLDRCQUFrQixDQUNoQyxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUMsRUFDWCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzdDLElBQUEseUJBQU8sR0FBRSxFQUNULENBQUMsQ0FDRixDQUFBO1lBQ0QsU0FBUyxHQUFHLElBQUksNEJBQWtCLENBQ2hDLElBQUksZUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUNYLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDN0MsSUFBQSx5QkFBTyxHQUFFLEVBQ1QsQ0FBQyxDQUNGLENBQUE7WUFDRCxTQUFTLEdBQUcsSUFBSSw0QkFBa0IsQ0FDaEMsSUFBSSxlQUFFLENBQUMsR0FBRyxDQUFDLEVBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUM3QyxJQUFBLHlCQUFPLEdBQUUsRUFDVCxDQUFDLENBQ0YsQ0FBQTtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQXdCLEVBQUU7WUFDdkMsTUFBTSxPQUFPLEdBQVcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDeEQsTUFBTSxJQUFJLEdBQWUsR0FBRyxDQUFDLFdBQVcsQ0FDdEMsU0FBUyxFQUNULFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQ2pDLElBQUksZUFBRSxDQUFDLElBQUksQ0FBQyxFQUNaLE9BQU8sRUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDckQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNyRCxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQ3JCLE9BQU8sRUFDUCxTQUFTLEVBQ1QsSUFBQSx5QkFBTyxHQUFFLEVBQ1QsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ1QsQ0FBQyxDQUNGLENBQUE7WUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQXdCLEVBQUU7WUFDOUMsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUIsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBQzNCLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxlQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUNoQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFFBQVEsR0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sV0FBVyxHQUFXLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUUvQyxNQUFNLE1BQU0sR0FBd0IsVUFBVSxDQUFDLGFBQWEsQ0FDMUQsR0FBRyxFQUNILE1BQU0sRUFDTiwyQkFBZSxFQUNmLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsRUFDOUIsSUFBQSx5QkFBTyxHQUFFLEVBQ1QsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFBO1lBQ0QsTUFBTSxPQUFPLEdBQVc7Z0JBQ3RCLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3JCO2FBQ0YsQ0FBQTtZQUNELE1BQU0sV0FBVyxHQUFpQjtnQkFDaEMsSUFBSSxFQUFFLE9BQU87YUFDZCxDQUFBO1lBRUQseUJBQVMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDbkMsTUFBTSxJQUFJLEdBQWUsTUFBTSxNQUFNLENBQUE7WUFFckMsTUFBTSxJQUFJLEdBQWUsR0FBRyxDQUFDLGFBQWEsQ0FDeEMsU0FBUyxFQUNULFFBQVEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQ2pDLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULENBQUMsUUFBUSxDQUFDLEVBQ1YsUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBZSxDQUFDLEVBQ3BDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFDckIsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLEVBQ2hDLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLEVBQ1QsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFBO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQ2hDLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxPQUFPLEdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN0RCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzNDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBRWpDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXBELE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM3QyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQXdCLEVBQUU7WUFDOUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sTUFBTSxHQUFPLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzdCLE1BQU0sSUFBSSxHQUFtQixRQUFRLENBQUE7WUFDckMsTUFBTSxJQUFJLEdBQWUsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUNyRCxHQUFHLEVBQ0gsTUFBTSxFQUNOLFFBQVEsQ0FBQyxVQUFVLENBQ2pCLG9CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDM0QsRUFDRCxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDbEIsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FDeEQsRUFDRCxNQUFNLEVBQ04sTUFBTSxFQUNOLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsRUFDOUIsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtZQUVELE1BQU0sSUFBSSxHQUFlLEdBQUcsQ0FBQyxhQUFhLENBQ3hDLFNBQVMsRUFDVCxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUNqQyxNQUFNLEVBQ04sT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULFFBQVEsQ0FBQyxVQUFVLENBQ2pCLG9CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDM0QsRUFDRCxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQ3JCLE9BQU8sRUFDUCxJQUFJLHFCQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQzNDLElBQUEseUJBQU8sR0FBRSxDQUNWLENBQUE7WUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDaEMsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFN0MsTUFBTSxJQUFJLEdBQWUsTUFBTSxVQUFVLENBQUMsYUFBYSxDQUNyRCxHQUFHLEVBQ0gsTUFBTSxFQUNOLFFBQVEsQ0FBQyxVQUFVLENBQ2pCLG9CQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FDM0QsRUFDRCxNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixJQUFJLHFCQUFXLENBQUMsYUFBYSxDQUFDLEVBQzlCLElBQUEseUJBQU8sR0FBRSxDQUNWLENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxHQUFHLENBQUMsYUFBYSxDQUN4QyxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsTUFBTSxFQUNOLE9BQU8sRUFDUCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUNyQixPQUFPLEVBQ1AsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUMzQyxJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQ2hDLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNoQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUU3QyxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMzQyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUVqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUU3QyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFPLElBQUksT0FBRSxFQUFFLENBQUE7WUFDeEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsVUFBVSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFBO1FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBbUNFO1FBQ0YsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQXdCLEVBQUU7WUFDdEQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxNQUFNLEdBQU8sb0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQUE7WUFFekUsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEMsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBRTNCLFVBQVUsQ0FBQyxXQUFXLENBQ3BCLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFDNUMsb0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQ3ZELENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxtQkFBbUIsQ0FDM0QsR0FBRyxFQUNILE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxJQUFJLHFCQUFXLENBQUMsYUFBYSxDQUFDLEVBQzlCLElBQUEseUJBQU8sR0FBRSxDQUNWLENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxHQUFHLENBQUMsbUJBQW1CLENBQzlDLFNBQVMsRUFDVCxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUNqQyxPQUFPLEVBQ1AsU0FBUyxFQUNULFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBQSxzQ0FBb0IsRUFBQyxNQUFNLENBQUMsRUFDNUIsU0FBUyxFQUNULE9BQU8sRUFDUCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ1QsT0FBTyxFQUNQLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNoQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUU3QyxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMzQyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUVqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUU3QyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFPLElBQUksT0FBRSxFQUFFLENBQUE7WUFDeEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsVUFBVSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO1FBQ25DLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBd0IsRUFBRTtZQUM3RSxvSkFBb0o7WUFDcEosc0ZBQXNGO1lBQ3RGLE1BQU0sU0FBUyxHQUFhLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN6RSxNQUFNLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sT0FBTyxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDL0MsTUFBTSxTQUFTLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0IsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBRTNCLE1BQU0sa0JBQWtCLEdBQU8sSUFBSSxlQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sa0JBQWtCLEdBQU8sSUFBSSxlQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFXLDBDQUEwQyxDQUFBO1lBQ2pFLE1BQU0sV0FBVyxHQUFPLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQTtZQUNwRSxVQUFVLENBQUMsV0FBVyxDQUNwQixXQUFXLEVBQ1gsb0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQ3ZELENBQUE7WUFDRCxNQUFNLGlCQUFpQixHQUFXLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQ3RELE1BQU0sT0FBTyxHQUFXLENBQUMsQ0FBQTtZQUN6QixNQUFNLElBQUksR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN0QyxtREFBbUQsQ0FDcEQsQ0FBQTtZQUNELE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQ3ZDLG9EQUFvRCxDQUNyRCxDQUFBO1lBQ0QsTUFBTSxVQUFVLEdBQVcsQ0FBQyxDQUFBO1lBQzVCLE1BQU0sVUFBVSxHQUFXLENBQUMsQ0FBQTtZQUM1QixNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNoRCxNQUFNLFFBQVEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNqRCxNQUFNLEtBQUssR0FBUyxJQUFJLFlBQUksQ0FDMUIsT0FBTyxFQUNQLElBQUksRUFDSixVQUFVLEVBQ1YsT0FBTyxFQUNQLGlCQUFpQixDQUNsQixDQUFBO1lBQ0QsTUFBTSxLQUFLLEdBQVMsSUFBSSxZQUFJLENBQzFCLE9BQU8sRUFDUCxLQUFLLEVBQ0wsVUFBVSxFQUNWLFFBQVEsRUFDUixpQkFBaUIsQ0FDbEIsQ0FBQTtZQUNELE1BQU0sT0FBTyxHQUFZLElBQUksZUFBTyxFQUFFLENBQUE7WUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2xCLE1BQU0sSUFBSSxHQUFlLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixDQUMzRCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLE1BQU0sRUFDTixpQkFBaUIsQ0FDbEIsQ0FBQTtZQUNELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQW9CLENBQUE7WUFDbEQsTUFBTSxHQUFHLEdBQXdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUM1QyxvQkFBb0I7WUFDcEIsdUJBQXVCO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sS0FBSyxHQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdkMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBaUIsQ0FBQTtZQUMxQyxNQUFNLEVBQUUsR0FBRyxpQkFBaUI7aUJBQ3pCLHFCQUFxQixFQUFFO2lCQUN2QixTQUFTLEVBQWtCLENBQUE7WUFDOUIsTUFBTSxHQUFHLEdBQUcsaUJBQWlCO2lCQUMxQixxQkFBcUIsRUFBRTtpQkFDdkIsU0FBUyxFQUFrQixDQUFBO1lBQzlCLDhGQUE4RjtZQUM5RixNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ3BFLG9HQUFvRztZQUNwRyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUV6RSxNQUFNLEdBQUcsR0FBb0IsS0FBSyxDQUFDLFFBQVEsRUFBcUIsQ0FBQTtZQUNoRSwwR0FBMEc7WUFDMUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUNuRCxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUNwRCxDQUFBO1lBQ0QsZ0hBQWdIO1lBQ2hILE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQ3ZELGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQ3BELENBQUE7WUFDRCxtQkFBbUI7WUFFbkIscUJBQXFCO1lBQ3JCLE1BQU0sSUFBSSxHQUF5QixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDL0Msd0JBQXdCO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzNCLE1BQU0sTUFBTSxHQUF1QixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDMUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBa0IsQ0FBQTtZQUM5QyxxSEFBcUg7WUFDckgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FDeEMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDM0MsQ0FBQTtZQUNELHFHQUFxRztZQUNyRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUUxRSxNQUFNLEdBQUcsR0FBcUIsTUFBTSxDQUFDLFNBQVMsRUFBc0IsQ0FBQTtZQUNwRSwyR0FBMkc7WUFDM0csTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUNuRCxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUNwRCxDQUFBO1lBQ0QsaUhBQWlIO1lBQ2pILE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQ3ZELGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQ3BELENBQUE7WUFFRCxtQ0FBbUM7WUFDbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1Qyx5Q0FBeUM7WUFDekMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNsRSxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUM5RCw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUV0RSxNQUFNLFNBQVMsR0FBeUIsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3pELDBCQUEwQjtZQUMxQixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUVoQyxNQUFNLFFBQVEsR0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2pELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQXNCLENBQUE7WUFDckQsNkdBQTZHO1lBQzdHLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FDcEQsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FDcEQsQ0FBQTtZQUNELG1IQUFtSDtZQUNuSCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUN4RCxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUNwRCxDQUFBO1lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO1lBQ2hCLG9EQUFvRDtZQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ3JFLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBd0IsRUFBRTtZQUM3RSxvQkFBb0I7WUFDcEIsb0pBQW9KO1lBQ3BKLDhFQUE4RTtZQUM5RSxvRkFBb0Y7WUFDcEYsTUFBTSxTQUFTLEdBQWEsTUFBTSxDQUFDLEdBQUcsQ0FDcEMsQ0FBQyxDQUFDLEVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQzFDLENBQUE7WUFDRCxNQUFNLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sT0FBTyxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDL0MsTUFBTSxTQUFTLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0IsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBRTNCLE1BQU0sa0JBQWtCLEdBQU8sSUFBSSxlQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sa0JBQWtCLEdBQU8sSUFBSSxlQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFXLDBDQUEwQyxDQUFBO1lBQ2pFLE1BQU0sV0FBVyxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDbkQsVUFBVSxDQUFDLFdBQVcsQ0FDcEIsV0FBVyxFQUNYLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixDQUN2RCxDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBVyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUN0RCxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUE7WUFDekIsTUFBTSxJQUFJLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FDdEMsbURBQW1ELENBQ3BELENBQUE7WUFDRCxNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN2QyxvREFBb0QsQ0FDckQsQ0FBQTtZQUNELE1BQU0sVUFBVSxHQUFXLENBQUMsQ0FBQTtZQUM1QixNQUFNLFVBQVUsR0FBVyxDQUFDLENBQUE7WUFDNUIsTUFBTSxPQUFPLEdBQVcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDeEQsTUFBTSxRQUFRLEdBQVcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDekQsTUFBTSxLQUFLLEdBQVMsSUFBSSxZQUFJLENBQzFCLE9BQU8sRUFDUCxJQUFJLEVBQ0osVUFBVSxFQUNWLE9BQU8sRUFDUCxpQkFBaUIsQ0FDbEIsQ0FBQTtZQUNELE1BQU0sS0FBSyxHQUFTLElBQUksWUFBSSxDQUMxQixPQUFPLEVBQ1AsS0FBSyxFQUNMLFVBQVUsRUFDVixRQUFRLEVBQ1IsaUJBQWlCLENBQ2xCLENBQUE7WUFDRCxNQUFNLE9BQU8sR0FBWSxJQUFJLGVBQU8sRUFBRSxDQUFBO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxtQkFBbUIsQ0FDM0QsT0FBTyxFQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLFdBQVcsRUFDWCxNQUFNLEVBQ04saUJBQWlCLENBQ2xCLENBQUE7WUFDRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFvQixDQUFBO1lBQ2xELE1BQU0sR0FBRyxHQUF3QixFQUFFLENBQUMsTUFBTSxFQUFFLENBQUE7WUFDNUMsb0JBQW9CO1lBQ3BCLHVCQUF1QjtZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxQixNQUFNLE1BQU0sR0FBc0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3hDLE1BQU0sTUFBTSxHQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBaUIsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFpQixDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFHLGlCQUFpQjtpQkFDMUIscUJBQXFCLEVBQUU7aUJBQ3ZCLFNBQVMsRUFBa0IsQ0FBQTtZQUM5QixNQUFNLEdBQUcsR0FBRyxpQkFBaUI7aUJBQzFCLHFCQUFxQixFQUFFO2lCQUN2QixTQUFTLEVBQWtCLENBQUE7WUFDOUIsNkRBQTZEO1lBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDdEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUV0RSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFxQixDQUFBO1lBQ2pELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQXFCLENBQUE7WUFDakQsMkdBQTJHO1lBQzNHLDBEQUEwRDtZQUMxRCx3REFBd0Q7WUFDeEQsSUFBSTtZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FDcEQsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FDcEQsQ0FBQTtZQUNELG1CQUFtQjtZQUVuQixxQkFBcUI7WUFDckIsTUFBTSxJQUFJLEdBQXlCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUMvQyx3QkFBd0I7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0IsTUFBTSxNQUFNLEdBQXVCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMxQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFrQixDQUFBO1lBQzlDLGdHQUFnRztZQUNoRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUN4QyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDakUsQ0FBQTtZQUVELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQXNCLENBQUE7WUFDbEQsZ0hBQWdIO1lBQ2hILHlEQUF5RDtZQUN6RCx3REFBd0Q7WUFDeEQsSUFBSTtZQUNKLCtGQUErRjtZQUMvRiw2REFBNkQ7WUFDN0Qsd0RBQXdEO1lBQ3hELElBQUk7WUFFSixtQ0FBbUM7WUFDbkMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1Qyx5Q0FBeUM7WUFDekMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNsRSxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUM5RCw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUV0RSxJQUFJLFNBQVMsR0FBeUIsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3ZELHNCQUFzQjtZQUN0QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUVoQyxJQUFJLFNBQVMsR0FBdUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hELElBQUksU0FBUyxHQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLFNBQVMsRUFBc0IsQ0FBQTtZQUNwRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFzQixDQUFBO1lBQ3BELDZFQUE2RTtZQUM3RSwwREFBMEQ7WUFDMUQsd0RBQXdEO1lBQ3hELElBQUk7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQ3BELGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQ3BELENBQUE7UUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQXdCLEVBQUU7WUFDN0Usb0JBQW9CO1lBQ3BCLGNBQWM7WUFDZCx1Q0FBdUM7WUFDdkMsc0VBQXNFO1lBQ3RFLHNFQUFzRTtZQUN0RSxFQUFFO1lBQ0YsOEVBQThFO1lBQzlFLGdJQUFnSTtZQUNoSSxNQUFNLFNBQVMsR0FBYSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDekUsTUFBTSxPQUFPLEdBQU8sSUFBSSxlQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUMvQyxNQUFNLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sU0FBUyxHQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sU0FBUyxHQUFXLENBQUMsQ0FBQTtZQUUzQixNQUFNLGtCQUFrQixHQUFPLElBQUksZUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ2pELE1BQU0sbUJBQW1CLEdBQXVCLElBQUksNEJBQWtCLENBQ3BFLE9BQU8sRUFDUCxTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsQ0FDVixDQUFBO1lBQ0QsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sa0JBQWtCLEdBQU8sSUFBSSxlQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDakQsTUFBTSxtQkFBbUIsR0FBdUIsSUFBSSw0QkFBa0IsQ0FDcEUsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFvQixJQUFJLHlCQUFlLENBQzNELG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBcUIsSUFBSSwwQkFBZ0IsQ0FDOUQsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULGtCQUFrQixFQUNsQixnQkFBZ0IsQ0FDakIsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFXLDBDQUEwQyxDQUFBO1lBQ2pFLE1BQU0sV0FBVyxHQUFPLElBQUksZUFBRSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDbkQsVUFBVSxDQUFDLFdBQVcsQ0FDcEIsV0FBVyxFQUNYLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixDQUN2RCxDQUFBO1lBQ0QsTUFBTSxpQkFBaUIsR0FBVyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUN0RCxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUE7WUFDekIsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLFVBQVUsQ0FDdkMsbURBQW1ELENBQ3BELENBQUE7WUFDRCxNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN2QyxvREFBb0QsQ0FDckQsQ0FBQTtZQUNELE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQ3ZDLG9EQUFvRCxDQUNyRCxDQUFBO1lBQ0QsTUFBTSxVQUFVLEdBQVcsQ0FBQyxDQUFBO1lBQzVCLE1BQU0sVUFBVSxHQUFXLENBQUMsQ0FBQTtZQUM1QixNQUFNLE9BQU8sR0FBVyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUN4RCxNQUFNLFFBQVEsR0FBVyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUN6RCxNQUFNLEtBQUssR0FBUyxJQUFJLFlBQUksQ0FDMUIsT0FBTyxFQUNQLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxFQUNQLG1CQUFtQixDQUNwQixDQUFBO1lBQ0QsTUFBTSxLQUFLLEdBQVMsSUFBSSxZQUFJLENBQzFCLE9BQU8sRUFDUCxLQUFLLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFDUCxpQkFBaUIsQ0FDbEIsQ0FBQTtZQUNELE1BQU0sS0FBSyxHQUFTLElBQUksWUFBSSxDQUMxQixPQUFPLEVBQ1AsS0FBSyxFQUNMLFVBQVUsRUFDVixRQUFRLEVBQ1IsaUJBQWlCLENBQ2xCLENBQUE7WUFDRCxNQUFNLE9BQU8sR0FBWSxJQUFJLGVBQU8sRUFBRSxDQUFBO1lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2xCLE1BQU0sSUFBSSxHQUFlLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixDQUMzRCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxPQUFPLEVBQ1AsV0FBVyxFQUNYLE1BQU0sRUFDTixpQkFBaUIsQ0FDbEIsQ0FBQTtZQUNELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQW9CLENBQUE7WUFDbEQsTUFBTSxHQUFHLEdBQXdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUM1QyxvQkFBb0I7WUFDcEIsdUJBQXVCO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzFCLE1BQU0sTUFBTSxHQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEMsTUFBTSxNQUFNLEdBQXNCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN4QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFpQixDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQWlCLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQUcsaUJBQWlCO2lCQUMxQixxQkFBcUIsRUFBRTtpQkFDdkIsU0FBUyxFQUFrQixDQUFBO1lBQzlCLE1BQU0sR0FBRyxHQUFHLGlCQUFpQjtpQkFDMUIscUJBQXFCLEVBQUU7aUJBQ3ZCLFNBQVMsRUFBa0IsQ0FBQTtZQUM5Qiw2REFBNkQ7WUFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN0RSxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRXRFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQXFCLENBQUE7WUFDakQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBcUIsQ0FBQTtZQUNqRCwyR0FBMkc7WUFDM0csTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUNwRCxpQkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUNwRCxDQUFBO1lBQ0QsMERBQTBEO1lBQzFELHdEQUF3RDtZQUN4RCxJQUFJO1lBQ0osbUJBQW1CO1lBRW5CLHFCQUFxQjtZQUNyQixNQUFNLElBQUksR0FBeUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQy9DLHdCQUF3QjtZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQixNQUFNLE1BQU0sR0FBdUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQWtCLENBQUE7WUFDOUMsZ0dBQWdHO1lBQ2hHLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQ3hDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUNqRSxDQUFBO1lBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBc0IsQ0FBQTtZQUNsRCxnSEFBZ0g7WUFDaEgseURBQXlEO1lBQ3pELHdEQUF3RDtZQUN4RCxJQUFJO1lBQ0osK0ZBQStGO1lBQy9GLDZEQUE2RDtZQUM3RCx3REFBd0Q7WUFDeEQsSUFBSTtZQUVKLG1DQUFtQztZQUNuQyxNQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLHlDQUF5QztZQUN6QyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2xFLHFDQUFxQztZQUNyQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzlELDhDQUE4QztZQUM5QyxNQUFNLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRXRFLE1BQU0sU0FBUyxHQUF5QixFQUFFLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDekQsc0JBQXNCO1lBQ3RCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRWhDLE1BQU0sU0FBUyxHQUF1QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxTQUFTLEdBQXVCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFzQixDQUFBO1lBQ3RELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQXNCLENBQUE7WUFDdEQsNkVBQTZFO1lBQzdFLDBEQUEwRDtZQUMxRCx3REFBd0Q7WUFDeEQsSUFBSTtZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FDcEQsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FDcEQsQ0FBQTtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBd0IsRUFBRTtZQUN0RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLE1BQU0sR0FBTyxvQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUNqRSxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FDWixDQUFBO1lBRUQsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEMsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBRTNCLFVBQVUsQ0FBQyxXQUFXLENBQ3BCLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFDNUMsb0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLENBQ3ZELENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxtQkFBbUIsQ0FDM0QsR0FBRyxFQUNILE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixTQUFTLEVBQ1QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsR0FBRyxDQUFDLG1CQUFtQixDQUM5QyxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUEsc0NBQW9CLEVBQUMsTUFBTSxDQUFDLEVBQzVCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDVCxPQUFPLEVBQ1AsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUMzQyxJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQ2hDLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxPQUFPLEdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN0RCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzNDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBRWpDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXBELE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM3QyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxVQUFVLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUF3QixFQUFFO1lBQ3RELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sTUFBTSxHQUFPLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixDQUFBO1lBQ3pFLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2xDLE1BQU0sU0FBUyxHQUFXLENBQUMsQ0FBQTtZQUUzQixVQUFVLENBQUMsV0FBVyxDQUNwQixvQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQzVDLG9CQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtCQUFrQixDQUN2RCxDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsTUFBTSxVQUFVLENBQUMsbUJBQW1CLENBQzNELElBQUksRUFDSixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULE9BQU8sRUFDUCxNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDLG1CQUFtQixDQUMvQyxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUEsc0NBQW9CLEVBQUMsTUFBTSxDQUFDLEVBQzVCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxFQUNULE9BQU8sRUFDUCxJQUFJLHFCQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQzNDLElBQUEseUJBQU8sR0FBRSxDQUNWLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDaEMsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFN0MsTUFBTSxHQUFHLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNoRCxNQUFNLE9BQU8sR0FBVyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3RELE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDM0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUU3QyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFPLElBQUksT0FBRSxFQUFFLENBQUE7WUFDeEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFFakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsTUFBTSxHQUFHLEdBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUNoRCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRW5DLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXBELFVBQVUsQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtRQUNuQyxDQUFDLENBQUEsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQXdCLEVBQUU7WUFDdEQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxNQUFNLEdBQU8sa0JBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUV6QyxNQUFNLFFBQVEsR0FBTyxJQUFJLGVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQyxNQUFNLFNBQVMsR0FBVyxDQUFDLENBQUE7WUFFM0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUV0RSxNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxtQkFBbUIsQ0FDM0QsSUFBSSxFQUNKLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsT0FBTyxFQUNQLE1BQU0sRUFDTixNQUFNLEVBQ04sU0FBUyxFQUNULFFBQVEsRUFDUixTQUFTLEVBQ1QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDLG1CQUFtQixDQUMvQyxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsT0FBTyxFQUNQLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUEsc0NBQW9CLEVBQUMsTUFBTSxDQUFDLEVBQzVCLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsRUFDVCxPQUFPLEVBQ1AsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUMzQyxJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQ2hDLENBQUE7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRTdDLE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxPQUFPLEdBQVcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN0RCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzNDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFN0MsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM1QyxNQUFNLEdBQUcsR0FBTyxJQUFJLE9BQUUsRUFBRSxDQUFBO1lBQ3hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBRWpDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXBELE1BQU0sR0FBRyxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDaEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUM3QyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVuQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxVQUFVLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUF3QixFQUFFO1lBQ3RELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMvRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sTUFBTSxHQUFPLGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFeEMsTUFBTSxRQUFRLEdBQU8sSUFBSSxlQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEMsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1lBRTNCLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0JBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFcEUsa0ZBQWtGO1lBRWxGLE1BQU0sUUFBUSxHQUFZLElBQUksZUFBTyxFQUFFLENBQUE7WUFFdkMsTUFBTSxhQUFhLEdBQXVCLElBQUksNEJBQWtCLENBQzlELGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLFNBQVMsRUFDVCxRQUFRLEVBQ1IsQ0FBQyxDQUNGLENBQUE7WUFDRCxNQUFNLGNBQWMsR0FBb0IsSUFBSSx5QkFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQzFFLE1BQU0sU0FBUyxHQUFxQixJQUFJLDBCQUFnQixDQUN0RCxrQkFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNyQixTQUFTLEVBQ1QsUUFBUSxFQUNSLENBQUMsRUFDRCxRQUFRLEVBQ1IsY0FBYyxDQUNmLENBQUE7WUFFRCxNQUFNLFVBQVUsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzNDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEIsTUFBTSxXQUFXLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUMzQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUMvQixNQUFNLEVBQUUsR0FBUyxJQUFJLFlBQUksQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7WUFFekUsTUFBTSxZQUFZLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM3QyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLE1BQU0sYUFBYSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDN0MsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDakMsTUFBTSxXQUFXLEdBQXVCLElBQUksNEJBQWtCLENBQzVELGtCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3JCLFNBQVMsRUFDVCxRQUFRLEVBQ1IsQ0FBQyxDQUNGLENBQUE7WUFDRCxNQUFNLEdBQUcsR0FBUyxJQUFJLFlBQUksQ0FDeEIsQ0FBQyxFQUNELFlBQVksRUFDWixhQUFhLEVBQ2IsT0FBTyxFQUNQLFdBQVcsQ0FDWixDQUFBO1lBRUQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNqQixRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBRWhCLE1BQU0sSUFBSSxHQUFlLE1BQU0sVUFBVSxDQUFDLG1CQUFtQixDQUMzRCxRQUFRLEVBQ1IsTUFBTSxFQUNOLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1QsUUFBUSxFQUNSLFNBQVMsRUFDVCxJQUFJLHFCQUFXLENBQUMsYUFBYSxDQUFDLEVBQzlCLElBQUEseUJBQU8sR0FBRSxDQUNWLENBQUE7WUFFRCxNQUFNLE9BQU8sR0FDWCxJQUFJLENBQUMsY0FBYyxFQUNwQixDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQ1YsTUFBTSxRQUFRLEdBQ1osSUFBSSxDQUFDLGNBQWMsRUFDcEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNYLE1BQU0sU0FBUyxHQUNiLElBQUksQ0FBQyxjQUFjLEVBQ3BCLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDaEIsTUFBTSxTQUFTLEdBQ2IsSUFBSSxDQUFDLGNBQWMsRUFDcEIsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUVoQixJQUFJLE9BQU8sR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUUzQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDL0MsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQ2xCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQWtCLENBQUMsU0FBUyxFQUFFLENBQ25ELENBQUE7YUFDRjtZQUVELElBQUksUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRTVCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FDcEIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FDdEQsQ0FBQTthQUNGO1lBRUQsSUFBSSxVQUFVLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFOUIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2pELFVBQVUsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUN4QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFtQixDQUFDLFNBQVMsRUFBRSxDQUN2RCxDQUFBO2FBQ0Y7WUFFRCxJQUFJLFVBQVUsR0FBTyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUU5QixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQ3hCLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQW1CLENBQUMsU0FBUyxFQUFFLENBQ3ZELENBQUE7YUFDRjtZQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBd0IsRUFBRTtZQUN4RCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN2QyxNQUFNLFNBQVMsR0FBYSxNQUFNLENBQUMsR0FBRyxDQUNwQyxDQUFDLENBQUMsRUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FDMUMsQ0FBQTtZQUNELE1BQU0sU0FBUyxHQUFhLE1BQU0sQ0FBQyxHQUFHLENBQ3BDLENBQUMsQ0FBQyxFQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUMxQyxDQUFBO1lBQ0QsTUFBTSxTQUFTLEdBQWEsTUFBTSxDQUFDLEdBQUcsQ0FDcEMsQ0FBQyxDQUFDLEVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQzFDLENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxzQkFBc0IsQ0FDOUQsR0FBRyxFQUNILE1BQU0sRUFDTixNQUFNLEVBQ04sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWCxDQUFDLEVBQ0QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsR0FBRyxDQUFDLHNCQUFzQixDQUNqRCxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsU0FBUyxFQUNULFNBQVMsRUFDVCxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNkLENBQUMsRUFDRCxVQUFVLENBQUMsdUJBQXVCLEVBQUUsRUFDcEMsT0FBTyxFQUNQLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNoQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUU3QyxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdEQsTUFBTSxNQUFNLEdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMzQyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtZQUN4QixHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUVqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVwRCxNQUFNLEdBQUcsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUU3QyxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzVDLE1BQU0sR0FBRyxHQUFPLElBQUksT0FBRSxFQUFFLENBQUE7WUFDeEIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFFcEQsVUFBVSxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3RDLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBd0IsRUFBRTtZQUN4RCxVQUFVLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN2QyxNQUFNLFNBQVMsR0FBYSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FDbkQsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FDM0IsQ0FBQTtZQUNELE1BQU0sU0FBUyxHQUFhLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUNuRCxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUMzQixDQUFBO1lBQ0QsTUFBTSxTQUFTLEdBQWEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQ25ELFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQzNCLENBQUE7WUFFRCxNQUFNLElBQUksR0FBZSxNQUFNLFVBQVUsQ0FBQyxzQkFBc0IsQ0FDOUQsSUFBSSxFQUNKLE1BQU0sRUFDTixNQUFNLEVBQ04sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDWCxDQUFDLEVBQ0QsSUFBSSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFBLHlCQUFPLEdBQUUsQ0FDVixDQUFBO1lBRUQsTUFBTSxJQUFJLEdBQWUsSUFBSSxDQUFDLHNCQUFzQixDQUNsRCxTQUFTLEVBQ1QsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFDakMsU0FBUyxFQUNULFNBQVMsRUFDVCxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNkLENBQUMsRUFDRCxVQUFVLENBQUMsdUJBQXVCLEVBQUUsRUFDcEMsT0FBTyxFQUNQLElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNoQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUMvQyxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBd0IsRUFBRTtRQUMvQyxNQUFNLElBQUksR0FBVyxtQ0FBbUMsQ0FBQTtRQUN4RCxNQUFNLE1BQU0sR0FBb0MsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RSxNQUFNLE9BQU8sR0FBVztZQUN0QixNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtTQUN6RCxDQUFBO1FBQ0QsTUFBTSxXQUFXLEdBQWlCO1lBQ2hDLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUVELHlCQUFTLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ25DLE1BQU0sUUFBUSxHQUEyQixNQUFNLE1BQU0sQ0FBQTtRQUVyRCxNQUFNLENBQUMseUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBQzFDLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb2NrQXhpb3MgZnJvbSBcImplc3QtbW9jay1heGlvc1wiXHJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwic3JjXCJcclxuaW1wb3J0IHsgUGxhdGZvcm1WTUFQSSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2FwaVwiXHJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0ICogYXMgYmVjaDMyIGZyb20gXCJiZWNoMzJcIlxyXG5pbXBvcnQgeyBEZWZhdWx0cywgUGxhdGZvcm1DaGFpbklEIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxyXG5pbXBvcnQgeyBVVFhPU2V0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vdXR4b3NcIlxyXG5pbXBvcnQgeyBQZXJzaXN0YW5jZU9wdGlvbnMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BlcnNpc3RlbmNlb3B0aW9uc1wiXHJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0va2V5Y2hhaW5cIlxyXG5pbXBvcnQge1xyXG4gIFNFQ1BUcmFuc2Zlck91dHB1dCxcclxuICBUcmFuc2ZlcmFibGVPdXRwdXQsXHJcbiAgQW1vdW50T3V0cHV0LFxyXG4gIFBhcnNlYWJsZU91dHB1dCxcclxuICBTdGFrZWFibGVMb2NrT3V0XHJcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vb3V0cHV0c1wiXHJcbmltcG9ydCB7XHJcbiAgVHJhbnNmZXJhYmxlSW5wdXQsXHJcbiAgU0VDUFRyYW5zZmVySW5wdXQsXHJcbiAgQW1vdW50SW5wdXQsXHJcbiAgU3Rha2VhYmxlTG9ja0luXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW5wdXRzXCJcclxuaW1wb3J0IHsgVVRYTyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3V0eG9zXCJcclxuaW1wb3J0IGNyZWF0ZUhhc2ggZnJvbSBcImNyZWF0ZS1oYXNoXCJcclxuaW1wb3J0IHsgVW5zaWduZWRUeCwgVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS90eFwiXHJcbmltcG9ydCB7IFVuaXhOb3cgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IFVURjhQYXlsb2FkIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9wYXlsb2FkXCJcclxuaW1wb3J0IHsgTm9kZUlEU3RyaW5nVG9CdWZmZXIgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IE9ORUFYQyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcclxuaW1wb3J0IHtcclxuICBTZXJpYWxpemFibGUsXHJcbiAgU2VyaWFsaXphdGlvbixcclxuICBTZXJpYWxpemVkRW5jb2RpbmcsXHJcbiAgU2VyaWFsaXplZFR5cGVcclxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5pbXBvcnQgeyBBZGRWYWxpZGF0b3JUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3ZhbGlkYXRpb250eFwiXHJcbmltcG9ydCB7XHJcbiAgQmxvY2tjaGFpbixcclxuICBHZXRNaW5TdGFrZVJlc3BvbnNlLFxyXG4gIEdldFJld2FyZFVUWE9zUmVzcG9uc2UsXHJcbiAgQWxseWNoYWluLFxyXG4gIEdldFR4U3RhdHVzUmVzcG9uc2UsXHJcbiAgR2V0VmFsaWRhdG9yc0F0UmVzcG9uc2VcclxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9pbnRlcmZhY2VzXCJcclxuaW1wb3J0IHsgRXJyb3JSZXNwb25zZU9iamVjdCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvZXJyb3JzXCJcclxuaW1wb3J0IHsgSHR0cFJlc3BvbnNlIH0gZnJvbSBcImplc3QtbW9jay1heGlvcy9kaXN0L2xpYi9tb2NrLWF4aW9zLXR5cGVzXCJcclxuaW1wb3J0IHtcclxuICBHZXRCYWxhbmNlUmVzcG9uc2UsXHJcbiAgR2V0VVRYT3NSZXNwb25zZVxyXG59IGZyb20gXCJzcmMvYXBpcy9wbGF0Zm9ybXZtL2ludGVyZmFjZXNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXplcjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBkaXNwbGF5OiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImRpc3BsYXlcIlxyXG5jb25zdCBkdW1wU2VyaWFsaXphdGlvbjogYm9vbGVhbiA9IGZhbHNlXHJcblxyXG5jb25zdCBzZXJpYWx6ZWl0ID0gKGFUaGluZzogU2VyaWFsaXphYmxlLCBuYW1lOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICBpZiAoZHVtcFNlcmlhbGl6YXRpb24pIHtcclxuICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICBzZXJpYWxpemVyLnNlcmlhbGl6ZShcclxuICAgICAgICAgIGFUaGluZyxcclxuICAgICAgICAgIFwicGxhdGZvcm12bVwiLFxyXG4gICAgICAgICAgXCJoZXhcIixcclxuICAgICAgICAgIG5hbWUgKyBcIiAtLSBIZXggRW5jb2RlZFwiXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICApXHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgSlNPTi5zdHJpbmdpZnkoXHJcbiAgICAgICAgc2VyaWFsaXplci5zZXJpYWxpemUoXHJcbiAgICAgICAgICBhVGhpbmcsXHJcbiAgICAgICAgICBcInBsYXRmb3Jtdm1cIixcclxuICAgICAgICAgIFwiZGlzcGxheVwiLFxyXG4gICAgICAgICAgbmFtZSArIFwiIC0tIEh1bWFuLVJlYWRhYmxlXCJcclxuICAgICAgICApXHJcbiAgICAgIClcclxuICAgIClcclxuICB9XHJcbn1cclxuXHJcbmRlc2NyaWJlKFwiUGxhdGZvcm1WTUFQSVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSAxMzM3XHJcbiAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBQbGF0Zm9ybUNoYWluSURcclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxyXG4gIGNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXHJcbiAgY29uc3QgcHJvdG9jb2w6IHN0cmluZyA9IFwiaHR0cHNcIlxyXG5cclxuICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiTm9kZUlELUI2RDR2MVZ0UFlMYmlVdllYdFc0UHg4b0U5aW1DMnZHV1wiXHJcbiAgY29uc3Qgc3RhcnRUaW1lOiBCTiA9IFVuaXhOb3coKS5hZGQobmV3IEJOKDYwICogNSkpXHJcbiAgY29uc3QgZW5kVGltZTogQk4gPSBzdGFydFRpbWUuYWRkKG5ldyBCTigxMjA5NjAwKSlcclxuXHJcbiAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IFwiQXhpYUNvaW5cIlxyXG4gIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSBcInBhc3N3b3JkXCJcclxuXHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKFxyXG4gICAgaXAsXHJcbiAgICBwb3J0LFxyXG4gICAgcHJvdG9jb2wsXHJcbiAgICBuZXR3b3JrSUQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB1bmRlZmluZWQsXHJcbiAgICB0cnVlXHJcbiAgKVxyXG4gIGxldCBhcGk6IFBsYXRmb3JtVk1BUElcclxuICBsZXQgYWxpYXM6IHN0cmluZ1xyXG5cclxuICBjb25zdCBhZGRyQTogc3RyaW5nID1cclxuICAgIFwiQ29yZS1cIiArXHJcbiAgICBiZWNoMzIuYmVjaDMyLmVuY29kZShcclxuICAgICAgYXhpYS5nZXRIUlAoKSxcclxuICAgICAgYmVjaDMyLmJlY2gzMi50b1dvcmRzKFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJCNkQ0djFWdFBZTGJpVXZZWHRXNFB4OG9FOWltQzJ2R1dcIilcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIGNvbnN0IGFkZHJCOiBzdHJpbmcgPVxyXG4gICAgXCJDb3JlLVwiICtcclxuICAgIGJlY2gzMi5iZWNoMzIuZW5jb2RlKFxyXG4gICAgICBheGlhLmdldEhSUCgpLFxyXG4gICAgICBiZWNoMzIuYmVjaDMyLnRvV29yZHMoXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIlA1d2RSdVplYUR0MjhlSE1QNVMzdzlaZG9CZm83d3V6RlwiKVxyXG4gICAgICApXHJcbiAgICApXHJcbiAgY29uc3QgYWRkckM6IHN0cmluZyA9XHJcbiAgICBcIkNvcmUtXCIgK1xyXG4gICAgYmVjaDMyLmJlY2gzMi5lbmNvZGUoXHJcbiAgICAgIGF4aWEuZ2V0SFJQKCksXHJcbiAgICAgIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiNlkza3lzakY5am5IbllrZFM5eUdBdW9IeWFlMmVObWVWXCIpXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgYmVmb3JlQWxsKCgpOiB2b2lkID0+IHtcclxuICAgIGFwaSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Db3JlXCIpXHJcbiAgICBhbGlhcyA9IGFwaS5nZXRCbG9ja2NoYWluQWxpYXMoKVxyXG4gIH0pXHJcblxyXG4gIGFmdGVyRWFjaCgoKTogdm9pZCA9PiB7XHJcbiAgICBtb2NrQXhpb3MucmVzZXQoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBsZXQgY29yZWNoYWluOiBQbGF0Zm9ybVZNQVBJID0gbmV3IFBsYXRmb3JtVk1BUEkoYXhpYSwgXCIvZXh0L2JjL0NvcmVcIilcclxuICAgIGNvbnN0IGZlZVJlc3BvbnNlOiBzdHJpbmcgPSBcIjEwMDAwMDAwMDBcIlxyXG4gICAgY29uc3QgZmVlOiBCTiA9IGNvcmVjaGFpbi5nZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZSgpXHJcbiAgICBleHBlY3QoZmVlLnRvU3RyaW5nKCkpLnRvQmUoZmVlUmVzcG9uc2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldENyZWF0ZUNoYWluVHhGZWVcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgbGV0IGNvcmVjaGFpbjogUGxhdGZvcm1WTUFQSSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Db3JlXCIpXHJcbiAgICBjb25zdCBmZWVSZXNwb25zZTogc3RyaW5nID0gXCIxMDAwMDAwMDAwXCJcclxuICAgIGNvbnN0IGZlZTogQk4gPSBjb3JlY2hhaW4uZ2V0Q3JlYXRlQ2hhaW5UeEZlZSgpXHJcbiAgICBleHBlY3QoZmVlLnRvU3RyaW5nKCkpLnRvQmUoZmVlUmVzcG9uc2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcInJlZnJlc2hCbG9ja2NoYWluSURcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgbGV0IG4zYmNJRDogc3RyaW5nID0gRGVmYXVsdHMubmV0d29ya1szXS5Db3JlW1wiYmxvY2tjaGFpbklEXCJdXHJcbiAgICBsZXQgdGVzdEFQSTogUGxhdGZvcm1WTUFQSSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Db3JlXCIpXHJcbiAgICBsZXQgYmMxOiBzdHJpbmcgPSB0ZXN0QVBJLmdldEJsb2NrY2hhaW5JRCgpXHJcbiAgICBleHBlY3QoYmMxKS50b0JlKFBsYXRmb3JtQ2hhaW5JRClcclxuXHJcbiAgICB0ZXN0QVBJLnJlZnJlc2hCbG9ja2NoYWluSUQoKVxyXG4gICAgbGV0IGJjMjogc3RyaW5nID0gdGVzdEFQSS5nZXRCbG9ja2NoYWluSUQoKVxyXG4gICAgZXhwZWN0KGJjMikudG9CZShQbGF0Zm9ybUNoYWluSUQpXHJcblxyXG4gICAgdGVzdEFQSS5yZWZyZXNoQmxvY2tjaGFpbklEKG4zYmNJRClcclxuICAgIGxldCBiYzM6IHN0cmluZyA9IHRlc3RBUEkuZ2V0QmxvY2tjaGFpbklEKClcclxuICAgIGV4cGVjdChiYzMpLnRvQmUobjNiY0lEKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJsaXN0QWRkcmVzc2VzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbYWRkckEsIGFkZHJCXVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkubGlzdEFkZHJlc3Nlcyh1c2VybmFtZSwgcGFzc3dvcmQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGFkZHJlc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUoYWRkcmVzc2VzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJpbXBvcnRLZXlcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYWRkcmVzczogc3RyaW5nID0gYWRkckNcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuaW1wb3J0S2V5KFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIFwia2V5XCJcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgYWRkcmVzc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShhZGRyZXNzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJpbXBvcnQgYmFkIGtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBhZGRyQ1xyXG4gICAgY29uc3QgbWVzc2FnZTogc3RyaW5nID1cclxuICAgICAgJ3Byb2JsZW0gcmV0cmlldmluZyBkYXRhOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCJ0ZXN0XCInXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuaW1wb3J0S2V5KFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgXCJiYWRwYXNzd29yZFwiLFxyXG4gICAgICBcImtleVwiXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGNvZGU6IC0zMjAwMCxcclxuICAgICAgICBtZXNzYWdlLFxyXG4gICAgICAgIGRhdGE6IG51bGxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcblxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wiY29kZVwiXSkudG9CZSgtMzIwMDApXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJtZXNzYWdlXCJdKS50b0JlKG1lc3NhZ2UpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEJhbGFuY2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYmFsYW5jZTogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXHJcbiAgICBjb25zdCB1bmxvY2tlZDogQk4gPSBuZXcgQk4oXCIxMDBcIiwgMTApXHJcbiAgICBjb25zdCBsb2NrZWRTdGFrZWFibGU6IEJOID0gbmV3IEJOKFwiMTAwXCIsIDEwKVxyXG4gICAgY29uc3QgbG9ja2VkTm90U3Rha2VhYmxlOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcclxuICAgIGNvbnN0IHJlc3BvYmo6IEdldEJhbGFuY2VSZXNwb25zZSA9IHtcclxuICAgICAgYmFsYW5jZSxcclxuICAgICAgdW5sb2NrZWQsXHJcbiAgICAgIGxvY2tlZFN0YWtlYWJsZSxcclxuICAgICAgbG9ja2VkTm90U3Rha2VhYmxlLFxyXG4gICAgICB1dHhvSURzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHhJRDogXCJMVXJpQjNXOTE5Rjg0THdQTU13NHNtMmZaNFk3NldnYjZtc2FhdUVZN2kxdEZObXR2XCIsXHJcbiAgICAgICAgICBvdXRwdXRJbmRleDogMFxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldEJhbGFuY2VSZXNwb25zZT4gPSBhcGkuZ2V0QmFsYW5jZShhZGRyQSlcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiByZXNwb2JqXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSkudG9CZShKU09OLnN0cmluZ2lmeShyZXNwb2JqKSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0Q3VycmVudFN1cHBseVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBzdXBwbHk6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMFwiLCAxMClcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCTj4gPSBhcGkuZ2V0Q3VycmVudFN1cHBseSgpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN1cHBseVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBCTiA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UudG9TdHJpbmcoMTApKS50b0JlKHN1cHBseS50b1N0cmluZygxMCkpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFZhbGlkYXRvcnNBdFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBoZWlnaHQ6IG51bWJlciA9IDBcclxuICAgIGNvbnN0IGFsbHljaGFpbklEOiBzdHJpbmcgPSBcIjExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExTHBvWVlcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldFZhbGlkYXRvcnNBdFJlc3BvbnNlPiA9IGFwaS5nZXRWYWxpZGF0b3JzQXQoXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgYWxseWNoYWluSURcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdmFsaWRhdG9yczoge1xyXG4gICAgICAgICAgXCJOb2RlSUQtN1hodzJtRHh1RFM0NGo0MlRDQjZVNTU3OWVzYlN0M0xnXCI6IDIwMDAwMDAwMDAwMDAwMDAsXHJcbiAgICAgICAgICBcIk5vZGVJRC1HV1BjYkZKWkZmWnJlRVRTb1dqUGltcjg0Nm1YRUtDdHVcIjogMjAwMDAwMDAwMDAwMDAwMCxcclxuICAgICAgICAgIFwiTm9kZUlELU1GclpGVkNYUHY1aUNuNk05SzZYZHV4R1RZcDg5MXhYWlwiOiAyMDAwMDAwMDAwMDAwMDAwLFxyXG4gICAgICAgICAgXCJOb2RlSUQtTkZCYmJKNHFDbU5hQ3plVzdzeEVyaHZXcXZFUU1uWWNOXCI6IDIwMDAwMDAwMDAwMDAwMDAsXHJcbiAgICAgICAgICBcIk5vZGVJRC1QN29CMk1jakJHZ1cyTlhYV1ZZalY4SkVERm9XOXhERTVcIjogMjAwMDAwMDAwMDAwMDAwMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogR2V0VmFsaWRhdG9yc0F0UmVzcG9uc2UgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJnZXRIZWlnaHRcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgaGVpZ2h0OiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxCTj4gPSBhcGkuZ2V0SGVpZ2h0KClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgaGVpZ2h0XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IEJOID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZS50b1N0cmluZygxMCkpLnRvQmUoaGVpZ2h0LnRvU3RyaW5nKDEwKSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0TWluU3Rha2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgbWluU3Rha2U6IEJOID0gbmV3IEJOKFwiMjAwMDAwMDAwMDAwMFwiLCAxMClcclxuICAgIGNvbnN0IG1pbk5vbWluYXRlOiBCTiA9IG5ldyBCTihcIjI1MDAwMDAwMDAwXCIsIDEwKVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldE1pblN0YWtlUmVzcG9uc2U+ID0gYXBpLmdldE1pblN0YWtlKClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgbWluVmFsaWRhdG9yU3Rha2U6IFwiMjAwMDAwMDAwMDAwMFwiLFxyXG4gICAgICAgIG1pbk5vbWluYXRvclN0YWtlOiBcIjI1MDAwMDAwMDAwXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogR2V0TWluU3Rha2VSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2VbXCJtaW5WYWxpZGF0b3JTdGFrZVwiXS50b1N0cmluZygxMCkpLnRvQmUoXHJcbiAgICAgIG1pblN0YWtlLnRvU3RyaW5nKDEwKVxyXG4gICAgKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlW1wibWluTm9taW5hdG9yU3Rha2VcIl0udG9TdHJpbmcoMTApKS50b0JlKFxyXG4gICAgICBtaW5Ob21pbmF0ZS50b1N0cmluZygxMClcclxuICAgIClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0U3Rha2VcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3Qgc3Rha2VkOiBCTiA9IG5ldyBCTihcIjEwMFwiLCAxMClcclxuICAgIGNvbnN0IHN0YWtlZE91dHB1dHM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjBiZDYxODAwMDAwMDAwNzAwMDAwMDBmYjc1MDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzMxNjg5NWViM1wiLFxyXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjBiZDYxODAwMDAwMDAwNzAwMDAwMGQxOGMyZTI4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzM3MTRkZTc1OVwiLFxyXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjEzNDA4ODAwMDAwMDAwNzAwMDAwMDBmYjc1MDQzMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzM3OWI4OTQ2MVwiLFxyXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjEzNDA4ODAwMDAwMDAwNzAwMDAwMGQxOGMyZTI4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzNjN2FhMzVkMVwiLFxyXG4gICAgICBcIjB4MDAwMDIxZTY3MzE3Y2JjNGJlMmFlYjAwNjc3YWQ2NDYyNzc4YThmNTIyNzRiOWQ2MDVkZjI1OTFiMjMwMjdhODdkZmYwMDAwMDAxNjAwMDAwMDAwNjEzNDA4ODAwMDAwMDAwNzAwMDAwMWQxYTk0YTIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWU3MDA2MGI3MDUxYTQ4MzhlYmU4ZTI5YmNiZTE0MDNkYjliODhjYzM4ZmQyMzJkOFwiXHJcbiAgICBdXHJcbiAgICBjb25zdCBvYmpzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHN0YWtlZE91dHB1dHMubWFwKFxyXG4gICAgICAoc3Rha2VkT3V0cHV0OiBzdHJpbmcpOiBUcmFuc2ZlcmFibGVPdXRwdXQgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dCgpXHJcbiAgICAgICAgbGV0IGJ1ZjogQnVmZmVyID0gQnVmZmVyLmZyb20oc3Rha2VkT3V0cHV0LnJlcGxhY2UoLzB4L2csIFwiXCIpLCBcImhleFwiKVxyXG4gICAgICAgIHRyYW5zZmVyYWJsZU91dHB1dC5mcm9tQnVmZmVyKGJ1ZiwgMilcclxuICAgICAgICByZXR1cm4gdHJhbnNmZXJhYmxlT3V0cHV0XHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldFN0YWtlKFthZGRyQV0sIFwiaGV4XCIpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHN0YWtlZCxcclxuICAgICAgICBzdGFrZWRPdXRwdXRzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VbXCJzdGFrZWRcIl0pKS50b0JlKEpTT04uc3RyaW5naWZ5KHN0YWtlZCkpXHJcbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VbXCJzdGFrZWRPdXRwdXRzXCJdKSkudG9CZShKU09OLnN0cmluZ2lmeShvYmpzKSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiYWRkQWxseWNoYWluVmFsaWRhdG9yIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogc3RyaW5nID1cclxuICAgICAgXCI0UjVwMlJYREdMcWFpZlpFNGhIV0g5b3dlMzRwZm9CVUxuMURyUVRXaXZqZzhvNGFIXCJcclxuICAgIGNvbnN0IHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODUsIDUsIDksIDEyLCA1OSwgNDMsIDkpXHJcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcclxuICAgIGNvbnN0IHdlaWdodDogbnVtYmVyID0gMTNcclxuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPVxyXG4gICAgICBhcGkuYWRkQWxseWNoYWluVmFsaWRhdG9yKFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBhbGx5Y2hhaW5JRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICB3ZWlnaHRcclxuICAgICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eElEOiB1dHhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJhZGRBbGx5Y2hhaW5WYWxpZGF0b3JcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJhYmNkZWZcIiwgXCJoZXhcIilcclxuICAgIGNvbnN0IHN0YXJ0VGltZTogRGF0ZSA9IG5ldyBEYXRlKDE5ODUsIDUsIDksIDEyLCA1OSwgNDMsIDkpXHJcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcclxuICAgIGNvbnN0IHdlaWdodDogbnVtYmVyID0gMTNcclxuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPVxyXG4gICAgICBhcGkuYWRkQWxseWNoYWluVmFsaWRhdG9yKFxyXG4gICAgICAgIHVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBhbGx5Y2hhaW5JRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICB3ZWlnaHRcclxuICAgICAgKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eElEOiB1dHhcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodXR4KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJhZGROb21pbmF0b3IgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcclxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKDE5ODUsIDUsIDksIDEyLCA1OSwgNDMsIDkpXHJcbiAgICBjb25zdCBlbmRUaW1lOiBEYXRlID0gbmV3IERhdGUoMTk4MiwgMywgMSwgMTIsIDU4LCAzMywgNylcclxuICAgIGNvbnN0IHN0YWtlQW1vdW50OiBCTiA9IG5ldyBCTigxMylcclxuICAgIGNvbnN0IHJld2FyZEFkZHJlc3M6IHN0cmluZyA9IFwiZmVkY2JhXCJcclxuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5hZGROb21pbmF0b3IoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgbm9kZUlELFxyXG4gICAgICBzdGFydFRpbWUsXHJcbiAgICAgIGVuZFRpbWUsXHJcbiAgICAgIHN0YWtlQW1vdW50LFxyXG4gICAgICByZXdhcmRBZGRyZXNzXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHV0eFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHV0eClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0QmxvY2tjaGFpbnMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXNwOiBvYmplY3RbXSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGlkOiBcIm5vZGVJRFwiLFxyXG4gICAgICAgIGFsbHljaGFpbklEOiBcImFsbHljaGFpbklEXCIsXHJcbiAgICAgICAgdm1JRDogXCJ2bUlEXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJsb2NrY2hhaW5bXT4gPSBhcGkuZ2V0QmxvY2tjaGFpbnMoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBibG9ja2NoYWluczogcmVzcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBCbG9ja2NoYWluW10gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEFsbHljaGFpbnMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCByZXNwOiBvYmplY3RbXSA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGlkOiBcImlkXCIsXHJcbiAgICAgICAgY29udHJvbEtleXM6IFtcImNvbnRyb2xLZXlzXCJdLFxyXG4gICAgICAgIHRocmVzaG9sZDogXCJ0aHJlc2hvbGRcIlxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8QWxseWNoYWluW10+ID0gYXBpLmdldEFsbHljaGFpbnMoKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhbGx5Y2hhaW5zOiByZXNwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvRXF1YWwocmVzcClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0Q3VycmVudFZhbGlkYXRvcnMgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBzdHJpbmdbXSA9IFtcInZhbDFcIiwgXCJ2YWwyXCJdXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8b2JqZWN0PiA9IGFwaS5nZXRDdXJyZW50VmFsaWRhdG9ycygpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHZhbGlkYXRvcnNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7IHZhbGlkYXRvcnMgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0Q3VycmVudFZhbGlkYXRvcnMgMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogc3RyaW5nID0gXCJhYmNkZWZcIlxyXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPG9iamVjdD4gPSBhcGkuZ2V0Q3VycmVudFZhbGlkYXRvcnMoYWxseWNoYWluSUQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHZhbGlkYXRvcnNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogb2JqZWN0ID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7IHZhbGlkYXRvcnMgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0Q3VycmVudFZhbGlkYXRvcnMgM1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXCJhYmNkZWZcIiwgXCJoZXhcIilcclxuICAgIGNvbnN0IHZhbGlkYXRvcnM6IHN0cmluZ1tdID0gW1widmFsMVwiLCBcInZhbDJcIl1cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxvYmplY3Q+ID0gYXBpLmdldEN1cnJlbnRWYWxpZGF0b3JzKGFsbHljaGFpbklEKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB2YWxpZGF0b3JzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IG9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoeyB2YWxpZGF0b3JzIH0pXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImV4cG9ydEtleVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IFwic2RmZ2x2bGoyaDN2NDVcIlxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0PiA9IGFwaS5leHBvcnRLZXkoXHJcbiAgICAgIHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZCxcclxuICAgICAgYWRkckFcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgcHJpdmF0ZUtleToga2V5XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGtleSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZXhwb3J0QVhDXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFtb3VudDogQk4gPSBuZXcgQk4oMTAwKVxyXG4gICAgY29uc3QgdG86IHN0cmluZyA9IFwiYWJjZGVmXCJcclxuICAgIGNvbnN0IHVzZXJuYW1lOiBzdHJpbmcgPSBcIlJvYmVydFwiXHJcbiAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCJQYXVsc29uXCJcclxuICAgIGNvbnN0IHR4SUQ6IHN0cmluZyA9IFwidmFsaWRcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmV4cG9ydEFYQyhcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBhbW91bnQsXHJcbiAgICAgIHRvXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHR4SURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiaW1wb3J0QVhDXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHRvOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBjb25zdCB1c2VybmFtZTogc3RyaW5nID0gXCJSb2JlcnRcIlxyXG4gICAgY29uc3QgcGFzc3dvcmQgPSBcIlBhdWxzb25cIlxyXG4gICAgY29uc3QgdHhJRCA9IFwidmFsaWRcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3Q+ID0gYXBpLmltcG9ydEFYQyhcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICB0byxcclxuICAgICAgYmxvY2tjaGFpbklEXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IHR4SURcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdCA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodHhJRClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiY3JlYXRlQmxvY2tjaGFpblwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCJcclxuICAgIGNvbnN0IHZtSUQ6IHN0cmluZyA9IFwiN3NpazNQcjZyMUZlTHJ2SzFvV3dFQ0JTOGlKNVZQdVNoXCJcclxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IFwiU29tZSBCbG9ja2NoYWluXCJcclxuICAgIGNvbnN0IGdlbmVzaXM6IHN0cmluZyA9ICd7cnVoOlwicm9oXCJ9J1xyXG4gICAgY29uc3QgYWxseWNoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuY3JlYXRlQmxvY2tjaGFpbihcclxuICAgICAgdXNlcm5hbWUsXHJcbiAgICAgIHBhc3N3b3JkLFxyXG4gICAgICBhbGx5Y2hhaW5JRCxcclxuICAgICAgdm1JRCxcclxuICAgICAgWzEsIDIsIDNdLFxyXG4gICAgICBuYW1lLFxyXG4gICAgICBnZW5lc2lzXHJcbiAgICApXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIHR4SUQ6IGJsb2NrY2hhaW5JRFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBFcnJvclJlc3BvbnNlT2JqZWN0ID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShibG9ja2NoYWluSUQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldEJsb2NrY2hhaW5TdGF0dXNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYmxvY2tjaGFpbklEOiBzdHJpbmcgPSBcIjdzaWszUHI2cjFGZUxydksxb1d3RUNCUzhpSjVWUHVTaFwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nPiA9IGFwaS5nZXRCbG9ja2NoYWluU3RhdHVzKGJsb2NrY2hhaW5JRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgc3RhdHVzOiBcIkFjY2VwdGVkXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcIkFjY2VwdGVkXCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImNyZWF0ZUFkZHJlc3NcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYWxpYXM6IHN0cmluZyA9IFwicmFuZG9tYWxpYXNcIlxyXG5cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmc+ID0gYXBpLmNyZWF0ZUFkZHJlc3ModXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhZGRyZXNzOiBhbGlhc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKGFsaWFzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJjcmVhdGVBbGx5Y2hhaW4gMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBjb250cm9sS2V5czogc3RyaW5nW10gPSBbXCJhYmNkZWZcIl1cclxuICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMTNcclxuICAgIGNvbnN0IHV0eDogc3RyaW5nID0gXCJ2YWxpZFwiXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgRXJyb3JSZXNwb25zZU9iamVjdD4gPSBhcGkuY3JlYXRlQWxseWNoYWluKFxyXG4gICAgICB1c2VybmFtZSxcclxuICAgICAgcGFzc3dvcmQsXHJcbiAgICAgIGNvbnRyb2xLZXlzLFxyXG4gICAgICB0aHJlc2hvbGRcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdHhJRDogdXR4XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZyB8IEVycm9yUmVzcG9uc2VPYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHV0eClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwic2FtcGxlVmFsaWRhdG9ycyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGxldCBhbGx5Y2hhaW5JRFxyXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5zYW1wbGVWYWxpZGF0b3JzKDEwLCBhbGx5Y2hhaW5JRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdmFsaWRhdG9yc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodmFsaWRhdG9ycylcclxuICB9KVxyXG5cclxuICB0ZXN0KFwic2FtcGxlVmFsaWRhdG9ycyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFsbHljaGFpbklEOiBzdHJpbmcgPSBcImFiY2RlZlwiXHJcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBzdHJpbmdbXSA9IFtcInZhbDFcIiwgXCJ2YWwyXCJdXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnNhbXBsZVZhbGlkYXRvcnMoMTAsIGFsbHljaGFpbklEKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB2YWxpZGF0b3JzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZSh2YWxpZGF0b3JzKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJzYW1wbGVWYWxpZGF0b3JzIDNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgYWxseWNoYWluSUQgPSBCdWZmZXIuZnJvbShcImFiY2RlZlwiLCBcImhleFwiKVxyXG4gICAgY29uc3QgdmFsaWRhdG9yczogc3RyaW5nW10gPSBbXCJ2YWwxXCIsIFwidmFsMlwiXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS5zYW1wbGVWYWxpZGF0b3JzKDEwLCBhbGx5Y2hhaW5JRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgdmFsaWRhdG9yc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUodmFsaWRhdG9ycylcclxuICB9KVxyXG5cclxuICB0ZXN0KFwidmFsaWRhdGVkQnkgMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBibG9ja2NoYWluSUQ6IHN0cmluZyA9IFwiYWJjZGVmXCJcclxuICAgIGNvbnN0IHJlc3A6IHN0cmluZyA9IFwidmFsaWRcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZz4gPSBhcGkudmFsaWRhdGVkQnkoYmxvY2tjaGFpbklEKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBhbGx5Y2hhaW5JRDogcmVzcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcInZhbGlkYXRlcyAxXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGxldCBhbGx5Y2hhaW5JRFxyXG4gICAgY29uc3QgcmVzcDogc3RyaW5nW10gPSBbXCJ2YWxpZFwiXVxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZ1tdPiA9IGFwaS52YWxpZGF0ZXMoYWxseWNoYWluSUQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgIGJsb2NrY2hhaW5JRHM6IHJlc3BcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogc3RyaW5nW10gPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKHJlc3ApXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcInZhbGlkYXRlcyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IGFsbHljaGFpbklEOiBzdHJpbmcgPSBcImRlYWRiZWVmXCJcclxuICAgIGNvbnN0IHJlc3A6IHN0cmluZ1tdID0gW1widmFsaWRcIl1cclxuICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxzdHJpbmdbXT4gPSBhcGkudmFsaWRhdGVzKGFsbHljaGFpbklEKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICBibG9ja2NoYWluSURzOiByZXNwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IHJlc3BvbnNlT2JqOiBIdHRwUmVzcG9uc2UgPSB7XHJcbiAgICAgIGRhdGE6IHBheWxvYWRcclxuICAgIH1cclxuXHJcbiAgICBtb2NrQXhpb3MubW9ja1Jlc3BvbnNlKHJlc3BvbnNlT2JqKVxyXG4gICAgY29uc3QgcmVzcG9uc2U6IHN0cmluZ1tdID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShyZXNwKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJ2YWxpZGF0ZXMgM1wiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICBjb25zdCBhbGx5Y2hhaW5JRCA9IEJ1ZmZlci5mcm9tKFwiYWJjZGVmXCIsIFwiaGV4XCIpXHJcbiAgICBjb25zdCByZXNwOiBzdHJpbmdbXSA9IFtcInZhbGlkXCJdXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nW10+ID0gYXBpLnZhbGlkYXRlcyhhbGx5Y2hhaW5JRClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgYmxvY2tjaGFpbklEczogcmVzcFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmdbXSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocmVzcClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0VHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdHhpZDogc3RyaW5nID1cclxuICAgICAgXCJmOTY2NzUwZjQzODg2N2MzYzk4MjhkZGNkYmU2NjBlMjFjY2RiYjM2YTkyNzY5NThmMDExYmE0NzJmNzVkNGU3XCJcclxuXHJcbiAgICBjb25zdCByZXN1bHQ6IFByb21pc2U8c3RyaW5nIHwgb2JqZWN0PiA9IGFwaS5nZXRUeCh0eGlkKVxyXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICByZXN1bHQ6IHtcclxuICAgICAgICB0eDogXCJzb21ldHhcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBvYmplY3QgPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b0JlKFwic29tZXR4XCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFR4U3RhdHVzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGNvbnN0IHR4aWQ6IHN0cmluZyA9XHJcbiAgICAgIFwiZjk2Njc1MGY0Mzg4NjdjM2M5ODI4ZGRjZGJlNjYwZTIxY2NkYmIzNmE5Mjc2OTU4ZjAxMWJhNDcyZjc1ZDRlN1wiXHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPHN0cmluZyB8IEdldFR4U3RhdHVzUmVzcG9uc2U+ID0gYXBpLmdldFR4U3RhdHVzKHR4aWQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogXCJhY2NlcHRlZFwiXHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBzdHJpbmcgfCBHZXRUeFN0YXR1c1Jlc3BvbnNlID0gYXdhaXQgcmVzdWx0XHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChyZXNwb25zZSkudG9CZShcImFjY2VwdGVkXCIpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImdldFVUWE9zXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIC8vIFBheW1lbnRcclxuICAgIGNvbnN0IE9QVVRYT3N0cjE6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMDM4ZDFiOWYxMTM4NjcyZGE2ZmI2YzM1MTI1NTM5Mjc2YTlhY2MyYTY2OGQ2M2JlYTZiYTNjNzk1ZTJlZGIwZjUwMDAwMDAwMTNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDRkZDUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWEzNmZkMGMyZGJjYWIzMTE3MzFkZGU3ZWYxNTE0YmQyNmZjZGM3NGRcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuICAgIGNvbnN0IE9QVVRYT3N0cjI6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMGMzZTQ4MjM1NzE1ODdmZTJiZGZjNTAyNjg5ZjVhODIzOGI5ZDBlYTdmMzI3NzEyNGQxNmFmOWRlMGQyZDk5MTEwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuICAgIGNvbnN0IE9QVVRYT3N0cjM6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMGYyOWRiYTYxZmRhOGQ1N2E5MTFlN2Y4ODEwZjkzNWJkZTgxMGQzZjhkNDk1NDA0Njg1YmRiOGQ5ZDg1NDVlODYwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuXHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBzZXQuYWRkKE9QVVRYT3N0cjEpXHJcbiAgICBzZXQuYWRkQXJyYXkoW09QVVRYT3N0cjIsIE9QVVRYT3N0cjNdKVxyXG5cclxuICAgIGNvbnN0IHBlcnNpc3RPcHRzOiBQZXJzaXN0YW5jZU9wdGlvbnMgPSBuZXcgUGVyc2lzdGFuY2VPcHRpb25zKFxyXG4gICAgICBcInRlc3RcIixcclxuICAgICAgdHJ1ZSxcclxuICAgICAgXCJ1bmlvblwiXHJcbiAgICApXHJcbiAgICBleHBlY3QocGVyc2lzdE9wdHMuZ2V0TWVyZ2VSdWxlKCkpLnRvQmUoXCJ1bmlvblwiKVxyXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBzZXRcclxuICAgICAgLmdldEFkZHJlc3NlcygpXHJcbiAgICAgIC5tYXAoKGEpOiBzdHJpbmcgPT4gYXBpLmFkZHJlc3NGcm9tQnVmZmVyKGEpKVxyXG4gICAgbGV0IHJlc3VsdDogUHJvbWlzZTxHZXRVVFhPc1Jlc3BvbnNlPiA9IGFwaS5nZXRVVFhPcyhcclxuICAgICAgYWRkcmVzc2VzLFxyXG4gICAgICBhcGkuZ2V0QmxvY2tjaGFpbklEKCksXHJcbiAgICAgIDAsXHJcbiAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgcGVyc2lzdE9wdHNcclxuICAgIClcclxuICAgIGNvbnN0IHBheWxvYWQ6IG9iamVjdCA9IHtcclxuICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgbnVtRmV0Y2hlZDogMyxcclxuICAgICAgICB1dHhvczogW09QVVRYT3N0cjEsIE9QVVRYT3N0cjIsIE9QVVRYT3N0cjNdLFxyXG4gICAgICAgIHN0b3BJbmRleDogeyBhZGRyZXNzOiBcImFcIiwgdXR4bzogXCJiXCIgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xyXG4gICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICB9XHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIGxldCByZXNwb25zZTogVVRYT1NldCA9IChhd2FpdCByZXN1bHQpLnV0eG9zXHJcblxyXG4gICAgZXhwZWN0KG1vY2tBeGlvcy5yZXF1ZXN0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShyZXNwb25zZS5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSkpLnRvQmUoXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHNldC5nZXRBbGxVVFhPU3RyaW5ncygpLnNvcnQoKSlcclxuICAgIClcclxuXHJcbiAgICBhZGRyZXNzZXMgPSBzZXQuZ2V0QWRkcmVzc2VzKCkubWFwKChhKSA9PiBhcGkuYWRkcmVzc0Zyb21CdWZmZXIoYSkpXHJcbiAgICByZXN1bHQgPSBhcGkuZ2V0VVRYT3MoXHJcbiAgICAgIGFkZHJlc3NlcyxcclxuICAgICAgYXBpLmdldEJsb2NrY2hhaW5JRCgpLFxyXG4gICAgICAwLFxyXG4gICAgICB1bmRlZmluZWQsXHJcbiAgICAgIHBlcnNpc3RPcHRzXHJcbiAgICApXHJcblxyXG4gICAgbW9ja0F4aW9zLm1vY2tSZXNwb25zZShyZXNwb25zZU9iailcclxuICAgIHJlc3BvbnNlID0gKGF3YWl0IHJlc3VsdCkudXR4b3NcclxuXHJcbiAgICBleHBlY3QobW9ja0F4aW9zLnJlcXVlc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxyXG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKSkudG9CZShcclxuICAgICAgSlNPTi5zdHJpbmdpZnkoc2V0LmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpKVxyXG4gICAgKVxyXG4gIH0pXHJcblxyXG4gIGRlc2NyaWJlKFwiVHJhbnNhY3Rpb25zXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGxldCBzZXQ6IFVUWE9TZXRcclxuICAgIGxldCBsc2V0OiBVVFhPU2V0XHJcbiAgICBsZXQga2V5bWdyMjogS2V5Q2hhaW5cclxuICAgIGxldCBrZXltZ3IzOiBLZXlDaGFpblxyXG4gICAgbGV0IGFkZHJzMTogc3RyaW5nW11cclxuICAgIGxldCBhZGRyczI6IHN0cmluZ1tdXHJcbiAgICBsZXQgYWRkcnMzOiBzdHJpbmdbXVxyXG4gICAgbGV0IGFkZHJlc3NidWZmczogQnVmZmVyW10gPSBbXVxyXG4gICAgbGV0IGFkZHJlc3Nlczogc3RyaW5nW10gPSBbXVxyXG4gICAgbGV0IHV0eG9zOiBVVFhPW11cclxuICAgIGxldCBsdXR4b3M6IFVUWE9bXVxyXG4gICAgbGV0IGlucHV0czogVHJhbnNmZXJhYmxlSW5wdXRbXVxyXG4gICAgbGV0IG91dHB1dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdXHJcbiAgICBjb25zdCBhbW50OiBudW1iZXIgPSAxMDAwMFxyXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKFwibWFyeSBoYWQgYSBsaXR0bGUgbGFtYlwiKS5kaWdlc3QoKVxyXG4gICAgKVxyXG4gICAgbGV0IHNlY3BiYXNlMTogU0VDUFRyYW5zZmVyT3V0cHV0XHJcbiAgICBsZXQgc2VjcGJhc2UyOiBTRUNQVHJhbnNmZXJPdXRwdXRcclxuICAgIGxldCBzZWNwYmFzZTM6IFNFQ1BUcmFuc2Zlck91dHB1dFxyXG4gICAgbGV0IGZ1bmd1dHhvaWRzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICBsZXQgcGxhdGZvcm12bTogUGxhdGZvcm1WTUFQSVxyXG4gICAgY29uc3QgZmVlOiBudW1iZXIgPSAxMFxyXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gXCJNb3J0eWNvaW4gaXMgdGhlIGR1bWIgYXMgYSBzYWNrIG9mIGhhbW1lcnMuXCJcclxuICAgIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJtb3JUXCJcclxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxyXG5cclxuICAgIGJlZm9yZUVhY2goYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBwbGF0Zm9ybXZtID0gbmV3IFBsYXRmb3JtVk1BUEkoYXhpYSwgXCIvZXh0L2JjL0NvcmVcIilcclxuICAgICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgICAgcmVzdWx0OiB7XHJcbiAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgc3ltYm9sLFxyXG4gICAgICAgICAgYXNzZXRJRDogYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcclxuICAgICAgICAgIGRlbm9taW5hdGlvbjogYCR7ZGVub21pbmF0aW9ufWBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICAgIGF3YWl0IHJlc3VsdFxyXG4gICAgICBzZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgIGxzZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgIHBsYXRmb3Jtdm0ubmV3S2V5Q2hhaW4oKVxyXG4gICAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxyXG4gICAgICBrZXltZ3IzID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxyXG4gICAgICBhZGRyczEgPSBbXVxyXG4gICAgICBhZGRyczIgPSBbXVxyXG4gICAgICBhZGRyczMgPSBbXVxyXG4gICAgICB1dHhvcyA9IFtdXHJcbiAgICAgIGx1dHhvcyA9IFtdXHJcbiAgICAgIGlucHV0cyA9IFtdXHJcbiAgICAgIG91dHB1dHMgPSBbXVxyXG4gICAgICBmdW5ndXR4b2lkcyA9IFtdXHJcbiAgICAgIGNvbnN0IHBsb2FkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMTAyNClcclxuICAgICAgcGxvYWQud3JpdGUoXHJcbiAgICAgICAgXCJBbGwgeW91IFRyZWtraWVzIGFuZCBUViBhZGRpY3RzLCBEb24ndCBtZWFuIHRvIGRpc3MgZG9uJ3QgbWVhbiB0byBicmluZyBzdGF0aWMuXCIsXHJcbiAgICAgICAgMCxcclxuICAgICAgICAxMDI0LFxyXG4gICAgICAgIFwidXRmOFwiXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICBhZGRyczEucHVzaChcclxuICAgICAgICAgIHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoXHJcbiAgICAgICAgICAgIHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFkZHJzMi5wdXNoKFxyXG4gICAgICAgICAgcGxhdGZvcm12bS5hZGRyZXNzRnJvbUJ1ZmZlcihrZXltZ3IyLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGFkZHJzMy5wdXNoKFxyXG4gICAgICAgICAgcGxhdGZvcm12bS5hZGRyZXNzRnJvbUJ1ZmZlcihrZXltZ3IzLm1ha2VLZXkoKS5nZXRBZGRyZXNzKCkpXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBPTkVBWEMubXVsKG5ldyBCTihhbW50KSlcclxuICAgICAgYWRkcmVzc2J1ZmZzID0gcGxhdGZvcm12bS5rZXlDaGFpbigpLmdldEFkZHJlc3NlcygpXHJcbiAgICAgIGFkZHJlc3NlcyA9IGFkZHJlc3NidWZmcy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0uYWRkcmVzc0Zyb21CdWZmZXIoYSkpXHJcbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTig1NDMyMSlcclxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAzXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICBsZXQgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXHJcbiAgICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCAzMikpXHJcbiAgICAgICAgICAgIC5kaWdlc3QoKVxyXG4gICAgICAgIClcclxuICAgICAgICBsZXQgdHhpZHg6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgICAgIHR4aWR4LndyaXRlVUludDMyQkUoaSwgMClcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgICAgYW1vdW50LFxyXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgICApXHJcbiAgICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXHJcbiAgICAgICAgb3V0cHV0cy5wdXNoKHhmZXJvdXQpXHJcblxyXG4gICAgICAgIGNvbnN0IHU6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAgICAgdS5mcm9tQnVmZmVyKFxyXG4gICAgICAgICAgQnVmZmVyLmNvbmNhdChbdS5nZXRDb2RlY0lEQnVmZmVyKCksIHR4aWQsIHR4aWR4LCB4ZmVyb3V0LnRvQnVmZmVyKCldKVxyXG4gICAgICAgIClcclxuICAgICAgICBmdW5ndXR4b2lkcy5wdXNoKHUuZ2V0VVRYT0lEKCkpXHJcbiAgICAgICAgdXR4b3MucHVzaCh1KVxyXG5cclxuICAgICAgICB0eGlkID0gdS5nZXRUeElEKClcclxuICAgICAgICB0eGlkeCA9IHUuZ2V0T3V0cHV0SWR4KClcclxuICAgICAgICBjb25zdCBhc3NldCA9IHUuZ2V0QXNzZXRJRCgpXHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXHJcbiAgICAgICAgY29uc3QgeGZlcmlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcclxuICAgICAgICAgIHR4aWQsXHJcbiAgICAgICAgICB0eGlkeCxcclxuICAgICAgICAgIGFzc2V0LFxyXG4gICAgICAgICAgaW5wdXRcclxuICAgICAgICApXHJcbiAgICAgICAgaW5wdXRzLnB1c2goeGZlcmlucHV0KVxyXG4gICAgICB9XHJcbiAgICAgIHNldC5hZGRBcnJheSh1dHhvcylcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDQ7IGkrKykge1xyXG4gICAgICAgIGxldCB0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcclxuICAgICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcclxuICAgICAgICAgICAgLnVwZGF0ZShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDMyKSlcclxuICAgICAgICAgICAgLmRpZ2VzdCgpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGxldCB0eGlkeDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICAgICAgdHhpZHgud3JpdGVVSW50MzJCRShpLCAwKVxyXG5cclxuICAgICAgICBjb25zdCBvdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgICBPTkVBWEMubXVsKG5ldyBCTig1KSksXHJcbiAgICAgICAgICBhZGRyZXNzYnVmZnMsXHJcbiAgICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAgIDFcclxuICAgICAgICApXHJcbiAgICAgICAgY29uc3QgcG91dDogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChvdXQpXHJcbiAgICAgICAgY29uc3QgbG9ja291dDogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxyXG4gICAgICAgICAgT05FQVhDLm11bChuZXcgQk4oNSkpLFxyXG4gICAgICAgICAgYWRkcmVzc2J1ZmZzLFxyXG4gICAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgbG9ja3RpbWUuYWRkKG5ldyBCTig4NjQwMCkpLFxyXG4gICAgICAgICAgcG91dFxyXG4gICAgICAgIClcclxuICAgICAgICBjb25zdCB4ZmVyb3V0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxyXG4gICAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICAgIGxvY2tvdXRcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIGNvbnN0IHU6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAgICAgdS5mcm9tQnVmZmVyKFxyXG4gICAgICAgICAgQnVmZmVyLmNvbmNhdChbdS5nZXRDb2RlY0lEQnVmZmVyKCksIHR4aWQsIHR4aWR4LCB4ZmVyb3V0LnRvQnVmZmVyKCldKVxyXG4gICAgICAgIClcclxuICAgICAgICBsdXR4b3MucHVzaCh1KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsc2V0LmFkZEFycmF5KGx1dHhvcylcclxuICAgICAgbHNldC5hZGRBcnJheShzZXQuZ2V0QWxsVVRYT3MoKSlcclxuXHJcbiAgICAgIHNlY3BiYXNlMSA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgbmV3IEJOKDc3NyksXHJcbiAgICAgICAgYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgc2VjcGJhc2UyID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBuZXcgQk4oODg4KSxcclxuICAgICAgICBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgVW5peE5vdygpLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG4gICAgICBzZWNwYmFzZTMgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTig5OTkpLFxyXG4gICAgICAgIGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgMVxyXG4gICAgICApXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJzaWduVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQmFzZVR4KFxyXG4gICAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXHJcbiAgICAgICAgbmV3IEJOKGFtbnQpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgYWRkcnMzLm1hcCgoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgYWRkcnMxLm1hcCgoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgYWRkcnMxLm1hcCgoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSksXHJcbiAgICAgICAgcGxhdGZvcm12bS5nZXRUeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgdW5kZWZpbmVkLFxyXG4gICAgICAgIFVuaXhOb3coKSxcclxuICAgICAgICBuZXcgQk4oMCksXHJcbiAgICAgICAgMVxyXG4gICAgICApXHJcblxyXG4gICAgICB0eHUyLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiYnVpbGRJbXBvcnRUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGxvY2t0aW1lOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuICAgICAgcGxhdGZvcm12bS5zZXRUeEZlZShuZXcgQk4oZmVlKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgZnVuZ3V0eG86IFVUWE8gPSBzZXQuZ2V0VVRYTyhmdW5ndXR4b2lkc1sxXSlcclxuICAgICAgY29uc3QgZnVuZ3V0eG9zdHI6IHN0cmluZyA9IGZ1bmd1dHhvLnRvU3RyaW5nKClcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdDogUHJvbWlzZTxVbnNpZ25lZFR4PiA9IHBsYXRmb3Jtdm0uYnVpbGRJbXBvcnRUeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIFBsYXRmb3JtQ2hhaW5JRCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSxcclxuICAgICAgICBVbml4Tm93KCksXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xyXG4gICAgICAgIHJlc3VsdDoge1xyXG4gICAgICAgICAgdXR4b3M6IFtmdW5ndXR4b3N0cl1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgICBkYXRhOiBwYXlsb2FkXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCByZXN1bHRcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRJbXBvcnRUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIFtmdW5ndXR4b10sXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxyXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0VHhGZWUoKSxcclxuICAgICAgICBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKSxcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgVW5peE5vdygpLFxyXG4gICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgIHRocmVzaG9sZFxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXHJcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxyXG5cclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkltcG9ydFR4XCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZEV4cG9ydFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgcGxhdGZvcm12bS5zZXRUeEZlZShuZXcgQk4oZmVlKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMiA9IGFkZHJzMi5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjMgPSBhZGRyczMubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYW1vdW50OiBCTiA9IG5ldyBCTig5MClcclxuICAgICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkRXhwb3J0VHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIGFtb3VudCxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1theGlhLmdldE5ldHdvcmtJRCgpXS5Td2FwW1wiYmxvY2tjaGFpbklEXCJdXHJcbiAgICAgICAgKSxcclxuICAgICAgICBhZGRyYnVmZjMubWFwKChhKSA9PlxyXG4gICAgICAgICAgc2VyaWFsaXplci5idWZmZXJUb1R5cGUoYSwgdHlwZSwgYXhpYS5nZXRIUlAoKSwgXCJDb3JlXCIpXHJcbiAgICAgICAgKSxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkRXhwb3J0VHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBhZGRyYnVmZjMsXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGFkZHJidWZmMixcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgICAgRGVmYXVsdHMubmV0d29ya1theGlhLmdldE5ldHdvcmtJRCgpXS5Td2FwW1wiYmxvY2tjaGFpbklEXCJdXHJcbiAgICAgICAgKSxcclxuICAgICAgICBwbGF0Zm9ybXZtLmdldFR4RmVlKCksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCB0eHUzOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEV4cG9ydFR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShcclxuICAgICAgICAgIERlZmF1bHRzLm5ldHdvcmtbYXhpYS5nZXROZXR3b3JrSUQoKV0uU3dhcFtcImJsb2NrY2hhaW5JRFwiXVxyXG4gICAgICAgICksXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTQ6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRFeHBvcnRUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFtb3VudCxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICBwbGF0Zm9ybXZtLmdldFR4RmVlKCksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGV4cGVjdCh0eHU0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1My50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTQudG9TdHJpbmcoKSkudG9CZSh0eHUzLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXHJcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxyXG5cclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkV4cG9ydFR4XCIpXHJcbiAgICB9KVxyXG4gICAgLypcclxuICAgICAgICB0ZXN0KCdidWlsZEFkZEFsbHljaGFpblZhbGlkYXRvclR4JywgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICAgICAgcGxhdGZvcm12bS5zZXRGZWUobmV3IEJOKGZlZSkpO1xyXG4gICAgICAgICAgY29uc3QgYWRkcmJ1ZmYxID0gYWRkcnMxLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpO1xyXG4gICAgICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpO1xyXG4gICAgICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpO1xyXG4gICAgICAgICAgY29uc3QgYW1vdW50OkJOID0gbmV3IEJOKDkwKTtcclxuXHJcbiAgICAgICAgICBjb25zdCB0eHUxOlVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkQWxseWNoYWluVmFsaWRhdG9yVHgoXHJcbiAgICAgICAgICAgIHNldCxcclxuICAgICAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgICAgIG5vZGVJRCxcclxuICAgICAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgICAgICBlbmRUaW1lLFxyXG4gICAgICAgICAgICBQbGF0Zm9ybVZNQ29uc3RhbnRzLk1JTlNUQUtFLFxyXG4gICAgICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKSwgVW5peE5vdygpXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHR4dTI6VW5zaWduZWRUeCA9IHNldC5idWlsZEFkZEFsbHljaGFpblZhbGlkYXRvclR4KFxyXG4gICAgICAgICAgICBuZXR3b3JrSUQsIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgICAgICBhZGRyYnVmZjIsXHJcbiAgICAgICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZSxcclxuICAgICAgICAgICAgZW5kVGltZSxcclxuICAgICAgICAgICAgUGxhdGZvcm1WTUNvbnN0YW50cy5NSU5TVEFLRSxcclxuICAgICAgICAgICAgcGxhdGZvcm12bS5nZXRGZWUoKSxcclxuICAgICAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLCBVbml4Tm93KClcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKCdoZXgnKSkudG9CZSh0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoJ2hleCcpKTtcclxuICAgICAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAqL1xyXG4gICAgdGVzdChcImJ1aWxkQWRkTm9taW5hdG9yVHggMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pbk5vbWluYXRpb25TdGFrZVxyXG5cclxuICAgICAgY29uc3QgbG9ja3RpbWU6IEJOID0gbmV3IEJOKDU0MzIxKVxyXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDJcclxuXHJcbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXHJcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5TdGFrZSxcclxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pbk5vbWluYXRpb25TdGFrZVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZE5vbWluYXRvclR4KFxyXG4gICAgICAgIHNldCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBub2RlSUQsXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRBZGROb21pbmF0b3JUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgYWRkcmJ1ZmYzLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBhZGRyYnVmZjIsXHJcbiAgICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkLFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBuZXcgQk4oMCksXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcclxuICAgICAgICB0eHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b1N0cmluZygpKS50b0JlKHR4dTEudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHR4MTogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCBjaGVja1R4OiBzdHJpbmcgPSB0eDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFvYmo6IG9iamVjdCA9IHR4MS5zZXJpYWxpemUoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDFvYmopXHJcblxyXG4gICAgICBjb25zdCB0eDJuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgxc3RyKVxyXG4gICAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHgyLmRlc2VyaWFsaXplKHR4Mm5ld29iaiwgXCJoZXhcIilcclxuXHJcbiAgICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG5cclxuICAgICAgY29uc3QgdHgzOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IHR4M29iajogb2JqZWN0ID0gdHgzLnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgICBjb25zdCB0eDNzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4M29iailcclxuXHJcbiAgICAgIGNvbnN0IHR4NG5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDNzdHIpXHJcbiAgICAgIGNvbnN0IHR4NDogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDQuZGVzZXJpYWxpemUodHg0bmV3b2JqLCBkaXNwbGF5KVxyXG5cclxuICAgICAgZXhwZWN0KHR4NC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBzZXJpYWx6ZWl0KHR4MSwgXCJBZGROb21pbmF0b3JUeFwiKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiYnVpbGRBZGRWYWxpZGF0b3JUeCBzb3J0IFN0YWtlYWJsZUxvY2tPdXRzIDFcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICAvLyB0d28gVVRYTy4gVGhlIDFzdCBoYXMgYSBsZXNzZXIgc3Rha2VhYmxlbG9ja3RpbWUgYW5kIGEgZ3JlYXRlciBhbW91bnQgb2YgQVhDLiBUaGUgMm5kIGhhcyBhIGdyZWF0ZXIgc3Rha2VhYmxlbG9ja3RpbWUgYW5kIGEgbGVzc2VyIGFtb3VudCBvZiBBWEMuXHJcbiAgICAgIC8vIFdlIGV4cGVjdCB0aGlzIHRlc3QgdG8gb25seSBjb25zdW1lIHRoZSAybmQgVVRYTyBzaW5jZSBpdCBoYXMgdGhlIGdyZWF0ZXIgbG9ja3RpbWUuXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYW1vdW50MTogQk4gPSBuZXcgQk4oXCIyMDAwMDAwMDAwMDAwMDAwMFwiKVxyXG4gICAgICBjb25zdCBhbW91bnQyOiBCTiA9IG5ldyBCTihcIjEwMDAwMDAwMDAwMDAwMDAwXCIpXHJcbiAgICAgIGNvbnN0IGxvY2t0aW1lMTogQk4gPSBuZXcgQk4oMClcclxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcblxyXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTE6IEJOID0gbmV3IEJOKDE2MzM4MjQwMDApXHJcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDE6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgYW1vdW50MSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgbG9ja3RpbWUxLFxyXG4gICAgICAgIHRocmVzaG9sZFxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDE6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXHJcbiAgICAgICAgc2VjcFRyYW5zZmVyT3V0cHV0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQxOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXHJcbiAgICAgICAgYW1vdW50MSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgbG9ja3RpbWUxLFxyXG4gICAgICAgIHRocmVzaG9sZCxcclxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTEsXHJcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMjogQk4gPSBuZXcgQk4oMTczMzgyNDAwMClcclxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MjogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBhbW91bnQyLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MjogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcclxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDI6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcclxuICAgICAgICBhbW91bnQyLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkLFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMixcclxuICAgICAgICBwYXJzZWFibGVPdXRwdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC0zNmdpRnllNWVwd0JUcEdxUGs3YjRDQ1llM2hmeW9GcjFcIlxyXG4gICAgICBjb25zdCBzdGFrZUFtb3VudDogQk4gPSBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pblN0YWtlXHJcbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXHJcbiAgICAgICAgc3Rha2VBbW91bnQsXHJcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5Ob21pbmF0aW9uU3Rha2VcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBub21pbmF0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcclxuICAgICAgY29uc3QgY29kZWNJRDogbnVtYmVyID0gMFxyXG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgIFwiYXVoTUZzMjRmZmMyQlJXS3c2aTdRbmdjczhqU1FVUzlFaTJYd0pzVXBFcTRzVFZpYlwiXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdHhpZDI6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXHJcbiAgICAgICAgXCIySndEZm0zQzdwODhySlExWTF4V0xrV05NQTFucVB6cW5hQzJIaTRQRE5LaVBuWGdHdlwiXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgb3V0cHV0aWR4MDogbnVtYmVyID0gMFxyXG4gICAgICBjb25zdCBvdXRwdXRpZHgxOiBudW1iZXIgPSAwXHJcbiAgICAgIGNvbnN0IGFzc2V0SUQgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgICBjb25zdCBhc3NldElEMiA9IGF3YWl0IHBsYXRmb3Jtdm0uZ2V0QVhDQXNzZXRJRCgpXHJcbiAgICAgIGNvbnN0IHV0eG8xOiBVVFhPID0gbmV3IFVUWE8oXHJcbiAgICAgICAgY29kZWNJRCxcclxuICAgICAgICB0eGlkLFxyXG4gICAgICAgIG91dHB1dGlkeDAsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHV0eG8yOiBVVFhPID0gbmV3IFVUWE8oXHJcbiAgICAgICAgY29kZWNJRCxcclxuICAgICAgICB0eGlkMixcclxuICAgICAgICBvdXRwdXRpZHgxLFxyXG4gICAgICAgIGFzc2V0SUQyLFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdXR4b1NldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgdXR4b1NldC5hZGQodXR4bzEpXHJcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8yKVxyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxyXG4gICAgICAgIHV0eG9TZXQsXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIGFkZHJzMSxcclxuICAgICAgICBhZGRyczIsXHJcbiAgICAgICAgbm9kZUlELFxyXG4gICAgICAgIHN0YXJ0VGltZSxcclxuICAgICAgICBlbmRUaW1lLFxyXG4gICAgICAgIHN0YWtlQW1vdW50LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBub21pbmF0aW9uRmVlUmF0ZVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4ID0gdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XHJcbiAgICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHR4LmdldElucygpXHJcbiAgICAgIC8vIHN0YXJ0IHRlc3QgaW5wdXRzXHJcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIGlucHV0XHJcbiAgICAgIGV4cGVjdChpbnMubGVuZ3RoKS50b0JlKDEpXHJcbiAgICAgIGNvbnN0IGlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxyXG4gICAgICBjb25zdCBhaSA9IGlucHV0LmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcclxuICAgICAgY29uc3QgYW8gPSBzdGFrZWFibGVMb2NrT3V0MlxyXG4gICAgICAgIC5nZXRUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcclxuICAgICAgY29uc3QgYW8yID0gc3Rha2VhYmxlTG9ja091dDFcclxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcclxuICAgICAgICAuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgYW1vdW50IG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFla2FibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcclxuICAgICAgZXhwZWN0KGFpLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoYW8uZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcclxuICAgICAgLy8gY29uZmlybSBpbnB1dCBhbW91bnQgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3RhZWthYmxlbG9jayB0aW1lIGJ1dCBncmVhdGVyIGFtb3VudFxyXG4gICAgICBleHBlY3QoYWkuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoYW8yLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCBzbGk6IFN0YWtlYWJsZUxvY2tJbiA9IGlucHV0LmdldElucHV0KCkgYXMgU3Rha2VhYmxlTG9ja0luXHJcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcclxuICAgICAgZXhwZWN0KHNsaS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgICAgLy8gY29uZmlybSBpbnB1dCBzdGFrZWFibGVsb2NrIHRpbWUgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBncmVhdGVyIGFtb3VudFxyXG4gICAgICBleHBlY3Qoc2xpLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgICAgLy8gc3RvcCB0ZXN0IGlucHV0c1xyXG5cclxuICAgICAgLy8gc3RhcnQgdGVzdCBvdXRwdXRzXHJcbiAgICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0T3V0cygpXHJcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIG91dHB1dFxyXG4gICAgICBleHBlY3Qob3V0cy5sZW5ndGgpLnRvQmUoMSlcclxuICAgICAgY29uc3Qgb3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBvdXRzWzBdXHJcbiAgICAgIGNvbnN0IGFvMyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcclxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgYW1vdW50IG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnQgc2FucyB0aGUgc3Rha2UgYW1vdW50XHJcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgICBhby5nZXRBbW91bnQoKS5zdWIoc3Rha2VBbW91bnQpLnRvU3RyaW5nKClcclxuICAgICAgKVxyXG4gICAgICAvLyBjb25maXJtIG91dHB1dCBhbW91bnQgZG9lc24ndCBtYXRjaCB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBncmVhdGVyIGFtb3VudFxyXG4gICAgICBleHBlY3QoYW8zLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKGFvMi5nZXRBbW91bnQoKS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3Qgc2xvOiBTdGFrZWFibGVMb2NrT3V0ID0gb3V0cHV0LmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcclxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIG1hdGNoZXMgdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcclxuICAgICAgZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWUgYnV0IGxlc3NlciBhbW91bnRcclxuICAgICAgZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxyXG4gICAgICApXHJcblxyXG4gICAgICAvLyBjb25maXJtIHR4IG5vZGVJRCBtYXRjaGVzIG5vZGVJRFxyXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxyXG4gICAgICAvLyBjb25maXJtIHR4IHN0YXJ0dGltZSBtYXRjaGVzIHN0YXJ0dGltZVxyXG4gICAgICBleHBlY3QodHguZ2V0U3RhcnRUaW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChzdGFydFRpbWUudG9TdHJpbmcoKSlcclxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxyXG4gICAgICBleHBlY3QodHguZ2V0RW5kVGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoZW5kVGltZS50b1N0cmluZygpKVxyXG4gICAgICAvLyBjb25maXJtIHR4IHN0YWtlIGFtb3VudCBtYXRjaGVzIHN0YWtlQW1vdW50XHJcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRTdGFrZU91dHMoKVxyXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBzdGFrZU91dFxyXG4gICAgICBleHBlY3Qoc3Rha2VPdXRzLmxlbmd0aCkudG9CZSgxKVxyXG5cclxuICAgICAgY29uc3Qgc3Rha2VPdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1swXVxyXG4gICAgICBjb25zdCBzbG8yID0gc3Rha2VPdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxyXG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlYWJsZWxvY2sgdGltZSBtYXRjaGVzIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XHJcbiAgICAgIGV4cGVjdChzbG8yLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcclxuICAgICAgKVxyXG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlYWJsZWxvY2sgdGltZSBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XHJcbiAgICAgIGV4cGVjdChzbG8yLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkubm90LnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgICAgc2xvMi5nZXRBbW91bnQoKVxyXG4gICAgICAvLyBjb25maXJtIHN0YWtlT3V0IHN0YWtlIGFtb3VudCBtYXRjaGVzIHN0YWtlQW1vdW50XHJcbiAgICAgIGV4cGVjdChzbG8yLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgLy8gVE9ETyAtIGRlYnVnIHRlc3RcclxuICAgICAgLy8gdHdvIFVUWE8uIFRoZSAxc3QgaGFzIGEgbGVzc2VyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGdyZWF0ZXIgYW1vdW50IG9mIEFYQy4gVGhlIDJuZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgQVhDLlxyXG4gICAgICAvLyB0aGlzIHRpbWUgd2UncmUgc3Rha2luZyBhIGdyZWF0ZXIgYW1vdW50IHRoYW4gaXMgYXZhaWxhYmxlIGluIHRoZSAybmQgVVRYTy5cclxuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdGVzdCB0byBjb25zdW1lIHRoZSBmdWxsIDJuZCBVVFhPIGFuZCBhIGZyYWN0aW9uIG9mIHRoZSAxc3QgVVRYTy4uXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKFxyXG4gICAgICAgIChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYW1vdW50MTogQk4gPSBuZXcgQk4oXCIyMDAwMDAwMDAwMDAwMDAwMFwiKVxyXG4gICAgICBjb25zdCBhbW91bnQyOiBCTiA9IG5ldyBCTihcIjEwMDAwMDAwMDAwMDAwMDAwXCIpXHJcbiAgICAgIGNvbnN0IGxvY2t0aW1lMTogQk4gPSBuZXcgQk4oMClcclxuICAgICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcblxyXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrVGltZTE6IEJOID0gbmV3IEJOKDE2MzM4MjQwMDApXHJcbiAgICAgIGNvbnN0IHNlY3BUcmFuc2Zlck91dHB1dDE6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXHJcbiAgICAgICAgYW1vdW50MSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgbG9ja3RpbWUxLFxyXG4gICAgICAgIHRocmVzaG9sZFxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHBhcnNlYWJsZU91dHB1dDE6IFBhcnNlYWJsZU91dHB1dCA9IG5ldyBQYXJzZWFibGVPdXRwdXQoXHJcbiAgICAgICAgc2VjcFRyYW5zZmVyT3V0cHV0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tPdXQxOiBTdGFrZWFibGVMb2NrT3V0ID0gbmV3IFN0YWtlYWJsZUxvY2tPdXQoXHJcbiAgICAgICAgYW1vdW50MSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgbG9ja3RpbWUxLFxyXG4gICAgICAgIHRocmVzaG9sZCxcclxuICAgICAgICBzdGFrZWFibGVMb2NrVGltZTEsXHJcbiAgICAgICAgcGFyc2VhYmxlT3V0cHV0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMjogQk4gPSBuZXcgQk4oMTczMzgyNDAwMClcclxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MjogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBhbW91bnQyLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MjogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcclxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDI6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcclxuICAgICAgICBhbW91bnQyLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkLFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMixcclxuICAgICAgICBwYXJzZWFibGVPdXRwdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgbm9kZUlEOiBzdHJpbmcgPSBcIk5vZGVJRC0zNmdpRnllNWVwd0JUcEdxUGs3YjRDQ1llM2hmeW9GcjFcIlxyXG4gICAgICBjb25zdCBzdGFrZUFtb3VudDogQk4gPSBuZXcgQk4oXCIxMDAwMDAwMzAwMDAwMDAwMFwiKVxyXG4gICAgICBwbGF0Zm9ybXZtLnNldE1pblN0YWtlKFxyXG4gICAgICAgIHN0YWtlQW1vdW50LFxyXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgbm9taW5hdGlvbkZlZVJhdGU6IG51bWJlciA9IG5ldyBCTigyKS50b051bWJlcigpXHJcbiAgICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IDBcclxuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcclxuICAgICAgICBcImF1aE1GczI0ZmZjMkJSV0t3Nmk3UW5nY3M4alNRVVM5RWkyWHdKc1VwRXE0c1RWaWJcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4aWQyOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgIFwiMkp3RGZtM0M3cDg4ckpRMVkxeFdMa1dOTUExbnFQenFuYUMySGk0UEROS2lQblhnR3ZcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG91dHB1dGlkeDA6IG51bWJlciA9IDBcclxuICAgICAgY29uc3Qgb3V0cHV0aWR4MTogbnVtYmVyID0gMFxyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgICBjb25zdCBhc3NldElEMjogQnVmZmVyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRBWENBc3NldElEKClcclxuICAgICAgY29uc3QgdXR4bzE6IFVUWE8gPSBuZXcgVVRYTyhcclxuICAgICAgICBjb2RlY0lELFxyXG4gICAgICAgIHR4aWQsXHJcbiAgICAgICAgb3V0cHV0aWR4MCxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQxXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdXR4bzI6IFVUWE8gPSBuZXcgVVRYTyhcclxuICAgICAgICBjb2RlY0lELFxyXG4gICAgICAgIHR4aWQyLFxyXG4gICAgICAgIG91dHB1dGlkeDEsXHJcbiAgICAgICAgYXNzZXRJRDIsXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDJcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB1dHhvU2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMSlcclxuICAgICAgdXR4b1NldC5hZGQodXR4bzIpXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkVmFsaWRhdG9yVHgoXHJcbiAgICAgICAgdXR4b1NldCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBub2RlSUQsXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgc3Rha2VBbW91bnQsXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIG5vbWluYXRpb25GZWVSYXRlXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdHggPSB0eHUxLmdldFRyYW5zYWN0aW9uKCkgYXMgQWRkVmFsaWRhdG9yVHhcclxuICAgICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdHguZ2V0SW5zKClcclxuICAgICAgLy8gc3RhcnQgdGVzdCBpbnB1dHNcclxuICAgICAgLy8gY29uZmlybSBvbmx5IDEgaW5wdXRcclxuICAgICAgZXhwZWN0KGlucy5sZW5ndGgpLnRvQmUoMilcclxuICAgICAgY29uc3QgaW5wdXQxOiBUcmFuc2ZlcmFibGVJbnB1dCA9IGluc1swXVxyXG4gICAgICBjb25zdCBpbnB1dDI6IFRyYW5zZmVyYWJsZUlucHV0ID0gaW5zWzFdXHJcbiAgICAgIGNvbnN0IGFpMSA9IGlucHV0MS5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XHJcbiAgICAgIGNvbnN0IGFpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0XHJcbiAgICAgIGNvbnN0IGFvMSA9IHN0YWtlYWJsZUxvY2tPdXQyXHJcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXHJcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICBjb25zdCBhbzIgPSBzdGFrZWFibGVMb2NrT3V0MVxyXG4gICAgICAgIC5nZXRUcmFuc2ZlcmFibGVPdXRwdXQoKVxyXG4gICAgICAgIC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcclxuICAgICAgLy8gY29uZmlybSBlYWNoIGlucHV0IGFtb3VudCBtYXRjaGVzIHRoZSBjb3JyZXNwb25kaW5nIG91dHB1dFxyXG4gICAgICBleHBlY3QoYWkyLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoYW8xLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpXHJcbiAgICAgIGV4cGVjdChhaTEuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHNsaTEgPSBpbnB1dDEuZ2V0SW5wdXQoKSBhcyBTdGFrZWFibGVMb2NrSW5cclxuICAgICAgY29uc3Qgc2xpMiA9IGlucHV0Mi5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxyXG4gICAgICAvLyBjb25maXJtIGlucHV0IHN0cmFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBncmVhdGVyIHN0YWVrYWJsZWxvY2sgdGltZSBidXQgbGVzc2VyIGFtb3VudFxyXG4gICAgICAvLyBleHBlY3Qoc2xpMS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIC8vIClcclxuICAgICAgZXhwZWN0KHNsaTIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxyXG4gICAgICApXHJcbiAgICAgIC8vIHN0b3AgdGVzdCBpbnB1dHNcclxuXHJcbiAgICAgIC8vIHN0YXJ0IHRlc3Qgb3V0cHV0c1xyXG4gICAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4LmdldE91dHMoKVxyXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBvdXRwdXRcclxuICAgICAgZXhwZWN0KG91dHMubGVuZ3RoKS50b0JlKDEpXHJcbiAgICAgIGNvbnN0IG91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gb3V0c1swXVxyXG4gICAgICBjb25zdCBhbzMgPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IGFtb3VudCBtYXRjaGVzIHRoZSBvdXRwdXQgYW1vdW50IHNhbnMgdGhlIDJuZCB1dHhvIGFtb3VudCBhbmQgdGhlIHN0YWtlIGFtb3VudFxyXG4gICAgICBleHBlY3QoYW8zLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgYW8yLmdldEFtb3VudCgpLnN1YihzdGFrZUFtb3VudC5zdWIoYW8xLmdldEFtb3VudCgpKSkudG9TdHJpbmcoKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBzbG8gPSBvdXRwdXQuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxyXG4gICAgICAvLyBjb25maXJtIG91dHB1dCBzdGFrZWFibGVsb2NrIHRpbWUgbWF0Y2hlcyB0aGUgb3V0cHV0IHcvIHRoZSBsZXNzZXIgc3Rha2VhYmxlbG9jayBzaW5jZSB0aGUgb3RoZXIgd2FzIGNvbnN1bWVkXHJcbiAgICAgIC8vIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKFxyXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxyXG4gICAgICAvLyApXHJcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IHN0YWtlYWJsZWxvY2sgdGltZSBkb2Vzbid0IG1hdGNoIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3Rha2VhYmxlbG9jayB0aW1lXHJcbiAgICAgIC8vIGV4cGVjdChzbG8uZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpKS5ub3QudG9FcXVhbChcclxuICAgICAgLy8gICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcclxuICAgICAgLy8gKVxyXG5cclxuICAgICAgLy8gY29uZmlybSB0eCBub2RlSUQgbWF0Y2hlcyBub2RlSURcclxuICAgICAgZXhwZWN0KHR4LmdldE5vZGVJRFN0cmluZygpKS50b0VxdWFsKG5vZGVJRClcclxuICAgICAgLy8gY29uZmlybSB0eCBzdGFydHRpbWUgbWF0Y2hlcyBzdGFydHRpbWVcclxuICAgICAgZXhwZWN0KHR4LmdldFN0YXJ0VGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3RhcnRUaW1lLnRvU3RyaW5nKCkpXHJcbiAgICAgIC8vIGNvbmZpcm0gdHggZW5kdGltZSBtYXRjaGVzIGVuZHRpbWVcclxuICAgICAgZXhwZWN0KHR4LmdldEVuZFRpbWUoKS50b1N0cmluZygpKS50b0VxdWFsKGVuZFRpbWUudG9TdHJpbmcoKSlcclxuICAgICAgLy8gY29uZmlybSB0eCBzdGFrZSBhbW91bnQgbWF0Y2hlcyBzdGFrZUFtb3VudFxyXG4gICAgICBleHBlY3QodHguZ2V0U3Rha2VBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKHN0YWtlQW1vdW50LnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBsZXQgc3Rha2VPdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4LmdldFN0YWtlT3V0cygpXHJcbiAgICAgIC8vIGNvbmZpcm0gMiBzdGFrZU91dHNcclxuICAgICAgZXhwZWN0KHN0YWtlT3V0cy5sZW5ndGgpLnRvQmUoMilcclxuXHJcbiAgICAgIGxldCBzdGFrZU91dDE6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1swXVxyXG4gICAgICBsZXQgc3Rha2VPdXQyOiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBzdGFrZU91dHNbMV1cclxuICAgICAgbGV0IHNsbzIgPSBzdGFrZU91dDEuZ2V0T3V0cHV0KCkgYXMgU3Rha2VhYmxlTG9ja091dFxyXG4gICAgICBsZXQgc2xvMyA9IHN0YWtlT3V0Mi5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XHJcbiAgICAgIC8vIGNvbmZpcm0gYm90aCBzdGFrZU91dCBzdHJha2VhYmxlbG9jayB0aW1lcyBtYXRjaGUgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XHJcbiAgICAgIC8vIGV4cGVjdChzbG8zLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgLy8gICBzdGFrZWFibGVMb2NrT3V0MS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcclxuICAgICAgLy8gKVxyXG4gICAgICBleHBlY3Qoc2xvMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggc29ydCBTdGFrZWFibGVMb2NrT3V0cyAzXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgLy8gVE9ETyAtIGRlYnVnIHRlc3RcclxuICAgICAgLy8gdGhyZWUgVVRYTy5cclxuICAgICAgLy8gVGhlIDFzdCBpcyBhIFNlY3BUcmFuc2ZlcmFibGVPdXRwdXQuXHJcbiAgICAgIC8vIFRoZSAybmQgaGFzIGEgbGVzc2VyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGdyZWF0ZXIgYW1vdW50IG9mIEFYQy5cclxuICAgICAgLy8gVGhlIDNyZCBoYXMgYSBncmVhdGVyIHN0YWtlYWJsZWxvY2t0aW1lIGFuZCBhIGxlc3NlciBhbW91bnQgb2YgQVhDLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyB0aGlzIHRpbWUgd2UncmUgc3Rha2luZyBhIGdyZWF0ZXIgYW1vdW50IHRoYW4gaXMgYXZhaWxhYmxlIGluIHRoZSAzcmQgVVRYTy5cclxuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdGVzdCB0byBjb25zdW1lIHRoZSBmdWxsIDNyZCBVVFhPIGFuZCBhIGZyYWN0aW9uIG9mIHRoZSAybmQgVVRYTyBhbmQgbm90IHRvIGNvbnN1bWUgdGhlIFNlY3BUcmFuc2ZlcmFibGVPdXRwdXRcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYxOiBCdWZmZXJbXSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhbW91bnQxOiBCTiA9IG5ldyBCTihcIjIwMDAwMDAwMDAwMDAwMDAwXCIpXHJcbiAgICAgIGNvbnN0IGFtb3VudDI6IEJOID0gbmV3IEJOKFwiMTAwMDAwMDAwMDAwMDAwMDBcIilcclxuICAgICAgY29uc3QgbG9ja3RpbWUxOiBCTiA9IG5ldyBCTigwKVxyXG4gICAgICBjb25zdCB0aHJlc2hvbGQ6IG51bWJlciA9IDFcclxuXHJcbiAgICAgIGNvbnN0IHN0YWtlYWJsZUxvY2tUaW1lMTogQk4gPSBuZXcgQk4oMTYzMzgyNDAwMClcclxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBhbW91bnQxLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgc2VjcFRyYW5zZmVyT3V0cHV0MTogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBhbW91bnQxLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgcGFyc2VhYmxlT3V0cHV0MTogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChcclxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQxXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja091dDE6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcclxuICAgICAgICBhbW91bnQxLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBsb2NrdGltZTEsXHJcbiAgICAgICAgdGhyZXNob2xkLFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tUaW1lMSxcclxuICAgICAgICBwYXJzZWFibGVPdXRwdXQxXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgc3Rha2VhYmxlTG9ja1RpbWUyOiBCTiA9IG5ldyBCTigxNzMzODI0MDAwKVxyXG4gICAgICBjb25zdCBzZWNwVHJhbnNmZXJPdXRwdXQyOiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIGFtb3VudDIsXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGxvY2t0aW1lMSxcclxuICAgICAgICB0aHJlc2hvbGRcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBwYXJzZWFibGVPdXRwdXQyOiBQYXJzZWFibGVPdXRwdXQgPSBuZXcgUGFyc2VhYmxlT3V0cHV0KFxyXG4gICAgICAgIHNlY3BUcmFuc2Zlck91dHB1dDJcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBzdGFrZWFibGVMb2NrT3V0MjogU3Rha2VhYmxlTG9ja091dCA9IG5ldyBTdGFrZWFibGVMb2NrT3V0KFxyXG4gICAgICAgIGFtb3VudDIsXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGxvY2t0aW1lMSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja1RpbWUyLFxyXG4gICAgICAgIHBhcnNlYWJsZU91dHB1dDJcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBub2RlSUQ6IHN0cmluZyA9IFwiTm9kZUlELTM2Z2lGeWU1ZXB3QlRwR3FQazdiNENDWWUzaGZ5b0ZyMVwiXHJcbiAgICAgIGNvbnN0IHN0YWtlQW1vdW50OiBCTiA9IG5ldyBCTihcIjEwMDAwMDAzMDAwMDAwMDAwXCIpXHJcbiAgICAgIHBsYXRmb3Jtdm0uc2V0TWluU3Rha2UoXHJcbiAgICAgICAgc3Rha2VBbW91bnQsXHJcbiAgICAgICAgRGVmYXVsdHMubmV0d29ya1tuZXR3b3JrSURdW1wiQ29yZVwiXS5taW5Ob21pbmF0aW9uU3Rha2VcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBub21pbmF0aW9uRmVlUmF0ZTogbnVtYmVyID0gbmV3IEJOKDIpLnRvTnVtYmVyKClcclxuICAgICAgY29uc3QgY29kZWNJRDogbnVtYmVyID0gMFxyXG4gICAgICBjb25zdCB0eGlkMDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcclxuICAgICAgICBcImF1aE1GczI0ZmZjMkJSV0t3Nmk3UW5nY3M4alNRVVM5RWkyWHdKc1VwRXE0c1RWaWJcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4aWQxOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgIFwiMmpoeUppdDhrV0E2U3drUndLeFhlcEZuZmhzOTcxQ0VxYUdrakptaUFETThINGcyTFJcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHR4aWQyOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxyXG4gICAgICAgIFwiMkp3RGZtM0M3cDg4ckpRMVkxeFdMa1dOTUExbnFQenFuYUMySGk0UEROS2lQblhnR3ZcIlxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG91dHB1dGlkeDA6IG51bWJlciA9IDBcclxuICAgICAgY29uc3Qgb3V0cHV0aWR4MTogbnVtYmVyID0gMFxyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBhd2FpdCBwbGF0Zm9ybXZtLmdldEFYQ0Fzc2V0SUQoKVxyXG4gICAgICBjb25zdCBhc3NldElEMjogQnVmZmVyID0gYXdhaXQgcGxhdGZvcm12bS5nZXRBWENBc3NldElEKClcclxuICAgICAgY29uc3QgdXR4bzA6IFVUWE8gPSBuZXcgVVRYTyhcclxuICAgICAgICBjb2RlY0lELFxyXG4gICAgICAgIHR4aWQwLFxyXG4gICAgICAgIG91dHB1dGlkeDAsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBzZWNwVHJhbnNmZXJPdXRwdXQwXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdXR4bzE6IFVUWE8gPSBuZXcgVVRYTyhcclxuICAgICAgICBjb2RlY0lELFxyXG4gICAgICAgIHR4aWQxLFxyXG4gICAgICAgIG91dHB1dGlkeDAsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0MVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHV0eG8yOiBVVFhPID0gbmV3IFVUWE8oXHJcbiAgICAgICAgY29kZWNJRCxcclxuICAgICAgICB0eGlkMixcclxuICAgICAgICBvdXRwdXRpZHgxLFxyXG4gICAgICAgIGFzc2V0SUQyLFxyXG4gICAgICAgIHN0YWtlYWJsZUxvY2tPdXQyXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgdXR4b1NldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgdXR4b1NldC5hZGQodXR4bzApXHJcbiAgICAgIHV0eG9TZXQuYWRkKHV0eG8xKVxyXG4gICAgICB1dHhvU2V0LmFkZCh1dHhvMilcclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRWYWxpZGF0b3JUeChcclxuICAgICAgICB1dHhvU2V0LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBzdGFrZUFtb3VudCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgbm9taW5hdGlvbkZlZVJhdGVcclxuICAgICAgKVxyXG4gICAgICBjb25zdCB0eCA9IHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxyXG4gICAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eC5nZXRJbnMoKVxyXG4gICAgICAvLyBzdGFydCB0ZXN0IGlucHV0c1xyXG4gICAgICAvLyBjb25maXJtIG9ubHkgMSBpbnB1dFxyXG4gICAgICBleHBlY3QoaW5zLmxlbmd0aCkudG9CZSgyKVxyXG4gICAgICBjb25zdCBpbnB1dDE6IFRyYW5zZmVyYWJsZUlucHV0ID0gaW5zWzBdXHJcbiAgICAgIGNvbnN0IGlucHV0MjogVHJhbnNmZXJhYmxlSW5wdXQgPSBpbnNbMV1cclxuICAgICAgY29uc3QgYWkxID0gaW5wdXQxLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcclxuICAgICAgY29uc3QgYWkyID0gaW5wdXQyLmdldElucHV0KCkgYXMgQW1vdW50SW5wdXRcclxuICAgICAgY29uc3QgYW8xID0gc3Rha2VhYmxlTG9ja091dDJcclxuICAgICAgICAuZ2V0VHJhbnNmZXJhYmxlT3V0cHV0KClcclxuICAgICAgICAuZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0XHJcbiAgICAgIGNvbnN0IGFvMiA9IHN0YWtlYWJsZUxvY2tPdXQxXHJcbiAgICAgICAgLmdldFRyYW5zZmVyYWJsZU91dHB1dCgpXHJcbiAgICAgICAgLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dFxyXG4gICAgICAvLyBjb25maXJtIGVhY2ggaW5wdXQgYW1vdW50IG1hdGNoZXMgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XHJcbiAgICAgIGV4cGVjdChhaTIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChhbzIuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSlcclxuICAgICAgZXhwZWN0KGFpMS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0VxdWFsKGFvMS5nZXRBbW91bnQoKS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3Qgc2xpMSA9IGlucHV0MS5nZXRJbnB1dCgpIGFzIFN0YWtlYWJsZUxvY2tJblxyXG4gICAgICBjb25zdCBzbGkyID0gaW5wdXQyLmdldElucHV0KCkgYXMgU3Rha2VhYmxlTG9ja0luXHJcbiAgICAgIC8vIGNvbmZpcm0gaW5wdXQgc3RyYWtlYWJsZWxvY2sgdGltZSBtYXRjaGVzIHRoZSBvdXRwdXQgdy8gdGhlIGdyZWF0ZXIgc3RhZWthYmxlbG9jayB0aW1lIGJ1dCBsZXNzZXIgYW1vdW50XHJcbiAgICAgIGV4cGVjdChzbGkxLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgICBzdGFrZWFibGVMb2NrT3V0Mi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcclxuICAgICAgKVxyXG4gICAgICAvLyBleHBlY3Qoc2xpMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIC8vIClcclxuICAgICAgLy8gc3RvcCB0ZXN0IGlucHV0c1xyXG5cclxuICAgICAgLy8gc3RhcnQgdGVzdCBvdXRwdXRzXHJcbiAgICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHguZ2V0T3V0cygpXHJcbiAgICAgIC8vIGNvbmZpcm0gb25seSAxIG91dHB1dFxyXG4gICAgICBleHBlY3Qob3V0cy5sZW5ndGgpLnRvQmUoMSlcclxuICAgICAgY29uc3Qgb3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBvdXRzWzBdXHJcbiAgICAgIGNvbnN0IGFvMyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXRcclxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgYW1vdW50IG1hdGNoZXMgdGhlIG91dHB1dCBhbW91bnQgc2FucyB0aGUgMm5kIHV0eG8gYW1vdW50IGFuZCB0aGUgc3Rha2UgYW1vdW50XHJcbiAgICAgIGV4cGVjdChhbzMuZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgICBhbzIuZ2V0QW1vdW50KCkuc3ViKHN0YWtlQW1vdW50LnN1YihhbzEuZ2V0QW1vdW50KCkpKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHNsbyA9IG91dHB1dC5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XHJcbiAgICAgIC8vIGNvbmZpcm0gb3V0cHV0IHN0YWtlYWJsZWxvY2sgdGltZSBtYXRjaGVzIHRoZSBvdXRwdXQgdy8gdGhlIGxlc3NlciBzdGFrZWFibGVsb2NrIHNpbmNlIHRoZSBvdGhlciB3YXMgY29uc3VtZWRcclxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgIC8vICAgc3Rha2VhYmxlTG9ja091dDEuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIC8vIClcclxuICAgICAgLy8gY29uZmlybSBvdXRwdXQgc3Rha2VhYmxlbG9jayB0aW1lIGRvZXNuJ3QgbWF0Y2ggdGhlIG91dHB1dCB3LyB0aGUgZ3JlYXRlciBzdGFrZWFibGVsb2NrIHRpbWVcclxuICAgICAgLy8gZXhwZWN0KHNsby5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLm5vdC50b0VxdWFsKFxyXG4gICAgICAvLyAgIHN0YWtlYWJsZUxvY2tPdXQyLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKVxyXG4gICAgICAvLyApXHJcblxyXG4gICAgICAvLyBjb25maXJtIHR4IG5vZGVJRCBtYXRjaGVzIG5vZGVJRFxyXG4gICAgICBleHBlY3QodHguZ2V0Tm9kZUlEU3RyaW5nKCkpLnRvRXF1YWwobm9kZUlEKVxyXG4gICAgICAvLyBjb25maXJtIHR4IHN0YXJ0dGltZSBtYXRjaGVzIHN0YXJ0dGltZVxyXG4gICAgICBleHBlY3QodHguZ2V0U3RhcnRUaW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChzdGFydFRpbWUudG9TdHJpbmcoKSlcclxuICAgICAgLy8gY29uZmlybSB0eCBlbmR0aW1lIG1hdGNoZXMgZW5kdGltZVxyXG4gICAgICBleHBlY3QodHguZ2V0RW5kVGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoZW5kVGltZS50b1N0cmluZygpKVxyXG4gICAgICAvLyBjb25maXJtIHR4IHN0YWtlIGFtb3VudCBtYXRjaGVzIHN0YWtlQW1vdW50XHJcbiAgICAgIGV4cGVjdCh0eC5nZXRTdGFrZUFtb3VudCgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoc3Rha2VBbW91bnQudG9TdHJpbmcoKSlcclxuXHJcbiAgICAgIGNvbnN0IHN0YWtlT3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eC5nZXRTdGFrZU91dHMoKVxyXG4gICAgICAvLyBjb25maXJtIDIgc3Rha2VPdXRzXHJcbiAgICAgIGV4cGVjdChzdGFrZU91dHMubGVuZ3RoKS50b0JlKDIpXHJcblxyXG4gICAgICBjb25zdCBzdGFrZU91dDE6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1swXVxyXG4gICAgICBjb25zdCBzdGFrZU91dDI6IFRyYW5zZmVyYWJsZU91dHB1dCA9IHN0YWtlT3V0c1sxXVxyXG4gICAgICBjb25zdCBzbG8yID0gc3Rha2VPdXQxLmdldE91dHB1dCgpIGFzIFN0YWtlYWJsZUxvY2tPdXRcclxuICAgICAgY29uc3Qgc2xvMyA9IHN0YWtlT3V0Mi5nZXRPdXRwdXQoKSBhcyBTdGFrZWFibGVMb2NrT3V0XHJcbiAgICAgIC8vIGNvbmZpcm0gYm90aCBzdGFrZU91dCBzdHJha2VhYmxlbG9jayB0aW1lcyBtYXRjaGUgdGhlIGNvcnJlc3BvbmRpbmcgb3V0cHV0XHJcbiAgICAgIC8vIGV4cGVjdChzbG8zLmdldFN0YWtlYWJsZUxvY2t0aW1lKCkudG9TdHJpbmcoKSkudG9FcXVhbChcclxuICAgICAgLy8gICBzdGFrZWFibGVMb2NrT3V0MS5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKClcclxuICAgICAgLy8gKVxyXG4gICAgICBleHBlY3Qoc2xvMi5nZXRTdGFrZWFibGVMb2NrdGltZSgpLnRvU3RyaW5nKCkpLnRvRXF1YWwoXHJcbiAgICAgICAgc3Rha2VhYmxlTG9ja091dDIuZ2V0U3Rha2VhYmxlTG9ja3RpbWUoKS50b1N0cmluZygpXHJcbiAgICAgIClcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggMVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pblN0YWtlLmFkZChcclxuICAgICAgICBuZXcgQk4oZmVlKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxyXG5cclxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcclxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pblN0YWtlLFxyXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkVmFsaWRhdG9yVHgoXHJcbiAgICAgICAgc2V0LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIDAuMTMzNDU1NixcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRBZGRWYWxpZGF0b3JUeChcclxuICAgICAgICBuZXR3b3JrSUQsXHJcbiAgICAgICAgYmludG9vbHMuY2I1OERlY29kZShibG9ja2NoYWluSUQpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgYWRkcmJ1ZmYzLFxyXG4gICAgICAgIGFkZHJidWZmMSxcclxuICAgICAgICBhZGRyYnVmZjIsXHJcbiAgICAgICAgTm9kZUlEU3RyaW5nVG9CdWZmZXIobm9kZUlEKSxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgdGhyZXNob2xkLFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICAwLjEzMzUsXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcblxyXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxyXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcclxuXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG5cclxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQWRkVmFsaWRhdG9yVHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQWRkTm9taW5hdG9yVHggMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pbk5vbWluYXRpb25TdGFrZVxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxyXG5cclxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShcclxuICAgICAgICBEZWZhdWx0cy5uZXR3b3JrW25ldHdvcmtJRF1bXCJDb3JlXCJdLm1pblN0YWtlLFxyXG4gICAgICAgIERlZmF1bHRzLm5ldHdvcmtbbmV0d29ya0lEXVtcIkNvcmVcIl0ubWluTm9taW5hdGlvblN0YWtlXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTE6IFVuc2lnbmVkVHggPSBhd2FpdCBwbGF0Zm9ybXZtLmJ1aWxkQWRkTm9taW5hdG9yVHgoXHJcbiAgICAgICAgbHNldCxcclxuICAgICAgICBhZGRyczMsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBub2RlSUQsXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBsc2V0LmJ1aWxkQWRkTm9taW5hdG9yVHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgIHRocmVzaG9sZCxcclxuICAgICAgICBhZGRyYnVmZjMsXHJcbiAgICAgICAgbmV3IEJOKDApLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcblxyXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxyXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcclxuXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG5cclxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQWRkTm9taW5hdG9yVHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQWRkVmFsaWRhdG9yVHggMlwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMSA9IGFkZHJzMS5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjIgPSBhZGRyczIubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzID0gYWRkcnMzLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFtb3VudDogQk4gPSBPTkVBWEMubXVsKG5ldyBCTigyNSkpXHJcblxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxyXG5cclxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShPTkVBWEMubXVsKG5ldyBCTigyNSkpLCBPTkVBWEMubXVsKG5ldyBCTigyNSkpKVxyXG5cclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRBZGRWYWxpZGF0b3JUeChcclxuICAgICAgICBsc2V0LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIDAuMTMzNDU1NixcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTI6IFVuc2lnbmVkVHggPSBsc2V0LmJ1aWxkQWRkVmFsaWRhdG9yVHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIGFkZHJidWZmMyxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIE5vZGVJRFN0cmluZ1RvQnVmZmVyKG5vZGVJRCksXHJcbiAgICAgICAgc3RhcnRUaW1lLFxyXG4gICAgICAgIGVuZFRpbWUsXHJcbiAgICAgICAgYW1vdW50LFxyXG4gICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgIHRocmVzaG9sZCxcclxuICAgICAgICBhZGRyYnVmZjMsXHJcbiAgICAgICAgMC4xMzM1LFxyXG4gICAgICAgIG5ldyBCTigwKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcclxuICAgICAgICBVbml4Tm93KClcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG5cclxuICAgICAgY29uc3QgdHgxOiBUeCA9IHR4dTEuc2lnbihwbGF0Zm9ybXZtLmtleUNoYWluKCkpXHJcbiAgICAgIGNvbnN0IGNoZWNrVHg6IHN0cmluZyA9IHR4MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MW9iajogb2JqZWN0ID0gdHgxLnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgICBjb25zdCB0eDFzdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHR4MW9iailcclxuXHJcbiAgICAgIGNvbnN0IHR4Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZSh0eDFzdHIpXHJcbiAgICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxyXG4gICAgICB0eDIuZGVzZXJpYWxpemUodHgybmV3b2JqLCBcImhleFwiKVxyXG5cclxuICAgICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGNoZWNrVHgpXHJcblxyXG4gICAgICBjb25zdCB0eDM6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgdHgzb2JqOiBvYmplY3QgPSB0eDMuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICAgIGNvbnN0IHR4M3N0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgzb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHg0bmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4M3N0cilcclxuICAgICAgY29uc3QgdHg0OiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4NC5kZXNlcmlhbGl6ZSh0eDRuZXdvYmosIGRpc3BsYXkpXHJcblxyXG4gICAgICBleHBlY3QodHg0LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIHNlcmlhbHplaXQodHgxLCBcIkFkZFZhbGlkYXRvclR4XCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZEFkZFZhbGlkYXRvclR4IDNcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBhZGRyYnVmZjEgPSBhZGRyczEubWFwKChhKSA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKSlcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYyID0gYWRkcnMyLm1hcCgoYSkgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMyA9IGFkZHJzMy5tYXAoKGEpID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpKVxyXG4gICAgICBjb25zdCBhbW91bnQ6IEJOID0gT05FQVhDLm11bChuZXcgQk4oMykpXHJcblxyXG4gICAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICAgIGNvbnN0IHRocmVzaG9sZDogbnVtYmVyID0gMlxyXG5cclxuICAgICAgcGxhdGZvcm12bS5zZXRNaW5TdGFrZShPTkVBWEMubXVsKG5ldyBCTigzKSksIE9ORUFYQy5tdWwobmV3IEJOKDMpKSlcclxuXHJcbiAgICAgIC8vMiB1dHhvczsgb25lIGxvY2tlZHN0YWtlYWJsZTsgb3RoZXIgdW5sb2NrZWQ7IGJvdGggdXR4b3MgaGF2ZSAyIGF4Yzsgc3Rha2UgMyBBWENcclxuXHJcbiAgICAgIGNvbnN0IGR1bW15U2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG5cclxuICAgICAgY29uc3QgbG9ja2VkQmFzZU91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgICBPTkVBWEMubXVsKG5ldyBCTigyKSksXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgIDFcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBsb2NrZWRCYXNlWE91dDogUGFyc2VhYmxlT3V0cHV0ID0gbmV3IFBhcnNlYWJsZU91dHB1dChsb2NrZWRCYXNlT3V0KVxyXG4gICAgICBjb25zdCBsb2NrZWRPdXQ6IFN0YWtlYWJsZUxvY2tPdXQgPSBuZXcgU3Rha2VhYmxlTG9ja091dChcclxuICAgICAgICBPTkVBWEMubXVsKG5ldyBCTigyKSksXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGxvY2t0aW1lLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgbG9ja2VkQmFzZVhPdXRcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHhpZExvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxyXG4gICAgICB0eGlkTG9ja2VkLmZpbGwoMSlcclxuICAgICAgY29uc3QgdHhpZHhMb2NrZWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxyXG4gICAgICB0eGlkeExvY2tlZC53cml0ZVVJbnQzMkJFKDEsIDApXHJcbiAgICAgIGNvbnN0IGx1OiBVVFhPID0gbmV3IFVUWE8oMCwgdHhpZExvY2tlZCwgdHhpZHhMb2NrZWQsIGFzc2V0SUQsIGxvY2tlZE91dClcclxuXHJcbiAgICAgIGNvbnN0IHR4aWRVbmxvY2tlZDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDMyKVxyXG4gICAgICB0eGlkVW5sb2NrZWQuZmlsbCgyKVxyXG4gICAgICBjb25zdCB0eGlkeFVubG9ja2VkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgICAgdHhpZHhVbmxvY2tlZC53cml0ZVVJbnQzMkJFKDIsIDApXHJcbiAgICAgIGNvbnN0IHVubG9ja2VkT3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIE9ORUFYQy5tdWwobmV3IEJOKDIpKSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgMVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IHVsdTogVVRYTyA9IG5ldyBVVFhPKFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdHhpZFVubG9ja2VkLFxyXG4gICAgICAgIHR4aWR4VW5sb2NrZWQsXHJcbiAgICAgICAgYXNzZXRJRCxcclxuICAgICAgICB1bmxvY2tlZE91dFxyXG4gICAgICApXHJcblxyXG4gICAgICBkdW1teVNldC5hZGQodWx1KVxyXG4gICAgICBkdW1teVNldC5hZGQobHUpXHJcblxyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZEFkZFZhbGlkYXRvclR4KFxyXG4gICAgICAgIGR1bW15U2V0LFxyXG4gICAgICAgIGFkZHJzMyxcclxuICAgICAgICBhZGRyczEsXHJcbiAgICAgICAgYWRkcnMyLFxyXG4gICAgICAgIG5vZGVJRCxcclxuICAgICAgICBzdGFydFRpbWUsXHJcbiAgICAgICAgZW5kVGltZSxcclxuICAgICAgICBhbW91bnQsXHJcbiAgICAgICAgYWRkcnMzLFxyXG4gICAgICAgIDAuMTMzNDU1NixcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICB0aHJlc2hvbGQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIiksXHJcbiAgICAgICAgVW5peE5vdygpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGNvbnN0IHR4dTFJbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSAoXHJcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XHJcbiAgICAgICkuZ2V0SW5zKClcclxuICAgICAgY29uc3QgdHh1MU91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gKFxyXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxyXG4gICAgICApLmdldE91dHMoKVxyXG4gICAgICBjb25zdCB0eHUxU3Rha2U6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gKFxyXG4gICAgICAgIHR4dTEuZ2V0VHJhbnNhY3Rpb24oKSBhcyBBZGRWYWxpZGF0b3JUeFxyXG4gICAgICApLmdldFN0YWtlT3V0cygpXHJcbiAgICAgIGNvbnN0IHR4dTFUb3RhbDogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSAoXHJcbiAgICAgICAgdHh1MS5nZXRUcmFuc2FjdGlvbigpIGFzIEFkZFZhbGlkYXRvclR4XHJcbiAgICAgICkuZ2V0VG90YWxPdXRzKClcclxuXHJcbiAgICAgIGxldCBpbnRvdGFsOiBCTiA9IG5ldyBCTigwKVxyXG5cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4dTFJbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpbnRvdGFsID0gaW50b3RhbC5hZGQoXHJcbiAgICAgICAgICAodHh1MUluc1tpXS5nZXRJbnB1dCgpIGFzIEFtb3VudElucHV0KS5nZXRBbW91bnQoKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG91dHRvdGFsOiBCTiA9IG5ldyBCTigwKVxyXG5cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4dTFPdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgb3V0dG90YWwgPSBvdXR0b3RhbC5hZGQoXHJcbiAgICAgICAgICAodHh1MU91dHNbaV0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHN0YWtldG90YWw6IEJOID0gbmV3IEJOKDApXHJcblxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHh1MVN0YWtlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc3Rha2V0b3RhbCA9IHN0YWtldG90YWwuYWRkKFxyXG4gICAgICAgICAgKHR4dTFTdGFrZVtpXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgdG90YWx0b3RhbDogQk4gPSBuZXcgQk4oMClcclxuXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eHUxVG90YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0b3RhbHRvdGFsID0gdG90YWx0b3RhbC5hZGQoXHJcbiAgICAgICAgICAodHh1MVRvdGFsW2ldLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dCkuZ2V0QW1vdW50KClcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV4cGVjdChpbnRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjQwMDAwMDAwMDBcIilcclxuICAgICAgZXhwZWN0KG91dHRvdGFsLnRvU3RyaW5nKDEwKSkudG9CZShcIjEwMDAwMDAwMDBcIilcclxuICAgICAgZXhwZWN0KHN0YWtldG90YWwudG9TdHJpbmcoMTApKS50b0JlKFwiMzAwMDAwMDAwMFwiKVxyXG4gICAgICBleHBlY3QodG90YWx0b3RhbC50b1N0cmluZygxMCkpLnRvQmUoXCI0MDAwMDAwMDAwXCIpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJidWlsZENyZWF0ZUFsbHljaGFpblR4MVwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHBsYXRmb3Jtdm0uc2V0Q3JlYXRpb25UeEZlZShuZXcgQk4oMTApKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjE6IEJ1ZmZlcltdID0gYWRkcnMxLm1hcChcclxuICAgICAgICAoYSk6IEJ1ZmZlciA9PiBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMjogQnVmZmVyW10gPSBhZGRyczIubWFwKFxyXG4gICAgICAgIChhKTogQnVmZmVyID0+IHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzOiBCdWZmZXJbXSA9IGFkZHJzMy5tYXAoXHJcbiAgICAgICAgKGEpOiBCdWZmZXIgPT4gcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcclxuICAgICAgKVxyXG5cclxuICAgICAgY29uc3QgdHh1MTogVW5zaWduZWRUeCA9IGF3YWl0IHBsYXRmb3Jtdm0uYnVpbGRDcmVhdGVBbGx5Y2hhaW5UeChcclxuICAgICAgICBzZXQsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBbYWRkcnMxWzBdXSxcclxuICAgICAgICAxLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQ3JlYXRlQWxseWNoYWluVHgoXHJcbiAgICAgICAgbmV0d29ya0lELFxyXG4gICAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoYmxvY2tjaGFpbklEKSxcclxuICAgICAgICBhZGRyYnVmZjEsXHJcbiAgICAgICAgYWRkcmJ1ZmYyLFxyXG4gICAgICAgIFthZGRyYnVmZjFbMF1dLFxyXG4gICAgICAgIDEsXHJcbiAgICAgICAgcGxhdGZvcm12bS5nZXRDcmVhdGVBbGx5Y2hhaW5UeEZlZSgpLFxyXG4gICAgICAgIGFzc2V0SUQsXHJcbiAgICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXHJcbiAgICAgICAgdHh1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICAgIClcclxuICAgICAgZXhwZWN0KHR4dTIudG9TdHJpbmcoKSkudG9CZSh0eHUxLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBjb25zdCB0eDE6IFR4ID0gdHh1MS5zaWduKHBsYXRmb3Jtdm0ua2V5Q2hhaW4oKSlcclxuICAgICAgY29uc3QgY2hlY2tUeDogc3RyaW5nID0gdHgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgICAgY29uc3QgdHgxb2JqOiBvYmplY3QgPSB0eDEuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICAgIGNvbnN0IHR4MXN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodHgxb2JqKVxyXG5cclxuICAgICAgY29uc3QgdHgybmV3b2JqOiBvYmplY3QgPSBKU09OLnBhcnNlKHR4MXN0cilcclxuICAgICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXHJcbiAgICAgIHR4Mi5kZXNlcmlhbGl6ZSh0eDJuZXdvYmosIFwiaGV4XCIpXHJcblxyXG4gICAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoY2hlY2tUeClcclxuXHJcbiAgICAgIGNvbnN0IHR4MzogVHggPSB0eHUxLnNpZ24ocGxhdGZvcm12bS5rZXlDaGFpbigpKVxyXG4gICAgICBjb25zdCB0eDNvYmo6IG9iamVjdCA9IHR4My5zZXJpYWxpemUoZGlzcGxheSlcclxuICAgICAgY29uc3QgdHgzc3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0eDNvYmopXHJcblxyXG4gICAgICBjb25zdCB0eDRuZXdvYmo6IG9iamVjdCA9IEpTT04ucGFyc2UodHgzc3RyKVxyXG4gICAgICBjb25zdCB0eDQ6IFR4ID0gbmV3IFR4KClcclxuICAgICAgdHg0LmRlc2VyaWFsaXplKHR4NG5ld29iaiwgZGlzcGxheSlcclxuXHJcbiAgICAgIGV4cGVjdCh0eDQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShjaGVja1R4KVxyXG5cclxuICAgICAgc2VyaWFsemVpdCh0eDEsIFwiQ3JlYXRlQWxseWNoYWluVHhcIilcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImJ1aWxkQ3JlYXRlQWxseWNoYWluVHgyXCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgcGxhdGZvcm12bS5zZXRDcmVhdGlvblR4RmVlKG5ldyBCTigxMCkpXHJcbiAgICAgIGNvbnN0IGFkZHJidWZmMTogQnVmZmVyW10gPSBhZGRyczEubWFwKChhOiBzdHJpbmcpID0+XHJcbiAgICAgICAgcGxhdGZvcm12bS5wYXJzZUFkZHJlc3MoYSlcclxuICAgICAgKVxyXG4gICAgICBjb25zdCBhZGRyYnVmZjI6IEJ1ZmZlcltdID0gYWRkcnMyLm1hcCgoYTogc3RyaW5nKSA9PlxyXG4gICAgICAgIHBsYXRmb3Jtdm0ucGFyc2VBZGRyZXNzKGEpXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgYWRkcmJ1ZmYzOiBCdWZmZXJbXSA9IGFkZHJzMy5tYXAoKGE6IHN0cmluZykgPT5cclxuICAgICAgICBwbGF0Zm9ybXZtLnBhcnNlQWRkcmVzcyhhKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUxOiBVbnNpZ25lZFR4ID0gYXdhaXQgcGxhdGZvcm12bS5idWlsZENyZWF0ZUFsbHljaGFpblR4KFxyXG4gICAgICAgIGxzZXQsXHJcbiAgICAgICAgYWRkcnMxLFxyXG4gICAgICAgIGFkZHJzMixcclxuICAgICAgICBbYWRkcnMxWzBdXSxcclxuICAgICAgICAxLFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLFxyXG4gICAgICAgIFVuaXhOb3coKVxyXG4gICAgICApXHJcblxyXG4gICAgICBjb25zdCB0eHUyOiBVbnNpZ25lZFR4ID0gbHNldC5idWlsZENyZWF0ZUFsbHljaGFpblR4KFxyXG4gICAgICAgIG5ldHdvcmtJRCxcclxuICAgICAgICBiaW50b29scy5jYjU4RGVjb2RlKGJsb2NrY2hhaW5JRCksXHJcbiAgICAgICAgYWRkcmJ1ZmYxLFxyXG4gICAgICAgIGFkZHJidWZmMixcclxuICAgICAgICBbYWRkcmJ1ZmYxWzBdXSxcclxuICAgICAgICAxLFxyXG4gICAgICAgIHBsYXRmb3Jtdm0uZ2V0Q3JlYXRlQWxseWNoYWluVHhGZWUoKSxcclxuICAgICAgICBhc3NldElELFxyXG4gICAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcclxuICAgICAgICBVbml4Tm93KClcclxuICAgICAgKVxyXG4gICAgICBleHBlY3QodHh1Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICAgIHR4dTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdCh0eHUyLnRvU3RyaW5nKCkpLnRvQmUodHh1MS50b1N0cmluZygpKVxyXG4gICAgfSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZ2V0UmV3YXJkVVRYT3NcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgY29uc3QgdHhJRDogc3RyaW5nID0gXCI3c2lrM1ByNnIxRmVMcnZLMW9Xd0VDQlM4aUo1VlB1U2hcIlxyXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEdldFJld2FyZFVUWE9zUmVzcG9uc2U+ID0gYXBpLmdldFJld2FyZFVUWE9zKHR4SUQpXHJcbiAgICBjb25zdCBwYXlsb2FkOiBvYmplY3QgPSB7XHJcbiAgICAgIHJlc3VsdDogeyBudW1GZXRjaGVkOiBcIjBcIiwgdXR4b3M6IFtdLCBlbmNvZGluZzogXCJjYjU4XCIgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzcG9uc2VPYmo6IEh0dHBSZXNwb25zZSA9IHtcclxuICAgICAgZGF0YTogcGF5bG9hZFxyXG4gICAgfVxyXG5cclxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXHJcbiAgICBjb25zdCByZXNwb25zZTogR2V0UmV3YXJkVVRYT3NSZXNwb25zZSA9IGF3YWl0IHJlc3VsdFxyXG5cclxuICAgIGV4cGVjdChtb2NrQXhpb3MucmVxdWVzdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICBleHBlY3QocmVzcG9uc2UpLnRvQmUocGF5bG9hZFtcInJlc3VsdFwiXSlcclxuICB9KVxyXG59KVxyXG4iXX0=