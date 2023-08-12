'use client'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import Timeago from 'components/timeago'
import { Avatar } from 'connectkit'
import useMediaQuery from 'hooks/use-media-query'
import { Bid } from 'types/auction'
import { NumberSettings } from 'types/number-settings'
import { roundEtherUp } from 'utils/price'
import { shortenAddress } from 'utils/string'

type LastBidsProps = {
  bids: Bid[]
  onClose: () => void
}

const LastBids = ({ bids, onClose }: LastBidsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 1023px)')

  return (
    <Modal
      isCentered={true}
      isOpen={true}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={onClose}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        bg="white"
        position={{ base: 'fixed', sm: 'unset' }}
        bottom={{ base: '0px', sm: 'unset' }}
        mb={{ base: '0', sm: 'auto' }}
        borderRadius={{ base: '1rem 1rem 0 0', sm: '1rem' }}
        maxW={{ base: 'lg', md: '900px' }}
        p={6}
      >
        <Box position="relative" py="13px" mb={7}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.900"
            textAlign="center"
            lineHeight="24px"
          >
            Bid history
          </Text>
          <CloseButton
            color="gray.500"
            onClick={onClose}
            position="absolute"
            right={0}
            top={0}
            w="44px"
            h="44px"
            size="lg"
          />
        </Box>
        <TableContainer>
          <Table colorScheme="whiteAlpha">
            <Tbody>
              {bids.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td py={3} pl={4} pr={2} w={{ md: '65%' }}>
                      <Flex alignItems="center">
                        <Box
                          rounded="full"
                          border="2px"
                          borderColor="gray.700"
                          bg="gray.300"
                          mr={2}
                        >
                          <Avatar address={item.address} size={28} />
                        </Box>
                        <Tooltip label={item.address} placement="top">
                          <Text fontWeight="bold" fontSize={'md'} color="gray.500">
                            {isMobile ? shortenAddress(item.address) : item.address}
                          </Text>
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td px={2} w={{ md: '15%' }}>
                      <Text color="gray.500" whiteSpace="nowrap" fontSize={{ md: 'md' }}>
                        <Timeago date={item.timeAgo} />
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
                            mt={-1}
                          />
                        }
                        bg="transparent"
                        variant="link"
                        href={`${process.env.NEXT_PUBLIC_ETHERSCAN_URL}/tx/${item.transactionHash}`}
                        fontSize={'md'}
                        title="View in Etherscan"
                        target="_blank"
                        color="gray.500"
                        _hover={{ color: 'gray.700', '> span svg': { color: 'gray.700' } }}
                        transition="ease"
                        transitionProperty="color"
                        transitionDuration="0.2s"
                      >
                        {roundEtherUp(item.amount.toString(), NumberSettings.DecimalsAuction)} ETH
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </ModalContent>
    </Modal>
  )
}

export default LastBids
