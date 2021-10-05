import express = require('express')
import { sequelize } from './config/database'
import UserCrud from './crud/users/users.crud'
require('./config/config')

const app = express()
const port = Number.parseInt(process.env.APP_PORT ?? '3000') ?? 3000
const hostname = process.env.APP_HOST ?? 'localhost'


app.listen(port, hostname, () => {
    connectDatabase(() => {
        console.log('Server started')
        console.log(`Server listening at http://${hostname}:${port}`)
    })
})

function connectDatabase(listener: CallableFunction) {
    sequelize.authenticate().then(async () => {
        console.log('database connected')
        listener()
    }).catch((e: Error) => {
        console.error('Database Authenticate Error:', e.message)
    })
}