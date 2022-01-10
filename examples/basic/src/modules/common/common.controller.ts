import {
  UploadedFiles,
  UploadedFile,
  Controller,
  Middleware,
  Post,
  Ctx,
  Exception,
  Body,
} from '@koa-ioc/core'
import multer from '@koa/multer'
import { Context } from 'koa'
import { uploadConfig } from '../../config/upload'
const upload = multer({
  storage: uploadConfig.storage,
})
@Controller('/common')
export class CommonController {
  @Post('/upload/file')
  @Exception(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.log(error)
    }
  })
  @Middleware(upload.single('file'))
  uploadFile(@UploadedFile() file: multer.File, @Body() body: any) {
    return {
      file,
      body,
    }
  }

  @Post('/upload/files')
  @Middleware(upload.array('files'))
  @Exception(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.body = 'error'
    }
  })
  uploadFiles(@UploadedFiles() files: multer.File[], @Ctx() ctx: Context) {
    return {
      files,
      body: ctx.request.body,
    }
  }
}
