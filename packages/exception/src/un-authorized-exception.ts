import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class UnAuthorizedException<T> extends HttpException<T> {
  constructor(options?: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'UnAuthorized'
    this.status ??= 401
  }
}
