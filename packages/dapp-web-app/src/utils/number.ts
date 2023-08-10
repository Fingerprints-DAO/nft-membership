import { formatUnits, parseUnits } from 'viem'

const decimals = 18

export const parseAmountToDisplay = (amount: bigint) => {
  return Number(formatUnits(amount, decimals))
}
export const parseAmountToContract = (amount: number | string) => {
  return parseUnits(typeof amount === 'number' ? amount.toString() : amount, decimals)
}
