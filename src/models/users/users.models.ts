import {
    AllowNull,
    AutoIncrement,
    Column,
    Model,
    NotEmpty,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript'
import { Includeable, SaveOptions } from 'sequelize'
import HttpError from '../../errors/http.errors'

export type UserIncludeOptions = { Role: boolean; Plan: boolean }

export enum Gender {
    Male = 1,
    Female = 0,
}

/**
 * Every where we need pass a phone number, we should use {@link PhoneNumber}.
 * because in this case we have country code and number in one value
 */
export type PhoneNumber = { countryCode?: string; number: string }

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
export default class User extends Model<User> {

    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @Unique
    @Column
    username!: string

    @AllowNull(false)
    @NotEmpty
    @Column({ field: 'first_name' })
    firstName?: string

    @AllowNull(true)
    @Column({ field: 'last_name' })
    lastName?: string

    @AllowNull(true)
    @Column({ field: 'country_code' })
    countryCode!: string

    @AllowNull(false)
    @NotEmpty
    @Column({ field: 'phone_number' })
    _phoneNumber!: string

    @AllowNull(false)
    @NotEmpty
    @Column({ field: 'gender' })
    private _gender?: number

    @AllowNull(true)
    @Column
    birthday?: Date

    set gender(gender: Gender | undefined) {
        this._gender = gender
    }

    get gender(): Gender | undefined {
        return this._gender ? (this._gender ? Gender.Male : Gender.Female) : undefined
    }

    set phoneNumber(phoneNumber: PhoneNumber) {
        if (!phoneNumber.countryCode) phoneNumber.countryCode = '98'
        this.countryCode = phoneNumber.countryCode
        this._phoneNumber = phoneNumber.number
    }

    get phoneNumber() {
        return { number: this._phoneNumber, countryCode: this.countryCode }
    }

    /**
     * Save a user in database
     * @param options save options {@link SaveOptions}
     * @returns instance of the user created
     */
    public async saveUser(options?: SaveOptions<User>): Promise<User> {
        const user = await User.findOne({
            where: {
                _phoneNumber: this.phoneNumber.number,
                countryCode: this.phoneNumber.countryCode ?? '98',
            },
        })
        // before create a user, we check a user with the phone number in pass create account or not
        if (user)
            throw new HttpError('شماره تلفن وارد شده قبلا توسط کاربر دیگری استفاده شده است.', 401)
        return this.save(options)
    }
}
