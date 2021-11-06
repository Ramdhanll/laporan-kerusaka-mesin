import {
   ListItem,
   UnorderedList,
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
import { NavLink } from 'react-router-dom'
import Logo from '../../Images/logo'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import AuthService from '../../services/AuthService'

const Login = ({ history }) => {
   const toast = useToast()
   const { userState, userDispatch } = useContext(AuthContext)

   useEffect(() => {
      if (userState?.role) history.push(localStorage.getItem('root') || '/')
   }, [userState, userState?.role, history])

   const validationSchema = Yup.object({
      email: Yup.string().required('Email diperlukan').email('Email invalid'),
      password: Yup.string().required('Password diperlukan'),
   })

   const handleSubmit = async (values, actions) => {
      actions.setSubmitting(true)

      try {
         const res = await AuthService.loginAuth(values, userDispatch)
         actions.setSubmitting(false)

         let role
         let root

         if (res.role === 'admin') {
            role = 'Admin'
            root = '/a'
         } else if (res.role === 'head_of_division') {
            role = 'Kepala Bagian'
            root = '/h'
         } else if (res.role === 'production') {
            role = 'Staff Produksi'
            root = '/sp'
         } else if (res.role === 'mechanical') {
            role = 'Staff Mekanik'
            root = '/sm'
         } else {
            root = '/404'
         }

         localStorage.setItem('root', root)

         history.push(root)
         toast({
            title: 'Login Berhasil',
            description: `Berhasil login sebagai ${role}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         console.log('error', error)
         actions.setSubmitting(false)

         const renderError = (
            <UnorderedList>
               {error.response.data.errors.map((item, i) => (
                  <ListItem key={i}>{item.msg}</ListItem>
               ))}
            </UnorderedList>
         )

         toast({
            title: 'Login Tidak Berhasil',
            description: renderError,
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
            w='400px'
            bg='white'
            boxShadow='2xl'
            borderRadius='lg'
            p='30px 60px'
            alignItems='center'
            flexDirection='column'
         >
            <NavLink to='/'>
               <Image
                  boxSize='50px'
                  borderRadius='full'
                  objectFit='cover'
                  src={Logo}
                  alt='Segun Adebayo'
               />
            </NavLink>

            <Text
               textAlign='center'
               fontSize='xl'
               fontWeight='700'
               mt='15px'
               mb='30px'
               color='text'
            >
               Sistem Informasi
               <br /> Laporan Kerusakan Mesin <br /> CV BINA ALAM LESTARI
            </Text>

            <Formik
               initialValues={{
                  email: '',
                  password: '',
               }}
               onSubmit={handleSubmit}
               validationSchema={validationSchema}
            >
               {(props) => (
                  <Form>
                     <VStack spacing={5}>
                        <FormikControl
                           control='input'
                           name='email'
                           label='Email'
                           required={true}
                           fontWeight='400'
                        />

                        <FormikControl
                           control='password'
                           name='password'
                           label='Password'
                           required={true}
                           fontWeight='400'
                        />

                        <Button
                           variant='solid'
                           bg='green.400'
                           color='white'
                           w='100%'
                           type='submit'
                           isLoading={props.isSubmitting}
                        >
                           Masuk
                        </Button>

                        <NavLink to='/reset-password'>
                           <Text
                              color='linkedin.300'
                              textDecoration='underline'
                           >
                              Lupa Password?
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

export default Login
