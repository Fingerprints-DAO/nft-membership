const TRUNCATED_NAME_CHAR_LIMIT = 11

export const pluralize = (quantity: number, plural: string, singular: string): string =>
  `${quantity} ${quantity === 1 ? singular : plural}`

export const shortenAddress = (address = '', startCount = 5, lastCount = 5) => {
  if (address.length < TRUNCATED_NAME_CHAR_LIMIT) {
    return address
  }

  return `${address.slice(0, startCount)}...${address.slice(-lastCount)}`
}
