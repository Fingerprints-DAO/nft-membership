'use client'

import { Box, GridItem, Link, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Grid from 'components/grid'
import TopUp from 'components/top-up'
import {
  OrderBookApi,
  OrderParameters,
  OrderQuoteSideKindBuy,
  OrderSigningUtils,
  SigningScheme,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { parseEther } from 'viem'
import { useWalletClient } from 'wagmi'
import { Signer } from 'ethers'

const chainId = 5 // Goerli chain

const orderBookApi = new OrderBookApi({ chainId })
// const subgraphApi = new SubgraphApi({ chainId })
const orderSigningUtils = new OrderSigningUtils()

const validTo = dayjs().add(30, 'minutes').unix()
const amountToBuy = BigNumber(5000)

const getQuote = async () => {
  return await orderBookApi.getQuote({
    kind: OrderQuoteSideKindBuy.BUY,
    sellToken: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6', // weth goerli
    buyToken: '0x91056d4a53e1faa1a84306d4deaec71085394bc8', // cow
    buyAmountAfterFee: parseEther(amountToBuy.toString()).toString(),
    from: '0x13d735A4D5E966b8F7B19Fc2f476BfC25c0fc7Dc',
    receiver: '0x13d735A4D5E966b8F7B19Fc2f476BfC25c0fc7Dc',
    validTo,
    signingScheme: SigningScheme.EIP1271,
    onchainOrder: true,
  })
}

const TopupPage = () => {
  const { data: walletClient, isError, isLoading } = useWalletClient()
  const [quote, setQuote] = useState<OrderParameters>()
  useEffect(() => {
    const init = async () => {
      const currentQuote = (await getQuote()).quote
      console.table(currentQuote)
      setQuote(currentQuote)
    }
    init()
  }, [])

  const onSign = useCallback(async () => {
    if (!quote || !walletClient) return
    const order = {
      ...quote,
      partiallyFillable: false,
      sellAmount: (Number(quote.sellAmount) * 1.05).toString(),
    } as UnsignedOrder

    const signedOrder = await OrderSigningUtils.signOrder(
      order,
      5,
      walletClient as unknown as Signer
    )
    console.table(signedOrder)
  }, [quote, walletClient])

  return (
    <Box as="section" pt={{ base: 14, md: '88px' }} pb={{ base: 10, md: 20 }}>
      <Grid>
        <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 6, md: 10 }}>
          <Text as="h1" fontSize="3xl" fontWeight="bold" mb={8}>
            Top up
          </Text>
          <Box bgColor={'white'}>
            {/* {test.triggered && (
              <Text color={'black'} as={'pre'}>
                <Text>Buy Amount: {formatToEtherStringBN(test.buyAmount)} $prints</Text>
                <Text>Sell Amount: {formatToEtherStringBN(test.sellAmount)} weth</Text>
                <Text>Fee: {formatToEtherStringBN(test.feeAmount)}</Text>
                <Text>validTo: {dayjs(Number(`${test.validTo}000`)).toString()}</Text>
              </Text>
            )} */}
            <TopUp
              printsBalance={{ formatted: '1000', value: BigNumber(1000) }}
              quote={quote}
              onSign={onSign}
            />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default TopupPage
