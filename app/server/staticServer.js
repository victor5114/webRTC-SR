import express from 'express'
import path from 'path'

const CLIENT_FOLDER = process.env.NODE_ENV === 'production' ? '../client-dist/' : '../client/'
const CLIENT_PATH = path.join(__dirname, CLIENT_FOLDER)

export default function (app) {
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
