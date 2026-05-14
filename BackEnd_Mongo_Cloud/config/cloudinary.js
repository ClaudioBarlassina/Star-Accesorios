import { v2 as cloudinary } from 'cloudinary'

cloudinary.config()
console.log('Cloudinary URL:', process.env.CLOUDINARY_URL)

cloudinary.api.ping((error, result) => {
  console.log('Cloudinary:', { error, result })
  if (error) {
    console.log('❌ Cloudinary NO conectado')
  } else {
    console.log('✅ Cloudinary conectado:', result.status)
  }
})

export default cloudinary
