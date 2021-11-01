import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema.Types
const complaintSchema = new mongoose.Schema(
   {
      machine: {
         type: ObjectId,
         ref: 'Machines',
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
      user: {
         type: ObjectId,
         ref: 'Users',
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const Complaints = mongoose.model('Complaints', complaintSchema)

export default Complaints
