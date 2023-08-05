'use client'

import { ModalProps } from 'types/modal'
import { useMemo, useState } from 'react'
import ConvertDefault from './default'
import Convert, { AllowanceType } from './convert'
import TopUp from './top-up'
import usePrintsGetBalance from 'services/web3/prints/use-prints-get-balance'
import { useNftMembershipContext } from 'contexts/nft-membership'
import usePrintsGetAllowance from 'services/web3/prints/use-prints-get-allowance'
import BigNumber from 'bignumber.js'

type Action = '' | 'top-up' | 'convert'

const ConvertPrints = ({ onClose }: ModalProps) => {
  const allowance = usePrintsGetAllowance()
  const printsBalance = usePrintsGetBalance()
  const { pricePerMembership } = useNftMembershipContext()

  const [action, setAction] = useState<Action>('')

  const leftovers = useMemo(() => printsBalance.value.mod(pricePerMembership), [printsBalance, pricePerMembership])

  const newAllowanceValue = useMemo(() => {
    const totalAvailableToSpend = printsBalance.value.minus(leftovers)

    const allowanceValue = totalAvailableToSpend.minus(allowance)

    if (allowanceValue.isZero()) {
      return
    }

    return allowanceValue
  }, [allowance, leftovers, printsBalance])

  console.log('allowance', allowance.toNumber())
  console.log('amountToIncreaseAllowance', newAllowanceValue?.toNumber())

  if (action === 'top-up') {
    return <TopUp printsBalance={printsBalance} />
  }

  if (action === 'convert') {
    return <Convert newAllowanceValue={newAllowanceValue} onClose={onClose} />
  }

  return (
    <ConvertDefault
      leftovers={leftovers}
      pricePerMembership={pricePerMembership}
      printsBalance={printsBalance}
      onClose={onClose}
      onAction={setAction}
    />
  )
}

export default ConvertPrints
