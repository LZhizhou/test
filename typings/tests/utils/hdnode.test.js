"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importStar(require("src"));
const buffer_1 = require("buffer/");
const ip = "localhost";
const port = 80;
const protocol = "http";
const networkID = 1;
const axia = new src_1.default(ip, port, protocol, networkID);
const mnemonic = src_1.Mnemonic.getInstance();
const swapchain = axia.SwapChain();
const swapKeyChain = swapchain.keyChain();
describe("HDNode", () => {
    const xPriv = "xprv9s21ZrQH143K4RH1nRkHwuVz3qGREBLobwUoUBowLDucQXm4do8jvz12agvjHrAwjJXtq9BZ87WBPUPScDBnjKvBKVQ5xbS7GQwJKW7vXLD";
    const childXPriv = "xprvA7X7udsZk3q9mNMcGnN8PKHv5eHm6JA3TRzW2HsWnrYHbccXh5YMnRLA83VCPKWQUFmKf9AfCXSmoFs7HJ8Yr1LK52wJDVk262vGFszM4nb";
    const xPub = "xpub661MyMwAqRbcFSdAk5S6UECmA6MFQWiRBfPU5AsVcmrKY5HoFKPNYrKEq7isvaZVfNxhkrv5oXxFpQc6AVEcVW5NxeamKD6LyLUDMntbnq7";
    const seed = "a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af";
    const msg = "bb413645935a9bf1ecf0c3d30df2d573";
    const m = "immune year obscure laptop wage diamond join glue ecology envelope box fade mixed cradle athlete absorb stick rival punch dinosaur skin blind benefit pretty";
    const addrs = [
        "Swap-axc15qwuklmrfcmfw78yvka9pjsukjeevl4aveehq0",
        "Swap-axc13wqaxm6zgjq5qwzuyyxyl9yrz3edcgwgfht6gt",
        "Swap-axc1z3dn3vczxttts8dsdjfgtnkekf8nvqhhsj5stl",
        "Swap-axc1j6kze9n7r3e8wq6jta5mf6pd3fwnu0v9wygc8p",
        "Swap-axc1ngasfmvl8g63lzwznp0374myz7ajt4746g750m",
        "Swap-axc1pr7pzcggtrk6uap58sfsrlnhqhayly2gtlux9l",
        "Swap-axc1wwtn3gx7ke4ge2c29eg5sun36nyj55u4dle9gn",
        "Swap-axc13527pvlnxa4wrfgt0h8ya7nkjawqq29sv5s89x",
        "Swap-axc1gw6agtcsz969ugpqh2zx2lmjchg6npklvp43qq",
        "Swap-axc10agjetvj0a0vf6wtlh7s6ctr8ha8ch8km8z567"
    ];
    test("derive", () => {
        const hdnode = new src_1.HDNode(seed);
        const path = "m/9000'/2614666'/4849181'/4660'/2'/1/3";
        const child = hdnode.derive(path);
        expect(child.privateExtendedKey).toBe(childXPriv);
    });
    test("fromMasterSeedBuffer", () => {
        const hdnode = new src_1.HDNode(buffer_1.Buffer.from(seed));
        expect(hdnode.privateExtendedKey).toBe(xPriv);
    });
    test("fromMasterSeedString", () => {
        const hdnode = new src_1.HDNode(seed);
        expect(hdnode.privateExtendedKey).toBe(xPriv);
    });
    test("fromXPriv", () => {
        const hdnode = new src_1.HDNode(xPriv);
        expect(hdnode.privateExtendedKey).toBe(xPriv);
    });
    test("fromXPub", () => {
        const hdnode = new src_1.HDNode(xPub);
        expect(hdnode.publicExtendedKey).toBe(xPub);
    });
    test("sign", () => {
        const hdnode = new src_1.HDNode(xPriv);
        const sig = hdnode.sign(buffer_1.Buffer.from(msg));
        expect(buffer_1.Buffer.isBuffer(sig)).toBeTruthy();
    });
    test("verify", () => {
        const hdnode = new src_1.HDNode(xPriv);
        const sig = hdnode.sign(buffer_1.Buffer.from(msg));
        const verify = hdnode.verify(buffer_1.Buffer.from(msg), sig);
        expect(verify).toBeTruthy();
    });
    test("wipePrivateData", () => {
        const hdnode = new src_1.HDNode(xPriv);
        hdnode.wipePrivateData();
        expect(hdnode.privateKey).toBeNull();
    });
    test("BIP44", () => {
        const seed = mnemonic.mnemonicToSeedSync(m);
        const hdnode = new src_1.HDNode(seed);
        for (let i = 0; i <= 9; i++) {
            const child = hdnode.derive(`m/44'/9000'/0'/0/${i}`);
            swapKeyChain.importKey(child.privateKeyCB58);
        }
        const xAddressStrings = swapchain.keyChain().getAddressStrings();
        expect(xAddressStrings).toStrictEqual(addrs);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGRub2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0cy91dGlscy9oZG5vZGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTRDO0FBQzVDLG9DQUFnQztBQUdoQyxNQUFNLEVBQUUsR0FBVyxXQUFXLENBQUE7QUFDOUIsTUFBTSxJQUFJLEdBQVcsRUFBRSxDQUFBO0FBQ3ZCLE1BQU0sUUFBUSxHQUFXLE1BQU0sQ0FBQTtBQUMvQixNQUFNLFNBQVMsR0FBVyxDQUFDLENBQUE7QUFDM0IsTUFBTSxJQUFJLEdBQVMsSUFBSSxhQUFJLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUE7QUFDMUQsTUFBTSxRQUFRLEdBQWEsY0FBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUMxQyxNQUFNLFlBQVksR0FBYSxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUE7QUFFbkQsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFTLEVBQUU7SUFDNUIsTUFBTSxLQUFLLEdBQ1QsaUhBQWlILENBQUE7SUFDbkgsTUFBTSxVQUFVLEdBQ2QsaUhBQWlILENBQUE7SUFDbkgsTUFBTSxJQUFJLEdBQ1IsaUhBQWlILENBQUE7SUFDbkgsTUFBTSxJQUFJLEdBQ1Isa0lBQWtJLENBQUE7SUFDcEksTUFBTSxHQUFHLEdBQVcsa0NBQWtDLENBQUE7SUFDdEQsTUFBTSxDQUFDLEdBQ0wsOEpBQThKLENBQUE7SUFDaEssTUFBTSxLQUFLLEdBQWE7UUFDdEIsaURBQWlEO1FBQ2pELGlEQUFpRDtRQUNqRCxpREFBaUQ7UUFDakQsaURBQWlEO1FBQ2pELGlEQUFpRDtRQUNqRCxpREFBaUQ7UUFDakQsaURBQWlEO1FBQ2pELGlEQUFpRDtRQUNqRCxpREFBaUQ7UUFDakQsaURB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QUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtRQUN2QixNQUFNLElBQUksR0FBVyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkQsTUFBTSxNQUFNLEdBQVcsSUFBSSxZQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxNQUFNLEtBQUssR0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVELFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1NBQzdDO1FBQ0QsTUFBTSxlQUFlLEdBQWEsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUM5QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF4aWEsIHsgSEROb2RlLCBNbmVtb25pYyB9IGZyb20gXCJzcmNcIlxyXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXHJcbmltcG9ydCB7IEFWTUFQSSwgS2V5Q2hhaW4gfSBmcm9tIFwic3JjL2FwaXMvYXZtXCJcclxuXHJcbmNvbnN0IGlwOiBzdHJpbmcgPSBcImxvY2FsaG9zdFwiXHJcbmNvbnN0IHBvcnQ6IG51bWJlciA9IDgwXHJcbmNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSBcImh0dHBcIlxyXG5jb25zdCBuZXR3b3JrSUQ6IG51bWJlciA9IDFcclxuY29uc3QgYXhpYTogQXhpYSA9IG5ldyBBeGlhKGlwLCBwb3J0LCBwcm90b2NvbCwgbmV0d29ya0lEKVxyXG5jb25zdCBtbmVtb25pYzogTW5lbW9uaWMgPSBNbmVtb25pYy5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IHN3YXBjaGFpbjogQVZNQVBJID0gYXhpYS5Td2FwQ2hhaW4oKVxyXG5jb25zdCBzd2FwS2V5Q2hhaW46IEtleUNoYWluID0gc3dhcGNoYWluLmtleUNoYWluKClcclxuXHJcbmRlc2NyaWJlKFwiSEROb2RlXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCB4UHJpdjogc3RyaW5nID1cclxuICAgIFwieHBydjlzMjFaclFIMTQzSzRSSDFuUmtId3VWejNxR1JFQkxvYndVb1VCb3dMRHVjUVhtNGRvOGp2ejEyYWd2akhyQXdqSlh0cTlCWjg3V0JQVVBTY0RCbmpLdkJLVlE1eGJTN0dRd0pLVzd2WExEXCJcclxuICBjb25zdCBjaGlsZFhQcml2OiBzdHJpbmcgPVxyXG4gICAgXCJ4cHJ2QTdYN3Vkc1prM3E5bU5NY0duTjhQS0h2NWVIbTZKQTNUUnpXMkhzV25yWUhiY2NYaDVZTW5STEE4M1ZDUEtXUVVGbUtmOUFmQ1hTbW9GczdISjhZcjFMSzUyd0pEVmsyNjJ2R0Zzek00bmJcIlxyXG4gIGNvbnN0IHhQdWI6IHN0cmluZyA9XHJcbiAgICBcInhwdWI2NjFNeU13QXFSYmNGU2RBazVTNlVFQ21BNk1GUVdpUkJmUFU1QXNWY21yS1k1SG9GS1BOWXJLRXE3aXN2YVpWZk54aGtydjVvWHhGcFFjNkFWRWNWVzVOeGVhbUtENkx5TFVETW50Ym5xN1wiXHJcbiAgY29uc3Qgc2VlZDogc3RyaW5nID1cclxuICAgIFwiYTBjNDJhOWMzYWM2YWJmMmJhNmE5OTQ2YWU4M2FmMThmNTFiZjFjOWZhN2RhY2M0YzkyNTEzY2M0ZGQwMTU4MzQzNDFjNzc1ZGNkNGMwZmFjNzM1NDdjNTY2MmQ4MWE5ZTkzNjFhMGFhYzYwNGE3M2EzMjFiZDkxMDNiY2U4YWZcIlxyXG4gIGNvbnN0IG1zZzogc3RyaW5nID0gXCJiYjQxMzY0NTkzNWE5YmYxZWNmMGMzZDMwZGYyZDU3M1wiXHJcbiAgY29uc3QgbTogc3RyaW5nID1cclxuICAgIFwiaW1tdW5lIHllYXIgb2JzY3VyZSBsYXB0b3Agd2FnZSBkaWFtb25kIGpvaW4gZ2x1ZSBlY29sb2d5IGVudmVsb3BlIGJveCBmYWRlIG1peGVkIGNyYWRsZSBhdGhsZXRlIGFic29yYiBzdGljayByaXZhbCBwdW5jaCBkaW5vc2F1ciBza2luIGJsaW5kIGJlbmVmaXQgcHJldHR5XCJcclxuICBjb25zdCBhZGRyczogc3RyaW5nW10gPSBbXHJcbiAgICBcIlN3YXAtYXhjMTVxd3VrbG1yZmNtZnc3OHl2a2E5cGpzdWtqZWV2bDRhdmVlaHEwXCIsXHJcbiAgICBcIlN3YXAtYXhjMTN3cWF4bTZ6Z2pxNXF3enV5eXh5bDl5cnozZWRjZ3dnZmh0Nmd0XCIsXHJcbiAgICBcIlN3YXAtYXhjMXozZG4zdmN6eHR0dHM4ZHNkamZndG5rZWtmOG52cWhoc2o1c3RsXCIsXHJcbiAgICBcIlN3YXAtYXhjMWo2a3plOW43cjNlOHdxNmp0YTVtZjZwZDNmd251MHY5d3lnYzhwXCIsXHJcbiAgICBcIlN3YXAtYXhjMW5nYXNmbXZsOGc2M2x6d3pucDAzNzRteXo3YWp0NDc0Nmc3NTBtXCIsXHJcbiAgICBcIlN3YXAtYXhjMXByN3B6Y2dndHJrNnVhcDU4c2ZzcmxuaHFoYXlseTJndGx1eDlsXCIsXHJcbiAgICBcIlN3YXAtYXhjMXd3dG4zZ3g3a2U0Z2UyYzI5ZWc1c3VuMzZueWo1NXU0ZGxlOWduXCIsXHJcbiAgICBcIlN3YXAtYXhjMTM1MjdwdmxueGE0d3JmZ3QwaDh5YTdua2phd3FxMjlzdjVzODl4XCIsXHJcbiAgICBcIlN3YXAtYXhjMWd3NmFndGNzejk2OXVncHFoMnp4MmxtamNoZzZucGtsdnA0M3FxXCIsXHJcbiAgICBcIlN3YXAtYXhjMTBhZ2pldHZqMGEwdmY2d3RsaDdzNmN0cjhoYThjaDhrbTh6NTY3XCJcclxuICBdXHJcblxyXG4gIHRlc3QoXCJkZXJpdmVcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgaGRub2RlOiBIRE5vZGUgPSBuZXcgSEROb2RlKHNlZWQpXHJcbiAgICBjb25zdCBwYXRoOiBzdHJpbmcgPSBcIm0vOTAwMCcvMjYxNDY2NicvNDg0OTE4MScvNDY2MCcvMicvMS8zXCJcclxuICAgIGNvbnN0IGNoaWxkID0gaGRub2RlLmRlcml2ZShwYXRoKVxyXG4gICAgZXhwZWN0KGNoaWxkLnByaXZhdGVFeHRlbmRlZEtleSkudG9CZShjaGlsZFhQcml2KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJmcm9tTWFzdGVyU2VlZEJ1ZmZlclwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBoZG5vZGU6IEhETm9kZSA9IG5ldyBIRE5vZGUoQnVmZmVyLmZyb20oc2VlZCkpXHJcbiAgICBleHBlY3QoaGRub2RlLnByaXZhdGVFeHRlbmRlZEtleSkudG9CZSh4UHJpdilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZnJvbU1hc3RlclNlZWRTdHJpbmdcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgaGRub2RlOiBIRE5vZGUgPSBuZXcgSEROb2RlKHNlZWQpXHJcbiAgICBleHBlY3QoaGRub2RlLnByaXZhdGVFeHRlbmRlZEtleSkudG9CZSh4UHJpdilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwiZnJvbVhQcml2XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IGhkbm9kZTogSEROb2RlID0gbmV3IEhETm9kZSh4UHJpdilcclxuICAgIGV4cGVjdChoZG5vZGUucHJpdmF0ZUV4dGVuZGVkS2V5KS50b0JlKHhQcml2KVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJmcm9tWFB1YlwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBoZG5vZGU6IEhETm9kZSA9IG5ldyBIRE5vZGUoeFB1YilcclxuICAgIGV4cGVjdChoZG5vZGUucHVibGljRXh0ZW5kZWRLZXkpLnRvQmUoeFB1YilcclxuICB9KVxyXG5cclxuICB0ZXN0KFwic2lnblwiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBoZG5vZGU6IEhETm9kZSA9IG5ldyBIRE5vZGUoeFByaXYpXHJcbiAgICBjb25zdCBzaWc6IEJ1ZmZlciA9IGhkbm9kZS5zaWduKEJ1ZmZlci5mcm9tKG1zZykpXHJcbiAgICBleHBlY3QoQnVmZmVyLmlzQnVmZmVyKHNpZykpLnRvQmVUcnV0aHkoKVxyXG4gIH0pXHJcblxyXG4gIHRlc3QoXCJ2ZXJpZnlcIiwgKCk6IHZvaWQgPT4ge1xyXG4gICAgY29uc3QgaGRub2RlOiBIRE5vZGUgPSBuZXcgSEROb2RlKHhQcml2KVxyXG4gICAgY29uc3Qgc2lnOiBCdWZmZXIgPSBoZG5vZGUuc2lnbihCdWZmZXIuZnJvbShtc2cpKVxyXG4gICAgY29uc3QgdmVyaWZ5OiBib29sZWFuID0gaGRub2RlLnZlcmlmeShCdWZmZXIuZnJvbShtc2cpLCBzaWcpXHJcbiAgICBleHBlY3QodmVyaWZ5KS50b0JlVHJ1dGh5KClcclxuICB9KVxyXG5cclxuICB0ZXN0KFwid2lwZVByaXZhdGVEYXRhXCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IGhkbm9kZTogSEROb2RlID0gbmV3IEhETm9kZSh4UHJpdilcclxuICAgIGhkbm9kZS53aXBlUHJpdmF0ZURhdGEoKVxyXG4gICAgZXhwZWN0KGhkbm9kZS5wcml2YXRlS2V5KS50b0JlTnVsbCgpXHJcbiAgfSlcclxuXHJcbiAgdGVzdChcIkJJUDQ0XCIsICgpOiB2b2lkID0+IHtcclxuICAgIGNvbnN0IHNlZWQ6IEJ1ZmZlciA9IG1uZW1vbmljLm1uZW1vbmljVG9TZWVkU3luYyhtKVxyXG4gICAgY29uc3QgaGRub2RlOiBIRE5vZGUgPSBuZXcgSEROb2RlKHNlZWQpXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDw9IDk7IGkrKykge1xyXG4gICAgICBjb25zdCBjaGlsZDogSEROb2RlID0gaGRub2RlLmRlcml2ZShgbS80NCcvOTAwMCcvMCcvMC8ke2l9YClcclxuICAgICAgc3dhcEtleUNoYWluLmltcG9ydEtleShjaGlsZC5wcml2YXRlS2V5Q0I1OClcclxuICAgIH1cclxuICAgIGNvbnN0IHhBZGRyZXNzU3RyaW5nczogc3RyaW5nW10gPSBzd2FwY2hhaW4ua2V5Q2hhaW4oKS5nZXRBZGRyZXNzU3RyaW5ncygpXHJcbiAgICBleHBlY3QoeEFkZHJlc3NTdHJpbmdzKS50b1N0cmljdEVxdWFsKGFkZHJzKVxyXG4gIH0pXHJcbn0pXHJcbiJdfQ==