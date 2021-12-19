import {Response} from 'express'
import {Result, ValidationError} from 'express-validator'
import {Model} from 'sequelize/types'
import Resource from '../resources/resources'
import * as jwt from 'jsonwebtoken'
import * as sequelize from 'sequelize'
import HttpError from '../errors/http.errors'
import CustomValidationError from '../errors/validation.errors'


/**
 * Response service
 */
export default class ResponseService {
  private res: Response
  private readonly attributes: { [key: string]: any; }
  private statusCode: number
  private isStatusChange = false
  private isStatusCodeChange = false

  /**
   * @param {Express.Response} res
   */
  public constructor(res: Response) {
    this.res = res
    this.attributes = {}
    this.setStatus(false)
    this.statusCode = 200
  }

  /**
   * @param {Express.Response} res
   * @return {ResponseService}
   */
  public static newInstance = (res: Response) => {
    return new ResponseService(res)
  }

  /**
   * @param {Express.Response} res
   * @param {any} errors
   * @return {void}
   */
  public static responseValidationCode =
    (res: Response, errors: Result<ValidationError>) => {
      return ResponseService.newInstance(res)
          .setStatusCode(400).set('errors', errors.array()).response()
    }

  /**
   * @param {Express.Response} res
   * @param {any|Error} error
   * @return {ResponseService}
   */
  public static handleErrorResponse = (res: Response, error: any | Error) => {
    const response = new ResponseService(res)

    if (error instanceof HttpError) {
      response.set('name', error.name)
      response.setStatusCode(error.httpCode)
      response.setMessage(error.message)
    } else if (error instanceof jwt.TokenExpiredError) {
      response.setMessage('لطفا دوباره وارد شوید.')
      response.setStatusCode(403)
    } else if (error instanceof jwt.JsonWebTokenError) {
      response.setMessage(error.message)
      response.setStatusCode(500)
    } else if (error instanceof sequelize.ConnectionError) {
      response
          .setMessage('متاسفانه در اتصال به بانک اطلاعاتی خطایی روی داده است.')
    } else if (error instanceof sequelize.ValidationError) {
      response
          .setMessage(error.errors[0]?.message ?? 'خطای نامشخص برای دیتابیس')
      response.setStatusCode(400)
    } else if (error instanceof sequelize.UniqueConstraintError) {
      response.setMessage(error.sql)
      response.set('sql', error.errors)
      response.setStatusCode(400)
    } else if (error instanceof sequelize.DatabaseError) {
      response.setStatusCode(500)
      response.setMessage(error.message)
    } else if (error instanceof CustomValidationError) {
      response.setStatusCode(400)
      response.setMessage(error.message)
    } else if (error instanceof Error) {
      response.set('name', error.name)
      response.setMessage(error.message)
    } else if (typeof error == typeof {}) {
      response.setStatusCode(400)
      for (const key in error) {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          const errorValue = error[key]
          response.set(key, errorValue)
        }
      }
    } else {
      response.setStatusCode(500)
      response.setMessage(error)
    }
    console.log(error)
    return response
  }

  /**
   * @param {Express.Response} res
   * @param {Error|any} error
   */
  public static handleError =
    (res: Response, error: any | Error) => {
      ResponseService.handleErrorResponse(res, error).response()
    }

  /**
   * @param {Express.Response} res
   * @param {Model} model
   * @param {any} conditions
   * @return {ResponseService}
   */
  public static modelNotFound = (
      res: Response,
      model: Model,
      conditions: { [attribute: string]: string }) => {
    const response = ResponseService.newInstance(res)
        .setStatusCode(404)
        .set('name', model.constructor.name)
        .setMessage('اطلاعاتی با مدل مورد نظر یافت نشد.')

    for (const [key, value] of Object.entries(conditions)) {
      response.set(key, value)
    }

    return response.response()
  }

  /**
   * @param {string} attr
   * @param {any} value
   * @return {ResponseService}
   */
  public set(attr: string, value: any) {
    if (value instanceof Resource) {
      this.attributes[attr] = value.toArray()
    } else {
      this.attributes[attr] = value
    }
    return this
  }

  /**
   * @param {[{ attr: string, value: any }]} dataList
   * @return {ResponseService}
   */
  public setList(dataList: [{ attr: string, value: any }]) {
    for (const data of dataList) {
      this.set(data.attr, data.value)
    }
    return this
  }

  /**
   * @param {any} dataObject
   * @return {ResponseService}
   */
  public setObject(dataObject: { [index: string]: any }) {
    Object.keys(dataObject).forEach((key) => {
      this.set(key, dataObject[key])
    })
    return this
  }

  /**
   * Get a attribute
   * @param {string} attr
   * @return {any}
   */
  public get(attr: string) {
    return this.attributes[attr]
  }

  /**
   * Remove a attribute from response
   * @param {string} attr
   * @return {ResponseService}
   */
  public remove(attr: string) {
    delete this.attributes[attr]
    return this
  }

  /**
   * Set status attribute in response
   * @param {boolean} value
   * @return {ResponseService}
   */
  public setStatus(value: boolean) {
    this.isStatusChange = true
    if (!value && !this.isStatusCodeChange) {
      this.setStatusCode(500)
    }
    return this.set('status', value)
  }

  /**
   * Set message attribute in response
   * @param {string} value
   * @return {ResponseService}
   */
  public setMessage(value: string) {
    return this.set('msg', value)
  }

  /**
   * Set http status code for response result
   * @param {number} statusCode
   * @return {ResponseService}
   */
  public setStatusCode(statusCode: number) {
    this.statusCode = statusCode
    this.isStatusCodeChange = true
    const statusCodeGroup = Number.parseInt((statusCode / 100).toString())
    if (this.isStatusChange && statusCodeGroup == 2) {
      this.setStatus(true)
    }
    return this
  }

  /**
   * To array response value
   * @return {string}
   */
  public toArray() {
    const json: { [key: string]: string } = {}
    for (const key in this.attributes) {
      if (!Object.prototype.hasOwnProperty.call(this.attributes, key)) continue
      json[key] = this.attributes[key]
    }

    return JSON.stringify(json)
  }

  /**
   * Response the service values to express request
   */
  public response() {
    this.res.status(this.statusCode).json(this.attributes)
  }

  /**
   * @param {Express.Response} res
   * @return {any}
   */
  public static makeNew = (res: Response) => {
    const fixModelFormat = (modelName?: string) => {
      if (!modelName) return ''
      return modelName + ' '
    }
    return {
      model: {
        fail: {
          notFound: (modelName?: string) =>
            ResponseService.handleErrorResponse(res,
                HttpError.message.model.notFound(modelName)),
          notCreated: (modelName?: string) =>
            ResponseService.handleErrorResponse(res,
                HttpError.message.model.notCreated(modelName)),
        },
        success: {
          update: (modelName?: string) =>
            ResponseService.newInstance(res)
                .setMessage(
                    `${fixModelFormat(modelName)}با موفقیت بروزرسانی شد.`,
                )
                .setStatus(true),
          create: (modelId: number, modelName?: string) => ResponseService
              .newInstance(res).set('id', modelId)
              .setMessage(`${fixModelFormat(modelName)}با موفقیت اضافه شد.`)
              .setStatusCode(201).setStatus(true),
          delete: (modelName?: string) => ResponseService
              .newInstance(res)
              .setMessage(`${fixModelFormat(modelName)}با موفقیت حذف شد.`)
              .setStatus(true),
          restore: (modelName?: string) => ResponseService.newInstance(res)
              .setMessage(
                  `${fixModelFormat(modelName)} با موفقیت برگردانده شد.`,
              )
              .setStatus(true),
        },
      },
    }
  }
}
