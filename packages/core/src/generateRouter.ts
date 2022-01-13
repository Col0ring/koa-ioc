import { Creator, isNumber } from '@koa-ioc/misc'
import { Middleware } from 'koa'
import path from 'path'
import KoaRouter from '@koa/router'
import { createInstance } from './createInstance'
import { isController, log } from './utils'
import { Decorator, Metadata, Method, MiddlewarePosition } from './constants'
import {
  ControllerMetadata,
  CtxMetadata,
  ExceptionMetadata,
  MethodMetadata,
  MiddlewareMetadata,
  Middlewares,
  NextMetadata,
  ParamMetadata,
  PipeMetadata,
  PipeTransformer,
} from './type'

export function generateRouter(controller: Creator): KoaRouter | null {
  if (!isController(controller)) {
    log.warn(`Warning: the Class ${controller.name} is not a controller`)
    return null
  }

  const { prefix }: ControllerMetadata = Reflect.getMetadata(
    Decorator.Controller,
    controller
  )

  const router = new KoaRouter({
    prefix: prefix ? path.join('/', prefix) : prefix,
  })

  const instance = createInstance(controller)

  const controllerMiddlewareMetadata: MiddlewareMetadata =
    Reflect.getMetadata(Decorator.Middleware, controller) || []
  const controllerExceptionMetadata: ExceptionMetadata =
    Reflect.getMetadata(Decorator.Exception, controller) ||
    ((_, next) => next())

  const {
    preMiddlewares: preControllerMiddlewares,
    postMiddlewares: postControllerMiddlewares,
  } = getMiddlewares(controllerMiddlewareMetadata)

  const methodMetadata: MethodMetadata =
    Reflect.getMetadata(Decorator.Method, controller) || []
  const controllerPipeMetadata: PipeMetadata =
    Reflect.getMetadata(Decorator.Pipe, controller) || []

  methodMetadata.forEach(({ method, path: pathname, name: key }) => {
    const middlewareMetadata: MiddlewareMetadata =
      Reflect.getMetadata(Decorator.MethodMiddleware, controller, key) || []
    const exceptionMetadata: ExceptionMetadata =
      Reflect.getMetadata(Decorator.MethodException, controller, key) ||
      ((_, next) => next())
    const ctxMetadata: CtxMetadata =
      Reflect.getMetadata(Decorator.Ctx, controller, key) || []
    const nextMetadata: NextMetadata =
      Reflect.getMetadata(Decorator.Next, controller, key) || []

    const pipeMetadata: PipeMetadata =
      Reflect.getMetadata(Decorator.MethodPipe, controller, key) || []

    const paramMetadata: ParamMetadata =
      Reflect.getMetadata(Decorator.Param, controller, key) || []

    const params: any[] = Reflect.getMetadata(Metadata.Params, instance, key)

    const hasNextHandler = nextMetadata.length !== 0
    const { preMiddlewares, postMiddlewares } =
      getMiddlewares(middlewareMetadata)

    const handle: Middleware = async (ctx, next) => {
      const handlerArgs: any[] = []
      for (const { data, index, handle: paramHandler } of paramMetadata) {
        handlerArgs[index] = await paramHandler(data, ctx)
      }

      ctxMetadata.forEach((index) => (handlerArgs[index] = ctx))
      nextMetadata.forEach((index) => (handlerArgs[index] = next))
      // pipe
      async function pipeTransform(pipe: PipeTransformer, index?: number) {
        if (isNumber(index)) {
          handlerArgs[index] = await pipe.transform(handlerArgs[index], {
            metatype: params[index],
          })
        } else {
          for (let i = 0; i < params.length; i++) {
            handlerArgs[i] = await pipe.transform(handlerArgs[i], {
              metatype: params[i],
            })
          }
        }
      }
      for (const { pipe, index } of controllerPipeMetadata) {
        await pipeTransform(pipe, index)
      }

      for (const { pipe, index } of pipeMetadata) {
        await pipeTransform(pipe, index)
      }

      const body = await instance[key](...handlerArgs)
      ctx.body ??= body
      if (!hasNextHandler) {
        await next()
      }
    }

    router[method.toLowerCase() as Method](
      path.join('/', pathname),
      controllerExceptionMetadata,
      exceptionMetadata,
      ...preControllerMiddlewares,
      ...preMiddlewares,
      handle,
      ...postMiddlewares,
      ...postControllerMiddlewares
    )
  })

  return router
}

function getMiddlewares(middlewareMetadata: MiddlewareMetadata): Middlewares {
  return middlewareMetadata.reduce<Middlewares>(
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
    }
  )
}
