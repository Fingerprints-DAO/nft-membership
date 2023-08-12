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
    <Card bg="gray.900" mb={[20, 0]} boxShadow="md">
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
            <Image
              alt="Fingerprints Membership #1"
              src={require(`/public/images/nft-card.png`)}
              priority={true}
              width={373}
              height={340}
            />
          </Link>
        </AspectRatio>
        <Box bg="gray.800" borderBottomRadius={8} p={4} mb={10}>
          <Heading as="h3" color="gray.300" fontSize="1.75rem" mb={[2]}>
            Fingerprints Membership #1
          </Heading>
          <Text color="gray.500">
            Created by{' '}
            <Box
              as="a"
              href="#"
              title="Larva Labs"
              target="_blank"
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
