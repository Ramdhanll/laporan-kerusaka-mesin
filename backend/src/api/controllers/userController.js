import { validationResult } from 'express-validator'
import Users from '../models/usersModel.js'
import bcrypt from 'bcrypt'

import XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
const __dirname = path.resolve()

export const getUsers = async (req, res) => {
   const pageSize = 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const email = req.query.email || ''
   const role = req.query.role || ''
   const _id = req.query.id || ''

   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
   const emailFilter = email ? { email: { $regex: email, $options: 'i' } } : {}

   const roleFilter = role ? { role } : {}

   try {
      const count = await Users.countDocuments({
         $and: [roleFilter, { $or: [nameFilter, emailFilter] }],
      })

      const users = await Users.find({
         $and: [roleFilter, { $or: [nameFilter, emailFilter] }],
      })
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         users,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createUser = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   try {
      const createUser = new Users({
         ...req.body,
         password: bcrypt.hashSync(req.body.email, 8),
      })

      const createdUser = await createUser.save()

      res.status(201).json({
         status: 'success',
         user: createdUser,
         message: 'User has been created',
      })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const updateUser = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { name, email, password } = req.body
   try {
      // validation email
      if (email) {
         const emailExist = await Users.findOne({ email: email })
         if (emailExist) {
            if (emailExist._id.toString() !== req.params.id)
               throw 'Email sudah digunakan'
         }
      }

      const user = await Users.findById(req.params.id)

      user.name = name ?? user.name
      user.email = email ?? user.email
      user.password = password ? bcrypt.hashSync(password, 8) : user.password

      const updatedUser = await user.save()
      res.status(200).json({
         status: 'success',
         user: updatedUser,
         message: 'User has been updated',
      })
   } catch (error) {
      console.log(error)
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const deleteUser = async (req, res) => {
   try {
      await Users.deleteOne({ _id: req.params.id })

      res.status(200).json({
         status: 'success',
         message: 'User has been deleted',
      })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const sheet = async (req, res) => {
   const { role } = req.query

   const roleFilter = role ? { role } : {}

   // Definisikan data
   const data = []

   const users = await Users.find({ ...roleFilter })

   users.forEach((user, i) => {
      const filter = {
         NO: i + 1,
         NAMA: user.name,
         EMAIL: user.email,
         'JENIS KELAMIN': user.gender === 'L' ? 'Laki-laki' : 'Perempuan',
         ROLE:
            user.role === 'head_of_division'
               ? 'Kepala Bagian'
               : user.role === 'staff'
               ? 'Petugas'
               : 'Admin',
      }

      data.push(filter)
   })

   // Buat Workbook
   const fileName = `data users`
   let wb = XLSX.utils.book_new()
   wb.Props = {
      Title: fileName,
      Author: 'Admin',
      CreatedDate: new Date(),
   }
   // Buat Sheet
   wb.SheetNames.push('Sheet 1')
   // Buat Sheet dengan Data
   let ws = XLSX.utils.json_to_sheet(data)
   var wscols = [{ wch: 6 }, { wch: 7 }, { wch: 10 }, { wch: 20 }]

   ws['!cols'] = wscols
   wb.Sheets['Sheet 1'] = ws
   // Cek apakah folder downloadnya ada
   const downloadFolder = path.resolve(__dirname, '../downloads')
   if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder)
   }
   try {
      // Simpan filenya
      XLSX.writeFile(wb, `${downloadFolder}${path.sep}${fileName}.xls`)
      res.download(`${downloadFolder}${path.sep}${fileName}.xls`)
   } catch (e) {
      console.log(e.message)
      throw e
   }
}
