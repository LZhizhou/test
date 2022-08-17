"use strict";
/**
 * @packageDocumentation
 * @module Utils-Payload
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAGNETPayload = exports.ONIONPayload = exports.IPFSPayload = exports.URLPayload = exports.EMAILPayload = exports.YAMLPayload = exports.JSONPayload = exports.CSVPayload = exports.SVGPayload = exports.ICOPayload = exports.BMPPayload = exports.PNGPayload = exports.JPEGPayload = exports.SECPENCPayload = exports.SECPSIGPayload = exports.NODEIDPayload = exports.CHAINIDPayload = exports.ALLYCHAINIDPayload = exports.NFTIDPayload = exports.UTXOIDPayload = exports.ASSETIDPayload = exports.TXIDPayload = exports.cb58EncodedPayload = exports.AXCHAINADDRPayload = exports.CORECHAINADDRPayload = exports.SWAPCHAINADDRPayload = exports.ChainAddressPayload = exports.BIGNUMPayload = exports.B64STRPayload = exports.B58STRPayload = exports.HEXSTRPayload = exports.UTF8Payload = exports.BINPayload = exports.PayloadBase = exports.PayloadTypes = void 0;
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("./bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const errors_1 = require("../utils/errors");
const serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Class for determining payload types and managing the lookup table.
 */
class PayloadTypes {
    constructor() {
        this.types = [];
        this.types = [
            "BIN",
            "UTF8",
            "HEXSTR",
            "B58STR",
            "B64STR",
            "BIGNUM",
            "SWAPCHAINADDR",
            "CORECHAINADDR",
            "AXCHAINADDR",
            "TXID",
            "ASSETID",
            "UTXOID",
            "NFTID",
            "ALLYCHAINID",
            "CHAINID",
            "NODEID",
            "SECPSIG",
            "SECPENC",
            "JPEG",
            "PNG",
            "BMP",
            "ICO",
            "SVG",
            "CSV",
            "JSON",
            "YAML",
            "EMAIL",
            "URL",
            "IPFS",
            "ONION",
            "MAGNET"
        ];
    }
    /**
     * Given an encoded payload buffer returns the payload content (minus typeID).
     */
    getContent(payload) {
        const pl = bintools.copyFrom(payload, 5);
        return pl;
    }
    /**
     * Given an encoded payload buffer returns the payload (with typeID).
     */
    getPayload(payload) {
        const pl = bintools.copyFrom(payload, 4);
        return pl;
    }
    /**
     * Given a payload buffer returns the proper TypeID.
     */
    getTypeID(payload) {
        const offset = 4;
        const typeID = bintools
            .copyFrom(payload, offset, offset + 1)
            .readUInt8(0);
        return typeID;
    }
    /**
     * Given a type string returns the proper TypeID.
     */
    lookupID(typestr) {
        return this.types.indexOf(typestr);
    }
    /**
     * Given a TypeID returns a string describing the payload type.
     */
    lookupType(value) {
        return this.types[`${value}`];
    }
    /**
     * Given a TypeID returns the proper [[PayloadBase]].
     */
    select(typeID, ...args) {
        switch (typeID) {
            case 0:
                return new BINPayload(...args);
            case 1:
                return new UTF8Payload(...args);
            case 2:
                return new HEXSTRPayload(...args);
            case 3:
                return new B58STRPayload(...args);
            case 4:
                return new B64STRPayload(...args);
            case 5:
                return new BIGNUMPayload(...args);
            case 6:
                return new SWAPCHAINADDRPayload(...args);
            case 7:
                return new CORECHAINADDRPayload(...args);
            case 8:
                return new AXCHAINADDRPayload(...args);
            case 9:
                return new TXIDPayload(...args);
            case 10:
                return new ASSETIDPayload(...args);
            case 11:
                return new UTXOIDPayload(...args);
            case 12:
                return new NFTIDPayload(...args);
            case 13:
                return new ALLYCHAINIDPayload(...args);
            case 14:
                return new CHAINIDPayload(...args);
            case 15:
                return new NODEIDPayload(...args);
            case 16:
                return new SECPSIGPayload(...args);
            case 17:
                return new SECPENCPayload(...args);
            case 18:
                return new JPEGPayload(...args);
            case 19:
                return new PNGPayload(...args);
            case 20:
                return new BMPPayload(...args);
            case 21:
                return new ICOPayload(...args);
            case 22:
                return new SVGPayload(...args);
            case 23:
                return new CSVPayload(...args);
            case 24:
                return new JSONPayload(...args);
            case 25:
                return new YAMLPayload(...args);
            case 26:
                return new EMAILPayload(...args);
            case 27:
                return new URLPayload(...args);
            case 28:
                return new IPFSPayload(...args);
            case 29:
                return new ONIONPayload(...args);
            case 30:
                return new MAGNETPayload(...args);
        }
        throw new errors_1.TypeIdError(`Error - PayloadTypes.select: unknown typeid ${typeID}`);
    }
    /**
     * Given a [[PayloadBase]] which may not be cast properly, returns a properly cast [[PayloadBase]].
     */
    recast(unknowPayload) {
        return this.select(unknowPayload.typeID(), unknowPayload.returnType());
    }
    /**
     * Returns the [[PayloadTypes]] singleton.
     */
    static getInstance() {
        if (!PayloadTypes.instance) {
            PayloadTypes.instance = new PayloadTypes();
        }
        return PayloadTypes.instance;
    }
}
exports.PayloadTypes = PayloadTypes;
/**
 * Base class for payloads.
 */
