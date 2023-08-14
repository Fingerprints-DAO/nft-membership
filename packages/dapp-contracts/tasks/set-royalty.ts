import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Membership as MembershipType } from '../typechain-types'
import { getAddresses } from './utils/_getAddresses'

task('set-royalty', 'Set royalty config')
  .addParam('payoutAddress', 'Payout address', '', types.string)
  .addParam('value', 'Royalties Value')
  .setAction(
    async (
      taskArgs: {
        payoutAddress: string
        value: number
      },
      hre: HardhatRuntimeEnvironment,
    ) => {
      const { payoutAddress, value } = taskArgs
      const contractAddresses = await getAddresses(hre.ethers.provider)

      const Membership = await hre.ethers.getContractFactory('Membership')
      const membershio = Membership.attach(contractAddresses.Membership) as MembershipType

      const tx = await membershio.setDefaultRoyalty(payoutAddress, value)

      console.log(`Setting royalty config - payoutAddress: ${payoutAddress}, value: ${value}`)
      console.log(`Transaction hash: ${tx.hash}`)
      console.log(`Waiting for confirmation...`)
      await tx.wait()
      console.log(`Transaction confirmed!`)
    },
  )
