import { useNftMembershipContext } from 'contexts/nft-membership'
import { usePrintsAllowance } from '../generated'
import { Address } from 'viem'
import BigNumber from 'bignumber.js'

const usePrintsGetAllowance = () => {
  const { address, contracts } = useNftMembershipContext()

  const { data: allowance } = usePrintsAllowance({
    address: contracts.ERC20.address as Address,
    args: [address as Address, contracts.ERC20.address as Address],
  })

  if (!allowance) {
    return BigNumber(0)
  }

  return BigNumber(allowance as any)
}

export default usePrintsGetAllowance
