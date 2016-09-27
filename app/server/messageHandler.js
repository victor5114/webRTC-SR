const connectedPeers = {}

const protocolMethods = ['ICECandidate', 'offer', 'answer', 'init']
const dataMethods = ['checkAvailablePseudo', 'availablePeers']

export function getConnectedPeers () {
    return connectedPeers
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
        ws.send(JSON.stringify(args)) // Callback message to source
    } else {
        connectedPeers[mess.destination].send(JSON.stringify(args)) // Forward message to destination
    }
}

// Simulate Router behaviour
export function dataHandler (ws, message) {
    var { type } = message

    if (dataMethods.indexOf(type) > -1) {
        callDataMethod(type, message, ws)
    } else {
        throw new Error('Invalid data type')
    }
}

// Sync methods (No complex async operation here)
function callDataMethod (type, mess, ws) {
    let res = null

    switch (type) {
    case 'availablePeers':
        res = Object.keys(getConnectedPeers())
        break
    case 'checkAvailablePseudo':
        res = Object.keys(getConnectedPeers()).indexOf(mess[type]) === -1
        break
    default:
        break
    }

    const args = { type: mess.type, [type]: res, source: undefined }
    ws.send(JSON.stringify(args))
}
