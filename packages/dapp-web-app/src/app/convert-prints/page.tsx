'use client'

import ModalConvertPrints from 'components/modal/modal-convert-prints'
import { useRouter } from 'next/navigation'

const ConvertPrintsPage = () => {
  const { back } = useRouter()

  return <ModalConvertPrints isOpen={true} onClose={back} />
}

export default ConvertPrintsPage
