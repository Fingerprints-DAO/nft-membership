import { ERC20ABI, MembershipABI, MigrationABI, AuctionABI } from '@dapp/contracts'

export interface ContractAddress {
  ERC20Mock: string
  WETH: string
  Membership: string
  Migration: string
  Auction: string
  chainId: number
}

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  BaseGoerli = 84531,
  Hardhat = 31337,
}

export type Contract<T> = {
  abi: T
  address: string
}

export type Contracts = {
  Membership: Contract<typeof MembershipABI>
  Migration: Contract<typeof MigrationABI>
  ERC20: Contract<typeof ERC20ABI>
  Auction: Contract<typeof AuctionABI>
  WETH: Contract<typeof ERC20ABI>
}
