import { PageState } from 'types/page'
import { Metadata } from 'next'
import Home from './page-content'

export const metadata: Metadata = {
  title: 'Coming soon',
}

const HomePage = () => {
  return <Home bgImage="/images/bg-hero-soon.jpg" pageState={PageState.Soon} />
  // return (
  //   <Home
  //     bgImage="/images/bg-hero-released.jpg"
  //     pageState={PageState.Released}
  //   />
  // )
}

export default HomePage
