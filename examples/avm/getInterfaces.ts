import { SendResponse } from "../../src/apis/avm"

const main = async (): Promise<any> => {
  const sendResponse: SendResponse = {
    txID: "2wYzSintaK3NWk71CGBvzuieFeAzJBLYpwfypGwQMsyotcK8Zs",
    changeAddr: "Swap-axc1vwf7dg22l9c0lnt92kq3urf0h9j3x6296sue77"
  }
  console.log(sendResponse)
}

main()
