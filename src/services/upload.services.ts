import {diskStorage, FileFilterCallback, StorageEngine} from 'multer'
import FileService from './file.services'
import {extname} from 'path'
import {Request} from 'express'

/**
 * Upload services
 */
export default class UploadService {
  /**
   * Create a storage path for
   * @param {string} destination Folder that you want to save file
   * @return {StorageEngine}
   */
  static getStorage(destination: string): StorageEngine {
    return diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, destination)
      },
      filename: (_req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname))
      },
    })
  }

  /**
   *
   * @param {string} message message to send if files are not valid
   * @param {string | RegExp | string[]} filter file extensions for filter
   * @param {Express.Request} _req
   * @param {Express.Multer.File} file
   * @param {FileFilterCallback} cb
   * @return {void}
   */
  static getFilterFile(
      message: string,
      filter: string | RegExp | string[],
      _req: Request,
      file: Express.Multer.File, cb: FileFilterCallback): void {
    if (Array.isArray(filter)) {
      filter = filter.join('|')
    }

    if (!file.originalname.match(filter)) {
      return cb(new Error(message))
    }
    cb(null, true)
  }

  /**
   * Default storage path for upload
   * @return {StorageEngine}
   */
  static get defaultStorage(): StorageEngine {
    const folder = FileService.public.absoluteDirectory('uploads/')
    return UploadService.getStorage(folder)
  }

  /**
   * User profile photo folder path for upload
   * @return {StorageEngine}
   */
  static get userProfilePhoto(): StorageEngine {
    const folder = FileService
        .public
        .absoluteDirectory('uploads/profiles/avatar')
    return UploadService.getStorage(folder)
  }

  /**
   *
   * @param {Express.Request} req
   * @param {Express.Multer.File} file
   * @param {FileFilterCallback} cb
   * @return {void}
   */
  static imageFilter(
      req: Request,
      file: Express.Multer.File, cb: FileFilterCallback): void {
    UploadService.getFilterFile(
        'فقط فایل های تصویری محاز میباشد.',
        /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/,
        req, file, cb,
    )
  }
}
