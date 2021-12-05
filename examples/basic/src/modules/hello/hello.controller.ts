import { Context, Request } from 'koa'
import {
  Controller,
  Ctx,
  Exception,
  Get,
  Pipe,
  Middleware,
  Body,
  UploadFiles,
  Post,
  Req,
  Param,
  CustomParam,
} from '@koa-ioc/core'
import { HttpException } from '@koa-ioc/exception'
import { ValidateClassPipe, ValidatorIntegerPipe } from '@koa-ioc/pipe'
import { HelloService } from './hello.service'
import { Validator } from '../../pipes/validator.pipe'

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
export class HelloController {
  constructor(private readonly helloService: HelloService) {}
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
    return a
  }
  @Post('/')
  helloPost(
    @Ctx() ctx: Context,
    @Req() req: Request,
    @UploadFiles() file: any,
    @Body() body: any
  ) {
    return {
      code: 200,
      body,
      file,
    }
  }
}
