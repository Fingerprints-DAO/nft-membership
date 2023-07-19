'use client'

import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, Flex, GridItem, Text, useDisclosure } from '@chakra-ui/react'
import Image from 'next/image'
import logoFP from '/public/images/logo-fp.svg'
import logoFPDark from '/public/images/logo-fp-dark.svg'
import { HamburgerIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import useMediaQuery from 'hooks/use-media-query'
import { usePathname } from 'next/navigation'
import Grid from 'components/grid'
import { useMemo } from 'react'
import Wallet from 'components/wallet'

const Header = () => {
  const pathname = usePathname()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMobile] = useMediaQuery('(max-width: 767px)')

  const nav = useMemo(() => {
    const arr = [{ href: '/', label: 'home' }]

    if (isMobile) {
      arr.push({ href: '/auction', label: 'auction' }, { href: 'mailto:a@a.com', label: 'contact us' })
    } else {
      arr.push({ href: '#about', label: 'about' }, { href: '#faq', label: 'FAQ' }, { href: '/auction', label: 'auction' })
    }

    return arr
  }, [isMobile])

  return (
    <>
      <Grid as="header" py={8}>
        <GridItem colSpan={[3, 1]} colStart={[1, 1, 1, 2]}>
          <Link href="/">
            <Image src={logoFP} alt="Fingerprints DAO" />
          </Link>
        </GridItem>
        <GridItem as={Flex} justifyContent="end" alignItems="center" colSpan={[1, 5, 11, 9]}>
          {isMobile ? (
            <Box as="button" p={4} mr={-4} onClick={onOpen}>
              <HamburgerIcon display="block" w={4} />
            </Box>
          ) : (
            <Flex as="nav" display="flex" alignItems="center">
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
              <Wallet variant="header" />
            </Flex>
          )}
        </GridItem>
      </Grid>
      <Drawer isOpen={isOpen} placement="left" size="full" isFullHeight={true} onClose={onClose}>
        <DrawerContent h="full" bg="gray.50">
          <Grid as="header" py={8}>
            <GridItem colSpan={3}>
              <Link href="/">
                <Image src={logoFPDark} alt="Fingerprints DAO" width={54} height={64} />
              </Link>
            </GridItem>
            <GridItem as={Flex} justifyContent="end" alignItems="center">
              <DrawerCloseButton position="static" color="gray.900" size="lg" w={12} h={12} mr={-4} />
            </GridItem>
          </Grid>
          <DrawerBody mt={8} px={8}>
            {nav.map((item, index) => {
              const isLastChild = nav.length - 1 === index
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
            {/* <ConnectKitButton /> */}
            <Wallet variant="drawer" />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Header
