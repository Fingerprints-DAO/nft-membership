// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Membership is
  ERC721,
  ERC721Royalty,
  ERC721URIStorage,
  Pausable,
  AccessControl,
  ERC721Burnable,
  EIP712,
  ERC721Votes
{
  using Counters for Counters.Counter;

  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
  Counters.Counter private _tokenIdCounter;

  uint16 public constant MAX_SUPPLY = 2000;

  constructor() ERC721('Membership', 'MBSP') EIP712('Membership', '1') {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
    _setDefaultRoyalty(msg.sender, 1000);
  }

  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  function safeMint(address to, uint16 amount) public onlyRole(MINTER_ROLE) {
    uint256 tokenId = _tokenIdCounter.current();

    require(tokenId + amount <= MAX_SUPPLY, 'Membership: MAX_SUPPLY exceeded');

    for (uint16 i = 0; i < amount; i++) {
      _tokenIdCounter.increment();
      _safeMint(to, tokenId);
    }
  }

  function setDefaultRoyalty(
    address receiver,
    uint96 royalty
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setDefaultRoyalty(receiver, royalty);
  }

  function setTokenRoyalty(
    uint256 tokenId,
    address receiver,
    uint96 royalty
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setTokenRoyalty(tokenId, receiver, royalty);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  // The following functions are overrides required by Solidity.

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Votes) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }

  function _burn(
    uint256 tokenId
  ) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
    super._burn(tokenId);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(ERC721, ERC721URIStorage, AccessControl, ERC721Royalty)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
