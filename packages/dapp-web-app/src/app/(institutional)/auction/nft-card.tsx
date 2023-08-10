'use client'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Input,
  Link,
  Skeleton,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import Countdown from 'components/countdown'
import { Avatar } from 'connectkit'
import { useAuctionContext } from 'contexts/auction'
import useCountdownTime from 'hooks/use-countdown-timer'
import Image from 'next/image'
import { useMemo } from 'react'
import { AuctionState } from 'types/auction'
import { formatEther } from 'ethers'

const NftCard = () => {
  const { auctionConfig, auctionState } = useAuctionContext()
  const { countdown, countdownInMili } = useCountdownTime()

  const renderDetails = useMemo(() => {
    if (auctionState === AuctionState.NOT_STARTED) {
      return (
        <>
          <Skeleton mb={6} isLoaded={countdown > 0}>
            <Text fontSize="md" color="gray.400" mb={2}>
              Auction starts in
            </Text>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" color="gray.100">
              <Countdown futureTimestamp={countdownInMili} />
            </Text>
          </Skeleton>
          <Flex>
            <Box flex={1}>
              <Text fontSize="md" color="gray.400" mb={2}>
                Initial price
              </Text>
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
                {formatEther(auctionConfig.minBidIncrementInWei.toString())} ETH
              </Text>
            </Box>
            <Box flex={1}>
              <Text fontSize="md" color="gray.400" mb={2}>
                Duration
              </Text>
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
                1 hour
              </Text>
            </Box>
          </Flex>
        </>
      )
    }

    if (auctionState === AuctionState.STARTED) {
      return (
        <Flex mt={6}>
          <Input variant="outline" placeholder="1.9795 ETH or more" mr={4} flex={1} />
          <Button colorScheme="white">Place bid</Button>
        </Flex>
      )
    }

    return (
      <>
        <Box mt={10} mb={6}>
          <Text fontSize="md" color="gray.400" mb={2}>
            Auction winner
          </Text>
          <Flex alignItems="center">
            <Box rounded="full" border="2px" borderColor="gray.700" bg="gray.300" mr={2}>
              <Avatar size={40} />
            </Box>
            <Tooltip label="0x135DE65DE65DE65DE65DE65DE65DE65DE65DE65DE6" placement="top">
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
                fontSize="2xl"
                title="View in Etherscan"
                target="_blank"
                color="gray.100"
                _hover={{ color: 'gray.200', '> span svg': { color: 'gray.200' } }}
                transition="ease"
                transitionProperty="color"
                transitionDuration="0.2s"
              >
                0x13...5DE6
              </Button>
            </Tooltip>
          </Flex>
        </Box>
        <Box>
          <Text fontSize="md" color="gray.400" mb={2}>
            Winning bid
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="gray.100">
            1.9795 ETH
          </Text>
        </Box>
      </>
    )
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
