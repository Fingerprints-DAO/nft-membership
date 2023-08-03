import '../../public/styles/global.css'

import { Metadata } from 'next'
import Providers from 'contexts/providers'
import React, { PropsWithChildren } from 'react'

type Modals = {
  modals: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    template: '%s | Fingerprints DAO membership NFT',
    default: 'Voxelglyphs',
  },
  description:
    'Fingerprints membership is moving from 5,000 $PRINTS to an NFT designed by Larva Labs',
}

function RootLayout({ children, modals }: PropsWithChildren<Modals>) {
  return (
    <html lang="en">
      <body>
        <main id="main">
          <Providers>
            {children}
            {modals}
          </Providers>
        </main>
      </body>
    </html>
  )
}

export default RootLayout
