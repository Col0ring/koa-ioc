import './alias'
import Koa from 'koa'
import { createApp } from '@koa-ioc/core'
import { HelloController } from './modules/hello/hello.controller'
const app = createApp(new Koa())

app
  .useBodyParser({
    multipart: true,
  })
  .usePrefix('/api')
  .useControllers([HelloController])
  .bootstrap()
  .listen(3000, () => {
    console.log('listening on http://loalhost:3000')
  })
