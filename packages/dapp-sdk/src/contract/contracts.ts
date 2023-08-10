import { ERC20ABI, MembershipABI, MigrationABI } from '@dapp/contracts'
import { getContractAddressesForChainOrThrow } from './addresses'
import { Contracts } from './types'

export const getContractsDataForChainOrThrow = (chainId: number): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId)

  return {
    Membership: {
      abi: MembershipABI,
      address: addresses.Membership,
    },
    Migration: {
      abi: MigrationABI,
      address: addresses.Migration,
    },
    ERC20: {
      abi: ERC20ABI,
      address: addresses.ERC20Mock,
    },
    WETH: {
      abi: ERC20ABI,
      address: addresses.WETH,
    },
  }
}
