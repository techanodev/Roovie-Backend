import {Express, Request, Response} from 'express'
import ResponseService from '../services/response.services'

/**
 * Handler for error for express
 * @param {Express} app
 * @return {void}
 */
export default class ErrorHandler {
  /**
   * Create new instance for handle errors in express app
   * @param {Express} app
   */
  constructor(app: Express) {
    app.use(this.handle)
  }

  /**
   * @param {any} error
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {CallableFunction} next
   * @return {ResponseService}
   */
  handle(error: any, req: Request, res: Response, next: CallableFunction) {
    return ResponseService.handleError(res, error)
  }

  public static start = (app: Express) => new ErrorHandler(app)
}
