'use client'

import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import Footer from 'components/footer'
import Header from 'components/header'

function Home() {
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
      <Box w="full" h="full" left={0} top={0} position="absolute" zIndex={1} bg="blackAlpha.900" opacity={0.9} />
      <Header />
      <Container pt={{ base: 14, sm: 0 }} pb={{ base: '120px', sm: 0 }} flex={1}>
        <Box
          display={{ base: 'block', sm: 'flex' }}
          alignItems="center"
          flexDir="column"
          justifyContent="center"
          position="relative"
          zIndex={2}
          h="full"
        >
          <Heading as="h1" mb={6} textAlign={{ sm: 'center' }}>
            Mint your Fingerprints Membership NFT using your $PRINTS
          </Heading>
          <Heading as="h2" size="md" fontWeight="light" mb={10} textAlign={{ sm: 'center' }}>
            Fingerprints membership is moving from 5,000 $PRINTS to an NFT designed by Larva Labs.
          </Heading>
          <Button size="lg" colorScheme="whiteAlpha" w={{ base: 'full', sm: 'auto' }}>
            Convert your $PRINTS
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Home
