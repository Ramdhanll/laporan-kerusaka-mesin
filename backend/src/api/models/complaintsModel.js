import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types
const complaintSchema = new mongoose.Schema(
   {
      machine: {
         type: ObjectId,
         ref: 'Machines',
         required: true,
      },
      code_complaint: {
         type: String,
         required: true,
      },
      complaint: {
         type: String,
         required: true,
      },
      status: {
         type: String,
         required: true,
         default: 'PENDING',
         enum: ['PENDING', 'ONGOING', 'SUCCESS', 'FAILED'],
      },
      reporter: {
         type: ObjectId,
         ref: 'Users',
         required: true,
      },
      approved: {
         type: String,
         enum: ['approved', 'not_yet_approved', 'not_approved'],
         default: 'not_yet_approved',
      },
      approved_by: {
         type: ObjectId,
         ref: 'Users',
      },
      mechanical: {
         type: ObjectId,
         ref: 'Users',
      },
      note_mechanical: {
         type: String,
      },
      photo_damage_machine: {
         type: String,
      },
      photo_solve_machine: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
)

const Complaints = mongoose.model('Complaints', complaintSchema)

export default Complaints
