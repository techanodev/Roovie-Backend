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
import {SaveOptions} from 'sequelize'
import HttpError from '../../errors/http.errors'

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
/**
 * Structure of user in database
 */
export default class User extends Model<User> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id?: number

  // eslint-disable-next-line new-cap
  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column
  username!: string

  @AllowNull(false)
  @NotEmpty
  @Column({field: 'first_name'})
  firstName?: string

  @AllowNull(true)
  @Column({field: 'last_name'})
  lastName?: string

  @AllowNull(true)
  @Column({field: 'country_code'})
  countryCode!: string

  @AllowNull(false)
  @NotEmpty
  @Column({field: 'phone_number'})
  _phoneNumber!: string

  @AllowNull(true)
  @Column({field: 'gender'})
  private _gender?: number

  @AllowNull(true)
  @Column
  birthday?: Date

  /**
   * Set gender for user model
   * @param {Gender} gender
   */
  set gender(gender: Gender | undefined) {
    this._gender = gender
  }

  /**
   * Set value for gender
   * @return {Gender  | undefined}
   */
  get gender(): Gender | undefined {
    return this._gender ?
      (this._gender ? Gender.Male : Gender.Female) :
      undefined
  }

  /**
   * Set phone number for user
   * @param {PhoneNumber} phoneNumber
   */
  set phoneNumber(phoneNumber: PhoneNumber) {
    if (!phoneNumber.countryCode) phoneNumber.countryCode = '98'
    this.countryCode = phoneNumber.countryCode
    this._phoneNumber = phoneNumber.number
  }

  /**
   * @return {PhoneNumber}
   */
  get phoneNumber(): PhoneNumber {
    return {number: this._phoneNumber, countryCode: this.countryCode}
  }

  /**
   * Save a user in database
   * @param {SaveOptions<User>} options save options {@link SaveOptions}
   * @return {Promise<User>} instance of the user created
   */
  public async saveUser(options?: SaveOptions<User>): Promise<User> {
    const user = await User.findOne({
      where: {
        _phoneNumber: this.phoneNumber.number,
        countryCode: this.phoneNumber.countryCode ?? '98',
      },
    })
    // before create a user,
    // we check a user with the phone number in pass create account or not
    if (user) {
      throw HttpError.__(401, 'REGISTER_REQUEST_DUPLICATE_PHONE_NUMBER', {})
    }
    return this.save(options)
  }
}
