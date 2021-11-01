import express from 'express'
import {
   createMachine,
   deleteMachine,
   getMachines,
   sheet,
   updateMachine,
} from '../controllers/machineController.js'
import { body } from 'express-validator'
import Machines from '../models/machinesModel.js'
import { isAdmin, isAuth } from '../middleware/jwt.js'
const machineRouter = express.Router()

import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import multer from 'multer'

const storage = multer.diskStorage({
   destination(req, file, cb) {
      // Cek apakah folder downloadnya ada
      const downloadFolder = path.resolve(__dirname, './src/uploads/machines')
      if (!fs.existsSync(downloadFolder)) {
         fs.mkdirSync(downloadFolder)
      }
      cb(null, `src/uploads/machines`)
   },
   filename(req, file, cb) {
      const { originalname } = file
      const format = originalname.slice(originalname.indexOf('.'))
      cb(null, `${Date.now()}${format}`)
   },
})

const uploadMulter = multer({ storage })

machineRouter.get('/', getMachines)
machineRouter.post('/', uploadMulter.single('photo'), createMachine)
machineRouter.put('/:id', uploadMulter.single('photo'), isAuth, updateMachine)
machineRouter.delete('/:id', isAuth, isAdmin, deleteMachine)

machineRouter.get('/sheet', sheet)
export default machineRouter
