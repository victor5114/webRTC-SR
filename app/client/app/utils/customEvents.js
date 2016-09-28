import {
    ON_AVAILABLE_PSEUDO_RESPONSE,
    ON_AVAILABLE_PEERS_RESPONSE
} from '../types/events'

export function onAvailablePseudoResponse (state) {
    var evt = new CustomEvent(ON_AVAILABLE_PSEUDO_RESPONSE, { detail: state })
    window.dispatchEvent(evt)
}

export function onAvailablePeersResponse (state) {
    var evt = new CustomEvent(ON_AVAILABLE_PEERS_RESPONSE, { detail: state })
    window.dispatchEvent(evt)
}
