import {Request} from 'express'
import {Model} from 'sequelize-typescript'
import {PhoneNumber} from '../models/users/users.models'
import Pagination, {PaginationI} from '../types/pagination.types'
import '../services/string.services'


import ModelService from './model.services'

/**
 * Request Service
 * @return {void}
 */
export default class RequestService {
  private req: Request

  /**
   * add more methods to express request
   * @param {Express.Request} req
   */
  constructor(req: Request) {
    this.req = req
  }

  /**
   * Create new instance from RequestService
   * @param {Express.Request} req
   * @return {RequestService}
   */
  public static newInstance(req: Request) {
    return new RequestService(req)
  }

  /**
   * Get pagination value form express request
   * @param {Express.Request} req
   * @param {Pagination|PaginationI} pagination
   * @return {Pagination}
   */
  public static pagination(req: Request, pagination: PaginationI = {
    page: 1,
    countPerPage: 10,
  }): Pagination {
    return RequestService.newInstance(req).pagination(pagination)
  }

  /**
   * Get phone number value from express request
   * @param {Express.Request} req
   * @return {PhoneNumber}
   */
  public static phone(req: Request): PhoneNumber {
    return RequestService.newInstance(req).phone()
  }

  /**
   * get pagination value from request
   * @param {Pagination|PaginationI} pagination
   * @return {Pagination}
   */
  public pagination(pagination: PaginationI | Pagination = {
    page: 1,
    countPerPage: 10,
  }): Pagination {
    if (Number(this.req.query.page)) {
      pagination.page = Number(this.req.query.page)
    }
    if (Number(this.req.query.count)) {
      pagination.countPerPage = Number(this.req.query.count)
    }

    return pagination as Pagination
  }

  /**
   * Fill model by express body data
   * @param {Model} model
   * @return {Model}
   */
  public fillModel<T extends Model>(model: T) {
    return ModelService.fillModel(this.req.body, model)
  }

  /**
   * Convert a value to list of values
   * @param {any|any[]} value
   * @return {any[]}
   */
  public toArray = <T>(value: T | T[]): T[] => {
    if (Array.isArray(value)) return value
    return [value]
  }

  /**
   * get phone number type from Express request
   * @return {PhoneNumber}
   */
  public phone(): PhoneNumber {
    const countryCode = this.req.body?.country_code ?? '98'
    const phoneNumber = this.req.body.phone_number
    return {number: phoneNumber, countryCode: countryCode ?? '98'}
  }
}
