"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const utxos_1 = require("../../../src/apis/platformvm/utxos");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const bintools = bintools_1.default.getInstance();
const display = "display";
describe("UTXO", () => {
    const utxohex = "000038d1b9f1138672da6fb6c35125539276a9acc2a668d63bea6ba3c795e2edb0f5000000013e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd3558000000070000000000004dd500000000000000000000000100000001a36fd0c2dbcab311731dde7ef1514bd26fcdc74d";
    const outputidx = "00000001";
    const outtxid = "38d1b9f1138672da6fb6c35125539276a9acc2a668d63bea6ba3c795e2edb0f5";
    const outaid = "3e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd3558";
    const utxobuff = buffer_1.Buffer.from(utxohex, "hex");
    // Payment
    const OPUTXOstr = bintools.cb58Encode(utxobuff);
    // "U9rFgK5jjdXmV8k5tpqeXkimzrN3o9eCCcXesyhMBBZu9MQJCDTDo5Wn5psKvzJVMJpiMbdkfDXkp7sKZddfCZdxpuDmyNy7VFka19zMW4jcz6DRQvNfA2kvJYKk96zc7uizgp3i2FYWrB8mr1sPJ8oP9Th64GQ5yHd8"
    // implies fromString and fromBuffer
    test("Creation", () => {
        const u1 = new utxos_1.UTXO();
        u1.fromBuffer(utxobuff);
        const u1hex = u1.toBuffer().toString("hex");
        expect(u1hex).toBe(utxohex);
    });
    test("Empty Creation", () => {
        const u1 = new utxos_1.UTXO();
        expect(() => {
            u1.toBuffer();
        }).toThrow();
    });
    test("Creation of Type", () => {
        const op = new utxos_1.UTXO();
        op.fromString(OPUTXOstr);
        expect(op.getOutput().getOutputID()).toBe(7);
    });
    describe("Funtionality", () => {
        const u1 = new utxos_1.UTXO();
        u1.fromBuffer(utxobuff);
        const u1hex = u1.toBuffer().toString("hex");
        test("getAssetID NonCA", () => {
            const assetID = u1.getAssetID();
            expect(assetID.toString("hex", 0, assetID.length)).toBe(outaid);
        });
        test("getTxID", () => {
            const txid = u1.getTxID();
            expect(txid.toString("hex", 0, txid.length)).toBe(outtxid);
        });
        test("getOutputIdx", () => {
            const txidx = u1.getOutputIdx();
            expect(txidx.toString("hex", 0, txidx.length)).toBe(outputidx);
        });
        test("getUTXOID", () => {
            const txid = buffer_1.Buffer.from(outtxid, "hex");
            const txidx = buffer_1.Buffer.from(outputidx, "hex");
            const utxoid = bintools.bufferToB58(buffer_1.Buffer.concat([txid, txidx]));
            expect(u1.getUTXOID()).toBe(utxoid);
        });
        test("toString", () => {
            const serialized = u1.toString();
            expect(serialized).toBe(bintools.cb58Encode(utxobuff));
        });
    });
});
const setMergeTester = (input, equal, notEqual) => {
    const instr = JSON.stringify(input.getUTXOIDs().sort());
    for (let i = 0; i < equal.length; i++) {
        if (JSON.stringify(equal[i].getUTXOIDs().sort()) != instr) {
            return false;
        }
    }
    for (let i = 0; i < notEqual.length; i++) {
        if (JSON.stringify(notEqual[i].getUTXOIDs().sort()) == instr) {
            return false;
        }
    }
    return true;
};
describe("UTXOSet", () => {
    const utxostrs = [
        bintools.cb58Encode(buffer_1.Buffer.from("000038d1b9f1138672da6fb6c35125539276a9acc2a668d63bea6ba3c795e2edb0f5000000013e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd3558000000070000000000004dd500000000000000000000000100000001a36fd0c2dbcab311731dde7ef1514bd26fcdc74d", "hex")),
        bintools.cb58Encode(buffer_1.Buffer.from("0000c3e4823571587fe2bdfc502689f5a8238b9d0ea7f3277124d16af9de0d2d9911000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex")),
        bintools.cb58Encode(buffer_1.Buffer.from("0000f29dba61fda8d57a911e7f8810f935bde810d3f8d495404685bdb8d9d8545e86000000003e07e38e2f23121be8756412c18db7246a16d26ee9936f3cba28be149cfd355800000007000000000000001900000000000000000000000100000001e1b6b6a4bad94d2e3f20730379b9bcd6f176318e", "hex"))
    ];
    const addrs = [
        bintools.cb58Decode("FuB6Lw2D62NuM8zpGLA4Avepq7eGsZRiG"),
        bintools.cb58Decode("MaTvKGccbYzCxzBkJpb2zHW7E1WReZqB8")
    ];
    test("Creation", () => {
        const set = new utxos_1.UTXOSet();
        set.add(utxostrs[0]);
        const utxo = new utxos_1.UTXO();
        utxo.fromString(utxostrs[0]);
        const setArray = set.getAllUTXOs();
        expect(utxo.toString()).toBe(setArray[0].toString());
    });
    test("Serialization", () => {
        const set = new utxos_1.UTXOSet();
        set.addArray([...utxostrs]);
        let setobj = set.serialize("cb58");
        let setstr = JSON.stringify(setobj);
        let set2newobj = JSON.parse(setstr);
        let set2 = new utxos_1.UTXOSet();
        set2.deserialize(set2newobj, "cb58");
        let set2obj = set2.serialize("cb58");
        let set2str = JSON.stringify(set2obj);
        expect(set2.getAllUTXOStrings().sort().join(",")).toBe(set.getAllUTXOStrings().sort().join(","));
    });
    test("Mutliple add", () => {
        const set = new utxos_1.UTXOSet();
        // first add
        for (let i = 0; i < utxostrs.length; i++) {
            set.add(utxostrs[i]);
        }
        // the verify (do these steps separate to ensure no overwrites)
        for (let i = 0; i < utxostrs.length; i++) {
            expect(set.includes(utxostrs[i])).toBe(true);
            const utxo = new utxos_1.UTXO();
            utxo.fromString(utxostrs[i]);
            const veriutxo = set.getUTXO(utxo.getUTXOID());
            expect(veriutxo.toString()).toBe(utxostrs[i]);
        }
    });
    test("addArray", () => {
        const set = new utxos_1.UTXOSet();
        set.addArray(utxostrs);
        for (let i = 0; i < utxostrs.length; i++) {
            const e1 = new utxos_1.UTXO();
            e1.fromString(utxostrs[i]);
            expect(set.includes(e1)).toBe(true);
            const utxo = new utxos_1.UTXO();
            utxo.fromString(utxostrs[i]);
            const veriutxo = set.getUTXO(utxo.getUTXOID());
            expect(veriutxo.toString()).toBe(utxostrs[i]);
        }
        set.addArray(set.getAllUTXOs());
        for (let i = 0; i < utxostrs.length; i++) {
            const utxo = new utxos_1.UTXO();
            utxo.fromString(utxostrs[i]);
            expect(set.includes(utxo)).toBe(true);
            const veriutxo = set.getUTXO(utxo.getUTXOID());
            expect(veriutxo.toString()).toBe(utxostrs[i]);
        }
        let o = set.serialize("hex");
        let s = new utxos_1.UTXOSet();
        s.deserialize(o);
        let t = set.serialize(display);
        let r = new utxos_1.UTXOSet();
        r.deserialize(t);
    });
    test("overwriting UTXO", () => {
        const set = new utxos_1.UTXOSet();
        set.addArray(utxostrs);
        const testutxo = new utxos_1.UTXO();
        testutxo.fromString(utxostrs[0]);
        expect(set.add(utxostrs[0], true).toString()).toBe(testutxo.toString());
        expect(set.add(utxostrs[0], false)).toBeUndefined();
        expect(set.addArray(utxostrs, true).length).toBe(3);
        expect(set.addArray(utxostrs, false).length).toBe(0);
    });
    describe("Functionality", () => {
        let set;
        let utxos;
        beforeEach(() => {
            set = new utxos_1.UTXOSet();
            set.addArray(utxostrs);
            utxos = set.getAllUTXOs();
        });
        test("remove", () => {
            const testutxo = new utxos_1.UTXO();
            testutxo.fromString(utxostrs[0]);
            expect(set.remove(utxostrs[0]).toString()).toBe(testutxo.toString());
            expect(set.remove(utxostrs[0])).toBeUndefined();
            expect(set.add(utxostrs[0], false).toString()).toBe(testutxo.toString());
            expect(set.remove(utxostrs[0]).toString()).toBe(testutxo.toString());
        });
        test("removeArray", () => {
            const testutxo = new utxos_1.UTXO();
            testutxo.fromString(utxostrs[0]);
            expect(set.removeArray(utxostrs).length).toBe(3);
            expect(set.removeArray(utxostrs).length).toBe(0);
            expect(set.add(utxostrs[0], false).toString()).toBe(testutxo.toString());
            expect(set.removeArray(utxostrs).length).toBe(1);
            expect(set.addArray(utxostrs, false).length).toBe(3);
            expect(set.removeArray(utxos).length).toBe(3);
        });
        test("getUTXOIDs", () => {
            const uids = set.getUTXOIDs();
            for (let i = 0; i < utxos.length; i++) {
                expect(uids.indexOf(utxos[i].getUTXOID())).not.toBe(-1);
            }
        });
        test("getAllUTXOs", () => {
            const allutxos = set.getAllUTXOs();
            const ustrs = [];
            for (let i = 0; i < allutxos.length; i++) {
                ustrs.push(allutxos[i].toString());
            }
            for (let i = 0; i < utxostrs.length; i++) {
                expect(ustrs.indexOf(utxostrs[i])).not.toBe(-1);
            }
            const uids = set.getUTXOIDs();
            const allutxos2 = set.getAllUTXOs(uids);
            const ustrs2 = [];
            for (let i = 0; i < allutxos.length; i++) {
                ustrs2.push(allutxos2[i].toString());
            }
            for (let i = 0; i < utxostrs.length; i++) {
                expect(ustrs2.indexOf(utxostrs[i])).not.toBe(-1);
            }
        });
        test("getUTXOIDs By Address", () => {
            let utxoids;
            utxoids = set.getUTXOIDs([addrs[0]]);
            expect(utxoids.length).toBe(1);
            utxoids = set.getUTXOIDs(addrs);
            expect(utxoids.length).toBe(3);
            utxoids = set.getUTXOIDs(addrs, false);
            expect(utxoids.length).toBe(3);
        });
        test("getAllUTXOStrings", () => {
            const ustrs = set.getAllUTXOStrings();
            for (let i = 0; i < utxostrs.length; i++) {
                expect(ustrs.indexOf(utxostrs[i])).not.toBe(-1);
            }
            const uids = set.getUTXOIDs();
            const ustrs2 = set.getAllUTXOStrings(uids);
            for (let i = 0; i < utxostrs.length; i++) {
                expect(ustrs2.indexOf(utxostrs[i])).not.toBe(-1);
            }
        });
        test("getAddresses", () => {
            expect(set.getAddresses().sort()).toStrictEqual(addrs.sort());
        });
        test("getBalance", () => {
            let balance1;
            let balance2;
            balance1 = new bn_js_1.default(0);
            balance2 = new bn_js_1.default(0);
            for (let i = 0; i < utxos.length; i++) {
                const assetID = utxos[i].getAssetID();
                balance1 = balance1.add(set.getBalance(addrs, assetID));
                balance2 = balance2.add(utxos[i].getOutput().getAmount());
            }
            expect(balance1.gt(new bn_js_1.default(0))).toBe(true);
            expect(balance2.gt(new bn_js_1.default(0))).toBe(true);
            balance1 = new bn_js_1.default(0);
            balance2 = new bn_js_1.default(0);
            const now = (0, helperfunctions_1.UnixNow)();
            for (let i = 0; i < utxos.length; i++) {
                const assetID = bintools.cb58Encode(utxos[i].getAssetID());
                balance1 = balance1.add(set.getBalance(addrs, assetID, now));
                balance2 = balance2.add(utxos[i].getOutput().getAmount());
            }
            expect(balance1.gt(new bn_js_1.default(0))).toBe(true);
            expect(balance2.gt(new bn_js_1.default(0))).toBe(true);
        });
        test("getAssetIDs", () => {
            const assetIDs = set.getAssetIDs();
            for (let i = 0; i < utxos.length; i++) {
                expect(assetIDs).toContain(utxos[i].getAssetID());
            }
            const addresses = set.getAddresses();
            expect(set.getAssetIDs(addresses)).toEqual(set.getAssetIDs());
        });
        describe("Merge Rules", () => {
            let setA;
            let setB;
            let setC;
            let setD;
            let setE;
            let setF;
            let setG;
            let setH;
            // Take-or-Leave
            const newutxo = bintools.cb58Encode(buffer_1.Buffer.from("0000acf88647b3fbaa9fdf4378f3a0df6a5d15d8efb018ad78f12690390e79e1687600000003acf88647b3fbaa9fdf4378f3a0df6a5d15d8efb018ad78f12690390e79e168760000000700000000000186a000000000000000000000000100000001fceda8f90fcb5d30614b99d79fc4baa293077626", "hex"));
            beforeEach(() => {
                setA = new utxos_1.UTXOSet();
                setA.addArray([utxostrs[0], utxostrs[2]]);
                setB = new utxos_1.UTXOSet();
                setB.addArray([utxostrs[1], utxostrs[2]]);
                setC = new utxos_1.UTXOSet();
                setC.addArray([utxostrs[0], utxostrs[1]]);
                setD = new utxos_1.UTXOSet();
                setD.addArray([utxostrs[1]]);
                setE = new utxos_1.UTXOSet();
                setE.addArray([]); // empty set
                setF = new utxos_1.UTXOSet();
                setF.addArray(utxostrs); // full set, separate from self
                setG = new utxos_1.UTXOSet();
                setG.addArray([newutxo, ...utxostrs]); // full set with new element
                setH = new utxos_1.UTXOSet();
                setH.addArray([newutxo]); // set with only a new element
            });
            test("unknown merge rule", () => {
                expect(() => {
                    set.mergeByRule(setA, "ERROR");
                }).toThrow();
                const setArray = setG.getAllUTXOs();
            });
            test("intersection", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "intersection");
                test = setMergeTester(results, [setA], [setB, setC, setD, setE, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "intersection");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "intersection");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "intersection");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
            });
            test("differenceSelf", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "differenceSelf");
                test = setMergeTester(results, [setD], [setA, setB, setC, setE, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "differenceSelf");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "differenceSelf");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "differenceSelf");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
            });
            test("differenceNew", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "differenceNew");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "differenceNew");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "differenceNew");
                test = setMergeTester(results, [setH], [setA, setB, setC, setD, setE, setF, setG]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "differenceNew");
                test = setMergeTester(results, [setH], [setA, setB, setC, setD, setE, setF, setG]);
                expect(test).toBe(true);
            });
            test("symDifference", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "symDifference");
                test = setMergeTester(results, [setD], [setA, setB, setC, setE, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "symDifference");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "symDifference");
                test = setMergeTester(results, [setH], [setA, setB, setC, setD, setE, setF, setG]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "symDifference");
                test = setMergeTester(results, [setG], [setA, setB, setC, setD, setE, setF, setH]);
                expect(test).toBe(true);
            });
            test("union", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "union");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "union");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "union");
                test = setMergeTester(results, [setG], [setA, setB, setC, setD, setE, setF, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "union");
                test = setMergeTester(results, [setG], [setA, setB, setC, setD, setE, setF, setH]);
                expect(test).toBe(true);
            });
            test("unionMinusNew", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "unionMinusNew");
                test = setMergeTester(results, [setD], [setA, setB, setC, setE, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "unionMinusNew");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "unionMinusNew");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "unionMinusNew");
                test = setMergeTester(results, [setF], [setA, setB, setC, setD, setE, setG, setH]);
                expect(test).toBe(true);
            });
            test("unionMinusSelf", () => {
                let results;
                let test;
                results = set.mergeByRule(setA, "unionMinusSelf");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setF, "unionMinusSelf");
                test = setMergeTester(results, [setE], [setA, setB, setC, setD, setF, setG, setH]);
                expect(test).toBe(true);
                results = set.mergeByRule(setG, "unionMinusSelf");
                test = setMergeTester(results, [setH], [setA, setB, setC, setD, setE, setF, setG]);
                expect(test).toBe(true);
                results = set.mergeByRule(setH, "unionMinusSelf");
                test = setMergeTester(results, [setH], [setA, setB, setC, setD, setE, setF, setG]);
                expect(test).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXR4b3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvcGxhdGZvcm12bS91dHhvcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLG9DQUFnQztBQUNoQywyRUFBa0Q7QUFDbEQsOERBQWtFO0FBRWxFLHdFQUE0RDtBQUc1RCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sT0FBTyxHQUF1QixTQUFTLENBQUE7QUFFN0MsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFTLEVBQUU7SUFDMUIsTUFBTSxPQUFPLEdBQ1gsOE9BQThPLENBQUE7SUFDaFAsTUFBTSxTQUFTLEdBQVcsVUFBVSxDQUFBO0lBQ3BDLE1BQU0sT0FBTyxHQUNYLGtFQUFrRSxDQUFBO0lBQ3BFLE1BQU0sTUFBTSxHQUNWLGtFQUFrRSxDQUFBO0lBQ3BFLE1BQU0sUUFBUSxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBRXBELFVBQVU7SUFDVixNQUFNLFNBQVMsR0FBVyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3ZELHlLQUF5SztJQUV6SyxvQ0FBb0M7SUFDcEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFTLEVBQUU7UUFDMUIsTUFBTSxFQUFFLEdBQVMsSUFBSSxZQUFJLEVBQUUsQ0FBQTtRQUMzQixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3ZCLE1BQU0sS0FBSyxHQUFXLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM3QixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFB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QUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN4RSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUN0RSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBUyxFQUFFO1lBQzdCLE1BQU0sUUFBUSxHQUFTLElBQUksWUFBSSxFQUFFLENBQUE7WUFDakMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtZQUN4RSxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEQsTUFBTSxD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TUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IHsgVVRYTywgVVRYT1NldCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL3V0eG9zXCJcclxuaW1wb3J0IHsgQW1vdW50T3V0cHV0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vb3V0cHV0c1wiXHJcbmltcG9ydCB7IFVuaXhOb3cgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9uc1wiXHJcbmltcG9ydCB7IFNlcmlhbGl6ZWRFbmNvZGluZyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHNcIlxyXG5cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBkaXNwbGF5OiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImRpc3BsYXlcIlxyXG5cclxuZGVzY3JpYmUoXCJVVFhPXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCB1dHhvaGV4OiBzdHJpbmcgPVxyXG4gICAgXCIwMDAwMzhkMWI5ZjExMzg2NzJkYTZmYjZjMzUxMjU1MzkyNzZhOWFjYzJhNjY4ZDYzYmVhNmJhM2M3OTVlMmVkYjBmNTAwMDAwMDAxM2UwN2UzOGUyZjIzMTIxYmU4NzU2NDEyYzE4ZGI3MjQ2YTE2ZDI2ZWU5OTM2ZjNjYmEyOGJlMTQ5Y2ZkMzU1ODAwMDAwMDA3MDAwMDAwMDAwMDAwNGRkNTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxYTM2ZmQwYzJkYmNhYjMxMTczMWRkZTdlZjE1MTRiZDI2ZmNkYzc0ZFwiXHJcbiAgY29uc3Qgb3V0cHV0aWR4OiBzdHJpbmcgPSBcIjAwMDAwMDAxXCJcclxuICBjb25zdCBvdXR0eGlkOiBzdHJpbmcgPVxyXG4gICAgXCIzOGQxYjlmMTEzODY3MmRhNmZiNmMzNTEyNTUzOTI3NmE5YWNjMmE2NjhkNjNiZWE2YmEzYzc5NWUyZWRiMGY1XCJcclxuICBjb25zdCBvdXRhaWQ6IHN0cmluZyA9XHJcbiAgICBcIjNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NThcIlxyXG4gIGNvbnN0IHV0eG9idWZmOiBCdWZmZXIgPSBCdWZmZXIuZnJvbSh1dHhvaGV4LCBcImhleFwiKVxyXG5cclxuICAvLyBQYXltZW50XHJcbiAgY29uc3QgT1BVVFhPc3RyOiBzdHJpbmcgPSBiaW50b29scy5jYjU4RW5jb2RlKHV0eG9idWZmKVxyXG4gIC8vIFwiVTlyRmdLNWpqZFhtVjhrNXRwcWVYa2ltenJOM285ZUNDY1hlc3loTUJCWnU5TVFKQ0RURG81V241cHNLdnpKVk1KcGlNYmRrZkRYa3A3c0taZGRmQ1pkeHB1RG15Tnk3VkZrYTE5ek1XNGpjejZEUlF2TmZBMmt2SllLazk2emM3dWl6Z3AzaTJGWVdyQjhtcjFzUEo4b1A5VGg2NEdRNXlIZDhcIlxyXG5cclxuICAvLyBpbXBsaWVzIGZyb21TdHJpbmcgYW5kIGZyb21CdWZmZXJcclxuICB0ZXN0KFwiQ3JlYXRpb25cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgdTE6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB1MS5mcm9tQnVmZmVyKHV0eG9idWZmKVxyXG4gICAgY29uc3QgdTFoZXg6IHN0cmluZyA9IHUxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGV4cGVjdCh1MWhleCkudG9CZSh1dHhvaGV4KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJFbXB0eSBDcmVhdGlvblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCB1MTogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgIGV4cGVjdCgoKSA9PiB7XHJcbiAgICAgIHUxLnRvQnVmZmVyKClcclxuICAgIH0pLnRvVGhyb3coKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJDcmVhdGlvbiBvZiBUeXBlXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IG9wOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgb3AuZnJvbVN0cmluZyhPUFVUWE9zdHIpXHJcbiAgICBleHBlY3Qob3AuZ2V0T3V0cHV0KCkuZ2V0T3V0cHV0SUQoKSkudG9CZSg3KVxyXG4gIH0pXHJcblxyXG4gIGRlc2NyaWJlKFwiRnVudGlvbmFsaXR5XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHUxOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgdTEuZnJvbUJ1ZmZlcih1dHhvYnVmZilcclxuICAgIGNvbnN0IHUxaGV4OiBzdHJpbmcgPSB1MS50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgICB0ZXN0KFwiZ2V0QXNzZXRJRCBOb25DQVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IGFzc2V0SUQ6IEJ1ZmZlciA9IHUxLmdldEFzc2V0SUQoKVxyXG4gICAgICBleHBlY3QoYXNzZXRJRC50b1N0cmluZyhcImhleFwiLCAwLCBhc3NldElELmxlbmd0aCkpLnRvQmUob3V0YWlkKVxyXG4gICAgfSlcclxuICAgIHRlc3QoXCJnZXRUeElEXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gdTEuZ2V0VHhJRCgpXHJcbiAgICAgIGV4cGVjdCh0eGlkLnRvU3RyaW5nKFwiaGV4XCIsIDAsIHR4aWQubGVuZ3RoKSkudG9CZShvdXR0eGlkKVxyXG4gICAgfSlcclxuICAgIHRlc3QoXCJnZXRPdXRwdXRJZHhcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCB0eGlkeDogQnVmZmVyID0gdTEuZ2V0T3V0cHV0SWR4KClcclxuICAgICAgZXhwZWN0KHR4aWR4LnRvU3RyaW5nKFwiaGV4XCIsIDAsIHR4aWR4Lmxlbmd0aCkpLnRvQmUob3V0cHV0aWR4KVxyXG4gICAgfSlcclxuICAgIHRlc3QoXCJnZXRVVFhPSURcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCB0eGlkOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShvdXR0eGlkLCBcImhleFwiKVxyXG4gICAgICBjb25zdCB0eGlkeDogQnVmZmVyID0gQnVmZmVyLmZyb20ob3V0cHV0aWR4LCBcImhleFwiKVxyXG4gICAgICBjb25zdCB1dHhvaWQ6IHN0cmluZyA9IGJpbnRvb2xzLmJ1ZmZlclRvQjU4KEJ1ZmZlci5jb25jYXQoW3R4aWQsIHR4aWR4XSkpXHJcbiAgICAgIGV4cGVjdCh1MS5nZXRVVFhPSUQoKSkudG9CZSh1dHhvaWQpXHJcbiAgICB9KVxyXG4gICAgdGVzdChcInRvU3RyaW5nXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3Qgc2VyaWFsaXplZDogc3RyaW5nID0gdTEudG9TdHJpbmcoKVxyXG4gICAgICBleHBlY3Qoc2VyaWFsaXplZCkudG9CZShiaW50b29scy5jYjU4RW5jb2RlKHV0eG9idWZmKSlcclxuICAgIH0pXHJcbiAgfSlcclxufSlcclxuXHJcbmNvbnN0IHNldE1lcmdlVGVzdGVyID0gKFxyXG4gIGlucHV0OiBVVFhPU2V0LFxyXG4gIGVxdWFsOiBVVFhPU2V0W10sXHJcbiAgbm90RXF1YWw6IFVUWE9TZXRbXVxyXG4pOiBib29sZWFuID0+IHtcclxuICBjb25zdCBpbnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoaW5wdXQuZ2V0VVRYT0lEcygpLnNvcnQoKSlcclxuICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZXF1YWwubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChKU09OLnN0cmluZ2lmeShlcXVhbFtpXS5nZXRVVFhPSURzKCkuc29ydCgpKSAhPSBpbnN0cikge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBub3RFcXVhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKEpTT04uc3RyaW5naWZ5KG5vdEVxdWFsW2ldLmdldFVUWE9JRHMoKS5zb3J0KCkpID09IGluc3RyKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG5kZXNjcmliZShcIlVUWE9TZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IHV0eG9zdHJzOiBzdHJpbmdbXSA9IFtcclxuICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMDM4ZDFiOWYxMTM4NjcyZGE2ZmI2YzM1MTI1NTM5Mjc2YTlhY2MyYTY2OGQ2M2JlYTZiYTNjNzk1ZTJlZGIwZjUwMDAwMDAwMTNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDRkZDUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWEzNmZkMGMyZGJjYWIzMTE3MzFkZGU3ZWYxNTE0YmQyNmZjZGM3NGRcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgICksXHJcbiAgICBiaW50b29scy5jYjU4RW5jb2RlKFxyXG4gICAgICBCdWZmZXIuZnJvbShcclxuICAgICAgICBcIjAwMDBjM2U0ODIzNTcxNTg3ZmUyYmRmYzUwMjY4OWY1YTgyMzhiOWQwZWE3ZjMyNzcxMjRkMTZhZjlkZTBkMmQ5OTExMDAwMDAwMDAzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDAwMDE5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFlMWI2YjZhNGJhZDk0ZDJlM2YyMDczMDM3OWI5YmNkNmYxNzYzMThlXCIsXHJcbiAgICAgICAgXCJoZXhcIlxyXG4gICAgICApXHJcbiAgICApLFxyXG4gICAgYmludG9vbHMuY2I1OEVuY29kZShcclxuICAgICAgQnVmZmVyLmZyb20oXHJcbiAgICAgICAgXCIwMDAwZjI5ZGJhNjFmZGE4ZDU3YTkxMWU3Zjg4MTBmOTM1YmRlODEwZDNmOGQ0OTU0MDQ2ODViZGI4ZDlkODU0NWU4NjAwMDAwMDAwM2UwN2UzOGUyZjIzMTIxYmU4NzU2NDEyYzE4ZGI3MjQ2YTE2ZDI2ZWU5OTM2ZjNjYmEyOGJlMTQ5Y2ZkMzU1ODAwMDAwMDA3MDAwMDAwMDAwMDAwMDAxOTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxZTFiNmI2YTRiYWQ5NGQyZTNmMjA3MzAzNzliOWJjZDZmMTc2MzE4ZVwiLFxyXG4gICAgICAgIFwiaGV4XCJcclxuICAgICAgKVxyXG4gICAgKVxyXG4gIF1cclxuICBjb25zdCBhZGRyczogQnVmZmVyW10gPSBbXHJcbiAgICBiaW50b29scy5jYjU4RGVjb2RlKFwiRnVCNkx3MkQ2Mk51TTh6cEdMQTRBdmVwcTdlR3NaUmlHXCIpLFxyXG4gICAgYmludG9vbHMuY2I1OERlY29kZShcIk1hVHZLR2NjYll6Q3h6QmtKcGIyekhXN0UxV1JlWnFCOFwiKVxyXG4gIF1cclxuICB0ZXN0KFwiQ3JlYXRpb25cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgc2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgc2V0LmFkZCh1dHhvc3Ryc1swXSlcclxuICAgIGNvbnN0IHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbMF0pXHJcbiAgICBjb25zdCBzZXRBcnJheTogVVRYT1tdID0gc2V0LmdldEFsbFVUWE9zKClcclxuICAgIGV4cGVjdCh1dHhvLnRvU3RyaW5nKCkpLnRvQmUoc2V0QXJyYXlbMF0udG9TdHJpbmcoKSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiU2VyaWFsaXphdGlvblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBzZXQuYWRkQXJyYXkoWy4uLnV0eG9zdHJzXSlcclxuICAgIGxldCBzZXRvYmo6IG9iamVjdCA9IHNldC5zZXJpYWxpemUoXCJjYjU4XCIpXHJcbiAgICBsZXQgc2V0c3RyOiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZXRvYmopXHJcbiAgICBsZXQgc2V0Mm5ld29iajogb2JqZWN0ID0gSlNPTi5wYXJzZShzZXRzdHIpXHJcbiAgICBsZXQgc2V0MjogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIHNldDIuZGVzZXJpYWxpemUoc2V0Mm5ld29iaiwgXCJjYjU4XCIpXHJcbiAgICBsZXQgc2V0Mm9iajogb2JqZWN0ID0gc2V0Mi5zZXJpYWxpemUoXCJjYjU4XCIpXHJcbiAgICBsZXQgc2V0MnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoc2V0Mm9iailcclxuICAgIGV4cGVjdChzZXQyLmdldEFsbFVUWE9TdHJpbmdzKCkuc29ydCgpLmpvaW4oXCIsXCIpKS50b0JlKFxyXG4gICAgICBzZXQuZ2V0QWxsVVRYT1N0cmluZ3MoKS5zb3J0KCkuam9pbihcIixcIilcclxuICAgIClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiTXV0bGlwbGUgYWRkXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHNldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIC8vIGZpcnN0IGFkZFxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zdHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHNldC5hZGQodXR4b3N0cnNbaV0pXHJcbiAgICB9XHJcbiAgICAvLyB0aGUgdmVyaWZ5IChkbyB0aGVzZSBzdGVwcyBzZXBhcmF0ZSB0byBlbnN1cmUgbm8gb3ZlcndyaXRlcylcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBleHBlY3Qoc2V0LmluY2x1ZGVzKHV0eG9zdHJzW2ldKSkudG9CZSh0cnVlKVxyXG4gICAgICBjb25zdCB1dHhvOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgICB1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbaV0pXHJcbiAgICAgIGNvbnN0IHZlcml1dHhvOiBVVFhPID0gc2V0LmdldFVUWE8odXR4by5nZXRVVFhPSUQoKSkgYXMgVVRYT1xyXG4gICAgICBleHBlY3QodmVyaXV0eG8udG9TdHJpbmcoKSkudG9CZSh1dHhvc3Ryc1tpXSlcclxuICAgIH1cclxuICB9KVxyXG5cclxuICB0ZXN0KFwiYWRkQXJyYXlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgc2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgc2V0LmFkZEFycmF5KHV0eG9zdHJzKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zdHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGUxOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgICBlMS5mcm9tU3RyaW5nKHV0eG9zdHJzW2ldKVxyXG4gICAgICBleHBlY3Qoc2V0LmluY2x1ZGVzKGUxKSkudG9CZSh0cnVlKVxyXG4gICAgICBjb25zdCB1dHhvOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgICB1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbaV0pXHJcbiAgICAgIGNvbnN0IHZlcml1dHhvOiBVVFhPID0gc2V0LmdldFVUWE8odXR4by5nZXRVVFhPSUQoKSkgYXMgVVRYT1xyXG4gICAgICBleHBlY3QodmVyaXV0eG8udG9TdHJpbmcoKSkudG9CZSh1dHhvc3Ryc1tpXSlcclxuICAgIH1cclxuXHJcbiAgICBzZXQuYWRkQXJyYXkoc2V0LmdldEFsbFVUWE9zKCkpXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3N0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgICAgdXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzW2ldKVxyXG4gICAgICBleHBlY3Qoc2V0LmluY2x1ZGVzKHV0eG8pKS50b0JlKHRydWUpXHJcblxyXG4gICAgICBjb25zdCB2ZXJpdXR4bzogVVRYTyA9IHNldC5nZXRVVFhPKHV0eG8uZ2V0VVRYT0lEKCkpIGFzIFVUWE9cclxuICAgICAgZXhwZWN0KHZlcml1dHhvLnRvU3RyaW5nKCkpLnRvQmUodXR4b3N0cnNbaV0pXHJcbiAgICB9XHJcbiAgICBsZXQgbzogb2JqZWN0ID0gc2V0LnNlcmlhbGl6ZShcImhleFwiKVxyXG4gICAgbGV0IHM6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBzLmRlc2VyaWFsaXplKG8pXHJcbiAgICBsZXQgdDogb2JqZWN0ID0gc2V0LnNlcmlhbGl6ZShkaXNwbGF5KVxyXG4gICAgbGV0IHI6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICByLmRlc2VyaWFsaXplKHQpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIm92ZXJ3cml0aW5nIFVUWE9cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgc2V0OiBVVFhPU2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgc2V0LmFkZEFycmF5KHV0eG9zdHJzKVxyXG4gICAgY29uc3QgdGVzdHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB0ZXN0dXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzWzBdKVxyXG4gICAgZXhwZWN0KHNldC5hZGQodXR4b3N0cnNbMF0sIHRydWUpLnRvU3RyaW5nKCkpLnRvQmUodGVzdHV0eG8udG9TdHJpbmcoKSlcclxuICAgIGV4cGVjdChzZXQuYWRkKHV0eG9zdHJzWzBdLCBmYWxzZSkpLnRvQmVVbmRlZmluZWQoKVxyXG4gICAgZXhwZWN0KHNldC5hZGRBcnJheSh1dHhvc3RycywgdHJ1ZSkubGVuZ3RoKS50b0JlKDMpXHJcbiAgICBleHBlY3Qoc2V0LmFkZEFycmF5KHV0eG9zdHJzLCBmYWxzZSkubGVuZ3RoKS50b0JlKDApXHJcbiAgfSlcclxuXHJcbiAgZGVzY3JpYmUoXCJGdW5jdGlvbmFsaXR5XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGxldCBzZXQ6IFVUWE9TZXRcclxuICAgIGxldCB1dHhvczogVVRYT1tdXHJcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcclxuICAgICAgc2V0ID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICBzZXQuYWRkQXJyYXkodXR4b3N0cnMpXHJcbiAgICAgIHV0eG9zID0gc2V0LmdldEFsbFVUWE9zKClcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcInJlbW92ZVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHRlc3R1dHhvOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgICB0ZXN0dXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzWzBdKVxyXG4gICAgICBleHBlY3Qoc2V0LnJlbW92ZSh1dHhvc3Ryc1swXSkudG9TdHJpbmcoKSkudG9CZSh0ZXN0dXR4by50b1N0cmluZygpKVxyXG4gICAgICBleHBlY3Qoc2V0LnJlbW92ZSh1dHhvc3Ryc1swXSkpLnRvQmVVbmRlZmluZWQoKVxyXG4gICAgICBleHBlY3Qoc2V0LmFkZCh1dHhvc3Ryc1swXSwgZmFsc2UpLnRvU3RyaW5nKCkpLnRvQmUodGVzdHV0eG8udG9TdHJpbmcoKSlcclxuICAgICAgZXhwZWN0KHNldC5yZW1vdmUodXR4b3N0cnNbMF0pLnRvU3RyaW5nKCkpLnRvQmUodGVzdHV0eG8udG9TdHJpbmcoKSlcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcInJlbW92ZUFycmF5XCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdGVzdHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAgIHRlc3R1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbMF0pXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlQXJyYXkodXR4b3N0cnMpLmxlbmd0aCkudG9CZSgzKVxyXG4gICAgICBleHBlY3Qoc2V0LnJlbW92ZUFycmF5KHV0eG9zdHJzKS5sZW5ndGgpLnRvQmUoMClcclxuICAgICAgZXhwZWN0KHNldC5hZGQodXR4b3N0cnNbMF0sIGZhbHNlKS50b1N0cmluZygpKS50b0JlKHRlc3R1dHhvLnRvU3RyaW5nKCkpXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlQXJyYXkodXR4b3N0cnMpLmxlbmd0aCkudG9CZSgxKVxyXG4gICAgICBleHBlY3Qoc2V0LmFkZEFycmF5KHV0eG9zdHJzLCBmYWxzZSkubGVuZ3RoKS50b0JlKDMpXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlQXJyYXkodXR4b3MpLmxlbmd0aCkudG9CZSgzKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0VVRYT0lEc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHVpZHM6IHN0cmluZ1tdID0gc2V0LmdldFVUWE9JRHMoKVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHBlY3QodWlkcy5pbmRleE9mKHV0eG9zW2ldLmdldFVUWE9JRCgpKSkubm90LnRvQmUoLTEpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImdldEFsbFVUWE9zXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgYWxsdXR4b3M6IFVUWE9bXSA9IHNldC5nZXRBbGxVVFhPcygpXHJcbiAgICAgIGNvbnN0IHVzdHJzOiBzdHJpbmdbXSA9IFtdXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhbGx1dHhvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHVzdHJzLnB1c2goYWxsdXR4b3NbaV0udG9TdHJpbmcoKSlcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3N0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHBlY3QodXN0cnMuaW5kZXhPZih1dHhvc3Ryc1tpXSkpLm5vdC50b0JlKC0xKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHVpZHM6IHN0cmluZ1tdID0gc2V0LmdldFVUWE9JRHMoKVxyXG4gICAgICBjb25zdCBhbGx1dHhvczI6IFVUWE9bXSA9IHNldC5nZXRBbGxVVFhPcyh1aWRzKVxyXG4gICAgICBjb25zdCB1c3RyczI6IHN0cmluZ1tdID0gW11cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFsbHV0eG9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdXN0cnMyLnB1c2goYWxsdXR4b3MyW2ldLnRvU3RyaW5nKCkpXHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zdHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZXhwZWN0KHVzdHJzMi5pbmRleE9mKHV0eG9zdHJzW2ldKSkubm90LnRvQmUoLTEpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImdldFVUWE9JRHMgQnkgQWRkcmVzc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB1dHhvaWRzOiBzdHJpbmdbXVxyXG4gICAgICB1dHhvaWRzID0gc2V0LmdldFVUWE9JRHMoW2FkZHJzWzBdXSlcclxuICAgICAgZXhwZWN0KHV0eG9pZHMubGVuZ3RoKS50b0JlKDEpXHJcbiAgICAgIHV0eG9pZHMgPSBzZXQuZ2V0VVRYT0lEcyhhZGRycylcclxuICAgICAgZXhwZWN0KHV0eG9pZHMubGVuZ3RoKS50b0JlKDMpXHJcbiAgICAgIHV0eG9pZHMgPSBzZXQuZ2V0VVRYT0lEcyhhZGRycywgZmFsc2UpXHJcbiAgICAgIGV4cGVjdCh1dHhvaWRzLmxlbmd0aCkudG9CZSgzKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0QWxsVVRYT1N0cmluZ3NcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCB1c3Ryczogc3RyaW5nW10gPSBzZXQuZ2V0QWxsVVRYT1N0cmluZ3MoKVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3N0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHBlY3QodXN0cnMuaW5kZXhPZih1dHhvc3Ryc1tpXSkpLm5vdC50b0JlKC0xKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHVpZHM6IHN0cmluZ1tdID0gc2V0LmdldFVUWE9JRHMoKVxyXG4gICAgICBjb25zdCB1c3RyczI6IHN0cmluZ1tdID0gc2V0LmdldEFsbFVUWE9TdHJpbmdzKHVpZHMpXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGV4cGVjdCh1c3RyczIuaW5kZXhPZih1dHhvc3Ryc1tpXSkpLm5vdC50b0JlKC0xKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJnZXRBZGRyZXNzZXNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBleHBlY3Qoc2V0LmdldEFkZHJlc3NlcygpLnNvcnQoKSkudG9TdHJpY3RFcXVhbChhZGRycy5zb3J0KCkpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJnZXRCYWxhbmNlXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGJhbGFuY2UxOiBCTlxyXG4gICAgICBsZXQgYmFsYW5jZTI6IEJOXHJcbiAgICAgIGJhbGFuY2UxID0gbmV3IEJOKDApXHJcbiAgICAgIGJhbGFuY2UyID0gbmV3IEJOKDApXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGFzc2V0SUQgPSB1dHhvc1tpXS5nZXRBc3NldElEKClcclxuICAgICAgICBiYWxhbmNlMSA9IGJhbGFuY2UxLmFkZChzZXQuZ2V0QmFsYW5jZShhZGRycywgYXNzZXRJRCkpXHJcbiAgICAgICAgYmFsYW5jZTIgPSBiYWxhbmNlMi5hZGQoXHJcbiAgICAgICAgICAodXR4b3NbaV0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICBleHBlY3QoYmFsYW5jZTEuZ3QobmV3IEJOKDApKSkudG9CZSh0cnVlKVxyXG4gICAgICBleHBlY3QoYmFsYW5jZTIuZ3QobmV3IEJOKDApKSkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgYmFsYW5jZTEgPSBuZXcgQk4oMClcclxuICAgICAgYmFsYW5jZTIgPSBuZXcgQk4oMClcclxuICAgICAgY29uc3Qgbm93OiBCTiA9IFVuaXhOb3coKVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBhc3NldElEID0gYmludG9vbHMuY2I1OEVuY29kZSh1dHhvc1tpXS5nZXRBc3NldElEKCkpXHJcbiAgICAgICAgYmFsYW5jZTEgPSBiYWxhbmNlMS5hZGQoc2V0LmdldEJhbGFuY2UoYWRkcnMsIGFzc2V0SUQsIG5vdykpXHJcbiAgICAgICAgYmFsYW5jZTIgPSBiYWxhbmNlMi5hZGQoXHJcbiAgICAgICAgICAodXR4b3NbaV0uZ2V0T3V0cHV0KCkgYXMgQW1vdW50T3V0cHV0KS5nZXRBbW91bnQoKVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgICBleHBlY3QoYmFsYW5jZTEuZ3QobmV3IEJOKDApKSkudG9CZSh0cnVlKVxyXG4gICAgICBleHBlY3QoYmFsYW5jZTIuZ3QobmV3IEJOKDApKSkudG9CZSh0cnVlKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0QXNzZXRJRHNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBhc3NldElEczogQnVmZmVyW10gPSBzZXQuZ2V0QXNzZXRJRHMoKVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHBlY3QoYXNzZXRJRHMpLnRvQ29udGFpbih1dHhvc1tpXS5nZXRBc3NldElEKCkpXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgYWRkcmVzc2VzOiBCdWZmZXJbXSA9IHNldC5nZXRBZGRyZXNzZXMoKVxyXG4gICAgICBleHBlY3Qoc2V0LmdldEFzc2V0SURzKGFkZHJlc3NlcykpLnRvRXF1YWwoc2V0LmdldEFzc2V0SURzKCkpXHJcbiAgICB9KVxyXG5cclxuICAgIGRlc2NyaWJlKFwiTWVyZ2UgUnVsZXNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgc2V0QTogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0QjogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0QzogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0RDogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0RTogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0RjogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0RzogVVRYT1NldFxyXG4gICAgICBsZXQgc2V0SDogVVRYT1NldFxyXG4gICAgICAvLyBUYWtlLW9yLUxlYXZlXHJcbiAgICAgIGNvbnN0IG5ld3V0eG86IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgICAgQnVmZmVyLmZyb20oXHJcbiAgICAgICAgICBcIjAwMDBhY2Y4ODY0N2IzZmJhYTlmZGY0Mzc4ZjNhMGRmNmE1ZDE1ZDhlZmIwMThhZDc4ZjEyNjkwMzkwZTc5ZTE2ODc2MDAwMDAwMDNhY2Y4ODY0N2IzZmJhYTlmZGY0Mzc4ZjNhMGRmNmE1ZDE1ZDhlZmIwMThhZDc4ZjEyNjkwMzkwZTc5ZTE2ODc2MDAwMDAwMDcwMDAwMDAwMDAwMDE4NmEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFmY2VkYThmOTBmY2I1ZDMwNjE0Yjk5ZDc5ZmM0YmFhMjkzMDc3NjI2XCIsXHJcbiAgICAgICAgICBcImhleFwiXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcblxyXG4gICAgICBiZWZvcmVFYWNoKCgpOiB2b2lkID0+IHtcclxuICAgICAgICBzZXRBID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICAgIHNldEEuYWRkQXJyYXkoW3V0eG9zdHJzWzBdLCB1dHhvc3Ryc1syXV0pXHJcblxyXG4gICAgICAgIHNldEIgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgc2V0Qi5hZGRBcnJheShbdXR4b3N0cnNbMV0sIHV0eG9zdHJzWzJdXSlcclxuXHJcbiAgICAgICAgc2V0QyA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRDLmFkZEFycmF5KFt1dHhvc3Ryc1swXSwgdXR4b3N0cnNbMV1dKVxyXG5cclxuICAgICAgICBzZXREID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICAgIHNldEQuYWRkQXJyYXkoW3V0eG9zdHJzWzFdXSlcclxuXHJcbiAgICAgICAgc2V0RSA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRFLmFkZEFycmF5KFtdKSAvLyBlbXB0eSBzZXRcclxuXHJcbiAgICAgICAgc2V0RiA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRGLmFkZEFycmF5KHV0eG9zdHJzKSAvLyBmdWxsIHNldCwgc2VwYXJhdGUgZnJvbSBzZWxmXHJcblxyXG4gICAgICAgIHNldEcgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgc2V0Ry5hZGRBcnJheShbbmV3dXR4bywgLi4udXR4b3N0cnNdKSAvLyBmdWxsIHNldCB3aXRoIG5ldyBlbGVtZW50XHJcblxyXG4gICAgICAgIHNldEggPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgc2V0SC5hZGRBcnJheShbbmV3dXR4b10pIC8vIHNldCB3aXRoIG9ubHkgYSBuZXcgZWxlbWVudFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcInVua25vd24gbWVyZ2UgcnVsZVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgICAgIHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcIkVSUk9SXCIpXHJcbiAgICAgICAgfSkudG9UaHJvdygpXHJcbiAgICAgICAgY29uc3Qgc2V0QXJyYXk6IFVUWE9bXSA9IHNldEcuZ2V0QWxsVVRYT3MoKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcImludGVyc2VjdGlvblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHM6IFVUWE9TZXRcclxuICAgICAgICBsZXQgdGVzdDogYm9vbGVhblxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEEsIFwiaW50ZXJzZWN0aW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRBXSxcclxuICAgICAgICAgIFtzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwiaW50ZXJzZWN0aW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRGXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwiaW50ZXJzZWN0aW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRGXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEgsIFwiaW50ZXJzZWN0aW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcImRpZmZlcmVuY2VTZWxmXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJkaWZmZXJlbmNlU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RF0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RSwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRGLCBcImRpZmZlcmVuY2VTZWxmXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwiZGlmZmVyZW5jZVNlbGZcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEVdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJkaWZmZXJlbmNlU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0Rl0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRlc3QoXCJkaWZmZXJlbmNlTmV3XCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJkaWZmZXJlbmNlTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwiZGlmZmVyZW5jZU5ld1wiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRHLCBcImRpZmZlcmVuY2VOZXdcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEhdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEYsIHNldEddXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJkaWZmZXJlbmNlTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRIXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRHXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcInN5bURpZmZlcmVuY2VcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBVVFhPU2V0XHJcbiAgICAgICAgbGV0IHRlc3Q6IGJvb2xlYW5cclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcInN5bURpZmZlcmVuY2VcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldERdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEUsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RiwgXCJzeW1EaWZmZXJlbmNlXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwic3ltRGlmZmVyZW5jZVwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0SF0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0R11cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRILCBcInN5bURpZmZlcmVuY2VcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEddLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEYsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB0ZXN0KFwidW5pb25cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBVVFhPU2V0XHJcbiAgICAgICAgbGV0IHRlc3Q6IGJvb2xlYW5cclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcInVuaW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRGXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwidW5pb25cIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEZdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RywgXCJ1bmlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0R10sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRILCBcInVuaW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRHXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcInVuaW9uTWludXNOZXdcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBVVFhPU2V0XHJcbiAgICAgICAgbGV0IHRlc3Q6IGJvb2xlYW5cclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcInVuaW9uTWludXNOZXdcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldERdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEUsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RiwgXCJ1bmlvbk1pbnVzTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwidW5pb25NaW51c05ld1wiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRILCBcInVuaW9uTWludXNOZXdcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEZdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB0ZXN0KFwidW5pb25NaW51c1NlbGZcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBVVFhPU2V0XHJcbiAgICAgICAgbGV0IHRlc3Q6IGJvb2xlYW5cclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcInVuaW9uTWludXNTZWxmXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwidW5pb25NaW51c1NlbGZcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEVdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RywgXCJ1bmlvbk1pbnVzU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0SF0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0R11cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRILCBcInVuaW9uTWludXNTZWxmXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRIXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRHXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9KVxyXG59KVxyXG4iXX0=