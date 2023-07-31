import { ERC20ABI, MembershipABI, MigrationABI } from '@dapp/contracts'
import { getContractAddressesForChainOrThrow } from './addresses'

export const getContractsDataForChainOrThrow = async (chainId: number) => {
  const addresses = await getContractAddressesForChainOrThrow(chainId)
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
  }
}
