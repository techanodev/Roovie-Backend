import Controller from '../controllers';
import { Response, Request } from 'express'
import ResponseService from '../../services/response.services';
import RoomCrud from '../../crud/rooms/rooms.crud';
import Room from '../../models/rooms/rooms.models';
import RequestService from '../../services/request.services';
import RoomResource from '../../resources/rooms/rooms.resources';
import HttpError from '../../errors/http.errors';

/**
 * Controller for rooms
 */
export default class RoomController extends Controller {
  /**
   * Create room
   * @param {Request} req
   * @param {Response} res
   */
  public static createRoom = async (req: Request, res: Response) => {
    try {
      RoomController.checkValidationResult(req)
      let room = new Room()
      const request = RequestService.newInstance(req)
      request.fillModel(room)
      const userId = (await request.user())?.id as number
      const roomCrud = new RoomCrud(room)
      room = await roomCrud.createRoom(userId)
      ResponseService
        .makeNew(res)
        .model.success
        .create(room.id, 'اتاق')
        .response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * Delete room
   * @param {Request} req
   * @param {Response} res
   */
  public static deleteRoom = async (req: Request, res: Response) => {
    try {
      const request = RequestService.newInstance(req)
      const userId = (await request.user())?.id as number
      const roomId = Number.parseInt(req.params.id)
      await RoomCrud.deleteRoom(roomId, userId)
      ResponseService.makeNew(res).model.success.delete('اتاق').response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * Update room
   * @param {Request} req
   * @param {Response} res
   */
  public static updateRoom = async (req: Request, res: Response) => {
    try {
      const request = RequestService.newInstance(req)
      const userId = (await request.user())?.id
      if (!userId)
        throw HttpError.message.auth.user()
      const roomId = Number.parseInt(req.params.id)
      await RoomCrud.updateRoom(roomId, userId, req.body)
      ResponseService.makeNew(res).model.success.update('اتاق').response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * Restore a room by Id 
   * @param {Request} req 
   * @param {Response} res 
   */
  public static restoreRoom = async (req: Request, res: Response) => {
    try {
      const request = RequestService.newInstance(req)
      const userId = (await request.user())?.id
      if (!userId)
        throw HttpError.message.auth.user()
      const roomId = Number.parseInt(req.params.id)
      await RoomCrud.restoreRoom(roomId, userId)
      ResponseService.makeNew(res).model.success.restore(RoomCrud.modelName).response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * list of rooms
   * @param {Request} _req
   * @param {Response} res
   */
  public static listRooms = async (_req: Request, res: Response) => {
    try {
      const rooms = await RoomCrud.listRooms()
      RoomController.responseModels(res, 'rooms', rooms, RoomResource)
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  public static userRooms = async (req: Request, res: Response) => {
    try {
      const request = new RequestService(req)
      const user = await request.user()
      if (!user || !user.id) {
        throw HttpError.message.auth.user()
      }
      const rooms = await RoomCrud.userRooms(user.id, request.pagination())
      RoomController.responseModels(res, 'rooms', rooms, RoomResource)
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * Details of a room
   * @param {Request} req
   * @param {Response} res
   */
  public static detailRoom = async (req: Request, res: Response) => {
    try {
      const userId = (await (new RequestService(req)).user())?.id
      const id = Number.parseInt(req.params.roomId)
      const room = await RoomCrud.detailRoom(id, userId)
      const response = new ResponseService(res)
      response.setStatus(true)
      response.set('room', new RoomResource(room))
      response.setStatusCode(200)
      response.response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }
}
