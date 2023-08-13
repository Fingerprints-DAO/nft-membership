import { task, types } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Auction as AuctionType } from '../typechain-types'
import { getAddresses } from './utils/_getAddresses'

task('set-auction-config', 'Set auction config')
  .addParam('startTime', 'The timestamp when the auction starts', undefined, types.int)
  .addParam('endTime', 'The timestamp when the auction ends', undefined, types.int)
  .addParam('minBidIncrementInWei', 'The minimum bid increment amount in wei')
  .addParam('startAmountInWei', 'The starting bid amount in wei')
  .setAction(
    async (
      taskArgs: {
        startTime: number
        endTime: number
        minBidIncrementInWei: number
        startAmountInWei: number
      },
      hre: HardhatRuntimeEnvironment,
    ) => {
      const { startTime, endTime, minBidIncrementInWei, startAmountInWei } = taskArgs
      const contractAddresses = await getAddresses(hre.ethers.provider)

      const Auction = await hre.ethers.getContractFactory('Auction')
      const auction = Auction.attach(contractAddresses.Auction) as AuctionType

      const tx = await auction.setConfig(startTime, endTime, minBidIncrementInWei, startAmountInWei)

      console.log(
        `Setting auction config with startTime: ${startTime}, endTime: ${endTime}, minBidIncrementInWei: ${minBidIncrementInWei}, startAmountInWei: ${startAmountInWei}`,
      )
      console.log(`Transaction hash: ${tx.hash}`)
      console.log(`Waiting for confirmation...`)
      await tx.wait()
      console.log(`Transaction confirmed!`)
    },
  )
