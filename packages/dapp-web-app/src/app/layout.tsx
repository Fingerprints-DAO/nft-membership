import '../../public/styles/global.css'

import { Metadata } from 'next'
import Providers from 'contexts/providers'
import React, { PropsWithChildren } from 'react'
import Script from 'next/script'

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
  twitter: {
    card: 'summary_large_image',
    site: 'https://migration.fingerprintsdao.xyz/',
    creator: '@FingerprintsDAO',
  },
  openGraph: {
    type: 'website',
    url: 'https://migration.fingerprintsdao.xyz/',
  },
}

function RootLayout({ children, modals }: PropsWithChildren<Modals>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9708Z1PECC"
          strategy="afterInteractive"
          async
        />
        <Script
          strategy="afterInteractive"
          id="gtm"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-9708Z1PECC');`,
          }}
        />
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
