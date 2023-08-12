import { getContractsDataForChainOrThrow } from '@dapp/sdk'
import { Contracts } from '@dapp/sdk/dist/contract/types'
import { getChainId } from './chain'

export const getContracts = (): Contracts => {
  const chainId = getChainId()

  return getContractsDataForChainOrThrow(chainId)
}
