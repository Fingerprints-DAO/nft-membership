export type OrderResponse = {
  sellToken: string
  buyToken: string
  receiver: string
  sellAmount: string
  buyAmount: string
  validTo: number
  feeAmount: string
  kind: string
  partiallyFillable: boolean
  sellTokenBalance: string
  buyTokenBalance: string
  signingScheme: string
  signature: string
  from: string
  quoteId: number
  appData: string
  appDataHash: string
  creationDate: string
  class: string
  owner: string
  uid: string
  executedSellAmount: string
  executedSellAmountBeforeFees: string
  executedBuyAmount: string
  executedFeeAmount: string
  invalidated: boolean
  status: string
  fullFeeAmount: string
  isLiquidityOrder: boolean
  ethflowData: {
    refundTxHash: string
    userValidTo: number
  }
  onchainUser: string
  onchainOrderData: {
    sender: string
    placementError: string
  }
  executedSurplusFee: string
  fullAppData: string
}
