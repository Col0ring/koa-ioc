import { Middleware } from 'koa'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import KoaLogger from 'koa-logger'
import koaSession from 'koa-session'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import { Creator } from '@koa-ioc/misc'
import { Method } from './constants'
KoaLogger

export type Methods = Method | Capitalize<Method>

export interface MethodConfig {
  path: string
  method: Methods
  name: string
}
export type MethodMetadata = MethodConfig[]
export interface InjectMetadata {
  [index: number]: any
}

export interface ArgumentMetadata {
  readonly metatype: any
}

export interface PipeTransformer {
  transform(value: any, metadata: ArgumentMetadata): any
}

export interface MiddlewareConfig {
  position?: 'pre' | 'post'
  middleware: Middleware
}
export interface Middlewares {
  preMiddlewares: Middleware[]
  postMiddlewares: Middleware[]
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
  getControllerRouters(): KoaRouter[]
  getGlobalPrefix(): string
  useControllers(controllers: Creator[]): this
  useLogger(...args: Parameters<typeof KoaLogger>): this
  useCors(options?: koaCors.Options): this
  useStatic(root: string, options?: koaStatic.Options): this
  useBodyParser(options?: koaBody.IKoaBodyOptions): this
  usePrefix(prefix: string): this
  useSession(options?: Partial<koaSession.opts>): this
}
