"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e2etestlib_1 = require("./e2etestlib");
const bn_js_1 = __importDefault(require("bn.js"));
describe("CChain", () => {
    const axia = (0, e2etestlib_1.getAxia)();
    const cchain = axia.CChain();
    const keystore = axia.NodeKeys();
    let exportTxHash = { value: "" };
    const user = "axiaJsCChainUser";
    const passwd = "axiaJsP@ssw4rd";
    const key = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN";
    const privateKeyHex = "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
    const whaleAddr = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
    const xChainAddr = "X-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p";
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
            () => cchain.importKey(user, passwd, key),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => whaleAddr
        ],
        [
            "exportAXC",
            () => cchain.exportAXC(user, passwd, xChainAddr, new bn_js_1.default(10)),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => exportTxHash
        ],
        [
            "getBaseFee",
            () => cchain.getBaseFee(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "0x34630b8a00"
        ],
        [
            "getMaxPriorityFeePerGas",
            () => cchain.getMaxPriorityFeePerGas(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "0x0"
        ],
        [
            "exportKey",
            () => cchain.exportKey(user, passwd, whaleAddr),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2NoYWluX25vbW9jay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZTJlX3Rlc3RzL2NjaGFpbl9ub21vY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZDQUE0RDtBQUU1RCxrREFBc0I7QUFJdEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFTLEVBQUU7SUFDNUIsTUFBTSxJQUFJLEdBQVMsSUFBQSxvQkFBTyxHQUFFLENBQUE7SUFDNUIsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ3BDLE1BQU0sUUFBUSxHQUFnQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7SUFFN0MsSUFBSSxZQUFZLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFFaEMsTUFBTSxJQUFJLEdBQVcsa0JBQWtCLENBQUE7SUFDdkMsTUFBTSxNQUFNLEdBQVcsZ0JBQWdCLENBQUE7SUFDdkMsTUFBTSxHQUFHLEdBQ1AsOERBQThELENBQUE7SUFDaEUsTUFBTSxhQUFhLEdBQ2pCLG9FQUFvRSxDQUFBO0lBQ3RFLE1BQU0sU0FBUyxHQUFXLDRDQUE0QyxDQUFBO0lBQ3RFLE1BQU0sVUFBVSxHQUFXLGlEQUFpRCxDQUFBO0lBRTVFLGdJQUFnSTtJQUNoSSxNQUFNLFVBQVUsR0FBUTtRQUN0QjtZQUNFLFlBQVk7WUFDWixHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDdkMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxJQUFJO1NBQ1g7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsU0FBUztTQUNoQjtRQUNEO1lBQ0UsV0FBVztZQUNYLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxlQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLEdBQUc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxZQUFZO1NBQ25CO1FBQ0Q7WUFDRSxZQUFZO1lBQ1osR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUN6QixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLGNBQWM7U0FDckI7UUFDRDtZQUNFLHlCQUF5QjtZQUN6QixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUU7WUFDdEMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxLQUFLO1NBQ1o7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDTCxVQUFVLEVBQUUsR0FBRztnQkFDZixhQUFhLEVBQUUsYUFBYTthQUM3QixDQUFDO1NBQ0g7S0FDRixDQUFBO0lBRUQsSUFBQSx3QkFBVyxFQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3pCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0QXhpYSwgY3JlYXRlVGVzdHMsIE1hdGNoZXIgfSBmcm9tIFwiLi9lMmV0ZXN0bGliXCJcbmltcG9ydCB7IEtleXN0b3JlQVBJIH0gZnJvbSBcInNyYy9hcGlzL2tleXN0b3JlL2FwaVwiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCBBeGlhIGZyb20gXCJzcmNcIlxuaW1wb3J0IHsgRVZNQVBJIH0gZnJvbSBcInNyYy9hcGlzL2V2bVwiXG5cbmRlc2NyaWJlKFwiQ0NoYWluXCIsICgpOiB2b2lkID0+IHtcbiAgY29uc3QgYXhpYTogQXhpYSA9IGdldEF4aWEoKVxuICBjb25zdCBjY2hhaW46IEVWTUFQSSA9IGF4aWEuQ0NoYWluKClcbiAgY29uc3Qga2V5c3RvcmU6IEtleXN0b3JlQVBJID0gYXhpYS5Ob2RlS2V5cygpXG5cbiAgbGV0IGV4cG9ydFR4SGFzaCA9IHsgdmFsdWU6IFwiXCIgfVxuXG4gIGNvbnN0IHVzZXI6IHN0cmluZyA9IFwiYXhpYUpzQ0NoYWluVXNlclwiXG4gIGNvbnN0IHBhc3N3ZDogc3RyaW5nID0gXCJheGlhSnNQQHNzdzRyZFwiXG4gIGNvbnN0IGtleTogc3RyaW5nID1cbiAgICBcIlByaXZhdGVLZXktZXdvcWpQN1B4WTR5cjNpTFRwTGlzcmlxdDk0aGR5REZOZ2NoU3hHR3p0VXJUWHROTlwiXG4gIGNvbnN0IHByaXZhdGVLZXlIZXg6IHN0cmluZyA9XG4gICAgXCIweDU2Mjg5ZTk5Yzk0YjY5MTJiZmMxMmFkYzA5M2M5YjUxMTI0ZjBkYzU0YWM3YTc2NmIyYmM1Y2NmNTU4ZDgwMjdcIlxuICBjb25zdCB3aGFsZUFkZHI6IHN0cmluZyA9IFwiMHg4ZGI5N0M3Y0VjRTI0OWMyYjk4YkRDMDIyNkNjNEMyQTU3QkY1MkZDXCJcbiAgY29uc3QgeENoYWluQWRkcjogc3RyaW5nID0gXCJYLWN1c3RvbTE4am1hOHBwdzNuaHg1cjRhcDhjbGF6ejBkcHM3cnY1dTl4ZGU3cFwiXG5cbiAgLy8gdGVzdF9uYW1lICAgICAgICByZXNwb25zZV9wcm9taXNlICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BfZm4gICAgICAgICAgbWF0Y2hlciAgICAgICAgICAgZXhwZWN0ZWRfdmFsdWUvb2J0YWluZWRfdmFsdWVcbiAgY29uc3QgdGVzdHNfc3BlYzogYW55ID0gW1xuICAgIFtcbiAgICAgIFwiY3JlYXRlVXNlclwiLFxuICAgICAgKCkgPT4ga2V5c3RvcmUuY3JlYXRlVXNlcih1c2VyLCBwYXNzd2QpLFxuICAgICAgKHgpID0+IHgsXG4gICAgICBNYXRjaGVyLnRvQmUsXG4gICAgICAoKSA9PiB0cnVlXG4gICAgXSxcbiAgICBbXG4gICAgICBcImltcG9ydEtleVwiLFxuICAgICAgKCkgPT4gY2NoYWluLmltcG9ydEtleSh1c2VyLCBwYXNzd2QsIGtleSksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9CZSxcbiAgICAgICgpID0+IHdoYWxlQWRkclxuICAgIF0sXG4gICAgW1xuICAgICAgXCJleHBvcnRBWENcIixcbiAgICAgICgpID0+IGNjaGFpbi5leHBvcnRBWEModXNlciwgcGFzc3dkLCB4Q2hhaW5BZGRyLCBuZXcgQk4oMTApKSxcbiAgICAgICh4KSA9PiB4LFxuICAgICAgTWF0Y2hlci5HZXQsXG4gICAgICAoKSA9PiBleHBvcnRUeEhhc2hcbiAgICBdLFxuICAgIFtcbiAgICAgIFwiZ2V0QmFzZUZlZVwiLFxuICAgICAgKCkgPT4gY2NoYWluLmdldEJhc2VGZWUoKSxcbiAgICAgICh4KSA9PiB4LFxuICAgICAgTWF0Y2hlci50b0JlLFxuICAgICAgKCkgPT4gXCIweDM0NjMwYjhhMDBcIlxuICAgIF0sXG4gICAgW1xuICAgICAgXCJnZXRNYXhQcmlvcml0eUZlZVBlckdhc1wiLFxuICAgICAgKCkgPT4gY2NoYWluLmdldE1heFByaW9yaXR5RmVlUGVyR2FzKCksXG4gICAgICAoeCkgPT4geCxcbiAgICAgIE1hdGNoZXIudG9CZSxcbiAgICAgICgpID0+IFwiMHgwXCJcbiAgICBdLFxuICAgIFtcbiAgICAgIFwiZXhwb3J0S2V5XCIsXG4gICAgICAoKSA9PiBjY2hhaW4uZXhwb3J0S2V5KHVzZXIsIHBhc3N3ZCwgd2hhbGVBZGRyKSxcbiAgICAgICh4KSA9PiB4LFxuICAgICAgTWF0Y2hlci50b0VxdWFsLFxuICAgICAgKCkgPT4gKHtcbiAgICAgICAgcHJpdmF0ZUtleToga2V5LFxuICAgICAgICBwcml2YXRlS2V5SGV4OiBwcml2YXRlS2V5SGV4XG4gICAgICB9KVxuICAgIF1cbiAgXVxuXG4gIGNyZWF0ZVRlc3RzKHRlc3RzX3NwZWMpXG59KSJdfQ==