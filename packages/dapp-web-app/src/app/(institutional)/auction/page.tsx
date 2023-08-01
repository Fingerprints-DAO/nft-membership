'use client'

import { Box, Button, Flex, GridItem, Heading, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tooltip, Tr } from '@chakra-ui/react'
import Grid from 'components/grid'
import NftCard from './nft-card'
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Avatar } from 'connectkit'

const AuctionPage = () => {
  return (
    <Grid pt={{ base: 12, md: '88px' }} pb="88px">
      <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 3, md: 4 }}>
        <NftCard />
      </GridItem>
      <GridItem colStart={{ md: 6 }} colSpan={{ base: 4, sm: 3, md: 6 }}>
        <Heading color="gray.50" mb={8} fontSize="3xl">
          Fingerprints Membership auction
        </Heading>
        <Flex flexDir="column" alignItems="flex-start" mb={8}>
          <Button
            as="a"
            fontWeight="normal"
            rightIcon={<ExternalLinkIcon color="links.500" transition="ease" transitionProperty="color" transitionDuration="0.2s" />}
            bg="transparent"
            variant="link"
            href="#"
            title="View smart contract in Etherscan"
            target="_blank"
            color="links.500"
            _hover={{ color: 'white', '> span svg': { color: 'white' } }}
            transition="ease"
            transitionProperty="color"
            transitionDuration="0.2s"
            mb={2}
          >
            View smart contract in Etherscan
          </Button>
          <Button
            as="a"
            fontWeight="normal"
            rightIcon={<ExternalLinkIcon color="links.500" transition="ease" transitionProperty="color" transitionDuration="0.2s" />}
            bg="transparent"
            variant="link"
            href="#"
            title="View collection in OpenSea"
            target="_blank"
            color="links.500"
            _hover={{ color: 'white', '> span svg': { color: 'white' } }}
            transition="ease"
            transitionProperty="color"
            transitionDuration="0.2s"
            mb={2}
          >
            View collection in OpenSea
          </Button>
          <Button
            as="a"
            fontWeight="normal"
            rightIcon={<ExternalLinkIcon color="links.500" transition="ease" transitionProperty="color" transitionDuration="0.2s" />}
            bg="transparent"
            variant="link"
            href="#"
            title="View project GitHub"
            target="_blank"
            color="links.500"
            _hover={{ color: 'white', '> span svg': { color: 'white' } }}
            transition="ease"
            transitionProperty="color"
            transitionDuration="0.2s"
          >
            View project GitHub
          </Button>
        </Flex>
        <Box rounded="lg" overflow={['auto', 'hidden']} mb={8}>
          <Table>
            <Thead bgColor="gray.800">
              <Tr color="gray.300">
                <Th color="gray.100" textTransform="initial" border="none" colSpan={3} p={4}>
                  <Text color="gray.300" fontSize="lg" lineHeight="24px">
                    Last bids
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from(Array(5), (_, index) => {
                return (
                  <Tr key={index} bg="gray.900">
                    <Td pl={4} pr={2} w={{ md: '65%' }}>
                      <Flex alignItems="center">
                        <Box rounded="full" border="2px" borderColor="gray.700" bg="gray.300" mr={2}>
                          <Avatar size={32} />
                        </Box>
                        <Tooltip label="0x135DE65DE65DE65DE65DE65DE65DE65DE65DE65DE6" placement="top">
                          <Text fontWeight="bold" fontSize={{ md: 'lg' }} color="gray.100">
                            0x13...5DE6
                          </Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td px={2} w={{ md: '15%' }}>
                      <Text color="gray.100" whiteSpace="nowrap" fontSize={{ md: 'lg' }}>
                        13 min
                      </Text>
                    </Td>
                    <Td pl={2} pr={4} w={{ md: '20%' }}>
                      <Button
                        as="a"
                        fontWeight="bold"
                        rightIcon={<ExternalLinkIcon color="links.500" transition="ease" transitionProperty="color" transitionDuration="0.2s" />}
                        bg="transparent"
                        variant="link"
                        href="#"
                        fontSize={{ md: 'lg' }}
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
                  <Button color="gray.500" variant="link">
                    <ChevronDownIcon w={6} h={6} mr={1} />
                    load more
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
            Introducing the captivating NFT collection by Larva Labs exclusively for Fingerprints! Experience the fusion of creativity and technology
            as Larva Labs brings these extraordinary cityscapes to life, offering a truly immersive and unique digital art experience for Fingerprints
            community members.
          </Text>
        </Box>
      </GridItem>
    </Grid>
  )
}

export default AuctionPage
