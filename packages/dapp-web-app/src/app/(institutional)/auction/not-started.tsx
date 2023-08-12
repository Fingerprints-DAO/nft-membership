import { Box, Flex, Skeleton, Text } from '@chakra-ui/react'
import Countdown from 'components/countdown'
import { useAuctionContext } from 'contexts/auction'
import dayjs from 'dayjs'
import useCountdownTime from 'hooks/use-countdown-timer'
import { NumberSettings } from 'types/number-settings'
import { roundEtherUp } from 'utils/price'

const AuctionNotStarted = () => {
  const { auctionConfig, minBidValue } = useAuctionContext()
  const { countdown, countdownInMili } = useCountdownTime()

  const start = dayjs.unix(auctionConfig.startTime.toNumber())
  const end = dayjs.unix(auctionConfig.endTime.toNumber())
  const diff = end.diff(start, 'hours')
  const hours = dayjs.duration(diff, 'hours').hours()

  return (
    <>
      <Skeleton mb={6} isLoaded={countdown > 0}>
        <Text fontSize="md" color="gray.400" mb={2}>
          Auction starts in
        </Text>
        <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.100">
          <Countdown futureTimestamp={countdownInMili} />
        </Text>
      </Skeleton>
      <Flex>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Initial price
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
            {roundEtherUp(minBidValue.toString(), NumberSettings.DecimalsAuction)} ETH
          </Text>
        </Box>
        <Box flex={1}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Duration
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
            {hours} hour(s)
          </Text>
        </Box>
      </Flex>
    </>
  )
}

export default AuctionNotStarted

// TODO:
// Initial price: use min bid value
