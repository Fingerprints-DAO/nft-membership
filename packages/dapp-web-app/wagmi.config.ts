import { defineConfig } from '@wagmi/cli'
import { actions, react } from '@wagmi/cli/plugins'
import contracts from '@dapp/contracts'

export default defineConfig({
  out: './src/services/web3/generated.ts',
  contracts: [
    {
      name: 'prints',
      abi: contracts.ERC20ABI as any,
    },
    {
      name: 'weth',
      abi: contracts.ERC20ABI as any,
    },
    {
      name: 'migration',
      abi: contracts.MigrationABI as any,
    },
    {
      name: 'membership',
      abi: contracts.MembershipABI as any,
    },
  ],
  plugins: [
    react(),
    actions({
      prepareWriteContract: true,
      readContract: false,
    }),
  ],
})
