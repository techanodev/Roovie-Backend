import {Model} from 'sequelize-typescript'
import '../services/string.services'

/**
 * Model Service
 */
export default class ModelService {
  /**
   * Fill model by data in request's body
   * @param {any} data
   * @param {Model} model
   * @return {Model}
   */
  public static fillModel<T extends Model>(data: any, model: T) {
    const keys = Object.keys(data)
    for (const key of keys) {
      const modelKey = ModelService.checkModelColumnInRequest<T>(model, key)
      if (modelKey == null) continue
      model.set(modelKey, data[key])
    }
    return model
  }


  /**
   * check all body values in request for fill model
   * @param {Model} model
   * @param {string} reqBody
   * @return {string|null}
   */
  private static checkModelColumnInRequest =
    <T extends Model>(model: T, reqBody: string): string | null => {
      if (reqBody == '') return null
      if (reqBody.toCamelLowerCase() in model) {
        return reqBody.toCamelLowerCase()
      }
      if (reqBody.toCamelStandardCase() in model) {
        return reqBody.toCamelStandardCase()
      }
      if (reqBody.toCamelUpperCase() in model) {
        return reqBody.toCamelUpperCase()
      }
      if (!reqBody.toLowerCase().includes('id')) {
        return ModelService.checkModelColumnInRequest<T>(model, reqBody + 'Id')
      }
      return null
    }
}
