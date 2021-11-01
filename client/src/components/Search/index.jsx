import { Input, InputGroup } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

const Search = ({ setQuerySearch, ...rest }) => {
   const [searchTyping, setSearchTyping] = useState('')
   const timeoutRef = useRef(null)

   useEffect(() => {
      if (timeoutRef.current !== null) {
         clearInterval(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
         timeoutRef.current = null
         setQuerySearch(searchTyping)
      }, 500)
   }, [searchTyping, setQuerySearch])

   return (
      <InputGroup w={['200px', '220px', '230px', '250px']}>
         <Input {...rest} onChange={(e) => setSearchTyping(e.target.value)} />
      </InputGroup>
   )
}

export default Search
