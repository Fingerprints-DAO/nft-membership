import { task } from 'hardhat/config'
import { BaseContract } from 'ethers'
import { writeLogs } from './utils/_write-logs'
import { WETH_GOERLI_ADDRESS } from './utils/_addresses'

type LocalContractName = 'ERC20Mock' | 'Membership' | 'Migration' | 'Auction'
type CombinedContract = Contract & BaseContract

interface Contract {
  args?: (
    | string
    | number
    | (() => string | undefined)
    | (() => Promise<string>)
  )[]
  instance?: CombinedContract
  libraries?: () => Record<string, string>
  waitForConfirmation?: boolean
}

task('deploy-testnet', 'Deploy contracts to testnet').setAction(
  async (_, { ethers }) => {
    const [deployer] = await ethers.getSigners()
    const { chainId } = await ethers.provider.getNetwork()

    const baseUri = 'ipfs://QmVGSdqD5Sy7muE1U7H5wfufCDWkPgusECcEe78GXyssxN/'

    const contracts: Record<LocalContractName, Contract> = {
      ERC20Mock: {
        args: [deployer.address, 'arod.studio Tokens', '$ARST', 1_000_000],
      },
      Membership: {
        args: [baseUri, deployer.address, deployer.address, 1000],
      },
      Migration: {
        args: [
          deployer.address,
          async () => await contracts.Membership.instance!.getAddress(),
          async () => await contracts.ERC20Mock.instance!.getAddress(),
          5000,
        ],
      },
      Auction: {
        args: [
          deployer.address,
          async () => await contracts.Membership.instance!.getAddress(),
          1,
          deployer.address,
        ],
      },
    }

    for (const [name, contract] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      })

      const deployedContract = await factory.deploy(
        ...(contract.args?.map((a) => (typeof a === 'function' ? a() : a)) ??
          []),
      )

      if (contract.waitForConfirmation) {
        await deployedContract.waitForDeployment()
      }
      contracts[name as LocalContractName].instance = deployedContract

      console.log(
        `${name} contract deployed to ${await deployedContract.getAddress()}`,
      )
    }

    writeLogs(
      chainId,
      await contracts.ERC20Mock.instance!.getAddress(),
      await contracts.Membership.instance!.getAddress(),
      await contracts.Migration.instance!.getAddress(),
      await contracts.Auction.instance!.getAddress(),
      WETH_GOERLI_ADDRESS,
    )

    return contracts
  },
)
