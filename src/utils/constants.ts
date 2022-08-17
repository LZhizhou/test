/**
 * @packageDocumentation
 * @module Utils-Constants
 */

import BN from "bn.js"

export const PrivateKeyPrefix: string = "PrivateKey-"
export const NodeIDPrefix: string = "NodeID-"
export const PrimaryAssetAlias: string = "AXC"
export const MainnetAPI: string = "1.p2p-v2.mainnet.axiacoin.network"
export const TestnetAPI: string = "1.p2p-v2.testnet.axiacoin.network"

export interface AX {
  blockchainID: string
  alias: string
  vm: string
  fee?: BN
  gasPrice: BN | number
  chainID?: number
  minGasPrice?: BN
  maxGasPrice?: BN
  txBytesGas?: number
  costPerSignature?: number
  txFee?: BN
  axcAssetID?: string
}
export interface Swap {
  blockchainID: string
  alias: string
  vm: string
  creationTxFee: BN | number
  mintTxFee: BN
  axcAssetID?: string
  txFee?: BN | number
  fee?: BN
}
export interface Core {
  blockchainID: string
  alias: string
  vm: string
  creationTxFee: BN | number
  createAllychainTx: BN | number
  createChainTx: BN | number
  minConsumption: number
  maxConsumption: number
  maxStakingDuration: BN
  maxSupply: BN
  minStake: BN
  minStakeDuration: number
  maxStakeDuration: number
  minNominationStake: BN
  minNominationFee: BN
  axcAssetID?: string
  txFee?: BN | number
  fee?: BN
}
export interface Network {
  AX: AX
  hrp: string
  Swap: Swap
  Core: Core
  [key: string]: AX | Swap | Core | string
}
export interface Networks {
  [key: number]: Network
}

export const NetworkIDToHRP: object = {
  0: "custom",
  1: "axc",
  5: "test",
  12345: "local"
}

export const HRPToNetworkID: object = {
  custom: 0,
  axc: 1,
  test: 5,
  local: 12345
}

export const NetworkIDToNetworkNames: object = {
  0: ["Custom"],
  1: ["Mainnet"],
  5: ["Testnet"],
  12345: ["Local Network"]
}

export const NetworkNameToNetworkID: object = {
  Custom: 0,
  Mainnet: 1,
  Testnet: 5,
  Local: 12345,
  "Local Network": 12345
}

export const FallbackHRP: string = "custom"
export const FallbackNetworkName: string = "Custom Network"
export const FallbackEVMChainID: number = 4000

export const DefaultNetworkID: number = 1

export const PlatformChainID: string = "11111111111111111111111111111111LpoYY"
export const PrimaryNetworkID: string = "11111111111111111111111111111111LpoYY"
export const SwapChainAlias: string = "Swap"
export const AXChainAlias: string = "AX"
export const CoreChainAlias: string = "Core"
export const SwapChainVMName: string = "avm"
export const AXChainVMName: string = "evm"
export const CoreChainVMName: string = "platformvm"

// DO NOT use the following private keys and/or mnemonic on Testnet
// This address/account is for testing on the local avash network
export const DefaultLocalGenesisPrivateKey: string =
  "ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
export const DefaultEVMLocalGenesisPrivateKey: string =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027"
export const DefaultEVMLocalGenesisAddress: string =
  "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
export const mnemonic: string =
  "output tooth keep tooth bracket fox city sustain blood raise install pond stem reject long scene clap gloom purpose mean music piece unknown light"

export const ONEAXC: BN = new BN(1000000000)

export const DECIAXC: BN = ONEAXC.div(new BN(10))

export const CENTIAXC: BN = ONEAXC.div(new BN(100))

export const MILLIAXC: BN = ONEAXC.div(new BN(1000))

export const MICROAXC: BN = ONEAXC.div(new BN(1000000))

export const NANOAXC: BN = ONEAXC.div(new BN(1000000000))

export const WEI: BN = new BN(1)

export const GWEI: BN = WEI.mul(new BN(1000000000))

export const AXCGWEI: BN = NANOAXC.clone()

export const AXCSTAKECAP: BN = ONEAXC.mul(new BN(3000000))

