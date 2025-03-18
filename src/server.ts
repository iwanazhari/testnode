import express, { type Application } from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const port = parseInt(process.env.PORT ?? '3000', 10)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
