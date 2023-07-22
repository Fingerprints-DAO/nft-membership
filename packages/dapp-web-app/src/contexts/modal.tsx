import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { Address, useWaitForTransaction } from 'wagmi'
import useTxToast from 'hooks/use-tx-toast'

export enum ModalElement {
  ConvertPrints = 'convert',
  Default = '',
}

export type WNFTModalProps = {
  id: string
  name: string
  minAmount: number
  ogTokenAddress: Address
  ogTokenId: string
}
export type ModalContextValue = {
  isOpen?: boolean
  payload?: any
  element: ModalElement
  handleOpenModal: (element: ModalElement, payload?: ModalContextValue['payload']) => () => void
  handleCloseModal: (hash?: Address, callback?: Function) => void
}

export type ModalProps = {
  isOpen: boolean
  payload?: any
  onClose: () => void
}

const INITIAL_STATE: ModalContextValue = {
  element: ModalElement.Default,
  handleOpenModal: () => () => {},
  handleCloseModal: () => {},
}

const ModalContext = createContext<ModalContextValue>(INITIAL_STATE)

const ModalProvider = ({ children }: PropsWithChildren) => {
  const { showTxErrorToast } = useTxToast()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const [payload, setPayload] = useState<ModalContextValue['payload']>({})
  const [element, setElement] = useState<ModalElement>(INITIAL_STATE.element)
  const [lastTxHash, setLastTxHash] = useState<Address | undefined>(undefined)
  const [lastTxCallback, setLastTxCallback] = useState<Function | undefined>(undefined)

  useWaitForTransaction({
    hash: lastTxHash,
    onSettled(_, error) {
      if (error) {
        showTxErrorToast(error)
        return
      }

      lastTxCallback && lastTxCallback()
      setLastTxHash(undefined)
      setLastTxCallback(undefined)
    },
    enabled: !!lastTxHash && typeof lastTxHash === 'string',
  })

  const handleOpenModal =
    (element: ModalElement, payload: ModalContextValue['payload'] = {}) =>
    () => {
      setElement(element)
      setPayload(payload)
      onOpen()
    }

  const handleCloseModal = (hash?: Address, callback?: Function) => {
    setElement(INITIAL_STATE.element)
    setPayload(INITIAL_STATE.payload)
    onClose()

    if (typeof hash !== 'string') {
      return callback?.()
    }

    setLastTxHash(hash)
    setLastTxCallback(() => callback)
  }

  const values = { element, isOpen, payload, handleOpenModal, handleCloseModal }

  return <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
}

export const useModalContext = () => {
  return useContext(ModalContext)
}

export { ModalContext, ModalProvider }
