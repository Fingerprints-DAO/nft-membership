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
    const adminAddress = await owner.getAddress()
    const payoutAddress = await owner.getAddress()
    const royaltyFee = 1000 // 10%
    const membership = await MembershipFactory.deploy(
      baseURI,
      adminAddress,
      payoutAddress,
      royaltyFee,
    )

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
      expect(await membership.name()).to.be.equal('Voxelglyph')
      expect(await membership.symbol()).to.be.equal('#')
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
      await expect(
        membership.connect(owner).setDefaultRoyalty(otherAccount.address, 1),
      ).to.emit(membership, 'DefaultRoyaltySet')
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
      await expect(membership.setBaseURI(tokenUri)).to.emit(
        membership,
        'BaseURIChanged',
      )

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

  describe('Override functions', function () {
    it('Approves an account to spend a token', async function () {
      await membership.safeMint(owner.address, 1)
      await membership.approve(otherAccount.address, 1)
      expect(await membership.getApproved(1)).to.be.equal(otherAccount.address)
    })

    it('Sets approval for an operator to spend all tokens of an account', async function () {
      await membership.setApprovalForAll(otherAccount.address, true)
      expect(
        await membership.isApprovedForAll(owner.address, otherAccount.address),
      ).to.be.equal(true)
    })

    it('Returns the account approved to spend a token', async function () {
      await membership.safeMint(owner.address, 1)
      await membership.approve(otherAccount.address, 1)
      expect(await membership.getApproved(1)).to.be.equal(otherAccount.address)
    })

    it('Returns whether an operator is approved to spend all tokens of an account', async function () {
      await membership.setApprovalForAll(otherAccount.address, true)
      expect(
        await membership.isApprovedForAll(owner.address, otherAccount.address),
      ).to.be.equal(true)
    })

    it('Transfers a token from one account to another', async function () {
      await membership.safeMint(owner.address, 1)
      await membership.transferFrom(owner.address, otherAccount.address, 1)
      expect(await membership.ownerOf(1)).to.be.equal(otherAccount.address)
    })

    it('Safely transfers a token from one account to another', async function () {
      await membership.safeMint(owner.address, 1)
      await membership['safeTransferFrom(address,address,uint256)'](
        owner.address,
        otherAccount.address,
        1,
      )
      expect(await membership.ownerOf(1)).to.be.equal(otherAccount.address)
    })

    it('Safely transfers a token from one account to another with data', async function () {
      await membership.safeMint(owner.address, 1)
      await membership['safeTransferFrom(address,address,uint256,bytes)'](
        owner.address,
        otherAccount.address,
        1,
        '0x1234',
      )
      expect(await membership.ownerOf(1)).to.be.equal(otherAccount.address)
    })
  })
})
