import { ChevronDownIcon, ChevronUpIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Flex,
  Icon,
  Link,
  Skeleton,
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
import { hardhat } from '@wagmi/chains'
import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import dayjs from 'dayjs'
import { useEthersSigner } from 'hooks/ethers'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Balance } from 'services/web3/prints/use-prints-get-balance'
import useWETHApprove from 'services/web3/weth/use-weth-approve'
import useWETHGetAllowance from 'services/web3/weth/use-weth-get-allowance'
import { getChainId } from 'utils/chain'
import { goerli } from 'utils/goerli-chain'
import {
  formatBigNumberUp,
  formatToEtherString,
  formatToEtherStringBN,
  roundEtherUp,
} from 'utils/price'
import { parseEther } from 'viem'

let chainId = getChainId()
chainId = chainId === hardhat.id ? 5 : chainId

const orderBookApi = new OrderBookApi({ chainId })
// const subgraphApi = new SubgraphApi({ chainId })
// const orderSigningUtils = new OrderSigningUtils()

const amountToBuy = BigNumber(28)

const getQuote = async (walletAddress: string, wethAddress: string, printsAddress: string) => {
  let forceConfig: { buyToken?: string; buyAmountAfterFee?: string } = {}
  const validTo = dayjs().add(30, 'minutes').unix()

  if (chainId === goerli.id || chainId === hardhat.id) {
    // cow token
    forceConfig.buyToken = '0x91056d4a53e1faa1a84306d4deaec71085394bc8'
    // 28 tokens ~0.01 weth on goerli
    forceConfig.buyAmountAfterFee = parseEther(BigNumber(28).toString()).toString()
  }
  return await orderBookApi.getQuote({
    kind: OrderQuoteSideKindBuy.BUY,
    sellToken: wethAddress, // weth goerli
    buyToken: printsAddress, // cow
    buyAmountAfterFee: parseEther(amountToBuy.toString()).toString(),
    from: walletAddress,
    receiver: walletAddress,
    validTo,
    signingScheme: SigningScheme.EIP1271,
    onchainOrder: true,
    ...forceConfig,
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

enum TOP_UP_STATUS {
  LOADING,
  NEED_APPROVAL,
  NEED_SIGN,
  ORDER_WAITING,
  ORDER_SUCCESS,
}

const slippage = 0.05

const TopUp = ({ printsBalance, onClose }: TopUpProps) => {
  const [loadingQuote, setLoadingQuote] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [status, setStatus] = useState<TOP_UP_STATUS>(TOP_UP_STATUS.LOADING)
  const [quote, setQuote] = useState<OrderParameters>()
  const { address, contracts } = useNftMembershipContext()
  const { value: wethAllowed } = useWETHGetAllowance()
  const wethApprove = useWETHApprove(wethAllowed)
  const signer = useEthersSigner()
  const intervalIDRef = useRef<null | ReturnType<typeof setInterval>>(null)

  console.log(wethAllowed.toString())
  useEffect(() => {
    const init = async () => {
      if (!address || !contracts.ERC20.address || !contracts.WETH.address) return

      setLoadingQuote(true)

      const currentQuote = (
        await getQuote(address, contracts.WETH.address, contracts.ERC20.address)
      ).quote
      console.table(currentQuote)
      setQuote(currentQuote)
      setLoadingQuote(false)
    }

    init()
    if (!intervalIDRef.current) intervalIDRef.current = setInterval(init, 30000)
    return () => {
      if (intervalIDRef.current) clearInterval(intervalIDRef.current)
      intervalIDRef.current = null
    }
  }, [address, contracts.ERC20.address, contracts.WETH.address])

  useEffect(() => {
    if (!quote?.sellAmount) return

    if (wethAllowed.lt(quote.sellAmount)) {
      setStatus(TOP_UP_STATUS.NEED_APPROVAL)
      return
    }

    setStatus(TOP_UP_STATUS.NEED_SIGN)
  }, [quote?.sellAmount, wethAllowed])

  const onSign = useCallback(async () => {
    if (!quote || !signer) return
    const order = {
      ...quote,
      sellAmount: (Number(quote.sellAmount) * (1 + slippage)).toString(),
      partiallyFillable: false,
    } as UnsignedOrder

    const signedOrder = await OrderSigningUtils.signOrder(order, chainId, signer)
    const orderId = await orderBookApi.sendOrder({
      ...order,
      ...signedOrder,
    } as unknown as OrderCreation)

    setStatus(TOP_UP_STATUS.ORDER_WAITING)
    console.log(orderBookApi.getOrderLink(orderId)) // https://explorer.cow.fi/goerli/orders/${orderId}
  }, [quote, signer])

  const onApproveWETH = useCallback(async () => {
    if (!quote?.sellAmount) return

    const roundedWethToApprove = BigNumber(
      parseEther(
        formatBigNumberUp(
          formatToEtherString((Number(quote?.sellAmount) * (1 + slippage)).toString()),
          5
        ),
        'wei'
      ).toString()
    )
    console.log(roundedWethToApprove.toString())
    wethApprove.approve(roundedWethToApprove)
  }, [quote?.sellAmount, wethApprove])

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
      <Skeleton isLoaded={status !== TOP_UP_STATUS.LOADING && !loadingQuote}>
        {status === TOP_UP_STATUS.NEED_APPROVAL && (
          <Button
            colorScheme="black"
            w="full"
            size="lg"
            onClick={onApproveWETH}
            isLoading={wethApprove.isLoading}
            loadingText={wethApprove.txHash ? 'Waiting transaction' : 'Confirm the transaction'}
          >
            Approve WETH on CoW Swap
          </Button>
        )}

        {status !== TOP_UP_STATUS.NEED_APPROVAL && (
          <Button
            colorScheme="black"
            w="full"
            size="lg"
            onClick={onSign}
            isLoading={status === TOP_UP_STATUS.ORDER_WAITING}
            loadingText={wethApprove.txHash ? 'Waiting transaction' : 'Sign the order'}
          >
            Buy 3.000 $PRINTS
          </Button>
        )}
      </Skeleton>
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
