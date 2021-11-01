import React, { useState, useEffect } from 'react'
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
   Image,
} from '@chakra-ui/react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { SiMicrosoftexcel } from 'react-icons/si'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../Formik/FormikControl'
import MachineService from '../../../services/MachineService'
import useSWR, { mutate } from 'swr'
import Pagination from '../../../components/Pagination'
import AlertDialogComponent from '../../../components/AlertDialogComponent'
import Search from '../../../components/Search'

const ManageMachine = () => {
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()

   const [isAdd, setIsAdd] = useState(true)
   const [pageIndex, setPageIndex] = useState(1)
   const [searchValue, setSearchValue] = useState('')

   useEffect(() => {
      setPageIndex(1)
   }, [searchValue])

   const { data } = useSWR(
      `/api/machines?page=${pageIndex}&name=${searchValue}&code=${searchValue}`
   )

   const handlePagination = (page) => {
      setPageIndex(page)
   }

   // SECTION FORMIK
   const [machineSelected, setMachineSelected] = useState({})
   const handleModalOpen = ({ isAdd, machine }) => {
      setIsAdd(isAdd)
      setMachineSelected(machine)
      onOpen()
   }

   const validationSchema = Yup.object({
      code: Yup.string().required('Kode diperlukan'),
      name: Yup.string().required('Nama diperlukan'),
   })
   const handleSubmitFormik = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         if (isAdd) {
            if (photoPrev === '') throw new Error('Photo diperlukan')
         }

         const reqData = new FormData()
         reqData.append('photo', photoFile)
         reqData.append('code', values.code)
         reqData.append('name', values.name)

         if (isAdd) {
            await MachineService.createMachine(reqData)
         } else {
            await MachineService.updateMachine(machineSelected._id, reqData)
         }
         actions.setSubmitting(false)
         mutate(
            `/api/machines?page=${pageIndex}&name=${searchValue}&code=${searchValue}`
         )
         onClose()
         setMachineSelected({})
         toast({
            title: 'Berhasil',
            description: `berhasil ${isAdd ? 'membuat' : 'mengubah'} machine`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
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
                             } machine`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>{error.message}</ListItem>
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
         await MachineService.deleteMachine(idDeleted)
         mutate(
            `/api/machines?page=${pageIndex}&name=${searchValue}&code=${searchValue}`
         )
         setIdDeleted(null)
         setIsLoadingAlert(false)
         onCloseAlert()
         toast({
            title: 'Berhasil',
            description: 'berhasil hapus machine',
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
                           : `Tidak berhasil hapus machine`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>
                     Tidak berhasil {isAdd ? 'membuat' : 'mengubah'} machine
                  </ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak berhasil hapus machine',
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
         await MachineService.sheet('machine')
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

   const [photoFile, setPhotoFile] = useState(null)
   const [photoPrev, setPhotoPrev] = useState('')

   const handlePreviewPhoto = (e) => {
      const file = e.target.files[0]
      var t = file.type.split('/').pop().toLowerCase()
      if (
         t !== 'jpeg' &&
         t !== 'jpg' &&
         t !== 'png' &&
         t !== 'bmp' &&
         t !== 'gif'
      ) {
         toast({
            title: 'Gagal',
            description: 'Gunakan file photo',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
         return false
      }
      setPhotoFile(file)
      let reader = new FileReader()
      reader.onload = () => {
         const src = reader.result
         setPhotoPrev(src)
      }

      reader.readAsDataURL(file)
   }

   // Machine

   const {
      isOpen: isOpenDetailMachine,
      onOpen: onOpenDetailMachine,
      onClose: onCloseDetailMachine,
   } = useDisclosure()

   const [photoMachine, setPhotoMachine] = useState('')

   const handleOpenDetailMachine = (photo) => {
      setPhotoMachine(photo)
      onOpenDetailMachine()
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
               Data Mesin
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
                     <Th>Kode Mesin</Th>
                     <Th>Nama Mesin</Th>
                     <Th>Photo</Th>
                     <Th textAlign='center'>Action</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {data?.machines?.length ? (
                     data?.machines.map((machine, i) => (
                        <Tr key={i}>
                           <Td>{i + 1}</Td>
                           <Td>{machine.code}</Td>
                           <Td>{machine.name}</Td>
                           <Td>
                              <Image
                                 src={machine.photo}
                                 fallbackSrc='https://via.placeholder.com/50'
                                 w='100px'
                                 h='50px'
                                 cursor='pointer'
                                 onClick={() =>
                                    handleOpenDetailMachine(machine.photo)
                                 }
                              />
                           </Td>
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
                                          machine,
                                       })
                                    }
                                 >
                                    <MdEdit size='18px' />
                                 </Button>
                                 <Button
                                    variant='solid'
                                    colorScheme='red'
                                    size='sm'
                                    onClick={() => handleOpenAlert(machine._id)}
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
         <Box display={data?.machines?.length ? 'inline' : 'none'}>
            <Pagination
               page={data?.page}
               pages={data?.pages}
               handlePagination={handlePagination}
            />
         </Box>

         {/* Modal add and edit */}
         <Modal
            isOpen={isOpen}
            onClose={onClose}
            size='xs'
            onOverlayClick={() => setPhotoPrev('')}
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>{isAdd ? 'Tambah Data' : 'Ubah Data'}</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody pb='20px'>
                  <Formik
                     initialValues={{
                        code: machineSelected?.code || '',
                        name: machineSelected?.name || '',
                        // photo: machineSelected?.photo || photoPrev,
                     }}
                     onSubmit={handleSubmitFormik}
                     validationSchema={validationSchema}
                     enableReinitialize
                  >
                     {(props) => (
                        <Form>
                           <VStack spacing={5}>
                              <Image
                                 src={photoPrev || machineSelected?.photo}
                                 fallbackSrc='https://via.placeholder.com/150'
                              />
                              <FormikControl
                                 control='input'
                                 name='code'
                                 label='Kode'
                                 color='text'
                              />
                              <FormikControl
                                 control='input'
                                 name='name'
                                 label='Nama'
                                 color='text'
                              />

                              <FormikControl
                                 control='photo'
                                 name='photo'
                                 label='Photo'
                                 color='text'
                                 onChange={handlePreviewPhoto}
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
            header='Hapus mesin'
            body='Menghapus mesin akan menghapus seluruh data pengaduan, Yakin ingin menghapus?'
            isOpen={isOpenAlert}
            onClose={onCloseAlert}
            isLoading={isLoadingAlert}
            handleConfirm={handleConfirmDelete}
            handleCloseAlert={handleCloseAlert}
         />

         {/* Modal Detail Machine */}
         <Modal
            isOpen={isOpenDetailMachine}
            onClose={onCloseDetailMachine}
            size='2xl'
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader></ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
                  <Image
                     src={photoMachine}
                     fallbackSrc='https://via.placeholder.com/50'
                  />
               </ModalBody>
            </ModalContent>
         </Modal>
      </Box>
   )
}

export default ManageMachine
