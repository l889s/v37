import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hskarabia.app',
  appName: 'HSK Arabia',
  webDir: 'out',
  server: {
    url: 'https://hsk-ar.com',
    cleartext: false
  }
};

export default config;
