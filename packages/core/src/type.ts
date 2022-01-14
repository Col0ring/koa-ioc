import { Context, BaseResponse, Middleware } from 'koa'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import KoaLogger from 'koa-logger'
import koaSession from 'koa-session'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import { Creator, PromisifyValue } from '@koa-ioc/misc'
import { Method } from './constants'

export type Methods = Method | Capitalize<Method>
export interface ResponseOptions {
  /**
   * Return response header.
   */
  headers?: BaseResponse['headers']
  /**
   * Get/Set response status code.
   */
  status?: BaseResponse['status']
  /**
   * Get response status message
   */
  message?: BaseResponse['message']
}
export interface MethodConfig {
  path: string
  method: Methods
  responseOptions?: ResponseOptions
  name: string
}
export type MethodMetadata = MethodConfig[]

export type ExceptionHandler = (
  error: unknown,
  ctx: Context
) => PromisifyValue<any>
export interface ControllerMetadata {
  controller: boolean
  prefix?: string
}
export type ProvideMetadata = Provider[]
export type CreatorOrProvider<T = any> = Creator<T> | Provider<T>

export type ImportMetadata = Creator[]

export interface PropertiesInjectConfig {
  key: string | symbol
  type: any
}
export type PropertiesInjectMetadata = PropertiesInjectConfig[]

export type ParamsInjectMetadata = any[]

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
export type ExceptionMetadata = ExceptionHandler
export type CtxMetadata = number[]
export type NextMetadata = number[]
export type PipeOptions = PipeTransformer | Creator<PipeTransformer>
export interface PipeConfig {
  pipe: PipeTransformer
  index?: number
}
export type PipeMetadata = PipeConfig[]

export type ParamHandle<T = unknown> = (data: T, ctx: Context) => PromisifyValue

export interface ParamConfig {
  handle: ParamHandle<any>
  index: number
  data: any
}

export interface ParamPathConfig {
  paramPath: string
  index: number
  name?: string
}

export type ParamMetadata = ParamConfig[]

interface BaseProvider {
  provide: any
}

export interface ClassProvider<T> extends BaseProvider {
  useClass: Creator<T>
}

export interface ValueProvider<T> extends BaseProvider {
  useValue: T
}

export interface FactoryProvider<T> extends BaseProvider {
  useFactory: () => T
}

export type Provider<T = any> =
  | ClassProvider<T>
  | ValueProvider<T>
  | FactoryProvider<T>

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
  addProvider(createOrProviders: CreatorOrProvider | CreatorOrProvider[]): this
}
