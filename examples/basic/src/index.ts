import './alias'
import Koa from 'koa'
import { createApp } from '@koa-ioc/core'
import { HelloController } from './modules/hello/hello.controller'
import { AuthController } from './modules/auth/auth.controller'
const app = createApp(new Koa())

app
  .useBodyParser({
    multipart: true,
  })
  .useLogger()
  .usePrefix('/api')
  .useControllers([HelloController, AuthController])
  .bootstrap()
  .listen(3000, () => {
    console.log('listening on http://localhost:3000')
  })
