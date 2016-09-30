import {
    ON_AVAILABLE_PSEUDO_RESPONSE,
    ON_AVAILABLE_PEERS_RESPONSE
} from '../types/events'

/**
* @public
* @function onAvailablePseudoResponse
* @description Triggered when receive response form websocket server
* @NOTE: dispatch event to window dy default
* @param {Object} state - response from websocket server
*/
export function onAvailablePseudoResponse (state) {
    var evt = new CustomEvent(ON_AVAILABLE_PSEUDO_RESPONSE, { detail: state })
    window.dispatchEvent(evt)
}

/**
* @public
* @function onAvailablePeersResponse
* @description Triggered when receive response form websocket server
* @NOTE: dispatch event to window dy default
* @param {Object} state - response from websocket server
*/
export function onAvailablePeersResponse (state) {
    var evt = new CustomEvent(ON_AVAILABLE_PEERS_RESPONSE, { detail: state })
    window.dispatchEvent(evt)
}
