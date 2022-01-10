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
import { ValidatorIntegerPipe } from '@koa-ioc/pipe'
import { HelloService } from './hello.service'

@Controller('/example')
// @Pipe(ValidateClassPipe)
@Exception(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error)
    ctx.body = 'error'
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
  @Exception(async (ctx, next) => {
    try {
      await next()
    } catch (error: any) {
      console.log(error)
      ctx.body = error.toJSON()
    }
  })
  hello(
    @Ctx() ctx: Context,
    @Param(
      'a',
      new ValidatorIntegerPipe({
        async onError(error, next) {
          await error
          error.message = 12
          next(error)
        },
      })
    )
    a: number
  ) {
    return this.helloService.hello()
  }
  @Post('/')
  helloPost(@Ctx() ctx: Context, @Req() req: Request, @Body() body: any) {
    return {
      code: 200,
      body,
    }
  }
}
