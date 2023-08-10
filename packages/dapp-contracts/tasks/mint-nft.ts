import { parseUnits } from 'ethers'
import { task, types } from 'hardhat/config'
import { default as contractAddresses } from '../logs/deploy.json'

task('mint-tokens', 'Mints custom tokens')
  .addOptionalParam(
    'mintTo',
    'Mint to address',
    '0x97CcF8F927045E4C5f936832d14904A68e595380',
    types.string,
  )
  .addOptionalParam('amount', 'Amount to mint', '100000', types.string)
  .setAction(async ({ mintTo, amount }, { ethers }) => {
    const chainId = (await ethers.provider
      .getNetwork()
      .then((n) => n.chainId)) as keyof typeof contractAddresses

    const nftFactory = await ethers.getContractFactory('Membership')
    const nftContract = nftFactory.attach(contractAddresses[chainId].Membership)
    console.log(`Membership contract address: ${contractAddresses[chainId].Membership}`)

    console.log(
      `Erc20 contract address: ${contractAddresses[chainId].ERC20Mock}`,
    )
    // @ts-ignore
    const f = await nftContract.safeMint(mintTo, 1)
    await f.wait()

    console.log(`${amount.toString()} $prints minted to account ${mintTo}`)
  })
