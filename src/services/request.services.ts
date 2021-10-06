import { Request } from 'express'
import { Model } from 'sequelize-typescript'
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

}