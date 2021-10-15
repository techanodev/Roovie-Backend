import { PhoneNumber } from '../../../models/users/users.models'
import app from '../../../app'
import request = require('supertest')
import faker = require('faker')
import UserCrud from '../../../crud/users/users.crud'
import crypto = require('crypto')

beforeEach(() => {
    process.env.NODE_ENV = 'dev'
    process.env.JWT_SECRET = crypto.randomBytes(256).toString('base64')
})

describe('Test create account requests -> ', () => {
    it('It should response with 200 status code', async () => {
        const phone: PhoneNumber = {
            number: faker.phone.phoneNumber('9xxxxxxxxx'),
        }
        let code = ''
        try {
            code = await UserCrud.sendValidationCode(phone, 'create_account')
        } catch {}
        request(app)
            .post('/v1/account/auth/login')
            .send({
                phone_number: phone.number,
                code: code,
            })
            .expect(200)
    })
})
