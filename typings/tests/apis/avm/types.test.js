"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../../src/utils/bintools"));
const credentials_1 = require("../../../src/common/credentials");
const output_1 = require("../../../src/common/output");
const helperfunctions_1 = require("../../../src/utils/helperfunctions");
const bintools = bintools_1.default.getInstance();
describe("UnixNow", () => {
    test("Does it return the right time?", () => {
        const now = Math.round(new Date().getTime() / 1000);
        const unow = (0, helperfunctions_1.UnixNow)();
        expect(now / 10).toBeCloseTo(unow.divn(10).toNumber(), -1);
    });
});
describe("Signature & NBytes", () => {
    const sig = new credentials_1.Signature();
    const sigpop = [];
    for (let i = 0; i < sig.getSize(); i++) {
        sigpop[i] = i;
    }
    const sigbuff = buffer_1.Buffer.from(sigpop);
    const size = sig.fromBuffer(sigbuff);
    expect(sig.getSize()).toBe(size);
    expect(size).toBe(sig.getSize());
    const sigbuff2 = sig.toBuffer();
    for (let i = 0; i < sigbuff.length; i++) {
        expect(sigbuff2[i]).toBe(sigbuff[i]);
    }
    const sigbuffstr = bintools.bufferToB58(sigbuff);
    expect(sig.toString()).toBe(sigbuffstr);
    sig.fromString(sigbuffstr);
    expect(sig.toString()).toBe(sigbuffstr);
});
describe("SigIdx", () => {
    const sigidx = new credentials_1.SigIdx();
    expect(sigidx.getSize()).toBe(sigidx.toBuffer().length);
    sigidx.setSource(buffer_1.Buffer.from("abcd", "hex"));
    expect(sigidx.getSource().toString("hex")).toBe("abcd");
});
describe("Address", () => {
    const addr1 = new output_1.Address();
    const addr2 = new output_1.Address();
    const smaller = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
    ];
    const bigger = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1
    ];
    const addr1bytes = buffer_1.Buffer.from(smaller);
    const addr2bytes = buffer_1.Buffer.from(bigger);
    addr1.fromBuffer(addr1bytes);
    addr2.fromBuffer(addr2bytes);
    expect(output_1.Address.comparator()(addr1, addr2)).toBe(-1);
    expect(output_1.Address.comparator()(addr2, addr1)).toBe(1);
    const addr2str = addr2.toString();
    addr2.fromBuffer(addr1bytes);
    expect(output_1.Address.comparator()(addr1, addr2)).toBe(0);
    addr2.fromString(addr2str);
    expect(output_1.Address.comparator()(addr1, addr2)).toBe(-1);
    const a1b = addr1.toBuffer();
    const a1s = bintools.bufferToB58(a1b);
    addr2.fromString(a1s);
    expect(output_1.Address.comparator()(addr1, addr2)).toBe(0);
    const badbuff = bintools.copyFrom(addr1bytes);
    let badbuffout = buffer_1.Buffer.concat([badbuff, buffer_1.Buffer.from([1, 2])]);
    let badstr = bintools.bufferToB58(badbuffout);
    const badaddr = new output_1.Address();
    expect(() => {
        badaddr.fromString(badstr);
    }).toThrow("Error - Address.fromString: invalid address");
    badbuffout = buffer_1.Buffer.concat([badbuff, buffer_1.Buffer.from([1, 2, 3, 4])]);
    badstr = bintools.bufferToB58(badbuffout);
    expect(() => {
        badaddr.fromString(badstr);
    }).toThrow("Error - Address.fromString: invalid checksum on address");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RzL2FwaXMvYXZtL3R5cGVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvQ0FBZ0M7QUFDaEMsMkVBQWtEO0FBQ2xELGlFQUFtRTtBQUNuRSx1REFBb0Q7QUFDcEQsd0VBQTREO0FBRzVELE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFTLEVBQUU7SUFDN0IsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQVMsRUFBRTtRQUNoRCxNQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDM0QsTUFBTSxJQUFJLEdBQU8sSUFBQSx5QkFBTyxHQUFFLENBQUE7UUFDMUIsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzVELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBUyxFQUFFO0lBQ3hDLE1BQU0sR0FBRyxHQUFjLElBQUksdUJBQVMsRUFBRSxDQUFBO0lBQ3RDLE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQTtJQUMzQixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDZDtJQUNELE1BQU0sT0FBTyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsTUFB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QUFPLEVBQUUsZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN0RSxJQUFJLE1BQU0sR0FBVyxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3JELE1BQU0sT0FBTyxHQUFZLElBQUksZ0JBQU8sRUFBRSxDQUFBO0lBRXRDLE1BQU0sQ0FBQyxHQUFTLEVBQUU7UUFDaEIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM1QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQTtJQUV6RCxVQUFVLEdBQUcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEUsTUFBTSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDekMsTUFBTSxDQUFDLEdBQVMsRUFBRTtRQUNoQixPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQzVCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5REFBeUQsQ0FBQyxDQUFBO0FBQ3ZFLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlscy9iaW50b29sc1wiXHJcbmltcG9ydCB7IFNpZ0lkeCwgU2lnbmF0dXJlIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9jb21tb24vY3JlZGVudGlhbHNcIlxyXG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9jb21tb24vb3V0cHV0XCJcclxuaW1wb3J0IHsgVW5peE5vdyB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvaGVscGVyZnVuY3Rpb25zXCJcclxuaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiXHJcblxyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcblxyXG5kZXNjcmliZShcIlVuaXhOb3dcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIHRlc3QoXCJEb2VzIGl0IHJldHVybiB0aGUgcmlnaHQgdGltZT9cIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3Qgbm93OiBudW1iZXIgPSBNYXRoLnJvdW5kKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMClcclxuICAgIGNvbnN0IHVub3c6IEJOID0gVW5peE5vdygpXHJcbiAgICBleHBlY3Qobm93IC8gMTApLnRvQmVDbG9zZVRvKHVub3cuZGl2bigxMCkudG9OdW1iZXIoKSwgLTEpXHJcbiAgfSlcclxufSlcclxuXHJcbmRlc2NyaWJlKFwiU2lnbmF0dXJlICYgTkJ5dGVzXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBzaWc6IFNpZ25hdHVyZSA9IG5ldyBTaWduYXR1cmUoKVxyXG4gIGNvbnN0IHNpZ3BvcDogbnVtYmVyW10gPSBbXVxyXG4gIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaWcuZ2V0U2l6ZSgpOyBpKyspIHtcclxuICAgIHNpZ3BvcFtpXSA9IGlcclxuICB9XHJcbiAgY29uc3Qgc2lnYnVmZjogQnVmZmVyID0gQnVmZmVyLmZyb20oc2lncG9wKVxyXG4gIGNvbnN0IHNpemU6IG51bWJlciA9IHNpZy5mcm9tQnVmZmVyKHNpZ2J1ZmYpXHJcbiAgZXhwZWN0KHNpZy5nZXRTaXplKCkpLnRvQmUoc2l6ZSlcclxuICBleHBlY3Qoc2l6ZSkudG9CZShzaWcuZ2V0U2l6ZSgpKVxyXG4gIGNvbnN0IHNpZ2J1ZmYyOiBCdWZmZXIgPSBzaWcudG9CdWZmZXIoKVxyXG4gIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBzaWdidWZmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBleHBlY3Qoc2lnYnVmZjJbaV0pLnRvQmUoc2lnYnVmZltpXSlcclxuICB9XHJcbiAgY29uc3Qgc2lnYnVmZnN0cjogc3RyaW5nID0gYmludG9vbHMuYnVmZmVyVG9CNTgoc2lnYnVmZilcclxuICBleHBlY3Qoc2lnLnRvU3RyaW5nKCkpLnRvQmUoc2lnYnVmZnN0cilcclxuICBzaWcuZnJvbVN0cmluZyhzaWdidWZmc3RyKVxyXG4gIGV4cGVjdChzaWcudG9TdHJpbmcoKSkudG9CZShzaWdidWZmc3RyKVxyXG59KVxyXG5cclxuZGVzY3JpYmUoXCJTaWdJZHhcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IHNpZ2lkeDogU2lnSWR4ID0gbmV3IFNpZ0lkeCgpXHJcbiAgZXhwZWN0KHNpZ2lkeC5nZXRTaXplKCkpLnRvQmUoc2lnaWR4LnRvQnVmZmVyKCkubGVuZ3RoKVxyXG4gIHNpZ2lkeC5zZXRTb3VyY2UoQnVmZmVyLmZyb20oXCJhYmNkXCIsIFwiaGV4XCIpKVxyXG4gIGV4cGVjdChzaWdpZHguZ2V0U291cmNlKCkudG9TdHJpbmcoXCJoZXhcIikpLnRvQmUoXCJhYmNkXCIpXHJcbn0pXHJcblxyXG5kZXNjcmliZShcIkFkZHJlc3NcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IGFkZHIxOiBBZGRyZXNzID0gbmV3IEFkZHJlc3MoKVxyXG4gIGNvbnN0IGFkZHIyOiBBZGRyZXNzID0gbmV3IEFkZHJlc3MoKVxyXG4gIGNvbnN0IHNtYWxsZXI6IG51bWJlcltdID0gW1xyXG4gICAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgOSwgOCwgNywgNiwgNSwgNCwgMywgMiwgMSwgMFxyXG4gIF1cclxuICBjb25zdCBiaWdnZXI6IG51bWJlcltdID0gW1xyXG4gICAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgOSwgOCwgNywgNiwgNSwgNCwgMywgMiwgMSwgMVxyXG4gIF1cclxuICBjb25zdCBhZGRyMWJ5dGVzOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShzbWFsbGVyKVxyXG4gIGNvbnN0IGFkZHIyYnl0ZXM6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGJpZ2dlcilcclxuICBhZGRyMS5mcm9tQnVmZmVyKGFkZHIxYnl0ZXMpXHJcbiAgYWRkcjIuZnJvbUJ1ZmZlcihhZGRyMmJ5dGVzKVxyXG4gIGV4cGVjdChBZGRyZXNzLmNvbXBhcmF0b3IoKShhZGRyMSwgYWRkcjIpKS50b0JlKC0xKVxyXG4gIGV4cGVjdChBZGRyZXNzLmNvbXBhcmF0b3IoKShhZGRyMiwgYWRkcjEpKS50b0JlKDEpXHJcblxyXG4gIGNvbnN0IGFkZHIyc3RyOiBzdHJpbmcgPSBhZGRyMi50b1N0cmluZygpXHJcblxyXG4gIGFkZHIyLmZyb21CdWZmZXIoYWRkcjFieXRlcylcclxuICBleHBlY3QoQWRkcmVzcy5jb21wYXJhdG9yKCkoYWRkcjEsIGFkZHIyKSkudG9CZSgwKVxyXG5cclxuICBhZGRyMi5mcm9tU3RyaW5nKGFkZHIyc3RyKVxyXG4gIGV4cGVjdChBZGRyZXNzLmNvbXBhcmF0b3IoKShhZGRyMSwgYWRkcjIpKS50b0JlKC0xKVxyXG4gIGNvbnN0IGExYjogQnVmZmVyID0gYWRkcjEudG9CdWZmZXIoKVxyXG4gIGNvbnN0IGExczogc3RyaW5nID0gYmludG9vbHMuYnVmZmVyVG9CNTgoYTFiKVxyXG4gIGFkZHIyLmZyb21TdHJpbmcoYTFzKVxyXG4gIGV4cGVjdChBZGRyZXNzLmNvbXBhcmF0b3IoKShhZGRyMSwgYWRkcjIpKS50b0JlKDApXHJcblxyXG4gIGNvbnN0IGJhZGJ1ZmY6IEJ1ZmZlciA9IGJpbnRvb2xzLmNvcHlGcm9tKGFkZHIxYnl0ZXMpXHJcbiAgbGV0IGJhZGJ1ZmZvdXQ6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW2JhZGJ1ZmYsIEJ1ZmZlci5mcm9tKFsxLCAyXSldKVxyXG4gIGxldCBiYWRzdHI6IHN0cmluZyA9IGJpbnRvb2xzLmJ1ZmZlclRvQjU4KGJhZGJ1ZmZvdXQpXHJcbiAgY29uc3QgYmFkYWRkcjogQWRkcmVzcyA9IG5ldyBBZGRyZXNzKClcclxuXHJcbiAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgIGJhZGFkZHIuZnJvbVN0cmluZyhiYWRzdHIpXHJcbiAgfSkudG9UaHJvdyhcIkVycm9yIC0gQWRkcmVzcy5mcm9tU3RyaW5nOiBpbnZhbGlkIGFkZHJlc3NcIilcclxuXHJcbiAgYmFkYnVmZm91dCA9IEJ1ZmZlci5jb25jYXQoW2JhZGJ1ZmYsIEJ1ZmZlci5mcm9tKFsxLCAyLCAzLCA0XSldKVxyXG4gIGJhZHN0ciA9IGJpbnRvb2xzLmJ1ZmZlclRvQjU4KGJhZGJ1ZmZvdXQpXHJcbiAgZXhwZWN0KCgpOiB2b2lkID0+IHtcclxuICAgIGJhZGFkZHIuZnJvbVN0cmluZyhiYWRzdHIpXHJcbiAgfSkudG9UaHJvdyhcIkVycm9yIC0gQWRkcmVzcy5mcm9tU3RyaW5nOiBpbnZhbGlkIGNoZWNrc3VtIG9uIGFkZHJlc3NcIilcclxufSlcclxuIl19