import { noop } from '@koa-ioc/misc'
import { ValidateOptions } from './type'

export class Validator {
  protected onValid: Required<ValidateOptions>['onValid']
  private onError: (error: any) => Promise<void>
  protected error: any = null
  private hasCallNext = false
  private isThrowError = true
  private waitNext = false
  constructor({ onValid = noop, onError = noop }: ValidateOptions = {}) {
    this.onValid = onValid
    if (onError.length >= 2) {
      this.waitNext = true
      this.isThrowError = false
    }
    this.onError = async (error) => {
      await onError(error, this.next.bind(this))
      this.hasCallNext = false
    }
  }
  private next(error: any = null) {
    if (this.hasCallNext) {
      return
    }
    this.hasCallNext = true
    this.error = error
    if (error) {
      this.isThrowError = true
    }
  }
  protected async throwError(error: any) {
    const thenable = this.onError(error)
    if (this.waitNext) {
      await thenable
    }
    if (this.isThrowError) {
      throw error
    }
  }
}
