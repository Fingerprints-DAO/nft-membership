import BigNumber from 'bignumber.js'
import { useAuctionGetConfig as useGenAuctionGetConfig } from '../generated'
import { Address, formatEther } from 'viem'
import { AuctionConfig } from 'types/auction'
import { useNftMembershipContext } from 'contexts/nft-membership'

const useAuctionGetConfig = (): AuctionConfig => {
  const { contracts } = useNftMembershipContext()

  const { data: config } = useGenAuctionGetConfig({
    address: contracts.Auction.address as Address,
  })

  if (!config) {
    return {
      startTime: BigNumber(0),
      endTime: BigNumber(0),
      minBidIncrementInWei: BigNumber(0),
    }
  }

  return {
    startTime: BigNumber(config.startTime as any),
    endTime: BigNumber(config.endTime as any),
    minBidIncrementInWei: BigNumber(formatEther(config.minBidIncrementInWei || BigInt(0))),
  }
}

export default useAuctionGetConfig
