/**
 * @packageDocumentation
 * @module API-PlatformVM-AddAllychainValidatorTx
 */
import { Buffer } from "buffer/";
import { TransferableOutput } from "./outputs";
import { TransferableInput } from "./inputs";
import { Credential, SigIdx } from "../../common/credentials";
import { BaseTx } from "./basetx";
import { SerializedEncoding } from "../../utils/serialization";
import { AllychainAuth } from ".";
import { KeyChain } from "./keychain";
import BN from "bn.js";
/**
 * Class representing an unsigned AddAllychainValidatorTx transaction.
 */
export declare class AddAllychainValidatorTx extends BaseTx {
    protected _typeName: string;
    protected _typeID: number;
    serialize(encoding?: SerializedEncoding): object;
    deserialize(fields: object, encoding?: SerializedEncoding): void;
    protected nodeID: Buffer;
    protected startTime: Buffer;
    protected endTime: Buffer;
    protected weight: Buffer;
    protected allychainID: Buffer;
    protected allychainAuth: AllychainAuth;
    protected sigCount: Buffer;
    protected sigIdxs: SigIdx[];
    /**
     * Returns the id of the [[AddAllychainValidatorTx]]
     */
    getTxType(): number;
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the stake amount.
     */
    getNodeID(): Buffer;
    /**
     * Returns a string for the nodeID amount.
     */
    getNodeIDString(): string;
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the startTime.
     */
    getStartTime(): BN;
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the endTime.
     */
    getEndTime(): BN;
    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the weight
     */
    getWeight(): BN;
    /**
     * Returns the allychainID as a string
     */
    getAllychainID(): string;
    /**
     * Returns the allychainAuth
     */
    getAllychainAuth(): AllychainAuth;
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[AddAllychainValidatorTx]], parses it, populates the class, and returns the length of the [[CreateChainTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[AddAllychainValidatorTx]]
     *
     * @returns The length of the raw [[AddAllychainValidatorTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes: Buffer, offset?: number): number;
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[CreateChainTx]].
     */
    toBuffer(): Buffer;
    clone(): this;
    create(...args: any[]): this;
    /**
     * Creates and adds a [[SigIdx]] to the [[AddAllychainValidatorTx]].
     *
     * @param addressIdx The index of the address to reference in the signatures
     * @param address The address of the source of the signature
     */
    addSignatureIdx(addressIdx: number, address: Buffer): void;
    /**
     * Returns the array of [[SigIdx]] for this [[Input]]
     */
    getSigIdxs(): SigIdx[];
    getCredentialID(): number;
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    sign(msg: Buffer, kc: KeyChain): Credential[];
    /**
     * Class representing an unsigned CreateChain transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param nodeID Optional. The node ID of the validator being added.
     * @param startTime Optional. The Unix time when the validator starts validating the Primary Network.
     * @param endTime Optional. The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param weight Optional. Weight of this validator used when sampling
     * @param allychainID Optional. ID of the allychain this validator is validating
     */
    constructor(networkID?: number, blockchainID?: Buffer, outs?: TransferableOutput[], ins?: TransferableInput[], memo?: Buffer, nodeID?: Buffer, startTime?: BN, endTime?: BN, weight?: BN, allychainID?: string | Buffer);
}
//# sourceMappingURL=addallychainvalidatortx.d.ts.map