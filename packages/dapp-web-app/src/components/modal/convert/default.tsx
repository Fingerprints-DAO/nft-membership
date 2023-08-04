import { Box, Button, CloseButton, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { useMemo } from 'react'
import { Balance } from 'services/web3/prints/use-get-prints-balance'
import { pluralize } from 'utils/string'

export type Action = '' | 'top-up' | 'convert'

type ConvertDefaultProps = {
  printsBalance: Balance
  pricePerMembership: BigNumber
  onClose?: () => void
  onAction: (action: Action) => void
}

const ZERO = BigNumber(0.001) //TODO: check if this value is valid

const ConvertDefault = ({ printsBalance, pricePerMembership, onAction, onClose }: ConvertDefaultProps) => {
  const handleAction = (action: Action) => () => onAction(action)

  const nftsMintables = useMemo(() => {
    return printsBalance.value.div(pricePerMembership).decimalPlaces(0, BigNumber.ROUND_HALF_FLOOR)
  }, [printsBalance.value, pricePerMembership])

  const leftovers = useMemo(() => printsBalance.value.mod(pricePerMembership), [printsBalance, pricePerMembership])

  console.log('leftovers', leftovers.toFormat())

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
      {printsBalance.value.gt(ZERO) && (
        <>
          <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
            <Text color="gray.500" mb={1}>
              # of Membership NFTs mintable
            </Text>
            <Text color="gray.700" fontWeight="bold">
              {pluralize(nftsMintables.toNumber(), 'NFTs', 'NFT')}
            </Text>
          </Box>
          {leftovers.gt(ZERO) && (
            <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={10}>
              <Text color="gray.500" mb={1}>
                Leftover
              </Text>
              <Text color="gray.700" fontWeight="bold">
                {leftovers.toFormat(0)} $PRINTS
              </Text>
              <Text color="secondary.500" fontSize="xs" mt={4}>
                Top up your $PRINTS to a multiple of 5,000 for a full conversion.
              </Text>
            </Box>
          )}
        </>
      )}
      <Box>
        {printsBalance.value.lte(ZERO) ? (
          <Button as={Link} href="https://opensea.io" target="_blank" colorScheme="black" w="full" size="lg">
            Buy on OpenSea
          </Button>
        ) : (
          <>
            <Button colorScheme="secondary" w="full" size="lg" variant="outline" mb={6} onClick={handleAction('top-up')}>
              Top up $PRINTS
            </Button>
            <Button colorScheme="black" w="full" size="lg" onClick={handleAction('convert')}>
              Convert $PRINTS to NFT
            </Button>
          </>
        )}
      </Box>
    </>
  )
}

export default ConvertDefault
