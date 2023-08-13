import { useCallback, useState } from 'react'
import { useQuery } from 'wagmi'
import { OrderResponse } from './types'
import useTxToast from 'hooks/use-tx-toast'

const useCowOrderWatch = () => {
  const [orderStatus, setOrderStatus] = useState<string>()
  const [apiUrl, setApiUrl] = useState<string | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const { showTxErrorToast, showTxExecutedToast, showTxSentToast } = useTxToast()

  const request = useCallback(async () => {
    if (!apiUrl) return

    const dataFetch = await fetch(apiUrl)
    const data: OrderResponse = await dataFetch?.json()
    console.log(data, data.status)
    setOrderStatus(data.status)

    if (data.status === 'cancelled' || data.status === 'expired') {
      setError(true)

      showTxErrorToast(new Error(`Transaction is ${data.status}. Please, try again.`))
    }

    if (data.status === 'fulfilled') {
      setSuccess(true)

      showTxExecutedToast({
        title: `Order executed successfully.`,
        id: 'topup-success',
      })
    }
    return data.status
  }, [apiUrl, showTxErrorToast, showTxExecutedToast])

  useQuery(['cow-order-watch'], request, {
    enabled: !!apiUrl && (!orderStatus || orderStatus === 'open'), // Query will be executed only when apiUrl is defined and status is 'open'
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  })

  const setOrder = (uuid: string, chainId: string) => {
    setApiUrl(`https://api.cow.fi/${chainId}/api/v1/orders/${uuid}`)
  }

  return {
    status: orderStatus,
    setOrder,
    error,
    success,
  }
}

export default useCowOrderWatch
