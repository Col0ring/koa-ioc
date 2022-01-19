export interface Template {
  name: string
  color: (str: string | number) => string
}

export interface Project {
  name?: string
  template: Template
  overwrite?: boolean
  overwriteChecker?: never
  packageName?: string
}
export interface Scripts {
  install: string
  start: string
}
