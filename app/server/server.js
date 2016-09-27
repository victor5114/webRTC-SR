import { createServer } from 'http'
// import url from 'url'
import { Server } from 'ws'
import express from 'express'
import startStaticServer from './staticServer'
import signalHandler, { getPeers, dataHandler } from './messageHandler'

const PORT = process.env.PORT || 8089
const server = createServer()
const wss = new Server({ server: server })

const app = express()

startStaticServer(app)

wss.broadcast = function (data) {
    for (var i in this.clients) {
        this.clients[i].send(data)
    }
}

wss.on('connection', (ws) => {
    console.log('connection from a client')

    ws.on('message', (message, flags) => {
        var objMessage = JSON.parse(message)

        if (objMessage.flags === 'broadcast') {
            // Broadcast message to anyone
            wss.broadcast(getPeers())
        } else if (objMessage.flags === 'data') {
            // Compute data and sent by to source
            dataHandler(ws, objMessage)
        } else {
            // Handle signal for RTC Session negociation
            signalHandler(ws, objMessage)
        }
    })
})

server.on('request', app)
server.listen(PORT, () => console.log('Listening on ' + server.address().port))

console.log('started signaling server on port ' + PORT)
