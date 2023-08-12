import { HardhatEthersProvider } from '@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider'
import fs from 'fs'
import path from 'path'

// import { ethers } from "ethers"

export const getAddresses = async (provider: HardhatEthersProvider) => {
  const chainId = await provider.getNetwork().then((n) => n.chainId.toString())
  const data = fs.readFileSync(path.resolve(__dirname, './../../logs/deploy.json'), 'utf-8')
  const addresses = JSON.parse(data)[chainId]

  return addresses
}
