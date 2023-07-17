import { LockFactory } from '@dapp/contracts'

export interface ContractAddress {
  ERC20Mock: string
  Lock: string
  chainId: number
}

export interface Contracts {
  LockContract: ReturnType<typeof LockFactory.connect>
}

export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  BaseGoerli = 84531,
  Hardhat = 31337,
}
