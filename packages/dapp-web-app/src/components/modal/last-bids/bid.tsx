import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Td, Text, Tooltip, Tr } from '@chakra-ui/react'
import Timeago from 'components/timeago'
import { Avatar } from 'connectkit'
import { useAuctionContext } from 'contexts/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import Image from 'next/image'
import { AuctionState, Bid } from 'types/auction'
import { NumberSettings } from 'types/number-settings'
import { roundEtherUp } from 'utils/price'
import { shortenAddress } from 'utils/string'
import { useEnsName } from 'wagmi'
import logoFP from '/public/images/logo-fp.svg'

type LastBidsRowProps = {
  index: number
} & Bid

const LastBidsRow = ({ amount, index, timeAgo, address, transactionHash }: LastBidsRowProps) => {
  const { auctionState } = useAuctionContext()
  const { data: ensName } = useEnsName({ address })
  const { address: userAddress } = useNftMembershipContext()

  return (
    <Tr>
      <Td py={3} pl={2} pr={2} w={{ md: '65%' }} borderColor={'gray.100'}>
        <Flex alignItems="center">
          <Box rounded="full" border="2px" borderColor="gray.700" bg="gray.300" mr={2}>
            <Avatar address={address} size={28} />
          </Box>
          {address === userAddress ? (
            <Text fontWeight="bold" fontSize={'md'} color="gray.500">
              You
            </Text>
          ) : (
            <Tooltip label={address} placement="top">
              <Text fontWeight="bold" fontSize={'md'} color="gray.500">
                {ensName || shortenAddress(address, 8, 8)}
              </Text>
            </Tooltip>
          )}
          {index === 0 && (
            <Box ml={2}>
              <Tooltip
                label={auctionState === AuctionState.ENDED ? 'Winner' : 'Winning bid'}
                placement="top"
              >
                <Image src={logoFP} alt="Winning bid" width={15} />
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Td>
      <Td px={2} w={{ base: '10%', md: '15%' }} borderColor={'gray.100'}>
        <Text color="gray.500" whiteSpace="nowrap" fontSize={{ md: 'md' }} hideBelow={'sm'}>
          <Timeago timestamp={timeAgo} />
        </Text>
      </Td>
      <Td pl={2} pr={2} w={{ base: '25%', md: '20%' }} borderColor={'gray.100'}>
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
          color="gray.500"
          _hover={{ color: 'gray.700', '> span svg': { color: 'gray.700' } }}
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

export default LastBidsRow
