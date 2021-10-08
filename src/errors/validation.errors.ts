import i18n = require('i18n')
import '../config/lang'

export type LocationTypes = 'body' | 'parameters'

export default class ValidationError extends Error {
    public location: string
    public field: string
    public constructor(msg: string, location: LocationTypes, columnName: string) {
        super(msg)
        this.location = location
        this.field = columnName
    }

    public static __(key: string, location: LocationTypes, columnName: string) {
        return new ValidationError(i18n.__(key), location, columnName)
    }
}