import React from 'react'
import { Field } from 'formik'
import { FormControl, FormErrorMessage, Checkbox } from '@chakra-ui/react'

function FormikCheckbox(props) {
   const { label, name, validate, required, ...rest } = props
   return (
      <Field name={name} validate={validate}>
         {({ field, form }) => (
            <FormControl
               id={name}
               isInvalid={form.errors[name] && form.touched[name]}
               isRequired={required}
            >
               <Checkbox
                  {...field}
                  {...rest}
                  isChecked={field.value.includes(props.value)}
               >
                  {label}
               </Checkbox>
               <FormErrorMessage mt='10px' color='red'>
                  {form.errors[name]}
               </FormErrorMessage>
            </FormControl>
         )}
      </Field>
   )
}

export default FormikCheckbox
