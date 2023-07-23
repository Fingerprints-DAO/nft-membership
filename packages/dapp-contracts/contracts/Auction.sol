// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

struct AuctionData {
  uint startTime;
  uint endTime;
  bool started;
  bool ended;
  address highestBidder;
  uint highestBid;
  uint8 minBidIncrementPercentage;
  uint256 timeBuffer;
  uint256 duration;
}

contract Auction is ERC721Holder, Pausable, AccessControl {
  event Start(uint startTime, uint endTime);
  event Bid(address indexed sender, uint amount);
  event Withdraw(address indexed bidder, uint amount);
  event End(address winner, uint amount);
  event AuctionExtended(uint endTime);

  IERC721 public immutable nft;
  uint public immutable nftId;
  address payable public seller;

  AuctionData public auctionData;

  constructor(
    address _nft,
    uint _nftId,
    uint _startingBid,
    uint8 _minBidIncrementPercentage,
    uint _duration,
    uint _timeBuffer
  ) {
    auctionData.highestBid = _startingBid;
    nftId = _nftId;
    auctionData.minBidIncrementPercentage = _minBidIncrementPercentage;
    auctionData.duration = _duration;
    auctionData.timeBuffer = _timeBuffer;
    nft = IERC721(_nft);
    seller = payable(msg.sender);

    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /**
   * @dev Allows a bidder to place a bid on the auction.
   * @notice The bid must be greater than or equal to the current highest bid plus the minimum bid increment percentage.
   */
  function bid() external payable whenNotPaused {
    require(auctionData.started, 'not started');
    require(block.timestamp < auctionData.endTime, 'auction expired');
    require(!auctionData.ended, 'ended');
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
  function end() external whenNotPaused {
    require(auctionData.started, 'not started');
    require(!auctionData.ended, 'ended');
    require(block.timestamp >= auctionData.endTime, 'not ended');

    auctionData.ended = true;

    if (auctionData.highestBidder != address(0)) {
      nft.safeTransferFrom(address(this), auctionData.highestBidder, nftId);
      seller.transfer(auctionData.highestBid);
      emit End(auctionData.highestBidder, auctionData.highestBid);
    } else {
      nft.safeTransferFrom(address(this), seller, nftId);
      emit End(address(0), 0);
    }
  }

  /**
   * @dev Starts the auction.
   * @notice The auction must not have started and the caller must be the seller.
   */
  function start() external whenNotPaused {
    require(!auctionData.started, 'started');
    require(msg.sender == seller, 'not seller');

    auctionData.startTime = block.timestamp;
    auctionData.endTime = auctionData.startTime + auctionData.duration;

    auctionData.started = true;

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
