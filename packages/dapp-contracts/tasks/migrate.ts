import { parseUnits } from 'ethers'
import { task, types } from 'hardhat/config'
import { default as contractAddresses } from '../logs/deploy.json'

task('migrate', 'Migrate one')
  .addOptionalParam(
    'mintTo',
    'Mint to address',
    '0x97CcF8F927045E4C5f936832d14904A68e595380',
    types.string,
  )
  .addOptionalParam('amount', 'Amount to mint', '100000', types.string)
  .setAction(async ({ mintTo, amount }, { ethers }) => {
    const chainId = (await ethers.provider
      .getNetwork()
      .then((n) => n.chainId)) as keyof typeof contractAddresses

    const migrationFactory = await ethers.getContractFactory('Migration')
    const erc20Factory = await ethers.getContractFactory('ERC20Mock')
    const migrationContract = migrationFactory.attach(
      contractAddresses[chainId].Migration,
    )
    const erc20Contract = erc20Factory.attach(
      contractAddresses[chainId].ERC20Mock,
    )
    console.log(
      `Migration contract address: ${contractAddresses[chainId].Membership}`,
    )

    // @ts-ignore
    const approveRes = await erc20Contract.approve(
      await migrationContract.getAddress(),
      parseUnits('50000000000000', 18),
    )
    await approveRes.wait()
    console.log(`Approved migration contract to spend tokens`)

    // @ts-ignore
    const mintRes = await migrationContract.migrate(mintTo, 1)
    await mintRes.wait()

    console.log(`Migrated! hash ${mintRes.hash}`)
  })
