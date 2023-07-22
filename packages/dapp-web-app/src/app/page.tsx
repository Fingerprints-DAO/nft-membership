'use client'

import { PageState } from 'types/page'
import Home from './page-content'

const HomePage = () => {
  return <Home pageState={PageState.Soon} />
}

export default HomePage
