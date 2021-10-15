import {Router} from 'express'
import AuthRoutes from './users/auth.routes'

const router = Router()

router.use('/account/auth', AuthRoutes)

export default router
