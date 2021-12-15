import express from 'express'
import {
   createComplaint,
   deleteComplaint,
   getComplaints,
   sheet,
   test,
   updateComplaint,
   warrant,
} from '../controllers/complaintController.js'
import { body } from 'express-validator'
import { isAdmin, isAuth } from '../middleware/jwt.js'
const complaintRouter = express.Router()

import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

import multer from 'multer'

const storage = multer.diskStorage({
   destination(req, file, cb) {
      // Cek apakah folder downloadnya ada
      const downloadFolder = path.resolve(__dirname, './src/uploads/damages')
      if (!fs.existsSync(downloadFolder)) {
         fs.mkdirSync(downloadFolder)
      }
      cb(null, `src/uploads/damages`)
   },
   filename(req, file, cb) {
      const { originalname } = file
      const format = originalname.slice(originalname.indexOf('.'))
      cb(null, `${Date.now()}${format}`)
   },
})

const uploadMulter = multer({ storage })

complaintRouter.get('/', getComplaints)
complaintRouter.post(
   '/',
   isAuth,
   uploadMulter.fields([
      { name: 'photo_damage_machine' },
      { name: 'photo_solve_machine' },
   ]),
   createComplaint
)
complaintRouter.put(
   '/:id',
   uploadMulter.fields([
      { name: 'photo_damage_machine' },
      { name: 'photo_solve_machine' },
   ]),
   isAuth,
   updateComplaint
)
complaintRouter.delete('/:id', isAuth, deleteComplaint)

complaintRouter.get('/sheet', sheet)

complaintRouter.get('/test', test)

complaintRouter.get('/:id/warrant', warrant)

export default complaintRouter
