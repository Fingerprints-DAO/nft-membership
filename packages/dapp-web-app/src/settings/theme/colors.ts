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
    100: '#ffeef2',
    500: '#F76B8B',
    900: '#F76B8B',
  },
  links: {
    500: '#6ECCDD',
  },
  black: {
    50: '#171923',
    100: '#171923',
    200: '#171923',
    300: '#171923',
    400: '#171923',
    500: '#171923',
    600: '#171923',
    700: '#171923',
    800: '#171923',
    900: '#171923',
  },
  white: {
    50: '#F7FAFC',
    100: '#F7FAFC',
    200: '#F7FAFC',
    300: '#F7FAFC',
    400: '#F7FAFC',
    500: '#F7FAFC',
    600: '#F7FAFC',
    700: '#F7FAFC',
    800: '#F7FAFC',
    900: '#F7FAFC',
  },
}

export default colors
