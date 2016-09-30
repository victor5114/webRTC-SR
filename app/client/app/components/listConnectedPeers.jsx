/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'
import { union } from 'lodash'
import ChatWindow from './ChatWindow.jsx'
import initCallee from '../utils/callee'
import initCaller from '../utils/caller'
import { AVAILABLE_PEERS } from '../types/dataActions'
import { ON_AVAILABLE_PEERS_RESPONSE } from '../types/events'
import { removeElem } from '../utils/tools'
import StoreWebRTC from '../utils/storeWebRTC'

export default class listConnectedPeers extends Component {

    constructor (props) {
        super(props)
        this.state = { peersList: [], currentPeer: '' }
        this.handlePeersResponse = this.handlePeersResponse.bind(this)
        this.renderPeerListElem = this.renderPeerListElem.bind(this)
        this.onClickOpenChat = this.onClickOpenChat.bind(this)
        this.once = true
    }

    /* The method is called only once when component is render for the first time */
    componentDidMount () {
        window.addEventListener(ON_AVAILABLE_PEERS_RESPONSE, this.handlePeersResponse)
        window.SignalingChannel.sendAvailablePeers(this.props.pseudo)
        initCallee(window.SignalingChannel, (peerID, channel) => {
            StoreWebRTC.addConnection(peerID, channel)
        })
    }

    /* The method is called only once when component is deleted */
    componentWillUnmount () {
        window.removeEventListener(ON_AVAILABLE_PEERS_RESPONSE, this.handlePeersResponse)
    }

    /*
    * This method is called when we receive the connected peers
    * Here we call openConnectionWithPeers to connect with all the peers
    */
    handlePeersResponse (evt) {
        const peersList = evt.detail
        removeElem(peersList, this.props.pseudo) // Egde case if server send list with own pseudo

        if (!this.once) {
            this.openConnectionWithPeers(peersList)
        }
        this.once = false
        this.setState({ peersList: peersList })
    }

    /*
    * Loop through connected peers and init a WebRTC with each
    */
    openConnectionWithPeers (peersList) {
        peersList.map((peerID) => {
            if (Object.keys(StoreWebRTC.getInstance()).indexOf(peerID) === -1) {
                const channel = initCaller(window.SignalingChannel, peerID, this.props.pseudo)
                StoreWebRTC.addConnection(peerID, channel)
            }
        })
    }

    /*
    * Update state to render the chat window related to one peer
    */
    onClickOpenChat (peer) {
        this.setState({ ...this.state, currentPeer: peer })
    }

    renderPeerListElem () {
        if (this.state.peersList.length === 0) {
            return <li><span>No peers available</span></li>
        }

        const getItemClass = (peer) => {
            let mainClasses = 'list-group-item clearfix'
            if (peer === this.state.currentPeer) {
                mainClasses += ' list-group-item-info'
            }
            return mainClasses
        }

        return this.state.peersList.map((peer) => {
            if (peer !== this.props.pseudo) {
                return (
                    <li
                    key={peer}
                    className={ getItemClass(peer) }>
                        <div className="pull-left">{peer}</div>
                        <div className="pull-right">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={(evt) => {
                                    evt.preventDefault()
                                    this.onClickOpenChat(peer)
                                }}>
                                <span className="glyphicon glyphicon-pencil"></span>
                            </button>
                        </div>
                    </li>
                )
            }
        })
    }

    render () {
        return (
            <div>
                <div className="col-md-3">
                    <b>Your pseudo is {this.props.pseudo}</b>
                    <ul className="list-group">
                        {this.renderPeerListElem()}
                    </ul>
                </div>
                <div className="col-md-9">
                    <ChatWindow peerID={this.state.currentPeer} pseudo={this.props.pseudo}/>
                </div>
            </div>
        )
    }
}
