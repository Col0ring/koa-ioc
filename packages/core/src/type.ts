import { Middleware } from 'koa'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import KoaLogger from 'koa-logger'
import koaSession from 'koa-session'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import { Creator } from '@koa-ioc/misc'
import { Method } from './constants'

export type Methods = Method | Capitalize<Method>

export interface MethodConfig {
  path: string
  method: Methods
  name: string
}
export type MethodMetadata = MethodConfig[]
export interface ControllerMetadata {
  controller: boolean
  prefix?: string
}
export type ProvideMetadata = Provider[]

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
export type ExceptionMetadata = Middleware
export type CtxMetadata = number[]
export type NextMetadata = number[]
export type PipeOptions = PipeTransformer | Creator<PipeTransformer>
export interface PipeConfig {
  pipe: PipeTransformer
  index?: number
}
export type PipeMetadata = PipeConfig[]

export interface ParamConfig {
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
  addProvider(providers: Provider | Provider[]): this
}
