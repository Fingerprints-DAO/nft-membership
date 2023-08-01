import { MembershipFactory, MigrationFactory } from '@dapp/contracts'

export interface ContractAddress {
  ERC20Mock: string
  Membership: string
  Migration: string
  chainId: number
}

export interface Contracts {
  MembershipContract: ReturnType<typeof MembershipFactory.connect>
  MigrationContract: ReturnType<typeof MigrationFactory.connect>
}

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  BaseGoerli = 84531,
  Hardhat = 31337,
}
