'use client'

import { useNetwork } from 'wagmi'
import { ConnectKitButton } from 'components/ConnectKitButton'
import { Connected } from 'components/Connected'
import { Account } from 'components/Account'
import { Balance } from 'components/Balance'
import { getContractsDataForChainOrThrow } from '@dapp/sdk'

export default function Home() {
  const { chain } = useNetwork()
  if (chain?.id) {
    getContractsDataForChainOrThrow(chain?.id).then((a) => console.log('log', a))
  }
  return (
    <div>
      <ConnectKitButton />
      <Connected>
        <h2>Account</h2>
        <Account />
        <br />
        <hr />
        <h2>Balance</h2>
        <Balance />
        <br />
        <hr />
      </Connected>
    </div>
  )
}
