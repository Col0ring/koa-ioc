import { Injectable } from '@koa-ioc/core'

@Injectable()
export class HelloService {
  hello() {
    return 'hello world'
  }
}
