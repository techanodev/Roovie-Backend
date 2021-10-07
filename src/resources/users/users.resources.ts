import User from "../../models/users/users.models";
import Resource from "../resources";

export default class UserResource extends Resource<User> {
    toArray() {
        const phone = this.model.phoneNumber
        return {
            name: {
                username: this.model.username,
                full_name: `${this.model.firstName} ${this.model.lastName}`,
                first_name: this.model.firstName,
                last_name: this.model.lastName
            },
            birthday: this.model.birthday,
            gender: this.model.gender,
            phone_number: `+${phone.countryCode}${phone.number}`,
        }
    }
}