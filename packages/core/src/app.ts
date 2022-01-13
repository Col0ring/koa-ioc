import { ensureArray, Creator } from '@koa-ioc/misc'
import Koa from 'koa'
import path from 'path'
import KoaRouter from '@koa/router'
import koaBody from 'koa-body'
import koaCors from '@koa/cors'
import koaLogger from 'koa-logger'
import koaSession from 'koa-session'
import koaStatic from 'koa-static'
import globalContainer from './container'
import { generateRouter } from './generateRouter'
import { Mixins } from './type'
import { ensureProvider, log } from './utils'

export function createApp(koaApp?: Koa): [Koa, Mixins] {
  const app = koaApp || new Koa()
  let globalPrefix = ''
  let isBootstrapped = false
  let controllersCache: Creator[] = []
  const routers: KoaRouter[] = []

  return [
    app,
    {
      bootstrap() {
        controllersCache.forEach((controller) => {
          const router = generateRouter(controller)
          if (!router) {
            return
          }
          routers.push(router)
        })
        routers.forEach((router) => {
          router.prefix(globalPrefix)
          app.use(router.routes()).use(router.allowedMethods())
        })
        isBootstrapped = true
        return this
      },
      getGlobalPrefix() {
        return globalPrefix
      },
      getControllerRouters() {
        return routers
      },
      useControllers(controllers) {
        controllersCache = controllers
        return this
      },
      useLogger(...args) {
        app.use(koaLogger(...args))
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
      useSession(options) {
        if (options) {
          app.use(koaSession(options, app))
        } else {
          app.use(koaSession(app))
        }
        return this
      },
      usePrefix(prefix) {
        if (isBootstrapped) {
          log.warn(
            'Warning: the app has been bootstrapped，[usePrefix] will not be applied'
          )
          return this
        }
        globalPrefix = path.join(prefix, globalPrefix)
        return this
      },
      addProvider(createOrProviders) {
        ensureArray(createOrProviders).forEach((createOrProvider) => {
          globalContainer.provide(ensureProvider(createOrProvider))
        })
        return this
      },
    },
  ]
}
