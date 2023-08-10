import { Theme } from '@chakra-ui/react'

const styles: Theme['styles'] = {
  global: ({ theme }) => ({
    body: {
      // background: 'linear-gradient(90deg, #171923 0%, #2d3748 100%)',
      background: 'black',
      color: theme.colors.white,
      fontWeight: 400,
    },
  }),
}

export default styles
