import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Auction as AuctionType } from '../typechain-types'
import { getAddresses } from './utils/_getAddresses'

task('settle-auction', 'Settle auction').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const contractAddresses = await getAddresses(hre.ethers.provider)

    const Auction = await hre.ethers.getContractFactory('Auction')
    const auction = Auction.attach(contractAddresses.Auction) as AuctionType

    const tx = await auction.settleAuction()

    console.log(`Settle auction - Waiting for confirmation...`)
    await tx.wait()
    console.log(`Settle auction - Transaction confirmed!`)
  },
)
