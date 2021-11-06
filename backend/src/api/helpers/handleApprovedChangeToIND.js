const handleApprovedChangeToIND = (approved) => {
   switch (approved) {
      case 'approved':
         return 'DISETUJI'
      case 'not_yet_approved':
         return 'Belum Disetujui'
      case 'not_approved':
         return 'Tidak Disetujui'
      default:
         return 'Data Tidak Ditemukan'
   }
}

export default handleApprovedChangeToIND
