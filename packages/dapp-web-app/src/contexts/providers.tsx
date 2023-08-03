'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { ConnectKitProvider } from 'connectkit'
import { WagmiConfig } from 'wagmi'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { config } from '../settings/wagmi'
import theme from 'settings/theme'
import { motion } from 'framer-motion'
import Image from 'next/image'
import logoFP from '/public/images/animated-logo.gif'
import Transition from 'components/transition'

const Providers = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Transition>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          <WagmiConfig config={config}>
            {mounted ? (
              <ConnectKitProvider mode="light">{children}</ConnectKitProvider>
            ) : (
              <Box
                w={'100vw'}
                h={'100vh'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={logoFP}
                    alt="Fingerprints DAO"
                    width={80}
                    priority
                  />
                </motion.div>
              </Box>
            )}
          </WagmiConfig>
        </ChakraProvider>
      </CacheProvider>
    </Transition>
  )
}

export default Providers
