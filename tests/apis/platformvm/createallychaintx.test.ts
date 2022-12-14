import BN from "bn.js"
import { Buffer } from "buffer/"
import { SECPOwnerOutput } from "../../../src/apis/platformvm/outputs"
import { PlatformVMConstants } from "../../../src/apis/platformvm/constants"
import { CreateAllychainTx } from "src/apis/platformvm"

describe("CreateAllychainTx", (): void => {
  const createAllychainTxHex: string =
    "0000053900000000000000000000000000000000000000000000000000000000000000000000000117cc8b1578ba383544d163958822d8abd3849bb9dfabe39fcbc3e7ee8811fe2f00000007006a94d69c2656c0000000000000000000000001000000023cb7d3842e8cee6a0ebd09f1fe884f6861e1b29ca43c1f6ecdcb1fcec86d78446b9cf619c64c604b00000001ec7f57aeda7824b9d785e5ca631d96ef7323988a9fcfc6832cbc73ac4b27f7040000000017cc8b1578ba383544d163958822d8abd3849bb9dfabe39fcbc3e7ee8811fe2f00000005006a94d6d7c120c00000000100000000000000594d616e75616c6c79206372656174652061204372656174655375626e657454782077686963682063726561746573206120312d6f662d322041564158207574786f20616e64206120322d6f662d33205375626e6574417574680000000b000000000000000000000002000000035c412ef1414c4903c49dffc0ba9286c47fa27689a43c1f6ecdcb1fcec86d78446b9cf619c64c604be6b2bba9288c499d477327292839728ab52e902c"
  const createAllychainTxBuf: Buffer = Buffer.from(createAllychainTxHex, "hex")
  const createAllychainTx: CreateAllychainTx = new CreateAllychainTx()
  createAllychainTx.fromBuffer(createAllychainTxBuf)

  test("getTypeName", async (): Promise<void> => {
    const createAllychainTxTypeName: string = createAllychainTx.getTypeName()
    expect(createAllychainTxTypeName).toBe("CreateAllychainTx")
  })

  test("getTypeID", async (): Promise<void> => {
    const createAllychainTxTypeID: number = createAllychainTx.getTypeID()
    expect(createAllychainTxTypeID).toBe(PlatformVMConstants.CREATEALLYCHAINTX)
  })

  test("toBuffer and fromBuffer", async (): Promise<void> => {
    const buf: Buffer = createAllychainTx.toBuffer()
    const csTx: CreateAllychainTx = new CreateAllychainTx()
    csTx.fromBuffer(buf)
    const buf2: Buffer = csTx.toBuffer()
    expect(buf.toString("hex")).toBe(buf2.toString("hex"))
  })

  describe("AllychainOwners", (): void => {
    const allychainOwners: SECPOwnerOutput =
      createAllychainTx.getAllychainOwners()

    test("getTypeName", async (): Promise<void> => {
      const allychainOwnersTypeName: string = allychainOwners.getTypeName()
      expect(allychainOwnersTypeName).toBe("SECPOwnerOutput")
    })

    test("getTypeID", async (): Promise<void> => {
      const allychainOwnersTypeID: number = allychainOwners.getTypeID()
      expect(allychainOwnersTypeID).toBe(PlatformVMConstants.SECPOWNEROUTPUTID)
    })

    test("getOutputID", async (): Promise<void> => {
      const outputID: number = allychainOwners.getOutputID()
      expect(outputID).toBe(PlatformVMConstants.SECPOWNEROUTPUTID)
    })

    test("get addresses", async (): Promise<void> => {
      const addresses: Buffer[] = allychainOwners.getAddresses()
      expect(addresses.length).toBe(3)
    })

    test("get threshold", async (): Promise<void> => {
      const threshold: number = allychainOwners.getThreshold()
      expect(threshold).toBe(2)
    })

    test("get locktime", async (): Promise<void> => {
      const locktime: BN = allychainOwners.getLocktime()
      expect(locktime.toNumber()).toBe(0)
    })
  })
})
