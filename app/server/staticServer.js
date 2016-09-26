import express from 'express'
import path from 'path'

const CLIENT_PATH = path.join(__dirname, '../client/')

export default function (app) {
    // set the view engine to ejs
    app.set('view engine', 'ejs')
    app.set('views', CLIENT_PATH)

    app.use(express.static(CLIENT_PATH))

    app.use((err, req, res, next) => {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: {}
        })
    })
    console.log('started static server')
}
