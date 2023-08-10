import { Address } from 'viem'
import { useState } from 'react'
import useTxToast from 'hooks/use-tx-toast'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'
import { migrationABI } from '../generated'
import { useRouter } from 'next/navigation'

const useMigrationMigrate = (qty: number) => {
  const { push } = useRouter()
  const { address, contracts } = useNftMembershipContext()
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
        address: contracts.Migration.address as Address,
        abi: migrationABI,
        functionName: 'migrate',
        args: [address as Address, qty], // TODO: qual endereço devo passar?
      })

      const { hash } = await writeContract(config)

      if (!!hash) {
        setTxHash(hash)
        showTxSentToast('migrate-submitted', hash)

        const { transactionHash } = await waitForTransaction({ hash })

        if (!!transactionHash) {
          showTxExecutedToast({
            title: 'Migrated',
            txHash: transactionHash,
            id: 'migrate-success',
          })

          setIsSuccess(true)

          push('/')
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

export default useMigrationMigrate
