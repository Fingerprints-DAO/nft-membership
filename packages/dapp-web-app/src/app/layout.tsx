import '../assets/styles/global.css'

import type { Metadata } from 'next'
import Providers from 'contexts/providers'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'NFT Membership',
  description: 'Generated by create next app',
}

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main id="main">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
