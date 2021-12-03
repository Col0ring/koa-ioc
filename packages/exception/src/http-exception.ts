import { ExceptionOptions } from './type'

export class HttpException<T> extends Error {
  status?: number
  data?: T
  constructor({ message, status, data }: ExceptionOptions<T> = {}) {
    super(message)
    this.data = data
    this.status = status
  }
}
