export default class ValidationError extends Error {
    public location: string
    public field: string
    public constructor(msg: string, location: string, columnName: string) {
        super(msg)
        this.location = location
        this.field = columnName
    }
}