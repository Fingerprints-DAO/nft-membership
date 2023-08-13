import { useNftMembershipContext } from 'contexts/nft-membership'
import { useWethAllowance } from '../generated'
import { Address } from 'viem'
import BigNumber from 'bignumber.js'
import { formatToEtherString } from 'utils/price'

const useWETHGetAllowance = () => {
  const { address, contracts } = useNftMembershipContext()

  const { data: allowance, refetch } = useWethAllowance({
    address: contracts.WETH.address as Address,
    args: [address as Address, process.env.NEXT_PUBLIC_COW_ADDRESS as Address],
  })

  if (!allowance) {
    return {
      formatted: '0',
      value: BigNumber(0),
    }
  }

  return {
    formatted: formatToEtherString(allowance.toString()),
    value: BigNumber(allowance.toString()),
    refetch,
  }
}

export default useWETHGetAllowance
