"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const e2etestlib_1 = require("./e2etestlib");
const api_1 = require("src/apis/keystore/api");
const bn_js_1 = __importDefault(require("bn.js"));
describe("SwapChain", () => {
    let tx = { value: "" };
    let asset = { value: "" };
    let addrB = { value: "" };
    let addrC = { value: "" };
    const axia = (0, e2etestlib_1.getAxia)();
    const swapchain = axia.SwapChain();
    const keystore = new api_1.KeystoreAPI(axia);
    const user = "axiaJsSwapChainUser";
    const passwd = "axiaJsP1ssw4rd";
    const badUser = "asdfasdfsa";
    const badPass = "pass";
    const memo = "hello world";
    const whaleAddr = "Swap-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p";
    const key = "PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN";
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
            "createaddrB",
            () => swapchain.createAddress(user, passwd),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => addrB
        ],
        [
            "createaddrB",
            () => swapchain.createAddress(user, passwd),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => addrC
        ],
        [
            "incorrectUser",
            () => swapchain.send(badUser, passwd, "AXC", 10, addrB.value, [addrC.value], addrB.value, memo),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => `problem retrieving user "${badUser}": incorrect password for user "${badUser}"`
        ],
        [
            "incorrectPass",
            () => swapchain.send(user, badPass, "AXC", 10, addrB.value, [addrC.value], addrB.value, memo),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => `problem retrieving user "${user}": incorrect password for user "${user}"`
        ],
        [
            "getBalance",
            () => swapchain.getBalance(whaleAddr, "AXC"),
            (x) => x.balance,
            e2etestlib_1.Matcher.toBe,
            () => "300000000000000000"
        ],
        [
            "getBalance2",
            () => swapchain.getBalance(whaleAddr, "AXC"),
            (x) => x.utxoIDs[0].txID,
            e2etestlib_1.Matcher.toBe,
            () => "BUuypiq2wyuLMvyhzFXcPyxPMCgSp7eeDohhQRqTChoBjKziC"
        ],
        [
            "importKey",
            () => swapchain.importKey(user, passwd, key),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => whaleAddr
        ],
        [
            "send",
            () => swapchain.send(user, passwd, "AXC", 10, addrB.value, [whaleAddr], whaleAddr, memo),
            (x) => x.txID,
            e2etestlib_1.Matcher.Get,
            () => tx
        ],
        [
            "sendMultiple",
            () => swapchain.sendMultiple(user, passwd, [
                { assetID: "AXC", amount: 10, to: addrB.value },
                { assetID: "AXC", amount: 20, to: addrC.value }
            ], [whaleAddr], whaleAddr, memo),
            (x) => x.txID,
            e2etestlib_1.Matcher.Get,
            () => tx
        ],
        [
            "listAddrs",
            () => swapchain.listAddresses(user, passwd),
            (x) => x.sort(),
            e2etestlib_1.Matcher.toEqual,
            () => [whaleAddr, addrB.value, addrC.value].sort()
        ],
        [
            "exportKey",
            () => swapchain.exportKey(user, passwd, addrB.value),
            (x) => x,
            e2etestlib_1.Matcher.toMatch,
            () => /PrivateKey-\w*/
        ],
        [
            "export",
            () => swapchain.export(user, passwd, "AX" + addrB.value.substring(1), new bn_js_1.default(10), "AXC"),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => "couldn't unmarshal an argument"
        ],
        [
            "import",
            () => swapchain.import(user, passwd, addrB.value, "Core"),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => "problem issuing transaction: no import inputs"
        ],
        [
            "createFixed",
            () => swapchain.createFixedCapAsset(user, passwd, "Some Coin", "SCC", 0, [
                { address: whaleAddr, amount: "10000" }
            ]),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => asset
        ],
        [
            "createVar",
            () => swapchain.createVariableCapAsset(user, passwd, "Some Coin", "SCC", 0, [
                { minters: [whaleAddr], threshold: 1 }
            ]),
            (x) => x,
            e2etestlib_1.Matcher.Get,
            () => asset
        ],
        [
            "mint",
            () => swapchain.mint(user, passwd, 1500, asset.value, addrB.value, [whaleAddr]),
            (x) => x,
            e2etestlib_1.Matcher.toThrow,
            () => "couldn't unmarshal an argument"
        ],
        [
            "getTx",
            () => swapchain.getTx(tx.value),
            (x) => x,
            e2etestlib_1.Matcher.toMatch,
            () => /\w+/
        ],
        [
            "getTxStatus",
            () => swapchain.getTxStatus(tx.value),
            (x) => x,
            e2etestlib_1.Matcher.toBe,
            () => "Processing"
        ],
        [
            "getAssetDesc",
            () => swapchain.getAssetDescription(asset.value),
            (x) => [x.name, x.symbol],
            e2etestlib_1.Matcher.toEqual,
            () => ["Some Coin", "SCC"]
        ]
    ];
    (0, e2etestlib_1.createTests)(tests_spec);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhcGNoYWluX25vbW9jay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZTJlX3Rlc3RzL3N3YXBjaGFpbl9ub21vY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZDQUE0RDtBQUM1RCwrQ0FBbUQ7QUFDbkQsa0RBQXNCO0FBRXRCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBUyxFQUFFO0lBQy9CLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3RCLElBQUksS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3pCLElBQUksS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3pCLElBQUksS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBRXpCLE1BQU0sSUFBSSxHQUFHLElBQUEsb0JBQU8sR0FBRSxDQUFBO0lBQ3RCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUNsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGlCQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFdEMsTUFBTSxJQUFJLEdBQVcscUJBQXFCLENBQUE7SUFDMUMsTUFBTSxNQUFNLEdBQVcsZ0JBQWdCLENBQUE7SUFDdkMsTUFBTSxPQUFPLEdBQVcsWUFBWSxDQUFBO0lBQ3BDLE1BQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBVyxhQUFhLENBQUE7SUFDbEMsTUFBTSxTQUFTLEdBQVcsb0RBQW9ELENBQUE7SUFDOUUsTUFBTSxHQUFHLEdBQ1AsOERBQThELENBQUE7SUFFaEUsZ0lBQWdJO0lBQ2hJLE1BQU0sVUFBVSxHQUFRO1FBQ3RCO1lBQ0UsWUFBWTtZQUNaLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUN2QyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLElBQUk7U0FDWDtRQUNEO1lBQ0UsYUFBYTtZQUNiLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUMzQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsR0FBRztZQUNYLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDWjtRQUNEO1lBQ0UsYUFBYTtZQUNiLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUMzQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsR0FBRztZQUNYLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDWjtRQUNEO1lBQ0UsZUFBZTtZQUNmLEdBQUcsRUFBRSxDQUNILFNBQVMsQ0FBQyxJQUFJLENBQ1osT0FBTyxFQUNQLE1BQU0sRUFDTixLQUFLLEVBQ0wsRUFBRSxFQUNGLEtBQUssQ0FBQyxLQUFLLEVBQ1gsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ2IsS0FBSyxDQUFDLEtBQUssRUFDWCxJQUFJLENBQ0w7WUFDSCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsT0FBTztZQUNmLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixPQUFPLG1DQUFtQyxPQUFPLEdBQUc7U0FDdkY7UUFDRDtZQUNFLGVBQWU7WUFDZixHQUFHLEVBQUUsQ0FDSCxTQUFTLENBQUMsSUFBSSxDQUNaLElBQUksRUFDSixPQUFPLEVBQ1AsS0FBSyxFQUNMLEVBQUUsRUFDRixLQUFLLENBQUMsS0FBSyxFQUNYLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUNiLEtBQUssQ0FBQyxLQUFLLEVBQ1gsSUFBSSxDQUNMO1lBQ0gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUixvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsSUFBSSxtQ0FBbUMsSUFBSSxHQUFHO1NBQ2pGO1FBQ0Q7WUFDRSxZQUFZO1lBQ1osR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUNoQixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxvQkFBb0I7U0FDM0I7UUFDRDtZQUNFLGFBQWE7WUFDYixHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7WUFDNUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUN4QixvQkFBTyxDQUFDLElBQUk7WUFDWixHQUFHLEVBQUUsQ0FBQyxtREFBbUQ7U0FDMUQ7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDO1lBQzVDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxJQUFJO1lBQ1osR0FBRyxFQUFFLENBQUMsU0FBUztTQUNoQjtRQUNEO1lBQ0UsTUFBTTtZQUNOLEdBQUcsRUFBRSxDQUNILFNBQVMsQ0FBQyxJQUFJLENBQ1osSUFBSSxFQUNKLE1BQU0sRUFDTixLQUFLLEVBQ0wsRUFBRSxFQUNGLEtBQUssQ0FBQyxLQUFLLEVBQ1gsQ0FBQyxTQUFTLENBQUMsRUFDWCxTQUFTLEVBQ1QsSUFBSSxDQUNMO1lBQ0gsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2Isb0JBQU8sQ0FBQyxHQUFHO1lBQ1gsR0FBRyxFQUFFLENBQUMsRUFBRTtTQUNUO1FBQ0Q7WUFDRSxjQUFjO1lBQ2QsR0FBRyxFQUFFLENBQ0gsU0FBUyxDQUFDLFlBQVksQ0FDcEIsSUFBSSxFQUNKLE1BQU0sRUFDTjtnQkFDRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDL0MsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7YUFDaEQsRUFDRCxDQUFDLFNBQVMsQ0FBQyxFQUNYLFNBQVMsRUFDVCxJQUFJLENBQ0w7WUFDSCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDYixvQkFBTyxDQUFDLEdBQUc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxFQUFFO1NBQ1Q7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDM0MsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDZixvQkFBTyxDQUFDLE9BQU87WUFDZixHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUU7U0FDbkQ7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNwRCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsT0FBTztZQUNmLEdBQUcsRUFBRSxDQUFDLGdCQUFnQjtTQUN2QjtRQUNEO1lBQ0UsUUFBUTtZQUNSLEdBQUcsRUFBRSxDQUNILFNBQVMsQ0FBQyxNQUFNLENBQ2QsSUFBSSxFQUNKLE1BQU0sRUFDTixJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQy9CLElBQUksZUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNWLEtBQUssQ0FDTjtZQUNILENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsZ0NBQWdDO1NBQ3ZDO1FBQ0Q7WUFDRSxRQUFRO1lBQ1IsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1lBQ3pELENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsK0NBQStDO1NBQ3REO1FBQ0Q7WUFDRSxhQUFhO1lBQ2IsR0FBRyxFQUFFLENBQ0gsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7Z0JBQ2pFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO2FBQ3hDLENBQUM7WUFDSixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsR0FBRztZQUNYLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDWjtRQUNEO1lBQ0UsV0FBVztZQUNYLEdBQUcsRUFBRSxDQUNILFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFO2dCQUNwRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUU7YUFDdkMsQ0FBQztZQUNKLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1Isb0JBQU8sQ0FBQyxHQUFHO1lBQ1gsR0FBRyxFQUFFLENBQUMsS0FBSztTQUNaO1FBQ0Q7WUFDRSxNQUFNO1lBQ04sR0FBRyxFQUFFLENBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsT0FBTztZQUNmLEdBQUcsRUFBRSxDQUFDLGdDQUFnQztTQUN2QztRQUNEO1lBQ0UsT0FBTztZQUNQLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUMvQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsT0FBTztZQUNmLEdBQUcsRUFBRSxDQUFDLEtBQUs7U0FDWjtRQUNEO1lBQ0UsYUFBYTtZQUNiLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNyQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNSLG9CQUFPLENBQUMsSUFBSTtZQUNaLEdBQUcsRUFBRSxDQUFDLFlBQVk7U0FDbkI7UUFDRDtZQUNFLGNBQWM7WUFDZCxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNoRCxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDekIsb0JBQU8sQ0FBQyxPQUFPO1lBQ2YsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDO1NBQzNCO0tBQ0YsQ0FBQTtJQUVELElBQUEsd0JBQVcsRUFBQyxVQUFVLENBQUMsQ0FBQTtBQUN6QixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEF4aWEsIGNyZWF0ZVRlc3RzLCBNYXRjaGVyIH0gZnJvbSBcIi4vZTJldGVzdGxpYlwiXHJcbmltcG9ydCB7IEtleXN0b3JlQVBJIH0gZnJvbSBcInNyYy9hcGlzL2tleXN0b3JlL2FwaVwiXHJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxyXG5cclxuZGVzY3JpYmUoXCJTd2FwQ2hhaW5cIiwgKCk6IHZvaWQgPT4ge1xyXG4gIGxldCB0eCA9IHsgdmFsdWU6IFwiXCIgfVxyXG4gIGxldCBhc3NldCA9IHsgdmFsdWU6IFwiXCIgfVxyXG4gIGxldCBhZGRyQiA9IHsgdmFsdWU6IFwiXCIgfVxyXG4gIGxldCBhZGRyQyA9IHsgdmFsdWU6IFwiXCIgfVxyXG5cclxuICBjb25zdCBheGlhID0gZ2V0QXhpYSgpXHJcbiAgY29uc3Qgc3dhcGNoYWluID0gYXhpYS5Td2FwQ2hhaW4oKVxyXG4gIGNvbnN0IGtleXN0b3JlID0gbmV3IEtleXN0b3JlQVBJKGF4aWEpXHJcblxyXG4gIGNvbnN0IHVzZXI6IHN0cmluZyA9IFwiYXhpYUpzU3dhcENoYWluVXNlclwiXHJcbiAgY29uc3QgcGFzc3dkOiBzdHJpbmcgPSBcImF4aWFKc1Axc3N3NHJkXCJcclxuICBjb25zdCBiYWRVc2VyOiBzdHJpbmcgPSBcImFzZGZhc2Rmc2FcIlxyXG4gIGNvbnN0IGJhZFBhc3M6IHN0cmluZyA9IFwicGFzc1wiXHJcbiAgY29uc3QgbWVtbzogc3RyaW5nID0gXCJoZWxsbyB3b3JsZFwiXHJcbiAgY29uc3Qgd2hhbGVBZGRyOiBzdHJpbmcgPSBcIlN3YXAtY3VzdG9tMThqbWE4cHB3M25oeDVyNGFwOGNsYXp6MGRwczdydjV1OXhkZTdwXCJcclxuICBjb25zdCBrZXk6IHN0cmluZyA9XHJcbiAgICBcIlByaXZhdGVLZXktZXdvcWpQN1B4WTR5cjNpTFRwTGlzcmlxdDk0aGR5REZOZ2NoU3hHR3p0VXJUWHROTlwiXHJcblxyXG4gIC8vIHRlc3RfbmFtZSAgICAgICAgcmVzcG9uc2VfcHJvbWlzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwX2ZuICAgICAgICAgIG1hdGNoZXIgICAgICAgICAgIGV4cGVjdGVkX3ZhbHVlL29idGFpbmVkX3ZhbHVlXHJcbiAgY29uc3QgdGVzdHNfc3BlYzogYW55ID0gW1xyXG4gICAgW1xyXG4gICAgICBcImNyZWF0ZVVzZXJcIixcclxuICAgICAgKCkgPT4ga2V5c3RvcmUuY3JlYXRlVXNlcih1c2VyLCBwYXNzd2QpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiB0cnVlXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImNyZWF0ZWFkZHJCXCIsXHJcbiAgICAgICgpID0+IHN3YXBjaGFpbi5jcmVhdGVBZGRyZXNzKHVzZXIsIHBhc3N3ZCksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLkdldCxcclxuICAgICAgKCkgPT4gYWRkckJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiY3JlYXRlYWRkckJcIixcclxuICAgICAgKCkgPT4gc3dhcGNoYWluLmNyZWF0ZUFkZHJlc3ModXNlciwgcGFzc3dkKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIuR2V0LFxyXG4gICAgICAoKSA9PiBhZGRyQ1xyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJpbmNvcnJlY3RVc2VyXCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLnNlbmQoXHJcbiAgICAgICAgICBiYWRVc2VyLFxyXG4gICAgICAgICAgcGFzc3dkLFxyXG4gICAgICAgICAgXCJBWENcIixcclxuICAgICAgICAgIDEwLFxyXG4gICAgICAgICAgYWRkckIudmFsdWUsXHJcbiAgICAgICAgICBbYWRkckMudmFsdWVdLFxyXG4gICAgICAgICAgYWRkckIudmFsdWUsXHJcbiAgICAgICAgICBtZW1vXHJcbiAgICAgICAgKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9UaHJvdyxcclxuICAgICAgKCkgPT4gYHByb2JsZW0gcmV0cmlldmluZyB1c2VyIFwiJHtiYWRVc2VyfVwiOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCIke2JhZFVzZXJ9XCJgXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImluY29ycmVjdFBhc3NcIixcclxuICAgICAgKCkgPT5cclxuICAgICAgICBzd2FwY2hhaW4uc2VuZChcclxuICAgICAgICAgIHVzZXIsXHJcbiAgICAgICAgICBiYWRQYXNzLFxyXG4gICAgICAgICAgXCJBWENcIixcclxuICAgICAgICAgIDEwLFxyXG4gICAgICAgICAgYWRkckIudmFsdWUsXHJcbiAgICAgICAgICBbYWRkckMudmFsdWVdLFxyXG4gICAgICAgICAgYWRkckIudmFsdWUsXHJcbiAgICAgICAgICBtZW1vXHJcbiAgICAgICAgKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9UaHJvdyxcclxuICAgICAgKCkgPT4gYHByb2JsZW0gcmV0cmlldmluZyB1c2VyIFwiJHt1c2VyfVwiOiBpbmNvcnJlY3QgcGFzc3dvcmQgZm9yIHVzZXIgXCIke3VzZXJ9XCJgXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldEJhbGFuY2VcIixcclxuICAgICAgKCkgPT4gc3dhcGNoYWluLmdldEJhbGFuY2Uod2hhbGVBZGRyLCBcIkFYQ1wiKSxcclxuICAgICAgKHgpID0+IHguYmFsYW5jZSxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiBcIjMwMDAwMDAwMDAwMDAwMDAwMFwiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImdldEJhbGFuY2UyXCIsXHJcbiAgICAgICgpID0+IHN3YXBjaGFpbi5nZXRCYWxhbmNlKHdoYWxlQWRkciwgXCJBWENcIiksXHJcbiAgICAgICh4KSA9PiB4LnV0eG9JRHNbMF0udHhJRCxcclxuICAgICAgTWF0Y2hlci50b0JlLFxyXG4gICAgICAoKSA9PiBcIkJVdXlwaXEyd3l1TE12eWh6RlhjUHl4UE1DZ1NwN2VlRG9oaFFScVRDaG9Cakt6aUNcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJpbXBvcnRLZXlcIixcclxuICAgICAgKCkgPT4gc3dhcGNoYWluLmltcG9ydEtleSh1c2VyLCBwYXNzd2QsIGtleSksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvQmUsXHJcbiAgICAgICgpID0+IHdoYWxlQWRkclxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJzZW5kXCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLnNlbmQoXHJcbiAgICAgICAgICB1c2VyLFxyXG4gICAgICAgICAgcGFzc3dkLFxyXG4gICAgICAgICAgXCJBWENcIixcclxuICAgICAgICAgIDEwLFxyXG4gICAgICAgICAgYWRkckIudmFsdWUsXHJcbiAgICAgICAgICBbd2hhbGVBZGRyXSxcclxuICAgICAgICAgIHdoYWxlQWRkcixcclxuICAgICAgICAgIG1lbW9cclxuICAgICAgICApLFxyXG4gICAgICAoeCkgPT4geC50eElELFxyXG4gICAgICBNYXRjaGVyLkdldCxcclxuICAgICAgKCkgPT4gdHhcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwic2VuZE11bHRpcGxlXCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLnNlbmRNdWx0aXBsZShcclxuICAgICAgICAgIHVzZXIsXHJcbiAgICAgICAgICBwYXNzd2QsXHJcbiAgICAgICAgICBbXHJcbiAgICAgICAgICAgIHsgYXNzZXRJRDogXCJBWENcIiwgYW1vdW50OiAxMCwgdG86IGFkZHJCLnZhbHVlIH0sXHJcbiAgICAgICAgICAgIHsgYXNzZXRJRDogXCJBWENcIiwgYW1vdW50OiAyMCwgdG86IGFkZHJDLnZhbHVlIH1cclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBbd2hhbGVBZGRyXSxcclxuICAgICAgICAgIHdoYWxlQWRkcixcclxuICAgICAgICAgIG1lbW9cclxuICAgICAgICApLFxyXG4gICAgICAoeCkgPT4geC50eElELFxyXG4gICAgICBNYXRjaGVyLkdldCxcclxuICAgICAgKCkgPT4gdHhcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwibGlzdEFkZHJzXCIsXHJcbiAgICAgICgpID0+IHN3YXBjaGFpbi5saXN0QWRkcmVzc2VzKHVzZXIsIHBhc3N3ZCksXHJcbiAgICAgICh4KSA9PiB4LnNvcnQoKSxcclxuICAgICAgTWF0Y2hlci50b0VxdWFsLFxyXG4gICAgICAoKSA9PiBbd2hhbGVBZGRyLCBhZGRyQi52YWx1ZSwgYWRkckMudmFsdWVdLnNvcnQoKVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJleHBvcnRLZXlcIixcclxuICAgICAgKCkgPT4gc3dhcGNoYWluLmV4cG9ydEtleSh1c2VyLCBwYXNzd2QsIGFkZHJCLnZhbHVlKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9NYXRjaCxcclxuICAgICAgKCkgPT4gL1ByaXZhdGVLZXktXFx3Ki9cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZXhwb3J0XCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLmV4cG9ydChcclxuICAgICAgICAgIHVzZXIsXHJcbiAgICAgICAgICBwYXNzd2QsXHJcbiAgICAgICAgICBcIkFYXCIgKyBhZGRyQi52YWx1ZS5zdWJzdHJpbmcoMSksXHJcbiAgICAgICAgICBuZXcgQk4oMTApLFxyXG4gICAgICAgICAgXCJBWENcIlxyXG4gICAgICAgICksXHJcbiAgICAgICh4KSA9PiB4LFxyXG4gICAgICBNYXRjaGVyLnRvVGhyb3csXHJcbiAgICAgICgpID0+IFwiY291bGRuJ3QgdW5tYXJzaGFsIGFuIGFyZ3VtZW50XCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiaW1wb3J0XCIsXHJcbiAgICAgICgpID0+IHN3YXBjaGFpbi5pbXBvcnQodXNlciwgcGFzc3dkLCBhZGRyQi52YWx1ZSwgXCJDb3JlXCIpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b1Rocm93LFxyXG4gICAgICAoKSA9PiBcInByb2JsZW0gaXNzdWluZyB0cmFuc2FjdGlvbjogbm8gaW1wb3J0IGlucHV0c1wiXHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImNyZWF0ZUZpeGVkXCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLmNyZWF0ZUZpeGVkQ2FwQXNzZXQodXNlciwgcGFzc3dkLCBcIlNvbWUgQ29pblwiLCBcIlNDQ1wiLCAwLCBbXHJcbiAgICAgICAgICB7IGFkZHJlc3M6IHdoYWxlQWRkciwgYW1vdW50OiBcIjEwMDAwXCIgfVxyXG4gICAgICAgIF0pLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci5HZXQsXHJcbiAgICAgICgpID0+IGFzc2V0XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICBcImNyZWF0ZVZhclwiLFxyXG4gICAgICAoKSA9PlxyXG4gICAgICAgIHN3YXBjaGFpbi5jcmVhdGVWYXJpYWJsZUNhcEFzc2V0KHVzZXIsIHBhc3N3ZCwgXCJTb21lIENvaW5cIiwgXCJTQ0NcIiwgMCwgW1xyXG4gICAgICAgICAgeyBtaW50ZXJzOiBbd2hhbGVBZGRyXSwgdGhyZXNob2xkOiAxIH1cclxuICAgICAgICBdKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIuR2V0LFxyXG4gICAgICAoKSA9PiBhc3NldFxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJtaW50XCIsXHJcbiAgICAgICgpID0+XHJcbiAgICAgICAgc3dhcGNoYWluLm1pbnQodXNlciwgcGFzc3dkLCAxNTAwLCBhc3NldC52YWx1ZSwgYWRkckIudmFsdWUsIFt3aGFsZUFkZHJdKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9UaHJvdyxcclxuICAgICAgKCkgPT4gXCJjb3VsZG4ndCB1bm1hcnNoYWwgYW4gYXJndW1lbnRcIlxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgXCJnZXRUeFwiLFxyXG4gICAgICAoKSA9PiBzd2FwY2hhaW4uZ2V0VHgodHgudmFsdWUpLFxyXG4gICAgICAoeCkgPT4geCxcclxuICAgICAgTWF0Y2hlci50b01hdGNoLFxyXG4gICAgICAoKSA9PiAvXFx3Ky9cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZ2V0VHhTdGF0dXNcIixcclxuICAgICAgKCkgPT4gc3dhcGNoYWluLmdldFR4U3RhdHVzKHR4LnZhbHVlKSxcclxuICAgICAgKHgpID0+IHgsXHJcbiAgICAgIE1hdGNoZXIudG9CZSxcclxuICAgICAgKCkgPT4gXCJQcm9jZXNzaW5nXCJcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwiZ2V0QXNzZXREZXNjXCIsXHJcbiAgICAgICgpID0+IHN3YXBjaGFpbi5nZXRBc3NldERlc2NyaXB0aW9uKGFzc2V0LnZhbHVlKSxcclxuICAgICAgKHgpID0+IFt4Lm5hbWUsIHguc3ltYm9sXSxcclxuICAgICAgTWF0Y2hlci50b0VxdWFsLFxyXG4gICAgICAoKSA9PiBbXCJTb21lIENvaW5cIiwgXCJTQ0NcIl1cclxuICAgIF1cclxuICBdXHJcblxyXG4gIGNyZWF0ZVRlc3RzKHRlc3RzX3NwZWMpXHJcbn0pIl19