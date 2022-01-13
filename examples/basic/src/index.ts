/* eslint-disable @typescript-eslint/no-extra-semi */
import './alias'
import Koa from 'koa'
import { createApp } from '@koa-ioc/core'
import { HelloController } from './modules/hello/hello.controller'
import { AuthController } from './modules/auth/auth.controller'
import { CommonController } from './modules/common/common.controller'
import { PostController } from './modules/post/post.controller'
import { GlobalService } from './modules/global/global.service'

const [app, mixins] = createApp(new Koa())

mixins
  .useBodyParser({
    multipart: false,
  })
  .useLogger()
  .usePrefix('/api')
  .useControllers([
    HelloController,
    AuthController,
    CommonController,
    PostController,
  ])
  .addProvider([GlobalService])
  .bootstrap()
app.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
