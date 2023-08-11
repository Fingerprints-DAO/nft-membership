'use client'

import { useCallback, useMemo, useState } from 'react'
import Convert from './convert'
import ConvertTransactions from './convert-transactions'
import TopUp from './top-up'
import usePrintsGetBalance from 'services/web3/prints/use-prints-get-balance'
import { useNftMembershipContext } from 'contexts/nft-membership'
import usePrintsGetAllowance from 'services/web3/prints/use-prints-get-allowance'
import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react'
import useMediaQuery from 'hooks/use-media-query'
import { useRouter } from 'next/navigation'
import { formatBigNumberFloor } from 'utils/price'
import BigNumber from 'bignumber.js'

type Action = '' | 'top-up' | 'convert'

const ConvertPrintsPage = () => {
  const { push } = useRouter()
  const [isMobile] = useMediaQuery('(max-width: 479px)')

  const allowance = usePrintsGetAllowance()
  const printsBalance = usePrintsGetBalance()
  const { pricePerMembership } = useNftMembershipContext()

  // console.log('allowance', allowance.toNumber())

  // const [action, setAction] = useState<Action>('top-up')
  const [action, setAction] = useState<Action>('')

  const leftovers: BigNumber = useMemo(
    () => printsBalance.value.mod(pricePerMembership),
    [printsBalance, pricePerMembership]
  )
  const totalAvailableToSpend = printsBalance.value.minus(leftovers)
  const toAllow = totalAvailableToSpend.minus(allowance)

  const nftsMintables = useMemo(
    () => Number(formatBigNumberFloor(printsBalance.value.div(pricePerMembership), 0)),
    [printsBalance.value, pricePerMembership]
  )

  const onStateBack = useCallback(() => setAction(''), [])
  const onCloseModal = useCallback(() => push('/'), [push])

  const render = useMemo(() => {
    if (action === 'top-up') {
      // console.log(leftovers.toString(), pricePerMembership.toString())
      // console.log(pricePerMembership.minus(leftovers).toString())
      return (
        <TopUp
          printsBalance={printsBalance}
          onClose={onStateBack}
          amount={pricePerMembership.minus(leftovers)}
          ableToMint={nftsMintables + 1}
        />
      )
    }

    if (action === 'convert') {
      return (
        <ConvertTransactions
          nftsMintables={nftsMintables}
          allowance={allowance}
          toAllow={toAllow}
          totalAvailableToSpend={totalAvailableToSpend}
          onClose={onCloseModal}
        />
      )
    }

    return (
      <Convert
        nftsMintables={nftsMintables}
        leftovers={leftovers}
        printsBalance={printsBalance}
        onClose={onCloseModal}
        onAction={setAction}
      />
    )
  }, [
    action,
    nftsMintables,
    leftovers,
    printsBalance,
    onCloseModal,
    onStateBack,
    pricePerMembership,
    allowance,
    toAllow,
    totalAvailableToSpend,
  ])

  return (
    <Modal
      isCentered={true}
      isOpen={true}
      scrollBehavior={isMobile ? 'inside' : 'outside'}
      motionPreset={isMobile ? 'slideInBottom' : 'scale'}
      onClose={onStateBack}
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
