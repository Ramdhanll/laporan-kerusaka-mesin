import mongoose from 'mongoose'

const machinesSchema = new mongoose.Schema(
   {
      code: {
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      photo: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
)

const Machines = mongoose.model('Machines', machinesSchema)

export default Machines
