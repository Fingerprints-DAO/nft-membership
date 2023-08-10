import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Migration as MigrationType } from '../typechain-types'
import { default as contractAddresses } from '../logs/deploy.json'

task('unpause-migration', 'Unpause migration contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const chainId = (await hre.ethers.provider
      .getNetwork()
      .then((n) => n.chainId)) as keyof typeof contractAddresses

    const Migration = await hre.ethers.getContractFactory('Migration')
    const migration = Migration.attach(
      contractAddresses[chainId].Migration,
    ) as MigrationType

    const tx = await migration.unpause()

    console.log(`Unpause - Waiting for confirmation...`)
    await tx.wait()
    console.log(`Unpause - Transaction confirmed!`)
  },
)
