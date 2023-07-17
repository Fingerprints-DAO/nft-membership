// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract ERC20Mock is ERC20 {
  constructor(
    address _to,
    string memory name,
    string memory symbol,
    uint256 amount
  ) ERC20(name, symbol) {
    _mint(_to, amount);
  }

  function mint(address addr, uint256 amount) public {
    _mint(addr, amount);
  }

  function transfer(
    address from,
    address to,
    uint256 amount
  ) public {
    _transfer(from, to, amount);
  }
}