class PayloadBase {
    constructor() {
        this.payload = buffer_1.Buffer.alloc(0);
        this.typeid = undefined;
    }
    /**
     * Returns the TypeID for the payload.
     */
    typeID() {
        return this.typeid;
    }
    /**
     * Returns the string name for the payload's type.
     */
    typeName() {
        return PayloadTypes.getInstance().lookupType(this.typeid);
    }
    /**
     * Returns the payload content (minus typeID).
     */
    getContent() {
        const pl = bintools.copyFrom(this.payload);
        return pl;
    }
    /**
     * Returns the payload (with typeID).
     */
    getPayload() {
        const typeID = buffer_1.Buffer.alloc(1);
        typeID.writeUInt8(this.typeid, 0);
        const pl = buffer_1.Buffer.concat([typeID, bintools.copyFrom(this.payload)]);
        return pl;
    }
    /**
     * Decodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    fromBuffer(bytes, offset = 0) {
        const size = bintools
            .copyFrom(bytes, offset, offset + 4)
            .readUInt32BE(0);
        offset += 4;
        this.typeid = bintools.copyFrom(bytes, offset, offset + 1).readUInt8(0);
        offset += 1;
        this.payload = bintools.copyFrom(bytes, offset, offset + size - 1);
        offset += size - 1;
        return offset;
    }
    /**
     * Encodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    toBuffer() {
        const sizebuff = buffer_1.Buffer.alloc(4);
        sizebuff.writeUInt32BE(this.payload.length + 1, 0);
        const typebuff = buffer_1.Buffer.alloc(1);
        typebuff.writeUInt8(this.typeid, 0);
        return buffer_1.Buffer.concat([sizebuff, typebuff, this.payload]);
    }
}
exports.PayloadBase = PayloadBase;
/**
 * Class for payloads representing simple binary blobs.
 */
class BINPayload extends PayloadBase {
    /**
     * @param payload Buffer only
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 0;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = bintools.b58ToBuffer(payload);
        }
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the payload.
     */
    returnType() {
        return this.payload;
    }
}
exports.BINPayload = BINPayload;
/**
 * Class for payloads representing UTF8 encoding.
 */
class UTF8Payload extends PayloadBase {
    /**
     * @param payload Buffer utf8 string
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 1;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = buffer_1.Buffer.from(payload, "utf8");
        }
    }
    /**
     * Returns a string for the payload.
     */
    returnType() {
        return this.payload.toString("utf8");
    }
}
exports.UTF8Payload = UTF8Payload;
/**
 * Class for payloads representing Hexadecimal encoding.
 */
class HEXSTRPayload extends PayloadBase {
    /**
     * @param payload Buffer or hex string
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 2;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            if (payload.startsWith("0x") || !payload.match(/^[0-9A-Fa-f]+$/)) {
                throw new errors_1.HexError("HEXSTRPayload.constructor -- hex string may not start with 0x and must be in /^[0-9A-Fa-f]+$/: " +
                    payload);
            }
            this.payload = buffer_1.Buffer.from(payload, "hex");
        }
    }
    /**
     * Returns a hex string for the payload.
     */
    returnType() {
        return this.payload.toString("hex");
    }
}
exports.HEXSTRPayload = HEXSTRPayload;
/**
 * Class for payloads representing Base58 encoding.
 */
class B58STRPayload extends PayloadBase {
    /**
     * @param payload Buffer or cb58 encoded string
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 3;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = bintools.b58ToBuffer(payload);
        }
    }
    /**
     * Returns a base58 string for the payload.
     */
    returnType() {
        return bintools.bufferToB58(this.payload);
    }
}
exports.B58STRPayload = B58STRPayload;
/**
 * Class for payloads representing Base64 encoding.
 */
class B64STRPayload extends PayloadBase {
    /**
     * @param payload Buffer of base64 string
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 4;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = buffer_1.Buffer.from(payload, "base64");
        }
    }
    /**
     * Returns a base64 string for the payload.
     */
    returnType() {
        return this.payload.toString("base64");
    }
}
exports.B64STRPayload = B64STRPayload;
/**
 * Class for payloads representing Big Numbers.
 *
 * @param payload Accepts a Buffer, BN, or base64 string
 */
class BIGNUMPayload extends PayloadBase {
    /**
     * @param payload Buffer, BN, or base64 string
     */
    constructor(payload = undefined) {
        super();
        this.typeid = 5;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (payload instanceof bn_js_1.default) {
            this.payload = bintools.fromBNToBuffer(payload);
        }
        else if (typeof payload === "string") {
            this.payload = buffer_1.Buffer.from(payload, "hex");
        }
    }
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the payload.
     */
    returnType() {
        return bintools.fromBufferToBN(this.payload);
    }
}
exports.BIGNUMPayload = BIGNUMPayload;
/**
 * Class for payloads representing chain addresses.
 *
 */
class ChainAddressPayload extends PayloadBase {
    /**
     * @param payload Buffer or address string
     */
    constructor(payload = undefined, hrp) {
        super();
        this.typeid = 6;
        this.chainid = "";
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            if (hrp != undefined) {
                this.payload = bintools.stringToAddress(payload, hrp);
            }
            else {
                this.payload = bintools.stringToAddress(payload);
            }
        }
    }
    /**
     * Returns the chainid.
     */
    returnChainID() {
        return this.chainid;
    }
    /**
     * Returns an address string for the payload.
     */
    returnType(hrp) {
        const type = "bech32";
        return serialization.bufferToType(this.payload, type, hrp, this.chainid);
    }
}
exports.ChainAddressPayload = ChainAddressPayload;
/**
 * Class for payloads representing Swap-Chain addresses.
 */
class SWAPCHAINADDRPayload extends ChainAddressPayload {
    constructor() {
        super(...arguments);
        this.typeid = 6;
        this.chainid = "Swap";
    }
}
exports.SWAPCHAINADDRPayload = SWAPCHAINADDRPayload;
/**
 * Class for payloads representing Core-Chain addresses.
 */
class CORECHAINADDRPayload extends ChainAddressPayload {
    constructor() {
        super(...arguments);
        this.typeid = 7;
        this.chainid = "Core";
    }
}
exports.CORECHAINADDRPayload = CORECHAINADDRPayload;
/**
 * Class for payloads representing AX-Chain addresses.
 */
class AXCHAINADDRPayload extends ChainAddressPayload {
    constructor() {
        super(...arguments);
        this.typeid = 8;
        this.chainid = "AX";
    }
}
exports.AXCHAINADDRPayload = AXCHAINADDRPayload;
/**
 * Class for payloads representing data serialized by bintools.cb58Encode().
 */
