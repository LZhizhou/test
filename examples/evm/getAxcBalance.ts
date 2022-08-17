import { BN } from "axia/dist"

const ip: string = "localhost"
const port: number = 80
const protocol: string = "http"
const Web3 = require("web3")
const path: string = "/ext/bc/AX/rpc"
const web3 = new Web3(`${protocol}://${ip}:${port}${path}`)
const cHexAddress: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"

const main = async (): Promise<any> => {
  let balance: BN = await web3.eth.getBalance(cHexAddress)
  balance = new BN(balance.toString())
  const Balance = Web3.utils.fromWei(balance)
  console.log({ AXChainAddress: cHexAddress, Balance: Balance + " AXC" })
}

main()
