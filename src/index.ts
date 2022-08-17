/**
 * @packageDocumentation
 * @module Axia
 */
import AxiaCore from "./axia"
import { AdminAPI } from "./apis/admin/api"
import { AuthAPI } from "./apis/auth/api"
import { AVMAPI } from "./apis/avm/api"
import { EVMAPI } from "./apis/evm/api"
import { GenesisAsset } from "./apis/avm/genesisasset"
import { GenesisData } from "./apis/avm/genesisdata"
import { HealthAPI } from "./apis/health/api"
import { IndexAPI } from "./apis/index/api"
import { InfoAPI } from "./apis/info/api"
import { KeystoreAPI } from "./apis/keystore/api"
import { MetricsAPI } from "./apis/metrics/api"
import { PlatformVMAPI } from "./apis/platformvm/api"
import { Socket } from "./apis/socket/socket"
import { DefaultNetworkID, Defaults } from "./utils/constants"
import { getPreferredHRP } from "./utils/helperfunctions"
import BinTools from "./utils/bintools"
import DB from "./utils/db"
import Mnemonic from "./utils/mnemonic"
import PubSub from "./utils/pubsub"
import HDNode from "./utils/hdnode"
import BN from "bn.js"
import { Buffer } from "buffer/"

/**
 * AxiaJS is middleware for interacting with Axia node RPC APIs.
 *
 * Example usage:
 * ```js
 * const axia: Axia = new Axia("127.0.0.1", 80, "https")
 * ```
 *
 */
export default class Axia extends AxiaCore {
  /**
   * Returns a reference to the Admin RPC.
   */
  Admin = () => this.apis.admin as AdminAPI

  /**
   * Returns a reference to the Auth RPC.
   */
  Auth = () => this.apis.auth as AuthAPI

  /**
   * Returns a reference to the EVMAPI RPC pointed at the AX-Chain.
   */
  AXChain = () => this.apis.axchain as EVMAPI

  /**
   * Returns a reference to the AVM RPC pointed at the Swap-Chain.
   */
  SwapChain = () => this.apis.swapchain as AVMAPI

  /**
   * Returns a reference to the Health RPC for a node.
   */
  Health = () => this.apis.health as HealthAPI

  /**
   * Returns a reference to the Index RPC for a node.
   */
  Index = () => this.apis.index as IndexAPI

  /**
   * Returns a reference to the Info RPC for a node.
   */
  Info = () => this.apis.info as InfoAPI

  /**
   * Returns a reference to the Metrics RPC.
   */
  Metrics = () => this.apis.metrics as MetricsAPI

  /**
   * Returns a reference to the Keystore RPC for a node. We label it "NodeKeys" to reduce
   * confusion about what it's accessing.
   */
  NodeKeys = () => this.apis.keystore as KeystoreAPI

  /**
   * Returns a reference to the PlatformVM RPC pointed at the Core-Chain.
   */
  CoreChain = () => this.apis.corechain as PlatformVMAPI

  /**
   * Creates a new Axia instance. Sets the address and port of the main Axia Client.
   *
   * @param host The hostname to resolve to reach the Axia Client RPC APIs
   * @param port The port to resolve to reach the Axia Client RPC APIs
   * @param protocol The protocol string to use before a "://" in a request,
   * ex: "http", "https", "git", "ws", etc. Defaults to http
   * @param networkID Sets the NetworkID of the class. Default [[DefaultNetworkID]]
   * @param SwapChainID Sets the blockchainID for the AVM. Will try to auto-detect,
   * otherwise default "2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed"
   * @param AXChainID Sets the blockchainID for the EVM. Will try to auto-detect,
   * otherwise default "2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU"
   * @param hrp The human-readable part of the bech32 addresses
   * @param skipinit Skips creating the APIs. Defaults to false
   */
  constructor(
    host?: string,
    port?: number,
    protocol: string = "http",
    networkID: number = DefaultNetworkID,
    SwapChainID: string = undefined,
    AXChainID: string = undefined,
    hrp: string = undefined,
    skipinit: boolean = false
  ) {
    super(host, port, protocol)
    let swapchainid: string = SwapChainID
    let axchainid: string = AXChainID

    if (
      typeof SwapChainID === "undefined" ||
      !SwapChainID ||
      SwapChainID.toLowerCase() === "swap"
    ) {
      if (networkID.toString() in Defaults.network) {
        swapchainid = Defaults.network[`${networkID}`].Swap.blockchainID
      } else {
        swapchainid = Defaults.network[12345].Swap.blockchainID
      }
    }
    if (
      typeof AXChainID === "undefined" ||
      !AXChainID ||
      AXChainID.toLowerCase() === "ax"
    ) {
      if (networkID.toString() in Defaults.network) {
        axchainid = Defaults.network[`${networkID}`].AX.blockchainID
      } else {
        axchainid = Defaults.network[12345].AX.blockchainID
      }
    }
    if (typeof networkID === "number" && networkID >= 0) {
      this.networkID = networkID
    } else if (typeof networkID === "undefined") {
      networkID = DefaultNetworkID
    }
    if (typeof hrp !== "undefined") {
      this.hrp = hrp
    } else {
      this.hrp = getPreferredHRP(this.networkID)
    }

    if (!skipinit) {
      this.addAPI("admin", AdminAPI)
      this.addAPI("auth", AuthAPI)
      this.addAPI("swapchain", AVMAPI, "/ext/bc/Swap", swapchainid)
      this.addAPI("axchain", EVMAPI, "/ext/bc/AX/axc", axchainid)
      this.addAPI("health", HealthAPI)
      this.addAPI("info", InfoAPI)
      this.addAPI("index", IndexAPI)
      this.addAPI("keystore", KeystoreAPI)
      this.addAPI("metrics", MetricsAPI)
      this.addAPI("corechain", PlatformVMAPI)
    }
  }
}

export { Axia }
export { AxiaCore }
export { BinTools }
export { BN }
export { Buffer }
export { DB }
export { HDNode }
export { GenesisAsset }
export { GenesisData }
export { Mnemonic }
export { PubSub }
export { Socket }

export * as admin from "./apis/admin"
export * as auth from "./apis/auth"
export * as avm from "./apis/avm"
export * as common from "./common"
export * as evm from "./apis/evm"
export * as health from "./apis/health"
export * as index from "./apis/index"
export * as info from "./apis/info"
export * as keystore from "./apis/keystore"
export * as metrics from "./apis/metrics"
export * as platformvm from "./apis/platformvm"
export * as utils from "./utils"
