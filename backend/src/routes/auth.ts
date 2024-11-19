import Router from '@koa/router'
import { validateBody } from '../middleware/validation'
import * as yup from 'yup'
import { generateToken } from '../utils/auth'
import type { Context } from 'koa'

const router = new Router({
  prefix: '/api/auth'
})

// Validation schemas
const authSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

// In-memory storage for users
const users = new Map<string, {
  id: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}>()

interface AuthRequest {
  email: string
  password: string
}

router.post('/login', validateBody(authSchema), async (ctx: Context) => {
  const { email, password } = ctx.request.body as AuthRequest

  // Find user by email
  const user = Array.from(users.values()).find(u => u.email === email)
  
  if (!user || user.password !== password) {
    ctx.throw(401, 'Invalid credentials')
  }

  const token = generateToken(user.id)

  ctx.body = {
    user: {
      id: user.id,
      email: user.email,
      token,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  }
})

router.post('/signup', validateBody(authSchema), async (ctx: Context) => {
  const { email, password } = ctx.request.body as AuthRequest

  // Check if email already exists
  if (Array.from(users.values()).some(u => u.email === email)) {
    ctx.throw(400, 'Email already exists')
  }

  // Create new user
  const now = new Date()
  const user = {
    id: `user-${Date.now()}`,
    email,
    password,
    createdAt: now,
    updatedAt: now
  }

  users.set(user.id, user)

  const token = generateToken(user.id)

  ctx.body = {
    user: {
      id: user.id,
      email: user.email,
      token,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  }
})

export default router 