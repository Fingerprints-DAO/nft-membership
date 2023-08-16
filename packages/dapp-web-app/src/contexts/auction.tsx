import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import useAuctionGetConfig from 'services/web3/auction/use-auction-get-config'
import { AuctionState, AuctionConfig, AuctionData } from 'types/auction'
import dayjs from 'dayjs'
import useAuctionGetAuctionData from 'services/web3/auction/use-auction-get-data'
import useAuctionGetMinBidValue from 'services/web3/auction/use-auction-get-min-bid-value'
import BigNumber from 'bignumber.js'

type AuctionContextState = {
  auctionConfig: AuctionConfig
  auctionData: AuctionData
  auctionState: AuctionState
  minBidValue: BigNumber
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

  // Add useState for auctionState
  const [auctionState, setAuctionState] = useState<AuctionState>(
    getCurrentState(auctionConfig.startTime.toNumber(), auctionConfig.endTime.toNumber())
  )

  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const checkAndUpdateState = () => {
      const now = dayjs().unix()
      const ONE_MINUTE = 60 // in seconds

      const isCloseToStartOrEnd =
        Math.abs(now - auctionConfig.startTime.toNumber()) <= ONE_MINUTE ||
        Math.abs(now - auctionConfig.endTime.toNumber()) <= ONE_MINUTE

      setAuctionState(
        getCurrentState(auctionConfig.startTime.toNumber(), auctionConfig.endTime.toNumber())
      )

      // If past endTime, clear interval and exit
      if (now > auctionConfig.endTime.toNumber()) {
        clearInterval(intervalRef.current!)
        return
      }

      if (isCloseToStartOrEnd) {
        clearInterval(intervalRef.current!)
        intervalRef.current = setInterval(checkAndUpdateState, 1000)
      }
    }

    intervalRef.current = setInterval(checkAndUpdateState, 30000)
    checkAndUpdateState()

    return () => clearInterval(intervalRef.current!)
  }, [auctionConfig.startTime, auctionConfig.endTime])

  const value: AuctionContextState = useMemo(() => {
    return {
      auctionConfig,
      auctionData,
      minBidValue,
      auctionState, // use the state instead
    }
  }, [auctionConfig, auctionData, minBidValue, auctionState]) // add auctionState to dependency array

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}

const useAuctionContext = () => {
  return useContext(AuctionContext)
}

export { AuctionContext, AuctionProvider, useAuctionContext }
