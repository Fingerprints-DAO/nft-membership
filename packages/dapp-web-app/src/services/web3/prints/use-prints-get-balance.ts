import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { formatToEtherString, formatToEtherStringBN } from 'utils/price'
import { Address, useAccount, useBalance } from 'wagmi'

export type Balance = {
  formatted: string
  value: BigNumber
  refetch: () => void
}

const usePrintsGetBalance = (): Balance => {
  const { address } = useAccount()
  const { contracts } = useNftMembershipContext()

  const { data: printsBalance, refetch } = useBalance({
    address,
    enabled: Boolean(address) && Boolean(contracts.ERC20.address),
    token: contracts.ERC20.address as Address,
  })

  if (!printsBalance) {
    return {
      formatted: '0',
      value: BigNumber(0),
      refetch,
    }
  }

  return {
    value: formatToEtherString(printsBalance.value.toString()),
    formatted: Number(formatToEtherStringBN(printsBalance.value)).toLocaleString(),
    refetch,
  }
}

export default usePrintsGetBalance
