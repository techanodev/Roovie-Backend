import {Router} from 'express'
import AuthRoutes from './users/auth.routes'
import ProfileRoutes from './users/users.routes'
import MovieRoutes from './movies/movies.routes'

const router = Router()

router.use('/account/auth', AuthRoutes)
router.use('/account/profile', ProfileRoutes)

router.use('/movies', MovieRoutes)

export default router
