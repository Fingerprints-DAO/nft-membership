import { useNftMembershipContext } from 'contexts/nft-membership'
import {
  usePreparePrintsDecreaseAllowance,
  usePreparePrintsIncreaseAllowance,
  usePrintsDecreaseAllowance,
  usePrintsIncreaseAllowance,
} from '../generated'
import { Address } from 'viem'
import BigNumber from 'bignumber.js'
import useTxToast from 'hooks/use-tx-toast'
import { useWaitForTransaction } from 'wagmi'
import { useMemo } from 'react'

const usePrintsSetAllowance = (amount?: BigNumber) => {
  const { address, contracts } = useNftMembershipContext()
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const mode = amount?.isNegative() ? 'decrease' : 'increase'

  const methods = useMemo(() => {
    const finalAmount = amount?.isNegative() ? amount?.negated()?.toString() : amount?.toString()

    return {
      amount: finalAmount,
      prepare: mode === 'decrease' ? usePreparePrintsDecreaseAllowance : usePreparePrintsIncreaseAllowance,
      write: mode === 'decrease' ? usePrintsDecreaseAllowance : usePrintsIncreaseAllowance,
    }
  }, [amount, mode])

  const { config } = methods.prepare({
    address: contracts.ERC20.address as Address,
    enabled: false,
    args: [address as Address, BigInt(methods.amount?.toString() || '')],
  })

  const {
    writeAsync,
    data: trx,
    isLoading: isSubmitted,
  } = methods.write(
    // @ts-ignore
    {
      ...config,
      onSettled: (data) => {
        showTxSentToast(`${mode}-allowance-submitted`, data?.hash)
      },
      onError: (error) => {
        showTxErrorToast(error)
      },
    }
  )

  const { isLoading: isWaiting, data } = useWaitForTransaction({
    hash: trx?.hash,
    onError: (error) => {
      showTxErrorToast(error)
    },
    onSuccess: (data) => {
      if (!!data) {
        showTxExecutedToast({
          title: `Allowance ${mode}d`,
          txHash: data.transactionHash,
          id: `${mode}-allowance-success`,
        })
      }
    },
  })

  return {
    isSubmittedSetAllowance: isSubmitted,
    isWaitingSetAllowance: isWaiting,
    waitSetAllowanceTxStatus: data?.status,
    setAllowance: writeAsync,
  }
}

export default usePrintsSetAllowance
