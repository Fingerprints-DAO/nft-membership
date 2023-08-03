'use client'

import { PageState } from 'types/page'
import Home from './page-content'

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
