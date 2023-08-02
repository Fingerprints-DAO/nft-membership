'use client'

import { Box, GridItem, Link, Text } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import Grid from 'components/grid'
import TopUp from 'components/top-up'
import {
  OrderBookApi,
  OrderQuoteSide,
  OrderSigningUtils,
  SigningScheme,
} from '@cowprotocol/cow-sdk'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { formatToEtherString } from 'utils/price'
import { ethers } from 'ethers'

const chainId = 1 // Goerli chain

const orderBookApi = new OrderBookApi({ chainId })
// const subgraphApi = new SubgraphApi({ chainId })
const orderSigningUtils = new OrderSigningUtils()

const validTo = dayjs().add(30, 'minutes').unix()
const amountToBuy = BigNumber(5000)

const getQuote = async () => {
  return await orderBookApi.getQuote({
    kind: 'buy' as OrderQuoteSide.kind,
    sellToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    buyToken: '0x4dd28568d05f09b02220b09c2cb307bfd837cb95',
    buyAmountAfterFee: ethers.parseEther(amountToBuy.toString()).toString(),
    from: '0x13d735A4D5E966b8F7B19Fc2f476BfC25c0fc7Dc',
    validTo,
    signingScheme: SigningScheme.EIP1271,
    onchainOrder: true,
  })
}

const TopupPage = () => {
  const [test, setTest] = useState({
    sellToken: '',
    buyToken: '',
    validTo: 0,
    buyAmount: '',
    sellAmount: '',
    feeAmount: '',
    triggered: false,
  })
  useEffect(() => {
    const init = async () => {
      const {
        sellToken,
        buyToken,
        validTo,
        buyAmount,
        sellAmount,
        receiver,
        feeAmount,
      } = (await getQuote()).quote
      console.table({
        sellToken,
        buyToken,
        validTo,
        buyAmount,
        sellAmount,
        receiver,
        feeAmount,
      })
      setTest({
        sellToken,
        buyToken,
        validTo,
        buyAmount,
        sellAmount,
        feeAmount,
        triggered: true,
      })
    }
    init()
  }, [])

  return (
    <Box as="section" pt={{ base: 14, md: '88px' }} pb={{ base: 10, md: 20 }}>
      <Grid>
        <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 6, md: 10 }}>
          <Text as="h1" fontSize="3xl" fontWeight="bold" mb={8}>
            Top up
          </Text>
          <Box bgColor={'white'}>
            {test.triggered && (
              <Text color={'black'} as={'pre'}>
                <Text>
                  Buy Amount: {formatToEtherString(test.buyAmount)} $prints
                </Text>
                <Text>
                  Sell Amount: {formatToEtherString(test.sellAmount)} weth
                </Text>
                <Text>Fee: {formatToEtherString(test.feeAmount)}</Text>
                <Text>
                  validTo: {dayjs(Number(`${test.validTo}000`)).toString()}
                </Text>
              </Text>
            )}
            <TopUp
              printsBalance={{ formatted: '1000', value: BigNumber(1000) }}
            />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default TopupPage
