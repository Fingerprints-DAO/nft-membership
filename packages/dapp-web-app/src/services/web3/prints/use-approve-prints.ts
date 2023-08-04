// import { useState } from 'react'
// import { Address, useContractWrite, useMutation, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
// import { useNftMembershipContext } from 'contexts/nft-membership'
import BigNumber from 'bignumber.js'
// import useTxToast from 'hooks/use-tx-toast'

const usePrintsApprove = (params: [string, BigNumber]) => {
//     const { contracts } = useNftMembershipContext();
//     const { showTxErrorToast, showTxExecutedToast } = useTxToast()

//   const [isApproved, setIsApproved] = useState(false)
//   const [hash, setHash] = useState<Address | undefined>()

//   const { config } = usePrepareContractWrite({
//     address: contracts.ERC20.address as Address,
//     abi: contracts.ERC20.abi,
//     functionName: 'approve',
//     args: params,
//   })

//   const { write } = useContractWrite(config)

//   const request = async () => {
//     if (!write) {
//       throw new Error()
//     }

//     return write()
//   }

//   return useMutation(request, {
    
//   })

//   useWaitForTransaction({
//     hash,
//     onSettled: (_, error) => {
//       if (error) {
//         showTxErrorToast(error)
//         return
//       }
//       setIsApproved(true)

//       showTxExecutedToast({
//         title: 'Approval confirmed',
//         txHash: hash,
//         id: 'approval-success',
//       })
//     },
//   })

//   const approveMutation = useMutation(request, {
//     onSuccess: (data) => {
//       setHash(data?.hash as Address)
//     },
//     onError: (error: any) => {
//       console.log('aprove error', error)
//       showTxErrorToast(error)
//       setHash(undefined)
//       setIsApproved(false)
//     },
//   })

//   return {
//     isApproved,
//     approveMutation,
//     hash,
//   }
}

export default usePrintsApprove
