import { createServer } from 'http'
// import url from 'url'
import { Server } from 'ws'
import express from 'express'
import staticServer from './staticServer'
import messageHandler from './messageHandler'

const PORT = process.env.PORT || 8089
const server = createServer()
const wss = new Server({ server: server })

const app = express()

app.get('/', (req, res) => {
    res.render(`index.ejs`)
})

wss.on('connection', (ws) => {
    // var location = url.parse(ws.upgradeReq.url, true)
    console.log('connection from a client')
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', (message) => {
        var objMessage = JSON.parse(message)
        messageHandler(ws, objMessage)
    })
})

server.on('request', app)
server.listen(PORT, () => console.log('Listening on ' + server.address().port))

if (process.env.NODE_ENV === 'production') {
    staticServer(app)
}

console.log('started signaling server on port ' + PORT)
