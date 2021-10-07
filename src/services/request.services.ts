import { Request } from 'express'
import { Model } from 'sequelize-typescript'
import { PhoneNumber } from '../models/users/users.models'
import Pagination, { PaginationI } from '../types/pagination.types'
import '../utils/String'

import ModelService from './model.services'

export default class RequestService {
    private req: Request

    constructor(req: Request) {
        this.req = req
    }

    public static newInstance(req: Request) {
        return new RequestService(req)
    }

    public static pagination(req: Request, pagination: PaginationI = { page: 1, countPerPage: 10 }): Pagination {
        return RequestService.newInstance(req).pagination(pagination)
    }

    public static phone(req: Request): PhoneNumber {
        return RequestService.newInstance(req).phone()
    }

    public pagination(pagination: PaginationI | Pagination = { page: 1, countPerPage: 10 }): Pagination {
        if (Number(this.req.query.page)) {
            pagination.page = Number(this.req.query.page)
        }
        if (Number(this.req.query.count)) {
            pagination.countPerPage = Number(this.req.query.count)
        }

        return pagination as Pagination
    }

    public fillModel<T extends Model>(model: T) {
        return ModelService.fillModel(this.req.body, model)
    }

    public toArray = <T>(value: T | T[]): T[] => {
        if (Array.isArray(value)) return value
        return [value]
    }

    public phone(): PhoneNumber {
        const { country_code, phone_number } = this.req.body
        return { number: phone_number, countryCode: country_code ?? '98' }
    }

}