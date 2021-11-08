import { Box, Flex, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { MdEngineering, MdPerson } from 'react-icons/md'
import { RiAdminFill } from 'react-icons/ri'
import { FcEngineering } from 'react-icons/fc'

import CardStatUser from '../../../components/Admin/CardStatUser/CardStatUser'
import CardStatComplaint from '../../../components/DashboardStaff/CardStatCompaint'
import useSWR from 'swr'

const Dashboard = () => {
   const [ONGOING, setONGOING] = useState([])
   const [PENDING, setPENDING] = useState([])
   const [SUCCESS, setSUCCESS] = useState([])
   const [FAILED, setFAILED] = useState([])
   const [APPROVED, setAPPROVED] = useState([])
   const [NOT_YET_APPROVED, setNOT_YET_APPROVED] = useState([])
   const [NOT_APPROVED, setNOT_APPROVED] = useState([])

   const [admin, setAdmin] = useState([])
   const [hod, setHod] = useState([])
   const [production, setProduction] = useState([])
   const [mechanical, setMechanical] = useState([])

   const { data } = useSWR(`/api/complaints`)
   const { data: dataUsers } = useSWR(`/api/users`)
   const { data: dataMachines } = useSWR(`/api/machines`)

   useEffect(() => {
      if (dataUsers?.users?.length) {
         const getAdmin = dataUsers?.users.filter(
            (user) => user.role === 'admin'
         )
         const getHod = dataUsers?.users.filter(
            (user) => user.role === 'head_of_division'
         )
         const getProduction = dataUsers?.users.filter(
            (user) => user.role === 'production'
         )
         const getMechanical = dataUsers?.users.filter(
            (user) => user.role === 'mechanical'
         )

         setAdmin(getAdmin)
         setHod(getHod)
         setProduction(getProduction)
         setMechanical(getMechanical)
      }

      return () => {
         setAdmin([])
         setHod([])
         setProduction([])
         setMechanical([])
      }
   }, [dataUsers])

   useEffect(() => {
      if (data?.complaints?.length) {
         const ongoing = data?.complaints?.filter(
            (complaint) => complaint.status === 'ONGOING'
         )

         const pending = data?.complaints?.filter(
            (complaint) => complaint.status === 'PENDING'
         )

         const success = data?.complaints?.filter(
            (complaint) => complaint.status === 'SUCCESS'
         )

         const failed = data?.complaints?.filter(
            (complaint) => complaint.status === 'FAILED'
         )

         const approved = data?.complaints?.filter(
            (complaint) => complaint.approved === 'approved'
         )

         const not_yet_approved = data?.complaints?.filter(
            (complaint) => complaint.approved === 'not_yet_approved'
         )

         const not_approved = data?.complaints?.filter(
            (complaint) => complaint.approved === 'not_approved'
         )

         setONGOING(ongoing)
         setPENDING(pending)
         setSUCCESS(success)
         setFAILED(failed)
         setAPPROVED(approved)
         setNOT_YET_APPROVED(not_yet_approved)
         setNOT_APPROVED(not_approved)
      }

      return () => {
         setONGOING([])
         setPENDING([])
         setSUCCESS([])
         setFAILED([])
      }
   }, [data])

   return (
      <Box bg='gray.50' h='100%'>
         <Text color='text'>Dashboard</Text>
         <Box mt='30px'>
            <Text
               color='text'
               fontWeight='600'
               fontSize={['sm', 'md', 'lg', 'xl']}
            >
               MASTER DATA
            </Text>
            <Flex mt='20px' gridGap='30px' flexWrap='wrap'>
               <CardStatUser
                  role='Admin'
                  total={admin?.length || 0}
                  Icon={RiAdminFill}
               />
               <CardStatUser
                  role='Kepala Bagian'
                  total={hod?.length || 0}
                  Icon={MdPerson}
               />
               <CardStatUser
                  role='Staff Produksi'
                  total={production?.length || 0}
                  Icon={MdEngineering}
               />
               <CardStatUser
                  role='Staff Mekanik'
                  total={mechanical?.length || 0}
                  Icon={MdEngineering}
               />
               <CardStatUser
                  role='Mesin'
                  total={dataMachines?.machines?.length || 0}
                  Icon={FcEngineering}
               />
            </Flex>
         </Box>
         <Box mt='20px'>
            <Text
               color='text'
               fontWeight='600'
               fontSize={['sm', 'md', 'lg', 'xl']}
            >
               PROSESS PERBAIKAN
            </Text>
            <Flex mt='20px' gridGap='30px' flexWrap='wrap'>
               <CardStatComplaint
                  status='Belum Diperbaiki'
                  total={PENDING?.length || 0}
                  badgeColorScheme='purple'
               />
               <CardStatComplaint
                  status='Sedang Diperbaiki'
                  total={ONGOING?.length || 0}
                  badgeColorScheme='yellow'
               />
               <CardStatComplaint
                  status='Berhasil Diperbaiki'
                  total={SUCCESS?.length || 0}
                  badgeColorScheme='green'
               />
               <CardStatComplaint
                  status='Tidak Diperbaiki'
                  total={FAILED?.length || 0}
                  badgeColorScheme='red'
               />
            </Flex>
         </Box>

         <Box mt='30px'>
            <Text
               color='text'
               fontWeight='600'
               fontSize={['sm', 'md', 'lg', 'xl']}
            >
               PERSETUJUAN
            </Text>
            <Flex mt='20px' gridGap='30px'>
               <CardStatComplaint
                  status='Disetujui'
                  total={APPROVED?.length || 0}
                  badgeColorScheme='linkedin'
               />
               <CardStatComplaint
                  status='Belum Disetujui'
                  total={NOT_YET_APPROVED?.length || 0}
                  badgeColorScheme='teal'
               />
               <CardStatComplaint
                  status='Tidak Disetujui'
                  total={NOT_APPROVED?.length || 0}
                  badgeColorScheme='red'
               />
            </Flex>
         </Box>
      </Box>
   )
}

export default Dashboard
