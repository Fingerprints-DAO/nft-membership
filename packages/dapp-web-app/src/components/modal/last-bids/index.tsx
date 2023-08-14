'use client'

import {
  Box,
  CloseButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Text,
} from '@chakra-ui/react'
import useMediaQuery from 'hooks/use-media-query'
import { Bid } from 'types/auction'
import LastBidsRow from './bid'

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
        maxW={{ base: 'lg', md: '700px' }}
        p={6}
        overflow={{ base: 'auto', md: 'initial' }}
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
        <TableContainer overflowY={{ base: 'auto', md: 'initial' }}>
          <Table colorScheme="whiteAlpha">
            <Tbody>
              {bids.map((item, index) => {
                return <LastBidsRow key={index} index={index} {...item} />
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </ModalContent>
    </Modal>
  )
}

export default LastBids
