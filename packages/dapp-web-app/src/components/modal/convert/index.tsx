'use client'

import { ModalProps } from 'types/modal'
import { useMemo, useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'
import usePrintsGetBalance from 'services/web3/prints/use-prints-get-balance'
import { useNftMembershipContext } from 'contexts/nft-membership'
import usePrintsGetAllowance from 'services/web3/prints/use-prints-get-allowance'
import BigNumber from 'bignumber.js'
import { parseAmountToDisplay } from 'utils/number'

type Action = '' | 'top-up' | 'convert'

const ConvertPrints = ({ onClose }: ModalProps) => {
  const allowance = usePrintsGetAllowance()
  console.log('allowance', allowance.toNumber())
  const printsBalance = usePrintsGetBalance()
  const { pricePerMembership } = useNftMembershipContext()

  const [action, setAction] = useState<Action>('')

  const leftovers = useMemo(() => printsBalance.value.mod(pricePerMembership), [printsBalance, pricePerMembership])

  // Valor pra gastar
  const totalAvailableToSpend = printsBalance.value.minus(leftovers)
  console.log('totalAvailableToSpend', totalAvailableToSpend.toNumber())

  // Valor q falta aprovar
  const toAllow = totalAvailableToSpend.minus(allowance)
  console.log('toAllow', toAllow.toNumber())

  if (action === 'top-up') {
    return <TopUp printsBalance={printsBalance} />
  }

  if (action === 'convert') {
    return <Convert allowance={allowance} toAllow={toAllow} totalAvailableToSpend={totalAvailableToSpend} onClose={onClose} />
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
