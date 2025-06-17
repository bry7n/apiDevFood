import express from 'express'

import clientRoutes from "./routes/clientRoutes.js"
import productRouttes from './routes/productRoutes.js'

const app = express()

app.use(express.json())
app.use(clientRoutes)
app.use(productRouttes)


export default app;