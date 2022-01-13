import { Controller, Get, Import } from '@koa-ioc/core'
import { GlobalService } from '../global/global.service'
import { PostService } from './post.service'

@Controller('/posts')
@Import([PostService])
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly globalService: GlobalService
  ) {}
  @Get()
  getPost() {
    return this.postService.getPosts()
  }
  @Get('/global')
  getGlobal() {
    return this.globalService.getGlobalData()
  }
}
