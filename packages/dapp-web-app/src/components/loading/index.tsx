import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import logoFP from '/public/images/animated-logo.gif'

const Loading = ({ full = false }) => (
  <Box
    w={full ? '100vw' : '100%'}
    h={full ? '100vh' : '100%'}
    display={'flex'}
    justifyContent={'center'}
    alignItems={'center'}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Image src={logoFP} alt="FP`s logo used as loading" width={80} priority />
    </motion.div>
  </Box>
)

export default Loading
