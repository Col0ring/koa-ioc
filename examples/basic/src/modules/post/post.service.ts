import { Inject, Injectable, Provide } from '@koa-ioc/core'
import { ProvideKey } from './constants'

@Provide([
  {
    provide: ProvideKey.Posts,
    useFactory() {
      return ['initial posts']
    },
  },
])
@Injectable()
export class PostService {
  @Inject(ProvideKey.Posts) private readonly posts!: string[]
  getPosts() {
    return this.posts
  }
}
