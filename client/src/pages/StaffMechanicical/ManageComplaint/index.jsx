import React, { useState, useEffect, useContext } from 'react'
import { Image, Tooltip } from '@chakra-ui/react'
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
} from '@chakra-ui/react'
import { MdEdit } from 'react-icons/md'
import { ImFolderDownload } from 'react-icons/im'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../Formik/FormikControl'
import ComplaintService from '../../../services/ComplaintService'
import useSWR, { mutate } from 'swr'
import Pagination from '../../../components/Pagination'
import Search from '../../../components/Search'
import { AuthContext } from '../../../contexts/Auth/AuthContext'
import ModalDetailComplaint from '../../../components/Complaints/ModalDetailComplaint'

const ManageComplaint = () => {
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
      `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&approved=approved&code_complaint=${searchValue}`
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
   })

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

   const handleSubmitFormik = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         const reqData = new FormData()

         reqData.append('photo_solve_machine', photoFile)
         reqData.append('machine', values.machine)
         reqData.append('complaint', values.complaint)
         reqData.append('status', values.status)
         reqData.append('note_mechanical', values.note_mechanical)

         if (isAdd) {
            await ComplaintService.createComplaint(reqData)
         } else {
            await ComplaintService.updateComplaint(
               complaintSelected._id,
               reqData
            )
         }
         actions.setSubmitting(false)
         mutate(
            `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&approved=approved&code_complaint=${searchValue}`
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

   const handleStatusChangeToIND = (status) => {
      switch (status) {
         case 'PENDING':
            return (
               <Badge variant='solid' colorScheme='yellow'>
                  Belum Diperbaiki
               </Badge>
            )
         case 'ONGOING':
            return (
               <Badge variant='solid' colorScheme='blue'>
                  Sedang Diperbaiki
               </Badge>
            )
         case 'SUCCESS':
            return (
               <Badge variant='solid' colorScheme='green'>
                  Berhasil Diperbaiki
               </Badge>
            )
         case 'FAILED':
            return (
               <Badge variant='solid' colorScheme='red'>
                  Tidak Berhasil Diperbaiki
               </Badge>
            )

         default:
            return <Badge>Belum Diperbaiki</Badge>
      }
   }

   const handleWorkon = async (complaint) => {
      try {
         await ComplaintService.updateComplaint(complaint._id, {
            ...complaint,
            mechanical: userState?._id,
         })

         mutate(
            `/api/complaints?page=${pageIndex}&complaint=${searchValue}&code=${searchValue}&reporter=${searchValue}&approved=approved&code_complaint=${searchValue}`
         )
         onClose()
         toast({
            title: 'Berhasil',
            description: `berhasil memilih`,
            status: 'success',
            duration: 3000,
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
                           : `tidak berhasil memilih`}
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

            {/* <HStack>
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
            </HStack> */}
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
                     {/* <Th>Disetujui</Th> */}
                     <Th>Mekanik</Th>
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

                           <Td>
                              {complaint?.mechanical
                                 ? complaint?.mechanical?.name
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

                                 {complaint?.mechanical === undefined && (
                                    <Button
                                       variant='outline'
                                       colorScheme='blue'
                                       size='sm'
                                       _focus={{ outline: 'none' }}
                                       onClick={() => handleWorkon(complaint)}
                                    >
                                       Kerjakan
                                    </Button>
                                 )}

                                 {complaint?.mechanical?._id ===
                                    userState?._id && (
                                    <>
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
                                    </>
                                 )}

                                 {/* <Button
                                    variant='solid'
                                    colorScheme='red'
                                    size='sm'
                                    onClick={() =>
                                       handleOpenAlert(complaint._id)
                                    }
                                    _focus={{ outline: 'none' }}
                                 >
                                    <MdDelete size='18px' />
                                 </Button> */}
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
                        note_mechanical:
                           complaintSelected?.note_mechanical || '',
                        status: complaintSelected?.status || '',
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
                                 disabled
                              />
                              <FormikControl
                                 control='textarea'
                                 name='complaint'
                                 label='Pengaduan'
                                 color='text'
                                 disabled
                              />
                              <FormikControl
                                 control='select'
                                 name='status'
                                 label='Status'
                                 placeholder='Pilih Status'
                                 options={[
                                    {
                                       key: 0,
                                       value: 'PENDING',
                                       name: 'Belum Diperbaiki',
                                    },
                                    {
                                       key: 1,
                                       value: 'ONGOING',
                                       name: 'Sedang Diperbaiki',
                                    },
                                    {
                                       key: 2,
                                       value: 'SUCCESS',
                                       name: 'Berhasil Diperbaiki',
                                    },
                                    {
                                       key: 3,
                                       value: 'FAILED',
                                       name: 'Tidak Berhasil Diperbaiki',
                                    },
                                 ]}
                              />
                              {photoPrev ||
                                 (complaintSelected?.photo_solve_machine && (
                                    <Image
                                       src={
                                          photoPrev ||
                                          complaintSelected?.photo_solve_machine
                                       }
                                       fallbackSrc='https://via.placeholder.com/50'
                                    />
                                 ))}
                              <FormikControl
                                 control='photo'
                                 name='photo_perbaikan'
                                 label='Photo Hasil Perbaikan'
                                 color='text'
                                 onChange={handlePreviewPhoto}
                              />
                              <FormikControl
                                 control='textarea'
                                 name='note_mechanical'
                                 label='Catatan Mekanik'
                                 color='text'
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

         <ModalDetailComplaint
            isOpen={isOpenModalDetailComplaint}
            onClose={onCloseModalDetailComplaint}
            complaint={selectedComplaint}
         />
      </Box>
   )
}

export default ManageComplaint
