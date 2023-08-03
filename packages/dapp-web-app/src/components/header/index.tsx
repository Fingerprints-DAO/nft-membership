'use client'

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  Flex,
  GridItem,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image'
import logoFP from '/public/images/logo-fp.svg'
import logoFPDark from '/public/images/logo-fp-dark.svg'
import { HamburgerIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useMediaQuery from 'hooks/use-media-query'
import { usePathname } from 'next/navigation'
import Grid from 'components/grid'
import Wallet from 'components/wallet'

const nav = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
  { href: '/faq', label: 'FAQ' },
  { href: '/auction', label: 'auction' },
]

const mobileNav = [
  ...nav,
  { href: 'mailto:contact@fingerprintsdao.xyz', label: 'contact us' },
]

const Header = () => {
  const pathname = usePathname()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMobile] = useMediaQuery('(max-width: 767px)')

  return (
    <>
      <Grid as="header" py={8} position="relative" zIndex={10}>
        <GridItem colSpan={{ base: 3, sm: 1 }} colStart={{ base: 1, xl: 2 }}>
          <Link href="/">
            <Image src={logoFP} alt="Fingerprints DAO" />
          </Link>
        </GridItem>
        <GridItem colSpan={{ base: 1, sm: 5, md: 11, xl: 9 }}>
          {isMobile ? (
            <Flex
              as="nav"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              h="full"
            >
              <Box as="button" boxSize={[6, 25]} onClick={onOpen}>
                <HamburgerIcon display="block" boxSize="100%" />
              </Box>
            </Flex>
          ) : (
            <Flex
              as="nav"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              h="full"
            >
              {nav.map((item, index) => {
                const isActive = pathname === item.href

                return (
                  <Box
                    key={index}
                    as={Link}
                    href={item.href}
                    title={item.label}
                    mr={14}
                    _hover={{ color: 'secondary.500' }}
                    color={isActive ? 'secondary.500' : 'white'}
                    transition="ease"
                    transitionProperty="color"
                    transitionDuration="0.2s"
                  >
                    <Text as="strong" fontSize="lg">
                      {item.label}
                    </Text>
                  </Box>
                )
              })}
              <Wallet variant="header" buttonWidth="auto" />
            </Flex>
          )}
        </GridItem>
      </Grid>
      <Drawer
        isOpen={isOpen}
        placement="left"
        size="full"
        isFullHeight={true}
        onClose={onClose}
      >
        <DrawerContent h="full" bg="gray.50">
          <Grid as="header" py={8}>
            <GridItem colSpan={3}>
              <Link href="/">
                <Image
                  src={logoFPDark}
                  alt="Fingerprints DAO"
                  width={54}
                  height={64}
                />
              </Link>
            </GridItem>
            <GridItem as={Flex} justifyContent="end" alignItems="center">
              <DrawerCloseButton
                position="static"
                color="gray.900"
                size="lg"
                w={12}
                h={12}
                mr={-4}
              />
            </GridItem>
          </Grid>
          <DrawerBody mt={8} px={8}>
            {mobileNav.map((item, index) => {
              const isLastChild = mobileNav.length - 1 === index
              const isActive = pathname === item.href

              return (
                <Box
                  key={index}
                  as={Link}
                  href={item.href}
                  title={item.label}
                  mb={!isLastChild ? 8 : 0}
                  color={isActive ? 'secondary.500' : 'gray.900'}
                  display="block"
                  onClick={onClose}
                >
                  <Text as="strong" fontSize="1.75rem">
                    {item.label}
                  </Text>
                </Box>
              )
            })}
          </DrawerBody>
          <DrawerFooter px={8} pb={12}>
            <Wallet variant="drawer" />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Header
