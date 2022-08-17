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
const utxos_1 = require("../../../src/apis/platformvm/utxos");
const api_1 = require("../../../src/apis/platformvm/api");
const tx_1 = require("../../../src/apis/platformvm/tx");
const keychain_1 = require("../../../src/apis/platformvm/keychain");
const inputs_1 = require("../../../src/apis/platformvm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/platformvm/outputs");
const constants_1 = require("../../../src/apis/platformvm/constants");
const index_1 = require("../../../src/index");
const payload_1 = require("../../../src/utils/payload");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const basetx_1 = require("../../../src/apis/platformvm/basetx");
const importtx_1 = require("../../../src/apis/platformvm/importtx");
const exporttx_1 = require("../../../src/apis/platformvm/exporttx");
const constants_2 = require("../../../src/utils/constants");
describe("Transactions", () => {
    /**
     * @ignore
     */
    const bintools = bintools_1.default.getInstance();
    const networkID = 1337;
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
    let importIns;
    let importUTXOs;
    let exportOuts;
    let fungutxos;
    let exportUTXOIDS;
    let api;
    const amnt = 10000;
    const netid = 12345;
    const blockchainID = bintools.cb58Decode(constants_2.PlatformChainID);
    const alias = "Swap";
    const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
        .update("Well, now, don't you tell me to smile, you stick around I'll make it worth your while.")
        .digest());
    let amount;
    let addresses;
    let fallAddresses;
    let locktime;
    let fallLocktime;
    let threshold;
    let fallThreshold;
    const ip = "127.0.0.1";
    const port = 8080;
    const protocol = "http";
    let axia;
    const name = "Mortycoin is the dumb as a sack of hammers.";
    const symbol = "morT";
    const denomination = 8;
    let axcAssetID;
    const genesisDataStr = "11111DdZMhYXUZiFV9FNpfpTSQroysjHyMuT5zapYkPYrmap7t7S3sDNNwFzngxR9x1XmoRj5JK1XomX8RHvXYY5h3qYeEsMQRF8Ypia7p1CFHDo6KGSjMdiQkrmpvL8AvoezSxVWKXt2ubmBCnSkpPjnQbBSF7gNg4sPu1PXdh1eKgthaSFREqqG5FKMrWNiS6U87kxCmbKjkmBvwnAd6TpNx75YEiS9YKMyHaBZjkRDNf6Nj1";
    const gd = new index_1.GenesisData();
    gd.fromBuffer(bintools.cb58Decode(genesisDataStr));
    const addressIndex = buffer_1.Buffer.alloc(4);
    addressIndex.writeUIntBE(0x0, 0, 4);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        axia = new index_1.Axia(ip, port, protocol, 12345, undefined, undefined, undefined, true);
        api = new api_1.PlatformVMAPI(axia, "/ext/bc/Core");
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
        for (let i = 0; i < 3; i++) {
            addrs1.push(keymgr1.makeKey().getAddress());
            addrs2.push(keymgr2.makeKey().getAddress());
            addrs3.push(keymgr3.makeKey().getAddress());
        }
        amount = new bn_js_1.default(amnt);
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
            const u = new utxos_1.UTXO(constants_1.PlatformVMConstants.LATESTCODEC, txid, txidx, assetID, out);
            utxos.push(u);
            fungutxos.push(u);
            importUTXOs.push(u);
            txid = u.getTxID();
            txidx = u.getOutputIdx();
            const input = new inputs_1.SECPTransferInput(amount);
            const xferin = new inputs_1.TransferableInput(txid, txidx, assetID, input);
            inputs.push(xferin);
        }
        for (let i = 1; i < 4; i++) {
            importIns.push(inputs[i]);
            exportOuts.push(outputs[i]);
            exportUTXOIDS.push(fungutxos[i].getUTXOID());
        }
        set.addArray(utxos);
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
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("confirm inputTotal, outputTotal and fee are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const bintools = bintools_1.default.getInstance();
        // local network CoreChain ID
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
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        const inputTotal = unsignedTx.getInputTotal(assetID);
        const outputTotal = unsignedTx.getOutputTotal(assetID);
        const burn = unsignedTx.getBurn(assetID);
        expect(inputTotal.toNumber()).toEqual(new bn_js_1.default(400).toNumber());
        expect(outputTotal.toNumber()).toEqual(new bn_js_1.default(266).toNumber());
        expect(burn.toNumber()).toEqual(new bn_js_1.default(134).toNumber());
    }));
    test("Create small BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network SwapChain ID
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
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
    }));
    test("Create large BaseTx that is Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network CoreChain ID
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
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(false);
    }));
    test("Create large BaseTx that isn't Goose Egg Tx", () => __awaiter(void 0, void 0, void 0, function* () {
        // local network CoreChain ID
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
        const baseTx = new basetx_1.BaseTx(networkID, blockchainID, outs, ins);
        const unsignedTx = new tx_1.UnsignedTx(baseTx);
        expect(yield api.checkGooseEgg(unsignedTx)).toBe(true);
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
            set.buildBaseTx(netid, blockchainID, new bn_js_1.default(amnt * 1000), assetID, addrs3, addrs1, addrs1);
        }).toThrow();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvcGxhdGZvcm12bS90eC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXVDO0FBQ3ZDLDhEQUFrRTtBQUNsRSwwREFBZ0U7QUFDaEUsd0RBQWdFO0FBQ2hFLG9FQUFnRTtBQUNoRSxnRUFHNEM7QUFDNUMsOERBQW9DO0FBQ3BDLDJFQUFrRDtBQUNsRCxrREFBc0I7QUFDdEIsb0NBQWdDO0FBQ2hDLGtFQUc2QztBQUM3QyxzRUFBNEU7QUFDNUUsOENBQXNEO0FBQ3RELHdEQUF3RDtBQUN4RCx3RUFHMkM7QUFDM0MsZ0VBQTREO0FBQzVELG9FQUFnRTtBQUNoRSxvRUFBZ0U7QUFDaEUsNERBQThEO0FBRzlELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBUyxFQUFFO0lBQ2xDOztPQUVHO0lBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUVqRCxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUE7SUFDOUIsSUFBSSxHQUFZLENBQUE7SUFDaEIsSUFBSSxPQUFpQixDQUFBO0lBQ3JCLElBQUksT0FBaUIsQ0FBQTtJQUNyQixJQUFJLE9BQWlCLENBQUE7SUFDckIsSUFBSSxNQUFnQixDQUFBO0lBQ3BCLElBQUksTUFBZ0IsQ0FBQTtJQUNwQixJQUFJLE1BQWdCLENBQUE7SUFDcEIsSUFBSSxLQUFhLENBQUE7SUFDakIsSUFBSSxNQUEyQixDQUFBO0lBQy9CLElBQUksT0FBNkIsQ0FBQTtJQUNqQyxJQUFJLFNBQThCLENBQUE7SUFDbEMsSUFBSSxXQUFtQixDQUFBO0lBQ3ZCLElBQUksVUFBZ0MsQ0FBQTtJQUNwQyxJQUFJLFNBQWlCLENBQUE7SUFDckIsSUFBSSxhQUF1QixDQUFBO0lBQzNCLElBQUksR0FBa0IsQ0FBQTtJQUN0QixNQUFNLElBQUksR0FBVyxLQUFLLENBQUE7SUFD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QUFDLEdBQWEsRUFBRSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxHQUFhLEVBQUUsQ0FBQTtRQUNwQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDN0I7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFL0QsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNOLENBQUMsR0FBRyxFQUFFLENBQUE7UUFFTixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7U0FDOUI7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFL0QsTUFBTSxNQUFNLEdBQWUsSUFBSSxlQUFVLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcs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LENBQUE7SUFDNUUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBUyxFQUFFO1FBQzdDLE1BQU0sR0FBRyxHQUFlLEdBQUcsQ0FBQyxhQUFhLENBQ3ZDLEtBQUssRUFDTCxZQUFZLEVBQ1osSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsQ0FBQyxVQUFVLENBQUMsMkJBQWUsQ0FBQyxFQUNwQyxTQUFTLEVBQ1QsU0FBUyxFQUNULElBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFDM0MsSUFBQSx5QkFBTyxHQUFFLENBQ1YsQ0FBQTtRQUNELE1BQU0sRUFBRSxHQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEMsTUFBTSxHQUFHLEdBQU8sSUFBSSxPQUFFLEVBQUUsQ0FBQTtRQUN4QixHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQzdCLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUM1RSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vY2tBeGlvcyBmcm9tIFwiamVzdC1tb2NrLWF4aW9zXCJcbmltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS91dHhvc1wiXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQVBJIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vYXBpXCJcbmltcG9ydCB7IFVuc2lnbmVkVHgsIFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vdHhcIlxuaW1wb3J0IHsgS2V5Q2hhaW4gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9rZXljaGFpblwiXG5pbXBvcnQge1xuICBTRUNQVHJhbnNmZXJJbnB1dCxcbiAgVHJhbnNmZXJhYmxlSW5wdXRcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW5wdXRzXCJcbmltcG9ydCBjcmVhdGVIYXNoIGZyb20gXCJjcmVhdGUtaGFzaFwiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCB7XG4gIFNFQ1BUcmFuc2Zlck91dHB1dCxcbiAgVHJhbnNmZXJhYmxlT3V0cHV0XG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL291dHB1dHNcIlxuaW1wb3J0IHsgUGxhdGZvcm1WTUNvbnN0YW50cyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBBeGlhLCBHZW5lc2lzRGF0YSB9IGZyb20gXCIuLi8uLi8uLi9zcmMvaW5kZXhcIlxuaW1wb3J0IHsgVVRGOFBheWxvYWQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL3BheWxvYWRcIlxuaW1wb3J0IHtcbiAgTm9kZUlEU3RyaW5nVG9CdWZmZXIsXG4gIFVuaXhOb3dcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9oZWxwZXJmdW5jdGlvbnNcIlxuaW1wb3J0IHsgQmFzZVR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vYmFzZXR4XCJcbmltcG9ydCB7IEltcG9ydFR4IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vaW1wb3J0dHhcIlxuaW1wb3J0IHsgRXhwb3J0VHggfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvcGxhdGZvcm12bS9leHBvcnR0eFwiXG5pbXBvcnQgeyBQbGF0Zm9ybUNoYWluSUQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBIdHRwUmVzcG9uc2UgfSBmcm9tIFwiamVzdC1tb2NrLWF4aW9zL2Rpc3QvbGliL21vY2stYXhpb3MtdHlwZXNcIlxuXG5kZXNjcmliZShcIlRyYW5zYWN0aW9uc1wiLCAoKTogdm9pZCA9PiB7XG4gIC8qKlxuICAgKiBAaWdub3JlXG4gICAqL1xuICBjb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5cbiAgY29uc3QgbmV0d29ya0lEOiBudW1iZXIgPSAxMzM3XG4gIGxldCBzZXQ6IFVUWE9TZXRcbiAgbGV0IGtleW1ncjE6IEtleUNoYWluXG4gIGxldCBrZXltZ3IyOiBLZXlDaGFpblxuICBsZXQga2V5bWdyMzogS2V5Q2hhaW5cbiAgbGV0IGFkZHJzMTogQnVmZmVyW11cbiAgbGV0IGFkZHJzMjogQnVmZmVyW11cbiAgbGV0IGFkZHJzMzogQnVmZmVyW11cbiAgbGV0IHV0eG9zOiBVVFhPW11cbiAgbGV0IGlucHV0czogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICBsZXQgb3V0cHV0czogVHJhbnNmZXJhYmxlT3V0cHV0W11cbiAgbGV0IGltcG9ydEluczogVHJhbnNmZXJhYmxlSW5wdXRbXVxuICBsZXQgaW1wb3J0VVRYT3M6IFVUWE9bXVxuICBsZXQgZXhwb3J0T3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W11cbiAgbGV0IGZ1bmd1dHhvczogVVRYT1tdXG4gIGxldCBleHBvcnRVVFhPSURTOiBzdHJpbmdbXVxuICBsZXQgYXBpOiBQbGF0Zm9ybVZNQVBJXG4gIGNvbnN0IGFtbnQ6IG51bWJlciA9IDEwMDAwXG4gIGNvbnN0IG5ldGlkOiBudW1iZXIgPSAxMjM0NVxuICBjb25zdCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKVxuICBjb25zdCBhbGlhczogc3RyaW5nID0gXCJTd2FwXCJcbiAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgLnVwZGF0ZShcbiAgICAgICAgXCJXZWxsLCBub3csIGRvbid0IHlvdSB0ZWxsIG1lIHRvIHNtaWxlLCB5b3Ugc3RpY2sgYXJvdW5kIEknbGwgbWFrZSBpdCB3b3J0aCB5b3VyIHdoaWxlLlwiXG4gICAgICApXG4gICAgICAuZGlnZXN0KClcbiAgKVxuICBsZXQgYW1vdW50OiBCTlxuICBsZXQgYWRkcmVzc2VzOiBCdWZmZXJbXVxuICBsZXQgZmFsbEFkZHJlc3NlczogQnVmZmVyW11cbiAgbGV0IGxvY2t0aW1lOiBCTlxuICBsZXQgZmFsbExvY2t0aW1lOiBCTlxuICBsZXQgdGhyZXNob2xkOiBudW1iZXJcbiAgbGV0IGZhbGxUaHJlc2hvbGQ6IG51bWJlclxuICBjb25zdCBpcDogc3RyaW5nID0gXCIxMjcuMC4wLjFcIlxuICBjb25zdCBwb3J0OiBudW1iZXIgPSA4MDgwXG4gIGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBcIlxuICBsZXQgYXhpYTogQXhpYVxuICBjb25zdCBuYW1lOiBzdHJpbmcgPSBcIk1vcnR5Y29pbiBpcyB0aGUgZHVtYiBhcyBhIHNhY2sgb2YgaGFtbWVycy5cIlxuICBjb25zdCBzeW1ib2w6IHN0cmluZyA9IFwibW9yVFwiXG4gIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gOFxuICBsZXQgYXhjQXNzZXRJRDogQnVmZmVyXG4gIGNvbnN0IGdlbmVzaXNEYXRhU3RyOiBzdHJpbmcgPVxuICAgIFwiMTExMTFEZFpNaFlYVVppRlY5Rk5wZnBUU1Fyb3lzakh5TXVUNXphcFlrUFlybWFwN3Q3UzNzRE5Od0Z6bmd4Ujl4MVhtb1JqNUpLMVhvbVg4Ukh2WFlZNWgzcVllRXNNUVJGOFlwaWE3cDFDRkhEbzZLR1NqTWRpUWtybXB2TDhBdm9lelN4VldLWHQydWJtQkNuU2twUGpuUWJCU0Y3Z05nNHNQdTFQWGRoMWVLZ3RoYVNGUkVxcUc1RktNcldOaVM2VTg3a3hDbWJLamttQnZ3bkFkNlRwTng3NVlFaVM5WUtNeUhhQlpqa1JETmY2TmoxXCJcbiAgY29uc3QgZ2Q6IEdlbmVzaXNEYXRhID0gbmV3IEdlbmVzaXNEYXRhKClcbiAgZ2QuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKGdlbmVzaXNEYXRhU3RyKSlcbiAgY29uc3QgYWRkcmVzc0luZGV4OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgYWRkcmVzc0luZGV4LndyaXRlVUludEJFKDB4MCwgMCwgNClcblxuICBiZWZvcmVBbGwoYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF4aWEgPSBuZXcgQXhpYShcbiAgICAgIGlwLFxuICAgICAgcG9ydCxcbiAgICAgIHByb3RvY29sLFxuICAgICAgMTIzNDUsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB0cnVlXG4gICAgKVxuICAgIGFwaSA9IG5ldyBQbGF0Zm9ybVZNQVBJKGF4aWEsIFwiL2V4dC9iYy9Db3JlXCIpXG4gICAgY29uc3QgcmVzdWx0OiBQcm9taXNlPEJ1ZmZlcj4gPSBhcGkuZ2V0QVhDQXNzZXRJRCgpXG4gICAgY29uc3QgcGF5bG9hZDogb2JqZWN0ID0ge1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHN5bWJvbCxcbiAgICAgICAgYXNzZXRJRDogYmludG9vbHMuY2I1OEVuY29kZShhc3NldElEKSxcbiAgICAgICAgZGVub21pbmF0aW9uOiBgJHtkZW5vbWluYXRpb259YFxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZU9iajogSHR0cFJlc3BvbnNlID0ge1xuICAgICAgZGF0YTogcGF5bG9hZFxuICAgIH1cblxuICAgIG1vY2tBeGlvcy5tb2NrUmVzcG9uc2UocmVzcG9uc2VPYmopXG4gICAgYXhjQXNzZXRJRCA9IGF3YWl0IHJlc3VsdFxuICB9KVxuXG4gIGJlZm9yZUVhY2goKCk6IHZvaWQgPT4ge1xuICAgIHNldCA9IG5ldyBVVFhPU2V0KClcbiAgICBrZXltZ3IxID0gbmV3IEtleUNoYWluKGF4aWEuZ2V0SFJQKCksIGFsaWFzKVxuICAgIGtleW1ncjIgPSBuZXcgS2V5Q2hhaW4oYXhpYS5nZXRIUlAoKSwgYWxpYXMpXG4gICAga2V5bWdyMyA9IG5ldyBLZXlDaGFpbihheGlhLmdldEhSUCgpLCBhbGlhcylcbiAgICBhZGRyczEgPSBbXVxuICAgIGFkZHJzMiA9IFtdXG4gICAgYWRkcnMzID0gW11cbiAgICB1dHhvcyA9IFtdXG4gICAgaW5wdXRzID0gW11cbiAgICBvdXRwdXRzID0gW11cbiAgICBpbXBvcnRJbnMgPSBbXVxuICAgIGltcG9ydFVUWE9zID0gW11cbiAgICBleHBvcnRPdXRzID0gW11cbiAgICBmdW5ndXR4b3MgPSBbXVxuICAgIGV4cG9ydFVUWE9JRFMgPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgIGFkZHJzMS5wdXNoKGtleW1ncjEubWFrZUtleSgpLmdldEFkZHJlc3MoKSlcbiAgICAgIGFkZHJzMi5wdXNoKGtleW1ncjIubWFrZUtleSgpLmdldEFkZHJlc3MoKSlcbiAgICAgIGFkZHJzMy5wdXNoKGtleW1ncjMubWFrZUtleSgpLmdldEFkZHJlc3MoKSlcbiAgICB9XG4gICAgYW1vdW50ID0gbmV3IEJOKGFtbnQpXG4gICAgYWRkcmVzc2VzID0ga2V5bWdyMS5nZXRBZGRyZXNzZXMoKVxuICAgIGZhbGxBZGRyZXNzZXMgPSBrZXltZ3IyLmdldEFkZHJlc3NlcygpXG4gICAgbG9ja3RpbWUgPSBuZXcgQk4oNTQzMjEpXG4gICAgZmFsbExvY2t0aW1lID0gbG9ja3RpbWUuYWRkKG5ldyBCTig1MCkpXG4gICAgdGhyZXNob2xkID0gM1xuICAgIGZhbGxUaHJlc2hvbGQgPSAxXG5cbiAgICBjb25zdCBwYXlsb2FkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMTAyNClcbiAgICBwYXlsb2FkLndyaXRlKFxuICAgICAgXCJBbGwgeW91IFRyZWtraWVzIGFuZCBUViBhZGRpY3RzLCBEb24ndCBtZWFuIHRvIGRpc3MgZG9uJ3QgbWVhbiB0byBicmluZyBzdGF0aWMuXCIsXG4gICAgICAwLFxuICAgICAgMTAyNCxcbiAgICAgIFwidXRmOFwiXG4gICAgKVxuXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgbGV0IHR4aWQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXG4gICAgICAgICAgLnVwZGF0ZShiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oaSksIDMyKSlcbiAgICAgICAgICAuZGlnZXN0KClcbiAgICAgIClcbiAgICAgIGxldCB0eGlkeDogQnVmZmVyID0gQnVmZmVyLmZyb20oYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCA0KSlcbiAgICAgIGNvbnN0IG91dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgICAgYW1vdW50LFxuICAgICAgICBhZGRyZXNzZXMsXG4gICAgICAgIGxvY2t0aW1lLFxuICAgICAgICB0aHJlc2hvbGRcbiAgICAgIClcbiAgICAgIGNvbnN0IHhmZXJvdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoYXNzZXRJRCwgb3V0KVxuICAgICAgb3V0cHV0cy5wdXNoKHhmZXJvdXQpXG5cbiAgICAgIGNvbnN0IHU6IFVUWE8gPSBuZXcgVVRYTyhcbiAgICAgICAgUGxhdGZvcm1WTUNvbnN0YW50cy5MQVRFU1RDT0RFQyxcbiAgICAgICAgdHhpZCxcbiAgICAgICAgdHhpZHgsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG91dFxuICAgICAgKVxuICAgICAgdXR4b3MucHVzaCh1KVxuICAgICAgZnVuZ3V0eG9zLnB1c2godSlcbiAgICAgIGltcG9ydFVUWE9zLnB1c2godSlcblxuICAgICAgdHhpZCA9IHUuZ2V0VHhJRCgpXG4gICAgICB0eGlkeCA9IHUuZ2V0T3V0cHV0SWR4KClcblxuICAgICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGFtb3VudClcbiAgICAgIGNvbnN0IHhmZXJpbjogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICAgIHR4aWQsXG4gICAgICAgIHR4aWR4LFxuICAgICAgICBhc3NldElELFxuICAgICAgICBpbnB1dFxuICAgICAgKVxuICAgICAgaW5wdXRzLnB1c2goeGZlcmluKVxuICAgIH1cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgNDsgaSsrKSB7XG4gICAgICBpbXBvcnRJbnMucHVzaChpbnB1dHNbaV0pXG4gICAgICBleHBvcnRPdXRzLnB1c2gob3V0cHV0c1tpXSlcbiAgICAgIGV4cG9ydFVUWE9JRFMucHVzaChmdW5ndXR4b3NbaV0uZ2V0VVRYT0lEKCkpXG4gICAgfVxuICAgIHNldC5hZGRBcnJheSh1dHhvcylcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIHNtYWxsIEJhc2VUeCB0aGF0IGlzIEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjI2NlwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQwMFwiKVxuICAgIGNvbnN0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChpbnB1dEFtdClcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMCwgYWRkcnMxWzBdKVxuICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNiNThEZWNvZGUoXG4gICAgICBcIm44WEg1SlkxRVg1VllxRGVBaEI0WmQ0R0t4aTlVTlF5Nm9QcE1zQ0FqMVE2eGtpaUxcIlxuICAgIClcbiAgICBjb25zdCBvdXRwdXRJbmRleDogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihuZXcgQk4oMCksIDQpXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZUlucHV0OiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHR4aWQsXG4gICAgICBvdXRwdXRJbmRleCxcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICBpbnB1dFxuICAgIClcbiAgICBpbnMucHVzaCh0cmFuc2ZlcmFibGVJbnB1dClcbiAgICBjb25zdCBiYXNlVHg6IEJhc2VUeCA9IG5ldyBCYXNlVHgobmV0d29ya0lELCBibG9ja2NoYWluSUQsIG91dHMsIGlucylcbiAgICBjb25zdCB1bnNpZ25lZFR4OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGV4cGVjdChhd2FpdCBhcGkuY2hlY2tHb29zZUVnZyh1bnNpZ25lZFR4KSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIHRlc3QoXCJjb25maXJtIGlucHV0VG90YWwsIG91dHB1dFRvdGFsIGFuZCBmZWUgYXJlIGNvcnJlY3RcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbiAgICAvLyBsb2NhbCBuZXR3b3JrIENvcmVDaGFpbiBJRFxuICAgIC8vIEFYQyBhc3NldElEXG4gICAgY29uc3QgYXNzZXRJRDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCIyNjZcIilcbiAgICBjb25zdCBvdXRwdXQ6IFNFQ1BUcmFuc2Zlck91dHB1dCA9IG5ldyBTRUNQVHJhbnNmZXJPdXRwdXQoXG4gICAgICBvdXRwdXRBbXQsXG4gICAgICBhZGRyczEsXG4gICAgICBuZXcgQk4oMCksXG4gICAgICAxXG4gICAgKVxuICAgIGNvbnN0IHRyYW5zZmVyYWJsZU91dHB1dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChcbiAgICAgIGFzc2V0SUQsXG4gICAgICBvdXRwdXRcbiAgICApXG4gICAgb3V0cy5wdXNoKHRyYW5zZmVyYWJsZU91dHB1dClcbiAgICBjb25zdCBpbnB1dEFtdDogQk4gPSBuZXcgQk4oXCI0MDBcIilcbiAgICBjb25zdCBpbnB1dDogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoaW5wdXRBbXQpXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMVswXSlcbiAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKFxuICAgICAgXCJuOFhINUpZMUVYNVZZcURlQWhCNFpkNEdLeGk5VU5ReTZvUHBNc0NBajFRNnhraWlMXCJcbiAgICApXG4gICAgY29uc3Qgb3V0cHV0SW5kZXg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKDApLCA0KVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVJbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB0eGlkLFxuICAgICAgb3V0cHV0SW5kZXgsXG4gICAgICBhc3NldElELFxuICAgICAgaW5wdXRcbiAgICApXG4gICAgaW5zLnB1c2godHJhbnNmZXJhYmxlSW5wdXQpXG4gICAgY29uc3QgYmFzZVR4OiBCYXNlVHggPSBuZXcgQmFzZVR4KG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMpXG4gICAgY29uc3QgdW5zaWduZWRUeDogVW5zaWduZWRUeCA9IG5ldyBVbnNpZ25lZFR4KGJhc2VUeClcbiAgICBjb25zdCBpbnB1dFRvdGFsOiBCTiA9IHVuc2lnbmVkVHguZ2V0SW5wdXRUb3RhbChhc3NldElEKVxuICAgIGNvbnN0IG91dHB1dFRvdGFsOiBCTiA9IHVuc2lnbmVkVHguZ2V0T3V0cHV0VG90YWwoYXNzZXRJRClcbiAgICBjb25zdCBidXJuOiBCTiA9IHVuc2lnbmVkVHguZ2V0QnVybihhc3NldElEKVxuICAgIGV4cGVjdChpbnB1dFRvdGFsLnRvTnVtYmVyKCkpLnRvRXF1YWwobmV3IEJOKDQwMCkudG9OdW1iZXIoKSlcbiAgICBleHBlY3Qob3V0cHV0VG90YWwudG9OdW1iZXIoKSkudG9FcXVhbChuZXcgQk4oMjY2KS50b051bWJlcigpKVxuICAgIGV4cGVjdChidXJuLnRvTnVtYmVyKCkpLnRvRXF1YWwobmV3IEJOKDEzNCkudG9OdW1iZXIoKSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRlIHNtYWxsIEJhc2VUeCB0aGF0IGlzbid0IEdvb3NlIEVnZyBUeFwiLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgLy8gbG9jYWwgbmV0d29yayBTd2FwQ2hhaW4gSURcbiAgICBjb25zdCBvdXRzOiBUcmFuc2ZlcmFibGVPdXRwdXRbXSA9IFtdXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBvdXRwdXRBbXQ6IEJOID0gbmV3IEJOKFwiMjY3XCIpXG4gICAgY29uc3Qgb3V0cHV0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgb3V0cHV0QW10LFxuICAgICAgYWRkcnMxLFxuICAgICAgbmV3IEJOKDApLFxuICAgICAgMVxuICAgIClcbiAgICBjb25zdCB0cmFuc2ZlcmFibGVPdXRwdXQ6IFRyYW5zZmVyYWJsZU91dHB1dCA9IG5ldyBUcmFuc2ZlcmFibGVPdXRwdXQoXG4gICAgICBheGNBc3NldElELFxuICAgICAgb3V0cHV0XG4gICAgKVxuICAgIG91dHMucHVzaCh0cmFuc2ZlcmFibGVPdXRwdXQpXG4gICAgY29uc3QgaW5wdXRBbXQ6IEJOID0gbmV3IEJOKFwiNDAwXCIpXG4gICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGlucHV0QW10KVxuICAgIGlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBhZGRyczFbMF0pXG4gICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHB1dEluZGV4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigwKSwgNClcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlSW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdHhpZCxcbiAgICAgIG91dHB1dEluZGV4LFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIGlucHV0XG4gICAgKVxuICAgIGlucy5wdXNoKHRyYW5zZmVyYWJsZUlucHV0KVxuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXR3b3JrSUQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgZXhwZWN0KGF3YWl0IGFwaS5jaGVja0dvb3NlRWdnKHVuc2lnbmVkVHgpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0ZSBsYXJnZSBCYXNlVHggdGhhdCBpcyBHb29zZSBFZ2cgVHhcIiwgYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIC8vIGxvY2FsIG5ldHdvcmsgQ29yZUNoYWluIElEXG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IFtdXG4gICAgY29uc3Qgb3V0cHV0QW10OiBCTiA9IG5ldyBCTihcIjYwOTU1NTUwMDAwMFwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQ1MDAwMDAwMDAwMDAwMDAwXCIpXG4gICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGlucHV0QW10KVxuICAgIGlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBhZGRyczFbMF0pXG4gICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHB1dEluZGV4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigwKSwgNClcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlSW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdHhpZCxcbiAgICAgIG91dHB1dEluZGV4LFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIGlucHV0XG4gICAgKVxuICAgIGlucy5wdXNoKHRyYW5zZmVyYWJsZUlucHV0KVxuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXR3b3JrSUQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgZXhwZWN0KGF3YWl0IGFwaS5jaGVja0dvb3NlRWdnKHVuc2lnbmVkVHgpKS50b0JlKGZhbHNlKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGUgbGFyZ2UgQmFzZVR4IHRoYXQgaXNuJ3QgR29vc2UgRWdnIFR4XCIsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICAvLyBsb2NhbCBuZXR3b3JrIENvcmVDaGFpbiBJRFxuICAgIGNvbnN0IG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gW11cbiAgICBjb25zdCBpbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuICAgIGNvbnN0IG91dHB1dEFtdDogQk4gPSBuZXcgQk4oXCI0NDk5NTYwOTU1NTUwMDAwMFwiKVxuICAgIGNvbnN0IG91dHB1dDogU0VDUFRyYW5zZmVyT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcbiAgICAgIG91dHB1dEFtdCxcbiAgICAgIGFkZHJzMSxcbiAgICAgIG5ldyBCTigwKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlT3V0cHV0OiBUcmFuc2ZlcmFibGVPdXRwdXQgPSBuZXcgVHJhbnNmZXJhYmxlT3V0cHV0KFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIG91dHB1dFxuICAgIClcbiAgICBvdXRzLnB1c2godHJhbnNmZXJhYmxlT3V0cHV0KVxuICAgIGNvbnN0IGlucHV0QW10OiBCTiA9IG5ldyBCTihcIjQ1MDAwMDAwMDAwMDAwMDAwXCIpXG4gICAgY29uc3QgaW5wdXQ6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KGlucHV0QW10KVxuICAgIGlucHV0LmFkZFNpZ25hdHVyZUlkeCgwLCBhZGRyczFbMF0pXG4gICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY2I1OERlY29kZShcbiAgICAgIFwibjhYSDVKWTFFWDVWWXFEZUFoQjRaZDRHS3hpOVVOUXk2b1BwTXNDQWoxUTZ4a2lpTFwiXG4gICAgKVxuICAgIGNvbnN0IG91dHB1dEluZGV4OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKG5ldyBCTigwKSwgNClcbiAgICApXG4gICAgY29uc3QgdHJhbnNmZXJhYmxlSW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdHhpZCxcbiAgICAgIG91dHB1dEluZGV4LFxuICAgICAgYXhjQXNzZXRJRCxcbiAgICAgIGlucHV0XG4gICAgKVxuICAgIGlucy5wdXNoKHRyYW5zZmVyYWJsZUlucHV0KVxuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXR3b3JrSUQsIGJsb2NrY2hhaW5JRCwgb3V0cywgaW5zKVxuICAgIGNvbnN0IHVuc2lnbmVkVHg6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeChiYXNlVHgpXG4gICAgZXhwZWN0KGF3YWl0IGFwaS5jaGVja0dvb3NlRWdnKHVuc2lnbmVkVHgpKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIFVuc2lnbmVkVHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGJhc2VUeDogQmFzZVR4ID0gbmV3IEJhc2VUeChuZXRpZCwgYmxvY2tjaGFpbklELCBvdXRwdXRzLCBpbnB1dHMpXG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gbmV3IFVuc2lnbmVkVHgoYmFzZVR4KVxuICAgIGNvbnN0IHR4aW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gdHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0SW5zKClcbiAgICBjb25zdCB0eG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdHh1LmdldFRyYW5zYWN0aW9uKCkuZ2V0T3V0cygpXG4gICAgZXhwZWN0KHR4aW5zLmxlbmd0aCkudG9CZShpbnB1dHMubGVuZ3RoKVxuICAgIGV4cGVjdCh0eG91dHMubGVuZ3RoKS50b0JlKG91dHB1dHMubGVuZ3RoKVxuXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldFR4VHlwZSgpKS50b0JlKDApXG4gICAgZXhwZWN0KHR4dS5nZXRUcmFuc2FjdGlvbigpLmdldE5ldHdvcmtJRCgpKS50b0JlKDEyMzQ1KVxuICAgIGV4cGVjdCh0eHUuZ2V0VHJhbnNhY3Rpb24oKS5nZXRCbG9ja2NoYWluSUQoKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJsb2NrY2hhaW5JRC50b1N0cmluZyhcImhleFwiKVxuICAgIClcblxuICAgIGxldCBhOiBzdHJpbmdbXSA9IFtdXG4gICAgbGV0IGI6IHN0cmluZ1tdID0gW11cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdHhpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGEucHVzaCh0eGluc1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKGlucHV0c1tpXS50b1N0cmluZygpKVxuICAgIH1cbiAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkoYS5zb3J0KCkpKS50b0JlKEpTT04uc3RyaW5naWZ5KGIuc29ydCgpKSlcblxuICAgIGEgPSBbXVxuICAgIGIgPSBbXVxuXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4b3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgYS5wdXNoKHR4b3V0c1tpXS50b1N0cmluZygpKVxuICAgICAgYi5wdXNoKG91dHB1dHNbaV0udG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KGEuc29ydCgpKSkudG9CZShKU09OLnN0cmluZ2lmeShiLnNvcnQoKSkpXG5cbiAgICBjb25zdCB0eHVuZXc6IFVuc2lnbmVkVHggPSBuZXcgVW5zaWduZWRUeCgpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIodHh1LnRvQnVmZmVyKCkpXG4gICAgZXhwZWN0KHR4dW5ldy50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgdHh1LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICApXG4gICAgZXhwZWN0KHR4dW5ldy50b1N0cmluZygpKS50b0JlKHR4dS50b1N0cmluZygpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBVbnNpZ25lZFR4IENoZWNrIEFtb3VudFwiLCAoKTogdm9pZCA9PiB7XG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcbiAgICAgIHNldC5idWlsZEJhc2VUeChcbiAgICAgICAgbmV0aWQsXG4gICAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgICAgbmV3IEJOKGFtbnQgKiAxMDAwKSxcbiAgICAgICAgYXNzZXRJRCxcbiAgICAgICAgYWRkcnMzLFxuICAgICAgICBhZGRyczEsXG4gICAgICAgIGFkZHJzMVxuICAgICAgKVxuICAgIH0pLnRvVGhyb3coKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBJbXBvcnRUeFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgYm9tYnR4OiBJbXBvcnRUeCA9IG5ldyBJbXBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgb3V0cHV0cyxcbiAgICAgIGlucHV0cyxcbiAgICAgIG5ldyBVVEY4UGF5bG9hZChcImhlbGxvIHdvcmxkXCIpLmdldFBheWxvYWQoKSxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGltcG9ydEluc1xuICAgIClcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBib21idHgudG9CdWZmZXIoKVxuICAgIH0pLnRvVGhyb3coKVxuXG4gICAgY29uc3QgaW1wb3J0VHg6IEltcG9ydFR4ID0gbmV3IEltcG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgaW1wb3J0SW5zXG4gICAgKVxuICAgIGNvbnN0IHR4dW5ldzogSW1wb3J0VHggPSBuZXcgSW1wb3J0VHgoKVxuICAgIGNvbnN0IGltcG9ydGJ1ZmY6IEJ1ZmZlciA9IGltcG9ydFR4LnRvQnVmZmVyKClcbiAgICB0eHVuZXcuZnJvbUJ1ZmZlcihpbXBvcnRidWZmKVxuXG4gICAgZXhwZWN0KGltcG9ydFR4KS50b0JlSW5zdGFuY2VPZihJbXBvcnRUeClcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0U291cmNlQ2hhaW4oKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoaW1wb3J0YnVmZi50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUoaW1wb3J0VHgudG9TdHJpbmcoKSlcbiAgICBleHBlY3QoaW1wb3J0VHguZ2V0SW1wb3J0SW5wdXRzKCkubGVuZ3RoKS50b0JlKGltcG9ydElucy5sZW5ndGgpXG4gIH0pXG5cbiAgdGVzdChcIkNyZWF0aW9uIEV4cG9ydFR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBib21idHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgZXhwb3J0T3V0c1xuICAgIClcblxuICAgIGV4cGVjdCgoKTogdm9pZCA9PiB7XG4gICAgICBib21idHgudG9CdWZmZXIoKVxuICAgIH0pLnRvVGhyb3coKVxuXG4gICAgY29uc3QgZXhwb3J0VHg6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBvdXRwdXRzLFxuICAgICAgaW5wdXRzLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShQbGF0Zm9ybUNoYWluSUQpLFxuICAgICAgZXhwb3J0T3V0c1xuICAgIClcbiAgICBjb25zdCB0eHVuZXc6IEV4cG9ydFR4ID0gbmV3IEV4cG9ydFR4KClcbiAgICBjb25zdCBleHBvcnRidWZmOiBCdWZmZXIgPSBleHBvcnRUeC50b0J1ZmZlcigpXG4gICAgdHh1bmV3LmZyb21CdWZmZXIoZXhwb3J0YnVmZilcblxuICAgIGV4cGVjdChleHBvcnRUeCkudG9CZUluc3RhbmNlT2YoRXhwb3J0VHgpXG4gICAgZXhwZWN0KGV4cG9ydFR4LmdldERlc3RpbmF0aW9uQ2hhaW4oKS50b1N0cmluZyhcImhleFwiKSkudG9CZShcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QodHh1bmV3LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoZXhwb3J0YnVmZi50b1N0cmluZyhcImhleFwiKSlcbiAgICBleHBlY3QodHh1bmV3LnRvU3RyaW5nKCkpLnRvQmUoZXhwb3J0VHgudG9TdHJpbmcoKSlcbiAgICBleHBlY3QoZXhwb3J0VHguZ2V0RXhwb3J0T3V0cHV0cygpLmxlbmd0aCkudG9CZShleHBvcnRPdXRzLmxlbmd0aClcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVHgxIHdpdGggYXNvZiwgbG9ja3RpbWUsIHRocmVzaG9sZFwiLCAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdHh1OiBVbnNpZ25lZFR4ID0gc2V0LmJ1aWxkQmFzZVR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBuZXcgQk4oOTAwMCksXG4gICAgICBhc3NldElELFxuICAgICAgYWRkcnMzLFxuICAgICAgYWRkcnMxLFxuICAgICAgYWRkcnMxLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgVW5peE5vdygpLFxuICAgICAgVW5peE5vdygpLmFkZChuZXcgQk4oNTApKSxcbiAgICAgIDFcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcblxuICAgIGNvbnN0IHR4MjogVHggPSBuZXcgVHgoKVxuICAgIHR4Mi5mcm9tU3RyaW5nKHR4LnRvU3RyaW5nKCkpXG4gICAgZXhwZWN0KHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4LnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpXG4gICAgZXhwZWN0KHR4Mi50b1N0cmluZygpKS50b0JlKHR4LnRvU3RyaW5nKCkpXG4gIH0pXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDIgd2l0aG91dCBhc29mLCBsb2NrdGltZSwgdGhyZXNob2xkXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRCYXNlVHgoXG4gICAgICBuZXRpZCxcbiAgICAgIGJsb2NrY2hhaW5JRCxcbiAgICAgIG5ldyBCTig5MDAwKSxcbiAgICAgIGFzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczFcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSkudG9CZSh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICAgIGV4cGVjdCh0eDIudG9TdHJpbmcoKSkudG9CZSh0eC50b1N0cmluZygpKVxuICB9KVxuXG4gIHRlc3QoXCJDcmVhdGlvbiBUeDQgdXNpbmcgSW1wb3J0VHhcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHR4dTogVW5zaWduZWRUeCA9IHNldC5idWlsZEltcG9ydFR4KFxuICAgICAgbmV0aWQsXG4gICAgICBibG9ja2NoYWluSUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczIsXG4gICAgICBpbXBvcnRVVFhPcyxcbiAgICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoUGxhdGZvcm1DaGFpbklEKSxcbiAgICAgIG5ldyBCTig5MCksXG4gICAgICBhc3NldElELFxuICAgICAgbmV3IFVURjhQYXlsb2FkKFwiaGVsbG8gd29ybGRcIikuZ2V0UGF5bG9hZCgpLFxuICAgICAgVW5peE5vdygpXG4gICAgKVxuICAgIGNvbnN0IHR4OiBUeCA9IHR4dS5zaWduKGtleW1ncjEpXG4gICAgY29uc3QgdHgyOiBUeCA9IG5ldyBUeCgpXG4gICAgdHgyLmZyb21CdWZmZXIodHgudG9CdWZmZXIoKSlcbiAgICBleHBlY3QodHgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUodHgudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKSlcbiAgfSlcblxuICB0ZXN0KFwiQ3JlYXRpb24gVHg1IHVzaW5nIEV4cG9ydFR4XCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eHU6IFVuc2lnbmVkVHggPSBzZXQuYnVpbGRFeHBvcnRUeChcbiAgICAgIG5ldGlkLFxuICAgICAgYmxvY2tjaGFpbklELFxuICAgICAgbmV3IEJOKDkwKSxcbiAgICAgIGF4Y0Fzc2V0SUQsXG4gICAgICBhZGRyczMsXG4gICAgICBhZGRyczEsXG4gICAgICBhZGRyczIsXG4gICAgICBiaW50b29scy5jYjU4RGVjb2RlKFBsYXRmb3JtQ2hhaW5JRCksXG4gICAgICB1bmRlZmluZWQsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBuZXcgVVRGOFBheWxvYWQoXCJoZWxsbyB3b3JsZFwiKS5nZXRQYXlsb2FkKCksXG4gICAgICBVbml4Tm93KClcbiAgICApXG4gICAgY29uc3QgdHg6IFR4ID0gdHh1LnNpZ24oa2V5bWdyMSlcbiAgICBjb25zdCB0eDI6IFR4ID0gbmV3IFR4KClcbiAgICB0eDIuZnJvbUJ1ZmZlcih0eC50b0J1ZmZlcigpKVxuICAgIGV4cGVjdCh0eC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKHR4Mi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKVxuICB9KVxufSlcbiJdfQ==