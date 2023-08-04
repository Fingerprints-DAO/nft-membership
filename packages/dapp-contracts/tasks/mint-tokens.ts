import { parseUnits } from 'ethers'
import { task, types } from 'hardhat/config'
// import { contractAddresses } from '../logs/deploy.json'

task('mint-tokens', 'Mints custom tokens')
  .addOptionalParam(
    'erc20Mock',
    'The `Custom erc20` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'mintTo',
    'Mint to address',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    types.string,
  )
  .addOptionalParam('amount', 'Amount to mint', '100000', types.string)
  .setAction(async ({ erc20Mock, mintTo, amount }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ERC20Mock')
    const nftContract = nftFactory.attach(erc20Mock)

    console.log(`Erc20 contract address: ${erc20Mock}`)
    // @ts-ignore
    await nftContract.mint(mintTo, parseUnits(amount, 18))

    console.log(`${amount.toString()} $prints minted to account ${mintTo}`)
  })
