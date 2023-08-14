'use client'

import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import NftCard from './nft-card'
import Grid from 'components/grid'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import LastBids from 'components/modal/last-bids'
import useAuctionLastBids from 'services/web3/auction/use-auction-last-bids'
import { getExternalEtherscanUrl, getExternalOpenseaUrl } from 'utils/getLink'
import { getContracts } from 'utils/contract-addresses'
import { useAuctionContext } from 'contexts/auction'
import { AuctionState } from 'types/auction'
import Bid from './bid'

const LinkButton = ({ text = '', url = '' }) => (
  <Button
    as="a"
    fontWeight="normal"
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
    href={url}
    title="View smart contract in Etherscan"
    target="_blank"
    color="links.500"
    _hover={{ color: 'white', '> span svg': { color: 'white' } }}
    transition="ease"
    transitionProperty="color"
    transitionDuration="0.2s"
    mb={2}
  >
    {text}
  </Button>
)

const PageTitle = () => (
  <Heading color="gray.50" mb={{ base: 4, md: 8 }} mt={2} fontSize={{ base: 'xl', md: '2xl' }}>
    Fingerprints Membership Auction
  </Heading>
)

const contracts = getContracts()
const smartContractLink = getExternalEtherscanUrl(contracts.Auction.address)
const openSeaCollectionLink = getExternalOpenseaUrl(getContracts().Membership.address)

const MAX_LAST_BIDS_COUNT = 4

const AuctionContent = () => {
  const { auctionState } = useAuctionContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { bids, isLoading } = useAuctionLastBids()

  const lastBids = bids.slice(0, MAX_LAST_BIDS_COUNT)

  return (
    <>
      <Grid pt={6} pb="88px" flex={1}>
        <GridItem hideFrom={'sm'} colSpan={4}>
          <PageTitle />
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <NftCard />
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 4, md: 8 }}>
          <Box hideBelow={'sm'}>
            <PageTitle />
          </Box>
          <Flex flexDir="column" alignItems="flex-start" mb={8} hideBelow={'sm'}>
            <LinkButton text={'View smart contract in Etherscan'} url={smartContractLink} />
            <LinkButton text={'View collection in OpenSea'} url={openSeaCollectionLink} />
          </Flex>
          {auctionState !== AuctionState.NOT_STARTED && (
            <Box rounded="lg" overflow={['auto', 'hidden']} mb={8}>
              <Table>
                <Thead bgColor="gray.800">
                  <Tr color="gray.300">
                    <Th color="gray.100" textTransform="initial" border="none" colSpan={3} py={4}>
                      <Flex alignItems="center">
                        <Text color="gray.300" fontSize="md" lineHeight="24px" mr={2}>
                          Last bids
                        </Text>
                        {isLoading && <Spinner color="gray.400" size="sm" />}
                      </Flex>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Boolean(lastBids.length) ? (
                    <>
                      {lastBids.map((item, index) => {
                        return <Bid key={index} index={index} {...item} />
                      })}
                    </>
                  ) : (
                    <Tr bg="gray.900">
                      <Td py={3} pl={4} pr={2} w={{ md: '65%' }}>
                        <Text color="gray.400" fontStyle="italic">
                          No bid so far
                        </Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
                <Tfoot>
                  <Tr bg="gray.900">
                    <Th colSpan={3} textAlign="center">
                      {bids.length > MAX_LAST_BIDS_COUNT && (
                        <Button color="gray.500" variant="link" onClick={onOpen}>
                          view all
                        </Button>
                      )}
                    </Th>
                  </Tr>
                </Tfoot>
              </Table>
            </Box>
          )}
          <Box>
            <Text color="gray.300" fontWeight="bold" mb="6px" fontSize="lg">
              About
            </Text>
            <Text fontSize="lg" fontWeight="300" color="gray.300">
              Introducing the captivating NFT collection by Larva Labs exclusively for Fingerprints!
              Experience the fusion of creativity and technology as Larva Labs brings these
              extraordinary cityscapes to life, offering a truly immersive and unique digital art
              experience for Fingerprints community members.
            </Text>
          </Box>
          <Flex flexDir="column" alignItems="flex-start" mt={8} hideFrom={'sm'}>
            <LinkButton text={'View smart contract in Etherscan'} url={smartContractLink} />
            <LinkButton text={'View collection in OpenSea'} url={openSeaCollectionLink} />
          </Flex>
        </GridItem>
      </Grid>
      {isOpen && <LastBids bids={bids} onClose={onClose} />}
    </>
  )
}

export default AuctionContent
