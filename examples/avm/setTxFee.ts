import { Axia, BN } from "../../dist"
import { AVMAPI } from "../../dist/apis/avm"

const ip: string = "localhost"
const port: number = 80
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const swapchain: AVMAPI = axia.SwapChain()

const main = async (): Promise<any> => {
  const fee: BN = new BN(507)
  swapchain.setTxFee(fee)
  const txFee: BN = swapchain.getTxFee()
  console.log(txFee)
}

main()