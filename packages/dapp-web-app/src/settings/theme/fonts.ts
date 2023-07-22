import { Theme } from '@chakra-ui/react'
import localFont from 'next/font/local'

const helvetica = localFont({
  src: [
    {
      path: '../../../public/fonts/helvetica-light.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/helvetica.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/helvetica-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

const fonts: Partial<Theme['fonts']> = {
  body: helvetica.style.fontFamily,
  heading: helvetica.style.fontFamily,
}

export default fonts
