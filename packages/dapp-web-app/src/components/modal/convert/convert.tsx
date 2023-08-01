import { Text, Box, Flex, CloseButton } from '@chakra-ui/react'

type ConvertProps = {
  onClose?: () => void
}

const Convert = ({ onClose }: ConvertProps) => {
  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Confirm mint in your wallet
        </Text>
        {!!onClose && <CloseButton color="gray.500" onClick={onClose} position="absolute" right={0} top={0} w="44px" h="44px" size="lg" />}
      </Box>
      <Flex alignItems="flex-start" flexWrap="wrap" mb={6} pb={6} borderBottom="1px" borderBottomColor="gray.300">
        <Flex alignItems="center" justifyContent="center" border={2} borderStyle="solid" borderColor="gray.500" rounded="full" mr={6} w={8} h={8}>
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            1
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm approval of 10,000 $PRINTS for transaction
          </Text>
          <Text color="gray.500">Waiting for approval...</Text>
        </Box>
      </Flex>
      <Flex alignItems="flex-start" flexWrap="wrap">
        <Flex alignItems="center" justifyContent="center" border={2} borderStyle="solid" borderColor="gray.500" rounded="full" mr={6} w={8} h={8}>
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            2
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm the conversion of $PRINTS to membership NFT
          </Text>
        </Box>
      </Flex>
    </>
  )
}

export default Convert
