import app from './app'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Get port from environment and store in Express
const PORT = process.env.PORT ?? 4000

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
