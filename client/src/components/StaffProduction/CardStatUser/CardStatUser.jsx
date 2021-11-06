import { Box, HStack, Text, VStack } from '@chakra-ui/layout'
import React from 'react'

const CardStatUser = ({ role, total, Icon }) => {
   return (
      <Box boxShadow='lg' borderRadius='md' p='20px' bg='white'>
         <HStack spacing={7} alignItems='center'>
            <VStack spacing={1} alignItems='left'>
               <Text
                  color='text'
                  fontWeight='500'
                  fontSize={['md', 'lg', 'xl', '2xl']}
               >
                  {role}
               </Text>
               <Text color='gray.500' fontSize={['sm', 'md', 'lg', 'xl']}>
                  {total}
               </Text>
            </VStack>
            <Box>
               <Icon size='32px' />
            </Box>
         </HStack>
      </Box>
   )
}

export default CardStatUser
