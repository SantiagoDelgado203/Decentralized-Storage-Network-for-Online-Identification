import express from 'express'
import apiRoutes from './routes/api'
import cors from "cors";
/*CONFIGURATION FILE
By Santiago Delgado
*/

const app = express()

app.use(cors({
  origin: "http://localhost:3000", // Next.js dev server
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json())
app.use('/api', apiRoutes)

export default app
