import axios from 'axios'
import { update } from '../contexts/Auth/AuthActions'
import fileSaver from 'file-saver'

const createComplaint = async (values) => {
   try {
      const { data } = await axios.post(`/api/complaints`, values)
      return data
   } catch (error) {
      throw error
   }
}

const deleteComplaint = async (id) => {
   try {
      const { data } = await axios.delete(`/api/complaints/${id}`)
      return data
   } catch (error) {
      throw error
   }
}

const updateComplaint = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/complaints/${id}`, values)
      return data
   } catch (error) {
      throw error
   }
}

const updateProfile = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/complaints/${id}`, values)
      dispatch(update(data.complaint))
      return data
   } catch (error) {
      throw error
   }
}

const sheet = async () => {
   try {
      const { data } = await axios.get(`/api/complaints/sheet`, {
         responseType: 'arraybuffer',
      })
      var blob = new Blob([data], {
         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fileSaver.saveAs(blob, 'data-complaint.xlsx')

      return data
   } catch (error) {
      throw error
   }
}

const ComplaintService = {
   createComplaint,
   deleteComplaint,
   updateComplaint,
   updateProfile,
   sheet,
}

export default ComplaintService
