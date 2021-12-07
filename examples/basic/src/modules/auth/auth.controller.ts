import { Controller, Ctx, Exception, Get, Middleware } from '@koa-ioc/core'
import { createJwtMiddleware } from '@koa-ioc/auth'
import { Context } from 'koa'

// eslint-disable-next-line @typescript-eslint/unbound-method
const {
  sign,
  middleware: jwtMiddleware,
  JwtPayload,
} = createJwtMiddleware({
  payloadProps: 'user',
  getToken: (ctx) => {
    return (ctx.query.auth as string) || ''
  },
  secretOrPrivateKey: 'auth-key',
})

@Controller('/auth')
@Exception(async (ctx, next) => {
  try {
    await next()
  } catch (error: any) {
    ctx.body = error.toJSON()
  }
})
export class AuthController {
  @Get('/')
  @Middleware(jwtMiddleware)
  hello(@JwtPayload() jwt: string, @Ctx() ctx: Context) {
    console.log(ctx.jwtPayload)
    return jwt
  }
  @Get('/login')
  login() {
    return {
      token: sign(
        {
          user: 'Coloring',
        },
        { expiresIn: 60 * 5 * 1000 }
      ),
    }
  }
}
