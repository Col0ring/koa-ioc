import Koa from 'koa'
import { createApp } from '@koa-ioc/core'
import { PostController } from './modules/post/post.controller'
import { GlobalService } from './modules/global/global.service'

const [app, mixins] = createApp(new Koa())

mixins
  .useBodyParser({
    multipart: false,
  })
  .useCors()
  .useLogger()
  .usePrefix('/api')
  .useControllers([PostController])
  .addProvider([GlobalService])
  .bootstrap()

app.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
