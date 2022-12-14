/**
 * @packageDocumentation
 * @module API-PlatformVM-UTXOs
 */
import { Buffer } from "buffer/";
import BN from "bn.js";
import { TransferableOutput } from "./outputs";
import { TransferableInput } from "./inputs";
import { StandardUTXO, StandardUTXOSet } from "../../common/utxos";
import { UnsignedTx } from "./tx";
import { StandardAssetAmountDestination } from "../../common/assetamount";
import { Output } from "../../common/output";
import { SerializedEncoding } from "../../utils/serialization";
import { GenesisData } from "../avm";
/**
 * Class for representing a single UTXO.
 */
export declare class UTXO extends StandardUTXO {
    protected _typeName: string;
    protected _typeID: any;
    deserialize(fields: object, encoding?: SerializedEncoding): void;
    fromBuffer(bytes: Buffer, offset?: number): number;
    /**
     * Takes a base-58 string containing a [[UTXO]], parses it, populates the class, and returns the length of the StandardUTXO in bytes.
     *
     * @param serialized A base-58 string containing a raw [[UTXO]]
     *
     * @returns The length of the raw [[UTXO]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    fromString(serialized: string): number;
    /**
     * Returns a base-58 representation of the [[UTXO]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    toString(): string;
    clone(): this;
    create(codecID?: number, txid?: Buffer, outputidx?: Buffer | number, assetID?: Buffer, output?: Output): this;
}
export declare class AssetAmountDestination extends StandardAssetAmountDestination<TransferableOutput, TransferableInput> {
}
/**
 * Class representing a set of [[UTXO]]s.
 */
export declare class UTXOSet extends StandardUTXOSet<UTXO> {
    protected _typeName: string;
    protected _typeID: any;
    deserialize(fields: object, encoding?: SerializedEncoding): void;
    parseUTXO(utxo: UTXO | string): UTXO;
    create(...args: any[]): this;
    clone(): this;
    _feeCheck(fee: BN, feeAssetID: Buffer): boolean;
    getConsumableUXTO: (asOf?: BN, stakeable?: boolean) => UTXO[];
    getMinimumSpendable: (aad: AssetAmountDestination, asOf?: BN, locktime?: BN, threshold?: number, stakeable?: boolean) => Error;
    /**
     * Creates an [[UnsignedTx]] wrapping a [[BaseTx]]. For more granular control, you may create your own
     * [[UnsignedTx]] wrapping a [[BaseTx]] manually (with their corresponding [[TransferableInput]]s and [[TransferableOutput]]s).
     *
     * @param networkID The number representing NetworkID of the node
     * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
     * @param amount The amount of the asset to be spent in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}.
     * @param assetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for the UTXO
     * @param toAddresses The addresses to send the funds
     * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
     * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned. Default: assetID
     * @param memo Optional. Contains arbitrary data, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     * @param locktime Optional. The locktime field created in the resulting outputs
     * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
     *
     * @returns An unsigned transaction created from the passed in parameters.
     *
     */
    buildBaseTx: (networkID: number, blockchainID: Buffer, amount: BN, assetID: Buffer, toAddresses: Buffer[], fromAddresses: Buffer[], changeAddresses?: Buffer[], fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN, locktime?: BN, threshold?: number) => UnsignedTx;
    /**
     * Creates an unsigned ImportTx transaction.
     *
     * @param networkID The number representing NetworkID of the node
     * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
     * @param toAddresses The addresses to send the funds
     * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
     * @param changeAddresses Optional. The addresses that can spend the change remaining from the spent UTXOs. Default: toAddresses
     * @param importIns An array of [[TransferableInput]]s being imported
     * @param sourceChain A {@link https://github.com/feross/buffer|Buffer} for the chainid where the imports are coming from.
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}. Fee will come from the inputs first, if they can.
     * @param feeAssetID Optional. The assetID of the fees being burned.
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     * @param locktime Optional. The locktime field created in the resulting outputs
     * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
     * @returns An unsigned transaction created from the passed in parameters.
     *
     */
    buildImportTx: (networkID: number, blockchainID: Buffer, toAddresses: Buffer[], fromAddresses: Buffer[], changeAddresses: Buffer[], atomics: UTXO[], sourceChain?: Buffer, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN, locktime?: BN, threshold?: number) => UnsignedTx;
    /**
     * Creates an unsigned ExportTx transaction.
     *
     * @param networkID The number representing NetworkID of the node
     * @param blockchainID The {@link https://github.com/feross/buffer|Buffer} representing the BlockchainID for the transaction
     * @param amount The amount being exported as a {@link https://github.com/indutny/bn.js/|BN}
     * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
     * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who recieves the AXC
     * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who owns the AXC
     * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover of the AXC
     * @param destinationChain Optional. A {@link https://github.com/feross/buffer|Buffer} for the chainid where to send the asset.
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned.
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     * @param locktime Optional. The locktime field created in the resulting outputs
     * @param threshold Optional. The number of signatures required to spend the funds in the resultant UTXO
     *
     * @returns An unsigned transaction created from the passed in parameters.
     *
     */
    buildExportTx: (networkID: number, blockchainID: Buffer, amount: BN, axcAssetID: Buffer, toAddresses: Buffer[], fromAddresses: Buffer[], changeAddresses?: Buffer[], destinationChain?: Buffer, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN, locktime?: BN, threshold?: number) => UnsignedTx;
    /**
     * Class representing an unsigned [[AddAllychainValidatorTx]] transaction.
     *
     * @param networkID Networkid, [[DefaultNetworkID]]
     * @param blockchainID Blockchainid, default undefined
     * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees in AXC
     * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the fee payment
     * @param nodeID The node ID of the validator being added.
     * @param startTime The Unix time when the validator starts validating the Primary Network.
     * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param weight The amount of weight for this allychain validator.
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned.
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
     *
     * @returns An unsigned transaction created from the passed in parameters.
     */
    buildAddAllychainValidatorTx: (networkID: number, blockchainID: Buffer, fromAddresses: Buffer[], changeAddresses: Buffer[], nodeID: Buffer, startTime: BN, endTime: BN, weight: BN, allychainID: string, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN, allychainAuthCredentials?: [number, Buffer][]) => UnsignedTx;
    /**
     * Class representing an unsigned [[AddNominatorTx]] transaction.
     *
     * @param networkID Networkid, [[DefaultNetworkID]]
     * @param blockchainID Blockchainid, default undefined
     * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
     * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
     * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
     * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
     * @param nodeID The node ID of the validator being added.
     * @param startTime The Unix time when the validator starts validating the Primary Network.
     * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be nominated in nAXC.
     * @param rewardLocktime The locktime field created in the resulting reward outputs
     * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
     * @param rewardAddresses The addresses the validator reward goes.
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned.
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     *
     * @returns An unsigned transaction created from the passed in parameters.
     */
    buildAddNominatorTx: (networkID: number, blockchainID: Buffer, axcAssetID: Buffer, toAddresses: Buffer[], fromAddresses: Buffer[], changeAddresses: Buffer[], nodeID: Buffer, startTime: BN, endTime: BN, stakeAmount: BN, rewardLocktime: BN, rewardThreshold: number, rewardAddresses: Buffer[], fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN) => UnsignedTx;
    /**
     * Class representing an unsigned [[AddValidatorTx]] transaction.
     *
     * @param networkID NetworkID, [[DefaultNetworkID]]
     * @param blockchainID BlockchainID, default undefined
     * @param axcAssetID {@link https://github.com/feross/buffer|Buffer} of the asset ID for AXC
     * @param toAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} recieves the stake at the end of the staking period
     * @param fromAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who pays the fees and the stake
     * @param changeAddresses An array of addresses as {@link https://github.com/feross/buffer|Buffer} who gets the change leftover from the staking payment
     * @param nodeID The node ID of the validator being added.
     * @param startTime The Unix time when the validator starts validating the Primary Network.
     * @param endTime The Unix time when the validator stops validating the Primary Network (and staked AXC is returned).
     * @param stakeAmount A {@link https://github.com/indutny/bn.js/|BN} for the amount of stake to be nominated in nAXC.
     * @param rewardLocktime The locktime field created in the resulting reward outputs
     * @param rewardThreshold The number of signatures required to spend the funds in the resultant reward UTXO
     * @param rewardAddresses The addresses the validator reward goes.
     * @param nominationFee A number for the percentage of reward to be given to the validator when someone nominates to them. Must be between 0 and 100.
     * @param minStake A {@link https://github.com/indutny/bn.js/|BN} representing the minimum stake required to validate on this network.
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned.
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     *
     * @returns An unsigned transaction created from the passed in parameters.
     */
    buildAddValidatorTx: (networkID: number, blockchainID: Buffer, axcAssetID: Buffer, toAddresses: Buffer[], fromAddresses: Buffer[], changeAddresses: Buffer[], nodeID: Buffer, startTime: BN, endTime: BN, stakeAmount: BN, rewardLocktime: BN, rewardThreshold: number, rewardAddresses: Buffer[], nominationFee: number, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN) => UnsignedTx;
    /**
     * Class representing an unsigned [[CreateAllychainTx]] transaction.
     *
     * @param networkID Networkid, [[DefaultNetworkID]]
     * @param blockchainID Blockchainid, default undefined
     * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
     * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
     * @param allychainOwnerAddresses An array of {@link https://github.com/feross/buffer|Buffer} for the addresses to add to a allychain
     * @param allychainOwnerThreshold The number of owners's signatures required to add a validator to the network
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     *
     * @returns An unsigned transaction created from the passed in parameters.
     */
    buildCreateAllychainTx: (networkID: number, blockchainID: Buffer, fromAddresses: Buffer[], changeAddresses: Buffer[], allychainOwnerAddresses: Buffer[], allychainOwnerThreshold: number, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN) => UnsignedTx;
    /**
     * Build an unsigned [[CreateChainTx]].
     *
     * @param networkID Networkid, [[DefaultNetworkID]]
     * @param blockchainID Blockchainid, default undefined
     * @param fromAddresses The addresses being used to send the funds from the UTXOs {@link https://github.com/feross/buffer|Buffer}
     * @param changeAddresses The addresses that can spend the change remaining from the spent UTXOs.
     * @param allychainID Optional ID of the Allychain that validates this blockchain
     * @param chainName Optional A human readable name for the chain; need not be unique
     * @param vmID Optional ID of the VM running on the new chain
     * @param fxIDs Optional IDs of the feature extensions running on the new chain
     * @param genesisData Optional Byte representation of genesis state of the new chain
     * @param fee Optional. The amount of fees to burn in its smallest denomination, represented as {@link https://github.com/indutny/bn.js/|BN}
     * @param feeAssetID Optional. The assetID of the fees being burned
     * @param memo Optional contains arbitrary bytes, up to 256 bytes
     * @param asOf Optional. The timestamp to verify the transaction against as a {@link https://github.com/indutny/bn.js/|BN}
     * @param allychainAuthCredentials Optional. An array of index and address to sign for each AllychainAuth.
     *
     * @returns An unsigned CreateChainTx created from the passed in parameters.
     */
    buildCreateChainTx: (networkID: number, blockchainID: Buffer, fromAddresses: Buffer[], changeAddresses: Buffer[], allychainID?: string | Buffer, chainName?: string, vmID?: string, fxIDs?: string[], genesisData?: string | GenesisData, fee?: BN, feeAssetID?: Buffer, memo?: Buffer, asOf?: BN, allychainAuthCredentials?: [number, Buffer][]) => UnsignedTx;
}
//# sourceMappingURL=utxos.d.ts.map