import { ERC20ABI, MembershipABI, MigrationABI, AuctionABI } from '@dapp/contracts'
import { getContractAddressesForChainOrThrow } from './addresses'
import { Contracts } from './types'

export const getContractsDataForChainOrThrow = (chainId: number): Contracts => {
  const addresses = getContractAddressesForChainOrThrow(chainId)

  console.log('addresses - sdk', addresses.Auction, chainId)
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
    Auction: {
      abi: AuctionABI,
      address: addresses.Auction,
    },
    WETH: {
      abi: ERC20ABI,
      address: addresses.WETH,
    },
  }
}
