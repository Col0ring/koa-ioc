import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class ForbiddenException<T> extends HttpException<T> {
  constructor(options?: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'Forbidden'
    this.status ??= 403
  }
}
