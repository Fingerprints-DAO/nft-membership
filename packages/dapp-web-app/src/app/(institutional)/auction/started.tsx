import { Box, Button, Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import Countdown from 'components/countdown'
import { useAuctionContext } from 'contexts/auction'
import useCountdownTime from 'hooks/use-countdown-timer'
import { useCallback, useMemo, useState } from 'react'
import { formatToEtherString, roundEtherUp } from 'utils/price'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import BigNumber from 'bignumber.js'
import useAuctionBid from 'services/web3/auction/use-auction-bid'
import { NumberSettings } from 'types/number-settings'

const AuctionStarted = () => {
  const { auctionData, minBidValue } = useAuctionContext()
  const { countdown, countdownInMili } = useCountdownTime()

  //   console.log('auctionData', auctionData)

  const [amount, setAmount] = useState<NumberFormatValues>()

  const { isLoading: isSubmittingBig, bid } = useAuctionBid()

  const minBidValueBn = formatToEtherString(minBidValue.toString())
  const highestBid = formatToEtherString(auctionData.highestBid.toString())

  const isInvalidValue = useMemo(() => {
    const amountBn = BigNumber(amount?.floatValue || 0)
    const minBidRounded = BigNumber(roundEtherUp(minBidValueBn.toString()))

    return amountBn.lt(minBidRounded)
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
            {roundEtherUp(highestBid.toString(), NumberSettings.DecimalsAuction)} ETH
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
          placeholder={`${roundEtherUp(
            minBidValueBn.toString(),
            NumberSettings.DecimalsAuction
          )} ETH or more`}
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
        Min bid allowed: {roundEtherUp(minBidValueBn.toString(), NumberSettings.DecimalsAuction)}{' '}
        ETH
      </Text>
    </Skeleton>
  )
}

export default AuctionStarted

// TODO:
// Verificar se o endereço de highest bid é zero e se for trocar o label para "Starting bid" e o valor vem do minBidValue
// Se tiver bid, label fica como "winnning bid" e o valor vem do highestbid
