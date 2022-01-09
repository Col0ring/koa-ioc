export enum Metadata {
  Params = 'design:paramtypes',
  Type = 'design:type',
}
export enum Decorator {
  Controller = 'ioc:controller',
  Import = 'ioc:import',
  Method = 'ioc:method',
  Provide = 'ioc:provide',
  Injectable = 'ioc:injectable',
  ParamsInject = 'ioc:params-inject',
  PropertiesInject = 'ioc:properties-inject',
  Middleware = 'ioc:middleware',
  Exception = 'ioc:exception',
  Ctx = 'ioc:ctx',
  Next = 'ioc:next',
  Pipe = 'ioc:pipe',
  Param = 'ioc:param',
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
