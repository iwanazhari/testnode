import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { sanitizeInput } from './middleware/sanitize.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { publicRouter } from './routes/publicRoutes.js'
import { privateRouter } from './routes/privateRoutes.js'

dotenv.config()

const app = express()
const port = parseInt(process.env.PORT ?? '3000', 10)

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(helmet())
app.use(rateLimiter)
app.use(express.json())
app.use(sanitizeInput)
app.use('/', publicRouter)
app.use('/api', privateRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
