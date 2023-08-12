'use client'

import { Box, GridItem, Link, Text } from '@chakra-ui/react'
import Grid from 'components/grid'

const questions = [
  {
    question: 'Why is Fingerprints DAO transitioning from ERC-20 tokens to ERC-721 NFTs?',
    answer: `Fingerprints DAO believes that ERC-721 NFTs offer a more immersive and unique representation of membership, enhancing the value and engagement of our community.`,
  },
  {
    question:
      'Will there be any costs associated with the transition from ERC-20 tokens to ERC-721 NFTs?',
    answer: `Fingerprints DAO is committed to minimizing costs for token holders during the transition process. Details regarding any associated costs, if applicable, will be communicated transparently.`,
  },
  {
    question: 'How will ERC-721 NFTs be utilized for governance within Fingerprints DAO?',
    answer: `ERC-721 NFTs will serve as a representation of membership and influence within the DAO, allowing holders to participate in governance decisions and access exclusive experiences.`,
  },
  {
    question: 'Who will be creating the NFTs for Fingerprints DAO?',
    answer:
      'Fingerprints DAO has partnered with renowned NFT creators, such as LarvaLabs, to design and create the NFTs for the transition.',
  },
  {
    question:
      'Can you provide more information about the rules and guidelines for the auction of NFTs?',
    answer: (
      <>
        Fingerprints DAO will provide detailed information about the rules, guidelines, and
        procedures for NFT auctions, including the auction for the inaugural NFT, in{' '}
        <Link
          color="links.500"
          title="auction page"
          href="/auction"
          style={{ textDecoration: 'none' }}
          transition="opacity 0.2s"
          _hover={{ opacity: 0.5 }}
        >
          auction page
        </Link>{' '}
        and communications.
      </>
    ),
  },
  {
    question:
      'Will there be limitations on the utility of NFTs acquired through the auction for governance purposes?',
    answer:
      'NFTs acquired through the auction will retain their utility for governance within Fingerprints DAO, allowing holders to continue participating in the decision-making processes.',
  },
  {
    question: 'Will there be opportunities to acquire NFTs outside of the auction?',
    answer:
      'Yes, Fingerprints DAO provide opportunities for token holders to exchange their $PRINTS tokens for membership NFTs outside of the auction. This ensures an alternative method for acquiring NFTs that represent Fingerprints DAO membership. Further details and instructions for the token-to-NFT exchange will be communicated through official channels.',
  },
]

const FaqPage = () => {
  return (
    <Box as="section" pt={{ base: 14, md: '88px' }} pb={{ base: 10, md: 20 }}>
      <Grid>
        <GridItem colStart={{ xl: 2 }} colSpan={{ base: 4, sm: 6, md: 12, xl: 10 }}>
          <Text as="h1" fontSize="3xl" fontWeight="bold" mb={8}>
            FAQ
          </Text>
          <Box>
            {questions.map((item, index) => {
              const isLastChild = questions.length - 1 === index

              return (
                <Box
                  py={8}
                  borderBottomColor="gray.700"
                  borderBottomWidth={!isLastChild ? 1 : 0}
                  key={index}
                  id={`q-${index}`}
                >
                  <Text as="strong" fontSize="lg" display="block" color="gray.100">
                    {item.question}
                  </Text>
                  <Text color="gray.300">{item.answer}</Text>
                </Box>
              )
            })}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default FaqPage
