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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Utils-BinTools
 */
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const create_hash_1 = __importDefault(require("create-hash"));
const bech32 = __importStar(require("bech32"));
const base58_1 = require("./base58");
const errors_1 = require("../utils/errors");
const ethers_1 = require("ethers");
/**
 * A class containing tools useful in interacting with binary data cross-platform using
 * nodejs & javascript.
 *
 * This class should never be instantiated directly. Instead,
 * invoke the "BinTools.getInstance()" static * function to grab the singleton
 * instance of the tools.
 *
 * Everything in this library uses
 * the {@link https://github.com/feross/buffer|feross's Buffer class}.
 *
 * ```js
 * const bintools: BinTools = BinTools.getInstance();
 * const b58str:  = bintools.bufferToB58(Buffer.from("Wubalubadubdub!"));
 * ```
 */
class BinTools {
    constructor() {
        /**
         * Returns true if meets requirements to parse as an address as Bech32 on Swap-Chain or Core-Chain, otherwise false
         * @param address the string to verify is address
         */
        this.isPrimaryBechAddress = (address) => {
            const parts = address.trim().split("-");
            if (parts.length !== 2) {
                return false;
            }
            try {
                bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words);
            }
            catch (err) {
                return false;
            }
            return true;
        };
        /**
         * Produces a string from a {@link https://github.com/feross/buffer|Buffer}
         * representing a string. ONLY USED IN TRANSACTION FORMATTING, ASSUMED LENGTH IS PREPENDED.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to a string
         */
        this.bufferToString = (buff) => this.copyFrom(buff, 2).toString("utf8");
        /**
         * Produces a {@link https://github.com/feross/buffer|Buffer} from a string. ONLY USED IN TRANSACTION FORMATTING, LENGTH IS PREPENDED.
         *
         * @param str The string to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.stringToBuffer = (str) => {
            const buff = buffer_1.Buffer.alloc(2 + str.length);
            buff.writeUInt16BE(str.length, 0);
            buff.write(str, 2, str.length, "utf8");
            return buff;
        };
        /**
         * Makes a copy (no reference) of a {@link https://github.com/feross/buffer|Buffer}
         * over provided indecies.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to copy
         * @param start The index to start the copy
         * @param end The index to end the copy
         */
        this.copyFrom = (buff, start = 0, end = undefined) => {
            if (end === undefined) {
                end = buff.length;
            }
            return buffer_1.Buffer.from(Uint8Array.prototype.slice.call(buff.slice(start, end)));
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string of
         * the {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to base-58
         */
        this.bufferToB58 = (buff) => this.b58.encode(buff);
        /**
         * Takes a base-58 string and returns a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param b58str The base-58 string to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.b58ToBuffer = (b58str) => this.b58.decode(b58str);
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns an ArrayBuffer.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to
         * convert to an ArrayBuffer
         */
        this.fromBufferToArrayBuffer = (buff) => {
            const ab = new ArrayBuffer(buff.length);
            const view = new Uint8Array(ab);
            for (let i = 0; i < buff.length; ++i) {
                view[`${i}`] = buff[`${i}`];
            }
            return view;
        };
        /**
         * Takes an ArrayBuffer and converts it to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param ab The ArrayBuffer to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromArrayBufferToBuffer = (ab) => {
            const buf = buffer_1.Buffer.alloc(ab.byteLength);
            for (let i = 0; i < ab.byteLength; ++i) {
                buf[`${i}`] = ab[`${i}`];
            }
            return buf;
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and converts it
         * to a {@link https://github.com/indutny/bn.js/|BN}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert
         * to a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.fromBufferToBN = (buff) => {
            if (typeof buff === "undefined") {
                return undefined;
            }
            return new bn_js_1.default(buff.toString("hex"), 16, "be");
        };
        /**
         * Takes a {@link https://github.com/indutny/bn.js/|BN} and converts it
         * to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param bn The {@link https://github.com/indutny/bn.js/|BN} to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         * @param length The zero-padded length of the {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromBNToBuffer = (bn, length) => {
            if (typeof bn === "undefined") {
                return undefined;
            }
            const newarr = bn.toArray("be");
            /**
             * CKC: Still unsure why bn.toArray with a "be" and a length do not work right. Bug?
             */
            if (length) {
                // bn toArray with the length parameter doesn't work correctly, need this.
                const x = length - newarr.length;
                for (let i = 0; i < x; i++) {
                    newarr.unshift(0);
                }
            }
            return buffer_1.Buffer.from(newarr);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and adds a checksum, returning
         * a {@link https://github.com/feross/buffer|Buffer} with the 4-byte checksum appended.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to append a checksum
         */
        this.addChecksum = (buff) => {
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(buff).digest().slice(28));
            return buffer_1.Buffer.concat([buff, hashslice]);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} with an appended 4-byte checksum
         * and returns true if the checksum is valid, otherwise false.
         *
         * @param b The {@link https://github.com/feross/buffer|Buffer} to validate the checksum
         */
        this.validateChecksum = (buff) => {
            const checkslice = buff.slice(buff.length - 4);
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(buff.slice(0, buff.length - 4))
                .digest()
                .slice(28));
            return checkslice.toString("hex") === hashslice.toString("hex");
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string with
         * checksum as per the cb58 standard.
         *
         * @param bytes A {@link https://github.com/feross/buffer|Buffer} to serialize
         *
         * @returns A serialized base-58 string of the Buffer.
         */
        this.cb58Encode = (bytes) => {
            const x = this.addChecksum(bytes);
            return this.bufferToB58(x);
        };
        /**
         * Takes a cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         * and returns a {@link https://github.com/feross/buffer|Buffer} of the original data. Throws on error.
         *
         * @param bytes A cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         */
        this.cb58Decode = (bytes) => {
            if (typeof bytes === "string") {
                bytes = this.b58ToBuffer(bytes);
            }
            if (this.validateChecksum(bytes)) {
                return this.copyFrom(bytes, 0, bytes.length - 4);
            }
            throw new errors_1.ChecksumError("Error - BinTools.cb58Decode: invalid checksum");
        };
        this.addressToString = (hrp, chainid, bytes) => `${chainid}-${bech32.bech32.encode(hrp, bech32.bech32.toWords(bytes))}`;
        this.stringToAddress = (address, hrp) => {
            if (address.substring(0, 2) === "0x") {
                // ETH-style address
                if (ethers_1.utils.isAddress(address)) {
                    return buffer_1.Buffer.from(address.substring(2), "hex");
                }
                else {
                    throw new errors_1.HexError("Error - Invalid address");
                }
            }
            // Bech32 addresses
            const parts = address.trim().split("-");
            if (parts.length < 2) {
                throw new errors_1.Bech32Error("Error - Valid address should include -");
            }
            if (parts[0].length < 1) {
                throw new errors_1.Bech32Error("Error - Valid address must have prefix before -");
            }
            const split = parts[1].lastIndexOf("1");
            if (split < 0) {
                throw new errors_1.Bech32Error("Error - Valid address must include separator (1)");
            }
            const humanReadablePart = parts[1].slice(0, split);
            if (humanReadablePart.length < 1) {
                throw new errors_1.Bech32Error("Error - HRP should be at least 1 character");
            }
            if (humanReadablePart !== "axc" &&
                humanReadablePart !== "test" &&
                humanReadablePart != "local" &&
                humanReadablePart != "custom" &&
                humanReadablePart != hrp) {
                throw new errors_1.Bech32Error("Error - Invalid HRP");
            }
            return buffer_1.Buffer.from(bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words));
        };
        /**
         * Takes an address and returns its {@link https://github.com/feross/buffer|Buffer}
         * representation if valid. A more strict version of stringToAddress.
         *
         * @param addr A string representation of the address
         * @param blockchainID A cb58 encoded string representation of the blockchainID
         * @param alias A chainID alias, if any, that the address can also parse from.
         * @param addrlen VMs can use any addressing scheme that they like, so this is the appropriate number of address bytes. Default 20.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid,
         * undefined if not valid.
         */
        this.parseAddress = (addr, blockchainID, alias = undefined, addrlen = 20) => {
            const abc = addr.split("-");
            if (abc.length === 2 &&
                ((alias && abc[0] === alias) || (blockchainID && abc[0] === blockchainID))) {
                const addrbuff = this.stringToAddress(addr);
                if ((addrlen && addrbuff.length === addrlen) || !addrlen) {
                    return addrbuff;
                }
            }
            return undefined;
        };
        this.b58 = base58_1.Base58.getInstance();
    }
    /**
     * Retrieves the BinTools singleton.
     */
    static getInstance() {
        if (!BinTools.instance) {
            BinTools.instance = new BinTools();
        }
        return BinTools.instance;
    }
    /**
     * Returns true if base64, otherwise false
     * @param str the string to verify is Base64
     */
    isBase64(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            let b64 = buffer_1.Buffer.from(str, "base64");
            return b64.toString("base64") === str;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if cb58, otherwise false
     * @param cb58 the string to verify is cb58
     */
    isCB58(cb58) {
        return this.isBase58(cb58);
    }
    /**
     * Returns true if base58, otherwise false
     * @param base58 the string to verify is base58
     */
    isBase58(base58) {
        if (base58 === "" || base58.trim() === "") {
            return false;
        }
        try {
            return this.b58.encode(this.b58.decode(base58)) === base58;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if hexidecimal, otherwise false
     * @param hex the string to verify is hexidecimal
     */
    isHex(hex) {
        if (hex === "" || hex.trim() === "") {
            return false;
        }
        if ((hex.startsWith("0x") && hex.slice(2).match(/^[0-9A-Fa-f]/g)) ||
            hex.match(/^[0-9A-Fa-f]/g)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns true if decimal, otherwise false
     * @param str the string to verify is hexidecimal
     */
    isDecimal(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            return new bn_js_1.default(str, 10).toString(10) === str.trim();
        }
        catch (err) {
            return false;
        }
    }
}
exports.default = BinTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmludG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYmludG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNILGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsOERBQW9DO0FBQ3BDLCtDQUFnQztBQUNoQyxxQ0FBaUM7QUFDakMsNENBQXNFO0FBQ3RFLG1DQUE4QjtBQUU5Qjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFxQixRQUFRO0lBRzNCO1FBd0ZBOzs7V0FHRztRQUNILHlCQUFvQixHQUFHLENBQUMsT0FBZSxFQUFXLEVBQUU7WUFDbEQsTUFBTSxLQUFLLEdBQWEsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNqRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQTthQUNiO1lBQ0QsSUFBSTtnQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUM5RDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sS0FBSyxDQUFBO2FBQ2I7WUFDRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQTtRQUVEOzs7OztXQUtHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLElBQVksRUFBVSxFQUFFLENBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV6Qzs7OztXQUlHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxHQUFXLGVBQU0sQ0FBQyxL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O1FBQ0QsSUFDRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFDMUI7WUFDQSxPQUFPLElBQUksQ0FBQTtTQUNaO2FBQU07WUFDTCxPQUFPLEtBQUssQ0FBQTtTQUNiO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVMsQ0FBQyxHQUFXO1FBQ25CLElBQUksR0FBRyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ25DLE9BQU8sS0FBSyxDQUFBO1NBQ2I7UUFDRCxJQUFJO1lBQ0YsT0FBTyxJQUFJLGVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUE7U0FDYjtJQUNILENBQUM7Q0F1UkY7QUFoWEQsMkJBZ1hDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxyXG4gKiBAbW9kdWxlIFV0aWxzLUJpblRvb2xzXHJcbiAqL1xyXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgY3JlYXRlSGFzaCBmcm9tIFwiY3JlYXRlLWhhc2hcIlxyXG5pbXBvcnQgKiBhcyBiZWNoMzIgZnJvbSBcImJlY2gzMlwiXHJcbmltcG9ydCB7IEJhc2U1OCB9IGZyb20gXCIuL2Jhc2U1OFwiXHJcbmltcG9ydCB7IEJlY2gzMkVycm9yLCBDaGVja3N1bUVycm9yLCBIZXhFcnJvciB9IGZyb20gXCIuLi91dGlscy9lcnJvcnNcIlxyXG5pbXBvcnQgeyB1dGlscyB9IGZyb20gXCJldGhlcnNcIlxyXG5cclxuLyoqXHJcbiAqIEEgY2xhc3MgY29udGFpbmluZyB0b29scyB1c2VmdWwgaW4gaW50ZXJhY3Rpbmcgd2l0aCBiaW5hcnkgZGF0YSBjcm9zcy1wbGF0Zm9ybSB1c2luZ1xyXG4gKiBub2RlanMgJiBqYXZhc2NyaXB0LlxyXG4gKlxyXG4gKiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuIEluc3RlYWQsXHJcbiAqIGludm9rZSB0aGUgXCJCaW5Ub29scy5nZXRJbnN0YW5jZSgpXCIgc3RhdGljICogZnVuY3Rpb24gdG8gZ3JhYiB0aGUgc2luZ2xldG9uXHJcbiAqIGluc3RhbmNlIG9mIHRoZSB0b29scy5cclxuICpcclxuICogRXZlcnl0aGluZyBpbiB0aGlzIGxpYnJhcnkgdXNlc1xyXG4gKiB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfGZlcm9zcydzIEJ1ZmZlciBjbGFzc30uXHJcbiAqXHJcbiAqIGBgYGpzXHJcbiAqIGNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKCk7XHJcbiAqIGNvbnN0IGI1OHN0cjogID0gYmludG9vbHMuYnVmZmVyVG9CNTgoQnVmZmVyLmZyb20oXCJXdWJhbHViYWR1YmR1YiFcIikpO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpblRvb2xzIHtcclxuICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQmluVG9vbHNcclxuXHJcbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYjU4ID0gQmFzZTU4LmdldEluc3RhbmNlKClcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYjU4OiBCYXNlNThcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSBCaW5Ub29scyBzaW5nbGV0b24uXHJcbiAgICovXHJcbiAgc3RhdGljIGdldEluc3RhbmNlKCk6IEJpblRvb2xzIHtcclxuICAgIGlmICghQmluVG9vbHMuaW5zdGFuY2UpIHtcclxuICAgICAgQmluVG9vbHMuaW5zdGFuY2UgPSBuZXcgQmluVG9vbHMoKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEJpblRvb2xzLmluc3RhbmNlXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRydWUgaWYgYmFzZTY0LCBvdGhlcndpc2UgZmFsc2VcclxuICAgKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIEJhc2U2NFxyXG4gICAqL1xyXG4gIGlzQmFzZTY0KHN0cjogc3RyaW5nKSB7XHJcbiAgICBpZiAoc3RyID09PSBcIlwiIHx8IHN0ci50cmltKCkgPT09IFwiXCIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgYjY0OiBCdWZmZXIgPSBCdWZmZXIuZnJvbShzdHIsIFwiYmFzZTY0XCIpXHJcbiAgICAgIHJldHVybiBiNjQudG9TdHJpbmcoXCJiYXNlNjRcIikgPT09IHN0clxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGNiNTgsIG90aGVyd2lzZSBmYWxzZVxyXG4gICAqIEBwYXJhbSBjYjU4IHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGNiNThcclxuICAgKi9cclxuICBpc0NCNTgoY2I1ODogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pc0Jhc2U1OChjYjU4KVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGJhc2U1OCwgb3RoZXJ3aXNlIGZhbHNlXHJcbiAgICogQHBhcmFtIGJhc2U1OCB0aGUgc3RyaW5nIHRvIHZlcmlmeSBpcyBiYXNlNThcclxuICAgKi9cclxuICBpc0Jhc2U1OChiYXNlNTg6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGJhc2U1OCA9PT0gXCJcIiB8fCBiYXNlNTgudHJpbSgpID09PSBcIlwiKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIHRoaXMuYjU4LmVuY29kZSh0aGlzLmI1OC5kZWNvZGUoYmFzZTU4KSkgPT09IGJhc2U1OFxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGhleGlkZWNpbWFsLCBvdGhlcndpc2UgZmFsc2VcclxuICAgKiBAcGFyYW0gaGV4IHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGhleGlkZWNpbWFsXHJcbiAgICovXHJcbiAgaXNIZXgoaGV4OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGlmIChoZXggPT09IFwiXCIgfHwgaGV4LnRyaW0oKSA9PT0gXCJcIikge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgKGhleC5zdGFydHNXaXRoKFwiMHhcIikgJiYgaGV4LnNsaWNlKDIpLm1hdGNoKC9eWzAtOUEtRmEtZl0vZykpIHx8XHJcbiAgICAgIGhleC5tYXRjaCgvXlswLTlBLUZhLWZdL2cpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGRlY2ltYWwsIG90aGVyd2lzZSBmYWxzZVxyXG4gICAqIEBwYXJhbSBzdHIgdGhlIHN0cmluZyB0byB2ZXJpZnkgaXMgaGV4aWRlY2ltYWxcclxuICAgKi9cclxuICBpc0RlY2ltYWwoc3RyOiBzdHJpbmcpIHtcclxuICAgIGlmIChzdHIgPT09IFwiXCIgfHwgc3RyLnRyaW0oKSA9PT0gXCJcIikge1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBuZXcgQk4oc3RyLCAxMCkudG9TdHJpbmcoMTApID09PSBzdHIudHJpbSgpXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRydWUgaWYgbWVldHMgcmVxdWlyZW1lbnRzIHRvIHBhcnNlIGFzIGFuIGFkZHJlc3MgYXMgQmVjaDMyIG9uIFN3YXAtQ2hhaW4gb3IgQ29yZS1DaGFpbiwgb3RoZXJ3aXNlIGZhbHNlXHJcbiAgICogQHBhcmFtIGFkZHJlc3MgdGhlIHN0cmluZyB0byB2ZXJpZnkgaXMgYWRkcmVzc1xyXG4gICAqL1xyXG4gIGlzUHJpbWFyeUJlY2hBZGRyZXNzID0gKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gYWRkcmVzcy50cmltKCkuc3BsaXQoXCItXCIpXHJcbiAgICBpZiAocGFydHMubGVuZ3RoICE9PSAyKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgYmVjaDMyLmJlY2gzMi5mcm9tV29yZHMoYmVjaDMyLmJlY2gzMi5kZWNvZGUocGFydHNbMV0pLndvcmRzKVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFByb2R1Y2VzIGEgc3RyaW5nIGZyb20gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqIHJlcHJlc2VudGluZyBhIHN0cmluZy4gT05MWSBVU0VEIElOIFRSQU5TQUNUSU9OIEZPUk1BVFRJTkcsIEFTU1VNRUQgTEVOR1RIIElTIFBSRVBFTkRFRC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBidWZmIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byBjb252ZXJ0IHRvIGEgc3RyaW5nXHJcbiAgICovXHJcbiAgYnVmZmVyVG9TdHJpbmcgPSAoYnVmZjogQnVmZmVyKTogc3RyaW5nID0+XHJcbiAgICB0aGlzLmNvcHlGcm9tKGJ1ZmYsIDIpLnRvU3RyaW5nKFwidXRmOFwiKVxyXG5cclxuICAvKipcclxuICAgKiBQcm9kdWNlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZyb20gYSBzdHJpbmcuIE9OTFkgVVNFRCBJTiBUUkFOU0FDVElPTiBGT1JNQVRUSU5HLCBMRU5HVEggSVMgUFJFUEVOREVELlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0ciBUaGUgc3RyaW5nIHRvIGNvbnZlcnQgdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqL1xyXG4gIHN0cmluZ1RvQnVmZmVyID0gKHN0cjogc3RyaW5nKTogQnVmZmVyID0+IHtcclxuICAgIGNvbnN0IGJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygyICsgc3RyLmxlbmd0aClcclxuICAgIGJ1ZmYud3JpdGVVSW50MTZCRShzdHIubGVuZ3RoLCAwKVxyXG4gICAgYnVmZi53cml0ZShzdHIsIDIsIHN0ci5sZW5ndGgsIFwidXRmOFwiKVxyXG4gICAgcmV0dXJuIGJ1ZmZcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1ha2VzIGEgY29weSAobm8gcmVmZXJlbmNlKSBvZiBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogb3ZlciBwcm92aWRlZCBpbmRlY2llcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBidWZmIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byBjb3B5XHJcbiAgICogQHBhcmFtIHN0YXJ0IFRoZSBpbmRleCB0byBzdGFydCB0aGUgY29weVxyXG4gICAqIEBwYXJhbSBlbmQgVGhlIGluZGV4IHRvIGVuZCB0aGUgY29weVxyXG4gICAqL1xyXG4gIGNvcHlGcm9tID0gKFxyXG4gICAgYnVmZjogQnVmZmVyLFxyXG4gICAgc3RhcnQ6IG51bWJlciA9IDAsXHJcbiAgICBlbmQ6IG51bWJlciA9IHVuZGVmaW5lZFxyXG4gICk6IEJ1ZmZlciA9PiB7XHJcbiAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZW5kID0gYnVmZi5sZW5ndGhcclxuICAgIH1cclxuICAgIHJldHVybiBCdWZmZXIuZnJvbShVaW50OEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGJ1ZmYuc2xpY2Uoc3RhcnQsIGVuZCkpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhIGJhc2UtNTggc3RyaW5nIG9mXHJcbiAgICogdGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvbnZlcnQgdG8gYmFzZS01OFxyXG4gICAqL1xyXG4gIGJ1ZmZlclRvQjU4ID0gKGJ1ZmY6IEJ1ZmZlcik6IHN0cmluZyA9PiB0aGlzLmI1OC5lbmNvZGUoYnVmZilcclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBiYXNlLTU4IHN0cmluZyBhbmQgcmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGI1OHN0ciBUaGUgYmFzZS01OCBzdHJpbmcgdG8gY29udmVydFxyXG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cclxuICAgKi9cclxuICBiNThUb0J1ZmZlciA9IChiNThzdHI6IHN0cmluZyk6IEJ1ZmZlciA9PiB0aGlzLmI1OC5kZWNvZGUoYjU4c3RyKVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCByZXR1cm5zIGFuIEFycmF5QnVmZmVyLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvXHJcbiAgICogY29udmVydCB0byBhbiBBcnJheUJ1ZmZlclxyXG4gICAqL1xyXG4gIGZyb21CdWZmZXJUb0FycmF5QnVmZmVyID0gKGJ1ZmY6IEJ1ZmZlcik6IEFycmF5QnVmZmVyID0+IHtcclxuICAgIGNvbnN0IGFiID0gbmV3IEFycmF5QnVmZmVyKGJ1ZmYubGVuZ3RoKVxyXG4gICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KGFiKVxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGJ1ZmYubGVuZ3RoOyArK2kpIHtcclxuICAgICAgdmlld1tgJHtpfWBdID0gYnVmZltgJHtpfWBdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmlld1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYW4gQXJyYXlCdWZmZXIgYW5kIGNvbnZlcnRzIGl0IHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWIgVGhlIEFycmF5QnVmZmVyIHRvIGNvbnZlcnQgdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqL1xyXG4gIGZyb21BcnJheUJ1ZmZlclRvQnVmZmVyID0gKGFiOiBBcnJheUJ1ZmZlcik6IEJ1ZmZlciA9PiB7XHJcbiAgICBjb25zdCBidWYgPSBCdWZmZXIuYWxsb2MoYWIuYnl0ZUxlbmd0aClcclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhYi5ieXRlTGVuZ3RoOyArK2kpIHtcclxuICAgICAgYnVmW2Ake2l9YF0gPSBhYltgJHtpfWBdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnVmXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCBjb252ZXJ0cyBpdFxyXG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYnVmZiBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gdG8gY29udmVydFxyXG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cclxuICAgKi9cclxuICBmcm9tQnVmZmVyVG9CTiA9IChidWZmOiBCdWZmZXIpOiBCTiA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGJ1ZmYgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBCTihidWZmLnRvU3RyaW5nKFwiaGV4XCIpLCAxNiwgXCJiZVwiKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGFuZCBjb252ZXJ0cyBpdFxyXG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYm4gVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IHRvIGNvbnZlcnRcclxuICAgKiB0byBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogQHBhcmFtIGxlbmd0aCBUaGUgemVyby1wYWRkZWQgbGVuZ3RoIG9mIHRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxyXG4gICAqL1xyXG4gIGZyb21CTlRvQnVmZmVyID0gKGJuOiBCTiwgbGVuZ3RoPzogbnVtYmVyKTogQnVmZmVyID0+IHtcclxuICAgIGlmICh0eXBlb2YgYm4gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3YXJyID0gYm4udG9BcnJheShcImJlXCIpXHJcbiAgICAvKipcclxuICAgICAqIENLQzogU3RpbGwgdW5zdXJlIHdoeSBibi50b0FycmF5IHdpdGggYSBcImJlXCIgYW5kIGEgbGVuZ3RoIGRvIG5vdCB3b3JrIHJpZ2h0LiBCdWc/XHJcbiAgICAgKi9cclxuICAgIGlmIChsZW5ndGgpIHtcclxuICAgICAgLy8gYm4gdG9BcnJheSB3aXRoIHRoZSBsZW5ndGggcGFyYW1ldGVyIGRvZXNuJ3Qgd29yayBjb3JyZWN0bHksIG5lZWQgdGhpcy5cclxuICAgICAgY29uc3QgeCA9IGxlbmd0aCAtIG5ld2Fyci5sZW5ndGhcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHg7IGkrKykge1xyXG4gICAgICAgIG5ld2Fyci51bnNoaWZ0KDApXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBCdWZmZXIuZnJvbShuZXdhcnIpXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCBhZGRzIGEgY2hlY2tzdW0sIHJldHVybmluZ1xyXG4gICAqIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2l0aCB0aGUgNC1ieXRlIGNoZWNrc3VtIGFwcGVuZGVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGFwcGVuZCBhIGNoZWNrc3VtXHJcbiAgICovXHJcbiAgYWRkQ2hlY2tzdW0gPSAoYnVmZjogQnVmZmVyKTogQnVmZmVyID0+IHtcclxuICAgIGNvbnN0IGhhc2hzbGljZTogQnVmZmVyID0gQnVmZmVyLmZyb20oXHJcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKGJ1ZmYpLmRpZ2VzdCgpLnNsaWNlKDI4KVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW2J1ZmYsIGhhc2hzbGljZV0pXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHdpdGggYW4gYXBwZW5kZWQgNC1ieXRlIGNoZWNrc3VtXHJcbiAgICogYW5kIHJldHVybnMgdHJ1ZSBpZiB0aGUgY2hlY2tzdW0gaXMgdmFsaWQsIG90aGVyd2lzZSBmYWxzZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBiIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byB2YWxpZGF0ZSB0aGUgY2hlY2tzdW1cclxuICAgKi9cclxuICB2YWxpZGF0ZUNoZWNrc3VtID0gKGJ1ZmY6IEJ1ZmZlcik6IGJvb2xlYW4gPT4ge1xyXG4gICAgY29uc3QgY2hlY2tzbGljZTogQnVmZmVyID0gYnVmZi5zbGljZShidWZmLmxlbmd0aCAtIDQpXHJcbiAgICBjb25zdCBoYXNoc2xpY2U6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxyXG4gICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpXHJcbiAgICAgICAgLnVwZGF0ZShidWZmLnNsaWNlKDAsIGJ1ZmYubGVuZ3RoIC0gNCkpXHJcbiAgICAgICAgLmRpZ2VzdCgpXHJcbiAgICAgICAgLnNsaWNlKDI4KVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIGNoZWNrc2xpY2UudG9TdHJpbmcoXCJoZXhcIikgPT09IGhhc2hzbGljZS50b1N0cmluZyhcImhleFwiKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhIGJhc2UtNTggc3RyaW5nIHdpdGhcclxuICAgKiBjaGVja3N1bSBhcyBwZXIgdGhlIGNiNTggc3RhbmRhcmQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYnl0ZXMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byBzZXJpYWxpemVcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIEEgc2VyaWFsaXplZCBiYXNlLTU4IHN0cmluZyBvZiB0aGUgQnVmZmVyLlxyXG4gICAqL1xyXG4gIGNiNThFbmNvZGUgPSAoYnl0ZXM6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XHJcbiAgICBjb25zdCB4OiBCdWZmZXIgPSB0aGlzLmFkZENoZWNrc3VtKGJ5dGVzKVxyXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyVG9CNTgoeClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXHJcbiAgICogYW5kIHJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBvZiB0aGUgb3JpZ2luYWwgZGF0YS4gVGhyb3dzIG9uIGVycm9yLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGJ5dGVzIEEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXHJcbiAgICovXHJcbiAgY2I1OERlY29kZSA9IChieXRlczogQnVmZmVyIHwgc3RyaW5nKTogQnVmZmVyID0+IHtcclxuICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgYnl0ZXMgPSB0aGlzLmI1OFRvQnVmZmVyKGJ5dGVzKVxyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudmFsaWRhdGVDaGVja3N1bShieXRlcykpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29weUZyb20oYnl0ZXMsIDAsIGJ5dGVzLmxlbmd0aCAtIDQpXHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgQ2hlY2tzdW1FcnJvcihcIkVycm9yIC0gQmluVG9vbHMuY2I1OERlY29kZTogaW52YWxpZCBjaGVja3N1bVwiKVxyXG4gIH1cclxuXHJcbiAgYWRkcmVzc1RvU3RyaW5nID0gKGhycDogc3RyaW5nLCBjaGFpbmlkOiBzdHJpbmcsIGJ5dGVzOiBCdWZmZXIpOiBzdHJpbmcgPT5cclxuICAgIGAke2NoYWluaWR9LSR7YmVjaDMyLmJlY2gzMi5lbmNvZGUoaHJwLCBiZWNoMzIuYmVjaDMyLnRvV29yZHMoYnl0ZXMpKX1gXHJcblxyXG4gIHN0cmluZ1RvQWRkcmVzcyA9IChhZGRyZXNzOiBzdHJpbmcsIGhycD86IHN0cmluZyk6IEJ1ZmZlciA9PiB7XHJcbiAgICBpZiAoYWRkcmVzcy5zdWJzdHJpbmcoMCwgMikgPT09IFwiMHhcIikge1xyXG4gICAgICAvLyBFVEgtc3R5bGUgYWRkcmVzc1xyXG4gICAgICBpZiAodXRpbHMuaXNBZGRyZXNzKGFkZHJlc3MpKSB7XHJcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGFkZHJlc3Muc3Vic3RyaW5nKDIpLCBcImhleFwiKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBIZXhFcnJvcihcIkVycm9yIC0gSW52YWxpZCBhZGRyZXNzXCIpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIEJlY2gzMiBhZGRyZXNzZXNcclxuICAgIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IGFkZHJlc3MudHJpbSgpLnNwbGl0KFwiLVwiKVxyXG5cclxuICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XHJcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gVmFsaWQgYWRkcmVzcyBzaG91bGQgaW5jbHVkZSAtXCIpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBhcnRzWzBdLmxlbmd0aCA8IDEpIHtcclxuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiRXJyb3IgLSBWYWxpZCBhZGRyZXNzIG11c3QgaGF2ZSBwcmVmaXggYmVmb3JlIC1cIilcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcGxpdDogbnVtYmVyID0gcGFydHNbMV0ubGFzdEluZGV4T2YoXCIxXCIpXHJcbiAgICBpZiAoc3BsaXQgPCAwKSB7XHJcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gVmFsaWQgYWRkcmVzcyBtdXN0IGluY2x1ZGUgc2VwYXJhdG9yICgxKVwiKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGh1bWFuUmVhZGFibGVQYXJ0OiBzdHJpbmcgPSBwYXJ0c1sxXS5zbGljZSgwLCBzcGxpdClcclxuICAgIGlmIChodW1hblJlYWRhYmxlUGFydC5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gSFJQIHNob3VsZCBiZSBhdCBsZWFzdCAxIGNoYXJhY3RlclwiKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChcclxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT09IFwiYXhjXCIgJiZcclxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT09IFwidGVzdFwiICYmXHJcbiAgICAgIGh1bWFuUmVhZGFibGVQYXJ0ICE9IFwibG9jYWxcIiAmJlxyXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPSBcImN1c3RvbVwiICYmXHJcbiAgICAgIGh1bWFuUmVhZGFibGVQYXJ0ICE9IGhycFxyXG4gICAgKSB7XHJcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gSW52YWxpZCBIUlBcIilcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oXHJcbiAgICAgIGJlY2gzMi5iZWNoMzIuZnJvbVdvcmRzKGJlY2gzMi5iZWNoMzIuZGVjb2RlKHBhcnRzWzFdKS53b3JkcylcclxuICAgIClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGFuIGFkZHJlc3MgYW5kIHJldHVybnMgaXRzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XHJcbiAgICogcmVwcmVzZW50YXRpb24gaWYgdmFsaWQuIEEgbW9yZSBzdHJpY3QgdmVyc2lvbiBvZiBzdHJpbmdUb0FkZHJlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWRkciBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWRkcmVzc1xyXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgQSBjYjU4IGVuY29kZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBibG9ja2NoYWluSURcclxuICAgKiBAcGFyYW0gYWxpYXMgQSBjaGFpbklEIGFsaWFzLCBpZiBhbnksIHRoYXQgdGhlIGFkZHJlc3MgY2FuIGFsc28gcGFyc2UgZnJvbS5cclxuICAgKiBAcGFyYW0gYWRkcmxlbiBWTXMgY2FuIHVzZSBhbnkgYWRkcmVzc2luZyBzY2hlbWUgdGhhdCB0aGV5IGxpa2UsIHNvIHRoaXMgaXMgdGhlIGFwcHJvcHJpYXRlIG51bWJlciBvZiBhZGRyZXNzIGJ5dGVzLiBEZWZhdWx0IDIwLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3MgaWYgdmFsaWQsXHJcbiAgICogdW5kZWZpbmVkIGlmIG5vdCB2YWxpZC5cclxuICAgKi9cclxuICBwYXJzZUFkZHJlc3MgPSAoXHJcbiAgICBhZGRyOiBzdHJpbmcsXHJcbiAgICBibG9ja2NoYWluSUQ6IHN0cmluZyxcclxuICAgIGFsaWFzOiBzdHJpbmcgPSB1bmRlZmluZWQsXHJcbiAgICBhZGRybGVuOiBudW1iZXIgPSAyMFxyXG4gICk6IEJ1ZmZlciA9PiB7XHJcbiAgICBjb25zdCBhYmM6IHN0cmluZ1tdID0gYWRkci5zcGxpdChcIi1cIilcclxuICAgIGlmIChcclxuICAgICAgYWJjLmxlbmd0aCA9PT0gMiAmJlxyXG4gICAgICAoKGFsaWFzICYmIGFiY1swXSA9PT0gYWxpYXMpIHx8IChibG9ja2NoYWluSUQgJiYgYWJjWzBdID09PSBibG9ja2NoYWluSUQpKVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IGFkZHJidWZmID0gdGhpcy5zdHJpbmdUb0FkZHJlc3MoYWRkcilcclxuICAgICAgaWYgKChhZGRybGVuICYmIGFkZHJidWZmLmxlbmd0aCA9PT0gYWRkcmxlbikgfHwgIWFkZHJsZW4pIHtcclxuICAgICAgICByZXR1cm4gYWRkcmJ1ZmZcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH1cclxufVxyXG4iXX0=