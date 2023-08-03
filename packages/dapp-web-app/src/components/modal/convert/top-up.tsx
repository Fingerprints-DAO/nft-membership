import { ChevronDownIcon, ChevronUpIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, Button, CloseButton, Collapse, Flex, Icon, Link, Spinner, Text, Tooltip } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { Balance } from 'services/web3/prints/use-get-prints-balance'

type TopUpProps = {
  printsBalance: Balance
  onClose?: () => void
}

const TopUp = ({ printsBalance, onClose }: TopUpProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Buy $PRINTS
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
      <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={10}>
        <Flex>
          <Text color="gray.500" mb={1} mr={2}>
            You are buying
          </Text>
          <Tooltip
            label={<Text>You could end up paying more than this amount due to pool slippage. Click details for more information.</Text>}
            fontSize="xs"
            color="gray.900"
            textAlign="left"
            placement="top"
            hasArrow={true}
            arrowSize={8}
            px={4}
            py={2}
            maxW="260px"
          >
            <span>
              <Icon as={InfoOutlineIcon} color="gray.500" boxSize="14px" />
            </span>
          </Tooltip>
        </Flex>
        <Flex alignItems="center" mb={4}>
          <Text color="gray.700" fontWeight="bold">
            3,000 $PRINTS{' '}
            <Text as="span" fontWeight="normal">
              for
            </Text>{' '}
            0.4 ETH
          </Text>
          <Spinner color="gray.400" size="sm" ml={2} />
        </Flex>
        <Text color="gray.500" fontWeight="bold" mb={4}>
          You&apos;ll be able to mint 3 NFTs
        </Text>
        <Button color="links.500" variant="link" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          {isDetailsOpen ? <ChevronUpIcon w={6} h={6} /> : <ChevronDownIcon w={6} h={6} />}
          {isDetailsOpen ? 'Less' : 'Details'}
        </Button>
        <Collapse in={isDetailsOpen} animateOpacity>
          <Box>
            <Text color="gray.500">
              Max slippage:{' '}
              <Text color="gray.700" as="span">
                0.50%
              </Text>
            </Text>
            <Text color="gray.500">
              Transaction deadline:{' '}
              <Text color="gray.700" as="span">
                30 min
              </Text>
            </Text>
            <Text color="gray.500">
              Maximum input:{' '}
              <Text as="span" color="gray.700">
                0.41 ETH
              </Text>
            </Text>
            <Text color="gray.500">
              Network fees:{' '}
              <Text as="span" color="gray.700">
                ~$3.06
              </Text>
            </Text>
          </Box>
        </Collapse>
      </Box>
      <Button colorScheme="black" w="full" size="lg" onClick={() => null}>
        Buy 3.000 $PRINTS
      </Button>
      <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
        You can also do this transaction using{' '}
        <Link
          color="links.500"
          title="UniSwap"
          href="https://uniswap.org/"
          target="_blank"
          style={{ textDecoration: 'none' }}
          transition="opacity 0.2s"
          _hover={{ opacity: 0.5 }}
        >
          UniSwap
        </Link>
        .
      </Text>
    </>
  )
}

export default TopUp
