import { validationResult } from 'express-validator'
import Machines from '../models/machinesModel.js'
import bcrypt from 'bcrypt'

import XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
import Complaints from '../models/complaintsModel.js'
const __dirname = path.resolve()

export const getMachines = async (req, res) => {
   const pageSize = 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const code = req.query.code || ''

   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}
   const codeFilter = code ? { code: { $regex: code, $options: 'i' } } : {}

   try {
      const count = await Machines.countDocuments({
         $or: [nameFilter, codeFilter],
      })

      const machines = await Machines.find({
         $or: [nameFilter, codeFilter],
      })
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         machines,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createMachine = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { code, name } = req.body

   try {
      if (!code) throw 'Kode diperlukan'
      const codeExist = await Machines.findOne({ code })
      if (codeExist) throw 'Kode mesin sudah digunakan'
      if (!name) throw 'Nama diperlukan'
      if (!req.file) throw 'Photo diperlukan'

      const createMachine = new Machines({
         ...req.body,
         photo: `${'http://localhost:5000'}/uploads/${req.file.filename}`,
      })

      const createdMachine = await createMachine.save()

      res.status(201).json({
         status: 'success',
         machine: createdMachine,
         message: 'Machine has been created',
      })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const updateMachine = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { name, code } = req.body
   try {
      // validation code
      if (code) {
         const codeExist = await Machines.findOne({ code: code })
         if (codeExist) {
            if (codeExist._id.toString() !== req.params.id)
               throw 'code sudah digunakan'
         }
      }

      const machine = await Machines.findById(req.params.id)

      machine.name = name ?? machine.name
      machine.code = code ?? machine.code
      if (req.file)
         machine.photo = `${'http://localhost:5000'}/uploads/${
            req.file.filename
         }`

      const updatedMachine = await machine.save()

      res.status(200).json({
         status: 'success',
         machine: updatedMachine,
         message: 'Machine has been updated',
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

export const deleteMachine = async (req, res) => {
   try {
      // get complaints schema which depend on machine schema
      const complaints = await Complaints.find({
         machine: req.params.id,
      }).select('_id')
      const filterIdsComplaint = complaints.map((complaint) => complaint._id)

      await Complaints.deleteMany({ _id: filterIdsComplaint })
      await Machines.deleteOne({ _id: req.params.id })

      res.status(200).json({
         status: 'success',
         message: 'Machine has been deleted',
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

export const sheet = async (req, res) => {
   // Definisikan data
   const data = []

   const machines = await Machines.find()

   machines.forEach((machine, i) => {
      const filter = {
         NO: i + 1,
         CODE: machine.code,
         NAMA: machine.name,
         PHOTO: machine.photo,
      }

      data.push(filter)
   })

   // Buat Workbook
   const fileName = `data machines`
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
