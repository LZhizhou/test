"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utxos_1 = require("../../../src/apis/avm/utxos");
const keychain_1 = require("../../../src/apis/avm/keychain");
const inputs_1 = require("../../../src/apis/avm/inputs");
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const outputs_1 = require("../../../src/apis/avm/outputs");
const constants_1 = require("../../../src/apis/evm/constants");
const input_1 = require("../../../src/common/input");
const evm_1 = require("../../../src/apis/evm");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("Inputs", () => {
    let set;
    let keymgr1;
    let keymgr2;
    let addrs1;
    let addrs2;
    let utxos;
    let hrp = "tests";
    const amnt = 10000;
    beforeEach(() => {
        set = new utxos_1.UTXOSet();
        keymgr1 = new keychain_1.KeyChain(hrp, "AX");
        keymgr2 = new keychain_1.KeyChain(hrp, "AX");
        addrs1 = [];
        addrs2 = [];
        utxos = [];
        for (let i = 0; i < 3; i++) {
            addrs1.push(keymgr1.makeKey().getAddress());
            addrs2.push(keymgr2.makeKey().getAddress());
        }
        const amount = new bn_js_1.default(amnt);
        const addresses = keymgr1.getAddresses();
        const locktime = new bn_js_1.default(54321);
        const threshold = 3;
        for (let i = 0; i < 3; i++) {
            const txid = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(bintools.fromBNToBuffer(new bn_js_1.default(i), 32))
                .digest());
            const txidx = buffer_1.Buffer.from(bintools.fromBNToBuffer(new bn_js_1.default(i), 4));
            const assetID = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(txid).digest());
            const out = new outputs_1.SECPTransferOutput(amount.add(new bn_js_1.default(i)), addresses, locktime, threshold);
            const xferout = new outputs_1.TransferableOutput(assetID, out);
            const u = new utxos_1.UTXO(constants_1.EVMConstants.LATESTCODEC, txid, txidx, assetID, out);
            u.fromBuffer(buffer_1.Buffer.concat([u.getCodecIDBuffer(), txid, txidx, xferout.toBuffer()]));
            utxos.push(u);
        }
        set.addArray(utxos);
    });
    test("SECPInput", () => {
        let u;
        let txid;
        let txidx;
        const amount = new bn_js_1.default(amnt);
        let input;
        let xferinput;
        u = utxos[0];
        txid = u.getTxID();
        txidx = u.getOutputIdx();
        const asset = u.getAssetID();
        input = new inputs_1.SECPTransferInput(amount);
        xferinput = new inputs_1.TransferableInput(txid, txidx, asset, input);
        expect(xferinput.getUTXOID()).toBe(u.getUTXOID());
        expect(input.getInputID()).toBe(constants_1.EVMConstants.SECPINPUTID);
        input.addSignatureIdx(0, addrs2[0]);
        input.addSignatureIdx(1, addrs2[1]);
        const newin = new inputs_1.SECPTransferInput();
        newin.fromBuffer(bintools.b58ToBuffer(input.toString()));
        expect(newin.toBuffer().toString("hex")).toBe(input.toBuffer().toString("hex"));
        expect(newin.getSigIdxs().toString()).toBe(input.getSigIdxs().toString());
    });
    test("Input comparator", () => {
        const inpt1 = new inputs_1.SECPTransferInput(utxos[0].getOutput().getAmount());
        const inpt2 = new inputs_1.SECPTransferInput(utxos[1].getOutput().getAmount());
        const inpt3 = new inputs_1.SECPTransferInput(utxos[2].getOutput().getAmount());
        const cmp = input_1.Input.comparator();
        expect(cmp(inpt1, inpt2)).toBe(-1);
        expect(cmp(inpt1, inpt3)).toBe(-1);
        expect(cmp(inpt1, inpt1)).toBe(0);
        expect(cmp(inpt2, inpt2)).toBe(0);
        expect(cmp(inpt3, inpt3)).toBe(0);
    });
    test("TransferableInput comparator", () => {
        const inpt1 = new inputs_1.SECPTransferInput(utxos[0].getOutput().getAmount());
        const in1 = new inputs_1.TransferableInput(utxos[0].getTxID(), utxos[0].getOutputIdx(), utxos[0].getAssetID(), inpt1);
        const inpt2 = new inputs_1.SECPTransferInput(utxos[1].getOutput().getAmount());
        const in2 = new inputs_1.TransferableInput(utxos[1].getTxID(), utxos[1].getOutputIdx(), utxos[1].getAssetID(), inpt2);
        const inpt3 = new inputs_1.SECPTransferInput(utxos[2].getOutput().getAmount());
        const in3 = new inputs_1.TransferableInput(utxos[2].getTxID(), utxos[2].getOutputIdx(), utxos[2].getAssetID(), inpt3);
        const cmp = inputs_1.TransferableInput.comparator();
        expect(cmp(in1, in2)).toBe(-1);
        expect(cmp(in1, in3)).toBe(-1);
        expect(cmp(in1, in1)).toBe(0);
        expect(cmp(in2, in2)).toBe(0);
        expect(cmp(in3, in3)).toBe(0);
    });
    test("EVMInput comparator", () => {
        let inputs = [];
        const address1 = "0x55ee05dF718f1a5C1441e76190EB1a19eE2C9430";
        const address3 = "0x9632a79656af553F58738B0FB750320158495942";
        const address4 = "0x4Cf2eD3665F6bFA95cE6A11CFDb7A2EF5FC1C7E4";
        const address6 = "0x3C7daE394BBf8e9EE1359ad14C1C47003bD06293";
        const address8 = "0x0Fa8EA536Be85F32724D57A37758761B86416123";
        const amount1 = 1;
        const amount2 = 2;
        const amount3 = 3;
        const amount4 = 4;
        const amount5 = 5;
        const amount6 = 6;
        const amount7 = 7;
        const amount8 = 8;
        const assetID1 = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"; // dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db
        const assetID2 = "vvKCjrpggyQ8FhJ2D5EAKPh8x8y4JK93JQiWRpTKpEouydRbG"; // 7a6e1e3c9c66ed8f076180f89d01320795628dca633001ff437ac6ab58b455be
        const assetID3 = "eRo1eb2Yxd87KuMYANBSha3n138wtqRhFz2xjftsXWnmpCxyh"; // 54fbd087a8a9c739c2c7926d742ea7b937adbd512b9ff0fd51f460a763d1371a
        const assetID5 = "2QqUTT3XTgR6HLbCLGtjN2uDHHqNRaBgtBGJ5KCqW7BUaH1P8X"; // b9d16d7c7d2674c3c67c5c26d9d6e39a09a5991c588cdf60c4cca732b66fa749
        const assetID6 = "ZWXaLcAy1YWS3Vvjcrt2KcVA4VxBsMFt8yNDZABJkgBvgpRti"; // 49d0dc67846a20dfea79b7beeba84769efa4a0273575f65ca79f9dee1cd1250e
        const assetID7 = "FHfS61NfF5XdZU62bcXp9yRfgrZeiQC7VNJWKcpdb9QMLHs4L"; // 2070e77e34941439dc7bcf502dcf555c6ef0e3cc46bbac8a03b22e15c84a81f1
        const assetID8 = "ZL6NeWgcnxR2zhhKDx7h9Kg2mZgScC5N4RG5FCDayWY7W3whZ"; // 496849239bb1541e97fa8f89256965bf7e657f3bb530cad820dd41706c5e3836
        const nonce1 = 0;
        const nonce2 = 1;
        const nonce3 = 2;
        const nonce4 = 3;
        const nonce5 = 4;
        const nonce6 = 5;
        const nonce7 = 6;
        const nonce8 = 7;
        const input1 = new evm_1.EVMInput(address1, amount1, assetID1, nonce1);
        inputs.push(input1);
        const input2 = new evm_1.EVMInput(address1, amount2, assetID2, nonce2);
        inputs.push(input2);
        const input3 = new evm_1.EVMInput(address3, amount3, assetID2, nonce3);
        inputs.push(input3);
        const input4 = new evm_1.EVMInput(address4, amount4, assetID3, nonce4);
        inputs.push(input4);
        const input5 = new evm_1.EVMInput(address1, amount5, assetID5, nonce5);
        inputs.push(input5);
        const input6 = new evm_1.EVMInput(address6, amount6, assetID6, nonce6);
        inputs.push(input6);
        const input7 = new evm_1.EVMInput(address1, amount7, assetID7, nonce7);
        inputs.push(input7);
        const input8 = new evm_1.EVMInput(address8, amount8, assetID8, nonce8);
        inputs.push(input8);
        inputs = inputs.sort(evm_1.EVMInput.comparator());
        expect(inputs[0].getAmount().toString()).toBe("8");
        expect(inputs[1].getAmount().toString()).toBe("6");
        expect(inputs[2].getAmount().toString()).toBe("4");
        expect(inputs[3].getAmount().toString()).toBe("7");
        expect(inputs[4].getAmount().toString()).toBe("2");
        expect(inputs[5].getAmount().toString()).toBe("5");
        expect(inputs[6].getAmount().toString()).toBe("1");
        expect(inputs[7].getAmount().toString()).toBe("3");
        const cmp = evm_1.EVMInput.comparator();
        expect(cmp(input2, input1)).toBe(-1);
        expect(cmp(input1, input3)).toBe(-1);
        expect(cmp(input2, input3)).toBe(-1);
        expect(cmp(input1, input1)).toBe(0);
        expect(cmp(input2, input2)).toBe(0);
        expect(cmp(input3, input3)).toBe(0);
        expect(cmp(input1, input2)).toBe(1);
        expect(cmp(input3, input1)).toBe(1);
        expect(cmp(input3, input2)).toBe(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2V2bS9pbnB1dHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVEQUEyRDtBQUMzRCw2REFBeUQ7QUFDekQseURBR3FDO0FBQ3JDLDhEQUFvQztBQUNwQywyRUFBa0Q7QUFDbEQsa0RBQXNCO0FBQ3RCLG9DQUFnQztBQUNoQywyREFJc0M7QUFDdEMsK0RBQThEO0FBQzlELHFEQUFpRDtBQUVqRCwrQ0FBZ0Q7QUFFaEQ7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBUyxFQUFFO0lBQzVCLElBQUksR0FBWSxDQUFBO0lBQ2hCLElBQUksT0FBaUIsQ0FBQTtJQUNyQixJQUFJLE9BQWlCLENBQUE7SUFDckIsSUFBSSxNQUFnQixDQUFBO0lBQ3BCLElBQUksTUFBZ0IsQ0FBQTtJQUNwQixJQUFJLEtBQWEsQ0FBQTtJQUNqQixJQUFJLEdBQUcsR0FBVyxPQUFPLENBQUE7SUFDekIsTUFBTSxJQUFJLEdBQVcsS0FBSyxDQUFBO0lBQzFCLFVBQVUsQ0FBQyxHQUFTLEVBQUU7UUFDcEIsR0FBRyxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7UUFDbkIsT0FBTyxHQUFHLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDakMsT0FBTyxHQUFHLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDakMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNYLE1BQU0sR0FBRyxFQUFFLENBQUE7UUFDWCxLQUFLLEdBQUcsRUFBRSxDQUFBO1FBQ1YsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxNQUFNLENB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QU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNsRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2xELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDbEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVsRCxNQUFNLEdBQUcsR0FBRyxjQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDckMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVUWE9TZXQsIFVUWE8gfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3V0eG9zXCJcbmltcG9ydCB7IEtleUNoYWluIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9rZXljaGFpblwiXG5pbXBvcnQge1xuICBTRUNQVHJhbnNmZXJJbnB1dCxcbiAgVHJhbnNmZXJhYmxlSW5wdXRcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9pbnB1dHNcIlxuaW1wb3J0IGNyZWF0ZUhhc2ggZnJvbSBcImNyZWF0ZS1oYXNoXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IHtcbiAgU0VDUFRyYW5zZmVyT3V0cHV0LFxuICBBbW91bnRPdXRwdXQsXG4gIFRyYW5zZmVyYWJsZU91dHB1dFxufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL291dHB1dHNcIlxuaW1wb3J0IHsgRVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2V2bS9jb25zdGFudHNcIlxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2NvbW1vbi9pbnB1dFwiXG5pbXBvcnQgeyBPdXRwdXQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2NvbW1vbi9vdXRwdXRcIlxuaW1wb3J0IHsgRVZNSW5wdXQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvZXZtXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmRlc2NyaWJlKFwiSW5wdXRzXCIsICgpOiB2b2lkID0+IHtcbiAgbGV0IHNldDogVVRYT1NldFxuICBsZXQga2V5bWdyMTogS2V5Q2hhaW5cbiAgbGV0IGtleW1ncjI6IEtleUNoYWluXG4gIGxldCBhZGRyczE6IEJ1ZmZlcltdXG4gIGxldCBhZGRyczI6IEJ1ZmZlcltdXG4gIGxldCB1dHhvczogVVRYT1tdXG4gIGxldCBocnA6IHN0cmluZyA9IFwidGVzdHNcIlxuICBjb25zdCBhbW50OiBudW1iZXIgPSAxMDAwMFxuICBiZWZvcmVFYWNoKCgpOiB2b2lkID0+IHtcbiAgICBzZXQgPSBuZXcgVVRYT1NldCgpXG4gICAga2V5bWdyMSA9IG5ldyBLZXlDaGFpbihocnAsIFwiQVhcIilcbiAgICBrZXltZ3IyID0gbmV3IEtleUNoYWluKGhycCwgXCJBWFwiKVxuICAgIGFkZHJzMSA9IFtdXG4gICAgYWRkcnMyID0gW11cbiAgICB1dHhvcyA9IFtdXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgYWRkcnMxLnB1c2goa2V5bWdyMS5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgICAgYWRkcnMyLnB1c2goa2V5bWdyMi5tYWtlS2V5KCkuZ2V0QWRkcmVzcygpKVxuICAgIH1cbiAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKGFtbnQpXG4gICAgY29uc3QgYWRkcmVzc2VzOiBCdWZmZXJbXSA9IGtleW1ncjEuZ2V0QWRkcmVzc2VzKClcbiAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXG4gICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAzXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgY3JlYXRlSGFzaChcInNoYTI1NlwiKVxuICAgICAgICAgIC51cGRhdGUoYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCAzMikpXG4gICAgICAgICAgLmRpZ2VzdCgpXG4gICAgICApXG4gICAgICBjb25zdCB0eGlkeDogQnVmZmVyID0gQnVmZmVyLmZyb20oYmludG9vbHMuZnJvbUJOVG9CdWZmZXIobmV3IEJOKGkpLCA0KSlcbiAgICAgIGNvbnN0IGFzc2V0SUQ6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpLnVwZGF0ZSh0eGlkKS5kaWdlc3QoKVxuICAgICAgKVxuICAgICAgY29uc3Qgb3V0OiBPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxuICAgICAgICBhbW91bnQuYWRkKG5ldyBCTihpKSksXG4gICAgICAgIGFkZHJlc3NlcyxcbiAgICAgICAgbG9ja3RpbWUsXG4gICAgICAgIHRocmVzaG9sZFxuICAgICAgKVxuICAgICAgY29uc3QgeGZlcm91dDogVHJhbnNmZXJhYmxlT3V0cHV0ID0gbmV3IFRyYW5zZmVyYWJsZU91dHB1dChhc3NldElELCBvdXQpXG4gICAgICBjb25zdCB1OiBVVFhPID0gbmV3IFVUWE8oXG4gICAgICAgIEVWTUNvbnN0YW50cy5MQVRFU1RDT0RFQyxcbiAgICAgICAgdHhpZCxcbiAgICAgICAgdHhpZHgsXG4gICAgICAgIGFzc2V0SUQsXG4gICAgICAgIG91dFxuICAgICAgKVxuICAgICAgdS5mcm9tQnVmZmVyKFxuICAgICAgICBCdWZmZXIuY29uY2F0KFt1LmdldENvZGVjSURCdWZmZXIoKSwgdHhpZCwgdHhpZHgsIHhmZXJvdXQudG9CdWZmZXIoKV0pXG4gICAgICApXG4gICAgICB1dHhvcy5wdXNoKHUpXG4gICAgfVxuICAgIHNldC5hZGRBcnJheSh1dHhvcylcbiAgfSlcbiAgdGVzdChcIlNFQ1BJbnB1dFwiLCAoKTogdm9pZCA9PiB7XG4gICAgbGV0IHU6IFVUWE9cbiAgICBsZXQgdHhpZDogQnVmZmVyXG4gICAgbGV0IHR4aWR4OiBCdWZmZXJcbiAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKGFtbnQpXG4gICAgbGV0IGlucHV0OiBTRUNQVHJhbnNmZXJJbnB1dFxuICAgIGxldCB4ZmVyaW5wdXQ6IFRyYW5zZmVyYWJsZUlucHV0XG5cbiAgICB1ID0gdXR4b3NbMF1cbiAgICB0eGlkID0gdS5nZXRUeElEKClcbiAgICB0eGlkeCA9IHUuZ2V0T3V0cHV0SWR4KClcbiAgICBjb25zdCBhc3NldCA9IHUuZ2V0QXNzZXRJRCgpXG5cbiAgICBpbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChhbW91bnQpXG4gICAgeGZlcmlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KHR4aWQsIHR4aWR4LCBhc3NldCwgaW5wdXQpXG4gICAgZXhwZWN0KHhmZXJpbnB1dC5nZXRVVFhPSUQoKSkudG9CZSh1LmdldFVUWE9JRCgpKVxuICAgIGV4cGVjdChpbnB1dC5nZXRJbnB1dElEKCkpLnRvQmUoRVZNQ29uc3RhbnRzLlNFQ1BJTlBVVElEKVxuXG4gICAgaW5wdXQuYWRkU2lnbmF0dXJlSWR4KDAsIGFkZHJzMlswXSlcbiAgICBpbnB1dC5hZGRTaWduYXR1cmVJZHgoMSwgYWRkcnMyWzFdKVxuXG4gICAgY29uc3QgbmV3aW46IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KClcbiAgICBuZXdpbi5mcm9tQnVmZmVyKGJpbnRvb2xzLmI1OFRvQnVmZmVyKGlucHV0LnRvU3RyaW5nKCkpKVxuICAgIGV4cGVjdChuZXdpbi50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxuICAgICAgaW5wdXQudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIClcbiAgICBleHBlY3QobmV3aW4uZ2V0U2lnSWR4cygpLnRvU3RyaW5nKCkpLnRvQmUoaW5wdXQuZ2V0U2lnSWR4cygpLnRvU3RyaW5nKCkpXG4gIH0pXG5cbiAgdGVzdChcIklucHV0IGNvbXBhcmF0b3JcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlucHQxOiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChcbiAgICAgICh1dHhvc1swXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXG4gICAgKVxuXG4gICAgY29uc3QgaW5wdDI6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KFxuICAgICAgKHV0eG9zWzFdLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dCkuZ2V0QW1vdW50KClcbiAgICApXG5cbiAgICBjb25zdCBpbnB0MzogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoXG4gICAgICAodXR4b3NbMl0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxuICAgIClcblxuICAgIGNvbnN0IGNtcCA9IElucHV0LmNvbXBhcmF0b3IoKVxuICAgIGV4cGVjdChjbXAoaW5wdDEsIGlucHQyKSkudG9CZSgtMSlcbiAgICBleHBlY3QoY21wKGlucHQxLCBpbnB0MykpLnRvQmUoLTEpXG4gICAgZXhwZWN0KGNtcChpbnB0MSwgaW5wdDEpKS50b0JlKDApXG4gICAgZXhwZWN0KGNtcChpbnB0MiwgaW5wdDIpKS50b0JlKDApXG4gICAgZXhwZWN0KGNtcChpbnB0MywgaW5wdDMpKS50b0JlKDApXG4gIH0pXG5cbiAgdGVzdChcIlRyYW5zZmVyYWJsZUlucHV0IGNvbXBhcmF0b3JcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlucHQxOiBTRUNQVHJhbnNmZXJJbnB1dCA9IG5ldyBTRUNQVHJhbnNmZXJJbnB1dChcbiAgICAgICh1dHhvc1swXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpXG4gICAgKVxuICAgIGNvbnN0IGluMTogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoXG4gICAgICB1dHhvc1swXS5nZXRUeElEKCksXG4gICAgICB1dHhvc1swXS5nZXRPdXRwdXRJZHgoKSxcbiAgICAgIHV0eG9zWzBdLmdldEFzc2V0SUQoKSxcbiAgICAgIGlucHQxXG4gICAgKVxuXG4gICAgY29uc3QgaW5wdDI6IFNFQ1BUcmFuc2ZlcklucHV0ID0gbmV3IFNFQ1BUcmFuc2ZlcklucHV0KFxuICAgICAgKHV0eG9zWzFdLmdldE91dHB1dCgpIGFzIEFtb3VudE91dHB1dCkuZ2V0QW1vdW50KClcbiAgICApXG4gICAgY29uc3QgaW4yOiBUcmFuc2ZlcmFibGVJbnB1dCA9IG5ldyBUcmFuc2ZlcmFibGVJbnB1dChcbiAgICAgIHV0eG9zWzFdLmdldFR4SUQoKSxcbiAgICAgIHV0eG9zWzFdLmdldE91dHB1dElkeCgpLFxuICAgICAgdXR4b3NbMV0uZ2V0QXNzZXRJRCgpLFxuICAgICAgaW5wdDJcbiAgICApXG5cbiAgICBjb25zdCBpbnB0MzogU0VDUFRyYW5zZmVySW5wdXQgPSBuZXcgU0VDUFRyYW5zZmVySW5wdXQoXG4gICAgICAodXR4b3NbMl0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxuICAgIClcbiAgICBjb25zdCBpbjM6IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KFxuICAgICAgdXR4b3NbMl0uZ2V0VHhJRCgpLFxuICAgICAgdXR4b3NbMl0uZ2V0T3V0cHV0SWR4KCksXG4gICAgICB1dHhvc1syXS5nZXRBc3NldElEKCksXG4gICAgICBpbnB0M1xuICAgIClcblxuICAgIGNvbnN0IGNtcCA9IFRyYW5zZmVyYWJsZUlucHV0LmNvbXBhcmF0b3IoKVxuICAgIGV4cGVjdChjbXAoaW4xLCBpbjIpKS50b0JlKC0xKVxuICAgIGV4cGVjdChjbXAoaW4xLCBpbjMpKS50b0JlKC0xKVxuICAgIGV4cGVjdChjbXAoaW4xLCBpbjEpKS50b0JlKDApXG4gICAgZXhwZWN0KGNtcChpbjIsIGluMikpLnRvQmUoMClcbiAgICBleHBlY3QoY21wKGluMywgaW4zKSkudG9CZSgwKVxuICB9KVxuXG4gIHRlc3QoXCJFVk1JbnB1dCBjb21wYXJhdG9yXCIsICgpOiB2b2lkID0+IHtcbiAgICBsZXQgaW5wdXRzOiBFVk1JbnB1dFtdID0gW11cbiAgICBjb25zdCBhZGRyZXNzMTogc3RyaW5nID0gXCIweDU1ZWUwNWRGNzE4ZjFhNUMxNDQxZTc2MTkwRUIxYTE5ZUUyQzk0MzBcIlxuICAgIGNvbnN0IGFkZHJlc3MzOiBzdHJpbmcgPSBcIjB4OTYzMmE3OTY1NmFmNTUzRjU4NzM4QjBGQjc1MDMyMDE1ODQ5NTk0MlwiXG4gICAgY29uc3QgYWRkcmVzczQ6IHN0cmluZyA9IFwiMHg0Q2YyZUQzNjY1RjZiRkE5NWNFNkExMUNGRGI3QTJFRjVGQzFDN0U0XCJcbiAgICBjb25zdCBhZGRyZXNzNjogc3RyaW5nID0gXCIweDNDN2RhRTM5NEJCZjhlOUVFMTM1OWFkMTRDMUM0NzAwM2JEMDYyOTNcIlxuICAgIGNvbnN0IGFkZHJlc3M4OiBzdHJpbmcgPSBcIjB4MEZhOEVBNTM2QmU4NUYzMjcyNEQ1N0EzNzc1ODc2MUI4NjQxNjEyM1wiXG4gICAgY29uc3QgYW1vdW50MTogbnVtYmVyID0gMVxuICAgIGNvbnN0IGFtb3VudDI6IG51bWJlciA9IDJcbiAgICBjb25zdCBhbW91bnQzOiBudW1iZXIgPSAzXG4gICAgY29uc3QgYW1vdW50NDogbnVtYmVyID0gNFxuICAgIGNvbnN0IGFtb3VudDU6IG51bWJlciA9IDVcbiAgICBjb25zdCBhbW91bnQ2OiBudW1iZXIgPSA2XG4gICAgY29uc3QgYW1vdW50NzogbnVtYmVyID0gN1xuICAgIGNvbnN0IGFtb3VudDg6IG51bWJlciA9IDhcbiAgICBjb25zdCBhc3NldElEMTogc3RyaW5nID1cbiAgICAgIFwiMmZvbWJoTDdhR1B3ajNLSDRiZnJtSndXNlBWbk1vYmY5WTJmbjlHd3hpQUFKeUZEYmVcIiAvLyBkYmNmODkwZjc3ZjQ5Yjk2ODU3NjQ4YjcyYjc3ZjlmODI5MzdmMjhhNjg3MDRhZjA1ZGEwZGMxMmJhNTNmMmRiXG4gICAgY29uc3QgYXNzZXRJRDI6IHN0cmluZyA9IFwidnZLQ2pycGdneVE4RmhKMkQ1RUFLUGg4eDh5NEpLOTNKUWlXUnBUS3BFb3V5ZFJiR1wiIC8vIDdhNmUxZTNjOWM2NmVkOGYwNzYxODBmODlkMDEzMjA3OTU2MjhkY2E2MzMwMDFmZjQzN2FjNmFiNThiNDU1YmVcbiAgICBjb25zdCBhc3NldElEMzogc3RyaW5nID0gXCJlUm8xZWIyWXhkODdLdU1ZQU5CU2hhM24xMzh3dHFSaEZ6MnhqZnRzWFdubXBDeHloXCIgLy8gNTRmYmQwODdhOGE5YzczOWMyYzc5MjZkNzQyZWE3YjkzN2FkYmQ1MTJiOWZmMGZkNTFmNDYwYTc2M2QxMzcxYVxuICAgIGNvbnN0IGFzc2V0SUQ1OiBzdHJpbmcgPVxuICAgICAgXCIyUXFVVFQzWFRnUjZITGJDTEd0ak4ydURISHFOUmFCZ3RCR0o1S0NxVzdCVWFIMVA4WFwiIC8vIGI5ZDE2ZDdjN2QyNjc0YzNjNjdjNWMyNmQ5ZDZlMzlhMDlhNTk5MWM1ODhjZGY2MGM0Y2NhNzMyYjY2ZmE3NDlcbiAgICBjb25zdCBhc3NldElENjogc3RyaW5nID0gXCJaV1hhTGNBeTFZV1MzVnZqY3J0MktjVkE0VnhCc01GdDh5TkRaQUJKa2dCdmdwUnRpXCIgLy8gNDlkMGRjNjc4NDZhMjBkZmVhNzliN2JlZWJhODQ3NjllZmE0YTAyNzM1NzVmNjVjYTc5ZjlkZWUxY2QxMjUwZVxuICAgIGNvbnN0IGFzc2V0SUQ3OiBzdHJpbmcgPSBcIkZIZlM2MU5mRjVYZFpVNjJiY1hwOXlSZmdyWmVpUUM3Vk5KV0tjcGRiOVFNTEhzNExcIiAvLyAyMDcwZTc3ZTM0OTQxNDM5ZGM3YmNmNTAyZGNmNTU1YzZlZjBlM2NjNDZiYmFjOGEwM2IyMmUxNWM4NGE4MWYxXG4gICAgY29uc3QgYXNzZXRJRDg6IHN0cmluZyA9IFwiWkw2TmVXZ2NueFIyemhoS0R4N2g5S2cybVpnU2NDNU40Ukc1RkNEYXlXWTdXM3doWlwiIC8vIDQ5Njg0OTIzOWJiMTU0MWU5N2ZhOGY4OTI1Njk2NWJmN2U2NTdmM2JiNTMwY2FkODIwZGQ0MTcwNmM1ZTM4MzZcbiAgICBjb25zdCBub25jZTE6IG51bWJlciA9IDBcbiAgICBjb25zdCBub25jZTI6IG51bWJlciA9IDFcbiAgICBjb25zdCBub25jZTM6IG51bWJlciA9IDJcbiAgICBjb25zdCBub25jZTQ6IG51bWJlciA9IDNcbiAgICBjb25zdCBub25jZTU6IG51bWJlciA9IDRcbiAgICBjb25zdCBub25jZTY6IG51bWJlciA9IDVcbiAgICBjb25zdCBub25jZTc6IG51bWJlciA9IDZcbiAgICBjb25zdCBub25jZTg6IG51bWJlciA9IDdcblxuICAgIGNvbnN0IGlucHV0MTogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczEsIGFtb3VudDEsIGFzc2V0SUQxLCBub25jZTEpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQxKVxuICAgIGNvbnN0IGlucHV0MjogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczEsIGFtb3VudDIsIGFzc2V0SUQyLCBub25jZTIpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQyKVxuICAgIGNvbnN0IGlucHV0MzogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczMsIGFtb3VudDMsIGFzc2V0SUQyLCBub25jZTMpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQzKVxuICAgIGNvbnN0IGlucHV0NDogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczQsIGFtb3VudDQsIGFzc2V0SUQzLCBub25jZTQpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQ0KVxuICAgIGNvbnN0IGlucHV0NTogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczEsIGFtb3VudDUsIGFzc2V0SUQ1LCBub25jZTUpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQ1KVxuICAgIGNvbnN0IGlucHV0NjogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczYsIGFtb3VudDYsIGFzc2V0SUQ2LCBub25jZTYpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQ2KVxuICAgIGNvbnN0IGlucHV0NzogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczEsIGFtb3VudDcsIGFzc2V0SUQ3LCBub25jZTcpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQ3KVxuICAgIGNvbnN0IGlucHV0ODogRVZNSW5wdXQgPSBuZXcgRVZNSW5wdXQoYWRkcmVzczgsIGFtb3VudDgsIGFzc2V0SUQ4LCBub25jZTgpXG4gICAgaW5wdXRzLnB1c2goaW5wdXQ4KVxuICAgIGlucHV0cyA9IGlucHV0cy5zb3J0KEVWTUlucHV0LmNvbXBhcmF0b3IoKSlcbiAgICBleHBlY3QoaW5wdXRzWzBdLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvQmUoXCI4XCIpXG4gICAgZXhwZWN0KGlucHV0c1sxXS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0JlKFwiNlwiKVxuICAgIGV4cGVjdChpbnB1dHNbMl0uZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9CZShcIjRcIilcbiAgICBleHBlY3QoaW5wdXRzWzNdLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvQmUoXCI3XCIpXG4gICAgZXhwZWN0KGlucHV0c1s0XS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0JlKFwiMlwiKVxuICAgIGV4cGVjdChpbnB1dHNbNV0uZ2V0QW1vdW50KCkudG9TdHJpbmcoKSkudG9CZShcIjVcIilcbiAgICBleHBlY3QoaW5wdXRzWzZdLmdldEFtb3VudCgpLnRvU3RyaW5nKCkpLnRvQmUoXCIxXCIpXG4gICAgZXhwZWN0KGlucHV0c1s3XS5nZXRBbW91bnQoKS50b1N0cmluZygpKS50b0JlKFwiM1wiKVxuXG4gICAgY29uc3QgY21wID0gRVZNSW5wdXQuY29tcGFyYXRvcigpXG4gICAgZXhwZWN0KGNtcChpbnB1dDIsIGlucHV0MSkpLnRvQmUoLTEpXG4gICAgZXhwZWN0KGNtcChpbnB1dDEsIGlucHV0MykpLnRvQmUoLTEpXG4gICAgZXhwZWN0KGNtcChpbnB1dDIsIGlucHV0MykpLnRvQmUoLTEpXG4gICAgZXhwZWN0KGNtcChpbnB1dDEsIGlucHV0MSkpLnRvQmUoMClcbiAgICBleHBlY3QoY21wKGlucHV0MiwgaW5wdXQyKSkudG9CZSgwKVxuICAgIGV4cGVjdChjbXAoaW5wdXQzLCBpbnB1dDMpKS50b0JlKDApXG4gICAgZXhwZWN0KGNtcChpbnB1dDEsIGlucHV0MikpLnRvQmUoMSlcbiAgICBleHBlY3QoY21wKGlucHV0MywgaW5wdXQxKSkudG9CZSgxKVxuICAgIGV4cGVjdChjbXAoaW5wdXQzLCBpbnB1dDIpKS50b0JlKDEpXG4gIH0pXG59KVxuIl19