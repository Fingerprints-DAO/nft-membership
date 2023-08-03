import { ERC20ABI, MembershipABI, MigrationABI } from '@dapp/contracts'
import { Address } from 'wagmi'

export interface ContractAddress {
  ERC20Mock: Address
  Membership: Address
  Migration: Address
  chainId: number
}

// export interface Contracts {
//   MembershipContract: ReturnType<typeof MembershipFactory.connect>
//   MigrationContract: ReturnType<typeof MigrationFactory.connect>
//   ERC20: ReturnType<typeof ERC20Factory.connect>
// }

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  BaseGoerli = 84531,
  Hardhat = 31337,
}

export type Contract<T> = {
  abi: T
  address: Address
}

export type Contracts = {
  Membership: Contract<typeof MembershipABI>
  Migration: Contract<typeof MigrationABI>
  ERC20: Contract<typeof ERC20ABI>
}
