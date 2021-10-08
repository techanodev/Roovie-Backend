import HttpError from '../../errors/http.errors'
import User, { PhoneNumber } from '../../models/users/users.models'
import ValidationCode, { ValidationCodeTypes } from '../../models/users/validation.code.models'
import SmsService from '../../services/sms.services'
import Crud from '../crud'
import i18n = require('i18n')
import '../../services/date.services'
import TokenService from '../../services/token.services'

export type AuthResult = { token: string, user: User }

export default class UserCrud extends Crud<User> {

    static modelName = 'کاربر'

    /**
     * Create new account with user validation code
     * @param code validation code for create a account for user
     * @returns instance of the account created {@link User}
     */
    public createAccount = async (code: string): Promise<AuthResult> => {
        await UserCrud.checkValidationCode(
            this.model.phoneNumber,
            'create_account',
            code,
            true,
            true
        )
        this.model = await this.model.saveUser()
        return {
            token: TokenService.createToken(this.model.id as number),
            user: this.model
        }
    }

    /**
     * Send a validation code to user for login 
     * @param phone the phone number that want to receive login validation code
     */
    public static async sendLoginValidationCode(phone: PhoneNumber): Promise<string> {
        const user = await User.findOne({ where: { _phoneNumber: phone.number, countryCode: phone.countryCode ?? 98 } })
        if (!user)
            throw new HttpError(i18n.__('REGISTER_LOGIN_PHONE_NOT_FOUND'), 401)
        return await UserCrud.sendValidationCode(phone, 'login')
    }

    public static async sendCreateAccountValidationCode(phone: PhoneNumber): Promise<string> {
        const user = await User.findOne({ where: { _phoneNumber: phone.number, countryCode: phone.countryCode ?? 98 } })
        if (user)
            throw new HttpError(i18n.__('REGISTER_REQUEST_DUPLICATE_PHONE_NUMBER'), 401)
        return await UserCrud.sendValidationCode(phone, 'login')
    }

    /**
     * Login user to account and return a user token
     * @param phone user phone number that want to login
     * @param code Check validation code
     * @returns instance of user
     */
    public static async login(phone: PhoneNumber, code: string): Promise<AuthResult> {
        await UserCrud.checkValidationCode(phone, 'login', code, true, true)
        const user = await User.findOne({ where: { _phoneNumber: phone.number, countryCode: phone.countryCode ?? '98' } })
        if (!user || !user.id) {
            throw HttpError.message.model.notFound(this.modelName)
        }
        return {
            user: user,
            token: TokenService.createToken(user.id)
        }
    }

    /**
     *
     * @param phone the phone number have validation code and you want to check
     * @param type type of validation code you want to check
     * @param code the code you want to check
     * @param throwError if set false method return true or false and if set true method when validation code is expire or incorrect throw a {@link HttpError} exception
     * @param deleteCode delete code after checking
     * @returns true or false when throwError is false
     */
    public static checkValidationCode = async (
        phone: PhoneNumber,
        type: ValidationCodeTypes,
        code: string,
        throwError: boolean = true,
        deleteCode: boolean = false
    ) => {
        const validation = await ValidationCode.findOne({
            where: {
                phone: phone.number,
                countryCode: phone.countryCode ?? '98',
                code: code,
                type: type,
            },
        })

        if (!validation) {
            if (throwError) throw new HttpError(i18n.__('REGISTER_VALIDATION_CODE_INVALID'), 401)
            return false
        }

        const expire = (validation.updatedAt as Date).addMinutes(3)
        if (deleteCode) await validation.destroy()
        if (expire < new Date()) {
            if (throwError) throw new HttpError(i18n.__('REGISTER_VALIDATION_CODE_EXPIRE'), 401)
            return false
        }

        return true
    }

    /**
     * send a validation code for a user
     * @param phone the phone number you want to send a validation code
     */
    public static sendValidationCode = async (phone: PhoneNumber, type: ValidationCodeTypes) => {
        const validation = new ValidationCode()
        validation.phoneNumber = phone
        validation.type = type
        validation.setRandomNumber()
        await validation.save()
        await SmsService.sendTemplate(phone, 'SMS_VALIDATION_CODE_SIGNUP', {
            code: validation.code,
        })
        return validation.code
    }

    public static usernameExists = async (username: string) => {
        const user = await User.findOne({ where: { username: username } })
        return user != null
    }
}
