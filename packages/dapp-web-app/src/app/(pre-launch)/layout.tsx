'use client'

import { PropsWithChildren } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const RootLayout = ({ children }: PropsWithChildren) => {
  const bgImage = '/images/voxelgif-opt.gif';

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Box
          as="section"
          minH="100vh"
          minW="100vw"
          bg={`url(${bgImage}) center/cover no-repeat`}
          pos="relative"
        >
          <Box
            w="full"
            minH="100%"
            bg="black"
            opacity={0.7}
            pos="absolute"
            zIndex={0}
          />
          <Box zIndex={1} pos="relative">
            {children}
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default RootLayout;
