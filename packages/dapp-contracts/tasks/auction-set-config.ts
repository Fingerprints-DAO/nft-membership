import dayjs from 'dayjs'
import { task } from 'hardhat/config'
import { default as contractAddresses } from '../logs/deploy.json'

task('auction-set-config', 'Start the auction by setting the config').setAction(
  async ({}, { ethers }) => {
    const chainId = (await ethers.provider
      .getNetwork()
      .then((n) => n.chainId)) as keyof typeof contractAddresses

    // get contract interface
    const auctionFactory = await ethers.getContractFactory('Auction')

    // set contract address
    const auctionContract = auctionFactory.attach(
      contractAddresses[chainId].Auction,
    )

    const secondsInADay = 24 * 60 * 60
    const startTimeUnix = Math.floor(Date.now() / 1000) + 2 * secondsInADay
    const endTimeUnix = startTimeUnix + 5 * 3600 // 5 hours

    // const startTime = dayjs()
    // const startTimeUnix = startTime.unix()
    // const endTimeUnix = startTime.add(25, 'minutes').unix()

    const minBidIncrement = ethers.parseEther('0.2')
    const startingBid = ethers.parseEther('4.8')

    // @ts-ignore
    const tx = await auctionContract.setConfig(
      startTimeUnix,
      endTimeUnix,
      minBidIncrement,
      startingBid,
    )

    console.log(`[Auction] SetConfig: Waiting for confirmation...`)
    await tx.wait()
    console.log(`[Auction] SetConfig: Transaction confirmed!`)
  },
)
