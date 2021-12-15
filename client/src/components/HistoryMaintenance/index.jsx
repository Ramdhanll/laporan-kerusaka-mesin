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
   Spinner,
   Center,
   Badge,
   Input,
   Select,
   FormControl,
   FormLabel,
} from '@chakra-ui/react'

import useSWR from 'swr'
import ModalDetailComplaint from '../Complaints/ModalDetailComplaint'
import Pagination from '../Pagination'
import Search from '../Search'

const HistoryMaintenance = () => {
   const [pageIndex, setPageIndex] = useState(1)
   const [searchValue, setSearchValue] = useState('')
   const [machineSelected, setMachineSelected] = useState({})
   const [year, setYear] = useState('')
   const [month, setMonth] = useState('')

   useEffect(() => {
      setPageIndex(1)
   }, [searchValue])

   const { data: dataComplaint } = useSWR(
      `/api/complaints?page=${pageIndex}&code=${searchValue}&year=${year}&month=${month}`
   )

   const handlePagination = (page) => {
      setPageIndex(page)
   }

   // Machine

   const {
      isOpen: isOpenDetailMaintenance,
      onOpen: onOpenDetailMaintenance,
      onClose: onCloseDetailMaintenance,
   } = useDisclosure()

   const handleOpenDetailMaintenance = (machine) => {
      setMachineSelected(machine)
      onOpenDetailMaintenance()
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

   // handle month
   const handleChangeMonth = (e) => {
      setMonth(e)
   }

   const handleChangeYear = (e) => {
      setYear(e)
   }

   return (
      <Box>
         <Flex justifyContent='space-between' alignItems='center'>
            <Box>
               <Flex justifyContent='space-between' alignItems='center'>
                  <Text
                     fontWeight='600'
                     fontSize={['md', 'lg', 'xl', '3xl']}
                     color='text'
                  >
                     Riwayat Perbaikan
                  </Text>
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
            </Box>

            <Box d='flex' gridGap={3}>
               <FormControl>
                  <FormLabel>Pilih Tahun</FormLabel>
                  <Select
                     placeholder='All'
                     onChange={(e) => handleChangeYear(e.target.value)}
                  >
                     <option value='2021'>2021</option>
                     <option value='2020'>2020</option>
                     <option value='2019'>2019</option>
                     <option value='2018'>2018</option>
                  </Select>
               </FormControl>
               <FormControl>
                  <FormLabel>Pilih Bulan</FormLabel>
                  <Select
                     placeholder='All'
                     onChange={(e) => handleChangeMonth(e.target.value)}
                     w='140px'
                  >
                     <option value='0'>Januari</option>
                     <option value='1'>Februari</option>
                     <option value='2'>Maret</option>
                     <option value='3'>April</option>
                     <option value='4'>Mei</option>
                     <option value='5'>Juni</option>
                     <option value='6'>Juli</option>
                     <option value='7'>Agustus</option>
                     <option value='8'>September</option>
                     <option value='9'>Oktober</option>
                     <option value='10'>November</option>
                     <option value='11'>Desember</option>
                  </Select>
               </FormControl>
            </Box>
         </Flex>
         <Box mt='20px' overflow='auto' h='50vh'>
            <Table variant='simple'>
               <TableCaption>CV. BINA ALAM LESTARI</TableCaption>
               <Thead>
                  <Tr>
                     <Th>No</Th>
                     <Th>Kode Mesin</Th>
                     <Th>Nama Mesin</Th>
                     <Th>Tanggal Pengaduan</Th>
                     <Th>Status</Th>
                     <Th textAlign='center'>Action</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {dataComplaint?.complaints?.length ? (
                     dataComplaint?.complaints.map((complaint, i) => (
                        <Tr key={i}>
                           <Td>{i + 1}</Td>
                           <Td>{complaint.machine.code}</Td>
                           <Td>{complaint.machine.name}</Td>
                           <Td>
                              {new Date(complaint.createdAt).toLocaleDateString(
                                 'id',
                                 {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                 }
                              )}
                           </Td>
                           <Td>{handleStatusChangeToIND(complaint.status)}</Td>
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
         <Box display={dataComplaint?.complaints?.length ? 'inline' : 'none'}>
            <Pagination
               page={dataComplaint?.page}
               pages={dataComplaint?.pages}
               handlePagination={handlePagination}
            />
         </Box>

         {/* Modal Detail Maintenance */}
         <Modal
            isOpen={isOpenDetailMaintenance}
            onClose={onCloseDetailMaintenance}
            size='2xl'
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>
                  Riwayat Perbaikan Mesin {machineSelected?.code}
               </ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
                  {dataComplaint?.complaints !== undefined ? (
                     <Box>
                        <Table variant='simple'>
                           <Thead>
                              <Tr>
                                 <Th>Pengaduan</Th>
                                 <Th>Tanggal</Th>
                                 <Th>Action</Th>
                              </Tr>
                           </Thead>
                           <Tbody>
                              {dataComplaint?.complaints?.length ? (
                                 dataComplaint?.complaints?.map((complaint) => (
                                    <Tr>
                                       <Td>{complaint?.complaint}</Td>
                                       <Td>
                                          {new Date(
                                             complaint.createdAt
                                          ).toLocaleDateString('id', {
                                             year: 'numeric',
                                             month: 'long',
                                             day: 'numeric',
                                          })}
                                       </Td>
                                       <Td>
                                          <Button
                                             variant='solid'
                                             colorScheme='blue'
                                             size='sm'
                                             _focus={{ outline: 'none' }}
                                             onClick={() =>
                                                handleOpenModalDetailComplaint(
                                                   complaint
                                                )
                                             }
                                          >
                                             Detail
                                          </Button>
                                       </Td>
                                    </Tr>
                                 ))
                              ) : (
                                 <Tr>
                                    <Td
                                       colSpan='3'
                                       bg='yellow'
                                       textAlign='center'
                                    >
                                       Data Tidak Ditemukan
                                    </Td>
                                 </Tr>
                              )}
                           </Tbody>
                        </Table>
                     </Box>
                  ) : (
                     <Center>
                        <Spinner
                           thickness='4px'
                           speed='0.65s'
                           emptyColor='gray.200'
                           color='blue.500'
                           size='xl'
                        />
                     </Center>
                  )}
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

export default HistoryMaintenance
