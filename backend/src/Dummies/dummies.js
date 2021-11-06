import bcrypt from 'bcrypt'

let salt = bcrypt.genSaltSync(8)

export const usersDummy = [
   {
      name: 'Ramadhani',
      gender: 'L',
      photo: 'https://bit.ly/ryan-florence',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('password', salt),
      role: 'admin',
   },
   {
      name: 'Luky Pujianto',
      gender: 'L',
      photo: 'https://bit.ly/ryan-florence',
      email: 'hod@gmail.com',
      password: bcrypt.hashSync('password', salt),
      role: 'head_of_division',
   },
   {
      name: 'Abidin',
      gender: 'L',
      photo: 'https://bit.ly/ryan-florence',
      email: 'production@gmail.com',
      password: bcrypt.hashSync('password', salt),
      role: 'production',
   },
   {
      name: 'Juwaris',
      gender: 'L',
      photo: 'https://bit.ly/ryan-florence',
      email: 'mechanical@gmail.com',
      password: bcrypt.hashSync('password', salt),
      role: 'mechanical',
   },
]
