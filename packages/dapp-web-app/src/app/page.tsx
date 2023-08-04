import { Metadata } from 'next'
import { PageState } from 'types/page'
// import SoonPage from './page-soon'
import ReleasedPage from './page-released'

export const metadata: Metadata = {
  title: 'Home',
}

// const state = PageState.Soon

const HomePage = () => {
  // if (state === PageState.Soon)
  //   return <SoonPage bgImage="/images/bg-hero-soon.jpg" />

  return <ReleasedPage />
}

export default HomePage
