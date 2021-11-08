import {
   Box,
   Button,
   Flex,
   Image,
   Text,
   useToast,
   VStack,
} from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../Formik/FormikControl'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import AuthService from '../../services/AuthService'
import Logo from '../../Images/logo'
import { NavLink } from 'react-router-dom'

const NewPassword = ({ history, match }) => {
   const toast = useToast()
   const { userState } = useContext(AuthContext)

   useEffect(() => {
      if (userState?.role)
         history.push(localStorage.getItem('urlCurrent') || '/')
   }, [userState?.role, history])

   const validationSchema = Yup.object({
      password: Yup.string().required('Password diperlukan'),
      c_password: Yup.string().oneOf(
         [Yup.ref('password'), null],
         'Password harus sama'
      ),
   })

   const handleSubmit = async (values, actions) => {
      actions.setSubmitting(true)

      const data = {
         token: match.params.token,
         password: values.password,
      }

      try {
         await AuthService.newPassword(data)
         actions.setSubmitting(false)
         history.push('/login')
         toast({
            title: 'Berhasil',
            description: `Password berhasil diubah`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         actions.setSubmitting(false)

         toast({
            title: 'Tidak Berhasil',
            description: 'Password gagal diubah',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
         })
      }
   }

   return (
      <Box
         bg='#FFF3E4'
         display='flex'
         alignItems={['', 'center', 'center', 'center']}
         justifyContent='center'
         h='100vh'
      >
         <Flex
            my={['0px', '50px', '50px', '50px']}
            w='300px'
            bg='white'
            boxShadow='2xl'
            borderRadius='lg'
            p='20px 30px'
            alignItems='center'
            flexDirection='column'
         >
            <Image
               boxSize='50px'
               borderRadius='full'
               objectFit='cover'
               src={Logo}
               alt='Segun Adebayo'
            />

            <Text
               textAlign='center'
               fontSize='xl'
               fontWeight='700'
               mt='15px'
               mb='15px'
            >
               Ganti Password
            </Text>

            <Formik
               initialValues={{
                  password: '',
                  c_password: '',
               }}
               onSubmit={handleSubmit}
               validationSchema={validationSchema}
            >
               {(props) => (
                  <Form>
                     <VStack spacing={5}>
                        <FormikControl
                           control='password'
                           name='password'
                           label='Password'
                           autoComplete='off'
                        />
                        <FormikControl
                           control='password'
                           name='c_password'
                           label='Konfirmasi Password'
                           autoComplete='off'
                        />
                        <Button
                           mt='20px'
                           variant='solid'
                           bg='primary'
                           color='white'
                           w='100%'
                           type='submit'
                           isLoading={props.isSubmitting}
                        >
                           Ganti Password
                        </Button>

                        <NavLink to='/login'>
                           <Text
                              textAlign='center'
                              textDecoration='underline'
                              color='linkedin.300'
                           >
                              Kembali Login
                           </Text>
                        </NavLink>
                     </VStack>
                  </Form>
               )}
            </Formik>
         </Flex>
      </Box>
   )
}

export default NewPassword
