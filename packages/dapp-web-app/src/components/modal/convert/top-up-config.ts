import { OrderBookApi, OrderQuoteSideKindBuy, SigningScheme } from '@cowprotocol/cow-sdk'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { parseEther } from 'viem'
import { getChain, getChainId } from 'utils/chain'
import { goerli } from 'utils/goerli-chain'
import { hardhat } from '@wagmi/chains'

export enum TOP_UP_STATUS {
  LOADING,
  NEED_APPROVAL,
  NEED_SIGN,
  SIGN_WAITING,
  ORDER_WAITING,
  ORDER_SUCCESS,
}

export const slippage = 0.05
export const quoteTimeInterval = 1000 * 60 // 1 minute

export const chainId = () => {
  const id = getChainId()
  return id === hardhat.id ? 5 : id
}

export const chainName = () => {
  const name = getChain().name
  return chainId() === hardhat.id ? goerli.name : name
}

// const amountToBuy = BigNumber(28)

export const orderBookApi = new OrderBookApi({ chainId: chainId() })
// const subgraphApi = new SubgraphApi({ chainId })
// const orderSigningUtils = new OrderSigningUtils()

export const getQuote = async (
  walletAddress: string,
  wethAddress: string,
  printsAddress: string,
  amount: BigNumber
) => {
  let forceConfig: { buyToken?: string; buyAmountAfterFee?: string } = {}
  const validTo = dayjs().add(30, 'minutes').unix()

  if (chainId() === goerli.id || chainId() === hardhat.id) {
    // cow token
    forceConfig.buyToken = '0x91056d4a53e1faa1a84306d4deaec71085394bc8'
    // 28 tokens ~0.01 weth on goerli
    // forceConfig.buyAmountAfterFee = parseEther(BigNumber(28).toString()).toString()
  }
  return await orderBookApi.getQuote({
    kind: OrderQuoteSideKindBuy.BUY,
    sellToken: wethAddress, // weth goerli
    buyToken: printsAddress, // cow
    buyAmountAfterFee: parseEther(amount.toString()).toString(),
    from: walletAddress,
    receiver: walletAddress,
    validTo,
    signingScheme: SigningScheme.EIP1271,
    onchainOrder: true,
    ...forceConfig,
  })
}

export function formatExpirationTime(validTo?: number) {
  if (!validTo) return ''
  const expirationTime = dayjs.unix(validTo)
  const now = dayjs()
  const diffMinutes = expirationTime.diff(now, 'minute')

  if (diffMinutes < 60) {
    return `${diffMinutes}min`
  } else {
    const diffHours: number = Math.floor(diffMinutes / 60)
    const remainingMinutes: number = diffMinutes % 60
    if (remainingMinutes === 0) {
      return `${diffHours}h`
    } else {
      return `${diffHours}h${remainingMinutes}min`
    }
  }
}
