/**
 * Service for regex
 */
export default class RegexService {
  private readonly str: string

  /**
   * @param {string} str
   */
  constructor(str: string) {
    this.str = str
  }

  /**
   * Check a string is boolean or not
   * @return {boolean}
   */
  public isBoolean(): boolean {
    return (/(1|0|true|false)/).exec(this.str) != null
  }

  /**
   * Check a string is numeric value or not
   * @return {boolean}
   */
  public isNumeric(): boolean {
    return (/(0|[1-9][0-9])/).exec(this.str) != null
  }
}
