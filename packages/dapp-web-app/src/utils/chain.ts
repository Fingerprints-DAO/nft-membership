import { mainnet, hardhat } from '@wagmi/chains'
import { sepolia } from 'wagmi'
import { goerli } from './goerli-chain'

// return chain id based on NEXT_PUBLIC_WEB3_NETWORK
export const getChainId = () => {
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'goerli') return goerli.id
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'sepolia') return sepolia.id
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'local') return hardhat.id
  return mainnet.id
}

// return chain based on NEXT_PUBLIC_WEB3_NETWORK
export const getChain = () => {
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'goerli') return goerli
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'sepolia') return sepolia
  if (process.env.NEXT_PUBLIC_WEB3_NETWORK === 'local') return hardhat

  return mainnet
}

export const isHardhat = getChainId() === 31337
