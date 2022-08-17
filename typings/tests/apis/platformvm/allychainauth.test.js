"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer/");
const platformvm_1 = require("src/apis/platformvm");
const bintools_1 = __importDefault(require("src/utils/bintools"));
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
describe("AllychainAuth", () => {
    const allychainAuth1 = new platformvm_1.AllychainAuth();
    const allychainAuth2 = new platformvm_1.AllychainAuth();
    test("getters", () => {
        const typeName = allychainAuth1.getTypeName();
        expect(typeName).toBe("AllychainAuth");
        const typeID = allychainAuth1.getTypeID();
        expect(typeID).toBe(10);
        let addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(0, 0, 4);
        allychainAuth1.addAddressIndex(addressIndex);
        addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(1, 0, 4);
        allychainAuth1.addAddressIndex(addressIndex);
        const numAddressIndices = allychainAuth1.getNumAddressIndices();
        expect(numAddressIndices).toBe(2);
        const addressIndices = allychainAuth1.getAddressIndices();
        expect(buffer_1.Buffer.isBuffer(addressIndices[0])).toBeTruthy();
        expect(bintools.fromBufferToBN(addressIndices[0]).toNumber()).toBe(0);
        expect(bintools.fromBufferToBN(addressIndices[1]).toNumber()).toBe(1);
    });
    test("toBuffer", () => {
        const allychainAuth1Buf = allychainAuth1.toBuffer();
        allychainAuth2.fromBuffer(allychainAuth1Buf);
        const allychainAuth1Hex = allychainAuth1.toBuffer().toString("hex");
        const allychainAuth2Hex = allychainAuth2.toBuffer().toString("hex");
        expect(allychainAuth1Hex).toBe(allychainAuth2Hex);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxseWNoYWluYXV0aC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdHMvYXBpcy9wbGF0Zm9ybXZtL2FsbHljaGFpbmF1dGgudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9DQUFnQztBQUNoQyxvREFBbUQ7QUFDbkQsa0VBQXlDO0FBRXpDOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVqRCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQVMsRUFBRTtJQUNuQyxNQUFNLGNBQWMsR0FBa0IsSUFBSSwwQkFBYSxFQUFFLENBQUE7SUFDekQsTUFBTSxjQUFjLEdBQWtCLElBQUksMEJBQWEsRUFBRSxDQUFBO0lBRXpELElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBUyxFQUFFO1FBQ3pCLE1BQU0sUUFBUSxHQUFXLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNyRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBRXRDLE1BQU0sTUFBTSxHQUFXLGNBQWMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNqRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXZCLElBQUksWUFBWSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLGNBQWMsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDNUMsWUFBWSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLGNBQWMsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUE7UUFFNUMsTUFBTSxpQkFBaUIsR0FBVyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUN2RSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFakMsTUFBTSxjQUFjLEdBQWEsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkUsTUFBTSxDQUFDLGVBQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUN2RCxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRSxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2RSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBUyxFQUFFO1FBQzFCLE1BQU0saUJBQWlCLEdBQVcsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzNELGNBQWMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUM1QyxNQUFNLGlCQUFpQixHQUFXLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0UsTUFBTSxpQkFBaUIsR0FBVyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBQ25ELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCB7IEFsbHljaGFpbkF1dGggfSBmcm9tIFwic3JjL2FwaXMvcGxhdGZvcm12bVwiXHJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwic3JjL3V0aWxzL2JpbnRvb2xzXCJcclxuXHJcbi8qKlxyXG4gKiBAaWdub3JlXHJcbiAqL1xyXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXHJcblxyXG5kZXNjcmliZShcIkFsbHljaGFpbkF1dGhcIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGNvbnN0IGFsbHljaGFpbkF1dGgxOiBBbGx5Y2hhaW5BdXRoID0gbmV3IEFsbHljaGFpbkF1dGgoKVxyXG4gIGNvbnN0IGFsbHljaGFpbkF1dGgyOiBBbGx5Y2hhaW5BdXRoID0gbmV3IEFsbHljaGFpbkF1dGgoKVxyXG5cclxuICB0ZXN0KFwiZ2V0dGVyc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gYWxseWNoYWluQXV0aDEuZ2V0VHlwZU5hbWUoKVxyXG4gICAgZXhwZWN0KHR5cGVOYW1lKS50b0JlKFwiQWxseWNoYWluQXV0aFwiKVxyXG5cclxuICAgIGNvbnN0IHR5cGVJRDogbnVtYmVyID0gYWxseWNoYWluQXV0aDEuZ2V0VHlwZUlEKClcclxuICAgIGV4cGVjdCh0eXBlSUQpLnRvQmUoMTApXHJcblxyXG4gICAgbGV0IGFkZHJlc3NJbmRleDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXHJcbiAgICBhZGRyZXNzSW5kZXgud3JpdGVVSW50QkUoMCwgMCwgNClcclxuICAgIGFsbHljaGFpbkF1dGgxLmFkZEFkZHJlc3NJbmRleChhZGRyZXNzSW5kZXgpXHJcbiAgICBhZGRyZXNzSW5kZXggPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIGFkZHJlc3NJbmRleC53cml0ZVVJbnRCRSgxLCAwLCA0KVxyXG4gICAgYWxseWNoYWluQXV0aDEuYWRkQWRkcmVzc0luZGV4KGFkZHJlc3NJbmRleClcclxuXHJcbiAgICBjb25zdCBudW1BZGRyZXNzSW5kaWNlczogbnVtYmVyID0gYWxseWNoYWluQXV0aDEuZ2V0TnVtQWRkcmVzc0luZGljZXMoKVxyXG4gICAgZXhwZWN0KG51bUFkZHJlc3NJbmRpY2VzKS50b0JlKDIpXHJcblxyXG4gICAgY29uc3QgYWRkcmVzc0luZGljZXM6IEJ1ZmZlcltdID0gYWxseWNoYWluQXV0aDEuZ2V0QWRkcmVzc0luZGljZXMoKVxyXG4gICAgZXhwZWN0KEJ1ZmZlci5pc0J1ZmZlcihhZGRyZXNzSW5kaWNlc1swXSkpLnRvQmVUcnV0aHkoKVxyXG4gICAgZXhwZWN0KGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKGFkZHJlc3NJbmRpY2VzWzBdKS50b051bWJlcigpKS50b0JlKDApXHJcbiAgICBleHBlY3QoYmludG9vbHMuZnJvbUJ1ZmZlclRvQk4oYWRkcmVzc0luZGljZXNbMV0pLnRvTnVtYmVyKCkpLnRvQmUoMSlcclxuICB9KVxyXG5cclxuICB0ZXN0KFwidG9CdWZmZXJcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgYWxseWNoYWluQXV0aDFCdWY6IEJ1ZmZlciA9IGFsbHljaGFpbkF1dGgxLnRvQnVmZmVyKClcclxuICAgIGFsbHljaGFpbkF1dGgyLmZyb21CdWZmZXIoYWxseWNoYWluQXV0aDFCdWYpXHJcbiAgICBjb25zdCBhbGx5Y2hhaW5BdXRoMUhleDogc3RyaW5nID0gYWxseWNoYWluQXV0aDEudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxyXG4gICAgY29uc3QgYWxseWNoYWluQXV0aDJIZXg6IHN0cmluZyA9IGFsbHljaGFpbkF1dGgyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIGV4cGVjdChhbGx5Y2hhaW5BdXRoMUhleCkudG9CZShhbGx5Y2hhaW5BdXRoMkhleClcclxuICB9KVxyXG59KVxyXG4iXX0=