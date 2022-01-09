import { Inject, Provide, Injectable } from '@koa-ioc/core'

@Injectable()
// @Provide([
//   {
//     provide: '111',
//     useValue: 123,
//   },
// ])
export class HelloService {
  @Inject('111')
  aa!: string

  hello() {
    return 'hello world' + this.aa
  }
}
