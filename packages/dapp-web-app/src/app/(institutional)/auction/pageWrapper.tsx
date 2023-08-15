'use client'

import { AuctionProvider } from 'contexts/auction'
import AuctionContent from './content'

const AuctionPageWrapper = () => {
  return (
    <AuctionProvider>
      <AuctionContent />
    </AuctionProvider>
  )
}

export default AuctionPageWrapper
