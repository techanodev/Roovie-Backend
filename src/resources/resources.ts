import { Model } from 'sequelize-typescript'
import * as fs from 'fs'
import FileService from '../services/file.services'

export type ResourceType = { [name: string]: number | string | ResourceType[] | ResourceType | Date | undefined | null | boolean }

export default class Resource<T extends Model> {
    protected model: T
    protected moreFields: string[]

    public constructor(model: T, fileFields?: string[] | ResourceType, moreFields?: string[]) {
        this.model = model
        this.moreFields = moreFields ? moreFields : []
        if (!fileFields) return
        this.setPathField(fileFields)
    }

    public toArray(isCollection?: boolean): ResourceType {
        let models = this.model.toJSON() as ResourceType
        if (isCollection) {
            let dataList = Object.entries(models)
            dataList = dataList.filter(x => !Array.isArray(x[1]))
            models = {}
            for (const data of dataList)
                models[data[0]] = data[1]
        }
        return this.model.toJSON() as ResourceType
    }

    protected set fileFields(data: string[]) {
        this.setPathField(data)
    }

    /*
    Convert path to url
    */
    public static convertPath(path: string): string {
        if (path.length < 7) return path
        const publicPath = FileService.public.path.replace('./', '')
        if (path.startsWith(publicPath)) {
            path = path.replace(publicPath, '')
        } else if (path.startsWith(FileService.absoluteDirectory(''))) {
            path = path.replace(FileService.absoluteDirectory(''), '') + '/'
        }
        path = path.split('\\').join('/')
        return (process.env.APP_URL || 'http://localhost:8000') + path.replace(publicPath, '')
    }

    public setPathField(fields: string[] | ResourceType): this {
        if (Array.isArray(fields)) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i]
                if (!(this.model instanceof Model) || !(this.model.get(field))) continue
                this.model.set(field, Resource.convertPath(this.model.get(field) as string))
            }
            return this
        }
        for (const field in fields) {
            const defaultVal = fields[field]
            // Set value of this key as a default value
            let result = defaultVal
            if (!(this.model instanceof Model)) continue
            const modelValue = this.model.get(field)
            if (fs.existsSync(modelValue as string)) {
                // if the value of file as default value, if it was exists
                result = Resource.convertPath(this.model.get(field) as string)
            }
            this.model.set(field, result)
        }
        return this
    }

    public static collection<T extends Model>(
        models: (T | undefined)[] | T[] | null | undefined,
        options?: { fileFields: string[], moreFields: string[] }
    ): ResourceType[] {

        const items: ResourceType[] = []
        if (!models)
            return items


        models.forEach((model: Model | undefined) => {
            if (!model) return
            let fileFields: string[] = []
            if (options?.fileFields)
                fileFields = options.fileFields

            items.push(new this(model, undefined, options?.moreFields).setPathField(fileFields).toArray(true))
        })

        return items
    }
}