class cb58EncodedPayload extends PayloadBase {
    /**
     * Returns a bintools.cb58Encoded string for the payload.
     */
    returnType() {
        return bintools.cb58Encode(this.payload);
    }
    /**
     * @param payload Buffer or cb58 encoded string
     */
    constructor(payload = undefined) {
        super();
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = bintools.cb58Decode(payload);
        }
    }
}
exports.cb58EncodedPayload = cb58EncodedPayload;
/**
 * Class for payloads representing TxIDs.
 */
class TXIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 9;
    }
}
exports.TXIDPayload = TXIDPayload;
/**
 * Class for payloads representing AssetIDs.
 */
class ASSETIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 10;
    }
}
exports.ASSETIDPayload = ASSETIDPayload;
/**
 * Class for payloads representing NODEIDs.
 */
class UTXOIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 11;
    }
}
exports.UTXOIDPayload = UTXOIDPayload;
/**
 * Class for payloads representing NFTIDs (UTXOIDs in an NFT context).
 */
class NFTIDPayload extends UTXOIDPayload {
    constructor() {
        super(...arguments);
        this.typeid = 12;
    }
}
exports.NFTIDPayload = NFTIDPayload;
/**
 * Class for payloads representing AllychainIDs.
 */
class ALLYCHAINIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 13;
    }
}
exports.ALLYCHAINIDPayload = ALLYCHAINIDPayload;
/**
 * Class for payloads representing ChainIDs.
 */
class CHAINIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 14;
    }
}
exports.CHAINIDPayload = CHAINIDPayload;
/**
 * Class for payloads representing NodeIDs.
 */
class NODEIDPayload extends cb58EncodedPayload {
    constructor() {
        super(...arguments);
        this.typeid = 15;
    }
}
exports.NODEIDPayload = NODEIDPayload;
/**
 * Class for payloads representing secp256k1 signatures.
 * convention: secp256k1 signature (130 bytes)
 */
class SECPSIGPayload extends B58STRPayload {
    constructor() {
        super(...arguments);
        this.typeid = 16;
    }
}
exports.SECPSIGPayload = SECPSIGPayload;
/**
 * Class for payloads representing secp256k1 encrypted messages.
 * convention: public key (65 bytes) + secp256k1 encrypted message for that public key
 */
class SECPENCPayload extends B58STRPayload {
    constructor() {
        super(...arguments);
        this.typeid = 17;
    }
}
exports.SECPENCPayload = SECPENCPayload;
/**
 * Class for payloads representing JPEG images.
 */
class JPEGPayload extends BINPayload {
    constructor() {
        super(...arguments);
        this.typeid = 18;
    }
}
exports.JPEGPayload = JPEGPayload;
class PNGPayload extends BINPayload {
    constructor() {
        super(...arguments);
        this.typeid = 19;
    }
}
exports.PNGPayload = PNGPayload;
/**
 * Class for payloads representing BMP images.
 */
class BMPPayload extends BINPayload {
    constructor() {
        super(...arguments);
        this.typeid = 20;
    }
}
exports.BMPPayload = BMPPayload;
/**
 * Class for payloads representing ICO images.
 */
class ICOPayload extends BINPayload {
    constructor() {
        super(...arguments);
        this.typeid = 21;
    }
}
exports.ICOPayload = ICOPayload;
/**
 * Class for payloads representing SVG images.
 */
class SVGPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 22;
    }
}
exports.SVGPayload = SVGPayload;
/**
 * Class for payloads representing CSV files.
 */
class CSVPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 23;
    }
}
exports.CSVPayload = CSVPayload;
/**
 * Class for payloads representing JSON strings.
 */
class JSONPayload extends PayloadBase {
    constructor(payload = undefined) {
        super();
        this.typeid = 24;
        if (payload instanceof buffer_1.Buffer) {
            this.payload = payload;
        }
        else if (typeof payload === "string") {
            this.payload = buffer_1.Buffer.from(payload, "utf8");
        }
        else if (payload) {
            let jsonstr = JSON.stringify(payload);
            this.payload = buffer_1.Buffer.from(jsonstr, "utf8");
        }
    }
    /**
     * Returns a JSON-decoded object for the payload.
     */
    returnType() {
        return JSON.parse(this.payload.toString("utf8"));
    }
}
exports.JSONPayload = JSONPayload;
/**
 * Class for payloads representing YAML definitions.
 */
class YAMLPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 25;
    }
}
exports.YAMLPayload = YAMLPayload;
/**
 * Class for payloads representing email addresses.
 */
class EMAILPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 26;
    }
}
exports.EMAILPayload = EMAILPayload;
/**
 * Class for payloads representing URL strings.
 */
class URLPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 27;
    }
}
exports.URLPayload = URLPayload;
/**
 * Class for payloads representing IPFS addresses.
 */
class IPFSPayload extends B58STRPayload {
    constructor() {
        super(...arguments);
        this.typeid = 28;
    }
}
exports.IPFSPayload = IPFSPayload;
/**
 * Class for payloads representing onion URLs.
 */
class ONIONPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 29;
    }
}
exports.ONIONPayload = ONIONPayload;
/**
 * Class for payloads representing torrent magnet links.
 */
