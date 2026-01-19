/**
 * CONFIGURATION FILE
 * By Santiago Delgado
 * Updated: January 2026
 * 
 * Express app configuration with environment-based CORS
 */

import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/api.js'
import { getConfig } from './config.js'

const app = express()
const config = getConfig()

// Configure CORS with environment-based origins
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))

app.use(express.json())
app.use('/api', apiRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
