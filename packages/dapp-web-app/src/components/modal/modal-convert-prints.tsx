import { CloseButton, Modal, ModalContent, ModalHeader, ModalOverlay, Text, Box, Button } from '@chakra-ui/react'
import { ModalProps } from 'contexts/modal'
import useMediaQuery from 'hooks/use-media-query'
import useGetPrintsBalance from 'services/web3/prints/use-get-prints-balance'

const ModalConvertPrints = ({ isOpen, onClose }: ModalProps) => {
  const printsBalance = useGetPrintsBalance()
  const [isMobile] = useMediaQuery('(max-width: 479px)')

  console.log('printsBalance', printsBalance)

  return (
    <Modal
      isCentered={true}
      isOpen={isOpen}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={onClose}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        bg="white"
        position={['fixed', 'unset']}
        bottom={['0px', 'unset']}
        mb={['0', 'auto']}
        borderRadius={['1rem 1rem 0 0', '1rem']}
        maxW={['lg', '438px']}
        px={4}
        py={6}
      >
        <ModalHeader position="relative" py="13px" mb={7}>
          <Text fontSize="lg" color="gray.900" textAlign="center" lineHeight="24px">
            Convert $PRINTS to <br />
            Fingerprints membership <br />
            NFT
          </Text>
          <CloseButton color="gray.500" onClick={onClose} position="absolute" right={0} top={0} w="44px" h="44px" size="lg" />
        </ModalHeader>
        <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
          <Text color="gray.500" mb={1}>
            Your $PRINTS balance
          </Text>
          <Text color="gray.700" fontWeight="bold">
            12,000 $PRINTS
          </Text>
        </Box>
        <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
          <Text color="gray.500" mb={1}>
            # of Membership NFTs mintable
          </Text>
          <Text color="gray.700" fontWeight="bold">
            2 NFTs
          </Text>
        </Box>
        <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={10}>
          <Text color="gray.500" mb={1}>
            Leftover
          </Text>
          <Text color="gray.700" fontWeight="bold">
            2,000 $PRINTS
          </Text>
          <Text color="secondary.500" fontSize="xs" mt={4}>
            Top up your $PRINTS to a multiple of 5,000 for a full conversion.
          </Text>
        </Box>
        <Box>
          <Button colorScheme="secondary" w="full" size="lg" variant="outline" mb={6}>
            Top up $PRINTS
          </Button>
          <Button colorScheme="blackAlpha" w="full" size="lg">
            Convert $PRINTS to NFT
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default ModalConvertPrints
