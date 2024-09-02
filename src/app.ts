import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
import authRoutes from './routes/authRoutes'

// Initialize Express app
const app = express()

// Middleware to add security headers
app.use(helmet())

// Middleware for logging HTTP requests
app.use(morgan('combined')) // You can use 'tiny' for a less verbose log format

// Middleware to parse JSON bodies
app.use(express.json())

// Route handlers
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)

// Default route for health check or root access
app.get('/', (req, res) => {
  res.status(200).send('Simplify API is running')
})

// Export the app
export default app
