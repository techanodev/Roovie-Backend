export default class RegexService {
    private str: string
    constructor(str: string) {
        this.str = str
    }

    public isBoolean = (): boolean => {
        return (/(1|0|true|false)/).exec(this.str) != null
    }

    public isNumeric = (): boolean => {
        return (/(0|[1-9][0-9])/).exec(this.str) != null
    }
}