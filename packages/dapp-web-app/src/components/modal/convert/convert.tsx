import { Text, Box, Flex, CloseButton, Link, Button } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import useMigrationMigrate from 'services/web3/migration/use-migration-migrate'
import usePrintsApprove from 'services/web3/prints/use-prints-approve'
import { formatBigNumberFloor } from 'utils/price'

export enum AllowanceType {
  Increase = 'increase',
  Decrease = 'decrease',
}

type ConvertProps = {
  allowance: BigNumber
  toAllow: BigNumber
  totalAvailableToSpend: BigNumber
  nftsMintables: number
  onClose?: () => void
}

const SuccessIcon = (props: any) => (
  <svg {...props} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 15a6.978 6.978 0 0 0 4.95-2.05A6.978 6.978 0 0 0 15 8a6.978 6.978 0 0 0-2.05-4.95A6.978 6.978 0 0 0 8 1a6.978 6.978 0 0 0-4.95 2.05A6.978 6.978 0 0 0 1 8c0 1.933.784 3.683 2.05 4.95A6.978 6.978 0 0 0 8 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="m5.2 8 2.1 2.1 4.2-4.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Convert = ({
  allowance,
  toAllow,
  totalAvailableToSpend,
  nftsMintables,
  onClose,
}: ConvertProps) => {
  const {
    approve,
    isLoading: isLoadingApprove,
    hasError: hasErrorApprove,
    txHash: txHashApprove,
    isSubmitted: isSubmittedApprove,
    isApproved,
  } = usePrintsApprove(allowance, toAllow, totalAvailableToSpend)

  const {
    migrate,
    isLoading: isLoadingMigrate,
    hasError: hasErrorMigrate,
    txHash: txHashMigrate,
    isSubmitted: isSubmittedMigrate,
    isSuccess: isSuccessMigrate,
  } = useMigrationMigrate(nftsMintables)

  useEffect(() => {
    if (!isApproved && !isSubmittedApprove) {
      approve()
    }
  }, [approve, isApproved, isSubmittedApprove])

  useEffect(() => {
    if (isApproved && !isSubmittedMigrate) {
      migrate()
    }
  }, [migrate, isApproved, isSubmittedMigrate])

  return (
    <>
      <Box position="relative" py="13px" mb={7}>
        <Text fontSize="lg" fontWeight="bold" color="gray.900" textAlign="center" lineHeight="24px">
          Confirm mint in your wallet
        </Text>
        {!!onClose && (
          <CloseButton
            color="gray.500"
            onClick={onClose}
            position="absolute"
            right={0}
            top={0}
            w="44px"
            h="44px"
            size="lg"
          />
        )}
      </Box>
      <Flex
        alignItems="flex-start"
        flexWrap="wrap"
        mb={6}
        pb={6}
        borderBottom="1px"
        borderBottomColor="gray.300"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          border={2}
          borderStyle="solid"
          borderColor="gray.500"
          rounded="full"
          mr={6}
          w={8}
          h={8}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            1
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm approval of {formatBigNumberFloor(toAllow, 0)} $PRINTS for transaction
          </Text>
          {isLoadingApprove && (
            <Text color="gray.500">
              Waiting for{' '}
              {!!txHashApprove ? (
                <Link
                  color="links.500"
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN_URL}/tx/${txHashApprove}`}
                  title="Transaction"
                  target="_blank"
                >
                  transaction
                </Link>
              ) : (
                'approval'
              )}{' '}
              ...
            </Text>
          )}
          {isApproved && (
            <Flex alignItems="center" color="gray.500">
              <SuccessIcon width={16} height={16} />
              <Text color="gray.500" ml={1}>
                Approved!
              </Text>
            </Flex>
          )}
          {hasErrorApprove && (
            <>
              <Text color="secondary.500">An error occurred or the transaction was cancelled.</Text>
              <Flex mt={2} justifyContent="flex-end">
                <Button colorScheme="black" onClick={approve}>
                  Try again
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Flex>
      <Flex alignItems="flex-start" flexWrap="wrap">
        <Flex
          alignItems="center"
          justifyContent="center"
          border={2}
          borderStyle="solid"
          borderColor="gray.500"
          rounded="full"
          mr={6}
          w={8}
          h={8}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.500">
            2
          </Text>
        </Flex>
        <Box flex={1}>
          <Text fontWeight="bold" color="gray.900" mb={2}>
            Please confirm the conversion of $PRINTS to membership NFT
          </Text>
          {isLoadingMigrate && (
            <Text color="gray.500">
              Waiting for{' '}
              {!!txHashMigrate ? (
                <Link
                  color="links.500"
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN_URL}/tx/${txHashMigrate}`}
                  title="Transaction"
                  target="_blank"
                >
                  transaction
                </Link>
              ) : (
                'approval'
              )}{' '}
              ...
            </Text>
          )}
          {isSuccessMigrate && (
            <Flex alignItems="center" color="gray.500">
              <SuccessIcon width={16} height={16} />
              <Text color="gray.500" ml={1}>
                Migrated!
              </Text>
            </Flex>
          )}
          {hasErrorMigrate && (
            <>
              <Text color="secondary.500">An error occurred or the transaction was cancelled.</Text>
              <Flex mt={2} justifyContent="flex-end">
                <Button colorScheme="black" onClick={migrate}>
                  Try again
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </>
  )
}

export default Convert
