import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnify.app',
  appName: 'Learnify',
  webDir: 'public', // Point to public as dummy, server url is used
  server: {
    url: 'https://learnify-rep1.vercel.app',
    androidScheme: 'https'
  }
};

export default config;
