"use strict";
/**
 * @packageDocumentation
 * @module API-AVM-MinterSet
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinterSet = void 0;
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const serialization_1 = require("../../utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
const decimalString = "decimalString";
const cb58 = "cb58";
const num = "number";
const buffer = "Buffer";
/**
 * Class for representing a threshold and set of minting addresses in Axia.
 *
 * @typeparam MinterSet including a threshold and array of addresses
 */
class MinterSet extends serialization_1.Serializable {
    /**
     *
     * @param threshold The number of signatures required to mint more of an asset by signing a minting transaction
     * @param minters Array of addresss which are authorized to sign a minting transaction
     */
    constructor(threshold = 1, minters = []) {
        super();
        this._typeName = "MinterSet";
        this._typeID = undefined;
        this.minters = [];
        /**
         * Returns the threshold.
         */
        this.getThreshold = () => {
            return this.threshold;
        };
        /**
         * Returns the minters.
         */
        this.getMinters = () => {
            return this.minters;
        };
        this._cleanAddresses = (addresses) => {
            let addrs = [];
            for (let i = 0; i < addresses.length; i++) {
                if (typeof addresses[`${i}`] === "string") {
                    addrs.push(bintools.stringToAddress(addresses[`${i}`]));
                }
                else if (addresses[`${i}`] instanceof buffer_1.Buffer) {
                    addrs.push(addresses[`${i}`]);
                }
            }
            return addrs;
        };
        this.threshold = threshold;
        this.minters = this._cleanAddresses(minters);
    }
    serialize(encoding = "hex") {
        const fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { threshold: serialization.encoder(this.threshold, encoding, num, decimalString, 4), minters: this.minters.map((m) => serialization.encoder(m, encoding, buffer, cb58, 20)) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.threshold = serialization.decoder(fields["threshold"], encoding, decimalString, num, 4);
        this.minters = fields["minters"].map((m) => serialization.decoder(m, encoding, cb58, buffer, 20));
    }
}
exports.MinterSet = MinterSet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWludGVyc2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwaXMvYXZtL21pbnRlcnNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7QUFFSCxvQ0FBZ0M7QUFDaEMsb0VBQTJDO0FBQzNDLDZEQUtrQztBQUVsQzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEUsTUFBTSxhQUFhLEdBQW1CLGVBQWUsQ0FBQTtBQUNyRCxNQUFNLElBQUksR0FBbUIsTUFBTSxDQUFBO0FBQ25DLE1BQU0sR0FBRyxHQUFtQixRQUFRLENBQUE7QUFDcEMsTUFBTSxNQUFNLEdBQW1CLFFBQVEsQ0FBQTtBQUV2Qzs7OztHQUlHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsNEJBQVk7SUErRHpDOzs7O09BSUc7SUFDSCxZQUFZLFlBQW9CLENBQUMsRUFBRSxVQUErQixFQUFFO1FBQ2xFLEtBQUssRUFBRSxDQUFBO1FBcEVDLGNBQVMsR0FBRyxXQUFXLENBQUE7UUFDdkIsWUFBTyxHQUFHLFNBQVMsQ0FBQTtRQWlDbkIsWUFBTyxHQUFhLEVBQUUsQ0FBQTtRQUVoQzs7V0FFRztRQUNILGlCQUFZLEdBQUcsR0FBVyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtRQUN2QixDQUFDLENBQUE7UUFFRDs7V0FFRztRQUNILGVBQVUsR0FBRyxHQUFhLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO1FBQ3JCLENBQUMsQ0FBQTtRQUVTLG9CQUFlLEdBQUcsQ0FBQyxTQUE4QixFQUFZLEVBQUU7WUFDdkUsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFBO1lBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNqRCxJQUFJLE9BQU8sU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQ3pDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBVyxDQUFDLENBQUMsQ0FBQTtpQkFDbEU7cUJBQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLGVBQU0sRUFBRTtvQkFDOUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBVyxDQUFDLENBQUE7aUJBQ3hDO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUMsQ0FBQTtRQVNDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QyxDQUFDO0lBcEVELFNBQVMsQ0FBQyxXQUErQixLQUFLO1FBQzVDLE1BQU0sTUFBTSxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsdUNBQ0ssTUFBTSxLQUNULFNBQVMsRUFBRSxhQUFhLENBQUMsT0FBTyxDQUM5QixJQUFJLENBQUMsU0FBUyxFQUNkLFFBQVEsRUFDUixHQUFHLEVBQ0gsYUFBYSxFQUNiLENBQUMsQ0FDRixFQUNELE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQzlCLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUNyRCxJQUNGO0lBQ0gsQ0FBQztJQUNELFdBQVcsQ0FBQyxNQUFjLEVBQUUsV0FBK0IsS0FBSztRQUM5RCxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFDbkIsUUFBUSxFQUNSLGFBQWEsRUFDYixHQUFHLEVBQ0gsQ0FBQyxDQUNGLENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUNqRCxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FDckQsQ0FBQTtJQUNILENBQUM7Q0F5Q0Y7QUF6RUQsOEJBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIEFQSS1BVk0tTWludGVyU2V0XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uL3V0aWxzL2JpbnRvb2xzXCJcclxuaW1wb3J0IHtcclxuICBTZXJpYWxpemFibGUsXHJcbiAgU2VyaWFsaXphdGlvbixcclxuICBTZXJpYWxpemVkRW5jb2RpbmcsXHJcbiAgU2VyaWFsaXplZFR5cGVcclxufSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXHJcblxyXG4vKipcclxuICogQGlnbm9yZVxyXG4gKi9cclxuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxyXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXHJcbmNvbnN0IGRlY2ltYWxTdHJpbmc6IFNlcmlhbGl6ZWRUeXBlID0gXCJkZWNpbWFsU3RyaW5nXCJcclxuY29uc3QgY2I1ODogU2VyaWFsaXplZFR5cGUgPSBcImNiNThcIlxyXG5jb25zdCBudW06IFNlcmlhbGl6ZWRUeXBlID0gXCJudW1iZXJcIlxyXG5jb25zdCBidWZmZXI6IFNlcmlhbGl6ZWRUeXBlID0gXCJCdWZmZXJcIlxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciByZXByZXNlbnRpbmcgYSB0aHJlc2hvbGQgYW5kIHNldCBvZiBtaW50aW5nIGFkZHJlc3NlcyBpbiBBeGlhLlxyXG4gKlxyXG4gKiBAdHlwZXBhcmFtIE1pbnRlclNldCBpbmNsdWRpbmcgYSB0aHJlc2hvbGQgYW5kIGFycmF5IG9mIGFkZHJlc3Nlc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE1pbnRlclNldCBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XHJcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiTWludGVyU2V0XCJcclxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxyXG5cclxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xyXG4gICAgY29uc3QgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi5maWVsZHMsXHJcbiAgICAgIHRocmVzaG9sZDogc2VyaWFsaXphdGlvbi5lbmNvZGVyKFxyXG4gICAgICAgIHRoaXMudGhyZXNob2xkLFxyXG4gICAgICAgIGVuY29kaW5nLFxyXG4gICAgICAgIG51bSxcclxuICAgICAgICBkZWNpbWFsU3RyaW5nLFxyXG4gICAgICAgIDRcclxuICAgICAgKSxcclxuICAgICAgbWludGVyczogdGhpcy5taW50ZXJzLm1hcCgobSkgPT5cclxuICAgICAgICBzZXJpYWxpemF0aW9uLmVuY29kZXIobSwgZW5jb2RpbmcsIGJ1ZmZlciwgY2I1OCwgMjApXHJcbiAgICAgIClcclxuICAgIH1cclxuICB9XHJcbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XHJcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxyXG4gICAgdGhpcy50aHJlc2hvbGQgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXHJcbiAgICAgIGZpZWxkc1tcInRocmVzaG9sZFwiXSxcclxuICAgICAgZW5jb2RpbmcsXHJcbiAgICAgIGRlY2ltYWxTdHJpbmcsXHJcbiAgICAgIG51bSxcclxuICAgICAgNFxyXG4gICAgKVxyXG4gICAgdGhpcy5taW50ZXJzID0gZmllbGRzW1wibWludGVyc1wiXS5tYXAoKG06IHN0cmluZykgPT5cclxuICAgICAgc2VyaWFsaXphdGlvbi5kZWNvZGVyKG0sIGVuY29kaW5nLCBjYjU4LCBidWZmZXIsIDIwKVxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHRocmVzaG9sZDogbnVtYmVyXHJcbiAgcHJvdGVjdGVkIG1pbnRlcnM6IEJ1ZmZlcltdID0gW11cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgdGhyZXNob2xkLlxyXG4gICAqL1xyXG4gIGdldFRocmVzaG9sZCA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMudGhyZXNob2xkXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBtaW50ZXJzLlxyXG4gICAqL1xyXG4gIGdldE1pbnRlcnMgPSAoKTogQnVmZmVyW10gPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMubWludGVyc1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9jbGVhbkFkZHJlc3NlcyA9IChhZGRyZXNzZXM6IHN0cmluZ1tdIHwgQnVmZmVyW10pOiBCdWZmZXJbXSA9PiB7XHJcbiAgICBsZXQgYWRkcnM6IEJ1ZmZlcltdID0gW11cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhZGRyZXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHR5cGVvZiBhZGRyZXNzZXNbYCR7aX1gXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGFkZHJzLnB1c2goYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKGFkZHJlc3Nlc1tgJHtpfWBdIGFzIHN0cmluZykpXHJcbiAgICAgIH0gZWxzZSBpZiAoYWRkcmVzc2VzW2Ake2l9YF0gaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgICBhZGRycy5wdXNoKGFkZHJlc3Nlc1tgJHtpfWBdIGFzIEJ1ZmZlcilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFkZHJzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB0aHJlc2hvbGQgVGhlIG51bWJlciBvZiBzaWduYXR1cmVzIHJlcXVpcmVkIHRvIG1pbnQgbW9yZSBvZiBhbiBhc3NldCBieSBzaWduaW5nIGEgbWludGluZyB0cmFuc2FjdGlvblxyXG4gICAqIEBwYXJhbSBtaW50ZXJzIEFycmF5IG9mIGFkZHJlc3NzIHdoaWNoIGFyZSBhdXRob3JpemVkIHRvIHNpZ24gYSBtaW50aW5nIHRyYW5zYWN0aW9uXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IodGhyZXNob2xkOiBudW1iZXIgPSAxLCBtaW50ZXJzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdID0gW10pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMudGhyZXNob2xkID0gdGhyZXNob2xkXHJcbiAgICB0aGlzLm1pbnRlcnMgPSB0aGlzLl9jbGVhbkFkZHJlc3NlcyhtaW50ZXJzKVxyXG4gIH1cclxufVxyXG4iXX0=