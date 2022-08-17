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
describe("SubnetAuth", () => {
    const subnetAuth1 = new platformvm_1.SubnetAuth();
    const subnetAuth2 = new platformvm_1.SubnetAuth();
    test("getters", () => {
        const typeName = subnetAuth1.getTypeName();
        expect(typeName).toBe("SubnetAuth");
        const typeID = subnetAuth1.getTypeID();
        expect(typeID).toBe(10);
        let addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(0, 0, 4);
        subnetAuth1.addAddressIndex(addressIndex);
        addressIndex = buffer_1.Buffer.alloc(4);
        addressIndex.writeUIntBE(1, 0, 4);
        subnetAuth1.addAddressIndex(addressIndex);
        const numAddressIndices = subnetAuth1.getNumAddressIndices();
        expect(numAddressIndices).toBe(2);
        const addressIndices = subnetAuth1.getAddressIndices();
        expect(buffer_1.Buffer.isBuffer(addressIndices[0])).toBeTruthy();
        expect(bintools.fromBufferToBN(addressIndices[0]).toNumber()).toBe(0);
        expect(bintools.fromBufferToBN(addressIndices[1]).toNumber()).toBe(1);
    });
    test("toBuffer", () => {
        const subnetAuth1Buf = subnetAuth1.toBuffer();
        subnetAuth2.fromBuffer(subnetAuth1Buf);
        const subnetAuth1Hex = subnetAuth1.toBuffer().toString("hex");
        const subnetAuth2Hex = subnetAuth2.toBuffer().toString("hex");
        expect(subnetAuth1Hex).toBe(subnetAuth2Hex);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VibmV0YXV0aC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdHMvYXBpcy9wbGF0Zm9ybXZtL3N1Ym5ldGF1dGgudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9DQUFnQztBQUNoQyxvREFBZ0Q7QUFDaEQsa0VBQXlDO0FBRXpDOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVqRCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQVMsRUFBRTtJQUNoQyxNQUFNLFdBQVcsR0FBZSxJQUFJLHVCQUFVLEVBQUUsQ0FBQTtJQUNoRCxNQUFNLFdBQVcsR0FBZSxJQUFJLHVCQUFVLEVBQUUsQ0FBQTtJQUVoRCxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQVMsRUFBRTtRQUN6QixNQUFNLFFBQVEsR0FBVyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUVuQyxNQUFNLE1BQU0sR0FBVyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV2QixJQUFJLFlBQVksR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxXQUFXLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pDLFlBQVksR0FBRyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxXQUFXLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBRXpDLE1BQU0saUJBQWlCLEdBQVcsV0FBVyxDQUFDLG9CQUFvQixFQUFFLENBQUE7UUFDcEUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRWpDLE1BQU0sY0FBYyxHQUFhLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2hFLE1BQU0sQ0FBQyxlQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDckUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsVUFBVSxFQUFFLEdBQVMsRUFBRTtRQUMxQixNQUFNLGNBQWMsR0FBVyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDckQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN0QyxNQUFNLGNBQWMsR0FBVyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3JFLE1BQU0sY0FBYyxHQUFXLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUM3QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IHsgU3VibmV0QXV0aCB9IGZyb20gXCJzcmMvYXBpcy9wbGF0Zm9ybXZtXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwic3JjL3V0aWxzL2JpbnRvb2xzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcblxuZGVzY3JpYmUoXCJTdWJuZXRBdXRoXCIsICgpOiB2b2lkID0+IHtcbiAgY29uc3Qgc3VibmV0QXV0aDE6IFN1Ym5ldEF1dGggPSBuZXcgU3VibmV0QXV0aCgpXG4gIGNvbnN0IHN1Ym5ldEF1dGgyOiBTdWJuZXRBdXRoID0gbmV3IFN1Ym5ldEF1dGgoKVxuXG4gIHRlc3QoXCJnZXR0ZXJzXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCB0eXBlTmFtZTogc3RyaW5nID0gc3VibmV0QXV0aDEuZ2V0VHlwZU5hbWUoKVxuICAgIGV4cGVjdCh0eXBlTmFtZSkudG9CZShcIlN1Ym5ldEF1dGhcIilcblxuICAgIGNvbnN0IHR5cGVJRDogbnVtYmVyID0gc3VibmV0QXV0aDEuZ2V0VHlwZUlEKClcbiAgICBleHBlY3QodHlwZUlEKS50b0JlKDEwKVxuXG4gICAgbGV0IGFkZHJlc3NJbmRleDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgYWRkcmVzc0luZGV4LndyaXRlVUludEJFKDAsIDAsIDQpXG4gICAgc3VibmV0QXV0aDEuYWRkQWRkcmVzc0luZGV4KGFkZHJlc3NJbmRleClcbiAgICBhZGRyZXNzSW5kZXggPSBCdWZmZXIuYWxsb2MoNClcbiAgICBhZGRyZXNzSW5kZXgud3JpdGVVSW50QkUoMSwgMCwgNClcbiAgICBzdWJuZXRBdXRoMS5hZGRBZGRyZXNzSW5kZXgoYWRkcmVzc0luZGV4KVxuXG4gICAgY29uc3QgbnVtQWRkcmVzc0luZGljZXM6IG51bWJlciA9IHN1Ym5ldEF1dGgxLmdldE51bUFkZHJlc3NJbmRpY2VzKClcbiAgICBleHBlY3QobnVtQWRkcmVzc0luZGljZXMpLnRvQmUoMilcblxuICAgIGNvbnN0IGFkZHJlc3NJbmRpY2VzOiBCdWZmZXJbXSA9IHN1Ym5ldEF1dGgxLmdldEFkZHJlc3NJbmRpY2VzKClcbiAgICBleHBlY3QoQnVmZmVyLmlzQnVmZmVyKGFkZHJlc3NJbmRpY2VzWzBdKSkudG9CZVRydXRoeSgpXG4gICAgZXhwZWN0KGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKGFkZHJlc3NJbmRpY2VzWzBdKS50b051bWJlcigpKS50b0JlKDApXG4gICAgZXhwZWN0KGJpbnRvb2xzLmZyb21CdWZmZXJUb0JOKGFkZHJlc3NJbmRpY2VzWzFdKS50b051bWJlcigpKS50b0JlKDEpXG4gIH0pXG5cbiAgdGVzdChcInRvQnVmZmVyXCIsICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzdWJuZXRBdXRoMUJ1ZjogQnVmZmVyID0gc3VibmV0QXV0aDEudG9CdWZmZXIoKVxuICAgIHN1Ym5ldEF1dGgyLmZyb21CdWZmZXIoc3VibmV0QXV0aDFCdWYpXG4gICAgY29uc3Qgc3VibmV0QXV0aDFIZXg6IHN0cmluZyA9IHN1Ym5ldEF1dGgxLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICBjb25zdCBzdWJuZXRBdXRoMkhleDogc3RyaW5nID0gc3VibmV0QXV0aDIudG9CdWZmZXIoKS50b1N0cmluZyhcImhleFwiKVxuICAgIGV4cGVjdChzdWJuZXRBdXRoMUhleCkudG9CZShzdWJuZXRBdXRoMkhleClcbiAgfSlcbn0pXG4iXX0=