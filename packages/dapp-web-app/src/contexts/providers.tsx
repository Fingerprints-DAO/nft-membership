'use client'

import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { config } from '../settings/wagmi'
import theme from 'settings/theme'
import { PropsWithChildren, useEffect, useState } from 'react'

const Providers = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <WagmiConfig config={config}>{mounted ? <ConnectKitProvider mode="light">{children}</ConnectKitProvider> : <p>Loading</p>}</WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
