import { Context, Next } from 'koa'
import * as yup from 'yup'

export function validateBody(schema: yup.Schema) {
  return async (ctx: Context, next: Next) => {
    try {
      const validated = await schema.validate(ctx.request.body)
      ctx.request.body = validated
      await next()
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        ctx.throw(400, e.message)
      }
      throw e
    }
  }
} 