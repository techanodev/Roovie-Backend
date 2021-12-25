import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { Includeable } from 'sequelize/types'
import User from '../users/users.models'
import Room, { RoomsIncludeOptions } from './rooms.models'

export type UserRoomIncludeOptions = {
  /**
   * Include user model
   */
  user?: boolean
  /**
   * Include room model
   */
  room?: boolean

  /**
   * Filter user id
   */
  userId?: number

  /**
   * Include options for room model
   */
  roomIncludeOption?: Includeable[]

  /**
   * Include options for user model
   */
  userIncludeOption?: Includeable[]
}

export interface UserRoomI {
  nickname?: string
  userId: number
  roomId: number
}

@Table({
  tableName: 'user_room',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
/**
 * User room model
 */
export default class UserRoom extends Model<UserRoom> implements UserRoomI {
  @AllowNull(true)
  @Column
  nickname?: string

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId!: number

  @ForeignKey(() => Room)
  @Column({ field: 'room_id' })
  roomId!: number

  @BelongsTo(() => User)
  user?: User

  @BelongsTo(() => Room)
  room?: Room

  /**
   * Include models for user room foreign keys
   * @param {UserRoomIncludeOptions} option
   * @return {IncludeOptions[]}
   */
  static include(option: UserRoomIncludeOptions): Includeable[] {
    const includes: Includeable[] = []
    if (option.room || option.roomIncludeOption) {
      const include: Includeable = {
        model: Room,
        include: option.roomIncludeOption ?? []
      }
      includes.push(include)
    }
    if (option.user || option.userIncludeOption || option.userId) {
      const include: Includeable = {
        model: User,
        include: option.userIncludeOption ?? []
      }
      if (option.userId) {
        include.where = { userId: option.userId }
      }
      includes.push(include)
    }
    return includes
  }
}
