"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const outputs_1 = require("../../../src/apis/avm/outputs");
const initialstates_1 = require("../../../src/apis/avm/initialstates");
const avm_1 = require("../../../src/apis/avm");
const utils_1 = require("../../../src/utils");
/**
 * @ignore
 */
const serialization = utils_1.Serialization.getInstance();
describe("AVM", () => {
    test("GenesisAsset", () => {
        const m = "2Zc54v4ek37TEwu4LiV3j41PUMRd6acDDU3ZCVSxE7X";
        const mHex = "66726f6d20736e6f77666c616b6520746f206176616c616e636865";
        const blockchainIDHex = "0000000000000000000000000000000000000000000000000000000000000000";
        const hex = "hex";
        const cb58 = "cb58";
        const bech32 = "bech32";
        const memo = serialization.typeToBuffer(m, cb58);
        const amount = new bn_js_1.default(0);
        const address = "Swap-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u";
        const addressBuf = serialization.typeToBuffer(address, bech32);
        const threshold = 1;
        const locktime = new bn_js_1.default(0);
        const assetAlias = "asset1";
        const name = "asset1";
        const symbol = "MFCA";
        const denomination = 1;
        const outs = [];
        const ins = [];
        const vcapSecpOutput = new outputs_1.SECPTransferOutput(amount, [addressBuf], locktime, threshold);
        const initialStates = new initialstates_1.InitialStates();
        initialStates.addOutput(vcapSecpOutput);
        const genesisAsset = new avm_1.GenesisAsset(assetAlias, name, symbol, denomination, initialStates, memo);
        const genesisAsset2 = new avm_1.GenesisAsset();
        genesisAsset2.fromBuffer(genesisAsset.toBuffer());
        expect(genesisAsset.toBuffer().toString("hex")).toBe(genesisAsset2.toBuffer().toString("hex"));
        expect(genesisAsset.getTypeName()).toBe("GenesisAsset");
        expect(genesisAsset.getTypeID()).toBeUndefined();
        expect(genesisAsset.getCodecID()).toBeUndefined();
        expect(genesisAsset.getNetworkID()).toBe(utils_1.DefaultNetworkID);
        expect(genesisAsset.getName()).toBe(name);
        expect(genesisAsset.getAssetAlias()).toBe(assetAlias);
        expect(genesisAsset.getSymbol()).toBe(symbol);
        expect(genesisAsset.getDenomination()).toBe(denomination);
        expect(genesisAsset.getBlockchainID().toString(hex)).toBe(blockchainIDHex);
        expect(genesisAsset.getIns()).toEqual(outs);
        expect(genesisAsset.getOuts()).toEqual(ins);
        expect(genesisAsset.getInitialStates()).toStrictEqual(initialStates);
        expect(genesisAsset.getMemo().toString(hex)).toBe(mHex);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXNpc2Fzc2V0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2F2bS9nZW5lc2lzYXNzZXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUFzQjtBQUV0QiwyREFHc0M7QUFDdEMsdUVBQW1FO0FBQ25FLCtDQUF1RTtBQUN2RSw4Q0FLMkI7QUFFM0I7O0dBRUc7QUFDSCxNQUFNLGFBQWEsR0FBa0IscUJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNoRSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQVMsRUFBRTtJQUN6QixJQUFJLENBQUMsY0FBYyxFQUFFLEdBQVMsRUFBRTtRQUM5QixNQUFNLENBQUMsR0FBVyw2Q0FBNkMsQ0FBQTtRQUMvRCxNQUFNLElBQUksR0FDUix3REFBd0QsQ0FBQTtRQUMxRCxNQUFNLGVBQWUsR0FDbkIsa0VBQWtFLENBQUE7UUFDcEUsTUFBTSxHQUFHLEdBQXVCLEtBQUssQ0FBQTtRQUNyQyxNQUFNLElBQUksR0FBbUIsTUFBTSxDQUFBO1FBQ25DLE1BQU0sTUFBTSxHQUFtQixRQUFRLENBQUE7UUFDdkMsTUFBTSxJQUFJLEdBQVcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDeEQsTUFBTSxNQUFNLEdBQU8sSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUIsTUFBTSxPQUFPLEdBQVcsbURBQW1ELENBQUE7UUFDM0UsTUFBTSxVQUFVLEdBQVcsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDdEUsTUFBTSxTQUFTLEdBQVcsQ0FBQyxDQUFBO1FBQzNCLE1BQU0sUUFBUSxHQUFPLElBQUksZUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzlCLE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQTtRQUNuQyxNQUFNLElBQUksR0FBVyxRQUFRLENBQUE7UUFDN0IsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFBO1FBQzdCLE1BQU0sWUFBWSxHQUFXLENBQUMsQ0FBQTtRQUM5QixNQUFNLElBQUksR0FBeUIsRUFBRSxDQUFBO1FBQ3JDLE1BQU0sR0FBRyxHQUF3QixFQUFFLENBQUE7UUFDbkMsTUFBTSxjQUFjLEdBQUcsSUFBSSw0QkFBa0IsQ0FDM0MsTUFBTSxFQUNOLENBQUMsVUFBVSxDQUFDLEVBQ1osUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFBO1FBQ0QsTUFBTSxhQUFhLEdBQWtCLElBQUksNkJBQWEsRUFBRSxDQUFBO1FBQ3hELGFBQWEsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdkMsTUFBTSxZQUFZLEdBQWlCLElBQUksa0JBQVksQ0FDakQsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sWUFBWSxFQUNaLGFBQWEsRUFDYixJQUFJLENBQ0wsQ0FBQTtRQUNELE1BQU0sYUFBYSxHQUFpQixJQUFJLGtCQUFZLEVBQUUsQ0FBQTtRQUN0RCxhQUFhLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBQ2pELE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNsRCxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUN6QyxDQUFBO1FBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDaEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2pELE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQWdCLENBQUMsQ0FBQTtRQUMxRCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDckQsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3pELE1BQU0sQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQzFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDcEUsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDekQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCB7XHJcbiAgU0VDUFRyYW5zZmVyT3V0cHV0LFxyXG4gIFRyYW5zZmVyYWJsZU91dHB1dFxyXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvYXBpcy9hdm0vb3V0cHV0c1wiXHJcbmltcG9ydCB7IEluaXRpYWxTdGF0ZXMgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL2FwaXMvYXZtL2luaXRpYWxzdGF0ZXNcIlxyXG5pbXBvcnQgeyBHZW5lc2lzQXNzZXQsIFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4uLy4uLy4uL3NyYy9hcGlzL2F2bVwiXHJcbmltcG9ydCB7XHJcbiAgRGVmYXVsdE5ldHdvcmtJRCxcclxuICBTZXJpYWxpemF0aW9uLFxyXG4gIFNlcmlhbGl6ZWRFbmNvZGluZyxcclxuICBTZXJpYWxpemVkVHlwZVxyXG59IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHNcIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcclxuZGVzY3JpYmUoXCJBVk1cIiwgKCk6IHZvaWQgPT4ge1xyXG4gIHRlc3QoXCJHZW5lc2lzQXNzZXRcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgbTogc3RyaW5nID0gXCIyWmM1NHY0ZWszN1RFd3U0TGlWM2o0MVBVTVJkNmFjRERVM1pDVlN4RTdYXCJcclxuICAgIGNvbnN0IG1IZXg6IHN0cmluZyA9XHJcbiAgICAgIFwiNjY3MjZmNmQyMDczNmU2Zjc3NjY2YzYxNmI2NTIwNzQ2ZjIwNjE3NjYxNmM2MTZlNjM2ODY1XCJcclxuICAgIGNvbnN0IGJsb2NrY2hhaW5JREhleDogc3RyaW5nID1cclxuICAgICAgXCIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwXCJcclxuICAgIGNvbnN0IGhleDogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIlxyXG4gICAgY29uc3QgY2I1ODogU2VyaWFsaXplZFR5cGUgPSBcImNiNThcIlxyXG4gICAgY29uc3QgYmVjaDMyOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcclxuICAgIGNvbnN0IG1lbW86IEJ1ZmZlciA9IHNlcmlhbGl6YXRpb24udHlwZVRvQnVmZmVyKG0sIGNiNTgpXHJcbiAgICBjb25zdCBhbW91bnQ6IEJOID0gbmV3IEJOKDApXHJcbiAgICBjb25zdCBhZGRyZXNzOiBzdHJpbmcgPSBcIlN3YXAtbG9jYWwxOGptYThwcHczbmh4NXI0YXA4Y2xhenowZHBzN3J2NXUwMHo5NnVcIlxyXG4gICAgY29uc3QgYWRkcmVzc0J1ZjogQnVmZmVyID0gc2VyaWFsaXphdGlvbi50eXBlVG9CdWZmZXIoYWRkcmVzcywgYmVjaDMyKVxyXG4gICAgY29uc3QgdGhyZXNob2xkOiBudW1iZXIgPSAxXHJcbiAgICBjb25zdCBsb2NrdGltZTogQk4gPSBuZXcgQk4oMClcclxuICAgIGNvbnN0IGFzc2V0QWxpYXM6IHN0cmluZyA9IFwiYXNzZXQxXCJcclxuICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IFwiYXNzZXQxXCJcclxuICAgIGNvbnN0IHN5bWJvbDogc3RyaW5nID0gXCJNRkNBXCJcclxuICAgIGNvbnN0IGRlbm9taW5hdGlvbjogbnVtYmVyID0gMVxyXG4gICAgY29uc3Qgb3V0czogVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxyXG4gICAgY29uc3QgaW5zOiBUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cclxuICAgIGNvbnN0IHZjYXBTZWNwT3V0cHV0ID0gbmV3IFNFQ1BUcmFuc2Zlck91dHB1dChcclxuICAgICAgYW1vdW50LFxyXG4gICAgICBbYWRkcmVzc0J1Zl0sXHJcbiAgICAgIGxvY2t0aW1lLFxyXG4gICAgICB0aHJlc2hvbGRcclxuICAgIClcclxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZXM6IEluaXRpYWxTdGF0ZXMgPSBuZXcgSW5pdGlhbFN0YXRlcygpXHJcbiAgICBpbml0aWFsU3RhdGVzLmFkZE91dHB1dCh2Y2FwU2VjcE91dHB1dClcclxuICAgIGNvbnN0IGdlbmVzaXNBc3NldDogR2VuZXNpc0Fzc2V0ID0gbmV3IEdlbmVzaXNBc3NldChcclxuICAgICAgYXNzZXRBbGlhcyxcclxuICAgICAgbmFtZSxcclxuICAgICAgc3ltYm9sLFxyXG4gICAgICBkZW5vbWluYXRpb24sXHJcbiAgICAgIGluaXRpYWxTdGF0ZXMsXHJcbiAgICAgIG1lbW9cclxuICAgIClcclxuICAgIGNvbnN0IGdlbmVzaXNBc3NldDI6IEdlbmVzaXNBc3NldCA9IG5ldyBHZW5lc2lzQXNzZXQoKVxyXG4gICAgZ2VuZXNpc0Fzc2V0Mi5mcm9tQnVmZmVyKGdlbmVzaXNBc3NldC50b0J1ZmZlcigpKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC50b0J1ZmZlcigpLnRvU3RyaW5nKFwiaGV4XCIpKS50b0JlKFxyXG4gICAgICBnZW5lc2lzQXNzZXQyLnRvQnVmZmVyKCkudG9TdHJpbmcoXCJoZXhcIilcclxuICAgIClcclxuICAgIGV4cGVjdChnZW5lc2lzQXNzZXQuZ2V0VHlwZU5hbWUoKSkudG9CZShcIkdlbmVzaXNBc3NldFwiKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXRUeXBlSUQoKSkudG9CZVVuZGVmaW5lZCgpXHJcbiAgICBleHBlY3QoZ2VuZXNpc0Fzc2V0LmdldENvZGVjSUQoKSkudG9CZVVuZGVmaW5lZCgpXHJcbiAgICBleHBlY3QoZ2VuZXNpc0Fzc2V0LmdldE5ldHdvcmtJRCgpKS50b0JlKERlZmF1bHROZXR3b3JrSUQpXHJcbiAgICBleHBlY3QoZ2VuZXNpc0Fzc2V0LmdldE5hbWUoKSkudG9CZShuYW1lKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXRBc3NldEFsaWFzKCkpLnRvQmUoYXNzZXRBbGlhcylcclxuICAgIGV4cGVjdChnZW5lc2lzQXNzZXQuZ2V0U3ltYm9sKCkpLnRvQmUoc3ltYm9sKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXREZW5vbWluYXRpb24oKSkudG9CZShkZW5vbWluYXRpb24pXHJcbiAgICBleHBlY3QoZ2VuZXNpc0Fzc2V0LmdldEJsb2NrY2hhaW5JRCgpLnRvU3RyaW5nKGhleCkpLnRvQmUoYmxvY2tjaGFpbklESGV4KVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXRJbnMoKSkudG9FcXVhbChvdXRzKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXRPdXRzKCkpLnRvRXF1YWwoaW5zKVxyXG4gICAgZXhwZWN0KGdlbmVzaXNBc3NldC5nZXRJbml0aWFsU3RhdGVzKCkpLnRvU3RyaWN0RXF1YWwoaW5pdGlhbFN0YXRlcylcclxuICAgIGV4cGVjdChnZW5lc2lzQXNzZXQuZ2V0TWVtbygpLnRvU3RyaW5nKGhleCkpLnRvQmUobUhleClcclxuICB9KVxyXG59KVxyXG4iXX0=