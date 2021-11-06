import { Badge } from '@chakra-ui/layout'

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

export default handleStatusChangeToIND
