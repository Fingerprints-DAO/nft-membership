'use client'

import React, { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'
import { useRouter } from 'next/navigation'
import { PageState } from 'types/page'
import { Suspense } from 'react'
import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Icon,
  LinkBox,
} from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'
import Loading from 'components/loading'
import { AnimatePresence, TargetAndTransition, motion } from 'framer-motion'
import { GiModernCity, GiHouse } from 'react-icons/gi'
import Image from 'next/image'
import logoFP from '/public/images/logo-fp.svg'

const Spline = React.lazy(() => import('@splinetool/react-spline'))

const variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
    transitionEnd: {
      zIndex: 0,
    },
  },
  in: {
    opacity: 1,
    zIndex: 2,
    transition: {
      duration: 0.8,
      ease: 'easeIn',
    },
  },
}

const pulseAnimation = {
  opacity: [1, 0.5, 1],
  animationTimingFunction: 'cubic-bezier(.4,0,.6,1)',
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'loop',
  },
} as TargetAndTransition

const HomePage = () => {
  const [animationEnded, setAnimationEnded] = useState(false)
  const [animationStarted, setAnimationStarted] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const { push } = useRouter()

  const handleCTAClick = (isConnected: boolean, show?: () => void) => () =>
    isConnected ? push('convert') : show?.()

  useEffect(() => {
    if (animationStarted) {
      setTimeout(() => {
        setAnimationEnded(true)
        setFirstRender(false)
      }, 8000)
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
        bgColor={'black'}
      >
        <Box w="full" h="full" left={0} top={0} position="absolute" zIndex={1}>
          <Spline
            scene="https://prod.spline.design/U7XH4fuGtiuDN9Lf/scene.splinecode"
            onLoad={() => setAnimationStarted(true)}
            id={'voxelglyph'}
          />
          {animationStarted && !animationEnded && (
            <LinkBox
              as={motion.a}
              onClick={() => setAnimationEnded(true)}
              position={'fixed'}
              bottom={20}
              zIndex={2}
              left={0}
              right={0}
              textAlign={'center'}
              cursor={'pointer'}
              fontWeight={'bold'}
              fontSize={'lg'}
              animate={pulseAnimation}
            >
              {firstRender ? (
                <>
                  <span>Skip intro</span>
                </>
              ) : (
                <Box
                  as={'span'}
                  ml={-8}
                  display={'inline-flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Image src={logoFP} alt="Fingerprints DAO" width={14} />
                  <Box as={'span'} ml={2}>
                    Back to home
                  </Box>
                </Box>
              )}
            </LinkBox>
          )}
        </Box>

        {animationEnded && (
          <Box
            position={'absolute'}
            bottom={20}
            zIndex={3}
            left={0}
            right={0}
            textAlign={'center'}
          >
            <LinkBox
              as={motion.a}
              onClick={() => setAnimationEnded(false)}
              ml={'auto'}
              mr={'auto'}
              mt={5}
              cursor={'pointer'}
              fontWeight={'bold'}
              animate={pulseAnimation}
              display={'inline-flex'}
              alignItems={'center'}
            >
              <Icon as={GiModernCity} mr={2} ml={-8} />
              <span>Play the Voxelglyph</span>
            </LinkBox>
          </Box>
        )}
        <AnimatePresence initial={false} mode="wait">
          <Suspense fallback={<Loading full />}>
            <motion.div
              key={'home'}
              variants={variants}
              animate={animationEnded ? 'in' : 'out'}
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
                      <div>
                        <Button
                          size="lg"
                          w={{ base: 'full', sm: 'auto' }}
                          variant={'outline'}
                          mr={{ sm: 3 }}
                          mb={{ base: 3, sm: 0 }}
                          colorScheme="white"
                        >
                          Learn more
                        </Button>
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
                      </div>
                    </Flex>
                  </GridItem>
                </Grid>
                <Box pt={5}>
                  <Footer isHome={true} pageState={PageState.Released} />
                </Box>
              </Flex>
            </motion.div>
          </Suspense>
        </AnimatePresence>
      </Box>
    </Suspense>
  )
}

export default HomePage
