import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import useTxToast from 'hooks/use-tx-toast'
import { usePreparePrintsApprove, usePrintsApprove as useGenPrintsApprove } from '../generated'
import { Address } from 'viem'
import { useWaitForTransaction } from 'wagmi'

const usePrintsApprove = (amount?: BigNumber) => {
  const { address, contracts } = useNftMembershipContext()
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const { config } = usePreparePrintsApprove({
    address: contracts.ERC20.address as Address,
    enabled: false,
    args: [address as Address, BigInt(amount?.toString() || '')],
  })

  const {
    writeAsync,
    data: trx,
    isLoading: isSubmitted,
  } = useGenPrintsApprove({
    ...config,
    onSettled: (data) => {
      showTxSentToast('approve-submitted', data?.hash)
    },
    onError: (error) => {
      showTxErrorToast(error)
    },
  })

  const { isLoading: isWaiting, data } = useWaitForTransaction({
    hash: trx?.hash,
    onError: (error) => {
      showTxErrorToast(error)
    },
    onSuccess: (data) => {
      if (!!data) {
        showTxExecutedToast({
          title: 'Approved',
          txHash: data.transactionHash,
          id: 'approve-success',
        })
      }
    },
  })

  return {
    isSubmittedApprove: isSubmitted,
    isWaitingApprove: isWaiting,
    waitApproveTxStatus: data?.status,
    approve: writeAsync,
  }
}

export default usePrintsApprove
