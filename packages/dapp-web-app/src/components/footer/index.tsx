'use client'

import { Link, Box, Flex, Icon, Text, GridItem } from '@chakra-ui/react'
import Grid from 'components/grid'
import useMediaQuery from 'hooks/use-media-query'
import { BsDiscord } from 'react-icons/bs'
import { BsTwitter } from 'react-icons/bs'
import { SiOpensea } from 'react-icons/si'

type FooterProps = {
  isHome?: boolean
}

const Footer = ({ isHome = false }: FooterProps) => {
  const [isMobile] = useMediaQuery('(max-width: 767px)')

  return (
    <Box as="footer" py={[8, 6]} bg={isHome ? 'transparent' : 'gray.900'} position="relative" zIndex={10}>
      <Grid gridTemplateColumns={isMobile ? 'none' : undefined} alignItems={'center'}>
        <GridItem colSpan={{ base: 4, sm: 4, md: 9, xl: 8 }} colStart={{ base: 1, xl: 2 }}>
          <Flex mb={{ base: 6, sm: 'unset' }} flexDirection="column" alignItems={{ base: '', sm: 'flex-start' }}>
            <Text fontSize="xs" color="#7a7a7a" textAlign={['center', 'unset']} mb={[3, 1]}>
              By Fingerprints DAO & developed by{' '}
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
            <Text fontSize="xs" color="#7a7a7a" textAlign={['center', 'unset']}>
              Fingerprints Foundation, Cricket Square, Hutchins Drive, P.O. Box 2681, Grand Cayman
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 4, sm: 2, md: 3, xl: 2 }}>
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
              href="https://discord.gg/aePw7mqz6U"
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
            <Link
              href={`${process.env.NEXT_PUBLIC_OPENSEA_URL}collection/maschine`}
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
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Footer
