import fs = require('fs')
import crypto = require('crypto')
import promptSync = require('prompt-sync')

const prompt = promptSync()

const convertToKeyValue = (text: string[]) => {
  const keys: { [key: string]: string } = {}
  text.forEach((element) => {
    const parts = element.split('=')
    keys[parts[0]] = parts.length ? parts[1] : ''
  })
  return keys
}

const complete = (commands: string[]) => {
  return function(str: string) {
    let i
    const ret = []
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) == 0) ret.push(commands[i])
    }
    return ret
  }
}

let path = __dirname
// Replace \ with / in windows server
while (path.indexOf('\\') > 0) {
  path = path.replace('\\', '/')
}

const removedPath = '/src/scripts'

if (path.endsWith(removedPath)) {
  path = path.substring(0, path.length - removedPath.length)
}

path += '/'

const envFile = path + '.env'

if (!fs.existsSync(envFile)) {
  fs.copyFileSync(envFile + '.example', envFile)
}

const envContent = fs.readFileSync(envFile, 'utf8')

const values = convertToKeyValue(
    envContent
        .split(/[\r\n]+/gm)
        .map((x) => x.replace(/[\r\n]+/gm, ''))
        .filter((x) => x != ''),
)

if (process.argv.includes('refresh-secret-token')) {
  values['JWT_SECRET'] = crypto.randomBytes(256).toString('base64')
  console.log('> Secret key has generated for jwt token.')
}

if (process.argv.includes('database-config')) {
  values['DB_TYPE'] = prompt({
    ask: 'Enter db type: (sqlite | mysql) ',
    autocomplete: complete(['mysql', 'sqlite']),
  })
  values['DB_HOST'] = prompt('Enter db host: ')
  values['DB_NAME'] = prompt('Enter db name: ')
  values['DB_USER'] = prompt('Enter db user: ')
  values['DB_PASSWORD'] = prompt('Enter db password: ')
}

let lastKey = ''
let newEnv = ''
Object.keys(values).forEach((key) => {
  if (lastKey != '' && lastKey.split('_')[0] != key.split('_')[0]) {
    newEnv += '\n'
  }
  lastKey = key.split('_')[0]
  newEnv += `${key.toUpperCase()}=${values[key]}\n`
})

fs.writeFileSync(envFile, newEnv)
