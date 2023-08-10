import { Address } from 'viem'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import useTxToast from 'hooks/use-tx-toast'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'
import { wethABI } from '../generated'

const useWETHApprove = (
  allowance: BigNumber,
  toAllow: BigNumber,
  totalAvailableToSpend: BigNumber
) => {
  const { contracts } = useNftMembershipContext()
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const [txHash, setTxHash] = useState<Address>()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isApproved, setIsApproved] = useState(allowance.gte(totalAvailableToSpend))

  const request = async () => {
    try {
      if (isApproved) {
        return
      }

      setHasError(false)
      setIsLoading(true)
      setIsSubmitted(true)

      const config = await prepareWriteContract({
        address: contracts.WETH.address as Address,
        abi: wethABI,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_COW_ADDRESS as Address, toAllow.integerValue() as any],
      })

      const { hash } = await writeContract(config)

      if (!!hash) {
        setTxHash(hash)
        showTxSentToast('approve-submitted', hash)

        const { transactionHash } = await waitForTransaction({ hash })

        if (!!transactionHash) {
          showTxExecutedToast({
            title: 'Approved',
            txHash: transactionHash,
            id: 'approve-success',
          })

          setIsApproved(true)
        }
      }
    } catch (error: any) {
      setHasError(true)
      showTxErrorToast(error)
      setIsApproved(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isApproved,
    isLoading,
    isSubmitted,
    hasError,
    txHash,
    approve: request,
  }
}

export default useWETHApprove