// Start Manhattan
const n0X: Swap = {
  blockchainID: "2vrXWHgGxh5n3YsLHMV16YVVJTpT4z45Fmb4y3bL6si8kLCyg9",
  alias: SwapChainAlias,
  vm: SwapChainVMName,
  fee: MILLIAXC,
  creationTxFee: CENTIAXC,
  mintTxFee: MILLIAXC
}

const n0P: Core = {
  blockchainID: PlatformChainID,
  alias: CoreChainAlias,
  vm: CoreChainVMName,
  fee: MILLIAXC,
  creationTxFee: CENTIAXC,
  createAllychainTx: ONEAXC,
  createChainTx: ONEAXC,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(31536000),
  maxSupply: new BN(720000000).mul(ONEAXC),
  minStake: ONEAXC.mul(new BN(2000)),
  minStakeDuration: 2 * 7 * 24 * 60 * 60, //two weeks
  maxStakeDuration: 365 * 24 * 60 * 60, // one year
  minNominationStake: ONEAXC.mul(new BN(25)),
  minNominationFee: new BN(2)
}

const n0C: AX = {
  blockchainID: "2fFZQibQXcd6LTE4rpBPBAkLVXFE91Kit8pgxaBG1mRnh5xqbb",
  alias: AXChainAlias,
  vm: AXChainVMName,
  fee: MILLIAXC,
  gasPrice: GWEI.mul(new BN(470)), //equivalent to gas price
  chainID: 43111
}
// End Manhattan

// Start mainnet
let axcAssetID: string = "ypDVoa1EjKYkhAA43vB1iuN1TPWzbYTVsSWFtFg996119SfZB"
const n1X: Swap = {
  blockchainID: "2gsjn1dfxHRCcc1WQZPbjRWCAp5H6Dro7hy2ZbX6b5dF8WtDRz",
  axcAssetID: axcAssetID,
  alias: SwapChainAlias,
  vm: SwapChainVMName,
  txFee: MILLIAXC,
  creationTxFee: CENTIAXC,
  mintTxFee: MILLIAXC
}

const n1P: Core = {
  blockchainID: PlatformChainID,
  axcAssetID: axcAssetID,
  alias: CoreChainAlias,
  vm: CoreChainVMName,
  txFee: MILLIAXC,
  createAllychainTx: ONEAXC,
  createChainTx: ONEAXC,
  creationTxFee: CENTIAXC,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(63072000),
  maxSupply: new BN(180000000000).mul(ONEAXC),
  minStake: ONEAXC.mul(new BN(1000000)),
  minStakeDuration: 120 * 24 * 60 * 60, // four months
  maxStakeDuration: 2 * 365 * 24 * 60 * 60, // two year
  minNominationStake: ONEAXC.mul(new BN(20)),
  minNominationFee: new BN(2)
}

const n1C: AX = {
  blockchainID: "7Dv3yn5r758b198H43SSAc5Cfqqzc6brFtqiCFHDCNDXG3Ypj",
  alias: AXChainAlias,
  vm: AXChainVMName,
  txBytesGas: 1,
  costPerSignature: 1000,
  // DEPRECATED - txFee
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  txFee: MILLIAXC,
  // DEPRECATED - gasPrice
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  gasPrice: GWEI.mul(new BN(225)),
  minGasPrice: GWEI.mul(new BN(25)),
  maxGasPrice: GWEI.mul(new BN(1000)),
  chainID: 4001
}
// End Mainnet

// Start Testnet
axcAssetID = "PWKAq5FttsA6RBC9FEqvexuxMEgFcLSJ2k9KQBAJwjxCSfrP9"
const n5X: Swap = {
  blockchainID: "1HvMnRTHEhkQjrJrx9XyYpwtEM8MoHZwpnwvuEber6U4jBaJ8",
  axcAssetID: axcAssetID,
  alias: SwapChainAlias,
  vm: SwapChainVMName,
  txFee: MILLIAXC,
  creationTxFee: CENTIAXC,
  mintTxFee: MILLIAXC
}

