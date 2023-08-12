'use client'

import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import NftCard from './nft-card'
import Grid from 'components/grid'
import { Avatar } from 'connectkit'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import LastBids from 'components/modal/last-bids'
import { getExternalEtherscanUrl, getExternalOpenseaUrl } from 'utils/getLink'
import { getContracts } from 'utils/contract-addresses'

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
    Fingerprints Membership auction
  </Heading>
)

const contracts = getContracts()
const smartContractLink = getExternalEtherscanUrl(contracts.Auction.address)
const openSeaCollectionLink = getExternalOpenseaUrl(getContracts().Membership.address)

const AuctionContent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
          <Box rounded="lg" overflow={['auto', 'hidden']} mb={8}>
            <Table>
              <Thead bgColor="gray.800">
                <Tr color="gray.300">
                  <Th color="gray.100" textTransform="initial" border="none" colSpan={3} py={4}>
                    <Text color="gray.300" fontSize="md" lineHeight="24px">
                      Last bids
                    </Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.from(Array(4), (_, index) => {
                  return (
                    <Tr key={index} bg="gray.900">
                      <Td py={3} pl={4} pr={2} w={{ md: '65%' }}>
                        <Flex alignItems="center">
                          <Box
                            rounded="full"
                            border="2px"
                            borderColor="gray.700"
                            bg="gray.300"
                            mr={2}
                          >
                            <Avatar size={28} />
                          </Box>
                          <Tooltip
                            label="0x135DE65DE65DE65DE65DE65DE65DE65DE65DE65DE6"
                            placement="top"
                          >
                            <Text fontWeight="bold" fontSize={'md'} color="gray.100">
                              0x13...5DE6
                            </Text>
                          </Tooltip>
                        </Flex>
                      </Td>
                      <Td px={2} w={{ md: '15%' }}>
                        <Text color="gray.100" whiteSpace="nowrap" fontSize={{ md: 'md' }}>
                          13 min
                        </Text>
                      </Td>
                      <Td pl={2} pr={4} w={{ md: '20%' }}>
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
                          fontSize={'md'}
                          title="View in Etherscan"
                          target="_blank"
                          color="gray.100"
                          _hover={{ color: 'gray.200', '> span svg': { color: 'gray.200' } }}
                          transition="ease"
                          transitionProperty="color"
                          transitionDuration="0.2s"
                        >
                          1.9795 ETH
                        </Button>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
              <Tfoot>
                <Tr bg="gray.900">
                  <Th colSpan={3} textAlign="center">
                    <Button color="gray.500" variant="link" onClick={onOpen}>
                      view all
                    </Button>
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
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
      {isOpen && <LastBids onClose={onClose} />}
    </>
  )
}

export default AuctionContent

// TODO:
// Remover tabela de bids e mover para modal
// Last bids: adicionar spinner quando tiver
