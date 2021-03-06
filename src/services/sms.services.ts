import {PhoneNumber} from '../models/users/users.models'
import axios, {AxiosRequestConfig} from 'axios'

import dotenv = require('dotenv')
import HttpError from '../errors/http.errors'
import i18n = require('i18n')

require('../config/lang')

dotenv.config()

/**
 * Sms Service
 */
export default class SmsService {
  /**
   * Send a sms to a phone number by **ParsGreen** API
   * @param {PhoneNumber} to the phone number you want send sms message
   * @param {string} message the message you want to send
   * @return {void}
   * @throws In case of any error **{@link HttpError}**
   */
  public static send = async (to: PhoneNumber, message: string) => {
    if (process.env.NODE_ENV === 'dev') return
    const token = process.env.SMS_TOKEN

    const phone = `+${to.countryCode}${to.number}`

    const url = 'http://sms.parsgreen.ir/Apiv2/Message/SendSms'
    const data = {
      Mobiles: [phone],
      SmsBody: message,
    }

    const config: AxiosRequestConfig = {
      headers: {
        'Authorization': `basic apikey:${token}`,
        'Content-Type': 'application/json',
      },
    }

    const result = await axios.post(url, JSON.stringify(data), config)
    if (result.data.SuccessCount > 0) return
    throw new HttpError(result.data.R_Message, 500)
  }

  /**
   * Send a sms message with a template by {@link SmsService.send}
   * @param {PhoneNumber} to the phone number you want send sms message
   * @param {string} template
   * name of the template sms you want to use (in /templates/sms/fs) path
   * @param {object} values
   * keys that uses in template like {{APP_NAME}}
   * @example sendTemplate
   * ({phone: "9123730014"}, 'validation_code_signup', {'code': '1234'})
   */
  public static async sendTemplate(
      to: PhoneNumber,
      template: string,
      values: { [key: string]: string },
  ) {
    values['app_name'] = process.env.APP_NAME ?? 'Roovie'
    let text = i18n.__(template.toUpperCase(), values)
    for (const value of Object.keys(values)) {
      text = text.replace(`{{${value.toUpperCase()}}}`, values[value])
    }
    await this.send(to, text)
  }
}
