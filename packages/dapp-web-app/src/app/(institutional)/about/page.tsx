'use client'

import { Box, Grid, GridItem, Link, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

const AboutPage = () => {
  return (
    <Box as="section" pt="8" pb="24" px={'12.5%'} color={'white'}>
      <Grid templateColumns="repeat(3, 1fr)" columnGap={20} rowGap={20}>
        <GridItem colSpan={3}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.25, duration: 1 }}>
            <Text fontSize={'2xl'} fontWeight={'bold'} pb={5} textTransform={'capitalize'}>
              More than meets the eye
            </Text>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 1 }}>
            <Text fontSize={'lg'}>
              There's a lot hidden below the surface of Voxelglyph. <br />
              More than a 3D piece, Voxelglyph is your entrance to the world of blockchain art.
            </Text>
          </motion.div>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1, duration: 1 }}>
            <Text fontSize={'2xl'} fontWeight={'bold'} pb={5}>
              Art
            </Text>
            <Text fontSize={'lg'}>
              Designed by Larva Labs, Voxelglyph is a continuation of the Autoglyphs collection.
              <br />
              <br />A script written in Java with no dependencies, Voxelglyph takes Autoglyph #134 as an input and produces a 3D structure that can be
              rendered or built in a variety of ways.
            </Text>
          </motion.div>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.5, duration: 1 }}>
            <Text fontSize={'2xl'} fontWeight={'bold'} pb={5}>
              Community
            </Text>
            <Text fontSize={'lg'}>
              Used as the governance standard for Fingerprints, Voxelglyph grants you access to our private community, special pricing in future FP
              Studio drops and many other perks of being a Fingerprints member.
            </Text>
          </motion.div>
        </GridItem>
        <GridItem colSpan={{ base: 3, md: 1 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 2, duration: 1 }}>
            <Text fontSize={'2xl'} fontWeight={'bold'} pb={5}>
              Exposure
            </Text>
            <Text fontSize={'lg'}>
              Not just an artwork itself, Voxelglyph grants you direct exposure to the Fingerprints treasury, including one of the most renowned
              blockchain art collections in the space.
              <br />
              <br />
              <Link
                href="https://fingerprintsdao.xyz/collection"
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
    </Box>
  )
}

export default AboutPage
