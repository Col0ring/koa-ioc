import jwt from 'jsonwebtoken'
import { CustomParam } from '@koa-ioc/core'
import { UnAuthorizedException } from '@koa-ioc/exception'
import { Payload } from './constants'
import { JwtPayload, JwtMiddlewareOptions, jwtMiddlewareContext } from './type'

export function isJwtException(
  error: any
): error is jwt.JsonWebTokenError | jwt.TokenExpiredError | jwt.NotBeforeError {
  return (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError ||
    error instanceof jwt.NotBeforeError
  )
}

export function createJwtMiddleware({
  getToken,
  secretOrPrivateKey,
  verifyOptions,
  payloadProps = Payload.JwtPayload,
}: JwtMiddlewareOptions): jwtMiddlewareContext {
  return {
    sign(payload: JwtPayload, options?: jwt.SignOptions) {
      return jwt.sign(payload, secretOrPrivateKey, options)
    },
    async middleware(ctx, next) {
      try {
        const token = await getToken(ctx)
        const payload = jwt.verify(token, secretOrPrivateKey, verifyOptions)
        ctx[payloadProps] = payload
        await next()
      } catch (error) {
        if (isJwtException(error)) {
          throw new UnAuthorizedException({
            message: error.message,
          })
        }
        throw error
      }
    },
    JwtPayload() {
      return CustomParam(payloadProps)
    },
  }
}
