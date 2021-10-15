import {Router} from 'express'
import {body} from 'express-validator'
import AuthController from '../../../controllers/users/auth.controllers'

import {__} from 'i18n'
import '../../../locales/fa.json'
import UsernameValidator from '../../../validators/auth/username.validators'

const routes = Router()

// #region Create and login
routes.post(
    '/create-account',
    body('phone_number')
        .isString().withMessage(__('REGISTER_REQUEST_NO_PHONE')),
    body('username')
        .isString().withMessage(__('REGISTER_REQUEST_NO_USERNAME')),
    body('first_name')
        .isString().withMessage(__('REGISTER_REQUEST_NO_FIRSTNAME')),
    body('last_name')
        .isString().withMessage(__('REGISTER_REQUEST_NO_LASTNAME')),
    body('code')
        .isNumeric().withMessage(__('REGISTER_REQUEST_VALIDATION_CODE')),
    UsernameValidator.isDuplicate,
    AuthController.createUser,
)

routes.post('/login',
    body('phone_number')
        .isString().withMessage(__('REGISTER_REQUEST_NO_PHONE')),
    body('code')
        .isNumeric().withMessage(__('REGISTER_REQUEST_VALIDATION_CODE')),
    AuthController.loginUser)
// #endregion

// #region Validation codes
const validationCodes = Router()

validationCodes.post(
    '/create-account',
    body('phone_number')
        .isString().withMessage(__('REGISTER_REQUEST_NO_PHONE')),
    body('code')
        .isNumeric().withMessage(__('REGISTER_REQUEST_VALIDATION_CODE')),
    AuthController.sendCreateAccountValidationCode,
)

validationCodes.post('/login',
    body('phone_number')
        .isString().withMessage(__('REGISTER_REQUEST_NO_PHONE')),
    body('code')
        .isNumeric().withMessage(__('REGISTER_REQUEST_VALIDATION_CODE')),
    AuthController.sendLoginValidationCode,
)

routes.use('/validation-code', validationCodes)
// #endregion

export default routes
