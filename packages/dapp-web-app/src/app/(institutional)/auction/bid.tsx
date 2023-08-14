import { Box, Button, Flex, Icon, Td, Text, Tooltip, Tr } from '@chakra-ui/react'
import { Avatar } from 'connectkit'
import { useAuctionContext } from 'contexts/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { AuctionState, type Bid } from 'types/auction'
import { shortenAddress } from 'utils/string'
import { useEnsName } from 'wagmi'
import Timeago from 'components/timeago'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { roundEtherUp } from 'utils/price'
import { NumberSettings } from 'types/number-settings'
import { GoTrophy } from 'react-icons/go'

type BidProps = {
  index: number
} & Bid

const Bid = ({ amount, timeAgo, address: bidderAddress, transactionHash, index }: BidProps) => {
  const { auctionState } = useAuctionContext()
  const { address } = useNftMembershipContext()
  const { data: ensName } = useEnsName({ address: bidderAddress, chainId: 1 })

  return (
    <Tr bg="gray.900">
      <Td py={3} pl={4} pr={2} w={{ md: '65%' }}>
        <Flex alignItems="center">
          <Box rounded="full" border="2px" borderColor="gray.700" bg="gray.300" mr={2}>
            <Avatar address={bidderAddress} size={28} />
          </Box>
          {bidderAddress === address ? (
            <Text fontWeight="bold" fontSize={'md'} color="gray.100">
              You
            </Text>
          ) : (
            <Tooltip label={bidderAddress} placement="top">
              <Text fontWeight="bold" fontSize={'md'} color="gray.100">
                {ensName || shortenAddress(bidderAddress)}
              </Text>
            </Tooltip>
          )}
          {index === 0 && (
            <Box ml={2}>
              <Tooltip
                label={auctionState === AuctionState.ENDED ? 'Winner' : 'Winning bid'}
                placement="top"
              >
                <Box display={'flex'} alignContent={'center'} justifyContent={'center'}>
                  <Icon as={GoTrophy} boxSize={3} />
                </Box>
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Td>
      <Td px={2} w={{ base: '10%', md: '15%' }} textAlign={'right'}>
        <Text color="gray.100" whiteSpace="nowrap" fontSize={{ md: 'md' }} hideBelow={'sm'}>
          <Timeago timestamp={timeAgo} />
        </Text>
      </Td>
      <Td pl={2} pr={4} w={{ base: '25%', md: '20%' }} textAlign={'right'}>
        <Button
          as="a"
          fontWeight="bold"
          rightIcon={
            <ExternalLinkIcon
              color="links.500"
              transition="ease"
              transitionProperty="color"
              transitionDuration="0.2s"
              mt={-1}
            />
          }
          bg="transparent"
          variant="link"
          href={`${process.env.NEXT_PUBLIC_ETHERSCAN_URL}/tx/${transactionHash}`}
          fontSize={'md'}
          title="View in Etherscan"
          target="_blank"
          color="gray.100"
          _hover={{ color: 'gray.200', '> span svg': { color: 'gray.200' } }}
          transition="ease"
          transitionProperty="color"
          transitionDuration="0.2s"
        >
          {roundEtherUp(amount.toString(), NumberSettings.DecimalsAuction)} ETH
        </Button>
      </Td>
    </Tr>
  )
}

export default Bid
