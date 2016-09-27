export const connectedPeers = {}

const protocolMethods = ['ICECandidate', 'offer', 'answer', 'init']

export function getPeerIds () {
    return Object.keys(connectedPeers)
}

export default function onMessage (ws, message) {
    var { type } = message

    if (protocolMethods.indexOf(type) > -1) {
        callProtocolMethod(type, message, ws)
    } else {
        throw new Error('Invalid message type')
    }
}

function callProtocolMethod (type, mess, ws) {
    const args = (connectedPeers[mess.destination])
        ? { type: mess.type, [type]: mess[type], source: ws.id }
        : { type: 'error', message: 'Unreachable', destination: mess.destination }

    if (type === 'init') {
        console.log('init from peer:', mess[type]) // mess.init = socket id
        ws.id = mess[type]
        connectedPeers[mess[type]] = ws
        return
    }

    if (args.type === 'error') {
        connectedPeers[ws.id].send(JSON.stringify(args)) // Callback message to source
    } else {
        connectedPeers[mess.destination].send(JSON.stringify(args)) // Forward message to destination
    }
}
