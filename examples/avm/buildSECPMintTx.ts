import { Axia, BinTools, BN, Buffer } from "../../src"
import {
  AVMAPI,
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx,
  SECPMintOutput,
  AVMConstants,
  SECPTransferOutput,
  UTXO
} from "../../src/apis/avm"
import { GetUTXOsResponse } from "../../src/apis/avm/interfaces"
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  UnixNow
} from "../../src/utils"

// assetID is generated from running
// ts-node examples/avm/buildCreateAssetTx.ts
// if you run the avm.getAllBalances method you will see the asset alongside AXC, and a balance of 507

const getUTXOIDs = (
  utxoSet: UTXOSet,
  txid: string,
  outputType: number = AVMConstants.SECPXFEROUTPUTID_CODECONE,
  assetID = "Ycg5QzddNwe3ebfFXhoGUDnWgC6GE88QRakRnn9dp3nGwqCwD"
): string[] => {
  const utxoids: string[] = utxoSet.getUTXOIDs()
  let result: string[] = []
  for (let index: number = 0; index < utxoids.length; ++index) {
    if (
      utxoids[index].indexOf(txid.slice(0, 10)) != -1 &&
      utxoSet.getUTXO(utxoids[index]).getOutput().getOutputID() == outputType &&
      assetID ==
        bintools.cb58Encode(utxoSet.getUTXO(utxoids[index]).getAssetID())
    ) {
      result.push(utxoids[index])
    }
  }
  return result
}

const ip: string = "localhost"
const port: number = 80
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const swapchain: AVMAPI = axia.SwapChain()
const bintools: BinTools = BinTools.getInstance()
const swapKeyChain: KeyChain = swapchain.keyChain()
const privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
swapKeyChain.importKey(privKey)
const xAddresses: Buffer[] = swapchain.keyChain().getAddresses()
const xAddressStrings: string[] = swapchain.keyChain().getAddressStrings()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "AVM utility method buildSECPMintTx to mint an ANT"
)
const asOf: BN = UnixNow()

const main = async (): Promise<any> => {
  const avmUTXOResponse: GetUTXOsResponse = await swapchain.getUTXOs(
    xAddressStrings
  )
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  let mintUTXOID: string = ""
  let mintOwner: SECPMintOutput = new SECPMintOutput()
  let secpTransferOutput: SECPTransferOutput = new SECPTransferOutput()
  let txid: Buffer = Buffer.from("")
  let assetID: Buffer = Buffer.from("")
  utxos.forEach((utxo: UTXO) => {
    if (utxo.getOutput().getTypeID() === 6) {
      txid = utxo.getTxID()
      assetID = utxo.getAssetID()
    }
  })
  const secpMintOutputUTXOIDs: string[] = getUTXOIDs(
    utxoSet,
    bintools.cb58Encode(txid),
    AVMConstants.SECPMINTOUTPUTID,
    bintools.cb58Encode(assetID)
  )
  mintUTXOID = secpMintOutputUTXOIDs[0]
  const utxo: UTXO = utxoSet.getUTXO(secpMintOutputUTXOIDs[0])
  mintOwner = utxo.getOutput() as SECPMintOutput
  const amount: BN = new BN(54321)
  secpTransferOutput = new SECPTransferOutput(
    amount,
    xAddresses,
    locktime,
    threshold
  )

  const unsignedTx: UnsignedTx = await swapchain.buildSECPMintTx(
    utxoSet,
    mintOwner,
    secpTransferOutput,
    xAddressStrings,
    xAddressStrings,
    mintUTXOID,
    memo,
    asOf
  )

  const tx: Tx = unsignedTx.sign(swapKeyChain)
  const id: string = await swapchain.issueTx(tx)
  console.log(`Success! TXID: ${id}`)
}

main()
