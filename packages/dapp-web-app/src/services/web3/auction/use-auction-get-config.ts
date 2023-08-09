import BigNumber from 'bignumber.js'

const useAuctionGetConfig = () => {
  const { data: config } = useGenAuctionGetConfig()

  if (!config) {
    return {
      startTime: BigNumber(0),
      endTime: BigNumber(0),
      minBidIncrementInWei: BigNumber(0),
    }
  }

  return config
}

export default useAuctionGetConfig
