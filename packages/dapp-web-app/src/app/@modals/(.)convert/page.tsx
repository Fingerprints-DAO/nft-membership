'use client'

import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import ConvertPrints from 'components/modal/convert'
import useMediaQuery from 'hooks/use-media-query'
import { useRouter } from 'next/navigation'

const ConvertPrintsPage = () => {
  const { back } = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 479px)')

  return (
    <Modal
      isCentered={true}
      isOpen={true}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={back}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        bg="white"
        position={['fixed', 'unset']}
        bottom={['0px', 'unset']}
        mb={['0', 'auto']}
        borderRadius={['1rem 1rem 0 0', '1rem']}
        maxW={['lg', '438px']}
        p={6}
      >
        <ConvertPrints isOpen={true} onClose={back} />
      </ModalContent>
    </Modal>
  )
}

export default ConvertPrintsPage
