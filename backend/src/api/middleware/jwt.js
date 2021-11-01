import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {
   const token = req.cookies.token
   if (!token) return res.status(401).json({ message: 'you must be logged in' })

   try {
      jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
         if (err) return res.status(401).json({ message: 'Invalid token', err })
         req.user = decoded
         next()
      })
   } catch (er) {
      res.clearCookie('token')
      return res.status(400).send(er.message)
   }
}

export const isAdmin = (req, res, next) => {
   if (req.user && req.user.role === 'admin') {
      next()
   } else {
      res.status(401).json({ message: 'Invalid Admin Token' })
   }
}
