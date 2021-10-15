import RegexService from './regex.services'

/**
 * Service for string
 */
export default class StringService {
}

declare global {
    // eslint-disable-next-line no-unused-vars
  interface String {
    /**
     * To camel_case format
     */
    toCamelLowerCase(): string

    /**
     * To CamelCase format
     */
    toCamelUpperCase(): string

    /**
     * To camelCase format
     */
    toCamelStandardCase(): string

    isJson(): boolean

    decodeJson(): any

    regex(): RegexService

    toBoolean(): boolean

    isNumeric(): boolean
  }
}

String.prototype.toCamelLowerCase = function(): string {
  const re = /[A-Z]/
  let val: string = this.toString()
  while (re.exec(val)) {
    const r = re.exec(val)
    if (r == null) break
    if (r.index == 0) {
      val = val.replace(r[0], r[0].toLowerCase())
      continue
    }
    val = val.replace(r[0], '_' + r[0].toLowerCase())
  }
  return val.toString()
}

String.prototype.toCamelUpperCase = function(): string {
  const re = /_[a-z]/
  let val: string = this.toString()
  val = val.replace(/^\w/, (c) => c.toUpperCase())
  while (re.exec(val)) {
    const r = re.exec(val)
    if (r == null) break
    val = val.replace(r[0], r[0].replace('_', '').toUpperCase())
  }
  return val.toString()
}

String.prototype.toCamelStandardCase = function(): string {
  return this.toCamelUpperCase()
      .toString()
      .replace(/^\w/, (c) => c.toLowerCase())
      .toString()
}

String.prototype.isJson = function(): boolean {
  try {
    JSON.parse(this.toString())
    return true
  } catch {
    return false
  }
}

String.prototype.decodeJson = function(): any {
  return JSON.parse(this.toString())
}

String.prototype.regex = function(): RegexService {
  return new RegexService(this.toString())
}

String.prototype.toBoolean = function(): boolean {
  if (!this.regex().isBoolean()) return false
  return (/(true|1)/).exec(this.toLowerCase()) != undefined
}

String.prototype.isNumeric = function(): boolean {
  return !isNaN(Number(this))
}
