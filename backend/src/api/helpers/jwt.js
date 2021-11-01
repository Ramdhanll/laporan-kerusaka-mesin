import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
   const { password, ...rest } = user
   return jwt.sign(
      {
         ...rest,
      },
      process.env.JWT_SECRET || 'secret',
      {
         expiresIn: '30d',
      }
   )
}
