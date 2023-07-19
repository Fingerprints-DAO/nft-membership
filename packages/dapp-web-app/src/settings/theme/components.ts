import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const containerTheme = defineStyleConfig({
  baseStyle: {
    maxWidth: {
      base: '90%',
      sm: '90%',
      xl: '1160px',
      '2xl': '1280px',
    },
  },
})

const hugeVariants = ['white', 'solid']

const components = {
  Container: containerTheme,
  Button: defineStyleConfig({
    sizes: {
      lg: defineStyle((props) => ({
        fontWeight: 'bold',
        height: hugeVariants.includes(props.variant) ? 16 : 12,
      })),
    },
    variants: {
      solid: defineStyle(({ colorScheme }) => ({
        bg: `${colorScheme}.900`,
        background: `${colorScheme}.900`,
        _hover: {
          background: `${colorScheme}.900`,
        },
      })),
      outline: defineStyle(({ colorScheme }) => ({
        borderColor: `${colorScheme}.900`,
        borderWidth: 2,
        _hover: {
          background: 'transparent',
        },
      })),
      white: {
        background: 'white',
        color: 'gray.900',
      },
    },
    baseStyle: {
      lineHeight: 1,
      _hover: {
        opacity: 0.8,
      },
    },
  }),
  Input: {
    sizes: {
      lg: {
        field: {
          borderRadius: '8px',
        },
      },
    },
    variants: {
      outline: defineStyle(({ colorScheme = 'gray' }) => ({
        field: {
          background: `${colorScheme}.50`,
          borderColor: `${colorScheme}.100`,
          color: `${colorScheme}.900`,
          borderWidth: 2,
        },
      })),
    },
  },
}

export default components
