import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import fonts from './fonts'
import styles from './styles'
import components from './components'
import colors from './colors'
import fontSizes from './font-sizes'
import breakpoints from './breakpoints'

const config: ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

const theme = extendTheme({
  config,
  colors,
  styles,
  fonts,
  components,
  fontSizes,
  breakpoints,
})

export default theme
