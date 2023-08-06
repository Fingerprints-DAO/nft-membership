'use client'

import { Box, Button, Flex, GridItem, Heading, Text } from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'
import { PageState } from 'types/page'

type SoonPageProps = {
  bgImage: string
}

const SoonPage = ({ bgImage }: SoonPageProps) => (
  <Box
    as="section"
    h={{ base: 'initial' }}
    minHeight="100vh"
    pos="relative"
    bg={`url(${bgImage})`}
    bgSize="cover"
    bgPos="center"
    bgRepeat="no-repeat"
    display="flex"
    flexDir="column"
  >
    <Box
      w="full"
      h="full"
      left={0}
      top={0}
      position="absolute"
      zIndex={1}
      bg="gray.900"
      opacity={0.8}
    />
    <Flex
      flexDir={'column'}
      minHeight={'100vh'}
      justifyContent={'space-between'}
    >
      <Box pb={5}>
        <Header pageState={PageState.Soon} />
      </Box>
      <Grid>
        <GridItem
          colStart={{ xl: 2 }}
          colSpan={{ base: 4, sm: 6, md: 12, xl: 10 }}
        >
          <Flex
            alignItems="center"
            flexDir="column"
            justifyContent="center"
            position="relative"
            zIndex={2}
            h="100%"
          >
            <Heading
              color="gray.50"
              as="h1"
              mb={6}
              textAlign={{ sm: 'center' }}
            >
              Mint your Voxelglyphs using your $PRINTS
            </Heading>
            <Heading
              color="gray.50"
              as="h2"
              size="md"
              fontWeight="normal"
              mb={10}
              textAlign={{ sm: 'center' }}
            >
              Fingerprints membership is moving from 5,000 $PRINTS to an NFT
              designed by Larva Labs
            </Heading>
            <Text
              color="gray.50"
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              Coming soon
            </Text>
          </Flex>
        </GridItem>
      </Grid>
      <Box pt={5}>
        <Footer isHome={true} pageState={PageState.Soon} />
      </Box>
    </Flex>
  </Box>
)

export default SoonPage
