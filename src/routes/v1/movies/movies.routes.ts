import {Router} from 'express'
import {body} from 'express-validator'
import {__} from 'i18n'
import MovieController from '../../../controllers/movies/movies.controllers'

const routes = Router()

routes.post('/create/url',
    body('url')
        .isString().withMessage(__('MOVIE_REQUEST_NO_URL')),
    MovieController.createMovieByUrl)

export default routes
