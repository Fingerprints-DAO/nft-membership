import { Address, parseEther } from 'viem'
import { useState } from 'react'
import useTxToast from 'hooks/use-tx-toast'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { auctionABI } from '../generated'
import { useQueryClient } from 'wagmi'
import { getAuctionDataKey, getMinBidValueKey } from './keys'
import BigNumber from 'bignumber.js'
import { BigNumberish } from 'ethers'

const useAuctionBid = () => {
  const queryClient = useQueryClient()
  const { contracts } = useNftMembershipContext()
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const [txHash, setTxHash] = useState<Address>()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const request = async (value: string) => {
    try {
      if (isLoading) {
        return
      }

      setHasError(false)
      setIsLoading(true)

      const config = await prepareWriteContract({
        abi: auctionABI,
        address: contracts.Auction.address as Address,
        functionName: 'bid',
        value: parseEther(value),
      })

      const { hash } = await writeContract(config)

      if (!!hash) {
        setTxHash(hash)
        showTxSentToast('bid-submitted', hash)

        const { transactionHash } = await waitForTransaction({ hash })

        if (!!transactionHash) {
          showTxExecutedToast({
            title: 'You successfully place your bid.',
            txHash: transactionHash,
            id: 'bid-success',
          })

          setIsSuccess(true)

          queryClient.invalidateQueries(getAuctionDataKey)
          queryClient.invalidateQueries(getMinBidValueKey)
        }
      }
    } catch (error: any) {
      console.log('error', error)
      setHasError(true)
      showTxErrorToast(error)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isSuccess,
    isLoading,
    hasError,
    txHash,
    bid: request,
  }
}

export default useAuctionBid
