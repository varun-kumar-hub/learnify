import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnify.rep',
  appName: 'Learnify Rep',
  webDir: 'public',
  server: {
    url: 'https://learnify-rep1.vercel.app', // Your Vercel deployment URL
    cleartext: false,
    androidScheme: 'https'
  },
  // For local development, uncomment below and comment out production URL above:
  // server: {
  //   url: 'http://10.0.10.238:3000',
  //   cleartext: true,
  //   androidScheme: 'https'
  // },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;


