### Fingerprints NFT Membership - Voxelglyph

This repository is a monorepo that uses Lerna to manage multiple projects.

The live version of this project is [here](https://migration.fingerprintsdao.xyz/).

## Project

The `packages` folder contains the following projects:

- `dapp-contracts`: This project uses Hardhat, Solidity, and TypeScript. For more details, refer to the [README.md](./packages/dapp-contracts/README.md).

- `dapp-sdk`: This project uses TypeScript to connect the smart contract details to the frontend. For more details, refer to the [README.md](./packages/dapp-sdk/README.md).

- `dapp-web-app`: This project uses Next.js, React, TypeScript, Chakra UI, and Wagmi. It serves as the frontend for the entire project. For more details, refer to the [README.md](./packages/dapp-web-app/README.md).

## Running the Project

Before running the project locally, follow these steps:

1. Install the project dependencies by running `yarn` at the root level.

2. Go to the `dapp-contracts` folder, copy the `.env-example` file to `.env`, and fill in the environment variables with your keys.

3. Repeat the same step for the `dapp-web-app` folder.

4. Run `yarn compile` to generate sdk and compile the smart contracts abis and helpers.

To run the project locally, open your terminal at the root level and run `yarn dev`. This command will start two processes: one to deploy the smart contracts and the other to run the Next.js server.

You can access the project at [localhost:3000](http://localhost:3000).

**It's highly recommended that you use editor config, eslint, and prettier plugins in your editor**

Further details or information about technologies used here, you can ask in the [Fingerprints discord](https://discord.gg/Mg7wx36upM) or to the author, [Arod](https://twitter.com/thearodeth).
