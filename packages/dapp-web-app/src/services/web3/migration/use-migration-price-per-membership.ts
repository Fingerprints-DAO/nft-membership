import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
import { useMigrationPricePerMembershipInWei } from '../generated'

const useMigrationPricePerMembership = (migrationContractAddress: string) => {
  const { data: pricePerMembershipInWei } = useMigrationPricePerMembershipInWei({
    address: migrationContractAddress as Address,
  })

  if (!pricePerMembershipInWei) {
    return BigNumber(0)
  }

  return BigNumber(pricePerMembershipInWei as any)
}

export default useMigrationPricePerMembership
