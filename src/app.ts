import express = require('express')
import {sequelize} from './config/database'
import Routes from './routes/routes'
import FileService from './services/file.services'
import cors = require('cors')

require('./config/config')
require('./config/lang')

const app = express()
app.use(express.static(FileService.public.path))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.raw())
app.use(cors())

const port = Number.parseInt(getArgsValue('port', 'SERVER_PORT', '8000'))
const hostname = getArgsValue('host', 'SERVER_HOST', 'localhost')

Routes.init(app)

export const server = app.listen(port, hostname, () => {
  connectDatabase(() => {
    console.log('Server started')
    console.log(`Server listening at http://${hostname}:${port}`)
  })
})

const connectDatabase = (listener: CallableFunction) => {
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

/**
 * @param {string} argName
 * @param {string} envKey
 * @param {string} defaultValue
 * @return {boolean}
 */
function getArgsValue(argName: string, envKey: string, defaultValue: string) {
  const args = process.argv
  if (args.includes(argName)) {
    const index = args.indexOf(argName)
    if (args.length > index + 1) return args[index + 1] ?? defaultValue
  }
  return process.env[envKey] ?? defaultValue
}

export default app
