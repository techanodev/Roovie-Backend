import { Express } from 'express'

import V1Routes from './v1/v1.routes'

export default class Routes {
    public static init(app: Express) {
        app.use('/v1', V1Routes)
    }
}