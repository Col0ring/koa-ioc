import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class BadRequestException<T> extends HttpException<T> {
  constructor(options?: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'Bad Request'
    this.status ??= 400
  }
}
