import { task, types } from 'hardhat/config'
import { getAddresses } from './utils/_getAddresses'
import { Membership } from '../typechain-types'

task('log', 'Log necessary infos')
  .addOptionalParam('address', 'User address', null, types.string)
  .setAction(async ({ address }, { ethers }) => {
    const contractAddresses = await getAddresses(ethers.provider)

    const membershipFactory = await ethers.getContractFactory('Membership')
    const membershipContract = membershipFactory.attach(contractAddresses.Membership) as Membership

    console.log(`Membership contract address: ${contractAddresses.Membership}`)

    console.log(`BalanceOf: ${await membershipContract.balanceOf(address)}`)
  })
