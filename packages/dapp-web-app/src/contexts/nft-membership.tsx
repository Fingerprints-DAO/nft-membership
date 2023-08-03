import { getContractsDataForChainOrThrow } from '@dapp/sdk'
import { Contracts } from '@dapp/sdk/dist/contract/types'
import BigNumber from 'bignumber.js'
import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import usePricePerMembership from 'services/web3/migration/use-price-per-membership'
import { getChainId } from 'utils/chain'
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

  const getContracts = (): Contracts => {
    const chainId = getChainId()

    return getContractsDataForChainOrThrow(chainId)
  }

  const contracts = getContracts()

  const pricePerMembership = usePricePerMembership(contracts.Migration)

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
