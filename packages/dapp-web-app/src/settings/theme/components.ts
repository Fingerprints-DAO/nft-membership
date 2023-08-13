import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const customColor = (colorScheme: any) => {
  if (colorScheme === 'black') {
    return 'gray.50'
  }

  if (colorScheme === 'white') {
    return 'gray.900'
  }

  return `${colorScheme}.500`
}

const components = {
  Container: {
    baseStyle: {
      maxWidth: {
        base: '100%',
        sm: '100%',
        lg: '1440px',
      },
      paddingLeft: '32px',
      paddingRight: '32px',
    },
  },
  Button: defineStyleConfig({
    sizes: {
      lg: {
        fontWeight: 'bold',
        height: 12,
        fontSize: 16,
        px: 4,
      },
    },
    variants: {
      solid: defineStyle(({ colorScheme }) => ({
        bg: `${colorScheme}.900`,
        background: `${colorScheme}.900`,
        color: customColor(colorScheme),
        _hover: {
          background: `${colorScheme}.900`,
        },
        _active: {
          background: ``,
        },
      })),
      outline: defineStyle(({ colorScheme }) => ({
        borderColor: `${colorScheme}.500`,
        borderWidth: 2,
        color: `${colorScheme}.500`,
        // _hover: {
        //   background: `${colorScheme}.100`,
        //   color: 'black',
        // },
      })),
    },
    baseStyle: {
      lineHeight: 1,
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
          _placeholder: { color: 'gray.400' },
        },
      })),
    },
  },
}

export default components
