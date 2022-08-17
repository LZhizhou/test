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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0cy9hcGlzL2V2bS9jb25zdGFudHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDZCQUF3QjtBQUN4Qiw0REFBMEU7QUFFMUUsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFTLEVBQUU7SUFDbEMsUUFBUSxDQUFDLGdDQUFnQyxFQUFFLEdBQVMsRUFBRTtRQUNwRCxNQUFNLFFBQVEsR0FBYSxvQkFBUSxDQUFDLE9BQU8sQ0FBQTtRQUMzQyxNQUFNLE1BQU0sR0FBVyxXQUFXLENBQUE7UUFDbEMsTUFBTSxNQUFNLEdBQVcsYUFBYSxDQUFBO1FBQ3BDLE1BQU0sVUFBVSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBaUIsRUFBUSxFQUFFO1lBQzdDLElBQUksQ0FBQyxjQUFjLFNBQVMsRUFBRSxFQUFFLEdBQXdCLEVBQUU7Z0JBQ3hELE1BQU0sWUFBWSxHQUFZLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFFakQsTUFBTSxhQUFhLEdBQU8sWUFBWSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUE7Z0JBQ3JELE1BQU0sY0FBYyxHQUFXLElBQUksUUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO2dCQUUvRCxNQUFNLGFBQWEsR0FBTyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQTtnQkFDckQsTUFBTSxjQUFjLEdBQVcsSUFBSSxRQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7Z0JBRS9ELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDMUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7Z0JBRXpDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDN0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUE7WUFDM0MsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJOIH0gZnJvbSBcInNyY1wiXG5pbXBvcnQgeyBEZWZhdWx0cywgTmV0d29ya3MsIE5ldHdvcmsgfSBmcm9tIFwiLi4vLi4vLi4vc3JjL3V0aWxzL2NvbnN0YW50c1wiXG5cbmRlc2NyaWJlKFwiRVZNQ29uc3RhbnRzXCIsICgpOiB2b2lkID0+IHtcbiAgZGVzY3JpYmUoXCJDb21wYXJlIG1pbiBhbmQgbWF4IGdhcyBwcmljZXNcIiwgKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG5ldHdvcmtzOiBOZXR3b3JrcyA9IERlZmF1bHRzLm5ldHdvcmtcbiAgICBjb25zdCBtaW5OdW06IG51bWJlciA9IDI1MDAwMDAwMDAwXG4gICAgY29uc3QgbWF4TnVtOiBudW1iZXIgPSAxMDAwMDAwMDAwMDAwXG4gICAgY29uc3QgbmV0d29ya0lEczogbnVtYmVyW10gPSBbMSwgNSwgMTIzNDVdXG4gICAgbmV0d29ya0lEcy5mb3JFYWNoKChuZXR3b3JrSUQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgICAgdGVzdChgTmV0d29ya0lEOiAke25ldHdvcmtJRH1gLCBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgICAgIGNvbnN0IGxvY2FsTmV0d29yazogTmV0d29yayA9IG5ldHdvcmtzW25ldHdvcmtJRF1cblxuICAgICAgICBjb25zdCBtaW5HYXNQcmljZUJOOiBCTiA9IGxvY2FsTmV0d29yay5BWC5taW5HYXNQcmljZVxuICAgICAgICBjb25zdCBtaW5HYXNQcmljZU51bTogbnVtYmVyID0gbmV3IEJOKG1pbkdhc1ByaWNlQk4pLnRvTnVtYmVyKClcblxuICAgICAgICBjb25zdCBtYXhHYXNQcmljZUJOOiBCTiA9IGxvY2FsTmV0d29yay5BWC5tYXhHYXNQcmljZVxuICAgICAgICBjb25zdCBtYXhHYXNQcmljZU51bTogbnVtYmVyID0gbmV3IEJOKG1heEdhc1ByaWNlQk4pLnRvTnVtYmVyKClcblxuICAgICAgICBleHBlY3QobWluR2FzUHJpY2VOdW0pLnRvQmVMZXNzVGhhbk9yRXF1YWwobWF4R2FzUHJpY2VOdW0pXG4gICAgICAgIGV4cGVjdChtaW5HYXNQcmljZU51bSkudG9FcXVhbChtaW5OdW0pXG4gICAgICAgIGV4cGVjdChtaW5HYXNQcmljZUJOLmlzRXZlbigpKS50b0JlVHJ1dGh5KClcbiAgICAgICAgZXhwZWN0KG1pbkdhc1ByaWNlQk4uaXNOZWcoKSkudG9CZUZhbHN5KClcblxuICAgICAgICBleHBlY3QobWF4R2FzUHJpY2VOdW0pLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwobWluR2FzUHJpY2VOdW0pXG4gICAgICAgIGV4cGVjdChtYXhHYXNQcmljZU51bSkudG9FcXVhbChtYXhOdW0pXG4gICAgICAgIGV4cGVjdChtYXhHYXNQcmljZUJOLmlzRXZlbigpKS50b0JlVHJ1dGh5KClcbiAgICAgICAgZXhwZWN0KG1heEdhc1ByaWNlQk4uaXNOZWcoKSkudG9CZUZhbHN5KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=