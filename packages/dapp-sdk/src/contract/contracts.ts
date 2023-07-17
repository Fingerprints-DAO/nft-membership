import { ERC20ABI, LockABI } from '@dapp/contracts'
import { getContractAddressesForChainOrThrow } from './addresses'

export const getContractsDataForChainOrThrow = async (chainId: number) => {
  const addresses = await getContractAddressesForChainOrThrow(chainId)
  return {
    Lock: {
      abi: LockABI,
      address: addresses.Lock,
    },
    ERC20: {
      abi: ERC20ABI,
      address: addresses.ERC20Mock,
    },
  }
}
