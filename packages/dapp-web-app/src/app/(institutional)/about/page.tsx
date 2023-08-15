import { Metadata } from 'next'
import AboutContent from './content'

export const metadata: Metadata = {
  title: 'About',
}

const AboutPage = () => <AboutContent />

export default AboutPage
