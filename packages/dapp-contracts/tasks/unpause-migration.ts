import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Migration as MigrationType } from '../typechain-types'
import { getAddresses } from './utils/_getAddresses'

task('unpause-migration', 'Unpause migration contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const contractAddresses = await getAddresses(hre.ethers.provider)

    const Migration = await hre.ethers.getContractFactory('Migration')
    const migration = Migration.attach(contractAddresses.Migration) as MigrationType

    const tx = await migration.unpause()

    console.log(`Unpause - Waiting for confirmation...`)
    await tx.wait()
    console.log(`Unpause - Transaction confirmed!`)
  },
)
