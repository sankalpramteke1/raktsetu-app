import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Palette } from '../src/constants/theme';
import { useAppUpdate } from '../src/hooks/useAppUpdate';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useAppUpdate();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) console.warn('Font loading error:', error);
  }, [error]);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;
  return <RootLayoutNav />;
}

const AppTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.primary,
    background: Palette.background,
    card: Palette.background,
    text: Palette.textPrimary,
    border: Palette.border,
  },
};

function RootLayoutNav() {
  return (
    <ThemeProvider value={AppTheme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: Palette.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="stock/[bloodGroup]" options={{ headerShown: false }} />
        <Stack.Screen name="donors/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="requests/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="camps/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="camps/create" options={{ headerShown: false }} />
        <Stack.Screen name="requisition" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="profile" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
    </ThemeProvider>
  );
}
