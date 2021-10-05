import User, { PhoneNumber } from "../../models/users/users.models";
import ValidationCode, { ValidationCodeTypes } from "../../models/users/validation.code.models";
import SmsService from "../../services/sms.services";
import Crud from "../crud";

export default class UserCrud extends Crud<User> {

    /**
     * send a validation code for a user
     * @param phone the phone number you want to send a validation code
     */
    protected static sendValidationCode = async (phone: PhoneNumber, type: ValidationCodeTypes) => {
        const validation = new ValidationCode()
        validation.phoneNumber = phone
        validation.type = type
        validation.setRandomNumber()
        await validation.save()
        await SmsService.sendTemplate(phone, 'validation_code_signup', { 'code': validation.code })
    }
}