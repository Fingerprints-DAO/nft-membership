'use client'

import { Link, Box, Flex, Icon, Text, GridItem } from '@chakra-ui/react'
import Grid from 'components/grid'
// import useMediaQuery from 'hooks/use-media-query'
import { BsDiscord } from 'react-icons/bs'
import { BsTwitter } from 'react-icons/bs'
import { SiOpensea } from 'react-icons/si'
import { PageState, isAfterStage } from 'utils/currentStage'

const Footer = () => {
  // const [isMobile] = useMediaQuery('(max-width: 767px)')

  return (
    <Box as="footer" py={[8, 6]} bg={'transparent'} position="relative" zIndex={10}>
      <Grid alignItems={'center'}>
        <GridItem colSpan={{ base: 4, sm: 4, md: 8 }}>
          <Flex
            mb={{ base: 6, sm: 'unset' }}
            flexDirection="column"
            alignItems={{ base: '', sm: 'flex-start' }}
          >
            <Text fontSize="xs" color="#7a7a7a" textAlign={{ base: 'center', sm: 'left' }}>
              By Fingerprints DAO, developed by{' '}
              <Link
                color="links.500"
                title="arod.studio"
                href="https://arod.studio"
                target="_blank"
                style={{ textDecoration: 'none' }}
                transition="opacity 0.2s"
                _hover={{ opacity: 0.5 }}
              >
                arod.studio
              </Link>
            </Text>
            {/* <Text
              fontSize="xs"
              color="#7a7a7a"
              textAlign={{ base: 'center', sm: 'left' }}
            >
              Fingerprints Foundation, Cricket Square, Hutchins Drive, P.O. Box
              2681, Grand Cayman
            </Text> */}
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 4 }}>
          <Flex justifyContent={{ base: 'center', sm: 'flex-end' }} gap={4}>
            <Link
              href="https://twitter.com/FingerprintsDAO"
              title="Twitter"
              target="_blank"
              color="#7a7a7a"
              _hover={{ color: 'white' }}
              transition="ease"
              transitionProperty="color"
              transitionDuration="0.2s"
            >
              <Icon as={BsTwitter} w={8} h={8} display="block" />
            </Link>
            <Link
              href="https://discord.gg/Mg7wx36upM"
              title="Discord"
              target="_blank"
              color="#7a7a7a"
              _hover={{ color: 'white' }}
              transition="ease"
              transitionProperty="color"
              transitionDuration="0.2s"
            >
              <Icon as={BsDiscord} w={8} h={8} display="block" />
            </Link>
            {isAfterStage(PageState.PreAuction) && (
              <Link
                href={`${process.env.NEXT_PUBLIC_OPENSEA_URL}collection/voxelglyph`}
                title="OpenSea"
                target="_blank"
                color="#7a7a7a"
                _hover={{ color: 'white' }}
                transition="ease"
                transitionProperty="color"
                transitionDuration="0.2s"
              >
                <Icon as={SiOpensea} w={8} h={8} display="block" />
              </Link>
            )}
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Footer
