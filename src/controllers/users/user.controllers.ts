import {Response, Request} from 'express';
import UserCrud from '../../crud/users/users.crud';
import HttpError from '../../errors/http.errors';
import RequestService from '../../services/request.services';
import ResponseService from '../../services/response.services';
import Controller from '../controllers';

/**
 * Controller for users
 */
export default class UserController extends Controller {
  /**
   * Upload new photo for user
   * @param {Request} req
   * @param {Response} res
   */
  static uploadPhoto = async (req: Request, res: Response) => {
    try {
      const user = await(new RequestService(req)).user()
      if (!user?.id) {
        throw HttpError.message.auth.user()
      }
      if (!req.file) {
        throw new HttpError('لطفا تصویری برای آپلود وارد نمایید.', 401)
      }
      const userCrud = new UserCrud(user)
      await userCrud.uploadUserPhoto(req.file)
      ResponseService.makeNew(res).model.success
          .update('تصویر کاربر').response()
    } catch (e) {
      ResponseService.handleError(res, e)
    }
  }
}
