import { Badge, Box, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'

const CardStatComplaint = ({
   status,
   total,
   Icon,
   bg = 'white',
   badgeColorScheme = 'text',
}) => {
   return (
      <Box boxShadow='lg' borderRadius='md' p='20px' bg={bg}>
         <HStack spacing={7} alignItems='center'>
            <VStack spacing={1} alignItems='left'>
               <Text color='gray.500' fontSize={['xs', 'sm', 'md']}>
                  Total
               </Text>
               <Text color='text' fontSize={['xl', '2xl', '3xl', '4xl']}>
                  {total}
               </Text>
               <Badge colorScheme={badgeColorScheme} variant='solid'>
                  {status}
               </Badge>
            </VStack>
            {/* <Box>{Icon}</Box> */}
         </HStack>
      </Box>
   )
}

export default CardStatComplaint
