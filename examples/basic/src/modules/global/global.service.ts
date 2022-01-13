import { Injectable } from '@koa-ioc/core'

@Injectable()
export class GlobalService {
  getGlobalData() {
    return 'global data'
  }
}
