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
const utxos_1 = require("../../../src/apis/avm/utxos");
const api_1 = require("../../../src/apis/avm/api");
const tx_1 = require("../../../src/apis/avm/tx");
const keychain_1 = require("../../../src/apis/avm/keychain");
const inputs_1 = require("../../../src/apis/avm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/avm/outputs");
const constants_1 = require("../../../src/apis/avm/constants");
const ops_1 = require("../../../src/apis/avm/ops");
const index_1 = require("../../../src/index");
const payload_1 = require("../../../src/utils/payload");
const initialstates_1 = require("../../../src/apis/avm/initialstates");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const basetx_1 = require("../../../src/apis/avm/basetx");
const createassettx_1 = require("../../../src/apis/avm/createassettx");
const operationtx_1 = require("../../../src/apis/avm/operationtx");
const importtx_1 = require("../../../src/apis/avm/importtx");
const exporttx_1 = require("../../../src/apis/avm/exporttx");
const constants_2 = require("../../../src/utils/constants");
const constants_3 = require("../../../src/utils/constants");
const constants_4 = require("../../../src/utils/constants");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("Transactions", () => {
    let set;
    let keymgr1;
    let keymgr2;
    let keymgr3;
    let addrs1;
    let addrs2;
    let addrs3;
    let utxos;
    let inputs;
    let outputs;
    let ops;
    let importIns;
    let importUTXOs;
    let exportOuts;
    let fungutxos;
    let exportUTXOIDS;
    let api;
    const amnt = 10000;
    const netid = 12345;
    const bID = constants_3.Defaults.network[netid].Swap.blockchainID;
    const alias = "Swap";
    const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("Well, now, don't you tell me to smile, you stick around I'll make it worth your while.")
        .digest());
    const NFTassetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("I can't stand it, I know you planned it, I'mma set straight this Watergate.'")
        .digest());
    const codecID_zero = 0;
    const codecID_one = 1;
    let amount;
    let addresses;
    let fallAddresses;
    let locktime;
    let fallLocktime;
    let threshold;
    let fallThreshold;
    const nftutxoids = [];
    const ip = "127.0.0.1";
    const port = 8080;
    const protocol = "http";
    let axia;
    const blockchainID = bintools.cb58Decode(bID);
    const name = "Mortycoin is the dumb as a sack of hammers.";
    const symbol = "morT";
    const denomination = 8;
    let axcAssetID;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        axia = new index_1.Axia(ip, port, protocol, netid, undefined, undefined, undefined, true);
        api = new api_1.AVMAPI(axia, "/ext/bc/avm", bID);
        const result = api.getAXCAssetID();
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
        axcAssetID = yield result;
    }));
    beforeEach(() => {
        set = new utxos_1.UTXOSet();
        keymgr1 = new keychain_1.KeyChain(axia.getHRP(), alias);
        keymgr2 = new keychain_1.KeyChain(axia.getHRP(), alias);
        keymgr3 = new keychain_1.KeyChain(axia.getHRP(), alias);
        addrs1 = [];
        addrs2 = [];
        addrs3 = [];
        utxos = [];
        inputs = [];
        outputs = [];
        importIns = [];
        importUTXOs = [];
        exportOuts = [];
        fungutxos = [];
        exportUTXOIDS = [];
        ops = [];
        for (let i = 0; i < 3; i++) {
            addrs1.push(keymgr1.makeKey().getAddress());
            addrs2.push(keymgr2.makeKey().getAddress());
            addrs3.push(keymgr3.makeKey().getAddress());
        }
        amount = constants_4.ONEAXC.mul(new bn_js_1.default(amnt));
        addresses = keymgr1.getAddresses();
        fallAddresses = keymgr2.getAddresses();
        locktime = new bn_js_1.default(54321);
        fallLocktime = locktime.add(new bn_js_1.default(50));
        threshold = 3;
        fallThreshold = 1;
        const payload = buffer_1.Buffer.alloc(1024);
        payload.write("All you Trekkies and TV addicts, Don't mean to diss don't mean to bring static.", 0, 1024, "utf8");
        for (let i = 0; i < 5; i++) {
            let txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                .digest());
            let txidx = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(i), 4));
            const out = new outputs_1.SECPTransferOutput(amount, addresses, locktime, threshold);
            const xferout = new outputs_1.TransferableOutput(assetID, out);
            outputs.push(xferout);
            const u = new utxos_1.UTXO(constants_1.AVMConstants.LATESTCODEC, txid, txidx, assetID, out);
            utxos.push(u);
            fungutxos.push(u);
            importUTXOs.push(u);
            txid = u.getTxID();
            txidx = u.getOutputIdx();
            const input = new inputs_1.SECPTransferInput(amount);
            const xferin = new inputs_1.TransferableInput(txid, txidx, assetID, input);
            inputs.push(xferin);
            const nout = new outputs_1.NFTTransferOutput(1000 + i, payload, addresses, locktime, threshold);
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
        for (let i = 1; i < 4; i++) {
            importIns.push(inputs[i]);
            exportOuts.push(outputs[i]);
            exportUTXOIDS.push(fungutxos[i].getUTXOID());
        }
        set.addArray(utxos);
    });
    test("BaseTx codecIDs", () => {
        const baseTx = new basetx_1.BaseTx();
        expect(baseTx.getCodecID()).toBe(codecID_zero);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX);
        baseTx.setCodecID(codecID_one);
        expect(baseTx.getCodecID()).toBe(codecID_one);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX_CODECONE);
        baseTx.setCodecID(codecID_zero);
        expect(baseTx.getCodecID()).toBe(codecID_zero);
        expect(baseTx.getTypeID()).toBe(constants_1.AVMConstants.BASETX);
    });
    test("Invalid BaseTx codecID", () => {
        const baseTx = new basetx_1.BaseTx();
        expect(() => {
            baseTx.setCodecID(2);
        }).toThrow("Error - BaseTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("CreateAssetTx codecIDs", () => {
        const createAssetTx = new createassettx_1.CreateAssetTx();
        expect(createAssetTx.getCodecID()).toBe(codecID_zero);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX);
        createAssetTx.setCodecID(codecID_one);
        expect(createAssetTx.getCodecID()).toBe(codecID_one);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX_CODECONE);
        createAssetTx.setCodecID(codecID_zero);
        expect(createAssetTx.getCodecID()).toBe(codecID_zero);
        expect(createAssetTx.getTypeID()).toBe(constants_1.AVMConstants.CREATEASSETTX);
    });
    test("Invalid CreateAssetTx codecID", () => {
        const createAssetTx = new createassettx_1.CreateAssetTx();
        expect(() => {
            createAssetTx.setCodecID(2);
        }).toThrow("Error - CreateAssetTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("OperationTx codecIDs", () => {
        const operationTx = new operationtx_1.OperationTx();
        expect(operationTx.getCodecID()).toBe(codecID_zero);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX);
        operationTx.setCodecID(codecID_one);
        expect(operationTx.getCodecID()).toBe(codecID_one);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX_CODECONE);
        operationTx.setCodecID(codecID_zero);
        expect(operationTx.getCodecID()).toBe(codecID_zero);
        expect(operationTx.getTypeID()).toBe(constants_1.AVMConstants.OPERATIONTX);
    });
    test("Invalid OperationTx codecID", () => {
        const operationTx = new operationtx_1.OperationTx();
        expect(() => {
            operationTx.setCodecID(2);
        }).toThrow("Error - OperationTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("ImportTx codecIDs", () => {
        const importTx = new importtx_1.ImportTx();
        expect(importTx.getCodecID()).toBe(codecID_zero);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX);
        importTx.setCodecID(codecID_one);
        expect(importTx.getCodecID()).toBe(codecID_one);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX_CODECONE);
        importTx.setCodecID(codecID_zero);
        expect(importTx.getCodecID()).toBe(codecID_zero);
        expect(importTx.getTypeID()).toBe(constants_1.AVMConstants.IMPORTTX);
    });
    test("Invalid ImportTx codecID", () => {
        const importTx = new importtx_1.ImportTx();
        expect(() => {
            importTx.setCodecID(2);
        }).toThrow("Error - ImportTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("ExportTx codecIDs", () => {
        const exportTx = new exporttx_1.ExportTx();
        expect(exportTx.getCodecID()).toBe(codecID_zero);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX);
        exportTx.setCodecID(codecID_one);
        expect(exportTx.getCodecID()).toBe(codecID_one);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX_CODECONE);
        exportTx.setCodecID(codecID_zero);
        expect(exportTx.getCodecID()).toBe(codecID_zero);
        expect(exportTx.getTypeID()).toBe(constants_1.AVMConstants.EXPORTTX);
    });
    test("Invalid ExportTx codecID", () => {
        const exportTx = new exporttx_1.ExportTx();
        expect(() => {
            exportTx.setCodecID(2);
        }).toThrow("Error - ExportTx.setCodecID: invalid codecID. Valid codecIDs are 0 and 1.");
    });
    test("Create small BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(axcAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, axcAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create small BaseTx with bad txid", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(axcAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        expect(() => {
            const txid = bintools.cb58Decode("n8XHaaaa5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        }).toThrow("Error - BinTools.cb58Decode: invalid checksum");
    }));
    test("confirm inputTotal, outputTotal and fee are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        // AXC assetID
        const assetID = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("266");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(assetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, assetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        const inputTotal = unsignedTx.getInputTotal(assetID);
        const outputTotal = unsignedTx.getOutputTotal(assetID);
        const burn = unsignedTx.getBurn(assetID);
        expect(inputTotal.toNumber()).toEqual(new bn_js_1.default(400).toNumber());
        expect(outputTotal.toNumber()).toEqual(new bn_js_1.default(266).toNumber());
        expect(burn.toNumber()).toEqual(new bn_js_1.default(134).toNumber());
    }));
    test("Create small BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("267");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(axcAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("400");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, axcAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create large BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("609555500000");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(axcAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("45000000000000000");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, axcAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(false);
    }));
    test("Create large BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        const outs = [];
        const ins = [];
        const outputAmt = new bn_js_1.default("44995609555500000");
        const output = new outputs_1.SECPTransferOutput(outputAmt, addrs1, new bn_js_1.default(0), 1);
        const transferableOutput = new outputs_1.TransferableOutput(axcAssetID, output);
        outs.push(transferableOutput);
        const inputAmt = new bn_js_1.default("45000000000000000");
        const input = new inputs_1.SECPTransferInput(inputAmt);
        input.addSignatureIdx(0, addrs1[0]);
        const txid = bintools.cb58Decode("n8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        const outputIndex = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(0), 4));
        const transferableInput = new inputs_1.TransferableInput(txid, outputIndex, axcAssetID, input);
        ins.push(transferableInput);
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("bad asset ID", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => {
            const assetID = bintools.cb58Decode("badaaaan8XH5JY1EX5VYqDeAhB4Zd4GKxi9UNQy6oPpMsCAj1Q6xkiiL");
        }).toThrow();
    }));
    test("Creation UnsignedTx", () => {
        const baseTx = new basetx_1.BaseTx(netid, blockchainID, outputs, inputs);
        const txu = new tx_1.UnsignedTx(baseTx);
        const txins = txu.getTransaction().getIns();
        const txouts = txu.getTransaction().getOuts();
        expect(txins.length).toBe(inputs.length);
        expect(txouts.length).toBe(outputs.length);
        expect(txu.getTransaction().getTxType()).toBe(0);
        expect(txu.getTransaction().getNetworkID()).toBe(12345);
        expect(txu.getTransaction().getBlockchainID().toString("hex")).toBe(blockchainID.toString("hex"));
        let a = [];
        let b = [];
        for (let i = 0; i < txins.length; i++) {
            a.push(txins[i].toString());
            b.push(inputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        a = [];
        b = [];
        for (let i = 0; i < txouts.length; i++) {
            a.push(txouts[i].toString());
            b.push(outputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        const txunew = new tx_1.UnsignedTx();
        txunew.fromBuffer(txu.toBuffer());
        expect(txunew.toBuffer().toString("hex")).toBe(txu.toBuffer().toString("hex"));
        expect(txunew.toString()).toBe(txu.toString());
    });
    test("Creation UnsignedTx Check Amount", () => {
        expect(() => {
            set.buildBaseTx(netid, blockchainID, constants_4.ONEAXC.mul(new bn_js_1.default(amnt * 10000)), assetID, addrs3, addrs1, addrs1);
        }).toThrow();
    });
    test("CreateAssetTX", () => {
        const secpbase1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(777), addrs3, locktime, 1);
        const secpbase2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(888), addrs2, locktime, 1);
        const secpbase3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(999), addrs2, locktime, 1);
        const initialState = new initialstates_1.InitialStates();
        initialState.addOutput(secpbase1, constants_1.AVMConstants.SECPFXID);
        initialState.addOutput(secpbase2, constants_1.AVMConstants.SECPFXID);
        initialState.addOutput(secpbase3, constants_1.AVMConstants.SECPFXID);
        const name = "Rickcoin is the most intelligent coin";
        const symbol = "RICK";
        const denomination = 9;
        const txu = new createassettx_1.CreateAssetTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), name, symbol, denomination, initialState);
        const txins = txu.getIns();
        const txouts = txu.getOuts();
        const initState = txu.getInitialStates();
        expect(txins.length).toBe(inputs.length);
        expect(txouts.length).toBe(outputs.length);
        expect(initState.toBuffer().toString("hex")).toBe(initialState.toBuffer().toString("hex"));
        expect(txu.getTxType()).toBe(constants_1.AVMConstants.CREATEASSETTX);
        expect(txu.getNetworkID()).toBe(12345);
        expect(txu.getBlockchainID().toString("hex")).toBe(blockchainID.toString("hex"));
        expect(txu.getName()).toBe(name);
        expect(txu.getSymbol()).toBe(symbol);
        expect(txu.getDenomination()).toBe(denomination);
        expect(txu.getDenominationBuffer().readUInt8(0)).toBe(denomination);
        let a = [];
        let b = [];
        for (let i = 0; i < txins.length; i++) {
            a.push(txins[i].toString());
            b.push(inputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        a = [];
        b = [];
        for (let i = 0; i < txouts.length; i++) {
            a.push(txouts[i].toString());
            b.push(outputs[i].toString());
        }
        expect(JSON.stringify(a.sort())).toBe(JSON.stringify(b.sort()));
        const txunew = new createassettx_1.CreateAssetTx();
        txunew.fromBuffer(txu.toBuffer());
        expect(txunew.toBuffer().toString("hex")).toBe(txu.toBuffer().toString("hex"));
        expect(txunew.toString()).toBe(txu.toString());
    });
    test("Creation OperationTx", () => {
        const optx = new operationtx_1.OperationTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), ops);
        const txunew = new operationtx_1.OperationTx();
        const opbuff = optx.toBuffer();
        txunew.fromBuffer(opbuff);
        expect(txunew.toBuffer().toString("hex")).toBe(opbuff.toString("hex"));
        expect(txunew.toString()).toBe(optx.toString());
        expect(optx.getOperations().length).toBe(ops.length);
    });
    test("Creation ImportTx", () => {
        const bombtx = new importtx_1.ImportTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), undefined, importIns);
        expect(() => {
            bombtx.toBuffer();
        }).toThrow();
        const importTx = new importtx_1.ImportTx(netid, blockchainID, outputs, inputs, new payload_1.UTF8Payload("hello world").getPayload(), bintools.cb58Decode(constants_2.PlatformChainID), importIns);
        const txunew = new importtx_1.ImportTx();
        const importbuff = importTx.toBuffer();
        txunew.fromBuffer(importbuff);
        expect(importTx).toBeInstanceOf(importtx_1.ImportTx);
        expect(importTx.getSourceChain().toString("hex")).toBe(bintools.cb58Decode(constants_2.PlatformChainID).toString("hex"));
        expect(txunew.toBuffer().toString("hex")).toBe(importbuff.toString("hex"));
        expect(txunew.toString()).toBe(importTx.toString());
        expect(importTx.getImportInputs().length).toBe(importIns.length);
    });
    test("Creation ExportTx", () => {
        const bombtx = new exporttx_1.ExportTx(netid, blockchainID, outputs, inputs, undefined, undefined, exportOuts);
        expect(() => {
            bombtx.toBuffer();
        }).toThrow();
        const exportTx = new exporttx_1.ExportTx(netid, blockchainID, outputs, inputs, undefined, bintools.cb58Decode(constants_2.PlatformChainID), exportOuts);
        const txunew = new exporttx_1.ExportTx();
        const exportbuff = exportTx.toBuffer();
        txunew.fromBuffer(exportbuff);
        expect(exportTx).toBeInstanceOf(exporttx_1.ExportTx);
        expect(exportTx.getDestinationChain().toString("hex")).toBe(bintools.cb58Decode(constants_2.PlatformChainID).toString("hex"));
        expect(txunew.toBuffer().toString("hex")).toBe(exportbuff.toString("hex"));
        expect(txunew.toString()).toBe(exportTx.toString());
        expect(exportTx.getExportOutputs().length).toBe(exportOuts.length);
    });
    test("Creation Tx1 with asof, locktime, threshold", () => {
        const txu = set.buildBaseTx(netid, blockchainID, new bn_js_1.default(9000), assetID, addrs3, addrs1, addrs1, undefined, undefined, undefined, (0, helperfunctions_1.UnixNow)(), (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(50)), 1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromString(tx.toString());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
        expect(tx2.toString()).toBe(tx.toString());
    });
    test("Creation Tx2 without asof, locktime, threshold", () => {
        const txu = set.buildBaseTx(netid, blockchainID, new bn_js_1.default(9000), assetID, addrs3, addrs1, addrs1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
        expect(tx2.toString()).toBe(tx.toString());
    });
    test("Creation Tx3 using OperationTx", () => {
        const txu = set.buildNFTTransferTx(netid, blockchainID, addrs3, addrs1, addrs2, nftutxoids, new bn_js_1.default(90), axcAssetID, undefined, (0, helperfunctions_1.UnixNow)(), (0, helperfunctions_1.UnixNow)().add(new bn_js_1.default(50)), 1);
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
    });
    test("Creation Tx4 using ImportTx", () => {
        const txu = set.buildImportTx(netid, blockchainID, addrs3, addrs1, addrs2, importUTXOs, bintools.cb58Decode(constants_2.PlatformChainID), new bn_js_1.default(90), assetID, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx2.toBuffer().toString("hex")).toBe(tx.toBuffer().toString("hex"));
    });
    test("Creation Tx5 using ExportTx", () => {
        const txu = set.buildExportTx(netid, blockchainID, new bn_js_1.default(90), axcAssetID, addrs3, addrs1, addrs2, bintools.cb58Decode(constants_2.PlatformChainID), undefined, undefined, new payload_1.UTF8Payload("hello world").getPayload(), (0, helperfunctions_1.UnixNow)());
        const tx = txu.sign(keymgr1);
        const tx2 = new tx_1.Tx();
        tx2.fromBuffer(tx.toBuffer());
        expect(tx.toBuffer().toString("hex")).toBe(tx2.toBuffer().toString("hex"));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvYXZtL3R4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBdUM7QUFDdkMsdURBQTJEO0FBQzNELG1EQUFrRDtBQUNsRCxpREFBeUQ7QUFDekQsNkRBQXlEO0FBQ3pELHlEQUdxQztBQUNyQyw4REFBb0M7QUFDcEMsMkVBQWtEO0FBQ2xELGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsMkRBSXNDO0FBQ3RDLCtEQUE4RDtBQUM5RCxtREFHa0M7QUFDbEMsOENBQXlDO0FBQ3pDLHdEQUF3RDtBQUN4RCx1RUFBbUU7QUFDbkUsd0VBQTREO0FBQzVELHlEQUFxRDtBQUNyRCx1RUFBbUU7QUFDbkUsbUVBQStEO0FBQy9ELDZEQUF5RDtBQUN6RCw2REFBeUQ7QUFDekQsNERBQThEO0FBQzlELDREQUF1RDtBQUN2RCw0REFBcUQ7QUFHckQ7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBUyxFQUFFO0lBQ2xDLElBQUksR0FBWSxDQUFBO0lBQ2hCLElBQUksT0FBaUIsQ0FBQTtJQUNyQixJQUFJLE9BQWlCLENBQUE7SUFDckIsSUFBSSxPQUFpQixDQUFBO0lBQ3JCLElBQUksTUFBZ0IsQ0FBQTtJQUNwQixJQUFJLE1BQWdCLENBQUE7SUFDcEIsSUFBSSxNQUFnQixDQUFBO0lBQ3BCLElBQUksS0FBYSxDQUFBO0lBQ2pCLElBQUksTUFBMkIsQ0FBQTtJQUMvQixJQUFJLE9BQTZCLENBQUE7SUFDakMsSUFBSSxHQUE0QixDQUFBO0lBQ2hDLElBQUksU0FBOEIsQ0FBQTtJQUNsQyxJQUFJLFdBQW1CLENBQUE7SUFDdkIsSUFBSSxVQUFnQyxDQUFBO0lBQ3BDLElBQUksU0FBaUIsQ0FBQTtJQUNyQixJQUFJLGFBQXVC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QUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9ja0F4aW9zIGZyb20gXCJqZXN0LW1vY2stYXhpb3NcIlxuaW1wb3J0IHsgVVRYT1NldCwgVVRYTyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vdXR4b3NcIlxuaW1wb3J0IHsgQVZNQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9hcGlcIlxuaW1wb3J0IHsgVW5zaWduZWRUeCwgVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3R4XCJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9rZXljaGFpblwiXG5pbXBvcnQge1xuICBTRUNQVHJhbnNmZXJJbnB1dCxcbiAgVHJhbnNmZXJhYmxlSW5wdXRcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbnB1dHNcIlxuaW1wb3J0IGNyZWF0ZUhhc2ggZnJvbSBcImNyZWF0ZS1oYXNoXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IHtcbiAgU0VDUFRyYW5zZmVyT3V0cHV0LFxuICBORlRUcmFuc2Zlck91dHB1dCxcbiAgVHJhbnNmZXJhYmxlT3V0cHV0XG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vb3V0cHV0c1wiXG5pbXBvcnQgeyBBVk1Db25zdGFudHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2NvbnN0YW50c1wiXG5pbXBvcnQge1xuICBUcmFuc2ZlcmFibGVPcGVyYXRpb24sXG4gIE5GVFRyYW5zZmVyT3BlcmF0aW9uXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vb3BzXCJcbmltcG9ydCB7IEF4aWEgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2luZGV4XCJcbmltcG9ydCB7IFVURjhQYXlsb2FkIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9wYXlsb2FkXCJcbmltcG9ydCB7IEluaXRpYWxTdGF0ZXMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2luaXRpYWxzdGF0ZXNcIlxuaW1wb3J0IHsgVW5peE5vdyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vYmFzZXR4XCJcbmltcG9ydCB7IENyZWF0ZUFzc2V0VHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2NyZWF0ZWFzc2V0dHhcIlxuaW1wb3J0IHsgT3BlcmF0aW9uVHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL29wZXJhdGlvbnR4XCJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbXBvcnR0eFwiXG5pbXBvcnQgeyBFeHBvcnRUeCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vZXhwb3J0dHhcIlxuaW1wb3J0IHsgUGxhdGZvcm1DaGFpbklEIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHsgRGVmYXVsdHMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBPTkVBWEMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxuZGVzY3JpYmUoXCJUcmFuc2FjdGlvbnNcIiwgKCk6IHZvaWQgPT4ge1xuICBsZXQgc2V0OiBVVFhPU2V0XG4gIGxldCBrZXltZ3IxOiBLZXlDaGFpblxuICBsZXQga2V5bWdyMjogS2V5Q2hhaW5cbiAgbGV0IGtleW1ncjM6IEtleUNoYWluXG4gIGxldCBhZGRyczE6IEJ1ZmZlcltdXG4gIGxldCBhZGRyczI6IEJ1ZmZlcltdXG4gIGxldCBhZGRyczM6IEJ1ZmZlcltdXG4gIGxldCB1dHhvczogVVRYT1tdXG4gIGxldCBpbnB1dHM6IFRyYW5zZmVyYWJsZUlucHV0W11cbiAgbGV0IG91dHB1dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdXG4gIGxldCBvcHM6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbltdXG4gIGxldCBpbXBvcnRJbnM6IFRyYW5zZmVyYWJsZUlucHV0W11cbiAgbGV0IGltcG9ydFVUWE9zOiBVVFhPW11cbiAgbGV0IGV4cG9ydE91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdXG4gIGxldCBmdW5ndXR4b3M6IFVUWE9bXVxuICBsZXQgZXhwb3J0VVRYT0lEUzogc3RyaW5nW11cbiAgbGV0IGFwaTogQVZNQVBJXG4gIGNvbnN0IGFtbnQ6IG51bWJlciA9IDEwMDAwXG4gIGNvbnN0IG5ldGlkOiBudW1iZXIgPSAxMjM0NVxuICBjb25zdCBiSUQ6IHN0cmluZyA9IERlZmF1bHRzLm5ldHdvcmtbbmV0aWRdLlN3YXAuYmxvY2tjaGFpbklEXG4gIGNvbnN0IGFsaWFzOiBzdHJpbmcgPSBcIlN3YXBcIlxuICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAudXBkYXRlKFxuICAgICAgICBcIldlbGwsIG5vdywgZG9uJ3QgeW91IHRlbGwgbWUgdG8gc21pbGUsIHlvdSBzdGljayBhcm91bmQgSSdsbCBtYWtlIGl0IHdvcnRoIHlvdXIgd2hpbGUuXCJcbiAgICAgIClcbiAgICAgIC5kaWdlc3QoKVxuICApXG4gIGNvbnN0IE5GVGFzc2V0SUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgIC51cGRhdGUoXG4gICAgICAgIFwiSSBjYW4ndCBzdGFuZCBpdCwgSSBrbm93IHlvdSBwbGFubmVkIGl0LCBJJ21tYSBzZXQgc3RyYWlnaHQgdGhpcyBXYXRlcmdhdGUuJ1wiXG4gICAgICApXG4gICAgICAuZGlnZXN0KClcbiAgKVxuICBjb25zdCBjb2RlY0lEX3plcm86IG51bWJlciA9IDBcbiAgY29uc3QgY29kZWNJRF9vbmU6IG51bWJlciA9IDFcbiAgbGV0IGFtb3VudDogQk5cbiAgbGV0IGFkZHJlc3NlczogQnVmZmVyW11cbiAgbGV0IGZhbGxBZGRyZXNzZXM6IEJ1ZmZlcltdXG4gIGxldCBsb2NrdGltZTogQk5cbiAgbGV0IGZhbGxMb2NrdGltZTogQk5cbiAgbGV0IHRocmVzaG9sZDogbnVtYmVyXG4gIGxldCBmYWxsVGhyZXNob2xkOiBudW1iZXJcbiAgY29uc3QgbmZ0dXR4b2lkczogc3RyaW5nW10gPSBbXVxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBcIlxuICBsZXQgYXhpYTogQXhpYVxuICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoYklEKVxuICBjb25zdCBuYW1lOiBzdHJpbmcgPSBcIk1vcnR5Y29pbiBpcyB0aGUgZHVtYiBhcyBhIHNhY2sgb2YgaGFtbWVycy5cIlxuICBjb25zdCBzeW1ib2w6IHN0cmluZyA9IFwibW9yVFwiXG4gIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxuICBsZXQgYXhjQXNzZXRJRDogQnVmZmVyXG5cbiAgYmVmb3JlQWxsKGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBheGlhID0gbmV3IEF4aWEoXG4gICAgICBpcCxcbiAgICAgIHBvcnQsXG4gICAgICBwcm90b2NvbCxcbiAgICAgIG5ldGlkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdHJ1ZVxuICAgIClcbiAgICBhcGkgPSBuZXcgQVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9hdm1cIiwgYklEKVxuXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBhcGkuZ2V0QVhDQXNzZXRJRCgpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN5bWJvbCxcbiAgICAgICAgYXNzZXRJRDogYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcbiAgICAgICAgZGVub21pbmF0aW9uOiBgJHtkZW5vbWluYXRpb259YFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgYXhjQXNzZXRJRCA9IGF3YWl0IHJlc3VsdFxuICB9KVxuXG4gIGJlZm9yZUVhY2goKCk6IHZvaWQgPT4ge1xuICAgIHNldCA9IG5ldyBVVFhPU2V0KClcbiAgICBrZXltZ3IxID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGtleW1ncjIgPSBuZXcgS2V5Q2hhaW4oYXhpYS5nZXRIUlAoKSwgYWxpYXMpXG4gICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcbiAgICBhZGRyczEgPSBbXVxuICAgIGFkZHJzMiA9IFtdXG4gICAgYWRkcnMzID0gW11cbiAgICB1dHhvcyA9IFtdXG4gICAgaW5wdXRzID0gW11cbiAgICBvdXRwdXRzID0gW11cbiAgICBpbXBvcnRJbnMgPSBbXVxuICAgIGltcG9ydFVUWE9zID0gW11cbiAgICBleHBvcnRPdXRzID0gW11cbiAgICBmdW5ndXR4b3MgPSBbXVxuICAgIGV4cG9ydFVUWE9JRFMgPSBbXVxuICAgIG9wcyA9IFtdXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgYWRkcnMxLnB1c2goa2V5bWdyMS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgYWRkcnMyLnB1c2goa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgYWRkcnMzLnB1c2goa2V5bWdyMy5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgIH1cbiAgICBhbW91bnQgPSBPTkVBWEMubXVsKG5ldyBCTihhbW50KSlcbiAgICBhZGRyZXNzZXMgPSBrZXltZ3IxLmdldEFkZHJlc3NlcygpXG4gICAgZmFsbEFkZHJlc3NlcyA9IGtleW1ncjIuZ2V0QWRkcmVzc2VzKClcbiAgICBsb2NrdGltZSA9IG5ldyBCTig1NDMyMSlcbiAgICBmYWxsTG9ja3RpbWUgPSBsb2NrdGltZS5hZGQobmV3IEJOKDUwKSlcbiAgICB0aHJlc2hvbGQgPSAzXG4gICAgZmFsbFRocmVzaG9sZCA9IDFcblxuICAgIGNvbnN0IHBheWxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxMDI0KVxuICAgIHBheWxvYWQud3JpdGUoXG4gICAgICBcIkFsbCB5b3UgVHJla2tpZXMgYW5kIFRWIGFkZGljdHMsIERvbid0IG1lYW4gdG8gZGlzcyBkb24ndCBtZWFuIHRvIGJyaW5nIHN0YXRpYy5cIixcbiAgICAgIDAsXG4gICAgICAxMDI0LFxuICAgICAgXCJ1dGY4XCJcbiAgICApXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICBsZXQgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTihpKSwgMzIpKVxuICAgICAgICAgIC5kaWdlc3QoKVxuICAgICAgKVxuICAgICAgbGV0IHR4aWR4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDQpKVxuICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQsXG4gICAgICAgIGFkZHJlc3NlcyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXG4gICAgICBvdXRwdXRzLnB1c2goeGZlcm91dClcblxuICAgICAgY29uc3QgdTogVVRYTyA9IG5ldyBVVFhPKFxuICAgICAgICBBVk1Db25zdGFudHMuTEFURVNUQ09ERUMsXG4gICAgICAgIHR4aWQsXG4gICAgICAgIHR4aWR4LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBvdXRcbiAgICAgIClcbiAgICAgIHV0eG9zLnB1c2godSlcbiAgICAgIGZ1bmd1dHhvcy5wdXNoKHUpXG4gICAgICBpbXBvcnRVVFhPcy5wdXNoKHUpXG5cbiAgICAgIHR4aWQgPSB1LmdldFR4SUQoKVxuICAgICAgdHhpZHggPSB1LmdldE91dHB1dElkeCgpXG5cbiAgICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXG4gICAgICBjb25zdCB4ZmVyaW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgICB0eGlkLFxuICAgICAgICB0eGlkeCxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgaW5wdXRcbiAgICAgIClcbiAgICAgIGlucHV0cy5wdXNoKHhmZXJpbilcblxuICAgICAgY29uc3Qgbm91dDogTkZUVHJhbnNmZXJPdXRwdXQgPSBuZXcgTkZUVHJhbnNmZXJPdXRwdXQoXG4gICAgICAgIDEwMDAgKyBpLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBhZGRyZXNzZXMsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IG9wOiBORlRUcmFuc2Zlck9wZXJhdGlvbiA9IG5ldyBORlRUcmFuc2Zlck9wZXJhdGlvbihub3V0KVxuICAgICAgY29uc3QgbmZ0dHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgICAudXBkYXRlKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigxMDAwICsgaSksIDMyKSlcbiAgICAgICAgICAuZGlnZXN0KClcbiAgICAgIClcbiAgICAgIGNvbnN0IG5mdHV0eG86IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgQVZNQ29uc3RhbnRzLkxBVEVTVENPREVDLFxuICAgICAgICBuZnR0eGlkLFxuICAgICAgICAxMDAwICsgaSxcbiAgICAgICAgTkZUYXNzZXRJRCxcbiAgICAgICAgbm91dFxuICAgICAgKVxuICAgICAgbmZ0dXR4b2lkcy5wdXNoKG5mdHV0eG8uZ2V0VVRYT0lEKCkpXG4gICAgICBjb25zdCB4ZmVyb3A6IFRyYW5zZmVyYWJsZU9wZXJhdGlvbiA9IG5ldyBUcmFuc2ZlcmFibGVPcGVyYXRpb24oXG4gICAgICAgIE5GVGFzc2V0SUQsXG4gICAgICAgIFtuZnR1dHhvLmdldFVUWE9JRCgpXSxcbiAgICAgICAgb3BcbiAgICAgIClcbiAgICAgIG9wcy5wdXNoKHhmZXJvcClcbiAgICAgIHV0eG9zLnB1c2gobmZ0dXR4bylcbiAgICB9XG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IDQ7IGkrKykge1xuICAgICAgaW1wb3J0SW5zLnB1c2goaW5wdXRzW2ldKVxuICAgICAgZXhwb3J0T3V0cy5wdXNoKG91dHB1dHNbaV0pXG4gICAgICBleHBvcnRVVFhPSURTLnB1c2goZnVuZ3V0eG9zW2ldLmdldFVUWE9JRCgpKVxuICAgIH1cbiAgICBzZXQuYWRkQXJyYXkodXR4b3MpXG4gIH0pXG5cbiAgdGVzdChcIkJhc2VUeCBjb2RlY0lEc1wiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KClcbiAgICBleHBlY3QoYmFzZVR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGJhc2VUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuQkFTRVRYKVxuICAgIGJhc2VUeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkJBU0VUWF9DT0RFQ09ORSlcbiAgICBiYXNlVHguc2V0Q29kZWNJRChjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGJhc2VUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChiYXNlVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkJBU0VUWClcbiAgfSlcblxuICB0ZXN0KFwiSW52YWxpZCBCYXNlVHggY29kZWNJRFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KClcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgYmFzZVR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIEJhc2VUeC5zZXRDb2RlY0lEOiBpbnZhbGlkIGNvZGVjSUQuIFZhbGlkIGNvZGVjSURzIGFyZSAwIGFuZCAxLlwiXG4gICAgKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGVBc3NldFR4IGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjcmVhdGVBc3NldFR4OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGNyZWF0ZUFzc2V0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkNSRUFURUFTU0VUVFgpXG4gICAgY3JlYXRlQXNzZXRUeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoY3JlYXRlQXNzZXRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuQ1JFQVRFQVNTRVRUWF9DT0RFQ09ORSlcbiAgICBjcmVhdGVBc3NldFR4LnNldENvZGVjSUQoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChjcmVhdGVBc3NldFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGNyZWF0ZUFzc2V0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkNSRUFURUFTU0VUVFgpXG4gIH0pXG5cbiAgdGVzdChcIkludmFsaWQgQ3JlYXRlQXNzZXRUeCBjb2RlY0lEXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBjcmVhdGVBc3NldFR4OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoKVxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBjcmVhdGVBc3NldFR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIENyZWF0ZUFzc2V0VHguc2V0Q29kZWNJRDogaW52YWxpZCBjb2RlY0lELiBWYWxpZCBjb2RlY0lEcyBhcmUgMCBhbmQgMS5cIlxuICAgIClcbiAgfSlcblxuICB0ZXN0KFwiT3BlcmF0aW9uVHggY29kZWNJRHNcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wZXJhdGlvblR4OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeCgpXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5PUEVSQVRJT05UWClcbiAgICBvcGVyYXRpb25UeC5zZXRDb2RlY0lEKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChvcGVyYXRpb25UeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF9vbmUpXG4gICAgZXhwZWN0KG9wZXJhdGlvblR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5PUEVSQVRJT05UWF9DT0RFQ09ORSlcbiAgICBvcGVyYXRpb25UeC5zZXRDb2RlY0lEKGNvZGVjSURfemVybylcbiAgICBleHBlY3Qob3BlcmF0aW9uVHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICBleHBlY3Qob3BlcmF0aW9uVHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLk9QRVJBVElPTlRYKVxuICB9KVxuXG4gIHRlc3QoXCJJbnZhbGlkIE9wZXJhdGlvblR4IGNvZGVjSURcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9wZXJhdGlvblR4OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeCgpXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIG9wZXJhdGlvblR4LnNldENvZGVjSUQoMilcbiAgICB9KS50b1Rocm93KFxuICAgICAgXCJFcnJvciAtIE9wZXJhdGlvblR4LnNldENvZGVjSUQ6IGludmFsaWQgY29kZWNJRC4gVmFsaWQgY29kZWNJRHMgYXJlIDAgYW5kIDEuXCJcbiAgICApXG4gIH0pXG5cbiAgdGVzdChcIkltcG9ydFR4IGNvZGVjSURzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuSU1QT1JUVFgpXG4gICAgaW1wb3J0VHguc2V0Q29kZWNJRChjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfb25lKVxuICAgIGV4cGVjdChpbXBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuSU1QT1JUVFhfQ09ERUNPTkUpXG4gICAgaW1wb3J0VHguc2V0Q29kZWNJRChjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX3plcm8pXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldFR5cGVJRCgpKS50b0JlKEFWTUNvbnN0YW50cy5JTVBPUlRUWClcbiAgfSlcblxuICB0ZXN0KFwiSW52YWxpZCBJbXBvcnRUeCBjb2RlY0lEXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbXBvcnRUeDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBpbXBvcnRUeC5zZXRDb2RlY0lEKDIpXG4gICAgfSkudG9UaHJvdyhcbiAgICAgIFwiRXJyb3IgLSBJbXBvcnRUeC5zZXRDb2RlY0lEOiBpbnZhbGlkIGNvZGVjSUQuIFZhbGlkIGNvZGVjSURzIGFyZSAwIGFuZCAxLlwiXG4gICAgKVxuICB9KVxuXG4gIHRlc3QoXCJFeHBvcnRUeCBjb2RlY0lEc1wiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0Q29kZWNJRCgpKS50b0JlKGNvZGVjSURfemVybylcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkVYUE9SVFRYKVxuICAgIGV4cG9ydFR4LnNldENvZGVjSUQoY29kZWNJRF9vbmUpXG4gICAgZXhwZWN0KGV4cG9ydFR4LmdldENvZGVjSUQoKSkudG9CZShjb2RlY0lEX29uZSlcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0VHlwZUlEKCkpLnRvQmUoQVZNQ29uc3RhbnRzLkVYUE9SVFRYX0NPREVDT05FKVxuICAgIGV4cG9ydFR4LnNldENvZGVjSUQoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXRDb2RlY0lEKCkpLnRvQmUoY29kZWNJRF96ZXJvKVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXRUeXBlSUQoKSkudG9CZShBVk1Db25zdGFudHMuRVhQT1JUVFgpXG4gIH0pXG5cbiAgdGVzdChcIkludmFsaWQgRXhwb3J0VHggY29kZWNJRFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgZXhwb3J0VHguc2V0Q29kZWNJRCgyKVxuICAgIH0pLnRvVGhyb3coXG4gICAgICBcIkVycm9yIC0gRXhwb3J0VHguc2V0Q29kZWNJRDogaW52YWxpZCBjb2RlY0lELiBWYWxpZCBjb2RlY0lEcyBhcmUgMCBhbmQgMS5cIlxuICAgIClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIHNtYWxsIEJhc2VUeCB0aGF0IGlzIEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0aWQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgZXhwZWN0KGF3YWl0IGFwaS5jaGVja0dvb3NlRWdnKHVuc2lnbmVkVHgpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZSBzbWFsbCBCYXNlVHggd2l0aCBiYWQgdHhpZFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCIyNjZcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICBcIm44WEhhYWFhNUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICAgIClcbiAgICB9KS50b1Rocm93KFwiRXJyb3IgLSBCaW5Ub29scy5jYjU4RGVjb2RlOiBpbnZhbGlkIGNoZWNrc3VtXCIpXG4gIH0pXG5cbiAgdGVzdChcImNvbmZpcm0gaW5wdXRUb3RhbCwgb3V0cHV0VG90YWwgYW5kIGZlZSBhcmUgY29ycmVjdFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gQVhDIGFzc2V0SURcbiAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0aWQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgY29uc3QgaW5wdXRUb3RhbDogQk4gPSB1bnNpZ25lZFR4LmdldElucHV0VG90YWwoYXNzZXRJRClcbiAgICBjb25zdCBvdXRwdXRUb3RhbDogQk4gPSB1bnNpZ25lZFR4LmdldE91dHB1dFRvdGFsKGFzc2V0SUQpXG4gICAgY29uc3QgYnVybjogQk4gPSB1bnNpZ25lZFR4LmdldEJ1cm4oYXNzZXRJRClcbiAgICBleHBlY3QoaW5wdXRUb3RhbC50b051bWJlcigpKS50b0VxdWFsKG5ldyBCTig0MDApLnRvTnVtYmVyKCkpXG4gICAgZXhwZWN0KG91dHB1dFRvdGFsLnRvTnVtYmVyKCkpLnRvRXF1YWwobmV3IEJOKDI2NikudG9OdW1iZXIoKSlcbiAgICBleHBlY3QoYnVybi50b051bWJlcigpKS50b0VxdWFsKG5ldyBCTigxMzQpLnRvTnVtYmVyKCkpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZSBzbWFsbCBCYXNlVHggdGhhdCBpc24ndCBHb29zZSBFZ2cgVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCIyNjdcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBheGNBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgbGFyZ2UgQmFzZVR4IHRoYXQgaXMgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiNjA5NTU1NTAwMDAwXCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBheGNBc3NldElELFxuICAgICAgb3V0cHV0XG4gICAgKVxuICAgIG91dHMucHVzaCh0cmFuc2ZlcmFibGVPdXRwdXQpXG4gICAgY29uc3QgaW5wdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDUwMDAwMDAwMDAwMDAwMDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBheGNBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZShmYWxzZSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIGxhcmdlIEJhc2VUeCB0aGF0IGlzbid0IEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjQ0OTk1NjA5NTU1NTAwMDAwXCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBheGNBc3NldElELFxuICAgICAgb3V0cHV0XG4gICAgKVxuICAgIG91dHMucHVzaCh0cmFuc2ZlcmFibGVPdXRwdXQpXG4gICAgY29uc3QgaW5wdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDUwMDAwMDAwMDAwMDAwMDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBheGNBc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJiYWQgYXNzZXQgSURcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgICBcImJhZGFhYWFuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICAgIClcbiAgICB9KS50b1Rocm93KClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVW5zaWduZWRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldGlkLCBibG9ja2NoYWluSUQsIG91dHB1dHMsIGlucHV0cylcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgY29uc3QgdHhpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRJbnMoKVxuICAgIGNvbnN0IHR4b3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRPdXRzKClcbiAgICBleHBlY3QodHhpbnMubGVuZ3RoKS50b0JlKGlucHV0cy5sZW5ndGgpXG4gICAgZXhwZWN0KHR4b3V0cy5sZW5ndGgpLnRvQmUob3V0cHV0cy5sZW5ndGgpXG5cbiAgICBleHBlY3QodHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0VHhUeXBlKCkpLnRvQmUoMClcbiAgICBleHBlY3QodHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0TmV0d29ya0lEKCkpLnRvQmUoMTIzNDUpXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldEJsb2NrY2hhaW5JRCgpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgYmxvY2tjaGFpbklELnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgKVxuXG4gICAgbGV0IGE6IHN0cmluZ1tdID0gW11cbiAgICBsZXQgYjogc3RyaW5nW10gPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0eGlucy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4aW5zW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2goaW5wdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGV4cGVjdChKU09OLnN0cmluZ2lmeShhLnNvcnQoKSkpLnRvQmUoSlNPTi5zdHJpbmdpZnkoYi5zb3J0KCkpKVxuXG4gICAgYSA9IFtdXG4gICAgYiA9IFtdXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhvdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhLnB1c2godHhvdXRzW2ldLnRvU3RyaW5nKCkpXG4gICAgICBiLnB1c2gob3V0cHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGNvbnN0IHR4dW5ldzogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcih0eHUudG9CdWZmZXIoKSlcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICB0eHUudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUodHh1LnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFVuc2lnbmVkVHggQ2hlY2sgQW1vdW50XCIsICgpOiB2b2lkID0+IHtcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgc2V0LmJ1aWxkQmFzZVR4KFxuICAgICAgICBuZXRpZCxcbiAgICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgICBPTkVBWEMubXVsKG5ldyBCTihhbW50ICogMTAwMDApKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMVxuICAgICAgKVxuICAgIH0pLnRvVGhyb3coKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGVBc3NldFRYXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzZWNwYmFzZTE6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBuZXcgQk4oNzc3KSxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGxvY2t0aW1lLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCBzZWNwYmFzZTI6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBuZXcgQk4oODg4KSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGxvY2t0aW1lLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCBzZWNwYmFzZTM6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBuZXcgQk4oOTk5KSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGxvY2t0aW1lLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCBpbml0aWFsU3RhdGU6IEluaXRpYWxTdGF0ZXMgPSBuZXcgSW5pdGlhbFN0YXRlcygpXG4gICAgaW5pdGlhbFN0YXRlLmFkZE91dHB1dChzZWNwYmFzZTEsIEFWTUNvbnN0YW50cy5TRUNQRlhJRClcbiAgICBpbml0aWFsU3RhdGUuYWRkT3V0cHV0KHNlY3BiYXNlMiwgQVZNQ29uc3RhbnRzLlNFQ1BGWElEKVxuICAgIGluaXRpYWxTdGF0ZS5hZGRPdXRwdXQoc2VjcGJhc2UzLCBBVk1Db25zdGFudHMuU0VDUEZYSUQpXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gXCJSaWNrY29pbiBpcyB0aGUgbW9zdCBpbnRlbGxpZ2VudCBjb2luXCJcbiAgICBjb25zdCBzeW1ib2w6IHN0cmluZyA9IFwiUklDS1wiXG4gICAgY29uc3QgZGVub21pbmF0aW9uOiBudW1iZXIgPSA5XG4gICAgY29uc3QgdHh1OiBDcmVhdGVBc3NldFR4ID0gbmV3IENyZWF0ZUFzc2V0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBuYW1lLFxuICAgICAgc3ltYm9sLFxuICAgICAgZGVub21pbmF0aW9uLFxuICAgICAgaW5pdGlhbFN0YXRlXG4gICAgKVxuICAgIGNvbnN0IHR4aW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdHh1LmdldElucygpXG4gICAgY29uc3QgdHhvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IHR4dS5nZXRPdXRzKClcbiAgICBjb25zdCBpbml0U3RhdGU6IEluaXRpYWxTdGF0ZXMgPSB0eHUuZ2V0SW5pdGlhbFN0YXRlcygpXG4gICAgZXhwZWN0KHR4aW5zLmxlbmd0aCkudG9CZShpbnB1dHMubGVuZ3RoKVxuICAgIGV4cGVjdCh0eG91dHMubGVuZ3RoKS50b0JlKG91dHB1dHMubGVuZ3RoKVxuICAgIGV4cGVjdChpbml0U3RhdGUudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGluaXRpYWxTdGF0ZS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgKVxuXG4gICAgZXhwZWN0KHR4dS5nZXRUeFR5cGUoKSkudG9CZShBVk1Db25zdGFudHMuQ1JFQVRFQVNTRVRUWClcbiAgICBleHBlY3QodHh1LmdldE5ldHdvcmtJRCgpKS50b0JlKDEyMzQ1KVxuICAgIGV4cGVjdCh0eHUuZ2V0QmxvY2tjaGFpbklEKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICBibG9ja2NoYWluSUQudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG5cbiAgICBleHBlY3QodHh1LmdldE5hbWUoKSkudG9CZShuYW1lKVxuICAgIGV4cGVjdCh0eHUuZ2V0U3ltYm9sKCkpLnRvQmUoc3ltYm9sKVxuICAgIGV4cGVjdCh0eHUuZ2V0RGVub21pbmF0aW9uKCkpLnRvQmUoZGVub21pbmF0aW9uKVxuICAgIGV4cGVjdCh0eHUuZ2V0RGVub21pbmF0aW9uQnVmZmVyKCkucmVhZFVJbnQ4KDApKS50b0JlKGRlbm9taW5hdGlvbilcblxuICAgIGxldCBhOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGI6IHN0cmluZ1tdID0gW11cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGEucHVzaCh0eGluc1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKGlucHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGEgPSBbXVxuICAgIGIgPSBbXVxuXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4b3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4b3V0c1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKG91dHB1dHNbaV0udG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KGEuc29ydCgpKSkudG9CZShKU09OLnN0cmluZ2lmeShiLnNvcnQoKSkpXG5cbiAgICBjb25zdCB0eHVuZXc6IENyZWF0ZUFzc2V0VHggPSBuZXcgQ3JlYXRlQXNzZXRUeCgpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIodHh1LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgdHh1LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gICAgZXhwZWN0KHR4dW5ldy50b1N0cmluZygpKS50b0JlKHR4dS50b1N0cmluZygpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBPcGVyYXRpb25UeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3B0eDogT3BlcmF0aW9uVHggPSBuZXcgT3BlcmF0aW9uVHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBvcHNcbiAgICApXG4gICAgY29uc3QgdHh1bmV3OiBPcGVyYXRpb25UeCA9IG5ldyBPcGVyYXRpb25UeCgpXG4gICAgY29uc3Qgb3BidWZmOiBCdWZmZXIgPSBvcHR4LnRvQnVmZmVyKClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcihvcGJ1ZmYpXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKG9wYnVmZi50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUob3B0eC50b1N0cmluZygpKVxuICAgIGV4cGVjdChvcHR4LmdldE9wZXJhdGlvbnMoKS5sZW5ndGgpLnRvQmUob3BzLmxlbmd0aClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gSW1wb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJvbWJ0eDogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG91dHB1dHMsXG4gICAgICBpbnB1dHMsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBpbXBvcnRJbnNcbiAgICApXG5cbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgYm9tYnR4LnRvQnVmZmVyKClcbiAgICB9KS50b1Rocm93KClcblxuICAgIGNvbnN0IGltcG9ydFR4OiBJbXBvcnRUeCA9IG5ldyBJbXBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgIGltcG9ydEluc1xuICAgIClcbiAgICBjb25zdCB0eHVuZXc6IEltcG9ydFR4ID0gbmV3IEltcG9ydFR4KClcbiAgICBjb25zdCBpbXBvcnRidWZmOiBCdWZmZXIgPSBpbXBvcnRUeC50b0J1ZmZlcigpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIoaW1wb3J0YnVmZilcblxuICAgIGV4cGVjdChpbXBvcnRUeCkudG9CZUluc3RhbmNlT2YoSW1wb3J0VHgpXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldFNvdXJjZUNoYWluKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGltcG9ydGJ1ZmYudG9TdHJpbmcoXCJoZXhcIikpXG4gICAgZXhwZWN0KHR4dW5ldy50b1N0cmluZygpKS50b0JlKGltcG9ydFR4LnRvU3RyaW5nKCkpXG4gICAgZXhwZWN0KGltcG9ydFR4LmdldEltcG9ydElucHV0cygpLmxlbmd0aCkudG9CZShpbXBvcnRJbnMubGVuZ3RoKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBFeHBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYm9tYnR4OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGV4cG9ydE91dHNcbiAgICApXG5cbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xuICAgICAgYm9tYnR4LnRvQnVmZmVyKClcbiAgICB9KS50b1Rocm93KClcblxuICAgIGNvbnN0IGV4cG9ydFR4OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgIGV4cG9ydE91dHNcbiAgICApXG4gICAgY29uc3QgdHh1bmV3OiBFeHBvcnRUeCA9IG5ldyBFeHBvcnRUeCgpXG4gICAgY29uc3QgZXhwb3J0YnVmZjogQnVmZmVyID0gZXhwb3J0VHgudG9CdWZmZXIoKVxuICAgIHR4dW5ldy5mcm9tQnVmZmVyKGV4cG9ydGJ1ZmYpXG5cbiAgICBleHBlY3QoZXhwb3J0VHgpLnRvQmVJbnN0YW5jZU9mKEV4cG9ydFR4KVxuICAgIGV4cGVjdChleHBvcnRUeC5nZXREZXN0aW5hdGlvbkNoYWluKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGV4cG9ydGJ1ZmYudG9TdHJpbmcoXCJoZXhcIikpXG4gICAgZXhwZWN0KHR4dW5ldy50b1N0cmluZygpKS50b0JlKGV4cG9ydFR4LnRvU3RyaW5nKCkpXG4gICAgZXhwZWN0KGV4cG9ydFR4LmdldEV4cG9ydE91dHB1dHMoKS5sZW5ndGgpLnRvQmUoZXhwb3J0T3V0cy5sZW5ndGgpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFR4MSB3aXRoIGFzb2YsIGxvY2t0aW1lLCB0aHJlc2hvbGRcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEJhc2VUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgbmV3IEJOKDkwMDApLFxuICAgICAgYXNzZXRJRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIFVuaXhOb3coKSxcbiAgICAgIFVuaXhOb3coKS5hZGQobmV3IEJOKDUwKSksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHR4OiBUeCA9IHR4dS5zaWduKGtleW1ncjEpXG5cbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbVN0cmluZyh0eC50b1N0cmluZygpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eDIudG9TdHJpbmcoKSkudG9CZSh0eC50b1N0cmluZygpKVxuICB9KVxuICB0ZXN0KFwiQ3JlYXRpb24gVHgyIHdpdGhvdXQgYXNvZiwgbG9ja3RpbWUsIHRocmVzaG9sZFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQmFzZVR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTAwMCksXG4gICAgICBhc3NldElELFxuICAgICAgYWRkcnMzLFxuICAgICAgYWRkcnMxLFxuICAgICAgYWRkcnMxXG4gICAgKVxuICAgIGNvbnN0IHR4OiBUeCA9IHR4dS5zaWduKGtleW1ncjEpXG4gICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgdHgyLmZyb21CdWZmZXIodHgudG9CdWZmZXIoKSlcbiAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUodHgudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHgyLnRvU3RyaW5nKCkpLnRvQmUodHgudG9TdHJpbmcoKSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVHgzIHVzaW5nIE9wZXJhdGlvblR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRORlRUcmFuc2ZlclR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczIsXG4gICAgICBuZnR1dHhvaWRzLFxuICAgICAgbmV3IEJOKDkwKSxcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBVbml4Tm93KCksXG4gICAgICBVbml4Tm93KCkuYWRkKG5ldyBCTig1MCkpLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0eDogVHggPSB0eHUuc2lnbihrZXltZ3IxKVxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tQnVmZmVyKHR4LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFR4NCB1c2luZyBJbXBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkSW1wb3J0VHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGltcG9ydFVUWE9zLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgbmV3IEJOKDkwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDUgdXNpbmcgRXhwb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTApLFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIGFkZHJzMyxcbiAgICAgIGFkZHJzMSxcbiAgICAgIGFkZHJzMixcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIFVuaXhOb3coKVxuICAgIClcbiAgICBjb25zdCB0eDogVHggPSB0eHUuc2lnbihrZXltZ3IxKVxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tQnVmZmVyKHR4LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gIH0pXG59KVxuIl19