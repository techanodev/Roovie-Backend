import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import {Includeable} from 'sequelize/types'
import Movie from '../movies/movies.models'
import User from '../users/users.models'
import Room from './rooms.models'

export type UserRoomIncludeOptions = {
    /**
     * Include user model
     */
    user?: boolean
    /**
     * Include movie model
     */
    movie?: boolean
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
    @Column({field: 'user_id'})
    userId!: number

    @ForeignKey(() => Room)
    @Column({field: 'room_id'})
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
      if (option.movie) {
        const include: Includeable = {
          model: Movie,
        }
        includes.push(include)
      }
      if (option.user) {
        const include: Includeable = {
          model: User,
        }
        includes.push(include)
      }
      return includes
    }
}
