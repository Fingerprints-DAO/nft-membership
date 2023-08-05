import { Text, Box, Flex, CloseButton } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect } from 'react'
import usePrintsApprove from 'services/web3/prints/use-prints-approve'
import usePrintsSetAllowance from 'services/web3/prints/use-prints-set-allowance'

export enum AllowanceType {
  Increase = 'increase',
  Decrease = 'decrease',
}

type ConvertProps = {
  newAllowanceValue?: BigNumber
  onClose?: () => void
}

const Convert = ({ newAllowanceValue, onClose }: ConvertProps) => {
  const { setAllowance, isSubmittedSetAllowance, isWaitingSetAllowance, waitSetAllowanceTxStatus } = usePrintsSetAllowance(newAllowanceValue)
  const { approve, isSubmittedApprove, isWaitingApprove, waitApproveTxStatus } = usePrintsApprove()

  const allowance = useCallback(async () => {
    try {
      await setAllowance?.()
    } catch (error) {
      console.log('allowance', error)
    }
  }, [setAllowance])

  const approveAmount = useCallback(async () => {
    try {
      await approve?.()
    } catch (error) {
      console.log('approveAmount', error)
    }
  }, [approve])

  useEffect(() => {
    allowance()
  }, [allowance])

  useEffect(() => {
    if (waitSetAllowanceTxStatus === 'success') {
      approveAmount()
    }
  }, [waitSetAllowanceTxStatus, approveAmount])

  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Confirm mint in your wallet
        </Text>
        {!!onClose && <CloseButton color="gray.500" onClick={onClose} position="absolute" right={0} top={0} w="44px" h="44px" size="lg" />}
      </Box>
      <Flex alignItems="flex-start" flexWrap="wrap" mb={6} pb={6} borderBottom="1px" borderBottomColor="gray.300">
        <Flex alignItems="center" justifyContent="center" border={2} borderStyle="solid" borderColor="gray.500" rounded="full" mr={6} w={8} h={8}>
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            1
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm approval of {newAllowanceValue?.isNegative() ? newAllowanceValue.negated().toFormat() : newAllowanceValue?.toFormat()}{' '}
            $PRINTS for transaction
          </Text>
          <Text color="gray.500">Waiting for approval...</Text>
          <Text color="gray.500">Approved!</Text>
          <Text color="secondary.500">An error occurred or the transaction was cancelled.</Text>
        </Box>
      </Flex>
      <Flex alignItems="flex-start" flexWrap="wrap">
        <Flex alignItems="center" justifyContent="center" border={2} borderStyle="solid" borderColor="gray.500" rounded="full" mr={6} w={8} h={8}>
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            2
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm the conversion of $PRINTS to membership NFT
          </Text>
        </Box>
      </Flex>
    </>
  )
}

export default Convert
