import 'jest-preset-angular/setup-jest';

// eslint-disable-next-line no-restricted-imports
import { defineGlobalsInjections } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

defineGlobalsInjections({
  imports: [provideTranslocoTestingModule({ en: {} })],
});
