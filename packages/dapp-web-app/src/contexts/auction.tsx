import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import useAuctionGetConfig from 'services/web3/auction/use-auction-get-config'
import { useNftMembershipContext } from './nft-membership'
import { AuctionState, AuctionConfig } from 'types/auction'
import dayjs from 'dayjs'

type AuctionContextState = {
  auctionConfig: AuctionConfig
  auctionState: AuctionState
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
  const { contracts } = useNftMembershipContext()

  const auctionConfig = useAuctionGetConfig(contracts.Auction.address)

  const value: AuctionContextState = useMemo(() => {
    return {
      auctionConfig,
      auctionState: getCurrentState(
        auctionConfig.startTime.toNumber(),
        auctionConfig.endTime.toNumber()
      ),
    }
  }, [auctionConfig])

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}

const useAuctionContext = () => {
  return useContext(AuctionContext)
}

export { AuctionContext, AuctionProvider, useAuctionContext }
