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
import User from '../users/users.models'
import MovieFile from './movie_data/movie_files.models'
import Series from './series.models'

export interface MovieI {
    id?: number
    name: string
    nameEnglish: string
    userId: number
    duration: number
    isPublic: boolean
    seriesId: number
    episode?: number
    season?: number
}

@Table({
  tableName: 'movies',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
/**
 * Movie class
 */
export default class Movie extends Model<Movie> implements MovieI {
    @AllowNull(false)
    @NotEmpty
    @Column
    name!: string

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => User)
    @Column({field: 'name_english'})
    nameEnglish!: string

    @AllowNull(false)
    @NotEmpty
    @Column({field: 'user_id'})
    userId!: number

    @AllowNull(false)
    @NotEmpty
    @Column
    duration!: number

    @AllowNull(false)
    @NotEmpty
    @Column({field: 'is_public'})
    isPublic!: boolean

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => Series)
    @Column({field: 'series_id'})
    seriesId!: number

    @AllowNull(true)
    @Default(1)
    @Column
    episode?: number

    @AllowNull(true)
    @Default(1)
    @Column
    season?: number

    @BelongsTo(() => User)
    user?: User

    @BelongsTo(() => Series)
    series?: Series

    @HasMany(() => MovieFile)
    files?: MovieFile[]
}
