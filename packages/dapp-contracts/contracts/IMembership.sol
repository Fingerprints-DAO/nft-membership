// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IMembership {
    function safeMint(address to, uint16 amount) external;
}
