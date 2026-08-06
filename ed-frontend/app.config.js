// Extends app.json to inject the Android Google Maps API key from the
// environment (react-native-maps needs it on Android; iOS uses Apple Maps).
// Set GOOGLE_MAPS_ANDROID_API_KEY in .env. Without it, the Android map is
// blank but the app still runs.
export default ({ config }) => {
  const googleMapsAndroidKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

  return {
    ...config,
    android: {
      ...config.android,
      ...(googleMapsAndroidKey
        ? { config: { googleMaps: { apiKey: googleMapsAndroidKey } } }
        : {}),
    },
  };
};
