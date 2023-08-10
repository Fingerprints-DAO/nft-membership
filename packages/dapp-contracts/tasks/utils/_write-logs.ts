import { AddressLike, Addressable } from 'ethers'
import fs from 'fs'

export const writeLogs = (
  chainId: bigint,
  ERC20Mock: Addressable | string,
  Membership: Addressable | string,
  Migration: Addressable | string,
  Auction: Addressable | string,
  WETH: AddressLike,
) => {
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs')
  }

  const filePath = 'logs/deploy.json'
  const newKey = chainId.toString()
  const newValue = {
    ERC20Mock,
    Membership,
    Migration,
    Auction,
    WETH,
    chainId: Number(chainId),
  }

  // Read the current content of the file (assuming the file already exists)
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  // Convert the content into a JSON object
  const existingData = JSON.parse(fileContent)

  existingData[newKey] = newValue

  // Write the new content to the file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2))
}
