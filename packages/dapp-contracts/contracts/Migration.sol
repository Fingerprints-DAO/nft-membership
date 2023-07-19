// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IMembership.sol';

contract Migration is Pausable, AccessControl {
  address public immutable membershipAddress;
  address public immutable printAddress;
  uint256 public immutable pricePerMembership;

  modifier whenNotPausedOrAdmin() {
    require(
      !paused() || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
      'Pausable: paused'
    );
    _;
  }

  constructor(
    address _membershipAddress,
    address _printAddress,
    uint256 _pricePerMembership
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    membershipAddress = _membershipAddress;
    printAddress = _printAddress;
    pricePerMembership = _pricePerMembership;
    _pause();
  }

  /// @notice Migrate membership from ERC20 to ERC721, locks print and mint NFT.
  /// @param to The address of the future owner of the token.
  /// @param amount The amount of tokens to migrate.
  function migrate(address to, uint16 amount) public whenNotPausedOrAdmin {
    require(amount > 0, 'Migration: amount must be greater than 0');
    require(to != address(0), 'Migration: cannot migrate to zero address');

    uint256 totalPrintPrice = amount * pricePerMembership;
    uint256 balance = IERC20(printAddress).balanceOf(msg.sender);
    require(balance >= totalPrintPrice, 'Migration: insufficient balance');

    IERC20(printAddress).transferFrom(
      msg.sender,
      address(this),
      totalPrintPrice
    );

    IMembership(membershipAddress).safeMint(to, amount);
  }

  /// @notice Only Admin can pauses all token transfers.
  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @notice Only Admin can unpauses all token transfers.
  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }
}
