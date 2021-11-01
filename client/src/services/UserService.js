import axios from 'axios'
import { update } from '../contexts/Auth/AuthActions'
import fileSaver from 'file-saver'

const createUser = async (values) => {
   try {
      const { data } = await axios.post(`/api/users`, values)
      return data
   } catch (error) {
      throw error
   }
}

const deleteUser = async (id) => {
   try {
      const { data } = await axios.delete(`/api/users/${id}`)
      return data
   } catch (error) {
      throw error
   }
}

const updateUser = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/users/${id}`, values)
      return data
   } catch (error) {
      throw error
   }
}

const updateProfile = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/users/${id}`, values)
      dispatch(update(data.user))
      return data
   } catch (error) {
      throw error
   }
}

const sheet = async (role) => {
   try {
      const { data } = await axios.get(`/api/users/sheet?role=${role}`, {
         responseType: 'arraybuffer',
      })
      var blob = new Blob([data], {
         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fileSaver.saveAs(blob, role ? `data-${role}.xlsx` : 'data-user.xlsx')

      return data
   } catch (error) {
      throw error
   }
}

const UserService = {
   createUser,
   deleteUser,
   updateUser,
   updateProfile,
   sheet,
}

export default UserService
