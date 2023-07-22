import { useMediaQuery as useMediaQueryCK } from '@chakra-ui/react'

const useMediaQuery = (mediaQuery: string) => {
  const results = useMediaQueryCK(mediaQuery, {
    ssr: true,
    fallback: false,
  })

  return results
}

export default useMediaQuery
