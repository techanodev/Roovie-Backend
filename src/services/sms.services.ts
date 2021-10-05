import { PhoneNumber } from "../models/users/users.models";
import axios, { AxiosRequestConfig } from "axios"
import fs = require('fs')

import dotenv = require('dotenv')
import HttpError from "../errors/http.errors";
import FileService from "./file.services";
dotenv.config()

export default class SmsService {

    /**
     * Send a sms to a phone number by **ParsGreen** API
     * @param to the phone number you want send sms message
     * @param message the message you want to send
     * @returns void
     * @throws In case of any error **{@link HttpError}**
     */
    public static send = async (to: PhoneNumber, message: string) => {
        const token = process.env.SMS_TOKEN

        const phone = `+${to.countryCode}${to.number}`


        const url = 'http://sms.parsgreen.ir/Apiv2/Message/SendSms'
        const data = {
            "Mobiles": [phone],
            "SmsBody": message
        }

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `basic apikey:${token}`,
                'Content-Type': 'application/json'
            }
        }

        const result = await axios.post(url, JSON.stringify(data), config)
        if (result.data.SuccessCount > 0) return
        throw new HttpError(result.data.R_Message, 500)
    }

    /**
     * Send a sms message with a template by {@link SmsService.send}
     * @param to the phone number you want send sms message
     * @param template name of the template sms you want to use (in /templates/sms/fs) path
     * @param values keys that uses in template like {{APP_NAME}}
     * @example sendTemplate({phone: "9123730014"}, 'validation_code_signup', {'code': '1234'})
     */
    public static sendTemplate = async (to: PhoneNumber, template: string, values: { [key: string]: string }) => {
        const path = FileService.absolutePath(`templates/sms/fa/${template}.txt`)
        let text = fs.readFileSync(path).toString()
        text = text.replace('{{APP_NAME}}', (process.env.APP_NAME ?? 'Rovie'))
        for (const value of Object.keys(values)) {
            text = text.replace(`{{${value.toUpperCase()}}}`, values[value])
        }
        await this.send(to, text)
    }
}