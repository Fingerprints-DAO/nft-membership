'use client'

import * as React from 'react'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'

import { config } from '../settings/wagmi'

function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CacheProvider>
      <ChakraProvider>
        <WagmiConfig config={config}>
          {!mounted && <p>Loading</p>}
          <ConnectKitProvider>{mounted && children}</ConnectKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
