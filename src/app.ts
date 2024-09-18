import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/personalTaskRoutes'
import authRoutes from './routes/authRoutes'
import teamRoutes from './routes/teamRoutes'
import teamTaskRoutes from './routes/teamTaskRoutes'
import projectRoutes from './routes/projectRoutes'

// Initialize Express app
const app = express()

// Middleware to add security headers
app.use(helmet())

// Middleware for logging HTTP requests
app.use(morgan('combined'))

// Middleware to parse JSON bodies
app.use(express.json())

// Middleware to enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
)

// Route handlers
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/team-tasks', teamTaskRoutes)
app.use('/api/projects', projectRoutes)

// Default route for health check or root access
app.get('/', (req, res) => {
  res.status(200).send('Simplify API is running')
})

// Export the app
export default app
