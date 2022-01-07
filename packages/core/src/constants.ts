export enum Metadata {
  Params = 'design:paramtypes',
}
export enum Decorator {
  Controller = 'controller',
  Method = 'method',
  Provide = 'provide',
  Injectable = 'injectable',
  ParamsInject = 'params-inject',
  PropertiesInject = 'properties-inject',
  Middleware = 'middleware',
  Exception = 'exception',
  Ctx = 'ctx',
  Next = 'next',
  Pipe = 'pipe',
  Param = 'param',
}

export enum Method {
  All = 'all',
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
  Patch = 'patch',
  Head = 'head',
  Options = 'options',
}

export enum ParamPath {
  Req = 'request',
  Res = 'response',
  Param = 'params',
  Query = 'query',
  Header = 'headers',
  Cookies = 'cookies',
  Session = 'session',
  Body = 'request.body',
  Files = 'request.files',
}

export enum MiddlewarePosition {
  Pre = 'pre',
  Post = 'post',
}
