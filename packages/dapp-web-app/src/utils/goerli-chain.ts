import { Chain } from 'wagmi'

export const goerli: Chain = {
  id: 5,
  name: 'Goerli',
  network: 'goerli',
  nativeCurrency: { name: 'Goerli', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/eth_goerli'] },
    default: { http: ['https://goerli.infura.io/v3/'] },
  },
  blockExplorers: {
    etherscan: { name: 'GoerliScan', url: 'https://goerli.etherscan.io/' },
    default: { name: 'GoerliScan', url: 'https://goerli.etherscan.io/' },
  },
  testnet: true,
}
