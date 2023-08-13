'use client'

import { Box, GridItem, Link, Text } from '@chakra-ui/react'
import Grid from 'components/grid'

const questions = [
  {
    question: 'How will the migration work?',
    answer:
      "Starting at 11:00am ET on Aug 16, holders of Fingerprints' current token ($PRINTS) will be able to exchange 5,000 units for one Voxelglyph via this website.",
  },
  {
    question: 'Do I get to keep my 5,000 $PRINTS and the Voxelglyph after migrating?',
    answer:
      'No, once you have executed the migration the $PRINTS tokens will be burned and you will receive your Voxelglyph.',
  },
  {
    question: 'How long will members be able to migrate their $PRINTS for?',
    answer:
      'The migration website will be launched on August 16th and will remain open indefinitely, so you can migrate your $PRINTS whenever you feel like.',
  },
  {
    question: "I don't have 5,000 $PRINTS, how can I acquire it?",
    answer: (
      <>
        Just follow the instructions{' '}
        <Link
          color="links.500"
          href="https://fingerprintsdao.xyz/join"
          style={{ textDecoration: 'none' }}
          transition="opacity 0.2s"
          _hover={{ opacity: 0.5 }}
        >
          on this page.
        </Link>{' '}
      </>
    ),
  },
  {
    question: 'I have a multiple of 5,000 $PRINTS, can I get multiple Voxelglyphs?',
    answer:
      'Yes! For every 5,000 $PRINTS burned, you get 1 Voxelglyph. If you have 10,000 $PRINTS, you can exchange them for 2 Voxelgyphs. If you have 14,000 $PRINTS, you can top up to 15,000 using the pool and migrate to get yourself 3 Voxelgyphs, and so on.',
  },
  {
    question: 'Will all Voxelglyphs be the same?',
    answer:
      'Yes, Voxelglyph will be an edition piece of up to 2,000 equal pieces, the only difference between them being their token IDs, which will be assigned in order of migration.',
  },
  {
    question: 'What is the maximum supply of Voxelglyphs?',
    answer:
      'Voxelglyphs can only be created through the burning of $PRINTS. Since there are just 10M $PRINTS tokens, using the exchange rate of 1:5000, the max supply of Voxelglyphs will be exactly 2,000 pieces.',
  },
  {
    question:
      'I want to get Voxelglyph #1, should I arrive early and try to migrate before everyone else?',
    answer:
      'No, in celebration of this landmark event, the DAO will Auction the first generated Voxelglyph, starting a day before the migration, on August 15 and ending on the day of the migration launch.',
  },
  {
    question:
      'I executed the migration and received my Voxelglyph, could I now turn my Voxelglyph into 5,000 $PRINTS again?',
    answer:
      "No. The migration is one-way, meaning once you have migrated your ERC-20 $PRINTS tokens into the Voxelglyph you won't be able to swap it back, ensuring a full transition to the new governance standard in the long-run.",
  },
  {
    question:
      "I don't want to go through the process of buying 5,000 $PRINTS and then exchange them, can I just buy a Voxelglyph somewhere?",
    answer:
      'As an NFT, Voxelglyph will be on NFT marketplaces like Opensea and Blur, but you will have to wait for members to migrate and then list their Voxelglyphs for sale (if anyone chooses to do so).',
  },
  {
    question: 'Why is Fingerprints transitioning from ERC-20 to ERC-721?',
    answer:
      'This transition will yield many benefits to our DAO, such as: (1) easier access to membership through NFT marketplaces, (2) making membership itself more appealing by incorporating a piece of art from Larva Labs, (3)  simplifying the membership experience and onboarding, (4) freeing resources from existing liquidity pools and (5) enabling the potential for direct on-chain governance in the future.',
  },
  {
    question:
      'I still have some questions that were not answered in this FAQ, where can I ask them?',
    answer: (
      <>
        <Link
          color="links.500"
          href="https://discord.gg/Mg7wx36upM"
          style={{ textDecoration: 'none' }}
          transition="opacity 0.2s"
          _hover={{ opacity: 0.5 }}
        >
          Through our discord
        </Link>
        , where we will try to answer all the questions we can. If you have questions regarding
        Fingerprints itself, you can also check{' '}
        <Link
          color="links.500"
          href="https://fingerprintsdao.xyz/"
          style={{ textDecoration: 'none' }}
          transition="opacity 0.2s"
          _hover={{ opacity: 0.5 }}
        >
          our website
        </Link>
        .
      </>
    ),
  },
]

const FaqPage = () => {
  return (
    <Box as="section" pt={{ base: 12, md: '88px' }} pb={{ base: 10, md: 20 }}>
      <Grid>
        <GridItem colStart={{ xl: 2 }} colSpan={{ base: 4, sm: 6, md: 12, xl: 10 }}>
          <Text
            as="h1"
            fontWeight="bold"
            fontSize={{ base: 'xl', md: '2xl' }}
            mb={{ base: 4, md: 8 }}
          >
            Frequently Asked Questions
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
                  <Text
                    as="strong"
                    fontSize={{ base: 'md', md: 'lg' }}
                    display="block"
                    color="gray.100"
                  >
                    {item.question}
                  </Text>
                  <Text color="gray.300" mt={4}>
                    {item.answer}
                  </Text>
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
