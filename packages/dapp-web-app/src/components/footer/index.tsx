'use client'

import { Link, Box, Flex, Icon, Text, GridItem } from '@chakra-ui/react'
import Grid from 'components/grid'
import { BsDiscord } from 'react-icons/bs'
import { BsTwitter } from 'react-icons/bs'
import { SiOpensea } from 'react-icons/si'

type FooterProps = {
  isHome?: boolean
}

const Footer = ({ isHome = false }: FooterProps) => {
  return (
    <Box as="footer" py={[8, 6]} mt={[25]} bg="gray.900">
      <Grid gridTemplateColumns="none">
        <GridItem colSpan={4}>
          <Flex mb={[6, 'unset']} flexDirection={['column', 'row']} alignItems={['', 'center']}>
            <Link
              href="mailto:contact@fingerprintsdao.xyz"
              fontSize="lg"
              color="gray.50"
              fontWeight="bold"
              lineHeight="24px"
              mb={[6, 8]}
              display="block"
              textAlign={['center', 'unset']}
            >
              contact us
            </Link>
            <Text fontSize="xs" color="gray.500" textAlign={['center', 'unset']} mb={[3, 1]}>
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
            <Text fontSize="xs" color="gray.500" textAlign={['center', 'unset']}>
              Fingerprints Foundation, Cricket Square, Hutchins Drive, P.O. Box 2681, Grand Cayman
            </Text>
          </Flex>
        </GridItem>
        <GridItem colSpan={[4, 2]}>
          <Flex justifyContent="center" gap={4}>
            <Link
              href="https://twitter.com/FingerprintsDAO"
              title="Twitter"
              target="_blank"
              color={isHome ? 'rgba(255,255,255,0.5)' : 'gray.500'}
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
              color={isHome ? 'rgba(255,255,255,0.5)' : 'gray.500'}
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
              color={isHome ? 'rgba(255,255,255,0.5)' : 'gray.500'}
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
