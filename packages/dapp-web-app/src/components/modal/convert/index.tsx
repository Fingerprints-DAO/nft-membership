'use client'

import { useMemo, useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'
import useGetPrintsBalance from 'services/web3/prints/use-get-prints-balance'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import useMediaQuery from 'hooks/use-media-query'
import { useRouter } from 'next/navigation'

type Action = '' | 'top-up' | 'convert'

const ConvertPrintsPage = () => {
  const { back } = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 479px)')
  const [action, setAction] = useState<Action>('')
  const printsBalance = useGetPrintsBalance()

  const render = useMemo(() => {
    if (action === 'top-up') {
      return <TopUp printsBalance={printsBalance} />
    }

    if (action === 'convert') {
      return <Convert onClose={back} />
    }

    return (
      <ConvertDefault
        printsBalance={printsBalance}
        onClose={back}
        onAction={setAction}
      />
    )
  }, [action, back, printsBalance])

  return (
    <Modal
      isCentered={true}
      isOpen={true}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={back}
    >
      <ModalOverlay height="100vh" />
      <ModalContent
        bg="white"
        position={{ base: 'fixed', sm: 'unset' }}
        bottom={{ base: '0px', sm: 'unset' }}
        mb={{ base: '0', sm: 'auto' }}
        borderRadius={{ base: '1rem 1rem 0 0', sm: '1rem' }}
        maxW={{ base: 'lg', sm: '438px' }}
        p={6}
      >
        {render}
      </ModalContent>
    </Modal>
  )
}

export default ConvertPrintsPage
