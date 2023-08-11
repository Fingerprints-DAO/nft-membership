import BigNumber from 'bignumber.js'
import { Address } from 'viem'

export enum AuctionState {
  NOT_STARTED,
  STARTED,
  ENDED,
}

export type AuctionConfig = {
  startTime: BigNumber
  endTime: BigNumber
  minBidIncrementInWei: bigint
}

export type AuctionData = {
  highestBidder: Address
  highestBid: bigint
}
