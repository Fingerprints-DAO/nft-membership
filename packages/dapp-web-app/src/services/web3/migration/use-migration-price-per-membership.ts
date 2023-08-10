import { Contracts } from '@dapp/sdk/dist/contract/types'
import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
import { useMigrationPricePerMembershipInWei } from '../generated'

const useMigrationPricePerMembership = (migrationContract: Contracts['Migration']) => {
  const { data: pricePerMembershipInWei } = useMigrationPricePerMembershipInWei({
    address: migrationContract.address as Address,
  })

  if (!pricePerMembershipInWei) {
    return BigNumber(0)
  }

  return BigNumber(pricePerMembershipInWei as any)
}

export default useMigrationPricePerMembership
