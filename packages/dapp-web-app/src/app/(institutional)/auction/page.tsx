import { Metadata } from 'next'
import AuctionPageWrapper from './pageWrapper'

export const metadata: Metadata = {
  title: 'Fingerprints Membership Auction',
}

const AuctionPage = () => {
  return <AuctionPageWrapper />
}

export default AuctionPage
