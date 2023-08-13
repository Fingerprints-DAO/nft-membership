import React, { memo, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Activate the relativeTime plugin
dayjs.extend(relativeTime)

interface TimeAgoProps {
  timestamp: string
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState<string>('')

  useEffect(() => {
    setTimeAgo(dayjs(timestamp).fromNow())
    // Update timeAgo every 10 seconds
    const interval = setInterval(() => {
      setTimeAgo(dayjs(timestamp).fromNow())
    }, 10000)

    // Clear interval on component unmount
    return () => clearInterval(interval)
  }, [timestamp])

  return <span>{timeAgo}</span>
}

export default memo(TimeAgo)
