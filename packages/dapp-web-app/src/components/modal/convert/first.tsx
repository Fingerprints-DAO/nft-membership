import { CloseButton, Text, Box, Button } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import usePrintsGetBalance from 'services/web3/prints/use-prints-get-balance'
import { parseAmountToDisplay } from 'utils/number'

type ConvertFirstStepProps = {
  onConvert: () => void
  onClose?: () => void
}

const ZERO = BigNumber(parseAmountToDisplay(BigInt(0)))

const ConvertFirstStep = ({ onConvert, onClose }: ConvertFirstStepProps) => {
  const printsBalance = usePrintsGetBalance()

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
        {printsBalance.value.lte(ZERO) && (
          <Text fontSize="xs" color="secondary.500" mt={4}>
            You don&apos;t have any $PRINTS, which means you can acquire the NFT Membership directly on Opensea.
          </Text>
        )}
      </Box>
      {printsBalance.value.gte(ZERO) && (
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
        {printsBalance.value.lte(ZERO) ? (
          <Button as={Link} href="https://opensea.io" target="_blank" colorScheme="black" w="full" size="lg">
            Buy on OpenSea
          </Button>
        ) : (
          <>
            <Button colorScheme="secondary" w="full" size="lg" variant="outline" mb={6}>
              Top up $PRINTS
            </Button>
            <Button colorScheme="black" w="full" size="lg" onClick={onConvert}>
              Convert $PRINTS to NFT
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default ConvertFirstStep
