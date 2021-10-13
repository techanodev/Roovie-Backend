import express = require('express')
import { sequelize } from './config/database'
import Routes from './routes/routes'
import FileService from './services/file.services'
import cors = require('cors')

require('./config/config')
require('./config/lang')

const app = express()
app.use(express.static(FileService.public.path))
app.use((express.urlencoded({ extended: true })))
app.use(express.json())
app.use(express.raw())
app.use(cors())

const port = Number.parseInt(process.env.SERVER_PORT ?? '8000') ?? 8000
const hostname = process.env.SERVER_HOST ?? 'localhost'

Routes.init(app)

app.listen(port, hostname, () => {
    connectDatabase(() => {
        console.log('Server started')
        console.log(`Server listening at http://${hostname}:${port}`)
    })
})

function connectDatabase(listener: CallableFunction) {
    sequelize
        .authenticate()
        .then(async () => {
            console.log('database connected')
            listener()
        })
        .catch((e: Error) => {
            console.error('Database Authenticate Error:', e.message)
        })
}

export default app