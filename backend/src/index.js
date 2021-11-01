import express from 'express'
import dotenv from 'dotenv'
import Database from './config/Database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {
   authRouter,
   userRouter,
   machineRouter,
   complaintRouter,
} from './api/routes/index.js'
import path from 'path'
const __dirname = path.resolve()

const PORT = process.env.PORT || 5000
dotenv.config()
const app = express()

// Middleware
app.use(
   cors({
      credentials: true,
      origin: process.env.FRONT_END_URL || 'http://localhost:3000',
   })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
   '/uploads',
   express.static(path.join(__dirname, '/src/uploads/machines'))
)
// Setup mongoose database
Database()

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/machines', machineRouter)
app.use('/api/complaints', complaintRouter)

app.use('/', (req, res) => {
   res.send('Server is on!')
})

app.use((err, req, res, next) => {
   // this method from express-async-handler to handle error
   res.status(500).send({ message: err.message })
})

app.listen(PORT, () => {
   console.log(`Server listening on: http://localhost:${PORT}`)
})
