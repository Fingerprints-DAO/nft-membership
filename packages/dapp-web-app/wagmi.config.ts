import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import contracts from '@dapp/contracts'

export default defineConfig({
  out: './src/services/web3/index.ts',
  contracts: [
    {
      name: 'prints',
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
  plugins: [react()],
})
