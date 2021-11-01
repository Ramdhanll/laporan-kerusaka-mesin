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
import { RiAdminFill } from 'react-icons/ri'
import Navbar from '../../components/Navbar'
import PageNotFound from '../PageNotFound'
import ManageAdmin from './ManageAdmin'
import ManageHeadOfDivision from './ManageHeadOfDivision'
import ManageStaff from './ManageStaff'
import ManageMachine from './ManageMachine'
import { BsGearWideConnected } from 'react-icons/bs'
import { GiNotebook } from 'react-icons/gi'
import ManageComplaint from './ManageComplaint'

const Admin = () => {
   const { isOpen, onClose, onOpen } = useDisclosure()

   const handleOpenSideabar = () => {
      onOpen()
   }

   return (
      <Box bg='gray.50' h='100vh' textAlign='justify'>
         <Navbar sidebar={true} handleOpenSideabar={handleOpenSideabar} />

         <Box
            px={['25px', '50px', '100px', '150px']}
            py={['25px', '25px', '25px', '50px']}
         >
            <Switch>
               <Route path='/a' component={Dashboard} exact />
               <Route path='/a/data-admin' component={ManageAdmin} exact />
               <Route
                  path='/a/data-kepala-bagian'
                  component={ManageHeadOfDivision}
                  exact
               />
               <Route path='/a/data-petugas' component={ManageStaff} exact />
               <Route path='/a/data-mesin' component={ManageMachine} exact />
               <Route
                  path='/a/data-pengaduan'
                  component={ManageComplaint}
                  exact
               />

               <Route path='/a/*' component={PageNotFound} />
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
                     <NavLink
                        to={
                           `${localStorage.getItem('root')}/data-admin` ||
                           '/a/data-admin'
                        }
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                     >
                        <HStack spacing={3} alignItems='center'>
                           <RiAdminFill size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Data Admin
                           </Text>
                        </HStack>
                     </NavLink>
                     <NavLink
                        to={
                           `${localStorage.getItem(
                              'root'
                           )}/data-kepala-bagian` || '/a/data-kepala-bagian'
                        }
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                     >
                        <HStack spacing={3} alignItems='center'>
                           <MdPerson size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Data Kepala Bagian
                           </Text>
                        </HStack>
                     </NavLink>
                     <NavLink
                        to={
                           `${localStorage.getItem('root')}/data-petugas` ||
                           '/a/data-petugas'
                        }
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                     >
                        <HStack spacing={3} alignItems='center'>
                           <MdEngineering size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Data Petugas
                           </Text>
                        </HStack>
                     </NavLink>
                     <NavLink
                        to={
                           `${localStorage.getItem('root')}/data-mesin` ||
                           '/a/data-mesin'
                        }
                        style={{ color: '#483434', fontWeight: 300 }}
                        activeStyle={{ color: '#F89820', fontWeight: 700 }}
                     >
                        <HStack spacing={3} alignItems='center'>
                           <BsGearWideConnected size='24px' />
                           <Text fontSize={['sm', 'md', 'lg', 'xl']}>
                              Data Mesin
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

export default Admin
