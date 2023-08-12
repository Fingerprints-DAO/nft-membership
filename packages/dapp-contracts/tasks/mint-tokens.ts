import { parseUnits } from 'ethers'
import { task, types } from 'hardhat/config'
import { getAddresses } from './utils/_getAddresses'

task('mint-tokens', 'Mints custom tokens')
  .addOptionalParam(
    'mintTo',
    'Mint to address',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    types.string,
  )
  .addOptionalParam('amount', 'Amount to mint', '100000', types.string)
  .setAction(async ({ mintTo, amount }, { ethers }) => {
    const contractAddresses = await getAddresses(ethers.provider)

    const nftFactory = await ethers.getContractFactory('ERC20Mock')
    const nftContract = nftFactory.attach(contractAddresses.ERC20Mock)

    console.log(`Erc20 contract address: ${contractAddresses.ERC20Mock}`)
    // @ts-ignore
    await nftContract.mint(mintTo, parseUnits(amount, 18))

    console.log(`${amount.toString()} $prints minted to account ${mintTo}`)
  })
