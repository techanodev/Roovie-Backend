import i18n = require('i18n')

/**
 * Handle http codes to easier mode
 * @param {string} msg
 * text of message to show in response
 * @param {number} number of status code
 * @return {void}
 */
export default class HttpError extends Error {
  public httpCode: number

  /**
   * @param {string} msg
   * @param {number} httpCode
   */
  public constructor(msg: string, httpCode: number) {
    super(msg)
    this.httpCode = httpCode
  }

  /**
   * @param {string} modelName
   * @return {string}
   */
  private static fixModelFormat = (modelName?: string) => {
    if (!modelName) return ''
    return modelName + ' '
  }

  /**
   * Create new http error with i18n message keys
   * @param {number} httpCode http response code
   * @param {string} key key of text in i18n dictionary
   * @param {i18n.Replacements|undefined} options
   * @return {HttpError}
   */
  public static __ =
    (
        httpCode: number,
        key: string | i18n.TranslateOptions,
        options?: i18n.Replacements,
    ) => {
      return new HttpError(i18n.__(key, options ?? {}), httpCode)
    }

  public static message = {
    model: {
      /**
       * Throw new error about a model does not exists
       * @param {string} modelName
       * name of model you want show error message about it
       * @return {HttpError}
       */
      notFound: (modelName?: string) => new HttpError(
          `${HttpError.fixModelFormat(modelName)}یافت نشد.`, 404),

      /**
       * Show a message about a model that not created successfully
       * @param {string} modelName
       * name of model you want show error message about it
       * @return {HttpError}
       */
      notCreated: (modelName?: string) => {
        return new HttpError(
            `متاسفانه در ایجاد 
            ${HttpError.fixModelFormat(modelName)}
              خطایی رخ داده است.`,
            500,
        )
      },
    },
    auth: {
      user: () => new HttpError('لطفا توکن کاربری را بررسی نمایید', 403),
    },
    request: {
      notFound: () => new HttpError('درخواست مورد نظر یافت نشد.', 404),
    },
  }
}
