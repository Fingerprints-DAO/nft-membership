'use client'

import { useMemo, useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'
import usePrintsGetBalance from 'services/web3/prints/use-prints-get-balance'
import { useNftMembershipContext } from 'contexts/nft-membership'
import usePrintsGetAllowance from 'services/web3/prints/use-prints-get-allowance'
import BigNumber from 'bignumber.js'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import useMediaQuery from 'hooks/use-media-query'
import { useRouter } from 'next/navigation'

type Action = '' | 'top-up' | 'convert'

const ConvertPrintsPage = () => {
  const { back } = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 479px)')

  const allowance = usePrintsGetAllowance()
  const printsBalance = usePrintsGetBalance()
  const { pricePerMembership } = useNftMembershipContext()

  const [action, setAction] = useState<Action>('')

  const leftovers = useMemo(() => printsBalance.value.mod(pricePerMembership), [printsBalance, pricePerMembership])

  const totalAvailableToSpend = printsBalance.value.minus(leftovers)

  const toAllow = totalAvailableToSpend.minus(allowance)

  const nftsMintables = useMemo(() => {
    return printsBalance.value.div(pricePerMembership).decimalPlaces(0, BigNumber.ROUND_HALF_FLOOR).toNumber()
  }, [printsBalance.value, pricePerMembership])

  const render = useMemo(() => {
    if (action === 'top-up') {
      return <TopUp printsBalance={printsBalance} />
    }

    if (action === 'convert') {
      return (
        <Convert nftsMintables={nftsMintables} allowance={allowance} toAllow={toAllow} totalAvailableToSpend={totalAvailableToSpend} onClose={back} />
      )
    }

    return <ConvertDefault nftsMintables={nftsMintables} leftovers={leftovers} printsBalance={printsBalance} onClose={back} onAction={setAction} />
  }, [action, printsBalance, allowance, leftovers, nftsMintables, toAllow, back, totalAvailableToSpend])

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
