'use client'

import { Box } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, Suspense } from 'react'

const Transition = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const variants = {
    out: {
      opacity: 0,
      transition: {
        duration: 0.15,
      },
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.15,
        delay: 0.05,
      },
    },
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      <Suspense fallback={null}>
        <Box
          as={motion.div}
          key={pathname}
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
          height={'full'}
          display={'flex'}
          flexDir={'column'}
          justifyContent={'flex-start'}
        >
          {children}
        </Box>
      </Suspense>
    </AnimatePresence>
  )
}

export default Transition
