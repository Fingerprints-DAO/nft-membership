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
  OrderCreation,
  OrderParameters,
  OrderSigningUtils,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk'
import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { useEthersSigner } from 'hooks/ethers'
import useTxToast from 'hooks/use-tx-toast'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Balance } from 'services/web3/prints/use-prints-get-balance'
import useCowOrderWatch from 'services/web3/weth/use-cow-order-watch'
import useWETHApprove from 'services/web3/weth/use-weth-approve'
import useWETHGetAllowance from 'services/web3/weth/use-weth-get-allowance'
import useWETHGetBalance from 'services/web3/weth/use-weth-get-balance'
import {
  formatBigNumberUp,
  formatToEtherString,
  formatToEtherStringBN,
  roundEtherUp,
} from 'utils/price'
import { parseEther } from 'viem'
import {
  slippage,
  getQuote,
  quoteTimeInterval,
  chainId,
  orderBookApi,
  chainName,
  formatExpirationTime,
  TOP_UP_STATUS,
} from './top-up-config'

type TopUpProps = {
  printsBalance: Balance
  onClose: () => void
  amount: BigNumber
  ableToMint: number
}

const TopUp = ({ printsBalance, onClose, amount, ableToMint = 1 }: TopUpProps) => {
  const [loadingQuote, setLoadingQuote] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [status, setStatus] = useState<TOP_UP_STATUS>(TOP_UP_STATUS.LOADING)
  const [quote, setQuote] = useState<OrderParameters>()
  const [swapLink, setSwapLink] = useState<string>()
  const { showTxErrorToast } = useTxToast()
  const { address, contracts } = useNftMembershipContext()
  const { value: wethAllowed, refetch: refetchAllowance } = useWETHGetAllowance()
  const wethApprove = useWETHApprove(wethAllowed)
  const wethBalance = useWETHGetBalance()
  const signer = useEthersSigner()
  const cowOrderWatch = useCowOrderWatch()
  const intervalIDRef = useRef<null | ReturnType<typeof setInterval>>(null)
  const sellAmountExpected = useMemo(
    () => Number(quote?.sellAmount ?? '0') * (1 + slippage),
    [quote?.sellAmount]
  )
  const isWethInsufficient = useMemo(
    () => BigNumber(parseEther(wethBalance.formatted).toString()).lte(sellAmountExpected),
    [sellAmountExpected, wethBalance.formatted]
  )

  // @dev fetchQuote and start pooling
  useEffect(() => {
    const fetchQuote = async () => {
      if (
        !address ||
        !contracts.ERC20.address ||
        !contracts.WETH.address ||
        status !== TOP_UP_STATUS.LOADING
      )
        return

      setLoadingQuote(true)

      const currentQuote = (
        await getQuote(address, contracts.WETH.address, contracts.ERC20.address, amount)
      ).quote
      // console.table(currentQuote)
      setQuote(currentQuote)
      setLoadingQuote(false)
    }

    fetchQuote()
    if (!intervalIDRef.current) intervalIDRef.current = setInterval(fetchQuote, quoteTimeInterval)
    return () => {
      if (intervalIDRef.current) clearInterval(intervalIDRef.current)
      intervalIDRef.current = null
    }
  }, [address, amount, contracts.ERC20.address, contracts.WETH.address, status])

  // @dev handle modal steps - Approva/Sign
  useEffect(() => {
    if (
      !sellAmountExpected ||
      status === TOP_UP_STATUS.ORDER_WAITING ||
      status === TOP_UP_STATUS.SIGN_WAITING
    )
      return

    if (wethAllowed.lt(sellAmountExpected)) {
      setStatus(TOP_UP_STATUS.NEED_APPROVAL)
      return
    }

    setStatus(TOP_UP_STATUS.NEED_SIGN)
  }, [sellAmountExpected, status, wethAllowed])

  // @dev refetch allowance after approval
  useEffect(() => {
    if (wethApprove.isApproved && refetchAllowance) {
      // console.log('refetching')
      refetchAllowance()
    }
  }, [refetchAllowance, wethApprove.isApproved])

  // @dev handle cow order success
  useEffect(() => {
    if (cowOrderWatch.success) {
      setStatus(TOP_UP_STATUS.ORDER_SUCCESS)
      onClose()
      return
    }
  }, [cowOrderWatch.success, onClose])

  const onSign = useCallback(async () => {
    if (!quote || !signer) return
    setStatus(TOP_UP_STATUS.SIGN_WAITING)

    try {
      const order = {
        ...quote,
        sellAmount: sellAmountExpected.toString(),
        partiallyFillable: false,
      } as UnsignedOrder

      const signedOrder = await OrderSigningUtils.signOrder(order, chainId(), signer)

      const orderId = await orderBookApi.sendOrder({
        ...order,
        ...signedOrder,
      } as unknown as OrderCreation)
      // console.log('orderId', orderId)
      // console.log(
      //   orderBookApi.getOrderLink(orderId),
      //   `https://explorer.cow.fi/${chainName.toLowerCase()}/orders/${orderId}`
      // ) // https://explorer.cow.fi/goerli/orders/${orderId}
      setSwapLink(`https://explorer.cow.fi/${chainName().toLowerCase()}/orders/${orderId}`) // https://explorer.cow.fi/goerli/orders/${orderId}
      cowOrderWatch.setOrder(orderId, chainName())

      setStatus(TOP_UP_STATUS.ORDER_WAITING)
    } catch (error: any) {
      // console.log(error.toString())
      setStatus(TOP_UP_STATUS.NEED_SIGN)
      showTxErrorToast(new Error('Signature error. Try again.'))
    }
  }, [quote, signer, sellAmountExpected, cowOrderWatch, showTxErrorToast])

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
            <Skeleton
              as={'span'}
              display={'inline'}
              isLoaded={!loadingQuote}
              startColor={'gray.100'}
            >
              {roundEtherUp(formatToEtherString(quote?.sellAmount).toString(), 5)}
            </Skeleton>{' '}
            WETH
          </Text>
          {loadingQuote && <Spinner color="gray.400" size="sm" ml={2} />}
        </Flex>
        <Text color="gray.500" fontWeight="bold" mb={4}>
          You&apos;ll be able to mint {ableToMint} NFTs
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
              Estimated network fees:{' '}
              <Text as="span" color="gray.700">
                {formatBigNumberUp(formatToEtherString(quote?.feeAmount), 12)} ETH
              </Text>
            </Text>
          </Box>
        </Collapse>
      </Box>
      {/* <Skeleton isLoaded={status !== TOP_UP_STATUS.LOADING && !loadingQuote}> */}
      {!loadingQuote && (
        <>
          {status === TOP_UP_STATUS.NEED_APPROVAL && (
            <Button
              colorScheme="black"
              w="full"
              size="lg"
              onClick={onApproveWETH}
              isLoading={wethApprove.isLoading || loadingQuote}
              loadingText={wethApprove.txHash ? 'Waiting transaction' : 'Confirm the transaction'}
              isDisabled={isWethInsufficient}
            >
              {isWethInsufficient ? 'Insufficient WETH' : 'Allow CoW to use WETH'}
            </Button>
          )}

          {status !== TOP_UP_STATUS.NEED_APPROVAL && (
            <Button
              colorScheme="black"
              w="full"
              size="lg"
              onClick={onSign}
              isLoading={
                status === TOP_UP_STATUS.SIGN_WAITING ||
                status === TOP_UP_STATUS.ORDER_WAITING ||
                loadingQuote
              }
              loadingText={swapLink ? 'Waiting order transaction' : 'Sign the order'}
            >
              Buy 3.000 $PRINTS
            </Button>
          )}
        </>
      )}

      {loadingQuote && (
        <Button
          colorScheme="black"
          w="full"
          size="lg"
          onClick={onSign}
          isLoading={true}
          loadingText={'Fetching quote'}
        >
          Fetching quote
        </Button>
      )}
      {/* </Skeleton> */}
      {/* <Text color="black">
        {status}
        <br />
        {TOP_UP_STATUS.ORDER_WAITING}
        <br />
        {swapLink}
        <br />
        {status === TOP_UP_STATUS.ORDER_WAITING && swapLink}
      </Text> */}
      {status === TOP_UP_STATUS.ORDER_WAITING && swapLink && (
        <Text fontSize="sm" color="gray.500" textAlign="center" mt={6}>
          Check out the CoW Swap order status{' '}
          <Link
            color="links.500"
            title="Order link"
            href={swapLink}
            target="_blank"
            fontWeight={'bold'}
          >
            here
          </Link>
          .
        </Text>
      )}
      {status !== TOP_UP_STATUS.ORDER_WAITING && (
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={6}>
          {isWethInsufficient ? 'Wrap your ETH using ' : 'You can also do this transaction using '}
          <Link
            color="links.500"
            title="UniSwap"
            href={
              isWethInsufficient
                ? 'https://swap.cow.fi/#/1/swap/ETH/WETH?exactField=output&exactAmount=5000'
                : 'https://swap.cow.fi/#/1/swap/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/0x4dd28568D05f09b02220b09C2cb307bFd837cb95?exactField=output&exactAmount=5000'
            }
            target="_blank"
            style={{ textDecoration: 'none' }}
            transition="opacity 0.2s"
            _hover={{ opacity: 0.5 }}
          >
            CoW Swap
          </Link>
          .
          {!isWethInsufficient && (
            <>
              <br />
              $PRINTS address: 0x4dd28568D05f09b02220b09C2cb307bFd837cb95
            </>
          )}
        </Text>
      )}
    </Box>
  )
}

export default TopUp
