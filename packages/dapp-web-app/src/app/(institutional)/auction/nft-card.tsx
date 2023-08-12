'use client'

import { AspectRatio, Box, Card, CardBody, Heading, Link, Text } from '@chakra-ui/react'
import { useAuctionContext } from 'contexts/auction'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useMemo } from 'react'
import { AuctionState } from 'types/auction'
import duration from 'dayjs/plugin/duration'
import AuctionNotStarted from './not-started'
import AuctionStarted from './started'
import AuctionEnded from './ended'

dayjs.extend(duration)

const NftCard = () => {
  const { auctionState } = useAuctionContext()

  const renderDetails = useMemo(() => {
    if (auctionState === AuctionState.NOT_STARTED) {
      return <AuctionNotStarted />
    }

    if (auctionState === AuctionState.STARTED) {
      return <AuctionStarted />
    }

    return <AuctionEnded />
  }, [auctionState])

  return (
    <Card
      bg="gray.900"
      mb={[4, 0]}
      boxShadow="md"
      maxW={{ base: 400, sm: 'initial' }}
      mx={{ base: 'auto', sm: 'initial' }}
    >
      <CardBody px={{ base: 4, md: 8 }} pt={6} pb={8}>
        <AspectRatio
          maxW="full"
          w="auto"
          h="auto"
          ratio={{ base: 4 / 3.5, md: 4 / 3.5 }}
          borderTopRadius={8}
          overflow="hidden"
        >
          <Link href="#" target="_blank">
            <Box
              as={Image}
              alt="Voxelglyph #1"
              src={require(`/public/images/nft-card.jpg`)}
              priority={true}
              width={'100%'}
              // minW={373}
              // maxH={340}
            />
          </Link>
        </AspectRatio>
        <Box bg="gray.800" borderBottomRadius={8} p={4} mb={10}>
          <Heading as="h3" color="gray.300" fontSize={{ base: 'lg', md: 'xl' }} mb={[2]}>
            Voxelglyph #1
          </Heading>
          <Text color="gray.500">
            Created by{' '}
            <Box
              as="a"
              href="https://www.larvalabs.com/"
              target="_blank"
              title="Larva Labs"
              color="links.500"
              _hover={{ color: 'white' }}
              transition="ease"
              transitionProperty="color"
              transitionDuration="0.2s"
            >
              Larva Labs
            </Box>
          </Text>
        </Box>
        {renderDetails}
      </CardBody>
    </Card>
  )
}

export default NftCard
