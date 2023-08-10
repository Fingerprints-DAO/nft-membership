import { ChevronDownIcon, ChevronUpIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import {
  OrderBookApi,
  OrderCreation,
  OrderParameters,
  OrderQuoteSideKindBuy,
  OrderSigningUtils,
  SigningScheme,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { useEthersSigner } from 'hooks/ethers'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Balance } from 'services/web3/prints/use-prints-get-balance'
import {
  formatBigNumberUp,
  formatToEtherString,
  formatToEtherStringBN,
  roundEtherUp,
} from 'utils/price'
import { parseEther } from 'viem'

const chainId = 5 // Goerli chain
const wethAddress = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
const printsAddress = '0x91056d4a53e1faa1a84306d4deaec71085394bc8'

const orderBookApi = new OrderBookApi({ chainId })
// const subgraphApi = new SubgraphApi({ chainId })

// const orderSigningUtils = new OrderSigningUtils()

const validTo = dayjs().add(30, 'minutes').unix()
const amountToBuy = BigNumber(28)

const getQuote = async () => {
  return await orderBookApi.getQuote({
    kind: OrderQuoteSideKindBuy.BUY,
    sellToken: wethAddress, // weth goerli
    buyToken: printsAddress, // cow
    buyAmountAfterFee: parseEther(amountToBuy.toString()).toString(),
    from: '0x13d735A4D5E966b8F7B19Fc2f476BfC25c0fc7Dc',
    receiver: '0x13d735A4D5E966b8F7B19Fc2f476BfC25c0fc7Dc',
    validTo,
    signingScheme: SigningScheme.EIP1271,
    onchainOrder: true,
  })
}

function formatExpirationTime(validTo?: number) {
  if (!validTo) return ''
  const expirationTime = dayjs.unix(validTo)
  const now = dayjs()
  const diffMinutes: number = expirationTime.diff(now, 'minute')

  if (diffMinutes < 60) {
    return `${diffMinutes}min`
  } else {
    const diffHours: number = Math.floor(diffMinutes / 60)
    const remainingMinutes: number = diffMinutes % 60
    if (remainingMinutes === 0) {
      return `${diffHours}h`
    } else {
      return `${diffHours}h${remainingMinutes}min`
    }
  }
}

type TopUpProps = {
  printsBalance: Balance
  onClose?: () => void
}

const TopUp = ({ printsBalance, onClose }: TopUpProps) => {
  const [loadingQuote, setLoadingQuote] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [quote, setQuote] = useState<OrderParameters>()
  const signer = useEthersSigner()
  const intervalIDRef = useRef<null | ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    const init = async () => {
      setLoadingQuote(true)
      const currentQuote = (await getQuote()).quote
      console.table(currentQuote)
      setQuote(currentQuote)
      setLoadingQuote(false)
    }
    init()
    intervalIDRef.current = setInterval(init, 30000)
    return () => {
      if (intervalIDRef.current) clearInterval(intervalIDRef.current)
      intervalIDRef.current = null
    }
  }, [])

  const onSign = useCallback(async () => {
    if (!quote || !signer) return
    const order = {
      ...quote,
      partiallyFillable: false,
      sellAmount: (Number(quote.sellAmount) * 1.05).toString(),
    } as UnsignedOrder

    const signedOrder = await OrderSigningUtils.signOrder(order, 5, signer)
    const orderId = await orderBookApi.sendOrder({
      ...order,
      ...signedOrder,
    } as unknown as OrderCreation)

    console.log(orderBookApi.getOrderLink(orderId)) // https://explorer.cow.fi/goerli/orders/${orderId}
  }, [quote, signer])

  return (
    <Box bgColor={'white'}>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Buy $PRINTS
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
      <Box borderColor="gray.100" borderWidth={1} borderRadius="8px" p={4} mb={10}>
        <Flex>
          <Text color="gray.500" mb={1} mr={2}>
            You are buying
          </Text>
          <Tooltip
            label={
              <Text>
                You could end up paying more than this amount due to pool slippage. Click details
                for more information.
              </Text>
            }
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
            {formatToEtherStringBN(quote?.buyAmount)} $PRINTS{' '}
            <Text as="span" fontWeight="normal">
              for
            </Text>{' '}
            {roundEtherUp(formatToEtherString(quote?.sellAmount).toString(), 5)} WETH
          </Text>
          {loadingQuote && <Spinner color="gray.400" size="sm" ml={2} />}
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
                {formatExpirationTime(quote?.validTo)}
              </Text>
            </Text>
            <Text color="gray.500">
              Maximum input:{' '}
              <Text as="span" color="gray.700">
                {formatBigNumberUp(formatToEtherString(quote?.sellAmount).multipliedBy(1.05), 5)}{' '}
                WETH
              </Text>
            </Text>
            <Text color="gray.500">
              Network fees:{' '}
              <Text as="span" color="gray.700">
                {formatBigNumberUp(formatToEtherString(quote?.feeAmount), 12)} ETH
              </Text>
            </Text>
          </Box>
        </Collapse>
      </Box>
      <Button colorScheme="black" w="full" size="lg" onClick={onSign}>
        Approve WETH on CoW Swap
      </Button>
      {/* <Button colorScheme="black" w="full" size="lg" onClick={onSign}>
        Buy 3.000 $PRINTS
      </Button> */}
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
          CoW Swap
        </Link>
        .
      </Text>
    </Box>
  )
}

export default TopUp
