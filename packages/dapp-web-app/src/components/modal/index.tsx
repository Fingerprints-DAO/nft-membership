'use client'

import React, { useMemo } from 'react'
import ModalConvertPrints from './modal-convert-prints'
import { ModalContextValue, ModalElement, useModalContext } from 'contexts/modal'

const Modal = () => {
  const { element, payload, isOpen, handleCloseModal } = useModalContext()

  const Component = useMemo(() => {
    const map = new Map<ModalContextValue['element'], any>([[ModalElement.ConvertPrints, ModalConvertPrints]])

    return map.get(element)
  }, [element])

  if (!Component) {
    return null
  }

  return <Component payload={payload} isOpen={isOpen} onClose={handleCloseModal} />
}

export default Modal
