// theme.js
// Shared design tokens for Food Studio. Mirrors the web prototype's palette
// so the feature feels consistent if you keep both a web and native client.
//
// Fonts: install with `expo install expo-font @expo-google-fonts/fredoka @expo-google-fonts/nunito`
// or link Fredoka + Nunito manually if you're on bare React Native.

export const colors = {
  bg: "#FBF7F5",
  card: "#FFFFFF",
  ink: "#3F3350",
  inkSoft: "#7A6E88",
  sage: "#8FA98F",
  sageDeep: "#5F7A5F",
  apricot: "#E8935F",
  blush: "#F6D3CE",
  butter: "#F7DE8F",
  lavender: "#E7DEF2",
  line: "#EFE6E9",
  white: "#FFFFFF",
};

export const fonts = {
  display: "Afacad",
  displayBold: "Afacad",
  body: "Afacad",
  bodyRegular: "Afacad",
  bodyBold: "Afacad",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
};

export default { colors, fonts, spacing, radii };
