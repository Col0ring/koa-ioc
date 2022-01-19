import { Inject, Injectable, Provide } from '@koa-ioc/core'
import { ProvideKey } from './constants'

@Provide([
  {
    provide: ProvideKey.Posts,
    useFactory() {
      return ['first post']
    },
  },
])
@Injectable()
export class PostService {
  constructor(@Inject(ProvideKey.Posts) private readonly posts: string[]) {}
  getPosts() {
    return this.posts
  }
  getPost(index: number) {
    return this.posts[index] ?? 'no post'
  }
  updatePost(index: number, post: string) {
    this.posts[index] = post
  }
  addPost(post: string) {
    this.posts.push(post)
  }
  removePost(index: number) {
    this.posts.splice(index, 1)
  }
}
