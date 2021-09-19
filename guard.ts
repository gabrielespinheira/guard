import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

interface ITokenPayload {
  email: string
  iat: number
  exp: number
}

class Auth {
  signature: string
  algorithm: any
  expires: string

  constructor() {
    this.signature = process.env.TOKEN_SIGNATURE ?? 'secret'
    this.algorithm = process.env.ALGORITHM ?? 'HS256'
    this.expires = process.env.EXPIRES ?? '1d'
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

export const generate = (email: string): string => {
  const auth = new Auth()

  try {
    return auth.generate(email)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const verify = (token: string): ITokenPayload => {
  const auth = new Auth()

  try {
    return auth.verify(token)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const guard = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization.trim()
    const token = authorization.replace('Bearer ', '')

    const isValidToken = verify(token)

    if (!isValidToken) {
      throw new Error('Token not valid')
    }

    req.token = isValidToken
    req.user_email = isValidToken.email

    next()
  } catch (err) {
    console.warn('Not authorized:', err.message)
    return res.status(401).json({ status: 'error', message: 'Not authorized' })
  }
}

export default guard
