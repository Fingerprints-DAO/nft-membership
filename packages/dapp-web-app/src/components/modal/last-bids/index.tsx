'use client'

import { Box, CloseButton, Modal, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import useMediaQuery from 'hooks/use-media-query'

type LastBidsProps = {
  onClose: () => void
}

const LastBids = ({ onClose }: LastBidsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 479px)')

  return (
    <Modal
      isCentered={true}
      isOpen={true}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={onClose}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        bg="white"
        position={{ base: 'fixed', sm: 'unset' }}
        bottom={{ base: '0px', sm: 'unset' }}
        mb={{ base: '0', sm: 'auto' }}
        borderRadius={{ base: '1rem 1rem 0 0', sm: '1rem' }}
        maxW={{ base: 'lg', sm: '438px' }}
        p={6}
      >
        <Box position="relative" py="13px" mb={7}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.900"
            textAlign="center"
            lineHeight="24px"
          >
            Bid history
          </Text>
          <CloseButton
            color="gray.500"
            onClick={onClose}
            position="absolute"
            right={0}
            top={0}
            w="44px"
            h="44px"
            size="lg"
          />
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default LastBids
