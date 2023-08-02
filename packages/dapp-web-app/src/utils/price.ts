import BigNumber from 'bignumber.js'
import { formatEther, BigNumberish as BN } from 'ethers'
import { NumberSettings } from 'types/number-settings'

export const getNumberToStringOrZero = (n?: BN | BigNumber) =>
  n?.toString() ?? 0

export const normalizeBigNumber = (n?: BN | BigNumber) =>
  BigNumber(getNumberToStringOrZero(n))

// transform bignumber(ethersjs) to human readable strings
export const formatToEtherStringBN = (n?: BN | BigNumber) =>
  BigNumber(formatEther(getNumberToStringOrZero(n))).toString()

// transform bignumber.toString to human readable strings
export const formatToEtherString = (n?: string) =>
  BigNumber(formatEther(n ?? '0')).toString()

export const formatBigNumberUp = (n?: BigNumber) =>
  n?.toFormat(NumberSettings.Decimals, BigNumber.ROUND_UP) ?? '0'
export const formatBigNumberFloor = (n?: BigNumber) =>
  n?.toFormat(NumberSettings.Decimals, BigNumber.ROUND_FLOOR) ?? '0'

export const roundEtherUp = (n?: BN | BigNumber) =>
  normalizeBigNumber(n).toFormat(NumberSettings.Decimals, BigNumber.ROUND_UP)

export const roundEtherFloor = (n?: BN) =>
  normalizeBigNumber(n).toFormat(NumberSettings.Decimals, BigNumber.ROUND_FLOOR)
