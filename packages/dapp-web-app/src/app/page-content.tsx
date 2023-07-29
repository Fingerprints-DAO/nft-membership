'use client'

import { PropsWithChildren } from 'react'
import { usePathname } from 'next/navigation'
import HomePage from './page'
import { PageState } from 'types/page'

const outletRoutes = ['/convert-prints']

const AppContent = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()

  if (pathname === '/') {
    return <HomePage pageState={PageState.Released} />
  }

  if (outletRoutes.includes(pathname)) {
    return (
      <>
        <HomePage pageState={PageState.Released} />
        {children}
      </>
    )
  }

  return children
}

export default AppContent
