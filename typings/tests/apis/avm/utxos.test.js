"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const utxos_1 = require("../../../src/apis/avm/utxos");
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
    test("bad creation", () => {
        const set = new utxos_1.UTXOSet();
        const bad = bintools.cb58Encode(buffer_1.Buffer.from("aasdfasd", "hex"));
        set.add(bad);
        const utxo = new utxos_1.UTXO();
        expect(() => {
            utxo.fromString(bad);
        }).toThrow();
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
                balance1.add(set.getBalance(addrs, assetID));
                balance2.add(utxos[i].getOutput().getAmount());
            }
            expect(balance1.toString()).toBe(balance2.toString());
            balance1 = new bn_js_1.default(0);
            balance2 = new bn_js_1.default(0);
            const now = (0, helperfunctions_1.UnixNow)();
            for (let i = 0; i < utxos.length; i++) {
                const assetID = bintools.cb58Encode(utxos[i].getAssetID());
                balance1.add(set.getBalance(addrs, assetID, now));
                balance2.add(utxos[i].getOutput().getAmount());
            }
            expect(balance1.toString()).toBe(balance2.toString());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXR4b3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvYXZtL3V0eG9zLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBc0I7QUFDdEIsb0NBQWdDO0FBQ2hDLDJFQUFrRDtBQUNsRCx1REFBMkQ7QUFFM0Qsd0VBQTREO0FBRzVELE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxPQUFPLEdBQXVCLFNBQVMsQ0FBQTtBQUU3QyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUMxQixNQUFNLE9BQU8sR0FDWCw4T0FBOE8sQ0FBQTtJQUNoUCxNQUFNLFNBQVMsR0FBVyxVQUFVLENBQUE7SUFDcEMsTUFBTSxPQUFPLEdBQ1gsa0VBQWtFLENBQUE7SUFDcEUsTUFBTSxNQUFNLEdBQ1Ysa0VBQWtFLENBQUE7SUFDcEUsTUFBTSxRQUFRLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFFcEQsVUFBVTtJQUNWLE1BQU0sU0FBUyxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdkQseUtBQXlLO0lBRXpLLG9DQUFvQztJQUNwQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQVMsRUFBRTtRQUMxQixNQUFNLEVBQUUsR0FBUyxJQUFJLFlBQUksRUFBRSxDQUFBO1FBQzNCLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdkIsTUFBTSxLQUFLLEdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzdCLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQVMs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QU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ25DLE1BQU0sSUFBSSxHQUFTLElBQUksWUFBSSxFQUFFLENBQUE7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM1QixNQUFNLFFBQVEsR0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBUyxDQUFBO1lBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDOUM7UUFFRCxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1FBQy9CLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hELE1BQU0sSUFBSSxHQUFTLElBQUksWUFBSSxFQUFFLENBQUE7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVyQyxNQUFNLFFBQVEsR0FBUyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBUyxDQUFBO1lBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7U0FDOUM7UUFFRCxJQUFJLENBQUMsR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3BDLElBQUksQ0FBQyxHQUFZLElBQUksZUFBTyxFQUFFLENBQUE7UUFDOUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQixJQUFJLENBQUMsR0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3RDLElBQUksQ0FBQyxHQUFZLElBQUksZUFBTyxFQUFFLENBQUE7UUFDOUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFTLEVBQUU7UUFDbEMsTUFBTSxHQUFHLEdBQVksSUFBSSxlQUFPLEVBQUUsQ0FBQTtRQUNsQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ3RCLE1BQU0sUUFBUSxHQUFTLElBQUksWUFBSSxFQUFFLENBQUE7UUFDakMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDdkUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RELENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFTLEVBQUU7UUFDbkMsSUFBSSxHQUFZLENBQUE7UUFDaEIsSUFBSSxLQUFhLENBQUE7UUFDakIsVUFBVSxDQUFDLEdBQVMsRUFBRTtZQUNwQixHQUFHLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQTtZQUNuQixHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3RCLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDM0IsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQVMsRUFBRTtZQUN4QixNQUFNLFFBQVEsR0FBUyxJQUFJLFlBQUksRUFBRSxDQUFBO1lBQ2pDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDcEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUMvQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDeEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsYUFBYSxFQUFFLEdBQVMsRUFBRTtZQUM3QixNQUFNLFFBQVEsR0FBUyxJQUFJLFlBQUksRUFBRSxDQUFBO1lBQ2pDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNoRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFDeEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFTLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEdBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUN4RDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFTLEVBQUU7WUFDN0IsTUFBTSxRQUFRLEdBQVcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFBO1lBQzFDLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQTtZQUMxQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUNuQztZQUNELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNoRDtZQUNELE1BQU0sSUFBSSxHQUFhLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtZQUN2QyxNQUFNLFNBQVMsR0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQy9DLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQTtZQUMzQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTthQUNyQztZQUNELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNqRDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQVMsRUFBRTtZQUN2QyxJQUFJLE9BQWlCLENBQUE7WUFDckIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlCLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlCLE9BQU8sR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFTLEVBQUU7WUFDbkMsTUFBTSxLQUFLLEdBQWEsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0MsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2hEO1lBQ0QsTUFBTSxJQUFJLEdBQWEsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQ3ZDLE1BQU0sTUFBTSxHQUFhLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDakQ7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBUyxFQUFFO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsWUFBWSxFQUFFLEdBQVMsRUFBRTtZQUM1QixJQUFJLFFBQVksQ0FBQTtZQUNoQixJQUFJLFFBQVksQ0FBQTtZQUNoQixRQUFRLEdBQUcsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEIsUUFBUSxHQUFHLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQ3JDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtnQkFDNUMsUUFBUSxDQUFDLEdBQUcsQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFtQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7YUFDakU7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBRXJELFFBQVEsR0FBRyxJQUFJLGVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNwQixRQUFRLEdBQUcsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDcEIsTUFBTSxHQUFHLEdBQU8sSUFBQSx5QkFBTyxHQUFFLENBQUE7WUFDekIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7Z0JBQzFELFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7Z0JBQ2pELFFBQVEsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO2FBQ2pFO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBUyxFQUFFO1lBQzdCLE1BQU0sUUFBUSxHQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUM1QyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTthQUNsRDtZQUNELE1BQU0sU0FBUyxHQUFhLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUM5QyxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBUyxFQUFFO1lBQ2pDLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLElBQUksSUFBYSxDQUFBO1lBQ2pCLGdCQUFnQjtZQUNoQixNQUFNLE9BQU8sR0FBVyxRQUFRLENBQUMsVUFBVSxDQUN6QyxlQUFNLENBQUMsSUFBSSxDQUNULDhPQUE4TyxFQUM5TyxLQUFLLENBQ04sQ0FDRixDQUFBO1lBRUQsVUFBVSxDQUFDLEdBQVMsRUFBRTtnQkFDcEIsSUFBSSxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFekMsSUFBSSxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFekMsSUFBSSxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFekMsSUFBSSxHQUFHLElBQUksZUFBTyxFQUFFLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUU1QixJQUFJLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDLFlBQVk7Z0JBRTlCLElBQUksR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFBO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBLENBQUMsK0JBQStCO2dCQUV2RCxJQUFJLEdBQUcsSUFBSSxlQUFPLEVBQUUsQ0FBQTtnQkFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUEsQ0FBQyw0QkFBNEI7Z0JBRWxFLElBQUksR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFBO2dCQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQSxDQUFDLDhCQUE4QjtZQUN6RCxDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFTLEVBQUU7Z0JBQ3BDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7b0JBQ2hCLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO2dCQUNoQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNkLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFTLEVBQUU7Z0JBQzlCLElBQUksT0FBZ0IsQ0FBQTtnQkFDcEIsSUFBSSxJQUFhLENBQUE7Z0JBRWpCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtnQkFDL0MsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUV2QixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUE7Z0JBQy9DLElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO2dCQUMvQyxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQTtnQkFDL0MsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3pCLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQVMsRUFBRTtnQkFDaEMsSUFBSSxPQUFnQixDQUFBO2dCQUNwQixJQUFJLElBQWEsQ0FBQTtnQkFFakIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUE7Z0JBQ2pELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBUyxFQUFFO2dCQUMvQixJQUFJLE9BQWdCLENBQUE7Z0JBQ3BCLElBQUksSUFBYSxDQUFBO2dCQUVqQixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFBO2dCQUNoRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQTtnQkFDaEQsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUV2QixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBUyxFQUFFO2dCQUMvQixJQUFJLE9BQWdCLENBQUE7Z0JBQ3BCLElBQUksSUFBYSxDQUFBO2dCQUVqQixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFBO2dCQUNoRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQTtnQkFDaEQsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUV2QixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBUyxFQUFFO2dCQUN2QixJQUFJLE9BQWdCLENBQUE7Z0JBQ3BCLElBQUksSUFBYSxDQUFBO2dCQUVqQixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ3hDLElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO2dCQUN4QyxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFDeEMsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUV2QixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ3hDLElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBUyxFQUFFO2dCQUMvQixJQUFJLE9BQWdCLENBQUE7Z0JBQ3BCLElBQUksSUFBYSxDQUFBO2dCQUVqQixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFBO2dCQUNoRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQTtnQkFDaEQsSUFBSSxHQUFHLGNBQWMsQ0FDbkIsT0FBTyxFQUNQLENBQUMsSUFBSSxDQUFDLEVBQ04sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FDM0MsQ0FBQTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUV2QixPQUFPLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUE7Z0JBQ2hELElBQUksR0FBRyxjQUFjLENBQ25CLE9BQU8sRUFDUCxDQUFDLElBQUksQ0FBQyxFQUNOLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQzNDLENBQUE7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUN6QixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFTLEVBQUU7Z0JBQ2hDLElBQUksT0FBZ0IsQ0FBQTtnQkFDcEIsSUFBSSxJQUFhLENBQUE7Z0JBRWpCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO2dCQUNqRCxJQUFJLEdBQUcsY0FBYyxDQUNuQixPQUFPLEVBQ1AsQ0FBQyxJQUFJLENBQUMsRUFDTixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUMzQyxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDekIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IFVUWE8sIFVUWE9TZXQgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL3V0eG9zXCJcclxuaW1wb3J0IHsgQW1vdW50T3V0cHV0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bS9vdXRwdXRzXCJcclxuaW1wb3J0IHsgVW5peE5vdyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IHsgU2VyaWFsaXplZEVuY29kaW5nIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlsc1wiXHJcblxyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IGRpc3BsYXk6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiZGlzcGxheVwiXHJcblxyXG5kZXNjcmliZShcIlVUWE9cIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IHV0eG9oZXg6IHN0cmluZyA9XHJcbiAgICBcIjAwMDAzOGQxYjlmMTEzODY3MmRhNmZiNmMzNTEyNTUzOTI3NmE5YWNjMmE2NjhkNjNiZWE2YmEzYzc5NWUyZWRiMGY1MDAwMDAwMDEzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDA0ZGQ1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFhMzZmZDBjMmRiY2FiMzExNzMxZGRlN2VmMTUxNGJkMjZmY2RjNzRkXCJcclxuICBjb25zdCBvdXRwdXRpZHg6IHN0cmluZyA9IFwiMDAwMDAwMDFcIlxyXG4gIGNvbnN0IG91dHR4aWQ6IHN0cmluZyA9XHJcbiAgICBcIjM4ZDFiOWYxMTM4NjcyZGE2ZmI2YzM1MTI1NTM5Mjc2YTlhY2MyYTY2OGQ2M2JlYTZiYTNjNzk1ZTJlZGIwZjVcIlxyXG4gIGNvbnN0IG91dGFpZDogc3RyaW5nID1cclxuICAgIFwiM2UwN2UzOGUyZjIzMTIxYmU4NzU2NDEyYzE4ZGI3MjQ2YTE2ZDI2ZWU5OTM2ZjNjYmEyOGJlMTQ5Y2ZkMzU1OFwiXHJcbiAgY29uc3QgdXR4b2J1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHV0eG9oZXgsIFwiaGV4XCIpXHJcblxyXG4gIC8vIFBheW1lbnRcclxuICBjb25zdCBPUFVUWE9zdHI6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUodXR4b2J1ZmYpXHJcbiAgLy8gXCJVOXJGZ0s1ampkWG1WOGs1dHBxZVhraW16ck4zbzllQ0NjWGVzeWhNQkJadTlNUUpDRFREbzVXbjVwc0t2ekpWTUpwaU1iZGtmRFhrcDdzS1pkZGZDWmR4cHVEbXlOeTdWRmthMTl6TVc0amN6NkRSUXZOZkEya3ZKWUtrOTZ6Yzd1aXpncDNpMkZZV3JCOG1yMXNQSjhvUDlUaDY0R1E1eUhkOFwiXHJcblxyXG4gIC8vIGltcGxpZXMgZnJvbVN0cmluZyBhbmQgZnJvbUJ1ZmZlclxyXG4gIHRlc3QoXCJDcmVhdGlvblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCB1MTogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgIHUxLmZyb21CdWZmZXIodXR4b2J1ZmYpXHJcbiAgICBjb25zdCB1MWhleDogc3RyaW5nID0gdTEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgZXhwZWN0KHUxaGV4KS50b0JlKHV0eG9oZXgpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkVtcHR5IENyZWF0aW9uXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHUxOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgICAgdTEudG9CdWZmZXIoKVxyXG4gICAgfSkudG9UaHJvdygpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkNyZWF0aW9uIG9mIFR5cGVcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgb3A6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICBvcC5mcm9tU3RyaW5nKE9QVVRYT3N0cilcclxuICAgIGV4cGVjdChvcC5nZXRPdXRwdXQoKS5nZXRPdXRwdXRJRCgpKS50b0JlKDcpXHJcbiAgfSlcclxuXHJcbiAgZGVzY3JpYmUoXCJGdW50aW9uYWxpdHlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgdTE6IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICB1MS5mcm9tQnVmZmVyKHV0eG9idWZmKVxyXG4gICAgdGVzdChcImdldEFzc2V0SUQgTm9uQ0FcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBhc3NldElEOiBCdWZmZXIgPSB1MS5nZXRBc3NldElEKClcclxuICAgICAgZXhwZWN0KGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIiwgMCwgYXNzZXRJRC5sZW5ndGgpKS50b0JlKG91dGFpZClcclxuICAgIH0pXHJcbiAgICB0ZXN0KFwiZ2V0VHhJRFwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHR4aWQ6IEJ1ZmZlciA9IHUxLmdldFR4SUQoKVxyXG4gICAgICBleHBlY3QodHhpZC50b1N0cmluZyhcImhleFwiLCAwLCB0eGlkLmxlbmd0aCkpLnRvQmUob3V0dHhpZClcclxuICAgIH0pXHJcbiAgICB0ZXN0KFwiZ2V0T3V0cHV0SWR4XCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdHhpZHg6IEJ1ZmZlciA9IHUxLmdldE91dHB1dElkeCgpXHJcbiAgICAgIGV4cGVjdCh0eGlkeC50b1N0cmluZyhcImhleFwiLCAwLCB0eGlkeC5sZW5ndGgpKS50b0JlKG91dHB1dGlkeClcclxuICAgIH0pXHJcbiAgICB0ZXN0KFwiZ2V0VVRYT0lEXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gQnVmZmVyLmZyb20ob3V0dHhpZCwgXCJoZXhcIilcclxuICAgICAgY29uc3QgdHhpZHg6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKG91dHB1dGlkeCwgXCJoZXhcIilcclxuICAgICAgY29uc3QgdXR4b2lkOiBzdHJpbmcgPSBiaW50b29scy5idWZmZXJUb0I1OChCdWZmZXIuY29uY2F0KFt0eGlkLCB0eGlkeF0pKVxyXG4gICAgICBleHBlY3QodTEuZ2V0VVRYT0lEKCkpLnRvQmUodXR4b2lkKVxyXG4gICAgfSlcclxuICAgIHRlc3QoXCJ0b1N0cmluZ1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZWQ6IHN0cmluZyA9IHUxLnRvU3RyaW5nKClcclxuICAgICAgZXhwZWN0KHNlcmlhbGl6ZWQpLnRvQmUoYmludG9vbHMuY2I1OEVuY29kZSh1dHhvYnVmZikpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn0pXHJcblxyXG5jb25zdCBzZXRNZXJnZVRlc3RlciA9IChcclxuICBpbnB1dDogVVRYT1NldCxcclxuICBlcXVhbDogVVRYT1NldFtdLFxyXG4gIG5vdEVxdWFsOiBVVFhPU2V0W11cclxuKTogYm9vbGVhbiA9PiB7XHJcbiAgY29uc3QgaW5zdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGlucHV0LmdldFVUWE9JRHMoKS5zb3J0KCkpXHJcbiAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGVxdWFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkoZXF1YWxbaV0uZ2V0VVRYT0lEcygpLnNvcnQoKSkgIT0gaW5zdHIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbm90RXF1YWwubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChKU09OLnN0cmluZ2lmeShub3RFcXVhbFtpXS5nZXRVVFhPSURzKCkuc29ydCgpKSA9PSBpbnN0cikge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuZGVzY3JpYmUoXCJVVFhPU2V0XCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCB1dHhvc3Ryczogc3RyaW5nW10gPSBbXHJcbiAgICBiaW50b29scy5jYjU4RW5jb2RlKFxyXG4gICAgICBCdWZmZXIuZnJvbShcclxuICAgICAgICBcIjAwMDAzOGQxYjlmMTEzODY3MmRhNmZiNmMzNTEyNTUzOTI3NmE5YWNjMmE2NjhkNjNiZWE2YmEzYzc5NWUyZWRiMGY1MDAwMDAwMDEzZTA3ZTM4ZTJmMjMxMjFiZTg3NTY0MTJjMThkYjcyNDZhMTZkMjZlZTk5MzZmM2NiYTI4YmUxNDljZmQzNTU4MDAwMDAwMDcwMDAwMDAwMDAwMDA0ZGQ1MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxMDAwMDAwMDFhMzZmZDBjMmRiY2FiMzExNzMxZGRlN2VmMTUxNGJkMjZmY2RjNzRkXCIsXHJcbiAgICAgICAgXCJoZXhcIlxyXG4gICAgICApXHJcbiAgICApLFxyXG4gICAgYmludG9vbHMuY2I1OEVuY29kZShcclxuICAgICAgQnVmZmVyLmZyb20oXHJcbiAgICAgICAgXCIwMDAwYzNlNDgyMzU3MTU4N2ZlMmJkZmM1MDI2ODlmNWE4MjM4YjlkMGVhN2YzMjc3MTI0ZDE2YWY5ZGUwZDJkOTkxMTAwMDAwMDAwM2UwN2UzOGUyZjIzMTIxYmU4NzU2NDEyYzE4ZGI3MjQ2YTE2ZDI2ZWU5OTM2ZjNjYmEyOGJlMTQ5Y2ZkMzU1ODAwMDAwMDA3MDAwMDAwMDAwMDAwMDAxOTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTAwMDAwMDAxZTFiNmI2YTRiYWQ5NGQyZTNmMjA3MzAzNzliOWJjZDZmMTc2MzE4ZVwiLFxyXG4gICAgICAgIFwiaGV4XCJcclxuICAgICAgKVxyXG4gICAgKSxcclxuICAgIGJpbnRvb2xzLmNiNThFbmNvZGUoXHJcbiAgICAgIEJ1ZmZlci5mcm9tKFxyXG4gICAgICAgIFwiMDAwMGYyOWRiYTYxZmRhOGQ1N2E5MTFlN2Y4ODEwZjkzNWJkZTgxMGQzZjhkNDk1NDA0Njg1YmRiOGQ5ZDg1NDVlODYwMDAwMDAwMDNlMDdlMzhlMmYyMzEyMWJlODc1NjQxMmMxOGRiNzI0NmExNmQyNmVlOTkzNmYzY2JhMjhiZTE0OWNmZDM1NTgwMDAwMDAwNzAwMDAwMDAwMDAwMDAwMTkwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWUxYjZiNmE0YmFkOTRkMmUzZjIwNzMwMzc5YjliY2Q2ZjE3NjMxOGVcIixcclxuICAgICAgICBcImhleFwiXHJcbiAgICAgIClcclxuICAgIClcclxuICBdXHJcbiAgY29uc3QgYWRkcnM6IEJ1ZmZlcltdID0gW1xyXG4gICAgYmludG9vbHMuY2I1OERlY29kZShcIkZ1QjZMdzJENjJOdU04enBHTEE0QXZlcHE3ZUdzWlJpR1wiKSxcclxuICAgIGJpbnRvb2xzLmNiNThEZWNvZGUoXCJNYVR2S0djY2JZekN4ekJrSnBiMnpIVzdFMVdSZVpxQjhcIilcclxuICBdXHJcbiAgdGVzdChcIkNyZWF0aW9uXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHNldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIHNldC5hZGQodXR4b3N0cnNbMF0pXHJcbiAgICBjb25zdCB1dHhvOiBVVFhPID0gbmV3IFVUWE8oKVxyXG4gICAgdXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzWzBdKVxyXG4gICAgY29uc3Qgc2V0QXJyYXk6IFVUWE9bXSA9IHNldC5nZXRBbGxVVFhPcygpXHJcbiAgICBleHBlY3QodXR4by50b1N0cmluZygpKS50b0JlKHNldEFycmF5WzBdLnRvU3RyaW5nKCkpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImJhZCBjcmVhdGlvblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBjb25zdCBiYWQ6IHN0cmluZyA9IGJpbnRvb2xzLmNiNThFbmNvZGUoQnVmZmVyLmZyb20oXCJhYXNkZmFzZFwiLCBcImhleFwiKSlcclxuICAgIHNldC5hZGQoYmFkKVxyXG4gICAgY29uc3QgdXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuXHJcbiAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICB1dHhvLmZyb21TdHJpbmcoYmFkKVxyXG4gICAgfSkudG9UaHJvdygpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIk11dGxpcGxlIGFkZFwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAvLyBmaXJzdCBhZGRcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBzZXQuYWRkKHV0eG9zdHJzW2ldKVxyXG4gICAgfVxyXG4gICAgLy8gdGhlIHZlcmlmeSAoZG8gdGhlc2Ugc3RlcHMgc2VwYXJhdGUgdG8gZW5zdXJlIG5vIG92ZXJ3cml0ZXMpXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3N0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZXhwZWN0KHNldC5pbmNsdWRlcyh1dHhvc3Ryc1tpXSkpLnRvQmUodHJ1ZSlcclxuICAgICAgY29uc3QgdXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgICAgdXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzW2ldKVxyXG4gICAgICBjb25zdCB2ZXJpdXR4bzogVVRYTyA9IHNldC5nZXRVVFhPKHV0eG8uZ2V0VVRYT0lEKCkpIGFzIFVUWE9cclxuICAgICAgZXhwZWN0KHZlcml1dHhvLnRvU3RyaW5nKCkpLnRvQmUodXR4b3N0cnNbaV0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgdGVzdChcImFkZEFycmF5XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHNldDogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIHNldC5hZGRBcnJheSh1dHhvc3RycylcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBlMTogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgICAgZTEuZnJvbVN0cmluZyh1dHhvc3Ryc1tpXSlcclxuICAgICAgZXhwZWN0KHNldC5pbmNsdWRlcyhlMSkpLnRvQmUodHJ1ZSlcclxuICAgICAgY29uc3QgdXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgICAgdXR4by5mcm9tU3RyaW5nKHV0eG9zdHJzW2ldKVxyXG4gICAgICBjb25zdCB2ZXJpdXR4bzogVVRYTyA9IHNldC5nZXRVVFhPKHV0eG8uZ2V0VVRYT0lEKCkpIGFzIFVUWE9cclxuICAgICAgZXhwZWN0KHZlcml1dHhvLnRvU3RyaW5nKCkpLnRvQmUodXR4b3N0cnNbaV0pXHJcbiAgICB9XHJcblxyXG4gICAgc2V0LmFkZEFycmF5KHNldC5nZXRBbGxVVFhPcygpKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zdHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAgIHV0eG8uZnJvbVN0cmluZyh1dHhvc3Ryc1tpXSlcclxuICAgICAgZXhwZWN0KHNldC5pbmNsdWRlcyh1dHhvKSkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgY29uc3QgdmVyaXV0eG86IFVUWE8gPSBzZXQuZ2V0VVRYTyh1dHhvLmdldFVUWE9JRCgpKSBhcyBVVFhPXHJcbiAgICAgIGV4cGVjdCh2ZXJpdXR4by50b1N0cmluZygpKS50b0JlKHV0eG9zdHJzW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBvOiBvYmplY3QgPSBzZXQuc2VyaWFsaXplKFwiaGV4XCIpXHJcbiAgICBsZXQgczogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIHMuZGVzZXJpYWxpemUobylcclxuICAgIGxldCB0OiBvYmplY3QgPSBzZXQuc2VyaWFsaXplKGRpc3BsYXkpXHJcbiAgICBsZXQgcjogVVRYT1NldCA9IG5ldyBVVFhPU2V0KClcclxuICAgIHIuZGVzZXJpYWxpemUodClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwib3ZlcndyaXRpbmcgVVRYT1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBzZXQ6IFVUWE9TZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICBzZXQuYWRkQXJyYXkodXR4b3N0cnMpXHJcbiAgICBjb25zdCB0ZXN0dXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgIHRlc3R1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbMF0pXHJcbiAgICBleHBlY3Qoc2V0LmFkZCh1dHhvc3Ryc1swXSwgdHJ1ZSkudG9TdHJpbmcoKSkudG9CZSh0ZXN0dXR4by50b1N0cmluZygpKVxyXG4gICAgZXhwZWN0KHNldC5hZGQodXR4b3N0cnNbMF0sIGZhbHNlKSkudG9CZVVuZGVmaW5lZCgpXHJcbiAgICBleHBlY3Qoc2V0LmFkZEFycmF5KHV0eG9zdHJzLCB0cnVlKS5sZW5ndGgpLnRvQmUoMylcclxuICAgIGV4cGVjdChzZXQuYWRkQXJyYXkodXR4b3N0cnMsIGZhbHNlKS5sZW5ndGgpLnRvQmUoMClcclxuICB9KVxyXG5cclxuICBkZXNjcmliZShcIkZ1bmN0aW9uYWxpdHlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgbGV0IHNldDogVVRYT1NldFxyXG4gICAgbGV0IHV0eG9zOiBVVFhPW11cclxuICAgIGJlZm9yZUVhY2goKCk6IHZvaWQgPT4ge1xyXG4gICAgICBzZXQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgIHNldC5hZGRBcnJheSh1dHhvc3RycylcclxuICAgICAgdXR4b3MgPSBzZXQuZ2V0QWxsVVRYT3MoKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwicmVtb3ZlXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdGVzdHV0eG86IFVUWE8gPSBuZXcgVVRYTygpXHJcbiAgICAgIHRlc3R1dHhvLmZyb21TdHJpbmcodXR4b3N0cnNbMF0pXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlKHV0eG9zdHJzWzBdKS50b1N0cmluZygpKS50b0JlKHRlc3R1dHhvLnRvU3RyaW5nKCkpXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlKHV0eG9zdHJzWzBdKSkudG9CZVVuZGVmaW5lZCgpXHJcbiAgICAgIGV4cGVjdChzZXQuYWRkKHV0eG9zdHJzWzBdLCBmYWxzZSkudG9TdHJpbmcoKSkudG9CZSh0ZXN0dXR4by50b1N0cmluZygpKVxyXG4gICAgICBleHBlY3Qoc2V0LnJlbW92ZSh1dHhvc3Ryc1swXSkudG9TdHJpbmcoKSkudG9CZSh0ZXN0dXR4by50b1N0cmluZygpKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwicmVtb3ZlQXJyYXlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCB0ZXN0dXR4bzogVVRYTyA9IG5ldyBVVFhPKClcclxuICAgICAgdGVzdHV0eG8uZnJvbVN0cmluZyh1dHhvc3Ryc1swXSlcclxuICAgICAgZXhwZWN0KHNldC5yZW1vdmVBcnJheSh1dHhvc3RycykubGVuZ3RoKS50b0JlKDMpXHJcbiAgICAgIGV4cGVjdChzZXQucmVtb3ZlQXJyYXkodXR4b3N0cnMpLmxlbmd0aCkudG9CZSgwKVxyXG4gICAgICBleHBlY3Qoc2V0LmFkZCh1dHhvc3Ryc1swXSwgZmFsc2UpLnRvU3RyaW5nKCkpLnRvQmUodGVzdHV0eG8udG9TdHJpbmcoKSlcclxuICAgICAgZXhwZWN0KHNldC5yZW1vdmVBcnJheSh1dHhvc3RycykubGVuZ3RoKS50b0JlKDEpXHJcbiAgICAgIGV4cGVjdChzZXQuYWRkQXJyYXkodXR4b3N0cnMsIGZhbHNlKS5sZW5ndGgpLnRvQmUoMylcclxuICAgICAgZXhwZWN0KHNldC5yZW1vdmVBcnJheSh1dHhvcykubGVuZ3RoKS50b0JlKDMpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJnZXRVVFhPSURzXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdWlkczogc3RyaW5nW10gPSBzZXQuZ2V0VVRYT0lEcygpXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGV4cGVjdCh1aWRzLmluZGV4T2YodXR4b3NbaV0uZ2V0VVRYT0lEKCkpKS5ub3QudG9CZSgtMSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0QWxsVVRYT3NcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBhbGx1dHhvczogVVRYT1tdID0gc2V0LmdldEFsbFVUWE9zKClcclxuICAgICAgY29uc3QgdXN0cnM6IHN0cmluZ1tdID0gW11cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFsbHV0eG9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdXN0cnMucHVzaChhbGx1dHhvc1tpXS50b1N0cmluZygpKVxyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGV4cGVjdCh1c3Rycy5pbmRleE9mKHV0eG9zdHJzW2ldKSkubm90LnRvQmUoLTEpXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdWlkczogc3RyaW5nW10gPSBzZXQuZ2V0VVRYT0lEcygpXHJcbiAgICAgIGNvbnN0IGFsbHV0eG9zMjogVVRYT1tdID0gc2V0LmdldEFsbFVUWE9zKHVpZHMpXHJcbiAgICAgIGNvbnN0IHVzdHJzMjogc3RyaW5nW10gPSBbXVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgYWxsdXR4b3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB1c3RyczIucHVzaChhbGx1dHhvczJbaV0udG9TdHJpbmcoKSlcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdXR4b3N0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBleHBlY3QodXN0cnMyLmluZGV4T2YodXR4b3N0cnNbaV0pKS5ub3QudG9CZSgtMSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiZ2V0VVRYT0lEcyBCeSBBZGRyZXNzXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHV0eG9pZHM6IHN0cmluZ1tdXHJcbiAgICAgIHV0eG9pZHMgPSBzZXQuZ2V0VVRYT0lEcyhbYWRkcnNbMF1dKVxyXG4gICAgICBleHBlY3QodXR4b2lkcy5sZW5ndGgpLnRvQmUoMSlcclxuICAgICAgdXR4b2lkcyA9IHNldC5nZXRVVFhPSURzKGFkZHJzKVxyXG4gICAgICBleHBlY3QodXR4b2lkcy5sZW5ndGgpLnRvQmUoMylcclxuICAgICAgdXR4b2lkcyA9IHNldC5nZXRVVFhPSURzKGFkZHJzLCBmYWxzZSlcclxuICAgICAgZXhwZWN0KHV0eG9pZHMubGVuZ3RoKS50b0JlKDMpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJnZXRBbGxVVFhPU3RyaW5nc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHVzdHJzOiBzdHJpbmdbXSA9IHNldC5nZXRBbGxVVFhPU3RyaW5ncygpXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvc3Rycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGV4cGVjdCh1c3Rycy5pbmRleE9mKHV0eG9zdHJzW2ldKSkubm90LnRvQmUoLTEpXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgdWlkczogc3RyaW5nW10gPSBzZXQuZ2V0VVRYT0lEcygpXHJcbiAgICAgIGNvbnN0IHVzdHJzMjogc3RyaW5nW10gPSBzZXQuZ2V0QWxsVVRYT1N0cmluZ3ModWlkcylcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zdHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZXhwZWN0KHVzdHJzMi5pbmRleE9mKHV0eG9zdHJzW2ldKSkubm90LnRvQmUoLTEpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImdldEFkZHJlc3Nlc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGV4cGVjdChzZXQuZ2V0QWRkcmVzc2VzKCkuc29ydCgpKS50b1N0cmljdEVxdWFsKGFkZHJzLnNvcnQoKSlcclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcImdldEJhbGFuY2VcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgYmFsYW5jZTE6IEJOXHJcbiAgICAgIGxldCBiYWxhbmNlMjogQk5cclxuICAgICAgYmFsYW5jZTEgPSBuZXcgQk4oMClcclxuICAgICAgYmFsYW5jZTIgPSBuZXcgQk4oMClcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHV0eG9zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYXNzZXRJRCA9IHV0eG9zW2ldLmdldEFzc2V0SUQoKVxyXG4gICAgICAgIGJhbGFuY2UxLmFkZChzZXQuZ2V0QmFsYW5jZShhZGRycywgYXNzZXRJRCkpXHJcbiAgICAgICAgYmFsYW5jZTIuYWRkKCh1dHhvc1tpXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpKVxyXG4gICAgICB9XHJcbiAgICAgIGV4cGVjdChiYWxhbmNlMS50b1N0cmluZygpKS50b0JlKGJhbGFuY2UyLnRvU3RyaW5nKCkpXHJcblxyXG4gICAgICBiYWxhbmNlMSA9IG5ldyBCTigwKVxyXG4gICAgICBiYWxhbmNlMiA9IG5ldyBCTigwKVxyXG4gICAgICBjb25zdCBub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGFzc2V0SUQgPSBiaW50b29scy5jYjU4RW5jb2RlKHV0eG9zW2ldLmdldEFzc2V0SUQoKSlcclxuICAgICAgICBiYWxhbmNlMS5hZGQoc2V0LmdldEJhbGFuY2UoYWRkcnMsIGFzc2V0SUQsIG5vdykpXHJcbiAgICAgICAgYmFsYW5jZTIuYWRkKCh1dHhvc1tpXS5nZXRPdXRwdXQoKSBhcyBBbW91bnRPdXRwdXQpLmdldEFtb3VudCgpKVxyXG4gICAgICB9XHJcbiAgICAgIGV4cGVjdChiYWxhbmNlMS50b1N0cmluZygpKS50b0JlKGJhbGFuY2UyLnRvU3RyaW5nKCkpXHJcbiAgICB9KVxyXG5cclxuICAgIHRlc3QoXCJnZXRBc3NldElEc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IGFzc2V0SURzOiBCdWZmZXJbXSA9IHNldC5nZXRBc3NldElEcygpXHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB1dHhvcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGV4cGVjdChhc3NldElEcykudG9Db250YWluKHV0eG9zW2ldLmdldEFzc2V0SUQoKSlcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBhZGRyZXNzZXM6IEJ1ZmZlcltdID0gc2V0LmdldEFkZHJlc3NlcygpXHJcbiAgICAgIGV4cGVjdChzZXQuZ2V0QXNzZXRJRHMoYWRkcmVzc2VzKSkudG9FcXVhbChzZXQuZ2V0QXNzZXRJRHMoKSlcclxuICAgIH0pXHJcblxyXG4gICAgZGVzY3JpYmUoXCJNZXJnZSBSdWxlc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBzZXRBOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRCOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRDOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXREOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRFOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRGOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRHOiBVVFhPU2V0XHJcbiAgICAgIGxldCBzZXRIOiBVVFhPU2V0XHJcbiAgICAgIC8vIFRha2Utb3ItTGVhdmVcclxuICAgICAgY29uc3QgbmV3dXR4bzogc3RyaW5nID0gYmludG9vbHMuY2I1OEVuY29kZShcclxuICAgICAgICBCdWZmZXIuZnJvbShcclxuICAgICAgICAgIFwiMDAwMGFjZjg4NjQ3YjNmYmFhOWZkZjQzNzhmM2EwZGY2YTVkMTVkOGVmYjAxOGFkNzhmMTI2OTAzOTBlNzllMTY4NzYwMDAwMDAwM2FjZjg4NjQ3YjNmYmFhOWZkZjQzNzhmM2EwZGY2YTVkMTVkOGVmYjAxOGFkNzhmMTI2OTAzOTBlNzllMTY4NzYwMDAwMDAwNzAwMDAwMDAwMDAwMTg2YTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEwMDAwMDAwMWZjZWRhOGY5MGZjYjVkMzA2MTRiOTlkNzlmYzRiYWEyOTMwNzc2MjZcIixcclxuICAgICAgICAgIFwiaGV4XCJcclxuICAgICAgICApXHJcbiAgICAgIClcclxuXHJcbiAgICAgIGJlZm9yZUVhY2goKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIHNldEEgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgc2V0QS5hZGRBcnJheShbdXR4b3N0cnNbMF0sIHV0eG9zdHJzWzJdXSlcclxuXHJcbiAgICAgICAgc2V0QiA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRCLmFkZEFycmF5KFt1dHhvc3Ryc1sxXSwgdXR4b3N0cnNbMl1dKVxyXG5cclxuICAgICAgICBzZXRDID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICAgIHNldEMuYWRkQXJyYXkoW3V0eG9zdHJzWzBdLCB1dHhvc3Ryc1sxXV0pXHJcblxyXG4gICAgICAgIHNldEQgPSBuZXcgVVRYT1NldCgpXHJcbiAgICAgICAgc2V0RC5hZGRBcnJheShbdXR4b3N0cnNbMV1dKVxyXG5cclxuICAgICAgICBzZXRFID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICAgIHNldEUuYWRkQXJyYXkoW10pIC8vIGVtcHR5IHNldFxyXG5cclxuICAgICAgICBzZXRGID0gbmV3IFVUWE9TZXQoKVxyXG4gICAgICAgIHNldEYuYWRkQXJyYXkodXR4b3N0cnMpIC8vIGZ1bGwgc2V0LCBzZXBhcmF0ZSBmcm9tIHNlbGZcclxuXHJcbiAgICAgICAgc2V0RyA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRHLmFkZEFycmF5KFtuZXd1dHhvLCAuLi51dHhvc3Ryc10pIC8vIGZ1bGwgc2V0IHdpdGggbmV3IGVsZW1lbnRcclxuXHJcbiAgICAgICAgc2V0SCA9IG5ldyBVVFhPU2V0KClcclxuICAgICAgICBzZXRILmFkZEFycmF5KFtuZXd1dHhvXSkgLy8gc2V0IHdpdGggb25seSBhIG5ldyBlbGVtZW50XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB0ZXN0KFwidW5rbm93biBtZXJnZSBydWxlXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgc2V0Lm1lcmdlQnlSdWxlKHNldEEsIFwiRVJST1JcIilcclxuICAgICAgICB9KS50b1Rocm93KClcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRlc3QoXCJpbnRlcnNlY3Rpb25cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIGxldCByZXN1bHRzOiBVVFhPU2V0XHJcbiAgICAgICAgbGV0IHRlc3Q6IGJvb2xlYW5cclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRBLCBcImludGVyc2VjdGlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0QV0sXHJcbiAgICAgICAgICBbc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRGLCBcImludGVyc2VjdGlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0Rl0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRHLCBcImludGVyc2VjdGlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0Rl0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRILCBcImludGVyc2VjdGlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRlc3QoXCJkaWZmZXJlbmNlU2VsZlwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHM6IFVUWE9TZXRcclxuICAgICAgICBsZXQgdGVzdDogYm9vbGVhblxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEEsIFwiZGlmZmVyZW5jZVNlbGZcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldERdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEUsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RiwgXCJkaWZmZXJlbmNlU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRHLCBcImRpZmZlcmVuY2VTZWxmXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEgsIFwiZGlmZmVyZW5jZVNlbGZcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEZdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB0ZXN0KFwiZGlmZmVyZW5jZU5ld1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgbGV0IHJlc3VsdHM6IFVUWE9TZXRcclxuICAgICAgICBsZXQgdGVzdDogYm9vbGVhblxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEEsIFwiZGlmZmVyZW5jZU5ld1wiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRGLCBcImRpZmZlcmVuY2VOZXdcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEVdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0RywgXCJkaWZmZXJlbmNlTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRIXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRHXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEgsIFwiZGlmZmVyZW5jZU5ld1wiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0SF0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0R11cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRlc3QoXCJzeW1EaWZmZXJlbmNlXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJzeW1EaWZmZXJlbmNlXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXREXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRFLCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwic3ltRGlmZmVyZW5jZVwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRHLCBcInN5bURpZmZlcmVuY2VcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEhdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEYsIHNldEddXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJzeW1EaWZmZXJlbmNlXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRHXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRGLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcInVuaW9uXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJ1bmlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0Rl0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRGLCBcInVuaW9uXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRGXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwidW5pb25cIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEddLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEYsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJ1bmlvblwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0R10sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuICAgICAgfSlcclxuXHJcbiAgICAgIHRlc3QoXCJ1bmlvbk1pbnVzTmV3XCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJ1bmlvbk1pbnVzTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXREXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRFLCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEYsIFwidW5pb25NaW51c05ld1wiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRHLCBcInVuaW9uTWludXNOZXdcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEVdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEYsIHNldEcsIHNldEhdXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJ1bmlvbk1pbnVzTmV3XCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRGXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRFLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgdGVzdChcInVuaW9uTWludXNTZWxmXCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0czogVVRYT1NldFxyXG4gICAgICAgIGxldCB0ZXN0OiBib29sZWFuXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0QSwgXCJ1bmlvbk1pbnVzU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0RV0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0Riwgc2V0Rywgc2V0SF1cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuXHJcbiAgICAgICAgcmVzdWx0cyA9IHNldC5tZXJnZUJ5UnVsZShzZXRGLCBcInVuaW9uTWludXNTZWxmXCIpXHJcbiAgICAgICAgdGVzdCA9IHNldE1lcmdlVGVzdGVyKFxyXG4gICAgICAgICAgcmVzdWx0cyxcclxuICAgICAgICAgIFtzZXRFXSxcclxuICAgICAgICAgIFtzZXRBLCBzZXRCLCBzZXRDLCBzZXRELCBzZXRGLCBzZXRHLCBzZXRIXVxyXG4gICAgICAgIClcclxuICAgICAgICBleHBlY3QodGVzdCkudG9CZSh0cnVlKVxyXG5cclxuICAgICAgICByZXN1bHRzID0gc2V0Lm1lcmdlQnlSdWxlKHNldEcsIFwidW5pb25NaW51c1NlbGZcIilcclxuICAgICAgICB0ZXN0ID0gc2V0TWVyZ2VUZXN0ZXIoXHJcbiAgICAgICAgICByZXN1bHRzLFxyXG4gICAgICAgICAgW3NldEhdLFxyXG4gICAgICAgICAgW3NldEEsIHNldEIsIHNldEMsIHNldEQsIHNldEUsIHNldEYsIHNldEddXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV4cGVjdCh0ZXN0KS50b0JlKHRydWUpXHJcblxyXG4gICAgICAgIHJlc3VsdHMgPSBzZXQubWVyZ2VCeVJ1bGUoc2V0SCwgXCJ1bmlvbk1pbnVzU2VsZlwiKVxyXG4gICAgICAgIHRlc3QgPSBzZXRNZXJnZVRlc3RlcihcclxuICAgICAgICAgIHJlc3VsdHMsXHJcbiAgICAgICAgICBbc2V0SF0sXHJcbiAgICAgICAgICBbc2V0QSwgc2V0Qiwgc2V0Qywgc2V0RCwgc2V0RSwgc2V0Riwgc2V0R11cclxuICAgICAgICApXHJcbiAgICAgICAgZXhwZWN0KHRlc3QpLnRvQmUodHJ1ZSlcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSlcclxufSlcclxuIl19