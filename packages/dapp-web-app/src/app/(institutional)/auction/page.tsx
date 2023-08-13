'use client'

import { AuctionProvider } from 'contexts/auction'
import AuctionContent from './content'

const AuctionPage = () => {
  return (
    <AuctionProvider>
      <AuctionContent />
    </AuctionProvider>
  )
}

export default AuctionPage
