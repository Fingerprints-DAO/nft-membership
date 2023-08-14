'use client'

import { Box, GridItem, Link, Text } from '@chakra-ui/react'
import Grid from 'components/grid'
import { motion, AnimatePresence } from 'framer-motion'

const AboutPage = () => {
  return (
    <Box as="section" pt="6" flex={1} mb={{ base: 16, sm: '72px' }}>
      <AnimatePresence mode="wait">
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={undefined} rowGap={20} columnGap={24}>
          <GridItem colSpan={{ base: 3, sm: 3, md: 3 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.25, duration: 1 }}
            >
              <Text
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight={'bold'}
                pb={5}
                textTransform={'capitalize'}
              >
                More than meets the eye
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Text fontSize={'lg'}>
                There&apos;s a lot hidden below the surface of Voxelglyph. <br />
                More than a 3D piece, Voxelglyph is your entrance to the world of blockchain art.
              </Text>
            </motion.div>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={'bold'} pb={5}>
                Art
              </Text>
              <Text fontSize={'lg'}>
                Designed by Larva Labs, Voxelglyph is a continuation of the Autoglyphs collection.
                <br />
                <br />A script written in Java with no dependencies, Voxelglyph takes Autoglyph #134
                as an input and produces a 3D structure that can be rendered or built in a variety
                of ways.
              </Text>
            </motion.div>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={'bold'} pb={5}>
                Community
              </Text>
              <Text fontSize={'lg'}>
                Used as the governance standard for Fingerprints, Voxelglyph grants you access to
                our private community, special pricing in future FP Studio drops and many other
                perks of being a Fingerprints member.
              </Text>
            </motion.div>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight={'bold'} pb={5}>
                Exposure
              </Text>
              <Text fontSize={'lg'}>
                Not just an artwork itself, Voxelglyph grants you direct exposure to the
                Fingerprints treasury, including one of the most renowned blockchain art collections
                in the space.
                <br />
                <br />
                <Link
                  href="https://fingerprintsdao.xyz/collections"
                  isExternal
                  color="links.500"
                  title="arod.studio"
                  style={{ textDecoration: 'none' }}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 0.5 }}
                >
                  Click here to browse it.
                </Link>
              </Text>
            </motion.div>
          </GridItem>
        </Grid>
      </AnimatePresence>
    </Box>
  )
}

export default AboutPage
