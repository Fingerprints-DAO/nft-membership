import { theme } from '@chakra-ui/react'

const colors = {
  ...theme.colors,
  gray: {
    ...theme.colors.gray,
    '50': '#F7FAFC',
    '100': '#EDF2F7',
    '300': '#CBD5E0',
    '400': '#A0AEC0',
    '500': '#718096',
    '700': '#2D3748',
    '900': '#171923',
  },
  secondary: {
    500: '#F76B8B',
  },
  links: {
    500: '#6ECCDD',
  },
}

export default colors
