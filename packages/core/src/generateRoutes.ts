import { Middleware } from 'koa'
import container from './container'

const handle: Middleware = async (ctx, next) => {
  await next()
}
