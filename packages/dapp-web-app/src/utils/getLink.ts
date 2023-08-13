import { getChain } from './chain'

export const getBaseURL = () => {
  const base = process.env.NEXT_PUBLIC_VERCEL_URL
  let protocol = 'https://'
  if (process.env.NODE_ENV === 'development') protocol = 'http://'
  return `${protocol}${base}`
}

export const getExternalOpenseaUrl = (address: string, id?: string) => {
  const base = process.env.NEXT_PUBLIC_OPENSEA_URL
  return `${base}assets/${getChain().name.toLowerCase()}/${address}${id ? `/${id}` : ''}`
}
export const getExternalEtherscanUrl = (address: string) => {
  const base = process.env.NEXT_PUBLIC_ETHERSCAN_URL
  return `${base}address/${address}`
}
