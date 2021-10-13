import { AllowNull, Column, HasMany, IsNull, Model, NotEmpty, Table } from "sequelize-typescript";
import Movie from "./movies.models";

export interface SeriesI {
    id?: number
    title: string
    titleEnglish: string
}

@Table({
    tableName: 'series',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
})
export default class Series extends Model<Series> implements SeriesI {

    @NotEmpty
    @AllowNull(false)
    @Column
    title!: string

    @NotEmpty
    @AllowNull(false)
    @Column({ field: 'title_english' })
    titleEnglish!: string

    @HasMany(() => Movie)
    episodes?: Movie[]
}