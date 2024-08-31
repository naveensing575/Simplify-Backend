import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const dbConfig = async () => {
  const { DATABASE_URL } = process.env
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  // Parse the DATABASE_URL to extract connection details
  const url = new URL(DATABASE_URL)
  const dbName = url.pathname.substring(1) // Remove leading slash

  // Create a connection to MySQL server (without specifying a database)
  const connection = await mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    port: parseInt(url.port || '3306'), // Use default port 3306 if not specified
  })

  // Check if the database exists and create it if it doesn't
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`)
  await connection.end()

  // Initialize the Prisma client
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
  })

  return prisma
}

export default dbConfig
