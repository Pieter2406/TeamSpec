import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { apiRoutes } from './routes/api'
import artifacts from './routes/artifacts'
import searchRoutes from './routes/search'
import productsRoutes from './routes/products'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
}))

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'ok' })
})

// API routes
app.route('/api', apiRoutes)
app.route('/api', artifacts)
app.route('/api/search', searchRoutes)
app.route('/api/products', productsRoutes)

const port = 3000
console.log(`🚀 Backend server running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port,
})

export default app
