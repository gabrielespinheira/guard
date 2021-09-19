import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { ITokenPayload } from './interfaces'

dotenv.config()

export default class Auth {
  signature: string
  algorithm: any
  expires: string

  constructor() {
    this.signature = process.env.GUARD_SIGNATURE ?? 'secret'
    this.algorithm = process.env.GUARD_ALGORITHM ?? 'HS256'
    this.expires = process.env.GUARD_EXPIRESIN ?? '15d'
  }

  generate(email: string): string {
    try {
      const token = jwt.sign({ email }, this.signature, {
        algorithm: this.algorithm,
        expiresIn: this.expires,
      })

      return token
    } catch (err) {
      throw new Error(err.message)
    }
  }

  verify(token: string): ITokenPayload {
    try {
      const isValidToken = jwt.verify(token, this.signature) as ITokenPayload

      return isValidToken
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
