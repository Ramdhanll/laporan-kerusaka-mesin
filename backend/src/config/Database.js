import mongoose from 'mongoose'

const Mongoose = () =>
   mongoose
      .connect(
         process.env.MONGODB_URI ||
            'mongodb://127.0.0.1:27017/laporan-kerusakan-mesin',
         {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: true,
         }
      )
      .then(() => console.log('DB Connected'))
      .catch((e) => console.log(e))

export default Mongoose
