import { Badge, Box, Center } from '@chakra-ui/layout'
import { Tooltip } from '@chakra-ui/tooltip'
import {
   IoIosCheckmarkCircle,
   IoMdWarning,
   IoIosWarning,
   IoMdCloseCircle,
} from 'react-icons/io'

const handleApprovedChangeToIND = (approved) => {
   switch (approved) {
      case 'approved':
         return (
            <Tooltip label='Disetujui' placement='top'>
               <Center>
                  <IoIosCheckmarkCircle color='green' size='24px' />
               </Center>
            </Tooltip>
         )
      case 'not_yet_approved':
         return (
            <Tooltip label='Belum Disetujui' placement='top'>
               <Center>
                  <IoIosWarning color='orange' size='24px' />
               </Center>
            </Tooltip>
         )
      case 'not_approved':
         return (
            <Tooltip label='Tidak Disetujui' placement='top'>
               <Center>
                  <IoMdCloseCircle color='red' size='24px' />
               </Center>
            </Tooltip>
         )
      default:
         return <IoMdWarning />
   }
}

export default handleApprovedChangeToIND
