const handleRoleChangeToIND = (role) => {
   switch (role) {
      case 'admin':
         return 'Admin'
      case 'head_of_division':
         return 'Kepala Bagian'
      case 'production':
         return 'Staff Produksi'
      case 'mechanical':
         return 'Staff Mekanik'
      default:
         return 'Role tidak ditemukan'
   }
}

export default handleRoleChangeToIND
