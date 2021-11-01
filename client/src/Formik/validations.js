export const validatePassword = (value) => {
   console.log('asd', value)
   let error
   if (!value) {
      error = 'Password diperlukan!'
   }
   return error
}

export const validateConfirmPassword = (password, c_password) => {
   let error

   if (password !== c_password) {
      error = 'Password tidak cocok'
   }
   return error
}

export const validateRequired = (value, msg) => {
   let error
   if (!value) {
      error = msg
   }
   return error
}

export const validateNIS = (value, msgs) => {
   let error

   if (!value) {
      error = `${msgs[0]}`
   } else if (!/^-?[\d.]+(?:e-?\d+)?$/.test(value)) {
      error = `${msgs[1]}`
   } else if (value.toString().length !== 10) {
      error = msgs[2]
   }

   return error
}

export const validateEmail = (value) => {
   let error

   if (!value) {
      error = 'Email diperlukan!'
   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Email tidak valid!'
   }

   return error
}
