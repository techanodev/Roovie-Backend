import Controller from '../controllers';
import {Response, Request} from 'express'
import ResponseService from '../../services/response.services';
import RoomCrud from '../../crud/rooms/rooms.crud';
import Room from '../../models/rooms/rooms.models';
import RequestService from '../../services/request.services';
import RoomResource from '../../resources/rooms/rooms.resources';

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
      ResponseService.makeNew(res).model.success.create(room.id, 'اتاق')
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
      const roomId = Number.parseInt(req.params.roomId)
      await RoomCrud.deleteRoom(roomId, userId)
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
      const userId = (await request.user())?.id as number
      const roomId = Number.parseInt(req.params.roomId)
      await RoomCrud.updateRoom(roomId, userId, req.body)
      ResponseService.makeNew(res).model.success.update('اتاق')
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }

  /**
   * list of rooms
   * @param {Request} req
   * @param {Response} res
   */
  public static listRooms = async (req: Request, res: Response) => {
    try {
      const rooms = await RoomCrud.listRooms()
      RoomController.responseModels(res, 'rooms', rooms)
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
      const id = Number.parseInt(req.params.roomId)
      const room = await RoomCrud.detailRoom(id)
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
