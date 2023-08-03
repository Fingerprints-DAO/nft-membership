import { Contracts } from '@dapp/sdk/dist/contract/types'
import BigNumber from 'bignumber.js'
import { Address, useContractRead } from 'wagmi'

const usePricePerMembership = (migrationContract: Contracts['Migration']) => {
  const migration = useContractRead({
    abi: migrationContract.abi,
    address: migrationContract.address as Address,
    functionName: 'pricePerMembershipInWei',
  })

  if (!migration.data) {
    return BigNumber(0)
  }

  return migration.data as BigNumber
}

export default usePricePerMembership
