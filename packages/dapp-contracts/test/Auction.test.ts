import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Auction, Auction__factory } from '../typechain-types'

describe('Auction', function () {
  let auction: Auction
  let seller: SignerWithAddress
  let bidder1: SignerWithAddress
  let bidder2: SignerWithAddress
  let startingBid = 100
  let defaultAdminRole: string
  const nftId = 1
  const minBidIncrementPercentage = 10 // 10%
  const duration = 7 * 24 * 60 * 60 // 7 days

  beforeEach(async function () {
    ;[seller, bidder1, bidder2] = await ethers.getSigners()

    const MembershipFactory = await ethers.getContractFactory('Membership')
    const membership = await MembershipFactory.deploy('https://example.com/')

    const auctionFactory = (await ethers.getContractFactory(
      'Auction',
    )) as Auction__factory
    const address = await membership.getAddress()
    auction = await auctionFactory.deploy(
      address,
      nftId,
      startingBid,
      minBidIncrementPercentage,
      duration,
    )
    await membership.safeMint(await auction.getAddress(), 1)
    defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()
  })

  describe('Commands', function () {
    it('Start the auction', async function () {
      await auction.connect(seller).start()

      expect(await auction.started()).to.be.true
      expect(await auction.endTime()).to.be.closeTo(
        Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        1000,
      )
    })
  })

  describe('Bid', function () {
    it('Place a bid', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()

      await auction.connect(bidder1).bid({ value: bid })

      expect(await auction.highestBidder()).to.equal(await bidder1.getAddress())
      expect(await auction.highestBid()).to.equal(bid)

      await expect(
        auction.connect(bidder2).bid({ value: bid + 1 }),
      ).to.be.revertedWith(
        'Must send more than last bid by minBidIncrementPercentage amount',
      )
    })
  })

  describe('Pause', function () {
    it('Owner can unpause and pause', async function () {
      await expect(auction.connect(seller).pause()).to.emit(auction, 'Paused')
      await expect(auction.connect(seller).unpause()).to.emit(
        auction,
        'Unpaused',
      )
    })

    it('Only owner can pause and unpause', async function () {
      await expect(auction.connect(bidder1).pause()).to.be.revertedWith(
        `AccessControl: account ${bidder1.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
      await expect(auction.connect(bidder1).unpause()).to.be.revertedWith(
        `AccessControl: account ${bidder1.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })
  })
})
