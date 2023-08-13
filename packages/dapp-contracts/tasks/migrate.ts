import { parseUnits } from 'ethers'
import { task, types } from 'hardhat/config'
import { getAddresses } from './utils/_getAddresses'

task('migrate', 'Migrate one')
  .addOptionalParam(
    'mintTo',
    'Mint to address',
    '0x97CcF8F927045E4C5f936832d14904A68e595380',
    types.string,
  )
  .addOptionalParam('amount', 'Amount to mint', '100000', types.string)
  .setAction(async ({ mintTo }, { ethers }) => {
    const contractAddresses = await getAddresses(ethers.provider)

    const migrationFactory = await ethers.getContractFactory('Migration')
    const migrationContract = migrationFactory.attach(contractAddresses.Migration)
    const erc20Factory = await ethers.getContractFactory('ERC20Mock')
    const erc20Contract = erc20Factory.attach(contractAddresses.ERC20Mock)
    console.log(`Migration contract address: ${contractAddresses.Migration}`)
    console.table(contractAddresses)
    console.log(`get address ${await migrationContract.getAddress()}`)

    // @ts-ignore
    const approveRes = await erc20Contract.approve(
      await migrationContract.getAddress(),
      parseUnits('50000000000000', 18),
    )
    await approveRes.wait()
    console.log(`Approved migration contract to spend tokens`)

    console.log(`migrating address ${await migrationContract.getAddress()} mintTo: ${mintTo}`)

    // @ts-ignore
    const mintRes = await migrationContract.migrate(mintTo, 1)
    await mintRes.wait()

    console.log(`Migrated! hash ${mintRes.hash}`)
  })
