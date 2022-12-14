import { PubSub, Socket } from "../../src"

const protocol: string = "ws"
const host: string = "localhost"
const port: number = 80
const addresses: string[] = [
  "Swap-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"
]

const main = async (): Promise<any> => {
  const pubsub: PubSub = new PubSub()
  const newBloom: string = pubsub.newBloom()
  const addAddresses: string = pubsub.addAddresses(addresses)
  const socket: Socket = new Socket(
    `${protocol}://${host}:${port}/ext/bc/Swap/events`
  )
  socket.onopen = () => {
    console.log("Socket Connected")
    socket.send(newBloom)
    socket.send(addAddresses)
  }
  socket.onmessage = (msg: any) => {
    console.log(msg.data)
    socket.close()
  }
  socket.onclose = () => {
    console.log("Socket Disconnected")
  }
  socket.onerror = (error: any) => {
    console.log(error)
  }
}

main()
