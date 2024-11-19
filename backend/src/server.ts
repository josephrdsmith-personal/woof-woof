import { createApp } from './app'

const port = process.env.PORT || 3000

export function createServer() {
  return createApp()
}

// Only start server if this file is run directly
if (require.main === module) {
  const app = createServer()
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
} 