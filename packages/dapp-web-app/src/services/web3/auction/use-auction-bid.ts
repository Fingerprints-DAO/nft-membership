import { Address } from 'viem'
import { useState } from 'react'
import useTxToast from 'hooks/use-tx-toast'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'

const useAuctionBid = () => {
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const [txHash, setTxHash] = useState<Address>()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const request = async () => {
    try {
      setHasError(false)
      setIsLoading(true)
      setIsSubmitted(true)

      const config = await prepareWriteContract({
        abi: {},
        address: '',
        functionName: '',
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
        }
      }
    } catch (error: any) {
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
    isSubmitted,
    hasError,
    txHash,
    migrate: request,
  }
}

export default useAuctionBid
