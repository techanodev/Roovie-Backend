import { Router } from "express"
import AuthController from "../../../controllers/users/auth.controllers"

const routes = Router()

//#region Create and login
routes.post('/create-account', AuthController.createUser)

routes.post('/login', AuthController.loginUser)
//#endregion

//#region Validation codes
const validationCodes = Router()

validationCodes.post('/create-account', AuthController.sendCreateAccountValidationCode)

validationCodes.post('/login', AuthController.sendLoginValidationCode)

routes.use('/validation-code', validationCodes)
//#endregion

export default routes