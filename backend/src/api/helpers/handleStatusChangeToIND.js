const handleStatusChangeToIND = (status) => {
   switch (status) {
      case 'PENDING':
         return 'Belum Diperbaiki'
      case 'ONGOING':
         return 'Sedang Diperbaiki'
      case 'SUCCESS':
         return 'Berhasil Diperbaiki'
      case 'FAILED':
         return 'Tidak Berhasil Diperbaiki'

      default:
         return 'Belum Diperbaiki'
   }
}

export default handleStatusChangeToIND
