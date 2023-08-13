import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
import { useMigrationPricePerMembershipInWei } from '../generated'
import { formatEther } from 'viem'

const useMigrationPricePerMembership = (migrationContractAddress: string) => {
  const { data: pricePerMembershipInWei } = useMigrationPricePerMembershipInWei({
    address: migrationContractAddress as Address,
  })

  if (!pricePerMembershipInWei) {
    return BigNumber(0)
  }

  return BigNumber(formatEther(pricePerMembershipInWei))
}

export default useMigrationPricePerMembership
