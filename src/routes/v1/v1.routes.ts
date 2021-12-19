import {Router} from 'express'
import AuthRoutes from './users/auth.routes'
import ProfileRoutes from './users/users.routes'
import MovieRoutes from './movies/movies.routes'
import RoomRoutes from './rooms/rooms.routes'

const router = Router()

router.use('/account/auth', AuthRoutes)
router.use('/account/profile', ProfileRoutes)

router.use('/movies', MovieRoutes)
router.use('/rooms', RoomRoutes)

export default router
