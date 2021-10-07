import { Request, Response } from "express"
import UserCrud from "../../crud/users/users.crud"
import User from "../../models/users/users.models"
import ModelService from "../../services/model.services"
import ResponseService from "../../services/response.services"
import Controller from "../controllers"
require('../config/lang')
import i18n = require('i18n')
import { ValidationCodeTypes } from "../../models/users/validation.code.models"
import UserResource from "../../resources/users/users.resources"
import RequestService from "../../services/request.services"

export default class AuthController extends Controller {

    /**
     * Http request for create new user by code activision phone number 
     */
    public static async createUser(req: Request, res: Response) {
        try {
            this.checkValidationResult(req)
            const user = ModelService.fillModel(req, new User())
            user.phoneNumber = RequestService.phone(req)
            const code = req.body.code
            const crud = new UserCrud(user)
            const result = await crud.createAccount(code)
            const response = new ResponseService(res)
            response.setStatus(true).setStatusCode(201).set('token', result.token).set('user', new UserResource(user)).response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }

    /**
     * Http request for login a user by phone number and validation code
     */
    public static async loginUser(req: Request, res: Response) {
        try {
            this.checkValidationResult(req)
            const phone = RequestService.phone(req)
            const code = req.body.code
            const { user, token } = await UserCrud.login(phone, code)
            const response = new ResponseService(res)
            response.setStatus(true).setStatusCode(200).set('token', token).set('user', new UserResource(user)).response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }

    /**
     * Http request for sent a login validation code 
     * this request check the phone number has exists or not
     */
    public static async sendLoginValidationCode(req: Request, res: Response) {
        try {
            const phone = RequestService.phone(req)
            await UserCrud.sendLoginValidationCode(phone)
            ResponseService.newInstance(res).setMessage(i18n.__('REGISTER_VALIDATION_CODE_LOGIN_SENT')).setStatus(true).response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }

    /**
     * Http request for send a create account validation code
     */
    public static async sendCreateAccountValidationCode(req: Request, res: Response) {
        this.sendValidationCode(req, res, 'create_account')
    }

    /**
     * send validation code for phone number with http request
     */
    private static async sendValidationCode(req: Request, res: Response, type: ValidationCodeTypes) {
        try {
            this.checkValidationResult(req)
            const phoneNumber = req.body.phone as string
            const countryCode = req.body.country_code
            UserCrud.sendValidationCode({ number: phoneNumber, countryCode: countryCode }, type)
            ResponseService.newInstance(res).setMessage(i18n.__('REGISTER_VALIDATION_CODE_SENT'))
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }
}