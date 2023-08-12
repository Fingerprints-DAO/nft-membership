import { getDefaultConfig } from 'connectkit'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getChain } from 'utils/chain'
import { configureChains, createConfig, sepolia } from 'wagmi'

const selectedChain = [getChain()]
const walletConnectProjectId = '5e9390a7f8281ac44f6cf4348e74bdc5'

const { chains } = configureChains(selectedChain, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_PROVIDER_KEY || '' }),
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === sepolia.id) return null
      return {
        http: chain.rpcUrls.default.http[0],
      }
    },
  }),
])

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'NFT Membership',
    walletConnectProjectId,
    infuraId: process.env.NEXT_PUBLIC_PROVIDER_KEY,
    chains,
  })
)
