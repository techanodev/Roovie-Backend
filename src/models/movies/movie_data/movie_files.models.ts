import {
    AllowNull,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    NotNull,
    Table,
} from 'sequelize-typescript'
import HttpError from '../../../errors/http.errors'
import Movie from '../movies.models'
import MovieDataKey, { MovieDataKeyTypes } from './movie_data_key.models'

export interface MovieFileI {
    id?: number
    movieId: number
    path: string
    typeId: number
}

@Table({
    tableName: 'movie_files',
})
export default class MovieFile extends Model<MovieFile> implements MovieFileI {
    @AllowNull(false)
    @NotNull
    @ForeignKey(() => Movie)
    @Column({ field: 'movie_id' })
    movieId!: number

    @AllowNull(false)
    @NotNull
    @Column
    path!: string

    @AllowNull(false)
    @NotNull
    @ForeignKey(() => MovieDataKey)
    @Column({ field: 'type_id' })
    typeId!: number

    @BelongsTo(() => Movie)
    movie?: Movie

    @BelongsTo(() => MovieDataKey)
    type?: MovieDataKey

    async save() {
        if (!this.type) {
            const type = await MovieDataKey.findByPk(this.type)

            if (!type) throw HttpError.message.model.notFound('نوع فایل')

            if (type.type == MovieDataKeyTypes.File)
                throw HttpError.__(401, 'MOVIE_FILE_TYPE_NOT_VALID', {})

            this.type = type
        }
        return await super.save()
    }
}
