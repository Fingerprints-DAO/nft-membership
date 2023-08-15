import { Metadata } from 'next'
import FaqContent from './content'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
}

const FaqPage = () => <FaqContent />

export default FaqPage
