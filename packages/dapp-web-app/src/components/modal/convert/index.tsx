'use client'

import { ModalProps } from 'types/modal'
import { useState } from 'react'
import ConvertDefault from './default'
import Convert from './convert'
import TopUp from './top-up'

type Action = '' | 'top-up' | 'convert'

const ConvertPrints = ({ onClose }: ModalProps) => {
  const [action, setAction] = useState<Action>('')

  if (action === 'top-up') {
    return <TopUp />
  }

  if (action === 'convert') {
    return <Convert onClose={onClose} />
  }

  return <ConvertDefault onClose={onClose} onAction={setAction} />
}

export default ConvertPrints
