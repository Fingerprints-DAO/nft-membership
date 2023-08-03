'use client'

import { ModalProps } from 'types/modal'
import { useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'
import useGetPrintsBalance from 'services/web3/prints/use-get-prints-balance'

type Action = '' | 'top-up' | 'convert'

const ConvertPrints = ({ onClose }: ModalProps) => {
  const [action, setAction] = useState<Action>('')
  const printsBalance = useGetPrintsBalance()

  if (action === 'top-up') {
    return <TopUp printsBalance={printsBalance} />
  }

  if (action === 'convert') {
    return <Convert onClose={onClose} />
  }

  return <ConvertDefault printsBalance={printsBalance} onClose={onClose} onAction={setAction} />
}

export default ConvertPrints
