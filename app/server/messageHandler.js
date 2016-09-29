const connectedPeers = {}

const protocolMethods = ['ICECandidate', 'offer', 'answer', 'init']
const dataMethods = ['checkAvailablePseudo', 'availablePeers']

export function getConnectedPeers () {
    return connectedPeers
}

export function setConnectedPeer (id, ws) {
    connectedPeers[id] = ws
}

export function deletePeer (id) {
    delete connectedPeers[id]
}

export default function onMessage (message, ws) {
    var { type } = message

    if (protocolMethods.indexOf(type) > -1) {
        callProtocolMethod(type, message, ws)
    } else {
        throw new Error('Invalid message type')
    }
}

function callProtocolMethod (type, mess, ws) {
    const data = mess ? mess[type] : null
    const args = (connectedPeers[mess.destination])
        ? { type: mess.type, [type]: data, source: ws.id }
        : { type: 'error', message: 'Unreachable', destination: mess.destination }

    if (type === 'init') {
        console.log('init from peer:', data) // mess.init = socket id
        ws.id = data
        connectedPeers[data] = ws
        return
    }

    if (args.type === 'error') {
        ws.send(JSON.stringify(args)) // Callback message to source
    } else {
        connectedPeers[mess.destination].send(JSON.stringify(args)) // Forward message to destination
    }
}

// Simulate Router behaviour
export function dataHandler (message, ws) {
    var { type } = message

    if (dataMethods.indexOf(type) > -1) {
        callDataMethod(type, message, ws)
    } else {
        throw new Error(`Invalid data type : ${type}`)
    }
}

// Sync methods (No complex async operation here)
export function callDataMethod (type, mess, ws) {
    let res = null
    const data = mess ? mess[type] : null
    switch (type) {
    case 'availablePeers':
        const peers = Object.keys(getConnectedPeers())
        res = removeElem(peers, data)
        break
    case 'checkAvailablePseudo':
        res = Object.keys(getConnectedPeers()).indexOf(data) === -1
        break
    default:
        break
    }

    // In the callDataMethod source
    const args = { type: type, [type]: res, source: data }
    ws.send(JSON.stringify(args))
}

// Mutate function
function removeElem (array, elem) {
    if (!array) { throw new Error('array must be an array') }

    if (!elem) { return array }

    const index = array.indexOf(elem)
    if (index > -1) { array.splice(index, 1) }
    return array
}
