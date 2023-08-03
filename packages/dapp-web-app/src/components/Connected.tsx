'use client'

import { PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'

const Connected = ({ children }: PropsWithChildren) => {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return null
  }

  return children
}

export default Connected
