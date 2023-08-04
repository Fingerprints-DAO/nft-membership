import BigNumber from 'bignumber.js'
import { useNftMembershipContext } from 'contexts/nft-membership'
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi'

const useMigrate = (params: [string, BigNumber]) => {
  const { contracts } = useNftMembershipContext()

  const { config } = usePrepareContractWrite({
    address: contracts.Migration.address as Address,
    abi: contracts.Migration.abi,
    functionName: 'migrate',
    args: params,
  })

  const { write } = useContractWrite(config)

  return write
}

export default useMigrate
