"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bintools_1 = __importDefault(require("../../src/utils/bintools"));
const evm_1 = require("src/apis/evm");
const bintools = bintools_1.default.getInstance();
describe("SECP256K1", () => {
    test("addressFromPublicKey", () => {
        const pubkeys = [
            "7ECaZ7TpWLq6mh3858DkR3EzEToGi8iFFxnjY5hUGePoCHqdjw",
            "5dS4sSyL4dHziqLYanMoath8dqUMe6ZkY1VbnVuQQSsCcgtVET"
        ];
        const addrs = [
            "b0c9654511ebb78d490bb0d7a54997d4a933972c",
            "d5bb99a29e09853da983be63a76f02259ceedf15"
        ];
        pubkeys.forEach((pubkey, index) => {
            const pubkeyBuf = bintools.cb58Decode(pubkey);
            const addrBuf = evm_1.KeyPair.addressFromPublicKey(pubkeyBuf);
            expect(addrBuf.toString("hex")).toBe(addrs[index]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0cy9jb21tb24vc2VjcDI1NmsxLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx3RUFBK0M7QUFDL0Msc0NBQXNDO0FBRXRDLE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFTLEVBQUU7SUFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQVMsRUFBRTtRQUN0QyxNQUFNLE9BQU8sR0FBYTtZQUN4QixvREFBb0Q7WUFDcEQsb0RBQW9EO1NBQ3JELENBQUE7UUFDRCxNQUFNLEtBQUssR0FBYTtZQUN0QiwwQ0FBMEM7WUFDMUMsMENBQTBDO1NBQzNDLENBQUE7UUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBYyxFQUFFLEtBQWEsRUFBUSxFQUFFO1lBQ3RELE1BQU0sU0FBUyxHQUFXLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDckQsTUFBTSxPQUFPLEdBQVcsYUFBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQy9ELE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcclxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi9zcmMvdXRpbHMvYmludG9vbHNcIlxyXG5pbXBvcnQgeyBLZXlQYWlyIH0gZnJvbSBcInNyYy9hcGlzL2V2bVwiXHJcblxyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcblxyXG5kZXNjcmliZShcIlNFQ1AyNTZLMVwiLCAoKTogdm9pZCA9PiB7XHJcbiAgdGVzdChcImFkZHJlc3NGcm9tUHVibGljS2V5XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHB1YmtleXM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcIjdFQ2FaN1RwV0xxNm1oMzg1OERrUjNFekVUb0dpOGlGRnhualk1aFVHZVBvQ0hxZGp3XCIsXHJcbiAgICAgIFwiNWRTNHNTeUw0ZEh6aXFMWWFuTW9hdGg4ZHFVTWU2WmtZMVZiblZ1UVFTc0NjZ3RWRVRcIlxyXG4gICAgXVxyXG4gICAgY29uc3QgYWRkcnM6IHN0cmluZ1tdID0gW1xyXG4gICAgICBcImIwYzk2NTQ1MTFlYmI3OGQ0OTBiYjBkN2E1NDk5N2Q0YTkzMzk3MmNcIixcclxuICAgICAgXCJkNWJiOTlhMjllMDk4NTNkYTk4M2JlNjNhNzZmMDIyNTljZWVkZjE1XCJcclxuICAgIF1cclxuICAgIHB1YmtleXMuZm9yRWFjaCgocHVia2V5OiBzdHJpbmcsIGluZGV4OiBudW1iZXIpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgcHVia2V5QnVmOiBCdWZmZXIgPSBiaW50b29scy5jYjU4RGVjb2RlKHB1YmtleSlcclxuICAgICAgY29uc3QgYWRkckJ1ZjogQnVmZmVyID0gS2V5UGFpci5hZGRyZXNzRnJvbVB1YmxpY0tleShwdWJrZXlCdWYpXHJcbiAgICAgIGV4cGVjdChhZGRyQnVmLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKGFkZHJzW2luZGV4XSlcclxuICAgIH0pXHJcbiAgfSlcclxufSlcclxuIl19