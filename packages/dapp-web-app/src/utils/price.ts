import BigNumber from 'bignumber.js'
import { BigNumberish as BN } from 'ethers'
import { formatEther } from 'ethers'
import { NumberSettings } from 'types/number-settings'

export const getNumberToStringOrZero = (n?: BN) => n?.toString() ?? 0

export const normalizeBigNumber = (n?: BN) => BigNumber(getNumberToStringOrZero(n))

export const formatToEtherStringBN = (n?: BN) =>
  BigNumber(formatEther(getNumberToStringOrZero(n))).toString()
export const formatToEtherString = (n?: string) => BigNumber(formatEther(n ?? '0'))

export const formatBigNumberUp = (n?: BigNumber) =>
  n?.toFormat(NumberSettings.Decimals, BigNumber.ROUND_UP) ?? '0'

export const formatBigNumberFloor = (
  n?: BigNumber,
  decimals: number | NumberSettings.Decimals = NumberSettings.Decimals
) => n?.toFormat(decimals, BigNumber.ROUND_FLOOR) ?? '0'

export const roundEtherUp = (n?: BN) =>
  normalizeBigNumber(n).toFormat(NumberSettings.Decimals, BigNumber.ROUND_UP)

export const roundEtherFloor = (n?: BN) =>
  normalizeBigNumber(n).toFormat(NumberSettings.Decimals, BigNumber.ROUND_FLOOR)
