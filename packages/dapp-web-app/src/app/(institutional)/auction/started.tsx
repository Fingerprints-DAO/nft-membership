import { Box, Button, Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import Countdown from 'components/countdown'
import { useAuctionContext } from 'contexts/auction'
import useCountdownTime from 'hooks/use-countdown-timer'
import { useCallback, useMemo, useState } from 'react'
import { roundEtherUp } from 'utils/price'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import BigNumber from 'bignumber.js'
import useAuctionBid from 'services/web3/auction/use-auction-bid'
import { NumberSettings } from 'types/number-settings'
import { zeroAddress } from 'viem'
import { ConnectKitButton } from 'connectkit'

const AuctionStarted = () => {
  const { auctionData, minBidValue } = useAuctionContext()
  const { countdown, countdownInMili } = useCountdownTime()
  const [amount, setAmount] = useState<NumberFormatValues>()
  const { isLoading: isSubmittingBig, bid } = useAuctionBid()

  const minBidValueRoundUp = useMemo(
    () => roundEtherUp(minBidValue.toString(), NumberSettings.DecimalsAuction),
    [minBidValue]
  )

  const isInvalidValue = useMemo(() => {
    const amountBn = BigNumber(amount?.floatValue || 0)
    return amountBn.lt(minBidValueRoundUp)
  }, [amount?.floatValue, minBidValueRoundUp])

  const handleChange = (values: NumberFormatValues) => {
    setAmount(values)
  }

  const handleSubmit = useCallback(
    async (e: any) => {
      try {
        e.preventDefault()
        const amountBn = BigNumber(amount?.value || 0)
        if (amountBn.lt(auctionData.highestBid)) {
          return
        }
        await bid(amount?.formattedValue || '0')
        setAmount(undefined)
      } catch (error) {
        console.log('handleSubmit', error)
      }
    },
    [amount, bid, auctionData.highestBid]
  )

  const noBid = useMemo(
    () => zeroAddress === auctionData.highestBidder.toLowerCase(),
    [auctionData.highestBidder]
  )

  const currentBidValue = noBid ? minBidValue : auctionData.highestBid

  return (
    <Skeleton isLoaded={countdown > 0}>
      <Flex>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Auction ends in
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.100">
            <Countdown futureTimestamp={countdownInMili} />
          </Text>
        </Box>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            {noBid ? 'Starting' : 'Winning'} bid
          </Text>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.100">
            {roundEtherUp(currentBidValue.toString(), NumberSettings.DecimalsAuction)} ETH
          </Text>
        </Box>
      </Flex>

      <ConnectKitButton.Custom>
        {({ isConnected, show }) =>
          isConnected ? (
            <>
              <Flex as="form" mt={6} onSubmit={handleSubmit}>
                <NumericFormat
                  defaultValue=""
                  value={amount?.value || ''}
                  allowNegative={false}
                  customInput={Input}
                  decimalSeparator="."
                  decimalScale={NumberSettings.DecimalsAuction}
                  placeholder={`${roundEtherUp(
                    minBidValue.toString(),
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
                Min bid allowed: {minBidValueRoundUp} ETH
              </Text>
            </>
          ) : (
            <Button colorScheme="white" onClick={show} flex={1} mt={6} width={'full'}>
              Connect to bid
            </Button>
          )
        }
      </ConnectKitButton.Custom>
    </Skeleton>
  )
}

export default AuctionStarted
