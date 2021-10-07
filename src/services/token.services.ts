import jwt = require('jsonwebtoken')
import HttpError from '../errors/http.errors'
import '../config/lang'
import i18n = require('i18n')
import User from '../models/users/users.models'

export default class TokenService {
    /**
     * Generate a jwt token for user
     * @param userId id of the user you want to create a token
     * @returns a jwt refresh token
     */
    public static createToken(userId: number) {
        const secret = this.getSecretKey()

        const expiresIn = process.env.JWT_EXPIRES ?? '180d'

        return jwt.sign({ id: userId }, secret, { expiresIn: expiresIn })
    }

    /**
     * Check user's token
     * @param token the token to check
     */
    public static checkToken(token: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            const secret = this.getSecretKey()

            jwt.verify(token, secret, async (err, decoded) => {
                try {
                    if (err)
                        return reject(err)

                    const id = JSON.parse(JSON.stringify(decoded)).id as number
                    const user = await User.findByPk(id)
                    if (!user)
                        return reject(new HttpError(i18n.__('REGISTER_TOKEN_INVALID'), 403))

                    resolve(user)
                } catch (error) {
                    reject(new HttpError(i18n.__('REGISTER_TOKEN_INVALID'), 403))
                }
            })
        })
    }

    /**
     * Check the tokens starts with bearer
     * @param token the token to check
     * @returns 
     */
    public static checkBearerToken(token: string): Promise<User> {
        const regex = /Bearer [A-Za-z0-9\-._~+/]+=*/g
        if (!token || !regex.test(token))
            throw new HttpError(i18n.__('REGISTER_TOKEN_ENTER'), 403)

        return this.checkToken(token.split(' ')[1])
    }

    private static getSecretKey(): string {
        const secret = process.env.JWT_SECRET
        if (!secret)
            throw new HttpError(i18n.__('REGISTER_JWT_SECRET_ERROR'), 500)
        return secret
    }
}