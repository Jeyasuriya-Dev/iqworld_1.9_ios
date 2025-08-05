import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'com.example.hello',
  webDir: 'www',
  "plugins": {
    "InAppBrowser": {
      "appId": "com.iqw.iqworld_mobile"
    },
    "Filesystem": {
      "android": {
        "permissions": [
          "WRITE_EXTERNAL_STORAGE",
          "READ_EXTERNAL_STORAGE"
        ]
      }
    }
  }
};

export default config;
