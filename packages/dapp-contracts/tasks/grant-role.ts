import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Membership } from '../typechain-types'
import { getAddresses } from './utils/_getAddresses'

task('grant-role', 'Grant role to address')
  .addParam(
    'address',
    'The address to grant the role to',
    undefined,
    types.string,
    false, // This makes the parameter required
  )
  .addParam(
    'role',
    'The role to grant (MINTER_ROLE, DEFAULT_ADMIN_ROLE)',
    undefined,
    types.string,
    false, // This makes the parameter required
  )
  .setAction(
    async (taskArgs: { address: string; role: string }, hre: HardhatRuntimeEnvironment) => {
      const { address, role } = taskArgs
      const contractAddresses = await getAddresses(hre.ethers.provider)

      const Membership = await hre.ethers.getContractFactory('Membership')
      console.log('membership address', contractAddresses.Membership)
      const membership = Membership.attach(contractAddresses.Membership) as Membership

      console.log('getting role')
      const MINTER_ROLE = await membership.MINTER_ROLE()
      console.log('is minter role', MINTER_ROLE)
      console.log('getting role admin')
      const DEFAULT_ADMIN_ROLE = await membership.DEFAULT_ADMIN_ROLE()
      console.log('is minter role', DEFAULT_ADMIN_ROLE)

      if (!['MINTER_ROLE', 'DEFAULT_ADMIN_ROLE'].includes(role)) {
        throw new Error(`Invalid role: ${role}`)
      }

      let newRole = role === 'MINTER_ROLE' ? MINTER_ROLE : DEFAULT_ADMIN_ROLE

      const tx = await membership.grantRole(newRole, address)

      console.log(`Granting role ${newRole} to ${address}`)
      console.log(`Transaction hash: ${tx.hash}`)
      console.log(`Waiting for confirmation...`)
      await tx.wait()
      console.log(`Transaction confirmed!`)
    },
  )
