
export default class DateService {

}

declare global {
    interface Date {
        monthDiff(date: Date): number

        dayDiff(date: Date): number

        getFromTimeString(date: Date): string

        addMonths(n: number): Date

        addMinutes(n: number): Date
    }
}

Date.prototype.monthDiff = function (date): number {
    let months
    months = (date.getFullYear() - this.getFullYear()) * 12
    months -= this.getMonth()
    months += date.getMonth()
    return months <= 0 ? 0 : months
}

Date.prototype.dayDiff = function (date: Date): number {
    return Math.round(((date.getTime() - this.getTime())) / (1000 * 60 * 60 * 24))
}

Date.prototype.getFromTimeString = function (date): string {
    let totalDays = new Date().dayDiff(date)
    let totalMonths = 0
    let totalYears = 0

    let expireAt = `${totalDays} روز`

    if (totalDays > 30) {
        totalMonths = Number.parseInt((totalDays / 30).toString())
        totalDays = totalDays - (totalMonths * 30)
        expireAt = `${totalMonths} ماه و ${totalDays} روز`
    }

    if (totalMonths > 12) {
        totalYears = Number.parseInt((totalMonths / 12).toString())
        totalMonths = totalMonths - (totalYears * 12)
        expireAt = `${totalYears} سال و ${totalMonths} ماه و ${totalDays} روز`
    }

    return expireAt
}

Date.prototype.addMonths = function (n: number): Date {
    return new Date(this.setMonth(this.getMonth() + n))
}

Date.prototype.addMinutes = function (n: number): Date {
    return new Date(this.setMinutes(this.getMinutes() + n))
}