import axios from 'axios'
import { update } from '../contexts/Auth/AuthActions'
import fileSaver from 'file-saver'

const createMachine = async (values) => {
   try {
      const { data } = await axios.post(`/api/machines`, values)
      return data
   } catch (error) {
      throw error
   }
}

const deleteMachine = async (id) => {
   try {
      const { data } = await axios.delete(`/api/machines/${id}`)
      return data
   } catch (error) {
      throw error
   }
}

const updateMachine = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/machines/${id}`, values)
      return data
   } catch (error) {
      throw error
   }
}

const updateProfile = async (id, values, dispatch) => {
   try {
      const { data } = await axios.put(`/api/machines/${id}`, values)
      dispatch(update(data.machine))
      return data
   } catch (error) {
      throw error
   }
}

const sheet = async () => {
   try {
      const { data } = await axios.get(`/api/machines/sheet`, {
         responseType: 'arraybuffer',
      })
      var blob = new Blob([data], {
         type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      fileSaver.saveAs(blob, 'data-machine.xlsx')

      return data
   } catch (error) {
      throw error
   }
}

const MachineService = {
   createMachine,
   deleteMachine,
   updateMachine,
   updateProfile,
   sheet,
}

export default MachineService
