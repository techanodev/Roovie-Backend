import { AllowNull, Column, DataType, Default, Model, NotNull, Table } from 'sequelize-typescript'

export enum MovieDataKeyTypes {
    Meta = 0,
    File = 1,
}

export enum MovieDataKeyDataTypes {
    String = 0,
    Number = 1,
    Boolean = 2,
}

export interface MovieDataKeyI {
    id?: number
    title: string
    titleEnglish: string
    defaultValue?: string
    type: MovieDataKeyTypes
    dataType?: MovieDataKeyDataTypes
}

@Table({
    tableName: 'movie_data_key',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export default class MovieDataKey extends Model<MovieDataKey> implements MovieDataKeyI {
    @AllowNull(false)
    @NotNull
    @Column
    title!: string

    @AllowNull(false)
    @NotNull
    @Column({ field: 'title_english' })
    titleEnglish!: string

    @Default('')
    @Column({ field: 'default_values' })
    defaultValue?: string

    @Column({ type: DataType.NUMBER })
    type!: MovieDataKeyTypes

    @AllowNull(true)
    @Column({ field: 'data_type', type: DataType.NUMBER })
    dataType?: MovieDataKeyDataTypes
}
