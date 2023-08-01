'use client'

import { Box, Button, Flex, GridItem, Heading, Text } from '@chakra-ui/react'
import Grid from 'components/grid'
import NftCard from './nft-card'
import { ExternalLinkIcon } from '@chakra-ui/icons'

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
