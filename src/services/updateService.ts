import { Alert, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';

const GITHUB_REPO = 'sankalpramteke1/raktsetu-app';
const GITHUB_RELEASES_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const BACKEND_VERSION_API = 'http://10.0.2.2:4000/api/public/app-version';

export interface AppVersionInfo {
  appName: string;
  version: string;
  releaseDate?: string;
  fileSize?: string;
  downloadUrl: string;
  releaseNotes?: string;
}

/**
 * Compares two semantic version strings (e.g. "v1.0.1" vs "v1.0.0" or "1.1.0" vs "1.0.0")
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
 * Fetches latest release info from GitHub API (or fallback to backend)
 */
export async function fetchLatestAppVersion(): Promise<AppVersionInfo | null> {
  // 1. Try GitHub Releases API first (available globally 24/7 on any internet network)
  try {
    const ghRes = await fetch(GITHUB_RELEASES_API, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'RaktSetu-Mobile-App',
      },
    });

    if (ghRes.ok) {
      const data = await ghRes.json();
      const apkAsset = data.assets?.find((a: any) => a.name?.endsWith('.apk')) || data.assets?.[0];

      if (data.tag_name && apkAsset?.browser_download_url) {
        return {
          appName: 'RaktSetu Mobile',
          version: data.tag_name,
          releaseDate: data.published_at ? data.published_at.split('T')[0] : '',
          fileSize: apkAsset.size ? `${(apkAsset.size / (1024 * 1024)).toFixed(1)} MB` : '~18 MB',
          downloadUrl: apkAsset.browser_download_url,
          releaseNotes: data.body || 'Performance improvements and bug fixes.',
        };
      }
    }
  } catch (err) {
    // If GitHub API fails, proceed to backend fallback
  }

  // 2. Fallback to Local/Production Backend API
  try {
    const backendRes = await fetch(BACKEND_VERSION_API, {
      headers: { Accept: 'application/json' },
    });
    if (backendRes.ok) {
      const data: AppVersionInfo = await backendRes.json();
      if (data.version && data.downloadUrl) {
        return data;
      }
    }
  } catch (err) {
    // Both endpoints unreachable (offline)
  }

  return null;
}

/**
 * Checks for updates on app startup or manually from settings.
 * @param isManualCheck If true, shows a confirmation dialog even when app is already up to date.
 */
export async function checkForAppUpdate(isManualCheck = false): Promise<void> {
  const currentVersion = Constants.expoConfig?.version || '1.0.0';

  try {
    const latestInfo = await fetchLatestAppVersion();

    if (!latestInfo) {
      if (isManualCheck) {
        Alert.alert('Status', `RaktSetu v${currentVersion} active. Network server unreachable right now.`);
      }
      return;
    }

    const hasNewerVersion = isNewerVersion(latestInfo.version, currentVersion);

    if (hasNewerVersion) {
      Alert.alert(
        `Naya Update Uplabdh Hai (${latestInfo.version})`,
        `${latestInfo.releaseNotes || 'Naye features aur improvements add kiye gaye hain.'}\n\nSize: ${latestInfo.fileSize || '~18 MB'}\nVersion: ${latestInfo.version}\n\nKya aap naya update install karna chahte hain?`,
        [
          {
            text: 'Baad me',
            style: 'cancel',
          },
          {
            text: 'Update Now (APK)',
            onPress: async () => {
              if (latestInfo.downloadUrl) {
                try {
                  const canOpen = await Linking.canOpenURL(latestInfo.downloadUrl);
                  if (canOpen) {
                    await Linking.openURL(latestInfo.downloadUrl);
                  } else {
                    Alert.alert('Download Error', 'Download link open nahi ho paya.');
                  }
                } catch {
                  Alert.alert('Download Error', 'Link open karne me samasya aayi.');
                }
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else if (isManualCheck) {
      Alert.alert(
        'Up to Date! 🎉',
        `Aap pehle se hi latest version (v${currentVersion}) use kar rahe hain.`
      );
    }
  } catch (error) {
    if (isManualCheck) {
      Alert.alert('Update Check Failed', 'Network connection check karein.');
    }
  }
}
