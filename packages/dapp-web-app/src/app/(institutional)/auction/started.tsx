import { Box, Button, Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import Countdown from 'components/countdown'
import { useAuctionContext } from 'contexts/auction'
import useCountdownTime from 'hooks/use-countdown-timer'
import { useCallback, useMemo, useState } from 'react'
import { formatToEtherString } from 'utils/price'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import BigNumber from 'bignumber.js'
import useAuctionBid from 'services/web3/auction/use-auction-bid'

const AuctionStarted = () => {
  const { auctionData, minBidValue } = useAuctionContext()
  const { countdown, countdownInMili } = useCountdownTime()

  console.log('auctionData', auctionData)

  const [amount, setAmount] = useState<NumberFormatValues>()

  const { isLoading: isSubmittingBig, bid } = useAuctionBid()

  const minBidValueBn = formatToEtherString(minBidValue.toString())
  const highestBid = formatToEtherString(auctionData.highestBid.toString())

  const isInvalidValue = useMemo(() => {
    const amountBn = BigNumber(amount?.floatValue || 0)

    return amountBn.lte(minBidValueBn)
  }, [minBidValueBn, amount])

  const handleChange = (values: NumberFormatValues) => {
    setAmount(values)
  }

  const handleSubmit = useCallback(
    async (e: any) => {
      try {
        e.preventDefault()

        const amountBn = BigNumber(amount?.value || 0)

        if (amountBn.lt(highestBid)) {
          return
        }

        await bid(amount?.formattedValue || '0')

        setAmount(undefined)
      } catch (error) {
        console.log('handleSubmit', error)
      }
    },
    [amount, bid, highestBid]
  )

  return (
    <Skeleton isLoaded={countdown > 0}>
      <Flex>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Auction ends in
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
            <Countdown futureTimestamp={countdownInMili} />
          </Text>
        </Box>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Winning bid
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
            {highestBid.toFormat(4)} ETH
          </Text>
        </Box>
      </Flex>
      <Flex as="form" mt={6} onSubmit={handleSubmit}>
        <NumericFormat
          defaultValue=""
          value={amount?.value || ''}
          allowNegative={false}
          customInput={Input}
          thousandSeparator=","
          decimalSeparator="."
          decimalScale={4}
          placeholder={`${minBidValueBn.toFormat(4)} ETH or more`}
          variant="outline"
          mr={4}
          flex={1}
          onValueChange={handleChange}
        />
        <Button
          isLoading={isSubmittingBig}
          isDisabled={isInvalidValue || isSubmittingBig}
          type="submit"
          colorScheme="white"
        >
          Place bid
        </Button>
      </Flex>
      <Text color="gray.400" fontStyle="italic" mt={2} fontSize={{ base: 'xs' }}>
        Min bid allowed: {minBidValueBn.toFormat(4)} ETH
      </Text>
    </Skeleton>
  )
}

export default AuctionStarted
