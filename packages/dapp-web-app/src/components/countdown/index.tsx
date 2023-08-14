import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'

dayjs.extend(duration)

interface CountdownProps {
  futureTimestamp: number
}

const Countdown = ({ futureTimestamp }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState('--:--')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = dayjs()
      const future = dayjs.unix(futureTimestamp)
      const diff = future.diff(now)

      if (diff <= 0) {
        clearInterval(intervalId)
        setTimeLeft('00:00')
      } else {
        const duration = dayjs.duration(diff)

        const days = duration.days()
        const hours = duration.hours()
        const minutes = duration.minutes().toString().padStart(2, '0')
        const seconds = duration.seconds().toString().padStart(2, '0')

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}min`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}:${minutes}:${seconds}`)
        } else {
          setTimeLeft(`${minutes}:${seconds}`)
        }
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [futureTimestamp])

  return <span>{timeLeft}</span>
}

export default Countdown
