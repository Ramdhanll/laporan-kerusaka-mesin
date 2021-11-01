import { Avatar } from '@chakra-ui/avatar'
import { Image } from '@chakra-ui/image'
import { Box, Flex, Text } from '@chakra-ui/layout'
import {
   Menu,
   MenuButton,
   MenuGroup,
   MenuItem,
   MenuList,
} from '@chakra-ui/menu'
import { Button, useToast } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { MdMenu } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import AuthService from '../../services/AuthService'

const Navbar = ({ sidebar, handleOpenSideabar }) => {
   const toast = useToast()
   const { userState, userDispatch } = useContext(AuthContext)

   const handleLogout = async () => {
      try {
         await AuthService.logoutAuth(userDispatch)
         toast({
            title: 'Good bye...',
            description: '',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         toast({
            title: 'Tidak berhasil',
            description: 'logout tidak berhasil',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   return (
      <Box h='70px' w='100%' bg='#FFF3E4' px={['20px', '50px']}>
         <Flex justifyContent='space-between' alignItems='center' h='100%'>
            {!sidebar ? (
               <Box display='flex' gridGap='10px' alignItems='center'>
                  <Image
                     borderRadius='full'
                     boxSize='50px'
                     src={userState?.photo}
                     alt={userState?.name}
                  />
               </Box>
            ) : (
               <Box>
                  <Button
                     variant='ghost'
                     _focus={{ outline: 'none' }}
                     onClick={handleOpenSideabar}
                  >
                     <MdMenu size='24px' />
                  </Button>
               </Box>
            )}

            {/* Profile */}
            <Menu isLazy>
               <MenuButton>
                  <Flex alignItems='center' gridGap='20px'>
                     <Text color='text' fontWeight='600'>
                        {userState?.name}
                     </Text>
                     <Avatar
                        size='md'
                        src={userState?.photo}
                        alt={userState?.name}
                     />
                  </Flex>
               </MenuButton>
               <MenuList>
                  <MenuGroup
                     title={
                        userState?.role === 'student'
                           ? 'Siswa'
                           : userState?.role === 'teacher'
                           ? 'Guru'
                           : 'Admin'
                     }
                  >
                     <NavLink to={`${localStorage.getItem('root')}/profile`}>
                        <MenuItem>Profile</MenuItem>
                     </NavLink>
                  </MenuGroup>
                  {/* MenuItems are not rendered unless Menu is open */}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
               </MenuList>
            </Menu>
         </Flex>
      </Box>
   )
}

export default Navbar
