import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import {
  ERC20Mock,
  ERC20Mock__factory,
  Membership,
  Membership__factory,
  Migration,
  Migration__factory,
} from '../typechain-types'


describe('Migration', function () {
  const printMinted = ethers.parseEther("100000")
  const printPrice = ethers.parseEther("5000")
  let migration: Migration
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let otherAccount: SignerWithAddress
  let membership: Membership
  let erc20Mock: ERC20Mock
  let defaultAdminRole: string

  async function deployMembership() {
    const [owner, user, otherAccount] = await ethers.getSigners()

    const MembershipFactory = (await ethers.getContractFactory(
      'Membership',
    )) as Membership__factory
    const membership = await MembershipFactory.deploy()

    const ERC20MockFactory = (await ethers.getContractFactory(
      'ERC20Mock',
    )) as ERC20Mock__factory
    const erc20Mock = await ERC20MockFactory.deploy(
      user.address,
      'Mock',
      'MCK',
      printMinted,
    )

    const MigrationFactory = (await ethers.getContractFactory(
      'Migration',
    )) as Migration__factory
    const migration = await MigrationFactory.deploy(
      await membership.getAddress(),
      await erc20Mock.getAddress(),
      printPrice,
    )

    await membership.grantRole(
      await membership.MINTER_ROLE(),
      await migration.getAddress(),
    )

    await migration.unpause()

    const defaultAdminRole = await membership.DEFAULT_ADMIN_ROLE()

    return {
      migration,
      owner,
      user,
      otherAccount,
      membership,
      erc20Mock,
      defaultAdminRole,
    }
  }

  beforeEach(async function () {
    ;({
      migration,
      owner,
      user,
      otherAccount,
      membership,
      erc20Mock,
      defaultAdminRole,
    } = await loadFixture(deployMembership))
  })

  describe('Migrate', function () {
    it('Can migrate one', async function () {
      await erc20Mock
        .connect(user)
        .approve(await migration.getAddress(), printPrice)
      await expect(migration.connect(user).migrate(owner.address, 1))
        .to.emit(migration, 'Migrated')
        .withArgs(owner.address, 1, printPrice)
      expect(await erc20Mock.balanceOf(user.address)).to.equal(
        printMinted - printPrice,
      )
      expect(await erc20Mock.balanceOf(await migration.getAddress())).to.equal(
        printPrice,
      )
    })

    it('Can not migrate 0', async function () {
      await expect(migration.migrate(owner.address, 0)).to.be.revertedWith(
        'Migration: amount must be greater than 0',
      )
    })

    it('Can not migrate to zero address', async function () {
      await expect(
        migration.migrate('0x0000000000000000000000000000000000000000', 1),
      ).to.be.revertedWith('Migration: cannot migrate to zero address')
    })

    it('Can migrate more than one', async function () {
      const amount = 3n
      await erc20Mock
        .connect(user)
        .approve(await migration.getAddress(), printPrice * amount)
      await migration.connect(user).migrate(user.address, amount)
      expect(await erc20Mock.balanceOf(user.address)).to.equal(
        printMinted - printPrice * amount,
      )
      expect(await erc20Mock.balanceOf(await migration.getAddress())).to.equal(
        printPrice * amount,
      )
      expect(await membership.balanceOf(user.address)).to.equal(amount)
    })

    it('Can migrate to someone else', async function () {
      await erc20Mock
        .connect(user)
        .approve(await migration.getAddress(), printPrice)
      await migration.connect(user).migrate(otherAccount.address, 1)
      expect(await erc20Mock.balanceOf(user.address)).to.equal(
        printMinted - printPrice,
      )
      expect(await erc20Mock.balanceOf(await migration.getAddress())).to.equal(
        printPrice,
      )
      expect(await membership.balanceOf(otherAccount.address)).to.equal(1)
    })

    it('Owner can mint even when paused', async function () {
      await erc20Mock
        .connect(user)
        ['transfer(address,address,uint256)'](
          user.address,
          owner.address,
          printPrice,
        )
      await migration.connect(owner).pause()
      await erc20Mock
        .connect(owner)
        .approve(await migration.getAddress(), printPrice)
      await migration.connect(owner).migrate(owner.address, 1)

      expect(await membership.balanceOf(owner.address)).to.equal(1)
    })
  })

  describe('Pause', function () {
    it('Owner can unpause and pause', async function () {
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
      await expect(membership.connect(user).pause()).to.be.revertedWith(
        `AccessControl: account ${user.address.toLowerCase()} is missing role ${defaultAdminRole}`,
      )
    })

    it('Can not migrate when paused', async function () {
      await erc20Mock
        .connect(user)
        .approve(await migration.getAddress(), printPrice)
      await membership.pause()
      await expect(
        migration.connect(user).migrate(owner.address, 1),
      ).to.be.revertedWith('Pausable: paused')
    })
  })
})
