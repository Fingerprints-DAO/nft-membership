import BigNumber from 'bignumber.js'

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
