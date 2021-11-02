const handleGenderChangeToIND = (gender) => {
   switch (gender) {
      case 'L':
         return 'Laki-laki'
      case 'P':
         return 'Perempuan'
      default:
         return 'Laki-laki'
   }
}

export default handleGenderChangeToIND
