import { task } from 'hardhat/config'
import { BaseContract } from 'ethers'
import { writeLogs } from './utils/_write-logs'
import { WETH_GOERLI_ADDRESS } from './utils/_addresses'
import { getAddresses } from './utils/_getAddresses'

type LocalContractName = 'ERC20Mock' | 'Membership' | 'Migration' | 'Auction'
type CombinedContract = Contract & BaseContract

interface Contract {
  args?: (string | number | (() => string | undefined) | (() => Promise<string>))[]
  instance?: CombinedContract
  libraries?: () => Record<string, string>
  waitForConfirmation?: boolean
}

task('deploy-testnet', 'Deploy contracts to testnet').setAction(async (_, { ethers, run }) => {
  const [deployer] = await ethers.getSigners()
  const { chainId } = await ethers.provider.getNetwork()

  const baseUri = 'ipfs://QmcF6KCccBHmEazNJW6MNgh9xJFBapLFdAefT19Uer4i43/'

  const contracts: Record<LocalContractName, Contract> = {
    ERC20Mock: {
      args: [deployer.address, 'arod.studio Tokens', '$ARST', 1_000_000],
      waitForConfirmation: true,
    },
    Membership: {
      args: [baseUri, deployer.address, deployer.address, 500],
      waitForConfirmation: true,
    },
    Migration: {
      args: [
        deployer.address,
        async () => {
          const address = await contracts.Membership?.instance?.getAddress()
          return address || ''
        },
        async () => {
          const address = await contracts.ERC20Mock?.instance?.getAddress()
          return address || ''
        },
        ethers.parseEther('5000').toString(),
      ],
      waitForConfirmation: true,
    },
    Auction: {
      args: [
        deployer.address,
        async () => await contracts.Membership.instance!.getAddress(),
        1,
        deployer.address,
      ],
      waitForConfirmation: true,
    },
  }

  for (const [name, contract] of Object.entries(contracts)) {
    const factory = await ethers.getContractFactory(name, {
      libraries: contract?.libraries?.(),
    })

    const deployedContract = await factory.deploy(
      ...(contract.args?.map((a) => (typeof a === 'function' ? a() : a)) ?? []),
    )

    if (contract.waitForConfirmation) {
      await deployedContract.waitForDeployment()
    }
    contracts[name as LocalContractName].instance = deployedContract

    console.log(`${name} contract deployed to ${await deployedContract.getAddress()}`)
  }

  writeLogs(
    chainId,
    await contracts.ERC20Mock.instance!.getAddress(),
    await contracts.Membership.instance!.getAddress(),
    await contracts.Migration.instance!.getAddress(),
    await contracts.Auction.instance!.getAddress(),
    WETH_GOERLI_ADDRESS,
  )

  await run('grant-role', {
    address: await contracts.Migration.instance!.getAddress(),
    role: 'MINTER_ROLE',
  })

  await run('mint-tokens', {
    mintTo: deployer.address,
  })
  await run('unpause-migration')

  await run('migrate', {
    mintTo: await contracts.Auction?.instance?.getAddress(),
  })

  // const now = Math.floor(Date.now() / 1000)
  // const oneDayInSeconds = 86400
  // await run('set-auction-config', {
  //   startTime: now,
  //   endTime: now + oneDayInSeconds,
  //   minBidIncrementInWei: ethers.parseEther('0.1').toString(),
  //   startAmountInWei: ethers.toBigInt(100).toString(),
  // })

  return contracts
})
