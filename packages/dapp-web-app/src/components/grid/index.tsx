import { PropsWithChildren } from 'react'
import { Grid as CKGrid, GridProps } from '@chakra-ui/react'

const gridConfig = {
  gridTemplateColumns: {
    base: 'repeat(4, 1fr)',
    sm: 'repeat(6, 1fr)',
    md: 'repeat(12, 1fr)',
  },
  gap: {
    base: 4,
    md: 8,
    lg: 8,
  },
  px: { base: 8, lg: 0 },
  mx: { md: 'auto' },
  w: {
    base: '100%',
    md: '100%',
    lg: '1128px',
    xl: '1128px',
    xxl: '1500px',
  },
}

const Grid = ({ children, ...props }: PropsWithChildren<GridProps>) => {
  return (
    <CKGrid {...gridConfig} {...props}>
      {children}
    </CKGrid>
  )
}

export default Grid
