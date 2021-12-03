import { HttpException } from './http-exception'
import { ExceptionOptions } from './type'

export class ServiceUnavailableException<T> extends HttpException<T> {
  constructor(options: ExceptionOptions<T>) {
    super(options)
    this.message ??= 'Service Unavailable'
    this.status ??= 500
  }
}
