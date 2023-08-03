'use client'

import { Box } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, Suspense, useEffect, useState } from 'react'

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
        <motion.div
          key={pathname}
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
        >
          {children}
        </motion.div>
      </Suspense>
    </AnimatePresence>
  )
}

export default Transition
