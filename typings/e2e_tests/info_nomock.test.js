"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e2etestlib_1 = require("./e2etestlib");
const bn_js_1 = __importDefault(require("bn.js"));
describe("Info", () => {
    const axia = (0, e2etestlib_1.getAxia)();
    const info = axia.Info();
    // test_name          response_promise               resp_fn                 matcher           expected_value/obtained_value
    const tests_spec = [
        [
            "getBlockchainID",
            () => info.getBlockchainID("Swap"),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "qzfF3A11KzpcHkkqznEyQgupQrCNS6WV6fTUTwZpEKqhj1QE7"
        ],
        [
            "getNetworkID",
            () => info.getNetworkID(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "1337"
        ],
        [
            "getNetworkName",
            () => info.getNetworkName(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "network-1337"
        ],
        [
            "getNodeId",
            () => info.getNodeID(),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg"
        ],
        [
            "getNodeVersion",
            () => info.getNodeVersion(),
            (x) => x,
            e2etestlib_1.Matcher.toMatch,
            () => /^axia\/\d*\.\d*\.\d*$/
        ],
        [
            "isBootstrapped",
            () => info.isBootstrapped("Swap"),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => true
        ],
        ["peers", () => info.peers(), (x) => x.length, e2etestlib_1.Matcher.toBe, () => 4],
        [
            "getTxFee1",
            () => info.getTxFee(),
            (x) => x.txFee,
            e2etestlib_1.Matcher.toEqual,
            () => new bn_js_1.default(1000000)
        ],
        [
            "getTxFee2",
            () => info.getTxFee(),
            (x) => x.creationTxFee,
            e2etestlib_1.Matcher.toEqual,
            () => new bn_js_1.default(1000000)
        ]
    ];
    (0, e2etestlib_1.createTests)(tests_spec);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mb19ub21vY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2UyZV90ZXN0cy9pbmZvX25vbW9jay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBQTREO0FBRTVELGtEQUFzQjtBQUd0QixRQUFRLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUMxQixNQUFNLElBQUksR0FBUyxJQUFBLG9CQUFPLEdBQUUsQ0FBQTtJQUM1QixNQUFNLElBQUksR0FBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7SUFFakMsNEhBQTRIO0lBQzVILE1BQU0sVUFBVSxHQUFRO1FBQ3RCO1lBQ0UsaUJBQWlCO1lBQ2pCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsbURBQW1EO1NBQzFEO1FBQ0Q7WUFDRSxjQUFjO1lBQ2QsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN6QixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLE1BQU07U0FDYjtRQUNEO1lBQ0UsZ0JBQWdCO1lBQ2hCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxjQUFjO1NBQ3JCO1FBQ0Q7WUFDRSxXQUFXO1lBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLDBDQUEwQztTQUNqRDtRQUNEO1lBQ0UsZ0JBQWdCO1lBQ2hCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDM0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyx1QkFBdUI7U0FDOUI7UUFDRDtZQUNFLGdCQUFnQjtZQUNoQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztZQUNqQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDWDtRQUNELENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxvQkFBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckU7WUFDRSxXQUFXO1lBQ1gsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNyQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUs7WUFDZCxvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDdEI7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3JCLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYTtZQUN0QixvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyxJQUFJLGVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDdEI7S0FDRixDQUFBO0lBRUQsSUFBQSx3QkFBVyxFQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3pCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0QXhpYSwgY3JlYXRlVGVzdHMsIE1hdGNoZXIgfSBmcm9tIFwiLi9lMmV0ZXN0bGliXCJcclxuaW1wb3J0IHsgSW5mb0FQSSB9IGZyb20gXCJzcmMvYXBpcy9pbmZvL2FwaVwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5pbXBvcnQgQXhpYSBmcm9tIFwic3JjXCJcclxuXHJcbmRlc2NyaWJlKFwiSW5mb1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgY29uc3QgYXhpYTogQXhpYSA9IGdldEF4aWEoKVxyXG4gIGNvbnN0IGluZm86IEluZm9BUEkgPSBheGlhLkluZm8oKVxyXG5cclxuICAvLyB0ZXN0X25hbWUgICAgICAgICAgcmVzcG9uc2VfcHJvbWlzZSAgICAgICAgICAgICAgIHJlc3BfZm4gICAgICAgICAgICAgICAgIG1hdGNoZXIgICAgICAgICAgIGV4cGVjdGVkX3ZhbHVlL29idGFpbmVkX3ZhbHVlXHJcbiAgY29uc3QgdGVzdHNfc3BlYzogYW55ID0gW1xyXG4gICAgW1xyXG4gICAgICBcImdldEJsb2NrY2hhaW5JRFwiLFxyXG4gICAgICAoKSA9PiBpbmZvLmdldEJsb2NrY2hhaW5JRChcIlN3YXBcIiksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IFwicXpmRjNBMTFLenBjSGtrcXpuRXlRZ3VwUXJDTlM2V1Y2ZlRVVHdacEVLcWhqMVFFN1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldE5ldHdvcmtJRFwiLFxyXG4gICAgICAoKSA9PiBpbmZvLmdldE5ldHdvcmtJRCgpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiBcIjEzMzdcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJnZXROZXR3b3JrTmFtZVwiLFxyXG4gICAgICAoKSA9PiBpbmZvLmdldE5ldHdvcmtOYW1lKCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IFwibmV0d29yay0xMzM3XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZ2V0Tm9kZUlkXCIsXHJcbiAgICAgICgpID0+IGluZm8uZ2V0Tm9kZUlEKCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IFwiTm9kZUlELTdYaHcybUR4dURTNDRqNDJUQ0I2VTU1Nzllc2JTdDNMZ1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldE5vZGVWZXJzaW9uXCIsXHJcbiAgICAgICgpID0+IGluZm8uZ2V0Tm9kZVZlcnNpb24oKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9NYXRjaCxcclxuICAgICAgKCkgPT4gL15heGlhXFwvXFxkKlxcLlxcZCpcXC5cXGQqJC9cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiaXNCb290c3RyYXBwZWRcIixcclxuICAgICAgKCkgPT4gaW5mby5pc0Jvb3RzdHJhcHBlZChcIlN3YXBcIiksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IHRydWVcclxuICAgIF0sXHJcbiAgICBbXCJwZWVyc1wiLCAoKSA9PiBpbmZvLnBlZXJzKCksICh4KSA9PiB4Lmxlbmd0aCwgTWF0Y2hlci50b0JlLCAoKSA9PiA0XSxcclxuICAgIFtcclxuICAgICAgXCJnZXRUeEZlZTFcIixcclxuICAgICAgKCkgPT4gaW5mby5nZXRUeEZlZSgpLFxyXG4gICAgICAoeCkgPT4geC50eEZlZSxcclxuICAgICAgTWF0Y2hlci50b0VxdWFsLFxyXG4gICAgICAoKSA9PiBuZXcgQk4oMTAwMDAwMClcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZ2V0VHhGZWUyXCIsXHJcbiAgICAgICgpID0+IGluZm8uZ2V0VHhGZWUoKSxcclxuICAgICAgKHgpID0+IHguY3JlYXRpb25UeEZlZSxcclxuICAgICAgTWF0Y2hlci50b0VxdWFsLFxyXG4gICAgICAoKSA9PiBuZXcgQk4oMTAwMDAwMClcclxuICAgIF1cclxuICBdXHJcblxyXG4gIGNyZWF0ZVRlc3RzKHRlc3RzX3NwZWMpXHJcbn0pIl19