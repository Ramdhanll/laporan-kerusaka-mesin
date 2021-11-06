import React, { useContext, useState } from 'react'
import {
   Heading,
   Avatar,
   Box,
   Center,
   Text,
   Stack,
   Button,
   useColorModeValue,
   Table,
   Tbody,
   Tr,
   Td,
   Th,
   useDisclosure,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   useToast,
   VStack,
   Image,
   ListItem,
   UnorderedList,
} from '@chakra-ui/react'
import { AuthContext } from '../../contexts/Auth/AuthContext'
import handleRoleChangeToIND from '../../helpers/HandleRoleChangeToIND'
import handleGenderChangeToIND from '../../helpers/HandleGenderChangeToIND'
import { MdEdit } from 'react-icons/md'
import FormikControl from '../../Formik/FormikControl'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import UserService from '../../services/UserService'

const Profile = () => {
   const toast = useToast()
   const { isOpen, onOpen, onClose } = useDisclosure()
   const { userState, userDispatch } = useContext(AuthContext)

   const validationSchema = Yup.object({
      name: Yup.string().required('Nama diperlukan'),
      email: Yup.string().required('Email diperlukan').email('Email invalid'),
      gender: Yup.string().required('Jenis Kelamin diperlukan'),
      c_password: Yup.string().oneOf(
         [Yup.ref('password'), null],
         'Password harus sama'
      ),
   })

   const handleSubmitFormik = async (values, actions) => {
      actions.setSubmitting(true)
      try {
         if (values.password && values.c_password === '')
            throw new Error('Konfirmasi password diperlukan')

         const reqData = new FormData()
         reqData.append('photo', photoFile)
         reqData.append('name', values.name)
         reqData.append('email', values.email)
         reqData.append('gender', values.gender)
         reqData.append('password', values.password)

         await UserService.updateProfile(userState._id, reqData, userDispatch)

         actions.setSubmitting(false)
         // mutate(
         //    `/api/machines?page=${pageIndex}&name=${searchValue}&code=${searchValue}`
         // )
         onClose()
         toast({
            title: 'Berhasil',
            description: `berhasil mengubah profile`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
      } catch (error) {
         actions.setSubmitting(false)
         const renderError = (
            <UnorderedList>
               {error?.response?.data?.errors?.length ? (
                  error.response.data.errors.map((item, i) => (
                     <ListItem key={i}>
                        {Object.keys(item.msg).length
                           ? item.msg
                           : `tidak berhasil mengubah profile`}
                     </ListItem>
                  ))
               ) : (
                  <ListItem>{error.message}</ListItem>
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

   const [photoFile, setPhotoFile] = useState(null)
   const [photoPrev, setPhotoPrev] = useState('')

   const handlePreviewPhoto = (e) => {
      const file = e.target.files[0]
      var t = file.type.split('/').pop().toLowerCase()
      if (
         t !== 'jpeg' &&
         t !== 'jpg' &&
         t !== 'png' &&
         t !== 'bmp' &&
         t !== 'gif'
      ) {
         toast({
            title: 'Gagal',
            description: 'Gunakan file photo',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
         })
         return false
      }
      setPhotoFile(file)
      let reader = new FileReader()
      reader.onload = () => {
         const src = reader.result
         setPhotoPrev(src)
      }

      reader.readAsDataURL(file)
   }

   return (
      <Center py={6}>
         <Box
            maxW={'320px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}
         >
            <Avatar
               size={'xl'}
               src={userState?.photo}
               alt={userState?.name}
               mb={4}
               pos={'relative'}
               _after={{
                  content: '""',
                  w: 4,
                  h: 4,
                  bg: 'green.300',
                  border: '2px solid white',
                  rounded: 'full',
                  pos: 'absolute',
                  bottom: 0,
                  right: 3,
               }}
            />
            <Heading fontSize={'2xl'} fontFamily={'body'}>
               {userState?.name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'} mb={4}>
               {userState?.email}
            </Text>

            <Table variant='simple'>
               <Tbody>
                  <Tr>
                     <Th>Role</Th>
                     <Td>{handleRoleChangeToIND(userState?.role)}</Td>
                  </Tr>
                  <Tr>
                     <Th>Jenis Kelamin</Th>
                     <Td>{handleGenderChangeToIND(userState?.gender)}</Td>
                  </Tr>
               </Tbody>
            </Table>

            <Stack mt={8} direction={'row'} spacing={4}>
               <Button
                  flex={1}
                  fontSize={'sm'}
                  rounded={'full'}
                  bg={'blue.400'}
                  color={'white'}
                  boxShadow={
                     '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                  }
                  _hover={{
                     bg: 'blue.500',
                  }}
                  _focus={{
                     bg: 'blue.500',
                  }}
                  onClick={() => onOpen()}
               >
                  <MdEdit size='24px' />
               </Button>
            </Stack>
         </Box>

         <Modal
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={() => {
               setPhotoPrev('')
            }}
         >
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Edit Profile</ModalHeader>
               <ModalCloseButton _focus={{ outline: 'none' }} />
               <ModalBody>
                  <Formik
                     initialValues={{
                        name: userState?.name || '',
                        email: userState?.email || '',
                        gender: userState?.gender || '',
                        password: '',
                        c_password: '',
                     }}
                     onSubmit={handleSubmitFormik}
                     validationSchema={validationSchema}
                     enableReinitialize
                  >
                     {(props) => (
                        <Form>
                           <VStack spacing={5}>
                              <Image
                                 src={photoPrev || userState?.photo}
                                 fallbackSrc='https://via.placeholder.com/150'
                              />
                              <FormikControl
                                 control='input'
                                 name='name'
                                 label='Nama'
                                 color='text'
                                 required={true}
                              />
                              <FormikControl
                                 control='input'
                                 name='email'
                                 label='Email'
                                 color='text'
                                 type='email'
                                 required={true}
                              />
                              <FormikControl
                                 control='select'
                                 name='gender'
                                 label='Jenis Kelamin'
                                 color='text'
                                 placeholder='Pilih Jenis Kelamin'
                                 required={true}
                                 options={[
                                    {
                                       key: 0,
                                       value: 'L',
                                       name: 'Laki-laki',
                                    },
                                    { key: 1, value: 'P', name: 'Perempuan' },
                                 ]}
                              />
                              <FormikControl
                                 control='password'
                                 name='password'
                                 label='Password'
                                 color='text'
                              />

                              <FormikControl
                                 control='password'
                                 name='c_password'
                                 label='Konfirmasi Password'
                                 color='text'
                              />

                              <FormikControl
                                 control='photo'
                                 name='photo'
                                 label='Photo'
                                 color='text'
                                 onChange={handlePreviewPhoto}
                              />
                              <Text color='gray.400' w='60%' textAlign='center'>
                                 Kosongkan field password jika tidak ingin
                                 diganti
                              </Text>

                              <Button
                                 alignSelf='flex-end'
                                 variant='solid'
                                 bg='primary'
                                 color='white'
                                 type='submit'
                                 isLoading={props.isSubmitting}
                              >
                                 Update
                              </Button>
                           </VStack>
                        </Form>
                     )}
                  </Formik>
               </ModalBody>
            </ModalContent>
         </Modal>
      </Center>
   )
}

export default Profile
