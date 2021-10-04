import { PhoneNumber } from "../models/users/users.models";
import axios, { AxiosRequestConfig } from "axios"

import dotenv = require('dotenv')
import HttpError from "../errors/http.errors";
dotenv.config()

export default class SmsService {
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
}