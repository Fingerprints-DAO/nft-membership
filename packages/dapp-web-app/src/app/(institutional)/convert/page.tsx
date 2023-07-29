'use client'

import { Box } from '@chakra-ui/react'
import ConvertPrints from 'components/modal/convert'

const ConvertPrintsPage = () => {
  return (
    <Box bg="white" borderRadius="1rem" maxW={['90%', '438px']} p={6} mx="auto" my={10}>
      <ConvertPrints isOpen={true} />
    </Box>
  )
}

export default ConvertPrintsPage
