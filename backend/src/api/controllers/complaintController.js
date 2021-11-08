import { validationResult } from 'express-validator'
import Complaints from '../models/complaintsModel.js'
import bcrypt from 'bcrypt'

import XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
import Machines from '../models/machinesModel.js'
import Users from '../models/usersModel.js'
const __dirname = path.resolve()

import { pdfWarrant } from '../helpers/pdfService.js'
import handleStatusChangeToIND from '../helpers/handleStatusChangeToIND.js'
import handleApprovedChangeToIND from '../helpers/handleApprovedChangeToIND.js'

export const getComplaints = async (req, res) => {
   const pageSize = 10
   const page = Number(req.query.page) || 1
   const complaint = req.query.complaint || ''
   const code = req.query.code || ''
   const reporter = req.query.reporter || ''
   const approved = req.query.approved || ''
   const code_complaint = req.query.code_complaint || ''

   const approvedFilter = approved ? { approved } : {}

   const complaintFilter = complaint
      ? { complaint: { $regex: complaint, $options: 'i' } }
      : {}

   const codeComplaintFilter = code_complaint
      ? { code_complaint: { $regex: code_complaint, $options: 'i' } }
      : {}

   // find reporter by reporter

   const users = await Users.find({
      name: { $regex: reporter, $options: 'i' },
   }).select('_id')

   const getIdsUsers = users.map((user) => user._id)

   const filterIdsUsers = getIdsUsers.length
      ? [{ reporter: getIdsUsers }, { approved_by: getIdsUsers }]
      : [{ reporter: [] }, { reporter: [] }]

   // find machine by code
   const machines = await Machines.find({
      code: { $regex: code, $options: 'i' },
   }).select('_id')

   const getIdsMachine = machines.map((machine) => machine._id)
   const filterIdsMachine = getIdsMachine.length
      ? { machine: getIdsMachine }
      : { machine: null }

   try {
      const count = await Complaints.countDocuments({
         $and: [
            approvedFilter,
            {
               $or: [
                  filterIdsMachine,
                  complaintFilter,
                  codeComplaintFilter,
                  filterIdsUsers[0],
                  filterIdsUsers[1],
               ],
            },
         ],

         // $or: [
         //    filterIdsMachine,
         //    complaintFilter,
         //    filterIdsUsers,
         // ],
      })

      const complaints = await Complaints.find({
         $and: [
            approvedFilter,
            {
               $or: [
                  filterIdsMachine,
                  complaintFilter,
                  codeComplaintFilter,
                  filterIdsUsers[0],
                  filterIdsUsers[1],
               ],
            },
         ],

         // $or: [
         //    filterIdsMachine,
         //    complaintFilter,
         //    filterIdsUsers,
         //    approvedFilter,
         // ],
      })
         .select('-password')
         .populate('machine')
         .populate('reporter', '-password')
         .populate('approved_by', '-password')
         .populate('mechanical', '-password')
         .sort('-createdAt')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         complaints,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}

export const createComplaint = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { machine, complaint } = req.body

   try {
      if (!machine) throw 'Mesin diperlukan'
      if (!complaint) throw 'Pengaduan diperlukan'

      const dataComplaint = {
         ...req.body,
         code_complaint: createIdComplaint(),
         reporter: req.user._id,
         status: 'PENDING',
      }

      const createComplaint = new Complaints({
         ...dataComplaint,
      })

      const createdComplaint = await createComplaint.save()

      res.status(201).json({
         status: 'success',
         complaint: createdComplaint,
         message: 'Complaint has been created',
      })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const updateComplaint = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const {
      machine,
      complaint,
      status,
      approved,
      approved_by,
      mechanical,
      note_mechanical,
   } = req.body

   try {
      if (!machine) throw 'Mesin diperlukan'
      if (!complaint) throw 'Pengaduan diperlukan'

      const getComplaint = await Complaints.findById(req.params.id)

      getComplaint.complaint = complaint ?? getComplaint.complaint
      getComplaint.machine = machine ?? getComplaint.machine
      getComplaint.status = status ?? getComplaint.status
      getComplaint.approved = approved ?? getComplaint.approved
      getComplaint.approved_by = approved_by ?? getComplaint.approved_by
      getComplaint.mechanical = mechanical ?? getComplaint.mechanical
      getComplaint.note_mechanical =
         note_mechanical ?? getComplaint.note_mechanical

      const updatedComplaint = await getComplaint.save()

      res.status(200).json({
         status: 'success',
         complaint: updatedComplaint,
         message: 'Complaint has been updated',
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

export const deleteComplaint = async (req, res) => {
   try {
      await Complaints.deleteOne({ _id: req.params.id })

      res.status(200).json({
         status: 'success',
         message: 'Complaint has been deleted',
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
   // Definisikan data
   const data = []

   const complaints = await Complaints.find()
      .populate('machine')
      .populate('reporter')
      .populate('mechanical')
      .populate('approved_by')
      .sort('machine.name')

   complaints.forEach((complaint, i) => {
      const filter = {
         NO: i + 1,
         'KODE MESIN': complaint.machine.code,
         'NAMA MESIN': complaint.machine.name,
         PENGADUAN: complaint.complaint,
         WAKTU: new Date(complaint.createdAt).toLocaleDateString('id', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
         }),
         STATUS: handleStatusChangeToIND(complaint.status),
         PELAPOR: complaint.reporter.name,
         APPROVED: handleApprovedChangeToIND(complaint.approved),
         'DISETUJUI OLEH': complaint.approved_by.name,
         MEKANIK: complaint.mechanical ? complaint.mechanical.name : '-',
         'CATATAN MEKANIK': complaint.note_mechanical,
      }

      data.push(filter)
   })

   // Buat Workbook
   const fileName = `data complaints`
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

export const test = async (req, res) => {
   try {
      const complaint = req.query.complaint || ''

      const complaintFilter = complaint
         ? { complaint: { $regex: complaint, $options: 'i' } }
         : {}

      // find machine by code
      const machines = await Machines.find({
         code: { $regex: req.query.code, $options: 'i' },
      }).select('_id')

      const getIdsMachine = machines.map((machine) => machine._id)
      const filterIdsMachine = getIdsMachine.length
         ? { machine: getIdsMachine }
         : { machine: null }

      const complaints = await Complaints.find({
         $or: [filterIdsMachine, complaintFilter],
      }).populate('machine')

      res.status(200).json({ status: 'success', complaints })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

// Surat perintah
export const warrant = async (req, res) => {
   try {
      const complaint = await Complaints.findById(req.params.id)
         .populate('machine')
         .populate('reporter', '-password')
         .populate('approved_by', '-password')
         .populate('mechanical', '-password')

      pdfWarrant(
         complaint,
         (chunk) => stream.write(chunk),
         () => stream.end()
      )
      const stream = res.writeHead(200, {
         'Content-Type': 'application/pdf',
         'Content-Disposition': 'attachment;filename=surat-perintah.pdf',
      })
   } catch (error) {
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

const createIdComplaint = () => {
   const date = new Date()
   const day = date.getDate()
   const month = date.getMonth() + 1
   const year = date.getFullYear()
   const randomMath = Math.floor(Math.random() * (999 - 100 + 1) + 100)

   return `${day}${month}${year}${randomMath}`
}
