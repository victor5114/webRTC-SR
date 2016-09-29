/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'
import ListConnectedPeers from './components/listConnectedPeers.jsx'
import TickValidator from './components/tickValidator.jsx'
import SignalingChannel from './utils/signalingChannel'
import { AVAILABLE_PEERS } from './types/dataActions'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/styles.scss'

export default class App extends Component {
    constructor (props) {
        super(props)
        this.state = { hasPseudo: false, pseudo: '', pseudoOK: false }
        this.handleChangePseudo = this.handleChangePseudo.bind(this)
        this.setPseudo = this.setPseudo.bind(this)
        this.renderChat = this.renderChat.bind(this)
        this.renderPseudoInput = this.renderPseudoInput.bind(this)
        this.handlePseudoResponse = this.handlePseudoResponse.bind(this)
    }

    componentDidMount () {
        window.SignalingChannel = new SignalingChannel()
        window.addEventListener('onavailablepseudoresponse', this.handlePseudoResponse)
    }

    componentWillUnmount () {
        window.removeEventListener('onavailablepseudoresponse', this.handlePseudoResponse)
        window.SignalingChannel.sendBroadcast(AVAILABLE_PEERS, this.props.pseudo)
    }

    handleChangePseudo (evt) {
        if (!this.state.hasPseudo) {
            window.SignalingChannel.sendCheckAvailablePseudo(evt.target.value)
        }
        this.setState({ ...this.state, pseudo: evt.target.value })
    }

    handlePseudoResponse (evt) {
        const ok = evt.detail && this.state.pseudo.length !== 0
        this.setState({ ...this.state, pseudoOK: ok })
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
                <input
                    type="text"
                    id="pseudo_input"
                    value={this.state.pseudo}
                    onChange={this.handleChangePseudo}
                    placeholder="Type your pseudo"
                    autoComplete="off"/>
                <button type="submit" className="btn btn-primary" disabled={!this.state.pseudoOK}>
                    <TickValidator ok={this.state.pseudoOK}/>
                </button>
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
