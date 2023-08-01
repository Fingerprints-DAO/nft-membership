import BigNumber from 'bignumber.js'
import { formatEther } from 'viem'
import { Address, useAccount, useBalance } from 'wagmi'

const printContractAddress = process.env.NEXT_PUBLIC_PRINTS_CONTRACT_ADDRESS || ''

export type Balance = {
  formatted: string
  value: BigNumber
}

const useGetPrintsBalance = (): Balance => {
  const { address } = useAccount()

  const { data: printsBalance } = useBalance({
    address,
    enabled: Boolean(address) && Boolean(printContractAddress),
    token: printContractAddress as Address,
  })

  if (!printsBalance) {
    return {
      formatted: '0',
      value: BigNumber(0),
    }
  }

  return {
    value: BigNumber(formatEther(printsBalance.value)),
    formatted: BigNumber(formatEther(printsBalance.value)).toFormat(3),
  }
}

export default useGetPrintsBalance
