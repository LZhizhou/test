import { Axia, BinTools, BN, Buffer } from "../../src"
import {
  PlatformVMAPI,
  KeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableOutput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx,
  ImportTx
} from "../../src/apis/platformvm"
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  Defaults
} from "../../src/utils"

const ip: string = "localhost"
const port: number = 80
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const corechain: PlatformVMAPI = axia.CoreChain()
const bintools: BinTools = BinTools.getInstance()
const coreKeyChain: KeyChain = corechain.keyChain()
let privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
// Swap-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p
coreKeyChain.importKey(privKey)

privKey = "PrivateKey-R6e8f5QSa89DjpvL9asNdhdJ4u8VqzMJStPV8VVdDmLgPd8a4"
// Core-custom15s7p7mkdev0uajrd0pzxh88kr8ryccztnlmzvj
coreKeyChain.importKey(privKey)

privKey = "PrivateKey-rKsiN3X4NSJcPpWxMSh7WcuY653NGQ7tfADgQwDZ9yyUPPDG9"
// Core-custom1jwwk62ktygl0w29rsq2hq55amamhpvx82kfnte
coreKeyChain.importKey(privKey)
const pAddresses: Buffer[] = corechain.keyChain().getAddresses()
const pAddressStrings: string[] = corechain.keyChain().getAddressStrings()
const swapChainID: string = Defaults.network[networkID].Swap.blockchainID
const swapChainIDBuf: Buffer = bintools.cb58Decode(swapChainID)
const coreChainID: string = Defaults.network[networkID].Core.blockchainID
const coreChainIDBuf: Buffer = bintools.cb58Decode(coreChainID)
const importedInputs: TransferableInput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = corechain.getDefaultTxFee()
const threshold: number = 2
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "Import AXC to Core-Chain from Swap-Chain and consume a multisig atomic output and create a multisig utxo"
)

const main = async (): Promise<any> => {
  const axcAssetID: Buffer = await corechain.getAXCAssetID()
  const platformvmUTXOResponse: any = await corechain.getUTXOs(
    pAddressStrings,
    swapChainID
  )
  const utxoSet: UTXOSet = platformvmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  let amount: BN = new BN(0)
  utxos.forEach((utxo: UTXO): void => {
    console.log(utxo.getOutput().getAddresses())
    const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
    const amt: BN = amountOutput.getAmount()
    const txid: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()
    const assetID: Buffer = utxo.getAssetID()

    if (axcAssetID.toString("hex") === assetID.toString("hex")) {
      const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
      secpTransferInput.addSignatureIdx(1, pAddresses[2])
      secpTransferInput.addSignatureIdx(2, pAddresses[1])
      const input: TransferableInput = new TransferableInput(
        txid,
        outputidx,
        axcAssetID,
        secpTransferInput
      )
      importedInputs.push(input)
      amount = amount.add(amt)
    }
  })
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(
    amount.sub(fee),
    pAddresses,
    locktime,
    threshold
  )
  const transferableOutput: TransferableOutput = new TransferableOutput(
    axcAssetID,
    secpTransferOutput
  )
  outputs.push(transferableOutput)

  const importTx: ImportTx = new ImportTx(
    networkID,
    coreChainIDBuf,
    outputs,
    inputs,
    memo,
    swapChainIDBuf,
    importedInputs
  )

  const unsignedTx: UnsignedTx = new UnsignedTx(importTx)
  const tx: Tx = unsignedTx.sign(coreKeyChain)
  const txid: string = await corechain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
