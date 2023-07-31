// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ @@ (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&, @@@@@@@@@% .&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@ /&@@@@@@ %@ @@&@@@@% @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@&    @@@&/      .&@@&.   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@&                        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@&                        &@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    ,%@@@@&/    (&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&@@@@@@@@@@@@@@
// (@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@
// (&&&&&&&&&@&%@@&&@&&&@&@&&&&&&@%@@&@@@@@@@&@@@&@@@@@@@&@&@@@&@@   @@@@@@@@@@@@@@
// (&&&&&&&&&           &@@            .@@*         *@@@&        .   @@@@@@@@@@@@@@
// (&&&&&&&&   @&&&&#   %@&&&.   &@@@   %   .@@@@@,   @@   ,@@@@@.   @@@@@@@@@@@@@@
// (&&&&&&&@   %&&&&@   %&&&&.  .@@@@@@&@   @@@@@@@   @&   @@@@@@&   @@@@@@@@@@@@@@
// (&&&&&&&&,    @%      &&        &&@@@@@    /@*    @@@@    (@/     @@@.    @@@@@@
// (&&&&&&&&&&(    ,&@   @&        &&@@@@@@&*     *&@@@@@@&     @@   @@@&   @@@@@@@
// /%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&@@@@@@@@@@@@@@@@@@@@@@@&&@@@@@@@@@@@@@@@@@
// /%%%%%%%%%&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&@@@@@@@@@@@@

/**
 * @title Migration contract
 * @author arod.studio and Fingerprints DAO
 * This contract allows users to migrate from ERC20 tokens called $PRINTS to ERC721 tokens called Voxelglyph.
 * Both tokens are from Fingerprints DAO and they are used for governance.
 * Fingerprints DAO is migrating from their ERC20 Tokens (PRINTS) to the format ERC721 tokens (Voxelglyph).
 *
 * SPDX-License-Identifier: MIT
 */
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IMembership.sol';

contract Migration is Pausable, AccessControl {
  event Migrated(address indexed to, uint16 amount);

  /// @notice The address of the ERC721 contract for membership.
  /// @dev The address is immutable and is set in the constructor.
  address public immutable nftAddress;

  /// @notice The address of the ERC20 contract for prints.
  /// @dev The address is immutable and is set in the constructor.
  address public immutable printsAddress;

  /// @notice The price of each membership in Wei.
  /// @dev The price is immutable and is set in the constructor.
  uint256 public immutable pricePerMembershipInWei;

  /// @notice The ERC20 token for prints.
  /// @dev The token is set in the constructor.
  IERC20 public token;

  constructor(
    address _adminAddress,
    address _nftAddress,
    address _printsAddress,
    uint256 _pricePerMembershipInWei
  ) {
    _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);

    nftAddress = _nftAddress;
    printsAddress = _printsAddress;
    pricePerMembershipInWei = _pricePerMembershipInWei;
    token = IERC20(printsAddress);

    _pause();
  }

  modifier whenNotPausedOrAdmin() {
    require(
      !paused() || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
      'Pausable: paused'
    );
    _;
  }

  /// @notice Migrates membership from ERC20 to ERC721, locks print and mints NFT.
  /// @dev This function can only be called when the contract is not paused or by an admin.
  /// @param _to The address of the future owner of the token.
  /// @param _amount The amount of tokens to migrate.
  function migrate(address _to, uint16 _amount) public whenNotPausedOrAdmin {
    require(_amount > 0, 'Migration: amount must be greater than 0');
    require(_to != address(0), 'Migration: cannot migrate to zero address');

    uint256 printsAmount = _amount * pricePerMembershipInWei;
    uint256 balance = IERC20(printsAddress).balanceOf(msg.sender);

    require(balance >= printsAmount, 'Migration: insufficient balance');

    (bool success, bytes memory data) = address(token).call(
      abi.encodeWithSelector(
        token.transferFrom.selector,
        msg.sender,
        address(this),
        printsAmount
      )
    );
    require(
      success && (data.length == 0 || abi.decode(data, (bool))),
      'Migration: token transfer from sender failed'
    );

    IMembership(nftAddress).safeMint(_to, _amount);

    emit Migrated(_to, _amount);
  }

  /// @notice Pauses all token migrations.
  /// @dev Only users with the 'DEFAULT_ADMIN_ROLE' are allowed to call this function.
  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @notice Unpauses all token migrations.
  /// @dev Only users with the 'DEFAULT_ADMIN_ROLE' are allowed to call this function.
  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }
}
