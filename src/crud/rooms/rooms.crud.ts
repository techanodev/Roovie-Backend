import HttpError from '../../errors/http.errors';
import Movie from '../../models/movies/movies.models';
import Room, { RoomI } from '../../models/rooms/rooms.models';
import UserRoom from '../../models/rooms/user_rooms.models';
import User from '../../models/users/users.models';
import Crud from '../crud';
import UserCrud from '../users/users.crud';
import { WhereOptions } from 'sequelize'
import Pagination from '../../types/pagination.types';
import RequestService from '../../services/request.services';

/**
 * Create, read, update and delete methods for room
 */
export default class RoomCrud extends Crud<Room> {

  static modelName = "اتاق";

  /**
   * Create new room for a user
   * @param {number} userId
   * @return {Promise<Room>}
   */
  async createRoom(userId: number): Promise<Room> {
    const movie = await Movie.findByPk(this.model.movieId)
    // check movie id exists or not
    if (!movie) {
      throw HttpError.message.model.notFound('فیلم')
    }
    const room = await this.model.save()

    const userRoom = new UserRoom()
    userRoom.userId = userId
    userRoom.roomId = room.id
    await userRoom.save()

    return room
  }

  /**
   * Delete a room
   * this methods has delete all UserRoom models in room
   */
  async forceDeleteRoom(userId: number): Promise<void> {
    await this._checkUserAccessRoom(userId)
    await UserRoom.destroy({ where: { id: this.model.id } })
    return await this.model.destroy({ force: true })
  }

  /**
   * Soft delete a room
   * @return {Promise<void>}
   */
  async deleteRoom(userId: number): Promise<void> {
    await this._checkUserAccessRoom(userId)
    return await this.model.destroy()
  }

  /**
   * Restore the room has soft deleted
   * @param {number} userId
   */
  async restoreRoom(userId: number): Promise<void> {
    await this._checkUserAccessRoom(userId)
    await this.model.restore()
  }

  /**
   * Update a room with new data
   * @param {RoomI} data
   * @return {Promise<Room>}
   * return updated room
   */
  async updateRoom(userId: number, data: RoomI): Promise<Room> {
    await this._checkUserAccessRoom(userId)
    return this.model.update(data)
  }

  /**
   * Add a user to room
   * @param {number} userId
   * User that you want to add
   * @throws {HttpError}
   * if user not found methods throw an error
   * @return {Promise<UserRoom>}
   */
  async addUserToRoom(userId: number): Promise<UserRoom> {
    await this._checkUserAccessRoom(userId)
    const user = await User.findByPk(userId)
    if (!user) {
      throw HttpError.message.model.notFound('کاربر')
    }
    return this._addUserToRoom(user)
  }

  /**
   * Remove a user from room
   * @param {number} userId
   * the user you want to remove from list
   */
  async removeUserFromRoom(ownerId: number, userId: number): Promise<void> {
    await this._checkUserAccessRoom(ownerId)
    const user = await User.findByPk(userId)
    if (!user) {
      throw HttpError.message.model.notFound('کاربر')
    }
    const result = await UserRoom.destroy({ where: { userId: userId } })
    if (!result) {
      throw HttpError.message.model.notFound('کاربر در اتاق')
    }
  }

  /**
   * Add list of users to room
   * @param {number[]} usersIds list of users
   */
  async addUsersToRoom(userId: number, usersIds: number[]): Promise<void> {
    await this._checkUserAccessRoom(userId)
    const users = await UserCrud.checkListOfUsersExists(usersIds)
    for (const user of users) {
      await this._addUserToRoom(user)
    }
  }

  /**
   * Add user model to model
   * @param {User} user the user you want to add
   * @return {Promise<UserRoom>}
   */
  private async _addUserToRoom(user: User): Promise<UserRoom> {
    if (!user.id) {
      throw HttpError.message.model.notFound('کاربر')
    }
    const userRoom = new UserRoom()
    userRoom.roomId = this.model.id
    userRoom.userId = user.id as number

    return userRoom.save()
  }

  private async _checkUserAccessRoom(userId: number) {
    const userRoom = await UserRoom.findOne({ where: { userId: userId, roomId: this.model.id } })
    if (!userRoom)
      throw HttpError.__(403, 'ROOM_PERMISSION_DENIED')
  }

  /**
   * Delete a room by ID
   * @param {number} id identify number of room
   * @param {number} userId id of user
   */
  static deleteRoom = async (id: number, userId: number) => {
    const room = await Room
      .findOne({
        where: { id: id },
      })
    if (!room)
      throw HttpError.message.model.notFound('اتاق')
    const crud = new RoomCrud(room)
    await crud.deleteRoom(userId)
  }

  /**
   * Restore a deleted room by Id
   * @param {number} userId 
   */
  static restoreRoom = async (id: number, userId: number) => {
    const room = await Room
      .findOne({
        where: { id: id },
        paranoid: false
      })

    if (!room)
      throw HttpError.message.model.notFound(RoomCrud.modelName)
    if (!room.deletedAt)
      throw HttpError.message.model.alreadyExists(RoomCrud.modelName)
    const crud = new RoomCrud(room)
    await crud.restoreRoom(userId)
  }

  /**
   * Update a room by ID
   * @param {number} id identify of a room
   * @param {number} userId identify of a user
   * @param {RoomI} data the data you want to update in room
   * @return {Room} a instance of new updated room
   */
  static updateRoom =
    async (id: number, userId: number, data: RoomI): Promise<Room> => {
      const room = await Room
        .findOne({
          where: { id: id }
        })

      if (!room) {
        throw HttpError.message.model.notFound('اتاق')
      }
      const crud = new RoomCrud()
      return await crud.updateRoom(userId, data)
    }

  /**
   * Get details of a room by ID
   * @param {number} id identify of room
   * @return {Promise<Room>}
   */
  static detailRoom = async (id: number, userId?: number): Promise<Room> => {
    const room = await Room.findOne({
      where: { id: id },
      include: Room.include({ movie: true, user: true }),
    })

    if (!room || !room.id || !(room.isPublic || userId)) {
      throw HttpError.message.model.notFound(RoomCrud.modelName)
    }


    if (!room?.isPublic) {
      const hasAccess = await UserRoom.findOne({ where: { roomId: room.id, userId: userId } })
      if (!hasAccess) {
        throw HttpError.message.model.notFound(RoomCrud.modelName)
      }
    }

    return room
  }

  /**
   * get list of rooms
   * @param {number} _userId
   * @return {Promise<Room[]>}
   */
  static listRooms = async (_userId?: number, pagination?: Pagination): Promise<Room[]> => {
    return await Room.findAll({
      include: Room.include({ movie: true, user: true }),
      offset: pagination?.skip,
      limit: pagination?.countPerPage
    })
  }

  /**
   * Get list of user rooms
   * @param {number} userId the user you want to get his rooms
   * @param {Pagination} pagination Pagination value for request
   * @returns {Promise<Room[]>}
   */
  static userRooms = async (userId: number, pagination?: Pagination): Promise<Room[]> => {
    const userRooms = UserRoom.findAll({
      include: UserRoom.include({ roomIncludeOption: Room.include({ movie: true, user: true }) }),
      offset: pagination?.skip,
      limit: pagination?.countPerPage,
      where: {
        userId: userId
      }
    })
    return (await userRooms).filter(x => x.room).map(x => x.room as Room)
  }
}
