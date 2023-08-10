'use client'

import { Box, Button, Flex, Heading, Image } from '@chakra-ui/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

type SoonPageProps = {
  bgImage: string
}

const SoonPage = ({ bgImage }: SoonPageProps) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box
        as="section"
        h={{ base: 'initial' }}
        minHeight="100vh"
        minWidth='100vw'
        pos="fixed"
        bg={`url(${bgImage})`}
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
      >
        <Box w="full" h="full" position="absolute" zIndex={1} bg="gray.900" opacity={0.8} />
        <Flex
          flexDir={'column'}
          minHeight={'100vh'}
          alignItems="center"
          justifyContent="center"
          position="relative"
          zIndex={2}
          px={10}
        >
          <Box
            mb={10}
            _hover={{
              opacity: '0.75',
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <Link href="https://fingerprintsdao.xyz">
              <Image src={'/images/logo-fp.svg'} alt="Fingerprints DAO" width={{ base: 50, xxl: 75 }} />
            </Link>
          </Box>
          <Box>
            <Heading color="gray.50" as="h1" mb={6} fontSize={{base:'1.8em' ,md: '2.2em', xxl: '2.5em' }} textAlign={'center'}>
              Fingerprints is Moving to Voxelglyph
            </Heading>
            <Heading color="gray.50" as="h2" size={['sm']} fontWeight="thin" mb={5} textAlign={'center'}>
              Our membership is moving from 5,000 $PRINTS to an NFT designed by Larva Labs.
            </Heading>
            <Heading color="gray.50" as="h2" size={['sm']} fontWeight="thin" mb={5} textAlign={'center'}>
              Auction for token #1 available August 15th.
            </Heading>
            <Heading color="gray.50" as="h2" size={['sm']} fontWeight="thin" mb={10} textAlign={'center'}>
              Migration available August 16th.
            </Heading>
          </Box>
          <Link href="https://www.addevent.com/calendar/kZ615607" target="_blank">
            <Button
              fontSize="md"
              fontWeight="bold"
              textAlign="center"
              variant={'outline'}
              colorScheme="white"
              _hover={{
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              Add to Calendar
            </Button>
          </Link>
        </Flex>
      </Box>
    </motion.div>
  </AnimatePresence>
)

export default SoonPage
