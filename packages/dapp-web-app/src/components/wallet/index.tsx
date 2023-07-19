'use client'

import React, { useMemo } from 'react'
import { Button } from '@chakra-ui/react'
import { useDisconnect } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

type WalletProps = {
  variant: 'header' | 'drawer' | 'card'
}

const Wallet = ({ variant }: WalletProps) => {
  const { disconnect } = useDisconnect()

  const isDrawer = variant === 'drawer'
  const isCard = variant === 'card'
  const isHeader = variant === 'header'

  const buttonColorScheme = useMemo(() => {
    if (isCard) {
      return
    }

    return isDrawer ? 'gray' : 'whiteAlpha'
  }, [isDrawer, isCard])

  const buttonColor = useMemo(
    () => (isConnected: boolean) => {
      if (isConnected) {
        return 'gray.50'
      }

      return !isHeader ? 'gray.50' : undefined
    },
    [isHeader]
  )

  const handleConnectWallet = (isConnected: boolean, show?: () => void) => () => (isConnected ? disconnect() : show?.())

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        return (
          <Button
            //   borderColor={isCard ? 'gray.50' : undefined}
            //   borderWidth={isCard ? 2 : undefined}
            h={isHeader ? '44px' : 16}
            color={buttonColor(isConnected)}
            size="lg"
            fontSize="18px"
            colorScheme={buttonColorScheme}
            variant={isCard || isConnected ? 'outline' : 'solid'}
            w="full"
            onClick={handleConnectWallet(isConnected, show)}
          >
            {!isConnected ? 'Connect' : 'Disconnect'}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export default Wallet