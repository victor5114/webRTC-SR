export function onAvailablePseudoResponse (state) {
    var evt = new CustomEvent('onavailablepseudoresponse', { detail: state })
    window.dispatchEvent(evt)
}

export function onAvailablePeersResponse (state) {
    var evt = new CustomEvent('onavailablepeersresponse', { detail: state })
    window.dispatchEvent(evt)
}
