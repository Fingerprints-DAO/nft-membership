'use client'
import Footer from 'components/footer'
import Header from 'components/header'
import { PropsWithChildren } from 'react'

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(90deg, #171923 0%, #2d3748 100%) !important;
        }
      `}</style>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default RootLayout