class MAGNETPayload extends UTF8Payload {
    constructor() {
        super(...arguments);
        this.typeid = 30;
    }
}
exports.MAGNETPayload = MAGNETPayload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF5bG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9wYXlsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7OztBQUVILG9DQUFnQztBQUNoQywwREFBaUM7QUFDakMsa0RBQXNCO0FBQ3RCLDRDQUF1RDtBQUN2RCwwREFBc0U7QUFFdEU7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRWhFOztHQUVHO0FBQ0gsTUFBYSxZQUFZO0lBd0l2QjtRQXRJVSxVQUFLLEdBQWEsRUFBRSxDQUFBO1FBdUk1QixJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsS0FBSztZQUNMLE1BQU07WUFDTixRQUFRO1lBQ1IsUUFBUTtZQUNSLFFBQVE7WUFDUixRQUFRO1lBQ1IsZUFBZTtZQUNmLGVBQWU7WUFDZixhQUFhO1lBQ2IsTUFBTTtZQUNOLFNBQVM7WUFDVCxRQUFRO1lBQ1IsT0FBTztZQUNQLGFBQWE7WUFDYixTQUFTO1lBQ1QsUUFBUTtZQUNSLFNBQVM7WUFDVCxTQUFTO1lBQ1QsTUFBTTtZQUNOLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSztZQUNMLEtBQUs7WUFDTCxLQUFLO1lBQ0wsTUFBTTtZQUNOLE1BQU07WUFDTixPQUFPO1lBQ1AsS0FBSztZQUNMLE1BQU07WUFDTixPQUFPO1lBQ1AsUUFBUTtTQUNULENBQUE7SUFDSCxDQUFDO0lBdEtEOztPQUVHO0lBQ0gsVUFBVSxDQUFDLE9BQWU7UUFDeEIsTUFBTSxFQUFFLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDaEQsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxVQUFVLENBQUMsT0FBZTtRQUN4QixNQUFNLEVBQUUsR0FB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LE1BQWEsVUFBVyxTQUFRLFdBQVc7SUFBM0M7O1FBQ1ksV0FBTSxHQUFHLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0NBQUE7QUFGRCxnQ0FFQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsYUFBYTtJQUE5Qzs7UUFDWSxXQUFNLEdBQUcsRUFBRSxDQUFBO0lBQ3ZCLENBQUM7Q0FBQTtBQUZELGtDQUVDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxXQUFXO0lBQTdDOztRQUNZLFdBQU0sR0FBRyxFQUFFLENBQUE7SUFDdkIsQ0FBQztDQUFBO0FBRkQsb0NBRUM7QUFFRDs7R0FFRztBQUNILE1BQWEsYUFBYyxTQUFRLFdBQVc7SUFBOUM7O1FBQ1ksV0FBTSxHQUFHLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0NBQUE7QUFGRCxzQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICogQG1vZHVsZSBVdGlscy1QYXlsb2FkXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxyXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4vYmludG9vbHNcIlxyXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcclxuaW1wb3J0IHsgVHlwZUlkRXJyb3IsIEhleEVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9yc1wiXHJcbmltcG9ydCB7IFNlcmlhbGl6YXRpb24sIFNlcmlhbGl6ZWRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL3NlcmlhbGl6YXRpb25cIlxyXG5cclxuLyoqXHJcbiAqIEBpZ25vcmVcclxuICovXHJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcclxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBkZXRlcm1pbmluZyBwYXlsb2FkIHR5cGVzIGFuZCBtYW5hZ2luZyB0aGUgbG9va3VwIHRhYmxlLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBheWxvYWRUeXBlcyB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFBheWxvYWRUeXBlc1xyXG4gIHByb3RlY3RlZCB0eXBlczogc3RyaW5nW10gPSBbXVxyXG5cclxuICAvKipcclxuICAgKiBHaXZlbiBhbiBlbmNvZGVkIHBheWxvYWQgYnVmZmVyIHJldHVybnMgdGhlIHBheWxvYWQgY29udGVudCAobWludXMgdHlwZUlEKS5cclxuICAgKi9cclxuICBnZXRDb250ZW50KHBheWxvYWQ6IEJ1ZmZlcik6IEJ1ZmZlciB7XHJcbiAgICBjb25zdCBwbDogQnVmZmVyID0gYmludG9vbHMuY29weUZyb20ocGF5bG9hZCwgNSlcclxuICAgIHJldHVybiBwbFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYW4gZW5jb2RlZCBwYXlsb2FkIGJ1ZmZlciByZXR1cm5zIHRoZSBwYXlsb2FkICh3aXRoIHR5cGVJRCkuXHJcbiAgICovXHJcbiAgZ2V0UGF5bG9hZChwYXlsb2FkOiBCdWZmZXIpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgcGw6IEJ1ZmZlciA9IGJpbnRvb2xzLmNvcHlGcm9tKHBheWxvYWQsIDQpXHJcbiAgICByZXR1cm4gcGxcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdpdmVuIGEgcGF5bG9hZCBidWZmZXIgcmV0dXJucyB0aGUgcHJvcGVyIFR5cGVJRC5cclxuICAgKi9cclxuICBnZXRUeXBlSUQocGF5bG9hZDogQnVmZmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG9mZnNldDogbnVtYmVyID0gNFxyXG4gICAgY29uc3QgdHlwZUlEOiBudW1iZXIgPSBiaW50b29sc1xyXG4gICAgICAuY29weUZyb20ocGF5bG9hZCwgb2Zmc2V0LCBvZmZzZXQgKyAxKVxyXG4gICAgICAucmVhZFVJbnQ4KDApXHJcbiAgICByZXR1cm4gdHlwZUlEXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHaXZlbiBhIHR5cGUgc3RyaW5nIHJldHVybnMgdGhlIHByb3BlciBUeXBlSUQuXHJcbiAgICovXHJcbiAgbG9va3VwSUQodHlwZXN0cjogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLnR5cGVzLmluZGV4T2YodHlwZXN0cilcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdpdmVuIGEgVHlwZUlEIHJldHVybnMgYSBzdHJpbmcgZGVzY3JpYmluZyB0aGUgcGF5bG9hZCB0eXBlLlxyXG4gICAqL1xyXG4gIGxvb2t1cFR5cGUodmFsdWU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy50eXBlc1tgJHt2YWx1ZX1gXVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSBUeXBlSUQgcmV0dXJucyB0aGUgcHJvcGVyIFtbUGF5bG9hZEJhc2VdXS5cclxuICAgKi9cclxuICBzZWxlY3QodHlwZUlEOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKTogUGF5bG9hZEJhc2Uge1xyXG4gICAgc3dpdGNoICh0eXBlSUQpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiBuZXcgQklOUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBVVEY4UGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBIRVhTVFJQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICByZXR1cm4gbmV3IEI1OFNUUlBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHJldHVybiBuZXcgQjY0U1RSUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDU6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCSUdOVU1QYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgNjpcclxuICAgICAgICByZXR1cm4gbmV3IFNXQVBDSEFJTkFERFJQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgNzpcclxuICAgICAgICByZXR1cm4gbmV3IENPUkVDSEFJTkFERFJQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgODpcclxuICAgICAgICByZXR1cm4gbmV3IEFYQ0hBSU5BRERSUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDk6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUWElEUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDEwOlxyXG4gICAgICAgIHJldHVybiBuZXcgQVNTRVRJRFBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAxMTpcclxuICAgICAgICByZXR1cm4gbmV3IFVUWE9JRFBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICByZXR1cm4gbmV3IE5GVElEUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDEzOlxyXG4gICAgICAgIHJldHVybiBuZXcgQUxMWUNIQUlOSURQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgMTQ6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDSEFJTklEUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDE1OlxyXG4gICAgICAgIHJldHVybiBuZXcgTk9ERUlEUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDE2OlxyXG4gICAgICAgIHJldHVybiBuZXcgU0VDUFNJR1BheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAxNzpcclxuICAgICAgICByZXR1cm4gbmV3IFNFQ1BFTkNQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgMTg6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBKUEVHUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDE5OlxyXG4gICAgICAgIHJldHVybiBuZXcgUE5HUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDIwOlxyXG4gICAgICAgIHJldHVybiBuZXcgQk1QUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDIxOlxyXG4gICAgICAgIHJldHVybiBuZXcgSUNPUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDIyOlxyXG4gICAgICAgIHJldHVybiBuZXcgU1ZHUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDIzOlxyXG4gICAgICAgIHJldHVybiBuZXcgQ1NWUGF5bG9hZCguLi5hcmdzKVxyXG4gICAgICBjYXNlIDI0OlxyXG4gICAgICAgIHJldHVybiBuZXcgSlNPTlBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAyNTpcclxuICAgICAgICByZXR1cm4gbmV3IFlBTUxQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgMjY6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFTUFJTFBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAyNzpcclxuICAgICAgICByZXR1cm4gbmV3IFVSTFBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAyODpcclxuICAgICAgICByZXR1cm4gbmV3IElQRlNQYXlsb2FkKC4uLmFyZ3MpXHJcbiAgICAgIGNhc2UgMjk6XHJcbiAgICAgICAgcmV0dXJuIG5ldyBPTklPTlBheWxvYWQoLi4uYXJncylcclxuICAgICAgY2FzZSAzMDpcclxuICAgICAgICByZXR1cm4gbmV3IE1BR05FVFBheWxvYWQoLi4uYXJncylcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBUeXBlSWRFcnJvcihcclxuICAgICAgYEVycm9yIC0gUGF5bG9hZFR5cGVzLnNlbGVjdDogdW5rbm93biB0eXBlaWQgJHt0eXBlSUR9YFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2l2ZW4gYSBbW1BheWxvYWRCYXNlXV0gd2hpY2ggbWF5IG5vdCBiZSBjYXN0IHByb3Blcmx5LCByZXR1cm5zIGEgcHJvcGVybHkgY2FzdCBbW1BheWxvYWRCYXNlXV0uXHJcbiAgICovXHJcbiAgcmVjYXN0KHVua25vd1BheWxvYWQ6IFBheWxvYWRCYXNlKTogUGF5bG9hZEJhc2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0KHVua25vd1BheWxvYWQudHlwZUlEKCksIHVua25vd1BheWxvYWQucmV0dXJuVHlwZSgpKVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgW1tQYXlsb2FkVHlwZXNdXSBzaW5nbGV0b24uXHJcbiAgICovXHJcbiAgc3RhdGljIGdldEluc3RhbmNlKCk6IFBheWxvYWRUeXBlcyB7XHJcbiAgICBpZiAoIVBheWxvYWRUeXBlcy5pbnN0YW5jZSkge1xyXG4gICAgICBQYXlsb2FkVHlwZXMuaW5zdGFuY2UgPSBuZXcgUGF5bG9hZFR5cGVzKClcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gUGF5bG9hZFR5cGVzLmluc3RhbmNlXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy50eXBlcyA9IFtcclxuICAgICAgXCJCSU5cIixcclxuICAgICAgXCJVVEY4XCIsXHJcbiAgICAgIFwiSEVYU1RSXCIsXHJcbiAgICAgIFwiQjU4U1RSXCIsXHJcbiAgICAgIFwiQjY0U1RSXCIsXHJcbiAgICAgIFwiQklHTlVNXCIsXHJcbiAgICAgIFwiU1dBUENIQUlOQUREUlwiLFxyXG4gICAgICBcIkNPUkVDSEFJTkFERFJcIixcclxuICAgICAgXCJBWENIQUlOQUREUlwiLFxyXG4gICAgICBcIlRYSURcIixcclxuICAgICAgXCJBU1NFVElEXCIsXHJcbiAgICAgIFwiVVRYT0lEXCIsXHJcbiAgICAgIFwiTkZUSURcIixcclxuICAgICAgXCJBTExZQ0hBSU5JRFwiLFxyXG4gICAgICBcIkNIQUlOSURcIixcclxuICAgICAgXCJOT0RFSURcIixcclxuICAgICAgXCJTRUNQU0lHXCIsXHJcbiAgICAgIFwiU0VDUEVOQ1wiLFxyXG4gICAgICBcIkpQRUdcIixcclxuICAgICAgXCJQTkdcIixcclxuICAgICAgXCJCTVBcIixcclxuICAgICAgXCJJQ09cIixcclxuICAgICAgXCJTVkdcIixcclxuICAgICAgXCJDU1ZcIixcclxuICAgICAgXCJKU09OXCIsXHJcbiAgICAgIFwiWUFNTFwiLFxyXG4gICAgICBcIkVNQUlMXCIsXHJcbiAgICAgIFwiVVJMXCIsXHJcbiAgICAgIFwiSVBGU1wiLFxyXG4gICAgICBcIk9OSU9OXCIsXHJcbiAgICAgIFwiTUFHTkVUXCJcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCYXNlIGNsYXNzIGZvciBwYXlsb2Fkcy5cclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYXlsb2FkQmFzZSB7XHJcbiAgcHJvdGVjdGVkIHBheWxvYWQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygwKVxyXG4gIHByb3RlY3RlZCB0eXBlaWQ6IG51bWJlciA9IHVuZGVmaW5lZFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBUeXBlSUQgZm9yIHRoZSBwYXlsb2FkLlxyXG4gICAqL1xyXG4gIHR5cGVJRCgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMudHlwZWlkXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgbmFtZSBmb3IgdGhlIHBheWxvYWQncyB0eXBlLlxyXG4gICAqL1xyXG4gIHR5cGVOYW1lKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gUGF5bG9hZFR5cGVzLmdldEluc3RhbmNlKCkubG9va3VwVHlwZSh0aGlzLnR5cGVpZClcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHBheWxvYWQgY29udGVudCAobWludXMgdHlwZUlEKS5cclxuICAgKi9cclxuICBnZXRDb250ZW50KCk6IEJ1ZmZlciB7XHJcbiAgICBjb25zdCBwbDogQnVmZmVyID0gYmludG9vbHMuY29weUZyb20odGhpcy5wYXlsb2FkKVxyXG4gICAgcmV0dXJuIHBsXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwYXlsb2FkICh3aXRoIHR5cGVJRCkuXHJcbiAgICovXHJcbiAgZ2V0UGF5bG9hZCgpOiBCdWZmZXIge1xyXG4gICAgY29uc3QgdHlwZUlEOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMSlcclxuICAgIHR5cGVJRC53cml0ZVVJbnQ4KHRoaXMudHlwZWlkLCAwKVxyXG4gICAgY29uc3QgcGw6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW3R5cGVJRCwgYmludG9vbHMuY29weUZyb20odGhpcy5wYXlsb2FkKV0pXHJcbiAgICByZXR1cm4gcGxcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERlY29kZXMgdGhlIHBheWxvYWQgYXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBpbmNsdWRpbmcgNCBieXRlcyBmb3IgdGhlIGxlbmd0aCBhbmQgVHlwZUlELlxyXG4gICAqL1xyXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHNpemU6IG51bWJlciA9IGJpbnRvb2xzXHJcbiAgICAgIC5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxyXG4gICAgICAucmVhZFVJbnQzMkJFKDApXHJcbiAgICBvZmZzZXQgKz0gNFxyXG4gICAgdGhpcy50eXBlaWQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyAxKS5yZWFkVUludDgoMClcclxuICAgIG9mZnNldCArPSAxXHJcbiAgICB0aGlzLnBheWxvYWQgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyBzaXplIC0gMSlcclxuICAgIG9mZnNldCArPSBzaXplIC0gMVxyXG4gICAgcmV0dXJuIG9mZnNldFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5jb2RlcyB0aGUgcGF5bG9hZCBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGluY2x1ZGluZyA0IGJ5dGVzIGZvciB0aGUgbGVuZ3RoIGFuZCBUeXBlSUQuXHJcbiAgICovXHJcbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcclxuICAgIGNvbnN0IHNpemVidWZmOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcclxuICAgIHNpemVidWZmLndyaXRlVUludDMyQkUodGhpcy5wYXlsb2FkLmxlbmd0aCArIDEsIDApXHJcbiAgICBjb25zdCB0eXBlYnVmZjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDEpXHJcbiAgICB0eXBlYnVmZi53cml0ZVVJbnQ4KHRoaXMudHlwZWlkLCAwKVxyXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoW3NpemVidWZmLCB0eXBlYnVmZiwgdGhpcy5wYXlsb2FkXSlcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGV4cGVjdGVkIHR5cGUgZm9yIHRoZSBwYXlsb2FkLlxyXG4gICAqL1xyXG4gIGFic3RyYWN0IHJldHVyblR5cGUoLi4uYXJnczogYW55KTogYW55XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgc2ltcGxlIGJpbmFyeSBibG9icy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBCSU5QYXlsb2FkIGV4dGVuZHMgUGF5bG9hZEJhc2Uge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAwXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIHBheWxvYWQuXHJcbiAgICovXHJcbiAgcmV0dXJuVHlwZSgpOiBCdWZmZXIge1xyXG4gICAgcmV0dXJuIHRoaXMucGF5bG9hZFxyXG4gIH1cclxuICAvKipcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBCdWZmZXIgb25seVxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHBheWxvYWQ6IGFueSA9IHVuZGVmaW5lZCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLnBheWxvYWQgPSBiaW50b29scy5iNThUb0J1ZmZlcihwYXlsb2FkKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgVVRGOCBlbmNvZGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVVEY4UGF5bG9hZCBleHRlbmRzIFBheWxvYWRCYXNlIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMVxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIGZvciB0aGUgcGF5bG9hZC5cclxuICAgKi9cclxuICByZXR1cm5UeXBlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXlsb2FkLnRvU3RyaW5nKFwidXRmOFwiKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBCdWZmZXIgdXRmOCBzdHJpbmdcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkgPSB1bmRlZmluZWQpIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBheWxvYWQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gQnVmZmVyLmZyb20ocGF5bG9hZCwgXCJ1dGY4XCIpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBIZXhhZGVjaW1hbCBlbmNvZGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBIRVhTVFJQYXlsb2FkIGV4dGVuZHMgUGF5bG9hZEJhc2Uge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBoZXggc3RyaW5nIGZvciB0aGUgcGF5bG9hZC5cclxuICAgKi9cclxuICByZXR1cm5UeXBlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5wYXlsb2FkLnRvU3RyaW5nKFwiaGV4XCIpXHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIEJ1ZmZlciBvciBoZXggc3RyaW5nXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IocGF5bG9hZDogYW55ID0gdW5kZWZpbmVkKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZiAocGF5bG9hZCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xyXG4gICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXlsb2FkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIGlmIChwYXlsb2FkLnN0YXJ0c1dpdGgoXCIweFwiKSB8fCAhcGF5bG9hZC5tYXRjaCgvXlswLTlBLUZhLWZdKyQvKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBIZXhFcnJvcihcclxuICAgICAgICAgIFwiSEVYU1RSUGF5bG9hZC5jb25zdHJ1Y3RvciAtLSBoZXggc3RyaW5nIG1heSBub3Qgc3RhcnQgd2l0aCAweCBhbmQgbXVzdCBiZSBpbiAvXlswLTlBLUZhLWZdKyQvOiBcIiArXHJcbiAgICAgICAgICAgIHBheWxvYWRcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wYXlsb2FkID0gQnVmZmVyLmZyb20ocGF5bG9hZCwgXCJoZXhcIilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEJhc2U1OCBlbmNvZGluZy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBCNThTVFJQYXlsb2FkIGV4dGVuZHMgUGF5bG9hZEJhc2Uge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAzXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBiYXNlNTggc3RyaW5nIGZvciB0aGUgcGF5bG9hZC5cclxuICAgKi9cclxuICByZXR1cm5UeXBlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gYmludG9vbHMuYnVmZmVyVG9CNTgodGhpcy5wYXlsb2FkKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBCdWZmZXIgb3IgY2I1OCBlbmNvZGVkIHN0cmluZ1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKHBheWxvYWQ6IGFueSA9IHVuZGVmaW5lZCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLnBheWxvYWQgPSBiaW50b29scy5iNThUb0J1ZmZlcihwYXlsb2FkKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgQmFzZTY0IGVuY29kaW5nLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEI2NFNUUlBheWxvYWQgZXh0ZW5kcyBQYXlsb2FkQmFzZSB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDRcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIGJhc2U2NCBzdHJpbmcgZm9yIHRoZSBwYXlsb2FkLlxyXG4gICAqL1xyXG4gIHJldHVyblR5cGUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnBheWxvYWQudG9TdHJpbmcoXCJiYXNlNjRcIilcclxuICB9XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHBheWxvYWQgQnVmZmVyIG9mIGJhc2U2NCBzdHJpbmdcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkgPSB1bmRlZmluZWQpIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBheWxvYWQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gQnVmZmVyLmZyb20ocGF5bG9hZCwgXCJiYXNlNjRcIilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEJpZyBOdW1iZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0gcGF5bG9hZCBBY2NlcHRzIGEgQnVmZmVyLCBCTiwgb3IgYmFzZTY0IHN0cmluZ1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJJR05VTVBheWxvYWQgZXh0ZW5kcyBQYXlsb2FkQmFzZSB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDVcclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGZvciB0aGUgcGF5bG9hZC5cclxuICAgKi9cclxuICByZXR1cm5UeXBlKCk6IEJOIHtcclxuICAgIHJldHVybiBiaW50b29scy5mcm9tQnVmZmVyVG9CTih0aGlzLnBheWxvYWQpXHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSBwYXlsb2FkIEJ1ZmZlciwgQk4sIG9yIGJhc2U2NCBzdHJpbmdcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkgPSB1bmRlZmluZWQpIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWRcclxuICAgIH0gZWxzZSBpZiAocGF5bG9hZCBpbnN0YW5jZW9mIEJOKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKHBheWxvYWQpXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXlsb2FkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IEJ1ZmZlci5mcm9tKHBheWxvYWQsIFwiaGV4XCIpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBjaGFpbiBhZGRyZXNzZXMuXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ2hhaW5BZGRyZXNzUGF5bG9hZCBleHRlbmRzIFBheWxvYWRCYXNlIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gNlxyXG4gIHByb3RlY3RlZCBjaGFpbmlkOiBzdHJpbmcgPSBcIlwiXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNoYWluaWQuXHJcbiAgICovXHJcbiAgcmV0dXJuQ2hhaW5JRCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhaW5pZFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhZGRyZXNzIHN0cmluZyBmb3IgdGhlIHBheWxvYWQuXHJcbiAgICovXHJcbiAgcmV0dXJuVHlwZShocnA6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBjb25zdCB0eXBlOiBTZXJpYWxpemVkVHlwZSA9IFwiYmVjaDMyXCJcclxuICAgIHJldHVybiBzZXJpYWxpemF0aW9uLmJ1ZmZlclRvVHlwZSh0aGlzLnBheWxvYWQsIHR5cGUsIGhycCwgdGhpcy5jaGFpbmlkKVxyXG4gIH1cclxuICAvKipcclxuICAgKiBAcGFyYW0gcGF5bG9hZCBCdWZmZXIgb3IgYWRkcmVzcyBzdHJpbmdcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkgPSB1bmRlZmluZWQsIGhycD86IHN0cmluZykge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBpZiAoaHJwICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMucGF5bG9hZCA9IGJpbnRvb2xzLnN0cmluZ1RvQWRkcmVzcyhwYXlsb2FkLCBocnApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gYmludG9vbHMuc3RyaW5nVG9BZGRyZXNzKHBheWxvYWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIFN3YXAtQ2hhaW4gYWRkcmVzc2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNXQVBDSEFJTkFERFJQYXlsb2FkIGV4dGVuZHMgQ2hhaW5BZGRyZXNzUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDZcclxuICBwcm90ZWN0ZWQgY2hhaW5pZCA9IFwiU3dhcFwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIENvcmUtQ2hhaW4gYWRkcmVzc2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENPUkVDSEFJTkFERFJQYXlsb2FkIGV4dGVuZHMgQ2hhaW5BZGRyZXNzUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDdcclxuICBwcm90ZWN0ZWQgY2hhaW5pZCA9IFwiQ29yZVwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEFYLUNoYWluIGFkZHJlc3Nlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBWENIQUlOQUREUlBheWxvYWQgZXh0ZW5kcyBDaGFpbkFkZHJlc3NQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gOFxyXG4gIHByb3RlY3RlZCBjaGFpbmlkID0gXCJBWFwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIGRhdGEgc2VyaWFsaXplZCBieSBiaW50b29scy5jYjU4RW5jb2RlKCkuXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgY2I1OEVuY29kZWRQYXlsb2FkIGV4dGVuZHMgUGF5bG9hZEJhc2Uge1xyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBiaW50b29scy5jYjU4RW5jb2RlZCBzdHJpbmcgZm9yIHRoZSBwYXlsb2FkLlxyXG4gICAqL1xyXG4gIHJldHVyblR5cGUoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBiaW50b29scy5jYjU4RW5jb2RlKHRoaXMucGF5bG9hZClcclxuICB9XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHBheWxvYWQgQnVmZmVyIG9yIGNiNTggZW5jb2RlZCBzdHJpbmdcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcihwYXlsb2FkOiBhbnkgPSB1bmRlZmluZWQpIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmIChwYXlsb2FkIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWRcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBheWxvYWQgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gYmludG9vbHMuY2I1OERlY29kZShwYXlsb2FkKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgVHhJRHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVFhJRFBheWxvYWQgZXh0ZW5kcyBjYjU4RW5jb2RlZFBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSA5XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEFzc2V0SURzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFTU0VUSURQYXlsb2FkIGV4dGVuZHMgY2I1OEVuY29kZWRQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMTBcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgTk9ERUlEcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVVFhPSURQYXlsb2FkIGV4dGVuZHMgY2I1OEVuY29kZWRQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMTFcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgTkZUSURzIChVVFhPSURzIGluIGFuIE5GVCBjb250ZXh0KS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBORlRJRFBheWxvYWQgZXh0ZW5kcyBVVFhPSURQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMTJcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgQWxseWNoYWluSURzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFMTFlDSEFJTklEUGF5bG9hZCBleHRlbmRzIGNiNThFbmNvZGVkUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDEzXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIENoYWluSURzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENIQUlOSURQYXlsb2FkIGV4dGVuZHMgY2I1OEVuY29kZWRQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMTRcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgTm9kZUlEcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBOT0RFSURQYXlsb2FkIGV4dGVuZHMgY2I1OEVuY29kZWRQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMTVcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgc2VjcDI1NmsxIHNpZ25hdHVyZXMuXHJcbiAqIGNvbnZlbnRpb246IHNlY3AyNTZrMSBzaWduYXR1cmUgKDEzMCBieXRlcylcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTRUNQU0lHUGF5bG9hZCBleHRlbmRzIEI1OFNUUlBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAxNlxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBzZWNwMjU2azEgZW5jcnlwdGVkIG1lc3NhZ2VzLlxyXG4gKiBjb252ZW50aW9uOiBwdWJsaWMga2V5ICg2NSBieXRlcykgKyBzZWNwMjU2azEgZW5jcnlwdGVkIG1lc3NhZ2UgZm9yIHRoYXQgcHVibGljIGtleVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNFQ1BFTkNQYXlsb2FkIGV4dGVuZHMgQjU4U1RSUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDE3XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEpQRUcgaW1hZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEpQRUdQYXlsb2FkIGV4dGVuZHMgQklOUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDE4XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQTkdQYXlsb2FkIGV4dGVuZHMgQklOUGF5bG9hZCB7XHJcbiAgcHJvdGVjdGVkIHR5cGVpZCA9IDE5XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBmb3IgcGF5bG9hZHMgcmVwcmVzZW50aW5nIEJNUCBpbWFnZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQk1QUGF5bG9hZCBleHRlbmRzIEJJTlBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyMFxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBJQ08gaW1hZ2VzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIElDT1BheWxvYWQgZXh0ZW5kcyBCSU5QYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMjFcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgU1ZHIGltYWdlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTVkdQYXlsb2FkIGV4dGVuZHMgVVRGOFBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyMlxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBDU1YgZmlsZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ1NWUGF5bG9hZCBleHRlbmRzIFVURjhQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMjNcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgSlNPTiBzdHJpbmdzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEpTT05QYXlsb2FkIGV4dGVuZHMgUGF5bG9hZEJhc2Uge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyNFxyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgSlNPTi1kZWNvZGVkIG9iamVjdCBmb3IgdGhlIHBheWxvYWQuXHJcbiAgICovXHJcbiAgcmV0dXJuVHlwZSgpOiBhbnkge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5wYXlsb2FkLnRvU3RyaW5nKFwidXRmOFwiKSlcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKHBheWxvYWQ6IGFueSA9IHVuZGVmaW5lZCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZFxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICB0aGlzLnBheWxvYWQgPSBCdWZmZXIuZnJvbShwYXlsb2FkLCBcInV0ZjhcIilcclxuICAgIH0gZWxzZSBpZiAocGF5bG9hZCkge1xyXG4gICAgICBsZXQganNvbnN0cjogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZClcclxuICAgICAgdGhpcy5wYXlsb2FkID0gQnVmZmVyLmZyb20oanNvbnN0ciwgXCJ1dGY4XCIpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBZQU1MIGRlZmluaXRpb25zLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFlBTUxQYXlsb2FkIGV4dGVuZHMgVVRGOFBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyNVxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBlbWFpbCBhZGRyZXNzZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRU1BSUxQYXlsb2FkIGV4dGVuZHMgVVRGOFBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyNlxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBVUkwgc3RyaW5ncy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBVUkxQYXlsb2FkIGV4dGVuZHMgVVRGOFBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyN1xyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBJUEZTIGFkZHJlc3Nlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBJUEZTUGF5bG9hZCBleHRlbmRzIEI1OFNUUlBheWxvYWQge1xyXG4gIHByb3RlY3RlZCB0eXBlaWQgPSAyOFxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgZm9yIHBheWxvYWRzIHJlcHJlc2VudGluZyBvbmlvbiBVUkxzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE9OSU9OUGF5bG9hZCBleHRlbmRzIFVURjhQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMjlcclxufVxyXG5cclxuLyoqXHJcbiAqIENsYXNzIGZvciBwYXlsb2FkcyByZXByZXNlbnRpbmcgdG9ycmVudCBtYWduZXQgbGlua3MuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTUFHTkVUUGF5bG9hZCBleHRlbmRzIFVURjhQYXlsb2FkIHtcclxuICBwcm90ZWN0ZWQgdHlwZWlkID0gMzBcclxufVxyXG4iXX0=