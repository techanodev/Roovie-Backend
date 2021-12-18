import {Router} from 'express'

import '../../../locales/fa.json'
import UserController from '../../../controllers/users/user.controllers'
import * as multer from 'multer'
import UploadService from '../../../services/upload.services'

const routes = Router()

routes.post(
    '/photo',
    multer({
      storage: UploadService.userProfilePhoto,
      fileFilter: UploadService.imageFilter,
    }).single('photo'),
    UserController.uploadPhoto,
)

routes.get('', UserController.profile)

export default routes
