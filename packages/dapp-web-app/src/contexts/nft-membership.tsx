import { Contracts } from '@dapp/sdk/dist/contract/types'
import BigNumber from 'bignumber.js'
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import useMigrationPricePerMembership from 'services/web3/migration/use-migration-price-per-membership'
import { getContracts } from 'utils/contract-addresses'
import { Address, useAccount } from 'wagmi'

type NftMembershipContextState = {
  isConnected: boolean
  contracts: Contracts
  address?: Address
  pricePerMembership: BigNumber
}

const DEFAULT_CONTEXT = {
  isConnected: false,
} as NftMembershipContextState

const NftMembershipContext = createContext(DEFAULT_CONTEXT)

const NftMembershipProvider = ({ children }: PropsWithChildren) => {
  const { address, isConnected } = useAccount()
  const contracts = getContracts()
  const pricePerMembership = useMigrationPricePerMembership(contracts.Migration.address)

  const value: NftMembershipContextState = useMemo(() => {
    return {
      address,
      isConnected,
      contracts,
      pricePerMembership,
    }
  }, [address, contracts, isConnected, pricePerMembership])

  return <NftMembershipContext.Provider value={value}>{children}</NftMembershipContext.Provider>
}

const useNftMembershipContext = () => {
  return useContext(NftMembershipContext)
}

export { NftMembershipContext, NftMembershipProvider, useNftMembershipContext }
