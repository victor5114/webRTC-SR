/* eslint no-unused-vars: "off" */
import React, { Component, PropTypes } from 'react'

export default class tickValidator extends Component {
    constructor (props) {
        super(props)
        this.getGlyiconClass = this.getGlyiconClass.bind(this)
    }

    getGlyiconClass () {
        return this.props.ok ? 'glyphicon-ok' : 'glyphicon-remove'
    }

    render () {
        return (
            <span className={`glyphicon ${this.getGlyiconClass()}`} />
        )
    }
}
