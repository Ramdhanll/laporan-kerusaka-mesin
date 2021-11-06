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
complaintRouter.delete('/:id', isAuth, deleteComplaint)

complaintRouter.get('/sheet', sheet)

complaintRouter.get('/test', test)

complaintRouter.get('/:id/warrant', warrant)

export default complaintRouter
