'use client'

import { Box, GridItem, Heading, Text } from '@chakra-ui/react'
import Footer from 'components/footer'
import Grid from 'components/grid'
import Header from 'components/header'

const questions = [
  {
    question: 'Why is Fingerprints DAO transitioning from ERC-20 tokens to ERC-721 NFTs?',
    answer: `Fingerprints DAO believes that ERC-721 NFTs offer a more immersive and unique representation of membership, enhancing the value and engagement of our community.`,
  },
  {
    question: 'What is Fingerprints DAO?',
    answer: `Fingerprints DAO is an online community and platform for collecting and creating digital art. It is made up of over 250 members with a shared treasury and a decentralized governance model. It is well known for its collection of highly prized NFTs and its studio that launches collections in partnership with trending artists.`,
  },
  {
    question: 'What is the collection size?',
    answer: `The collection will be capped at 1,000 unique generative pieces.`,
  },
  {
    question: 'How will the auction work?',
    answer:
      "The collection will be sold in its entirety thourgh a live Dutch auction, a type of auction where the price of an item is gradually lowered over time until a buyer is found. In the context of NFTs, this means that the price of the NFTs auctioned will decrease over time during the auction period, and collectors will be able to acquire their pieces when the price reaches whatever level they're happy buying at.",
  },
  {
    question: 'What will be the price?',
    answer:
      'The auction will have a starting price of 2ETH and a resting price of 0.2ETH and will end after 90 minutes, regardless of whether all the 1,000 NFTs are sold.',
  },
  {
    question: 'What will happen if not all NFTs in the collection are minted during the auction?',
    answer:
      'If not all NFTs are minted after 90 minutes, the auction will end and the collection supply will be capped at whatever amount was minted during the auction.',
  },
  {
    question: 'Will there be a rebate?',
    answer:
      'Yes, collectors will be entitled to a rebate if the price they paid is larger than the final auction price. The rebate funds will be stored trustlessly in our auction smart contract, and the rebates will be able to be claimed directly from it through this website.',
  },
  {
    question: 'How does the rebate work?',
    answer:
      'At the end of the auction, buyers who paid more than the last sell price can claim a refund equal to the difference between their purchase price and the last sell price. This process is done trustlessly using the auction contract. During the auction, participants will be able to observe the amount of rebate they have pending as the price decreases, and will be able to claim more NFTs for the same committed ETH if they wish to.',
  },
  {
    question: `Can I participate in the Dutch auction if I don't have a cryptocurrency wallet?`,
    answer: 'No, you must have a cryptocurrency wallet like Metamask to participate in the auction.',
  },
  {
    question: 'Is there a limit to the number of NFTs I can purchase?',
    answer:
      'Yes, there is a total amount limit of US$10,000 per wallet for the NFT sale, thus there will also be a limit on the number of NFTs you can purchase. The specific quantity will depend on the price of ETH, the latest price of the auction and the total quantity of NFTs still available for the sale.',
  },
  {
    question: 'Is the rebate automatically refunded to my cryptocurrency wallet?',
    answer: 'No, after the auction has ended, you will need to claim your rebate by following the instructions provided on the minting page.',
  },
  {
    question: 'Can I sell the NFTs I purchase through the Dutch auction selling method to other users?',
    answer: "Yes, after purchasing an NFT through the Dutch auction you'll be able to sell it to other users on secondary marketplaces.",
  },
  {
    question: 'Are there any fees associated with participating in a Dutch auction NFT sale?',
    answer: "Yes, there will be gas fees for certain interactions with the project's smart contracts, such as bidding and claiming your rebate.",
  },
  {
    question: 'Can anyone participate in the auction?',
    answer:
      'No, only collectors based in the following countries will be allowed to participate in the auction: Austria, Belgium, Brazil, Bulgaria, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Republic of Cyprus, Romania, Singapore, Slovakia, Slovenia, Spain, Sweden, United Kingdom, United States.',
  },
  {
    question: 'Why is the auction limited to only these countries?',
    answer: 'The jurisdictions were limited to allow Fingerprints to more easily comply with all tax obligations relevant to this drop.',
  },
]

const FaqPage = () => {
  return (
    <>
      <Header />
      <Box as="section" pt={{ base: 14, md: '88px' }} pb={{ base: 10, md: 20 }}>
        <Grid>
          <GridItem colStart={{ md: 2 }} colSpan={{ base: 4, sm: 6, md: 10 }}>
            <Text as="h1" fontSize="3xl" fontWeight="bold" mb={8}>
              FAQ
            </Text>
            <Box>
              {questions.map((item, index) => {
                const isLastChild = questions.length - 1 === index

                return (
                  <Box py={8} borderBottomColor="gray.700" borderBottomWidth={!isLastChild ? 1 : 0} key={index} id={`q-${index}`}>
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
      <Footer />
    </>
  )
}

export default FaqPage
