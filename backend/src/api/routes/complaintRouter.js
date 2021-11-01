import express from 'express'
import {
   createComplaint,
   deleteComplaint,
   getComplaints,
   sheet,
   test,
   updateComplaint,
} from '../controllers/complaintController.js'
import { body } from 'express-validator'
import { isAdmin, isAuth } from '../middleware/jwt.js'
const complaintRouter = express.Router()

complaintRouter.get('/', getComplaints)
complaintRouter.post(
   '/',
   body('machine').notEmpty().withMessage('Mesin diperlukan!'),
   body('complaint').notEmpty().withMessage('Pengaduan diperlukan!'),
   isAuth,
   createComplaint
)
complaintRouter.put(
   '/:id',
   body('machine').notEmpty().withMessage('Mesin diperlukan!'),
   body('complaint').notEmpty().withMessage('Pengaduan diperlukan!'),
   isAuth,
   updateComplaint
)
complaintRouter.delete('/:id', isAuth, isAdmin, deleteComplaint)

complaintRouter.get('/sheet', sheet)

complaintRouter.get('/test', test)

export default complaintRouter
