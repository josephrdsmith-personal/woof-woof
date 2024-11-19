import { DefaultState, DefaultContext } from 'koa'

declare module 'koa' {
  interface DefaultContext {
    params: Record<string, string>
  }
}

declare module '@koa/router' {
  interface RouterParamContext {
    params: Record<string, string>
  }
}

declare module 'koa' {
  interface Request extends Koa.BaseRequest {
    body: any
  }
} 