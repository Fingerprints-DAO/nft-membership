import { ContractAddress } from './types'
import { contractAddresses } from '@dapp/contracts'

const addresses: { [key: number]: ContractAddress } = {
  ...contractAddresses,
}

export const getContractAddressesForChainOrThrow = (
  chainId: number,
): ContractAddress => {
  if (!addresses[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`,
    )
  }

  return addresses[chainId]
}
