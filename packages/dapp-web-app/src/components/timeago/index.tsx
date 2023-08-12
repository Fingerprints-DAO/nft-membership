import React, { memo } from 'react'
import ReactTimeAgo from 'react-timeago'

type TimeAgoProps = {
  date: string
}

const TimeAgo = ({ date }: TimeAgoProps) => <ReactTimeAgo date={date} />

export default memo(TimeAgo)
