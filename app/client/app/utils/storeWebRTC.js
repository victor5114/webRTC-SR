const StoreWebRTC = (function () {
    let instance = null

    function createInstance () {
        const WebRTConnections = {}
        return WebRTConnections
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance()
            }
            return instance
        },
        addConnection (peerID, channel) {
            let store = this.getInstance()
            store[peerID] = channel
        },
        deleteConnection (peerID) {
            let store = this.getInstance()
            delete store.peerID
        },
        getChannelByPeer (peerID) {
            let store = this.getInstance()
            return store[peerID]
        }
    }
})()

export default StoreWebRTC
