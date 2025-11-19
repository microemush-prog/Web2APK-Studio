
export interface AppConfig {
  sourceType: 'url' | 'zip';
  url: string;
  zipFile: File | null;
  appName: string;
  icon: string | null;
  themeColor: string;
  splashScreen: string | null;
  packageId: string;
  wrapperEngine: 'twa' | 'webview';
  offlineCaching: boolean;
  pushNotifications: boolean;
  deepLinking: boolean;
  cameraAccess: boolean;
  geolocationAccess: boolean;
  fileAccess: boolean;
  customJs: string;
  admob: boolean;
  analytics: boolean;
  biometricAuth: boolean;
  pullToRefresh: boolean;
  navBar: boolean;
  appDrawer: boolean;
  keystore: 'create' | 'upload';
  buildFormat: 'apk' | 'aab';
}