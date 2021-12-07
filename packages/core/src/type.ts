import Koa, { Middleware } from 'koa'
import koaBody from 'koa-body'
import KoaLogger from 'koa-logger'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import { Creator } from '@koa-ioc/misc'
import { Method } from './constants'
KoaLogger

export type Methods = Method | Capitalize<Method>
export type HttpHandler = (...args: any[]) => Promise<unknown> | unknown
export interface MethodMetadata {
  path: string
  method: Methods
  handler: HttpHandler
}
export interface InjectMetadata {
  [index: number]: any
}

export interface ArgumentMetadata {
  readonly metatype?: any
  readonly data?: string
}

export interface PipeTransformer {
  transform(value: any, metadata: ArgumentMetadata): any
}

export interface MiddlewareConfig {
  position?: 'pre' | 'post'
  middleware: Middleware
}
export type MiddlewareOptions = MiddlewareConfig | Middleware
export type MiddlewareMetadata = MiddlewareConfig[]
export type ExceptionMetadata = Middleware
export type CtxMetadata = number[]
export type NextMetadata = number[]
export type PipeOptions = PipeTransformer | Creator<PipeTransformer>
export interface PipeConfig {
  pipe: PipeOptions
  index?: number
}
export type PipeMetadata = PipeConfig[]

export interface ParamConfig {
  paramPath: string
  index: number
  name?: string
}
export type ParamMetadata = ParamConfig[]

export interface Mixins {
  bootstrap(): this
  use(middleware: Middleware): this
  useControllers(controllers: Creator[]): this
  useLogger(...args: Parameters<typeof KoaLogger>): this
  useCors(options?: koaCors.Options): this
  useStatic(root: string, options?: koaStatic.Options): this
  useBodyParser(options?: koaBody.IKoaBodyOptions): this
  usePrefix(prefix: string): this
}

export interface Application extends Omit<Koa, 'use'>, Mixins {}
