'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useRouter } from 'next/navigation'
import { PageState } from 'types/page'
import { Suspense } from 'react'
import { Box, Button, Flex, GridItem, Heading, Text } from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'
import Loading from 'components/loading'
import { AnimatePresence, easeIn, motion } from 'framer-motion'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

const variants = {
  out: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 1,
      ease: 'easeIn',
    },
  },
}

const HomePage = () => {
  const [animationEnded, setAnimationEnded] = useState(false)
  const [animationStarted, setAnimationStarted] = useState(false)
  const { push } = useRouter()

  const handleCTAClick = (isConnected: boolean, show?: () => void) => () =>
    isConnected ? push('convert') : show?.()

  useEffect(() => {
    console.log('here')
    if (animationStarted) {
      console.log('animationStarted', animationStarted)
      setTimeout(() => {
        setAnimationEnded(true)
        console.log('setted', animationStarted)
      }, 5000)
    }
  }, [animationStarted])

  return (
    <Suspense fallback={<Loading full />}>
      <Box
        as="section"
        h={{ base: 'initial' }}
        minHeight="100vh"
        pos="relative"
        bgRepeat="no-repeat"
        display="flex"
        flexDir="column"
      >
        <Box w="full" h="full" left={0} top={0} position="absolute" zIndex={1}>
          <Spline
            scene="https://prod.spline.design/U7XH4fuGtiuDN9Lf/scene.splinecode"
            onLoad={() => setAnimationStarted(true)}
            id={'voxelglyph'}
          />
        </Box>

        <AnimatePresence initial={false} mode="wait">
          {animationEnded && (
            // <Suspense fallback={null}>
            <motion.div
              key={'home'}
              variants={variants}
              animate="in"
              initial="out"
              exit={'out'}
            >
              <Box
                w="full"
                h="full"
                left={0}
                top={0}
                position="absolute"
                zIndex={1}
                bg="gray.900"
                opacity={0.8}
              />
              <Flex
                flexDir={'column'}
                minHeight={'100vh'}
                justifyContent={'space-between'}
              >
                <Box pb={5}>
                  <Header pageState={PageState.Released} />
                </Box>
                <Grid>
                  <GridItem
                    colStart={{ xl: 2 }}
                    colSpan={{ base: 4, sm: 6, md: 12, xl: 10 }}
                  >
                    <Flex
                      alignItems="center"
                      flexDir="column"
                      justifyContent="center"
                      position="relative"
                      zIndex={2}
                      h="100%"
                    >
                      <Heading
                        color="gray.50"
                        as="h1"
                        mb={6}
                        textAlign={{ sm: 'center' }}
                      >
                        Mint your Voxelglyphs using your $PRINTS
                      </Heading>
                      <Heading
                        color="gray.50"
                        as="h2"
                        size="md"
                        fontWeight="normal"
                        mb={10}
                        textAlign={{ sm: 'center' }}
                      >
                        Fingerprints membership is moving from 5,000 $PRINTS to
                        an NFT designed by Larva Labs
                      </Heading>
                      <ConnectKitButton.Custom>
                        {({ isConnected, show }) => {
                          return (
                            <Button
                              size="lg"
                              colorScheme="white"
                              w={{ base: 'full', sm: 'auto' }}
                              onClick={handleCTAClick(isConnected, show)}
                            >
                              Convert your $PRINTS
                            </Button>
                          )
                        }}
                      </ConnectKitButton.Custom>
                    </Flex>
                  </GridItem>
                </Grid>
                <Box pt={5}>
                  <Footer isHome={true} pageState={PageState.Released} />
                </Box>
              </Flex>
            </motion.div>
            // </Suspense>
          )}
        </AnimatePresence>
      </Box>
    </Suspense>
  )
}

export default HomePage
