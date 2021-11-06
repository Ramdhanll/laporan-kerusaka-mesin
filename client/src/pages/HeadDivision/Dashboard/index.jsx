import { Box, Flex, Text } from '@chakra-ui/layout'
import React from 'react'
import { MdEngineering, MdPerson } from 'react-icons/md'
import { RiAdminFill } from 'react-icons/ri'
import { FcEngineering } from 'react-icons/fc'

import CardStatUser from '../../../components/Admin/CardStatUser/CardStatUser'

const Dashboard = () => {
   return (
      <Box>
         <Text color='text'>Dashboard</Text>
         <Flex mt='20px' gridGap='30px' flexWrap='wrap'>
            <CardStatUser role='Admin' total='3' Icon={RiAdminFill} />
            <CardStatUser role='Kepala Bagian' total='3' Icon={MdPerson} />
            <CardStatUser role='Petugas' total='3' Icon={MdEngineering} />
            <CardStatUser role='Mesin' total='3' Icon={FcEngineering} />
         </Flex>
      </Box>
   )
}

export default Dashboard
