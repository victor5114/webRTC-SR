import { createServer } from 'http'
import { Server } from 'ws'
import express from 'express'
import startStaticServer from './staticServer'
import signalHandler, { dataHandler, deletePeer } from './messageHandler'

const PORT = process.env.PORT || 8089
const server = createServer()
const wss = new Server({ server: server })

const app = express()

startStaticServer(app)

wss.on('connection', (ws) => {
    console.log('connection from a client')

    wss.broadcast = function (fn, ws, ...args) {
        for (var i in this.clients) {
            // Broadcast to anyone except the incoming connection
            if (this.clients[i] !== ws) {
                console.log(i)
                fn.call(this, ...args, this.clients[i])
            }
        }
    }

    ws.on('message', (message, flags) => {
        var objMessage = JSON.parse(message)
        if (objMessage.flags === 'broadcast') {
            console.log('BROADCAST')
            // Broadcast message to anyone
            wss.broadcast(dataHandler, ws, objMessage)
        } else if (objMessage.flags === 'data') {
            console.log('DATA')
            // Compute data and sent by to source
            dataHandler(objMessage, ws)
        } else {
            // Handle signal for RTC Session negociation
            signalHandler(objMessage, ws)
        }
    })

    ws.on('close', () => {
        const args = {
            type: 'availablePeers',
            availablePeers: ws.id,
            destination: null,
            flags: 'data'
        }
        deletePeer(ws.id)
        wss.broadcast(dataHandler, ws, args)
    })
})

server.on('request', app)
server.listen(PORT, () => console.log('Listening on ' + server.address().port))

console.log('started signaling server on port ' + PORT)
