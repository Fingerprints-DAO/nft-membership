import { useNftMembershipContext } from 'contexts/nft-membership'
import { usePrintsAllowance } from '../generated'
import { Address } from 'viem'
import BigNumber from 'bignumber.js'
import { formatToEtherString } from 'utils/price'

const useWETHGetAllowance = () => {
  const { address, contracts } = useNftMembershipContext()

  const { data: allowance } = usePrintsAllowance({
    address: contracts.WETH.address as Address,
    args: [address as Address, process.env.NEXT_PUBLIC_COW_ADDRESS as Address],
  })

  if (!allowance) {
    return BigNumber(0)
  }

  return formatToEtherString(allowance.toString())
}

export default useWETHGetAllowance
