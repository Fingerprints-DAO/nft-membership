// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/utils/cryptography/EIP712.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Membership is
  ERC721,
  ERC721Enumerable,
  ERC721Royalty,
  Pausable,
  AccessControl,
  ERC721Burnable,
  EIP712,
  ERC721Votes
{
  error MaxSupplyExceeded();
  using Counters for Counters.Counter;

  string public baseURIValue;
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
  Counters.Counter private _tokenIdCounter;
  uint16 public constant MAX_SUPPLY = 2000;

  constructor(
    string memory _baseURIValue
  ) ERC721('Membership', 'MBSP') EIP712('Membership', '1') {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
    _setDefaultRoyalty(msg.sender, 1000);
    baseURIValue = _baseURIValue;
  }

  /// @notice Only Admin can pauses all token transfers.
  function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @notice Only Admin can unpauses all token transfers.
  function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  /// @notice Only Admin can mint new tokens.
  /// @param to The address of the future owner of the token.
  /// @param amount The amount of tokens to mint.
  function safeMint(address to, uint16 amount) public onlyRole(MINTER_ROLE) {
    uint256 tokenId = _tokenIdCounter.current();
    if (tokenId + amount > MAX_SUPPLY) {
      revert MaxSupplyExceeded();
    }

    for (uint16 i = 0; i < amount; i++) {
      _tokenIdCounter.increment();
      uint256 mintedTokenId = _tokenIdCounter.current();
      _safeMint(to, mintedTokenId);
    }
  }

  /// @notice Only Admin can set the default royalty.
  /// @param receiver The address of the royalty receiver.
  /// @param royalty The royalty amount.
  function setDefaultRoyalty(
    address receiver,
    uint96 royalty
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setDefaultRoyalty(receiver, royalty);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURIValue;
  }

  function setBaseURI(
    string memory newBaseURI
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    baseURIValue = newBaseURI;
  }

  function tokenURI(
    uint256 tokenId
  ) public view override returns (string memory) {
    _requireMinted(tokenId);

    string memory baseURI = _baseURI();

    return
      bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
        : '';
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Votes) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721Royalty) {
    super._burn(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, AccessControl, ERC721Royalty, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
