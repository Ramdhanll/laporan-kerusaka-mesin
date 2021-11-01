import cloudinary from 'cloudinary'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
   cloud_name: 'cloud_name',
   api_key: 'api_key',
   api_secret: 'api_secret',
   secure: true,
})

export default cloudinaryV2
