import { Button } from '@chakra-ui/button'
import { Box, Text } from '@chakra-ui/layout'
import React from 'react'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'

const Pagination = ({ page, pages, handlePagination }) => {
   return (
      <Box
         display='flex'
         justifyContent='center'
         alignItems='center'
         mt={[5, 0, 0, 0]}
      >
         <Button
            variant='ghost'
            _focus={{ outline: 'none' }}
            onClick={() => handlePagination(page - 1)}
            disabled={page === 1 || pages === 1}
         >
            <MdArrowBack />
         </Button>
         {[...Array(pages).keys()].map((x, i) => (
            <Text
               key={i}
               fontSize='xs'
               px={3}
               py={2}
               cursor='pointer'
               backgroundColor='textSecondary'
               color='#27375A'
               borderRadius={3}
               mr={x + 1 !== pages && 3}
               _hover={{
                  opacity: 0.8,
               }}
               onClick={() => {
                  handlePagination(x + 1)
               }}
               {...(page === x + 1 && style.active)}
               display={x < page - 2 || x > page ? 'none' : ''}
            >
               {x + 1}
            </Text>
         ))}
         <>
            <Text fontSize='xs' px={2}>
               ...
            </Text>
            <Text
               color='#27375A'
               fontSize='xs'
               px={2}
               cursor='pointer'
               onClick={() => {
                  handlePagination(pages)
               }}
            >
               {pages}
            </Text>
         </>
         <Button
            variant='ghost'
            _focus={{ outline: 'none' }}
            onClick={() => handlePagination(page + 1)}
            disabled={page === pages}
         >
            <MdArrowForward />
         </Button>
      </Box>
   )
}

const style = {
   active: {
      backgroundColor: '#27375A',
      color: 'white',
      fontWeight: '700',
      fontSize: '14px',
   },
}

export default Pagination
