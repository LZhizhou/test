"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const outputs_1 = require("../../../src/apis/platformvm/outputs");
const output_1 = require("../../../src/common/output");
const bintools = bintools_1.default.getInstance();
describe("Outputs", () => {
    describe("SECPTransferOutput", () => {
        const addrs = [
            bintools.cb58Decode("B6D4v1VtPYLbiUvYXtW4Px8oE9imC2vGW"),
            bintools.cb58Decode("P5wdRuZeaDt28eHMP5S3w9ZdoBfo7wuzF"),
            bintools.cb58Decode("6Y3kysjF9jnHnYkdS9yGAuoHyae2eNmeV")
        ].sort();
        const locktime = new bn_js_1.default(54321);
        const addrpay = [addrs[0], addrs[1]];
        const fallLocktime = locktime.add(new bn_js_1.default(50));
        test("SelectOutputClass", () => {
            const goodout = new outputs_1.SECPTransferOutput(new bn_js_1.default(2600), addrpay, fallLocktime, 1);
            const outpayment = (0, outputs_1.SelectOutputClass)(goodout.getOutputID());
            expect(outpayment).toBeInstanceOf(outputs_1.SECPTransferOutput);
            expect(() => {
                (0, outputs_1.SelectOutputClass)(99);
            }).toThrow("Error - SelectOutputClass: unknown outputid");
        });
        test("comparator", () => {
            const outpayment1 = new outputs_1.SECPTransferOutput(new bn_js_1.default(10000), addrs, locktime, 3);
            const outpayment2 = new outputs_1.SECPTransferOutput(new bn_js_1.default(10001), addrs, locktime, 3);
            const outpayment3 = new outputs_1.SECPTransferOutput(new bn_js_1.default(9999), addrs, locktime, 3);
            const cmp = output_1.Output.comparator();
            expect(cmp(outpayment1, outpayment1)).toBe(0);
            expect(cmp(outpayment2, outpayment2)).toBe(0);
            expect(cmp(outpayment3, outpayment3)).toBe(0);
            expect(cmp(outpayment1, outpayment2)).toBe(-1);
            expect(cmp(outpayment1, outpayment3)).toBe(1);
        });
        test("SECPTransferOutput", () => {
            const out = new outputs_1.SECPTransferOutput(new bn_js_1.default(10000), addrs, locktime, 3);
            expect(out.getOutputID()).toBe(7);
            expect(JSON.stringify(out.getAddresses().sort())).toStrictEqual(JSON.stringify(addrs.sort()));
            expect(out.getThreshold()).toBe(3);
            expect(out.getLocktime().toNumber()).toBe(locktime.toNumber());
            const r = out.getAddressIdx(addrs[2]);
            expect(out.getAddress(r)).toStrictEqual(addrs[2]);
            expect(() => {
                out.getAddress(400);
            }).toThrow();
            expect(out.getAmount().toNumber()).toBe(10000);
            const b = out.toBuffer();
            expect(out.toString()).toBe(bintools.bufferToB58(b));
            const s = out.getSpenders(addrs);
            expect(JSON.stringify(s.sort())).toBe(JSON.stringify(addrs.sort()));
            const m1 = out.meetsThreshold([addrs[0]]);
            expect(m1).toBe(false);
            const m2 = out.meetsThreshold(addrs, new bn_js_1.default(100));
            expect(m2).toBe(false);
            const m3 = out.meetsThreshold(addrs);
            expect(m3).toBe(true);
            const m4 = out.meetsThreshold(addrs, locktime.add(new bn_js_1.default(100)));
            expect(m4).toBe(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0cy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdHMvYXBpcy9wbGF0Zm9ybXZtL291dHB1dHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUFzQjtBQUV0QiwyRUFBa0Q7QUFDbEQsa0VBRzZDO0FBQzdDLHVEQUFtRDtBQUVuRCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWpELFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBUyxFQUFFO0lBQzdCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFTLEVBQUU7UUFDeEMsTUFBTSxLQUFLLEdBQWE7WUFDdEIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztZQUN4RCxRQUFRLENBQUMsVUFBVSxDQUFDLG1DQUFtQyxDQUFDO1lBQ3hELFFBQVEsQ0FBQyxVQUFVLENBQUMsbUNBQW1DLENBQUM7U0FDekQsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUVSLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLE1BQU0sWUFBWSxHQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUVqRCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBUyxFQUFFO1lBQ25DLE1BQU0sT0FBTyxHQUF1QixJQUFJLDRCQUFrQixDQUN4RCxJQUFJLGVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDWixPQUFPLEVBQ1AsWUFBWSxFQUNaLENBQUMsQ0FDRixDQUFBO1lBQ0QsTUFBTSxVQUFVLEdBQVcsSUFBQSwyQkFBaUIsRUFBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtZQUNu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LGVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDeEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN2QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7XHJcbiAgU0VDUFRyYW5zZmVyT3V0cHV0LFxyXG4gIFNlbGVjdE91dHB1dENsYXNzXHJcbn0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vb3V0cHV0c1wiXHJcbmltcG9ydCB7IE91dHB1dCB9IGZyb20gXCIuLi8uLi8uLi9zcmMvY29tbW9uL291dHB1dFwiXHJcblxyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcblxyXG5kZXNjcmliZShcIk91dHB1dHNcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGRlc2NyaWJlKFwiU0VDUFRyYW5zZmVyT3V0cHV0XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IGFkZHJzOiBCdWZmZXJbXSA9IFtcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIkI2RDR2MVZ0UFlMYmlVdllYdFc0UHg4b0U5aW1DMnZHV1wiKSxcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIlA1d2RSdVplYUR0MjhlSE1QNVMzdzlaZG9CZm83d3V6RlwiKSxcclxuICAgICAgYmludG9vbHMuY2I1OERlY29kZShcIjZZM2t5c2pGOWpuSG5Za2RTOXlHQXVvSHlhZTJlTm1lVlwiKVxyXG4gICAgXS5zb3J0KClcclxuXHJcbiAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oNTQzMjEpXHJcbiAgICBjb25zdCBhZGRycGF5ID0gW2FkZHJzWzBdLCBhZGRyc1sxXV1cclxuICAgIGNvbnN0IGZhbGxMb2NrdGltZTogQk4gPSBsb2NrdGltZS5hZGQobmV3IEJOKDUwKSlcclxuXHJcbiAgICB0ZXN0KFwiU2VsZWN0T3V0cHV0Q2xhc3NcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zdCBnb29kb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTigyNjAwKSxcclxuICAgICAgICBhZGRycGF5LFxyXG4gICAgICAgIGZhbGxMb2NrdGltZSxcclxuICAgICAgICAxXHJcbiAgICAgIClcclxuICAgICAgY29uc3Qgb3V0cGF5bWVudDogT3V0cHV0ID0gU2VsZWN0T3V0cHV0Q2xhc3MoZ29vZG91dC5nZXRPdXRwdXRJRCgpKVxyXG4gICAgICBleHBlY3Qob3V0cGF5bWVudCkudG9CZUluc3RhbmNlT2YoU0VDUFRyYW5zZmVyT3V0cHV0KVxyXG4gICAgICBleHBlY3QoKCkgPT4ge1xyXG4gICAgICAgIFNlbGVjdE91dHB1dENsYXNzKDk5KVxyXG4gICAgICB9KS50b1Rocm93KFwiRXJyb3IgLSBTZWxlY3RPdXRwdXRDbGFzczogdW5rbm93biBvdXRwdXRpZFwiKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiY29tcGFyYXRvclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IG91dHBheW1lbnQxOiBPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTigxMDAwMCksXHJcbiAgICAgICAgYWRkcnMsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgM1xyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG91dHBheW1lbnQyOiBPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTigxMDAwMSksXHJcbiAgICAgICAgYWRkcnMsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgM1xyXG4gICAgICApXHJcbiAgICAgIGNvbnN0IG91dHBheW1lbnQzOiBPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTig5OTk5KSxcclxuICAgICAgICBhZGRycyxcclxuICAgICAgICBsb2NrdGltZSxcclxuICAgICAgICAzXHJcbiAgICAgIClcclxuICAgICAgY29uc3QgY21wID0gT3V0cHV0LmNvbXBhcmF0b3IoKVxyXG4gICAgICBleHBlY3QoY21wKG91dHBheW1lbnQxLCBvdXRwYXltZW50MSkpLnRvQmUoMClcclxuICAgICAgZXhwZWN0KGNtcChvdXRwYXltZW50Miwgb3V0cGF5bWVudDIpKS50b0JlKDApXHJcbiAgICAgIGV4cGVjdChjbXAob3V0cGF5bWVudDMsIG91dHBheW1lbnQzKSkudG9CZSgwKVxyXG4gICAgICBleHBlY3QoY21wKG91dHBheW1lbnQxLCBvdXRwYXltZW50MikpLnRvQmUoLTEpXHJcbiAgICAgIGV4cGVjdChjbXAob3V0cGF5bWVudDEsIG91dHBheW1lbnQzKSkudG9CZSgxKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwiU0VDUFRyYW5zZmVyT3V0cHV0XCIsICgpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3Qgb3V0OiBTRUNQVHJhbnNmZXJPdXRwdXQgPSBuZXcgU0VDUFRyYW5zZmVyT3V0cHV0KFxyXG4gICAgICAgIG5ldyBCTigxMDAwMCksXHJcbiAgICAgICAgYWRkcnMsXHJcbiAgICAgICAgbG9ja3RpbWUsXHJcbiAgICAgICAgM1xyXG4gICAgICApXHJcbiAgICAgIGV4cGVjdChvdXQuZ2V0T3V0cHV0SUQoKSkudG9CZSg3KVxyXG4gICAgICBleHBlY3QoSlNPTi5zdHJpbmdpZnkob3V0LmdldEFkZHJlc3NlcygpLnNvcnQoKSkpLnRvU3RyaWN0RXF1YWwoXHJcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoYWRkcnMuc29ydCgpKVxyXG4gICAgICApXHJcblxyXG4gICAgICBleHBlY3Qob3V0LmdldFRocmVzaG9sZCgpKS50b0JlKDMpXHJcbiAgICAgIGV4cGVjdChvdXQuZ2V0TG9ja3RpbWUoKS50b051bWJlcigpKS50b0JlKGxvY2t0aW1lLnRvTnVtYmVyKCkpXHJcblxyXG4gICAgICBjb25zdCByOiBudW1iZXIgPSBvdXQuZ2V0QWRkcmVzc0lkeChhZGRyc1syXSlcclxuICAgICAgZXhwZWN0KG91dC5nZXRBZGRyZXNzKHIpKS50b1N0cmljdEVxdWFsKGFkZHJzWzJdKVxyXG4gICAgICBleHBlY3QoKCk6IHZvaWQgPT4ge1xyXG4gICAgICAgIG91dC5nZXRBZGRyZXNzKDQwMClcclxuICAgICAgfSkudG9UaHJvdygpXHJcblxyXG4gICAgICBleHBlY3Qob3V0LmdldEFtb3VudCgpLnRvTnVtYmVyKCkpLnRvQmUoMTAwMDApXHJcblxyXG4gICAgICBjb25zdCBiOiBCdWZmZXIgPSBvdXQudG9CdWZmZXIoKVxyXG4gICAgICBleHBlY3Qob3V0LnRvU3RyaW5nKCkpLnRvQmUoYmludG9vbHMuYnVmZmVyVG9CNTgoYikpXHJcblxyXG4gICAgICBjb25zdCBzOiBCdWZmZXJbXSA9IG91dC5nZXRTcGVuZGVycyhhZGRycylcclxuICAgICAgZXhwZWN0KEpTT04uc3RyaW5naWZ5KHMuc29ydCgpKSkudG9CZShKU09OLnN0cmluZ2lmeShhZGRycy5zb3J0KCkpKVxyXG5cclxuICAgICAgY29uc3QgbTE6IGJvb2xlYW4gPSBvdXQubWVldHNUaHJlc2hvbGQoW2FkZHJzWzBdXSlcclxuICAgICAgZXhwZWN0KG0xKS50b0JlKGZhbHNlKVxyXG4gICAgICBjb25zdCBtMjogYm9vbGVhbiA9IG91dC5tZWV0c1RocmVzaG9sZChhZGRycywgbmV3IEJOKDEwMCkpXHJcbiAgICAgIGV4cGVjdChtMikudG9CZShmYWxzZSlcclxuICAgICAgY29uc3QgbTM6IGJvb2xlYW4gPSBvdXQubWVldHNUaHJlc2hvbGQoYWRkcnMpXHJcbiAgICAgIGV4cGVjdChtMykudG9CZSh0cnVlKVxyXG4gICAgICBjb25zdCBtNDogYm9vbGVhbiA9IG91dC5tZWV0c1RocmVzaG9sZChhZGRycywgbG9ja3RpbWUuYWRkKG5ldyBCTigxMDApKSlcclxuICAgICAgZXhwZWN0KG00KS50b0JlKHRydWUpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==