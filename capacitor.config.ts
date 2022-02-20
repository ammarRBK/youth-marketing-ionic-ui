import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Youth-Marketing',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashScreenDelay: '0',
      launchShowDuration: '0',
      launchAutoHide: 'true',
    }
  }
};

export default config;
