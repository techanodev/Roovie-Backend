import i18n = require('i18n')
import '../config/lang'

export type LocationTypes = 'body' | 'parameters'

/**
 * Handle errors related to validations problems
 */
export default class ValidationError extends Error {
  public location: string
  public field: string

  /**
   * @param {string} msg
   * @param {LocationTypes} location
   * @param {string} columnName
   */
  public constructor(
      msg: string, location: LocationTypes, columnName: string) {
    super(msg)
    this.location = location
    this.field = columnName
  }

  /**
   * Set error message from i18n dictionary
   * @param {string} key
   * @param {LocationTypes} location
   * @param {string} columnName
   * @return {ValidationError}
   */
  public static __(key: string, location: LocationTypes, columnName: string) {
    return new ValidationError(i18n.__(key), location, columnName)
  }
}
