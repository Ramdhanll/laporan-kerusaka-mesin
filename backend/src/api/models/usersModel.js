import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      photo: {
         type: String,
      },
      gender: {
         type: String,
         required: true,
         enum: ['L', 'P'],
         default: 'L',
      },
      email: {
         type: String,
         required: true,
         unique: [true, 'hahahah'],
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         required: true,
         default: 'production',
         enum: ['admin', 'head_of_division', 'production', 'mechanical'],
      },
      resetToken: String,
      expireToken: Date,
   },
   {
      timestamps: true,
   }
)

const Users = mongoose.model('Users', usersSchema)

export default Users
