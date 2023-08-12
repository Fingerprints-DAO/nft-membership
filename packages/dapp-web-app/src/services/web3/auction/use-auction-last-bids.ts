import { useNftMembershipContext } from 'contexts/nft-membership'
import { Address, formatEther, parseAbiItem } from 'viem'
import { getChainId, isHardhat } from 'utils/chain'
import BigNumber from 'bignumber.js'
import { config } from 'settings/wagmi'
import dayjs from 'dayjs'
import { AuctionState, Bid } from 'types/auction'
import { usePublicClient, useQuery } from 'wagmi'
import { getBidsKey } from './keys'
import { Interval } from 'types/interval'
import { useAuctionContext } from 'contexts/auction'

const BLOCKS_PER_DAY_COUNT = 7200

const useAuctionLastBids = () => {
  const { auctionState } = useAuctionContext()
  const { contracts } = useNftMembershipContext()
  const publicClient = usePublicClient({ chainId: getChainId() })

  const request = async () => {
    try {
      const blockNumber = await publicClient.getBlockNumber()
      const blocksCount = isHardhat ? blockNumber : BLOCKS_PER_DAY_COUNT

      const filter = await publicClient.createEventFilter({
        address: contracts.Auction.address as Address,
        event: parseAbiItem('event Bid(address indexed sender, uint amount)'),
        fromBlock: blockNumber - BigInt(blocksCount),
        toBlock: blockNumber,
      })

      const logs = await publicClient.getFilterLogs({ filter })

      const history = []

      for (const item of logs) {
        const block = await config.publicClient.getBlock({ blockHash: item.blockHash || undefined })

        const blockDate = dayjs.unix(Number(block.timestamp.toString()))

        history.push({
          address: item.args.sender as Address | undefined,
          amount: BigNumber(formatEther(item.args.amount || BigInt(0))),
          transactionHash: item.transactionHash as string | undefined,
          timeAgo: blockDate.toISOString(),
        })
      }

      const bids = history.sort((a, b) => dayjs(b.timeAgo).diff(dayjs(a.timeAgo)))

      return bids as Bid[]
    } catch (error) {
      console.log('request', error)
    }
  }

  const { data: bids = [], isFetching } = useQuery(getBidsKey, request, {
    refetchInterval: auctionState === AuctionState.STARTED ? Interval.Pooling : undefined,
    refetchIntervalInBackground: true,
  })

  return {
    bids,
    isLoading: isFetching,
  }
}

export default useAuctionLastBids
