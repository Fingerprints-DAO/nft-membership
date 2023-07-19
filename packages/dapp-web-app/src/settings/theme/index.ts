import { extendTheme, ThemeConfig } from '@chakra-ui/react'
import fonts from './fonts'
import styles from './styles'
import components from './components'
import colors from './colors'
import fontSizes from './font-sizes'

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
})

export default theme
