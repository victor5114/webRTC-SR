/* Store the Map of connected peers in realtime */
const connectedPeers = {}

/* Methods used for signaling protocol */
const protocolMethods = ['ICECandidate', 'offer', 'answer', 'init']

/* Methods used for application Real time communication */
const dataMethods = ['checkAvailablePseudo', 'availablePeers']

/**
* @public
* @function getConnectedPeers
* @description Get global object connectedPeers
* @return {Object} connectedPeers - The connected peers list.
*/
export function getConnectedPeers () {
    return connectedPeers
}

/**
* @public
* @function setConnectedPeer
* @description Add a new peer in the list or override if already exist
* @param {String} id - Unique peerID
* @param {WebSocket} ws - Websocket connection
*/
export function setConnectedPeer (id, ws) {
    connectedPeers[id] = ws
}

/**
* @public
* @function deletePeer
* @description Delete a peer from list
* @param {String} id - Unique peerID
*/
export function deletePeer (id) {
    delete connectedPeers[id]
}

/**
* @public
* @function onMessage
* @description Triggered when websocket channel receives new message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
export default function onMessage (message, ws) {
    const { type } = message

    if (protocolMethods.indexOf(type) > -1) {
        callProtocolMethod(type, message, ws)
    } else {
        throw new Error('Invalid message type')
    }
}

/**
* @private
* @function callProtocolMethod
* @description Simply forward message to other peer during protocol hand ckeck
* @param {string} type - Type of message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
function callProtocolMethod (type, mess, ws) {
    const data = mess ? mess[type] : null
    const args = (getConnectedPeers()[mess.destination])
        ? { type: mess.type, [type]: data, source: ws.id }
        : { type: 'error', message: 'Unreachable', destination: mess.destination }

    // If type init we just set a new peer. No response to client needed
    if (type === 'init') {
        console.log('init from peer:', data) // mess.init = socket id
        ws.id = data
        setConnectedPeer(data, ws)
        return
    }

    if (args.type === 'error') {
        // Callback message to source
        ws.send(JSON.stringify(args))
    } else {
        // Forward message to destination
        getConnectedPeers()[mess.destination].send(JSON.stringify(args))
    }
}

/**
* @public
* @function dataHandler
* @description Called when applicative message has been received on a channel
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
export function dataHandler (message, ws) {
    const { type } = message

    if (dataMethods.indexOf(type) > -1) {
        callDataMethod(type, message, ws)
    } else {
        throw new Error(`Invalid data type : ${type}`)
    }
}

/**
* @public
* @function callDataMethod
* @description Simply forward message to other peer during protocol hand ckeck
* @param {string} type - Type of message
* @param {Object} message - Message content
* @param {WebSocket} ws - Websocket connection
*/
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

/**
* @private
* @function removeElem
* @description Utility method to remove first occurence of a elem from array.
* @param {Array} array - An array
* @param {string} elem - elem
* @return {Array} array - New array. Don't mutate the first one
*/
function removeElem (array, elem) {
    if (!array) { throw new Error('array must be an array') }

    if (!elem) { return array }

    const index = array.indexOf(elem)
    if (index > -1) { array.splice(index, 1) }
    return array
}
