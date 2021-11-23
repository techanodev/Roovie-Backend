import UserCrud from '../../crud/users/users.crud'
import User, {Gender, PhoneNumber} from '../../models/users/users.models'
import '../config.test'
import faker = require('faker')
import crypto = require('crypto')
import TokenService from '../../services/token.services'

const phone = {number: faker.phone.phoneNumber('912#######')}

const OLD_ENV = process.env

beforeEach(() => {
  jest.resetModules() // Most important - it clears the cache
  process.env = {...OLD_ENV} // Make a copy
})

afterAll(() => {
  process.env = OLD_ENV // Restore old environment
})

test('Check incorrect validation code', async () => {
  const data =
    await UserCrud.checkValidationCode(
        phone, 'create_account', '1234', false,
    )
  expect(data).toBe(false)
})

test('Send validation code', async () => {
  process.env.NODE_ENV = 'dev'

  const data = await UserCrud.sendValidationCode(phone, 'create_account')
  expect(Number.parseInt(data)).toBeGreaterThan(0)

  const re = await UserCrud.checkValidationCode(
      phone, 'create_account', data, true, true,
  )
  expect(re).toBe(true)
})

test('Create account and Login', async () => {
  process.env.NODE_ENV = 'dev'
  process.env.JWT_SECRET = crypto.randomBytes(256).toString('base64')

  const code = await UserCrud.sendValidationCode(phone, 'create_account')

  const userFake = fakeUser(phone)

  const userCreate = new UserCrud(userFake)
  const {token, user} = await userCreate.createAccount(code)

  const userResult = await TokenService.checkToken(token)
  expect(userResult.id).toBe(user.id)

  const validationCode = await UserCrud.sendLoginValidationCode(phone)
  const loginResult = await UserCrud.login(phone, validationCode)

  expect(loginResult.user.id).toBe(user.id)

  expect((await TokenService.checkToken(loginResult.token)).id).toBe(user.id)

  await user.destroy({force: true})
})

export const fakeUser = (phone: PhoneNumber) => {
  const user = new User()
  user.firstName = faker.name.firstName(0)
  user.lastName = faker.name.lastName(0)
  user.phoneNumber = phone
  user.username = user.firstName + '_' + user.lastName
  user.gender = Gender.Male
  user.birthday = faker.date.between('1990-1-1', '2010-1-1')
  return user
}
