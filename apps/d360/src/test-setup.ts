// setup-jest.ts
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs';

setupZoneTestEnv();

import { TranslocoModule } from '@jsverse/transloco';

// eslint-disable-next-line no-restricted-imports
import { setupGridLicense } from './app/shared/ag-grid/grid-setup-license';

const mock = () => {
  let storage: any = {};

  return {
    getItem: (key: string) => (key in storage ? storage[key] : undefined),
    setItem: (key: string, value: any) => (storage[key] = value || ''),
    removeItem: (key: string) => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', {
  value: mock(),
});

Object.defineProperty(window, 'sessionStorage', {
  value: mock(),
});

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: (key: string) => key,
  getBrowserCultureLang: jest.fn(),
}));

setupGridLicense();
