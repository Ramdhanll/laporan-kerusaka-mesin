import express from 'express'
import {
   createUser,
   deleteUser,
   getUsers,
   sheet,
   updateUser,
} from '../controllers/userController.js'
import { body } from 'express-validator'
import Users from '../models/usersModel.js'
import { isAdmin, isAuth } from '../middleware/jwt.js'
const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post(
   '/',
   body('name').notEmpty().withMessage('the name field is required!'),
   body('email').notEmpty().withMessage('the email field is required!'),
   body('email').isEmail().withMessage('not an email!'),
   body('email').custom((value) => {
      return Users.findOne({ email: value }).then((user) => {
         if (user) return Promise.reject('E-mail already in use')
      })
   }),
   createUser
)
userRouter.put('/:id', isAuth, updateUser)
userRouter.delete('/:id', isAuth, isAdmin, deleteUser)

userRouter.get('/sheet', sheet)
export default userRouter
