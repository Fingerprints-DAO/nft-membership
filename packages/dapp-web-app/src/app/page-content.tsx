import { Box, Button, Flex, GridItem, Heading, Text } from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'
import { ConnectKitButton } from 'connectkit'
import { useRouter } from 'next/navigation'
import { PageState } from 'types/page'

type HomeProps = {
  pageState: PageState
}

const Home = ({ pageState }: HomeProps) => {
  const { push } = useRouter()

  const handleCTAClick = (isConnected: boolean, show?: () => void) => () => (isConnected ? push('convert') : show?.())

  return (
    <Box
      as="section"
      h={{ base: 'initial', sm: '100%' }}
      minH="100%"
      pos="relative"
      bg={`url('/images/bg-hero.jpg')`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      display="flex"
      flexDir="column"
    >
      <Box w="full" h="full" left={0} top={0} position="absolute" zIndex={1} bg="gray.900" opacity={0.8} />
      <Header />
      <Grid
        minH={{
          base: 'calc(100vh - 330px)',
          sm: 'calc(100vh - 258px)',
          md: 'calc(100vh - 236px)',
          lg: 'calc(100vh - 240px)',
          xl: 'calc(100vh - 216px)',
        }}
      >
        <GridItem colStart={{ xl: 2 }} colSpan={{ base: 4, sm: 6, md: 12, xl: 10 }}>
          <Flex alignItems="center" flexDir="column" justifyContent="center" position="relative" zIndex={2} h="100%">
            <Heading as="h1" mb={6} textAlign={{ sm: 'center' }}>
              Mint your Fingerprints Membership NFT using your $PRINTS
            </Heading>
            <Heading as="h2" size="md" fontWeight="light" mb={10} textAlign={{ sm: 'center' }}>
              Fingerprints membership is moving from 5,000 $PRINTS to an NFT designed by Larva Labs.
            </Heading>
            {pageState === PageState.Soon && (
              <Text color="gray.50" fontSize="xl" fontWeight="bold" textAlign="center">
                Coming soon.
              </Text>
            )}
            {pageState === PageState.Released && (
              <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                  return (
                    <Button size="lg" colorScheme="whiteAlpha" w={{ base: 'full', sm: 'auto' }} onClick={handleCTAClick(isConnected, show)}>
                      Convert your $PRINTS
                    </Button>
                  )
                }}
              </ConnectKitButton.Custom>
            )}
          </Flex>
        </GridItem>
      </Grid>
      <Footer isHome={true} />
    </Box>
  )
}

export default Home
