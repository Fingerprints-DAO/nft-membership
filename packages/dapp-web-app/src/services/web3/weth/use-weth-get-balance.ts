import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { formatToEtherString, formatToEtherStringBN } from 'utils/price'
import { Address, useAccount, useBalance } from 'wagmi'

export type Balance = {
  formatted: string
  value: BigNumber
}

const useWETHGetBalance = (): Balance => {
  const { address } = useAccount()
  const { contracts } = useNftMembershipContext()

  const { data: printsBalance } = useBalance({
    address,
    enabled: Boolean(address) && Boolean(contracts.WETH.address),
    token: contracts.WETH.address as Address,
  })

  if (!printsBalance) {
    return {
      formatted: '0',
      value: BigNumber(0),
    }
  }

  return {
    value: formatToEtherString(printsBalance.value.toString()),
    formatted: Number(formatToEtherStringBN(printsBalance.value)).toLocaleString(),
  }
}

export default useWETHGetBalance
