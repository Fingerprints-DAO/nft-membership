// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

struct AuctionData {
  uint startTime;
  uint endTime;
  address highestBidder;
  uint highestBid;
  uint8 minBidIncrementPercentage;
  uint256 timeBuffer;
  uint256 duration;
}

contract Auction is ERC721Holder, Pausable, AccessControl, ReentrancyGuard {
  event Start(uint startTime, uint endTime);
  event Bid(address indexed sender, uint amount);
  event End(address winner, uint amount);
  event AuctionExtended(uint endTime);

  IERC721 public immutable nft;
  uint public immutable nftId;
  address public immutable treasury;

  AuctionData public auctionData;

  constructor(
    address _nft,
    uint _nftId,
    uint _startingBid,
    uint8 _minBidIncrementPercentage,
    uint _duration,
    uint _timeBuffer,
    address _treasury
  ) {
    auctionData.highestBid = _startingBid;
    nftId = _nftId;
    auctionData.minBidIncrementPercentage = _minBidIncrementPercentage;
    auctionData.duration = _duration;
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
    require(auctionData.startTime != 0 && auctionData.startTime <= block.timestamp, 'Auction has not started');
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
  function end() external whenNotPaused nonReentrant {
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
   * @dev Starts the auction.
   * @notice The auction must not have started and the caller must be the seller.
   */
  function start() external whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
    require(auctionData.startTime == 0, 'Auction already started');

    auctionData.startTime = block.timestamp;
    auctionData.endTime = auctionData.startTime + auctionData.duration;

    emit Start(auctionData.startTime, auctionData.endTime);
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
