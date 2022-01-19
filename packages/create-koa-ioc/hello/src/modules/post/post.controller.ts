import {
  Controller,
  Exception,
  Get,
  Import,
  Param,
  Pipe,
  Query,
} from '@koa-ioc/core'
import { HttpException, Success } from '@koa-ioc/exception'
import { ValidatorIntegerPipe } from '@koa-ioc/pipe'
import { GlobalService } from '../global/global.service'
import { PostService } from './post.service'

@Controller('/posts')
// exception handler
@Exception((error, ctx) => {
  if (error instanceof HttpException) {
    ctx.body = error.toJSON()
  }
})
@Import([PostService])
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly globalService: GlobalService
  ) {}
  @Get()
  getPosts() {
    // return body
    return {
      data: this.postService.getPosts(),
    }
  }

  @Get('/one/:index')
  getPost(@Param('index') @Pipe(ValidatorIntegerPipe) index: number) {
    // need exception handler
    throw new Success({
      message: 'Success',
      data: this.postService.getPost(index),
    })
    // or
    // return  new Success({
    //   message: 'Success',
    //   data: {
    //     id
    //   }
    // })
  }

  @Get('/add')
  addPost(@Query('post') post: string) {
    this.postService.addPost(post)
    return new Success({
      message: 'Add Success',
    })
  }

  @Get('/update/:index')
  updatePost(
    @Param('index', ValidatorIntegerPipe) index: number,
    @Query('post') post: string
  ) {
    this.postService.updatePost(index, post)
    return new Success({
      message: 'Update Success',
    })
  }

  @Get('/remove/:index')
  removePost(@Param('index', ValidatorIntegerPipe) index: number) {
    this.postService.removePost(index)
    return new Success({
      message: 'Remove Success',
    })
  }

  @Get('/global')
  getGlobal() {
    return this.globalService.getGlobalData()
  }
}
