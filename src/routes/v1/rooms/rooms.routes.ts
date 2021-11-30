import {Router} from 'express'
import {body} from 'express-validator'
import {__} from 'i18n'
import RoomController from '../../../controllers/rooms/rooms.controllers'

const routes = Router()

routes.post('/',
    body('title')
        .isString().withMessage(__('ROOM_REQUEST_NO_TITLE')),
    body('movie')
        .isNumeric().isNumeric().withMessage(__('ROOM_REQUEST_NO_MOVIE_ID')),
    RoomController.createRoom,
)

routes.delete('/:id', RoomController.deleteRoom)

routes.put('/:id', RoomController.updateRoom)

routes.get('/', RoomController.listRooms)

routes.get('/:id', RoomController.detailRoom)
