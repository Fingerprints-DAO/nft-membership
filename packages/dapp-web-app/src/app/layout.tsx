import '../../public/styles/global.css'

import { Metadata } from 'next'
import Providers from 'contexts/providers'
import React, { PropsWithChildren } from 'react'

type Modals = {
  modals: React.ReactNode
}

export const metadata: Metadata = {
  title: 'NFT Membership',
  description: 'Generated by create next app',
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
