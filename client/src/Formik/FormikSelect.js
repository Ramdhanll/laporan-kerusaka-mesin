import React from 'react'
import { Field } from 'formik'
import {
   FormControl,
   FormErrorMessage,
   FormLabel,
   Select,
} from '@chakra-ui/react'

function FormikSelect(props) {
   const {
      label,
      name,
      options,
      placeholder,
      required,
      disabled = false,
      ...rest
   } = props
   return (
      <Field name={name} {...rest}>
         {({ field, form }) => (
            <FormControl
               isInvalid={form.errors[name] && form.touched[name]}
               isRequired={required}
            >
               <FormLabel {...rest}>{label}</FormLabel>
               <Select
                  placeholder={placeholder}
                  {...field}
                  disabled={disabled}
                  {...rest}
               >
                  {options.map((option) => {
                     return (
                        <option key={option.key} value={option.value}>
                           {option.name}
                        </option>
                     )
                  })}
               </Select>
               <FormErrorMessage mt='10px' color='red'>
                  {form.errors[name]}
               </FormErrorMessage>
            </FormControl>
         )}
      </Field>
   )
}

export default FormikSelect
