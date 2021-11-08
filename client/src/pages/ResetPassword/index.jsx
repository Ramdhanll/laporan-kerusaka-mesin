import {
   Box,
   Button,
   Flex,
   Image,
   Text,
   useToast,
   VStack,
   ListItem,
   UnorderedList,
} from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../Formik/FormikControl'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import AuthService from '../../services/AuthService'
import Logo from '../../Images/logo'
import { NavLink } from 'react-router-dom'

const ResetPassword = ({ history }) => {
   const toast = useToast()
   const { userState } = useContext(AuthContext)

   useEffect(() => {
      if (userState?.role)
         history.push(localStorage.getItem('urlCurrent') || '/')
   }, [userState?.role, history])

   const validationSchema = Yup.object({
      email: Yup.string().required('Email diperlukan!').email('Email invalid!'),
   })

   const handleSubmit = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         await AuthService.resetPassword(values)
         console.log('aa')
         actions.setSubmitting(false)
         toast({
            title: 'Berhasil',
            description: `Silahkan cek email anda `,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         const renderError = (
            <UnorderedList>
               {error?.response?.data?.errors?.length ? (
                  error.response.data.errors.map((item, i) => (
                     <ListItem key={i}>
                        {Object.keys(item.msg).length
                           ? item.msg
                           : `Pesan gagal dikirim`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>Pesan gagal dikirim</ListItem>
               )}
            </UnorderedList>
         )
         toast({
            title: 'Tidak Berhasil',
            description: renderError,
            status: 'error',
            duration: 3000,
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
               mb='5px'
            >
               Lupa Password?
            </Text>

            <Text color='gray.300' textAlign='center' mb='15px'>
               Masukan email dan sistem akan mengirim pesan untuk dapatkan
               kembali akun anda
            </Text>

            <Formik
               initialValues={{
                  email: '',
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
                           placeholder='Email'
                           autoComplete='off'
                        />

                        <Button
                           variant='solid'
                           bg='primary'
                           color='white'
                           w='100%'
                           type='submit'
                           isLoading={props.isSubmitting}
                        >
                           Reset Password
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

export default ResetPassword
