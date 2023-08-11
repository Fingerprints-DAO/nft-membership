import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import useAuctionGetConfig from 'services/web3/auction/use-auction-get-config'
import { AuctionState, AuctionConfig, AuctionData } from 'types/auction'
import dayjs from 'dayjs'
import useAuctionGetAuctionData from 'services/web3/auction/use-auction-get-data'
import useAuctionGetMinBidValue from 'services/web3/auction/use-auction-get-min-bid-value'

type AuctionContextState = {
  auctionConfig: AuctionConfig
  auctionData: AuctionData
  auctionState: AuctionState
  minBidValue: bigint
}

const DEFAULT_CONTEXT = {} as AuctionContextState

const AuctionContext = createContext(DEFAULT_CONTEXT)

const getCurrentState = (startTime?: number, endTime?: number) => {
  if (!startTime || !endTime) {
    return AuctionState.NOT_STARTED
  }

  const now = dayjs()
  const start = dayjs.unix(startTime)
  const end = dayjs.unix(endTime)

  if (now.isAfter(end)) {
    return AuctionState.ENDED
  }

  if (now.isAfter(start)) {
    return AuctionState.STARTED
  }

  return AuctionState.NOT_STARTED
}

const AuctionProvider = ({ children }: PropsWithChildren) => {
  const auctionConfig = useAuctionGetConfig()
  const auctionData = useAuctionGetAuctionData()
  const minBidValue = useAuctionGetMinBidValue()

  const value: AuctionContextState = useMemo(() => {
    return {
      auctionConfig,
      auctionData,
      minBidValue,
      auctionState: getCurrentState(
        auctionConfig.startTime.toNumber(),
        auctionConfig.endTime.toNumber()
      ),
    }
  }, [auctionConfig, auctionData, minBidValue])

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}

const useAuctionContext = () => {
  return useContext(AuctionContext)
}

export { AuctionContext, AuctionProvider, useAuctionContext }
