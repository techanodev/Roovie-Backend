import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  NotNull,
  Table,
} from 'sequelize-typescript'
import Movie from '../movies.models'
import MovieDataKey from './movie_data_key.models'

export interface MovieFileI {
  id?: number
  movieId: number
  path: string
  type: MoviesFileTypes
}

export type MoviesFileTypes = 'subtitle' | 'movie' | 'audio'

@Table({
  tableName: 'movie_files',
})
/**
 * Movie files
 */
export default class MovieFile extends Model<MovieFile> implements MovieFileI {
  @AllowNull(false)
  @NotNull
  @ForeignKey(() => Movie)
  @Column({field: 'movie_id'})
  movieId!: number

  @AllowNull(false)
  @NotNull
  @Column
  path!: string

  @AllowNull(false)
  @NotNull
  @ForeignKey(() => MovieDataKey)
  @Column({field: 'type', type: DataType.STRING})
  type!: MoviesFileTypes

  @BelongsTo(() => Movie)
  movie?: Movie
}
