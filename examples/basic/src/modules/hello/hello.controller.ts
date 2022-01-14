import { Context, Request } from 'koa'
import {
  Controller,
  Ctx,
  Exception,
  Provide,
  Get,
  Middleware,
  Body,
  Post,
  Req,
  Param,
  Inject,
  Import,
} from '@koa-ioc/core'
import { HttpException } from '@koa-ioc/exception'
import { ValidatorIntegerPipe } from '@koa-ioc/pipe'
import { HelloService } from './hello.service'

@Controller('/hello')
// @Pipe(ValidateClassPipe)
@Exception((err, ctx) => {
  if (err instanceof HttpException) {
    ctx.body = err.toJSON()
  }
})
@Middleware([
  {
    middleware: async function (ctx, next) {
      await next()
    },
    position: 'pre',
  },
])
@Provide([
  {
    provide: '111',
    useValue: 4556,
  },
])
@Import([HelloService])
export class HelloController {
  @Inject('111')
  aa!: string
  constructor(
    private readonly helloService: HelloService,
    @Inject('111') a: string
  ) {}
  @Get('/:a')
  @Middleware([
    {
      middleware: async function (ctx, next) {
        await next()
      },
      position: 'pre',
    },
  ])
  hello(@Ctx() ctx: Context, @Param('a', ValidatorIntegerPipe) a: string) {
    return this.helloService.hello() + a
  }
  @Post('/')
  helloPost(@Ctx() ctx: Context, @Req() req: Request, @Body() body: any) {
    return {
      code: 200,
      body,
    }
  }
}
