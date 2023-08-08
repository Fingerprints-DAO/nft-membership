import { Contracts } from '@dapp/sdk/dist/contract/types'
import BigNumber from 'bignumber.js'
import { Address } from 'wagmi'
import { useMigrationPricePerMembershipInWei } from '../generated'
import { parseAmountToDisplay } from 'utils/number'

const useMigrationPricePerMembership = (migrationContract: Contracts['Migration']) => {
  const { data: pricePerMembershipInWei } = useMigrationPricePerMembershipInWei({
    address: migrationContract.address as Address,
  })

  if (!pricePerMembershipInWei) {
    return BigNumber(parseAmountToDisplay(BigInt(0)))
  }

  return BigNumber(pricePerMembershipInWei as any)
}

export default useMigrationPricePerMembership
