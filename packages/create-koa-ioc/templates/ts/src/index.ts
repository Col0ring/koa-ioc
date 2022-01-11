import Koa from 'koa'
import { createApp } from '@koa-ioc/core'

const [app, mixins] = createApp(new Koa())

mixins
  .useBodyParser({
    multipart: false,
  })
  .useCors()
  .useLogger()
  .usePrefix('/api')
  .useSession()
  .useControllers([])
  .bootstrap()

app.listen(3000, () => {
  console.log('listening on http://localhost:3000')
})
