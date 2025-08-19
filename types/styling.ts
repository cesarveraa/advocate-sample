export interface ColorScheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textPrimary: string
  textSecondary: string
  borderColor: string
  cardBackground: string
  footerBackground: string
  footerText: string
}

export interface FontSizes {
  small: string
  base: string
  large: string
  xl: string
  "2xl": string
  "3xl": string
  "4xl": string
}

export interface Styling {
  light: ColorScheme
  dark: ColorScheme
  fontFamily: string
  fontSize: FontSizes
}
