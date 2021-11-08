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
} from '@chakra-ui/react'

import useSWR from 'swr'
import ModalDetailComplaint from '../Complaints/ModalDetailComplaint'
import Pagination from '../Pagination'
import Search from '../Search'

const HistoryMaintenance = () => {
   const [pageIndex, setPageIndex] = useState(1)
   const [searchValue, setSearchValue] = useState('')
   const [machineSelected, setMachineSelected] = useState({})

   useEffect(() => {
      setPageIndex(1)
   }, [searchValue])

   const { data } = useSWR(
      `/api/machines?page=${pageIndex}&name=${searchValue}&code=${searchValue}`
   )

   const { data: dataComplaint } = useSWR(
      `/api/complaints?code=${machineSelected?.code}`
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

   return (
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
         <Box mt='20px' overflow='auto' h='50vh'>
            <Table variant='simple'>
               <TableCaption>CV. BINA ALAM LESTARI</TableCaption>
               <Thead>
                  <Tr>
                     <Th>No</Th>
                     <Th>Kode Mesin</Th>
                     <Th>Nama Mesin</Th>
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

                           <Td textAlign='right'>
                              <HStack spacing={3} justifyContent='center'>
                                 <Button
                                    variant='solid'
                                    colorScheme='blue'
                                    size='sm'
                                    _focus={{ outline: 'none' }}
                                    onClick={() =>
                                       handleOpenDetailMaintenance(machine)
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
         <Box display={data?.machines?.length ? 'inline' : 'none'}>
            <Pagination
               page={data?.page}
               pages={data?.pages}
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
