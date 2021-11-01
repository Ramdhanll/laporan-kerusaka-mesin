import React, { useContext, useState, useEffect } from 'react'
import {
   HStack,
   Box,
   Text,
   Flex,
   Button,
   Table,
   Thead,
   Tbody,
   Tr,
   Th,
   Td,
   TableCaption,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalCloseButton,
   useDisclosure,
   VStack,
   useToast,
   UnorderedList,
   ListItem,
} from '@chakra-ui/react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { SiMicrosoftexcel } from 'react-icons/si'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../Formik/FormikControl'
import UserService from '../../../services/UserService'
import useSWR, { mutate } from 'swr'
import Pagination from '../../../components/Pagination'
import AlertDialogComponent from '../../../components/AlertDialogComponent'
import Search from '../../../components/Search'
import { AuthContext } from '../../../contexts/Auth/AuthContext'

const ManageStaff = () => {
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()
   const { userState } = useContext(AuthContext)

   const [isAdd, setIsAdd] = useState(true)
   const [pageIndex, setPageIndex] = useState(1)
   const [searchValue, setSearchValue] = useState('')

   useEffect(() => {
      setPageIndex(1)
   }, [searchValue])

   const { data } = useSWR(
      `/api/users?page=${pageIndex}&role=staff&name=${searchValue}&email=${searchValue}`
   )

   const handlePagination = (page) => {
      setPageIndex(page)
   }

   // SECTION FORMIK
   const [staffSelected, setStaffSelected] = useState({})
   const handleModalOpen = ({ isAdd, staff }) => {
      setIsAdd(isAdd)
      setStaffSelected(staff)
      onOpen()
   }

   const validationSchema = Yup.object({
      name: Yup.string().required('Nama diperlukan'),
      gender: Yup.string().required('Jenis Kelamin diperlukan'),
      email: Yup.string()
         .required('Email diperlukan')
         .email('Email tidak valid'),
   })

   const handleSubmitFormik = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         if (isAdd) {
            await UserService.createUser({ ...values, role: 'staff' })
         } else {
            await UserService.updateUser(staffSelected._id, {
               ...values,
               role: 'staff',
            })
         }
         actions.setSubmitting(false)
         mutate(
            `/api/users?page=${pageIndex}&role=staff&name=${searchValue}&email=${searchValue}`
         )
         onClose()
         setStaffSelected({})
         toast({
            title: 'Berhasil',
            description: `berhasil ${isAdd ? 'membuat' : 'mengubah'} staff`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         console.log('err', error.response)
         actions.setSubmitting(false)
         const renderError = (
            <UnorderedList>
               {error?.response?.data?.errors?.length ? (
                  error.response.data.errors.map((item, i) => (
                     <ListItem key={i}>
                        {Object.keys(item.msg).length
                           ? item.msg
                           : `tidak berhasil ${
                                isAdd ? 'membuat' : 'mengubah'
                             } staff`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>
                     Tidak berhasil {isAdd ? 'membuat' : 'mengubah'} staff
                  </ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak Berhasil',
            description: renderError,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   // SECTION Delete
   const {
      isOpen: isOpenAlert,
      onOpen: onOpenAlert,
      onClose: onCloseAlert,
   } = useDisclosure()
   const [isLoadingAlert, setIsLoadingAlert] = useState(false)
   const [idDeleted, setIdDeleted] = useState(null)

   const handleOpenAlert = (id) => {
      setIdDeleted(id)
      onOpenAlert()
   }

   const handleCloseAlert = () => {
      setIdDeleted(null)
   }

   const handleConfirmDelete = async () => {
      setIsLoadingAlert(true)
      try {
         await UserService.deleteUser(idDeleted)
         mutate(
            `/api/users?page=${pageIndex}&role=staff&name=${searchValue}&email=${searchValue}`
         )
         setIdDeleted(null)
         setIsLoadingAlert(false)
         onCloseAlert()
         toast({
            title: 'Berhasil',
            description: 'berhasil hapus staff',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         const renderError = (
            <UnorderedList>
               {error?.response?.data?.errors?.length ? (
                  error.response.data.errors.map((item, i) => (
                     <ListItem key={i}>
                        {Object.keys(item.msg).length
                           ? item.msg
                           : `Tidak berhasil hapus staff`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem></ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak berhasil hapus staff',
            description: renderError,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      }
      setIsLoadingAlert(false)
   }

   const handleExportToExcel = async () => {
      try {
         await UserService.sheet('staff')
      } catch (error) {
         const renderError = (
            <UnorderedList>
               {error?.response?.data?.errors?.length ? (
                  error.response.data.errors.map((item, i) => (
                     <ListItem key={i}>
                        {Object.keys(item.msg).length
                           ? item.msg
                           : `Tidak berhasil export data`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>Tidak berhasil export data</ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak berhasil',
            description: renderError,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   return (
      <Box
      // px={['25px', '50px', '100px', '150px']}
      // py={['25px', '25px', '25px', '50px']}
      // bg='#FDEBE2'
      >
         <Flex justifyContent='space-between' alignItems='center'>
            <Text
               fontWeight='600'
               fontSize={['md', 'lg', 'xl', '3xl']}
               color='text'
            >
               Data Petugas
            </Text>

            <HStack>
               <Button
                  variant='solid'
                  bg='green'
                  color='white'
                  onClick={handleExportToExcel}
               >
                  <SiMicrosoftexcel size='24px' />
               </Button>
               <Button
                  variant='solid'
                  bg='primary'
                  color='white'
                  onClick={() => handleModalOpen({ isAdd: true })}
               >
                  <MdAdd size='24px' />
               </Button>
            </HStack>
         </Flex>

         <Box mt='20px'>
            <Search
               setQuerySearch={setSearchValue}
               size='sm'
               borderColor='gray.400'
               placeholder='Pencarian ...'
               borderRadius='xl'
               color='text'
               px='20px'
            />
         </Box>
         <Box mt='20px' overflow='auto' h='50vh'>
            <Table variant='simple'>
               <TableCaption>CV. BINA ALAM LESTARI</TableCaption>
               <Thead>
                  <Tr>
                     <Th>No</Th>
                     <Th>Nama</Th>
                     <Th>Email</Th>
                     <Th>Jenis Kelamin</Th>
                     <Th>Role</Th>
                     <Th textAlign='center'>Action</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {data?.users?.length &&
                  data?.users.some((staff) => staff._id !== userState._id) ? (
                     data?.users
                        .filter((staff) => staff._id !== userState._id)
                        .map((staff, i) => (
                           <Tr key={i}>
                              <Td>{i + 1}</Td>
                              <Td>{staff.name}</Td>
                              <Td>{staff.email}</Td>
                              <Td>{staff.gender}</Td>
                              <Td>{staff.role}</Td>
                              <Td textAlign='right'>
                                 <HStack spacing={3} justifyContent='center'>
                                    <Button
                                       variant='solid'
                                       colorScheme='blue'
                                       size='sm'
                                       _focus={{ outline: 'none' }}
                                       onClick={() =>
                                          handleModalOpen({
                                             isAdd: false,
                                             staff,
                                          })
                                       }
                                    >
                                       <MdEdit size='18px' />
                                    </Button>
                                    <Button
                                       variant='solid'
                                       colorScheme='red'
                                       size='sm'
                                       onClick={() =>
                                          handleOpenAlert(staff._id)
                                       }
                                       _focus={{ outline: 'none' }}
                                    >
                                       <MdDelete size='18px' />
                                    </Button>
                                 </HStack>
                              </Td>
                           </Tr>
                        ))
                  ) : (
                     <Tr>
                        <Td
                           colSpan='6'
                           bg='yellow.300'
                           color='text'
                           textAlign='center'
                        >
                           Data tidak ditemukan
                        </Td>
                     </Tr>
                  )}
               </Tbody>
            </Table>
         </Box>
         <Box display={data?.users?.length ? 'inline' : 'none'}>
            <Pagination
               page={data?.page}
               pages={data?.pages}
               handlePagination={handlePagination}
            />
         </Box>

         {/* Modal add and edit */}
         <Modal isOpen={isOpen} onClose={onClose} size='xs'>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>{isAdd ? 'Tambah Data' : 'Ubah Data'}</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody pb='20px'>
                  <Formik
                     initialValues={{
                        name: staffSelected?.name || '',
                        email: staffSelected?.email || '',
                        gender: staffSelected?.gender || '',
                     }}
                     onSubmit={handleSubmitFormik}
                     validationSchema={validationSchema}
                     enableReinitialize
                  >
                     {(props) => (
                        <Form>
                           <VStack spacing={5}>
                              <FormikControl
                                 control='input'
                                 name='name'
                                 label='Nama'
                                 color='text'
                              />
                              <FormikControl
                                 control='input'
                                 name='email'
                                 label='Email'
                                 color='text'
                                 type='email'
                              />
                              <FormikControl
                                 control='select'
                                 name='gender'
                                 label='Jenis Kelamin'
                                 color='text'
                                 placeholder='Pilih jenis kelamin'
                                 options={[
                                    { key: 0, value: 'L', name: 'Laki-laki' },
                                    { key: 1, value: 'P', name: 'Perempuan' },
                                 ]}
                              />
                              <Button
                                 alignSelf='flex-end'
                                 variant='solid'
                                 bg='primary'
                                 color='white'
                                 type='submit'
                                 isLoading={props.isSubmitting}
                              >
                                 {isAdd ? 'Submit' : 'Update'}
                              </Button>
                           </VStack>
                        </Form>
                     )}
                  </Formik>
               </ModalBody>
            </ModalContent>
         </Modal>

         {/* Alert Delete */}
         <AlertDialogComponent
            header='Hapus staff'
            body='Yakin ingin menghapus?'
            isOpen={isOpenAlert}
            onClose={onCloseAlert}
            isLoading={isLoadingAlert}
            handleConfirm={handleConfirmDelete}
            handleCloseAlert={handleCloseAlert}
         />
      </Box>
   )
}

export default ManageStaff
