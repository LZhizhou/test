"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e2etestlib_1 = require("./e2etestlib");
const bn_js_1 = __importDefault(require("bn.js"));
describe("AXChain", () => {
    const axia = (0, e2etestlib_1.getAxia)();
    const axchain = axia.AXChain();
    const keystore = axia.NodeKeys();
    let exportTxHash = { value: "" };
    const user = "axiaJsAXChainUser";
    const passwd = "axiaJsP@ssw4rd";
    const key = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN";
    const privateKeyHex = "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
    const whaleAddr = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
    const swapChainAddr = "Swap-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p";
    // test_name        response_promise                            resp_fn          matcher           expected_value/obtained_value
    const tests_spec = [
        [
            "createUser",
            () => keystore.createUser(user, passwd),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        [
            "importKey",
            () => axchain.importKey(user, passwd, key),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => whaleAddr
        ],
        [
            "exportAXC",
            () => axchain.exportAXC(user, passwd, swapChainAddr, new bn_js_1.default(10)),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => exportTxHash
        ],
        [
            "getBaseFee",
            () => axchain.getBaseFee(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "0x34630b8a00"
        ],
        [
            "getMaxPriorityFeePerGas",
            () => axchain.getMaxPriorityFeePerGas(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "0x0"
        ],
        [
            "exportKey",
            () => axchain.exportKey(user, passwd, whaleAddr),
            (x) => x,
            e2etestlib_1.Matcher.toEqual,
            () => ({
                privateKey: key,
                privateKeyHex: privateKeyHex
            })
        ]
    ];
    (0, e2etestlib_1.createTests)(tests_spec);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhjaGFpbl9ub21vY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2UyZV90ZXN0cy9heGNoYWluX25vbW9jay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBQTREO0FBRTVELGtEQUFzQjtBQUl0QixRQUFRLENBQUMsU0FBUyxFQUFFLEdBQVMsRUFBRTtJQUM3QixNQUFNLElBQUksR0FBUyxJQUFBLG9CQUFPLEdBQUUsQ0FBQTtJQUM1QixNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDdEMsTUFBTSxRQUFRLEdBQWdCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUU3QyxJQUFJLFlBQVksR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUVoQyxNQUFNLElBQUksR0FBVyxtQkFBbUIsQ0FBQTtJQUN4QyxNQUFNLE1BQU0sR0FBVyxnQkFBZ0IsQ0FBQTtJQUN2QyxNQUFNLEdBQUcsR0FDUCw4REFBOEQsQ0FBQTtJQUNoRSxNQUFNLGFBQWEsR0FDakIsb0VBQW9FLENBQUE7SUFDdEUsTUFBTSxTQUFTLEdBQVcsNENBQTRDLENBQUE7SUFDdEUsTUFBTSxhQUFhLEdBQVcsb0RBQW9ELENBQUE7SUFFbEYsZ0lBQWdJO0lBQ2hJLE1BQU0sVUFBVSxHQUFRO1FBQ3RCO1lBQ0UsWUFBWTtZQUNaLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDWDtRQUNEO1lBQ0UsV0FBVztZQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUM7WUFDMUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxTQUFTO1NBQ2hCO1FBQ0Q7WUFDRSxXQUFXO1lBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxJQUFJLGVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsR0FBRztZQUNYLEdBQUcsRUFBRSxDQUFDLFlBQVk7U0FDbkI7UUFDRDtZQUNFLFlBQVk7WUFDWixHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzFCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsY0FBYztTQUNyQjtRQUNEO1lBQ0UseUJBQXlCO1lBQ3pCLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRTtZQUN2QyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDWjtRQUNEO1lBQ0UsV0FBVztZQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNMLFVBQVUsRUFBRSxHQUFHO2dCQUNmLGFBQWEsRUFBRSxhQUFhO2FBQzdCLENBQUM7U0FDSDtLQUNGLENBQUE7SUFFRCxJQUFBLHdCQUFXLEVBQUMsVUFBVSxDQUFDLENBQUE7QUFDekIsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRBeGlhLCBjcmVhdGVUZXN0cywgTWF0Y2hlciB9IGZyb20gXCIuL2UyZXRlc3RsaWJcIlxyXG5pbXBvcnQgeyBLZXlzdG9yZUFQSSB9IGZyb20gXCJzcmMvYXBpcy9rZXlzdG9yZS9hcGlcIlxyXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IEF4aWEgZnJvbSBcInNyY1wiXHJcbmltcG9ydCB7IEVWTUFQSSB9IGZyb20gXCJzcmMvYXBpcy9ldm1cIlxyXG5cclxuZGVzY3JpYmUoXCJBWENoYWluXCIsICgpOiB2b2lkID0+IHtcclxuICBjb25zdCBheGlhOiBBeGlhID0gZ2V0QXhpYSgpXHJcbiAgY29uc3QgYXhjaGFpbjogRVZNQVBJID0gYXhpYS5BWENoYWluKClcclxuICBjb25zdCBrZXlzdG9yZTogS2V5c3RvcmVBUEkgPSBheGlhLk5vZGVLZXlzKClcclxuXHJcbiAgbGV0IGV4cG9ydFR4SGFzaCA9IHsgdmFsdWU6IFwiXCIgfVxyXG5cclxuICBjb25zdCB1c2VyOiBzdHJpbmcgPSBcImF4aWFKc0FYQ2hhaW5Vc2VyXCJcclxuICBjb25zdCBwYXNzd2Q6IHN0cmluZyA9IFwiYXhpYUpzUEBzc3c0cmRcIlxyXG4gIGNvbnN0IGtleTogc3RyaW5nID1cclxuICAgIFwiUHJpdmF0ZUtleS1ld29xalA3UHhZNHlyM2lMVHBMaXNyaXF0OTRoZHlERk5nY2hTeEdHenRVclRYdE5OXCJcclxuICBjb25zdCBwcml2YXRlS2V5SGV4OiBzdHJpbmcgPVxyXG4gICAgXCIweDU2Mjg5ZTk5Yzk0YjY5MTJiZmMxMmFkYzA5M2M5YjUxMTI0ZjBkYzU0YWM3YTc2NmIyYmM1Y2NmNTU4ZDgwMjdcIlxyXG4gIGNvbnN0IHdoYWxlQWRkcjogc3RyaW5nID0gXCIweDhkYjk3QzdjRWNFMjQ5YzJiOThiREMwMjI2Q2M0QzJBNTdCRjUyRkNcIlxyXG4gIGNvbnN0IHN3YXBDaGFpbkFkZHI6IHN0cmluZyA9IFwiU3dhcC1jdXN0b20xOGptYThwcHczbmh4NXI0YXA4Y2xhenowZHBzN3J2NXU5eGRlN3BcIlxyXG5cclxuICAvLyB0ZXN0X25hbWUgICAgICAgIHJlc3BvbnNlX3Byb21pc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcF9mbiAgICAgICAgICBtYXRjaGVyICAgICAgICAgICBleHBlY3RlZF92YWx1ZS9vYnRhaW5lZF92YWx1ZVxyXG4gIGNvbnN0IHRlc3RzX3NwZWM6IGFueSA9IFtcclxuICAgIFtcclxuICAgICAgXCJjcmVhdGVVc2VyXCIsXHJcbiAgICAgICgpID0+IGtleXN0b3JlLmNyZWF0ZVVzZXIodXNlciwgcGFzc3dkKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9CZSxcclxuICAgICAgKCkgPT4gdHJ1ZVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJpbXBvcnRLZXlcIixcclxuICAgICAgKCkgPT4gYXhjaGFpbi5pbXBvcnRLZXkodXNlciwgcGFzc3dkLCBrZXkpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiB3aGFsZUFkZHJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZXhwb3J0QVhDXCIsXHJcbiAgICAgICgpID0+IGF4Y2hhaW4uZXhwb3J0QVhDKHVzZXIsIHBhc3N3ZCwgc3dhcENoYWluQWRkciwgbmV3IEJOKDEwKSksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLkdldCxcclxuICAgICAgKCkgPT4gZXhwb3J0VHhIYXNoXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldEJhc2VGZWVcIixcclxuICAgICAgKCkgPT4gYXhjaGFpbi5nZXRCYXNlRmVlKCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IFwiMHgzNDYzMGI4YTAwXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZ2V0TWF4UHJpb3JpdHlGZWVQZXJHYXNcIixcclxuICAgICAgKCkgPT4gYXhjaGFpbi5nZXRNYXhQcmlvcml0eUZlZVBlckdhcygpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiBcIjB4MFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImV4cG9ydEtleVwiLFxyXG4gICAgICAoKSA9PiBheGNoYWluLmV4cG9ydEtleSh1c2VyLCBwYXNzd2QsIHdoYWxlQWRkciksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvRXF1YWwsXHJcbiAgICAgICgpID0+ICh7XHJcbiAgICAgICAgcHJpdmF0ZUtleToga2V5LFxyXG4gICAgICAgIHByaXZhdGVLZXlIZXg6IHByaXZhdGVLZXlIZXhcclxuICAgICAgfSlcclxuICAgIF1cclxuICBdXHJcblxyXG4gIGNyZWF0ZVRlc3RzKHRlc3RzX3NwZWMpXHJcbn0pIl19