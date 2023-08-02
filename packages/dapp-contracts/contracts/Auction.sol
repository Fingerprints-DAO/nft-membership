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
  event Start(uint startTime, uint endTime);
  event Bid(address indexed sender, uint amount);
  event End(address winner, uint amount);
  event AuctionExtended(uint endTime);

  /// @notice The address of the ERC721 contract for membership.
  /// @dev The address is immutable and is set in the constructor.
  IERC721 public immutable nft;

  /// @notice The ID of the token being auctioned.
  /// @dev The ID is immutable and is set in the constructor.
  uint public immutable nftId;

  /// @notice The address of the treasury.
  /// @dev The address is immutable and is set in the constructor.
  address public immutable treasury;

  struct AuctionData {
    address highestBidder;
    uint highestBid;
    uint8 minBidIncrementPercentage;
    uint256 timeBuffer;
    uint256 startTime;
    uint256 endTime;
  }

  AuctionData public auctionData;

  /**
   * @dev Initializes the auction contract.
   * @param _nft The address of the ERC721 token contract.
   * @param _nftId The ID of the token being auctioned.
   * @param _startingBid The starting bid for the auction.
   * @param _minBidIncrementPercentage The minimum bid increment percentage.
   * @param _startTime The timestamp of when the auction should start.
   * @param _endTime The timestamp of when the auction should end.
   * @param _timeBuffer The buffer time for extending the auction.
   * @param _treasury The address to receive the auction proceeds.
   */
  constructor(
    address _nft,
    uint _nftId,
    uint _startingBid,
    uint8 _minBidIncrementPercentage,
    uint _startTime,
    uint _endTime,
    uint _timeBuffer,
    address _treasury
  ) {
    auctionData.highestBid = _startingBid;
    nftId = _nftId;
    auctionData.minBidIncrementPercentage = _minBidIncrementPercentage;
    auctionData.startTime = _startTime;
    auctionData.endTime = _endTime;
    auctionData.timeBuffer = _timeBuffer;
    treasury = _treasury;
    nft = IERC721(_nft);

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /**
   * @dev Allows a bidder to place a bid on the auction.
   * @notice The bid must be greater than or equal to the current highest bid plus the minimum bid increment percentage.
   */
  function bid() external payable whenNotPaused nonReentrant {
    require(
      auctionData.startTime != 0 && auctionData.startTime <= block.timestamp,
      'Auction has not started'
    );
    require(block.timestamp < auctionData.endTime, 'Auction has expired');
    require(
      msg.value >=
        auctionData.highestBid +
          ((auctionData.highestBid * auctionData.minBidIncrementPercentage) /
            100),
      'Must send more than last bid by minBidIncrementPercentage amount'
    );

    if (auctionData.highestBidder != address(0)) {
      (bool success, ) = auctionData.highestBidder.call{
        value: auctionData.highestBid
      }('');
      require(success, 'Transfer failed.');
    }

    auctionData.highestBidder = msg.sender;
    auctionData.highestBid = msg.value;

    // Extend the auction if the bid was received within `timeBuffer` of the auction end time
    bool extended = auctionData.endTime - block.timestamp <
      auctionData.timeBuffer;
    if (extended) {
      auctionData.endTime = block.timestamp + auctionData.timeBuffer;
      emit AuctionExtended(auctionData.endTime);
    }

    emit Bid(msg.sender, msg.value);
  }

  /**
   * @dev Ends the auction and transfers the NFT to the highest bidder or back to the seller.
   * @notice The auction must have started and not have ended. The current time must be greater than or equal to the end time.
   */
  function settleAuction() external whenNotPaused nonReentrant {
    require(auctionData.startTime != 0, 'Auction has not started');
    require(block.timestamp >= auctionData.endTime, 'Auction has not ended');

    if (auctionData.highestBidder != address(0)) {
      nft.safeTransferFrom(address(this), auctionData.highestBidder, nftId);
      (bool success, ) = treasury.call{value: auctionData.highestBid}('');
      require(success, 'Transfer failed.');
      emit End(auctionData.highestBidder, auctionData.highestBid);
    } else {
      nft.safeTransferFrom(address(this), treasury, nftId);
      emit End(address(0), 0);
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
}
