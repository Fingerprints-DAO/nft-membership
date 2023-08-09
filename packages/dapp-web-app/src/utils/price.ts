import BigNumber from 'bignumber.js'
import { BigNumberish as BN } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { NumberSettings } from 'types/number-settings'

type DecimalsType = number | NumberSettings.Decimals

export const getNumberToStringOrZero = (n?: BN) => n?.toString() ?? 0

export const normalizeBigNumber = (n?: BN) => BigNumber(getNumberToStringOrZero(n))

export const formatToEtherStringBN = (n?: BN) =>
  BigNumber(formatEther(getNumberToStringOrZero(n))).toString()
export const formatToEtherString = (n?: string) => BigNumber(formatEther(n ?? '0'))

export const formatBigNumberUp = (
  n?: BigNumber,
  decimals: DecimalsType = NumberSettings.Decimals
) => n?.toFormat(decimals, BigNumber.ROUND_UP) ?? '0'

export const formatBigNumberFloor = (
  n?: BigNumber,
  decimals: DecimalsType = NumberSettings.Decimals
) => n?.toFormat(decimals, BigNumber.ROUND_FLOOR) ?? '0'

export const roundEtherUp = (n?: BN, decimals: DecimalsType = NumberSettings.Decimals) =>
  normalizeBigNumber(n).toFormat(decimals, BigNumber.ROUND_UP)

export const roundEtherFloor = (n?: BN) =>
  normalizeBigNumber(n).toFormat(NumberSettings.Decimals, BigNumber.ROUND_FLOOR)
