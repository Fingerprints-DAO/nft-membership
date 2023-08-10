import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useEffect, useState } from 'react'

dayjs.extend(duration)

interface CountdownProps {
  futureTimestamp: number
}

const Countdown = ({ futureTimestamp }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState('')

  //   console.log('futureTimestamp', futureTimestamp)

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
        // console.log('duration', duration)

        const hours = duration.hours()
        const minutes = duration.minutes().toString().padStart(2, '0')
        const seconds = duration.seconds().toString().padStart(2, '0')

        if (hours > 0) {
          setTimeLeft(`${hours}:${minutes}:${seconds}`)
        } else {
          setTimeLeft(`${minutes}:${seconds}`)
        }
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [futureTimestamp])

  return timeLeft
}

export default Countdown
