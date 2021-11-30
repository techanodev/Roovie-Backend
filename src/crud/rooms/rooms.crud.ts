import HttpError from '../../errors/http.errors';
import Movie from '../../models/movies/movies.models';
import Room, {RoomI} from '../../models/rooms/rooms.models';
import UserRoom from '../../models/rooms/user_rooms.models';
import User from '../../models/users/users.models';
import Crud from '../crud';
import UserCrud from '../users/users.crud';

/**
 * Create, read, update and delete methods for room
 */
export default class RoomCrud extends Crud<Room> {
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
  async forceDeleteRoom(): Promise<void> {
    await UserRoom.destroy({where: {id: this.model.id}})
    return await this.model.destroy({force: true})
  }

  /**
   * Soft delete a room
   * @return {Promise<void>}
   */
  async deleteRoom(): Promise<void> {
    return await this.model.destroy()
  }

  /**
   * Update a room with new data
   * @param {RoomI} data
   * @return {Promise<Room>}
   * return updated room
   */
  async updateRoom(data: RoomI): Promise<Room> {
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
  async removeUserFromRoom(userId: number): Promise<void> {
    const user = await User.findByPk(userId)
    if (!user) {
      throw HttpError.message.model.notFound('کاربر')
    }
    const result = await UserRoom.destroy({where: {userId: userId}})
    if (!result) {
      throw HttpError.message.model.notFound('کاربر در اتاق')
    }
  }

  /**
   * Add list of users to room
   * @param {number[]} usersIds list of users
   */
  async addUsersToRoom(usersIds: number[]): Promise<void> {
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

  /**
   * Delete a room by ID
   * @param {number} id identify number of room
   * @param {number} userId id of user
   */
  static deleteRoom = async (id: number, userId: number) => {
    const room = await Room
        .findOne({where: {id: id}, include: Room.include({userId: userId})})
    if (!room) {
      throw HttpError.message.model.notFound('اتاق')
    }
    const crud = new RoomCrud(room)
    await crud.deleteRoom()
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
        .findOne({where: {id: id}, include: Room.include({userId: userId})})

    if (!room) {
      throw HttpError.message.model.notFound('اتاق')
    }
    const crud = new RoomCrud()
    return await crud.updateRoom(data)
  }
}
