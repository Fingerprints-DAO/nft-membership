# Smart Contracts

This repository contains 3 smart contracts:

- [Membership.sol](./contracts/Membership.sol) - This ERC721 based contract is used to mint the Voxelglyph, the Fingerprints Membership NFT. It incorporates features such as royalty enforcement, burnable tokens, voting mechanism, and access control.

- [Auction.sol](./contracts/Auction.sol) - This contract was used to conduct an auction for the first Voxelglyph NFT. It follows a regular auction model.

- [Migration.sol](./contracts/Migration.sol) - Users can migrate from ERC20 tokens called $PRINTS to ERC721 tokens known as Voxelglyph using this contract.

## Running the Project

To run this project isolated, follow the steps in the [root level](../../README.md). Once you have completed the initial setup, you can compile the contracts by running `yarn compile`, and then run the project using `yarn task:run-local`.

## Coverage/Tests

To obtain the test coverage report, run `yarn coverage`. If you are developing new features, you can use `yarn test:watch` to automatically run tests while making changes to the smart contract code.

For more information, refer to the commands specified in `package.json` or `tasks` folder.
