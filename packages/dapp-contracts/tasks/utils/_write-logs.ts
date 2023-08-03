import { Addressable } from 'ethers'
import fs from 'fs'

export const writeLogs = (
  chainId: bigint,
  ERC20Mock: Addressable,
  Membership: Addressable,
  Migration: Addressable,
  Auction: Addressable,
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
