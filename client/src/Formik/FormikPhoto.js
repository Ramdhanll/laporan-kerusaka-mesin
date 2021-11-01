import React from 'react'
import { Field } from 'formik'
import {
   FormControl,
   FormErrorMessage,
   FormLabel,
   Input,
} from '@chakra-ui/react'

function FormikPhoto(props) {
   const { label, name, validate, required, onChange, ref, ...rest } = props
   return (
      <Field name={name} validate={validate}>
         {({ field, form }) => (
            <FormControl
               id={name}
               isInvalid={form.errors[name] && form.touched[name]}
               isRequired={required}
            >
               {label && <FormLabel color='text'>{label}</FormLabel>}
               <Input
                  {...field}
                  {...rest}
                  type='file'
                  onChange={(e) => onChange(e)}
                  ref={ref}
               />
               <FormErrorMessage mt='10px' color='red'>
                  {form.errors[name]}
               </FormErrorMessage>
            </FormControl>
         )}
      </Field>
   )
}

export default FormikPhoto
