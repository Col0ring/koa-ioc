import Koa from 'koa'
import path from 'path'
import { assertType } from '@koa-ioc/misc'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import { Decorator } from './constants'
import { Application, Mixins } from './type'

export function createApp(app: Koa): Application {
  let globalPrefix = ''
  const routers: KoaRouter[] = []

  // change type
  assertType<Application>(app)

  return Object.assign(app, {
    bootstrap() {
      routers.forEach((router) => {
        router.prefix(globalPrefix)
        app.use(router.routes()).use(router.allowedMethods())
      })
      return this
    },
    useControllers(controllers) {
      controllers.forEach((controller) => {
        const router: KoaRouter = Reflect.getMetadata(
          Decorator.Controller,
          controller
        )
        if (!router) {
          return
        }
        routers.push(router)
      })
      return this
    },
    useCors(options) {
      app.use(koaCors(options))
      return this
    },
    useStatic(root, options) {
      app.use(koaStatic(root, options))
      return this
    },
    useBodyParser(options) {
      app.use(koaBody(options))
      return this
    },
    usePrefix(prefix) {
      globalPrefix = path.join(prefix, globalPrefix)
      return this
    },
  } as Mixins)
}
