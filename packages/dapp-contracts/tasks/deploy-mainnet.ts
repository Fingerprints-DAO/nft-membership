import { task } from 'hardhat/config'
import { BaseContract } from 'ethers'
import { writeLogs } from './utils/_write-logs'
import { WETH_MAINNET_ADDRESS } from './utils/_addresses'
// import { getAddresses } from './utils/_getAddresses'

type LocalContractName = 'Membership' | 'Migration' | 'Auction'
type CombinedContract = Contract & BaseContract

interface Contract {
  args?: (string | number | (() => string | undefined) | (() => Promise<string>))[]
  instance?: CombinedContract
  libraries?: () => Record<string, string>
  waitForConfirmation?: boolean
}

const printsAddress = '0x4dd28568D05f09b02220b09C2cb307bFd837cb95' // erc20 prints
const payoutAddress = '0xbc49de68bcbd164574847a7ced47e7475179c76b' // treasury

task('deploy-mainnet', 'Deploy contracts to mainnet').setAction(async (_, { ethers, run }) => {
  const [deployer] = await ethers.getSigners()
  const { chainId } = await ethers.provider.getNetwork()
  // const addresses = await getAddresses(ethers.provider)

  const baseUri = 'ipfs://QmcF6KCccBHmEazNJW6MNgh9xJFBapLFdAefT19Uer4i43/'

  const contracts: Record<LocalContractName, Contract> = {
    Membership: {
      args: [baseUri, deployer.address, payoutAddress, 500], // 5%
      waitForConfirmation: true,
    },
    Migration: {
      args: [
        deployer.address, //admin
        async () => {
          const address = await contracts.Membership?.instance?.getAddress()
          if (!address) throw Error('membership address not found')
          return address || ''
        }, // nft address
        printsAddress, // prints
        ethers.parseEther('5000').toString(), // price in wei
      ],
      waitForConfirmation: true,
    },
    Auction: {
      args: [
        deployer.address, // admin
        async () => await contracts.Membership.instance!.getAddress(), // nft address
        1, // id first print
        payoutAddress, // payout address
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
    printsAddress,
    await contracts.Membership.instance!.getAddress(),
    await contracts.Migration.instance!.getAddress(),
    await contracts.Auction.instance!.getAddress(),
    WETH_MAINNET_ADDRESS,
  )

  await run('grant-role', {
    address: await contracts.Migration.instance!.getAddress(),
    role: 'MINTER_ROLE',
  })

  // await run('mint-tokens', {
  //   mintTo: deployer.address,
  // })
  // await run('unpause-migration')

  // await run('migrate', {
  //   mintTo: await contracts.Auction?.instance?.getAddress(),
  // })

  return contracts
})
// ❯ yarn hardhat verify --network mainnet 0xa86Ca17B2Ad9B4495e590DC188291B53701C01B4 'ipfs://QmcF6KCccBHmEazNJW6MNgh9xJFBapLFdAefT19Uer4i43/' "0x6a07FEEF7Eb458A71Ac0AE759CCd3c78C70139cA" "0xbc49de68bcbd164574847a7ced47e7475179c76b" "500"
// ❯ yarn hardhat verify --network mainnet 0x0C64AF2d7c46e5Ed7Af296A7Da1861117C28525F "0x6a07FEEF7Eb458A71Ac0AE759CCd3c78C70139cA" "0xa86Ca17B2Ad9B4495e590DC188291B53701C01B4" "0x4dd28568D05f09b02220b09C2cb307bFd837cb95" "5000000000000000000000"
// ❯ yarn hardhat verify --network mainnet 0xD12CF3232865f0d6B309366526fA0174f15Db814 "0x6a07FEEF7Eb458A71Ac0AE759CCd3c78C70139cA" "0xa86Ca17B2Ad9B4495e590DC188291B53701C01B4" 1 "0xbc49de68bcbd164574847a7ced47e7475179c76b"
