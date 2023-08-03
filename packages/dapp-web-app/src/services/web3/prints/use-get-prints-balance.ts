import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { formatEther } from 'viem'
import { Address, useAccount, useBalance } from 'wagmi'

export type Balance = {
  formatted: string
  value: BigNumber
}

const useGetPrintsBalance = (): Balance => {
  const { address } = useAccount()
  const { contracts } = useNftMembershipContext()

  const { data: printsBalance } = useBalance({
    address,
    enabled: Boolean(address) && Boolean(contracts.ERC20.address),
    token: contracts.ERC20.address as Address,
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
