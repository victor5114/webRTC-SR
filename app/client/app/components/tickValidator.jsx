/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'

export default class tickValidator extends Component {
    constructor (props) {
        super(props)
        this.state = { notOk: true }
        this.handlePseudoResponse = this.handlePseudoResponse.bind(this)
        this.getGlyiconClass = this.getGlyiconClass.bind(this)
    }

    componentDidMount () {
        window.addEventListener('onavailablepseudoresponse', this.handlePseudoResponse)
    }

    componentWillUnmount () {
        window.removeEventListener('onavailablepseudoresponse', this.handlePseudoResponse)
    }

    handlePseudoResponse (evt) {
        const notOk = !evt.detail || this.props.term.length === 0
        this.setState({ notOk: notOk })
    }

    getGlyiconClass () {
        return this.state.notOk ? 'glyphicon-remove' : 'glyphicon-ok'
    }

    render () {
        return (
            <span className={`glyphicon ${this.getGlyiconClass()}`} />
        )
    }
}
