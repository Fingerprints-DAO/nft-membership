import { Chain } from 'wagmi'

export const goerli: Chain = {
  id: 5,
  name: 'Goerli',
  network: 'goerli',
  nativeCurrency: { name: 'Goerli', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    public: { http: [`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_PROVIDER_KEY}`] },
    default: { http: [`https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_PROVIDER_KEY}`] },
  },
  blockExplorers: {
    etherscan: { name: 'GoerliScan', url: 'https://goerli.etherscan.io/' },
    default: { name: 'GoerliScan', url: 'https://goerli.etherscan.io/' },
  },
  testnet: true,
}
