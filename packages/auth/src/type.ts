import { Context, Middleware } from 'koa'
import jwt from 'jsonwebtoken'
import { TargetParamFunction, PromisifyValue } from '@koa-ioc/misc'
export type JwtPayload = string | object | Buffer
export interface JwtMiddlewareOptions {
  /**
   * @default jwtPayload
   */
  payloadProps?: string
  getToken: (ctx: Context) => PromisifyValue<string>
  secretOrPrivateKey: jwt.Secret
  verifyOptions?: jwt.VerifyOptions
}
export interface jwtMiddlewareContext {
  sign(payload: JwtPayload, options?: jwt.SignOptions): string
  middleware: Middleware
  JwtPayload(): TargetParamFunction
}
