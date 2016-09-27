/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'
import ListConnectedPeers from './components/listConnectedPeers.jsx'
import TickValidator from './components/tickValidator.jsx'
import SignalingChannel from './utils/SignalingChannel'

import 'bootstrap/dist/css/bootstrap.min.css'

export default class App extends Component {
    constructor (props) {
        super(props)
        this.state = { chatOpen: false, pseudo: '' }
        this.handleChangePseudo = this.handleChangePseudo.bind(this)
        this.setPseudo = this.setPseudo.bind(this)
        this.renderChatApp = this.renderChatApp.bind(this)
    }

    componentDidMount () {
        window.SignalingChannel = new SignalingChannel()
    }

    componentDidUpdate () {
        window.SignalingChannel.sendCheckAvailablePseudo(this.state.pseudo)
    }

    handleChangePseudo (evt) {
        this.setState({ chatOpen: false, pseudo: evt.target.value })
    }

    setPseudo (evt) {
        evt.preventDefault()
        this.setState({ ...this.state, chatOpen: true })
    }

    renderChatApp (isOpen) {
        console.log(isOpen)
        if (isOpen) {
            return <div className="row">
                <ListConnectedPeers pseudo={this.state.pseudo}/>
            </div>
        }
    }

    render () {
        return (
        <div className="container">
            <div className="container-fluid">
                <div className="row">
                    <form onSubmit={this.setPseudo}>
                        <label>Type your pseudo</label>
                        <input
                            type="text"
                            id="pseudo_input"
                            value={this.state.pseudo}
                            onChange={this.handleChangePseudo} />
                        <input type="submit" value="Submit" />
                        <TickValidator term={this.state.pseudo}/>
                    </form>
                </div>
                {this.renderChatApp(this.state.chatOpen)}
            </div>
        </div>
        )
    }
}
