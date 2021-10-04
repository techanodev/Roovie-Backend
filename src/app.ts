import express = require('express')
require('./config/config')

const app = express()
const port = Number.parseInt(process.env.APP_PORT ?? '3000') ?? 3000
const hostname = process.env.APP_HOST ?? 'localhost'

app.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}`)
})