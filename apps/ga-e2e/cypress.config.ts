import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: nxE2EPreset(__dirname),
  hosts: {
    localhost: '127.0.0.1',
  },
  blockHosts: ['geolocation.onetrust.com'],
});
