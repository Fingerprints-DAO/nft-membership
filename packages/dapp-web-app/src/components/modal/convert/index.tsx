'use client'

import { ModalProps } from 'types/modal'
import { useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'
import useGetPrintsBalance from 'services/web3/prints/use-get-prints-balance'
import { useNftMembershipContext } from 'contexts/nft-membership'
import BigNumber from 'bignumber.js'

type Action = '' | 'top-up' | 'convert'

const ConvertPrints = ({ onClose }: ModalProps) => {
  const printsBalance = useGetPrintsBalance()
  const { pricePerMembership } = useNftMembershipContext()

  const [action, setAction] = useState<Action>('')

  if (action === 'top-up') {
    return <TopUp printsBalance={printsBalance} />
  }

  if (action === 'convert') {
    return <Convert onClose={onClose} />
  }

  return <ConvertDefault pricePerMembership={pricePerMembership} printsBalance={printsBalance} onClose={onClose} onAction={setAction} />
}

export default ConvertPrints
