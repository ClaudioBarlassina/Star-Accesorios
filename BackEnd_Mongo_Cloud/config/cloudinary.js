import { v2 as cloudinary } from 'cloudinary'

cloudinary.config()

cloudinary.api.ping((error, result) => {
  if (error) {
    console.log('Cloudinary NO conectado')
  }
})

export default cloudinary
