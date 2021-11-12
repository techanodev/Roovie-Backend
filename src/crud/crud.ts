import {Model} from 'sequelize-typescript'

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
  public constructor(model: T) {
    this.model = model
  }
}
