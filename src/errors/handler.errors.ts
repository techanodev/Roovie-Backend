import { Express, Request, Response } from 'express'
import ResponseU from '../services/response.services'

export default class ErrorHandler {
    constructor(app: Express) {
        app.use(this.handle)
    }

    handle(error: any, req: Request, res: Response, next: CallableFunction) {
        return ResponseU.handleError(res, error)
    }

    public static start(app: Express) {
        const handler = new ErrorHandler(app)
        return handler
    }
}