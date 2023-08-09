import BigNumber from 'bignumber.js'

const useAuctionGetMinBidValue = () => {
  const { data: minBidValue } = useAuctionCalculateMinBidIncrement()

  if (!minBidValue) {
    return BigNumber(0)
  }

  return minBidValue
}

export default useAuctionGetMinBidValue
