import {
   FormControl,
   FormErrorMessage,
   FormLabel,
   Radio,
   RadioGroup,
} from '@chakra-ui/react'
import { Field } from 'formik'
import React from 'react'

const FormikRadioButton = (props) => {
   const {
      name,
      label,
      options,
      required,
      flexDirection = 'row',
      gridGap = '0px',
      disabled,
   } = props
   return (
      <Field name={name}>
         {({ field, form }) => {
            const { onChange, ...rest } = field
            return (
               <FormControl
                  id={name}
                  isInvalid={form.errors[name] && form.touched[name]}
                  isRequired={required}
                  isDisabled={disabled}
               >
                  <FormLabel htmlFor={name}>{label}</FormLabel>
                  <RadioGroup
                     {...rest}
                     id={name}
                     {...props}
                     display='flex'
                     flexDirection={flexDirection}
                     gridGap={gridGap}
                  >
                     {options.map((value) => (
                        <Radio
                           key={value.key}
                           onChange={onChange}
                           value={value.value}
                           mr={3}
                        >
                           {value.name}
                        </Radio>
                     ))}
                  </RadioGroup>
                  <FormErrorMessage mt='10px'>
                     {form.errors[name]}
                  </FormErrorMessage>
               </FormControl>
            )
         }}
      </Field>
   )
}

export default FormikRadioButton
