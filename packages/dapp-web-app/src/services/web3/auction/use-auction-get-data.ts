import { auctionABI } from '../generated'
import { Address, formatEther } from 'viem'
import { AuctionData } from 'types/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { useEnsName, useQuery } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getAuctionDataKey } from './keys'
import { Interval } from 'types/interval'
import BigNumber from 'bignumber.js'

const useAuctionGetAuctionData = (): AuctionData => {
  const { contracts } = useNftMembershipContext()

  const request = async () => {
    try {
      const data = await readContract({
        address: contracts.Auction.address as Address,
        abi: auctionABI,
        functionName: 'getData',
      })

      return data
    } catch (error) {
      console.log('error', error)
    }
  }

  const { data: auctionData } = useQuery(getAuctionDataKey, request, {
    refetchInterval: Interval.Pooling,
    refetchIntervalInBackground: true,
  })

  const { data: ensName } = useEnsName({
    address: auctionData?.highestBidder,
    enabled: !!auctionData?.highestBidder,
  })

  if (!auctionData) {
    return {
      highestBidder: '' as Address,
      highestBid: BigNumber(0),
    }
  }

  return {
    highestBidder: (ensName || auctionData.highestBidder) as Address,
    highestBid: BigNumber(formatEther(auctionData.highestBid)),
  }
}

export default useAuctionGetAuctionData
