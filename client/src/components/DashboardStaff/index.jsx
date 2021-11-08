import { Box, Flex, Text } from '@chakra-ui/layout'
import React, { useEffect, useState } from 'react'
import { MdEngineering, MdPerson } from 'react-icons/md'
import { FcEngineering } from 'react-icons/fc'
import { AiFillHourglass } from 'react-icons/ai'

import CardStatComplaint from './CardStatCompaint'
import useSWR from 'swr'

const DashboardStaff = () => {
   const [ONGOING, setONGOING] = useState([])
   const [PENDING, setPENDING] = useState([])
   const [SUCCESS, setSUCCESS] = useState([])
   const [FAILED, setFAILED] = useState([])

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

         setONGOING(ongoing)
         setPENDING(pending)
         setSUCCESS(success)
         setFAILED(failed)
      }

      return () => {
         setONGOING([])
         setPENDING([])
         setSUCCESS([])
         setFAILED([])
      }
   }, [data])

   return (
      <Box>
         <Text color='text'>Dashboard</Text>
         <Flex mt='20px' gridGap='30px' flexWrap='wrap'>
            <CardStatComplaint
               status='Belum Diperbaiki'
               total={PENDING?.length || 0}
               Icon={<AiFillHourglass size='32px' color='orange' />}
               badgeColorScheme='purple'
            />
            <CardStatComplaint
               status='Sedang Diperbaiki'
               total={ONGOING?.length || 0}
               Icon={MdPerson}
               badgeColorScheme='yellow'
            />
            <CardStatComplaint
               status='Berhasil Diperbaiki'
               total={SUCCESS?.length || 0}
               Icon={MdEngineering}
               badgeColorScheme='green'
            />
            <CardStatComplaint
               status='Tidak Diperbaiki'
               total={FAILED?.length || 0}
               Icon={FcEngineering}
               badgeColorScheme='red'
            />
         </Flex>
      </Box>
   )
}

export default DashboardStaff
