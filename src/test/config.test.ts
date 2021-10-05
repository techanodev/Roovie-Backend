import { sequelize } from '../config/database'

beforeAll(async () => {
    return await sequelize.authenticate()
})

test('start', () => {})
