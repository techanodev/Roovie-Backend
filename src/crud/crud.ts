import { Model } from 'sequelize-typescript'
import HttpError from '../errors/http.errors'

/**
 * Helper for crud classes
 */
export default class Crud<T extends Model> {
  protected static modelName = 'Unknown'
  protected model: T

  /**
   * Create new instance from crud for use dynamic methods
   * @param {T} model
   */
  public constructor(model?: T | null) {
    if (!model) {
      // const modelName = (typeof this.constructor).
      throw HttpError.message.model.notFound()
    }
    this.model = model
  }
}
