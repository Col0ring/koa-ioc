import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class Success<T> extends HttpException<T> {
  constructor(options: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'Success'
    this.status ??= 200
  }
}
