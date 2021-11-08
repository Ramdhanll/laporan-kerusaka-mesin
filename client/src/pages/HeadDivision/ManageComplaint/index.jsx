import React, { useState, useEffect, useContext } from 'react'
import { ImFolderDownload } from 'react-icons/im'

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
   Badge,
   Tooltip,
} from '@chakra-ui/react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { SiMicrosoftexcel } from 'react-icons/si'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../Formik/FormikControl'
import ComplaintService from '../../../services/ComplaintService'
import useSWR, { mutate } from 'swr'
import Pagination from '../../../components/Pagination'
import AlertDialogComponent from '../../../components/AlertDialogComponent'
import Search from '../../../components/Search'
import handleApprovedChangeToIND from '../../../helpers/HandleApprovedChangeToIND'
import { AuthContext } from '../../../contexts/Auth/AuthContext'
import handleStatusChangeToIND from '../../../helpers/HandleStatusChangeToIND'
import ModalDetailComplaint from '../../../components/Complaints/ModalDetailComplaint'
import handleRoleChangeToIND from '../../../helpers/HandleRoleChangeToIND'

const ManageComplaintt = () => {
   const { userState } = useContext(AuthContext)
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()

   const [isAdd, setIsAdd] = useState(true)
   const [pageIndex, setPageIndex] = useState(1)
   const [searchValue, setSearchValue] = useState('')

   const [optionsMachines, setOptionsMachines] = useState([])

   useEffect(() => {
      setPageIndex(1)
   }, [searchValue])

   const { data } = useSWR(
      `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&code_complaint=${searchValue}`
   )

   const { data: dataMachines } = useSWR(`/api/machines`)

   useEffect(() => {
      if (dataMachines?.machines?.length) {
         const getOptionsMachines = dataMachines?.machines?.map(
            (machine, i) => {
               return {
                  key: i,
                  name: `Kode: ${machine.code} | Nama: ${machine.name}`,
                  value: machine._id,
               }
            }
         )

         setOptionsMachines(getOptionsMachines)
      }

      return () => {}
   }, [dataMachines])

   const handlePagination = (page) => {
      setPageIndex(page)
   }

   // SECTION FORMIK
   const [complaintSelected, setComplaintSelected] = useState({})
   const handleModalOpen = ({ isAdd, complaint }) => {
      setIsAdd(isAdd)
      setComplaintSelected(complaint)
      onOpen()
   }

   const validationSchema = Yup.object({
      machine: Yup.string().required('Mesin diperlukan'),
      complaint: Yup.string().required('Pengaduan diperlukan'),
      approved: Yup.string().required('Disetujui diperlukan'),
   })

   const handleSubmitFormik = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         if (isAdd) {
            await ComplaintService.createComplaint(values)
         } else {
            await ComplaintService.updateComplaint(complaintSelected._id, {
               ...values,
               approved_by: userState._id,
            })
         }
         actions.setSubmitting(false)
         mutate(
            `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&code_complaint=${searchValue}`
         )
         onClose()
         setComplaintSelected({})
         toast({
            title: 'Berhasil',
            description: `berhasil ${isAdd ? 'membuat' : 'mengubah'} pengaduan`,
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
                             } pengaduan`}
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
         await ComplaintService.deleteComplaint(idDeleted)
         mutate(
            `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&code_complaint=${searchValue}`
         )
         setIdDeleted(null)
         setIsLoadingAlert(false)
         onCloseAlert()
         toast({
            title: 'Berhasil',
            description: 'berhasil hapus pengaduan',
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
                           : `Tidak berhasil hapus pengaduan`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>
                     Tidak berhasil {isAdd ? 'membuat' : 'mengubah'} pengaduan
                  </ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak berhasil hapus pengaduan',
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
         await ComplaintService.sheet('complaint')
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

   // SECTION DETAIL MODAL COMPLAINT
   const {
      isOpen: isOpenModalDetailComplaint,
      onOpen: onOpenModalDetailComplaint,
      onClose: onCloseModalDetailComplaint,
   } = useDisclosure()

   const [selectedComplaint, setSelectedComplaint] = useState({})
   const handleOpenModalDetailComplaint = (complaint) => {
      setSelectedComplaint(complaint)
      onOpenModalDetailComplaint()
   }

   // SECTION SURAT PERINTAH | WARANT

   const handleGetWarrant = async (id) => {
      try {
         await ComplaintService.warrant(id)
      } catch (error) {
         console.log('error', error)
      }
   }

   return (
      <Box>
         <Flex justifyContent='space-between' alignItems='center'>
            <Text
               fontWeight='600'
               fontSize={['md', 'lg', 'xl', '3xl']}
               color='text'
            >
               Data Pengaduan
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
                     <Th>Kode Pengaduan</Th>
                     <Th>Mesin</Th>
                     <Th>Pengaduan</Th>
                     <Th>Waktu</Th>
                     <Th>Status Perbaikan</Th>
                     {/* <Th>Pelapor</Th> */}
                     <Th>Disetujui</Th>
                     <Th>Disetujui Oleh</Th>
                     <Th textAlign='center'>Action</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {data?.complaints?.length ? (
                     data?.complaints.map((complaint, i) => (
                        <Tr key={i}>
                           <Td>{i + 1}</Td>
                           <Td>{complaint.code_complaint}</Td>
                           <Td>{complaint.machine.code}</Td>
                           <Td>{complaint.complaint}</Td>
                           <Td>
                              {new Date(complaint.createdAt).toLocaleDateString(
                                 'id',
                                 {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                 }
                              )}
                           </Td>
                           <Td>{handleStatusChangeToIND(complaint.status)}</Td>
                           {/* <Td>{`(${handleRoleChangeToIND(
                              complaint.reporter.role
                           )}) ${complaint.reporter.name}`}</Td> */}
                           <Td>
                              {handleApprovedChangeToIND(complaint?.approved)}
                           </Td>
                           <Td>
                              {/* {complaint.approved_by?.length
                                 ? `(${handleRoleChangeToIND(
                                      complaint.approved_by?.role
                                   )}) ${complaint.approved_by?.name}`
                                 : '-'}{' '} */}

                              {complaint?.approved_by
                                 ? complaint?.approved_by?.name
                                 : '-'}
                           </Td>

                           <Td textAlign='right'>
                              <HStack spacing={3} justifyContent='center'>
                                 <Button
                                    variant='solid'
                                    colorScheme='blue'
                                    size='sm'
                                    _focus={{ outline: 'none' }}
                                    onClick={() =>
                                       handleOpenModalDetailComplaint(complaint)
                                    }
                                 >
                                    Detail
                                 </Button>
                                 <Button
                                    variant='solid'
                                    colorScheme='yellow'
                                    size='sm'
                                    _focus={{ outline: 'none' }}
                                    onClick={() =>
                                       handleModalOpen({
                                          isAdd: false,
                                          complaint,
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
                                       handleOpenAlert(complaint._id)
                                    }
                                    _focus={{ outline: 'none' }}
                                 >
                                    <MdDelete size='18px' />
                                 </Button>
                                 {(complaint?.approved === 'approved') &
                                    (complaint?.mechanical !== undefined) && (
                                    <Tooltip label='Download surat perintah'>
                                       <Button
                                          variant='outline'
                                          colorScheme='green'
                                          size='sm'
                                          _focus={{ outline: 'none' }}
                                          onClick={() =>
                                             handleGetWarrant(complaint._id)
                                          }
                                       >
                                          <HStack
                                             spacing={3}
                                             alignItems='center'
                                          >
                                             <ImFolderDownload
                                                size='24px'
                                                color='green'
                                             />
                                             {/* <Text>Surat Perintah</Text> */}
                                          </HStack>
                                       </Button>
                                    </Tooltip>
                                 )}
                              </HStack>
                           </Td>
                        </Tr>
                     ))
                  ) : (
                     <Tr>
                        <Td
                           colSpan='9'
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
         <Box display={data?.complaints?.length ? 'inline' : 'none'}>
            <Pagination
               page={data?.page}
               pages={data?.pages}
               handlePagination={handlePagination}
            />
         </Box>

         {/* Modal add and edit */}
         <Modal isOpen={isOpen} onClose={onClose} size='lg'>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>{isAdd ? 'Tambah Data' : 'Ubah Data'}</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody pb='20px'>
                  <Formik
                     initialValues={{
                        machine: complaintSelected?.machine?._id || '',
                        complaint: complaintSelected?.complaint || '',

                        approved: complaintSelected?.approved || '',
                     }}
                     onSubmit={handleSubmitFormik}
                     validationSchema={validationSchema}
                     enableReinitialize
                  >
                     {(props) => (
                        <Form>
                           <VStack spacing={5}>
                              <FormikControl
                                 control='select'
                                 name='machine'
                                 label='Mesin'
                                 color='text'
                                 options={optionsMachines}
                                 placeholder='Pilih mesin'
                              />
                              <FormikControl
                                 control='textarea'
                                 name='complaint'
                                 label='Pengaduan'
                                 color='text'
                              />
                              <FormikControl
                                 control='select'
                                 name='approved'
                                 label='Disetujui'
                                 color='text'
                                 options={[
                                    {
                                       key: 0,
                                       value: 'approved',
                                       name: 'Disetujui',
                                    },
                                    {
                                       key: 1,
                                       value: 'not_yet_approved',
                                       name: 'Belum Disetujui',
                                    },
                                    {
                                       key: 2,
                                       value: 'not_approved',
                                       name: 'Tidak Disetujui',
                                    },
                                 ]}
                                 placeholder='Pilih Status Disetujui'
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
            header='Hapus complaint'
            body='Yakin ingin menghapus?'
            isOpen={isOpenAlert}
            onClose={onCloseAlert}
            isLoading={isLoadingAlert}
            handleConfirm={handleConfirmDelete}
            handleCloseAlert={handleCloseAlert}
         />

         <ModalDetailComplaint
            isOpen={isOpenModalDetailComplaint}
            onClose={onCloseModalDetailComplaint}
            complaint={selectedComplaint}
         />
      </Box>
   )
}

export default ManageComplaintt
