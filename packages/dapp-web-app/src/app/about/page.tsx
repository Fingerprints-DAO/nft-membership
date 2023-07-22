'use client'

import { Box, GridItem, Link, Text, Img } from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'
import NextImage from 'next/image'
import about1 from '../../../public/images/about-1.png'
import about2 from '../../../public/images/about-2.png'

const AboutPage = () => {
  return (
    <>
      <Header />
      <Box as="section" pt={{ base: 14, md: '88px' }} pb="120px">
        <Grid mb={{ base: 16, sm: '72px' }}>
          <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 6, md: 10 }}>
            <Text as="h1" fontSize="3xl" lineHeight="normal" fontWeight="bold" mb={4}>
              FP&apos;s membership in NFT
            </Text>
            <Text color="gray.300" fontSize="lg" fontWeight="light" lineHeight={6}>
              Fingerprints DAO is undergoing an exciting evolution based on community voting. We have decided to exchange our ERC-20 governance tokens
              ($PRINTS) for ERC-721 NFTs. This transition represents a shift towards enhanced community representation and engagement. By phasing out
              the previous governance token and introducing unique NFTs, we aim to provide an immersive and exclusive experience for our members,
              reinforcing their ownership and influence within Fingerprints.
            </Text>
          </GridItem>
        </Grid>
        <Grid mb={{ base: 16, sm: '72px' }}>
          <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 2, md: 3 }} mb={{ base: 8, sm: 0 }}>
            <Img src={about1.src} borderRadius={8} alt="NFTs designed by LarvaLabs" />
          </GridItem>
          <GridItem colStart={{ md: 5 }} colSpan={{ base: 4, sm: 4, md: 7 }}>
            <Text as="h1" fontSize="3xl" lineHeight="normal" fontWeight="bold" mb={4}>
              NFTs designed by LarvaLabs
            </Text>
            <Text color="gray.300" fontSize="lg" lineHeight={6} mb={6} fontWeight="light">
              We are thrilled to announce our partnership with LarvaLabs, the renowned pioneers in the NFT space. This collaboration brings together
              their exceptional designs and expertise with our community-focused approach at Fingerprints.
            </Text>
            <Text color="gray.300" fontSize="lg" lineHeight={6} fontWeight="light">
              Together, we are creating an exclusive NFT collection that represents the membership of our vibrant community, adding even more value to
              being a part of Fingerprints. This partnership solidifies our position as leaders in the digital art and NFT landscape, offering our
              members an unparalleled experience and recognition within the community.
            </Text>
          </GridItem>
        </Grid>
        <Grid>
          <GridItem colStart={{ md: 9 }} colSpan={{ base: 4, sm: 2, md: 3 }} order={{ base: 1, sm: 2, md: 2 }} mb={{ base: 8, sm: 0 }}>
            <Img src={about2.src} borderRadius={8} alt="And Fingerprints DAO" />
          </GridItem>
          <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 4, md: 7 }} order={{ base: 1, sm: 1, md: 1 }}>
            <Text as="h1" fontSize="3xl" lineHeight="normal" fontWeight="bold" mb={4}>
              And Fingerprints DAO
            </Text>
            <Text color="gray.300" fontSize="lg" lineHeight={6} mb={6} fontWeight="light">
              Described as the home of blockchain art,{' '}
              <Link color="links.500" href="https://fingerprintsdao.xyz" title="Fingerprints" target="_blank">
                Fingerprints
              </Link>{' '}
              is an organization dedicated to collecting and supporting the best art built on top of blockchain technology.
            </Text>
            <Text color="gray.300" fontSize="lg" lineHeight={6} mb={6} fontWeight="light">
              Consisting of over 250 collectors, its open community manages a shared treasury and notable collection of NFT art assembled by its
              curatorial committee.
            </Text>
            <Text color="gray.300" fontSize="lg" lineHeight={6} fontWeight="light">
              Fingerprints and its community are glad to support the making and auctioning of this collection.
            </Text>
          </GridItem>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default AboutPage