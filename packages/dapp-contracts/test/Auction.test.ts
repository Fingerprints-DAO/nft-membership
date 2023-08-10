import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { Auction, Auction__factory, Membership } from '../typechain-types'

describe('Auction', function () {
  let auction: Auction
  let membership: Membership
  let seller: SignerWithAddress
  let bidder1: SignerWithAddress
  let bidder2: SignerWithAddress
  let treasury: SignerWithAddress
  let startingBid = ethers.toBigInt(100)
  let defaultAdminRole: string

  const nftId = 1
  const minBidIncrement = ethers.parseEther('0.1')

  const deployContracts = async () => {
    const MembershipFactory = await ethers.getContractFactory('Membership')
    const baseURI = 'https://example.com/'

    const adminAddress = await seller.getAddress()
    const payoutAddress = await seller.getAddress()
    const royaltyFee = 1000 // 10%
    const membership = await MembershipFactory.deploy(
      baseURI,
      adminAddress,
      payoutAddress,
      royaltyFee,
    )

    const auctionFactory = (await ethers.getContractFactory(
      'Auction',
    )) as Auction__factory
    const address = await membership.getAddress()

    const auction = await auctionFactory.deploy(
      adminAddress,
      address,
      nftId,
      treasury.address,
    )
    await membership.safeMint(await auction.getAddress(), 1)
    defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()
    return {
      auction,
      membership,
    }
  }

  async function deployAuctionFixture() {
    ;[seller, bidder1, bidder2, treasury] = await ethers.getSigners()
    ;({ auction, membership } = await deployContracts())
    const startTime = (await ethers.provider.getBlock('latest'))?.timestamp || 0
    const endTimeIn7Days = startTime + 7 * 24 * 60 * 60 // 7 days
    await auction.setConfig(
      startTime,
      endTimeIn7Days,
      minBidIncrement,
      startingBid,
    )
  }

  beforeEach(async function () {
    await loadFixture(deployAuctionFixture)
  })

  describe('Config', function () {
    it('Get config', async function () {
      const config = await auction.getConfig()
      expect(config[0]).to.not.equal(0)
      expect(config[1]).to.not.equal(0)
      expect(config[2]).to.equal(minBidIncrement)
    })

    it('Can not set config twice', async function () {
      const startTime =
        (await ethers.provider.getBlock('latest'))?.timestamp || 0
      const endTimeIn7Days = startTime + 7 * 24 * 60 * 60 // 7 days

      await expect(
        auction.setConfig(
          startTime,
          endTimeIn7Days,
          minBidIncrement,
          startingBid,
        ),
      ).to.be.revertedWithCustomError(auction, 'ConfigAlreadySet')
    })

    it('Only admin can set config', async function () {
      const now = (await ethers.provider.getBlock('latest'))?.timestamp || 0
      const endTimeIn7Days = now + 7 * 24 * 60 * 60 // 7 days

      await expect(
        auction
          .connect(bidder1)
          .setConfig(now, endTimeIn7Days, minBidIncrement, startingBid),
      ).to.be.revertedWith(
        `AccessControl: account ${bidder1.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })

    it('Revert on invalid config', async function () {
      const { auction: newAuction } = await deployContracts()
      const startTimeZero = 0
      const endTimeIn7Days = 7 * 24 * 60 * 60 // 7 days

      await expect(
        newAuction.setConfig(
          startTimeZero,
          endTimeIn7Days,
          minBidIncrement,
          startingBid,
        ),
      ).to.be.revertedWithCustomError(newAuction, 'InvalidStartEndTime')

      const startTimeIn7Days = 7 * 24 * 60 * 60 // 7 days
      const endTimeIn7DaysMinus1 = startTimeIn7Days - 1 // 7 days - 1

      await expect(
        newAuction.setConfig(
          startTimeIn7Days,
          endTimeIn7DaysMinus1,
          minBidIncrement,
          startingBid,
        ),
      ).to.be.revertedWithCustomError(newAuction, 'InvalidStartEndTime')

      const endTimeIn7DaysPlus1 = startTimeIn7Days + 7 * 24 * 60 * 60 + 1 // 7 days + 1
      const startingBid4 = 0

      await expect(
        newAuction.setConfig(
          startTimeIn7Days,
          endTimeIn7DaysPlus1,
          minBidIncrement,
          startingBid4,
        ),
      ).to.be.revertedWithCustomError(newAuction, 'InvalidAmountInWei')
      //test wrong minBidIncrementPercentage

      const endTimeIn7DaysPlus15 = startTimeIn7Days + 7 * 24 * 60 * 60 + 1 // 7 days + 1
      const startingBid5 = 100
      const minBidIncrementPercentage5 = 0

      await expect(
        newAuction.setConfig(
          startTimeIn7Days,
          endTimeIn7DaysPlus15,
          minBidIncrementPercentage5,
          startingBid5,
        ),
      ).to.be.revertedWithCustomError(newAuction, 'InvalidMinBidIncrementValue')
    })

    it('Can calculate minimum bid increment', async function () {
      const value = await auction.calculateMinBidIncrement()
      expect(value).to.equal(startingBid + minBidIncrement)
    })
  })

  describe('Bid', function () {
    it('Can not bid if config not set', async function () {
      const { auction: newAuction } = await deployContracts()
      await expect(
        newAuction.connect(bidder1).bid({ value: startingBid }),
      ).to.be.revertedWithCustomError(auction, 'ConfigNotSet')
    })
    it('Place a bid', async function () {
      const bid = await auction.calculateMinBidIncrement()

      await auction.connect(bidder1).bid({ value: bid })

      expect((await auction.getData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.getData()).highestBid).to.equal(bid)
    })

    it('Must send more than last by minBidIncrementPercentage', async function () {
      const bid = await auction.calculateMinBidIncrement()

      await auction.connect(bidder1).bid({ value: bid })

      expect((await auction.getData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.getData()).highestBid).to.equal(bid)

      await expect(
        auction.connect(bidder2).bid({ value: bid + ethers.toBigInt(1) }),
      ).to.be.revertedWithCustomError(auction, 'InvalidBidAmount')
    })

    it('Refund last bidder', async function () {
      const bid = await auction.calculateMinBidIncrement()

      await auction.connect(bidder1).bid({ value: bid })
      expect((await auction.getData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.getData()).highestBid).to.equal(bid)

      const balanceBefore = await ethers.provider.getBalance(
        await bidder1.getAddress(),
      )
      await expect(
        auction
          .connect(bidder2)
          .bid({ value: bid + (await auction.calculateMinBidIncrement()) }),
      ).to.changeEtherBalance(bidder1, bid)

      const balanceAfter = await ethers.provider.getBalance(
        await bidder1.getAddress(),
      )

      expect(balanceAfter).to.be.gt(balanceBefore)
    })

    it('Cannot bid if the auction has Auction has not started', async function () {
      await goBack10Minute()
      const bid = await auction.calculateMinBidIncrement()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWithCustomError(auction, 'InvalidStartEndTime')
    })

    it('Cannot bid if the auction has expired', async function () {
      const bid = await auction.calculateMinBidIncrement()
      await forwardEndTime()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWithCustomError(auction, 'InvalidStartEndTime')
    })

    it('Cannot bid if the contract is paused', async function () {
      const bid = await auction.calculateMinBidIncrement()
      await auction.connect(seller).pause()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith('Pausable: paused')
    })

    it('Cannot bid if auction has ended', async function () {
      const bid = await auction.calculateMinBidIncrement()

      await forwardEndTime()
      await auction.connect(seller).settleAuction()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWithCustomError(auction, 'InvalidStartEndTime')
    })

    it('Cannot bid if the value is less than the starting bid', async function () {
      const bid = startingBid - ethers.toBigInt(1)

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWithCustomError(auction, 'InvalidBidAmount')
    })
  })

  describe('Settle', function () {
    it('Transfer to winner if there is bid and treasury to get funds', async function () {
      const bid = await auction.calculateMinBidIncrement()
      await auction.connect(bidder1).bid({ value: bid })

      await forwardEndTime()

      await expect(
        auction.connect(seller).settleAuction(),
      ).to.changeEtherBalance(treasury, bid)
      expect(await membership.ownerOf(nftId)).to.equal(
        await bidder1.getAddress(),
      )
    })

    it('Cannot end the auction if time did not pass', async function () {
      await forward10MinutesBeforeEndTime()
      await expect(
        auction.connect(seller).settleAuction(),
      ).to.be.revertedWithCustomError(auction, 'AuctionNotEnded')
    })

    it('Cannot end the auction if the contract is paused', async function () {
      await auction.connect(seller).pause()

      await expect(auction.connect(seller).settleAuction()).to.be.revertedWith(
        'Pausable: paused',
      )
    })

    it('Cannot end the auction if config not set', async function () {
      const { auction: newAuction } = await deployContracts()
      await expect(
        newAuction.connect(seller).settleAuction(),
      ).to.be.revertedWithCustomError(auction, 'ConfigNotSet')
    })

    it('End the auction with no bids and transfer back to treasury', async function () {
      await forwardEndTime()

      await auction.connect(seller).settleAuction()
      expect(await membership.ownerOf(nftId)).to.equal(
        await treasury.getAddress(),
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

async function forwardEndTime(): Promise<void> {
  const seconds = 7 * 24 * 60 * 60

  await network.provider.send('evm_increaseTime', [seconds])
  await network.provider.send('evm_mine')
}

async function forward10MinutesBeforeEndTime(): Promise<void> {
  const seconds = 7 * 24 * 60 * 60 - 10 * 60

  await network.provider.send('evm_increaseTime', [seconds])
  await network.provider.send('evm_mine')
}

async function goBack10Minute(): Promise<void> {
  const seconds = -10 * 60

  await network.provider.send('evm_increaseTime', [seconds])
  await network.provider.send('evm_mine')
}
