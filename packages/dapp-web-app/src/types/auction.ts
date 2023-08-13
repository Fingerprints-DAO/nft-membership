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
  minBidIncrementInWei: BigNumber
}

export type AuctionData = {
  highestBidder: Address
  highestBid: BigNumber
}

export type Bid = {
  amount: BigNumber
  timeAgo: string
  address?: Address
  transactionHash?: string
}