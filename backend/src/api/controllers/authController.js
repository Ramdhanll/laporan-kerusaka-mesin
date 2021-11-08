import { usersDummy } from '../..//Dummies/dummies.js'
import Users from '../models/usersModel.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateToken } from '../helpers/jwt.js'
import { validationResult } from 'express-validator'
import e from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'binaalamlestari7@gmail.com',
      pass: '@lukypujianto1',
   },
})

export const seed = async (req, res) => {
   await Users.deleteMany({})

   const createdUsers = await Users.insertMany(usersDummy)

   res.send(createdUsers)
}

export const login = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { email, password } = req.body

   try {
      const user = await Users.findOne({ email })

      if (user) {
         const token = generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            gender: user.gender,
            role: user.role,
         })

         if (bcrypt.compareSync(password, user.password)) {
            return res
               .status(200)
               .cookie('token', token, { httpOnly: true })
               .json({
                  user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     photo: user.photo,
                     gender: user.gender,
                     role: user.role,
                     token,
                  },
               })
         }

         throw 'Password salah'
      } else {
         throw 'Email belum terdaftar'
      }
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const register = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { name, email, password, photo } = req.body

   const user = new Users({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      photo,
   })

   const createdUser = await user.save()
   res.status(200).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      photo: createdUser.photo,
      token: generateToken(createdUser),
   })
}

export const logout = async (req, res) => {
   res.clearCookie('token')
   res.send({ success: true })
}

export const status = async (req, res) => {
   res.status(200).json({
      status: 'success',
      user: {
         _id: req.user._id,
         name: req.user.name,
         email: req.user.email,
         photo: req.user.photo,
         gender: req.user.gender,
         role: req.user.role,
      },
      message: 'status login',
   })
}

export const userDetail = async (req, res) => {
   const userId = req.params.id
   try {
      const user = await Users.findById(userId).select('-password')
      if (userId === req.user._id) {
         return res.status(200).json(user)
      } else {
         throw e
      }
   } catch (error) {
      return res.status(404).json({ message: 'User not found!' })
   }
}

export const resetPassword = async (req, res) => {
   try {
      crypto.randomBytes(32, async (err, buffer) => {
         if (err) throw 'Failed to reset password'
         const token = buffer.toString('hex')

         // user
         const user = await Users.findOne({ email: req.body.email })

         if (user) {
            user.resetToken = token
            user.expireToken = Date.now() + 3600000 // waktu sekarang ditambah 3600000 ms = 1 jam
            await user.save()

            transporter
               .sendMail({
                  from: 'binaalamlestari7@gmail.com',
                  to: user.email,
                  subject: 'Reset Password',
                  html: `
                  <p>Request untuk reset password</p>
                  <h4>klik link ini <a href="http://localhost:3000/reset-password/${token}">link</a> untuk melakukan reset password</h4>
               `,
               })
               .then((e) => {
                  return res
                     .status(200)
                     .json({ status: 'success', message: 'Cek email anda!' })
               })
               .catch((e) => {
                  console.log(e)
                  return res.status(500).json({
                     status: 'failed',
                     data: e,
                     message: 'Pesan gagal dikirim',
                  })
               })
         } else {
            return res.status(404).json({
               status: 'error',
               message: 'User tidak ditemukan!f',
            })
         }
      })
   } catch (error) {
      console.log(error)
      return res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const newPassword = async (req, res) => {
   const { token, password } = req.body
   try {
      // user
      const user = await Users.findOne({ resetToken: token })
      if (user) {
         user.password = bcrypt.hashSync(password, 8)
         user.resetToken = undefined
         user.expireToken = undefined
         user.save()
      }

      if (!user) {
         return res.status(404).json({
            status: 'error',
            message: 'Invalid token!',
         })
      }

      return res
         .status(200)
         .json({ status: 'success', message: 'Password berhasil diubah!' })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}
