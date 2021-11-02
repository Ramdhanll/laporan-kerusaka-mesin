import axios from 'axios'
import { login, logout, update } from '../contexts/Auth/AuthActions'

const loginAuth = async (values, dispatch) => {
   try {
      const { data } = await axios.post('/api/auth/login', values)
      dispatch(login(data.user))
      return data.user
   } catch (error) {
      throw error
   }
}

const statusAuth = async (dispatch) => {
   try {
      const { data } = await axios.get('/api/auth/status')
      dispatch(update(data.user))
      return data
   } catch (error) {
      throw error
   }
}

const logoutAuth = async (dispatch) => {
   try {
      const { data } = await axios.post('/api/auth/logout')
      localStorage.removeItem('root')
      localStorage.removeItem('user')
      dispatch(logout())
      return data
   } catch (error) {
      throw error
   }
}

const resetPassword = async (email) => {
   try {
      const { data } = await axios.post(`/api/auth/reset-password`, email)
      return data
   } catch (error) {
      throw error
   }
}

const newPassword = async (values) => {
   try {
      const { data } = await axios.post(`/api/auth/new-password`, values)
      return data
   } catch (error) {
      throw error
   }
}

const AuthService = {
   loginAuth,
   statusAuth,
   logoutAuth,
   resetPassword,
   newPassword,
}

export default AuthService
