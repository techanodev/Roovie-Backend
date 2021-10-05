import {
    AutoIncrement,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript'
import { PhoneNumber } from './users.models'

export type ValidationCodeTypes = 'create_account' | 'login' | 'forgot_password' | 'other'

@Table({
    tableName: 'validation_codes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export default class ValidationCode extends Model<ValidationCode> {
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @Unique
    @Column
    code!: string

    @Default('98')
    @Column({ field: 'country_code' })
    countryCode?: string

    @Column({ field: 'phone_number' })
    phone!: string

    @Column({ field: 'validation_type', type: DataType.STRING })
    type!: ValidationCodeTypes

    @Column({ field: 'updated_at' })
    updatedAt?: Date

    public set phoneNumber(phoneNumber: PhoneNumber) {
        this.phone = phoneNumber.number
        this.countryCode = phoneNumber.countryCode ?? '98'
    }

    public setRandomNumber(len = 5) {
        const number = this.random(Math.pow(10, len), Math.pow(10, len + 1))
        // **number | 0**: We use | for convert float numbers to integer numbers
        this.code = (number | 0).toString()
    }

    private random(min: number, max: number) {
        return Math.random() * (max - min) + min
    }
}
