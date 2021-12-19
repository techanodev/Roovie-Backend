import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  NotEmpty,
  Table,
} from 'sequelize-typescript'
import {Includeable} from 'sequelize/types'
import Movie from '../movies/movies.models'
import User from '../users/users.models'
import UserRoom from './user_rooms.models'

export type RoomsIncludeOptions = {
  /**
   * If true, movie foreign key has included movie model
   */
  movie?: boolean,
  /**
   * If have a valid numeric value, movie model has included with defined id
   */
  movieId?: number,

  /**
   * If true, movie foreign key has included users in this room
   */
  user?: boolean,

  /**
   * If have a valid numeric value, the user included by Id
   */
  userId?: number
}

export interface RoomI {
  id?: number
  title: string
  movieId: number
  description?: string
  startTime?: Date
  endTime?: Date
  maxUsers?: number
  password?: string
  isPublic?: boolean
}

@Table({
  tableName: 'room',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
})
/**
 * Room model class
 */
export default class Room extends Model<Room> implements RoomI {
  @AllowNull(false)
  @NotEmpty
  @Column
  title!: string

  @AllowNull(false)
  @NotEmpty
  @ForeignKey(() => Movie)
  @Column({field: 'movie_id'})
  movieId!: number

  @AllowNull(true)
  @Column
  description?: string

  @Column({field: 'start_time'})
  startTime?: Date

  @Column({field: 'end_time'})
  endTime?: Date

  @AllowNull(false)
  @Default(-1)
  @Column({field: 'max_users'})
  maxUsers?: number

  @AllowNull(true)
  @Column
  password?: string

  @AllowNull(false)
  @Default(false)
  @Column({field: 'is_public'})
  isPublic?: boolean

  @BelongsTo(() => Movie)
  movie?: Movie

  @HasMany(() => UserRoom)
  userRooms?: UserRoom[]

  /**
   * Include models for room model
   * @param {RoomsIncludeOptions} option Options to include models for room
   * @return {Includeable[]}
   */
  static include(option?: RoomsIncludeOptions): Includeable[] {
    const includes: Includeable[] = []
    if (option?.movie || option?.movieId) {
      const include: Includeable = {
        model: Movie,
      }
      if (option.movieId) {
        include.where = {movieId: option.movieId}
      }
      includes.push(include)
    }
    if (option?.user || option?.userId) {
      const include: Includeable = {
        model: User,
      }
      if (option.userId) {
        include.where = {id: option.userId}
      }
    }
    return includes
  }
}
