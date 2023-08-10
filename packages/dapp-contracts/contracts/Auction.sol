/**
 *
 * Developed by
 *                        _       _             _ _
 *                       | |     | |           | (_)
 *     __ _ _ __ ___   __| |  ___| |_ _   _  __| |_  ___
 *    / _` | '__/ _ \ / _` | / __| __| | | |/ _` | |/ _ \
 *   | (_| | | | (_) | (_| |_\__ \ |_| |_| | (_| | | (_) |
 *    \__,_|_|  \___/ \__,_(_)___/\__|\__,_|\__,_|_|\___/
 *
 *
 * @title Auction contract
 * @author arod.studio and Fingerprints DAO
 * @dev This contract is used to auction the first Voxelglyph NFT.
 * SPDX-License-Identifier: MIT
 */
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/**
 * @title Auction Contract
 * @dev This contract is an auction for an ERC721 token (NFT). It inherits from ERC721Holder to handle safe transfers of NFTs,
 * Pausable to add ability to pause/unpause the contract by the contract's admin, AccessControl to manage access and permissions,
 * and ReentrancyGuard to protect against reentrant calls.
 */
contract Auction is ERC721Holder, Pausable, AccessControl, ReentrancyGuard {
  /// @dev Emitted when a new bid is placed. The event includes the address of the bidder and the amount of the bid.
  event Bid(address indexed sender, uint amount);

  /// @dev Emitted when the auction is successfully settled. The event includes the address of the winner and the winning bid amount.
  event AuctionSettled(address winner, uint amount);

  /// @dev Emitted when trying to set the contract config when it's already been set.
  error ConfigAlreadySet();

  /// @dev Emitted when the amount of wei provided for a bid or starting bid is invalid. This usually means the amount is zero.
  error InvalidAmountInWei();

  /// @dev Emitted when the provided minimum bid increment value is invalid. This usually means the value is either zero.
  error InvalidMinBidIncrementValue();

  /// @dev Emitted when the provided start or end time for the auction is invalid. This usually means the start time is greater than the end time.
  error InvalidStartEndTime(uint256 startTime, uint256 endTime);

  /// @dev Emitted when a config-related operation is attempted before the config has been set.
  error ConfigNotSet();

  /// @dev Emitted when the bid amount is invalid. This usually means the bid is less than the current highest bid plus the minimum bid increment.
  error InvalidBidAmount();

  /// @dev Emitted when an operation is attempted after the auction has ended.
  error AuctionNotEnded();

  /// @notice The address of the ERC721 token contract that represents the NFT being auctioned.
  /// @dev This is an immutable variable; its value is set during contract deployment and cannot be changed afterwards.
  address public immutable nftAddress;

  /// @notice The unique identifier (ID) of the specific NFT being auctioned.
  /// @dev This is an immutable variable; its value is set during contract deployment and cannot be changed afterwards.
  uint public immutable nftId;

  /// @notice The address of the treasury that will receive the proceeds from the auction.
  /// @dev This is an immutable variable; its value is set during contract deployment and cannot be changed afterwards.
  address public immutable treasury;

  /// @dev Auction Config
  Config private _config;

  /// @dev Auction data
  AuctionData private auctionData;

  /**
   * @dev Represents the data of the auction, including the highest bidder and their bid.
   */
  struct AuctionData {
    /// @notice The address of the highest bidder.
    address highestBidder;
    /// @notice The highest bid amount in wei.
    uint highestBid;
  }

  /// @dev Represents the auction configuration
  struct Config {
    /// @notice The start time of the auction.
    uint256 startTime;
    /// @notice The end time of the auction.
    uint256 endTime;
    /// @notice The minimum value to increase the current bid in WEI.
    uint256 minBidIncrementInWei;
  }

  /**
   * @dev Modifier to check if the configuration is valid.
   * @dev Throws ConfigNotSet error if the start time is not set.
   */
  modifier validConfig() {
    if (_config.startTime == 0) revert ConfigNotSet();
    _;
  }

  /**
   * @dev Modifier to check if the current block timestamp is within the specified start and end time.
   * @dev Throws InvalidStartEndTime error if the current timestamp is not between the start and end time.
   */
  modifier validTime() {
    Config memory config = _config;
    if (
      block.timestamp >= config.endTime || block.timestamp <= config.startTime
    ) revert InvalidStartEndTime(config.startTime, config.endTime);
    _;
  }

  /**
   * @dev Initializes the auction contract.
   * @param _adminAddress The address of the admin.
   * @param _nftAddress The address of the ERC721 token contract.
   * @param _nftId The ID of the token being auctioned.
   * @param _treasury The address to receive the auction proceeds.
   */
  constructor(
    address _adminAddress,
    address _nftAddress,
    uint _nftId,
    address _treasury
  ) {
    nftId = _nftId;
    treasury = _treasury;
    nftAddress = _nftAddress;

    _setupRole(DEFAULT_ADMIN_ROLE, _adminAddress);
  }

  /// @notice Sets the configuration parameters for the auction.
  /// @dev This function can only be called by an admin. It can be used to set the start time, end time, minimum bid increment in WEI, and starting bid amount.
  /// @param _startTime Auction start time
  /// @param _endTime Auction end time
  /// @param _minBidIncrementInWei Auction minimum bid increment in WEI
  /// @param _startAmountInWei Auction starting bid
  function setConfig(
    uint256 _startTime,
    uint256 _endTime,
    uint256 _minBidIncrementInWei,
    uint256 _startAmountInWei
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    if (_config.startTime != 0 && _config.startTime <= block.timestamp)
      revert ConfigAlreadySet();

    if (_startTime == 0 || _startTime >= _endTime)
      revert InvalidStartEndTime(_startTime, _endTime);
    if (_startAmountInWei == 0) revert InvalidAmountInWei();

    if (_minBidIncrementInWei == 0) revert InvalidMinBidIncrementValue();

    auctionData.highestBid = _startAmountInWei;

    _config = Config({
      startTime: _startTime,
      endTime: _endTime,
      minBidIncrementInWei: _minBidIncrementInWei
    });
  }

  /**
   * @dev Allows a bidder to place a bid on the auction.
   * @notice The bid must be greater than or equal to the current highest bid plus the minimum bid increment.
   */
  function bid()
    external
    payable
    nonReentrant
    whenNotPaused
    validConfig
    validTime
  {
    if (msg.value < calculateMinBidIncrement()) {
      revert InvalidBidAmount();
    }

    // Only refund the previous highest bidder, if there was a previous bid
    if (auctionData.highestBidder != address(0)) {
      auctionData.highestBidder.call{value: auctionData.highestBid}('');
    }

    auctionData.highestBidder = msg.sender;
    auctionData.highestBid = msg.value;

    emit Bid(msg.sender, msg.value);
  }

  /**
   * @dev Ends the auction and transfers the NFT to the highest bidder or back to the seller.
   * @notice The auction must have started and not have ended. The current time must be greater than or equal to the end time.
   */
  function settleAuction() external whenNotPaused validConfig nonReentrant {
    if (block.timestamp < _config.endTime) {
      revert AuctionNotEnded();
    }

    if (auctionData.highestBidder != address(0)) {
      IERC721(nftAddress).transferFrom(
        address(this),
        auctionData.highestBidder,
        nftId
      );
      (bool success, ) = treasury.call{value: address(this).balance}('');
      require(success, 'Transfer failed.');
      emit AuctionSettled(auctionData.highestBidder, auctionData.highestBid);
    } else {
      IERC721(nftAddress).safeTransferFrom(address(this), treasury, nftId);
      emit AuctionSettled(treasury, 0);
    }
  }

  /**
   * @dev Pauses the contract.
   * @notice Only the contract admin can pause the contract.
   */
  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /**
   * @dev Unpauses the contract.
   * @notice Only the contract admin can unpause the contract.
   */
  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  /**
   * @dev Calculates the minimum bid increment based on the current highest bid and the minimum bid increment.
   * @return The minimum bid increment.
   */
  function calculateMinBidIncrement() public view returns (uint256) {
    return auctionData.highestBid + _config.minBidIncrementInWei;
  }

  /// @notice Gets the current configuration parameters of the auction.
  /// @return config A struct containing the start time, end time, minimum bid increment in WEI, and starting bid amount of the auction.
  function getConfig() external view returns (Config memory) {
    return _config;
  }

  /// @notice Gets the current data of the auction.
  /// @return data A struct containing the highest bidder and the highest bid amount of the auction.
  function getData() external view returns (AuctionData memory) {
    return auctionData;
  }
}
