import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnify.rep',
  appName: 'Learnify Rep',
  webDir: 'public', // Point to public as dummy, server url is used
  server: {
    url: 'https://learnify-rep1.vercel.app',
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  // Ensure the AndroidManifest.xml is updated to handle this scheme. 
  // Since we don't control the manifest directly here, we rely on Capacitor's default handling or user manual update.
  // But for 'com.learnify.rep://' to work, likely no extra config in capacitor.config.ts is needed if using standard deep links, 
  // just the manifest. However, let's explicitely check config.
};

export default config;
