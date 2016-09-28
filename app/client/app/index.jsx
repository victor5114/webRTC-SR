/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'
import ListConnectedPeers from './components/listConnectedPeers.jsx'
import TickValidator from './components/tickValidator.jsx'
import SignalingChannel from './utils/signalingChannel'
import { AVAILABLE_PEERS } from './types/dataActions'

import 'bootstrap/dist/css/bootstrap.min.css'

export default class App extends Component {
    constructor (props) {
        super(props)
        this.state = { hasPseudo: false, pseudo: '' }
        this.handleChangePseudo = this.handleChangePseudo.bind(this)
        this.setPseudo = this.setPseudo.bind(this)
        this.renderChat = this.renderChat.bind(this)
        this.renderPseudoInput = this.renderPseudoInput.bind(this)
    }

    componentDidMount () {
        window.SignalingChannel = new SignalingChannel()
    }

    componentDidUpdate () {
        if (!this.state.hasPseudo) {
            window.SignalingChannel.sendCheckAvailablePseudo(this.state.pseudo)
        }
    }

    componentWillUnmount () {
        window.SignalingChannel.sendBroadcast(AVAILABLE_PEERS, this.props.pseudo)
    }

    handleChangePseudo (evt) {
        this.setState({ hasPseudo: false, pseudo: evt.target.value })
    }

    setPseudo (evt) {
        evt.preventDefault()
        window.SignalingChannel.sendInit(this.state.pseudo)
        setTimeout(() => {
            window.SignalingChannel.sendBroadcast(AVAILABLE_PEERS, this.props.pseudo)
        }, 0)
        this.setState({ ...this.state, hasPseudo: true })
    }

    renderChat (hasPseudo) {
        if (hasPseudo) {
            return <ListConnectedPeers pseudo={this.state.pseudo}/>
        }
    }

    renderPseudoInput (hasPseudo) {
        if (!hasPseudo) {
            return <form onSubmit={this.setPseudo}>
                <label>Type your pseudo</label>
                <input
                    type="text"
                    id="pseudo_input"
                    value={this.state.pseudo}
                    onChange={this.handleChangePseudo} />
                <input type="submit" value="Submit" />
                <TickValidator term={this.state.pseudo}/>
            </form>
        }
    }

    render () {
        return (
        <div className="container">
            <div className="container-fluid">
                <div className="row">
                {this.renderPseudoInput(this.state.hasPseudo)}
                {this.renderChat(this.state.hasPseudo)}
                </div>
            </div>
        </div>
        )
    }
}
