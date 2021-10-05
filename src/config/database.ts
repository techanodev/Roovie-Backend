import { Sequelize } from 'sequelize-typescript'
import dotenv = require('dotenv')

dotenv.config()
export const sequelize = newSequelize()

function newSequelize(): Sequelize {
    let sequelize: Sequelize
    if (process.env.DB_TYPE == 'mysql') {
        sequelize = new Sequelize(process.env.DB_NAME ?? '', process.env.DB_USER ?? '', process.env.DB_PASSWORD ?? '', {
            host: process.env.DB_HOST ?? '',
            dialect: 'mysql',
            models: [__dirname + '/../models/**/**/*']
        })
    } else {
        sequelize = new Sequelize('', '', '', {
            dialect: 'sqlite',
            storage: 'db.sqlite',
            models: [__dirname + '/../models/**/**/*']
        })
    }

    return sequelize
}