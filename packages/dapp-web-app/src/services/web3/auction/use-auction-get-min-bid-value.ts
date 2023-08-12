import { auctionABI } from '../generated'
import { Address, formatEther } from 'viem'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { useQuery } from 'wagmi'
import { readContract } from '@wagmi/core'
import { getMinBidValueKey } from './keys'
import { Interval } from 'types/interval'
import BigNumber from 'bignumber.js'

const useAuctionGetMinBidValue = () => {
  const { contracts } = useNftMembershipContext()

  const request = async () => {
    const data = await readContract({
      address: contracts.Auction.address as Address,
      abi: auctionABI,
      functionName: 'calculateMinBidIncrement',
    })

    return BigNumber(formatEther(data))
  }

  const { data: minBidValue } = useQuery(getMinBidValueKey, request, {
    refetchInterval: Interval.Pooling,
    refetchIntervalInBackground: true,
  })

  return minBidValue || BigNumber(0)
}

export default useAuctionGetMinBidValue
