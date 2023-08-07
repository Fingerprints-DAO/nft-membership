'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { config } from '../settings/wagmi'
import theme from 'settings/theme'
import Transition from 'components/transition'
import { NftMembershipProvider } from './nft-membership'
import Loading from 'components/loading'

const Providers = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <WagmiConfig config={config}>
          <NftMembershipProvider>
            {mounted ? (
              <ConnectKitProvider mode="light">
                <Transition>{children}</Transition>
              </ConnectKitProvider>
            ) : (
              <Loading />
            )}
          </NftMembershipProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
