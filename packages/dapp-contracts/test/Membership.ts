import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Membership__factory } from '../typechain-types'

describe('Membership', function () {
  async function deployMembership() {
    const [owner, otherAccount] = await ethers.getSigners()

    const MembershipFactory = (await ethers.getContractFactory(
      'Membership',
    )) as Membership__factory
    const membership = await MembershipFactory.deploy()

    const minterRole = await membership.MINTER_ROLE()
    const defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()

    return { membership, owner, otherAccount, minterRole, defaultAdminRole }
  }

  describe('Membership', function () {
    describe('Mint', function () {
      it('Minter can mint', async function () {
        const { membership, otherAccount } = await loadFixture(deployMembership)

        expect(await membership.safeMint(otherAccount.address, 1)).to.emit(
          membership,
          'Transfer',
        )
      })

      it('Only minter can mint', async function () {
        const { membership, otherAccount, minterRole } = await loadFixture(
          deployMembership,
        )

        await expect(
          membership.connect(otherAccount).safeMint(otherAccount.address, 1),
        ).to.be.revertedWith(
          `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${minterRole}`,
        )
      })

      it('Minter can mint multiple', async function () {
        const { membership, otherAccount } = await loadFixture(deployMembership)

        expect(await membership.safeMint(otherAccount.address, 2)).to.emit(
          membership,
          'Transfer',
        )

        expect(await membership.balanceOf(otherAccount.address)).to.be.equal(2)
      })

      it('Can not mint more than token supply', async function () {
        const { membership, otherAccount } = await loadFixture(deployMembership)

        await expect(
          membership.safeMint(otherAccount.address, 2001),
        ).to.be.revertedWith('Membership: MAX_SUPPLY exceeded')
      })
    })

    describe('Pause', function () {
      it('Owner can pause', async function () {
        const { membership, owner } = await loadFixture(deployMembership)

        await expect(membership.connect(owner).pause()).to.emit(
          membership,
          'Paused',
        )
      })

      it('Only owner can pause', async function () {
        const { membership, otherAccount, defaultAdminRole } =
          await loadFixture(deployMembership)

        await expect(
          membership.connect(otherAccount).pause(),
        ).to.be.revertedWith(
          `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
        )
      })
    })

    describe('Royalties', function () {
      it('Calculate royalty info', async function () {
        const { membership, owner, otherAccount } = await loadFixture(
          deployMembership,
        )

        expect(
          await membership
            .connect(owner)
            .royaltyInfo(otherAccount.address, 1000),
        ).to.be.deep.equal([owner.address, 100])
      })

      it('Owner can set royalties', async function () {
        const { membership, owner, otherAccount } = await loadFixture(
          deployMembership,
        )

        await membership
          .connect(owner)
          .setDefaultRoyalty(otherAccount.address, 1)
      })

      it('Only owner can set royalties', async function () {
        const { membership, otherAccount, defaultAdminRole } =
          await loadFixture(deployMembership)

        await expect(
          membership
            .connect(otherAccount)
            .setDefaultRoyalty(otherAccount.address, 10),
        ).to.be.revertedWith(
          `AccessControl: account ${otherAccount.address.toLowerCase()} is missing role ${defaultAdminRole}`,
        )
      })
    })
  })
})
