import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { Palette } from '../src/constants/theme';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useAppUpdate } from '../src/hooks/useAppUpdate';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Palette.primary,
    background: Palette.background,
    card: Palette.white,
    text: Palette.textPrimary,
    border: Palette.borderLight,
  },
};

export default function RootLayout() {
  // Automatically check for new RaktSetu APK release on launch
  useAppUpdate();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.warn('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={AppTheme}>
        <StatusBar style="dark" />
        <NavigationGate />
      </ThemeProvider>
    </AuthProvider>
  );
}

function NavigationGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentScreen = segments[0] as string | undefined;
    const isLoginScreen = currentScreen === 'login';

    if (!isAuthenticated && !isLoginScreen) {
      router.replace('/login' as any);
    } else if (isAuthenticated && isLoginScreen) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Palette.background }}>
        <ActivityIndicator size="large" color={Palette.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="login" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="stock/[bloodGroup]" options={{ headerShown: false }} />
      <Stack.Screen name="donors/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="requests/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="camps/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="camps/create" options={{ headerShown: false }} />
      <Stack.Screen name="requisition" options={{ headerShown: false }} />
      <Stack.Screen
        name="notifications"
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
