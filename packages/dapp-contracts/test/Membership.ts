import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Membership, Membership__factory } from '../typechain-types'

describe('Membership', function () {
  let membership: Membership
  let owner: SignerWithAddress
  let otherAccount: SignerWithAddress
  let minterRole: string
  let defaultAdminRole: string
  let auction: SignerWithAddress

  async function deployMembership() {
    const [owner, otherAccount, auction] = await ethers.getSigners()

    const MembershipFactory = (await ethers.getContractFactory(
      'Membership',
    )) as Membership__factory
    const membership = await MembershipFactory.deploy(auction.address)

    const minterRole = await membership.MINTER_ROLE()
    const defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()

    return {
      membership,
      owner,
      otherAccount,
      minterRole,
      defaultAdminRole,
      auction,
    }
  }

  beforeEach(async function () {
    ;({
      membership,
      auction,
      owner,
      otherAccount,
      minterRole,
      defaultAdminRole,
    } = await loadFixture(deployMembership))
  })

  describe('Deploy', function () {
    it('Deployed', async function () {
      expect(await membership.name()).to.be.equal('Membership')
      expect(await membership.symbol()).to.be.equal('MBSP')
      expect(await membership.MAX_SUPPLY()).to.be.equal(2000)
      expect(await membership.paused()).to.be.equal(false)
      expect(await membership.balanceOf(auction.address)).to.be.equal(1)
    })
  })

  describe('Mint', function () {
    it('Minter can mint', async function () {
      expect(await membership.safeMint(otherAccount.address, 1)).to.emit(
        membership,
        'Transfer',
      )
    })

    it('Only minter can mint', async function () {
      await expect(
        membership.connect(otherAccount).safeMint(otherAccount.address, 1),
      ).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${minterRole}`,
      )
    })

    it('Minter can mint multiple', async function () {
      expect(await membership.safeMint(otherAccount.address, 2)).to.emit(
        membership,
        'Transfer',
      )

      expect(await membership.balanceOf(otherAccount.address)).to.be.equal(2)
    })

    it('Can not mint more than token supply', async function () {
      await expect(
        membership.safeMint(otherAccount.address, 2001),
      ).to.be.revertedWith('Membership: MAX_SUPPLY exceeded')
    })
  })

  describe('Pause', function () {
    it('Owner can pause and unpause', async function () {
      await expect(membership.connect(owner).pause()).to.emit(
        membership,
        'Paused',
      )
      await expect(membership.connect(owner).unpause()).to.emit(
        membership,
        'Unpaused',
      )
    })

    it('Only owner can pause', async function () {
      await expect(membership.connect(otherAccount).pause()).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })
  })

  describe('Royalties', function () {
    it('Calculate royalty info', async function () {
      expect(
        await membership.connect(owner).royaltyInfo(otherAccount.address, 1000),
      ).to.be.deep.equal([owner.address, 100])
    })

    it('Owner can set royalties', async function () {
      await membership.connect(owner).setDefaultRoyalty(otherAccount.address, 1)
    })

    it('Only owner can set royalties', async function () {
      await expect(
        membership
          .connect(otherAccount)
          .setDefaultRoyalty(otherAccount.address, 10),
      ).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })
  })

  describe('Burn', function () {
    it('Owner can burn', async function () {
      await membership.safeMint(otherAccount.address, 1)

      await membership.connect(otherAccount).burn(1)

      expect(await membership.balanceOf(otherAccount.address)).to.be.equal(0)
    })
  })

  describe('Support interface', function () {
    it('Return true for 721, 165 and 2981', async function () {
      expect(await membership.supportsInterface('0x80ac58cd')).to.be.equal(true) // 721
      expect(await membership.supportsInterface('0x01ffc9a7')).to.be.equal(true) // 165
      expect(await membership.supportsInterface('0x2a55205a')).to.be.equal(true) // 2981
    })
  })
})