const n5P: Core = {
  blockchainID: PlatformChainID,
  axcAssetID: axcAssetID,
  alias: CoreChainAlias,
  vm: CoreChainVMName,
  txFee: MILLIAXC,
  creationTxFee: CENTIAXC,
  createAllychainTx: ONEAXC,
  createChainTx: ONEAXC,
  minConsumption: 0.1,
  maxConsumption: 0.12,
  maxStakingDuration: new BN(63072000),
  maxSupply: new BN(180000000000).mul(ONEAXC),
  minStake: ONEAXC.mul(new BN(1000000)),
  minStakeDuration: 120 * 24 * 60 * 60, // four months
  maxStakeDuration: 2 * 365 * 24 * 60 * 60, // two year
  minNominationStake: ONEAXC.mul(new BN(20)),
  minNominationFee: new BN(2)
}

const n5C: AX = {
  blockchainID: "2FxLTzBfdifgZhseyFGkTscsgW2xtReT2cG2oSJemmBWJJnQg2",
  alias: AXChainAlias,
  vm: AXChainVMName,
  txBytesGas: 1,
  costPerSignature: 1000,
  // DEPRECATED - txFee
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  txFee: MILLIAXC,
  // DEPRECATED - gasPrice
  // WILL BE REMOVED IN NEXT MAJOR VERSION BUMP
  gasPrice: GWEI.mul(new BN(225)),
  minGasPrice: GWEI.mul(new BN(25)),
  maxGasPrice: GWEI.mul(new BN(1000)),
  chainID: 4000
}
// End Testnet

// Start local network
axcAssetID = "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe"
const n12345X: Swap = { ...n5X }
n12345X.blockchainID = "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
n12345X.axcAssetID = axcAssetID
const n12345P: Core = { ...n5P }
n12345P.blockchainID = PlatformChainID
const n12345C: AX = { ...n5C }
n12345C.blockchainID = "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU"
n12345C.axcAssetID = axcAssetID
n12345C.chainID = 43112
// End local network

export class Defaults {
  static network: Networks = {
    0: {
      hrp: NetworkIDToHRP[0],
      Swap: n0X,
      "2vrXWHgGxh5n3YsLHMV16YVVJTpT4z45Fmb4y3bL6si8kLCyg9": n0X,
      Core: n0P,
      "11111111111111111111111111111111LpoYY": n0P,
      AX: n0C,
      "2fFZQibQXcd6LTE4rpBPBAkLVXFE91Kit8pgxaBG1mRnh5xqbb": n0C
    },
    1: {
      hrp: NetworkIDToHRP[1],
      Swap: n1X,
      "2gsjn1dfxHRCcc1WQZPbjRWCAp5H6Dro7hy2ZbX6b5dF8WtDRz": n1X,
      Core: n1P,
      "11111111111111111111111111111111LpoYY": n1P,
      AX: n1C,
      "7Dv3yn5r758b198H43SSAc5Cfqqzc6brFtqiCFHDCNDXG3Ypj": n1C
    },
    5: {
      hrp: exports.NetworkIDToHRP[5],
      Swap: n5X,
      "1HvMnRTHEhkQjrJrx9XyYpwtEM8MoHZwpnwvuEber6U4jBaJ8": n5X,
      Core: n5P,
      "11111111111111111111111111111111LpoYY": n5P,
      AX: n5C,
      "2FxLTzBfdifgZhseyFGkTscsgW2xtReT2cG2oSJemmBWJJnQg2": n5C
    },
    12345: {
      hrp: NetworkIDToHRP[12345],
      Swap: n12345X,
      "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed": n12345X,
      Core: n12345P,
      "11111111111111111111111111111111LpoYY": n12345P,
      AX: n12345C,
      "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU": n12345C
    }
  }
}

/**
 * Rules used when merging sets
 */
export type MergeRule =
  | "intersection" // Self INTERSECT New
  | "differenceSelf" // Self MINUS New
  | "differenceNew" // New MINUS Self
  | "symDifference" // differenceSelf UNION differenceNew
  | "union" // Self UNION New
  | "unionMinusNew" // union MINUS differenceNew
  | "unionMinusSelf" // union MINUS differenceSelf
  | "ERROR" // generate error for testing
