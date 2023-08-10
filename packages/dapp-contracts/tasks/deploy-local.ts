import { task } from 'hardhat/config'
import { BaseContract } from 'ethers'

type LocalContractName = 'ERC20Mock' | 'Membership' | 'Migration' | 'Auction'
type CombinedContract = Contract & BaseContract;


interface Contract {
  args?: (string | number | (() => string | undefined)  | (() => Promise<string>) )[]
  instance?: CombinedContract
  libraries?: () => Record<string, string>
  waitForConfirmation?: boolean
}

task('deploy-local', 'Deploy contracts to hardhat').setAction(async (_, { ethers }) => {
  const network = await ethers.provider.getNetwork()
  if (Number(network.chainId) !== 31337) {
    console.log(`Invalid chain id. Expected 31337. Got: ${network.chainId}.`)
    return
  }

  const [deployer] = await ethers.getSigners()
  await  ethers.provider.getTransactionCount(deployer.address)
  const baseUri = 'ipfs://QmNgQG8bmihY38CvuYoMeRo9xDGwfaW5zhxRjMfQoxQR1J/'

  const contracts: Record<LocalContractName, Contract> = {
    ERC20Mock: {
      args: [deployer.address, 'arod.studio Tokens', '$ARST', 1_000_000],
    },
    Membership: {
      args: [baseUri, deployer.address, deployer.address, 1000],
    },
    Migration: {
      args: [
        deployer.address,
        async () => await contracts.Membership.instance!.getAddress(),
        async () => await contracts.ERC20Mock.instance!.getAddress(),
        5000,
      ],
    },
    Auction: {
      args: [
        deployer.address,
        async () => await contracts.Membership.instance!.getAddress(),
        1,
        deployer.address,
      ],
    },
  }

  for (const [name, contract] of Object.entries(contracts)) {
    const factory = await ethers.getContractFactory(name, {
      libraries: contract?.libraries?.(),
    })

    const deployedContract = await factory.deploy(...(contract.args?.map((a) => (typeof a === 'function' ? a() : a)) ?? []))

    if (contract.waitForConfirmation) {
      await deployedContract.waitForDeployment()
    }
    contracts[name as LocalContractName].instance = deployedContract

    console.log(`${name} contract deployed to ${await deployedContract.getAddress()}`)
  }

  return contracts
})
