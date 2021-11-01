import React from 'react'
import { Field } from 'formik'
import {
   FormControl,
   FormErrorMessage,
   FormLabel,
   Textarea,
} from '@chakra-ui/react'

function FormikTextArea(props) {
   const { label, name, validate, required, h, ...rest } = props
   return (
      <Field name={name} validate={validate}>
         {({ field, form }) => (
            <FormControl
               id={name}
               isInvalid={form.errors[name] && form.touched[name]}
               isRequired={required}
               // h='110px'
               h={h}
            >
               {label && (
                  <FormLabel color='text' fontSize={['sm', 'md', 'lg']}>
                     {label}
                  </FormLabel>
               )}

               <Textarea {...field} {...rest} />
               <FormErrorMessage mt='10px' color='red'>
                  {form.errors[name]}
               </FormErrorMessage>
            </FormControl>
         )}
      </Field>
   )
}

export default FormikTextArea
