import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

task('advance-time', 'Advances the blockchain time')
  .addParam(
    'timestamp',
    'The desired UNIX timestamp to advance time to',
    undefined,
    types.int,
    false // This makes the parameter required
  )
  .setAction(async (taskArgs: { timestamp: number }, hre: HardhatRuntimeEnvironment) => {
    const currentTimestamp = (await hre.ethers.provider.getBlock('latest'))?.timestamp ?? 0

    if (taskArgs.timestamp < currentTimestamp) {
      throw new Error('The desired timestamp must be in the future')
    }

    const seconds = taskArgs.timestamp - currentTimestamp // Calculate the number of seconds to advance

    console.log('Current block timestamp:', currentTimestamp)

    console.log(`\nMoving time forward to ${new Date(taskArgs.timestamp * 1000).toUTCString()}...`)

    await hre.network.provider.send('evm_increaseTime', [seconds])
    await hre.network.provider.send('evm_mine')

    console.log('New block timestamp:', (await hre.ethers.provider.getBlock('latest'))?.timestamp ?? 'error')
  })
