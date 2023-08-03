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
 * This contract will be used to auction the first Voxelglyph NFT.
 * SPDX-License-Identifier: MIT
 */
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/**
 * @title Auction
 * @dev This contract implements an auction for an ERC721 token.
 */
contract Auction is ERC721Holder, Pausable, AccessControl, ReentrancyGuard {
  event AuctionStarted(uint startTime, uint endTime);
  event Bid(address indexed sender, uint amount);
  event AuctionSettled(address winner, uint amount);

  /// @dev Emitted when trying to set the contract config when it's already been set.
  error ConfigAlreadySet();

  /// @dev Emitted when the amount of wei provided is invalid.
  error InvalidAmountInWei();

  /// @dev Emitted when the start or end time is invalid.
  error InvalidStartEndTime(uint256 startTime, uint256 endTime);

  /// @dev Emitted when the config is not set.
  error ConfigNotSet();

  /// @dev Emitted when the bid amount is invalid.
  error InvalidBidAmount();

  /// @dev Emitted when the auction has ended.
  error AuctionNotEnded();

  /// @notice The address of the ERC721 contract for membership.
  /// @dev The address is immutable and is set in the constructor.
  IERC721 public immutable nft;

  /// @notice The ID of the token being auctioned.
  /// @dev The ID is immutable and is set in the constructor.
  uint public immutable nftId;

  /// @notice The address of the treasury.
  /// @dev The address is immutable and is set in the constructor.
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
    /// @notice The minimum percentage to increase the bid.
    uint8 minBidIncrementPercentage;
  }

  modifier validConfig() {
    if (_config.startTime == 0) revert ConfigNotSet();
    _;
  }

  modifier validTime() {
    Config memory config = _config;
    if (block.timestamp > config.endTime || block.timestamp < config.startTime)
      revert InvalidStartEndTime(config.startTime, config.endTime);
    _;
  }

  /**
   * @dev Initializes the auction contract.
   * @param _adminAddress The address of the admin.
   * @param _nft The address of the ERC721 token contract.
   * @param _nftId The ID of the token being auctioned.
   * @param _treasury The address to receive the auction proceeds.
   */
  constructor(
    address _adminAddress,
    address _nft,
    uint _nftId,
    address _treasury
  ) {
    nftId = _nftId;
    treasury = _treasury;
    nft = IERC721(_nft);

    _setupRole(DEFAULT_ADMIN_ROLE, _adminAddress);
  }

  /// @notice Set auction config
  /// @dev Only admin can set auction config
  /// @param _startTime Auction start time
  /// @param _endTime Auction end time
  /// @param _minBidIncrementPercentage Auction min bid increment percentage
  /// @param _startAmountInWei Auction starting bid
  function setConfig(
    uint256 _startTime,
    uint256 _endTime,
    uint8 _minBidIncrementPercentage,
    uint256 _startAmountInWei
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    if (_config.startTime != 0 && _config.startTime <= block.timestamp)
      revert ConfigAlreadySet();

    if (_startTime == 0 || _startTime >= _endTime)
      revert InvalidStartEndTime(_startTime, _endTime);
    if (_startAmountInWei == 0) revert InvalidAmountInWei();

    auctionData.highestBid = _startAmountInWei;

    _config = Config({
      startTime: _startTime,
      endTime: _endTime,
      minBidIncrementPercentage: _minBidIncrementPercentage
    });
  }

  /**
   * @dev Allows a bidder to place a bid on the auction.
   * @notice The bid must be greater than or equal to the current highest bid plus the minimum bid increment percentage.
   */
  function bid()
    external
    payable
    nonReentrant
    whenNotPaused
    validConfig
    validTime
  {
    Config memory config = _config;
    if (
      msg.value <
      auctionData.highestBid +
        ((auctionData.highestBid * config.minBidIncrementPercentage) / 100)
    ) {
      revert InvalidBidAmount();
    }

    if (auctionData.highestBidder != address(0)) {
      (bool success, ) = auctionData.highestBidder.call{
        value: auctionData.highestBid
      }('');
      require(success, 'Transfer failed.');
    }

    auctionData.highestBidder = msg.sender;
    auctionData.highestBid = msg.value;

    emit Bid(msg.sender, msg.value);
  }

  /**
   * @dev Ends the auction and transfers the NFT to the highest bidder or back to the seller.
   * @notice The auction must have started and not have ended. The current time must be greater than or equal to the end time.
   */
  function settleAuction() external whenNotPaused validConfig() nonReentrant {
    Config memory config = _config;

    if (block.timestamp < config.endTime) {
      revert AuctionNotEnded();
    }

    if (auctionData.highestBidder != address(0)) {
      nft.safeTransferFrom(address(this), auctionData.highestBidder, nftId);
      (bool success, ) = treasury.call{value: auctionData.highestBid}('');
      require(success, 'Transfer failed.');
      emit AuctionSettled(auctionData.highestBidder, auctionData.highestBid);
    } else {
      nft.safeTransferFrom(address(this), treasury, nftId);
      emit AuctionSettled(address(0), 0);
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

  /// @notice Get auction config
  /// @return config Auction config
  function getConfig() external view returns (Config memory) {
    return _config;
  }

  /// @notice Get auction data
  /// @return data Auction data
  function getData() external view returns (AuctionData memory) {
    return auctionData;
  }
}
