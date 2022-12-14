/**
 * @packageDocumentation
 * @module API-PlatformVM-AllychainAuth
 */
import { Buffer } from "buffer/";
import { Serializable, SerializedEncoding } from "../../utils";
export declare class AllychainAuth extends Serializable {
    protected _typeName: string;
    protected _typeID: number;
    serialize(encoding?: SerializedEncoding): object;
    deserialize(fields: object, encoding?: SerializedEncoding): void;
    /**
     * Add an address index for Allychain Auth signing
     *
     * @param index the Buffer of the address index to add
     */
    addAddressIndex(index: Buffer): void;
    /**
     * Returns the number of address indices as a number
     */
    getNumAddressIndices(): number;
    /**
     * Returns an array of AddressIndices as Buffers
     */
    getAddressIndices(): Buffer[];
    protected addressIndices: Buffer[];
    protected numAddressIndices: Buffer;
    fromBuffer(bytes: Buffer, offset?: number): number;
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[AllychainAuth]].
     */
    toBuffer(): Buffer;
}
//# sourceMappingURL=allychainauth.d.ts.map