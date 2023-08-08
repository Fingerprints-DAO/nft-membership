import { Box, Button, CloseButton, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { Balance } from 'services/web3/prints/use-prints-get-balance'
import { pluralize } from 'utils/string'

export type Action = '' | 'top-up' | 'convert'

type ConvertDefaultProps = {
  printsBalance: Balance
  nftsMintables: number
  leftovers: BigNumber
  onClose?: () => void
  onAction: (action: Action) => void
}

const ConvertDefault = ({
  printsBalance,
  nftsMintables,
  leftovers,
  onAction,
  onClose,
}: ConvertDefaultProps) => {
  const handleAction = (action: Action) => () => onAction(action)

  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Convert $PRINTS to Fingerprints membership NFT
        </Text>
        {!!onClose && (
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
        )}
      </Box>
      <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
        <Text color="gray.500" mb={1}>
          Your $PRINTS balance
        </Text>
        <Text color="gray.700" fontWeight="bold">
          {printsBalance.formatted} $PRINTS
        </Text>
        {printsBalance.value.lte(0) && (
          <Text fontSize="xs" color="secondary.500" mt={4}>
            You don&apos;t have any $PRINTS, which means you can acquire the NFT Membership directly
            on Opensea.
          </Text>
        )}
      </Box>
      {printsBalance.value.gt(0) && (
        <>
          <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={4}>
            <Text color="gray.500" mb={1}>
              # of Membership NFTs mintable
            </Text>
            <Text color="gray.700" fontWeight="bold">
              {pluralize(nftsMintables, 'NFTs', 'NFT')}
            </Text>
          </Box>
          {leftovers.gt(0) && (
            <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={10}>
              <Text color="gray.500" mb={1}>
                Leftover
              </Text>
              <Text color="gray.700" fontWeight="bold">
                {leftovers.toFormat()} $PRINTS
              </Text>
              <Text color="secondary.500" fontSize="xs" mt={4}>
                Top up your $PRINTS to a multiple of 5,000 for a full conversion.
              </Text>
            </Box>
          )}
        </>
      )}
      <Box>
        {printsBalance.value.lte(0) && (
          <Button
            as={Link}
            href="https://opensea.io"
            target="_blank"
            colorScheme="black"
            w="full"
            size="lg"
          >
            Buy on OpenSea
          </Button>
        )}
        {leftovers.gt(0) && (
          <Button
            colorScheme="secondary"
            w="full"
            size="lg"
            variant="outline"
            mb={6}
            onClick={handleAction('top-up')}
          >
            Top up $PRINTS
          </Button>
        )}

        {printsBalance.value.gt(0) && (
          <Button colorScheme="black" w="full" size="lg" onClick={handleAction('convert')}>
            Convert $PRINTS to NFT
          </Button>
        )}
      </Box>
    </>
  )
}

export default ConvertDefault
