import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class NotFoundException<T> extends HttpException<T> {
  constructor(options?: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'NotFound'
    this.status ??= 404
  }
}
