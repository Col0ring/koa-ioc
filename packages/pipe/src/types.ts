export interface ValidateOptions {
  onValid?: (originValue: any) => void
  onError?: (error: any, next: (error?: any) => void) => void
}
