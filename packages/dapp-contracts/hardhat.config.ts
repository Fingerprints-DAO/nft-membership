import * as dotenv from 'dotenv'
import { HardhatUserConfig, task } from 'hardhat/config'
import 'dotenv/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-watcher'
import 'hardhat-contract-sizer'
// import 'hardhat-docgen'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'
import '@nomiclabs/hardhat-ethers'

dotenv.config()

import './tasks'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const accounts = {
  mnemonic:
    process.env.MNEMONIC || 'abc abc abc abc abc abc abc abc abc abc abc abc',
}
const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    goerli: {
      url: `${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : accounts,
      chainId: 5,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts,
      chainId: 1,
      gasMultiplier: 1,
      gas: 'auto',
      // gasPrice: 20000000000,
    },
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : accounts,
      chainId: 84531,
      gas: 'auto',
      gasPrice: 'auto',
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: false,
      clearOnStart: true,
      runOnLaunch: false,
    },
  },
  contractSizer: {
    disambiguatePaths: false,
    runOnCompile: true,
    strict: process.env.CONTRACT_SIZER_STRICT_DISABLE ? false : true,
  },
  abiExporter: {
    path: './abi',
    clear: true,
    runOnCompile: true,
  },
  // docgen: {
  //   path: './docs',
  //   clear: true,
  //   runOnCompile: true,
  // },
}

export default config
