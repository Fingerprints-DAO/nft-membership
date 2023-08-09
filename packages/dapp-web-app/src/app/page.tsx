import { Metadata } from 'next'
import { PageState } from 'types/page'
import SoonPage from './page-soon'
import ReleasePage from './page-release'

export const metadata: Metadata = {
  title: 'Coming Soon',
}

const state = PageState.Soon

const HomePage = () => {
  if (state === PageState.Soon) return <SoonPage bgImage="/images/voxelgif-opt.gif" />
  return <ReleasePage bgImage="/images/bg-hero-released.jpg" />
}

export default HomePage