import { Button } from '@chakra-ui/button'
import { Image } from '@chakra-ui/image'
import { Box, Flex, Text, VStack } from '@chakra-ui/layout'
import {
   Modal,
   ModalBody,
   ModalCloseButton,
   ModalContent,
   ModalFooter,
   ModalHeader,
   ModalOverlay,
} from '@chakra-ui/modal'
import { Table, Tbody, Td, Th, Tr } from '@chakra-ui/table'
import React from 'react'
import handleApprovedChangeToIND from '../../../helpers/HandleApprovedChangeToIND'
import handleStatusChangeToIND from '../../../helpers/HandleStatusChangeToIND'

const ModalDetailComplaint = ({ complaint, isOpen, onClose }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>{/* Detail Pengaduan */}</ModalHeader>
            <ModalCloseButton _focus={{ outline: 'none' }} />
            <ModalBody>
               <Flex gridGap={5}>
                  {/* Mesin */}
                  <VStack spacing={2} alignItems='start'>
                     <Text
                        color='text'
                        fontWeight='600'
                        fontSize={['md', 'lg', 'xl', '2xl']}
                     >
                        Detail Mesin
                     </Text>
                     <Image
                        src={complaint?.machine?.photo}
                        fallbackSrc='https://via.placeholder.com/150'
                        w='300px'
                     />
                     <Table variant='simple'>
                        <Tbody>
                           <Tr>
                              <Th color='text'>Kode</Th>
                              <Td color='gray.500'>
                                 {complaint?.machine?.code}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Nama</Th>
                              <Td color='gray.500'>
                                 {complaint?.machine?.name}
                              </Td>
                           </Tr>
                        </Tbody>
                     </Table>
                  </VStack>

                  {/* Pengaduan */}
                  <VStack spacing={2} alignItems='start'>
                     <Text
                        color='text'
                        fontWeight='600'
                        fontSize={['md', 'lg', 'xl', '2xl']}
                     >
                        Detail Pengaduan
                     </Text>
                     <Table variant='simple'>
                        <Tbody>
                           <Tr>
                              <Th color='text'>Kode Pengaduan</Th>
                              <Td color='gray.500'>
                                 {complaint?.code_complaint}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Pelapor</Th>
                              <Td color='gray.500'>
                                 {complaint?.reporter?.name}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Waktu</Th>
                              <Td color='gray.500'>
                                 {new Date(
                                    complaint.createdAt
                                 ).toLocaleDateString('id', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                 })}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Pengaduan</Th>
                              <Td color='gray.500'>{complaint?.complaint}</Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Status</Th>
                              <Td color='gray.500'>
                                 {handleStatusChangeToIND(complaint?.status)}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Disetujui</Th>
                              <Td color='gray.500'>
                                 <Box d='flex' justifyContent='start'>
                                    {handleApprovedChangeToIND(
                                       complaint?.approved
                                    )}
                                 </Box>
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Disetujui Oleh</Th>
                              <Td color='gray.500'>
                                 {complaint?.approved_by?.name ?? '-'}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Mekanik</Th>
                              <Td color='gray.500'>
                                 {complaint?.mechanical?.name ?? '-'}
                              </Td>
                           </Tr>
                           <Tr>
                              <Th color='text'>Catatan Mekanik</Th>
                              <Td color='gray.500'>
                                 {complaint?.note_mechanical ?? '-'}
                              </Td>
                           </Tr>
                        </Tbody>
                     </Table>
                  </VStack>
               </Flex>
            </ModalBody>
            <ModalFooter></ModalFooter>
         </ModalContent>
      </Modal>
   )
}

export default ModalDetailComplaint
