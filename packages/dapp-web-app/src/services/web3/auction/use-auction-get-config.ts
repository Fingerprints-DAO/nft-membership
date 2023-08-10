import BigNumber from 'bignumber.js'
import { useAuctionGetConfig as useGenAuctionGetConfig } from '../generated'
import { Address } from 'viem'
import { AuctionConfig } from 'types/auction'

const useAuctionGetConfig = (auctionContractAddress: string): AuctionConfig => {
  const { data: config } = useGenAuctionGetConfig({
    address: auctionContractAddress as Address,
  })

  if (!config) {
    return {
      startTime: BigNumber(0),
      endTime: BigNumber(0),
      minBidIncrementInWei: BigInt(0),
    }
  }

  return {
    startTime: BigNumber(config.startTime as any),
    endTime: BigNumber(config.endTime as any),
    minBidIncrementInWei: config.minBidIncrementInWei,
  }
}

export default useAuctionGetConfig
