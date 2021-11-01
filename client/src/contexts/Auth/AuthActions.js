export const login = (user) => ({
   type: 'LOGIN',
   payload: user,
})

export const update = (user) => ({
   type: 'UPDATE',
   payload: user,
})

export const logout = () => ({
   type: 'LOGOUT',
})
