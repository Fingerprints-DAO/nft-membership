import { useAuctionContext } from 'contexts/auction'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { AuctionState } from 'types/auction'
import { Interval } from 'types/interval'

const timeToGo = (time: number) => {
  const endDateUnix = dayjs.unix(time)
  return endDateUnix
}

const handleMinutes = (time: number) => {
  const currentTime = dayjs()
  const remainingTime = dayjs(timeToGo(time)).diff(currentTime, 'seconds')

  if (remainingTime <= 0) {
    return 0
  }

  const minutes = Math.ceil(remainingTime / 60)

  return minutes
}

export const displayCountdown = (endTime: number) => {
  const remainingSeconds = dayjs(timeToGo(endTime)).diff(dayjs(), 'seconds')
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const useCountdownTime = () => {
  const { auctionConfig, auctionState } = useAuctionContext()

  const [countdown, setCountdown] = useState(0)
  const [countdownInMili, setCountdownInMili] = useState(0)

  const handleTime = useCallback(() => {
    let time = 0

    if (auctionState === AuctionState.NOT_STARTED) {
      time = auctionConfig?.startTime?.toNumber() ?? 0
    }

    if (auctionState === AuctionState.STARTED) {
      time = auctionConfig?.endTime?.toNumber() ?? 0
    }

    setCountdownInMili(time)

    const minutes = handleMinutes(time ?? 0)

    setCountdown(minutes)
  }, [auctionState, auctionConfig])

  useEffect(() => {
    const interval = setInterval(handleTime, Interval.Timer)

    handleTime()

    return () => {
      clearInterval(interval)
    }
  }, [handleTime])

  return {
    countdown,
    countdownInMili,
  }
}

export default useCountdownTime
