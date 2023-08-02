import { Box, Button, CloseButton, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { Balance } from 'services/web3/prints/use-get-prints-balance'

export type Action = '' | 'top-up' | 'convert'

type ConvertDefaultProps = {
  printsBalance: Balance
  onClose?: () => void
  onAction: (action: Action) => void
}

const ConvertDefault = ({ printsBalance, onAction, onClose }: ConvertDefaultProps) => {
  const handleAction = (action: Action) => () => onAction(action)

  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Convert $PRINTS to Fingerprints membership NFT
        </Text>
        {!!onClose && <CloseButton color="gray.500" onClick={onClose} position="absolute" right={0} top={0} w="44px" h="44px" size="lg" />}
      </Box>
      <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
        <Text color="gray.500" mb={1}>
          Your $PRINTS balance
        </Text>
        <Text color="gray.700" fontWeight="bold">
          {printsBalance.formatted} $PRINTS
        </Text>
        {printsBalance.value.lte(BigNumber(0)) && (
          <Text fontSize="xs" color="secondary.500" mt={4}>
            You don&apos;t have any $PRINTS, which means you can acquire the NFT Membership directly on Opensea.
          </Text>
        )}
      </Box>
      {printsBalance.value.gte(BigNumber(0)) && (
        <>
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
        </>
      )}
      <Box>
        {printsBalance.value.lte(BigNumber(0)) ? (
          <Button as={Link} href="https://opensea.io" target="_blank" colorScheme="blackAlpha" w="full" size="lg">
            Buy on OpenSea
          </Button>
        ) : (
          <>
            <Button colorScheme="secondary" w="full" size="lg" variant="outline" mb={6} onClick={handleAction('top-up')}>
              Top up $PRINTS
            </Button>
            <Button colorScheme="blackAlpha" w="full" size="lg" onClick={handleAction('convert')}>
              Convert $PRINTS to NFT
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default ConvertDefault
