import { Address } from 'viem'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import useTxToast from 'hooks/use-tx-toast'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core'
import { migrationABI } from '../generated'
import { parseAmountToContract } from 'utils/number'

const useMigrationMigrate = (amount: BigNumber) => {
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
        args: [address as Address, BigNumber(amount).toNumber()],
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
