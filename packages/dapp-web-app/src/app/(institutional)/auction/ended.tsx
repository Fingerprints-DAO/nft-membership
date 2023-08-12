import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Text, Tooltip } from '@chakra-ui/react'
import { Avatar } from 'connectkit'
import { useAuctionContext } from 'contexts/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { NumberSettings } from 'types/number-settings'
import { roundEtherUp } from 'utils/price'
import { shortenAddress } from 'utils/string'

const AuctionEnded = () => {
  const { auctionData } = useAuctionContext()
  const { address } = useNftMembershipContext()

  return (
    <>
      <Box mt={10} mb={6}>
        <Text fontSize="md" color="gray.400" mb={2}>
          Auction winner
        </Text>
        <Flex alignItems="center">
          <Box rounded="full" border="2px" borderColor="gray.700" bg="gray.300" mr={2}>
            <Avatar address={auctionData.highestBidder} size={40} />
          </Box>
          <Tooltip label={auctionData.highestBidder} placement="top">
            <Button
              as="a"
              fontWeight="bold"
              rightIcon={
                <ExternalLinkIcon
                  color="links.500"
                  transition="ease"
                  transitionProperty="color"
                  transitionDuration="0.2s"
                />
              }
              bg="transparent"
              variant="link"
              href="#"
              fontSize="2xl"
              title="View in Etherscan"
              target="_blank"
              color="gray.100"
              _hover={{ color: 'gray.200', '> span svg': { color: 'gray.200' } }}
              transition="ease"
              transitionProperty="color"
              transitionDuration="0.2s"
            >
              {auctionData.highestBidder === address
                ? 'You'
                : shortenAddress(auctionData.highestBidder)}
            </Button>
          </Tooltip>
        </Flex>
      </Box>
      <Box>
        <Text fontSize="md" color="gray.400" mb={2}>
          Bid winner
        </Text>
        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
          {roundEtherUp(auctionData.highestBid.toString(), NumberSettings.DecimalsAuction)} ETH
        </Text>
      </Box>
    </>
  )
}

export default AuctionEnded
