const handleRoleChangeToIND = (role) => {
   switch (role) {
      case 'admin':
         return 'Admin'
      case 'head_of_division':
         return 'Kepala Bagian'
      case 'staff':
         return 'Petugas'
      default:
         return 'Petugas'
   }
}

export default handleRoleChangeToIND
