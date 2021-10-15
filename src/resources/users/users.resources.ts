import User from '../../models/users/users.models'
import Resource, {ResourceType} from '../resources'

/**
 * Generate new resource from user model
 */
export default class UserResource extends Resource<User> {
  /**
   * @return {ResourceType}
   */
  toArray(): ResourceType {
    const phone = this.model.phoneNumber
    return {
      name: {
        username: this.model.username,
        full_name: `${this.model.firstName} ${this.model.lastName}`,
        first_name: this.model.firstName,
        last_name: this.model.lastName,
      },
      birthday: this.model.birthday,
      gender: this.model.gender,
      phone_number: `+${phone.countryCode}${phone.number}`,
    }
  }
}
