import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';

// Backend API URL:
// For local development on Android emulator: 'http://10.0.2.2:4000/api/public/app-version'
// For physical device on the same local Wi-Fi: replace with your machine's LAN IP, e.g., 'http://192.168.1.X:4000/api/public/app-version'
// For production / deployed server: 'https://your-backend-domain.com/api/public/app-version'
export const APP_VERSION_API_URL = 'http://10.0.2.2:4000/api/public/app-version';

export interface AppVersionInfo {
  appName: string;
  version: string;
  releaseDate?: string;
  fileSize?: string;
  downloadUrl: string;
  releaseNotes?: string;
  githubRepo?: string;
}

/**
 * Compares two semantic version strings (e.g. "1.0.1" vs "1.0.0" or "v1.0.1")
 * Returns true if serverVer is strictly newer than currentVer.
 */
export function isNewerVersion(serverVer: string, currentVer: string): boolean {
  if (!serverVer || !currentVer) return false;
  const s = serverVer.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const c = currentVer.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);

  const len = Math.max(s.length, c.length);
  for (let i = 0; i < len; i++) {
    const sPart = s[i] ?? 0;
    const cPart = c[i] ?? 0;
    if (sPart > cPart) return true;
    if (sPart < cPart) return false;
  }
  return false;
}

/**
 * Checks for a newer APK version from the backend and prompts the user.
 */
export async function checkForAppUpdate(): Promise<void> {
  // Only check on Android devices
  if (Platform.OS !== 'android') return;

  try {
    const response = await fetch(APP_VERSION_API_URL, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) return;

    const data: AppVersionInfo = await response.json();
    const currentVersion = Constants.expoConfig?.version || '1.0.0';
    const serverVersion = data.version;

    if (serverVersion && isNewerVersion(serverVersion, currentVersion)) {
      Alert.alert(
        `🚀 Naya Update Uplabdh Hai (${data.version})`,
        data.releaseNotes
          ? `${data.releaseNotes}\n\nSize: ${data.fileSize || 'N/A'}\n\nKripya latest version install karein.`
          : 'App me naye features aur performance improvements add kiye gaye hain.',
        [
          {
            text: 'Baad me',
            style: 'cancel',
          },
          {
            text: 'Update Now (APK)',
            onPress: async () => {
              if (data.downloadUrl) {
                const canOpen = await Linking.canOpenURL(data.downloadUrl);
                if (canOpen) {
                  await Linking.openURL(data.downloadUrl);
                } else {
                  Alert.alert('Download Error', 'Download link open nahi ho paya.');
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  } catch (error) {
    // Fail silently in development if offline
    console.log('[UpdateService] Check error:', error);
  }
}
