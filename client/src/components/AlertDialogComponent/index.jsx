import {
   AlertDialog,
   AlertDialogBody,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   Button,
} from '@chakra-ui/react'
import React from 'react'

const AlertDialogComponent = ({
   isOpen,
   onClose,
   header,
   body,
   handleConfirm,
   isLoading,
   handleCloseAlert,
}) => {
   return (
      <AlertDialog
         isOpen={isOpen}
         onClose={onClose}
         onOverlayClick={handleCloseAlert}
      >
         <AlertDialogOverlay>
            <AlertDialogContent>
               <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  {header}
               </AlertDialogHeader>

               <AlertDialogBody>{body}</AlertDialogBody>

               <AlertDialogFooter>
                  <Button onClick={onClose} _focus={{ outline: 'none' }}>
                     Cancel
                  </Button>
                  <Button
                     colorScheme='red'
                     onClick={handleConfirm}
                     ml={3}
                     isLoading={isLoading}
                  >
                     Delete
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialogOverlay>
      </AlertDialog>
   )
}

export default AlertDialogComponent
