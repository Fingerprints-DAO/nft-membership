// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract Auction is ERC721Holder, Pausable, AccessControl {
  event Start(uint startTime, uint endTime);
  event Bid(address indexed sender, uint amount);
  event Withdraw(address indexed bidder, uint amount);
  event End(address winner, uint amount);
  event AuctionExtended(uint endTime);

  IERC721 public immutable nft;
  uint public immutable nftId;

  address payable public seller;
  uint public startTime;
  uint public endTime;

  bool public started;
  bool public ended;

  address public highestBidder;
  uint public highestBid;
  mapping(address => uint) public bids;

  uint8 public minBidIncrementPercentage;
  uint256 public timeBuffer;
  uint256 public duration;

  constructor(
    address _nft,
    uint _nftId,
    uint _startingBid,
    uint8 _minBidIncrementPercentage,
    uint _duration
  ) {
    highestBid = _startingBid;
    nftId = _nftId;
    minBidIncrementPercentage = _minBidIncrementPercentage;
    duration = _duration;
    nft = IERC721(_nft);
    seller = payable(msg.sender);

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  function start() external whenNotPaused {
    require(!started, 'started');
    require(msg.sender == seller, 'not seller');

    startTime = block.timestamp;
    endTime = startTime + duration;

    started = true;

    emit Start(startTime, endTime);
  }

  function bid() external payable whenNotPaused {
    require(started, 'not started');
    require(!ended, 'ended');
    require(
      msg.value >=
        highestBid + ((highestBid * minBidIncrementPercentage) / 100),
      'Must send more than last bid by minBidIncrementPercentage amount'
    );

    if (highestBidder != address(0)) {
      bids[highestBidder] += highestBid;
    }

    highestBidder = msg.sender;
    highestBid = msg.value;

    // Extend the auction if the bid was received within `timeBuffer` of the auction end time
    bool extended = endTime - block.timestamp < timeBuffer;
    if (extended) {
      endTime = endTime = block.timestamp + timeBuffer;
      emit AuctionExtended(endTime);
    }

    emit Bid(msg.sender, msg.value);
  }

  function withdraw() external whenNotPaused {
    require(bids[msg.sender] > 0, 'no bid');

    uint amount = bids[msg.sender];
    bids[msg.sender] = 0;

    payable(msg.sender).transfer(amount);

    emit Withdraw(msg.sender, amount);
  }

  function end() external whenNotPaused {
    require(started, 'not started');
    require(!ended, 'ended');
    require(block.timestamp >= endTime, 'not ended');

    ended = true;

    if (highestBidder != address(0)) {
      nft.safeTransferFrom(address(this), highestBidder, nftId);
      seller.transfer(highestBid);
      emit End(highestBidder, highestBid);
    } else {
      nft.safeTransferFrom(address(this), seller, nftId);
      emit End(address(0), 0);
    }
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
