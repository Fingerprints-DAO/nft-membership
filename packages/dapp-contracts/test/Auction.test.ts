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
  let startingBid = 100
  let defaultAdminRole: string

  const nftId = 1
  const minBidIncrementPercentage = 10 // 10%
  const duration = 7 * 24 * 60 * 60 // 7 days
  const timeBuffer = 15 * 60 // 15 minutes

  async function deployAuction() {
    ;[seller, bidder1, bidder2, treasury] = await ethers.getSigners()

    const MembershipFactory = await ethers.getContractFactory('Membership')
    membership = await MembershipFactory.deploy('https://example.com/')

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
      timeBuffer,
      treasury.address,
    )
    await membership.safeMint(await auction.getAddress(), 1)
    defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()
  }

  beforeEach(async function () {
    await loadFixture(deployAuction)
  })

  describe('Commands', function () {
    it('Start the auction', async function () {
      await auction.connect(seller).start()

      expect((await auction.auctionData()).started).to.be.true
      const blockTime = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber(),
      )
      const expectedEndTime = blockTime!.timestamp + duration
      expect((await auction.auctionData()).endTime).to.be.closeTo(
        expectedEndTime,
        1000,
      )
    })

    it('Cannot start the auction if it has already started', async function () {
      await auction.connect(seller).start()

      await expect(auction.connect(seller).start()).to.be.revertedWith(
        'Auction already started',
      )
    })

    it('Cannot start the auction if not the owner of the NFT', async function () {
      await expect(auction.connect(bidder1).start()).to.be.revertedWith(
        `AccessControl: account ${bidder1.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })

    it('Cannot start the auction if the contract is paused', async function () {
      await auction.connect(seller).pause()

      await expect(auction.connect(seller).start()).to.be.revertedWith(
        'Pausable: paused',
      )
    })
  })

  describe('Bid', function () {
    it('Place a bid', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()

      await auction.connect(bidder1).bid({ value: bid })

      expect((await auction.auctionData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.auctionData()).highestBid).to.equal(bid)
    })

    it('Must send more than last by minBidIncrementPercentage', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()

      await auction.connect(bidder1).bid({ value: bid })

      expect((await auction.auctionData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.auctionData()).highestBid).to.equal(bid)

      await expect(
        auction.connect(bidder2).bid({ value: bid + 1 }),
      ).to.be.revertedWith(
        'Must send more than last bid by minBidIncrementPercentage amount',
      )
    })

    it('Refund last bidder', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()

      await auction.connect(bidder1).bid({ value: bid })
      expect((await auction.auctionData()).highestBidder).to.equal(
        await bidder1.getAddress(),
      )
      expect((await auction.auctionData()).highestBid).to.equal(bid)

      const balanceBefore = await ethers.provider.getBalance(
        await bidder1.getAddress(),
      )
      await expect(
        auction.connect(bidder2).bid({ value: bid + 20 }),
      ).to.changeEtherBalance(bidder1, bid)

      const balanceAfter = await ethers.provider.getBalance(
        await bidder1.getAddress(),
      )

      expect(balanceAfter).to.be.gt(balanceBefore)
    })

    it('Extend time if in bid time buffer', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()
      await auction.connect(bidder1).bid({ value: bid })

      await forward10MinutesBeforeEndTime()

      await expect(auction.connect(bidder2).bid({ value: bid + 20 })).to.emit(
        auction,
        'AuctionExtended',
      )

      const blockTime = await ethers.provider.getBlock(
        await ethers.provider.getBlockNumber(),
      )

      expect((await auction.auctionData()).endTime).to.be.closeTo(
        blockTime!.timestamp + timeBuffer,
        10,
      )

      await auction.connect(bidder1).bid({ value: bid + 40 })
      await forward10MinutesBeforeEndTime()

      await auction.connect(seller).end()
      expect((await auction.auctionData()).ended).to.be.true
      expect(await membership.ownerOf(nftId)).to.equal(
        await bidder1.getAddress(),
      )
    })

    it('Cannot bid if the auction has Auction has not started', async function () {
      const bid = startingBid + 10

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith('Auction has not started')
    })

    it('Cannot bid if the auction has ended', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()
      await forwardEndTime()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith('Auction has expired')
    })

    it('Cannot bid if the contract is paused', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).pause()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith('Pausable: paused')
    })

    it('Cannot bid if auction has ended', async function () {
      const bid = startingBid + 10

      await auction.connect(seller).start()

      await forwardEndTime()
      await auction.connect(seller).end()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith('Auction has expired')
    })

    it('Cannot bid if the value is less than the starting bid', async function () {
      const bid = startingBid - 1
      await auction.connect(seller).start()

      await expect(
        auction.connect(bidder1).bid({ value: bid }),
      ).to.be.revertedWith(
        'Must send more than last bid by minBidIncrementPercentage amount',
      )
    })
  })

  describe('End', function () {
    it('Transfer to winner if there is bid and treasury to get funds', async function () {
      const bid = startingBid + 10
      await auction.connect(seller).start()
      await auction.connect(bidder1).bid({ value: bid })

      await forwardEndTime()

      await expect(auction.connect(seller).end()).to.changeEtherBalance(
        treasury,
        bid,
      )
      expect((await auction.auctionData()).ended).to.be.true
      expect(await membership.ownerOf(nftId)).to.equal(
        await bidder1.getAddress(),
      )
    })

    it('Cannot end the auction if it has Auction has not started', async function () {
      await expect(auction.connect(seller).end()).to.be.revertedWith(
        'Auction has not started',
      )
    })

    it('Cannot end the auction if it has already ended', async function () {
      await auction.connect(seller).start()
      await forwardEndTime()
      await auction.connect(seller).end()

      await expect(auction.connect(seller).end()).to.be.revertedWith(
        'Auction has already ended',
      )
    })

    it('Cannot end the auction if time did not pass', async function () {
      await auction.connect(seller).start()
      await forward10MinutesBeforeEndTime()
      await expect(auction.connect(seller).end()).to.be.revertedWith(
        'Auction has not ended',
      )
    })

    it('Cannot end the auction if the contract is paused', async function () {
      await auction.connect(seller).start()
      await auction.connect(seller).pause()

      await expect(auction.connect(seller).end()).to.be.revertedWith(
        'Pausable: paused',
      )
    })

    it('End the auction with no bids and transfer back to treasury', async function () {
      await auction.connect(seller).start()
      await forwardEndTime()

      await auction.connect(seller).end()
      expect((await auction.auctionData()).ended).to.be.true
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
