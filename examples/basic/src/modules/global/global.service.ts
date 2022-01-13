import { Inject, Provide } from '@koa-ioc/core'

@Provide({
  useValue: '1',
  provide: '1',
})
export class GlobalService {
  @Inject('1')
  a!: string
  getGlobalData() {
    return 'global data' + this.a
  }
}
