/**
 * @packageDocumentation
 * @module API-PlatformVM-KeyChain
 */
import { Buffer } from "buffer/";
import { SECP256k1KeyChain, SECP256k1KeyPair } from "../../common/secp256k1";
/**
 * Class for representing a private and public keypair on the Platform Chain.
 */
export declare class KeyPair extends SECP256k1KeyPair {
    clone(): this;
    create(...args: any[]): this;
}
/**
 * Class for representing a key chain in Axia.
 *
 * @typeparam KeyPair Class extending [[KeyPair]] which is used as the key in [[KeyChain]]
 */
export declare class KeyChain extends SECP256k1KeyChain<KeyPair> {
    hrp: string;
    chainID: string;
    /**
     * Makes a new key pair, returns the address.
     *
     * @returns The new key pair
     */
    makeKey: () => KeyPair;
    addKey: (newKey: KeyPair) => void;
    /**
     * Given a private key, makes a new key pair, returns the address.
     *
     * @param privk A {@link https://github.com/feross/buffer|Buffer} or cb58 serialized string representing the private key
     *
     * @returns The new key pair
     */
    importKey: (privk: Buffer | string) => KeyPair;
    create(...args: any[]): this;
    clone(): this;
    union(kc: this): this;
    /**
     * Returns instance of KeyChain.
     */
    constructor(hrp: string, chainID: string);
}
//# sourceMappingURL=keychain.d.ts.map