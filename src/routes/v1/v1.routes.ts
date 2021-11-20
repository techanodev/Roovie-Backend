import {Router} from 'express'
import AuthRoutes from './users/auth.routes'
import MovieRoutes from './movies/movies.routes'

const router = Router()

router.use('/account/auth', AuthRoutes)

router.use('/movies', MovieRoutes)

export default router
