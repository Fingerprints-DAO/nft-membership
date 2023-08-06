import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { parseAmountToDisplay } from 'utils/number'
import { formatEther } from 'viem'
import { Address, useAccount, useBalance } from 'wagmi'

export type Balance = {
  formatted: string
  value: BigNumber
}

const usePrintsGetBalance = (): Balance => {
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
      value: BigNumber(parseAmountToDisplay(BigInt(0))),
    }
  }

  return {
    value: BigNumber(parseAmountToDisplay(BigInt(printsBalance.value?.toString() ?? 0))),
    formatted: BigNumber(formatEther(printsBalance.value)).toFormat(3),
  }
}

export default usePrintsGetBalance
