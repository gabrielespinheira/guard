import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

import { ITokenPayload } from './interfaces'
import Auth from './auth'

dotenv.config()

export const generate = (email: string): string => {
  try {
    const auth = new Auth()
    return auth.generate(email)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const verify = (token: string): ITokenPayload => {
  try {
    const auth = new Auth()
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
