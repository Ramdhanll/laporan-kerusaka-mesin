import {
   Box,
   Drawer,
   DrawerOverlay,
   DrawerContent,
   DrawerCloseButton,
   DrawerHeader,
   DrawerBody,
   useDisclosure,
   VStack,
   HStack,
   Text,
} from '@chakra-ui/react'
import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import Dashboard from './Dashboard'
import { MdDashboard, MdEngineering, MdPerson } from 'react-icons/md'
import { RiStaffFill } from 'react-icons/ri'
import Navbar from '../../components/Navbar'
import PageNotFound from '../PageNotFound'
import { BsGearWideConnected } from 'react-icons/bs'
import { GiNotebook } from 'react-icons/gi'
import Profile from '../../components/Profile'
import ManageComplaintt from './ManageComplaint'

const StaffProduction = () => {
   const { isOpen, onClose, onOpen } = useDisclosure()

   const handleOpenSideabar = () => {
      onOpen()
   }

   return (
      <Box bg='gray.50' h='100vh' textAlign='justify'>
         <Navbar sidebar={true} handleOpenSideabar={handleOpenSideabar} />

         <Box
            px={['25px', '50px', '100px', '100px']}
            py={['25px', '25px', '25px', '50px']}
         >
            <Switch>
               <Route path='/sp' component={Dashboard} exact />
               <Route path='/sp/profile' component={Profile} exact />

               <Route
                  path='/sp/data-pengaduan'
                  component={ManageComplaintt}
                  exact
               />

               <Route path='/sp/*' component={PageNotFound} />
            </Switch>
         </Box>

         {/* Sidebar */}
         <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
               <DrawerCloseButton _focus={{ outline: 'none' }} />
               <DrawerHeader bg='#FFF3E4' color='#483434'>
                  BINA ALAM LESTARI
               </DrawerHeader>
               <DrawerBody bg='#FFF3E4'>
                  <VStack spacing={5} alignItems='flex-start'>
                     <NavLink
                        to={localStorage.getItem('root') || '/a'}
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                        exact
                     >
                        <HStack spacing={3} alignItems='center'>
                           <MdDashboard size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Dashboard
                           </Text>
                        </HStack>
                     </NavLink>

                     <Text color='text' fontWeight='600'>
                        PENGADUAN
                     </Text>
                     <NavLink
                        to={
                           `${localStorage.getItem('root')}/data-pengaduan` ||
                           '/a/data-pengaduan'
                        }
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                     >
                        <HStack spacing={3} alignItems='center'>
                           <GiNotebook size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Data Pengaduan
                           </Text>
                        </HStack>
                     </NavLink>
                  </VStack>
               </DrawerBody>
            </DrawerContent>
         </Drawer>
      </Box>
   )
}

export default StaffProduction
