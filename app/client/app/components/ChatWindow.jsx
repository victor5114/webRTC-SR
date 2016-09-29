/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'
import StoreWebRTC from '../utils/storeWebRTC'

const initialHistory = [{
    sender: 'Bot',
    message: 'You can safely chat over WebRTC now !',
    timestamp: new Date().toISOString()
}]

export default class listConnectedPeers extends Component {
    constructor (props) {
        super(props)
        this.state = {
            peerID: this.props.peerID,
            historyMessage: initialHistory
        }

        this.channel = null
        this.sendMessage = this.sendMessage.bind(this)
        this.renderChatMessages = this.renderChatMessages.bind(this)
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.peerID !== nextProps.peerID) {
            // Override the onmessage method otherwise in memory (old)
            // channel will still update the state as it's not garbage collected
            if (this.channel) {
                this.channel.onmessage = () => { return 'noop' }
            }

            this.channel = StoreWebRTC.getChannelByPeer(nextProps.peerID)
            this.channel.onmessage = (evt) => {
                const newMess = {
                    sender: nextProps.peerID,
                    message: evt.data,
                    timestamp: new Date().toISOString()
                }
                this.setState({ ...this.state, historyMessage: this.state.historyMessage.concat(newMess) })
            }

            this.setState({
                ...this.state,
                peerID: nextProps.peerID,
                historyMessage: initialHistory
            })
        }
    }

    sendMessage (evt) {
        evt.preventDefault()
        const messContent = document.forms['sendMessageForm'].chat_input.value
        this.channel.send(messContent)

        // Set input value to ''
        document.forms['sendMessageForm'].chat_input.value = ''

        // Update our local state
        const newMess = {
            sender: this.props.pseudo,
            message: messContent,
            timestamp: new Date().toISOString()
        }
        this.setState({ ...this.state, historyMessage: this.state.historyMessage.concat(newMess) })
    }

    renderChatMessages () {
        return this.state.historyMessage.map((mess) => {
            return (
                <li key={mess.timestamp}>
                    <span>{mess.sender} :</span>
                    <span>{mess.timestamp} $</span>
                    <span>{mess.message}</span>
                </li>
            )
        })
    }

    render () {
        if (this.props.peerID.length === 0 || !this.props.peerID) {
            return <div className="panel panel-primary">Start a chat by clicking on a Peer</div>
        }
        return (
            <div className="panel panel-primary chat-window">
                <div className="panel-heading">
                    <h3 className="panel-title">{this.peerID}</h3>
                </div>
                <div className="panel-body">
                    <ul>
                        {this.renderChatMessages()}
                    </ul>
                </div>
                <div className="panel-footer">
                    <form onSubmit={this.sendMessage} id="sendMessageForm">
                        <input type="text" id="chat_input" placeholder="Type a message..." autoComplete="off"/>
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        )
    }
}
