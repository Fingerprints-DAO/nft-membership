import { auctionABI } from '../generated'
import { Address, formatEther } from 'viem'
import { AuctionData } from 'types/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { useQuery } from 'wagmi'
import { fetchEnsName, readContract } from '@wagmi/core'
import { getAuctionDataKey } from './keys'
import { Interval } from 'types/interval'
import BigNumber from 'bignumber.js'

const useAuctionGetAuctionData = (): AuctionData => {
  const { contracts } = useNftMembershipContext()

  const request = async () => {
    const data = await readContract({
      address: contracts.Auction.address as Address,
      abi: auctionABI,
      functionName: 'getData',
    })

    const ensName = await fetchEnsName({ address: data.highestBidder })

    return {
      highestBidder: (ensName || data.highestBidder) as Address,
      //   highestBid: BigNumber(formatEther(data.highestBid || BigInt(0))),
      highestBid: data.highestBid,
    }
  }

  const { data: auctionData } = useQuery(getAuctionDataKey, request, {
    // refetchInterval: Interval.Pooling,
    // refetchIntervalInBackground: true,
  })

  if (!auctionData) {
    return {
      highestBidder: '' as Address,
      highestBid: BigNumber(0),
    }
  }

  return {
    ...auctionData,
    highestBid: BigNumber(formatEther(auctionData.highestBid)),
  }
}

export default useAuctionGetAuctionData
