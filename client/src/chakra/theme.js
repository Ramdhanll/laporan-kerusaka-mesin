// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

const colors = {
   primary: '#6B4F4F',
   text: '#483434',
   textSecondary: '#A1CFEE !important',
}

const theme = extendTheme({ colors })

export default theme
