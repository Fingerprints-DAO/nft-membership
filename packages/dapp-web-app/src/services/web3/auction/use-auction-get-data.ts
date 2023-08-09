import BigNumber from 'bignumber.js'

const useAuctionGetAuctionData = () => {
  const { data: auctionData } = useGenAuctionGetData()

  if (!auctionData) {
    return {
      address: '',
      highestBid: BigNumber(0),
    }
  }

  return auctionData
}

export default useAuctionGetAuctionData
