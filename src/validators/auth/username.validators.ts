import {Request, Response} from 'express'
import UserCrud from '../../crud/users/users.crud'
import ValidationError from '../../errors/validation.errors'
import ResponseService from '../../services/response.services'

/**
 * Username validator
 */
export default class UsernameValidator {
  /**
   * check a username in the past used by a user or not
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   */
  public static isDuplicate =
    async (req: Request, res: Response, next: ((error?: string) => void)) => {
      try {
        const username = req.body?.username
        if (!username) {
          ResponseService.handleError(res,
              ValidationError.__('REGISTER_REQUEST_NO_USERNAME',
                  'body', 'username'))
        }
        const user = await UserCrud.usernameExists(username)
        if (user) {
          ResponseService.handleError(res,
              ValidationError.__('REGISTER_REQUEST_DUPLICATE_USERNAME',
                  'body', 'username'))
        }
        next()
      } catch (e) {
        ResponseService.handleError(res, e)
      }
    }
}
