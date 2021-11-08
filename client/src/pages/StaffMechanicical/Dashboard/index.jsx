import { Box, Flex, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'

import useSWR from 'swr'
import CardStatComplaint from '../../../components/DashboardStaff/CardStatCompaint'

const DashboardStaff = () => {
   const [ONGOING, setONGOING] = useState([])
   const [PENDING, setPENDING] = useState([])
   const [SUCCESS, setSUCCESS] = useState([])
   const [FAILED, setFAILED] = useState([])
   const [APPROVED, setAPPROVED] = useState([])
   const [NOT_YET_APPROVED, setNOT_YET_APPROVED] = useState([])
   const [NOT_APPROVED, setNOT_APPROVED] = useState([])

   const { data } = useSWR(`/api/complaints`)

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

   console.log(data)
   return (
      <Box>
         <Text color='text'>Dashboard</Text>
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

export default DashboardStaff
