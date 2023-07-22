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
  const baseURI = 'https://example.com/'

  async function deployMembership() {
    const [owner, otherAccount] = await ethers.getSigners()

    const MembershipFactory = (await ethers.getContractFactory(
      'Membership',
    )) as Membership__factory
    const membership = await MembershipFactory.deploy(baseURI)

    const minterRole = await membership.MINTER_ROLE()
    const defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()

    return {
      membership,
      owner,
      otherAccount,
      minterRole,
      defaultAdminRole,
    }
  }

  beforeEach(async function () {
    ;({ membership, owner, otherAccount, minterRole, defaultAdminRole } =
      await loadFixture(deployMembership))
  })

  describe('Deploy', function () {
    it('Deployed', async function () {
      expect(await membership.name()).to.be.equal('Membership')
      expect(await membership.symbol()).to.be.equal('MBSP')
      expect(await membership.MAX_SUPPLY()).to.be.equal(2000)
      expect(await membership.paused()).to.be.equal(false)
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
      for (let i = 0; i < 100; i++) {
        await membership.safeMint(otherAccount.address, 20)
      }
      await expect(
        membership.safeMint(otherAccount.address, 1),
      ).to.be.revertedWithCustomError(membership, 'MaxSupplyExceeded')
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

    it('Only owner can pause and unpause', async function () {
      await expect(membership.connect(otherAccount).pause()).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
      await expect(
        membership.connect(otherAccount).unpause(),
      ).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })

    it('Cannot mint when paused', async function () {
      await membership.connect(owner).pause()
      await expect(
        membership.safeMint(otherAccount.address, 1),
      ).to.be.revertedWith('Pausable: paused')
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

    it('Not Owner can not burn', async function () {
      await membership.safeMint(otherAccount.address, 1)

      await expect(membership.connect(owner).burn(1)).to.be.revertedWith(
        `ERC721: caller is not token owner or approved`,
      )
    })
  })

  describe('Support interface', function () {
    it('Return true for 721, 165 and 2981', async function () {
      expect(await membership.supportsInterface('0x80ac58cd')).to.be.equal(true) // 721
      expect(await membership.supportsInterface('0x01ffc9a7')).to.be.equal(true) // 165
      expect(await membership.supportsInterface('0x2a55205a')).to.be.equal(true) // 2981
    })
  })

  describe('Votes', function () {
    it('Can delegate votes', async function () {
      const amount = 2
      await membership.safeMint(owner.address, amount)
      await membership.connect(owner).delegate(otherAccount.address)

      expect(await membership.getVotes(otherAccount.address)).to.be.equal(
        amount,
      )
    })
  })

  describe('Base Uri', function () {
    it('Can set token uri', async function () {
      const tokenUri = 'https://example2.com/'
      await membership.setBaseURI(tokenUri)

      expect(await membership.baseURIValue()).to.be.equal(tokenUri)
    })

    it('Only admin can set token uri', async function () {
      const tokenUri = 'https://example2.com/'
      await expect(
        membership.connect(otherAccount).setBaseURI(tokenUri),
      ).to.be.revertedWith(
        `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })

    it('Return token id concatenated with base uri', async function () {
      await membership.safeMint(owner.address, 1)
      expect(await membership.tokenURI(1)).to.be.equal(baseURI + '1')
    })
  })
})
