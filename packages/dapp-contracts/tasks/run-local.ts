import fs from 'fs'
import { TASK_COMPILE, TASK_NODE } from 'hardhat/builtin-tasks/task-names'
import { task } from 'hardhat/config'
import { writeLogs } from './utils/_write-logs'
import { WETH_GOERLI_ADDRESS } from './utils/_addresses'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const ET = 'America/New_York'

task(
  'run-local',
  'Start a hardhat node, deploy contracts, and execute setup transactions',
).setAction(async (_, { ethers, run }) => {
  const network = await ethers.provider.getNetwork()
  // const [deployer, DAOVault, bob, marcia] = await ethers.getSigners()

  const { chainId } = await ethers.provider.getNetwork()

  await run(TASK_COMPILE)

  await Promise.race([
    run(TASK_NODE, { hostname: '0.0.0.0' }),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ])

  const contracts = await run('deploy-local')

  // Run other tasks
  // await Promise.all([
  //   run('mint-nfts', {
  //     erc721Mock: contracts.ERC721Mock.instance.address,
  //     mintTo: DAOVault.address,
  //     qty: 100,
  //   }),
  // ])

  const erc20MockAddress = await contracts.ERC20Mock.instance?.getAddress()
  const membershipAddress = await contracts.Membership.instance?.getAddress()
  const migrationAddress = await contracts.Migration.instance?.getAddress()
  const auctionAddress = await contracts.Auction.instance?.getAddress()

  console.log(
    `arod.studio template contracts deployed to local node at http://localhost:8545 (Chain ID: ${chainId})`,
  )
  console.log(`ERC20 Mock ($PRINTS) address: ${erc20MockAddress}`)
  console.log(`Membership address: ${membershipAddress}`)
  console.log(`Migration address: ${migrationAddress}`)
  console.log(`Auction address: ${auctionAddress}`)

  writeLogs(
    network.chainId,
    erc20MockAddress,
    membershipAddress,
    migrationAddress,
    auctionAddress,
    WETH_GOERLI_ADDRESS,
  )

  // Set local node mining interval
  await ethers.provider.send('evm_setIntervalMining', [12_000])

  await run('grant-role', {
    address: migrationAddress,
    role: 'MINTER_ROLE',
  })

  await run('mint-tokens', {
    mintTo: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  })

  await run('unpause-migration')

  const startTime = dayjs.tz('2023-08-15 10:00:00', ET)
  const startTimeUnix = startTime.unix()
  const endTimeUnix = startTime.add(24, 'hours').unix()
  // const startTime = dayjs().add(1, 'minutes')
  // const startTimeUnix = startTime.unix()
  // const endTimeUnix = startTime.add(10, 'minutes').unix()

  const minBidIncrementInWei = ethers.parseEther('0.2').toString()
  const startAmountInWei = ethers.parseEther('4.8').toString()
  await run('set-auction-config', {
    startTime: startTimeUnix,
    endTime: endTimeUnix,
    minBidIncrementInWei,
    startAmountInWei,
  })

  await new Promise(() => {
    /* keep node alive until this process is killed */
  })
})
