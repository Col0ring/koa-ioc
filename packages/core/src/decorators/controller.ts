import { Middleware } from 'koa'
import KoaRouter from '@koa/router'
import {
  Creator,
  TargetFunction,
  isClass,
  isFunction,
  isNumber,
  isString,
} from '@koa-ioc/misc'
import { Decorator, Metadata, Method, MiddlewarePosition } from '../constants'
import {
  CtxMetadata,
  ExceptionMetadata,
  InjectMetadata,
  MethodMetadata,
  MiddlewareMetadata,
  NextMetadata,
  PipeMetadata,
  PipeTransformer,
  ParamMetadata,
} from '../type'

const pipeClassCacheMap = new Map<Creator<PipeTransformer>, PipeTransformer>()

function getMiddlewares(middlewareMetadata: MiddlewareMetadata) {
  return middlewareMetadata.reduce(
    (middlewares, { middleware, position }) => {
      if (position === MiddlewarePosition.Post) {
        middlewares.postMiddlewares.push(middleware)
      } else {
        middlewares.preMiddlewares.push(middleware)
      }
      return middlewares
    },
    {
      preMiddlewares: [],
      postMiddlewares: [],
    } as {
      preMiddlewares: Middleware[]
      postMiddlewares: Middleware[]
    }
  )
}

function createInstance<T>(creator: Creator<T>): T {
  // get Services
  const params: any[] = Reflect.getMetadata(Metadata.Params, creator) || []
  const injects: InjectMetadata =
    Reflect.getMetadata(Decorator.Inject, creator) || []
  const args = params.map((param, index) => {
    const isInjectable = Reflect.getMetadata(Decorator.Injectable, param)
    const inject = injects[index]
    if (isFunction(inject)) {
      return createInstance(inject)
    }
    if (isInjectable) {
      return createInstance(param)
    }
    return inject
  })
  return new creator(...args)
}

export function Controller(prefix = ''): TargetFunction {
  return function (target) {
    const router = new KoaRouter({
      prefix,
    })

    const controller = createInstance(target)
    const controllerMiddlewareMetadata: MiddlewareMetadata =
      Reflect.getMetadata(Decorator.Middleware, target) || []
    const controllerExceptionMetadata: ExceptionMetadata =
      Reflect.getMetadata(Decorator.Exception, target) || ((_, next) => next())

    const {
      preMiddlewares: preControllerMiddlewares,
      postMiddlewares: postControllerMiddlewares,
    } = getMiddlewares(controllerMiddlewareMetadata)

    const controllerPipeMetadata: PipeMetadata =
      Reflect.getMetadata(Decorator.Pipe, target) || []
    const keys = Object.getOwnPropertyNames(target.prototype)
    for (const key of keys) {
      if (!isFunction(controller[key])) {
        continue
      }
      const methodMetadata: MethodMetadata = Reflect.getMetadata(
        Decorator.Method,
        controller,
        key
      )
      if (!methodMetadata) {
        continue
      }
      const middlewareMetadata: MiddlewareMetadata =
        Reflect.getMetadata(Decorator.Middleware, controller, key) || []
      const exceptionMetadata: ExceptionMetadata =
        Reflect.getMetadata(Decorator.Exception, controller, key) ||
        ((_, next) => next())
      const ctxMetadata: CtxMetadata =
        Reflect.getMetadata(Decorator.Ctx, controller, key) || []
      const nextMetadata: NextMetadata =
        Reflect.getMetadata(Decorator.Next, controller, key) || []

      const pipeMetadata: PipeMetadata =
        Reflect.getMetadata(Decorator.Pipe, controller, key) || []
      const paramMetadata: ParamMetadata =
        Reflect.getMetadata(Decorator.Param, controller, key) || []

      const params: any[] = Reflect.getMetadata(
        Metadata.Params,
        controller,
        key
      )

      const hasNextHandler = nextMetadata.length !== 0
      const { preMiddlewares, postMiddlewares } =
        getMiddlewares(middlewareMetadata)
      const { method, handler, path } = methodMetadata

      router[method.toLowerCase() as Method](
        path,
        controllerExceptionMetadata,
        exceptionMetadata,
        ...preControllerMiddlewares,
        ...preMiddlewares,
        async (ctx, next) => {
          const handlerArgs: any[] = []
          paramMetadata.forEach(({ name, index, paramPath }) => {
            const paths = paramPath.split('.')
            const value = paths.reduce<any>(
              (prev, nextPath) => prev[nextPath],
              ctx
            )

            handlerArgs[index] = isString(name) ? value?.[name] : value
          })

          ctxMetadata.forEach((index) => (handlerArgs[index] = ctx))
          nextMetadata.forEach((index) => (handlerArgs[index] = next))

          // pipe
          for (const { pipe, index } of controllerPipeMetadata) {
            let transformer: PipeTransformer
            if (isClass(pipe)) {
              if (pipeClassCacheMap.has(pipe)) {
                transformer = pipeClassCacheMap.get(pipe)!
              } else {
                transformer = new pipe()
                pipeClassCacheMap.set(pipe, transformer)
              }
            } else {
              transformer = pipe
            }
            if (isNumber(index)) {
              handlerArgs[index] = await transformer.transform(
                handlerArgs[index],
                {
                  metatype: params[index],
                }
              )
            } else {
              for (let i = 0; i < params.length; i++) {
                handlerArgs[i] = await transformer.transform(handlerArgs[i], {
                  metatype: params[i],
                })
              }
            }
          }

          for (const { pipe, index } of pipeMetadata) {
            let transformer: PipeTransformer
            if (isClass(pipe)) {
              if (pipeClassCacheMap.has(pipe)) {
                transformer = pipeClassCacheMap.get(pipe)!
              } else {
                transformer = new pipe()
                pipeClassCacheMap.set(pipe, transformer)
              }
            } else {
              transformer = pipe
            }
            if (isNumber(index)) {
              handlerArgs[index] = await transformer.transform(
                handlerArgs[index],
                {
                  metatype: params[index],
                }
              )
            } else {
              for (let i = 0; i < params.length; i++) {
                handlerArgs[i] = await transformer.transform(handlerArgs[i], {
                  metatype: params[i],
                })
              }
            }
          }

          const body = await handler.call(controller, ...handlerArgs)
          ctx.body ??= body
          if (!hasNextHandler) {
            await next()
          }
        },
        ...postMiddlewares,
        ...postControllerMiddlewares
      )
    }
    Reflect.defineMetadata(Decorator.Controller, router, target)
  }
}
