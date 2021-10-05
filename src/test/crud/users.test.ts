import UserCrud from '../../crud/users/users.crud'
import '../config.test'
const phone = { number: '9123730014' }

const OLD_ENV = process.env

beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
})

afterAll(() => {
    process.env = OLD_ENV // Restore old environment
})

test('Check incorrect validation code', async () => {
    const data = await UserCrud.checkValidationCode(phone, 'create_account', '1234', false)
    expect(data).toBe(false)
})

test('Send validation code', async () => {
    process.env.NODE_ENV = 'dev'

    const data = await UserCrud.sendValidationCode(phone, 'create_account')
    expect(Number.parseInt(data)).toBeGreaterThan(0)

    const re = await UserCrud.checkValidationCode(phone, 'create_account', data, true, true)
    expect(re).toBe(true)
})
