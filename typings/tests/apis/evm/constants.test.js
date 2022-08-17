"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("src");
const constants_1 = require("../../../src/utils/constants");
describe("EVMConstants", () => {
    describe("Compare min and max gas prices", () => {
        const networks = constants_1.Defaults.network;
        const minNum = 25000000000;
        const maxNum = 1000000000000;
        const networkIDs = [1, 5, 12345];
        networkIDs.forEach((networkID) => {
            test(`NetworkID: ${networkID}`, () => __awaiter(void 0, void 0, void 0, function* () {
                const localNetwork = networks[networkID];
                const minGasPriceBN = localNetwork.AX.minGasPrice;
                const minGasPriceNum = new src_1.BN(minGasPriceBN).toNumber();
                const maxGasPriceBN = localNetwork.AX.maxGasPrice;
                const maxGasPriceNum = new src_1.BN(maxGasPriceBN).toNumber();
                expect(minGasPriceNum).toBeLessThanOrEqual(maxGasPriceNum);
                expect(minGasPriceNum).toEqual(minNum);
                expect(minGasPriceBN.isEven()).toBeTruthy();
                expect(minGasPriceBN.isNeg()).toBeFalsy();
                expect(maxGasPriceNum).toBeGreaterThanOrEqual(minGasPriceNum);
                expect(maxGasPriceNum).toEqual(maxNum);
                expect(maxGasPriceBN.isEven()).toBeTruthy();
                expect(maxGasPriceBN.isNeg()).toBeFalsy();
            }));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2V2bS9jb25zdGFudHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDZCQUF3QjtBQUN4Qiw0REFBMEU7QUFFMUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFTLEVBQUU7SUFDbEMsUUFBUSxDQUFDLGdDQUFnQyxFQUFFLEdBQVMsRUFBRTtRQUNwRCxNQUFNLFFBQVEsR0FBYSxvQkFBUSxDQUFDLE9BQU8sQ0FBQTtRQUMzQyxNQUFNLE1BQU0sR0FBVyxXQUFXLENBQUE7UUFDbEMsTUFBTSxNQUFNLEdBQVcsYUFBYSxDQUFBO1FBQ3BDLE1BQU0sVUFBVSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBaUIsRUFBUSxFQUFFO1lBQzdDLElBQUksQ0FBQyxjQUFjLFNBQVMsRUFBRSxFQUFFLEdBQXdCLEVBQUU7Z0JBQ3hELE1BQU0sWUFBWSxHQUFZLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFFakQsTUFBTSxhQUFhLEdBQU8sWUFBWSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUE7Z0JBQ3JELE1BQU0sY0FBYyxHQUFXLElBQUksUUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO2dCQUUvRCxNQUFNLGFBQWEsR0FBTyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQTtnQkFDckQsTUFBTSxjQUFjLEdBQVcsSUFBSSxRQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7Z0JBRS9ELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDMUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7Z0JBRXpDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDN0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJOIH0gZnJvbSBcInNyY1wiXHJcbmltcG9ydCB7IERlZmF1bHRzLCBOZXR3b3JrcywgTmV0d29yayB9IGZyb20gXCIuLi8uLi8uLi9zcmMvdXRpbHMvY29uc3RhbnRzXCJcclxuXHJcbmRlc2NyaWJlKFwiRVZNQ29uc3RhbnRzXCIsICgpOiB2b2lkID0+IHtcclxuICBkZXNjcmliZShcIkNvbXBhcmUgbWluIGFuZCBtYXggZ2FzIHByaWNlc1wiLCAoKTogdm9pZCA9PiB7XHJcbiAgICBjb25zdCBuZXR3b3JrczogTmV0d29ya3MgPSBEZWZhdWx0cy5uZXR3b3JrXHJcbiAgICBjb25zdCBtaW5OdW06IG51bWJlciA9IDI1MDAwMDAwMDAwXHJcbiAgICBjb25zdCBtYXhOdW06IG51bWJlciA9IDEwMDAwMDAwMDAwMDBcclxuICAgIGNvbnN0IG5ldHdvcmtJRHM6IG51bWJlcltdID0gWzEsIDUsIDEyMzQ1XVxyXG4gICAgbmV0d29ya0lEcy5mb3JFYWNoKChuZXR3b3JrSUQ6IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgICB0ZXN0KGBOZXR3b3JrSUQ6ICR7bmV0d29ya0lEfWAsIGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgICBjb25zdCBsb2NhbE5ldHdvcms6IE5ldHdvcmsgPSBuZXR3b3Jrc1tuZXR3b3JrSURdXHJcblxyXG4gICAgICAgIGNvbnN0IG1pbkdhc1ByaWNlQk46IEJOID0gbG9jYWxOZXR3b3JrLkFYLm1pbkdhc1ByaWNlXHJcbiAgICAgICAgY29uc3QgbWluR2FzUHJpY2VOdW06IG51bWJlciA9IG5ldyBCTihtaW5HYXNQcmljZUJOKS50b051bWJlcigpXHJcblxyXG4gICAgICAgIGNvbnN0IG1heEdhc1ByaWNlQk46IEJOID0gbG9jYWxOZXR3b3JrLkFYLm1heEdhc1ByaWNlXHJcbiAgICAgICAgY29uc3QgbWF4R2FzUHJpY2VOdW06IG51bWJlciA9IG5ldyBCTihtYXhHYXNQcmljZUJOKS50b051bWJlcigpXHJcblxyXG4gICAgICAgIGV4cGVjdChtaW5HYXNQcmljZU51bSkudG9CZUxlc3NUaGFuT3JFcXVhbChtYXhHYXNQcmljZU51bSlcclxuICAgICAgICBleHBlY3QobWluR2FzUHJpY2VOdW0pLnRvRXF1YWwobWluTnVtKVxyXG4gICAgICAgIGV4cGVjdChtaW5HYXNQcmljZUJOLmlzRXZlbigpKS50b0JlVHJ1dGh5KClcclxuICAgICAgICBleHBlY3QobWluR2FzUHJpY2VCTi5pc05lZygpKS50b0JlRmFsc3koKVxyXG5cclxuICAgICAgICBleHBlY3QobWF4R2FzUHJpY2VOdW0pLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwobWluR2FzUHJpY2VOdW0pXHJcbiAgICAgICAgZXhwZWN0KG1heEdhc1ByaWNlTnVtKS50b0VxdWFsKG1heE51bSlcclxuICAgICAgICBleHBlY3QobWF4R2FzUHJpY2VCTi5pc0V2ZW4oKSkudG9CZVRydXRoeSgpXHJcbiAgICAgICAgZXhwZWN0KG1heEdhc1ByaWNlQk4uaXNOZWcoKSkudG9CZUZhbHN5KClcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSlcclxufSlcclxuIl19