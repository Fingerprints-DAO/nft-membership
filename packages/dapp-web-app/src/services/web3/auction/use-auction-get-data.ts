import { auctionABI } from '../generated'
import { Address } from 'viem'
import { AuctionData } from 'types/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { useQuery } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getAuctionDataKey } from './keys'
import { Interval } from 'types/interval'

const useAuctionGetAuctionData = (): AuctionData => {
  const { contracts } = useNftMembershipContext()

  const request = async () => {
    const data = await readContract({
      address: contracts.Auction.address as Address,
      abi: auctionABI,
      functionName: 'getData',
    })

    return data
  }

  const { data: auctionData } = useQuery(getAuctionDataKey, request, {
    // refetchInterval: Interval.Pooling,
    // refetchIntervalInBackground: true,
  })

  if (!auctionData) {
    return {
      highestBidder: '' as Address,
      highestBid: BigInt(0),
    }
  }

  return auctionData
}

export default useAuctionGetAuctionData

// TODO:
//  - check if address has ens
