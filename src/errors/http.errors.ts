import i18n = require("i18n")

export default class HttpError extends Error {
    public httpCode: number

    public constructor(msg: string, httpCode: number) {
        super(msg)
        this.httpCode = httpCode
    }

    private static fixModelFormat = (modelName?: string) => {
        if (!modelName) return ''
        return modelName + ' '
    }

    public static __(httpCode: number, key: string | i18n.TranslateOptions, options: i18n.Replacements) {
        return new HttpError(i18n.__(key, options), httpCode)
    }

    public static message = {
        model: {
            /**
             * Throw new error about a model does not exists
             * @param modelName name of model you want show error message about it
             * @returns HttpError
             */
            notFound: (modelName?: string) => new HttpError(`${HttpError.fixModelFormat(modelName)}یافت نشد.`, 404),

            /**
             * Show a message about a model that not created successfully
             * @param modelName name of model you want show error message about it
             * @returns HttpError
             */
            notCreated: (modelName?: string) => new HttpError(`متاسفانه در ایجاد ${HttpError.fixModelFormat(modelName)}خطایی رخ داده است.`, 500)
        },
        auth: {
            artist: () => new HttpError('متاسفانه شما دسترسی هنرمند ندارید.', 403),
            user: () => new HttpError('لطفا توکن کاربری را بررسی نمایید', 403)
        },
        request: {
            searchQuery: () => new HttpError('لطفا کوئری سرچ را وارد نمایید.', 401),
            notFound: () => new HttpError('درخواست مورد نظر یافت نشد.', 404)
        }
    }
}