import HttpError from '../../errors/http.errors'
import User, {PhoneNumber} from '../../models/users/users.models'
import ValidationCode, {
  ValidationCodeTypes,
} from '../../models/users/validation.code.models'
import SmsService from '../../services/sms.services'
import Crud from '../crud'
import i18n = require('i18n')
import '../../services/date.services'
import TokenService from '../../services/token.services'

export type AuthResult = { token: string; user: User }

/**
 * methods to create and manage a user for auth
 */
export default class UserCrud extends Crud<User> {
  static modelName = 'کاربر'

  /**
   * Create new account with user validation code
   * @param {string} code
   * validation code for create a account for user
   * @return {Promise<AuthResult>} instance of the account created {@link User}
   */
  public async createAccount(code: string): Promise<AuthResult> {
    await UserCrud.checkValidationCode(
        this.model.phoneNumber,
        'create_account',
        code,
        true,
        true,
    )
    this.model = await this.model.saveUser()
    return {
      token: TokenService.createToken(this.model.id as number),
      user: this.model,
    }
  }

  /**
   * Send a validation code to user for login
   * @param {PhoneNumber} phone
   */
  public static sendLoginValidationCode = async (
      phone: PhoneNumber,
  ): Promise<string> => {
    const user = await User.findOne({
      where: {
        _phoneNumber: phone.number,
        countryCode: phone.countryCode ?? 98,
      },
    })
    if (!user) {
      throw new HttpError(i18n.__('REGISTER_LOGIN_PHONE_NOT_FOUND'), 401)
    }
    return await UserCrud.sendValidationCode(phone, 'login')
  }

  /**
   * send validation code for create account
   * @param {PhoneNumber} phone
   */
  public static sendCreateAccountValidationCode = async (
      phone: PhoneNumber,
  ): Promise<string> => {
    const user = await User.findOne({
      where: {
        _phoneNumber: phone.number,
        countryCode: phone.countryCode ?? 98,
      },
    })
    if (user) {
      throw HttpError.__(401, 'REGISTER_REQUEST_DUPLICATE_PHONE_NUMBER', {})
    }
    return await UserCrud.sendValidationCode(phone, 'create_account')
  }

  /**
   * Login user to account and return a user token
   * @param {string} phone user phone number that want to login
   * @param {string} code Check validation code
   * @return {Promise<AuthResult>}
   */
  public static async login(
      phone: PhoneNumber,
      code: string,
  ): Promise<AuthResult> {
    await UserCrud.checkValidationCode(phone, 'login', code, true, true)
    const user = await User.findOne({
      where: {
        _phoneNumber: phone.number,
        countryCode: phone.countryCode ?? '98',
      },
    })
    if (!user || !user.id) {
      throw HttpError.message.model.notFound(this.modelName)
    }
    return {
      user: user,
      token: TokenService.createToken(user.id),
    }
  }

  /**
   *
   * @param {PhoneNumber} phone the phone number
   * have validation code and you want to check
   * @param {ValidationCode} type type of validation code you want to check
   * @param {string} code the code you want to check
   * @param {boolean} throwError if set false
   * method return true or false and if set true method
   * when validation code is expire or incorrect
   * throw a {@link HttpError} exception
   * @param {boolean} deleteCode delete code after checking
   * @return {boolean} true or false when throwError is false
   */
  public static checkValidationCode = async (
      phone: PhoneNumber,
      type: ValidationCodeTypes,
      code: string,
      throwError: boolean = true,
      deleteCode: boolean = false,
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
      if (throwError) {
        throw new HttpError(i18n.__('REGISTER_VALIDATION_CODE_INVALID'), 401)
      }
      return false
    }

    const expire = (validation.updatedAt as Date).addMinutes(3)
    if (deleteCode) await validation.destroy()
    if (expire < new Date()) {
      if (throwError) {
        throw new HttpError(i18n.__('REGISTER_VALIDATION_CODE_EXPIRE'), 401)
      }
      return false
    }

    return true
  }

  /**
   * send a validation code for a user
   * @param {PhoneNumber} phone
   * the phone number you want to send a validation code
   * @param {ValidationCodeTypes} type
   * type of validation code you want sent
   */
  public static sendValidationCode = async (
      phone: PhoneNumber,
      type: ValidationCodeTypes,
  ) => {
    const validation = new ValidationCode()
    validation.phoneNumber = phone
    validation.type = type
    validation.setRandomNumber()
    await validation.save()
    if (process.env.NODE_EN == 'dev') return validation.code
    await SmsService.sendTemplate(phone, 'SMS_VALIDATION_CODE_SIGNUP', {
      code: validation.code,
    })
    return validation.code
  }

  /**
   * @param {string} username
   * @return {boolean}
   */
  public static usernameExists = async (username: string) => {
    const user = await User.findOne({where: {username: username}})
    return user != null
  }

  /**
   * Check list of users ids was exists in list
   * @param {number[]} usersIds
   * list of users ids
   * @return {User[]}
   */
  public static checkListOfUsersExists = async (usersIds: number[]) => {
    const users = await User.findAndCountAll({where: {id: usersIds}})
    if (usersIds.length > users.count) {
      const idsString =
        users.rows.filter((x) => !usersIds.includes(x.id as number))
            .map((x) => x.id as number).join(', ')
      const msg = 'متاسفانه شناسه های ' + idsString + ' یافت نشد'
      throw new HttpError(msg, 401)
    }
    return users.rows
  }
}
