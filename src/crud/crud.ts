import { Model } from 'sequelize-typescript'

export default class Crud<T extends Model> {
    protected static modelName = 'Unknown'
    protected model: T

    public constructor(model: T) {
        this.model = model
    }
}